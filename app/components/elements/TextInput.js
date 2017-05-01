import React, { Component } from 'react';
import {
	View,
	TextInput as NativeTextInput,
} from 'react-native';
import Text from './Text';
import styleVars from '../../styles/variables';

const propTypes = {
	style: NativeTextInput.propTypes.style,
	labelStyle: Text.propTypes.style,
	label: React.PropTypes.string,
	preText: React.PropTypes.string,
	postText: React.PropTypes.string,
	error: React.PropTypes.string,
};

const defaultProps = {
	style: null,
	labelStyle: null,
	label: null,
	preText: null,
	postText: null,
	error: null,
};

class TextInput extends Component {
	/**
	 * Reference to the native text input
	 *
	 * @type {NativeTextInput}
	 */
	textInputNode = null;

	/**
	 * Call this method to focus the NativeTextInput
	 */
	focus() {
		this.textInputNode.focus();
	}

	renderLabel() {
		if (this.props.label) {
			const style = [styles.label, this.props.labelStyle];
			return <Text style={style}>{ this.props.label }</Text>;
		}

		return null;
	}

	renderError() {
		if (!this.props.error) {
			return null;
		}

		return <Text style={styles.errorText}>{ this.props.error }</Text>;
	}

	render() {
		const textStyle = [styles.inputText, this.props.style];
		let preText;
		let postText;
		const label = this.renderLabel();
		const containerStyles = [styles.container];

		if (this.props.error) {
			containerStyles.push(styles.containerError);
		}

		if (this.props.preText) {
			preText = (
				<Text style={[styles.sideText, styles.preText]}>
					{ this.props.preText }
				</Text>
			);
		}

		if (this.props.postText) {
			postText = (
				<Text style={[styles.sideText, styles.postText]}>
					{ this.props.postText }
				</Text>
			);
		}

		return (
			<View>
				<View style={styles.group}>
					{ label }
					<View style={containerStyles}>
						<View style={styles.input}>
							{ preText }
							<NativeTextInput
								{...this.props}
								ref={(node) => { this.textInputNode = node; }}
								underlineColorAndroid={'transparent'}
								style={textStyle}
							/>
							{ postText }
						</View>
					</View>
				</View>
				{ this.renderError() }
			</View>
		);
	}
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

const styles = {
	group: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	container: {
		borderWidth: 1,
		borderColor: styleVars.input.borderColor,
		borderRadius: styleVars.input.borderRadius,
		backgroundColor: styleVars.theme.shadow,
		flex: 1,
	},
	containerError: {
		borderColor: styleVars.input.errorColor,
	},
	input: {
		height: styleVars.input.height - 3,
		backgroundColor: styleVars.input.backgroundColor,
		marginTop: 1,
		borderRadius: styleVars.input.borderRadius,
		paddingHorizontal: styleVars.input.sidePadding,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputText: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm - 2,
		borderWidth: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		flex: 1,
		padding: 0,
	},
	label: {
		paddingRight: 10,
	},
	sideText: {
	},
	preText: {
		paddingRight: styleVars.input.sidePadding,
	},
	postText: {
		paddingLeft: styleVars.input.sidePadding,
	},
	errorText: {
		color: styleVars.theme.dangerColor,
		fontStyle: 'italic',
	},
};

export default TextInput;
