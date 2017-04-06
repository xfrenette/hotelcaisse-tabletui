import React, { Component } from 'react';
import { View } from 'react-native';
import styleVars from '../../../styles/variables';

const styles = {
	Field: {
		marginBottom: styleVars.verticalRhythm,
	},
};

class Field extends Component {
	render() {
		return <View style={styles.Field}>{ this.props.children }</View>;
	}
}

export default Field;
