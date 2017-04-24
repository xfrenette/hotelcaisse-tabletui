import React, { Component } from 'react';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const styles = {
	Cell: {
		flex: 1,
		paddingHorizontal: styleVars.horizontalRhythm / 2,
	},

	CellFirst: {
		paddingLeft: 0,
	},

	CellLast: {
		paddingRight: 0,
	},
};

const propTypes = {
	children: React.PropTypes.node.isRequired,
	first: React.PropTypes.bool,
	last: React.PropTypes.bool,
	style: View.propTypes.style,
};

const defaultProps = {
	first: false,
	last: false,
	style: null,
};

class Cell extends Component {
	render() {
		const cellStyles = [styles.Cell];

		if (this.props.first) {
			cellStyles.push(styles.CellFirst);
		}

		if (this.props.last) {
			cellStyles.push(styles.CellLast);
		}

		cellStyles.push(this.props.style);

		return (
			<View style={cellStyles}>
				{ this.props.children }
			</View>
		);
	}
}

Cell.propTypes = propTypes;
Cell.defaultProps = defaultProps;

export default Cell;
