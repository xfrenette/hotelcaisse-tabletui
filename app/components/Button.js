import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableNativeFeedback,
 } from 'react-native';
import styles from '../styles';
import styleVars from '../styles/variables';

class Button extends Component {
	render() {
		return (
			<TouchableNativeFeedback
				onPress={this.props.onPress}
				background={TouchableNativeFeedback.Ripple(styleVars.button.rippleColor)}
			>
				<View style={styles.button}>
					<Text style={styles.buttonText}>{ this.props.title }</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

Button.propTypes = {
	title: React.PropTypes.string.isRequired,
	onPress: React.PropTypes.func,
};

Button.defaultProps = {
};

export default Button;
