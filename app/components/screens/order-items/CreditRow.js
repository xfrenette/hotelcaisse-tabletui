import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	TextInput,
	NumberInput,
	SwipeDelete,
	Text,
} from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	credit: PropTypes.instanceOf(Credit).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	isFirst: PropTypes.bool,
	editable: PropTypes.bool,
	autoFocus: PropTypes.bool,
	onRemove: PropTypes.func,
	validate: PropTypes.func,
	onNoteChange: PropTypes.func,
	onAmountChange: PropTypes.func,
};

const defaultProps = {
	isFirst: false,
	editable: true,
	autoFocus: false,
	onRemove: null,
	validate: null,
	onNoteChange: null,
	onAmountChange: null,
};

@observer
class CreditRow extends Component {
	/**
	 * Value of the note fields
	 *
	 * @type {String}
	 */
	@observable
	note = null;
	/**
	 * Value of the amount field
	 *
	 * @type {Number}
	 */
	@observable
	amount = null;
	/**
	 * Error of the 'note' field
	 *
	 * @type {Map}
	 */
	@observable
	noteError = null;
	/**
	 * Error of the 'amount' field
	 *
	 * @type {Map}
	 */
	@observable
	amountError = null;
	/**
	 * References to nodes
	 *
	 * @type {Object}
	 */
	nodeRefs = {};

	/**
	 * Initialize the values and the nodeRefs when mounting
	 */
	componentWillMount() {
		const credit = this.props.credit;

		this.note = credit.note;
		this.amount = credit.amount ? credit.amount.toNumber() : 0;
	}

	/**
	 * When unmounting, clear the nodeRefs
	 */
	componentWillUnmount() {
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
	 * Validates the fields (key is field name, value is field value). Returns true if valid, else
	 * returns false.
	 *
	 * @param {Object} fields
	 * @return {Boolean}
	 */
	validate(fields) {
		if (!this.props.validate) {
			return true;
		}

		const res = this.props.validate(fields);

		return res === undefined;
	}

	/**
	 * Returns the amount field value as a Decimal. Returns null if no valid amount is set.
	 *
	 * @return {Decimal}
	 */
	getAmountAsDecimal() {
		if (typeof this.amount !== 'number') {
			return null;
		}

		return new Decimal(this.amount);
	}

	/**
	 * When the amount field is blurred, we validate its value. If invalid, we set the error
	 * message, else we call onAmountChange.
	 */
	onAmountBlur() {
		const value = this.getAmountAsDecimal();

		if (!this.validate({ amount: value })) {
			this.amountError = this.t('order.credits.errors.amount');
		} else {
			this.amountError = null;
			this.onAmountChange(value);
		}
	}

	/**
	 * When the note field is blurred, we validate its value. If invalid, we set the error
	 * message, else we call onNoteChange.
	 */
	onNoteBlur() {
		if (!this.validate({ note: this.note })) {
			this.noteError = this.t('order.credits.errors.note');
		} else {
			this.noteError = null;
			this.onNoteChange(this.note);
		}
	}

	/**
	 * When the amount changes. Must be valid.
	 *
	 * @param {Decimal} amount
	 */
	onAmountChange(amount) {
		if (this.props.onAmountChange) {
			this.props.onAmountChange(amount);
		}
	}

	/**
	 * When the note changes. Must be valid.
	 *
	 * @param {String} note
	 */
	onNoteChange(note) {
		if (this.props.onNoteChange) {
			this.props.onNoteChange(note);
		}
	}

	/**
	 * When we "submit" the note field, we focus the amount field
	 */
	onNoteSubmit() {
		const amountField = this.nodeRefs.amount;
		amountField.focus();
	}

	/**
	 * Renders the Credit row as an editable Credit
	 *
	 * @return {Node}
	 */
	renderEditable() {
		const amountError = this.amountError;
		const noteError = this.noteError;

		return (
			<SwipeDelete
				label={this.t('actions.delete')}
				onDelete={this.props.onRemove}
			>
				<Row first={this.props.isFirst} style={styles.row}>
					<Cell first style={cellStyles.note}>
						<TextInput
							placeholder={this.t('order.credits.fields.note')}
							onChangeText={(note) => { this.note = note; }}
							onBlur={() => { this.onNoteBlur(); }}
							error={noteError}
							value={this.note}
							autoFocus={this.props.autoFocus}
							returnKeyType="next"
							autoCapitalize="sentences"
							onSubmitEditing={() => { this.onNoteSubmit(); }}
						/>
					</Cell>
					<Cell last style={cellStyles.amount}>
						<NumberInput
							ref={(node) => { this.nodeRefs.amount = node; }}
							value={this.amount}
							type="money"
							localizer={this.props.localizer}
							selectTextOnFocus
							onChangeValue={(amount) => { this.amount = amount; }}
							onBlur={() => { this.onAmountBlur(); }}
							error={amountError}
							constraints={{ numericality: { greaterThanOrEqualTo: 0 } }}
						/>
					</Cell>
				</Row>
			</SwipeDelete>
		);
	}

	/**
	 * Renders the Credit row as an non-editable Credit
	 *
	 * @return {Node}
	 */
	renderNotEditable() {
		return (
			<Row first={this.props.isFirst} style={styles.row}>
				<Cell first style={cellStyles.note}>
					<Text>{ this.note }</Text>
				</Cell>
				<Cell last style={cellStyles.amountFixed}>
					<Text>{ this.props.localizer.formatCurrency(this.amount) }</Text>
				</Cell>
			</Row>
		);
	}

	render() {
		if (this.props.editable) {
			return this.renderEditable();
		}

		return this.renderNotEditable();
	}
}

const styles = {
	row: {
		alignItems: 'flex-start',
	},
};

const cellStyles = {
	note: {
		flex: 1,
	},
	amount: {
		width: 120,
	},
	amountFixed: {
		width: 120,
		alignItems: 'flex-end',
	}
};

CreditRow.propTypes = propTypes;
CreditRow.defaultProps = defaultProps;

export default CreditRow;
