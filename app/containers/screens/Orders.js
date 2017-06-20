import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import OrdersScreen from '../../components/screens/orders/Screen';

@inject('business', 'router', 'localizer', 'ui')
class Orders extends Component {
	/**
	 * When the user presses on an Order, we go to Order's review page
	 *
	 * @param {Order} order
	 */
	onOrderPress(order) {
		this.props.router.push({
			pathname: '/order/review-payments',
			state: {
				order,
				new: false,
			},
		});
	}

	/**
	 * When the user presses the "Done" button, we return to home
	 */
	onDone() {
		this.props.router.replace('/');
	}

	render() {
		return (
			<OrdersScreen
				orders={[]}
				localizer={this.props.localizer}
				onOrderPress={(order) => { this.onOrderPress(order); }}
				onDone={() => { this.onDone(); }}
			/>
		);
	}
}

export default Orders;
