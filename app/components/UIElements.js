import React, { Component } from 'react'
import { View, Image, ScrollView } from 'react-native';
import TopBar from './layout/TopBar';
import BottomBar from './layout/BottomBar';
import MainContent from './layout/MainContent';
import Button from './elements/Button';
import Text from './elements/Text';
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
			<View style={{ flex: 1 }}>
				{verticalRhythmImg}
				<TopBar title="Titréé" />
				<ScrollView>
					<MainContent>
						<Message>Bonjour 2 hdjas fhjkah kjdh hf fjh fjk jkfdfhjksdha k fsdhf hd hfjk fhjkh fjkf hjkh fjk jfk hfdjkahjkf hdjksfh djk !</Message>
						<Text>Bonjout !</Text>
						<Text>Bonjout !</Text>
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
