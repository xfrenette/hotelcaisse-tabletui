import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	Button,
	Text,
} from '../../elements';
import {
	Sidebar as SidebarElement,
} from '../../layout';
import TransactionModal from './TransactionModal';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';

const propTypes = {
	balance: PropTypes.number,
	canAddTransaction: PropTypes.bool,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)),
	onAddTransaction: PropTypes.func,
};

const defaultProps = {
	balance: 0,
	canAddTransaction: false,
	transactionModes: [],
	onAddTransaction: null,
};

@observer
class Sidebar extends Component {
	/**
	 * Internal reference to the TransactionModal
	 *
	 * @type {TransactionModal}
	 */
	modal = null;

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
	 * When the user presses the "Save payment/refund" button
	 *
	 * @return {[type]}
	 */
	onAddTransactionPress() {
		this.modal.show();
	}

	/**
	 * Renders the add transaction modal
	 *
	 * @return {Node}
	 */
	renderModal() {
		return (
			<TransactionModal
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				balance={this.props.balance}
				transactionModes={this.props.transactionModes}
				onAddTransaction={this.props.onAddTransaction}
			/>
		);
	}

	/**
	 * Renders the 'add transaction' button. If we cannot save the transactions (ex: the register is
	 * closed), we instead show a message.
	 *
	 * @return {Node}
	 */
	renderAddTransactionButton() {
		if (!this.props.canAddTransaction) {
			return (
				<View style={styles.registerClosed}>
					<Icon name="lock" style={styles.registerClosedIcon} />
					<Text style={styles.registerClosedLabel}>
						{ this.t('order.balance.cannotSaveRegisterClosed') }
					</Text>
				</View>
			);
		}

		const balance = this.props.balance;
		const buttonLabel = this.t(`order.actions.${balance > 0 ? 'savePayment' : 'saveRefund'}`);

		return (
			<Button
				title={buttonLabel}
				layout={buttonLayouts.primary}
				onPress={() => { this.onAddTransactionPress(); }}
			/>
		);
	}

	/**
	 * Renders the content if we have a non-zero balance
	 *
	 * @return {Node}
	 */
	renderNonZeroBalance() {
		const balance = this.props.balance;
		const formattedBalance = this.props.localizer.formatCurrency(Math.abs(balance));
		const label = this.t(`order.balance.${balance > 0 ? 'toCollect' : 'toRefund'}`);
		const style = balance > 0 ? styles.toCollect : styles.toRefund;

		return (
			<View>
				<Text style={[styles.balanceLabel, style]}>
					{ label }
				</Text>
				<Text style={[styles.balanceAmount, style]}>{ formattedBalance }</Text>
				{ this.renderAddTransactionButton() }
			</View>
		);
	}

	/**
	 * Renders the content if we have a zero balance
	 *
	 * @return {Node}
	 */
	renderZeroBalance() {
		return (
			<View style={styles.paidBlock}>
				<Icon name="check-circle" style={styles.paidIcon} />
				<Text style={styles.paidLabel}>{ this.t('order.balance.paid') }</Text>
			</View>
		);
	}

	render() {
		const content = this.props.balance === 0
			? this.renderZeroBalance()
			: this.renderNonZeroBalance();

		return (
			<SidebarElement style={styles.screenSidebar}>
				{ content }
				{ this.renderModal() }
			</SidebarElement>
		);
	}
}

const styles = {
	screenSidebar: {
		width: 300,
	},
	balanceLabel: {
		textAlign: 'right',
	},
	balanceAmount: {
		fontSize: styleVars.verticalRhythm * 2,
		lineHeight: styleVars.verticalRhythm * 2,
		fontWeight: 'bold',
		marginBottom: styleVars.verticalRhythm,
		textAlign: 'right',
	},
	toCollect: {
		color: styleVars.colors.green1,
	},
	toRefund: {
		color: styleVars.colors.orange1,
	},
	paidBlock: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	paidIcon: {
		color: styleVars.colors.green1,
		fontSize: styleVars.verticalRhythm * 2,
		marginRight: 12,
	},
	paidLabel: {
		color: styleVars.colors.green1,
		fontWeight: 'bold',
		fontSize: styleVars.verticalRhythm * 2,
		lineHeight: styleVars.verticalRhythm * 3,
	},
	registerClosed: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	registerClosedLabel: {
		fontStyle: 'italic',
		flex: 1,
	},
	registerClosedIcon: {
		marginRight: 10,
		fontSize: 18,
		lineHeight: 22,
	},
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
