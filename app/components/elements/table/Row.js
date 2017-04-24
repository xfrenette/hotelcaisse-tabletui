import React, { Component } from 'react';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const styles = {
	Row: {
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
		paddingTop: (styleVars.verticalRhythm / 2) - 1,
		paddingBottom: styleVars.verticalRhythm / 2,
		flexDirection: 'row',
	},

	RowFirst: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lineColor,
		paddingTop: (styleVars.verticalRhythm / 2) - 2,
	},

	RowLast: {
	},
};

const propTypes = {
	children: React.PropTypes.node.isRequired,
	first: React.PropTypes.bool,
	last: React.PropTypes.bool,
};

const defaultProps = {
	first: false,
	last: false,
};

class Row extends Component {
	render() {
		const rowStyles = [styles.Row];

		if (this.props.first) {
			rowStyles.push(styles.RowFirst);
		}

		if (this.props.last) {
			rowStyles.push(styles.RowLast);
		}

		return (
			<View style={rowStyles}>
				{ this.props.children }
			</View>
		);
	}
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
