//console.groupCollapsed('Cancellation:');
//
//var counter = Rx.Observable.interval(1000);
//var subscription1 = counter.subscribe(function(i) {
//  console.log('Subscription 1:', i);
//});
//var subscription2 = counter.subscribe(function(i) {
//  console.log('Subscription 2:', i);
//});
//setTimeout(function() {
//  console.log('Canceling subscription2!');
//  subscription2.dispose();
//}, 2000);
//
//// also
//var p = new Promise(function(resolve, reject) {
//  window.setTimeout(resolve, 5000);
//});
//p.then(function() {
//  console.log('Promise resolved.');
//// Some unexpected side effect could happen here
//});
//var subscription = Rx.Observable.fromPromise(p).subscribe(function(msg) {
//  console.log('Observable resolved!');
//});
//subscription.dispose();
//
//console.groupEnd();