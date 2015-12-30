console.groupCollapsed('Error handling:');

function getJSON(arr) {
  return Rx.Observable.from(arr).map(function(str) {
    var parsedJSON = JSON.parse(str);
    return parsedJSON;
  });
}

// Example 1
getJSON([
  '{"1": 1, "2": 2}',
  '{"success: true}', // Invalid JSON string
  '{"enabled": true}'
]).subscribe(
  function(json) {
    console.log('Parsed JSON: ', json);
  },
  function(err) {
    console.log(err.message);
  }
);

var caught = getJSON(['{"1": 1, "2": 2}', '{"1: 1}']).catch(
  Rx.Observable.return({
    error: 'There was an error parsing JSON'
  })
);

caught.subscribe(
  function(json) {
    console.log('Parsed JSON: ', json);
  },
// Because we catch errors now, `onError` will not be executed
  function(e) {
    console.log('ERROR', e.message);
  }
);

// This will try to retrieve the remote URL up to 5 times.
Rx.DOM.get('/products').retry(5)
  .subscribe(
    function(xhr) { console.log(xhr); },
    function(err) { console.debug('ERROR: ', err); }
  );

console.groupEnd();