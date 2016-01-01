var Cycle = require('@cycle/core');
//var Rx = Cycle.Rx; // import it manually from external file
var CycleDOM = require('@cycle/dom');
var CycleJSONP = require('@cycle/jsonp');

var MAIN_URL = 'https://en.wikipedia.org';
var WIKI_URL = MAIN_URL + '/wiki/';
var API_URL = MAIN_URL + '/w/api.php?' +
  'action=query&list=search&format=json&srsearch=';

var h = CycleDOM.h;
var SearchBox = require('./searchbox'); //(1)

function main(responses) {
  var wpSearchBox = SearchBox({ //(2)
    DOM: responses.DOM,
    props$: Rx.Observable.just({
      apiUrl: API_URL
    })
  });

  var searchDOM$ = wpSearchBox.DOMTree; //(3)
  var searchResults$ = responses.JSONP
    .filter(function(res$) {
      return res$.request.indexOf(API_URL) === 0;
    })
    .concatAll()
    .pluck('query', 'search')
    .startWith([]);

  return {
    JSONP: wpSearchBox.JSONPQuery, //(4)
    DOM: Rx.Observable.combineLatest( //(5)
      searchDOM$, searchResults$, function(tree, links) {
        return h('div', [
          h('h1', 'Wikipedia Search '),
          tree,
          h('hr'),
          h('div', links.map(function(link) {
            return h('div', [
              h('a', { href: WIKI_URL + link.title }, link.title)
            ]);
          }))
        ]);
      })
  };
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver('#container'),
  JSONP: CycleJSONP.makeJSONPDriver()
});

