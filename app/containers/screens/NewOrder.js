import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import NewOrderScreen from '../../components/screens/newOrder/Screen';

@inject('localizer', 'business')
@observer
class NewOrder extends Component {
	render() {
		return (
			<NewOrderScreen
				localizer={this.props.localizer}
				rootProductCategory={this.props.business.rootProductCategory}
			/>
		);
	}
}

export default NewOrder;
