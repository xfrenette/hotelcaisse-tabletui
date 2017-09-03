import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import omit from 'lodash.omit';
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
	onCreditRemove(credit) {
		this.props.order.credits.remove(credit);
	}

	onTransactionRemove(transaction) {
		this.props.order.transactions.remove(transaction);
	}

	render() {
		const props = omit(this.props, ['order']);
		return (
			<ComponentElement
				localizer={this.props.localizer}
				transactions={this.props.order.transactions}
				credits={this.props.order.credits}
				onCreditRemove={(c) => { this.onCreditRemove(c); }}
				onTransactionRemove={(c) => { this.onTransactionRemove(c); }}
				{...props}
			/>
		);
	}
}

CreditsTransactions.propTypes = propTypes;
CreditsTransactions.defaultProps = defaultProps;

export default CreditsTransactions;
