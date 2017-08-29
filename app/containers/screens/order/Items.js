import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/Items';

const propTypes = {
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: false,
};

@inject('business', 'localizer')
@observer
class Items extends Component {
	render() {
		const items = this.props.order.items.slice();

		return (
			<ComponentElement
				localizer={this.props.localizer}
				items={items}
				isNew={this.props.isNew}
			/>
		);
	}
}

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
