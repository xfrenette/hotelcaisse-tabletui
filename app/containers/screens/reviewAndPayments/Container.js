import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import get from 'lodash.get';
import Order from 'hotelcaisse-app/dist/business/Order';
import Customer from './Customer';
import RoomSelections from './RoomSelections';
import Sidebar from './Sidebar';
import Details from './Details';
import Screen from '../../../components/screens/reviewAndPayments/Screen';

@inject('localizer', 'uuidGenerator', 'router', 'business', 'ui')
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
	 * When mounting, get the Order and 'isNew' from the location
	 */
	componentWillMount() {
		const order = get(this.props, 'location.state.order', null);
		this.order = order || new Order(this.props.uuidGenerator.generate());
		this.order.customer.fields = this.props.business.customerFields;
		this.isNew = get(this.props, 'location.state.new', false);
	}

	/**
	 * When the user presses the 'Home' button
	 */
	onPressHome() {
		this.props.router.replace('/');
	}

	/**
	 * When the user presses the 'Return' button
	 */
	onReturn() {
		this.props.router.goBack();
	}

	/**
	 * When the user presses the 'Done' button
	 */
	onDone() {
		this.props.ui.orderDraft = null;
		this.props.router.push('/');
	}

	render() {
		return (
			<Screen
				sidebarNode={<Sidebar order={this.order} />}
				customerNode={<Customer order={this.order} />}
				roomSelectionsNode={<RoomSelections order={this.order} />}
				detailsNode={<Details order={this.order} />}
				order={this.order}
				isNew={this.isNew}
				localizer={this.props.localizer}
				onPressHome={() => { this.onPressHome(); }}
				onReturn={() => { this.onReturn(); }}
				onDone={() => { this.onDone(); }}
			/>
		);
	}
}

export default Container;
