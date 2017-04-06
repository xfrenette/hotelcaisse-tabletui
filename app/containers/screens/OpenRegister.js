import React, { Component } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { autorun } from 'mobx';
import { inject } from 'mobx-react/native';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import OpenRegisterScreen from '../../components/screens/OpenRegister';

@inject('router', 'business', 'localizer', 'settings')
class OpenRegister extends Component {
	/**
	 * New Register instance that will be created.
	 *
	 * @type {Register}
	 */
	newRegister = null;
	/**
	 * Flag indicating if we are currently opening a Register through this component. If true,
	 * prevents the cancellation by the watcher ("the register was opened outside the component").
	 *
	 * @type {Boolean}
	 */
	opening = false;
	/**
	 * Autorun() disposer
	 *
	 * @type {Function}
	 */
	disposer = null;

	componentWillMount() {
		this.newRegister = new Register();
		this.opening = false;
		this.listenToRegisterState();
	}

	componentWillUnmount() {
		if (this.disposer) {
			this.disposer();
			this.disposer = null;
		}
	}

	/**
	 * Opens the register with the supplied employee and amount and redirects to home.
	 *
	 * @param {String} employee
	 * @param {Decimal} amount
	 */
	onOpen(employee, amount) {
		// To prevent the register state listener
		this.opening = true;

		this.newRegister.open(employee, amount);
		this.props.business.deviceRegister = this.newRegister;

		this.showToast(this.props.localizer.t('register.opening.opened'), ToastAndroid.SHORT);
		this.props.router.replace('/');
	}

	/**
	 * Cancels the opening, redirects to the home page and shows the message (as a Toast) if
	 * supplied.
	 *
	 * @param {String} message
	 */
	onCancel(message) {
		this.props.router.replace('/');

		if (message) {
			this.showToast(message, ToastAndroid.SHORT);
		}
	}

	/**
	 * Shows a Toast message only on Android.
	 *
	 * @param {String} message
	 */
	showToast(message) {
		if (Platform.OS === 'android') {
			ToastAndroid.show(message, ToastAndroid.SHORT);
		}
	}

	/**
	 * Listener that listens to changes in business.deviceRegister state. If it changes from outside
	 * this component, cancels and show a message.
	 */
	listenToRegisterState() {
		this.disposer = autorun(() => {
			const register = this.props.business.deviceRegister;
			const state = register ? register.state : REGISTER_STATES.NEW;

			if (!this.opening && state !== REGISTER_STATES.NEW) {
				this.onCancel(this.props.localizer.t('register.opening.opened_outside'));
			}
		});
	}

	render() {
		return (
			<OpenRegisterScreen
				onCancel={(msg) => { this.onCancel(msg); }}
				onOpen={(employee, amount) => { this.onOpen(employee, amount); }}
				localizer={this.props.localizer}
				moneyDenominations={this.props.settings.moneyDenominations}
			/>
		);
	}
}

export default OpenRegister;
