/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import validate from 'hotelcaisse-app/dist/Validator';
import { Text, NumberInput } from './index';
import styleVars from '../../styles/variables';

const propTypes = {
	values: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.number,
		}),
	).isRequired,
	localizer: PropTypes.instanceOf(Localizer),
	totalLabel: PropTypes.string,
	total: PropTypes.string,
	cols: PropTypes.number,
	error: PropTypes.string,
	returnKeyType: PropTypes.string,
	onChangeValue: PropTypes.func,
	onSubmitEditing: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	totalLabel: null,
	total: null,
	cols: 3,
	error: null,
	returnKeyType: null,
	onChangeValue: null,
	onSubmitEditing: null,
};

/**
 * Validates a value for on number input
 *
 * @param {number} value
 * @return {boolean}
 */
function validateValue(value) {
	const constraints = { value: {
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 0,
		},
	}};
	const res = validate({ value }, constraints);
	return res === undefined;
}

/**
 * Returns a key representing the specified field
 * @param {object}field
 * @return {string}
 */
function getFieldKey(field) {
	return field.label;
}

/**
 * Since it uses NumberInput and that NumberInput's value cannot be controlled with prop
 * updates, the same thing applies for this component: the values (only the NumberInput
 * values) cannot be controller by prop update. This component comes with automatic validation
 * of values before calling `props.onChangeValue()`.
 */
@observer
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
	/**
	 * Errors of the fields
	 * @type {Map}
	 */
	@observable
	errors = new Map();

	componentWillMount() {
		this.updateFieldsNext();
	}

	/**
	 * Simple alias
	 * @param {string} path
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	/**
	 * Traverses the values and save in this.fieldsNext the next field for each.
	 */
	updateFieldsNext() {
		this.props.values.forEach((field, index) => {
			const fieldKey = getFieldKey(field);
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
		return this.fieldsNext[getFieldKey(field)];
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
	 * @param {Number} rawValue
	 */
	fieldValueChanged(field, rawValue) {
		const newValue = rawValue === null ? 0 : rawValue;

		if (!validateValue(newValue)) {
			this.errors.set(getFieldKey(field), this.t('errors.fieldInvalidValueShort'));
		} else {
			this.errors.delete(getFieldKey(field));
			if (this.props.onChangeValue) {
				this.props.onChangeValue(field, newValue);
			}
		}
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
		this.nodeRefs[getFieldKey(field)].focus();
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
			<View style={styles.field} key={getFieldKey(field)}>
				<Text style={styles.fieldLabel}>{ field.label }</Text>
				<View style={styles.numberInputContainer}>
					<NumberInput
						ref={(node) => { this.nodeRefs[getFieldKey(field)] = node; }}
						error={this.errors.get(getFieldKey(field))}
						defaultValue={field.value}
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
			const renderedField = this.renderField(field);
			const rowIndex = Math.floor(index / this.props.cols);

			if (!fieldsInRows[rowIndex]) {
				fieldsInRows[rowIndex] = [];
			}

			fieldsInRows[rowIndex].push(renderedField);
		});

		const fieldRows = fieldsInRows.map((rowFields, index) => {
			const fillers = [];

			for (let i = 0; i < this.props.cols - rowFields.length; i += 1) {
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
