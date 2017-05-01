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

const BottomBar = props => (
	<View style={styles.bottomBar}>
		{ props.children }
	</View>
);

BottomBar.propTypes = propTypes;
BottomBar.defaultProps = defaultProps;

const styles = {
	bottomBar: {
		backgroundColor: styleVars.colors.lightGrey1,
		height: styleVars.verticalRhythm * 3,
		borderTopWidth: 1,
		borderTopColor: styleVars.colors.grey1,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: styleVars.sidePadding,
	},
};

export default BottomBar;
