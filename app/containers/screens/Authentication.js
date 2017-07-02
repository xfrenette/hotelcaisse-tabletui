import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { ERRORS as AUTH_ERRORS } from 'hotelcaisse-app/dist/auth/Auth';
import AuthenticationScreen from '../../components/screens/Authentication';

@inject('ui', 'auth')
@observer
class Authentication extends Component {
	@observable
	/**
	 * Current status of the authentication. Can be :
	 * - null: no authentication was tried yet
	 * - 'fail': authentication was refused
	 * - 'error': an error occured, other that fail
	 * - 'success': authentication was successful
	 * - 'authenticating': authentication is in progress
	 *
	 * @type {String}
	 */
	status = null;

	/**
	 * When the user tries to authenticate with a code, we try it and set the [status] property
	 * accordingly.
	 *
	 * @param {String} code
	 */
	onAuthenticate(code) {
		const uuid = this.props.ui.getDeviceUUID();

		this.status = 'authenticating';
		this.props.auth.authenticate(code, uuid)
			.then(() => {
				this.status = 'success';
			})
			.catch((error) => {
				if (error === AUTH_ERRORS.AUTHENTICATION_FAILED) {
					this.status = 'fail';
				} else {
					this.status = 'error';
				}
			});
	}

	/**
	 * After a successful authentication, when we are finished with the authentication screen (ex:
	 * after showing a success message for a few seconds). We redirect to home.
	 */
	onFinish() {
		this.props.ui.resetToHome();
	}

	render() {
		return (
			<AuthenticationScreen
				status={this.status}
				onAuthenticate={(code) => { this.onAuthenticate(code); }}
				onFinish={() => { this.onFinish(); }}
			/>
		);
	}
}

export default Authentication;
