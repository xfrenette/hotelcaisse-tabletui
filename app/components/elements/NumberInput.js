import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TextInput from './TextInput';
import styleVars from '../../styles/variables';

const styles = {
	TextInput: {
		textAlign: 'center',
		zIndex: 1,
	},
	AdjustButton: {
		position: 'absolute',
		right: 1,
		zIndex: 2,
		height: (styleVars.input.height / 2) - 1,
		justifyContent: 'center',
	},
	AdjustButtonIcon: {
		lineHeight: 10,
		fontSize: 10,
		width: 30,
		textAlign: 'center',
		alignSelf: 'center',
		color: styleVars.theme.mainColor,
	},
	AdjustButtonMore: {
		top: 1,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
	},
	AdjustButtonLess: {
		bottom: 1,
	},
};

/**
 * Default state values for when element is instanciated or "reset"
 *
 * @type {Object}
 */
const baseState = {
	danglingDecimalSeparator: false,
	minDecimalDigits: 0,
};

// Accepts dot and locale's decimal separator as decimal separator
class NumberInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...baseState,
		};
	}

	componentWillReceiveProps(newProps) {
		let doResetState = false;

		if (this.props.value !== newProps.value) {
			doResetState = true;
		}

		if (this.props.localizer !== newProps.localizer) {
			doResetState = true;
		}

		if (this.props.maxDecimals !== newProps.maxDecimals) {
			doResetState = true;
		}

		if (doResetState) {
			this.setState({
				...baseState,
			});
		}
	}

	/**
	 * Called by the TextInput when text changes. This method will transform the value to a number
	 * and pass it to valueChanged(). Also processes dangling separator and decimals.
	 *
	 * @param {String} rawText
	 */
	onChangeText(rawText) {
		// First, check if text ends with decimal separator
		let text = this.processDanglingDecimalSeparator(rawText);
		// Remove extra decimals
		text = this.limitDecimals(text);
		// Try to parse the number
		const value = this.parseNumber(text);

		// If didn't parse do nothing
		if (value === null) {
			return;
		}

		// Keep count of the number of digits
		this.processDecimalDigits(text);

		// Call valueChanged with parsed number, unless same number
		if (value !== this.props.value) {
			this.valueChanged(value);
		}
	}

	/**
	 * Returns the current value. If the value is not set, returns 0.
	 *
	 * @return {Number}
	 */
	getValue() {
		return this.props.value || 0;
	}

	/**
	 * Processes a string representing a number and it it ends with a decimal separator, sets a flag
	 * in the state. Returns the string without the separator. Ignores the separator if maxDecimals
	 * props is 0 (integer only).
	 *
	 * @param {String} value
	 * @return {String}
	 */
	processDanglingDecimalSeparator(value) {
		const decimalSeparator = this.props.localizer.getDecimalSeparator();
		const intOnly = this.props.maxDecimals === 0;
		const dangling = value.indexOf(decimalSeparator) === value.length - 1;
		const stateDangling = intOnly ? false : dangling;

		if (this.state.danglingDecimalSeparator !== stateDangling) {
			this.setState({
				danglingDecimalSeparator: stateDangling,
			});
		}

		if (dangling) {
			return value.substring(0, value.length - 1);
		}

		return value;
	}

	/**
	 * Counts the number of trailing zeros in the decimal part (ex: 10,0200 would have 2 trailing
	 * decimal zeros) and saves it in the state. Note that this function only works with string of
	 * valid number.
	 *
	 * @param {String} value
	 */
	processDecimalDigits(value) {
		const decimalSeparator = this.props.localizer.getDecimalSeparator();
		const regexp = new RegExp(`^.+${decimalSeparator}([0-9]+)$`);
		const res = regexp.exec(value);
		let stateDecimalDigits = 0;

		if (res) {
			stateDecimalDigits = res[1].length;
		}

		if (this.state.minDecimalDigits !== stateDecimalDigits) {
			this.setState({
				minDecimalDigits: stateDecimalDigits,
			});
		}
	}

	/**
	 * Takes a string representing a number and strips any decimal exceding maxDecimals.
	 *
	 * @param {String} value
	 * @return {String}
	 */
	limitDecimals(value) {
		const max = this.props.maxDecimals;

		if (max === Infinity || typeof max !== 'number') {
			return value;
		}

		const decimalSeparator = this.props.localizer.getDecimalSeparator();
		const decimalSeparatorIndex = value.indexOf(decimalSeparator);

		if (decimalSeparatorIndex === -1) {
			return value;
		}

		if (max === 0) {
			return value.substring(0, decimalSeparatorIndex);
		}

		const regexp = new RegExp(`(^.+${decimalSeparator}[0-9]{1,${max}})[0-9]*$`);
		const res = regexp.exec(value);

		if (!res) {
			return value;
		}

		return res[1];
	}

	/**
	 * Parses a string number using the component's locale and returns a Number or NaN if it cannot
	 * be parsed.
	 *
	 * @param {String} text
	 * @return {Number|NaN}
	 */
	parseNumber(text) {
		if (typeof text !== 'string' || text.trim() === '') {
			return null;
		}

		const value = this.props.localizer.parseNumber(text);

		if (Number.isNaN(value)) {
			return null;
		}

		return value;
	}

	/**
	 * Returns a string of the current value to be displayed in the text input. Basically, we just
	 * pass the number to iLib and return the result with the following particularities:
	 *
	 * - If number is null or undefined, an empty string is returned
	 * - If we noted that the user had previously entered a decimal separator, we add it at the end.
	 * - If the number has trailing decimal zeros, we add them
	 *
	 * @param {Number} number
	 * @return {String}
	 */
	formatValue() {
		const value = this.props.value;
		let minDecimals = this.state.minDecimalDigits;
		let maxDecimals = this.props.maxDecimals;

		if (typeof maxDecimals !== 'number') {
			maxDecimals = Infinity;
		}

		maxDecimals = Math.min(maxDecimals, 20);
		minDecimals = Math.min(minDecimals, maxDecimals);

		const formatterOptions = {
			minimumFractionDigits: minDecimals,
			maximumFractionDigits: maxDecimals,
		};

		if (typeof value !== 'number') {
			return '';
		}

		let formatted = this.props.localizer.formatNumber(value, formatterOptions);

		if (this.state.danglingDecimalSeparator) {
			formatted += this.props.localizer.getDecimalSeparator();
		}

		return formatted;
	}

	/**
	 * Adjusts the value by +1 ("more") or -1 ("less"). Used by the plus and minus buttons. Calls
	 * valueChanged with the new value.
	 *
	 * @param {string} type "more" or "less"
	 */
	adjustValue(type) {
		const value = this.getValue();
		const adjustment = type === 'more' ? 1 : -1;
		const newValue = value + adjustment;
		this.valueChanged(newValue);
	}

	/**
	 * Called when the value changed. Calls this.props.onChangeValue() with the new value.
	 *
	 * @param {Number} newValue
	 */
	valueChanged(newValue) {
		if (this.props.onChangeValue) {
			this.props.onChangeValue(newValue);
		}
	}

	/**
	 * Rendering function to render the "more" and "less" button (the one rendered depends on the
	 * type parameter).
	 *
	 * @param {String} type
	 * @return {Component}
	 */
	renderAdjustButton(type) {
		const iconName = type === 'more' ? 'plus' : 'minus';
		const buttonStyle = [styles.AdjustButton];

		if (type === 'more') {
			buttonStyle.push(styles.AdjustButtonMore);
		} else {
			buttonStyle.push(styles.AdjustButtonLess);
		}

		const icon = <Icon name={iconName} style={styles.AdjustButtonIcon} />;

		return (
			<TouchableHighlight
				style={buttonStyle}
				underlayColor={styleVars.colors.grey1}
				onPress={() => { this.adjustValue(type); }}
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
		const moreButton = this.renderAdjustButton('more');
		const lessButton = this.renderAdjustButton('less');
		const { value, ...other } = this.props;

		return (
			<View>
				{ moreButton }
				{ lessButton }
				<TextInput
					{...other}
					value={this.formatValue()}
					style={styles.TextInput}
					keyboardType="numeric"
					onChangeText={(text) => { this.onChangeText(text); }}
				/>
			</View>
		);
	}
}

NumberInput.propTypes = {
	value: React.PropTypes.number,
	maxDecimals: React.PropTypes.number,
	onChangeValue: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

NumberInput.defaultProps = {
	value: null,
	maxDecimals: Infinity,
	onChangeValue: null,
};


export default NumberInput;
