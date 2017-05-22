import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
	Field,
} from '../../elements';
import { Field as FormField, Label, Group } from '../../elements/form';

const propTypes = {
	customerFields: PropTypes.shape({
		fields: PropTypes.array,
		labels: PropTypes.object,
	}).isRequired,
	fieldErrorMessage: PropTypes.string,
};

const defaultProps = {
	fieldErrorMessage: 'error',
};

@observer
class CustomerFields extends Component {
	fieldRefs = {};
	nextField = {};
	@observable
	fieldValues = new Map();
	@observable
	fieldErrors = new Map();

	componentWillMount() {
		this.saveNextFields(this.props.customerFields.fields);
	}

	saveNextFields(fields) {
		fields.forEach((field, index) => {
			const nextField =
				(fields.length === 1 || index === fields.length - 1)
				? null
				: fields[index + 1];

			this.nextField[field.uuid] = nextField || null;
		});
	}

	getNextField(field) {
		return this.nextField[field.uuid];
	}

	getFieldNode(field) {
		return this.fieldRefs[field.uuid];
	}

	focusNextField(field) {
		const nextField = this.getNextField(field);

		if (nextField) {
			this.getFieldNode(nextField).focus();
		}
	}

	onFieldChangeValue(field, rawValue) {
		const value = rawValue === '' ? null : rawValue;
		this.fieldValues.set(field.uuid, value);
	}

	onFieldSubmit(field) {
		this.focusNextField(field);
	}

	onFieldBlur(field) {
		const value = this.fieldValues.get(field.uuid);
		const res = field.validate(value);

		if (res) {
			this.fieldErrors.set(field.uuid, this.props.fieldErrorMessage);
		} else {
			this.fieldErrors.delete(field.uuid);
		}
	}

	renderFields() {
		const fields = this.props.customerFields.fields;
		const nbCols = 2;
		const fieldRows = [];
		let lastField = null;

		fields.forEach((field, index) => {
			const row = Math.floor(index / nbCols);

			if (index % nbCols === 0) {
				fieldRows[row] = [];
			}

			if (index === fields.length - 1) {
				lastField = field;
			}

			fieldRows[row].push(field);
		});

		return fieldRows.map((fieldRow) => {
			const fieldElements = fieldRow.map((field) => {
				const label = this.props.customerFields.labels[field.uuid];
				const isLastField = field === lastField;

				return (
					<View key={field.uuid}>
						<Label>{ label }</Label>
						<Field
							ref={(node) => { this.fieldRefs[field.uuid] = node; }}
							field={field}
							onChangeValue={(value) => { this.onFieldChangeValue(field, value); }}
							onBlur={() => { this.onFieldBlur(field); }}
							onSubmitEditing={() => { this.onFieldSubmit(field); }}
							returnKeyType={isLastField ? 'done' : 'next'}
							error={this.fieldErrors.get(field.uuid)}
							value={this.fieldValues.get(field.uuid)}
						/>
					</View>
				);
			});

			return (
				<FormField key={`row_${fieldRow[0].uuid}`}>
					<Group>
						{ fieldElements }
					</Group>
				</FormField>
			);
		});
	}

	render() {
		return <View>{ this.renderFields() }</View>;
	}
}

CustomerFields.propTypes = propTypes;
CustomerFields.defaultProps = defaultProps;

export default CustomerFields;
