import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Register from 'hotelcaisse-app/dist/business/Register';
import OpenRegisterScreen from '../../components/screens/openRegister/Screen';

@inject('router', 'register', 'device', 'localizer', 'ui', 'uuidGenerator')
class OpenRegister extends Component {
	componentWillMount() {
		this.opening = false;
	}

	/**
	 * It is the responsibility of the component to validate values before calling this function
	 *
	 * Opens the register with the supplied employee and amount and redirects to home. It is the
	 * responsibility of the component to validate entries before calling this method since we will
	 * not do it here.
	 *
	 * @param {String} employee
	 * @param {Decimal} amount
	 */
	onOpen(employee, amount) {
		const uuid = this.props.uuidGenerator.generate();
		const number = this.props.device.bumpRegisterNumber();

		const newRegister = new Register();
		newRegister.uuid = uuid;
		newRegister.number = number;
		this.props.register.update(newRegister);
		this.props.register.open(employee, amount);

		this.props.ui.showToast(this.t('openRegister.messages.opened'));
		this.props.router.replace('/');
	}

	/**
	 * Cancels the opening, redirects to the home page and shows the message (as a Toast) if
	 * supplied.
	 *
	 * @param {String} message
	 */
	onCancel() {
		this.props.router.replace('/');
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
	 * Validates opening values by calling Register.validateOpen() and returns its result.
	 *
	 * @param {Object} values (valid keys: employee, cashAmount)
	 * @return {Object}
	 */
	validate(values) {
		return Register.validateOpen(values);
	}

	render() {
		return (
			<OpenRegisterScreen
				onCancel={(msg) => { this.onCancel(msg); }}
				onOpen={(employee, amount) => { this.onOpen(employee, amount); }}
				localizer={this.props.localizer}
				moneyDenominations={this.props.ui.settings.moneyDenominations}
				validate={values => this.validate(values)}
			/>
		);
	}
}

export default OpenRegister;
