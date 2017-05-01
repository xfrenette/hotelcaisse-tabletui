import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: PropTypes.node.isRequired,
	first: PropTypes.bool,
	last: PropTypes.bool,
};

const defaultProps = {
	first: false,
	last: false,
};

const Row = (props) => {
	const rowStyles = [styles.row];

	if (props.first) {
		rowStyles.push(styles.rowFirst);
	}

	if (props.last) {
		rowStyles.push(styles.rowLast);
	}

	return (
		<View style={rowStyles}>
			{ props.children }
		</View>
	);
};

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

const styles = {
	row: {
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
		paddingTop: (styleVars.verticalRhythm / 2) - 1,
		paddingBottom: styleVars.verticalRhythm / 2,
		flexDirection: 'row',
	},

	rowFirst: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lineColor,
		paddingTop: (styleVars.verticalRhythm / 2) - 2,
	},

	rowLast: {
	},
};

export default Row;
