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
	Modal,
	Dropdown,
	NumberInput,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Sidebar,
} from '../../layout';
import { Group, Label } from '../../elements/form';
import { Row, Cell } from '../../elements/table';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import tableStyles from '../../../styles/tables';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)),
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onSave: PropTypes.func,
};

const defaultProps = {
	transactionModes: [],
	onPressHome: null,
	onReturn: null,
	onSave: null,
};

@observer
class ReviewAndPaymentsScreen extends Component {
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

	onAddPaymentPress() {
		this.modal.show();
	}

	onModalActionPress(key) {
		if (key === 'save') {

		}

		this.modal.hide();
	}

	renderCustomerData() {
		return (
			<View style={styles.customerData}>
				<Text style={styles.customerName}>Jean Untel</Text>
				<Text style={styles.customerMeta}>jean@untel.com</Text>
			</View>
		);
	}

	renderRoomSelections() {
		return (
			<View style={styles.roomSelections}>
				<View style={styles.checkInOuts}>
					<View style={styles.checkInOut}>
						<Text style={styles.checkInOutTitle}>
							{ this.t('roomSelections.checkinShort') }
						</Text>
						<Text style={styles.checkInOutDate}>XX/XX</Text>
					</View>
					<View style={styles.checkInOut}>
						<Text style={styles.checkInOutTitle}>
							{ this.t('roomSelections.checkoutShort') }
						</Text>
						<Text style={styles.checkInOutDate}>XX/XX</Text>
					</View>
				</View>
			</View>
		);
	}

	renderTable() {
		const total = this.props.order.total.toNumber();
		const formattedTotal = this.props.localizer.formatCurrency(total);

		const items = this.props.order.items.map(item => this.renderItem(item));
		let credits = null;
		let transactions = null;
		let balance = null;

		if (this.props.order.credits.length) {
			const creditRows = this.props.order.credits.map(credit => this.renderCredit(credit));
			credits = (
				<View>
					<Row lined={false} style={cellStyles.section}>
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
					<Row lined={false} style={cellStyles.section}>
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
				<Row style={cellStyles.section}>
					<Cell style={cellStyles.name} first />
					<Cell style={cellStyles.qty}>
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
				{ credits }
				<Row style={cellStyles.section}>
					<Cell style={cellStyles.name} first />
					<Cell style={cellStyles.qty}>
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
		const amount = credit.amount.toNumber();
		const formattedAmount = this.props.localizer.formatCurrency(amount);

		return (
			<Row key={credit.uuid}>
				<Cell style={[cellStyles.name, cellStyles.subRow]} first>
					<Text>{ credit.note }</Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text>({ formattedAmount })</Text>
				</Cell>
			</Row>
		);
	}

	renderTransaction(transaction) {
		const amount = transaction.amount.toNumber();
		const formattedAmount = this.props.localizer.formatCurrency(amount);
		const createdAt = transaction.createdAt;
		const formattedCreatedAt = `${createdAt.getDate()}/${createdAt.getMonth()}`;

		return (
			<Row key={transaction.uuid}>
				<Cell style={[cellStyles.name, cellStyles.subRow]} first>
					<Text>{ transaction.transactionMode.name }</Text>
				</Cell>
				<Cell style={cellStyles.date} last>
					<Text>{ formattedCreatedAt }</Text>
				</Cell>
				<Cell style={cellStyles.subtotal} last>
					<Text>({ formattedAmount })</Text>
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
		const actions = {
			cancel: this.t('actions.cancel'),
			save: this.t('actions.save'),
		};

		const Option = Dropdown.Option;
		const modeOptions = this.props.transactionModes.map(
			tm => <Option key={tm.uuid} value={tm.uuid} label={tm.name} />
		);

		return (
			<Modal
				ref={(node) => { this.modal = node; }}
				title={this.t('order.payments.modal.title')}
				actions={actions}
				onActionPress={(key) => { this.onModalActionPress(key); }}
			>
				<Group>
					<View>
						<Label>{ this.t('order.payments.fields.mode') }</Label>
						<Dropdown>
							{ modeOptions }
						</Dropdown>
					</View>
					<View>
						<Label>{ this.t('order.payments.fields.amount') }</Label>
						<NumberInput
							type="money"
							localizer={this.props.localizer}
							value={this.props.order.balance.toNumber()}
						/>
					</View>
				</Group>
			</Modal>
		);
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('customerRoomSelections.title')}
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
						title={this.t('actions.save')}
						layout={buttonLayouts.default}
						onPress={this.props.onSave}
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
