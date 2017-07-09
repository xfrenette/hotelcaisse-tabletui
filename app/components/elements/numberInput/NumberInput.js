import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import escapeStringRegexp from 'escape-string-regexp';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import validate from 'hotelcaisse-app/dist/Validator';
import TextInput from '../TextInput';
import Incrementor from './Incrementor';
import styleVars from '../../../styles/variables';

const propTypes = {
	value: PropTypes.number,
	acceptDotAsDecimal: PropTypes.bool,
	style: TextInput.propTypes.style,
	type: PropTypes.string,
	showIncrementors: PropTypes.bool,
	onChangeValue: PropTypes.func,
	localizer: PropTypes.instanceOf(Localizer),
	constraints: PropTypes.object,
};

const defaultProps = {
	value: null,
	acceptDotAsDecimal: false,
	style: null,
	type: null,
	onChangeValue: null,
	localizer: null,
	showIncrementors: false,
	constraints: null,
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
	 * Reference to the TextInput node
	 *
	 * @type {TextInput}
	 */
	textInputNode = null;
	/**
	 * Decimal separator to use
	 *
	 * @type {String}
	 */
	decimalSeparator = '.';

	componentWillMount() {
		this.saveDecimalSeparator(this.props.localizer);
		this.updateInputText(this.props.value);
	}

	componentWillReceiveProps(newProps) {
		// If the value changed, update the text input
		if (newProps.value !== this.props.value) {
			this.updateInputText(newProps.value);
		}

		// If the localizer changed, update the decimal separator
		if (newProps.localizer !== this.props.localizer) {
			this.saveDecimalSeparator(newProps.localizer);
		}
	}

	/**
	 * Called when the text input text changes. Parses the text and calls tryChangeValue
	 *
	 * @param {string} text
	 */
	onChangeText(text) {
		const newValue = this.parseValue(text);

		if (newValue !== this.props.value) {
			// If the value changed
			this.tryChangeValue(newValue);
		} else if (this.textIsValid(text)) {
			// If the value didn't change but it is a valid displayable text, we update the input text
			let inputText = text;

			if (this.props.acceptDotAsDecimal && this.decimalSeparator !== '.') {
				inputText = inputText.replace('.', this.decimalSeparator);
			}

			this.inputText = inputText;
		}
	}

	/**
	 * Saves in decimalSeparator the one used by the localizer. If no localizer, defaults to dot '.'.
	 *
	 * @param {[type]} localizer
	 * @return {[type]}
	 */
	saveDecimalSeparator(localizer) {
		this.decimalSeparator = localizer ? localizer.getDecimalSeparator() : '.';
	}

	/**
	 * Updates the text of the text input with the value
	 *
	 * @param {Number} value
	 */
	updateInputText(value) {
		this.inputText = this.formatValue(value);
	}

	/**
	 * Call this function to focus in the field.
	 */
	focus() {
		this.textInputNode.focus();
	}

	/**
	 * Returns styles for the text input. The styles changes if we have incrementors or not.
	 *
	 * @return {object}
	 */
	getTextInputStyles() {
		const textInputStyles = {
			...styles.textInput,
		};

		// If we have incrementors, adjust the padding on the text input
		if (this.props.showIncrementors) {
			const maskedWidth = incrementorButtonWidth - styleVars.input.sidePadding;
			textInputStyles.paddingHorizontal = maskedWidth + 4;
		}

		return textInputStyles;
	}

	/**
	 * When the value changed (value is valid)
	 *
	 * @param {Number} value
	 */
	onChangeValue(value) {
		if (this.props.onChangeValue) {
			this.props.onChangeValue(value);
		}
	}

	/**
	 * Parses the text and returns the number it found. Else returns null.
	 *
	 * @param {String} text
	 * @return {Number}
	 */
	parseValue(text) {
		if (typeof text !== 'string') {
			return null;
		}

		let cleanedText = text;

		// Replace the decimalSeparator with a dot to parse
		cleanedText = text.replace(this.decimalSeparator, '.');

		const number = Number.parseFloat(cleanedText);

		if (Number.isNaN(number)) {
			return null;
		}

		return number;
	}

	/**
	 * Returns true if the value respects the restrictions received
	 *
	 * @param {Number} value
	 * @return {Boolean}
	 */
	valueIsValid(value) {
		const constraints = this.props.constraints || {};

		if (typeof constraints.numericality !== 'object') {
			constraints.numericality = {};
		}

		constraints.numericality.noStrings = true;

		return validate({ value }, { value: constraints }) === undefined;
	}

	/**
	 * Validate that the text is valid text to show. A valid text is a regular number (ex: "2.23") or
	 * a valid number being constructed :
	 * - A single minus ("-")
	 * - A single 0 ("0", "-0")
	 * - A number followed by a decimal separator ("-2.", "0.")
	 * - A number with trailing zeros as decimal ("-2.98000", "0.000")
	 *
	 * Uses the decimal separator defined by the localizer. Accepts the dot if acceptDotAsDecimal is
	 * true.
	 *
	 * @param {String} text
	 * @return {Boolean}
	 */
	textIsValid(text) {
		if (text === null) {
			return true;
		}

		if (text === '-') {
			return true;
		}

		// Decimal separator character
		let ds = escapeStringRegexp(this.decimalSeparator);

		// If we allow the dot (props.acceptDotAsDecimal), modify the ds
		if (this.decimalSeparator !== '.' && this.props.acceptDotAsDecimal) {
			ds = `[${ds}\.]`;
		}

		/**
		 * Regular expression that tests the following
		 * - Optional single negative (-)
		 * - Followed by either a single 0 or a number not starting by 0
		 * - Optionnaly followed by
		 * 	- decimal separator
		 * 	- followed by optional number (can be just zeros)
		 *
		 * @type {RegExp}
		 */
		const validRX = new RegExp(`^-?(0|([1-9][0-9]*))(${ds}[0-9]*)?$`);

		return validRX.test(text);
	}

	/**
	 * Takes a number and returns the formatted string. If the number is null, returns empty string.
	 * Uses the localizer decimal separator.
	 *
	 * @param {Number} value
	 * @return {String}
	 */
	formatValue(value) {
		if (typeof value !== 'number') {
			return '';
		}

		const text = String(value);
		return text.replace('.', this.decimalSeparator);
	}

	/**
	 * Adjust the value by an increment "type" (1 or -1). Calls tryChangeValue().
	 *
	 * @param {Number} type  1 or -1
	 */
	incrementValue(type) {
		const currentValue = typeof this.props.value === 'number' ? this.props.value : 0;
		this.tryChangeValue(currentValue + type);
	}

	/**
	 * If the received value is valid, trigger the onChangeValue, else does nothing.
	 *
	 * @param {Number} value
	 */
	tryChangeValue(value) {
		if (this.valueIsValid(value)) {
			this.onChangeValue(value);
		}
	}

	/**
	 * Returns the text to use a preText in the TextInput. It will be the currency sign, if
	 * applicable with the localizer. Else returns an empty string.
	 *
	 * @return {String}
	 */
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

	/**
	 * Returns the text to use a postText in the TextInput. It will be the currency sign, if
	 * applicable with the localizer. Else returns an empty string.
	 *
	 * @return {String}
	 */
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
	 * pass -1. Does nothing if the showIncrementors is not true.
	 *
	 * @param {Number} type
	 * @return {Component}
	 */
	renderIncrementor(type) {
		if (!this.props.showIncrementors) {
			return null;
		}

		return <Incrementor type={type} onPress={() => { this.incrementValue(type); }} />;
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
				<TextInput
					{...other}
					defaultValue={null}
					ref={(node) => { this.textInputNode = node; }}
					value={this.inputText}
					style={style}
					keyboardType="numeric"
					onChangeText={(text) => { this.onChangeText(text); }}
					disableFullscreenUI
					preText={preText}
					postText={postText}
				/>
				{ this.renderIncrementor(-1) }
				{ this.renderIncrementor(+1) }
			</View>
		);
	}
}

NumberInput.propTypes = propTypes;
NumberInput.defaultProps = defaultProps;

const incrementorButtonWidth = 30;

const styles = {
	textInput: {
		textAlign: 'center',
	},
};

export default NumberInput;
