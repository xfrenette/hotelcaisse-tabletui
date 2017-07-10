import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import DetailsComponent from '../../../components/screens/reviewAndPayments/Details';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
};

const defaultProps = {
};

@inject('localizer')
class Details extends Component {
	render() {
		return (
			<DetailsComponent
				order={this.props.order}
				localizer={this.props.localizer}
			/>
		);
	}
}

Details.propTypes = propTypes;
Details.defaultProps = defaultProps;

export default Details;
