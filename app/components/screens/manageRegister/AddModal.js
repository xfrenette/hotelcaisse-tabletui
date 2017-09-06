import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	NumberInput,
	TextInput,
	Modal,
	Dropdown,
} from '../../elements';
import { Label } from '../../elements/form';
import styleVars from '../../../styles/variables';
import formStyles from '../../../styles/form';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	validate: PropTypes.func,
	onAdd: PropTypes.func,
};

const defaultProps = {
	validate: null,
	onAdd: null,
};

@observer
class AddModal extends Component {
	/**
	 * Internal reference to Nodes
	 *
	 * @type {Node}
	 */
	nodeRefs = {};
	/**
	 * Values of the fields
	 *
	 * @type {Object}
	 */
	@observable
	values = {
		note: null,
		amount: null,
		type: 'out',
	};
	/**
	 * Error messages for the fields. If a message is null, there is no error
	 *
	 * @type {Object}
	 */
	@observable
	errors = {
		note: null,
		amount: null,
	};

	/**
	 * When mounting, clear the references to nodes
	 */
	componentWillMount() {
		this.nodeRefs = {};
	}

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
	 * Returns the amount value in as a decimal. If no amount is set, returns null.
	 *
	 * @return {Decimal}
	 */
	getAmountAsDecimal() {
		if (typeof this.values.amount === 'number') {
			return new Decimal(this.values.amount);
		}

		return null;
	}

	/**
	 * Resets all the fields used in the modal
	 */
	reset() {
		this.values.note = null;
		this.values.amount = null;
		this.errors.note = null;
		this.errors.amount = null;
	}

	/**
	 * Shows the modal
	 */
	show() {
		this.nodeRefs.modal.show();
	}

	/**
	 * Hides the modal
	 */
	hide() {
		this.nodeRefs.modal.hide();
	}

	/**
	 * Receives a list of fields to validate (see this.errors for valid field names) and, if a
	 * validate function is defined in the props, will call it to validate only those fields. Will
	 * then call setErrors() with the resulting validation. This function returns a boolean that is
	 * true if no validation errors were found (or if no validate function in the props).
	 *
	 * @param {Array} fields
	 * @return {Boolean}
	 */
	validate(fields) {
		if (!this.props.validate) {
			return true;
		}

		const values = {};

		if (fields.indexOf('note') !== -1) {
			values.note = this.values.note;
		}

		if (fields.indexOf('amount') !== -1) {
			values.amount = this.getAmountAsDecimal();
		}

		const result = this.props.validate(values);
		this.setErrors(fields, result);

		return result === undefined;
	}

	/**
	 * From a list of fields that were validated and the validation result, updates values in
	 * this.errors with null (no error) or a localized error message.
	 *
	 * @param {Array} fields
	 * @param {Object} errors
	 */
	setErrors(fields, errors = {}) {
		fields.forEach((field) => {
			if (errors[field]) {
				this.errors[field] = this.t(`manageRegister.modal.errors.${field}`);
			} else {
				this.errors[field] = null;
			}
		});
	}

	onActionPress(key) {
		switch (key) {
			case 'save':
				this.onSave();
				break;
			default:
				this.hide();
				break;
		}
	}

	/**
	 * Called when the user clicks the "Save" button in the modal. Will validate the data and, if
	 * valid, will call onAdd. Will then hide the modal and show a Toaster.
	 */
	onSave() {
		if (!this.validate(['note', 'amount'])) {
			return;
		}

		const type = this.values.type;
		const note = this.values.note;
		const amount = this.getAmountAsDecimal();

		if (this.props.onAdd) {
			this.props.onAdd(type, note, amount);
		}

		this.hide();
	}

	/**
	 * Listener added on blur on some fields to validate their value when blurring.
	 *
	 * @param {String} field
	 */
	onFieldBlur(field) {
		this.validate([field]);
	}

	/**
	 * Puts the focus in the specified field
	 *
	 * @type {String} field   Key of the field in the nodeRefs object
	 */
	focusField(field) {
		this.nodeRefs[field].focus();
	}

	/**
	 * Returns the movement type dropdown
	 *
	 * @return {Node}
	 */
	renderTypesDropdown() {
		const Option = Dropdown.Option;

		return (
			<Dropdown
				selectedValue={this.values.type}
				onValueChange={(val) => { this.values.type = val; }}
			>
				<Option value="out" label={this.t('manageRegister.modal.types.out')} />
				<Option value="in" label={this.t('manageRegister.modal.types.in')} />
			</Dropdown>
		);
	}

	render() {
		const actions = {
			cancel: this.t('actions.cancel'),
			save: this.t('actions.save'),
		};

		return (
			<Modal
				ref={(modal) => { this.nodeRefs.modal = modal; }}
				title={this.t('manageRegister.modal.title')}
				actions={actions}
				onActionPress={(key) => { this.onActionPress(key); }}
				onShow={() => { this.focusField('amountInput'); }}
			>
				<View style={styles.fieldsRow}>
					<View style={styles.note}>
						<Label>{ this.t('manageRegister.modal.fields.type') }</Label>
						{ this.renderTypesDropdown() }
					</View>
					<View style={styles.amount}>
						<Label>{ this.t('manageRegister.modal.fields.amount') }</Label>
						<NumberInput
							ref={(node) => { this.nodeRefs.amountInput = node; }}
							defaultValue={0}
							type="money"
							localizer={this.props.localizer}
							onChangeValue={(value) => { this.values.amount = value; }}
							error={this.errors.amount}
							onBlur={() => { this.onFieldBlur('amount'); }}
							selectTextOnFocus
							onSubmitEditing={() => { this.focusField('noteInput'); }}
							returnKeyType="next"
						/>
					</View>
				</View>
				<View style={formStyles.field}>
					<Label>{ this.t('manageRegister.modal.fields.note') }</Label>
					<TextInput
						ref={(node) => { this.nodeRefs.noteInput = node; }}
						value={this.values.note}
						onChangeText={(text) => { this.values.note = text; }}
						autoCapitalize="sentences"
						error={this.errors.note}
						onBlur={() => { this.onFieldBlur('note'); }}
						onSubmitEditing={() => { this.onSave(); }}
						returnKeyType="done"
					/>
				</View>
			</Modal>
		);
	}
}

const styles = {
	fieldsRow: {
		flexDirection: 'row',
	},
	note: {
		flex: 1,
	},
	amount: {
		width: 120,
		marginLeft: styleVars.horizontalRhythm,
	},
};

AddModal.propTypes = propTypes;
AddModal.defaultProps = defaultProps;

export default AddModal;
