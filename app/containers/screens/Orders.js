import React, { Component } from 'react';
import { observable, computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import OrdersScreen from '../../components/screens/orders/Screen';

const NB_ORDERS_TO_LOAD = 10;

@inject('ui', 'business', 'router', 'localizer', 'ordersServer')
@observer
class Orders extends Component {
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
	 * On mount, reinit properties and load the first Orders
	 */
	componentWillMount() {
		this.hasMoreOrders = true;
		this.loading = false;
		if (!this.orders.length) {
			this.loadNextOrders();
		}
	}

	/**
	 * Simple alias to UI.loadedOrders (which is observable)
	 *
	 * @return {Array<Order>}
	 */
	@computed
	get orders() {
		return this.props.ui.loadedOrders;
	}

	/**
	 * Utility function to add orders to UI.loadedOrders
	 *
	 * @param {Array<Order>} orders
	 */
	addOrders(orders) {
		this.props.ui.loadedOrders.push(...orders);
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
			this.props.ordersServer.nextOrders(NB_ORDERS_TO_LOAD, from)
				.then((orders) => {
					this.loading = false;

					if (orders.length) {
						this.addOrders(orders);
					} else {
						this.hasMoreOrders = false;
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
			pathname: '/order',
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

		const lastOrder = this.orders.length ? this.orders[this.orders.length - 1] : null;
		this.loadNextOrders(lastOrder);
	}

	/**
	 * When the user presses the "Done" button, we return to home
	 */
	onDone() {
		this.props.router.replace('/');
	}

	/**
	 * When the user pulls down to refresh. We clear the list of orders and restart a loading.
	 */
	onRefresh() {
		this.orders.clear();
		this.loadNextOrders();
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
				onRefresh={() => { this.onRefresh(); }}
				onDone={() => { this.onDone(); }}
				onLoadNextOrders={() => this.onLoadNextOrders()}
			/>
		);
	}
}

export default Orders;
