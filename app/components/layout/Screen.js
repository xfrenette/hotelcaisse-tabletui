import React from 'react';
import { View } from 'react-native';

const propTypes = {
	children: React.PropTypes.node,
};

const defaultProps = {
	children: null,
};

const Screen = props => (
	<View style={styles.screen}>
		{ props.children }
	</View>
);

Screen.propTypes = propTypes;
Screen.defaultProps = defaultProps;

const styles = {
	screen: {
		flex: 1,
	},
};

export default Screen;
