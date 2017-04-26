import Logger from 'hotelcaisse-app/dist/loggers/Logger';
import EventEmitter from 'events';

class UILogger extends EventEmitter {
	log(type, namespace, message, data) {
		const now = new Date();
		this.emit('log', now, type, namespace, message, data);
	}
}

// False extending of Logger
UILogger.prototype.getNamespace = Logger.prototype.getNamespace;

export default UILogger;
