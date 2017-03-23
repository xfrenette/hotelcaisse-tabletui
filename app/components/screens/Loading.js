import React, { Component } from 'react';
import {
	View,
	Text,
 } from 'react-native';

const styles = {
	Loading: {
		backgroundColor: 'yellow',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
}

class Loading extends Component {
	render() {
		return (
			<View style={styles.Loading}>
				<Text>Chargement...</Text>
			</View>
		);
	}
}

export default Loading;
