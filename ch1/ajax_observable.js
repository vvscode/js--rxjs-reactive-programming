console.group('Ajax observable:');

function get(url) {
  return Rx.Observable.create(function(observer) {
    // Make a traditional Ajax request
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        // If the status is 200, meaning there have been no problems,
        // Yield the result to listeners and complete the sequence
        observer.onNext(req.response);
        observer.onCompleted();
      }
      else {
        // Otherwise, signal to listeners that there has been an error
        observer.onError(new Error(req.statusText));
      }
    };
    req.onerror = function() {
      observer.onError(new Error("Unknown Error"));
    };
    req.send();
  });
}
// Create an Ajax Observable
//var test = get('/api/contents.json');  // with error
var test = get('http://api.ember-cli-101.com/api/friends'); // complete

// Subscribe an Observer to it
test.subscribe(
  function onNext(x) { console.log('Result: ' + x); },
  function onError(err) { console.log('Error: ' + err); },
  function onCompleted() { console.log('Completed'); }
);

console.groupEnd();