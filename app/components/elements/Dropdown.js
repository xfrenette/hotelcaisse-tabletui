import React from 'react';
import PropTypes from 'prop-types';
import { Picker, View, ViewPropTypes } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	children: PropTypes.node,
	style: ViewPropTypes.style,
};

const defaultProps = {
	children: null,
	style: null,
};

const Dropdown = (props) => {
	const { style, children, ...otherProps } = props;

	return (
		<View style={[styles.dropdown, style]}>
			<Picker mode="dropdown" style={styles.picker} {...otherProps}>
				{ children }
			</Picker>
		</View>
	);
};

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
