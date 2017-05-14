import React, { Component } from 'react';
import { View } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import Item from 'hotelcaisse-app/dist/business/Item';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import {
	Text,
	TextInput,
	NumberInput,
	Dropdown,
	SwipeDelete,
} from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	item: PropTypes.instanceOf(Item).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	customProductValidate: PropTypes.func,
	onQuantityChange: PropTypes.func,
	onCustomProductNameChange: PropTypes.func,
	onCustomProductPriceChange: PropTypes.func,
	onRemove: PropTypes.func,
	onVariantChange: PropTypes.func,
	isFirst: PropTypes.bool,
};

const defaultProps = {
	customProductValidate: null,
	onQuantityChange: null,
	onCustomProductNameChange: null,
	onCustomProductPriceChange: null,
	onRemove: null,
	onVariantChange: null,
	isFirst: false,
};

@observer
class ItemRow extends Component {
	nodeRefs = {
		customProductPrices: {},
	};
	customProductValues = {
		names: {},
		prices: {},
	};
	@observable
	customProductErrors = {
		names: new Map(),
		prices: new Map(),
	};

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	validateCustomProduct(values) {
		if (this.props.customProductValidate) {
			return this.props.customProductValidate(values);
		}

		return undefined;
	}

	/**
	 * Called when the quantity input value changes
	 *
	 * @param {Number} quantity
	 */
	onQuantityChange(quantity) {
		if (this.props.onQuantityChange) {
			this.props.onQuantityChange(quantity);
		}
	}

	/**
	 * Called when the user presses the delete button
	 */
	onRemove() {
		if (this.props.onRemove) {
			this.props.onRemove();
		}
	}

	/**
	 * Called when the user selects another variant of the parent product (only applicable when the
	 * product shown is a variant). Receives the uuid of the new variant, but the variant product
	 * instance will be sent to the onVariantChange function in the props.
	 *
	 * @param {String} uuid
	 */
	onVariantChange(uuid) {
		const parentProduct = this.props.item.product.parent;
		const variant = parentProduct.variants.find(currVariant => currVariant.uuid === uuid);

		if (variant && this.props.onVariantChange) {
			this.props.onVariantChange(variant);
		}
	}

	onCustomNameSubmit(item) {
		const priceField = this.nodeRefs.customProductPrices[item.uuid];
		priceField.focus();
	}

	onCustomNameBlur(item) {
		const key = item.uuid;
		const newName = this.customProductValues.names[key];
		const validation = this.validateCustomProduct({ name: newName });

		if (validation) {
			this.customProductErrors.names.set(key, 'XXX');
		} else {
			this.customProductErrors.names.delete(key);
			this.onCustomNameChange(item, newName);
		}
	}

	onCustomPriceBlur(item) {
		const key = item.uuid;
		let newPrice = this.customProductValues.prices[key];

		if (typeof newPrice === 'number') {
			newPrice = new Decimal(newPrice);
		}

		const validation = this.validateCustomProduct({ price: newPrice });

		if (validation) {
			this.onCustomPriceChange(item, null);
			this.customProductErrors.prices.set(key, 'XXX');
		} else {
			this.customProductErrors.prices.delete(key);
			this.onCustomPriceChange(item, newPrice);
		}
	}

	onCustomNameChange(item, newName) {
		if (this.props.onCustomProductNameChange) {
			this.props.onCustomProductNameChange(item.product, newName);
		}
	}

	onCustomPriceChange(item, newPrice) {
		if (this.props.onCustomProductPriceChange) {
			this.props.onCustomProductPriceChange(item.product, newPrice);
		}
	}

	renderNameAndVariant() {
		const item = this.props.item;
		const product = item.product;
		const productForName = product.isVariant ? product.parent : product;
		let description = null;
		let variantsDropdown = null;

		if (productForName.description) {
			description = <Text style={styles.productDescription}>{ productForName.description}</Text>;
		}

		if (product.isVariant) {
			const options = product.parent.variants.map(variant => (
				<Dropdown.Option
					key={variant.uuid}
					label={variant.name}
					value={variant.uuid}
				/>
			));

			variantsDropdown = (
				<Dropdown
					style={styles.productVariantDropdown}
					selectedValue={product.uuid}
					onValueChange={(uuid) => { this.onVariantChange(uuid); }}
				>
					{ options }
				</Dropdown>
			);
		}

		return (
			<View style={styles.productNameAndVariant}>
				<View style={styles.productNameContainer}>
					<Text style={styles.productName}>{ productForName.name }</Text>
					{ description }
				</View>
				{ variantsDropdown }
			</View>
		);
	}

	renderPrice() {
		const item = this.props.item;
		const totalPrice = this.props.localizer.formatCurrency(item.total.toNumber());

		return (
			<Text style={styles.price}>{ totalPrice }</Text>
		);
	}

	renderCustomName() {
		const item = this.props.item;

		return (
			<TextInput
				autoFocus
				error={this.customProductErrors.names.get(item.uuid)}
				returnKeyType="next"
				onSubmitEditing={() => { this.onCustomNameSubmit(item); }}
				onBlur={() => { this.onCustomNameBlur(item); }}
				onChangeText={(text) => { this.customProductValues.names[item.uuid] = text; }}
				placeholder={this.t('order.items.fields.customProductName')}
			/>
		);
	}

	renderCustomPrice() {
		const item = this.props.item;
		const product = item.product;

		return (
			<NumberInput
				ref={(node) => { this.nodeRefs.customProductPrices[item.uuid] = node; }}
				localizer={this.props.localizer}
				type="money"
				error={this.customProductErrors.prices.get(item.uuid)}
				onChangeValue={(value) => { this.customProductValues.prices[item.uuid] = value; }}
				onBlur={() => { this.onCustomPriceBlur(item); }}
				value={product.price ? product.price.toNumber() : null}
				selectTextOnFocus
			/>
		);
	}


	render() {
		const item = this.props.item;
		const isCustom = item.product.isCustom;

		return (
			<SwipeDelete label={this.t('actions.delete')} onDelete={() => { this.onRemove(); }}>
				<Row style={isCustom ? styles.rowCustom : null} first={this.props.isFirst}>
					<Cell first style={cellStyles.quantity}>
						<NumberInput
							value={item.quantity}
							showIncrementors
							selectTextOnFocus
							onChangeValue={(value) => { this.onQuantityChange(value); }}
						/>
					</Cell>
					<Cell style={cellStyles.name}>
						{ isCustom ? this.renderCustomName() : this.renderNameAndVariant() }
					</Cell>
					<Cell last style={isCustom ? cellStyles.totalPriceCustom : cellStyles.totalPrice}>
						{ isCustom ? this.renderCustomPrice() : this.renderPrice() }
					</Cell>
				</Row>
			</SwipeDelete>
		);
	}
}

const styles = {
	rowCustom: {
		alignItems: 'flex-start',
	},
	productName: {
		fontSize: styleVars.bigFontSize,
	},
	productDescription: {
		fontSize: styleVars.smallFontSize,
	},
	productNameAndVariant: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	productNameContainer: {
		flex: 1,
	},
	productVariantDropdown: {
		width: 175,
		marginLeft: styleVars.horizontalRhythm,
	},
	price: {
		fontSize: styleVars.bigFontSize,
	},
};

const cellStyles = {
	name: {
		flex: 1,
	},
	totalPrice: {
		width: 85,
		alignItems: 'flex-end',
	},
	totalPriceCustom: {
		width: 120,
	},
	quantity: {
		width: 120,
	},
};

ItemRow.propTypes = propTypes;
ItemRow.defaultProps = defaultProps;

export default ItemRow;
