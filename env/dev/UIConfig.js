import createRoutes from './routes';
import TestLoader from '../../tests/lib/TestLoader';

module.exports = {
	routes: createRoutes(),
	loader: new TestLoader(3000),
};
