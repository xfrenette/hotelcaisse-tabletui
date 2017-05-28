import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Register from 'hotelcaisse-app/dist/business/Register';
import Decimal from 'decimal.js';
import CloseRegisterScreen from '../../components/screens/closeRegister/Screen';

@inject('router', 'business', 'localizer', 'ui')
class CloseRegister extends Component {
	/**
	 * Closes the register. It is the responsibility of the component to ensure the data is valid
	 * calling this method (see the validate method).
	 *
	 * @param {Decimal} amount
	 * @param {String} POSTRef
	 * @param {Decimal} POSTAmount
	 */
	onClose(amount, POSTRef, POSTAmount) {
		const register = this.props.business.deviceRegister;
		register.close(amount, POSTRef, POSTAmount);

		this.props.ui.showToast(this.t('closeRegister.messages.closed'));
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
	 * Validates close values by calling Register.validateClose() and returns its result.
	 *
	 * @param {Object} values (valid keys: POSTRef, POSTAmount, cashAmount)
	 * @return {Object}
	 */
	validate(values) {
		return Register.validateClose(values);
	}

	render() {
		return (
			<CloseRegisterScreen
				onCancel={(msg) => { this.onCancel(msg); }}
				onClose={(amount, POSTRef, POSTAmount) => { this.onClose(amount, POSTRef, POSTAmount); }}
				localizer={this.props.localizer}
				moneyDenominations={this.props.ui.settings.moneyDenominations}
				validate={values => this.validate(values)}
			/>
		);
	}
}

export default CloseRegister;
