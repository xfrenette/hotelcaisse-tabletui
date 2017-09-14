import Application from 'hotelcaisse-app/dist/Application';
import ApiServer from 'hotelcaisse-app/dist/servers/Api';
import ApiAuth from 'hotelcaisse-app/dist/auth/ApiServer';
import Business from 'hotelcaisse-app/dist/business/Business';
import Order from 'hotelcaisse-app/dist/business/Order';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Register from 'hotelcaisse-app/dist/business/Register';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Business';
import RegisterAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Register';
import ServerAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Server';
import ApiServerUpdatesListener from 'hotelcaisse-app/dist/plugins/apiServer/UpdatesListener';
import ApiServerPing from 'hotelcaisse-app/dist/plugins/apiServer/Ping';
import FirstReader from 'hotelcaisse-app/dist/io/readers/First';
import BusinessServerReader from 'hotelcaisse-app/dist/io/readers/business/Server';
import RegisterServerReader from 'hotelcaisse-app/dist/io/readers/register/Server';
import BusinessSaveServer from 'hotelcaisse-app/dist/plugins/autosave/business/ToServer';
import RegisterSaveServer from 'hotelcaisse-app/dist/plugins/autosave/register/ToServer';
import BusinessSaveWriter from 'hotelcaisse-app/dist/plugins/autosave/business/ToWriter';
import RegisterSaveWriter from 'hotelcaisse-app/dist/plugins/autosave/register/ToWriter';
import LocalStorage from '../../app/io/dual/Local';
import storedBusiness from './storedBusiness';
import storedRegister from './storedRegister';
import UILogger from '../../app/lib/UILogger';
import TestAuth from '../../tests/mock/TestAuth';
import TestServer from '../../tests/mock/TestServer';
import dummyOrder from '../../tests/mock/dummyOrder';
import UUIDGenerator from '../../app/lib/UUIDGenerator';
import strings from '../../locales/fr-CA';

/*
Examples :

// Authentication that always fails (ex: because of an error)
const testAuth = new TestAuth(false);

// Authentication with a specific valid code waiting 2 secs before validating
const testAuth = new TestAuth();
testAuth.authenticated = false;
testAuth.validCode = '1234';
testAuth.delay = 2000;

// Business storage
const businessStorage = new TestReader(storedBusiness);
// With delay
businessStorage.delay = 3000;

*/

const useReal = false;
const useLocalStorage = false;
let server;
let auth;
const localStorages = {};
let serverStorage;
const dummyLocalizer = new Localizer('fr-CA', 'CAD');

const logger = new UILogger();

if (useReal) {
	serverStorage = new LocalStorage('hotelcaisse-app@server');
	// Do not forget to set application later
	server = new ApiServer('http://192.168.137.1:8000/api/1.0/hirdl');
	server.writer = serverStorage;
	server.setLogger(logger);
	auth = new ApiAuth(server);
	localStorages['ApiServer'] = serverStorage;
} else {
	server = new TestServer();
	server.localizer = dummyLocalizer;
	//server.delay = 2000;
	server.business = storedBusiness;
	server.register = storedRegister;
	server.maxOrderLoads = 2;

	auth = new TestAuth();
	auth.authenticated = true;
	// auth.authenticated = false;
	// auth.validCode = '1234';
	// auth.delay = 500;
}

const localBusinessStorage = new LocalStorage('hotelcaisse-app@business', Business);
const localRegisterStorage = new LocalStorage('hotelcaisse-app@register', Register);

localStorages['Register'] = localRegisterStorage;
localStorages['Business'] = localBusinessStorage;

// 'First' reader for the Business: takes different readers and returns the data of the first that
// resolves and doesn't return null
let storages = [
	new BusinessServerReader(server),
];
if (useLocalStorage) {
	storages.push(localBusinessStorage);
}
const businessStorage = new FirstReader(storages);

// 'First' reader for the Register: takes different readers and returns the data of the first that
// resolves and doesn't return null
storages = [
	new RegisterServerReader(server),
];
if (useLocalStorage) {
	storages.push(localRegisterStorage);
}
const registerStorage = new FirstReader(storages);

const appConfig = {
	logger,
	plugins: [
		// Autoload the business
		new BusinessAutoload(businessStorage),
		// Autoload the business
		new RegisterAutoload(registerStorage),
		// Auto save Business to server
		new BusinessSaveServer(server),
		// Auto save Register to server
		new RegisterSaveServer(server),
	],
};

if (useLocalStorage) {
	// Autosave plugins to local local writers must be before autoloads, since the latter will
	// load objects that must be saved once loaded

	// Auto save Business to local
	appConfig.plugins.unshift(new BusinessSaveWriter(localBusinessStorage));
	appConfig.plugins.unshift(new RegisterSaveWriter(localRegisterStorage));
}

if (useReal) {
	appConfig.plugins.unshift(new ServerAutoload(serverStorage, server)); // must be first
	appConfig.plugins.unshift(new ApiServerUpdatesListener(server));
	// appConfig.plugins.push(new ApiServerPing(server));
}

const app = new Application(appConfig);
const orderPath = {
	pathname: '/order',
	state: {
		order: dummyOrder(storedBusiness, null, dummyLocalizer),
		new: false,
	},
};
const loadingPath = {
	pathname: '/loading',
	state: {
		redirectWhenLoaded: false,
	},
};

// module.exports instead of export because it is an optional require in index.
module.exports = {
	app,
	logger,
	ordersServer: server,
	// initialRoutes: [loadingPath],
	// initialRoutes: ['/', orderPath],
	// initialRoutes: ['/', '/orders'],
	// initialRoutes: ['/', '/register/manage'],
	uuidGenerator: new UUIDGenerator(),
	auth,
	locale: 'fr-CA',
	currency: 'CAD',
	showConsole: true,
	moneyDenominations: [0.05, 0.1, 0.25, 1, 2, 5, 10, 20, 50, 100],
	localStorages,
	strings: {
		'fr-CA': strings,
	},
};
