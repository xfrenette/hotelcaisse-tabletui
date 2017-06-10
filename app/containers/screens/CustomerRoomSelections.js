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
	/**
	 * Internal reference to the Order we are currently editing.
	 *
	 * @type {Order}
	 */
	order = null;

	/**
	 * When mounting, we retrieve the Order from the location, else we create a new one.
	 */
	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
	}

	/**
	 * When the user presses the home button
	 */
	onPressHome() {
		this.props.router.replace('/');
	}

	/**
	 * When the user presses the 'return' button
	 */
	onReturn() {
		this.props.router.goBack();
	}

	/**
	 * When the user presses the 'next' button
	 */
	onNext() {
		this.props.router.push('/orders/review-payments', { order: this.order });
	}

	/**
	 * Returns the container Component for the customer form
	 *
	 * @return {Node}
	 */
	renderCustomerContainer() {
		return (
			<CustomerContainer order={this.order} />
		);
	}

	/**
	 * Returns the container Component for the room selections
	 *
	 * @return {Node}
	 */
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
				validate={() => this.order.validate(['customer', 'roomSelections'])}
			/>
		);
	}
}

export default CustomerRoomSelections;
