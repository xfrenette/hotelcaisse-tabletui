import React, { Component } from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Item from 'hotelcaisse-app/dist/business/Item';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import { Dropdown, NumberInput, Swipeable, Text, } from '../../elements';
import { Cell, Row } from '../../elements/table';

const propTypes = {
	item: PropTypes.instanceOf(Item).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onQuantityChange: PropTypes.func,
	onRemove: PropTypes.func,
	onRefund: PropTypes.func,
	onVariantChange: PropTypes.func,
	onPress: PropTypes.func,
	isFirst: PropTypes.bool,
	swipeType: PropTypes.oneOf(['none', 'delete', 'refund']),
	editable: PropTypes.bool,
};

const defaultProps = {
	onQuantityChange: null,
	onRemove: null,
	onRefund: null,
	onVariantChange: null,
	onPress: null,
	isFirst: false,
	swipeType: null,
	editable: true,
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

	get isRefund() {
		return this.props.item.quantity < 0;
	}

	get editable() {
		return this.props.editable && !this.isRefund;
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
			this.props.onQuantityChange(quantity || 0);
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
	 * Called when the user presses the 'refund' button
	 */
	onRefund() {
		if (this.props.onRefund) {
			this.props.onRefund();
		}
	}

	/**
	 * Called when the user selects another variant of the parent product (only applicable when the
	 * product shown is a variant). Receives the id of the new variant, but the variant product
	 * instance will be sent to the onVariantChange function in the props.
	 *
	 * @param {number} id
	 */
	onVariantChange(id) {
		const parentProduct = this.props.item.product.parent;
		const variant = parentProduct.variants.find(currVariant => currVariant.id === id);

		if (variant && this.props.onVariantChange) {
			this.props.onVariantChange(variant);
		}
	}

	/**
	 * If type is 'delete' or 'refund', wraps the Node in a Swipeable, else returns it
	 *
	 * @param {Node} node
	 * @param {string} type
	 * @return {Node}
	 */
	makeSwipeable(node) {
		const type = this.props.swipeType;
		const valid = ['delete', 'refund'];

		if (valid.indexOf(type) === -1) {
			return node;
		}

		const props = {
			label: this.t(`order.actions.${type === 'refund' ? 'refund' : 'remove'}`),
			onPress: type === 'refund' ? () => { this.onRefund(); } : () => { this.onRemove(); },
			autoCloseOnPress: type === 'refund',
		};

		if (type === 'refund') {
			props.backgroundColor = styleVars.colors.blue1;
		}

		return (
			<Swipeable  {...props}>
				{ node }
			</Swipeable>
		);
	}

	/**
	 * Renders the quantity cell
	 *
	 * @return {Node}
	 */
	renderQuantity() {
		const item = this.props.item;

		if (this.editable) {
			return (
				<NumberInput
					defaultValue={item.quantity || null}
					showIncrementors
					selectTextOnFocus
					onChangeValue={(value) => { this.onQuantityChange(value); }}
					constraints={{ numericality: { greaterThanOrEqualTo: 1 } }}
				/>
			);
		}

		return (
			<View style={viewStyles.fixedQuantity}>
				<View style={viewStyles.fixedQuantityNb}>
					<Text style={textStyles.fixedQuantity}>{ item.quantity }</Text>
				</View>
				<View style={viewStyles.fixedQuantityTimes}>
					<Text>x</Text>
				</View>
			</View>
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
		const isCustom = productForName.id === null;
		let preText = null;
		let description = null;
		let variantsDropdown = null;
		const isRefund = item.quantity < 0;
		const refundedStyle = isRefund ? textStyles.refunded : null;

		if (isRefund) {
			preText = <Text style={textStyles.refundLabel}>({ this.t('order.items.refund') })</Text>;
		}

		if (productForName.description) {
			description = (
				<Text style={[textStyles.productDescription, refundedStyle]}>
					{ productForName.description}
				</Text>
			);
		}

		if (isCustom) {
			description = (
				<Text style={textStyles.customProduct}>
					({this.t('order.customProduct.label')})
				</Text>
			);
		}

		if (this.editable && product.isVariant) {
			const options = product.parent.variants.map(variant => (
				<Dropdown.Option
					key={variant.id}
					label={variant.name}
					value={variant.id}
				/>
			));

			variantsDropdown = (
				<Dropdown
					style={viewStyles.productVariantDropdown}
					selectedValue={product.id}
					onValueChange={(id) => { this.onVariantChange(id); }}
				>
					{ options }
				</Dropdown>
			);
		}

		return (
			<View style={viewStyles.productNameAndVariant}>
				<View style={viewStyles.productNameContainer}>
					{ preText }
					<Text style={[textStyles.productName, refundedStyle]}>
						{ productForName.name }
					</Text>
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
		const price = this.props.localizer.formatCurrency(item.total.toNumber(), { style: 'accounting' });
		const refundStyle = item.quantity < 0 ? textStyles.refunded : null;

		return (
			<Text style={[textStyles.price, refundStyle]}>{ price }</Text>
		);
	}

	render() {
		let row = (
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

		if (this.props.onPress) {
			row = (
				<TouchableNativeFeedback onPress={this.props.onPress}>
					<View>
						{row}
					</View>
				</TouchableNativeFeedback>
			);
		}

		return this.makeSwipeable(row);
	}
}

const viewStyles = {
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
	fixedQuantity: {
		flexDirection: 'row',
	},
	fixedQuantityNb: {
		flex: 1,
		alignItems: 'center',
	},
	fixedQuantityTimes: {
		width: 40,
		alignItems: 'center',
	},
};

const textStyles = {
	productName: {
		fontSize: styleVars.bigFontSize,
	},
	productDescription: {
		fontSize: styleVars.smallFontSize,
	},
	price: {
		fontSize: styleVars.bigFontSize,
	},
	fixedQuantity: {
		fontSize: styleVars.bigFontSize,
	},
	refundLabel: {
		fontWeight: 'bold',
		fontSize: styleVars.smallFontSize,
		color: styleVars.colors.orange1,
	},
	refunded: {
		// color: styleVars.colors.grey2,
		// fontStyle: 'italic',
	},
	customProduct: {
		color: styleVars.colors.grey2,
		fontStyle: 'italic',
	}
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
