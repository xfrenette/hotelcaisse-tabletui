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
	BottomBarBackButton,
	NumberInput,
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
	 * @type {number}
	 */
	cashAmount = 100;
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
	 * When unmounting, clear the cache of nodes
	 */
	componentWillUnmount() {
		this.nodeRefs = {};
	}

	/**
	 * Called when one of the cash amount changes
	 *
	 * @param {Number} value
	 */
	onChangeValue(value) {
		this.cashAmount = value;
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
			this.props.onOpen(this.employee, this.getCashAmountAsDecimal());
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
	 * When we blur from the cash amount field, we validate its value
	 */
	onCashAmountBlur() {
		this.validate(['cashAmount']);
	}

	/**
	 * Focus the cashAmount field
	 */
	focusCashAmount() {
		this.nodeRefs.cashAmount.focus();
	}

	/**
	 * Returns the money amount as a Decimal.
	 *
	 * @return {Decimal}
	 */
	getCashAmountAsDecimal() {
		if (this.cashAmount === null) {
			return null;
		}

		return new Decimal(this.cashAmount);
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
			values.cashAmount = this.getCashAmountAsDecimal();
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
		return (
			<Screen>
				<TopBar
					title={this.t('screens.register.open.title')}
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
								<View style={styles.cashAmountInput}>
									<NumberInput
										ref={(node) => { this.nodeRefs.cashAmount = node; }}
										error={this.inputErrors.cashAmount}
										returnKeyType="done"
										onChangeValue={(value) => this.onChangeValue(value)}
										defaultValue={this.cashAmount}
										type="money"
										localizer={this.props.localizer}
										onBlur={() => { this.onCashAmountBlur(); }}
										selectTextOnFocus
									/>
								</View>
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

const styles = {
	cashAmountInput: {
		width: 200,
	},
};

OpenRegister.propTypes = propTypes;
OpenRegister.defaultProps = defaultProps;

export default OpenRegister;
