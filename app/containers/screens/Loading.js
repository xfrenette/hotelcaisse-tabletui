import React, { Component } from 'react';
import get from 'lodash.get';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { STATES } from '../../lib/UI';
import LoadingScreen from '../../components/screens/Loading';

@inject('ui')
@observer
class Loading extends Component {
	/**
	 * References to autorun functions to clear them on unmounting
	 *
	 * @type {Array}
	 */
	disposers = [];

	/**
	 * When mounting, listen for loaded signal to redirect.
	 */
	componentWillMount() {
		if (get(this.props, 'location.state.redirectWhenLoaded', true)) {
			this.redirectWhenLoaded();
		}
	}

	/**
	 * When unmounting, clear disposers.
	 */
	componentWillUnmount() {
		this.disposers.map((disposer) => { disposer(); });
		this.disposers = [];
	}

	/**
	 * When the UI state changes to READY, we redirect back or to home.
	 */
	redirectWhenLoaded() {
		this.disposers.push(autorun(() => {
			if (this.props.ui.state === STATES.READY) {
				this.props.ui.goBackOrGoHome();
			}
		}));
	}

	render() {
		return (
			<LoadingScreen />
		);
	}
}

export default Loading;
