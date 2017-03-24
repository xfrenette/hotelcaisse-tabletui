import createRoutes from './routes';
import TestLoader from '../../tests/mock/TestLoader';
import TestAuth from '../../tests/mock/TestAuth';

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

const testAuth = new TestAuth();
testAuth.authenticated = true;

module.exports = {
	routes: createRoutes(),
	loader: new TestLoader(3000),
	auth: testAuth,
};
