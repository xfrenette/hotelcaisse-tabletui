import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import Product from 'hotelcaisse-app/dist/business/Product';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import { TextField, EmailField, SelectField } from 'hotelcaisse-app/dist/fields';

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

const product1 = new Product();
product1.uuid = 'p1';
product1.name = 'Chambre privée';
product1.description = 'Pour un ou deux adultes seulement';

const product11 = new Product();
product11.uuid = 'p11';
product11.name = 'Membre';
product11.price = new Decimal(60);
product11.addTax('TPS', new Decimal(3));
product11.addTax('TVQ', new Decimal(5.45));

const product12 = new Product();
product12.uuid = 'p12';
product12.name = 'Non-membre';
product12.price = new Decimal(70);
product12.addTax('TPS', new Decimal(4));
product12.addTax('TVQ', new Decimal(6.45));

product1.addVariant(product11);
product1.addVariant(product12);

const product2 = new Product();
product2.uuid = 'p2';
product2.name = 'Dortoir';
product2.price = new Decimal(20);
product2.addTax('TPS', new Decimal(2));
product2.addTax('TVQ', new Decimal(3.68));

const product3 = new Product();
product3.uuid = 'p3';
product3.name = 'Adulte';
product3.price = new Decimal(20);
product3.addTax('TPS', new Decimal(2));
product3.addTax('TVQ', new Decimal(3.68));

rootCategory.products.push(product1);
rootCategory.products.push(product2);

const subCategory1 = new ProductCategory();
subCategory1.uuid = 'sc1';
subCategory1.name = 'Personne additionnelle';
subCategory1.products.push(product3);

const subCategory2 = new ProductCategory();
subCategory2.uuid = 'sc2';
subCategory2.name = 'Divers';

rootCategory.categories.push(subCategory1);
rootCategory.categories.push(subCategory2);

const business = new Business();
business.uuid = 'business-uuid';
business.deviceRegister = register;
business.rootProductCategory = rootCategory;
business.products = [product1, product2, product3, product11, product12];

const nameField = new TextField();
nameField.uuid = 'name-field';
const emailField = new EmailField();
emailField.uuid = 'email-field';
const phoneField = new TextField();
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

business.customerFields = {
	fields: [nameField, emailField, phoneField, memberIdField, countrySelect],
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

export default business;
