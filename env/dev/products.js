import Decimal from 'decimal.js';
import Product from 'hotelcaisse-app/dist/business/Product';
import AppliedTax from 'hotelcaisse-app/dist/business/AppliedTax';

let id = 0;

const productsData = [
	{
		name: 'Chambre privée',
		description: 'Pour un ou deux adultes seulement',
		variants: [70, 62.5],
	},
	{
		name: 'Dortoir',
		variants: [30, 25],
	},
	{
		name: 'Chambre familiale',
		description: 'Un ou deux adultes + un ou deux enfants (0-17 ans)',
		variants: [96, 85],
	},
	{
		name: 'Adulte',
		variants: [30, 25],
	},
	{
		name: 'Enfant (7-17 ans)',
		variants: [15, 12.5],
	},
	{
		name: 'Enfant (0-6 ans)',
		price: 0,
	},
	{
		name: 'Souper',
		variants: [12.5, 11],
	},
	{
		name: 'Carte de membre HI',
		price: 28.75,
	},
	{
		name: 'Internet',
		price: 1,
	},
	{
		name: 'Lavage',
		price: 5,
	},
];

function getID() {
	id += 1;
	return 6980 + id;
}

function setProductPrice(product, rawPrice) {
	const price = new Decimal(rawPrice);
	const netPrice = price.div(1.14975);
	const tps = netPrice.mul(0.05).toDecimalPlaces(5);
	const tvq = netPrice.mul(0.09975).toDecimalPlaces(5);

	product.price = price.sub(tps).sub(tvq).toDecimalPlaces(2);
	product.taxes.push(new AppliedTax(123, 'TPS', tps));
	product.taxes.push(new AppliedTax(123, 'TVQ', tvq));
}

const variantLabels = ['Non-membre', 'Membre'];
const products = [];

productsData.forEach((productData) => {
	const product = new Product();
	products.push(product);
	product.id = getID();
	product.name = productData.name;
	product.description = productData.description;

	if (productData.variants) {
		productData.variants.forEach((variant, index) => {
			const variantProduct = new Product();
			variantProduct.id = getID();
			variantProduct.name = variantLabels[index];
			setProductPrice(variantProduct, variant);

			product.addVariant(variantProduct);
			products.push(variantProduct);
		});
	}

	if (productData.price) {
		setProductPrice(product, productData.price);
	}
});

export default products;
