import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Decimal from 'decimal.js';
import {
	Button,
	TextInput,
	NumberInput,
	DenominationsInput,
	BottomBarBackButton,
	Title,
} from '../../elements';
import { Group, Label } from '../../elements/form';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Container,
} from '../../layout';
import buttonLayouts from '../../../styles/buttons';
import formStyles from '../../../styles/form';

const propTypes = {
	moneyDenominations: PropTypes.array.isRequired,
	onCancel: PropTypes.func,
	onClose: PropTypes.func,
	validate: PropTypes.func,
	cashFloat: PropTypes.number,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onCancel: null,
	onClose: null,
	validate: null,
	cashFloat: 0,
};

@observer
class CloseRegisterScreen extends Component {
	/**
	 * Value of the "POSTRef" field
	 *
	 * @type {String}
	 */
	@observable
	POSTRef = '';
	/**
	 * Value of the "POSTAmount" field
	 *
	 * @type {Number}
	 */
	POSTAmount = 0;
	/**
	 * Object associating denominations to their amount value.
	 *
	 * @type {Object}
	 */
	denominationsValue = {};
	/**
	 * Values for the DenominationsInput
	 * @type {array}
	 */
	denominationsInputValues = [];
	/**
	 * Object associating denominations to their quantity value.
	 *
	 * @type {Object}
	 */
	@observable
	denominationsQuantity = {};
	/**
	 * Error message for each of the inputs. Set a value to null if no error, else set it to the
	 * error message. Note: since this is an observable object, all its keys must be defined at
	 * initialisation, we cannot add or remove keys later.
	 *
	 * @type {Object}
	 */
	@observable
	inputErrors = {
		POSTRef: null,
		POSTAmount: null,
		cashAmount: null,
	};
	/**
	 * References to some components
	 *
	 * @type {Object}
	 */
	nodeRefs = {};

	/**
	 * When mounting, build the denominationsValue and denominationsQuantity objects.
	 */
	componentWillMount() {
		const newDenominationsQuantity = {};

		this.props.moneyDenominations.forEach((denomination) => {
			const formattedAmount = this.props.localizer.formatCurrency(denomination);
			this.denominationsValue[formattedAmount] = new Decimal(denomination);
			newDenominationsQuantity[formattedAmount] = 0;
		});

		// We do it this way so Mobx can detect new keys
		this.denominationsQuantity = newDenominationsQuantity;

		this.denominationsInputValues = Object.entries(newDenominationsQuantity).map(
			([label, value]) => ({ label, value })
		);
	}

	/**
	 * When unmounting, delete the node ref cache
	 */
	componentWillUnmount() {
		this.nodeRefs = {};
	}

	/**
	 * Called when one of the denomination in DenominationsInput changed value.
	 *
	 * @param {Object} denomination Denomination object
	 * @param {Number} value
	 */
	onChangeValue(denomination, value) {
		this.denominationsQuantity[denomination.label] = value;
	}

	/**
	 * Called when press the "cancel" button.
	 */
	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	/**
	 * Called when the "Close register" button is pressed. First validates the values. If valid calls
	 * the onClose prop.
	 */
	onCloseRegister() {
		if (!this.validate(['POSTAmount', 'POSTRef', 'cashAmount'])) {
			return;
		}

		if (this.props.onClose) {
			this.props.onClose(this.getTotalAmount(), this.POSTRef, this.getPOSTAmountDecimal());
		}
	}

	/**
	 * Called when the value of the "POSTRef" field changes.
	 *
	 * @param {String} value
	 */
	onPOSTRefChange(value) {
		this.POSTRef = value;
	}

	/**
	 * Called when the value of the "POSTAmount" field changes.
	 *
	 * @param {Number} value
	 */
	onPOSTAmountChange(value) {
		this.POSTAmount = value;
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
	 * Called by some fields when the field is "submitted"; we then focus the next field.
	 *
	 * @param {String} field
	 */
	onFieldSubmit(field) {
		if (field === 'POSTRef') {
			this.nodeRefs.POSTAmount.focus();
		}

		if (field === 'POSTAmount') {
			this.nodeRefs.cashAmount.focus();
		}
	}

	/**
	 * Returns the total money amount as represented by the DenominationsInput. Returns it as a
	 * Decimal object.
	 *
	 * @return {Decimal}
	 */
	getTotalAmount() {
		return Object.entries(this.denominationsValue).reduce(
			(total, [key, amount]) => amount.mul(this.denominationsQuantity[key]).add(total),
			new Decimal(0)
		);
	}

	/**
	 * Returns as a formatted currency string the total money amount as represented by the
	 * DenominationsInput.
	 *
	 * @return {String}
	 */
	getFormattedTotalAmount() {
		const total = this.getTotalAmount();
		return this.props.localizer.formatCurrency(total.toNumber());
	}

	/**
	 * Returns the POSTAmount as a Decimal instance, or null if no POSTAmount is defined.
	 *
	 * @return {Decimal}
	 */
	getPOSTAmountDecimal() {
		if (typeof this.POSTAmount === 'number') {
			return new Decimal(this.POSTAmount);
		}

		return null;
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

		if (fields.indexOf('POSTRef') !== -1) {
			values.POSTRef = this.POSTRef;
		}

		if (fields.indexOf('POSTAmount') !== -1) {
			values.POSTAmount = this.getPOSTAmountDecimal();
		}

		if (fields.indexOf('cashAmount') !== -1) {
			values.cashAmount = this.getTotalAmount();
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
				this.inputErrors[field] = this.t(`closeRegister.inputErrors.${field}`);
			} else {
				this.inputErrors[field] = null;
			}
		});
	}

	render() {
		const values = this.denominationsInputValues;
		const total = this.getFormattedTotalAmount();

		return (
			<Screen>
				<TopBar
					title={this.t('screens.register.close.title')}
					onPressHome={() => { this.onCancel(); }}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<View style={formStyles.field}>
								<Label>
									{ this.t('closeRegister.POSTBatch') }
								</Label>
								<Group>
									<View>
										<TextInput
											value={this.POSTRef}
											onChangeText={(value) => { this.onPOSTRefChange(value); }}
											preText="#"
											label={this.t('closeRegister.fields.POSTRef')}
											keyboardType="numeric"
											error={this.inputErrors.POSTRef}
											onBlur={() => { this.onFieldBlur('POSTRef'); }}
											onSubmitEditing={() => { this.onFieldSubmit('POSTRef'); }}
											returnKeyType="next"
										/>
									</View>
									<View>
										<NumberInput
											ref={(node) => { this.nodeRefs.POSTAmount = node; }}
											defaultValue={0}
											type="money"
											label={this.t('closeRegister.fields.POSTAmount')}
											onChangeValue={(value) => { this.onPOSTAmountChange(value); }}
											localizer={this.props.localizer}
											error={this.inputErrors.POSTAmount}
											onBlur={() => { this.onFieldBlur('POSTAmount'); }}
											onSubmitEditing={() => { this.onFieldSubmit('POSTAmount'); }}
											selectTextOnFocus
											returnKeyType="next"
										/>
									</View>
								</Group>
							</View>
							<View>
								<Label>
									{ this.t('closeRegister.fields.cashAmount') }
								</Label>
								<DenominationsInput
									ref={(node) => { this.nodeRefs.cashAmount = node; }}
									values={values}
									localizer={this.props.localizer}
									cols={4}
									onChangeValue={(field, value) => this.onChangeValue(field, value)}
									total={total}
									totalLabel={this.t('closeRegister.fields.total')}
									error={this.inputErrors.cashAmount}
								/>
							</View>
						</Container>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.cancel')}
						onPress={() => { this.onCancel(); }}
					/>
					<Button
						title={this.t('closeRegister.actions.close')}
						layout={buttonLayouts.primary}
						onPress={() => { this.onCloseRegister(); }}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

CloseRegisterScreen.propTypes = propTypes;
CloseRegisterScreen.defaultProps = defaultProps;

export default CloseRegisterScreen;
