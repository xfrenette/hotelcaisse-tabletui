import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const propTypes = {
	children: PropTypes.node.isRequired,
	first: PropTypes.bool,
	last: PropTypes.bool,
	header: PropTypes.bool,
	style: View.propTypes.style,
	lined: PropTypes.bool,
};

const defaultProps = {
	first: false,
	last: false,
	header: false,
	style: null,
	lined: true,
};

const Row = (props) => {
	const rowStyles = [styles.row];

	if (props.lined) {
		rowStyles.push(styles.lined);
	}

	if (props.first) {
		rowStyles.push(styles.first);
	}

	if (props.last) {
		rowStyles.push(styles.last);
	}

	if (props.header) {
		rowStyles.push(styles.header);
	}

	rowStyles.push(props.style);

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
		paddingTop: (styleVars.verticalRhythm / 2),
		paddingBottom: (styleVars.verticalRhythm / 2) - 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	lined: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lineColor,
	},

	first: {
		borderTopWidth: 0,
		paddingTop: (styleVars.verticalRhythm / 2) - 2,
	},

	last: {
	},

	header: {
		borderBottomWidth: 0,
	},
};

export default Row;
