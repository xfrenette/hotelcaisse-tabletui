import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import ComponentElement from '../../../components/screens/order/ModalCredit';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'uuidGenerator')
@observer
class ModalCredit extends Component {
	modal = null;
	@observable
	editingCredit = null;

	show(credit = null) {
		this.editingCredit = credit;
		this.modal.show();
	}

	onSave(rawCredit, note, amount) {
		let credit = rawCredit;

		if (rawCredit === null) {
			credit = new Credit(this.props.uuidGenerator.generate());
		}

		credit.note = note;
		credit.amount = amount;

		if (rawCredit === null) {
			this.props.order.credits.push(credit);
		}
	}

	render() {
		return (
			<ComponentElement
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				validate = { Credit.validate }
				onSave={(c, n, a) => { this.onSave(c, n, a); }}
				credit={this.editingCredit}
			/>
		);
	}
}

ModalCredit.propTypes = propTypes;
ModalCredit.defaultProps = defaultProps;

export default ModalCredit;
