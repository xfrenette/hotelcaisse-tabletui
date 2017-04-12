import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Text, NumberInput } from './index';
import styleVars from '../../styles/variables';

const styles = {
	Field: {
		flex: 1,
		flexDirection: 'row',
	},

	FieldRow: {
		marginBottom: styleVars.verticalRhythm,
		flexDirection: 'row',
	},

	FieldLabel: {
		minWidth: 80,
		textAlign: 'right',
		paddingRight: 10,
	},

	NumberInputContainer: {
		flex: 1,
	},

	Total: {
		marginTop: styleVars.verticalRhythm,
	},

	TotalAmount: {
		fontSize: styleVars.fontSize.super,
		textAlign: 'center',
		lineHeight: styleVars.verticalRhythm * 2,
		fontWeight: 'bold',
	},

	TotalLabel: {
		textAlign: 'center',
	},
};

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
	fieldComponents = {};
	fieldCurrentValues = {};

	fieldValueChanged(field, newValue) {
		if (this.props.onChangeValue) {
			this.props.onChangeValue(field, newValue);
		}
	}

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

	getCachedFieldComponent(field) {
		const fieldKey = field.label;
		return this.fieldComponents[fieldKey];
	}

	cacheFieldComponent(field, component) {
		const fieldKey = field.label;

		this.fieldComponents[fieldKey] = component;
		this.fieldCurrentValues[fieldKey] = field.value;
	}

	renderField(field) {
		return (
			<View style={styles.Field} key={field.label}>
				<Text style={styles.FieldLabel}>{ field.label }</Text>
				<View style={styles.NumberInputContainer}>
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
				label = <Text style={styles.TotalLabel}>{ this.props.totalLabel }</Text>;
			}

			return (
				<View style={styles.Total}>
					{ label }
					<Text style={styles.TotalAmount}>{ this.props.total }</Text>
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
				fillers.push(<View style={styles.Field} key={`filler${i}`} />);
			}

			return (
				<View
					key={`row${index}`}
					style={styles.FieldRow}
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

export default DenominationsInput;
