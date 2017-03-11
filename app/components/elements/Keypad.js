import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	View,
	Text,
	TouchableNativeFeedback,
	TouchableOpacity,
} from 'react-native';
import styleVars from '../../styles/variables';

const styles = {
	TextInputContainer: {
		marginBottom: styleVars.verticalRhythm,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
		height: 3 * styleVars.verticalRhythm,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},

	TextInputChars: {
		flexDirection: 'row',
	},

	TextInputChar: {
		fontSize: styleVars.fontSize.big,
		marginRight: 10,
	},

	TextInputPlaceholder: {
		color: styleVars.input.placeholderColor,
		fontStyle: 'italic',
		fontSize: styleVars.fontSize.big,
	},

	TextInputCharLast: {
		marginRight: 0,
	},

	Button: {
		flex: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lineColor,
		height: (3 * styleVars.verticalRhythm) - 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	ButtonText: {
		fontSize: styleVars.fontSize.big,
	},

	ButtonLast: {
		borderRightWidth: 0,
	},

	Row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
	},

	RowLast: {
		borderBottomWidth: 0,
	},

	DeleteButton: {
		fontSize: 20,
	},
};

class Keypad extends Component {
	onPress(buttonValue) {
		if (buttonValue === this.props.submitLabel) {
			this.submitted();
		} else {
			const newValue = [this.props.value, buttonValue].join('');
			this.valueChanged(newValue);
		}
	}

	onPressDelete() {
		const value = this.props.value;

		if (value === '') {
			return;
		}

		const newValue = value.substring(0, value.length - 1);
		this.valueChanged(newValue);
	}

	clear() {
		this.valueChanged('');
	}

	submitted() {
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}
	}

	valueChanged(newValue) {
		if (this.props.onChange) {
			this.props.onChange(newValue);
		}
	}

	renderButton(value, last = false, flex = 1) {
		const style = [styles.Button, { flex }, last && styles.ButtonLast];

		return (
			<TouchableNativeFeedback
				background={TouchableNativeFeedback.Ripple(styleVars.button.backgroundColor)}
				onPress={() => { this.onPress(value); }}
			>
				<View style={style}>
					<Text style={styles.ButtonText}>{ value }</Text>
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
				<Text style={styles.DeleteButton}>⌫</Text>
			</TouchableOpacity>
		);
	}

	renderTextInput() {
		const value = this.props.value;
		const characters = value.split('').map((char, index) => {
			const style = [styles.TextInputChar];

			if (index === value.length - 1) {
				style.push(styles.TextInputCharLast);
			}

			return <Text style={style} key={`${char}_${index}`}>{ char }</Text>;
		});
		let placeholder = null;

		if (!value.length) {
			placeholder = (
				<Text style={styles.TextInputPlaceholder}>{ this.props.placeholder}</Text>
			);
		}

		return (
			<View style={styles.TextInputContainer}>
				<View />
				<View style={styles.TextInputChars}>
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
				<View style={styles.Row}>
					{ this.renderButton(1) }
					{ this.renderButton(2) }
					{ this.renderButton(3, true) }
				</View>
				<View style={styles.Row}>
					{ this.renderButton(4) }
					{ this.renderButton(5) }
					{ this.renderButton(6, true) }
				</View>
				<View style={styles.Row}>
					{ this.renderButton(7) }
					{ this.renderButton(8) }
					{ this.renderButton(9, true) }
				</View>
				<View style={[styles.Row, styles.RowLast]}>
					{ this.renderButton(0) }
					{ this.renderButton(this.props.submitLabel, true, 2) }
				</View>
			</View>
		);
	}
}

Keypad.propTypes = {
	submitLabel: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	value: React.PropTypes.string,
	onChange: React.PropTypes.func,
	onSubmit: React.PropTypes.func,
};

Keypad.defaultProps = {
	submitLabel: 'OK',
	placeholder: 'Placeholder',
	value: '',
	onChange: null,
	onSubmit: null,
};

export default Keypad;
