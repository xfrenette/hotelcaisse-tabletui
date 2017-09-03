import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Item from 'hotelcaisse-app/dist/business/Item';
import ModalRefund from './ModalRefund';
import Text from '../../elements/Text';
import typographyStyles from '../../../styles/typography';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	Item: PropTypes.func.isRequired,
	oldItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
	newItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
	onRefund: PropTypes.func,
	onCustomProductEdit: PropTypes.func,
};

const defaultProps = {
	oldItems: [],
	newItems: [],
	onRefund: null,
	onCustomProductEdit: null,
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

	onCustomProductEdit(product) {
		if (this.props.onCustomProductEdit) {
			this.props.onCustomProductEdit(product);
		}
	}

	renderOldItems() {
		const ItemRow = this.props.Item;

		return this.props.oldItems.map((item, index) => {
			// Old refunds cannot be 'swipped' (cannot be removed, nor 'refunded')
			const swipeType = item.quantity < 0 ? 'none' : 'refund';
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={index === 0}
					swipeType={swipeType}
					editable={false}
					onRefund={(q) => { this.onShowRefund(item, q); }}
				/>
			);
		});
	}

	renderNewItems(first = false) {
		const ItemRow = this.props.Item;

		return this.props.newItems.map((item, index) => {
			const isCustom = item.product.id === null;

			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={first && index === 0}
					swipeType="delete"
					editable={true}
					onPress={isCustom ? () => { this.onCustomProductEdit(item.product); } : null}
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

	renderNoItems() {
		return (
			<Text style={typographyStyles.empty}>{ this.t('order.items.empty') }</Text>
		);
	}

	renderItems() {
		return (
			<View>
				{ this.renderOldItems() }
				{ this.renderNewItems(this.props.oldItems.length === 0) }
				{ this.renderRefundModal() }
			</View>
		);
	}

	render() {
		if (this.props.oldItems.length || this.props.newItems.length) {
			return this.renderItems();
		}

		return this.renderNoItems();
	}
}

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
