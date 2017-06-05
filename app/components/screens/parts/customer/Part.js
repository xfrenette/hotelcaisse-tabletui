import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import FieldObject from 'hotelcaisse-app/dist/fields/Field';
import Customer from 'hotelcaisse-app/dist/business/Customer';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { Field } from '../../../elements';
import { Field as FormField, Label, Group } from '../../../elements/form';

const propTypes = {
	fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldObject)).isRequired,
	customer: PropTypes.instanceOf(Customer).isRequired,
	onFieldChange: PropTypes.func,
	localizer: PropTypes.instanceOf(Localizer).isRequired,

};

const defaultProps = {
	onFieldChange: null,
};

@observer
class Part extends Component {
	/**
	 * Cache to Field objects
	 *
	 * @type {Object}
	 */
	fieldRefs = {};
	/**
	 * Reference to the next FieldObject for each FieldObject (key is uuid)
	 *
	 * @type {Object}
	 */
	nextField = {};
	@observable
	/**
	 * Error messages for each Field (key is uuid). If a Field is not there, it has no error
	 *
	 * @type {Map}
	 */
	fieldErrors = new Map();

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
	 * When mounting, call saveNextFields()
	 */
	componentWillMount() {
		this.saveNextFields(this.props.fields);
	}

	/**
	 * When unmounting, clear the internal objects
	 */
	componentWillUnmount() {
		this.fieldErrors.clear();
		this.fieldRefs = {};
		this.nextField = {};
	}

	/**
	 * Fill the nextField object for the specified fields. Key will be the FieldObject UUID and
	 * value will be the next FieldObject. If it is the last FieldObject, its value will be null.
	 *
	 * @param {Array<FieldObject>} fields
	 */
	saveNextFields(fields) {
		fields.forEach((field, index) => {
			const nextField =
				(fields.length === 1 || index === fields.length - 1)
				? null
				: fields[index + 1];

			this.nextField[field.uuid] = nextField || null;
		});
	}

	/**
	 * Returns the FieldObject following the specified FieldObject. Returns null if no next
	 * FieldObject.
	 *
	 * @param {FieldObject} field
	 * @return {FieldObject}
	 */
	getNextField(field) {
		return this.nextField[field.uuid];
	}

	/**
	 * Returns the Field node for the specified FieldObject
	 *
	 * @param {FieldObject} field
	 * @return {Field}
	 */
	getFieldNode(field) {
		return this.fieldRefs[field.uuid];
	}

	/**
	 * Focus the Field node following the specified FieldObject. If no next Field, does nothing.
	 *
	 * @param {FieldObject} field
	 */
	focusNextField(field) {
		const nextField = this.getNextField(field);

		if (nextField) {
			this.getFieldNode(nextField).focus();
		}
	}

	/**
	 * When the value for a FieldObject changes
	 *
	 * @param {FieldObject} field
	 * @param {mixed} value
	 */
	onFieldChange(field, value) {
		if (this.props.onFieldChange) {
			this.props.onFieldChange(field, value);
		}
	}

	/**
	 * When a Field input is submitted
	 *
	 * @param {Field} field
	 */
	onFieldSubmit(field) {
		this.focusNextField(field);
	}

	/**
	 * When a Field input is blurred, we validate the value stored for it in the Customer object. If
	 * it is in error, we show a message, else we remove the error.
	 *
	 * @param {FieldObject} field
	 */
	onFieldBlur(field) {
		const value = this.props.customer.getFieldValue(field);
		const res = field.validate(value);

		if (res) {
			this.fieldErrors.set(field.uuid, this.t('errors.fieldInvalidValue'));
		} else {
			this.fieldErrors.delete(field.uuid);
		}
	}

	/**
	 * Render the rows and cols of the Field
	 *
	 * @return {Node}
	 */
	renderFields() {
		const fields = this.props.fields;
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
			const fieldElements = fieldRow.map(
				field => this.renderField(field, field === lastField)
			);

			return (
				<FormField key={`row_${fieldRow[0].uuid}`}>
					<Group>
						{ fieldElements }
					</Group>
				</FormField>
			);
		});
	}

	/**
	 * Renders a single Field for a FieldObject.
	 *
	 * @param {FieldObject} field
	 * @param {Boolean} isLastField
	 * @return {Node}
	 */
	renderField(field, isLastField) {
		const value = this.props.customer.getFieldValue(field);

		return (
			<View key={field.uuid}>
				<Label>{ field.label }</Label>
				<Field
					ref={(node) => { this.fieldRefs[field.uuid] = node; }}
					field={field}
					onChangeValue={(val) => { this.onFieldChange(field, val); }}
					onBlur={() => { this.onFieldBlur(field); }}
					onSubmitEditing={() => { this.onFieldSubmit(field); }}
					returnKeyType={isLastField ? 'done' : 'next'}
					error={this.fieldErrors.get(field.uuid)}
					value={value}
				/>
			</View>
		);
	}

	render() {
		return <View>{ this.renderFields() }</View>;
	}
}

Part.propTypes = propTypes;
Part.defaultProps = defaultProps;

export default Part;
