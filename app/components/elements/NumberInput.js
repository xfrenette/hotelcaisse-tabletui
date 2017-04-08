import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import escapeStringRegexp from 'escape-string-regexp';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TextInput from './TextInput';
import styleVars from '../../styles/variables';

const incrementorButtonWidth = 30;

const styles = {
	TextInput: {
		textAlign: 'center',
		zIndex: 1,
	},
	IncrementButton: {
		position: 'absolute',
		top: 1,
		zIndex: 2,
		height: styleVars.input.height - 2,
		justifyContent: 'center',
	},
	IncrementButtonIcon: {
		lineHeight: 10,
		fontSize: 12,
		width: incrementorButtonWidth,
		textAlign: 'center',
		alignSelf: 'center',
		color: styleVars.theme.mainColor,
	},
	IncrementButtonMore: {
		right: 1,
		borderLeftWidth: 1,
		borderLeftColor: styleVars.theme.lineColor,
	},
	IncrementButtonLess: {
		left: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lineColor,
	},
};

const propTypes = {
	value: React.PropTypes.number,
	style: TextInput.propTypes.style,
	type: React.PropTypes.string,
	maxDecimals: React.PropTypes.number,
	showIncrementors: React.PropTypes.bool,
	onChangeValue: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer),
};

const defaultProps = {
	value: null,
	style: null,
	type: null,
	maxDecimals: Infinity,
	onChangeValue: null,
	localizer: null,
	showIncrementors: false,
};

@observer
class NumberInput extends Component {
	/**
	 * Text displayed in the text field.
	 *
	 * @type {String}
	 */
	@observable
	inputText = '';
	/**
	 * Value (number) currently in the text field.
	 *
	 * @type {Number}
	 */
	inputValue = null;
	/**
	 * Holds the incrementors element. This object exists to have a cache and not have to re-render
	 * them at each render()
	 *
	 * @type {Object}
	 */
	incrementors = {
		less: null,
		more: null,
	};

	constructor(props) {
		super(props);

		this.inputValue = this.props.value;
		this.updateInputText();

		if (this.props.showIncrementors) {
			this.createIncrementors();
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.value !== this.inputValue) {
			const newValue = this.applyValueFilters(newProps.value);

			if (newValue !== this.inputValue) {
				this.updateInputText();
			}
		}
	}

	onChangeText(text) {
		const newValue = this.parseValue(text);
		this.tryChangeValue(newValue, text);
	}

	getTextInputStyles() {
		const textInputStyles = {
			...styles.TextInput,
		};

		// If we have incrementors, adjust the padding on the text input
		if (this.props.showIncrementors) {
			const maskedWidth = incrementorButtonWidth - styleVars.input.sidePadding;
			textInputStyles.paddingHorizontal = maskedWidth + 4;
		}

		return textInputStyles;
	}

	tryChangeValue(value, textModel) {
		const newValue = this.applyValueFilters(value);

		// If the newValue is different from previous, we trigger a onChangeValue
		if (newValue !== this.inputValue) {
			this.inputValue = newValue;

			if (this.props.onChangeValue) {
				this.props.onChangeValue(newValue);
			}
		}

		this.updateInputText(textModel);
	}

	parseValue(text) {
		if (typeof text !== 'string') {
			return null;
		}

		let cleanedText = text;
		const decimalSeparator = this.getDecimalSeparator();
		const escapedDecimalSeparator = escapeStringRegexp(decimalSeparator);
		const decimalSeparatorPlaceholder = decimalSeparator === '@' ? '!' : '@';

		// First pass : remove any characters not a number, - or the decimal separator
		const firstPassRegExp = new RegExp(`[^0-9-${escapedDecimalSeparator}]`, 'g');
		cleanedText = cleanedText.replace(firstPassRegExp, '');

		// Takes note if number is negative (starts with a '-')
		const negativity = cleanedText[0] === '-' ? -1 : 1;

		// Replace the last decimal separator by a placeholder
		// Ex if decimal separator is ',', replaces '12,23,5' by '12,23@5'
		const replaceLastDecimalRegExp = new RegExp(`${escapedDecimalSeparator}([^${escapedDecimalSeparator}]*)$`);
		cleanedText = cleanedText.replace(replaceLastDecimalRegExp, `${decimalSeparatorPlaceholder}$1`);

		// Second pass, keep only numbers and the decimal separator placeholder
		const secondPassRegExp = new RegExp(`[^0-9${decimalSeparatorPlaceholder}]`, 'g');
		cleanedText = cleanedText.replace(secondPassRegExp, '');

		// Replace the decimal separator by a '.' (there should be just one decimal separator)
		cleanedText = cleanedText.replace(decimalSeparatorPlaceholder, '.');

		const number = Number.parseFloat(cleanedText);

		if (Number.isNaN(number)) {
			return null;
		}

		return number * negativity;
	}

	applyValueFilters(value) {
		// Based on this.props, limit the value and returns it
		// - If integer only
		// - If has to be greater than
		// - If has to be less than
		// - If number of decimal is limited
		return value;
	}

	updateInputText(textModel = null) {
		let text = '';

		if (textModel) {
			text = this.formatValueUsingModel(this.inputValue, textModel);
		} else {
			text = this.formatValue(this.inputValue);
		}

		this.inputText = text;
	}

	formatValue(value) {
		if (typeof value !== 'number') {
			return '';
		}

		if (this.props.localizer) {
			const formatterOptions = {
				useGrouping: false,
				maximumFractionDigits: 20,
			};
			return this.props.localizer.formatNumber(value, formatterOptions);
		}

		return `${value}`;
	}

	formatValueUsingModel(value, model) {
		const decimalSeparator = this.getDecimalSeparator();
		const escapedDecimalSeparator = escapeStringRegexp(decimalSeparator);

		if (value === null) {
			if (model === '-') {
				return '-';
			}

			// If the model is only the decimal separator, we prepend it with 0
			if (model === decimalSeparator) {
				return `0${decimalSeparator}`;
			}
		}

		let formatted = this.formatValue(value);

		// If model ends with trailing decimal separator or with a decimal followed by only zeros, we
		// keep the zeros
		let trailingDecimalSeparator = '';
		const trailingDecimalRegExp = new RegExp(`${escapedDecimalSeparator}0*$`);
		if (trailingDecimalRegExp.test(model)) {
			trailingDecimalSeparator = decimalSeparator;
		}

		// If model ends with trailing zeros, we add them
		let trailingZeros = '';
		const trailingZerosRegExp = new RegExp(`${escapedDecimalSeparator}([0-9]*[1-9])?(0+)$`);
		const trailingZerosRes = trailingZerosRegExp.exec(model);
		if (trailingZerosRes) {
			trailingZeros = trailingZerosRes[2];
		}

		// If value is 0 and model starts with a 0, we prepend a minus before
		let negativity = '';
		if (value === 0 && model[0] === '-') {
			negativity = '-';
		}

		return `${negativity}${formatted}${trailingDecimalSeparator}${trailingZeros}`;
	}

	/**
	 * Returns the decimal separator character used and to use in the text input. Used the localizer.
	 * If no localizer is set, returns '.'.
	 *
	 * @return {String}
	 */
	getDecimalSeparator() {
		if (this.props.localizer) {
			return this.props.localizer.getDecimalSeparator();
		}

		return '.';
	}

	incrementValue(type) {
		const currentValue = typeof this.inputValue === 'number' ? this.inputValue : 0;
		this.tryChangeValue(currentValue + type, this.inputText);
	}

	createIncrementors() {
		this.incrementors = {
			less: this.renderIncrementor(-1),
			more: this.renderIncrementor(1),
		};
	}

	getTextInputPreText() {
		if (this.props.type !== 'money') {
			return '';
		}

		if (!this.props.localizer) {
			return '';
		}

		if (this.props.localizer.getCurrencySymbolPosition() === -1) {
			return this.props.localizer.getCurrencySymbol();
		}

		return '';
	}

	getTextInputPostText() {
		if (this.props.type !== 'money') {
			return '';
		}

		if (!this.props.localizer) {
			return '';
		}

		if (this.props.localizer.getCurrencySymbolPosition() === 1) {
			return this.props.localizer.getCurrencySymbol();
		}

		return '';
	}


	/**
	 * Rendering function to render the "more" and "less" button. For a "more", pass 1, for a less,
	 * pass -1.
	 *
	 * @param {Number} type
	 * @return {Component}
	 */
	renderIncrementor(type) {
		const iconName = type === 1 ? 'plus' : 'minus';
		const buttonStyle = [styles.IncrementButton];

		if (type === 1) {
			buttonStyle.push(styles.IncrementButtonMore);
		} else {
			buttonStyle.push(styles.IncrementButtonLess);
		}

		const icon = <Icon name={iconName} style={styles.IncrementButtonIcon} />;

		return (
			<TouchableHighlight
				style={buttonStyle}
				underlayColor={styleVars.colors.grey1}
				onPress={() => { this.incrementValue(type); }}
			>
				{ icon }
			</TouchableHighlight>
		);
	}

	/**
	 * Main rendering method. Renders a text input with the "more" and "less" buttons.
	 *
	 * @return {Component}
	 */
	render() {
		const { value, ...other } = this.props;
		const style = [this.getTextInputStyles(), this.props.style];
		const preText = this.getTextInputPreText();
		const postText = this.getTextInputPostText();

		return (
			<View>
				{ this.incrementors.more }
				{ this.incrementors.less }
				<TextInput
					{...other}
					value={this.inputText}
					style={style}
					keyboardType="numeric"
					onChangeText={(text) => { this.onChangeText(text); }}
					disableFullscreenUI
					preText={preText}
					postText={postText}
				/>
			</View>
		);
	}
}

NumberInput.propTypes = propTypes;
NumberInput.defaultProps = defaultProps;

export default NumberInput;
