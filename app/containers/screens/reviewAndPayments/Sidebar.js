import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import SidebarComponent from '../../../components/screens/reviewAndPayments/Sidebar';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	canAddTransaction: PropTypes.bool,
};

const defaultProps = {
	canAddTransaction: false,
};

@inject('localizer', 'uuidGenerator', 'business')
@observer
class Sidebar extends Component {
	/**
	 * When the user added a new Transaction, add a transaction, only if the register is opened.
	 *
	 * @param {Decimal} amount
	 * @param {Object} mode
	 */
	onAddTransaction(amount, mode) {
		if (!this.props.canAddTransaction) {
			return;
		}

		const uuid = this.props.uuidGenerator.generate();
		const transaction = new Transaction(uuid, amount, mode);
		this.props.order.transactions.push(transaction);
	}

	render() {
		return (
			<SidebarComponent
				balance={this.props.order.balance.toNumber()}
				canAddTransaction={this.props.canAddTransaction}
				localizer={this.props.localizer}
				transactionModes={this.props.business.transactionModes}
				onAddTransaction={(a, m) => { this.onAddTransaction(a, m); }}
			/>
		);
	}
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
