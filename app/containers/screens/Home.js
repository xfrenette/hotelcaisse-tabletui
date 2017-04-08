import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { STATES as REGISTER_STATES } from 'hotelcaisse-app/dist/business/Register';
import HomeScreen from '../../components/screens/Home';

@inject('business', 'router')
@observer
class Home extends Component {
	onLinkPressed(key) {
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
				path = '/orders/new';
				break;
			case 'find-order':
				path = '/orders/find';
				break;
			case 'test':
				path = '/test';
				break;
		}

		if (path) {
			this.goToPath(path);
		}
	}

	goToPath(path) {
		if (this.props.router) {
			this.props.router.push(path);
		}
	}

	render() {
		const registerState = this.props.business.deviceRegister
			? this.props.business.deviceRegister.state
			: REGISTER_STATES.CLOSED;

		return (
			<HomeScreen
				registerState={registerState}
				onLinkPressed={(key) => { this.onLinkPressed(key); }}
			/>
		);
	}
}

export default Home;
