import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import { View, ScrollView } from 'react-native';
import {
	Button,
	BottomBarBackButton,
	Text,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Sidebar,
} from '../../layout';
import { Row, Cell } from '../../elements/table';
import TransactionModal from './TransactionModal';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import tableStyles from '../../../styles/tables';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	isNew: PropTypes.bool,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)),
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onDone: PropTypes.func,
	onEditCustomer: PropTypes.func,
	onEditRoomSelections: PropTypes.func,
	onAddTransaction: PropTypes.func,
};

const defaultProps = {
	isNew: false,
	transactionModes: [],
	onPressHome: null,
	onReturn: null,
	onDone: null,
	onEditCustomer: null,
	onEditRoomSelections: null,
	onAddTransaction: null,
};

@observer
class ReviewAndPaymentsScreen extends Component {
	modal = null;

	get items() {
		return this.props.order.items.filter(item => item.quantity > 0);
	}

	get reimbursements() {
		return this.props.order.items.filter(item => item.quantity < 0);
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

	onAddPaymentPress() {
		this.modal.show();
	}

	renderCustomerData() {
		return (
			<View style={layoutStyles.block}>
				<View style={styles.editableBlock}>
					<View style={styles.editableBlockData}>
						<Text style={styles.customerName}>{ this.props.order.customer.get('customer.name') }</Text>
						<Text>{ this.props.order.customer.get('customer.email') }</Text>
					</View>
					<Button
						layout={buttonLayouts.text}
						title={this.t('actions.edit')}
						onPress={this.props.onEditCustomer}
					/>
				</View>
			</View>
		);
	}

	renderRoomSelections() {
		const checkInDate = this.props.order.earliestCheckInDate;
		const checkOutDate = this.props.order.latestCheckOutDate;
		const formattedCheckIn = this.props.localizer.formatDate(checkInDate, { skeleton: 'MMMEd' });
		const formattedCheckOut = this.props.localizer.formatDate(checkOutDate, { skeleton: 'MMMEd' });
		const rooms = this.props.order.roomSelections.map(rs => rs.room.name);

		return (
			<View style={layoutStyles.section}>
				<View style={styles.editableBlock}>
					<View style={styles.editableBlockData}>
						<View style={styles.checkInOuts}>
							<View style={styles.checkInOut}>
								<Text style={styles.checkInOutTitle}>
									{ this.t('roomSelections.checkinShort') }
								</Text>
								<Text>{ formattedCheckIn }</Text>
							</View>
							<View style={styles.checkInOut}>
								<Text style={styles.checkInOutTitle}>
									{ this.t('roomSelections.checkoutShort') }
								</Text>
								<Text>{ formattedCheckOut }</Text>
							</View>
							<View style={styles.rooms}>
								<Text style={styles.room}>{ rooms.join(', ') }</Text>
							</View>
						</View>
					</View>
					<Button
						layout={buttonLayouts.text}
						title={this.t('actions.edit')}
						onPress={this.props.onEditRoomSelections}
					/>
				</View>
			</View>
		);
	}

	renderTable() {
		const total = this.props.order.total.toNumber();
		const formattedTotal = this.props.localizer.formatCurrency(total);

		const items = this.items.map(item => this.renderItem(item));
		let reimbursements = null;
		let credits = null;
		let transactions = null;
		let balance = null;

		if (this.reimbursements.length) {
			const reimbursementRows = this.reimbursements.map(item => this.renderItem(item));

			reimbursements = (
				<View>
					<Row>
						<Cell style={[cellStyles.name]} first last>
							<Text style={styles.sectionCell}>{ this.t('order.reimbursements.label') }</Text>
						</Cell>
					</Row>
					{ reimbursementRows }
				</View>
			);
		}

		if (this.props.order.credits.length) {
			const creditRows = this.props.order.credits.map(credit => this.renderCredit(credit));
			credits = (
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

		if (this.props.order.transactions.length) {
			const transactionRows = this.props.order.transactions.map(
				transaction => this.renderTransaction(transaction)
			);
			transactions = (
				<View>
					<Row>
						<Cell style={[cellStyles.name]} first last>
							<Text style={styles.sectionCell}>{ this.t('order.payments.label') }</Text>
						</Cell>
					</Row>
					{ transactionRows }
				</View>
			);

			const balanceAmount = this.props.order.balance.toNumber();
			const formattedBalance = this.props.localizer.formatCurrency(balanceAmount);

			balance = (
				<Row>
					<Cell style={cellStyles.name} first>
						<Text style={styles.totalCell}>{ this.t('order.balance.toPay') }</Text>
					</Cell>
					<Cell style={cellStyles.subtotal} last>
						<Text style={styles.totalCell}>{ formattedBalance }</Text>
					</Cell>
				</Row>
			);
		}

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
				{ items }
				{ reimbursements }
				{ credits }
				<Row>
					<Cell style={cellStyles.name} first>
						<Text style={styles.totalCell}>{ this.t('order.items.total') }</Text>
					</Cell>
					<Cell style={cellStyles.subtotal} last>
						<Text style={styles.totalCell}>{ formattedTotal }</Text>
					</Cell>
				</Row>
				{ transactions }
				{ balance }
			</View>
		);
	}

	renderItem(item) {
		const unitPrice = item.unitFullPrice.toNumber();
		const formattedUnitPrice = this.props.localizer.formatCurrency(unitPrice);
		const total = item.total.toNumber();
		const formattedTotal = this.props.localizer.formatCurrency(total);

		return (
			<Row key={item.uuid}>
				<Cell style={cellStyles.name} first><Text>{ item.name }</Text></Cell>
				<Cell style={cellStyles.unitPrice}><Text>{ formattedUnitPrice }</Text></Cell>
				<Cell style={cellStyles.qty}><Text>{ String(item.quantity) }</Text></Cell>
				<Cell style={cellStyles.subtotal} last><Text>{ formattedTotal }</Text></Cell>
			</Row>
		);
	}

	renderCredit(credit) {
		const amount = credit.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Row key={credit.uuid}>
				<Cell style={cellStyles.name} first>
					<Text>{ credit.note } </Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text>{ formattedAmount }</Text>
				</Cell>
			</Row>
		);
	}

	renderTransaction(transaction) {
		const amount = transaction.amount.toNumber() * -1;
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Row key={transaction.uuid}>
				<Cell style={cellStyles.name} first>
					<Text>{ transaction.transactionMode.name }</Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text>{ formattedAmount }</Text>
				</Cell>
			</Row>
		);
	}

	renderSidebar() {
		const balance = this.props.order.balance.toNumber();
		const formattedBalance = this.props.localizer.formatCurrency(balance);

		return (
			<Sidebar style={styles.screenSidebar}>
				<Text style={[styles.balanceLabel, styles.toPayLabel]}>{this.t('order.balance.toPay')}</Text>
				<Text style={[styles.balanceAmount, styles.toPayAmount]}>{ formattedBalance }</Text>
				<Button
					title={this.t('order.actions.addPayment')}
					layout={buttonLayouts.primary}
					onPress={() => { this.onAddPaymentPress(); }}
				/>
			</Sidebar>
		);
	}

	renderModal() {
		return (
			<TransactionModal
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				balance={this.props.order.balance.toNumber()}
				transactionModes={this.props.transactionModes}
				onAddTransaction={this.props.onAddTransaction}
			/>
		);
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('screens.order.reviewPayments.title')}
					onPressHome={this.props.onPressHome}
				/>
				<View style={styles.screenContent}>
					<ScrollView>
						<MainContent withSidebar>
							{ this.renderCustomerData() }
							{ this.renderRoomSelections() }
							{ this.renderTable() }
						</MainContent>
					</ScrollView>
					{ this.renderSidebar() }
				</View>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.back')}
						onPress={this.props.onReturn}
					/>
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.default}
						onPress={this.props.onDone}
					/>
				</BottomBar>
				{ this.renderModal() }
			</Screen>
		);
	}
}

const styles = {
	screenContent: {
		flexDirection: 'row',
		flex: 1,
	},
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
	sectionCell: {
		fontWeight: 'bold',
	},
	totalCell: {
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
	},
	customerName: {
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
		fontSize: styleVars.bigFontSize,
	},
	checkInOuts: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
	},
	rooms: {
		marginRight: styleVars.horizontalRhythm * 2,
	},
	checkInOut: {
		marginRight: styleVars.horizontalRhythm * 2,
	},
	checkInOutTitle: {
		fontWeight: 'bold',
	},
	room: {
		fontWeight: 'bold',
	},
	itemType: {
		fontStyle: 'italic',
		color: styleVars.colors.grey2,
	},
	editableBlock: {
		flexDirection: 'row',
	},
	editableBlockData: {
		flex: 1,
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

ReviewAndPaymentsScreen.propTypes = propTypes;
ReviewAndPaymentsScreen.defaultProps = defaultProps;

export default ReviewAndPaymentsScreen;
