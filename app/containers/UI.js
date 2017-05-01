/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Router } from 'react-router-native';
import { Provider } from 'mobx-react/native';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import UIApp from '../lib/UI';

const propTypes = {
	ui: PropTypes.instanceOf(UIApp).isRequired,
};

const UI = (props) => {
	const stores = props.ui.getStores();
	const routes = props.ui.routes;
	const history = props.ui.history;

	return (
		<Provider {...stores}>
			<Router history={history}>
				<View style={{ flex: 1 }}>
					{routes.map(
						(route, i) => <RouteWithSubRoutes key={i} route={route} />
					)}
				</View>
			</Router>
		</Provider>
	);
};

UI.propTypes = propTypes;

export default UI;
