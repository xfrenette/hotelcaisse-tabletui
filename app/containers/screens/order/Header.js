import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react/native';
import { computed } from 'mobx';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/Header';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer')
@observer
class Header extends Component {
	@computed
	get hasNotes() {
		return !!this.props.order.note;
	}

	render() {
		return (
			<ComponentElement
				localizer={this.props.localizer}
				hasNotes={this.hasNotes}
				{...this.props}
			/>
		);
	}
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
