var Cycle = require('@cycle/core');
var CycleDOM = require('@cycle/dom');
//var Rx = Cycle.Rx; // import it manually from external file
var h = CycleDOM.h;
var a;

function searchBox(responses) {
  var props$ = responses.props$;
  var apiUrl$ = props$.map(function(props) {
    return props['apiUrl'];
  }).first();

  var vtree$ = Rx.Observable.just(
    h('div', { className: 'search-field' }, [
      h('input', { type: 'text' })
    ]));

  var searchQuery$ = apiUrl$.flatMap(function(apiUrl) {
    return responses.DOM.select('.search-field').events('input')
      .debounce(300)
      .map(function(e) {
        return e.target.value;
      })
      .filter(function(value) {
        return value.length > 3;
      })
      .map(function(searchTerm) {
        return apiUrl + searchTerm;
      });
  });

  return {
    DOMTree: vtree$,
    JSONPQuery: searchQuery$
  };
}

module.exports = searchBox; // Export it as a module
