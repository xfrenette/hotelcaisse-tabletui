import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Credit from 'hotelcaisse-app/dist/business/Credit';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../../styles/variables';
import typographyStyles from '../../../styles/typography';
import {
	Button,
	Text,
	Message,
} from '../../elements';
import CreditRow from './CreditRow';

const propTypes = {
	credits: PropTypes.arrayOf(PropTypes.instanceOf(Credit)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	validate: PropTypes.func,
	onCreditAdd: PropTypes.func,
	onNoteChange: PropTypes.func,
	onAmountChange: PropTypes.func,
	onCreditRemove: PropTypes.func,
};

const defaultProps = {
	validate: null,
	onCreditAdd: null,
	onNoteChange: null,
	onAmountChange: null,
	onCreditRemove: null,
};

class Credits extends Component {
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
	 * Called when the user presses the delete button of a credit
	 */
	onCreditRemove(credit) {
		if (this.props.onCreditRemove) {
			this.props.onCreditRemove(credit);
		}
	}

	/**
	 * Called when we press the "add credit" button
	 */
	onCreditAdd() {
		if (this.props.onCreditAdd) {
			this.props.onCreditAdd();
		}
	}

	/**
	 * When the amount of a Credit changes. Must be valid.
	 *
	 * @param {Credit} credit
	 * @param {Decimal} amount
	 */
	onAmountChange(credit, amount) {
		if (this.props.onAmountChange) {
			this.props.onAmountChange(credit, amount);
		}
	}

	/**
	 * When the note of a Credit changes. Must be valid.
	 *
	 * @param {Credit} credit
	 * @param {String} note
	 */
	onNoteChange(credit, note) {
		if (this.props.onNoteChange) {
			this.props.onNoteChange(credit, note);
		}
	}

	/**
	 * Renders a single credit row
	 *
	 * @param {Credit} credit
	 * @param {Boolean} isFirst
	 * @return {Node}
	 */
	renderCredit(credit, isFirst) {
		return (
			<CreditRow
				key={credit.uuid}
				credit={credit}
				localizer={this.props.localizer}
				isFirst={isFirst}
				onRemove={() => { this.onCreditRemove(credit); }}
				validate={this.props.validate}
				onNoteChange={(val) => { this.onNoteChange(credit, val); }}
				onAmountChange={(val) => { this.onAmountChange(credit, val); }}
			/>
		);
	}

	render() {
		const credits = this.props.credits;
		const hasCredits = !!credits.length;
		let creditsLines = null;

		if (hasCredits) {
			const creditsRows = credits.map(
				(credit, index) => this.renderCredit(credit, index === 0)
			);
			creditsLines = (
				<View>
					{ creditsRows }
					<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
				</View>
			);
		} else {
			creditsLines = (
				<View>
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
	actions: {
		alignItems: 'flex-start',
		marginTop: styleVars.baseBlockMargin,
	},
};

Credits.propTypes = propTypes;
Credits.defaultProps = defaultProps;

export default Credits;
