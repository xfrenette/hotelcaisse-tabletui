import React, { Component } from 'react';
import { Text as NativeText } from 'react-native';
import styleVars from '../../styles/variables';

const styles = {
	Text: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
};

const propTypes = {
	style: NativeText.propTypes.style,
};

const defaultProps = {
	style: null,
};

class Text extends Component {
	render() {
		const style = [styles.Text, this.props.style];
		return <NativeText style={style}>{ this.props.children }</NativeText>;
	}
}

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

export default Text;
