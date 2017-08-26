import React, { Component } from 'react';
import { ScrollView, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import styleVars from '../../styles/variables';

const propTypes = {
	style: ViewPropTypes.style,
	dark: PropTypes.bool,
	children: PropTypes.node,
};

const defaultProps = {
	style: null,
	dark: false,
	children: null,
};

class Sidebar extends Component {
	/**
	 * Internal references to Components
	 *
	 * @type {Object}
	 */
	nodeRefs = {};

	/**
	 * Scrolls the ScrollView to the top (no animation)
	 */
	scrollTop() {
		this.nodeRefs.scrollView.scrollTo({ x: 0, y: 0, animated: false });
	}

	render() {
		const { style, children, ...otherProps } = this.props;
		const containerStyles = [style];

		if (this.props.dark) {
			containerStyles.push(styles.dark);
		}

		return (
			<View style={containerStyles}>
				<ScrollView
					ref={(node) => { this.nodeRefs.scrollView = node; }}
					contentContainerStyle={styles.sidebar}
					{...otherProps}
				>
					{ children }
				</ScrollView>
			</View>
		);
	}
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

const styles = {
	dark: {
		backgroundColor: styleVars.colors.darkGrey1,
	},
	sidebar: {
		paddingHorizontal: styleVars.horizontalRhythm,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
};

export default Sidebar;
