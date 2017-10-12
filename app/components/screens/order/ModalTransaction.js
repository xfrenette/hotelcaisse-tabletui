import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import { Dropdown, Modal, NumberInput } from '../../elements';
import { Field, Group, Label } from '../../elements/form';

const EMPTY_TRANSACTION_MODE = '__empty__';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)).isRequired,
	transactionMode: PropTypes.instanceOf(TransactionMode),
	amount: PropTypes.number.isRequired,
	isNew: PropTypes.bool,
	onSave: PropTypes.func,
	validate: PropTypes.func,
};

const defaultProps = {
	isNew: true,
	onSave: null,
	validate: null,
};

@observer
class ModalTransaction extends Component {
	modalRef = null;
	isRefund = false;
	@observable
	mode = null;
	amount = 0;
	@observable
	errors = {
		amount: null,
	};
	nodeRefs = {
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

	get amountAsDecimal() {
		return this.amount === null
			? null
			: new Decimal(this.amount).mul(this.isRefund ? -1 : 1);
	}

	componentWillMount() {
		this.resetInputs(this.props);
	}

	componentWillReceiveProps(props) {
		this.resetInputs(props);
	}

	onSave() {
		const values = {
			transactionMode: this.mode,
			amount: this.amountAsDecimal,
		};

		if (this.validate(values)) {
			if (this.props.onSave) {
				this.props.onSave(this.mode, values.amount);
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
		this.errors.amount = null;

		this.mode = newProps.transactionMode;
		this.amount = Math.abs(newProps.amount);
		this.isRefund = newProps.amount < 0;
	}

	show() {
		this.resetInputs(this.props);
		this.modalRef.show();
	}

	validate(fields) {
		if (!this.props.validate) {
			return true;
		}

		const res = this.props.validate(fields);
		return res === undefined;
	}

	onAmountBlur() {
		const valid = this.validate({ amount: this.amountAsDecimal });

		if (!valid) {
			this.errors.amount = this.t('order.transaction.modal.errors.amount');
		} else {
			this.errors.amount = null;
		}
	}

	render() {
		const tPath = `order.transaction.${this.isRefund ? 'refund' : 'payment'}`;
		const actions = {
			'cancel': this.t('actions.cancel'),
			'save': this.t('actions.save'),
		};
		const Option = Dropdown.Option;
		const modeOptions = this.props.transactionModes.map(
			tm => <Option key={tm.id} value={tm} label={tm.name} />
		);
		modeOptions.unshift(
			<Option key="__empty__" value={EMPTY_TRANSACTION_MODE} label={this.t('order.transaction.modal.emptyTransactionMode')} />
		);

		return (
			<Modal
				ref={(node) => { this.modalRef = node; }}
				onActionPress={(a) => { this.onActionPress(a); }}
				actions={actions}
				title={this.t(`${tPath}.modal.${this.props.isNew ? 'new' : 'edit'}.title`)}
			>
				<Group>
					<Field>
						<Label>{this.t(`${tPath}.modal.fields.mode`)}</Label>
						<Dropdown
							selectedValue={this.mode}
							onValueChange={(val) => { this.mode = val; }}
						>
							{ modeOptions }
						</Dropdown>
					</Field>
					<Field>
						<Label>{this.t(`${tPath}.modal.fields.amount`)}</Label>
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

ModalTransaction.propTypes = propTypes;
ModalTransaction.defaultProps = defaultProps;

export default ModalTransaction;
