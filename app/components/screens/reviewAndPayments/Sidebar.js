import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
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
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)),
	onAddTransaction: PropTypes.func,
};

const defaultProps = {
	balance: 0,
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

	render() {
		const balance = this.props.balance;
		const formattedBalance = this.props.localizer.formatCurrency(balance);

		return (
			<SidebarElement style={styles.screenSidebar}>
				<Text style={[styles.balanceLabel, styles.toPayLabel]}>
					{ this.t('order.balance.toPay') }
				</Text>
				<Text style={[styles.balanceAmount, styles.toPayAmount]}>{ formattedBalance }</Text>
				<Button
					title={this.t('order.actions.addPayment')}
					layout={buttonLayouts.primary}
					onPress={() => { this.onAddTransactionPress(); }}
				/>
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
		marginBottom: styleVars.verticalRhythm,
	},
	balanceAmount: {
		fontSize: styleVars.verticalRhythm * 2,
		lineHeight: styleVars.verticalRhythm * 2,
		fontWeight: 'bold',
		marginBottom: styleVars.verticalRhythm * 2,
	},
	toPayAmount: {
		color: styleVars.colors.green1,
	},
	toPayLabel: {
	},
};

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
