import React, { Component } from 'react';
import { View } from 'react-native';
import { NativeRouter } from 'react-router-native';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
};

class App extends Component {
	render() {
		return (
			<NativeRouter>
				<View>
					{this.props.routes.map(
						(route, i) => <RouteWithSubRoutes key={i} route={route} />
					)}
				</View>
			</NativeRouter>
		);
	}
}

App.propTypes = propTypes;

export default App;
