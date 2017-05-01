import React, { Component } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { observable } from 'mobx';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import {
	Button,
	Title,
	Text,
	NumberInput,
	TextInput,
	Modal,
	Message,
	TrashButton,
} from '../elements';
import { Field, Label } from '../elements/form';
import { Row, Cell } from '../elements/table';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../layout';
import buttonLayouts from '../../styles/buttons';
import styleVars from '../../styles/variables';
import tableStyles from '../../styles/tables';
import typographyStyles from '../../styles/typography';

const propTypes = {
	onFinish: React.PropTypes.func,
	onAddCashMovement: React.PropTypes.func,
	onDeleteCashMovement: React.PropTypes.func,
	validate: React.PropTypes.func,
	cashMovements: React.PropTypes.arrayOf(React.PropTypes.instanceOf(CashMovement)),
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onFinish: null,
	onAddCashMovement: null,
	onDeleteCashMovement: null,
	validate: null,
	cashMovements: [],
};

@inject('ui')
@observer
class ManageRegister extends Component {
	/**
	 * Variable holding current state of modal.
	 * - type (string): 'in' or 'out'
	 * - note (string): note currently being entered
	 * - amount (number): amount currently being entered
	 * - inputErrors (object): error message for each field (null if no error, else an error message)
	 *
	 * @type {Object}
	 */
	@observable
	modalData = {
		type: null,
		note: null,
		amount: null,
		inputErrors: {
			note: null,
			amount: null,
		},
	};
	/**
	 * Reference to the modal component
	 *
	 * @type {Component}
	 */
	addModal = null;

	/**
	 * Called when press the "cancel" button.
	 */
	onFinish() {
		if (this.props.onFinish) {
			this.props.onFinish();
		}
	}

	/**
	 * Called when pressing the "add out" button. Shows the modal.
	 */
	onAddOut() {
		this.modalData.type = 'out';
		this.showModal();
	}

	/**
	 * Called when pressing the "add in" button. Shows the modal.
	 */
	onAddIn() {
		this.modalData.type = 'in';
		this.showModal();
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
	 * Opens the modal
	 */
	showModal() {
		this.resetModal();
		this.addModal.open();
	}

	/**
	 * Resets all the fields used in the modal
	 */
	resetModal() {
		this.modalData.note = null;
		this.modalData.amount = null;
		this.modalData.inputErrors.note = null;
		this.modalData.inputErrors.amount = null;
	}

	/**
	 * Shows the confirmation alert to delete a CashMovement. If the user confirms, calls
	 * onConfirmDelete().
	 *
	 * @param {CashMovement} cashMovement
	 */
	showDeleteConfirm(cashMovement) {
		const deleteCallback = () => {
			this.onConfirmDelete(cashMovement);
		};

		Alert.alert(
			this.t('manageRegister.deletion.title'),
			this.t('manageRegister.deletion.message'),
			[
				{ text: this.t('actions.cancel') },
				{ text: this.t('actions.delete'), onPress: deleteCallback },
			]
		);
	}

	/**
	 * Closes the modal
	 */
	closeModal() {
		this.addModal.close();
	}

	/**
	 * When a button of the modal is pressed. Receives the key of the button as parameter.
	 *
	 * @param {String} key
	 */
	onModalActionPress(key) {
		if (key === 'cancel') {
			this.closeModal();
		}

		if (key === 'save') {
			this.onModalSave();
		}
	}

	/**
	 * Called when the user clicks the "Save" button in the modal. Will validate the data and, if
	 * valid, will call onAddCashMovement. Will then close the modal and show a Toaster.
	 */
	onModalSave() {
		if (!this.validate(['note', 'amount'])) {
			return;
		}

		const type = this.modalData.type;
		const note = this.modalData.note;
		const amount = this.getModalAmountAsDecimal();

		if (this.props.onAddCashMovement) {
			this.props.onAddCashMovement(type, note, amount);
		}

		this.closeModal();

		const toastMessageKey = `manageRegister.add${type === 'in' ? 'In' : 'Out'}.success`;
		this.props.ui.showToast(this.t(toastMessageKey));
	}

	/**
	 * Called when the user presses the trash icon of a CashMovement line.
	 *
	 * @param {CashMovement} cashMovement
	 */
	onPressDeleteCashMovement(cashMovement) {
		this.showDeleteConfirm(cashMovement);
	}
	/**
	 * Called when the user confirms the suppression in the confirm alert.
	 *
	 * @param {CashMovement} cashMovement
	 */
	onConfirmDelete(cashMovement) {
		if (this.props.onDeleteCashMovement) {
			this.props.onDeleteCashMovement(cashMovement);
		}
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
	 * Receives a list of fields to validate (see this.inputErrors for valid field names) and, if a
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
			values.note = this.modalData.note;
		}

		if (fields.indexOf('amount') !== -1) {
			values.amount = this.getModalAmountAsDecimal();
		}

		const result = this.props.validate(values);
		this.setErrors(fields, result);

		return result === undefined;
	}

	/**
	 * From a list of fields that were validated and the validation result, updates values in
	 * this.inputErrors with null (no error) or a localized error message.
	 *
	 * @param {Array} fields
	 * @param {Object} errors
	 */
	setErrors(fields, errors = {}) {
		fields.forEach((field) => {
			if (errors[field]) {
				this.modalData.inputErrors[field] = this.t(`manageRegister.inputErrors.${field}`);
			} else {
				this.modalData.inputErrors[field] = null;
			}
		});
	}

	/**
	 * Returns the amount value in the modal as a decimal. If no amount is set, returns null.
	 *
	 * @return {Decimal}
	 */
	getModalAmountAsDecimal() {
		if (typeof this.modalData.amount === 'number') {
			return new Decimal(this.modalData.amount);
		}

		return null;
	}

	/**
	 * Returns all CashMovement of a certain type ('in' or 'out')
	 *
	 * @param {String} type 'in' or 'out'
	 * @return {Array}
	 */
	getCashMovements(type) {
		return this.props.cashMovements.filter((cashMovement) => {
			if (type === 'in') {
				return cashMovement.amount.isPositive();
			}

			return cashMovement.amount.isNegative();
		});
	}

	/**
	 * Renders the modal to add a cash movement. Title and content are dynamic based on
	 * this.modalData.
	 *
	 * @return {Component}
	 */
	renderAddModal() {
		let message = null;

		const titleTransKey = this.modalData.type === 'in'
			? this.t('manageRegister.addIn.title')
			: this.t('manageRegister.addOut.title');

		const actions = {
			cancel: this.t('actions.cancel'),
			save: this.t('actions.save'),
		};

		if (this.modalData.errorMessage) {
			message = (
				<Message type="error">{ this.modalData.errorMessage }</Message>
			);
		}

		return (
			<Modal
				ref={(modal) => { this.addModal = modal; }}
				title={titleTransKey}
				actions={actions}
				onActionPress={(key) => { this.onModalActionPress(key); }}
			>
				{ message }
				<Label>{ this.t('manageRegister.fields.amount') }</Label>
				<Field>
					<NumberInput
						value={this.modalData.amount}
						type="money" localizer={this.props.localizer}
						onChangeValue={(value) => { this.modalData.amount = value; }}
						error={this.modalData.inputErrors.amount}
						onBlur={() => { this.onFieldBlur('amount'); }}
					/>
				</Field>
				<Label>{ this.t('manageRegister.fields.note') }</Label>
				<Field>
					<TextInput
						value={this.modalData.note}
						onChangeText={(text) => { this.modalData.note = text; }}
						autoCapitalize="sentences"
						error={this.modalData.inputErrors.note}
						onBlur={() => { this.onFieldBlur('note'); }}
					/>
				</Field>
			</Modal>
		);
	}

	/**
	 * Renders the rows of CashMovement
	 *
	 * @param {Array} cashMovements
	 * @return {Component}
	 */
	renderCashMovementRows(cashMovements) {
		const rows = cashMovements.map((cashMovement, i) => {
			const isLast = i === cashMovements.length - 1;
			return this.renderCashMovementRow(cashMovement, isLast);
		});

		return (
			<View>{ rows }</View>
		);
	}

	/**
	 * Renders a single row of CashMovement.
	 *
	 * @param {CashMovement} cashMovement
	 * @param {Boolean} isLast
	 * @return {Component}
	 */
	renderCashMovementRow(cashMovement, isLast) {
		const absAmount = cashMovement.amount.abs().toNumber();
		const formattedAmount = this.props.localizer.formatCurrency(absAmount);

		return (
			<Row key={cashMovement.uuid} last={isLast}>
				<Cell first><Text>{ cashMovement.note }</Text></Cell>
				<Cell style={styles.priceCol}><Text>{ formattedAmount }</Text></Cell>
				<Cell last style={tableStyles.cellDelete}>
					<TrashButton onPress={() => { this.onPressDeleteCashMovement(cashMovement); }} />
				</Cell>
			</Row>
		);
	}

	render() {
		const movementsIn = this.getCashMovements('in');
		const movementsOut = this.getCashMovements('out');

		let movementsInRows = null;
		let movementsOutRows = null;

		if (!movementsIn.length) {
			movementsInRows = (
				<View style={styles.emptyMessage}>
					<Text style={typographyStyles.empty}>{ this.t('manageRegister.moneyIn.empty') }</Text>
				</View>
			);
		} else {
			movementsInRows = (
				<View style={styles.cashMovementsTable}>
					{ this.renderCashMovementRows(movementsIn) }
				</View>
			);
		}

		if (!movementsOut.length) {
			movementsOutRows = (
				<View style={styles.emptyMessage}>
					<Text style={typographyStyles.empty}>{ this.t('manageRegister.moneyOut.empty') }</Text>
				</View>
			);
		} else {
			movementsOutRows = (
				<View style={styles.cashMovementsTable}>
					{ this.renderCashMovementRows(movementsOut) }
				</View>
			);
		}

		return (
			<Screen>
				<TopBar
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
				<ScrollView>
					<MainContent>
						<View style={styles.inOutColumns}>
							<View style={[styles.inOutColumn, styles.inOutColumnFirst]}>
								<Title>{ this.t('manageRegister.moneyOut.title') }</Title>
								{ movementsOutRows }
								<View style={styles.actions}>
									<Button
										title={this.t('manageRegister.actions.addOut')}
										onPress={() => { this.onAddOut(); }}
									/>
								</View>
							</View>

							<View style={[styles.inOutColumn, styles.inOutColumnLast]}>
								<Title>{ this.t('manageRegister.moneyIn.title') }</Title>
								{ movementsInRows }
								<View style={styles.actions}>
									<Button
										title={this.t('manageRegister.actions.addIn')}
										onPress={() => { this.onAddIn(); }}
									/>
								</View>
							</View>
						</View>
					</MainContent>
					{ this.renderAddModal() }
				</ScrollView>
				<BottomBar>
					<View />
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.primary}
						onPress={() => { this.onFinish(); }}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

ManageRegister.propTypes = propTypes;
ManageRegister.defaultProps = defaultProps;

const styles = {
	inOutColumns: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	inOutColumn: {
		marginHorizontal: styleVars.horizontalRhythm,
		flex: 1,
	},

	inOutColumnFirst: {
		marginLeft: 0,
	},

	inOutColumnLast: {
		marginRight: 0,
	},

	actions: {
		flexDirection: 'row',
	},

	priceCol: {
		alignItems: 'flex-end',
		flex: 0,
	},

	cashMovementsTable: {
		marginBottom: styleVars.baseBlockMargin,
	},

	emptyMessage: {
		marginVertical: styleVars.baseBlockMargin,
	},
};

export default ManageRegister;
