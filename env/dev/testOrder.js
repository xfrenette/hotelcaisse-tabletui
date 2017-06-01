import Decimal from 'decimal.js';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Product from 'hotelcaisse-app/dist/business/Product';
import Customer from 'hotelcaisse-app/dist/business/Customer';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import products from './products';

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
customer.fieldValues = {
	'name-field': 'Xavier Frenette',
	'email-field': 'xavier@xavierfrenette.com',
	'country-select': 'canada',
};

order.items.push(item1);
order.items.push(item2);
order.items.push(item3);
order.credits.push(credit1);
order.transactions.push(transaction1);
order.customer = customer;

export default order;
