const {RabbitConn} = require('../../');
const rabbitmqUrl= process.env.RABBIT_URL;

describe('basic test:',function() {
    it('should connect to rabbit ok',function(done) {
        new RabbitConn({
            url:rabbitmqUrl,
            // retryTimes:5
        }).on(RabbitConn.EVENT_CONN_SUCCESS, function (conn) {
            console.log('connected ok');
            done();
        }).on(RabbitConn.EVENT_CONN_ERROR,function(err) {
            console.log('an error occured',err);
        }).on(RabbitConn.EVENT_CONN_CLOSE,function() {
            console.log('the connection is closed');
        });
    });
});