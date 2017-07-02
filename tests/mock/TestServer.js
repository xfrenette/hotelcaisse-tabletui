import Server from 'hotelcaisse-app/dist/servers/Server';
import dummyOrder from './dummyOrder';

class TestServer extends Server {
	delay = 0;
	business = null;
	ordersLoadingCount = 0;
	// After this amount of loading, we return an empty array. Set to null to disable
	maxOrderLoads = null;

	/**
	 * We create [number] dummy Order with random data. If a [from] Order is supplied, the next ones
	 * will have a latestCheckOutDate equal or sooner than the [from] Order.
	 *
	 * @see Server
	 */
	nextOrders(from, quantity) {
		const orders = [];

		if (!from) {
			this.ordersLoadingCount = 0;
		}

		this.ordersLoadingCount += 1;

		if (this.maxOrderLoads !== null && this.ordersLoadingCount > this.maxOrderLoads) {
			return this.resolveInDelay([]);
		}

		const randDays = Math.ceil(Math.random() * 4);
		let lastCheckOutDate = new Date(Date.now() + (randDays * 24 * 60 * 60 * 1000));

		if (from) {
			lastCheckOutDate = from.latestCheckOutDate;
		}

		for (let i = quantity - 1; i >= 0; i -= 1) {
			const order = dummyOrder(this.business, lastCheckOutDate);
			lastCheckOutDate = order.latestCheckOutDate;
			orders.push(order);
		}

		return this.resolveInDelay(orders);
	}

	resolveInDelay(data) {
		return new Promise((resolve) => {
			if (this.delay === 0) {
				resolve(data);
			} else {
				setTimeout(() => resolve(data), this.delay);
			}
		});
	}
}

export default TestServer;