import React from 'react';
import { Text as NativeText } from 'react-native';
import styleVars from '../../styles/variables';

const propTypes = {
	style: NativeText.propTypes.style,
	children: React.PropTypes.node.isRequired,
};

const defaultProps = {
	style: null,
};

const Text = (props) => {
	const style = [styles.text, props.style];
	return <NativeText style={style}>{ props.children }</NativeText>;
};

Text.propTypes = propTypes;
Text.defaultProps = defaultProps;

const styles = {
	text: {
		fontSize: styleVars.baseFontSize,
		color: styleVars.mainTextColor,
		lineHeight: styleVars.verticalRhythm,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
};

export default Text;
