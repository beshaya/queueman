# queueman
Lightweight redis-backed queue based on cumin. 100% compatible with cumin.

## Why queueman?

 * cumin doesn't resume listening if the redis connection is dropped and recovered - queueman does
 * cumin can only listen to one queue per app - queueman creates listeners with queueman.listener 

## Limitations

 * queueman doesn't support "safe exiting," i.e., sending KillTerm may cause data to be lost.

## Usage

Initialize queueman the same way you would cumin:

```
var queueman = require(queueman)(redis.port, redis.host, redis.auth)
```

### Pushing/Enqueueing

Similar to cumin:

```
queueman.push(queue_name, message_data, callback)
```

callback will be passed to redis.rpush.

### Listening

Listening with queueman is fairly different from listening with cumin. Instead of calling the listen function on queueman, queueman.listener is called to create a listener. Create a listener for each queue to which you wish to listen (must be from the same redis database, for the moment), then call listen on those:

```
var my_listener = queueman.listener(my_queue, auto_reconnect)
my_listener.listen( function (data) {
    console.log('my queue says ', data)
});

var your_listener = queueman.listener(your_queue, auto_reconnect)
your_listener.listen( function (data) {
    console.log('your queue says ', data)
});

```

The auto_reconnect options specified whether or not queueman should resume listening if the redis database becomes disconnected and then reconnects; truthy values direct queueman to resume listening, otherwise listening will not resume, as they do in cumin

Listening can also be manually stopped with listener.stopListening()

### Misc

#### Using with cumin
The function queueman.cuminMode(true) turns on cumin compatability. Redis queues will have 'cumin.' prepended instead of 'queueman.' Call this function before you start listening/queueing!

