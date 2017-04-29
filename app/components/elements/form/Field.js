import React from 'react';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: React.PropTypes.node,
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
