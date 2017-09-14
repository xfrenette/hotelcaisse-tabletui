import Auth, { ERRORS } from 'hotelcaisse-app/dist/auth/Auth';

class TestAuth extends Auth {
	constructor(doSucceed = true) {
		super();

		this.doSucceed = doSucceed;
		this.validCode = null;
		this.delay = 0;
	}

	// eslint-disable-next-line no-unused-vars
	authenticate(code) {
		console.log(code);
		const codeIsValid = this.validCode === null || code === this.validCode;
		let success = false;
		let error = ERRORS.AUTHENTICATION_FAILED;

		if (!this.doSucceed) {
			error = 'other-error';
		} else if (codeIsValid) {
			success = true;
		}

		if (this.delay > 0) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this.authenticated = success;
					success ? resolve() : reject(error);
				}, this.delay);
			});
		}

		this.authenticated = success;
		return success ? Promise.resolve() : Promise.reject(error);
	}
}

export default TestAuth;
