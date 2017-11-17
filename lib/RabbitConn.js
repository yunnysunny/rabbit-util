const amqp = require('amqplib/callback_api');
const EventEmitter = require('events');

const _conn = function(rabbitConnObject) {
    const reconnectDelay = rabbitConnObject.reconnectDelay || 0;
    const retryTimes = rabbitConnObject.retryTimes || 0;
    amqp.connect(rabbitConnObject.url,function(err,conn) {
        if (err) {
            rabbitConnObject._errorCount++;
            rabbitConnObject.emit(RabbitConn.EVENT_CONN_ERROR,err);
            if (retryTimes && rabbitConnObject._errorCount > retryTimes) {
                return;
            }
            return setTimeout(function() {
                _conn(rabbitConnObject);
            },reconnectDelay);
        }

        conn.on("error", function(err) {
            rabbitConnObject._errorCount++;
            rabbitConnObject.emit(RabbitConn.EVENT_CONN_ERROR,err);
        });
        conn.on("close", function() {
            rabbitConnObject.emit(RabbitConn.EVENT_CONN_CLOSE);
            if (retryTimes && rabbitConnObject._errorCount > retryTimes) {
                return;
            }
            return setTimeout(function() {
                _conn(rabbitConnObject);
            },reconnectDelay);
        });
        rabbitConnObject._errorCount = 0;
        rabbitConnObject.emit(RabbitConn.EVENT_CONN_SUCCESS,conn);
    });
}

class RabbitConn extends EventEmitter {
    constructor(options) {
        super();
        this.url = options.url;
        this.reconnectDelay = options.reconnectDelay;
        this.retryTimes = options.retryTimes;
        this._errorCount = 0;
        _conn(this);
    }
    
}

RabbitConn.EVENT_CONN_ERROR = 'eventConnError';
RabbitConn.EVENT_CONN_CLOSE = 'eventConnClose';
RabbitConn.EVENT_CONN_SUCCESS = 'eventConnSuccess';

module.exports = RabbitConn;