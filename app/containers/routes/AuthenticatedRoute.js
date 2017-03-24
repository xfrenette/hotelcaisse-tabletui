import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { ERRORS } from 'hotelcaisse-app/dist/auth/Auth';
import RouteWithSubRoutes from '../RouteWithSubRoutes';
import { STATES as UI_STATES } from '../../lib/UI';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
	authenticationComponent: React.PropTypes.oneOfType([
		React.PropTypes.element,
		React.PropTypes.func,
	]).isRequired,
};

@inject('auth', 'ui')
@observer
class AuthenticatedRoute extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// can be null, success, fail, authenticating, error
			status: null,
			showAuthentication: !props.auth.authenticated,
		};
	}

	onAuthenticate(code) {
		const auth = this.props.auth;
		const deviceUUID = this.props.ui.getDeviceUUID();

		this.setState({
			status: 'authenticating',
		});

		auth.authenticate(code, deviceUUID)
			.then(() => {
				this.setState({
					status: 'success',
				});
			})
			.catch((errorCode) => {
				this.setState({
					status: errorCode === ERRORS.AUTHENTICATION_FAILED ? 'fail' : 'error',
				});
			});
	}

	onFinish() {
		this.setState({
			status: null,
			showAuthentication: false,
		});
	}

	render() {
		if (this.state.showAuthentication) {
			const AuthenticationComponent = this.props.authenticationComponent;
			return (
				<AuthenticationComponent
					status={this.state.status}
					onAuthenticate={this.onAuthenticate.bind(this)}
					onFinish={this.onFinish.bind(this)}
				/>
			);
		}

		return (
			<View style={{ flex: 1 }}>
				{this.props.routes.map(
					(route, i) => <RouteWithSubRoutes key={i} route={route} />
				)}
			</View>
		);
	}
}

AuthenticatedRoute.propTypes = propTypes;

export default AuthenticatedRoute;
