import React from 'react';
import { Route } from 'react-router-native';
import GuardedScreen from '../containers/routing/GuardedScreen';

let keyIncrementor = 0;

/**
 * Prepends [guards] the the current list of guards on the route object. If the route has no guards,
 * it will be assigned the [guards].
 *
 * @param {Object} route
 * @param {Array} guards
 */
function prependRouteGuards(route, guards = []) {
	if (!guards.length) {
		return;
	}

	if (!route.guards) {
		route.guards = [...guards];
	} else {
		route.guards.unshift(...guards);
	}
}

/**
 * Takes an array of route objects (see routesBuilder() for object signature) and returns a
 * 'flatten' array of route objects, i.e. where all route objects containing sub-routes (with a
 * [routes] property) are transformed in a flatten array of single level route objects. When
 * flattening, the hierarchy of RouteGuard is applied to each route object.
 *
 * Example : from this array of route objects :
 * [
 * 	{ component: c1, guards: [guard1] }
 * 	{
 * 		guards: [guard2],
 *   		routes: [
 *   			{ component: c2 },
 *   			{ component: c3, guards: [guard3] },
 *   	   ],
 *    },
 * ]
 *
 * will return this :
 * [
 * 	{ component: c1, guards: [guard1] },
 * 	{ component: c2, guards: [guard2] },
 * 	{ component: c3, guards: [guard2, guard3] },
 * ]
 *
 * @param {Array} routes
 * @return {Array}
 */
function flattenRoutes(routes, accumulatedGuards = []) {
	const flatten = [];

	routes.forEach((route) => {
		if (route.routes) {
			const guards = [...accumulatedGuards];
			if (route.guards) {
				guards.push(...route.guards);
			}
			const subRoutes = flattenRoutes(route.routes, guards);
			flatten.push(...subRoutes);
		} else {
			const routeClone = { ...route };
			prependRouteGuards(routeClone, accumulatedGuards);
			flatten.push(routeClone);
		}
	});

	return flatten;
}

/**
 * Returns a unique key (string) for the passed route object.
 *
 * @return {String}
 */
function generateRouteKey() {
	keyIncrementor += 1;
	return `route_${keyIncrementor}`;
}

/**
 * Takes a route object and returns an array of react-router Route components. Note that the
 * <Route> list will not change, it is their content that can change based on the guards (see
 * GuardedScreen).
 *
 * A route object has the following signature:
 * {
 * 	component: Component for the route. Not present if the route has a [routes] property.
 * 	<any react-router Route properties> (ex: path, exact). Not present if the route has a [routes]
 * 		property. All those extra props will be passed as is to the Route component. Note that
 * 		[children] might not work correctly.
 * 	guards: array of RouteGuard instances. Optional. If this route has a [routes] prop, this guard
 * 		will be prepended to the guard property of each route. Else, a GuardedScreen component
 * 		(instead of a Route) will be created with the supplied RouteGuard.
 * 	routes: Array of routes for which the guard will be applied (prepended to their own guard)
 * }
 *
 * Note that even if this object looks like it has a hierarchy, in the end, all the routes will be
 * flatten. The hierarchy only serves to easily share a RouteGuard with multiple routes (the shared
 * RouteGuard will, in fact, be prepended to each 'sub'-routes when flattened).
 *
 * @param {Object} routesDef
 * @return {Array<Node>}
 */
function routesBuilder(routesDef) {
	const routes = flattenRoutes([routesDef]);

	return routes.map((route) => {
		const { guards, ...props } = route;
		const key = generateRouteKey(route);

		if (guards && guards.length) {
			const component = props.component;
			const render = props.render;
			delete props.component;
			props.render = routeProps => (
				<GuardedScreen
					guards={guards}
					component={component}
					render={render}
					{...routeProps}
				/>
			);
		}

		return <Route key={key} {...props} />;
	});
}

export default routesBuilder;
export { flattenRoutes };
