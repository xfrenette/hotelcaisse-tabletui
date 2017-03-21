import React, { Component } from 'react';
import { View } from 'react-native';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-native';
import { Provider } from 'mobx-react/native';
import { RouterStore, syncHistoryWithStore } from '../lib/mobx-react-router';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
};

const routingStore = new RouterStore();

const stores = {
	routing: routingStore,
};

const history = syncHistoryWithStore(createMemoryHistory(), routingStore);

class App extends Component {
	getStores() {
		return stores;
	}

	render() {
		return (
			<Provider {...this.getStores()}>
				<Router history={history}>
					<View>
						{this.props.routes.map(
							(route, i) => <RouteWithSubRoutes key={i} route={route} />
						)}
					</View>
				</Router>
			</Provider>
		);
	}
}

App.propTypes = propTypes;

export default App;
