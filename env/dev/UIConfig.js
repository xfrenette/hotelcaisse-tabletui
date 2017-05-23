import Application from 'hotelcaisse-app';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/autoload/Business';
import { serialize } from 'serializr';
import createRoutes from './routes';
import storedBusiness from './storedBusiness';
import UILogger from '../../app/lib/UILogger';
import TestAuth from '../../tests/mock/TestAuth';
import TestReader from '../../tests/mock/TestReader';
import TestUUIDGenerator from '../../tests/mock/TestUUIDGenerator';
import strings from '../../locales/fr-CA';

/*
Examples :

// Authentication that always fail
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
testAuth.authenticated = true;

const logger = new UILogger();

const appConfig = {
	logger,
	plugins: [
		new BusinessAutoload([businessStorage]),
	],
};

const app = new Application(appConfig);

// module.exports instead of export because it is an optional require in index.*
module.exports = {
	app,
	logger,
	routes: createRoutes(),
	// initialRoutes: ['/test'],
	initialRoutes: ['/', '/orders/customer-roomselections'],
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
