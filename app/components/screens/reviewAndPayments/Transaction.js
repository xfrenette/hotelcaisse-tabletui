import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TransactionModel from 'hotelcaisse-app/dist/business/Transaction';
import { Text } from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	transaction: PropTypes.instanceOf(TransactionModel).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	cellStyles: PropTypes.object.isRequired,
};

const defaultProps = {
};

class Transaction extends Component {
	/**
	 * Update only if it is not the same Transaction (different UUID)
	 *
	 * @param {Object} newProps
	 * @return {Boolean}
	 */
	shouldComponentUpdate(newProps) {
		return newProps.transaction.uuid !== this.props.transaction.uuid;
	}

	render() {
		const transaction = this.props.transaction;
		const amount = transaction.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Row key={transaction.uuid}>
				<Cell style={this.props.cellStyles.name} first>
					<Text>{ transaction.transactionMode.name }</Text>
				</Cell>
				<Cell style={this.props.cellStyles.subtotal} last>
					<Text>{ formattedAmount }</Text>
				</Cell>
			</Row>
		);
	}
}

Transaction.propTypes = propTypes;
Transaction.defaultProps = defaultProps;

export default Transaction;
