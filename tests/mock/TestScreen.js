import React, { Component } from 'react';
import { ScrollView, TextInput as NativeTextInput, View } from 'react-native';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { Button, NumberInput, TextInput } from '../../app/components/elements';

@inject('localizer')
@observer
class TestScreen extends Component {
	@observable
	error = null;
	@observable
	value = 4;
	@observable
	showDenominationsInput = false;
	values = [
		{ label: '0,05', value: 0 },
		{ label: '0,10', value: 0 },
		{ label: '0,25', value: 0 },
		{ label: '1,00', value: 0 },
		{ label: '2,00', value: 0 },
		{ label: '5,00', value: 0 },
		{ label: '10,00', value: 0 },
		{ label: '20,00', value: 0 },
		{ label: '50,00', value: 0 },
		{ label: '100,00', value: 0 },
	];
	renderStartTime = new Date();

	toggleError() {
		if (this.error) {
			this.error = null;
		} else {
			this.error = 'Error example';
		}
	}

	toggleDenominationsInput() {
		requestAnimationFrame(() => {
			this.showDenominationsInput = !this.showDenominationsInput;
		});
		/*InteractionManager.runAfterInteractions(() => {
			console.log('b');
			this.showDenominationsInput = !this.showDenominationsInput;
		});*/
	}

	renderRows() {
		const rows = [];

		for (let i = 0; i < this.nbRows; i += 1) {
			rows.push(
				<View key={i} style={{ flexDirection: 'row', margin: 20 }}>
					<View style={{ flex: 1 }}>
						<NumberInput showIncrementors />
					</View>
					<View style={{ flex: 1 }}>
						<TextInput error={this.error} />
					</View>
					<View style={{ flex: 1 }}>
						<Button onPress={() => { this.toggleError(); }} title="Test" />
					</View>
				</View>
			);
		}

		return rows;
	}

	render() {
		/*
		*/
		return (
			<ScrollView>
				<NumberInput
					localizer={this.props.localizer}
					value={this.value}
					onChangeValue={(val) => { this.value = val; }}
					showIncrementors
					acceptDotAsDecimal
					constraints={{ numericality: { greaterThanOrEqualTo: 0, onlyInteger: true } }}
				/>
				<NativeTextInput value="3" />
			</ScrollView>
		);
	}
}

export default TestScreen;
