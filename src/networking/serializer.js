import Message from './message';

// Import the list of SynchronizedObjects:
import ParametricParticle from '../game_objects/parametric_particle';
import Player from '../game_objects/player';
import Bullet from '../game_objects/bullet';

// For a game object message (create, update, delete) the first byte is
// a reference to a SynchronizedObject class. This is what that byte means.
const classMap = {
  0x01: ParametricParticle,
  0x02: Player,
  0x03: Bullet
};

// Autogenerate the reverse map for fast access.
const classCodes = {};
Object.keys(classMap).forEach((key) => {
  classCodes[classMap[key].name] = key;
});

export default class Serializer {
  /**
  * Creates a message from a synchronizedObject.
  * @synchronizedObject {SynchronizedObject}
  *                     An instance of a subclass of SynchronizedObject.
  * @kind {Message.kindCodes} The kind of the message to create.
  * @return {Message} The message ready be sent.
  */
  static serialize(
    synchronizedObject, kind = Message.kindCodes.clientCreateObject
  ) {
    // Run the object serialization
    const message = synchronizedObject.serialize();

    // Set the kind and class code to the message
    message.kind = kind;
    message.writeByte(0, classCodes[synchronizedObject.constructor.name]);

    return message;
  }

  /**
  * Reads a game object message (creation or update) and returns a new instance
  * that represents the received game object.
  * @message {Message} The received message with an object.
  * @return {SynchronizedObject} The deserialized object.
  */
  static deserialize(message) {
    // eslint-disable-next-line
    if (message.kind & 0xF0 !== 0x40) {
      throw new Error('Trying to deserialize a non-game object message');
    }

    const classId = message.readByte(0);
    return classMap[classId].deserialize(message);
  }
}
