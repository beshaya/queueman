//Creates listeners and pushers for redis backed queues.
//Initialize with redis arguments
//then create listener or pusher, then call listener or pusher

var redis = require('redis');
var console_prefix = '[queueman]'
var default_queue_prefix = 'queueman.'
var cumin_queue_prefix = 'cumin.'
var queue_prefix = default_queue_prefix

var redis_args

module.exports = function(port, host, auth) {
  redis_args = arguments;

  var redis_blpop_timeout = 1000;
  var kill_signal_received = false;

  var push_client = redis.createClient.apply(redis, redis_args);

  push_client.on('error', function(err) {
    console.warn(console_prefix, 'Push client disconnect')
  })

  function makeQueuemanName(postfix) {
    return queue_prefix + postfix
  }
  function onKillSignal() {
    kill_signal_received = true;
    console.info(console_prefix, "Attempting Shutdown");
    setTimeout(function() {
      console.info(console_prefix, "Forcing kill")
      process.exit();
    }, 5000);
  }

  return {

    //use cumin's queue prefix and pretend we are cumin?
    cuminMode: function(cumin_mode) {
      if (cumin_mode) {
	queue_prefix = cumin_queue_prefix;
      } else {
	queue_prefix = default_queue_prefix;
      }
    },
    listener: function(queue_name, auto_reconnect) {
      var full_name = makeQueuemanName(queue_name);
      var client = redis.createClient.apply(redis, redis_args);
      var listening = false;
      var keep_listening = false;

      //continueListening does all the lifting here
      continueListening = function(handler) {
	client.blpop(full_name, redis_blpop_timeout, function(err, data) {
	  if(err) return console.log(err);
	  if(data) {
	    handler(JSON.parse(data[1]).data)
	  }
	  if (keep_listening && !kill_signal_received ) {
	    process.nextTick(function() {
	      continueListening(handler)
	    })
	  } else {
	    listening = false;
	  }
	});
      }

      //startListening just gets the process started
      startListening = function(handler) {
	//set up to start listening again if continue listening gets an error
	if (auto_reconnect) {
	  client.on('end', function(err) {
	    listening = false;
	  })
	  client.on('error', function(err) {
	    console.warn(console_prefix, 'Listener disconnect');
	  });
	  client.on('ready', function() {
	    if (!listening && keep_listening) {
	      listening = true;
	      continueListening(handler)
	    }
	  });
	}
	listening = true;
	keep_listening = true;
	continueListening(handler)
      }

      //stop listening 
      //will stop after next value is returned or redis.blop times out
      stopListening = function() {
	keep_listening = false;
      }
	

      process.on("SIGINT", onKillSignal)
      process.on("SIGTERM", onKillSignal)

      return {listen: startListening};

    },
    push: function(queue_name, data, done) {
      var full_name = makeQueuemanName(queue_name);
      var message = JSON.stringify({
	byPid: process.pid,
	byTitle: process.title,
	date: Date.now(),
	data: data,
	retryCount: 0
      })
      push_client.rpush(full_name, message, done)
    }
  }
}

    
