import Application from 'hotelcaisse-app/dist/Application';
import ApiServer from 'hotelcaisse-app/dist/servers/Api';
import ApiAuth from 'hotelcaisse-app/dist/auth/ApiServer';
import Business from 'hotelcaisse-app/dist/business/Business';
import Register from 'hotelcaisse-app/dist/business/Register';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Business';
import RegisterAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Register';
import ServerAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Server';
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
import TestUUIDGenerator from '../../tests/mock/TestUUIDGenerator';
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
let server;
let auth;
const localStorages = {};
let serverStorage;

const logger = new UILogger();

if (useReal) {
	serverStorage = new LocalStorage('hotelcaisse-app@server');
	server = new ApiServer('http://192.168.1.116:8000/api/1.0/dev');
	server.writer = serverStorage;
	server.setLogger(logger);
	auth = new ApiAuth(server);
	localStorages['ApiServer'] = serverStorage;
} else {
	server = new TestServer();
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
const businessStorage = new FirstReader([
	localBusinessStorage,
	new BusinessServerReader(server),
]);

// 'First' reader for the Register: takes different readers and returns the data of the first that
// resolves and doesn't return null
const registerStorage = new FirstReader([
	localRegisterStorage,
	new RegisterServerReader(server),
]);

const appConfig = {
	logger,
	plugins: [
		// Autoload the business
		new BusinessAutoload(businessStorage),
		// Autoload the business
		new RegisterAutoload(registerStorage),
		// Auto save Business to server
		new BusinessSaveServer(server),
		// Auto save Business to local
		new BusinessSaveWriter(localBusinessStorage),
		// Auto save Register to server
		new RegisterSaveServer(server),
		// Auto save Register to local
		new RegisterSaveWriter(localRegisterStorage),
	],
};

if (serverStorage) {
	appConfig.plugins.unshift(new ServerAutoload(serverStorage, server)); // must be first
}

const app = new Application(appConfig);
const orderPath = {
	pathname: '/order',
	state: {
		order: dummyOrder(storedBusiness),
		new: true,
	},
};

// module.exports instead of export because it is an optional require in index.
module.exports = {
	app,
	logger,
	ordersServer: server,
	// initialRoutes: ['/', '/order'],
	initialRoutes: ['/', orderPath],
	// initialRoutes: ['/', '/register/manage'],
	// initialRoutes: ['/', '/dev/localStorages'],
	uuidGenerator: new TestUUIDGenerator(),
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
