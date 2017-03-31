import Application from 'hotelcaisse-app';
import BusinessAutoload from 'hotelcaisse-app/dist/plugins/autoload/Business';
import { serialize } from 'serializr';
import createRoutes from './routes';
import storedBusiness from './storedBusiness';
import TestAuth from '../../tests/mock/TestAuth';
import TestReader from '../../tests/mock/TestReader';
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

const businessStorage = new TestReader(serialize(storedBusiness));
businessStorage.delay = 1000;

const testAuth = new TestAuth();
testAuth.authenticated = true;

const appConfig = {
	plugins: [
		new BusinessAutoload([businessStorage]),
	],
};

const app = new Application(appConfig);

// module.exports instead of export because it is an optional require in index.*
module.exports = {
	app,
	routes: createRoutes(),
	auth: testAuth,
	locale: 'fr-CA',
	strings: {
		'fr-CA': strings,
	},
};
