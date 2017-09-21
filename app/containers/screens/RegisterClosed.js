import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import get from 'lodash.get';
import RegisterClosedScreen from '../../components/screens/registerClosed/Screen';

@inject('router', 'localizer')
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
				cashToLeave={100}
				onHome={() => { this.onHome(); }}
				onDone={() => { this.onDone(); }}
			/>
		);
	}
}

export default RegisterClosed;
