import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import NumberInput from './NumberInput';
import Text from './Text';
import styleVars from '../../styles/variables';

const styles = {
	Field: {
		flex: 1,
	},

	FieldRow: {
		marginBottom: styleVars.verticalRhythm,
		flexDirection: 'row',
	},

	FieldLabel: {
		minWidth: 80,
		textAlign: 'right',
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

class MoneyInput extends Component {
	fieldValueChanged(field, newValue) {
		const newValues = this.props.values.map((oldField) => {
			if (oldField.label === field.label) {
				return {
					label: field.label,
					value: newValue,
				};
			}

			return oldField;
		});

		if (this.props.onChangeValues) {
			this.props.onChangeValues(newValues);
		}
	}

	renderField(field) {
		return (
			<View style={styles.Field} key={field.label}>
				<NumberInput
					label={field.label}
					labelStyle={styles.FieldLabel}
					value={field.value}
					localizer={this.props.localizer}
					onChangeValue={(val) => { this.fieldValueChanged(field, val); }}
				/>
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
			const renderedField = this.renderField(field);
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

MoneyInput.propTypes = {
	values: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string,
			value: React.PropTypes.number,
		}),
	).isRequired,
	localizer: React.PropTypes.instanceOf(Localizer).isRequired,
	onChangeValues: React.PropTypes.func,
	totalLabel: React.PropTypes.string,
	total: React.PropTypes.string,
};

MoneyInput.defaultProps = {
	onChangeValues: null,
	totalLabel: null,
	total: null,
};

export default MoneyInput;