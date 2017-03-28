import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observable, computed, autorun } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Auth, { ERRORS } from 'hotelcaisse-app/dist/auth/Auth';
import RouteWithSubRoutes from '../RouteWithSubRoutes';

/**
 * Special "React Router" Route that "guards" sub-routes only if a supplied Auth class indicates the
 * device is authenticated. If it is, simply continue by showing sub-routes. If not, shows a
 * Authentication component.
 */

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
	/**
	 * If true, the authentication component is shown, even if we are now authenticated. Used to show
	 * a "success" message after a successful authentication.
	 *
	 * @type {Boolean}
	 */
	@observable forceAuthenticationShown = false;
	/**
	 * Authentication status. Can be :
	 * - null : no authentication tried yet
	 * - 'success' : authentication was tried and was successful
	 * - 'fail' : authentication was tried and was failed
	 * - 'error' : authentication was tried but an erreur (other that fail) occured (ex: network
	 * 		error)
	 *
	 * @type {string|null}
	 */
	@observable status = null;
	/**
	 * Disposer callback of the autorun
	 *
	 * @type {function}
	 */
	disposer = null;

	/**
	 * Main boolean stating if the authentication component should be shown or not. Constructed from
	 * forceAuthenticationShown and authenticated attribute of Auth class.
	 *
	 * @type {Boolean}
	 */
	@computed
	get showAuthentication() {
		return this.forceAuthenticationShown || !this.props.auth.authenticated;
	}

	/**
	 * When the Auth class's authenticated property becomes false, force authentication display
	 */
	componentWillMount() {
		this.disposer = autorun(() => {
			if (!this.props.auth.authenticated) {
				this.forceAuthenticationShown = true;
			}
		});
	}

	/**
	 * Remove the autorun when unmounting
	 */
	componentWillUnmount() {
		if (this.disposer) {
			this.disposer();
			this.disposer = null;
		}
	}

	/**
	 * Callback called by the Authentication component when the user tries to authenticate with a
	 * code. Tries to authenticate on the Auth class. Sets the status during the process.
	 *
	 * @param {String} code
	 */
	onAuthenticate(code) {
		const auth = this.props.auth;
		const deviceUUID = this.props.ui.getDeviceUUID();

		this.status = 'authenticating';

		auth.authenticate(code, deviceUUID)
			.then(() => {
				this.status = 'success';
			})
			.catch((errorCode) => {
				this.status = errorCode === ERRORS.AUTHENTICATION_FAILED ? 'fail' : 'error';
			});
	}

	/**
	 * Callback called by the Authentication component when it wants to quit the authentication
	 * screen after a successful authentication.
	 */
	onFinish() {
		this.status = null;
		this.forceAuthenticationShown = false;
	}

	render() {
		if (this.showAuthentication) {
			this.authenticationAlreadyShown = true;
			const AuthenticationComponent = this.props.authenticationComponent;
			return (
				<AuthenticationComponent
					status={this.status}
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
