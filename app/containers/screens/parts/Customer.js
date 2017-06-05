import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import Part from '../../../components/screens/parts/customer/Part';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
};

const defaultProps = {
};

/**
 * The "Customer" screen part is used in 2 different screens (/order/customer-roomselections and
 * /order/customer).
 */
@inject('localizer', 'uuidGenerator', 'business', 'router')
class Customer extends Component {
	get customer() {
		return this.props.order.customer;
	}

	onFieldChange(field, rawValue) {
		const value = rawValue === '' ? null : rawValue;
		this.customer.setFieldValue(field, value);
	}

	render() {
		const customer = this.props.order.customer;
		const fields = this.props.business.customerFields;

		return (
			<Part
				localizer={this.props.localizer}
				customer={customer}
				fields={fields}
				onFieldChange={(field, value) => { this.onFieldChange(field, value); }}
			/>
		);
	}
}

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
