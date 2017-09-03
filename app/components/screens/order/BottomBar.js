import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { BottomBarBackButton, Text } from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import Button from '../../elements/Button';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	order: PropTypes.instanceOf(Order).isRequired,
	canAddTransaction: PropTypes.bool,
	itemsCount: PropTypes.number,
	customerFilled: PropTypes.bool,
	onCreditAdd: PropTypes.func,
	onTransactionAdd: PropTypes.func,
	onCustomerEdit: PropTypes.func,
	onCancel: PropTypes.func,
};

const defaultProps = {
	canAddTransaction: true,
	itemsCount: 0,
	customerFilled: false,
	onCreditAdd: null,
	onTransactionAdd: null,
	onCustomerEdit: null,
	onCancel: null,
};

@observer
class BottomBar extends Component {
	@observable
	showDetails = false;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	toggleDetails() {
		this.showDetails = !this.showDetails;
	}

	get detailsRows() {
		const taxesSum = this.props.order.taxesTotals.reduce(
			(prevTotal, tax) => prevTotal.add(tax.amount),
			new Decimal(0)
		);
		return [
			[this.t('order.details.subTotal'), this.props.order.itemsSubtotal.toNumber()],
			[this.t('order.details.taxes'), taxesSum.toNumber()],
			[this.t('order.details.credits'), this.props.order.creditsTotal.mul(-1).toNumber()],
			[this.t('order.details.payments'), this.props.order.transactionsTotal.mul(-1).toNumber()],
		];
	}

	onAddTransactionPress() {
		let errorTitle = null;
		let errorMessage = null;

		if (!this.props.canAddTransaction) {
			errorTitle = this.t('order.addTransactionError.registerClosed.title');
			errorMessage = this.t('order.addTransactionError.registerClosed.message');
		} else if (this.props.order.balance.eq(0)) {
			errorTitle = this.t('order.addTransactionError.nullBalance.title');
			errorMessage = this.t('order.addTransactionError.nullBalance.message');
		}

		if (errorMessage) {
			Alert.alert(errorTitle, errorMessage);
		} else {
			if (this.props.onTransactionAdd) {
				this.props.onTransactionAdd();
			}
		}
	}

	renderDetails() {
		const balance = this.props.order.balance.toNumber();
		let balanceText;
		const isRefund = balance < 0;
		let details = null;

		if (this.showDetails) {
			details = this.detailsRows.map(([label, amount]) => {
				const amountText = this.props.localizer.formatCurrency(amount, { style: 'accounting' });

				return (
					<View key={label} style={detailsTableStyles.row}>
						<View style={detailsTableStyles.th}>
							<Text style={textStyles.th}>{ label }</Text>
						</View>
						<View style={detailsTableStyles.td}>
							<Text style={textStyles.td}>{ amountText }</Text>
						</View>
					</View>
				)
			});
		}

		if (balance === 0 && this.props.itemsCount > 0) {
			balanceText = (
				<View style={viewStyles.balancePaid}>
					<Icon name="check-circle" style={textStyles.balanceAmountIcon} />
					<Text style={textStyles.balanceAmount}>{ this.t('order.balance.paid') }</Text>
				</View>
			);
		} else {
			balanceText = (
				<Text style={[textStyles.balanceAmount, isRefund ? textStyles.balanceAmountRefund : null]}>
					{this.props.localizer.formatCurrency(Math.abs(balance))}
				</Text>
			);
		}

		return (
			<View>
				{ details }
				<View style={detailsTableStyles.row}>
					<View style={detailsTableStyles.th}>
						<Text style={[textStyles.balanceLabel, isRefund ? textStyles.balanceAmountRefund : null]}>
							{ balance === 0 ? null : this.t(`order.balance.${isRefund ? 'toRefund' : 'toCollect'}`) }
						</Text>
						<View style={viewStyles.seeDetailsButton}>
							<Button
								layout={buttonLayouts.text}
								title={this.t('order.actions.details')}
								preIcon={this.showDetails ? 'minus' : 'plus'}
								preIconStyle={textStyles.detailsIcon}
								onPress={() => { this.toggleDetails(); }}
							/>
						</View>
					</View>
					<View style={detailsTableStyles.td}>
						{ balanceText }
					</View>
				</View>
			</View>
		);
	}

	render() {
		const balance = this.props.order.balance;
		const nullBalance = balance.eq(0);
		const isRefund = balance < 0;
		const canAddTransaction = this.props.canAddTransaction;
		const customerFilled = this.props.customerFilled;

		let addTransactionButtonLayout = nullBalance || !canAddTransaction
			? buttonLayouts.disabled
			: buttonLayouts.primary ;
		let doneButtonLayout = nullBalance && customerFilled
			? buttonLayouts.primary
			: buttonLayouts.default;

		const addTransactionButton = (
			<View style={viewStyles.button}>
				<Button
					title={this.t(`order.actions.${isRefund ? 'saveRefund' : 'savePayment'}`)}
					layout={addTransactionButtonLayout}
					onPress={() => { this.onAddTransactionPress(); }}
				/>
			</View>
		);

		const fillCustomerButton = (
			<View style={viewStyles.button}>
				<Button
					title={this.t('order.actions.fillCustomerShort')}
					layout={buttonLayouts.primary}
					onPress={this.props.onCustomerEdit}
				/>
			</View>
		);

		return (
			<View style={viewStyles.bottomBar}>
				<View style={viewStyles.details}>
					{ this.renderDetails() }
				</View>
				<View style={viewStyles.buttons}>
					<BottomBarBackButton
						title={this.t('actions.cancel')}
						onPress={this.props.onCancel}
					/>
					<View style={viewStyles.buttonGroup}>
						<View style={viewStyles.button}>
							<Button
								title={this.t('order.actions.addCredit')}
								onPress={this.props.onCreditAdd}
							/>
						</View>
						{ this.props.customerFilled ? addTransactionButton : fillCustomerButton }
						<View style={viewStyles.button}>
							<Button
								title={this.t('actions.done')}
								layout={doneButtonLayout}
							/>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const viewStyles = {
	bottomBar: {
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lineColor,
		paddingVertical: styleVars.verticalRhythm,
		paddingHorizontal: styleVars.horizontalRhythm,
		backgroundColor: styleVars.colors.white1,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonGroup: {
		flexDirection: 'row',
	},
	button: {
		marginLeft: styleVars.horizontalRhythm,
	},
	details: {
		marginBottom: styleVars.verticalRhythm,
		alignItems: 'flex-end',
	},
	seeDetailsButton: {
		marginLeft: 16,
	},
	balancePaid: {
		flexDirection: 'row',
	},
};

const detailsTableStyles = {
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 320,
	},
	th: {
		flexDirection: 'row',
		width: 225,
		alignItems: 'center',
	},
	td: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
};

const textStyles = {
	th: {
		fontWeight: 'bold',
	},
	td: {
	},
	balanceLabel: {
		fontWeight: 'bold',
		fontSize: styleVars.bigFontSize,
	},
	balanceAmountIcon: {
		color: styleVars.colors.green1,
		fontSize: styleVars.verticalRhythm,
		marginRight: 10,
	},
	balanceAmount: {
		fontWeight: 'bold',
		fontSize: styleVars.verticalRhythm,
		lineHeight: styleVars.verticalRhythm + 3,
		color: styleVars.colors.green1,
	},
	balanceAmountRefund: {
		color: styleVars.colors.orange1,
	},
	detailsIcon: {
		fontSize: 12,
		lineHeight: 12,
	},
};

BottomBar.propTypes = propTypes;
BottomBar.defaultProps = defaultProps;

export default BottomBar;
