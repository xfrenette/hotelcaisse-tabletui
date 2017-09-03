import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Product from 'hotelcaisse-app/dist/business/Product';
import Item from 'hotelcaisse-app/dist/business/Item';
import ComponentElement from '../../../components/screens/order/ModalCustomProduct';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'uuidGenerator')
@observer
class ModalCustomProduct extends Component {
	modal = null;
	@observable
	editingProduct = null;

	show(product = null) {
		this.editingProduct = product;
		this.modal.show();
	}

	onSave(rawProduct, name, price) {
		const isNew = rawProduct === null;
		let product = isNew ? new Product() : rawProduct;
		product.name = name;
		product.price = price;

		if (isNew) {
			const item = new Item(this.props.uuidGenerator.generate());
			item.quantity = 1;
			item.product = product;

			this.props.order.items.push(item);
		}
	}

	render() {
		return (
			<ComponentElement
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				validate={Product.validate}
				onSave={(product, n, p) => { this.onSave(product, n, p); }}
				product={this.editingProduct}
			/>
		);
	}
}

ModalCustomProduct.propTypes = propTypes;
ModalCustomProduct.defaultProps = defaultProps;

export default ModalCustomProduct;
