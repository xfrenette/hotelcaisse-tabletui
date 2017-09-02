import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Message, Modal, TextInput } from '../../elements';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	notes: PropTypes.string,
	onSave: PropTypes.func,
};

const defaultProps = {
	notes: null,
	onSave: null,
};

@observer
class ModalCredit extends Component {
	modalRef = null;
	@observable
	notes = '';

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	componentWillMount() {
		this.notes = this.props.notes;
	}

	componentWillReceiveProps(props) {
		this.notes = props.notes;
	}

	onSave() {
		if (this.props.onSave) {
			this.props.onSave(this.notes);
		}
	}

	onActionPress(action) {
		if (action === 'save') {
			this.onSave();
		}

		this.modalRef.hide();
	}

	show() {
		this.notes = this.props.notes;
		this.modalRef.show();
	}

	render() {
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
				title={this.t('order.notes.modal.title')}
			>
				<TextInput
					value={this.notes}
					onChangeText={(t) => { this.notes = t; }}
					placeholder={this.t(`order.notes.modal.placeholder`)}
					numberOfLines={5}
					multiline
					blurOnSubmit={false}
				/>
				<Message>{ this.t('order.notes.modal.instructions') }</Message>
			</Modal>
		);
	}
}

const viewStyles = {};

ModalCredit.propTypes = propTypes;
ModalCredit.defaultProps = defaultProps;

export default ModalCredit;
