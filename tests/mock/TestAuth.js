import Auth from 'hotelcaisse-app/dist/auth/Auth';

class TestAuth extends Auth {
	constructor(doSucceed = true) {
		super();

		this.doSucceed = doSucceed;
		this.validCode = null;
		this.delay = 0;
	}

	// eslint-disable-next-line no-unused-vars
	authenticate(code, deviceUUID) {
		const codeIsValid = this.validCode === null || code === this.validCode;
		let success = false;

		if (this.doSucceed && codeIsValid) {
			success = true;
		}

		if (this.delay > 0) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this.authenticated = success;
					success ? resolve() : reject();
				}, this.delay);
			});
		}

		this.authenticated = success;
		return success ? Promise.resolve() : Promise.reject();
	}
}

export default TestAuth;
