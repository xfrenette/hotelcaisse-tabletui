import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
};

class Root extends Component {
	render() {
		return (
			<View>
				{this.props.routes.map(
					(route, i) => <RouteWithSubRoutes key={i} route={route} />
				)}
			</View>
		);
	}
}

Root.propTypes = propTypes;

export default Root;
