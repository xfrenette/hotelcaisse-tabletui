import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Route } from 'react-router-native';

const propTypes = {
	route: React.PropTypes.object.isRequired,
};

class RouteWithSubRoutes extends Component {
	render() {
		const { routes, component, type, ...routeProps } = this.props.route;

		if (component) {
			const RenderedComponent = component;
			routeProps.render = (props) => <RenderedComponent {...props} routes={routes} />;
		}

		const RouteComponent = type || Route;

		if (type) {
			routeProps.routes = routes;
		}

		return <RouteComponent {...routeProps} />;
	}
}

RouteWithSubRoutes.propTypes = propTypes;

export default RouteWithSubRoutes;
