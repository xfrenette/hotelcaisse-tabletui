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
	DenominationsInput,
	BottomBarBackButton,
} from '../../elements';
import { Label } from '../../elements/form';
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
	onOpen: PropTypes.func,
	validate: PropTypes.func,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onCancel: null,
	onOpen: null,
	validate: null,
};

@observer
class OpenRegister extends Component {
	/**
	 * Value of the "employee" field
	 *
	 * @type {String}
	 */
	@observable
	employee = '';
	/**
	 * Object associating denominations to their amount value.
	 *
	 * @type {Object}
	 */
	denominationsValue = {};
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
		employee: null,
		cashAmount: null,
	};
	/**
	 * References to Components (see their ref attribute)
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
	}

	/**
	 * When unmounting, clear the cache of nodes
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
	 * Called when the "Open register" button is pressed. First validates the field. If valid, calls
	 * onOpen in the props.
	 */
	onOpenRegister() {
		if (!this.validate(['employee', 'cashAmount'])) {
			return;
		}

		if (this.props.onOpen) {
			this.props.onOpen(this.employee, this.getTotalAmount());
		}
	}

	/**
	 * Called when the value of the "employee name" field changes.
	 *
	 * @param {String} value
	 */
	onEmployeeChange(value) {
		this.employee = value;
	}

	/**
	 * When we blur from the employee field, we validate its value
	 */
	onEmployeeBlur() {
		this.validate(['employee']);
	}

	/**
	 * Focus the cashAmount field
	 */
	focusCashAmount() {
		this.nodeRefs.cashAmount.focus();
	}

	/**
	 * Returns an object to be passed to DenominationsInput containing all the denominations and their
	 * quantity.
	 *
	 * @return {Object}
	 */
	@computed
	get denominationsInputValues() {
		return Object.entries(this.denominationsQuantity).map(
			([label, value]) => ({ label, value })
		);
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

		if (fields.indexOf('employee') !== -1) {
			values.employee = this.employee;
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
				this.inputErrors[field] = this.t(`openRegister.inputErrors.${field}`);
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
					title={this.t('openRegister.title')}
					onPressHome={() => { this.onCancel(); }}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<View style={formStyles.field}>
								<Label>{this.t('openRegister.fields.employee')}</Label>
								<TextInput
									value={this.employee}
									onChangeText={(value) => { this.onEmployeeChange(value); }}
									autoCapitalize="words"
									error={this.inputErrors.employee}
									onBlur={() => { this.onEmployeeBlur(); }}
									onSubmitEditing={() => { this.focusCashAmount(); }}
									returnKeyType="next"
								/>
							</View>
							<View>
								<Label>{this.t('openRegister.fields.cashAmount')}</Label>
								<DenominationsInput
									ref={(node) => { this.nodeRefs.cashAmount = node; }}
									values={values}
									localizer={this.props.localizer}
									onChangeValue={(field, value) => this.onChangeValue(field, value)}
									total={total}
									totalLabel={this.t('openRegister.fields.total')}
									error={this.inputErrors.cashAmount}
									returnKeyType="done"
									cols={4}
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
						title={this.t('openRegister.actions.open')}
						layout={buttonLayouts.primary}
						onPress={() => { this.onOpenRegister(); }}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

OpenRegister.propTypes = propTypes;
OpenRegister.defaultProps = defaultProps;

export default OpenRegister;
