import React, { Component } from 'react';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import Screen from '../../../components/screens/order/Screen';
import CategorySidebar from './CategorySidebar';
import BottomBar from './BottomBar';
import Items from './Items';
import CreditsTransactions from './CreditsTransactions';
import ModalCredit from './ModalCredit';
import ModalTransaction from './ModalTransaction';
import ModalCustomer from './ModalCustomer';
import ModalNotes from './ModalNotes';
import ModalCustomProduct from './ModalCustomProduct';
import Customer from './Customer';
import Header from './Header';

@inject('localizer', 'uuidGenerator', 'router', 'business', 'register', 'ui')
@observer
class Container extends Component {
	/**
	 * The Order currently being edited
	 *
	 * @type {Order}
	 */
	order = null;
	oldTransactions = [];
	/**
	 * If the Order is a new one or an already existing one (already saved)
	 *
	 * @type {Boolean}
	 */
	isNew = false;
	modalCredit = null;
	modalTransaction = null;
	modalCustomer = null;
	modalNotes = null;
	modalCustomProduct = null;

	/**
	 * We can add transaction only if the register is opened
	 *
	 * @return {Boolean}
	 */
	@computed
	get canAddTransaction() {
		return this.props.register.state === STATES.OPENED;
	}

	@computed
	get hasTransactionsOrCredits() {
		return !!(this.order.transactions.length || this.order.credits.length);
	}

	/**
	 * When mounting, get the Order and 'isNew' from the location. If it is not new, we start
	 * recording changes.
	 */
	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
		this.order.customer.fields = this.props.business.customerFields;
		this.order.localizer = this.props.localizer;

		this.isNew = get(this.props, 'location.state.new', false);
		this.saveOldTransactions();

		if (!this.isNew) {
			this.order.recordChanges();
		}
	}

	saveOldTransactions() {
		this.oldTransactions = this.order.transactions.map(t => t.uuid);
	}

	resetOrder() {
		if (!this.isNew) {
			this.order.revertChanges();
		}
	}

	saveDraft() {
		this.props.ui.orderDraft = this.order;
	}

	clearDraft() {
		this.props.ui.orderDraft = null;
	}

	/**
	 * When the user presses the 'Home' button
	 */
	onHome() {
		this.resetOrder();
		this.props.router.replace('/');
	}

	onBack() {
		this.resetOrder();
		this.props.ui.goBackOrGoHome();
	}

	/**
	 * When the user presses the 'Done' button. We clear the draft. If new order, we add it to the
	 * business and we go home, else we commit the changes and go back.
	 */
	onDone() {
		this.clearDraft();

		if (this.isNew) {
			this.order.freeze();
			this.props.business.orderCreated(this.order);
			this.props.router.replace('/');
		} else {
			const changes = this.order.commitChanges();

			if (changes.hasChanges()) {
				this.order.freeze();
				this.props.business.orderChanged(this.order, changes);
			}

			this.props.router.goBack();
		}
	}

	onCreditEdit(credit) {
		this.modalCredit.show(credit);
	}

	onTransactionEdit(transaction) {
		this.modalTransaction.show(transaction);
	}

	onCustomerEdit() {
		this.modalCustomer.show();
	}

	onNotesEdit() {
		this.modalNotes.show();
	}

	onCustomProductEdit(product) {
		this.modalCustomProduct.show(product);
	}

	render() {
		return (
			<Screen
				order={this.order}
				isNew={this.isNew}
				canAddTransaction={this.canAddTransaction}
				hasTransactionsOrCredits={this.hasTransactionsOrCredits}
				localizer={this.props.localizer}
				saveDraft={() => { this.saveDraft(); }}
				CategorySidebar={(props) => <CategorySidebar order={this.order} {...props} />}
				BottomBar={(props) => <BottomBar order={this.order} {...props} />}
				Items={(props) => <Items order={this.order} isNew={this.isNew} {...props} />}
				CreditsTransactions={(props) => (
					<CreditsTransactions
						order={this.order}
						oldTransactions={this.oldTransactions}
						{...props}
					/>
				)}
				ModalCredit={(props) => (
					<ModalCredit
						ref={(n) => { this.modalCredit = n ? n.wrappedInstance : null; }}
						order={this.order}
						{...props}
					/>
				)}
				ModalTransaction={(props) => (
					<ModalTransaction
						ref={(n) => { this.modalTransaction = n ? n.wrappedInstance : null; }}
						order={this.order}
						{...props}
					/>
				)}
				ModalCustomer={(props) => (
					<ModalCustomer
						ref={(n) => { this.modalCustomer = n ? n.wrappedInstance : null; }}
						order={this.order}
						{...props}
					/>
				)}
				ModalNotes={(props) => (
					<ModalNotes
						ref={(n) => { this.modalNotes = n ? n.wrappedInstance : null; }}
						order={this.order}
						{...props}
					/>
				)}
				ModalCustomProduct={(props) => (
					<ModalCustomProduct
						ref={(n) => { this.modalCustomProduct = n ? n.wrappedInstance : null; }}
						order={this.order}
						{...props}
					/>
				)}
				Customer={(props) => <Customer order={this.order} {...props} />}
				Header={(props) => <Header order={this.order} {...props} />}
				onHome={() => { this.onHome(); }}
				onDone={() => { this.onDone(); }}
				onBack={() => { this.onBack(); }}
				onCreditEdit={(credit) => { this.onCreditEdit(credit); }}
				onTransactionEdit={(transaction) => { this.onTransactionEdit(transaction); }}
				onCustomerEdit={() => { this.onCustomerEdit(); }}
				onNotesEdit={() => { this.onNotesEdit(); }}
				onCustomProductEdit={(p) => { this.onCustomProductEdit(p); }}
			/>
		);
	}
}

export default Container;
