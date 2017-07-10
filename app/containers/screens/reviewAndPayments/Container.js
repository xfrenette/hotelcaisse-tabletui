import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import Screen from '../../../components/screens/reviewAndPayments/Screen';

@inject('localizer', 'uuidGenerator', 'router', 'business', 'ui')
@observer
class ReviewAndPayments extends Component {
	order = null;
	isNew = false;

	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
		this.order.customer.fields = this.props.business.customerFields;
		this.isNew = get(this.props, 'location.state.new', false);
	}

	onPressHome() {
		this.props.router.replace('/');
	}

	onReturn() {
		this.props.router.goBack();
	}

	onEditCustomer() {
		this.props.router.push(
			'/order/customer-roomSelections',
			{ order: this.order, thenReturn: true },
		);
	}

	onEditRoomSelections() {
		this.props.router.push(
			'/order/customer-roomSelections',
			{ order: this.order, thenReturn: true },
		);
	}

	onAddTransaction(amount, mode) {
		const uuid = this.props.uuidGenerator.generate();
		const transaction = new Transaction(uuid, amount, mode);
		this.order.transactions.push(transaction);
	}

	onDone() {
		this.props.ui.orderDraft = null;
		this.props.router.push('/');
	}

	render() {
		return (
			<Screen
				order={this.order}
				isNew={this.isNew}
				localizer={this.props.localizer}
				transactionModes={this.props.business.transactionModes}
				onPressHome={() => { this.onPressHome(); }}
				onReturn={() => { this.onReturn(); }}
				onDone={() => { this.onDone(); }}
				onEditCustomer={() => { this.onEditCustomer(); }}
				onEditRoomSelections={() => { this.onEditRoomSelections(); }}
				onAddTransaction={(a, m) => { this.onAddTransaction(a, m); }}
			/>
		);
	}
}

export default ReviewAndPayments;
