import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import ItemModel from 'hotelcaisse-app/dist/business/Item';
import { Text } from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	item: PropTypes.instanceOf(ItemModel).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	cellStyles: PropTypes.object.isRequired,
};

const defaultProps = {
};

class Item extends Component {
	/**
	 * Update only if it is not the same Item (different UUID)
	 *
	 * @param {Object} newProps
	 * @return {Boolean}
	 */
	shouldComponentUpdate(newProps) {
		return newProps.item.uuid !== this.props.item.uuid;
	}

	render() {
		const item = this.props.item;
		const unitPrice = item.unitFullPrice.toNumber();
		const formattedUnitPrice = this.props.localizer.formatCurrency(unitPrice);
		const total = item.total.toNumber();
		const formattedTotal = this.props.localizer.formatCurrency(total);

		return (
			<Row>
				<Cell style={this.props.cellStyles.name} first><Text>{ item.name }</Text></Cell>
				<Cell style={this.props.cellStyles.unitPrice}><Text>{ formattedUnitPrice }</Text></Cell>
				<Cell style={this.props.cellStyles.qty}><Text>{ String(item.quantity) }</Text></Cell>
				<Cell style={this.props.cellStyles.subtotal} last><Text>{ formattedTotal }</Text></Cell>
			</Row>
		);
	}
}

Item.propTypes = propTypes;
Item.defaultProps = defaultProps;

export default Item;
