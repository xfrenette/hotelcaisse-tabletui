import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import Product from 'hotelcaisse-app/dist/business/Product';
import Register from 'hotelcaisse-app/dist/business/Register';
import Room from 'hotelcaisse-app/dist/business/Room';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import { NameField, TextField, EmailField, SelectField, PhoneField, NumberField } from 'hotelcaisse-app/dist/fields';
import products from './products';

/**
 * Returns a Business instance that is the "locally saved" Business instance when the app starts.
 */

const register = new Register();

const cashMovement1 = new CashMovement('cm1', new Decimal(12));
cashMovement1.note = 'Test cash in avec une note qui est vraiment longue';
cashMovement1.uuid = 'test-uuid-1';

const cashMovement2 = new CashMovement('cm2', new Decimal(-1.45));
cashMovement2.note = 'Test cash out';
cashMovement2.uuid = 'test-uuid-2';

const rootCategory = new ProductCategory();
rootCategory.uuid = '__root__';

rootCategory.products = [products[0], products[3], products[6]];

const subCategory1 = new ProductCategory();
subCategory1.uuid = 'sc1';
subCategory1.name = 'Personne additionnelle';
subCategory1.products = [products[9], products[12], products[15]];

const subCategory2 = new ProductCategory();
subCategory2.uuid = 'sc2';
subCategory2.name = 'Divers';
subCategory2.products = [products[16], products[19], products[20], products[21]];

rootCategory.categories.push(subCategory1);
rootCategory.categories.push(subCategory2);

const business = new Business();
business.uuid = 'business-uuid';
business.deviceRegister = register;
business.rootProductCategory = rootCategory;
business.products = products;

register.open('Xavier Frenette', new Decimal(100));
register.addCashMovement(cashMovement1);
register.addCashMovement(cashMovement2);

const nameField = new NameField();
nameField.uuid = 'name-field';
nameField.required = true;
nameField.label = 'Nom complet';
nameField.role = 'customer.name';
const emailField = new EmailField();
emailField.uuid = 'email-field';
emailField.label = 'Courriel';
emailField.role = 'customer.email';
const phoneField = new PhoneField();
phoneField.label = 'Téléphone';
phoneField.uuid = 'phone-field';
const memberIdField = new TextField();
memberIdField.uuid = 'memberIdField-field';
memberIdField.label = '# de membre H.I.';
const countrySelect = new SelectField();
countrySelect.uuid = 'country-select';
countrySelect.label = 'Pays';
countrySelect.defaultValue = 'canada';
countrySelect.values = {
	france: 'France',
	canada: 'Canada',
	usa: 'États-Unis',
};
const numberFieldConstraints = {
	onlyInteger: true,
	greaterThanOrEqualTo: 0,
};
const nbAdultsField = new NumberField();
nbAdultsField.uuid = 'nb-adults-field';
nbAdultsField.label = 'Adultes (18+)';
nbAdultsField.defaultValue = 1;
nbAdultsField.constraints = numberFieldConstraints;
const nbTeensField = new NumberField();
nbTeensField.uuid = 'nb-teens-field';
nbTeensField.label = 'Enfants 7-17 ans';
nbTeensField.defaultValue = 0;
nbTeensField.constraints = numberFieldConstraints;
const nbChildrenField = new NumberField();
nbChildrenField.uuid = 'nb-children-field';
nbChildrenField.label = 'Enfants 0-6 ans';
nbChildrenField.defaultValue = 0;
nbChildrenField.constraints = numberFieldConstraints;

business.customerFields = [nameField, emailField, countrySelect, phoneField, memberIdField];
business.roomSelectionFields = [nbAdultsField, nbTeensField, nbChildrenField];

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
