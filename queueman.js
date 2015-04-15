//Creates listeners and pushers for redis backed queues.
//Initialize with redis arguments
//then create listener or pusher, then call listener or pusher

var redis = require('redis');
var console_prefix = '[queueman]'
var queue_prefix = 'queueman.'

var redis_args

module.exports = function(port, host, auth) {
  redis_args = arguments;

  var redis_blpop_timeout = 1000;
  var killSignalReceived = false;

  var push_client = redis.createClient.apply(redis, redis_args);

  push_client.on('error', function(err) {
    console.warn(console_prefix, 'Push client disconnect')
  })

  function makeQueuemanName(postfix) {
    return queue_prefix + postfix
  }
  function onKillSignal() {
    killSignalReceived = true;
    console.info(console_prefix, "Attempting Shutdown");
    setTimeout(function() {
      console.info(console_prefix, "Forcing kill")
      process.exit();
    }, 5000);
  }

  return {
    listener: function(queue_name, auto_reconnect) {
      var full_name = makeQueuemanName(queue_name);
      var client = redis.createClient.apply(redis, redis_args);
      var listening = false;

      //continueListening does all the lifting here
      continueListening = function(handler) {
	client.blpop(full_name, redis_blpop_timeout, function(err, data) {
	  if(err) return console.log(err);
	  if(data) {
	    handler(data)
	  }
	  process.nextTick(function() {
	    continueListening(handler)
	  })
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
	    if (!listening) {
	      listening = true;
	      continueListening(handler)
	    }
	  });
	}
	continueListening(handler)
      }

      process.on("SIGINT", onKillSignal)
      process.on("SIGTERM", onKillSignal)

      return {listen: startListening};

    },
    push: function(queue_name, message, done) {
      var full_name = makeQueuemanName(queue_name);
      push_client.rpush(full_name, message, done)
    }
  }
}

    
