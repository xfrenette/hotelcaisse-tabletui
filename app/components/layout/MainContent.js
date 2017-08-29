import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: PropTypes.node,
	style: ViewPropTypes.style,
	withSidebar: PropTypes.bool,
	expanded: PropTypes.bool,
};

const defaultProps = {
	children: null,
	style: null,
	withSidebar: false,
	expanded: false,
};

const MainContent = (props) => {
	const style = [styles.mainContent];

	if (props.withSidebar) {
		style.push(styles.withSidebar);
	}

	if (props.expanded) {
		style.push(styles.expanded);
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
	expanded: {
		paddingVertical: styleVars.verticalRhythm,
		paddingHorizontal: styleVars.horizontalRhythm,
	},
};

export default MainContent;
