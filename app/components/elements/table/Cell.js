import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: PropTypes.node,
	first: PropTypes.bool,
	last: PropTypes.bool,
	compact: PropTypes.bool,
	header: PropTypes.bool,
	style: View.propTypes.style,
};

const defaultProps = {
	first: false,
	last: false,
	compact: false,
	header: false,
	style: null,
	children: null,
};

const Cell = (props) => {
	const cellStyles = [props.compact ? styles.compact : styles.cell];

	if (props.first) {
		cellStyles.push(styles.first);
	}

	if (props.last) {
		cellStyles.push(styles.last);
	}


	cellStyles.push(props.style);

	return (
		<View style={cellStyles}>
			{ props.children }
		</View>
	);
};

Cell.propTypes = propTypes;
Cell.defaultProps = defaultProps;

const styles = {
	cell: {
		paddingHorizontal: styleVars.horizontalRhythm / 2,
	},
	compact: {
		paddingHorizontal: styleVars.horizontalRhythm / 4,
	},
	first: {
		paddingLeft: 0,
	},
	last: {
		paddingRight: 0,
	},
};

export default Cell;
