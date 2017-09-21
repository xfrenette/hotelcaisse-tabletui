import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import { observer } from 'mobx-react/native';
import { TouchableNativeFeedback, View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import { Message, Swipeable, Text } from '../../elements';
import { Cell, Row } from '../../elements/table';
import styleVars from '../../../styles/variables';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactions: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(Transaction)).isRequired,
	oldTransactions: PropTypes.arrayOf(PropTypes.string),
	credits: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(Credit)).isRequired,
	onCreditEdit: PropTypes.func,
	onTransactionEdit: PropTypes.func,
	onCreditRemove: PropTypes.func,
	onTransactionRemove: PropTypes.func,
};

const defaultProps = {
	oldTransactions: [],
	onCreditEdit: null,
	onTransactionEdit: null,
	onCreditRemove: null,
	onTransactionRemove: null,
};

@observer
class Transactions extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	onCreditEdit(credit) {
		if (this.props.onCreditEdit) {
			this.props.onCreditEdit(credit);
		}
	}

	onCreditRemove(credit) {
		if (this.props.onCreditRemove) {
			this.props.onCreditRemove(credit);
		}
	}

	onTransactionEdit(transaction) {
		if (this.props.onTransactionEdit) {
			this.props.onTransactionEdit(transaction);
		}
	}

	onTransactionRemove(transaction) {
		if (this.props.onTransactionRemove) {
			this.props.onTransactionRemove(transaction);
		}
	}

	renderElement(element, first) {
		const amount = element.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount, { style: 'accounting' });
		const formattedDate = this.props.localizer.formatDate(element.createdAt, { skeleton: 'MMMdHmm' });
		let type;
		let name;
		let onPress = null;
		let swipeLabel = null;
		let onSwipePress = null;

		if (element instanceof Transaction) {
			const isRefund = amount > 0; // Do not forget that `amount` was multiplied by -1
			type = this.t(`order.transaction.${isRefund ? 'refund' : 'payment'}.label`);
			name = element.transactionMode.name;

			// If this transaction is new (not in oldTransactions), it is swipeable and editable
			if (this.props.oldTransactions.indexOf(element.uuid) === -1) {
				onPress = () => { this.onTransactionEdit(element); };
				swipeLabel = this.t('actions.remove');
				onSwipePress=() => { this.onTransactionRemove(element); };
			}
		} else {
			type = this.t('order.credit.label');
			name = element.note;
			onPress = () => { this.onCreditEdit(element); };
			swipeLabel = this.t('actions.remove');
			onSwipePress=() => {this.onCreditRemove(element); };
		}

		let row = (
			<Row first={first}>
				<Cell style={cellStyles.date} first>
					<Text>{ formattedDate }</Text>
				</Cell>
				<Cell style={cellStyles.type}>
					<Text style={textStyles.type}>{ type }</Text>
				</Cell>
				<Cell style={cellStyles.name}>
					<Text>{ name }</Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text>{ formattedAmount }</Text>
				</Cell>
			</Row>
		);

		let content = row;

		if (onPress) {
			content = (
				<TouchableNativeFeedback onPress={onPress} style={{ backgroundColor: 'red' }}>
					<View>
						{ row }
					</View>
				</TouchableNativeFeedback>
			);
		}

		if (swipeLabel) {
			content = (
				<Swipeable label={swipeLabel} onPress={onSwipePress}>
					{ content }
				</Swipeable>
			)
		}

		return <View key={element.uuid}>{ content }</View>;
	}

	get orderedElements() {
		return [
			...this.props.transactions,
			...this.props.credits,
		].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	}

	render() {
		const orderedElements = this.orderedElements;

		if (!orderedElements.length) {
			return null;
		}

		const elements = orderedElements.map((element, i) => this.renderElement(element, i === 0));
		return (
			<View>
				{ elements }
				<Message>{ this.t('order.transactions.message') }</Message>
			</View>
		);
	}
}

const cellStyles = {
	name: {
		flex: 1,
	},
	subtotal: {
		alignItems: 'flex-end',
	},
	date: {
		width: 140,
	},
	type: {
		width: 140,
	},
};

const textStyles = {
	type: {
		color: styleVars.colors.darkGrey2,
		fontStyle: 'italic',
	},
};

Transactions.propTypes = propTypes;
Transactions.defaultProps = defaultProps;

export default Transactions;
