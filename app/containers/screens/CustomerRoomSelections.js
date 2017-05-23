import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Screen from '../../components/screens/customerRoomSelections/Screen';

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

	onAddRoomSelection() {
		const roomSelection = new RoomSelection();
		roomSelection.uuid = this.props.uuidGenerator.generate();
		this.order.roomSelections.push(roomSelection);
	}

	onDeleteRoomSelection(roomSelection) {
		this.order.removeRoomSelection(roomSelection);
	}

	render() {
		const customerFields = this.props.business.customerFields;
		const roomSelectionFields = this.props.business.roomSelectionFields;

		return (
			<Screen
				order={this.order}
				rooms={this.props.business.rooms}
				localizer={this.props.localizer}
				customerFields={customerFields}
				roomSelectionFields={roomSelectionFields}
				onAddRoomSelection={() => { this.onAddRoomSelection(); }}
				onDeleteRoomSelection={(rs) => { this.onDeleteRoomSelection(rs); }}
				onPressHome={() => { this.onPressHome(); }}
				onReturn={() => { this.onReturn(); }}
				onNext={() => { this.onNext(); }}
			/>
		);
	}
}

export default CustomerRoomSelections;
