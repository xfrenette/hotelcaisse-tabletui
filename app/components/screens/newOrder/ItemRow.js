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
	cellStyles: PropTypes.object.isRequired,
};

const defaultProps = {
	onQuantityChange: null,
	onRemove: null,
	onVariantChange: null,
	isFirst: false,
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

	render() {
		const item = this.props.item;
		const product = item.product;
		const productForName = product.isVariant ? product.parent : product;
		const totalPrice = this.props.localizer.formatCurrency(item.total.toNumber());
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
			<SwipeDelete label={this.t('actions.delete')} onDelete={() => { this.onRemove(); }}>
				<Row first={this.props.isFirst}>
					<Cell first style={this.props.cellStyles.quantity}>
						<NumberInput
							value={item.quantity}
							showIncrementors
							selectTextOnFocus
							onChangeValue={(value) => { this.onQuantityChange(value); }}
						/>
					</Cell>
					<Cell style={this.props.cellStyles.name}>
						<View style={styles.productNameAndVariant}>
							<View style={styles.productNameContainer}>
								<Text style={styles.productName}>{ productForName.name }</Text>
								{ description }
							</View>
							{ variantsDropdown }
						</View>
					</Cell>
					<Cell last style={this.props.cellStyles.totalPrice}>
						<Text style={styles.price}>{ totalPrice }</Text>
					</Cell>
				</Row>
			</SwipeDelete>
		);
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

ItemRow.propTypes = propTypes;
ItemRow.defaultProps = defaultProps;

export default ItemRow;