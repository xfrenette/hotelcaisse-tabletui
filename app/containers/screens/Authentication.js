import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { ERRORS as AUTH_ERRORS } from 'hotelcaisse-app/dist/auth/Auth';
import AuthenticationScreen from '../../components/screens/Authentication';

@inject('ui', 'auth')
@observer
class Authentication extends Component {
	@observable
	status = null;

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
