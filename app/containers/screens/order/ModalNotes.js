import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import Order from 'hotelcaisse-app/dist/business/Order';
import ComponentElement from '../../../components/screens/order/ModalNotes';

const propTypes = {
	order: PropTypes.instanceOf(Order),
};

const defaultProps = {
};

@inject('localizer', 'uuidGenerator')
@observer
class ModalNotes extends Component {
	modal = null;

	@computed
	get notes() {
		return this.props.order.note;
	}

	show() {
		this.modal.show();
	}

	onSave(notes) {
		this.props.order.note = notes;
	}

	render() {
		return (
			<ComponentElement
				ref={(node) => { this.modal = node; }}
				localizer={this.props.localizer}
				notes={this.notes}
				onSave={(notes) => { this.onSave(notes); }}
			/>
		);
	}
}

ModalNotes.propTypes = propTypes;
ModalNotes.defaultProps = defaultProps;

export default ModalNotes;
