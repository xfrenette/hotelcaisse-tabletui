import { computed } from 'mobx';
import { STATES } from '../UI';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the UI state is READY.
 */
class LoadedGuard extends RouteGuard {
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	id = 'LoadedGuard';
	/**
	 * Reference to the UI instance
	 *
	 * @type {UI}
	 */
	ui = null;
	/**
	 * @see RouteGuard
	 * @type {Boolean}
	 */
	historyPush = true;
	/**
	 * @see RouteGuard
	 * @type {String}
	 */
	redirectTo = null;

	/**
	 * [allowed] property is based on the [state] property of the UI instance.
	 *
	 * @return {Boolean}
	 */
	@computed
	get allowed() {
		return this.ui.state === STATES.READY;
	}

	constructor(ui, redirectTo = '/loading') {
		super();
		this.ui = ui;
		this.redirectTo = redirectTo;
	}
}

export default LoadedGuard;
