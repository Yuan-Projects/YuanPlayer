export default class Emitter {
  eventHandlers = {};
  on(event: string, callback: Function) {
    var Events = this.eventHandlers;
    if (!Events[event]) {
      Events[event] = [];
    }
    Events[event].push(callback);
  }
  off(event: string, callback: Function) {
    var Events = this.eventHandlers;
    if (!Events[event]) return ;
    if (callback) {
      var index = Events[event].indexOf(callback);
      if (index !== -1) {
        Events[event].splice(index, 1);
      }
    } else {
      Events[event] = [];
    }
  }
  trigger(event: string) {
    var Events = this.eventHandlers;
    if (!Events[event]) return ;
    var args = Array.prototype.slice.call(arguments, 1);
    var callbackArray = Events[event];
    for (var i = callbackArray.length - 1; i >= 0; i--) {
      callbackArray[i].apply(callbackArray[i], args);
    };
  }
}