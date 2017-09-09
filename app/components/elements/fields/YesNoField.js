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
	/**
	 * First checks it the `field` prop is set (returns true if 1 or '1', else returns
	 * false). If not set, checks if the field's defaultValue is set (returns true if 1 or '1',
	 * else returns false). If none set, returns false;
	 *
	 * @return {boolean}
	 */
	get booleanValue() {
		const value = this.props.value;
		if (typeof value === 'number') {
			return value === 1;
		}

		if (typeof value === 'string') {
			return value === '1';
		}

		return false;
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
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => { this.onFalsePress(); }}>
					<View style={viewStyles.leftLabel}>
						<Text style={textStyles.label}>Non</Text>
					</View>
				</TouchableOpacity>
				<Switch
					value={this.booleanValue}
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
