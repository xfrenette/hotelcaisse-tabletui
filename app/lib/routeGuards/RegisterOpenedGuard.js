import { computed } from 'mobx';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the Register is OPENED.
 */
class RegisterOpenedGuard extends RouteGuard {
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	id = 'RegisterOpenedGuard';
	/**
	 * Reference to the Register instance. See comment in RegisterNotOpenedGuard
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
		return this.register.state === STATES.OPENED;
	}

	constructor(register, redirectTo = '/') {
		super();
		this.register = register;
		this.redirectTo = redirectTo;
	}
}

export default RegisterOpenedGuard;
