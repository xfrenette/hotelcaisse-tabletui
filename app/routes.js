import Home from './containers/screens/Home';
import Loading from './containers/screens/Loading';
import LocalStorages from './containers/screens/dev/LocalStorages';
import Authentication from './containers/screens/Authentication';
import OpenRegister from './containers/screens/OpenRegister';
import CloseRegister from './containers/screens/CloseRegister';
import ManageRegister from './containers/screens/ManageRegister';
import OrderItems from './containers/screens/OrderItems';
import CustomerRoomSelections from './containers/screens/CustomerRoomSelections';
import ReviewAndPayments from './containers/screens/reviewAndPayments/Container';
import Orders from './containers/screens/Orders';

import LoadedGuard from './lib/routeGuards/LoadedGuard';
import AuthenticatedGuard from './lib/routeGuards/AuthenticatedGuard';
import RegisterOpenedGuard from './lib/routeGuards/RegisterOpenedGuard';
import RegisterNotOpenedGuard from './lib/routeGuards/RegisterNotOpenedGuard';

/**
 * Returns the main route object. See app/lib/routesBuilder for the signature of a route object.
 */
export default ui => ({
	routes: [
		{ path: '/loading', component: Loading },
		{ path: '/dev/localStorages', component: LocalStorages },
		{
			guards: [new LoadedGuard(ui, '/loading')],
			routes: [
				{ path: '/authenticate', component: Authentication },
				{
					guards: [new AuthenticatedGuard(ui.auth, '/authenticate')],
					routes: [
						{ path: '/', exact: true, component: Home },
						{ path: '/orders', component: Orders },
						{ path: '/order/review-payments', component: ReviewAndPayments },
						{ path: '/order/items', component: OrderItems },
						{ path: '/order/customer-roomSelections', component: CustomerRoomSelections },
						{
							guards: [new RegisterOpenedGuard(ui.app.register)],
							routes: [
								{ path: '/register/close', component: CloseRegister },
								{ path: '/register/manage', component: ManageRegister },
							],
						},
						{
							guards: [new RegisterNotOpenedGuard(ui.app.register)],
							routes: [
								{ path: '/register/open', component: OpenRegister },
							],
						},
					],
				},
			],
		},
	],
});
