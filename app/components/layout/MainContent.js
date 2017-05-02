import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

const MainContent = props => (
	<View style={styles.mainContent}>
		{ props.children }
	</View>
);

MainContent.propTypes = propTypes;
MainContent.defaultProps = defaultProps;

const styles = {
	mainContent: {
		paddingHorizontal: styleVars.mainContentSidePadding,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
};

export default MainContent;
