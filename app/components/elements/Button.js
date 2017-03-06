import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	View,
	Text,
	TouchableNativeFeedback,
	TouchableOpacity,
 } from 'react-native';
import styles from '../../styles';

class Button extends Component {
	render() {
		const buttonStyles = [styles.buttons.default.button];
		const textStyles = [styles.buttons.default.text];
		let rippleColor = [styles.buttons.default.rippleColor];
		const touchableProps = {};
		let Touchable;
		let preIcon;
		let postIcon;

		if (this.props.touchEffect === 'feedback') {
			Touchable = TouchableNativeFeedback;
			touchableProps.background = TouchableNativeFeedback.Ripple(rippleColor);
		} else {
			Touchable = TouchableOpacity;
		}

		if (this.props.layout) {
			const layouts = Array.isArray(this.props.layout) ? this.props.layout : [this.props.layout];

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

		if (this.props.type === 'back') {
			preIcon = (
				<Icon name="angle-left" style={[textStyles, { lineHeight: 18, fontSize: 18, paddingRight: 7 }]} />
			);
		}

		return (
			<Touchable
				onPress={this.props.onPress}
			>
				<View style={[buttonStyles, { flexDirection: 'row', alignItems: 'center' }]}>
					{ preIcon }
					<Text style={textStyles}>{ this.props.title }</Text>
					{ postIcon }
				</View>
			</Touchable>
		);
	}
}

Button.propTypes = {
	title: React.PropTypes.string.isRequired,
	type: React.PropTypes.string,
	touchEffect: React.PropTypes.string,
	layout: React.PropTypes.oneOfType([
		React.PropTypes.object,
		React.PropTypes.array,
	]),
	onPress: React.PropTypes.func,
};

Button.defaultProps = {
	touchEffect: 'feedback',
};

export default Button;
