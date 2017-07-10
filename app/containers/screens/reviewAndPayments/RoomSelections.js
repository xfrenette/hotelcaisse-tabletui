import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import RoomSelectionsComponent from '../../../components/screens/reviewAndPayments/RoomSelections';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
};

const defaultProps = {
};

@inject('localizer', 'router')
class RoomSelections extends Component {
	/**
	 * When the user presses the "Edit room selections" button. Redirect to the edit room selections
	 * screen.
	 */
	onEditRoomSelections() {
		this.props.router.push(
			'/order/customer-roomSelections',
			{ order: this.props.order, thenReturn: true },
		);
	}

	render() {
		return (
			<RoomSelectionsComponent
				order={this.props.order}
				localizer={this.props.localizer}
				onEditRoomSelections={() => { this.onEditRoomSelections(); }}
			/>
		);
	}
}

RoomSelections.propTypes = propTypes;
RoomSelections.defaultProps = defaultProps;

export default RoomSelections;
