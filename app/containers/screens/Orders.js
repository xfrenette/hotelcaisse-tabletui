import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import OrdersScreen from '../../components/screens/orders/Screen';

@inject('business', 'router', 'localizer', 'ui')
class Orders extends Component {

	render() {
		return (
			<OrdersScreen
				orders={[]}
				localizer={this.props.localizer}
			/>
		);
	}
}

export default Orders;
