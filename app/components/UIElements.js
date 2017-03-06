import React, { Component } from 'react'
import { Text, View, Image, ScrollView } from 'react-native';
import TopBar from './layout/TopBar';
import BottomBar from './layout/BottomBar';
import Button from './elements/Button';
import styles from '../styles';

class UIElements extends Component {
	render() {
		return (
			<View style={{ flex: 1 }}>
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
