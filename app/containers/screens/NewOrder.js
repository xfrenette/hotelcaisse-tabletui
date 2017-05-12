import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import NewOrderScreen from '../../components/screens/newOrder/Screen';

@inject('localizer', 'business', 'uuidGenerator', 'router')
class NewOrder extends Component {
	/**
	 * The new Order we will create in this screen.
	 *
	 * @type {[type]}
	 */
	newOrder = null;

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

	onLeave() {
		this.props.router.goBack();
	}

	render() {
		return (
			<NewOrderScreen
				localizer={this.props.localizer}
				rootProductCategory={this.props.business.rootProductCategory}
				creditValidate={values => this.creditValidate(values)}
				onProductAdd={(product) => { this.onProductAdd(product); }}
				onCreditAdd={() => { this.onCreditAdd(); }}
				onItemQuantityChange={(...attrs) => { this.onItemQuantityChange(...attrs); }}
				onItemRemove={(item) => { this.onItemRemove(item); }}
				onCreditRemove={(credit) => { this.onCreditRemove(credit); }}
				onCreditAmountChange={(...attrs) => { this.onCreditAmountChange(...attrs); }}
				onCreditNoteChange={(...attrs) => { this.onCreditNoteChange(...attrs); }}
				onItemVariantChange={(...attrs) => { this.onItemVariantChange(...attrs); }}
				onNoteChange={(note) => { this.onNoteChange(note); }}
				onLeave={() => { this.onLeave(); }}
				order={this.newOrder}
			/>
		);
	}
}

export default NewOrder;
