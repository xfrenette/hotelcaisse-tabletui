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
};

const defaultProps = {
	touchEffect: 'feedback',
	type: null,
	layout: null,
};

const Button = (props) => {
	const buttonStyles = [buttonLayouts.default.button];
	const textStyles = [buttonLayouts.default.text];
	let rippleColor = [buttonLayouts.default.rippleColor];
	const touchableProps = {};
	let Touchable;
	let preIcon;
	let postIcon;

	const { layout, touchEffect, type, title, ...otherProps } = props;

	if (touchEffect === 'feedback') {
		Touchable = TouchableNativeFeedback;
		touchableProps.background = TouchableNativeFeedback.Ripple(rippleColor);
	} else {
		Touchable = TouchableOpacity;
	}

	if (layout) {
		const layouts = Array.isArray(layout) ? layout : [layout];

		layouts.forEach((currLayout) => {
			if (currLayout.button) {
				buttonStyles.push(currLayout.button);
			}

			if (currLayout.text) {
				textStyles.push(currLayout.text);
			}

			if (currLayout.rippleColor) {
				rippleColor = currLayout.rippleColor;
			}
		});
	}

	if (type === 'back') {
		preIcon = (
			<Icon name="angle-left" style={[textStyles, styles.icon]} />
		);
	}

	return (
		<Touchable {...otherProps}>
			<View style={[buttonStyles, styles.button]}>
				{ preIcon }
				<Text style={textStyles}>{ title }</Text>
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
