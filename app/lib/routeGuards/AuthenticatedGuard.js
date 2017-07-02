import { computed } from 'mobx';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the supplied Auth instance is
 * authenticated.
 */
class AuthenticatedGuard extends RouteGuard {
	id = 'AuthenticatedGuard';
	auth = null;
	historyPush = false;
	redirectTo = null;

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
