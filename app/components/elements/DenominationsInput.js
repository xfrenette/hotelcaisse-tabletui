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
	totalLabel: React.PropTypes.string,
	total: React.PropTypes.string,
	error: React.PropTypes.string,
	returnKeyType: React.PropTypes.string,
	onChangeValue: React.PropTypes.func,
	onSubmitEditing: React.PropTypes.func,
};

const defaultProps = {
	localizer: null,
	totalLabel: null,
	total: null,
	error: null,
	returnKeyType: null,
	onChangeValue: null,
	onSubmitEditing: null,
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
	 * For each field, save a reference to its next field (used to focus fields one after the other).
	 * The last field has a null value.
	 *
	 * @type {Object}
	 */
	fieldsNext = {};
	/**
	 * References to fields component
	 *
	 * @type {Object}
	 */
	nodeRefs = {};

	componentWillMount() {
		this.updateFieldsNext();
	}

	/**
	 * Traverses the values and save in this.fieldsNext the next field for each.
	 */
	updateFieldsNext() {
		this.props.values.forEach((field, index) => {
			const fieldKey = field.label;
			const nextIndex = index === this.props.values.length - 1 ? null : index + 1;
			const nextField = nextIndex ? this.props.values[nextIndex] : null;

			this.fieldsNext[fieldKey] = nextField;
		});
	}

	/**
	 * For a field, returns the next one, or a falsy value if no next
	 *
	 * @param {Object} field
	 * @return {Object}
	 */
	getNextField(field) {
		const fieldKey = field.label;
		return this.fieldsNext[fieldKey];
	}

	/**
	 * Returns a boolean indicating if the field has a next one.
	 *
	 * @param {Object} field
	 * @return {Boolean}
	 */
	hasNextField(field) {
		return !!this.getNextField(field);
	}

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

	/**
	 * Focus the first field
	 */
	focus() {
		const firstField = this.props.values[0];
		this.focusField(firstField);
	}

	/**
	 * Focus a field
	 *
	 * @param {Object} field
	 */
	focusField(field) {
		const key = field.label;
		this.nodeRefs[key].focus();
	}

	/**
	 * Focus the field's next field. If it has no next (it is the last one), calls onSubmitEditing()
	 *
	 * @param {[type]} field
	 * @return {[type]}
	 */
	focusNextField(field) {
		const nextField = this.getNextField(field);

		if (nextField) {
			this.focusField(nextField);
		} else {
			this.onSubmitEditing();
		}
	}

	/**
	 * Callback when the user submits the last field
	 */
	onSubmitEditing() {
		if (this.props.onSubmitEditing) {
			this.props.onSubmitEditing();
		}
	}

	renderField(field) {
		const hasNext = this.hasNextField(field);
		const returnKeyType = hasNext ? 'next' : this.props.returnKeyType;

		return (
			<View style={styles.field} key={field.label}>
				<Text style={styles.fieldLabel}>{ field.label }</Text>
				<View style={styles.numberInputContainer}>
					<NumberInput
						ref={(node) => { this.nodeRefs[field.label] = node; }}
						value={field.value}
						localizer={this.props.localizer}
						onChangeValue={(val) => { this.fieldValueChanged(field, val); }}
						onSubmitEditing={() => { this.focusNextField(field); }}
						returnKeyType={returnKeyType}
						showIncrementors
						selectTextOnFocus
					/>
				</View>
			</View>
		);
	}

	renderTotal() {
		const errorStyle = this.props.error ? styles.totalError : null;

		if (this.props.total) {
			let label = null;

			if (this.props.totalLabel) {
				label = <Text style={[styles.totalLabel, errorStyle]}>{ this.props.totalLabel }</Text>;
			}

			return (
				<View style={styles.total}>
					{ label }
					<Text style={[styles.totalAmount, errorStyle]}>{ this.props.total }</Text>
				</View>
			);
		}

		return null;
	}

	renderError() {
		if (!this.props.error) {
			return null;
		}

		return <Text style={styles.errorMessage}>{ this.props.error }</Text>;
	}

	render() {
		const fieldsInRows = [];
		const total = this.renderTotal();
		const error = this.renderError();

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
				{ error }
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

	totalError: {
		color: styleVars.theme.dangerColor,
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

	errorMessage: {
		color: styleVars.theme.dangerColor,
		fontStyle: 'italic',
		textAlign: 'center',
	},
};

export default DenominationsInput;
