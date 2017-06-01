import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field as FieldObject } from 'hotelcaisse-app/dist/fields';
import { TextInput, Dropdown, NumberInput } from './index';

/**
 * Renders an input field based on a Field object
 */

const propTypes = {
	field: PropTypes.instanceOf(FieldObject).isRequired,
	onChangeValue: PropTypes.func,
	error: PropTypes.string,
};

const defaultProps = {
	onChangeValue: null,
	error: null,
};

class Field extends Component {
	/**
	 * Reference to the node of the input. Stays null if it is not an input we can focus.
	 *
	 * @type {Component}
	 */
	inputNode = null;

	/**
	 * Small alias to get the field object in the props
	 *
	 * @return {Field}
	 */
	get field() {
		return this.props.field;
	}

	/**
	 * Returns all props not used directly by this component and that will be passed to the input
	 * component.
	 *
	 * @return {Object}
	 */
	get otherProps() {
		const { field, onChangeValue, error, ...other } = this.props;
		return other;
	}

	/**
	 * Focus in the field, if applicable
	 */
	focus() {
		if (this.inputNode && this.inputNode.focus) {
			this.inputNode.focus();
		}
	}

	renderNameField() {
		const props = {
			autoCapitalize: 'words',
		};

		return this.renderTextField(props);
	}

	renderEmailField() {
		const props = {
			keyboardType: 'email-address',
		};

		return this.renderTextField(props);
	}

	renderPhoneField() {
		const props = {
			keyboardType: 'phone-pad',
		};

		return this.renderTextField(props);
	}

	renderTextField(props = {}) {
		return (
			<TextInput
				ref={(node) => { this.inputNode = node; }}
				onChangeText={this.props.onChangeValue}
				error={this.props.error}
				defaultValue={this.field.defaultValue}
				{...props}
				{...this.otherProps}
			/>
		);
	}

	renderNumberField() {
		return (
			<NumberInput
				ref={(node) => { this.inputNode = node; }}
				onChangeValue={this.props.onChangeValue}
				error={this.props.error}
				defaultValue={this.field.defaultValue}
				showIncrementors
				{...this.otherProps}
			/>
		);
	}

	renderSelectField() {
		const Option = Dropdown.Option;
		const options = Object.entries(this.field.values).map(
			// eslint-disable-next-line react/no-array-index-key
			([value, label], index) => <Option key={`${value}_${index}`} value={value} label={label} />
		);
		const selectedValue = this.otherProps.value || this.props.field.defaultValue;

		return (
			<Dropdown
				onValueChange={this.props.onChangeValue}
				{...this.otherProps}
				selectedValue={selectedValue}
			>
				{ options }
			</Dropdown>
		);
	}

	renderField() {
		switch (this.field.type) {
			case 'SelectField':
				return this.renderSelectField();
			case 'NameField':
				return this.renderNameField();
			case 'EmailField':
				return this.renderEmailField();
			case 'PhoneField':
				return this.renderPhoneField();
			case 'NumberField':
				return this.renderNumberField();
			default:
				return this.renderTextField();
		}
	}

	render() {
		return this.renderField();
	}
}

Field.propTypes = propTypes;
Field.defaultProps = defaultProps;

export default Field;
