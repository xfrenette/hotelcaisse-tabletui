import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/BottomBar';

const propTypes = {
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: false,
};

@inject('localizer', 'register')
class BottomBar extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	get canAddTransaction() {
		return true;
	}

	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				order={this.props.order}
				canAddTransaction={this.canAddTransaction}
				{...this.props}
			/>
		);
	}
}

BottomBar.propTypes = propTypes;
BottomBar.defaultProps = defaultProps;

export default BottomBar;
