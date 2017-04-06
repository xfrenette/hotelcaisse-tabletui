import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, computed } from 'mobx';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Decimal from 'decimal.js';
import {
	Button,
	Text,
	TextInput,
	MoneyInput,
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
	onOpen: React.PropTypes.func,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onCancel: null,
	onOpen: null,
};

@observer
class OpenRegister extends Component {
	@observable
	employee = '';
	labelsToAmounts = {};
	@observable
	inputValues = {};

	componentWillMount() {
		const newInputValues = {};

		this.props.moneyDenominations.forEach((denomination) => {
			const displayedValue = this.props.localizer.formatCurrency(denomination);
			this.labelsToAmounts[displayedValue] = new Decimal(denomination);
			newInputValues[displayedValue] = 0;
		});

		// We do it this way so Mobx can detect new keys
		this.inputValues = newInputValues;
	}

	onChangeValue(field, value) {
		this.inputValues[field.label] = value;
	}

	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel(this.t('openRegister.messages.openingCanceled'));
		}
	}

	onOpenRegister() {
		if (this.props.onOpen) {
			this.props.onOpen(this.employee, this.getTotalAmount());
		}
	}

	onEmployeeChange(value) {
		this.employee = value;
	}

	@computed
	get moneyInputValues() {
		return Object.entries(this.inputValues).map(
			([label, value]) => ({ label, value })
		);
	}

	getTotalAmount() {
		// We work with Decimal objects
		return Object.entries(this.labelsToAmounts).reduce(
			(total, [key, amount]) => amount.mul(this.inputValues[key]).add(total),
			new Decimal(0)
		);
	}

	getFormattedTotalAmount() {
		const total = this.getTotalAmount();
		return this.props.localizer.formatCurrency(total.toNumber());
	}

	t(path) {
		return this.props.localizer.t(path);
	}

	render() {
		const values = this.moneyInputValues;
		const total = this.getFormattedTotalAmount();

		return (
			<Screen>
				<TopBar
					title={this.t('openRegister.title')}
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
							<Label>{this.t('openRegister.fields.moneyInput')}</Label>
							<MoneyInput
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
					<Button
						title={this.t('actions.cancel')}
						type="back"
						layout={buttonLayouts.text}
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
