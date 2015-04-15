var conf = require('./config');

var queueman = require('./queueman')(conf.REDIS.PORT, conf.REDIS.HOST, {auth_pass: conf.REDIS.AUTH})

listener = queueman.listener("myqueue", true)

listener.listen(function(message) {
  console.log('queueman sez:',message)
})

queueman.push("myqueue", "hello" )
queueman.push("myqueue", "world" )

