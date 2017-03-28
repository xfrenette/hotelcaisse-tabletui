import { observable } from 'mobx';
import { createMemoryHistory } from 'history';
import DefaultAuth from 'hotelcaisse-app/dist/auth/Auth';
import { RouterStore, syncHistoryWithStore } from './mobx-react-router';
import Localizer from './Localizer';

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
 * Returns a Localizer instance initiated with the supplied locale and strings.
 *
 * @param {String} (Optional) locale
 * @param {Object} (Optional) strings
 * @return {Localizer}
 */
function createLocalizer(locale, strings) {
	const localizer = new Localizer();

	if (strings) {
		Object.entries(strings).forEach(([stringsLocale, stringsData]) => {
			localizer.setStrings(stringsLocale, stringsData);
		});
	}

	if (locale) {
		localizer.locale = locale;
	}

	return localizer;
}

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
	 * Authentication class. By default, a "never authenticated" class is used
	 *
	 * @type {Auth}
	 */
	auth = new DefaultAuth();

	/**
	 * Constructor. Can receive an object with the following param overwritting the defaults UI
	 * params (all optional):
	 * - routes
	 * - loader
	 * - auth
	 * - locale (string)
	 * - strings (object for Localizer)
	 *
	 * @param {Object} settings
	 */
	constructor(settings = {}) {
		['routes', 'loader', 'auth'].forEach((setting) => {
			if (settings[setting]) {
				this[setting] = settings[setting];
			}
		});
		this.localizer = createLocalizer(settings.locale, settings.strings);
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
	 * - auth : the auth class instance
	 *
	 * @return {Object}
	 */
	getStores() {
		return {
			ui: this,
			router: this.router,
			auth: this.auth,
			localizer: this.localizer,
		};
	}

	/**
	 * Returns the device's UUID
	 *
	 * @todo
	 * @return {string}
	 */
	getDeviceUUID() {
		return 'device-uuid-todo';
	}
}

export default UI;
export { STATES };
