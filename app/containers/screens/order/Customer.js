import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/Customer';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'register', 'business')
class Customer extends Component {
	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				customer={this.props.order.customer}
				roomSelections={this.props.order.roomSelections}
				customerFields={this.props.business.customerFields}
				{...this.props}
			/>
		);
	}
}

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
