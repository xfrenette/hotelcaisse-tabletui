import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import OrdersScreen from '../../components/screens/orders/Screen';

const NB_ORDERS_TO_LOAD = 10;

@inject('business', 'router', 'localizer', 'ordersServer')
@observer
class Orders extends Component {
	lastLoadedOrder = null;
	/**
	 * Indicates if we think we may have more Orders to load or if we reached the end of the list.
	 *
	 * @type {Boolean}
	 */
	@observable
	hasMoreOrders = true;
	/**
	 * Set to true if we are currently loading the next orders
	 *
	 * @type {Boolean}
	 */
	@observable
	loading = false;
	/**
	 * Orders to show. Updated when new Orders are loaded.
	 *
	 * @type {Array}
	 */
	@observable
	orders = [];

	/**
	 * On mount, reinit properties and load the first Orders
	 */
	componentWillMount() {
		this.hasMoreOrders = true;
		this.loading = false;
		this.orders = [];
		this.loadNextOrders();
	}

	/**
	 * Load the next round of Orders after the [from] Order. When loading finishes, updates the
	 * orders array.
	 *
	 * @param {Order} from
	 */
	loadNextOrders(from) {
		if (this.loading) {
			return;
		}

		this.loading = true;
		requestAnimationFrame(() => {
			this.props.ordersServer.nextOrders(from, NB_ORDERS_TO_LOAD)
				.then((orders) => {
					this.loading = false;

					if (orders.length) {
						this.orders.push(...orders);
						this.lastLoadedOrder = orders[orders.length - 1];
					} else {
						this.hasMoreOrders = false;
						this.lastLoadedOrder = null;
					}
				});
		});
	}

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
	 * When the user wants to load the next orders
	 */
	onLoadNextOrders() {
		if (!this.hasMoreOrders) {
			return;
		}

		this.loadNextOrders(this.lastLoadedOrder);
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
				orders={this.orders.slice()}
				customerFields={this.props.business.customerFields}
				loading={this.loading}
				hasMoreOrders={this.hasMoreOrders}
				localizer={this.props.localizer}
				onOrderPress={(order) => { this.onOrderPress(order); }}
				onDone={() => { this.onDone(); }}
				onLoadNextOrders={() => this.onLoadNextOrders()}
			/>
		);
	}
}

export default Orders;
