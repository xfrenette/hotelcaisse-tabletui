import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import Product from 'hotelcaisse-app/dist/business/Product';
import Register from 'hotelcaisse-app/dist/business/Register';
import Room from 'hotelcaisse-app/dist/business/Room';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import { TextField, EmailField, SelectField, PhoneField, NumberField } from 'hotelcaisse-app/dist/fields';
import products from './products';

/**
 * Returns a Business instance that is the "locally saved" Business instance when the app starts.
 */

const register = new Register();
register.open('Xavier Frenette', new Decimal(100));

const cashMovement1 = new CashMovement('cm1', new Decimal(12));
cashMovement1.note = 'Test cash in avec une note qui est vraiment longue';
cashMovement1.uuid = 'test-uuid-1';

const cashMovement2 = new CashMovement('cm2', new Decimal(-1.45));
cashMovement2.note = 'Test cash out';
cashMovement2.uuid = 'test-uuid-2';

register.addCashMovement(cashMovement1);
register.addCashMovement(cashMovement2);

const rootCategory = new ProductCategory();
rootCategory.uuid = '__root__';

rootCategory.products = [products[0], products[1], products[2]];

const subCategory1 = new ProductCategory();
subCategory1.uuid = 'sc1';
subCategory1.name = 'Personne additionnelle';
subCategory1.products = [products[3], products[4], products[5]];

const subCategory2 = new ProductCategory();
subCategory2.uuid = 'sc2';
subCategory2.name = 'Divers';
subCategory2.products = [products[6], products[7], products[8], products[9]];

rootCategory.categories.push(subCategory1);
rootCategory.categories.push(subCategory2);

const business = new Business();
business.uuid = 'business-uuid';
business.deviceRegister = register;
business.rootProductCategory = rootCategory;
business.products = products;

const nameField = new TextField();
nameField.uuid = 'name-field';
nameField.required = true;
const emailField = new EmailField();
emailField.uuid = 'email-field';
const phoneField = new PhoneField();
phoneField.uuid = 'phone-field';
const memberIdField = new TextField();
memberIdField.uuid = 'memberIdField-field';
const countrySelect = new SelectField();
countrySelect.uuid = 'country-select';
countrySelect.values = {
	canada: 'Canada',
	usa: 'États-Unis',
	france: 'France',
};
const nbAdultsField = new NumberField();
nbAdultsField.uuid = 'nb-adults-field';
const nbTeensField = new NumberField();
nbTeensField.uuid = 'nb-teens-field';
const nbChildrenField = new NumberField();
nbChildrenField.uuid = 'nb-children-field';

business.customerFields = {
	fields: [nameField, emailField, countrySelect, phoneField, memberIdField],
	labels: {
		'name-field': 'Nom complet',
		'email-field': 'Courriel',
		'phone-field': 'Téléphone',
		'memberIdField-field': '# membre HI',
		'country-select': 'Pays',
	},
	essentials: {
		name: 'name-field',
	},
};

business.roomSelectionFields = {
	fields: [nbAdultsField, nbTeensField, nbChildrenField],
	labels: {
		'nb-adults-field': 'Adultes (18+)',
		'nb-teens-field': 'Enfants 7-17',
		'nb-children-field': 'Enfants 0-6',
	},
};

for (let i = 1; i <= 6; i += 1) {
	const room = new Room();
	room.uuid = `room_${i}`;
	room.name = `Chambre ${i}`;
	business.rooms.push(room);
}

business.transactionModes.push(new TransactionMode('tm1', 'Argent'));
business.transactionModes.push(new TransactionMode('tm2', 'Visa'));
business.transactionModes.push(new TransactionMode('tm3', 'Mastercard'));
business.transactionModes.push(new TransactionMode('tm4', 'Interac'));

export default business;
