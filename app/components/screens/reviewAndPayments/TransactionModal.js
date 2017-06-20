import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Decimal from 'decimal.js';
import TransactionMode from 'hotelcaisse-app/dist/business/TransactionMode';
import { View } from 'react-native';
import {
	Modal,
	Dropdown,
	NumberInput,
} from '../../elements';
import { Group, Label } from '../../elements/form';

const propTypes = {
	balance: PropTypes.number,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	transactionModes: PropTypes.arrayOf(PropTypes.instanceOf(TransactionMode)).isRequired,
	onAddTransaction: PropTypes.func,
};

const defaultProps = {
	balance: 0,
	onAddTransaction: null,
};

@observer
class TransactionModal extends Component {
	/**
	 * Internal reference to the modal component
	 *
	 * @type {Node}
	 */
	modal = null;
	/**
	 * Value of the amount field. When the modal opens, it will be automatically set to the value of
	 * the balance prop
	 *
	 * @type {Number}
	 */
	@observable
	amount = 0;
	/**
	 * The transaction mode selected in the dropdown. When the modal opens, it will be set to the
	 * first TransactionMode
	 *
	 * @type {TransactionMode}
	 */
	@observable
	mode = null;

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	/**
	 * Show the modal, after setting the default value for the amount and the TransactionMode.
	 */
	show() {
		this.amount = this.props.balance;
		this.mode = this.props.transactionModes[0];
		this.modal.show();
	}

	/**
	 * When an action button is pressed in the Modal. If it is the save, we call onAddTransaction. In
	 * all cases, we close the modal.
	 *
	 * @param {String} key
	 */
	onActionPress(key) {
		if (key === 'save') {
			if (this.amount) {
				const amount = new Decimal(this.amount);
				this.onAddTransaction(amount, this.mode);
			}
		}

		this.modal.hide();
	}

	/**
	 * When the user wants to add a transaction
	 *
	 * @param {Decimal} amount
	 * @param {TransactionMode} mode
	 */
	onAddTransaction(amount, mode) {
		if (this.props.onAddTransaction) {
			this.props.onAddTransaction(amount, mode);
		}
	}

	render() {
		const actions = {
			cancel: this.t('actions.cancel'),
			save: this.t('actions.save'),
		};

		const Option = Dropdown.Option;
		const modeOptions = this.props.transactionModes.map(
			tm => <Option key={tm.uuid} value={tm} label={tm.name} />
		);

		return (
			<Modal
				ref={(node) => { this.modal = node; }}
				title={this.t('order.payments.modal.title')}
				actions={actions}
				onActionPress={(key) => { this.onActionPress(key); }}
			>
				<Group>
					<View>
						<Label>{ this.t('order.payments.fields.mode') }</Label>
						<Dropdown
							selectedValue={this.mode}
							onValueChange={(val) => { this.mode = val; }}
						>
							{ modeOptions }
						</Dropdown>
					</View>
					<View>
						<Label>{ this.t('order.payments.fields.amount') }</Label>
						<NumberInput
							type="money"
							localizer={this.props.localizer}
							value={this.amount}
							onChangeValue={(val) => { this.amount = val; }}
							selectTextOnFocus
						/>
					</View>
				</Group>
			</Modal>
		);
	}
}

TransactionModal.propTypes = propTypes;
TransactionModal.defaultProps = defaultProps;

export default TransactionModal;