import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import get from 'lodash.get';
import RegisterClosedScreen from '../../components/screens/registerClosed/Screen';

@inject('router', 'localizer', 'device')
class RegisterClosed extends Component {
	register = null;

	componentWillMount() {
		this.register = get(this.props, 'location.state.register', null);
	}

	onHome() {
		this.onDone();
	}

	onDone() {
		this.props.router.replace('/');
	}

	render() {
		return (
			<RegisterClosedScreen
				localizer={this.props.localizer}
				register={this.register}
				cashFloat={this.props.device.settings.registers.cashFloat}
				onHome={() => { this.onHome(); }}
				onDone={() => { this.onDone(); }}
			/>
		);
	}
}

export default RegisterClosed;
