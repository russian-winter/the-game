/**
* The idea of this class is to abstract the message implementation from the
* logic that handles the messages. So no other class should be aware of the
* low level objects that are used. This means that there should be no references
* to Buffers (for messages in the node side) or to UInt8Array (for the messages
* in the browser side), they sould be handled using Message methods.
*/
class Message {
  constructor(data) {
    this.data = data;
    console.log(data);

    if (data.constructor === Buffer) {
      this.isServer = true;
    } else {
      this.isServer = false;
    }
  }

  /**
  * Returns the kind of the message.
  * @see Message.kindCodes for more information.
  * @return {number} The message king.
  */
  get kind() {
    return this.data[0];
  }

  /**
  * Sets the kind of the message.
  * @value {number} A value from Message.kindCodes.
  */
  set kind(value) {
    this.data[0] = value;
  }

  /**
  * Returns the payload of the message.
  * @return {object} A Buffer for server side calls. UInt8Array in broswers.
  */
  get payload() {
    if (this.isServer) {
      return Buffer.from(this.data, 1);
    }
    // eslint-disable-next-line
    return new UInt8Array(this.data, 1);
  }

  /**
  * Creates a new Message from a single Message.kindCode, it only works
  * for messages without payload.
  */
  static fromKindCode(code) {
    let data = null;
    const size = 1;

    if (Buffer) {
      data = Buffer.alloc(size);
    } else {
      // eslint-disable-next-line
      data = new UInt8Array(size);
    }

    data[0] = code;
    return new Message(data);
  }
}

// Message kinds
Message.kindCodes = {
  // 0x00 - 0x0F: reserved
  // 0x10 - 0x1F: client-server synchronization
  clientHello: 0x10,
  serverHello: 0x11,
  clientGameTimeRequest: 0x12,
  serverGameTimeResponse: 0x13,

  // 0x40 - 0xFF: game object synchronization
  clientCreateObject: 0x40,
  serverCreateObject: 0x41,
  clientUpdateObject: 0x42,
  serverUpdateObject: 0x43,
  clientDestroyObject: 0x44,
  serverDestroyObject: 0x45
};

module.exports = Message;
