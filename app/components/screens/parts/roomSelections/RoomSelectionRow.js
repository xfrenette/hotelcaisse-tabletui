import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Room from 'hotelcaisse-app/dist/business/Room';
import FieldObject from 'hotelcaisse-app/dist/fields/Field';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import {
	Field,
	Dropdown,
	SwipeDelete,
} from '../../../elements';
import { Row, Cell } from '../../../elements/table';

const propTypes = {
	rooms: PropTypes.arrayOf(PropTypes.instanceOf(Room)),
	roomSelection: PropTypes.instanceOf(RoomSelection).isRequired,
	cellStyles: PropTypes.object.isRequired,
	fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldObject)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onRoomSelect: PropTypes.func,
	onFieldChange: PropTypes.func,
	onDelete: PropTypes.func,
};

const defaultProps = {
	rooms: [],
	onRoomSelect: null,
	onFieldChange: null,
	onDelete: null,
};

@observer
class RoomSelectionRow extends Component {
	/**
	 * Error messages for the fields
	 *
	 * @type {Map}
	 */
	@observable
	fieldErrors = new Map();

	@computed
	/**
	 * Returns the uuid of the currently selected room. Returns null if no room selected.
	 *
	 * @return {String}
	 */
	get roomUUID() {
		if (!this.props.roomSelection.room) {
			return null;
		}

		return this.props.roomSelection.room.uuid;
	}

	/**
	 * When unmounting, clear the error messages.
	 */
	componentWillUnmount() {
		this.fieldErrors.clear();
	}

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
	 * When the user wants to delete the room selection
	 */
	onDelete() {
		if (this.props.onDelete) {
			this.props.onDelete();
		}
	}

	/**
	 * When the user changes the room
	 *
	 * @param {String} roomUUID
	 */
	onRoomSelect(roomUUID) {
		const room = this.props.rooms.find(currRoom => currRoom.uuid === roomUUID);

		if (room && this.props.onRoomSelect) {
			this.props.onRoomSelect(room);
		}
	}

	/**
	 * When the user changes the value of a field
	 *
	 * @param {Field} field
	 * @param {mixed} value
	 */
	onFieldChange(field, value) {
		if (this.props.onFieldChange) {
			this.props.onFieldChange(field, value);
		}
	}

	/**
	 * When a field is blurred, we valildate its value and show or hide the error message
	 *
	 * @param {Field} field
	 */
	onFieldBlur(field) {
		const value = this.props.roomSelection.getFieldValue(field);
		const res = field.validate(value);

		if (res) {
			this.fieldErrors.set(field.uuid, this.t('errors.fieldInvalidValue'));
		} else {
			this.fieldErrors.delete(field.uuid);
		}
	}

	/**
	 * Returns the DropDown for the rooms
	 *
	 * @return {Node}
	 */
	renderRoomsDropdown() {
		const Option = Dropdown.Option;
		const options = this.props.rooms.map(
			room => <Option key={room.uuid} value={room.uuid} label={room.name} />
		);

		return (
			<Dropdown
				selectedValue={this.roomUUID}
				onValueChange={(uuid) => { this.onRoomSelect(uuid); }}
			>
				{ options }
			</Dropdown>
		);
	}

	/**
	 * Returns the cells for all the fields
	 *
	 * @return {Node}
	 */
	renderFields() {
		const fields = this.props.fields;
		return fields.map((field, index) => {
			const isLast = index === field.length - 1;
			return (
				<Cell key={field.uuid} last={isLast} style={this.props.cellStyles.field}>
					<Field
						field={field}
						value={this.props.roomSelection.getFieldValue(field)}
						error={this.fieldErrors.get(field.uuid)}
						onChangeValue={(val) => { this.onFieldChange(field, val); }}
						onBlur={() => { this.onFieldBlur(field); }}
					/>
				</Cell>
			);
		});
	}

	render() {
		const roomSelection = this.props.roomSelection;

		return (
			<SwipeDelete
				label={this.t('actions.delete')}
				onDelete={() => { this.onDelete(roomSelection); }}
			>
				<Row>
					<Cell style={this.props.cellStyles.name} first>
						{ this.renderRoomsDropdown() }
					</Cell>
					{ this.renderFields() }
				</Row>
			</SwipeDelete>
		);
	}
}

RoomSelectionRow.propTypes = propTypes;
RoomSelectionRow.defaultProps = defaultProps;

export default RoomSelectionRow;