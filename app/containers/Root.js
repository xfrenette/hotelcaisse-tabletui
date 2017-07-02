import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject } from 'mobx-react/native';
import Console from './layout/Console';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
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
					{this.props.children}
				</View>
				{ consoleComponent }
			</View>
		);
	}
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

export default Root;
