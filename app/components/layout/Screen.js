import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const propTypes = {
	children: PropTypes.node,
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
