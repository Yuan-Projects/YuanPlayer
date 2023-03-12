export default class Emitter {
  eventHandlers = {};
  eventListeners: Array<any> = [];
  on(event: string, callback: Function) {
    const Events = this.eventHandlers;
    if (!Events[event]) {
      Events[event] = [];
    }
    Events[event].push(callback);
  }
  off(event: string, callback: Function) {
    const Events = this.eventHandlers;
    if (!Events[event]) return ;
    if (callback) {
      const index = Events[event].indexOf(callback);
      if (index !== -1) {
        Events[event].splice(index, 1);
      }
    } else {
      Events[event] = [];
    }
  }
  trigger(event: string, ...args) {
    const Events = this.eventHandlers;
    if (!Events[event]) return ;
    const callbackArray = Events[event];
    for (let i = 0; i <= callbackArray.length - 1; i++) {
      callbackArray[i].apply(callbackArray[i], args);
    }
  }
  /**
   * Attach listeners to a specific target.
   * @param target - The event target, common targets are Element, or its children, Document, and Window
   * @param type - A case-sensitive string representing the event type to listen for.
   * @param listener - The function that receives a notification when an event of the specified type occurs.
   */
  addEventListener(target, type, listener) {
    target.addEventListener(type, listener);
    this.eventListeners.push([target, type, listener]);
  }
  /**
   * Removes an event listener previously registered with this.addEventListener() from the target.
   * @param target - The event target, common targets are Element, or its children, Document, and Window
   * @param type - A case-sensitive string representing the event type to listen for.
   * @param listener - The function that receives a notification when an event of the specified type occurs.
   */
  removeEventListener(target: EventTarget, type: string, listener: EventListenerOrEventListenerObject) {
    target.removeEventListener(type, listener);
    for (let i = 0; i < this.eventListeners.length; i++) {
      const [target1, type1, listener1] = this.eventListeners[i];
      if (target1 === target && type1 === type && listener1 === listener) {
        this.eventListeners.splice(i, 1);
        break;
      }
    }
  }
  /**
   * Remove all event listeners attached on DOM nodes.
   */
  removeAllEventListeners() {
    this.eventListeners.forEach(([target, type, listener]) => {
      target.removeEventListener(type, listener);
    });
    this.eventListeners.length = 0;
  }
}