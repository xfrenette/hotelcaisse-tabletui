import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { MainContent } from '../../app/components/layout';
import { Button, Text, Modal } from '../../app/components/elements';
import { Row, Cell } from '../../app/components/elements/table';

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
		const verticalRhythm = false;
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
							<Text>Ici:</Text>
							<Row first>
								<Cell first><Text>Cel1 Cel1 Cel 1 Cel w</Text></Cell>
								<Cell><Text>Cell 2</Text></Cell>
								<Cell last><Text>Cell 3</Text></Cell>
							</Row>
							<Row>
								<Text>Contenu ici</Text>
							</Row>
						</View>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
