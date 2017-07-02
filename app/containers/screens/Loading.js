import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { STATES } from '../../lib/UI';
import LoadingScreen from '../../components/screens/Loading';

@inject('ui')
@observer
class Loading extends Component {
	disposers = [];

	componentWillMount() {
		this.redirectWhenLoaded();
	}

	componentWillUnmount() {
		this.disposers.map((disposer) => { disposer(); });
		this.disposers = [];
	}

	redirectWhenLoaded() {
		this.disposers.push(autorun(() => {
			if (this.props.ui.state === STATES.READY) {
				this.props.ui.goBackOrGoHome();
			}
		}));
	}

	render() {
		console.log('Loading:render');
		return (
			<LoadingScreen />
		);
	}
}

export default Loading;
