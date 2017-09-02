import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/ModalCustomer';
import RoomSelectionsForm from './RoomSelectionsForm';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'business')
class ModalCustomer extends Component {
	modal = null;
	@observable
	customerFieldValues = new Map();
	@observable
	roomSelections = [];

	show() {
		this.customerFieldValues.replace(this.props.order.customer.fieldValues);
		this.roomSelections.replace(this.props.order.roomSelections.map(rs => rs.clone()));
		this.modal.show();
	}

	onSave() {
		this.props.order.customer.fieldValues.replace(this.customerFieldValues);
		this.props.order.roomSelections.replace(this.roomSelections);
	}

	validate() {
		let valid = true;

		// Validate customer fields
		this.props.business.customerFields.forEach((field) => {
			const value = this.customerFieldValues.get(field.id);
			valid = valid && field.validate(value) === undefined;
		});

		// Validate room selections
		this.roomSelections.forEach((roomSelection) => {
			// Make sure a room was selected
			if (!roomSelection.room) {
				valid = false;
				return;
			}

			valid = valid && roomSelection.validate() === undefined;
		});

		return valid;
	}

	render() {
		return (
			<ComponentElement
				ref={(node) => { this.modal = node; }}
				RoomSelectionsForm={(props) => (
					<RoomSelectionsForm
						roomSelections={this.roomSelections}
						{...props}
					/>
				)}
				localizer={this.props.localizer}
				customerFieldValues={this.customerFieldValues}
				roomSelections={this.roomSelections}
				customerFields={this.props.business.customerFields}
				roomSelectionFields={this.props.business.roomSelectionFields}
				rooms={this.props.business.rooms}
				validate={() => this.validate()}
				onSave={() => { this.onSave(); }}
			/>
		);
	}
}

ModalCustomer.propTypes = propTypes;
ModalCustomer.defaultProps = defaultProps;

export default ModalCustomer;
