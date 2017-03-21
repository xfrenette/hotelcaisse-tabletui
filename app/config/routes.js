import Root from '../containers/Root';
import Home from '../containers/screens/Home';
import OpenRegister from '../containers/screens/OpenRegister';

export default () => ([
	{
		component: Root,
		routes: [
			{
				component: Home,
				path: '/',
				exact: true,
			},
			{
				component: OpenRegister,
				path: '/register/open',
			},
		],
	},
]);
