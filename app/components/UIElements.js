import React, { Component } from 'react'
import { Text, View, Image } from 'react-native';
import TopBar from './TopBar';
import Button from './Button';

class UIElements extends Component {
	render() {
				// <Image source={require('../medias/vertical-rhythm.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
		return (
			<View>
				<TopBar title="Titréé" />
				<View style={{ padding:24, flexDirection: 'row' }}>
					<Button title="Bouton test" />
				</View>
			</View>
		);
	}
}

export default UIElements;
