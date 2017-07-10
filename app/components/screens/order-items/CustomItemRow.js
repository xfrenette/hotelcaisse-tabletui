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
	autoFocus: PropTypes.bool,
	validate: PropTypes.func,
	onNameChange: PropTypes.func,
	onPriceChange: PropTypes.func,
};

const defaultProps = {
	autoFocus: true,
	validate: null,
	onNameChange: null,
	onPriceChange: null,
};

/**
 * This class extends ItemRow, so see this class for other methods (including the render())
 */
@observer
class CustomItemRow extends ItemRow {
	/**
	 * References to different nodes
	 *
	 * @type {Object}
	 */
	nodeRefs = {};
	/**
	 * Value of the name field
	 *
	 * @type {String}
	 */
	@observable
	name = null;
	/**
	 * Value of the price field
	 *
	 * @type {Number}
	 */
	@observable
	price = null;
	/**
	 * Error message for the fields
	 *
	 * @type {Object}
	 */
	@observable
	errors = {
		name: null,
		price: null,
	};

	/**
	 * Set initial values
	 */
	componentWillMount() {
		const product = this.props.item.product;
		this.name = product.name;
		this.price = product.price ? product.price.toNumber() : 0;
	}

	/**
	 * Clear the node cache
	 */
	componentWillUnmount() {
		this.nodeRefs = {};
	}

	/**
	 * @see parent
	 */
	get rowStyle() {
		return styles.rowCustom;
	}

	/**
	 * @see parent
	 */
	get priceCellStyle() {
		return cellStyles.totalPriceCustom;
	}

	/**
	 * Validates the values for a custom product. Returns undefined if valid, else an object with
	 * keys of invalid fields.
	 *
	 * @param {Object} values
	 * @return {Object}
	 */
	validate(values) {
		if (this.props.validate) {
			return this.props.validate(values);
		}

		return undefined;
	}

	/**
	 * When we "submit" the name field, we focus the price field.
	 */
	onNameSubmit() {
		const priceField = this.nodeRefs.priceField;
		priceField.focus();
	}

	/**
	 * When we blur the name field, we validate it. If invalid, set the error message, else call
	 * onNameChange().
	 */
	onNameBlur() {
		const newName = this.name;
		const validation = this.validate({ name: newName });

		if (validation) {
			this.errors.name = this.t('order.items.errors.name');
		} else {
			this.errors.name = null;
			this.onNameChange(newName);
		}
	}

	/**
	 * When we blur the price field, we validate it. If invalid, set the error message, else call
	 * onPriceChange().
	 */
	onPriceBlur() {
		let newPrice = this.price;

		if (typeof newPrice === 'number') {
			newPrice = new Decimal(newPrice);
		}

		const validation = this.validate({ price: newPrice });

		if (validation) {
			this.onPriceChange(null);
			this.errors.price = this.t('order.items.errors.price');
		} else {
			this.errors.price = null;
			this.onPriceChange(newPrice);
		}
	}

	/**
	 * When the name changes. Must be valid.
	 *
	 * @param {String} newName
	 */
	onNameChange(newName) {
		if (this.props.onNameChange) {
			this.props.onNameChange(newName);
		}
	}

	/**
	 * When the price changes. Must be valid.
	 *
	 * @param {Decimal} newPrice
	 */
	onPriceChange(newPrice) {
		if (this.props.onPriceChange) {
			this.props.onPriceChange(newPrice);
		}
	}

	/**
	 * Renders the name input field
	 *
	 * @see parent
	 * @return {Node}
	 */
	renderNameAndVariant() {
		return (
			<TextInput
				autoFocus={this.props.autoFocus}
				autoCapitalize="sentences"
				error={this.errors.name}
				returnKeyType="next"
				value={this.name}
				onSubmitEditing={() => { this.onNameSubmit(); }}
				onBlur={() => { this.onNameBlur(); }}
				onChangeText={(text) => { this.name = text; }}
				placeholder={this.t('order.items.fields.customProductName')}
			/>
		);
	}

	/**
	 * Renders the price input field.
	 *
	 * @see parent
	 * @return {Node}
	 */
	renderPrice() {
		return (
			<NumberInput
				ref={(node) => { this.nodeRefs.priceField = node; }}
				localizer={this.props.localizer}
				type="money"
				error={this.errors.price}
				onChangeValue={(value) => { this.price = value; }}
				onBlur={() => { this.onPriceBlur(); }}
				value={this.price}
				selectTextOnFocus
				constraints={{ numericality: { greaterThanOrEqualTo: 0 } }}
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
