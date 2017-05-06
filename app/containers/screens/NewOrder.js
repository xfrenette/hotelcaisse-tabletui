import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import NewOrderScreen from '../../components/screens/newOrder/Screen';

@inject('localizer', 'business', 'uuidGenerator')
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

	onAddProduct(product) {
		const productToAdd = product.hasVariants ? product.variants[0] : product;
		const item = new Item(this.props.uuidGenerator.generate());
		item.product = productToAdd;
		this.newOrder.items.push(item);
	}

	onItemQuantityChange(item, quantity) {
		item.quantity = quantity;
	}

	onItemRemove(item) {
		this.newOrder.removeItem(item);
	}

	onItemVariantChange(item, variant) {
		item.product = variant;
	}

	render() {
		return (
			<NewOrderScreen
				localizer={this.props.localizer}
				rootProductCategory={this.props.business.rootProductCategory}
				onAddProduct={(product) => { this.onAddProduct(product); }}
				onItemQuantityChange={(...attrs) => { this.onItemQuantityChange(...attrs); }}
				onItemRemove={(item) => { this.onItemRemove(item); }}
				onItemVariantChange={(...attrs) => { this.onItemVariantChange(...attrs); }}
				order={this.newOrder}
			/>
		);
	}
}

export default NewOrder;
