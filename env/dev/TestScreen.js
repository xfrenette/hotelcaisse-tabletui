import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { MainContent } from '../../app/components/layout';
import { Text, DenominationsInput } from '../../app/components/elements';

const localizer = new Localizer('fr-CA', 'CAD');

@observer
class TestScreen extends Component {
	@observable
	denominationValues = [
		{ label: '0,05 $', value: 1 },
		{ label: '0,10 $', value: 0 },
		{ label: '0,25 $', value: 0 },
		{ label: '1,00 $', value: 0 },
		{ label: '2,00 $', value: 0 },
		{ label: '5,00 $', value: 0 },
		{ label: '10,00 $', value: 3 },
		{ label: '20,00 $', value: 2 },
	];

	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../../app/medias/vertical-rhythm.png')} style={style} />;
	}

	onChangeValue(field, value) {
		this.numberInputValue = value;
	}

	render() {
		const verticalRhythm = false;
		let verticalRhythmImg;

		if (verticalRhythm) {
			verticalRhythmImg = this.renderVerticalRhythm();
		}

		return (
			<View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
				{verticalRhythmImg}
				<ScrollView>
					<MainContent>
						<View>
							<DenominationsInput
								values={this.denominationValues.slice()}
								localizer={localizer}
								onChangeValue={(field, value) => { this.onChangeValue(field, value); }}
							/>
						</View>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
