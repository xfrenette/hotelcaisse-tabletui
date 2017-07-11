import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { View } from 'react-native';
import { Text } from '../../elements';
import { Row, Cell } from '../../elements/table';
import Item from './Item';
import Credit from './Credit';
import Transaction from './Transaction';
import styleVars from '../../../styles/variables';
import tableStyles from '../../../styles/tables';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
};

@observer
class Details extends Component {
	/**
	 * Bought Items (with positive quantity)
	 *
	 * @return {Array<Item>}
	 */
	get boughtItems() {
		return this.props.order.items.filter(item => item.quantity > 0);
	}
	/**
	 * Refunded Items (with negative quantity)
	 *
	 * @return {Array<Item>}
	 */
	get refundedItems() {
		return this.props.order.items.filter(item => item.quantity < 0);
	}

	/**
	 * All payments (Transaction with positive amount)
	 *
	 * @return {Array<Transaction>}
	 */
	get payments() {
		return this.props.order.transactions.filter(transaction => transaction.amount.gt(0));
	}

	/**
	 * All refunds (Transaction with negative amount)
	 *
	 * @return {Array<Transaction>}
	 */
	get refunds() {
		return this.props.order.transactions.filter(transaction => transaction.amount.lt(0));
	}

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
	 * Renders a single item (refund or not)
	 *
	 * @param {Item} item
	 * @return {Node}
	 */
	renderItem(item) {
		return (
			<Item
				key={item.uuid}
				item={item}
				localizer={this.props.localizer}
				cellStyles={cellStyles}
			/>
		);
	}

	/**
	 * Renders a single credit
	 *
	 * @param {Credit} credit
	 * @return {Node}
	 */
	renderCredit(credit) {
		return (
			<Credit
				key={credit.uuid}
				credit={credit}
				localizer={this.props.localizer}
				cellStyles={cellStyles}
			/>
		);
	}

	/**
	 * Renders a single transaction
	 *
	 * @param {Transaction} transaction
	 * @return {Node}
	 */
	renderTransaction(transaction) {
		return (
			<Transaction
				key={transaction.uuid}
				transaction={transaction}
				localizer={this.props.localizer}
				cellStyles={cellStyles}
			/>
		);
	}

	/**
	 * Renders the list of bought Items
	 *
	 * @return {Node}
	 */
	renderBoughtItems() {
		return this.boughtItems.map(item => this.renderItem(item));
	}

	/**
	 * Renders the list of refunded Items
	 *
	 * @return {Node}
	 */
	renderRefundedItems() {
		if (!this.refundedItems.length) {
			return null;
		}

		const refundedItemRows = this.refundedItems.map(item => this.renderItem(item));

		return (
			<View>
				<Row>
					<Cell style={[cellStyles.name]} first last>
						<Text style={styles.sectionCell}>{ this.t('order.refundedItems.label') }</Text>
					</Cell>
				</Row>
				{ refundedItemRows }
			</View>
		);
	}

	/**
	 * Renders the list of Credits
	 *
	 * @return {Node}
	 */
	renderCredits() {
		if (!this.props.order.credits.length) {
			return null;
		}

		const creditRows = this.props.order.credits.map(credit => this.renderCredit(credit));

		return (
			<View>
				<Row>
					<Cell style={[cellStyles.name]} first last>
						<Text style={styles.sectionCell}>{ this.t('order.credits.label') }</Text>
					</Cell>
				</Row>
				{ creditRows }
			</View>
		);
	}

	/**
	 * Renders the list of payments
	 *
	 * @return {Node}
	 */
	renderPayments() {
		if (!this.payments.length) {
			return null;
		}

		const transactionRows = this.payments.map(
			transaction => this.renderTransaction(transaction)
		);

		return (
			<View>
				<Row>
					<Cell style={[cellStyles.name]} first last>
						<Text style={styles.sectionCell}>{ this.t('order.payments.label') }</Text>
					</Cell>
				</Row>
				{ transactionRows }
			</View>
		);
	}

	/**
	 * Renders the list of refunds
	 *
	 * @return {Node}
	 */
	renderRefunds() {
		if (!this.refunds.length) {
			return null;
		}

		const transactionRows = this.refunds.map(
			transaction => this.renderTransaction(transaction)
		);

		return (
			<View>
				<Row>
					<Cell style={[cellStyles.name]} first last>
						<Text style={styles.sectionCell}>{ this.t('order.refunds.label') }</Text>
					</Cell>
				</Row>
				{ transactionRows }
			</View>
		);
	}

	/**
	 * Renders the balance row
	 *
	 * @return {Node}
	 */
	renderBalance() {
		if (!this.props.order.transactions.length) {
			return null;
		}

		const balanceAmount = this.props.order.balance.toNumber();
		const formattedBalance = this.props.localizer.formatCurrency(balanceAmount);

		return (
			<Row>
				<Cell style={cellStyles.name} first>
					<Text style={styles.totalCell}>{ this.t('order.balance.label') }</Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text style={styles.totalCell}>{ formattedBalance }</Text>
				</Cell>
			</Row>
		);
	}

	render() {
		const total = this.props.order.total.toNumber();
		const formattedTotal = this.props.localizer.formatCurrency(total);

		return (
			<View style={styles.items}>
				<Row first>
					<Cell style={cellStyles.name} first />
					<Cell style={cellStyles.unitPrice}>
						<Text style={tableStyles.header}>{ this.t('order.items.unitPrice') }</Text>
					</Cell>
					<Cell style={cellStyles.qty}>
						<Text style={tableStyles.header}>{ this.t('order.items.qty') }</Text>
					</Cell>
					<Cell style={cellStyles.subtotal} last>
						<Text style={tableStyles.header} last>{ this.t('order.items.subtotal') }</Text>
					</Cell>
				</Row>
				{ this.renderBoughtItems() }
				{ this.renderRefundedItems() }
				{ this.renderCredits() }
				<Row>
					<Cell style={cellStyles.name} first>
						<Text style={styles.totalCell}>{ this.t('order.items.total') }</Text>
					</Cell>
					<Cell style={cellStyles.subtotal} last>
						<Text style={styles.totalCell}>{ formattedTotal }</Text>
					</Cell>
				</Row>
				{ this.renderPayments() }
				{ this.renderRefunds() }
				{ this.renderBalance() }
			</View>
		);
	}
}

const styles = {
	sectionCell: {
		fontWeight: 'bold',
	},
	totalCell: {
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
	},
};

const cellStyles = {
	name: {
		flex: 1,
	},
	unitPrice: {
		width: 100,
		alignItems: 'center',
	},
	qty: {
		width: 80,
		alignItems: 'center',
	},
	subtotal: {
		width: 100,
		alignItems: 'flex-end',
	},
	subRow: {
		paddingLeft: styleVars.horizontalRhythm,
	},
	section: {
		paddingTop: styleVars.verticalRhythm,
	},
	date: {
		width: 180,
		alignItems: 'flex-start',
	},
};

Details.propTypes = propTypes;
Details.defaultProps = defaultProps;

export default Details;
