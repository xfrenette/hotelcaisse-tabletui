import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import Screen from '../../components/screens/CustomerRoomSelections';

@inject('localizer', 'uuidGenerator')
@observer
class CustomerRoomSelections extends Component {
	order = null;

	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
	}

	render() {
		return (
			<Screen
				order={this.order}
				localizer={this.props.localizer}
			/>
		);
	}
}

export default CustomerRoomSelections;
