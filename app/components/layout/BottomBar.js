import React, { Component } from 'react';
import {
	View,
	Text,
} from 'react-native';
import styleVars from '../../styles/variables';

const styles = {
	BottomBar: {
		backgroundColor: styleVars.colors.lightGrey1,
		height: styleVars.verticalRhythm * 3,
		borderTopWidth: 1,
		borderTopColor: styleVars.colors.grey1,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: styleVars.sidePadding,
	},
};

class BottomBar extends Component {
	render() {
		return (
			<View style={styles.BottomBar}>
				{ this.props.children }
			</View>
		);
	}
}

export default BottomBar;
