import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import Screen from '../../components/screens/manageRegister/Screen';

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
	createCashMovement(note, amount) {
		const uuid = this.props.uuidGenerator.generate();
		const cashMovement = new CashMovement(uuid, amount, note.trim());

		return cashMovement;
	}

	/**
	 * Called when the user created a new CashMovement in the screen. Will create a new CashMovement
	 * and add it to the Register. It is the responsability of the Component to ensure the values
	 * are valid before calling this function. See validate(). If the type is "out", the amount is
	 * inversed (ie. 12.45 => -12.45)
	 *
	 * @param {String} type 'in' or 'out'
	 * @param {String} note
	 * @param {Decimal} rawAmount
	 */
	onAdd(type, note, rawAmount) {
		let amount = rawAmount;

		if (type === 'out') {
			amount = amount.mul(-1);
		}

		const cashMovement = this.createCashMovement(note, amount);
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

	render() {
		const cashMovements = this.props.business.deviceRegister.cashMovements.slice();

		return (
			<Screen
				onFinish={() => { this.onFinish(); }}
				localizer={this.props.localizer}
				onAdd={(...params) => { this.onAdd(...params); }}
				onDeleteCashMovement={(cashMovement) => { this.onDeleteCashMovement(cashMovement); }}
				cashMovements={cashMovements}
				validate={CashMovement.validate}
			/>
		);
	}
}

export default ManageRegister;
