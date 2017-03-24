import React, { Component } from 'react';
import {
	View,
	Text,
 } from 'react-native';
 import Button from '../elements/Button';

const propTypes = {
	status: React.PropTypes.string,
	onAuthenticate: React.PropTypes.func,
	onFinish: React.PropTypes.func,
};

const defaultProps = {
	status: null,
	onAuthenticate: null,
	onFinish: null,
};

const styles = {
	Authentication: {
		backgroundColor: '#ddeeaa',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
};

class Authentication extends Component {
	doFail() {
		this.authenticate('4567');
	}

	doSucceed() {
		this.authenticate('1234');
	}

	authenticate(code) {
		if (this.props.onAuthenticate) {
			this.props.onAuthenticate(code);
		}
	}

	finish() {
		if (this.props.onFinish) {
			this.props.onFinish();
		}
	}

	render() {
		let message = 'Veuillez vous authentifier';
		let buttons = [];

		if (this.props.status !== 'success' && this.props.status !== 'authenticating') {
			buttons.push(<Button key="inv" onPress={() => { this.doFail() }} title="Connexion (échec)" />);
			buttons.push(<Button key="val" onPress={() => { this.doSucceed() }} title="Connexion (réussie)" />);
		} else if (this.props.status === 'success') {
			buttons.push(<Button key="fin" onPress={() => { this.finish() }} title="Entrer" />);
		}

		switch(this.props.status) {
			case 'fail':
				message = 'Mauvais code';
				break;
			case 'error':
				message = 'Erreur de vérification';
				break;
			case 'success':
				message = 'Authentification avec succès';
				break;
			case 'authenticating':
				message = 'Authentification en cours...';
				break;
		}
		return (
			<View style={styles.Authentication}>
				<Text>{ message }</Text>
				{ buttons }
			</View>
		);
	}
}

Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;

export default Authentication;
