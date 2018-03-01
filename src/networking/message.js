// import Vector3 from '../game_objects/vector3';

/**
* The idea of this class is to abstract the message implementation from the
* logic that handles the messages. So no other class should be aware of the
* low level objects that are used. This means that there should be no references
* to Buffers (for messages in the node side) or to Uint8Array (for the messages
* in the browser side), they sould be handled using Message methods.
*/
class Message {
  /**
  * Creates a new message from data received from webrt.
  * @data {Buffer|Uint8Array} The data received from peer.on('data', ...).
  */
  constructor(data) {
    if (data.constructor === Buffer) {
      // We are on the server side, SimplePeer returns a Buffer
      this.arrayBuffer = data.buffer; // This is an ArrayBuffer!
      this.isServer = true;
    } else {
      // We are on the client side, data is  an Uint8Array
      this.arrayBuffer = data.buffer; // Magic, this is an ArrayBuffer too!
      this.isServer = false;
    }

    // Create some data views so we can do.. things (array buffers)
    this.dataView = new DataView(this.arrayBuffer);
    this.payload = new DataView(this.arrayBuffer, Message.payloadOffset);
  }

  /**
  * Returns the kind of the message.
  * @see Message.kindCodes for more information.
  * @return {number} The message king.
  */
  get kind() {
    return this.dataView.getUint8(0);
  }

  /**
  * Sets the kind of the message.
  * @value {number} A value from Message.kindCodes.
  */
  set kind(value) {
    this.dataView.setUint8(0, value);
  }

  /**
  * Returns the buffer used on the CLIENT SIDE to send a message to the server.
  * Do not call this method on the server side.
  */
  getClientBuffer() {
    return new Uint8Array(this.arrayBuffer);
  }

  /**
  * Returns the buffer used on the SERVER SIDE to send a message to the clients.
  * Do not call this method on the client side.
  */
  getServerBuffer() {
    return Buffer.from(this.arrayBuffer);
  }

  /**
  * Writes a vector3 into the payload. It requires 12 bytes.
  * @offset {number} Where in the PAYLOAD you want the vector to be written.
  * @vector {Vector3} The vector you want to serialize.
  */
  writeVector3(offset, vector) {
    this.payload.setFloat32(offset, vector.x);
    this.payload.setFloat32(offset + 4, vector.y);
    this.payload.setFloat32(offset + 8, vector.z);
  }


  /**
  * Reads a vector3 from the payload (12 bytes).
  * @offset {number} Where in the PAYLOAD you want to start reading.
  * @return {Vector3} The vector you want to deserialize.
  */
  readVector3(offset) {
    const vector = new Message.gameModules.Vector3();
    vector.x = this.payload.getFloat32(offset);
    vector.y = this.payload.getFloat32(offset + 4);
    vector.z = this.payload.getFloat32(offset + 8);
    return vector;
  }

  /**
  * Writes a number to the payload. It requires 8 bytes.
  * @offset {number} Where in the PAYLOAD you want the number to be written.
  * @number {number} The value you want to serialize.
  */
  writeNumber(offset, number) {
    this.payload.setFloat64(offset, number);
  }

  /**
  * Reads a number from the payload (8 bytes).
  * @offset {number} Where in the PAYLOAD you want to start reading.
  * @return {number} The value you want to deserialize.
  */
  readNumber(offset) {
    return this.payload.getFloat64(offset);
  }

  /**
  * Writes a single byte to the payload.
  * @offset {number} Where in the PAYLOAD you want the number to be written.
  * @byte {number} The value you want to write.
  */
  writeByte(offset, byte) {
    this.payload.setUint8(offset, byte);
  }

  /**
  * Reads a single byte from the payload.
  * @offset {number} Where in the PAYLOAD you want to read.
  * @return {number} The value you want to read.
  */
  readByte(offset) {
    return this.payload.getUint8(offset);
  }

  /**
  * Creates a new Message from a single Message.kindCode, it only works
  * for messages without payload.
  */
  static fromKindCode(code) {
    const size = 1;
    const data = new Uint8Array(size);
    const message = new Message(data);
    message.kind = code;

    return message;
  }

  /**
  * Avoid this method. Returns the name of a given kind code.
  * It's slow, but useful for debug.
  * @code {number} A kind code from Message.kindCodes.
  * @return {string} The name of the kind from Message.kindCodes.
  */
  static kindNameFromKindCode(code) {
    const kinds = Object.keys(Message.kindCodes);
    for (let i = 0; i < kinds.length; ++i) {
      if (Message.kindCodes[kinds[i]] === code) {
        return kinds[i];
      }
    }

    return `Unknown code (${code})`;
  }
}

// Message kinds
Message.kindCodes = {
  // 0x00 - 0x1F: [Network] Control messages, the game doesn't know
  clientHello: 0x01,
  serverHello: 0x02,
  // TODO: keepalive, ping, kick, disconnect

  // 0x20 - 0x3F: [Game] client-server synchronization
  clientJoinRequest: 0x20,
  serverJoinResponse: 0x21,
  clientGameTimeRequest: 0x22,
  serverGameTimeResponse: 0x23,

  // 0x40 - 0xFF: [GameObjects] game object synchronization
  clientCreateObject: 0x40,
  serverCreateObject: 0x41,
  clientUpdateObject: 0x42,
  serverUpdateObject: 0x43,
  clientDestroyObject: 0x44,
  serverDestroyObject: 0x45
};

// Number of bytes before the start of the payload.
Message.payloadOffset = 1;

module.exports = Message;
