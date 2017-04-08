import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Decimal from 'decimal.js';
import CloseRegisterScreen from '../../components/screens/CloseRegister';

@inject('router', 'business', 'localizer', 'ui')
class CloseRegister extends Component {
	/**
	 * Closes the register after validating the data. If the data is not valid, shows an alert, else
	 * redirects to home and shows a Toaster.
	 *
	 * @param {Decimal} amount
	 * @param {String} POSTRef
	 * @param {Decimal} POSTAmount
	 */
	onClose(amount, POSTRef, POSTAmount) {
		if (!this.validateValues(amount, POSTRef, POSTAmount)) {
			this.props.ui.showErrorAlert(
				this.t('closeRegister.messages.fieldsInvalid.title'),
				this.t('closeRegister.messages.fieldsInvalid.content'),
			);
			return;
		}

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
	 * Validates the values that will be sent to Register.close
	 * - amount : must be a non-negative Decimal
	 * - rawPOSTRef : must be a non-empty string
	 * - POSTAmount : must be a non-negative Decimal
	 *
	 * @param {Decimal} amount
	 * @param {String} rawPOSTRef
	 * @param {Decimal} POSTAmount
	 * @return {Boolean}
	 */
	validateValues(amount, rawPOSTRef, POSTAmount) {
		const POSTRef = rawPOSTRef ? rawPOSTRef.trim() : '';

		if (POSTRef === '') {
			return false;
		}

		if (!(amount instanceof Decimal) || amount.isNegative()) {
			return false;
		}

		if (!(POSTAmount instanceof Decimal) || POSTAmount.isNegative()) {
			return false;
		}

		return true;
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

	render() {
		return (
			<CloseRegisterScreen
				onCancel={(msg) => { this.onCancel(msg); }}
				onClose={(amount, POSTRef, POSTAmount) => { this.onClose(amount, POSTRef, POSTAmount); }}
				localizer={this.props.localizer}
				moneyDenominations={this.props.ui.settings.moneyDenominations}
			/>
		);
	}
}

export default CloseRegister;
