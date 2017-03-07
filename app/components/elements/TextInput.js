import React, { Component } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import styleVars from '../../styles/variables';

const styles = {
	TextInputContainer: {
		borderWidth: 1,
		borderColor: styleVars.theme.mainColor,
		borderRadius: styleVars.inputBorderRadius,
		backgroundColor: styleVars.theme.shadow,
	},
	TextInputText: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm,
		borderWidth: 0,
		height: 2 * styleVars.verticalRhythm - 3,
		includeFontPadding: false,
		textAlignVertical: 'center',
		backgroundColor: styleVars.colors.white1,
		marginTop: 1,
		borderRadius: styleVars.inputBorderRadius,
		paddingHorizontal: styleVars.horizontalRhythm / 2,
	}
}

class TextInput extends Component {
	render() {
		let textStyle = [styles.TextInputText];

		if (Array.isArray(this.props.style)) {
			textStyle = [
				...textStyle,
				...this.props.style,
			];
		} else if (this.props.style) {
			textStyle.push(this.props.style);
		}

		return (
			<View style={styles.TextInputContainer}>
				<NativeTextInput
					{...this.props}
					underlineColorAndroid={'transparent'}
					style={textStyle}
				/>
			</View>
		);
	}
}

TextInput.propTypes = {
	style: React.PropTypes.object,
};

TextInput.defaultProps = {
};

export default TextInput;
