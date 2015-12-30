var subject = new Rx.BehaviorSubject('Waiting for content');
subject.subscribe(
  function(result) {
    document.body.textContent = result.response || result;
  },
  function(err) {
    document.body.textContent = 'There was an error retrieving content';
  }
);

var subscription = Rx.DOM.get('http://api.ember-cli-101.com/api/friends')
  .delaySubscription(10000) // request well be done only after timeout
  .subscribe(subject);

// by the next code we can decline subscription and request
// no subscriptions - no need fetch data
setTimeout(function() {
  subscription.dispose();
}, 2000);