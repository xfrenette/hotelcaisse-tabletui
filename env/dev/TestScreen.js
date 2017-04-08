import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { MainContent } from '../../app/components/layout';
import { Text, NumberInput } from '../../app/components/elements';

const localizer = new Localizer('fr-CA', 'CAD');

@observer
class TestScreen extends Component {
	@observable
	numberInputValue = 0;

	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../../app/medias/vertical-rhythm.png')} style={style} />;
	}

	onChangeValue(value) {
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
							<NumberInput
								value={this.numberInputValue}
								onChangeValue={(value) => { this.onChangeValue(value); }}
								localizer={localizer}
								showIncrementors={false}
								type='money'
							/>
						</View>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
