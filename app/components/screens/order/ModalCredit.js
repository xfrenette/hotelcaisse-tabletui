import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import { Modal, NumberInput, TextInput } from '../../elements';
import { Field, Group, Label } from '../../elements/form';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	credit: PropTypes.instanceOf(Credit),
	onSave: PropTypes.func,
	validate: PropTypes.func,
};

const defaultProps = {
	credit: null,
	onSave: null,
	validate: null,
};

@observer
class ModalCredit extends Component {
	modalRef = null;
	@observable
	note = '';
	amount = 0;
	@observable
	errors = {
		note: null,
		amount: null,
	};
	nodeRefs = {
		note: null,
		amount: null,
	};

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	get isNew() {
		return this.props.credit === null;
	}

	get amountAsDecimal() {
		return this.amount === null ? null : new Decimal(this.amount);
	}

	componentWillReceiveProps(props) {
		this.resetInputs(props);
	}

	onSave() {
		const values = {
			note: this.note,
			amount: this.amountAsDecimal,
		};

		if (this.validate(values)) {
			if (this.props.onSave) {
				this.props.onSave(this.props.credit, values.note, values.amount);
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

	resetInputs(newProps) {
		this.errors.note = null;
		this.errors.amount = null;

		if (newProps.credit) {
			this.note = newProps.credit.note;
			this.amount = newProps.credit.amount.toNumber();
		} else {
			this.note = '';
			this.amount = 0;
		}
	}

	show() {
		this.modalRef.show();
	}

	validate(fields) {
		if (!this.props.validate) {
			return true;
		}

		const res = this.props.validate(fields);
		return res === undefined;
	}

	onShow() {
		this.nodeRefs.note.focus();
	}

	onNoteBlur() {
		const valid = this.validate({ note: this.note });
		if (!valid) {
			this.errors.note = this.t('order.credit.modal.errors.note');
		} else {
			this.errors.note = null;
		}
	}

	onAmountBlur() {
		const valid = this.validate({ amount: this.amountAsDecimal });
		if (!valid) {
			this.errors.amount = this.t('order.credit.modal.errors.amount');
		} else {
			this.errors.amount = null;
		}
	}

	render() {
		const actions = {
			'cancel': this.t('actions.cancel'),
			'save': this.t('actions.save'),
		};

		return (
			<Modal
				ref={(node) => { this.modalRef = node; }}
				onShow={() => { this.onShow(); }}
				onActionPress={(a) => { this.onActionPress(a); }}
				actions={actions}
				title={this.t(`order.credit.modal.${this.isNew ? 'new' : 'edit'}.title`)}
			>
				<Group>
					<Field>
						<Label>{this.t('order.credit.modal.fields.note')}</Label>
						<TextInput
							ref={(n) => { this.nodeRefs.note = n; }}
							value={this.note}
							onChangeText={(t) => { this.note = t; }}
							returnKeyType="next"
							onSubmitEditing={() => { this.nodeRefs.amount.focus(); }}
							error={this.errors.note}
							onBlur={() => { this.onNoteBlur(); }}
							autoCapitalize="sentences"
							selectTextOnFocus
						/>
					</Field>
					<Field>
						<Label>{this.t('order.credit.modal.fields.amount')}</Label>
						<NumberInput
							ref={(n) => { this.nodeRefs.amount = n; }}
							defaultValue={this.amount}
							onChangeValue={(v) => { this.amount = v; }}
							type="money"
							localizer={this.props.localizer}
							returnKeyType="done"
							error={this.errors.amount}
							onBlur={() => { this.onAmountBlur(); }}
							onSubmitEditing={() => { this.onActionPress('save'); }}
							selectTextOnFocus
						/>
					</Field>
				</Group>
			</Modal>
		);
	}
}

const viewStyles = {};

ModalCredit.propTypes = propTypes;
ModalCredit.defaultProps = defaultProps;

export default ModalCredit;
