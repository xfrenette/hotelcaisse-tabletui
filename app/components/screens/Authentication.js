import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { Keypad, Text, Button } from '../elements';
import { Container } from '../layout';

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

	/**
	 * When authentication is successful and we are finished with the login screen.
	 */
	onFinish() {
		if (this.props.onFinish) {
			this.props.onFinish();
		}
	}

	/**
	 * Renders the keypad to enter the code and its messages.
	 *
	 * @return {Node}
	 */
	renderKeypad() {
		let message;

		switch (this.props.status) {
			case 'fail':
				message = this.t('auth.messages.fail');
				break;
			case 'error':
				message = this.t('auth.messages.error');
				break;
			case 'authenticating':
				message = this.t('auth.messages.authenticating');
				break;
			default:
				message = this.t('auth.messages.waiting');
				break;
		}

		return (
			<View>
				<Text>{ message }</Text>
				<Keypad
					placeholder={this.t('auth.placeholder')}
					submitLabel={this.t('actions.ok')}
					value={this.code}
					onChange={(val) => { this.code = val; }}
					onSubmit={() => { this.tryAuthenticate(); }}
				/>
			</View>
		);
	}

	/**
	 * Renders the content when authentication was successful
	 *
	 * @return {Node}
	 */
	renderSuccess() {
		return (
			<View>
				<Text>{ this.t('auth.messages.success') }</Text>
				<Button
					title={ this.t('auth.actions.finish') }
					onPress={() => { this.onFinish(); }}
				/>
			</View>
		);
	}

	render() {
		let content;

		if (this.props.status === 'success') {
			content = this.renderSuccess();
		} else {
			content = this.renderKeypad();
		}

		return (
			<View style={styles.authentication}>
				<Container layout="oneColCentered">
					{ content }
				</Container>
			</View>
		);
	}
}

Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;

const styles = {
	authentication: {
		flex: 1,
		justifyContent: 'center',
	},
};

export default Authentication;
