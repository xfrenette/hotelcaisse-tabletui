import React from 'react';
import { Route } from 'react-router-native';

const propTypes = {
	route: React.PropTypes.object.isRequired,
};

const RouteWithSubRoutes = (props) => {
	const { routes, component, type, ...routeProps } = props.route;

	if (component) {
		const RenderedComponent = component;
		routeProps.render = componentProps => (
			<RenderedComponent {...componentProps} routes={routes} />
		);
	}

	const RouteComponent = type || Route;

	if (type) {
		routeProps.routes = routes;
	}

	return <RouteComponent {...routeProps} />;
};

RouteWithSubRoutes.propTypes = propTypes;

export default RouteWithSubRoutes;
