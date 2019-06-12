const events = require('events');
const eventEmitter = new events.EventEmitter();

exports.emitter = eventEmitter;