import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { inject } from 'mobx-react/native';
import { Button } from '../elements';

const propTypes = {
	status: React.PropTypes.string,
	localizer: React.PropTypes.object,
	onAuthenticate: React.PropTypes.func,
	onFinish: React.PropTypes.func,
};

const defaultProps = {
	status: null,
	localizer: null,
	onAuthenticate: null,
	onFinish: null,
};

@inject('localizer')
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

	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	render() {
		const buttons = [];
		let message = this.t('auth.please');

		if (this.props.status !== 'success' && this.props.status !== 'authenticating') {
			buttons.push(<Button key="inv" onPress={() => { this.doFail(); }} title="Connexion (échec)" />);
			buttons.push(<Button key="val" onPress={() => { this.doSucceed(); }} title="Connexion (réussie)" />);
		} else if (this.props.status === 'success') {
			buttons.push(<Button key="fin" onPress={() => { this.finish(); }} title="Entrer" />);
		}

		switch (this.props.status) {
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
			default:
				message = 'Authentification en cours...';
				break;
		}
		return (
			<View style={styles.authentication}>
				<Text>{ message }</Text>
				{ buttons }
			</View>
		);
	}
}

Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;

const styles = {
	authentication: {
		backgroundColor: '#ddeeaa',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
};

export default Authentication;
