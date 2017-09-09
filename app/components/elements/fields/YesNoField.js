import React, { Component } from 'react';
import {
	Switch,
	View,
	TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Field as FieldObject } from 'hotelcaisse-app/dist/fields';
import { Text } from '../index';
import styleVars from '../../../styles/variables';

/**
 * Renders an input field based on a Field object
 */

const propTypes = {
	field: PropTypes.instanceOf(FieldObject).isRequired,
	onChangeValue: PropTypes.func,
};

const defaultProps = {
	onChangeValue: null,
};

class YesNoField extends Component {
	get value() {
		console.log(typeof this.props.value, this.props.field.defaultValue);
		return typeof this.props.value === 'number'
			? this.props.value
			: (this.props.field.defaultValue || 0);
	}

	onChange(value) {
		const numValue = value ? 1 : 0;
		if (this.props.onChangeValue) {
			this.props.onChangeValue(numValue);
		}
	}

	onTruePress() {
		this.onChange(true);
	}

	onFalsePress() {
		this.onChange(false);
	}

	render() {
		console.log(this.value);
		const valueBool = !!this.value;

		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => { this.onFalsePress(); }}>
					<View style={viewStyles.leftLabel}>
						<Text style={textStyles.label}>Non</Text>
					</View>
				</TouchableOpacity>
				<Switch
					value={valueBool}
					onValueChange={(v) => { this.onChange(v); }}
					thumbTintColor={styleVars.theme.mainColor}
					onTintColor={styleVars.colors.grey1}
					tintColor={styleVars.colors.grey1}
				/>
				<TouchableOpacity onPress={() => { this.onTruePress(); }}>
					<View style={viewStyles.rightLabel}>
						<Text style={textStyles.label}>Oui</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const viewStyles = {
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftLabel: {
		paddingRight: 10,
	},
	rightLabel: {
		paddingLeft: 10,
	},
};

const textStyles = {
	label: {
		fontSize: styleVars.bigFontSize,
	}
};

YesNoField.propTypes = propTypes;
YesNoField.defaultProps = defaultProps;

export default YesNoField;
