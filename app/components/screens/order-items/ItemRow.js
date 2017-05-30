import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Item from 'hotelcaisse-app/dist/business/Item';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import {
	Text,
	NumberInput,
	Dropdown,
	SwipeDelete,
} from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	item: PropTypes.instanceOf(Item).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onQuantityChange: PropTypes.func,
	onRemove: PropTypes.func,
	onVariantChange: PropTypes.func,
	isFirst: PropTypes.bool,
	deletable: PropTypes.bool,
};

const defaultProps = {
	onQuantityChange: null,
	onRemove: null,
	onVariantChange: null,
	isFirst: false,
	deletable: true,
};

@observer
class ItemRow extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	/**
	 * Returns the style to apply to the <Row> element
	 *
	 * @return {Object}
	 */
	get rowStyle() {
		return null;
	}

	/**
	 * Returns the style to apply to the <Cell> for the price
	 *
	 * @return {Object}
	 */
	get priceCellStyle() {
		return cellStyles.totalPrice;
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

	/**
	 * If deletable is true, wraps the Node in a SwipeDelete, else returns it
	 *
	 * @param {Node} node
	 * @param {Boolean} deletable
	 * @return {Node}
	 */
	makeDeletable(node, deletable = true) {
		if (!deletable) {
			return node;
		}

		return (
			<SwipeDelete label={this.t('actions.delete')} onDelete={() => { this.onRemove(); }}>
				{ node }
			</SwipeDelete>
		);
	}

	/**
	 * Renders the quality cell
	 *
	 * @return {Node}
	 */
	renderQuantity() {
		const item = this.props.item;

		return (
			<NumberInput
				value={item.quantity}
				showIncrementors
				selectTextOnFocus
				onChangeValue={(value) => { this.onQuantityChange(value); }}
			/>
		);
	}

	/**
	 * Renders the cell content containing the name and, if applicable, the variant dropdown.
	 *
	 * @return {Node}
	 */
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

	/**
	 * Renders the Cell content for the price
	 *
	 * @return {Node}
	 */
	renderPrice() {
		const item = this.props.item;
		const unitFullPrice = this.props.localizer.formatCurrency(item.unitFullPrice.toNumber());

		return (
			<Text style={styles.price}>{ unitFullPrice }</Text>
		);
	}

	render() {
		const row = (
			<Row style={this.rowStyle} first={this.props.isFirst}>
				<Cell first style={cellStyles.quantity}>
					{ this.renderQuantity() }
				</Cell>
				<Cell style={cellStyles.name}>
					{ this.renderNameAndVariant() }
				</Cell>
				<Cell last style={this.priceCellStyle}>
					{ this.renderPrice() }
				</Cell>
			</Row>
		);

		return this.makeDeletable(row, this.props.deletable);
	}
}

const styles = {
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
	quantity: {
		width: 120,
	},
};

ItemRow.propTypes = propTypes;
ItemRow.defaultProps = defaultProps;

export default ItemRow;
