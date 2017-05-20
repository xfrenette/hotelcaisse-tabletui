class TestReader {
	data = {};
	delay = 0;

	constructor(data = {}) {
		this.data = data;
	}

	read(channel) {
		if (this.delay) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(this.data);
				}, this.delay);
			});
		}

		return Promise.resolve(this.data);
	}
}

export default TestReader;
