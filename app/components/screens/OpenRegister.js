import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Decimal from 'decimal.js';
import {
	Button,
	TextInput,
	DenominationsInput,
	BottomBarBackButton,
} from '../elements';
import { Field, Label } from '../elements/form';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../layout';
import buttonLayouts from '../../styles/buttons';

const propTypes = {
	moneyDenominations: React.PropTypes.array.isRequired,
	onCancel: React.PropTypes.func,
	onOpen: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onCancel: null,
	onOpen: null,
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
			this.props.onCancel(this.t('openRegister.messages.openingCanceled'));
		}
	}

	/**
	 * Called when the "Open register" button is pressed.
	 */
	onOpenRegister() {
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
					title={this.t('openRegister.title')}
					onPressHome={() => { this.onCancel(); }}
				/>
				<ScrollView>
					<MainContent>
						<Field>
							<Label>{this.t('openRegister.fields.employee')}</Label>
							<TextInput
								value={this.employee}
								onChangeText={(value) => { this.onEmployeeChange(value); }}
								autoCapitalize="words"
							/>
						</Field>
						<Field>
							<Label>{this.t('openRegister.fields.denominationsInput')}</Label>
							<DenominationsInput
								values={values}
								localizer={this.props.localizer}
								onChangeValue={(field, value) => this.onChangeValue(field, value)}
								total={total}
								totalLabel={this.t('openRegister.fields.total')}
							/>
						</Field>
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
