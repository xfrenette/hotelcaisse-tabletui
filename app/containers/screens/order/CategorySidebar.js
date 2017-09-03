import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
import Item from 'hotelcaisse-app/dist/business/Item';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/CategorySidebar';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('business', 'localizer', 'uuidGenerator')
class CategorySidebar extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	onProductAdd(product) {
		const productToAdd = product.hasVariants ? product.variants[0] : product;
		const item = new Item(this.props.uuidGenerator.generate());
		item.product = productToAdd;
		this.props.order.items.push(item);
	}

	render() {
		return (
			<ComponentElement
				showCustomProduct={true}
				backButtonLabel={this.t('actions.back')}
				emptyLabel={this.t('order.categories.empty')}
				customProductLabel={this.t('order.customProduct.label')}
				rootProductCategory={this.props.business.rootProductCategory}
				onProductAdd={(p) => { this.onProductAdd(p); }}
				{...this.props}
			/>
		);
	}
}

CategorySidebar.propTypes = propTypes;
CategorySidebar.defaultProps = defaultProps;

export default CategorySidebar;
