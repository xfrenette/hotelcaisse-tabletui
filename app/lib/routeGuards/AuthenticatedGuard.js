import { computed } from 'mobx';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the supplied Auth instance is
 * authenticated.
 */
class AuthenticatedGuard extends RouteGuard {
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	id = 'AuthenticatedGuard';
	/**
	 * Reference to the authentication class
	 *
	 * @type {Auth}
	 */
	auth = null;
	/**
	 * @see RouteGuard
	 * @type {Boolean}
	 */
	historyPush = false;
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	redirectTo = null;

	/**
	 * [allowed] property is based on the [authenticated] property of the Auth instance.
	 *
	 * @return {Boolean}
	 */
	@computed
	get allowed() {
		return this.auth.authenticated;
	}

	constructor(auth, redirectTo = '/authenticate') {
		super();
		this.auth = auth;
		this.redirectTo = redirectTo;
	}
}

export default AuthenticatedGuard;
