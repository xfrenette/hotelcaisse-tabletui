/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { View } from 'react-native';
import { inject } from 'mobx-react/native';
import Console from './layout/Console';
import RouteWithSubRoutes from './RouteWithSubRoutes';

const propTypes = {
	routes: React.PropTypes.array.isRequired,
};

@inject('ui')
/* eslint-disable react/prefer-stateless-function */
class Root extends Component {
	render() {
		let consoleComponent = null;

		if (this.props.ui.settings.showConsole) {
			consoleComponent = <Console />;
		}

		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					{this.props.routes.map(
						(route, i) => <RouteWithSubRoutes key={i} route={route} />
					)}
				</View>
				{ consoleComponent }
			</View>
		);
	}
}

Root.propTypes = propTypes;

export default Root;
