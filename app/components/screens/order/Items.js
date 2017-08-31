import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Item from 'hotelcaisse-app/dist/business/Item';
import ModalRefund from './ModalRefund';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	Item: PropTypes.func.isRequired,
	oldItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
	newItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
	onRefund: PropTypes.func,
};

const defaultProps = {
	oldItems: [],
	newItems: [],
	onRefund: null,
};

@observer
class Items extends Component {
	modalRef = null;
	@observable
	refundMaxQuantity = 1;
	refundingItem = null;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	onShowRefund(item) {
		this.refundingItem = item;
		this.refundMaxQuantity = item.quantity;
		this.modalRef.show();
	}

	onRefund(quantity) {
		if (this.props.onRefund) {
			this.props.onRefund(this.refundingItem, quantity);
		}
	}

	renderOldItems() {
		const ItemRow = this.props.Item;

		return this.props.oldItems.map((item, index) => {
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={index === 0}
					swipeType="refund"
					editable={false}
					onRefund={(q) => { this.onShowRefund(item, q); }}
				/>
			);
		});
	}

	renderNewItems(first = false) {
		const ItemRow = this.props.Item;

		return this.props.newItems.map((item, index) => {
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={first && index === 0}
					swipeType="delete"
					editable={true}
				/>
			);
		});
	}

	renderRefundModal() {
		return (
			<ModalRefund
				ref={(node) => { this.modalRef = node; }}
				localizer={this.props.localizer}
				maxQuantity={this.refundMaxQuantity}
				onRefund={(q) => { this.onRefund(q); }}
			/>
		);
	}

	render() {
		return (
			<View>
				{ this.renderOldItems() }
				{ this.renderNewItems(this.props.oldItems.length === 0) }
				{ this.renderRefundModal() }
			</View>
		);
	}
}

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
