import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import Decimal from 'decimal.js';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import ManageRegisterScreen from '../../components/screens/ManageRegister';

@inject('router', 'business', 'localizer', 'uuidGenerator')
@observer
class ManageRegister extends Component {

	/**
	 * Called when the screen wants to leave the page
	 */
	onFinish() {
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
	 * Creates a new CashMovement with the description and amount. Also gives it a new UUID.
	 *
	 * @param {String} description
	 * @param {Decimal} amount
	 * @return {CashMovement}
	 */
	createCashMovement(description, amount) {
		const cashMovement = new CashMovement(amount);
		cashMovement.uuid = this.props.uuidGenerator.generate();
		cashMovement.note = description;

		return cashMovement;
	}

	/**
	 * Called when the user created a new CashMovement in the screen. Will first validate and if it
	 * passes, will create a new CashMovement and add it to the Register. If the type is "out", the
	 * amount is inversed (ie. 12.45 => -12.45)
	 *
	 * @param {String} type 'in' or 'out'
	 * @param {String} rawDescription
	 * @param {Decimal} rawAmount
	 */
	onAddCashMovement(type, rawDescription, rawAmount) {
		const description = rawDescription.trim();
		const validationResult = this.validateEntries(description, rawAmount);

		if (!validationResult.valid) {
			return;
		}

		let amount = new Decimal(rawAmount);
		if (type === 'out') {
			amount = amount.mul(-1);
		}

		const cashMovement = this.createCashMovement(description, amount);

		this.props.business.deviceRegister.addCashMovement(cashMovement);
	}

	/**
	 * Called when the user wants to delete a CashMovement. Removes it from the Register.
	 *
	 * @param {CashMovement} cashMovement
	 */
	onDeleteCashMovement(cashMovement) {
		this.props.business.deviceRegister.removeCashMovement(cashMovement);
	}

	/**
	 * Returns a validation object specifying if the description and amount are valid values to give
	 * to a new CashMovement. The returned object has the following structure :
	 * {
	 * 	valid: boolean
	 * 	message : string, contains a translated error message
	 * }
	 *
	 * @param {String} description
	 * @param {Number} amount
	 * @return {object}
	 */
	validateEntries(description, amount) {
		const result = {
			valid: true,
			message: null,
		};

		if (typeof amount !== 'number' || amount <= 0) {
			result.valid = false;
			result.message = this.t('manageRegister.errors.invalidAmount');
			return result;
		}

		if (typeof description !== 'string' || description.trim() === '') {
			result.valid = false;
			result.message = this.t('manageRegister.errors.emptyDescription');
			return result;
		}

		return result;
	}

	render() {
		const cashMovements = this.props.business.deviceRegister.cashMovements.slice();

		return (
			<ManageRegisterScreen
				onFinish={() => { this.onFinish(); }}
				localizer={this.props.localizer}
				validation={(...params) => this.validateEntries(...params)}
				onAddCashMovement={(...params) => { this.onAddCashMovement(...params); }}
				onDeleteCashMovement={(cashMovement) => { this.onDeleteCashMovement(cashMovement); }}
				cashMovements={cashMovements}
			/>
		);
	}
}

export default ManageRegister;
