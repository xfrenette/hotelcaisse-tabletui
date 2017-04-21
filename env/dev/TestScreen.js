import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { MainContent } from '../../app/components/layout';
import { Button, Text, DenominationsInput, Modal } from '../../app/components/elements';

const localizer = new Localizer('fr-CA', 'CAD');

@observer
class TestScreen extends Component {
	modal = null;
	@observable
	actionPressed = 'none';

	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../../app/medias/vertical-rhythm.png')} style={style} />;
	}

	onButtonPress() {
		this.modal.open();
	}

	render() {
		const verticalRhythm = true;
		let verticalRhythmImg;

		if (verticalRhythm) {
			verticalRhythmImg = this.renderVerticalRhythm();
		}

		const actions = {
			cancel: 'Annuler',
			save: 'Enregistrer',
		};

		return (
			<View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
				{verticalRhythmImg}
				<ScrollView>
					<MainContent>
						<View>
							<Button title="Bouton de test" onPress={() => { this.onButtonPress(); }} />
							<Text>{ this.actionPressed }</Text>
						</View>
						<Modal
							ref={(modal) => { this.modal = modal; }}
							title={this.actionPressed}
							actions={actions}
							onActionPress={(key) => { this.actionPressed = key; }}
						>
							<Text>Bonjour ici!</Text>
						</Modal>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
