import React, { Component } from 'react';
import { View, DrawerLayoutAndroid } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '../../elements';

const propTypes = {
	children: PropTypes.node.isRequired,
};

const defaultProps = {
};

class AppMenu extends Component {
	/**
	 * Internal reference to the DrawerLayoutAndroid
	 *
	 * @type {Node}
	 */
	drawer = null;

	/**
	 * Opens the drawer
	 */
	open() {
		this.drawer.openDrawer();
	}

	/**
	 * Closes the drawer
	 */
	close() {
		this.drawer.closeDrawer();
	}

	/**
	 * Renders the content of the menu
	 *
	 * @return {Node}
	 */
	renderNavigationView() {
		return (
			<View style={{ flex: 1 }} />
		);
	}

	render() {
		return (
			<DrawerLayoutAndroid
				ref={(node) => { this.drawer = node; }}
				drawerPosition={DrawerLayoutAndroid.positions.Right}
				drawerWidth={300}
				renderNavigationView={() => this.renderNavigationView()}
			>
				{ this.props.children }
			</DrawerLayoutAndroid>
		);
	}
}

AppMenu.propTypes = propTypes;
AppMenu.defaultProps = defaultProps;

export default AppMenu;
