var QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp';
function loadJSONP(url) {
  var script = document.createElement('script');
  script.src = url;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}
var map = L.map('map').setView([33.858631, -118.279602], 7);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

//-- First iteration
//var quakes = Rx.Observable.create(function(observer) {
//  window.eqfeed_callback = function(response) {
//    var quakes = response.features;
//    quakes.forEach(function(quake) {
//      observer.onNext(quake);
//    });
//  };
//  loadJSONP(QUAKE_URL);
//});
//quakes.subscribe(function(quake) {
//  var coords = quake.geometry.coordinates;
//  var size = quake.properties.mag * 10000;
//  L.circle([coords[1], coords[0]], size).addTo(map);
//});

//-- Second iteration ( do not call .next manually
//var quakes = Rx.Observable.create(function(observer) {
//  window.eqfeed_callback = function(response) {
//    observer.onNext(response);
//    observer.onCompleted();
//  };
//  loadJSONP(QUAKE_URL);
//}).flatMap(function transform(response) {
//  return Rx.Observable.from(response.features);
//});
//quakes.subscribe(function(quake) {
//  var coords = quake.geometry.coordinates;
//  var size = quake.properties.mag * 10000;
//  L.circle([coords[1], coords[0]], size).addTo(map);
//});

//-- Third iteration ( process data before notifying observer )
//var quakes = Rx.DOM.jsonpRequest({
//    url: QUAKE_URL,
//    jsonpCallback: 'eqfeed_callback'
//  })
//  .flatMap(function(result) {
//    return Rx.Observable.from(result.response.features);
//  })
//  .map(function(quake) {
//    return {
//      lat: quake.geometry.coordinates[1],
//      lng: quake.geometry.coordinates[0],
//      size: quake.properties.mag * 10000
//    };
//  });
//quakes.subscribe(function(quake) {
//  L.circle([quake.lat, quake.lng], quake.size).addTo(map);
//});

var quakes = Rx.Observable
  .interval(5000)
  .flatMap(function() {
    return Rx.DOM.jsonpRequest({
      url: QUAKE_URL,
      jsonpCallback: 'eqfeed_callback'
    }).retry(3);
  })
  .flatMap(function(result) {
    return Rx.Observable.from(result.response.features);
  })
  .distinct(function(quake) {
    return quake.properties.code;
  });
quakes.subscribe(function(quake) {
  var coords = quake.geometry.coordinates;
  var size = quake.properties.mag * 10000;
  L.circle([coords[1], coords[0]], size).addTo(map);
});