import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Decimal from 'decimal.js';
import Order from 'hotelcaisse-app/dist/business/Order';
import Product from 'hotelcaisse-app/dist/business/Product';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import NewOrderScreen from '../../components/screens/newOrder/Screen';

@inject('localizer', 'business', 'uuidGenerator', 'router', 'ui')
class NewOrder extends Component {
	/**
	 * The new Order we will create in this screen.
	 *
	 * @type {[type]}
	 */
	newOrder = null;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	/**
	 * When mounting, create the new order
	 */
	componentWillMount() {
		this.newOrder = new Order(this.props.uuidGenerator.generate());
	}

	/**
	 * When a new product is added from the category sidebar. Creates a new Item with the product
	 * and adds it to the Order.
	 *
	 * @param {Product} product
	 */
	onProductAdd(product) {
		const productToAdd = product.hasVariants ? product.variants[0] : product;
		const item = new Item(this.props.uuidGenerator.generate());
		item.product = productToAdd;
		this.newOrder.items.push(item);
	}

	/**
	 * When a custom product is added from the category sidebar. Creates the custom product and calls
	 * this.onProductAdd(product).
	 */
	onCustomProductAdd() {
		const customProduct = new Product();
		customProduct.uuid = this.props.uuidGenerator.generate();
		customProduct.isCustom = true;
		this.onProductAdd(customProduct);
	}

	/**
	 * When the quantity of an item changes. Quantity must be valid.
	 *
	 * @param {Item} item
	 * @param {Number} quantity
	 */
	onItemQuantityChange(item, quantity) {
		item.quantity = quantity;
	}

	/**
	 * When an Item is removed
	 *
	 * @param {Item} item
	 */
	onItemRemove(item) {
		this.newOrder.removeItem(item);
	}

	/**
	 * When we change the product in an Item with variants. The variant must be a valid variant for
	 * this item.
	 *
	 * @param {Item} item
	 * @param {Product} variant The new variant
	 */
	onItemVariantChange(item, variant) {
		item.product = variant;
	}

	/**
	 * When we add a Credit
	 */
	onCreditAdd() {
		const newCredit = new Credit(this.props.uuidGenerator.generate());
		this.newOrder.credits.push(newCredit);
	}

	/**
	 * When we remove a Credit
	 *
	 * @param {Credit} credit
	 */
	onCreditRemove(credit) {
		this.newOrder.removeCredit(credit);
	}

	/**
	 * When the amount of a credit changes. Amount must be valid.
	 *
	 * @param {Credit} credit
	 * @param {Decimal} amount
	 */
	onCreditAmountChange(credit, amount) {
		credit.amount = amount;
	}

	/**
	 * When the note of a credit changes. The note must be valid.
	 *
	 * @param {Credit} credit
	 * @param {String} note
	 */
	onCreditNoteChange(credit, note) {
		credit.note = note;
	}

	/**
	 * When the note of the order changes. The note must be valid.
	 *
	 * @param {String} note
	 */
	onNoteChange(note) {
		this.newOrder.note = note;
	}

	/**
	 * When the name of a custom product changes. The name must be valid.
	 *
	 * @param {Product} product
	 * @param {String} name
	 */
	onCustomProductNameChange(product, name) {
		product.name = name;
	}

	/**
	 * When the price of a custom product changes. The price must be valid.
	 *
	 * @param {Product} product
	 * @param {Decimal} price
	 */
	onCustomProductPriceChange(product, price) {
		product.price = price;
	}

	/**
	 * When we quit the screen (we press the back button, the home button or the cancel button).
	 */
	onLeave() {
		this.props.router.goBack();
	}

	/**
	 * When we press the "Next" button. We go to the next screen. The Order must be in a valid
	 * state.
	 *
	 * @return {[type]}
	 */
	onNext() {
		this.props.router.push('/order/customer-and-rooms');
	}

	render() {
		return (
			<NewOrderScreen
				order={this.newOrder}
				allowCustomProduct
				localizer={this.props.localizer}
				rootProductCategory={this.props.business.rootProductCategory}
				creditValidate={Credit.validate}
				customProductValidate={Product.validate}
				onItemRemove={(item) => { this.onItemRemove(item); }}
				onItemQuantityChange={(...attrs) => { this.onItemQuantityChange(...attrs); }}
				onItemVariantChange={(...attrs) => { this.onItemVariantChange(...attrs); }}
				onProductAdd={(product) => { this.onProductAdd(product); }}
				onCustomProductAdd={() => { this.onCustomProductAdd(); }}
				onCustomProductNameChange={(...attrs) => { this.onCustomProductNameChange(...attrs); }}
				onCustomProductPriceChange={(...attrs) => { this.onCustomProductPriceChange(...attrs); }}
				onCreditAdd={() => { this.onCreditAdd(); }}
				onCreditRemove={(credit) => { this.onCreditRemove(credit); }}
				onCreditAmountChange={(...attrs) => { this.onCreditAmountChange(...attrs); }}
				onCreditNoteChange={(...attrs) => { this.onCreditNoteChange(...attrs); }}
				onNoteChange={(note) => { this.onNoteChange(note); }}
				onNext={() => { this.onNext(); }}
				onLeave={() => { this.onLeave(); }}
			/>
		);
	}
}

export default NewOrder;
