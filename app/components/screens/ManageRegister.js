import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	Button,
	Title,
	Text,
	NumberInput,
	TextInput,
	Modal,
	Message,
} from '../elements';
import { Field, Label } from '../elements/form';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../layout';
import buttonLayouts from '../../styles/Buttons';
import styleVars from '../../styles/variables';

const styles = {
	InOutColumns: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	InOutColumn: {
		marginHorizontal: styleVars.horizontalRhythm,
		flex: 1,
	},

	InOutColumnFirst: {
		marginLeft: 0,
	},

	InOutColumnLast: {
		marginRight: 0,
	},

	Actions: {
		flexDirection: 'row',
	},
};

const propTypes = {
	onFinish: React.PropTypes.func,
	onAddCashMovement: React.PropTypes.func,
	validation: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onFinish: null,
	onAddCashMovement: null,
	validation: null,
};

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
	}

	validateEntries(description, amount) {
		if (this.props.validation) {
			return this.props.validation(description, amount);
		}

		return {
			valid: true,
		};
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
					/>
				</Field>
			</Modal>
		);
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('manageRegister.title')}
				/>
				<ScrollView>
					<MainContent>
						<View style={styles.InOutColumns}>
							<View style={[styles.InOutColumn, styles.InOutColumnFirst]}>
								<Title>{ this.t('manageRegister.moneyOut.title') }</Title>
								<View style={styles.Actions}>
									<Button
										title={this.t('manageRegister.actions.addOut')}
										onPress={() => { this.onAddOut(); }}
									/>
								</View>
							</View>

							<View style={[styles.InOutColumn, styles.InOutColumnLast]}>
								<Title>{ this.t('manageRegister.moneyIn.title') }</Title>
								<View style={styles.Actions}>
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

export default ManageRegister;
