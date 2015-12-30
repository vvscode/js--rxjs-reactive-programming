var delayedRange = Rx.Observable.range(0, 6).delay(1000);
var subject = new Rx.AsyncSubject();
delayedRange.subscribe(subject);
subject.subscribe(
  function onNext(item) {
    console.log('Value:', item);
  },
  function onError(err) {
    console.log('Error:', err);
  },
  function onCompleted() {
    console.log('Completed.');
  }
);