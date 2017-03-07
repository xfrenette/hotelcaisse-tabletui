import React, { Component } from 'react';
import { View, TouchableHighlight, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInput from './TextInput';
import styleVars from '../../styles/variables';

const styles = {
	TextInput: {
		textAlign: 'center',
		zIndex: 1,
	},
	AdjustButton: {
		position: 'absolute',
		right: 1,
		zIndex: 2,
		height: styleVars.input.height / 2 - 1,
		justifyContent: 'center',
	},
	AdjustButtonIcon: {
		lineHeight: 10,
		fontSize: 10,
		width: 30,
		textAlign: 'center',
		alignSelf: 'center',
		color: styleVars.theme.mainColor,
	},
	AdjustButtonMore: {
		top: 1,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.theme.lineColor,
	},
	AdjustButtonLess: {
		bottom: 1,
	}
};

class NumberInput extends Component {
	renderAdjustButton(type) {
		const iconName = type === 'more' ? 'plus' : 'minus';
		const buttonStyle = [styles.AdjustButton];

		if (type === 'more') {
			buttonStyle.push(styles.AdjustButtonMore);
		} else {
			buttonStyle.push(styles.AdjustButtonLess);
		}

		const icon = <Icon name={iconName} style={styles.AdjustButtonIcon} />

		return (
			<TouchableHighlight style={buttonStyle} underlayColor={styleVars.colors.grey1} onPress={() => { ToastAndroid.show('Touché', ToastAndroid.SHORT); }}>
				{ icon }
			</TouchableHighlight>
		);
	}

	render() {
		const moreButton = this.renderAdjustButton('more');
		const lessButton = this.renderAdjustButton('less');

		return (
			<View>
				{ moreButton }
				{ lessButton }
				<TextInput {...this.props} style={styles.TextInput} />
			</View>
		);
	}
}

export default NumberInput;
