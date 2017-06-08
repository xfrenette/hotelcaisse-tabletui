import Decimal from 'decimal.js';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Product from 'hotelcaisse-app/dist/business/Product';
import Customer from 'hotelcaisse-app/dist/business/Customer';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import products from './products';
import storedBusiness from './storedBusiness';

const ONE_DAY = 24 * 60 * 60 * 1000;

function createDateFromNow(daysDiff) {
	const date = new Date(Date.now() + (daysDiff * ONE_DAY));
	date.setHours(0, 0, 0, 0);
	return date;
}

const order = new Order('test-order');
order.note = 'Lorem ipsum dolor sit amet.';

const item1 = new Item('test-item1');
item1.quantity = 2;
item1.product = products[2];

const item2 = new Item('test-item2');
item2.quantity = 1;
item2.product = products[19];

const customProduct = new Product();
customProduct.uuid = 'test-product';
customProduct.name = 'Produit custom';
customProduct.price = new Decimal(12.34);
customProduct.isCustom = true;

const item3 = new Item('test-item3');
item3.quantity = 1;
item3.product = customProduct;

const credit1 = new Credit('test-credit1', new Decimal(8.35), 'Description du crédit #1');

const transactionMode = new TransactionMode('transaction-mode-1', 'Argent');

const transaction1 = new Transaction('transaction-1', new Decimal(20), transactionMode);

const customer = new Customer('customer-uuid');
customer.fieldValues.replace({
	'name-field': 'Xavier Frenette',
	'email-field': 'xavier@xavierfrenette.com',
	'country-select': 'canada',
});

const roomSelection1 = new RoomSelection('room-selection-1');
roomSelection1.room = storedBusiness.rooms[2];
roomSelection1.startDate = createDateFromNow(-1);
roomSelection1.endDate = createDateFromNow(1);
roomSelection1.fieldValues.replace({
	'nb-adults-field': 2,
	'nb-teens-field': 1,
	'nb-children-field': 0,
});

const roomSelection2 = new RoomSelection('room-selection-2');
roomSelection2.room = storedBusiness.rooms[1];
roomSelection2.startDate = createDateFromNow(-1);
roomSelection2.endDate = createDateFromNow(1);
roomSelection2.fieldValues.replace({
	'nb-adults-field': 1,
	'nb-teens-field': 2,
	'nb-children-field': 3,
});

order.items.push(item1);
order.items.push(item2);
order.items.push(item3);
order.credits.push(credit1);
order.transactions.push(transaction1);
order.customer = customer;
order.roomSelections.push(roomSelection1);
order.roomSelections.push(roomSelection2);

export default order;
