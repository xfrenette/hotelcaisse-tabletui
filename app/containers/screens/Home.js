import React, { Component } from 'react';
import { Alert } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import Order from 'hotelcaisse-app/dist/business/Order';
import HomeScreen from '../../components/screens/home/Screen';

@inject('register', 'router', 'localizer', 'ui')
@observer
class Home extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	/**
	 * When a button is pressed, we redirect to the associated path
	 *
	 * @param {String} key
	 */
	onButtonPress(key) {
		let path = null;

		switch (key) {
			case 'open-register':
				path = '/register/open';
				break;
			case 'close-register':
				path = '/register/close';
				break;
			case 'manage-register':
				path = '/register/manage';
				break;
			case 'new-order':
				this.onNewOrderPress();
				break;
			case 'orders':
				this.onOrdersPress();
				break;
			default:
				path = null;
				break;
		}

		if (path) {
			this.goToPath(path);
		}
	}

	/**
	 * When we press the "New Order" button, if an Order draft was previously set, we ask the user if
	 * she wants to continue the draft or create a new one. We the redirect.
	 */
	onNewOrderPress() {
		const draft = this.props.ui.orderDraft;

		if (draft) {
			Alert.alert(
				this.t('order.continueDraft.title'),
				this.t('order.continueDraft.message'),
				[
					{
						text: this.t('order.continueDraft.actions.continue'),
						onPress: () => { this.continueOrderDraft(); },
					},
					{
						text: this.t('order.continueDraft.actions.new'),
						onPress: () => { this.createOrder(); },
					},
				]
			);
		} else {
			this.createOrder();
		}
	}

	/**
	 * When the user presses the "See Orders" button, we first clear the cache before going to the
	 * screen
	 */
	onOrdersPress() {
		this.props.ui.loadedOrders.clear();
		this.goToPath('/orders');
	}

	/**
	 * Goes to the Order items screen continuing the Order draft.
	 */
	continueOrderDraft() {
		const order = this.props.ui.orderDraft;
		this.editOrder(order);
	}

	/**
	 * Goes to the Order items screen with a new Order.
	 */
	createOrder() {
		this.editOrder(null);
	}

	/**
	 * Goes to the Order items screen for the specified Order.
	 *
	 * @param {Order} order
	 */
	editOrder(order) {
		this.goToPath({
			pathname: '/order',
			state: {
				order,
				new: true,
			},
		});
	}

	/**
	 * Utility function to go to a path
	 *
	 * @param {String} path
	 */
	goToPath(path) {
		if (this.props.router) {
			this.props.router.push(path);
		}
	}

	render() {
		const registerState = this.props.register
			? this.props.register.state
			: REGISTER_STATES.CLOSED;

		return (
			<HomeScreen
				localizer={this.props.localizer}
				registerState={registerState}
				onButtonPress={(key) => { this.onButtonPress(key); }}
			/>
		);
	}
}

export default Home;
