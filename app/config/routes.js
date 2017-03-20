import Root from '../containers/Root';
import Home from '../containers/screens/Home';

export default () => ([
	{
		component: Root,
		routes: [
			{
				component: Home,
				path: '/',
			},
		],
	},
]);
