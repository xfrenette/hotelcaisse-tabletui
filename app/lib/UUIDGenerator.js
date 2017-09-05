class UUIDGenerator {
	generate() {
		return this.generator();
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * @see https://gist.github.com/jed/982883
	 * @return {string}
	 */
	generator(a) {
		return a
			? (a^Math.random()*16>>a/4).toString(16)
			: ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, this.generator);
	}
}

export default UUIDGenerator;
