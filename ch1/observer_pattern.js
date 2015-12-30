console.group('Observer pattern:');

function Producer() {
  this.listeners = [];
}
Producer.prototype.add = function(listener) {
  this.listeners.push(listener);
};
Producer.prototype.remove = function(listener) {
  var index = this.listeners.indexOf(listener);
  this.listeners.splice(index, 1);
};
Producer.prototype.notify = function(message) {
  this.listeners.forEach(function(listener) {
    listener.update(message);
  });
};

var listener1 = {
  update: function(message) {
    console.log('Listener 1 received:', message);
  }
};
var listener2 = {
  update: function(message) {
    console.log('Listener 2 received:', message);
  }
};
var notifier = new Producer();
notifier.add(listener1);
notifier.add(listener2);
notifier.notify('Hello there!');

console.groupEnd();