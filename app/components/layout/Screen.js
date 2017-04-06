import React, { Component } from 'react';
import { View } from 'react-native';

const styles = {
	Screen: {
		flex: 1,
	},
};

class Screen extends Component {
	render() {
		return (
			<View style={styles.Screen}>
				{ this.props.children }
			</View>
		);
	}
}

export default Screen;
