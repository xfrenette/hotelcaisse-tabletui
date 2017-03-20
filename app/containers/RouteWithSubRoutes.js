import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Route } from 'react-router-native';

const propTypes = {
	route: React.PropTypes.object.isRequired,
};

class RouteWithSubRoutes extends Component {
	render() {
		const { routes, component, ...routeProps } = this.props.route;

		if (component) {
			const RouteComponent = component;
			routeProps.render = (props) => <RouteComponent {...props} routes={routes} />;
		}

		return <Route {...routeProps} />;
	}
}

RouteWithSubRoutes.propTypes = propTypes;

export default RouteWithSubRoutes;
