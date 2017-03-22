import React, { Component } from 'react';
import { View } from 'react-native';
import { Router } from 'react-router-native';
import { Provider } from 'mobx-react/native';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import UIApp from '../lib/UI';

const propTypes = {
	ui: React.PropTypes.instanceOf(UIApp).isRequired,
};

class UI extends Component {
	render() {
		const stores = this.props.ui.getStores();
		const routes = this.props.ui.routes;
		const history = this.props.ui.history;

		return (
			<Provider {...stores}>
				<Router history={history}>
					<View>
						{routes.map(
							(route, i) => <RouteWithSubRoutes key={i} route={route} />
						)}
					</View>
				</Router>
			</Provider>
		);
	}
}

UI.propTypes = propTypes;

export default UI;
