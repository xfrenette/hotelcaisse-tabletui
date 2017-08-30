import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
import Item from 'hotelcaisse-app/dist/business/Item';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/Item';

const propTypes = {
	item: PropTypes.instanceOf(Item),
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer')
class ItemContainer extends Component {
	onQuantityChange(quantity) {
		this.props.item.quantity = quantity;
	}

	onRemove() {
		this.props.order.removeItem(this.props.item);
	}

	onVariantChange(variant) {
		this.props.item.product = variant;
	}

	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				onQuantityChange={(quantity) => { this.onQuantityChange(quantity); }}
				onRemove={() => { this.onRemove(); }}
				onVariantChange={(variant) => { this.onVariantChange(variant); }}
				{...this.props}
			/>
		);
	}
}

ItemContainer.propTypes = propTypes;
ItemContainer.defaultProps = defaultProps;

export default ItemContainer;
