import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/CreditsTransactions';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer')
class CreditsTransactions extends Component {
	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				transactions={this.props.order.transactions}
				credits={this.props.order.credits}
			/>
		);
	}
}

CreditsTransactions.propTypes = propTypes;
CreditsTransactions.defaultProps = defaultProps;

export default CreditsTransactions;
