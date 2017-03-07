import React, { Component } from 'react'
import { View, Image, ScrollView } from 'react-native';
import TopBar from './layout/TopBar';
import BottomBar from './layout/BottomBar';
import MainContent from './layout/MainContent';
import Button from './elements/Button';
import Text from './elements/Text';
import TextInput from './elements/TextInput';
import Message from './elements/Message';
import styles from '../styles';

class UIElements extends Component {
	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../medias/vertical-rhythm.png')} style={style} />;
	}

	render() {
		let verticalRhythm = false;
		let verticalRhythmImg;

		if (verticalRhythm) {
			verticalRhythmImg = this.renderVerticalRhythm();
		}

		return (
			<View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
				{verticalRhythmImg}
				<TopBar title="Titréé" />
				<ScrollView>
					<MainContent>
						<TextInput defaultValue="Bonjour toi" />
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
