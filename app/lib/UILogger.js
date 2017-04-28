import { mixin as loggerMixin } from 'hotelcaisse-app/dist/loggers/Logger';
import EventEmitter from 'events';

class UILogger extends loggerMixin(EventEmitter) {
	log(type, namespace, message, data) {
		const now = new Date();
		this.emit('log', now, type, namespace, message, data);
	}
}

export default UILogger;
