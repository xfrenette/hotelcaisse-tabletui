import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import CustomerContainer from './parts/Customer';
import RoomSelectionsContainer from './parts/RoomSelections';
import Screen from '../../components/screens/customerRoomSelections/Screen';

/**
 * This class will only create the the sub containers (that will manage the Customer and
 * RoomSelections screen parts) and when we quit the screen.
 */
@inject('localizer', 'uuidGenerator', 'business', 'router')
@observer
class CustomerRoomSelections extends Component {
	order = null;

	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
	}

	onPressHome() {
		this.props.router.replace('/');
	}

	onReturn() {
		this.props.router.goBack();
	}

	onNext() {
		this.props.router.push('/orders/review-payments', { order: this.order });
	}

	renderCustomerContainer() {
		return (
			<CustomerContainer order={this.order} />
		);
	}

	renderRoomSelectionsContainer() {
		return (
			<RoomSelectionsContainer order={this.order} />
		);
	}

	render() {
		return (
			<Screen
				customerNode={this.renderCustomerContainer()}
				roomSelectionsNode={this.renderRoomSelectionsContainer()}
				localizer={this.props.localizer}
				onPressHome={() => { this.onPressHome(); }}
				onReturn={() => { this.onReturn(); }}
				onNext={() => { this.onNext(); }}
			/>
		);
	}
}

export default CustomerRoomSelections;
