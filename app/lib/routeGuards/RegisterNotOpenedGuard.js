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
	 * Reference to the Business instance. We do not reference the deviceRegister, since a new one
	 * may be created at any time and replace the current one.
	 *
	 * @type {Business}
	 */
	business = null;
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
	 * [allowed] property is based on the [state] property of the [deviceRegister] property of the
	 * Business instance. If the Business has no deviceRegister, returns true.
	 *
	 * @return {Boolean}
	 */
	@computed
	get allowed() {
		if (!this.business.deviceRegister) {
			return true;
		}

		return this.business.deviceRegister.state !== STATES.OPENED;
	}

	constructor(business, redirectTo = '/') {
		super();
		this.business = business;
		this.redirectTo = redirectTo;
	}
}

export default RegisterNotOpenedGuard;
