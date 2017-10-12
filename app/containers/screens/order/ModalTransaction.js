import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import ComponentElement from '../../../components/screens/order/ModalTransaction';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'uuidGenerator', 'business')
@observer
class ModalTransaction extends Component {
	modal = null;
	@observable
	editingTransaction = null;

	show(transaction = null) {
		this.editingTransaction = transaction;
		this.modal.show();
	}
	get modes() {
		return this.props.business.transactionModes;
	}

	@computed
	get amount() {
		return this.editingTransaction
			? this.editingTransaction.amount
			: this.props.order.balance;
	}

	@computed
	get mode() {
		return this.editingTransaction
			? this.editingTransaction.transactionMode
			: null;
	}

	validate(fields) {
		if (!(fields.transactionMode instanceof TransactionMode)) {
			return {
				transactionMode: 'Cannot be empty',
			};
		}

		return Transaction.validate(fields);
	}

	onSave(mode, amount) {
		const isNew = this.editingTransaction === null;
		let transaction = isNew
			? new Transaction(this.props.uuidGenerator.generate())
			: this.editingTransaction;

		transaction.transactionMode = mode;
		transaction.amount = amount;

		if (isNew) {
			this.props.order.transactions.push(transaction);
		}
	}

	render() {
		return (
			<ComponentElement
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				validate={this.validate}
				onSave={(m, a) => { this.onSave(m, a); }}
				transactionModes={this.modes}
				transactionMode={this.mode}
				amount={this.amount.toNumber()}
				isNew={!this.editingTransaction}
			/>
		);
	}
}

ModalTransaction.propTypes = propTypes;
ModalTransaction.defaultProps = defaultProps;

export default ModalTransaction;
