import { observable } from 'mobx';
import { createMemoryHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from './mobx-react-router';

/**
 * Different states the UI can be.
 *
 * @type {Object}
 */
const STATES = {
	BOOTSTRAPPING: 0,
	LOADING: 1,
	READY: 2,
};

/**
 * Main class representing the user interface.
 */
class UI {
	/**
	 * Current state of the UI
	 *
	 * @type {STATES}
	 */
	@observable
	state = STATES.BOOTSTRAPPING;
	/**
	 * Loader of the UI. The loader is called when the UI start to load all the required data. The
	 * state of the UI is updated accordingly. If null, it like if there is no loading.
	 *
	 * @type {Loader}
	 */
	loader = null;
	/**
	 * Array of route objects describing all the routes used in conjunction with the router.
	 *
	 * @type {Array}
	 */
	routes = [];
	/**
	 * History object used in conjunction with the router
	 *
	 * @type {history}
	 */
	history = null;

	/**
	 * Constructor. Can receive an object with the following param overwritting the defaults UI
	 * params (all optional):
	 * - routes
	 * - loader
	 *
	 * @param {Object} settings
	 */
	constructor(settings = {}) {
		['routes', 'loader'].forEach((setting) => {
			if (settings[setting]) {
				this[setting] = settings[setting];
			}
		});
	}

	/**
	 * Initialises all instances required before starting.
	 */
	init() {
		this.initRouter();
	}

	/**
	 * Initialises the router
	 */
	initRouter() {
		this.router = new RouterStore();
		this.history = syncHistoryWithStore(createMemoryHistory(), this.router);
	}

	/**
	 * Starts the UI. Will start the app.
	 */
	start() {
		this.startLoading();
	}

	/**
	 * If a loader is present, starts it and listens when it loads. The state will be updated
	 * accordingly. If no loader is present, skips the loading.
	 */
	startLoading() {
		if (this.loader) {
			this.state = STATES.LOADING;
			this.loader.once('load', () => {
				this.state = STATES.READY;
			});
			this.loader.start();
		} else {
			this.state = STATES.READY;
		}
	}

	/**
	 * Returns a list of stores that containers can use:
	 * - ui : this instance
	 * - router : the router instance (has methods to "navigate" like push, goBack, ...)
	 *
	 * @return {Object}
	 */
	getStores() {
		return {
			ui: this,
			router: this.router,
		};
	}
}

export default UI;
export { STATES };
