/* eslint-env browser */

const SDPSignalingPath = '/rtc/sdp/';
const ICESignalingPath = '/rtc/ice/'

export default class ClientConnection {
  constructor() {
    this.connected = false;
    this.readyState = 'closed';
  }

  /**
  * Creates a connection and a data channel to the server.
  * Binds all required event handlers to the connection and channel.
  */
  connect() {
    console.log('Creating connection...');
    // Create a connection
    this.connection = new RTCPeerConnection({
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
      }]
    });
    this.connection.onicecandidate = e => this.onIceCandidate(e);
    this.connection.ondatachannel = e => this.onNewChannel(e);

    // Create data channel
    this.channel = this.connection.createDataChannel(
      'sendDataChannel',
      {
        ordered: false,
        maxRetransmits: 0
      }
    );
    this.channel.binaryType = 'arraybuffer';

    // Handle state changes
    this.channel.onopen = e => this.onChannelStateChange(e);
    this.channel.onclose = e => this.onChannelStateChange(e);

    // Initiate SDP offer
    console.log('Starting SDP offer...');
    this.connection.createOffer().then(
      description => this.onSessionDescription(description),
      error => this.onCreateSessionDescriptionError(error)
    );
  }

  /**
  * Sends data to the server.
  */
  sendData(data) {
    if (this.connected) {
      this.channel.send(data);
    }
  }

  /**
  * Closes the connection to the server.
  */
  disconnect() {
    console.log('Closing data channel...');
    if (this.channel) { this.channel.close(); }
    this.channel = null;
    console.log('Data channel closed');

    console.log('Closing connection...');
    if (this.connection) { this.connection.close(); }
    this.connection = null;
    console.log('Connection closed');
  }

  /**
  * Sends a signal to the server with an SDP or ICE message.
  * @signalPath {SDPSignalingPath | ICESignalingPath}
  * @data {RTCSessionDescription | RTCIceCandidate}
  * @return A promise fulfilled with the server answer.
  */
  sendSignal(signalPath, data) {
    return new Promise((resolve, reject) => {
      fetch(
        signalPath,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }
      ).then((answer) => {
        if (answer.ok) {
          resolve(answer.json());
        } else {
          // Server level error (404, 500, etc)
          console.log(`Error sending ${signalPath}`);
          this.disconnect();
          reject(answer);
        }
      }).catch((error) => {
        // Network level error (connection closed, reset, timeout)
        console.log(`Error sending ${signalPath}`);
        this.disconnect();
        reject(error);
      });
    });
  }

  /**
  * Sets the generated SDP as a local description for the connection.
  * Sends the SDP to the server and starts the ICE negotiation.
  * @description {RTCSessionDescription}
  */
  onSessionDescription(description) {
    // console.log(`Offer from connection \n${desc.sdp}`);
    console.log('Got session description');

    // Set local description with the SDP generated by createOffer
    // This will start the ICE negotiation
    console.log('Starting ICE negotiation...');
    this.connection.setLocalDescription(description).then(
      () => {
        // Send SDP Offer to server
        this.sendSignal(
          SDPSignalingPath,
          description
        ).then((answer) => {
          // Use SDP Answer from server
          this.connection.setRemoteDescription(answer.json().description);
        });
      }
    );
  }

  /**
  * Handles an error in the creation of a SDP Offer.
  * @error {DOMException}
  */
  onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
    this.connected = false;
    this.readyState = 'failed';
  }

  /**
  * Handles the response made from the STUN server.
  * @event {RTCPeerConnectionIceEvent}
  */
  onIceCandidate(event) {
    console.log(`ICE candidate: ${event.candidate ?
      event.candidate.candidate : '(null)'}`);
    // Send ICE Candidate to the server
    this.sendSignal(ICESignalingPath, event.candidate);
  }

  /**
  * Handles the creation of a channel in the connection.
  * @event {RTCDataChannelEvent}
  */
  onNewChannel(event) {
    console.log('Receive Channel Callback');
    this.receiveChannel = event.channel;
    this.receiveChannel.binaryType = 'arraybuffer';
    this.receiveChannel.onmessage = e => this.onNewMessage(e);
    // this.receivedSize = 0;
  }

  /**
  * Handles the reception of a message.
  * @event {MessageEvent}
  */
  onNewMessage(event) {
    // this.receivedSize += event.data.length;
    // TODO: Do something
    this.something(event.data);
  }

  /**
  * Handles a change in the state of the channel.
  */
  onChannelStateChange() {
    if (this.channel) {
      this.readyState = this.channel.readyState;
      this.connected = (this.readyState === 'open');
      console.log(`Data channel state is: ${this.readyState}`);
    } else {
      this.readyState = 'closed';
      this.connected = false;
    }
  }
}
