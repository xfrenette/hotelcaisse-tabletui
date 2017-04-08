import React, { Component } from 'react';
import { autorun } from 'mobx';
import { inject } from 'mobx-react/native';
import Decimal from 'decimal.js';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import OpenRegisterScreen from '../../components/screens/OpenRegister';

@inject('router', 'business', 'localizer', 'ui')
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
	 * Opens the register with the supplied employee and amount and redirects to home. First
	 * validates that the values are valid. If they are not valid, shows an alert.
	 *
	 * @param {String} rawEmployee
	 * @param {Decimal} amount
	 */
	onOpen(rawEmployee, amount) {
		const employee = rawEmployee ? rawEmployee.trim() : '';

		if (!this.validateValues(employee, amount)) {
			this.props.ui.showErrorAlert(
				this.t('openRegister.messages.fieldsInvalid.title'),
				this.t('openRegister.messages.fieldsInvalid.content'),
			);
			return;
		}

		// To prevent the register state listener
		this.opening = true;

		this.newRegister.open(employee, amount);
		this.props.business.deviceRegister = this.newRegister;

		this.props.ui.showToast(this.t('openRegister.messages.opened'));
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
			this.props.ui.showToast(message);
		}
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	/**
	 * Returns a boolean indicating if the supplied values for employee and amount are valid to open
	 * the register.
	 * - The employee name must not be empty
	 * - The amount must be a non-negative Decimal
	 *
	 * @param {String} rawEmployee
	 * @param {Decimal} amount
	 * @return {Boolean}
	 */
	validateValues(rawEmployee, amount) {
		const employee = rawEmployee ? rawEmployee.trim() : '';

		if (employee === '') {
			return false;
		}

		if (!(amount instanceof Decimal) || amount.isNegative()) {
			return false;
		}

		return true;
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
				this.onCancel(this.t('openRegister.messages.externallyOpened'));
			}
		});
	}

	render() {
		return (
			<OpenRegisterScreen
				onCancel={(msg) => { this.onCancel(msg); }}
				onOpen={(employee, amount) => { this.onOpen(employee, amount); }}
				localizer={this.props.localizer}
				moneyDenominations={this.props.ui.settings.moneyDenominations}
			/>
		);
	}
}

export default OpenRegister;
