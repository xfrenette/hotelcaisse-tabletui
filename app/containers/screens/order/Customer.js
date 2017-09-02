import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/Customer';
import ModalCustomer from './ModalCustomer';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'register', 'business')
class Customer extends Component {
	modal = null;

	onShowModal() {
		this.modal.show();
	}

	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				customer={this.props.order.customer}
				roomSelections={this.props.order.roomSelections}
				customerFields={this.props.business.customerFields}
				ModalCustomer={(props) => (
					<ModalCustomer
						ref={(n) => { this.modal = n ? n.wrappedInstance : null; }}
						order={this.props.order}
						{...props}
					/>
				)}
				onShowModal={() => { this.onShowModal(); }}
				{...this.props}
			/>
		);
	}
}

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
