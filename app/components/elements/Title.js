import React, { Component } from 'react';
import {
	Text as NativeText,
} from 'react-native';
import Text from './Text';
import styleVars from '../../styles/variables';

const styles = {
	Title: {
		borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.mainColor,
		fontSize: 15,
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
		top: -2,
	},
};

class Title extends Component {
	render() {
		const text = String(this.props.children).toUpperCase();
		return <Text style={[styles.Title, this.props.style]}>{ text }</Text>
	}
}

Title.propTypes = {
	style: NativeText.propTypes.style,
};

export default Title;
