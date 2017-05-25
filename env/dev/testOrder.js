import Decimal from 'decimal.js';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Customer from 'hotelcaisse-app/dist/business/Customer';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import business from './storedBusiness';

const order = new Order('test-order');

const item1 = new Item('test-item1');
item1.quantity = 2;
item1.product = business.products[3];

const item2 = new Item('test-item2');
item2.quantity = 1;
item2.product = business.products[1];

const credit1 = new Credit('test-credit1', new Decimal(8.35), 'Description du crédit #1');

const transactionMode = new TransactionMode('transaction-mode-1', 'Argent');

const transaction1 = new Transaction('transaction-1', new Decimal(20), transactionMode);

order.items.push(item1);
order.items.push(item2);
order.credits.push(credit1);
order.transactions.push(transaction1);

export default order;
