import Decimal from 'decimal.js';
import Business from 'hotelcaisse-app/dist/business/Business';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import Product from 'hotelcaisse-app/dist/business/Product';
import Register, { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';

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
product1.price = new Decimal(60);
product1.taxes = [
	{ name: 'TPS', amount: new Decimal(3) },
	{ name: 'TVQ', amount: new Decimal(5.45) },
];

const product2 = new Product();
product2.uuid = 'p2';
product2.name = 'Dortoir';
product2.price = new Decimal(20);
product2.taxes = [
	{ name: 'TPS', amount: new Decimal(2) },
	{ name: 'TVQ', amount: new Decimal(3.68) },
];

const product3 = new Product();
product3.uuid = 'p3';
product3.name = 'Adulte';
product3.price = new Decimal(20);
product3.taxes = [
	{ name: 'TPS', amount: new Decimal(2) },
	{ name: 'TVQ', amount: new Decimal(3.68) },
];

rootCategory.products.push(product1);
rootCategory.products.push(product2);

const subCategory1 = new ProductCategory();
subCategory1.uuid = 'sc1';
subCategory1.name = 'Personne additionnelle';
subCategory1.products.push(product1);
subCategory1.products.push(product2);
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
business.products = [product1, product2, product3];

export default business;
