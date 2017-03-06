import React, { Component } from 'react'
import { View, Image, ScrollView } from 'react-native';
import TopBar from './layout/TopBar';
import BottomBar from './layout/BottomBar';
import MainContent from './layout/MainContent';
import Button from './elements/Button';
import Text from './elements/Text';
import styles from '../styles';

class UIElements extends Component {
	render() {
		return (
			<View style={{ flex: 1 }}>
				<TopBar title="Titréé" />
				<ScrollView>
					<MainContent>
						<Text>Bonjour !</Text>
					</MainContent>
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
