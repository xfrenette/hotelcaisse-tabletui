import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Button from '../elements/Button';

class OpenRegister extends Component {
	employee = '';
	amount = 0;

	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel(this.props.localizer.t('register.opening.canceled'));
		}
	}

	onOpenRegister() {
		if (this.props.onOpen) {
			this.props.onOpen(this.employee, this.amount);
		}
	}

	render() {
		return (
			<View>
				<Text>Open register !!!</Text>
				<Button title="Ouvrir la caisse" onPress={() => { this.onOpenRegister() }} />
				<Button title="Annuler" onPress={() => { this.onCancel() }} />
			</View>
		);
	}
}

export default OpenRegister;
