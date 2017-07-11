import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import DetailsComponent from '../../../components/screens/reviewAndPayments/Details';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: false,
};

@inject('localizer', 'router')
class Details extends Component {
	/**
	 * When the user presses the 'edit items' button, we redirect to the items screen.
	 */
	onItemsEdit() {
		this.props.router.push(
			'/order/items',
			{ order: this.props.order, new: this.isNew },
		);
	}

	render() {
		return (
			<DetailsComponent
				order={this.props.order}
				localizer={this.props.localizer}
				isNew={this.props.isNew}
				onItemsEdit={() => { this.onItemsEdit(); }}
			/>
		);
	}
}

Details.propTypes = propTypes;
Details.defaultProps = defaultProps;

export default Details;
