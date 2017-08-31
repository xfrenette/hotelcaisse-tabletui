import React, { Component } from 'react';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import Screen from '../../../components/screens/order/Screen';
import CategorySidebar from './CategorySidebar';
import BottomBar from './BottomBar';
import Items from './Items';
import CreditsTransactions from './CreditsTransactions';

@inject('localizer', 'uuidGenerator', 'router', 'business', 'register', 'ui')
@observer
class Container extends Component {
	/**
	 * The Order currently being edited
	 *
	 * @type {Order}
	 */
	order = null;
	/**
	 * If the Order is a new one or an already existing one (already saved)
	 *
	 * @type {Boolean}
	 */
	isNew = false;

	/**
	 * We can add transaction only if the register is opened
	 *
	 * @return {Boolean}
	 */
	@computed
	get canAddTransaction() {
		return this.props.register.state === STATES.OPENED;
	}

	/**
	 * When mounting, get the Order and 'isNew' from the location. If it is not new, we start
	 * recording changes.
	 */
	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
		this.order.customer.fields = this.props.business.customerFields;
		this.isNew = get(this.props, 'location.state.new', false);

		if (!this.isNew) {
			this.order.recordChanges();
		}
	}

	/**
	 * When the user presses the 'Home' button
	 */
	onPressHome() {
		this.props.router.replace('/');
	}

	/**
	 * When the user presses the 'Done' button. We clear the draft. If new order, we add it to the
	 * business and we go home, else we commit the changes and go back.
	 */
	onDone() {
		this.props.ui.orderDraft = null;

		if (this.isNew) {
			this.props.business.addOrder(this.order);
			this.props.router.replace('/');
		} else {
			this.order.commitChanges();
			this.props.router.goBack();
		}
	}

	render() {
		return (
			<Screen
				order={this.order}
				isNew={this.isNew}
				canAddTransaction={this.canAddTransaction}
				localizer={this.props.localizer}
				CategorySidebar={(props) => <CategorySidebar order={this.order} {...props} />}
				BottomBar={(props) => <BottomBar order={this.order} {...props} />}
				Items={(props) => <Items order={this.order} isNew={this.isNew} {...props} />}
				CreditsTransactions={(props) => <CreditsTransactions order={this.order} {...props} />}
				onPressHome={() => { this.onPressHome(); }}
				onDone={() => { this.onDone(); }}
			/>
		);
	}
}

export default Container;
