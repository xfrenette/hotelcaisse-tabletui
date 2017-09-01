import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import { observer } from 'mobx-react/native';
import { TouchableNativeFeedback, View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Transaction from 'hotelcaisse-app/dist/business/Transaction';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import { Text } from '../../elements';
import { Cell, Row } from '../../elements/table';
import styleVars from '../../../styles/variables';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactions: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(Transaction)).isRequired,
	credits: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(Credit)).isRequired,
	onCreditEdit: PropTypes.func,
};

const defaultProps = {
	onCreditEdit: null,
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

	renderElement(element, first) {
		const amount = element.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount, { style: 'accounting' });
		const formattedDate = this.props.localizer.formatDate(element.createdAt, { skeleton: 'MMMdHmm' });
		let type;
		let name;
		let onPress = null;

		if (element instanceof Transaction) {
			const isRefund = amount > 0; // Do not forget that `amount` was multiplied by -1
			type = this.t(`order.transaction.${isRefund ? 'refund' : 'payment'}.label`);
			name = element.transactionMode.name;
		} else {
			type = this.t('order.credit.label');
			name = element.note;
			onPress = () => { this.onCreditEdit(element); };
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

		return <View key={element.uuid}>{ content }</View>;
	}

	get orderedElements() {
		return [
			...this.props.transactions,
			...this.props.credits,
		].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	}

	render() {
		const elements = this.orderedElements.map((element, i) => this.renderElement(element, i === 0));
		return (
			<View>
				{ elements }
			</View>
		);
	}
}

const cellStyles = {
	name: {
		flex: 1,
	},
	subtotal: {
		width: 100,
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
