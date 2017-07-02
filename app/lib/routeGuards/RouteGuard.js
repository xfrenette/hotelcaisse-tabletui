import { observable } from 'mobx';

/**
 * A RouteGuard is used on route objects' guards property (see app/lib/routesBuilder). It is an
 * object that has a [allowed] property that is true if the routes it is guarding can be accessed,
 * else it is false. It also contains information about the redirection to do if allowed is false.
 * A RouteGuard is used in app/containers/routes/GuardedRoute which observes the [allowed] property,
 * (which should be observable) so a redirect will be automatically triggered if [allowed] becomes
 * false.
 */
class RouteGuard {
	/**
	 * Id of this RouteGuard shown in logs.
	 *
	 * @type {String}
	 */
	id = 'no-id';
	/**
	 * If true, the guarded routes can be accessed
	 *
	 * @type {Boolean}
	 */
	@observable
	allowed = true;
	/**
	 * Location object or string where to redirect if allowed is false
	 *
	 * @type {String|Object}
	 */
	redirectTo = null;
	/**
	 * If we have to redirect, do we push the new location (true) or replace the current location
	 * (false).
	 *
	 * @type {Boolean}
	 */
	historyPush = false;
}

export default RouteGuard;
