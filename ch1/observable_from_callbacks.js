#!/usr/bin/env node

var Rx = require('rx'); // Load RxJS
var fs = require('fs'); // Load Node.js Filesystem module

function wait(time, callback) {
  console.log('Starting async task');
  setTimeout(callback, time);
}

wait(1000, function() {
  console.log('Async task finished!');
});


// Create an Observable from the readdir method
var readdir = Rx.Observable.fromNodeCallback(fs.readdir);

// Send a delayed message
var source = readdir('/Users/vvs');

var subscription = source.subscribe(
  function(res) {
    console.log('List of directories: ' + res);
  },
  function(err) {
    console.log('Error: ' + err);
  },
  function() {
    console.log('Done!');
  });