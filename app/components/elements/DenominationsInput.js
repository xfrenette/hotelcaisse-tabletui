/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Text, NumberInput } from './index';
import styleVars from '../../styles/variables';

const nbCols = 3;

const propTypes = {
	values: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string,
			value: React.PropTypes.number,
		}),
	).isRequired,
	localizer: React.PropTypes.instanceOf(Localizer),
	onChangeValue: React.PropTypes.func,
	totalLabel: React.PropTypes.string,
	total: React.PropTypes.string,
};

const defaultProps = {
	onChangeValue: null,
	totalLabel: null,
	total: null,
	localizer: null,
};

class DenominationsInput extends Component {
	/**
	 * Cache of the fields component
	 *
	 * @type {Object}
	 */
	fieldComponents = {};
	/**
	 * Cache of the fields value
	 *
	 * @type {Object}
	 */
	fieldCurrentValues = {};

	/**
	 * Called when a number input value changed
	 *
	 * @param {Object} field
	 * @param {Number} newValue
	 */
	fieldValueChanged(field, newValue) {
		if (this.props.onChangeValue) {
			this.props.onChangeValue(field, newValue);
		}
	}

	/**
	 * Returns a boolean indicating if a field component should regenerate based on its old a new
	 * value.
	 *
	 * @param {Object} field
	 * @return {Boolean}
	 */
	shouldRegenerateFieldComponent(field) {
		const fieldKey = field.label;

		// First, if the field is not alreay generated, return true
		if (!this.fieldComponents[fieldKey]) {
			return true;
		}

		// Return false if the value didn't change
		if (typeof this.fieldCurrentValues[fieldKey] === 'number') {
			if (this.fieldCurrentValues[fieldKey] === field.value) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the cached field component
	 *
	 * @param {Object} field
	 * @return {Component}
	 */
	getCachedFieldComponent(field) {
		const fieldKey = field.label;
		return this.fieldComponents[fieldKey];
	}

	/**
	 * Caches the component for a field
	 *
	 * @param {Object} field
	 * @param {Component} component
	 */
	cacheFieldComponent(field, component) {
		const fieldKey = field.label;

		this.fieldComponents[fieldKey] = component;
		this.fieldCurrentValues[fieldKey] = field.value;
	}

	renderField(field) {
		return (
			<View style={styles.field} key={field.label}>
				<Text style={styles.fieldLabel}>{ field.label }</Text>
				<View style={styles.numberInputContainer}>
					<NumberInput
						value={field.value}
						localizer={this.props.localizer}
						onChangeValue={(val) => { this.fieldValueChanged(field, val); }}
						showIncrementors
					/>
				</View>
			</View>
		);
	}

	renderTotal() {
		if (this.props.total) {
			let label = null;

			if (this.props.totalLabel) {
				label = <Text style={styles.totalLabel}>{ this.props.totalLabel }</Text>;
			}

			return (
				<View style={styles.total}>
					{ label }
					<Text style={styles.totalAmount}>{ this.props.total }</Text>
				</View>
			);
		}

		return null;
	}

	render() {
		const fieldsInRows = [];
		const total = this.renderTotal();

		this.props.values.forEach((field, index) => {
			let renderedField;

			if (this.shouldRegenerateFieldComponent(field)) {
				renderedField = this.renderField(field);
				this.cacheFieldComponent(field, renderedField);
			} else {
				renderedField = this.getCachedFieldComponent(field);
			}

			const rowIndex = Math.floor(index / nbCols);

			if (!fieldsInRows[rowIndex]) {
				fieldsInRows[rowIndex] = [];
			}

			fieldsInRows[rowIndex].push(renderedField);
		});

		const fieldRows = fieldsInRows.map((rowFields, index) => {
			const fillers = [];

			for (let i = 0; i < nbCols - rowFields.length; i += 1) {
				fillers.push(<View style={styles.field} key={`filler${i}`} />);
			}

			return (
				<View
					key={`row${index}`}
					style={styles.row}
				>
					{rowFields}
					{fillers}
				</View>
			);
		});

		return (
			<View>
				{ fieldRows }
				{ total }
			</View>
		);
	}
}

DenominationsInput.propTypes = propTypes;
DenominationsInput.defaultProps = defaultProps;

const styles = {
	field: {
		flex: 1,
		flexDirection: 'row',
	},

	row: {
		marginBottom: styleVars.verticalRhythm,
		flexDirection: 'row',
	},

	fieldLabel: {
		minWidth: 80,
		textAlign: 'right',
		paddingRight: 10,
	},

	numberInputContainer: {
		flex: 1,
	},

	total: {
		marginTop: styleVars.verticalRhythm,
	},

	totalAmount: {
		fontSize: styleVars.fontSize.super,
		textAlign: 'center',
		lineHeight: styleVars.verticalRhythm * 2,
		fontWeight: 'bold',
	},

	totalLabel: {
		textAlign: 'center',
	},
};

export default DenominationsInput;
