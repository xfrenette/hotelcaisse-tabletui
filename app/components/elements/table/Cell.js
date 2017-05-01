import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: PropTypes.node.isRequired,
	first: PropTypes.bool,
	last: PropTypes.bool,
	style: View.propTypes.style,
};

const defaultProps = {
	first: false,
	last: false,
	style: null,
};

const Cell = (props) => {
	const cellStyles = [styles.cell];

	if (props.first) {
		cellStyles.push(styles.cellFirst);
	}

	if (props.last) {
		cellStyles.push(styles.cellLast);
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
		flex: 1,
		paddingHorizontal: styleVars.horizontalRhythm / 2,
	},

	cellFirst: {
		paddingLeft: 0,
	},

	cellLast: {
		paddingRight: 0,
	},
};

export default Cell;
