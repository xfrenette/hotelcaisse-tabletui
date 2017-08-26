import Application from 'hotelcaisse-app/dist/Application';
import Business from 'hotelcaisse-app/dist/business/Business';
import Register from 'hotelcaisse-app/dist/business/Register';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Business';
import RegisterAutoload from 'hotelcaisse-app/dist/plugins/loadOnInit/Register';
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

const server = new TestServer();
//server.delay = 2000;
server.business = storedBusiness;
server.register = storedRegister;
server.maxOrderLoads = 2;

const localBusinessStorage = new LocalStorage('hotelcaisse-app@business', Business);
const localRegisterStorage = new LocalStorage('hotelcaisse-app@register', Register);

const testAuth = new TestAuth();
testAuth.authenticated = true;
// testAuth.authenticated = false;
// testAuth.validCode = '1234';
// testAuth.delay = 500;

const logger = new UILogger();

// 'First' reader for the Business: takes different readers and returns the data of the first that
// resolves and doesn't return null
const businessStorage = new FirstReader([
	//localBusinessStorage,
	new BusinessServerReader(server),
]);

// 'First' reader for the Register: takes different readers and returns the data of the first that
// resolves and doesn't return null
const registerStorage = new FirstReader([
	//localRegisterStorage,
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

const app = new Application(appConfig);
const orderPath = {
	pathname: '/order/review-payments',
	state: {
		order: dummyOrder(storedBusiness),
		new: false,
	},
};

// module.exports instead of export because it is an optional require in index.
module.exports = {
	app,
	logger,
	ordersServer: server,
	// initialRoutes: ['/', '/orders'],
	// initialRoutes: ['/', orderPath],
	// initialRoutes: ['/', '/register/manage'],
	initialRoutes: ['/', '/order/items'],
	uuidGenerator: new TestUUIDGenerator(),
	auth: testAuth,
	locale: 'fr-CA',
	currency: 'CAD',
	showConsole: true,
	moneyDenominations: [0.05, 0.1, 0.25, 1, 2, 5, 10, 20, 50, 100],
	strings: {
		'fr-CA': strings,
	},
};
