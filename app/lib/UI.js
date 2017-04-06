import { observable } from 'mobx';
import { createMemoryHistory } from 'history';
import DefaultAuth from 'hotelcaisse-app/dist/auth/Auth';
import Localizer from 'hotelcaisse-app/dist/Localizer';
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
 * Returns a Localizer instance initiated with the supplied locale and strings.
 *
 * @param {String} (Optional) locale
 * @param {Object} (Optional) strings
 * @return {Localizer}
 */
function createLocalizer(locale, currency, strings) {
	const localizer = new Localizer(locale, currency);

	if (strings) {
		Object.entries(strings).forEach(([stringsLocale, stringsData]) => {
			localizer.setStrings(stringsLocale, stringsData);
		});
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
	 * Instance of the HotelCaisse-app application.
	 *
	 * @type {HotelCaisse-app}
	 */
	app = null;
	/**
	 * Promise of the application loading. When the UI starts, it shows a loading that will stay
	 * until this Promise resolves. By default, resolves immediately. See start().
	 *
	 * @type {Promise}
	 */
	appLoadingPromise = Promise.resolve();

	/**
	 * Constructor. Can receive an object with the following param overwritting the defaults UI
	 * params (all optional, but might not work if not present):
	 * - routes
	 * - auth
	 * - locale (string)
	 * - strings (object for Localizer)
	 * - currency (string)
	 * - app (HotelCaisse-app)
	 * - moneyDenominations : array of number of the different money denominations
	 * 	(ex: [0.05, 0.1, 5, 10])
	 *
	 * @param {Object} settings
	 */
	constructor(settings = {}) {
		['routes', 'auth', 'app'].forEach((setting) => {
			if (settings[setting]) {
				this[setting] = settings[setting];
			}
		});
		this.settings = settings;
		this.localizer = createLocalizer(settings.locale, settings.currency, settings.strings);
	}

	/**
	 * Initialises all instances required before starting and bootstraps the Application
	 */
	init() {
		this.initRouter();
		if (this.app) {
			this.app.bootstrap();
		}
	}

	/**
	 * Initialises the router
	 */
	initRouter() {
		this.router = new RouterStore();
		this.history = syncHistoryWithStore(createMemoryHistory(), this.router);
	}

	/**
	 * Starts the UI. Will start the app. The Promise returned by app.start() will be used to
	 * determine when the loading finishes.
	 */
	start() {
		if (this.app) {
			this.appLoadingPromise = this.app.start();
		}
		this.startLoading();
	}

	/**
	 * Sets the state to "loading" until the appLoadingPromise resolves. Returns a Promise that
	 * resolves when the loading is finished.
	 *
	 * @return {Promise}
	 */
	startLoading() {
		this.state = STATES.LOADING;
		return this.appLoadingPromise.then(() => {
			this.state = STATES.READY;
		});
	}

	/**
	 * Returns a list of stores that containers can use:
	 * - ui : this instance
	 * - router : the router instance (has methods to "navigate" like push, goBack, ...)
	 * - auth : the auth class instance
	 * - localizer : Localizer instance used
	 *
	 * @return {Object}
	 */
	getStores() {
		return {
			ui: this,
			router: this.router,
			auth: this.auth,
			localizer: this.localizer,
			settings: this.settings,
			business: this.app ? this.app.business : null,
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
