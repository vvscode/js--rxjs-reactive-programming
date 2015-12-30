console.group('Observable from arrays:');

Rx.Observable
  .from(['Adrià', 'Jen', 'Sergi'])
  .subscribe(
    function onNext(x) {
      console.log('Next: ' + x);
    },
    function onError(err) {
      console.error('Error: ' + err);
    },
    function onCompleted() {
      console.log('Completed');
    }
  );
// -- vs --
var names = Rx.Observable.from(['Adrià', 'Jen', 'Sergi']);

names.subscribe(function(x) {
  console.log('Next: ' + x);
});


console.groupEnd();