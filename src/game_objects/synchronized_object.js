import GameObject from './game_object';
import Message from '../networking/message';

// Number of bytes in the message payload before the serialization.
// The additional byte is for the classCode.
const objectOffset = 1;

export default class SynchronizedObject extends GameObject {
  constructor(...args) {
    super(...args);

    // Buffer used to create the message. 2 byte larger than the payload size.
    this.buffer = null; // Lazy initialization
  }

  /**
  * [It should only be called from Serializer.serialize(...)].
  * Returns a message to be sent over the network.
  * @return {Message} A message with its payload filled with data.
  */
  serialize() {
    if (!this.buffer) {
      this.buffer = new Uint8Array(
        Message.payloadOffset + // for message kind
        objectOffset + // for class code
        this.constructor.serializationSize // for data
      );
    }

    const message = new Message(this.buffer);
    message.kind = Message.kindCodes.clientUpdateObject;
    message.setUint8(0, 0x00); // Class code, set later
    // serialization:
    message.writeNumber(objectOffset + 0, this.ownerId); // 8 bytes: 0-7
    message.writeNumber(objectOffset + 8, this.id); // 8 bytes: 8-15

    return message;
  }

  /**
  * Updates this object with the values from a network message.
  * @message {Message} the network message.
  */
  deserialize(message) {
    this.ownerId = message.readNumber(objectOffset + 0); // 8 bytes: 0-7
    this.id = message.readNumber(objectOffset + 8); // 8 bytes: 8-15
  }

  /**
  * Creates a new object with the data from a network message.
  * @message {Message} A network message.
  * @return {SynchronizedObject} An instance of a SynchronizedObject.
  */
  static deserialize(message) {
    const instance = new this();
    instance.deserialize(message);
    return instance;
  }
}

// Number of bytes required to serialize an instance of this class.
SynchronizedObject.serializationSize = 16;
