import Home from './containers/screens/Home';
import Loading from './containers/screens/Loading';
import Authentication from './containers/screens/Authentication';
import OpenRegister from './containers/screens/OpenRegister';
import CloseRegister from './containers/screens/CloseRegister';
import ManageRegister from './containers/screens/ManageRegister';
import OrderItems from './containers/screens/OrderItems';
import CustomerRoomSelections from './containers/screens/CustomerRoomSelections';
import ReviewAndPayments from './containers/screens/ReviewAndPayments';
import Orders from './containers/screens/Orders';

import LoadedGuard from './lib/routeGuards/LoadedGuard';
import AuthenticatedGuard from './lib/routeGuards/AuthenticatedGuard';

import React from 'react';
import { View, Text } from 'react-native';

/**
 * Returns the main route object. See app/lib/routesBuilder for the signature of a route object.
 */
export default ui => ({
	routes: [
		{ path: '/loading', component: Loading },
		{
			guards: [new LoadedGuard(ui, '/loading')],
			routes: [
				{ path: '/authenticate', component: Authentication },
				{ path: '/test', render: () => <View><Text>Test</Text></View> },
				{
					guards: [new AuthenticatedGuard(ui.auth, '/authenticate')],
					routes: [
						{ path: '/', exact: true, component: Home },
						{ path: '/register/open', component: OpenRegister },
						{ path: '/register/close', component: CloseRegister },
						{ path: '/register/manage', component: ManageRegister },
						{ path: '/order/items', component: OrderItems },
						{ path: '/order/customer-roomSelections', component: CustomerRoomSelections },
						{ path: '/order/review-payments', component: ReviewAndPayments },
						{ path: '/orders', component: Orders },
					],
				},
			],
		},
	],
});
