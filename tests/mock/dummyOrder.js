import Order from 'hotelcaisse-app/dist/business/Order';
import Customer from 'hotelcaisse-app/dist/business/Customer';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Decimal from 'decimal.js';
import faker from 'faker';

let uuid = 0;
const ONE_DAY = 24 * 60 * 60 * 1000;

function generateUUID() {
	uuid += 1;
	return `dummyOrder-uuid-${uuid}`;
}

function dummyDate() {
	const nbDays = Math.random() * 5;
	const date = new Date(Date.now() - (nbDays * ONE_DAY));
	date.setHours(0, 0, 0, 0);

	return date;
}

function dateBefore(date, nbDays) {
	const newDate = new Date(date.getTime() - (nbDays * ONE_DAY));
	return newDate;
}

function dummyCustomer(fields) {
	const customer = new Customer(generateUUID());

	fields.forEach((field) => {
		if (field.role === 'customer.name') {
			customer.setFieldValue(field, faker.name.findName());
		} else if (field.type === 'EmailField') {
			customer.setFieldValue(field, faker.internet.email());
		} else if (field.type === 'PhoneField') {
			customer.setFieldValue(field, faker.phone.phoneNumber());
		} else if (field.type === 'YesNoField') {
			customer.setFieldValue(field, faker.random.arrayElement(['1', '0']));
		}
	});

	return customer;
}

function dummyItem(products) {
	const item = new Item(generateUUID());
	item.quantity = Math.ceil(Math.random() * 3);

	while (true) {
		const randIndex = Math.floor(Math.random() * products.length);
		const product = products[randIndex];
		if (!product.hasVariants) {
			item.product = product;
			break;
		}
	}

	return item;
}

function dummyCredit() {
	const amount = Math.round(Math.random() * 10000) / 100;
	return new Credit(generateUUID(), new Decimal(amount), faker.finance.account());
}

function addTransactions(order, modes) {
	if (Math.random() < 0.2) {
		// No transactions
		return;
	}

	const mode = modes[Math.floor(Math.random() * modes.length)];
	let amount = new Decimal(order.balance);

	if (Math.random() > 0.8) {
		amount = amount.div(2).toDecimalPlaces(2);
	}

	const transaction = new Transaction(generateUUID(), amount, mode);
	order.transactions.push(transaction);

	if (Math.random() > 0.8) {
		amount = new Decimal(Math.random() * 5).toDecimalPlaces(2);
		const extraTransaction = new Transaction(generateUUID(), amount, mode);
		order.transactions.push(extraTransaction);
	}
}

function dummyRoomSelection(rooms, fields, latestCheckOutDate) {
	latestCheckOutDate = latestCheckOutDate || new Date();
	latestCheckOutDate.setHours(0, 0, 0, 0);
	const endDate = dateBefore(latestCheckOutDate, Math.floor(Math.random() * 2));
	const startDate = dateBefore(endDate, Math.ceil(Math.random() * 3));

	const roomSelection = new RoomSelection(generateUUID());
	roomSelection.room = rooms[Math.floor(Math.random() * rooms.length)];
	roomSelection.startDate = startDate;
	roomSelection.endDate = endDate;

	fields.forEach((field) => {
		if (field.type === 'NumberField') {
			const nb = Math.floor(Math.random() * 3);
			roomSelection.setFieldValue(field, nb);
		}
	});

	return roomSelection;
}

function dummyOrder(business, latestCheckOutDate, localizer) {
	const order = new Order(generateUUID());
	order.localizer = localizer;
	order.customer = dummyCustomer(business.customerFields);
	order.note = Math.random() > 0.5 ? faker.lorem.sentence() : null;

	const nbItems = Math.ceil(Math.random() * 3) + 1;

	for (let i = nbItems - 1; i >= 0; i -= 1) {
		order.items.push(dummyItem(business.products));
	}

	if (Math.random() > 0.75) {
		order.credits.push(dummyCredit());
	}

	addTransactions(order, business.transactionModes);

	const nbRoomSelections = Math.ceil(Math.random() * 2);

	for (let i = nbRoomSelections - 1; i >= 0; i -= 1) {
		order.roomSelections.push(dummyRoomSelection(
			business.rooms,
			business.roomSelectionFields,
			latestCheckOutDate
		));
	}

	return order;
}

export default dummyOrder;
