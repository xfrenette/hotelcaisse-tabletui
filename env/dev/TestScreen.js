import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { MainContent } from '../../app/components/layout';
import { Button, Text } from '../../app/components/elements';
import { Row, Cell } from '../../app/components/elements/table';

const localizer = new Localizer('fr-CA', 'CAD');

@inject('logger')
@observer
class TestScreen extends Component {
	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../../app/medias/vertical-rhythm.png')} style={style} />;
	}

	render() {
		const verticalRhythm = false;
		let verticalRhythmImg;

		if (verticalRhythm) {
			verticalRhythmImg = this.renderVerticalRhythm();
		}

		const logger = this.props.logger.getNamespace('test');

		return (
			<View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
				{verticalRhythmImg}
				<ScrollView>
					<MainContent>
						<View>
							<Button title="Test" onPress={() => { logger.info('Bonjour!'); }} />
						</View>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
