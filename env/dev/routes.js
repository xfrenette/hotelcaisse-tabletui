import Root from '../../app/containers/Root';
import LoadedRoute from '../../app/containers/routes/LoadedRoute';
import AuthenticatedRoute from '../../app/containers/routes/AuthenticatedRoute';
import Home from '../../app/containers/screens/Home';
import Loading from '../../app/components/screens/Loading';
import Authentication from '../../app/components/screens/Authentication';
import OpenRegister from '../../app/containers/screens/OpenRegister';
import CloseRegister from '../../app/containers/screens/CloseRegister';
import ManageRegister from '../../app/containers/screens/ManageRegister';
import NewOrder from '../../app/containers/screens/NewOrder';
import CustomerRoomSelections from '../../app/containers/screens/CustomerRoomSelections';
import TestScreen from './TestScreen';

export default () => ([
	{
		component: Root,
		routes: [
			{
				type: LoadedRoute,
				loadingComponent: Loading,
				routes: [
					{
						type: AuthenticatedRoute,
						authenticationComponent: Authentication,
						routes: [
							{ component: Home, path: '/', exact: true },
							{ component: TestScreen, path: '/test', exact: true },
							{ component: OpenRegister, path: '/register/open' },
							{ component: CloseRegister, path: '/register/close' },
							{ component: ManageRegister, path: '/register/manage' },
							{ component: NewOrder, path: '/orders/new' },
							{ component: CustomerRoomSelections, path: '/orders/customer-roomselections' },
						],
					},
				],
			},
		],
	},
]);
