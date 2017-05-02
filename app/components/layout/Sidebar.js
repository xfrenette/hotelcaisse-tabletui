import React from 'react';
import { ScrollView } from 'react-native';
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

const Sidebar = props => (
	<ScrollView
		style={[styles.scrollview, props.style]}
		contentContainerStyle={styles.sidebar}
	>
		{ props.children }
	</ScrollView>
);

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

const styles = {
	scrollview: {
		flex: 1,
		backgroundColor: styleVars.colors.darkGrey1,
	},
	sidebar: {
		paddingHorizontal: styleVars.horizontalRhythm * 2,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
};

export default Sidebar;
