import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import Screen from '../../components/screens/reviewAndPayments/Screen';

@inject('localizer', 'uuidGenerator', 'router', 'business')
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

	onSave() {
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
				onSave={() => { this.onSave(); }}
			/>
		);
	}
}

export default ReviewAndPayments;
