import React, { Component } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import Text from './Text';
import styleVars from '../../styles/variables';

const styles = {
	TextInputGroup: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	TextInputContainer: {
		borderWidth: 1,
		borderColor: styleVars.theme.mainColor,
		borderRadius: styleVars.input.borderRadius,
		backgroundColor: styleVars.theme.shadow,
		flex: 1,
	},
	TextInputText: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm,
		borderWidth: 0,
		height: styleVars.input.height - 3,
		includeFontPadding: false,
		textAlignVertical: 'center',
		backgroundColor: styleVars.colors.white1,
		marginTop: 1,
		borderRadius: styleVars.input.borderRadius,
		paddingHorizontal: styleVars.horizontalRhythm / 2,
	},
	TextInputLabel: {
		paddingRight: 10,
	}
}

class TextInput extends Component {
	renderLabel() {
		if (this.props.label) {
			return <Text style={styles.TextInputLabel}>{ this.props.label }</Text>;
		}

		return null;
	}

	render() {
		let textStyle = [styles.TextInputText];
		const label = this.renderLabel();

		if (Array.isArray(this.props.style)) {
			textStyle = [
				...textStyle,
				...this.props.style,
			];
		} else if (this.props.style) {
			textStyle.push(this.props.style);
		}

		return (
			<View style={styles.TextInputGroup}>
				{ label }
				<View style={styles.TextInputContainer}>
					<NativeTextInput
						{...this.props}
						underlineColorAndroid={'transparent'}
						style={textStyle}
					/>
				</View>
			</View>
		);
	}
}

TextInput.propTypes = {
	style: React.PropTypes.object,
	label: React.PropTypes.string,
};

TextInput.defaultProps = {
};

export default TextInput;
