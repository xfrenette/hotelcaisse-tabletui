import Server from 'hotelcaisse-app/dist/servers/Server';
import dummyOrder from './dummyOrder';

class TestServer extends Server {
	delay = 0;
	business = null;

	/**
	 * We create [number] dummy Order with random data.
	 *
	 * @see Server
	 */
	getOrders(from, quantity) {
		const orders = [];

		for (let i = quantity - 1; i >= 0; i -= 1) {
			orders.push(dummyOrder(this.business));
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
