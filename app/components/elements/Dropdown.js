import React from 'react';
import { View, Picker } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: React.PropTypes.node,
};

const defaultProps = {
	children: null,
};

const Dropdown = props => (
	<View style={styles.dropdown}>
		<Picker mode="dropdown" style={styles.picker}>
			{ props.children }
		</Picker>
	</View>
);

Dropdown.Option = Picker.Item;
Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

const styles = {
	dropdown: {
		borderWidth: 1,
		borderColor: styleVars.input.borderColor,
		borderRadius: styleVars.input.borderRadius,
		height: styleVars.input.height,
		backgroundColor: styleVars.input.backgroundColor,
	},
	picker: {
		height: styleVars.input.height - 4,
	},
};

export default Dropdown;
