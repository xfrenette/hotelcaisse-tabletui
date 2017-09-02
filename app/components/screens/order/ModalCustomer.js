import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Room from 'hotelcaisse-app/dist/business/Room';
import Field from 'hotelcaisse-app/dist/fields/Field';
import { Modal, Title } from '../../elements';
import { Container } from '../../layout';
import CustomerForm from './CustomerForm';
import layoutStyles from '../../../styles/layout';


const propTypes = {
	RoomSelectionsForm: PropTypes.func,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	roomSelections: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(RoomSelection)).isRequired,
	customerFieldValues: PropTypesMobx.observableMap.isRequired,
	customerFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
	roomSelectionFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
	rooms: PropTypes.arrayOf(PropTypes.instanceOf(Room)).isRequired,
	validate: PropTypes.func,
	onSave: PropTypes.func,
};

const defaultProps = {
	validate: null,
	onSave: null,
};

class ModalCustomer extends Component {
	modalRef = null;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	onSave() {
		if (this.validate()) {
			if (this.props.onSave) {
				this.props.onSave();
			}

			return true;
		}

		return false;
	}

	onActionPress(action) {
		if (action === 'save') {
			if (this.onSave()) {
				this.modalRef.hide();
			}
		} else {
			this.modalRef.hide();
		}
	}

	show() {
		this.modalRef.show();
	}

	validate() {
		if (this.props.validate) {
			return this.props.validate();
		}

		return true;
	}

	render() {
		const RoomSelectionsForm = this.props.RoomSelectionsForm;
		const actions = {
			'cancel': this.t('actions.cancel'),
			'save': this.t('actions.save'),
		};

		return (
			<Modal
				ref={(node) => {
					this.modalRef = node;
				}}
				onActionPress={(a) => {
					this.onActionPress(a);
				}}
				actions={actions}
				title='tmp'
				animationType="slide"
				fullScreen
			>
				<Container layout="oneColCentered">
					<View style={layoutStyles.block}>
						<Title style={layoutStyles.title}>{ this.t('order.customer.customerInfo') }</Title>
						<CustomerForm
							localizer={this.props.localizer}
							fields={this.props.customerFields}
							customerFieldValues={this.props.customerFieldValues}
						/>
					</View>
					<View style={layoutStyles.block}>
						<Title style={layoutStyles.title}>{ this.t('order.customer.roomSelectionsInfo') }</Title>
						<RoomSelectionsForm/>
					</View>
				</Container>
			</Modal>
		);
	}
}

const viewStyles = {};

ModalCustomer.propTypes = propTypes;
ModalCustomer.defaultProps = defaultProps;

export default ModalCustomer;
