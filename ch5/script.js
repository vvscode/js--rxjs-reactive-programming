var arr = [];
for (var i = 0; i < 1000; i++) {
  arr.push(i);
}

//Because the Observer using the default Scheduler emits its items asynchronously, our console.log statement (which is synchronous) is executed before the
//Observable even starts emitting any notification.
//Using the currentThread
//Scheduler, all notifications happen synchronously, so the console.log statement
//gets executed only when the Observable has emitted all its notifications.
var timeStart = Date.now();
Rx.Observable.from(arr).subscribe(
  function onNext() {
  },
  function onError() {
  },
  function onCompleted() {
    console.log('[Rx.Scheduler.currentThread] Total time: ' + (Date.now() - timeStart) + 'ms');
  });

var timeStart = Date.now();
Rx.Observable.from(arr, null, null, Rx.Scheduler.default).subscribe(
  function onNext() {
  },
  function onError() {
  },
  function onCompleted() {
    console.log('[Rx.Scheduler.default] Total time: ' + (Date.now() - timeStart) + 'ms');
  });

console.info('[Immediate Scheduler]');
console.log('Before subscription');
Rx.Observable.range(1, 5)
  .do(function(a) {
    console.log('Processing value', a);
  })
  .map(function(value) { return value * value; })
  .subscribe(function(value) { console.log('Emitted', value); });
console.log('After subscription');

console.info('[Default Scheduler]');
console.log('Before subscription');
Rx.Observable.range(1, 5)
  .do(function(value) {
    console.log('Processing value', value);
  })
  .observeOn(Rx.Scheduler.default)
  .map(function(value) { return value * value; })
  .subscribe(function(value) { console.log('Emitted', value); });
console.log('After subscription');