import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { Text } from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import Button from '../../elements/Button';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	order: PropTypes.instanceOf(Order).isRequired,
	canAddTransaction: PropTypes.bool,
};

const defaultProps = {
	canAddTransaction: true,
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

	renderDetails() {
		const balance = this.props.order.balance.toNumber();
		const balanceText = this.props.localizer.formatCurrency(balance);
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

		return (
			<View>
				{ details }
				<View style={detailsTableStyles.row}>
					<View style={detailsTableStyles.th}>
						<Text style={textStyles.balanceLabel}>{ this.t('order.balance.toPay') }</Text>
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
						<Text style={textStyles.balanceAmount}>{ balanceText }</Text>
					</View>
				</View>
			</View>
		);
	}

	render() {
		const balance = this.props.order.balance;
		const nullBalance = balance.eq(0);

		let addTransactionButton = null;
		let doneButtonLayout = buttonLayouts.primary;

		if (!nullBalance) {
			addTransactionButton = (
				<View style={viewStyles.button}>
					<Button
						title={this.t('order.actions.savePayment')}
						layout={buttonLayouts.primary}
					/>
				</View>
			);
			doneButtonLayout = buttonLayouts.default;
		}

		return (
			<View style={viewStyles.bottomBar}>
				<View style={viewStyles.details}>
					{ this.renderDetails() }
				</View>
				<View style={viewStyles.buttons}>
					<Button
						title={this.t('actions.cancel')}
						layout={buttonLayouts.text}
						type="back"
					/>
					<View style={viewStyles.buttonGroup}>
						<View style={viewStyles.button}>
							<Button
								title={this.t('order.actions.addCredit')}
							/>
						</View>
						{ addTransactionButton }
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
};

const detailsTableStyles = {
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	th: {
		width: 200,
		flexDirection: 'row',
	},
	td: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
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
	balanceAmount: {
		fontWeight: 'bold',
		fontSize: styleVars.verticalRhythm,
		color: styleVars.colors.green1,
	},
	detailsIcon: {
		fontSize: 12,
		lineHeight: 12,
	},
};

BottomBar.propTypes = propTypes;
BottomBar.defaultProps = defaultProps;

export default BottomBar;
