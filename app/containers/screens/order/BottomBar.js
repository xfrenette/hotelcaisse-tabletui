import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react/native';
import { computed } from 'mobx';
import Order from 'hotelcaisse-app/dist/business/Order';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import ComponentElement from '../../../components/screens/order/BottomBar';

const propTypes = {
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: false,
};

@inject('localizer', 'register')
@observer
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

	@computed
	get canAddTransaction() {
		return this.props.register.state === STATES.OPENED;
	}

	@computed
	get customerFilled() {
		return this.props.order.customer.fieldValues.size > 0;
	}

	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				order={this.props.order}
				canAddTransaction={this.canAddTransaction}
				customerFilled={this.customerFilled}
				{...this.props}
			/>
		);
	}
}

BottomBar.propTypes = propTypes;
BottomBar.defaultProps = defaultProps;

export default BottomBar;
