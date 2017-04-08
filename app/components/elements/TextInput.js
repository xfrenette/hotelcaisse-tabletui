import React, { Component } from 'react';
import {
	View,
	TextInput as NativeTextInput,
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

const propTypes = {
	style: NativeTextInput.propTypes.style,
	labelStyle: Text.propTypes.style,
	label: React.PropTypes.string,
	preText: React.PropTypes.string,
	postText: React.PropTypes.string,
};

const defaultProps = {
	style: null,
	labelStyle: null,
	label: null,
	preText: null,
	postText: null,
};

class TextInput extends Component {
	renderLabel() {
		if (this.props.label) {
			const style = [styles.TextInputLabel, this.props.labelStyle];
			return <Text style={style}>{ this.props.label }</Text>;
		}

		return null;
	}

	render() {
		const textStyle = [styles.TextInputText, this.props.style];
		let preText;
		let postText;
		const label = this.renderLabel();

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

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
