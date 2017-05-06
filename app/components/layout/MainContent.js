import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: PropTypes.node,
	style: View.propTypes.style,
	withSidebar: PropTypes.bool,
};

const defaultProps = {
	children: null,
	style: null,
	withSidebar: false,
};

const MainContent = (props) => {
	const style = [styles.mainContent];

	if (props.withSidebar) {
		style.push(styles.withSidebar);
	}

	style.push(props.style);

	return (
		<View style={style}>
			{ props.children }
		</View>
	);
};

MainContent.propTypes = propTypes;
MainContent.defaultProps = defaultProps;

const styles = {
	mainContent: {
		paddingHorizontal: styleVars.mainContentSidePadding,
		paddingVertical: styleVars.verticalRhythm * 2,
	},
	withSidebar: {
		paddingRight: styleVars.horizontalRhythm,
	},
};

export default MainContent;
