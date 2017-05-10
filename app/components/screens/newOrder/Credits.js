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
	creditsFields = {};
	@observable
	noteErrors = new Map();
	@observable
	amountErrors = new Map();

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

	getCreditField(credit, field) {
		const key = credit.uuid;

		if (!this.creditsFields[key]) {
			return null;
		}

		return this.creditsFields[key][field];
	}

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

	onCreditAdd() {
		if (this.props.onCreditAdd) {
			this.props.onCreditAdd();
		}
	}

	onAmountBlur(credit) {
		if (!this.props.creditValidate) {
			return;
		}

		const value = this.getCreditAmountAsDecimal(credit);
		const res = this.props.creditValidate({ amount: value });

		if (res) {
			this.amountErrors.set(credit.uuid, this.t('order.credits.errors.amount'));
		} else {
			this.amountErrors.delete(credit.uuid);
		}
	}

	onNoteBlur(credit) {
		if (!this.props.creditValidate) {
			return;
		}

		const value = this.getCreditField(credit, 'note');
		const res = this.props.creditValidate({ note: value });

		if (res) {
			this.noteErrors.set(credit.uuid, this.t('order.credits.errors.note'));
		} else {
			this.noteErrors.delete(credit.uuid);
		}
	}

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
						/>
					</Cell>
					<Cell last style={cellStyles.amount}>
						<NumberInput
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
			creditsLines = credits.map(
				(credit, index) => this.renderCredit(credit, index === 0)
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
}

Credits.propTypes = propTypes;
Credits.defaultProps = defaultProps;

export default Credits;
