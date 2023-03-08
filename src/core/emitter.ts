export default class Emitter {
  eventHandlers = {};
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
    for (let i = callbackArray.length - 1; i >= 0; i--) {
      callbackArray[i].apply(callbackArray[i], args);
    };
  }
}