import { computed } from 'mobx';
import { STATES } from '../UI';
import RouteGuard from './RouteGuard';

/**
 * RouteGuard that sets its allowed property to true IFF the UI state is READY.
 */
class LoadedGuard extends RouteGuard {
	id = 'LoadedGuard';
	ui = null;
	historyPush = true;
	redirectTo = null;

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
