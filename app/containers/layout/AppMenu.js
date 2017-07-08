import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import AppMenuComponent from '../../components/layout/AppMenu';

const propTypes = {
	children: PropTypes.node.isRequired,
};

const defaultProps = {
};

@inject('router', 'localizer')
class AppMenu extends Component {
	appMenu = null;

	/**
	 * Opens the AppMenu
	 */
	open() {
		this.appMenu.open();
	}

	/**
	 * Closes the AppMenu
	 */
	close() {
		this.appMenu.close();
	}

	onItemPress(path) {
		this.props.router.push(path);
	}

	render() {
		return (
			<AppMenuComponent
				ref={(node) => { this.appMenu = node; }}
				localizer={this.props.localizer}
				onItemPress={(path) => { this.onItemPress(path); }}
			>
				{ this.props.children }
			</AppMenuComponent>
		);
	}
}

AppMenu.propTypes = propTypes;
AppMenu.defaultProps = defaultProps;

export default AppMenu;
