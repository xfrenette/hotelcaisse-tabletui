import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	View,
	Text,
	TouchableNativeFeedback,
	TouchableOpacity,
} from 'react-native';
import buttonLayouts from '../../styles/buttons';

const propTypes = {
	title: React.PropTypes.string.isRequired,
	type: React.PropTypes.string,
	touchEffect: React.PropTypes.string,
	layout: React.PropTypes.oneOfType([
		React.PropTypes.object,
		React.PropTypes.array,
	]),
	onPress: React.PropTypes.func,
};

const defaultProps = {
	touchEffect: 'feedback',
	type: null,
	layout: null,
	onPress: null,
};

const Button = (props) => {
	const buttonStyles = [buttonLayouts.default.button];
	const textStyles = [buttonLayouts.default.text];
	let rippleColor = [buttonLayouts.default.rippleColor];
	const touchableProps = {};
	let Touchable;
	let preIcon;
	let postIcon;

	if (props.touchEffect === 'feedback') {
		Touchable = TouchableNativeFeedback;
		touchableProps.background = TouchableNativeFeedback.Ripple(rippleColor);
	} else {
		Touchable = TouchableOpacity;
	}

	if (props.layout) {
		const layouts = Array.isArray(props.layout) ? props.layout : [props.layout];

		layouts.forEach((layout) => {
			if (layout.button) {
				buttonStyles.push(layout.button);
			}

			if (layout.text) {
				textStyles.push(layout.text);
			}

			if (layout.rippleColor) {
				rippleColor = layout.rippleColor;
			}
		});
	}

	if (props.type === 'back') {
		preIcon = (
			<Icon name="angle-left" style={[textStyles, styles.icon]} />
		);
	}

	return (
		<Touchable onPress={props.onPress}>
			<View style={[buttonStyles, styles.button]}>
				{ preIcon }
				<Text style={textStyles}>{ props.title }</Text>
				{ postIcon }
			</View>
		</Touchable>
	);
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

const styles = {
	icon: {
		lineHeight: 18,
		fontSize: 18,
		paddingRight: 7,
	},

	button: {
		flexDirection: 'row',
		alignItems: 'center',
	},
};

export default Button;
