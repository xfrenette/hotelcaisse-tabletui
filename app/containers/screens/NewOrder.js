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

	componentWillMount() {
		this.newOrder = new Order(this.props.uuidGenerator.generate());
	}

	creditValidate(values) {
		return Credit.validate(values);
	}

	onProductAdd(product) {
		const productToAdd = product.hasVariants ? product.variants[0] : product;
		const item = new Item(this.props.uuidGenerator.generate());
		item.product = productToAdd;
		this.newOrder.items.push(item);
	}

	onCustomProductAdd() {
		const customProduct = new Product();
		customProduct.uuid = this.props.uuidGenerator.generate();
		customProduct.isCustom = true;
		this.onProductAdd(customProduct);
	}

	onItemQuantityChange(item, rawQuantity) {
		const quantity = rawQuantity < 1 ? 1 : rawQuantity;
		item.quantity = quantity;
	}

	onItemRemove(item) {
		this.newOrder.removeItem(item);
	}

	onItemVariantChange(item, variant) {
		item.product = variant;
	}

	onCreditAdd() {
		const newCredit = new Credit(this.props.uuidGenerator.generate());
		this.newOrder.credits.push(newCredit);
	}

	onCreditRemove(credit) {
		this.newOrder.removeCredit(credit);
	}

	onCreditAmountChange(credit, amount) {
		credit.amount = amount;
	}

	onCreditNoteChange(credit, note) {
		credit.note = note;
	}

	onNoteChange(note) {
		this.newOrder.note = note;
	}

	onCustomProductNameChange(product, name) {
		product.name = name;
	}

	onCustomProductPriceChange(product, price) {
		product.price = price;
	}

	onLeave() {
		this.props.router.goBack();
	}

	onNext() {
		const res = this.newOrder.validate();

		if (res === undefined) {
			this.props.router.push('/order/customer-and-rooms');
		} else {
			this.props.ui.showErrorAlert(
				this.t('order.editItems.error.title'),
				this.t('order.editItems.error.message')
			);
		}
	}

	render() {
		return (
			<NewOrderScreen
				order={this.newOrder}
				allowCustomProduct
				localizer={this.props.localizer}
				rootProductCategory={this.props.business.rootProductCategory}
				creditValidate={values => this.creditValidate(values)}
				onProductAdd={(product) => { this.onProductAdd(product); }}
				onCustomProductAdd={() => { this.onCustomProductAdd(); }}
				onCreditAdd={() => { this.onCreditAdd(); }}
				onItemQuantityChange={(...attrs) => { this.onItemQuantityChange(...attrs); }}
				onItemRemove={(item) => { this.onItemRemove(item); }}
				onCreditRemove={(credit) => { this.onCreditRemove(credit); }}
				onCreditAmountChange={(...attrs) => { this.onCreditAmountChange(...attrs); }}
				onCreditNoteChange={(...attrs) => { this.onCreditNoteChange(...attrs); }}
				onItemVariantChange={(...attrs) => { this.onItemVariantChange(...attrs); }}
				onNoteChange={(note) => { this.onNoteChange(note); }}
				onCustomProductNameChange={(...attrs) => { this.onCustomProductNameChange(...attrs); }}
				onCustomProductPriceChange={(...attrs) => { this.onCustomProductPriceChange(...attrs); }}
				customProductValidate={Product.validate}
				onLeave={() => { this.onLeave(); }}
				onNext={() => { this.onNext(); }}
			/>
		);
	}
}

export default NewOrder;
