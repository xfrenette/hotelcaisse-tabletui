import React, { Component } from 'react';
import {
	View,
	TextInput as NativeTextInput,
	Text as NativeText
} from 'react-native';
import Text from './Text';
import styleVars from '../../styles/variables';

const styles = {
	TextInputGroup: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	TextInputContainer: {
		borderWidth: 1,
		borderColor: styleVars.input.borderColor,
		borderRadius: styleVars.input.borderRadius,
		backgroundColor: styleVars.theme.shadow,
		flex: 1,
	},
	TextInput: {
		height: styleVars.input.height - 3,
		backgroundColor: styleVars.input.backgroundColor,
		marginTop: 1,
		borderRadius: styleVars.input.borderRadius,
		paddingHorizontal: styleVars.input.sidePadding,
		flexDirection: 'row',
		alignItems: 'center',
	},
	TextInputText: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm - 2,
		borderWidth: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		flex: 1,
		padding: 0,
	},
	TextInputLabel: {
		paddingRight: 10,
	},
	TextInputSideText: {

	},
	TextInputPreText: {
		paddingRight: styleVars.input.sidePadding,
	},
	TextInputPostText: {
		paddingLeft: styleVars.input.sidePadding,
	},
};

class TextInput extends Component {
	renderLabel() {
		if (this.props.label) {
			return <Text style={styles.TextInputLabel}>{ this.props.label }</Text>;
		}

		return null;
	}

	render() {
		let textStyle = [styles.TextInputText];
		let preText;
		let postText;
		const label = this.renderLabel();

		if (Array.isArray(this.props.style)) {
			textStyle = [
				...textStyle,
				...this.props.style,
			];
		} else if (this.props.style) {
			textStyle.push(this.props.style);
		}

		if (this.props.preText) {
			preText = (
				<Text style={[styles.TextInputSideText, styles.TextInputPreText]}>
					{ this.props.preText }
				</Text>
			);
		}

		if (this.props.postText) {
			postText = (
				<Text style={[styles.TextInputSideText, styles.TextInputPostText]}>
					{ this.props.postText }
				</Text>
			);
		}

		return (
			<View style={styles.TextInputGroup}>
				{ label }
				<View style={styles.TextInputContainer}>
					<View style={styles.TextInput}>
						{ preText }
						<NativeTextInput
							{...this.props}
							underlineColorAndroid={'transparent'}
							style={textStyle}
						/>
						{ postText }
					</View>
				</View>
			</View>
		);
	}
}

TextInput.propTypes = {
	style: React.PropTypes.oneOfType([
		React.PropTypes.object,
		React.PropTypes.array,
	]),
	label: React.PropTypes.string,
	preText: React.PropTypes.string,
	postText: React.PropTypes.string,
};

TextInput.defaultProps = {
};

export default TextInput;
