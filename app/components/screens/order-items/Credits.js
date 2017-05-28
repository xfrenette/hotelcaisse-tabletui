import React, { Component } from 'react';
import { View } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import typographyStyles from '../../../styles/typography';
import {
	Button,
	TextInput,
	Text,
	NumberInput,
	SwipeDelete,
	Message,
} from '../../elements';
import { Row, Cell } from '../../elements/table';

const propTypes = {
	credits: PropTypes.arrayOf(PropTypes.instanceOf(Credit)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	creditValidate: PropTypes.func,
	onCreditAdd: PropTypes.func,
	onNoteChange: PropTypes.func,
	onAmountChange: PropTypes.func,
	onCreditRemove: PropTypes.func,
};

const defaultProps = {
	creditValidate: null,
	onCreditAdd: null,
	onNoteChange: null,
	onAmountChange: null,
	onCreditRemove: null,
};

@observer
class Credits extends Component {
	/**
	 * Values of the fields of each credit. Key is the credit uuid and each value is an object of
	 * values for each field.
	 *
	 * @type {Object}
	 */
	creditsFields = {};
	/**
	 * Errors for the 'note' fields
	 *
	 * @type {Map}
	 */
	@observable
	noteErrors = new Map();
	/**
	 * Errors for the 'amount' fields
	 *
	 * @type {Map}
	 */
	@observable
	amountErrors = new Map();
	/**
	 * References to nodes
	 *
	 * @type {Object}
	 */
	nodeRefs = {
		amounts: {},
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

	/**
	 * We do here a custom shouldUpdate method since we may receive a new array of credits, but, in
	 * fact, it contains the same credits.
	 *
	 * @param {Object} newProps
	 * @return {Boolean}
	 */
	shouldComponentUpdate(newProps) {
		const newCredits = newProps.credits;

		if (newCredits.length !== this.props.credits.length) {
			return true;
		}

		let shouldUpdate = false;

		newCredits.forEach((newCredit, index) => {
			if (shouldUpdate) {
				return;
			}

			const oldCredit = this.props.credits[index];
			shouldUpdate = newCredit.uuid !== oldCredit.uuid;
		});

		return shouldUpdate;
	}

	/**
	 * Saves the value of a field(s) of a credit.
	 *
	 * @param {Credit} credit
	 * @param {Object} fields

	 */
	updateCreditFields(credit, fields) {
		const key = credit.uuid;

		if (!this.creditsFields[key]) {
			this.creditsFields[key] = fields;
		} else {
			this.creditsFields[key] = {
				...this.creditsFields[key],
				...fields,
			};
		}
	}

	/**
	 * Returns the saved value of a field of a specific credit.
	 *
	 * @param {Credit} credit
	 * @param {String} field
	 * @return {mixed}
	 */
	getCreditField(credit, field) {
		const key = credit.uuid;

		if (!this.creditsFields[key]) {
			return null;
		}

		return this.creditsFields[key][field];
	}

	/**
	 * Returns the amount field value of a Credit as a Decimal. Returns null if no valid amount is
	 * set.
	 *
	 * @param {Credit} credit
	 * @return {Decimal}
	 */
	getCreditAmountAsDecimal(credit) {
		const amount = this.getCreditField(credit, 'amount');

		if (typeof amount !== 'number') {
			return null;
		}

		return new Decimal(amount);
	}

	/**
	 * Called when the user presses the delete button
	 */
	onCreditRemove(credit) {
		if (this.props.onCreditRemove) {
			this.props.onCreditRemove(credit);
		}
	}

	/**
	 * Called when we press the "add credit" button
	 */
	onCreditAdd() {
		if (this.props.onCreditAdd) {
			this.props.onCreditAdd();
		}
	}

	/**
	 * When the amount field is blurred, we validate its value. If invalid, we set the error
	 * message, else we call onAmountChange.
	 *
	 * @param {Credit} credit
	 */
	onAmountBlur(credit) {
		const value = this.getCreditAmountAsDecimal(credit);
		let res;

		if (this.props.creditValidate) {
			res = this.props.creditValidate({ amount: value });
		}

		if (res) {
			this.amountErrors.set(credit.uuid, this.t('order.credits.errors.amount'));
		} else {
			this.amountErrors.delete(credit.uuid);
			this.onAmountChange(credit, value);
		}
	}

	/**
	 * When the note field is blurred, we validate its value. If invalid, we set the error
	 * message, else we call onNoteChange.
	 *
	 * @param {Credit} credit
	 */
	onNoteBlur(credit) {
		const value = this.getCreditField(credit, 'note');
		let res;

		if (this.props.creditValidate) {
			res = this.props.creditValidate({ note: value });
		}

		if (res) {
			this.noteErrors.set(credit.uuid, this.t('order.credits.errors.note'));
		} else {
			this.noteErrors.delete(credit.uuid);
			this.onNoteChange(credit, value);
		}
	}

	/**
	 * When the amount changes. Must be valid.
	 *
	 * @param {Credit} credit
	 * @param {Decimal} amount
	 */
	onAmountChange(credit, amount) {
		if (this.props.onAmountChange) {
			this.props.onAmountChange(credit, amount);
		}
	}

	/**
	 * When the note changes. Must be valid.
	 *
	 * @param {Credit} credit
	 * @param {String} note
	 */
	onNoteChange(credit, note) {
		if (this.props.onNoteChange) {
			this.props.onNoteChange(credit, note);
		}
	}

	/**
	 * When we "submit" the note field, we focus the amount field
	 *
	 * @param {Credit} credit
	 */
	onNoteSubmit(credit) {
		const key = credit.uuid;
		const amountField = this.nodeRefs.amounts[key];
		amountField.focus();
	}

	/**
	 * Renders a single credit row
	 *
	 * @param {Credit} credit
	 * @param {Boolean} isFirst
	 * @return {Component}
	 */
	renderCredit(credit, isFirst) {
		const amountError = this.amountErrors.get(credit.uuid);
		const noteError = this.noteErrors.get(credit.uuid);

		return (
			<SwipeDelete
				key={credit.uuid}
				label={this.t('actions.delete')}
				onDelete={() => { this.onCreditRemove(credit); }}
			>
				<Row first={isFirst} style={styles.row}>
					<Cell first style={cellStyles.note}>
						<TextInput
							label={this.t('order.credits.fields.note')}
							onChangeText={(note) => { this.updateCreditFields(credit, { note }); }}
							onBlur={() => { this.onNoteBlur(credit); }}
							error={noteError}
							returnKeyType="next"
							autoFocus
							onSubmitEditing={() => { this.onNoteSubmit(credit); }}
						/>
					</Cell>
					<Cell last style={cellStyles.amount}>
						<NumberInput
							ref={(node) => { this.nodeRefs.amounts[credit.uuid] = node; }}
							label={this.t('order.credits.fields.amount')}
							value={0}
							type="money"
							localizer={this.props.localizer}
							selectTextOnFocus
							onChangeValue={(amount) => { this.updateCreditFields(credit, { amount }); }}
							onBlur={() => { this.onAmountBlur(credit); }}
							error={amountError}
						/>
					</Cell>
				</Row>
			</SwipeDelete>
		);
	}

	render() {
		const credits = this.props.credits;
		const hasCredits = !!credits.length;
		let creditsLines = null;

		if (hasCredits) {
			const creditsRows = credits.map(
				(credit, index) => this.renderCredit(credit, index === 0)
			);
			creditsLines = (
				<View>
					{ creditsRows }
					<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
				</View>
			);
		} else {
			creditsLines = (
				<View style={styles.emptyCredits}>
					<Text style={typographyStyles.empty}>{ this.t('order.credits.empty') }</Text>
				</View>
			);
		}

		return (
			<View>
				{ creditsLines }
				<View style={styles.actions}>
					<Button
						title={this.t('order.actions.addCredit')}
						onPress={() => { this.onCreditAdd(); }}
					/>
				</View>
			</View>
		);
	}
}

const styles = {
	row: {
		alignItems: 'flex-start',
	},
	emptyCredits: {
	},
	actions: {
		alignItems: 'flex-start',
		marginTop: styleVars.baseBlockMargin,
	},
};

const cellStyles = {
	note: {
		flex: 1,
	},
	amount: {
		width: 200,
	},
};

Credits.propTypes = propTypes;
Credits.defaultProps = defaultProps;

export default Credits;
