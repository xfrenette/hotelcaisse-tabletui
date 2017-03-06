import React, { Component } from 'react'
import { Text, View, Image, ScrollView } from 'react-native';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import Button from './Button';
import styles from '../styles';

class UIElements extends Component {
	render() {
		return (
			<View style={{ flex: 1 }}>
				<Image source={require('../medias/vertical-rhythm.png')} style={{ position: 'absolute', top: 0, left: 0 }} />
				<TopBar title="Titréé" />
				<ScrollView contentContainerStyle={{ padding:24, flexDirection: 'row' }}>
					<Button title="Bouton test" layout={[styles.buttons.primary, styles.buttons.big]} />
				</ScrollView>
				<BottomBar>
					<Button title="Annuler" type="back" layout={styles.buttons.text} touchEffect="opacity" />
					<Button title="Enregistrer" layout={[styles.buttons.primary, styles.buttons.big]} />
				</BottomBar>
			</View>
		);
	}
}

export default UIElements;
