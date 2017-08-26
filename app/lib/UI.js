import { Alert, BackHandler, Platform, ToastAndroid } from 'react-native';
import { observable } from 'mobx';
import { createMemoryHistory } from 'history';
import DefaultAuth from 'hotelcaisse-app/dist/auth/Auth';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { RouterStore, syncHistoryWithStore } from './mobx-react-router';
import routesDef from '../routes';
import routesBuilder from './routesBuilder';

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
	 * Localizer instance
	 *
	 * @type {Localizer}
	 */
	localizer = null;
	/**
	 * Class which has a generate() method that generates a uuid
	 *
	 * @type {UUIDGenerator}
	 */
	uuidGenerator = null;
	/**
	 * Contains the Order that is currently being created. When the user starts a new Order, we want
	 * to allow her to quit the creation process to come back later, so we save it here. It is
	 * defined when we press the "new order" button on home and it clears when we end the creation
	 * process.
	 *
	 * @type {Order}
	 */
	orderDraft = null;
	/**
	 * Server instance which we can query to search non-loaded Orders or load non-loaded Orders.
	 *
	 * @type {Server}
	 */
	ordersServer = null;
	/**
	 * List of orders that were loaded in the /orders screen. Used to reshow the same list when we
	 * go back from an Order screen we reached from /orders. It can be cleared anytime though; it is
	 * just a convenient cache.
	 *
	 * @type {Array<Order>}
	 */
	@observable
	loadedOrders = [];

	/**
	 * Constructor. Can receive an object with the following param overwritting the defaults UI
	 * params (all optional, but might not work if not present):
	 * - initialRoutes (array<String>, optional) Mainly used when developping
	 * - auth
	 * - locale (string)
	 * - strings (object for Localizer)
	 * - currency (string)
	 * - app (HotelCaisse-app)
	 * - showConsole (boolean) to show the floating console
	 * - moneyDenominations : array of number of the different money denominations
	 * 	(ex: [0.05, 0.1, 5, 10])
	 * - ordersServer: Server instance which we can query to search and load additional Orders
	 *
	 * @param {Object} settings
	 */
	constructor(settings = {}) {
		['auth', 'app', 'uuidGenerator', 'logger', 'ordersServer'].forEach((setting) => {
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
	 * Initialises the router. If a initialRoute setting is set, it is used as the initial entry in
	 * the history object.
	 */
	initRouter() {
		const historyConfig = {};

		if (this.settings.initialRoutes) {
			historyConfig.initialEntries = this.settings.initialRoutes;
			historyConfig.initialIndex = this.settings.initialRoutes.length - 1;
		}

		this.router = new RouterStore();
		this.history = syncHistoryWithStore(createMemoryHistory(historyConfig), this.router);
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
		this.installDefaultBackHandler();
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
			uuidGenerator: this.uuidGenerator,
			logger: this.logger,
			business: this.app ? this.app.business : null,
			register: this.app ? this.app.register : null,
			ordersServer: this.ordersServer,
		};
	}

	/**
	 * From the routesDef, returns an array of Route nodes
	 *
	 * @return {Array<Node>}
	 */
	buildRouteComponents() {
		const def = routesDef(this);
		return routesBuilder(def);
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

	/**
	 * Shows an alert for an error.
	 *
	 * @param {String} title
	 * @param {String} message
	 */
	showErrorAlert(title, message) {
		Alert.alert(
			title,
			message,
			[{ text: this.localizer.t('actions.retry') }],
			{ cancelable: false }
		);
	}

	/**
	 * Shows an application wide error message to the user.
	 *
	 * @param {String} message
	 */
	showError(message) {
		// TODO: for now, show a toast
		this.showToast(message);
	}

	/**
	 * Shows a Toast message only on Android.
	 *
	 * @param {String} message
	 */
	showToast(message) {
		if (Platform.OS === 'android') {
			ToastAndroid.show(message, ToastAndroid.SHORT);
		}
	}

	/**
	 * Installs a default back handler, which will go back one step in the history for regular
	 * pages, but will exit the application for 'initial' screens (screens that don't have 'before',
	 * like the home).
	 */
	installDefaultBackHandler() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			if (this.isInitialScreen()) {
				BackHandler.exitApp();
				return true;
			}

			this.router.goBack();
			return true;
		});
	}

	/**
	 * Returns a boolean indicating if we are at an 'initial' screen, a screen where there is no
	 * 'before'. Used in the default handler of the back button.
	 *
	 * @return {Boolean}
	 */
	isInitialScreen() {
		const currentPath = this.history.location.pathname;
		const baseScreenPaths = ['/'];
		return baseScreenPaths.indexOf(currentPath) !== -1;
	}

	/**
	 * Simple utility function that goes back 1 step in the history if there is a previous location,
	 * else goes to home.
	 */
	goBackOrGoHome() {
		if (this.history.length > 1) {
			this.router.goBack();
		} else {
			this.router.replace('/');
		}
	}

	/**
	 * Goes to the home and resets the history to only one entry: the home.
	 */
	resetToHome() {
		const historyLength = this.history.length;

		if (historyLength > 1) {
			this.history.go(-historyLength + 1);
		}

		this.router.replace('/');
	}
}

export default UI;
export { STATES };
