/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableNativeFeedback,
	TouchableOpacity,
} from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	submitLabel: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	value: React.PropTypes.string,
	onChange: React.PropTypes.func,
	onSubmit: React.PropTypes.func,
};

const defaultProps = {
	submitLabel: 'OK',
	placeholder: 'Placeholder',
	value: '',
	onChange: null,
	onSubmit: null,
};

class Keypad extends Component {
	/**
	 * When a key is pressed
	 *
	 * @param {String} buttonValue
	 */
	onPress(buttonValue) {
		if (buttonValue === this.props.submitLabel) {
			this.submit();
		} else {
			const newValue = [this.props.value, buttonValue].join('');
			this.valueChanged(newValue);
		}
	}

	/**
	 * When the delete button is pressed
	 */
	onPressDelete() {
		const value = this.props.value;

		if (value === '') {
			return;
		}

		const newValue = value.substring(0, value.length - 1);
		this.valueChanged(newValue);
	}

	/**
	 * Clears the input
	 */
	clear() {
		this.valueChanged('');
	}

	/**
	 * Submits the value
	 */
	submit() {
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
	}

	/**
	 * Called when the text input value changes
	 *
	 * @param {String} newValue
	 */
	valueChanged(newValue) {
		if (this.props.onChange) {
			this.props.onChange(newValue);
		}
	}

	renderButton(value, last = false, flex = 1) {
		const style = [styles.button, { flex }, last && styles.buttonLast];

		return (
			<TouchableNativeFeedback
				background={TouchableNativeFeedback.Ripple(styleVars.button.backgroundColor)}
				onPress={() => { this.onPress(value); }}
			>
				<View style={style}>
					<Text style={styles.buttonText}>{ value }</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	renderDeleteButton() {
		// Note: the backspace icon below may not render in the code editor, but do not delete!
		return (
			<TouchableOpacity
				hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
				onPress={() => { this.onPressDelete(); }}
				onLongPress={() => { this.clear(); }}
			>
				<Text style={styles.deleteButton}>⌫</Text>
			</TouchableOpacity>
		);
	}

	renderTextInput() {
		const value = this.props.value;
		const characters = value.split('').map((char, index) => {
			const style = [styles.textInputChar];

			if (index === value.length - 1) {
				style.push(styles.textInputCharLast);
			}

			return <Text style={style} key={`${char}_${index}`}>{ char }</Text>;
		});
		let placeholder = null;

		if (!value.length) {
			placeholder = (
				<Text style={styles.textInputPlaceholder}>{ this.props.placeholder}</Text>
			);
		}

		return (
			<View style={styles.textInputContainer}>
				<View />
				<View style={styles.textInputChars}>
					{ placeholder }
					{ characters }
				</View>
				{ this.renderDeleteButton() }
			</View>
		);
	}

	render() {
		return (
			<View>
				{ this.renderTextInput() }
				<View style={styles.row}>
					{ this.renderButton(1) }
					{ this.renderButton(2) }
					{ this.renderButton(3, true) }
				</View>
				<View style={styles.row}>
					{ this.renderButton(4) }
					{ this.renderButton(5) }
					{ this.renderButton(6, true) }
				</View>
				<View style={styles.row}>
					{ this.renderButton(7) }
					{ this.renderButton(8) }
					{ this.renderButton(9, true) }
				</View>
				<View style={[styles.row, styles.rowLast]}>
					{ this.renderButton(0) }
					{ this.renderButton(this.props.submitLabel, true, 2) }
				</View>
			</View>
		);
	}
}

Keypad.propTypes = propTypes;
Keypad.defaultProps = defaultProps;

const styles = {
	textInputContainer: {
		marginBottom: styleVars.verticalRhythm,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
		height: 3 * styleVars.verticalRhythm,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},

	textInputChars: {
		flexDirection: 'row',
	},

	textInputChar: {
		fontSize: styleVars.fontSize.big,
		marginRight: 10,
	},

	textInputPlaceholder: {
		color: styleVars.input.placeholderColor,
		fontStyle: 'italic',
		fontSize: styleVars.fontSize.big,
	},

	textInputCharLast: {
		marginRight: 0,
	},

	button: {
		flex: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lineColor,
		height: (3 * styleVars.verticalRhythm) - 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttonText: {
		fontSize: styleVars.fontSize.big,
	},

	buttonLast: {
		borderRightWidth: 0,
	},

	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
	},

	rowLast: {
		borderBottomWidth: 0,
	},

	deleteButton: {
		fontSize: 20,
	},
};

export default Keypad;
