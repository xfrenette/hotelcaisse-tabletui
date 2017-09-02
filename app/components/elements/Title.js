import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text';
import styleVars from '../../styles/variables';

const propTypes = {
	style: Text.propTypes.style,
	children: PropTypes.node.isRequired,
};

const defaultProps = {
	style: null,
};

const Title = (props) => {
	const text = String(props.children).toUpperCase();
	return <Text style={[styles.title, props.style]}>{ text }</Text>;
};

Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

const styles = {
	title: {
		fontSize: 15,
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
		borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.mainColor,
		top: -2,
	},
};

export default Title;
