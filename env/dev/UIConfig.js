import Application from 'hotelcaisse-app';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/autoload/Business';
import { serialize } from 'serializr';
import storedBusiness from './storedBusiness';
import UILogger from '../../app/lib/UILogger';
import TestAuth from '../../tests/mock/TestAuth';
import TestReader from '../../tests/mock/TestReader';
import TestServer from '../../tests/mock/TestServer';
import dummyOrder from '../../tests/mock/dummyOrder';
import TestUUIDGenerator from '../../tests/mock/TestUUIDGenerator';
import strings from '../../locales/fr-CA';

/*
Examples :

// Authentication that fails because of an error
const testAuth = new TestAuth(false);

// Authentication with a specific valid code waiting 2 secs before validating
const testAuth = new TestAuth();
testAuth.authenticated = false;
testAuth.validCode = '1234';
testAuth.delay = 2000;

*/
const serializedData = serialize(storedBusiness);
const businessStorage = new TestReader(serializedData);
// businessStorage.delay = 1000;

const testAuth = new TestAuth();
// testAuth.authenticated = true;
testAuth.authenticated = false;
testAuth.validCode = '1234';
testAuth.delay = 500;

const logger = new UILogger();

const appConfig = {
	logger,
	plugins: [
		new BusinessAutoload([businessStorage]),
	],
};

const app = new Application(appConfig);
const orderPath = {
	pathname: '/order/review-payments',
	state: {
		order: dummyOrder(storedBusiness),
		new: true,
	},
};

const server = new TestServer();
server.delay = 2000;
server.business = storedBusiness;
server.maxOrderLoads = 2;

// module.exports instead of export because it is an optional require in index.
module.exports = {
	app,
	logger,
	ordersServer: server,
	// initialRoutes: ['/', '/orders'],
	// initialRoutes: ['/', orderPath],
	initialRoutes: ['/', '/register/manage'],
	// initialRoutes: ['/', '/register/open'],
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
