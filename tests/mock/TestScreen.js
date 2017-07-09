import React, { Component } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { Text, TextInput, NumberInput, Button, DenominationsInput } from '../../app/components/elements';

@observer
class TestScreen extends Component {
	@observable
	error = null;
	@observable
	nbRows = 1;

	toggleError() {
		if (this.error) {
			this.error = null;
		} else {
			this.error = 'Error example';
		}
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
			<View>
				{ this.renderRows() }
				<Button title="Add row" onPress={() => { this.nbRows += 1; }} />
			</View>
		);
	}
}

export default TestScreen;
