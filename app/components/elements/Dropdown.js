import React, { Component } from 'react';
import {
	View,
	Text,
	Picker,
} from 'react-native';
import styleVars from '../../styles/variables';
const Item = Picker.Item;

const styles = {
	Dropdown: {
		borderWidth: 1,
		borderColor: styleVars.input.borderColor,
		borderRadius: styleVars.input.borderRadius,
		height: styleVars.input.height,
		backgroundColor: styleVars.input.backgroundColor,
	},
	Picker: {
		height: styleVars.input.height - 4,
	},
};

class Dropdown extends Component {
	render() {
		return (
			<View style={styles.Dropdown}>
				<Picker mode="dropdown" style={styles.Picker}>
					{ this.props.children }
				</Picker>
			</View>
		);
	}
}

Dropdown.Option = Picker.Item;

export default Dropdown;
