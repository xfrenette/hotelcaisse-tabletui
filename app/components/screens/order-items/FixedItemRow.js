import React from 'react';
import PropTypes from 'prop-types';
import Item from 'hotelcaisse-app/dist/business/Item';
import { Text } from '../../elements';
import ItemRow from './ItemRow';

const propTypes = {
	item: PropTypes.instanceOf(Item).isRequired,
};

const defaultProps = {
};

/**
 * Show an item that is fixed (that cannot be modified or deleted)
 * This class extends ItemRow, so see this class for other methods (including the render())
 */
class FixedItemRow extends ItemRow {
	/**
	 * Renders the quantity value
	 *
	 * @see parent
	 * @return {Node}
	 */
	renderQuantity() {
		return <Text>{ this.props.item.quantity }</Text>;
	}

	/**
	 * Renders the name value
	 *
	 * @see parent
	 * @return {Node}
	 */
	renderNameAndVariant() {
		return <Text>{ this.props.item.name }</Text>;
	}
}

FixedItemRow.propTypes = propTypes;
FixedItemRow.defaultProps = defaultProps;

export default FixedItemRow;
