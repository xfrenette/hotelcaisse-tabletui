import React, { Component } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { observable } from 'mobx';
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
	validation: React.PropTypes.func,
	cashMovements: React.PropTypes.arrayOf(React.PropTypes.instanceOf(CashMovement)),
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onFinish: null,
	onAddCashMovement: null,
	onDeleteCashMovement: null,
	validation: null,
	cashMovements: [],
};

@inject('ui')
@observer
class ManageRegister extends Component {
	/**
	 * Variable holding current state of modal.
	 * - type (string): 'in' or 'out'
	 * - description (string): description currently being entered
	 * - amount (number): amount currently being entered
	 * - errorMessage (string): error message to display in the modal
	 *
	 * @type {Object}
	 */
	@observable
	modalData = {
		type: null,
		description: null,
		amount: null,
		errorMessage: null,
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
		this.modalData.description = null;
		this.modalData.amount = null;
		this.modalData.errorMessage = null;
		this.addModal.open();
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
		const type = this.modalData.type;
		const description = this.modalData.description;
		const amount = this.modalData.amount;
		const validationResult = this.validateEntries(description, amount);

		if (!validationResult.valid) {
			this.modalData.errorMessage = validationResult.message;
			return;
		}

		if (this.props.onAddCashMovement) {
			this.props.onAddCashMovement(type, description, amount);
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
	 * Validates the fields' value. If a validation prop is supplied, will return its result, else
	 * returns a valid result.
	 *
	 * @param {String} description
	 * @param {Number} amount
	 * @return {object}
	 */
	validateEntries(description, amount) {
		if (this.props.validation) {
			return this.props.validation(description, amount);
		}

		return {
			valid: true,
		};
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
					/>
				</Field>
				<Label>{ this.t('manageRegister.fields.description') }</Label>
				<Field>
					<TextInput
						value={this.modalData.description}
						onChangeText={(text) => { this.modalData.description = text; }}
						autoCapitalize="sentences"
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
