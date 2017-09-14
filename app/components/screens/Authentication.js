import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { Text, Button, TextInput, Title, Message } from '../elements';
import { Container } from '../layout';
import styleVars from '../../styles/variables';
import layoutStyles from '../../styles/layout';
import buttonStyles from '../../styles/buttons';

const propTypes = {
	status: PropTypes.string,
	localizer: PropTypes.object,
	onAuthenticate: PropTypes.func,
	onFinish: PropTypes.func,
};

const defaultProps = {
	status: null,
	localizer: null,
	onAuthenticate: null,
	onFinish: null,
};

@inject('localizer')
@observer
class Authentication extends Component {
	/**
	 * Code currently entered on the keypad
	 *
	 * @type {String}
	 */
	@observable
	code = '';

	/**
	 * When mounting, reset the screen
	 */
	componentWillMount() {
		this.reset();
	}

	/**
	 * When unmounting, reset the screen
	 */
	componentWillUnmount() {
		this.reset();
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	/**
	 * Reset the screen: resets the code.
	 */
	reset() {
		this.code = '';
	}

	/**
	 * Tries to authenticate with the code in the [code] property
	 */
	tryAuthenticate() {
		if (this.code && this.props.onAuthenticate) {
			this.props.onAuthenticate(this.code);
		}
	}

	get authMessage() {
		let message;

		switch (this.props.status) {
			case 'fail':
				message = this.t('auth.messages.fail');
				break;
			case 'error':
				message = this.t('auth.messages.error');
				break;
			default:
				message = null;
				break;
		}

		return message;
	}

	renderForm() {
		const isAuthenticating = this.props.status === 'authenticating';
		const buttonText = this.t(`auth.actions.${isAuthenticating ? 'authenticating' : 'authenticate'}`);
		const buttonLayout = isAuthenticating ? buttonStyles.disabled : buttonStyles.primary;
		const message = this.authMessage;
		let messageNode = null;

		if (message) {
			messageNode = (
				<Message type="error">{ message }</Message>
			);
		}

		return (
			<View>
				<Title style={layoutStyles.title}>Autorisation</Title>
				<View style={layoutStyles.block}>
					<Text>{ this.t('auth.intro') }</Text>
				</View>
				<View style={layoutStyles.block}>
					<View style={viewStyles.inputContainer}>
						<View style={viewStyles.input}>
							<TextInput
								style={textStyles.input}
								placeholder={this.t('auth.placeholder')}
								placeholderTextColor={styleVars.colors.grey1}
								keyboardType="numeric"
								value={this.code}
								onChangeText={(t) => { this.code = t; }}
								onSubmitEditing={() => { this.tryAuthenticate(); }}
								selectTextOnFocus
							/>
						</View>
					</View>
					{ messageNode }
				</View>
				<View style={viewStyles.actions}>
					<Button
						title={buttonText}
						layout={buttonLayout}
						onPress={() => { this.tryAuthenticate(); }}
					/>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={viewStyles.authentication}>
				<Container layout="oneColCentered">
					{ this.renderForm() }
				</Container>
			</View>
		);
	}
}

Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;

const viewStyles = {
	authentication: {
		flex: 1,
		justifyContent: 'center',
	},
	input: {
		width: 200,
	},
	inputContainer: {
		alignItems: 'center',
	},
	actions: {
		alignItems: 'flex-end',
	},
};

const textStyles = {
	input: {
		textAlign: 'center',
		fontSize: styleVars.bigFontSize,
	},
};

export default Authentication;
