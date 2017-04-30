/* eslint-disable react/no-array-index-key */
import React from 'react';
import { View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Route } from 'react-router-native';
import RouteWithSubRoutes from '../RouteWithSubRoutes';
import { STATES as UI_STATES } from '../../lib/UI';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
	loadingComponent: React.PropTypes.oneOfType([
		React.PropTypes.element,
		React.PropTypes.func,
	]).isRequired,
};

@inject('ui')
@observer
class LoadedRoute extends Route {
	render() {
		if (this.props.ui.state !== UI_STATES.READY) {
			const LoadingComponent = this.props.loadingComponent;
			return <LoadingComponent />;
		}

		return (
			<View style={{ flex: 1 }}>
				{this.props.routes.map(
					(route, i) => <RouteWithSubRoutes key={i} route={route} />
				)}
			</View>
		);
	}
}

LoadedRoute.propTypes = propTypes;

export default LoadedRoute;
