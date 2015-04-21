#!/usr/bin/nodejs

/***************************************************
 * Test queueman
 * Also can test queeman for compatability with cumin
 *
 * Usage:
 * node queueman.js :: test queueman
 * node queueman.js --send --listen :: test queueman against cumin
 *      variables marked will be done with cumin instead of queueman
*****************************************************/

var argv = require('optimist').argv;

var sender = "queueman"
var listener = "queueman"

if (argv.hasOwnProperty('send')) {
  sender = 'cumin'
}
if (argv.hasOwnProperty('listen')) {
  listener = 'cumin'
}

console.log("Testing queueman with ",sender, " sending and ", listener, "listening")

var conf = require('./config');

var queueman = require('./queueman')(conf.REDIS.PORT, conf.REDIS.HOST, {auth_pass: conf.REDIS.AUTH})
var cumin = require('cumin')(conf.REDIS.PORT, conf.REDIS.HOST, {auth_pass: conf.REDIS.AUTH})

var correct_results = ['hello', 'world']

if (sender == 'cumin' || listener == 'cumin' ) {
  queueman.cuminMode(true);
}

//set up the listeners and test conditions

var results = [];

if (listener == 'cumin') {
  listener = cumin
  listener.listen("myqueue", function(message, done) {
    //console.log('cumin sez:',message)
    results.push(message)
    if ( correct_results+"" == results+"" ) {
      console.log('Test Passed')
      done();
      process.exit();
    }
    done();
  })
} else {
  listener = queueman.listener("myqueue", true)
  listener.listen(function(message) {
    //console.log('queueman sez:',message)
    results.push(message)
    if ( correct_results+"" == results+"" ) {
      console.log('Test Passed')
      process.exit();
    }
  })
}

if (sender == 'queueman') {
  queueman.push("myqueue", "hello" )
  queueman.push("myqueue", "world" )
} else {
  cumin.enqueue("myqueue", "hello" )
  cumin.enqueue("myqueue", "world" )
}

setTimeout( function() {
  console.log('Test Failed')
  process.exit(1);
}, 5000);
