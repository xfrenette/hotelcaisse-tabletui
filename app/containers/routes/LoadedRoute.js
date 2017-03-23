import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import RouteWithSubRoutes from '../RouteWithSubRoutes';
import { STATES as UI_STATES } from '../../lib/UI';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
	loadingComponent: React.PropTypes.oneOfType([
		React.PropTypes.element,
		React.PropTypes.func,
	]).isRequired
};

@inject('ui')
@observer
class LoadedRoute extends Component {
	render() {
		if (this.props.ui.state !== UI_STATES.READY) {
			const LoadingComponent = this.props.loadingComponent;
			return <LoadingComponent />;
		} else {
			return (
				<View style={{ flex: 1 }}>
					{this.props.routes.map(
						(route, i) => <RouteWithSubRoutes key={i} route={route} />
					)}
				</View>
			);
		}
	}
}

LoadedRoute.propTypes = propTypes;

export default LoadedRoute;
