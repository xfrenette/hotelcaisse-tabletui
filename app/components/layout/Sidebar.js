import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import styleVars from '../../styles/variables';

const propTypes = {
	style: ScrollView.propTypes.style,
	children: PropTypes.node,
};

const defaultProps = {
	style: null,
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

		return (
			<View style={[styles.scrollview, style]}>
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
	scrollview: {
		backgroundColor: styleVars.colors.darkGrey1,
	},
	sidebar: {
		paddingHorizontal: styleVars.horizontalRhythm,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
};

export default Sidebar;
