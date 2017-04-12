import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Decimal from 'decimal.js';
import {
	Button,
	TextInput,
	NumberInput,
	DenominationsInput,
} from '../elements';
import { Field, Label } from '../elements/form';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../layout';
import buttonLayouts from '../../styles/Buttons';

const propTypes = {
	moneyDenominations: React.PropTypes.array.isRequired,
	onCancel: React.PropTypes.func,
	onClose: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onCancel: null,
	onClose: null,
};

@observer
class CloseRegister extends Component {
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
	@observable
	POSTAmount = 0;
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
			this.props.onCancel(this.t('closeRegister.messages.closingCanceled'));
		}
	}

	/**
	 * Called when the "Close register" button is pressed.
	 */
	onCloseRegister() {
		if (this.props.onClose) {
			const POSTAmount = new Decimal(this.POSTAmount);
			this.props.onClose(this.getTotalAmount(), this.POSTRef, POSTAmount);
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
	 * Returns the total money amount as represented by the DenominationsInput. Returns it as a Decimal
	 * object.
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

	render() {
		const values = this.denominationsInputValues;
		const total = this.getFormattedTotalAmount();

		return (
			<Screen>
				<TopBar
					title={this.t('closeRegister.title')}
				/>
				<ScrollView>
					<MainContent>
						<Field>
							<Label>{this.t('closeRegister.fields.POSTRef')}</Label>
							<TextInput
								value={this.POSTRef}
								onChangeText={(value) => { this.onPOSTRefChange(value); }}
								preText="#"
								keyboardType="numeric"
							/>
						</Field>
						<Field>
							<Label>{this.t('closeRegister.fields.POSTAmount')}</Label>
							<NumberInput
								value={this.POSTAmount}
								type="money"
								onChangeValue={(value) => { this.onPOSTAmountChange(value); }}
								localizer={this.props.localizer}
							/>
						</Field>
						<Field>
							<Label>{this.t('closeRegister.fields.denominationsInput')}</Label>
							<DenominationsInput
								values={values}
								localizer={this.props.localizer}
								onChangeValue={(field, value) => this.onChangeValue(field, value)}
								total={total}
								totalLabel={this.t('closeRegister.fields.total')}
							/>
						</Field>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<Button
						title={this.t('actions.cancel')}
						type="back"
						layout={buttonLayouts.text}
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

CloseRegister.propTypes = propTypes;
CloseRegister.defaultProps = defaultProps;

export default CloseRegister;
