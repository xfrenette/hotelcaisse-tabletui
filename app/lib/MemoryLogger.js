import { mixin as loggerMixin } from 'hotelcaisse-app/dist/loggers/Logger';
import EventEmitter from 'events';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

class MemoryLogger extends loggerMixin(EventEmitter) {
	nb = 0;
	entries = [];

	constructor(nb = 50) {
		super();
		this.nb = nb;
	}

	log(type, namespace, message, data) {
		const now = new Date();
		this.entries.push({
			date: now,
			type,
			namespace,
			message,
			data,
		});

		if (this.entries.length > this.nb) {
			this.entries = this.entries.slice(-this.nb);
		}

		this.emit('log', now, type, namespace, message, data);
	}
}

export default MemoryLogger;
