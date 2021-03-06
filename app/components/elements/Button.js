import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { Text, TouchableNativeFeedback, TouchableOpacity, View, } from 'react-native';
import buttonLayouts from '../../styles/buttons';

const propTypes = {
	title: PropTypes.string.isRequired,
	type: PropTypes.string,
	touchEffect: PropTypes.string,
	preIcon: PropTypes.string,
	preIconStyle: Icon.propTypes.style,
	postIcon: PropTypes.string,
	postIconStyle: Icon.propTypes.style,
	layout: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
	]),
};

const defaultProps = {
	touchEffect: 'feedback',
	type: null,
	layout: null,
	preIcon: null,
	preIconStyle: null,
	postIcon: null,
	postIconStyle: null,
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

	let preIconName = props.preIcon;

	if (type === 'back') {
		preIconName = "angle-left";
	}

	if (preIconName) {
		preIcon = (
			<Icon name={preIconName} style={[textStyles, styles.icon, styles.preIcon, props.preIconStyle]} />
		);
	}

	if (props.postIcon) {
		postIcon = (
			<Icon name={props.postIcon} style={[textStyles, styles.icon, styles.postIcon, props.postIconStyle]} />
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
	},
	preIcon: {
		paddingRight: 7,
	},
	postIcon: {
		paddingLeft: 7,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
	},
};

export default Button;
