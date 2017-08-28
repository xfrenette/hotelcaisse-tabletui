class TestUUIDGenerator {
	counter = 0;
	staticValue = null;

	generate() {
		if (this.staticValue) {
			return this.staticValue;
		}

		return this.next();
	}

	next() {
		this.counter += 1;
		return `uuid_${this.counter}`;
	}
}

export default TestUUIDGenerator;
