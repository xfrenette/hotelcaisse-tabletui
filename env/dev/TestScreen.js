import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { MainContent } from '../../app/components/layout';
import { Text } from '../../app/components/elements';

class TestScreen extends Component {
	renderVerticalRhythm() {
		const style = {
			position: 'absolute',
		};

		return <Image source={require('../../app/medias/vertical-rhythm.png')} style={style} />;
	}

	render() {
		const verticalRhythm = true;
		let verticalRhythmImg;

		if (verticalRhythm) {
			verticalRhythmImg = this.renderVerticalRhythm();
		}

		return (
			<View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
				{verticalRhythmImg}
				<ScrollView>
					<MainContent>
						<Text>Test!</Text>
					</MainContent>
				</ScrollView>
			</View>
		);
	}
}

export default TestScreen;
