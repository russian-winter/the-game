import GameObject from './game_object';
import Message from '../networking/message';

export default class SynchronizedObject extends GameObject {
  constructor(...args) {
    super(...args);

    // Size of the payload, 1 byte less than the message buffer.
    this.payloadSize = 16;

    // Buffer used to create the message. 1 byte larger than the payload size.
    this.buffer = null; // Lazy initialization
  }

  /**
  * Returns a message to be sent over the network. The message kind
  * @return {Message} A message with its payload filled with data.
  */
  serialize() {
    if (!this.buffer) {
      this.buffer = new Uint8Array(this.payloadSize + 1);
    }

    const message = new Message(this.buffer); // TODO: Use Message.fromKindCode
    message.kind = Message.kindCodes.clientUpdateObject;
    message.payload.setUint8(0, 0); // Class identifier
    message.writeNumber(1, this.ownerId);
    message.writeNumber(9, this.id);
  }

  /**
  * Updates this object with the values from a network message.
  * @return {Message} A network message.
  */
  deserialize(message) {
    this.ownerId = message.readNumber(1);
    this.id = message.readNumber(9)
  }
}
