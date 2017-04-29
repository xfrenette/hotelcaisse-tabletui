import React from 'react';
import { View } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: React.PropTypes.node,
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
		paddingVertical: 2 * styleVars.horizontalRhythm,
	},
};

export default MainContent;
