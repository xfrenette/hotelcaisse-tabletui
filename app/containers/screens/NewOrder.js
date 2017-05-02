import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import NewOrderScreen from '../../components/screens/NewOrder';

@inject('localizer')
@observer
class NewOrder extends Component {
	render() {
		return (
			<NewOrderScreen localizer={this.props.localizer} />
		);
	}
}

export default NewOrder;
