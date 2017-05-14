import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import Item from 'hotelcaisse-app/dist/business/Item';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	TextInput,
	NumberInput,
} from '../../elements';
import ItemRow from './ItemRow';

const propTypes = {
	item: PropTypes.instanceOf(Item).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	validate: PropTypes.func,
	onNameChange: PropTypes.func,
	onPriceChange: PropTypes.func,
};

const defaultProps = {
	validate: null,
	onNameChange: null,
	onPriceChange: null,
};

@observer
class CustomItemRow extends ItemRow {
	nodeRefs = {
		priceField: {},
	};
	name = null;
	price = null;
	@observable
	errors = {
		name: null,
		price: null,
	};

	validate(values) {
		if (this.props.validate) {
			return this.props.validate(values);
		}

		return undefined;
	}

	get rowStyle() {
		return styles.rowCustom;
	}

	get priceCellStyle() {
		return cellStyles.totalPriceCustom;
	}

	onNameSubmit(item) {
		const priceField = this.nodeRefs.priceField[item.uuid];
		priceField.focus();
	}

	onNameBlur(item) {
		const newName = this.name;
		const validation = this.validate({ name: newName });

		if (validation) {
			this.errors.name = this.t('order.items.errors.name');
		} else {
			this.errors.name = null;
			this.onNameChange(item, newName);
		}
	}

	onPriceBlur(item) {
		let newPrice = this.price;

		if (typeof newPrice === 'number') {
			newPrice = new Decimal(newPrice);
		}

		const validation = this.validate({ price: newPrice });

		if (validation) {
			this.onPriceChange(item, null);
			this.errors.price = this.t('order.items.errors.price');
		} else {
			this.errors.price = null;
			this.onPriceChange(item, newPrice);
		}
	}

	onNameChange(item, newName) {
		if (this.props.onNameChange) {
			this.props.onNameChange(item.product, newName);
		}
	}

	onPriceChange(item, newPrice) {
		if (this.props.onPriceChange) {
			this.props.onPriceChange(item.product, newPrice);
		}
	}

	renderNameAndVariant() {
		const item = this.props.item;

		return (
			<TextInput
				autoFocus
				error={this.errors.name}
				returnKeyType="next"
				onSubmitEditing={() => { this.onNameSubmit(item); }}
				onBlur={() => { this.onNameBlur(item); }}
				onChangeText={(text) => { this.name = text; }}
				placeholder={this.t('order.items.fields.customProductName')}
			/>
		);
	}

	renderPrice() {
		const item = this.props.item;
		const product = item.product;

		return (
			<NumberInput
				ref={(node) => { this.nodeRefs.priceField[item.uuid] = node; }}
				localizer={this.props.localizer}
				type="money"
				error={this.errors.price}
				onChangeValue={(value) => { this.price = value; }}
				onBlur={() => { this.onPriceBlur(item); }}
				value={product.price ? product.price.toNumber() : null}
				selectTextOnFocus
			/>
		);
	}
}

const styles = {
	rowCustom: {
		alignItems: 'flex-start',
	},
};

const cellStyles = {
	totalPriceCustom: {
		width: 120,
	},
};

CustomItemRow.propTypes = propTypes;
CustomItemRow.defaultProps = defaultProps;

export default CustomItemRow;
