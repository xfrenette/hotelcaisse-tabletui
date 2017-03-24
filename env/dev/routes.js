import Root from '../../app/containers/Root';
import LoadedRoute from '../../app/containers/routes/LoadedRoute';
import Home from '../../app/containers/screens/Home';
import Loading from '../../app/components/screens/Loading';
import OpenRegister from '../../app/containers/screens/OpenRegister';

export default () => ([
	{
		component: Root,
		routes: [
			{
				type: LoadedRoute,
				loadingComponent: Loading,
				routes: [
					{ component: Home, path: '/', exact: true },
				],
			},
		],
	},
]);
