import React, { Component } from 'react';
import { DrawerLayoutAndroid, TouchableNativeFeedback, View, } from 'react-native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Text, Title } from '../elements';
import styleVars from '../../styles/variables';
import layoutStyles from '../../styles/layout';

const propTypes = {
	children: PropTypes.node.isRequired,
	localizer: PropTypes.instanceOf(Localizer),
	onItemPress: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	onItemPress: null,
};

class AppMenu extends Component {
	/**
	 * Internal reference to the DrawerLayoutAndroid
	 *
	 * @type {Node}
	 */
	drawer = null;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

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

	onItemPress(path) {
		if (this.props.onItemPress) {
			this.props.onItemPress(path);
		}
	}

	renderItem(label, path) {
		return (
			<TouchableNativeFeedback onPress={() => { this.onItemPress(path); }}>
				<View style={styles.item}>
					<Text>{ label }</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	renderTitle(label) {
		return (
			<View style={styles.title}>
				<Title style={layoutStyles.title}>{ label }</Title>
			</View>
		);
	}

	renderDevMenu() {
		return (
			<View style={layoutStyles.block}>
				{ this.renderTitle(this.t('appMenu.dev.title')) }
				{ this.renderItem(this.t('appMenu.dev.localStorages'), '/dev/localStorages')}
				{ this.renderItem(this.t('appMenu.dev.log'), '/dev/log')}
			</View>
		);
	}

	/**
	 * Renders the content of the menu
	 *
	 * @return {Node}
	 */
	renderNavigationView() {
		return (
			<View style={styles.navigation}>
				{ this.renderDevMenu() }
			</View>
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

const styles = {
	navigation: {
		flex: 1,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
	title: {
		paddingHorizontal: styleVars.horizontalRhythm,
	},
	item: {
		paddingHorizontal: styleVars.horizontalRhythm,
		paddingVertical: styleVars.verticalRhythm / 2,
	},
};

AppMenu.propTypes = propTypes;
AppMenu.defaultProps = defaultProps;

export default AppMenu;
