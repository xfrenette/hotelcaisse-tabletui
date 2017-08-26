import { computed } from 'mobx';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the Register is not OPENED (null, CLOSED
 * or NEW).
 */
class RegisterNotOpenedGuard extends RouteGuard {
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	id = 'RegisterNotOpenedGuard';
	/**
	 * Reference to the Register instance. Note that the app guarantees that we have always the
	 * same Register instance. This instance will be updated, but will always be the same instance.
	 *
	 * @type {Register}
	 */
	register = null;
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
	 * [allowed] property is based on the [state] property of the Register instance.
	 *
	 * @return {Boolean}
	 */
	@computed
	get allowed() {
		return this.register.state !== STATES.OPENED;
	}

	constructor(register, redirectTo = '/') {
		super();
		this.register = register;
		this.redirectTo = redirectTo;
	}
}

export default RegisterNotOpenedGuard;
