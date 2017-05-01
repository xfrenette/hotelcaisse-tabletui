import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {
	children: null,
};

const Field = props => (
	<View style={styles.field}>{ props.children }</View>
);

Field.propTypes = propTypes;
Field.defaultProps = defaultProps;

const styles = {
	field: {
		marginBottom: styleVars.verticalRhythm,
	},
};

export default Field;
