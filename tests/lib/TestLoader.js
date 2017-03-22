import EventEmitter from 'EventEmitter';

class TestLoader extends EventEmitter {
	constructor(opts) {
		super();

		this.opts = opts;
	}

	start() {
		if (this.opts === true) {
			this.emit('load');
		}
	}
}

export default TestLoader;
