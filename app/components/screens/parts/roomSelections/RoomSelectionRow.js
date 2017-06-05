import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Room from 'hotelcaisse-app/dist/business/Room';
import FieldObject from 'hotelcaisse-app/dist/fields/Field';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import {
	Field,
	Button,
	Message,
	Text,
	Dropdown,
	DatePicker,
	SwipeDelete,
} from '../../../elements';
import { Row, Cell } from '../../../elements/table';
import { Label } from '../../../elements/form';
import typographyStyles from '../../../../styles/typography';
import tableStyles from '../../../../styles/tables';
import styleVars from '../../../../styles/variables';

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
	@observable
	fieldErrors = new Map();

	@computed
	get roomUUID() {
		if (!this.props.roomSelection.room) {
			return null;
		}

		return this.props.roomSelection.room.uuid;
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

	onDelete(roomSelection) {
		if (this.props.onDelete) {
			this.props.onDelete(roomSelection);
		}
	}

	onRoomSelect(roomUUID) {
		const room = this.props.rooms.find(currRoom => currRoom.uuid === roomUUID);

		if (room && this.props.onRoomSelect) {
			this.props.onRoomSelect(room);
		}
	}

	onFieldChange(field, value) {
		if (this.props.onFieldChange) {
			this.props.onFieldChange(field, value);
		}
	}

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

	renderFields() {
		const fields = this.props.fields;
		return fields.map((field, index) => {
			const isLast = index === field.length - 1;
			return (
				<Cell key={field.uuid} last={isLast} style={this.props.cellStyles.field}>
					<Field
						field={field}
						value={this.props.roomSelection.getFieldValue(field)}
						onChangeValue={(val) => { this.onFieldChange(field, val); }}
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
