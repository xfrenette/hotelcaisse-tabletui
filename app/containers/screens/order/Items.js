import React, { Component } from 'react';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Item from 'hotelcaisse-app/dist/business/Item';
import ComponentElement from '../../../components/screens/order/Items';
import ItemContainer from './Item';

const propTypes = {
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: false,
};

@inject('localizer', 'uuidGenerator')
@observer
class Items extends Component {
	oldItemsUUID = [];

	componentWillMount() {
		if (this.props.isNew) {
			this.oldItemsUUID = [];
		} else {
			this.props.order.items.forEach((item) => { this.oldItemsUUID.push(item.uuid); });
		}
	}

	@computed
	get newItems() {
		if (!this.oldItemsUUID.length) {
			return this.props.order.items.slice();
		}

		return this.props.order.items.filter(item => this.oldItemsUUID.indexOf(item.uuid) === -1);
	}

	@computed
	get oldItems() {
		if (!this.oldItemsUUID.length) {
			return [];
		}

		return this.props.order.items.filter(item => this.oldItemsUUID.indexOf(item.uuid) !== -1);
	}

	onRefund(item, quantity) {
		const refundItem = new Item(this.props.uuidGenerator.generate());
		refundItem.product = item.product;
		refundItem.quantity = -1 * quantity;
		this.props.order.items.push(refundItem);
	}

	render() {
		const otherProps = omit(this.props, ['order', 'isNew']);
		return (
			<ComponentElement
				localizer={this.props.localizer}
				newItems={this.newItems}
				oldItems={this.oldItems}
				Item={(props) => <ItemContainer order={this.props.order} {...props} />}
				onRefund={(i, q) => { this.onRefund(i, q); }}
				{...otherProps}
			/>
		);
	}
}

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
