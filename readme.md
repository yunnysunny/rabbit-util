# Rabbit Util

The utilities of rabbitmq, supply the feature of reconnecting.

## install

npm install rabbit-util --save

## Usage

```javascript
const {RabbitConn} = require('../../');
const rabbitmqUrl= process.env.RABBIT_URL;

new RabbitConn({
    url:rabbitmqUrl,
}).on(RabbitConn.EVENT_CONN_SUCCESS, function (conn) {
    console.log('connected ok');
    done();
}).on(RabbitConn.EVENT_CONN_ERROR,function(err) {
    console.log('an error occured',err);
}).on(RabbitConn.EVENT_CONN_CLOSE,function() {
    console.log('the connection is closed');
});

```