export default class EventEmitter {
  constructor() {
    this._events = {};
  }

  /**
  * Adds a listener to an event.
  * @eventName {string} The name of the event.
  * @listener {Function} The callback function.
  */
  addListener(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }

    this._events[eventName].push(listener);
  }

  /**
  * Removes a listener from an event.
  * @eventName {string} The name of the event.
  * @listener {Function} The listener to be removed.
  */
  removeListener(eventName, listener) {
    const index = this._events[eventName].indexOf(listener);

    if (index !== -1) {
      this._events[eventName].splice(index, 1);
    }
  }

  /**
  * Calls each of the listeners registered for the event.
  * Returns true if the event had listeners, false otherwise.
  * @eventName {string} Name of the event.
  * @args {Any} Arguments that are going to be passed to each listener.
  */
  emit(eventName, ...args) {
    if (!this._events[eventName] || this._events[eventName].length === 0) {
      return false;
    }

    this._events[eventName].forEach(listener => listener.apply(this, args));
    return true;
  }
}
