import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-native';
import { computed, autorun } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import RouteGuard from '../../lib/routeGuards/RouteGuard';

const propTypes = {
	guards: PropTypes.arrayOf(PropTypes.instanceOf(RouteGuard)),
};

const defaultProps = {
	guards: [],
};

/**
 * A GuardedScreen is a specialized Component that receives a RouteGuard property. If this
 * RouteGuard's [allowed] property is true, renders a the [component] props; else renders a
 * <Redirect> to the [redirectTo] property of the RouteGuard.
 */
@inject('logger')
@observer
class GuardedScreen extends Route {
	/**
	 * Namespaced log
	 *
	 * @type {Logger}
	 */
	log = null;
	/**
	 * Reference to autorun functions to clear when unmounting
	 *
	 * @type {Array}
	 */
	disposers = [];

	/**
	 * When mounting, set the namespace on the log and start the auto logging on guard denied.
	 */
	componentWillMount() {
		if (!this.log) {
			this.log = this.props.logger.getNamespace('GuardedScreen');
		}
		this.logOnGuardDenied();
	}

	/**
	 * When unmounting, stop the autoruns
	 */
	componentWillUnmount() {
		this.disposers.forEach((disposer) => { disposer(); });
		this.disposers = [];
	}

	/**
	 * Returns the first RouteGuard that does not allow the screen, else return undefined.
	 *
	 * @return {RouteGuard}
	 */
	@computed
	get deniedGuard() {
		return this.props.guards.find(guard => !guard.allowed);
	}

	/**
	 * When a new RouteGuard denies the screen, we log that we will redirect.
	 */
	logOnGuardDenied() {
		this.disposers.push(autorun(() => {
			const deniedGuard = this.deniedGuard;

			if (deniedGuard) {
				const to = deniedGuard.redirectTo;
				this.log.info(`RouteGuard <${deniedGuard.id}> denied, redirecting to ${to}.`);
			}
		}));
	}

	render() {
		const { component, guards, render, ...fullProps } = this.props;
		const deniedGuard = this.deniedGuard;

		if (deniedGuard) {
			const to = deniedGuard.redirectTo;
			const push = deniedGuard.historyPush || false;
			return <Redirect to={to} push={push} />;
		}

		if (render) {
			return render(...fullProps);
		}

		const Component = component;

		return <Component {...fullProps} />;
	}
}

GuardedScreen.propTypes = propTypes;
GuardedScreen.defaultProps = defaultProps;

export default GuardedScreen;
