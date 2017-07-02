import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-native';
import { Provider } from 'mobx-react/native';
import Root from './Root';
import UIApp from '../lib/UI';

const propTypes = {
	ui: PropTypes.instanceOf(UIApp).isRequired,
};

const UI = (props) => {
	const stores = props.ui.getStores();
	const routes = props.ui.buildRouteComponents();
	const history = props.ui.history;

	return (
		<Provider {...stores}>
			<Router history={history}>
				<Root>
					{ routes }
				</Root>
			</Router>
		</Provider>
	);
};

UI.propTypes = propTypes;

export default UI;
