import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import CustomerComponent from '../../../components/screens/reviewAndPayments/Customer';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
};

const defaultProps = {
};

@inject('localizer', 'router')
class Customer extends Component {
	/**
	 * When the user presses the "Edit customer details" button. Redirect to the edit customer
	 * screen.
	 */
	onEditCustomer() {
		this.props.router.push(
			'/order/customer-roomSelections',
			{ order: this.props.order, thenReturn: true },
		);
	}

	render() {
		return (
			<CustomerComponent
				customer={this.props.order.customer}
				localizer={this.props.localizer}
				onEditCustomer={() => { this.onEditCustomer(); }}
			/>
		);
	}
}

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
