import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Room from 'hotelcaisse-app/dist/business/Room';
import FieldObject from 'hotelcaisse-app/dist/fields/Field';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import { Button, DatePicker, Message, Text, } from '../../elements';
import { Cell, Row } from '../../elements/table';
import { Label } from '../../elements/form';
import RoomSelectionRow from './RoomSelectionRow';
import typographyStyles from '../../../styles/typography';
import tableStyles from '../../../styles/tables';
import styleVars from '../../../styles/variables';

const propTypes = {
	roomSelections: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(RoomSelection)),
	rooms: PropTypes.arrayOf(PropTypes.instanceOf(Room)),
	fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldObject)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	inDate: PropTypes.instanceOf(Date),
	outDate: PropTypes.instanceOf(Date),
	minInDate: PropTypes.instanceOf(Date),
	minOutDate: PropTypes.instanceOf(Date),
	onAdd: PropTypes.func,
	onDelete: PropTypes.func,
	onRoomSelect: PropTypes.func,
	onFieldChange: PropTypes.func,
	onDateChanged: PropTypes.func,
};

const defaultProps = {
	rooms: [],
	roomSelections: [],
	inDate: null,
	outDate: null,
	minInDate: null,
	minOutDate: null,
	onAdd: null,
	onDelete: null,
	onRoomSelect: null,
	onFieldChange: null,
	onDateChanged: null,
};

@observer
class RoomSelections extends Component {
	/**
	 * Internal reference to nodes
	 *
	 * @type {Object<Node>}
	 */
	nodeRefs = {};

	/**
	 * When unmounting, clear the nodeRefs
	 */
	componentWillUnmount() {
		this.nodeRefs = {};
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
	 * When the user wants to add a new RoomSelection
	 */
	onAdd() {
		if (this.props.onAdd) {
			this.props.onAdd();
		}
	}

	/**
	 * When the user wants to delete a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 */
	onDelete(roomSelection) {
		if (this.props.onDelete) {
			this.props.onDelete(roomSelection);
		}
	}

	/**
	 * When the user changes the value of a field of a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 * @param {Field} field
	 * @param {mixed} value
	 */
	onFieldChange(roomSelection, field, value) {
		if (this.props.onFieldChange) {
			this.props.onFieldChange(roomSelection, field, value);
		}
	}

	/**
	 * When the user changes the checkin (type = 'in') or checkout (type = 'out') date
	 *
	 * @param {String} type ('in' or 'out')
	 * @param {Date} date
	 */
	onDateSelect(type, date) {
		if (this.props.onDateChanged) {
			this.props.onDateChanged(type, date);
		}
	}

	/**
	 * When the user changes the room for a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 * @param {Room} room
	 */
	onRoomSelect(roomSelection, room) {
		if (this.props.onRoomSelect) {
			this.props.onRoomSelect(roomSelection, room);
		}
	}

	/**
	 * Returns the Node to display when there is no roomSelection
	 *
	 * @return {Node}
	 */
	renderEmptyList() {
		return (
			<View>
				<Text style={typographyStyles.empty}>{ this.t('roomSelections.empty') }</Text>
			</View>
		);
	}

	/**
	 * Returns the content when there is at least one roomSelection
	 *
	 * @return {Node}
	 */
	renderRoomSelections() {
		const roomSelections = this.props.roomSelections.map(roomSelection => (
			<RoomSelectionRow
				key={roomSelection.uuid}
				rooms={this.props.rooms}
				roomSelection={roomSelection}
				cellStyles={cellStyles}
				fields={this.props.fields}
				localizer={this.props.localizer}
				onRoomSelect={(room) => { this.onRoomSelect(roomSelection, room); }}
				onFieldChange={(field, val) => { this.onFieldChange(roomSelection, field, val); }}
				onDelete={() => { this.onDelete(roomSelection); }}
			/>
		));

		return (
			<View>
				{ this.renderDatePickers() }
				{ this.renderTableHeaderRow() }
				{ roomSelections }
				<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
			</View>
		);
	}

	/**
	 * Returns the date pickers for the checkin and checkout dates.
	 *
	 * @return {Node}
	 */
	renderDatePickers() {
		return (
			<View style={styles.datepickers}>
				<View style={styles.datepicker}>
					<Label>{ this.t('roomSelections.checkin') }</Label>
					<DatePicker
						date={this.props.inDate}
						minDate={this.props.minInDate}
						localizer={this.props.localizer}
						onDateSelect={(date) => { this.onDateSelect('in', date); }}
					/>
				</View>
				<View style={styles.datepicker}>
					<Label>{ this.t('roomSelections.checkout') }</Label>
					<DatePicker
						date={this.props.outDate}
						ref={(node) => { this.nodeRefs.datePickerOut = node; }}
						minDate={this.props.minOutDate}
						localizer={this.props.localizer}
						onDateSelect={(date) => { this.onDateSelect('out', date); }}
					/>
				</View>
			</View>
		);
	}

	/**
	 * Returns the table head for the list of roomSelections
	 *
	 * @return {Node}
	 */
	renderTableHeaderRow() {
		if (!this.nodeRefs.tableHeaderRow) {
			const fields = this.props.fields;

			const cols = fields.map((field, index) => {
				const isLast = index === fields.length - 1;

				return (
					<Cell
						last={isLast}
						style={[cellStyles.fieldHeader, cellStyles.field]}
						key={field.id}
					>
						<Text style={tableStyles.header}>{ field.label }</Text>
					</Cell>
				);
			});

			this.nodeRefs.tableHeaderRow = (
				<Row first>
					<Cell style={cellStyles.name} first>
						<Text style={tableStyles.header}>{ this.t('roomSelections.table.name') }</Text>
					</Cell>
					{ cols }
				</Row>
			);
		}

		return this.nodeRefs.tableHeaderRow;
	}

	render() {
		const roomSelections = this.props.roomSelections;

		return (
			<View>
				{ roomSelections.length === 0 ? this.renderEmptyList() : this.renderRoomSelections() }
				<View style={styles.actions}>
					<Button
						title={this.t('roomSelections.actions.add')}
						onPress={() => { this.onAdd(); }}
					/>
				</View>
			</View>
		);
	}
}

const styles = {
	actions: {
		marginTop: styleVars.verticalRhythm,
		alignItems: 'flex-start',
	},
	datepickers: {
		flexDirection: 'row',
		marginHorizontal: -styleVars.horizontalRhythm,
		marginBottom: styleVars.verticalRhythm,
	},
	datepicker: {
		flex: 1,
		marginHorizontal: styleVars.horizontalRhythm,
	},
};

const cellStyles = {
	name: {
		width: 200,
	},
	fieldHeader: {
		alignItems: 'center',
	},
	field: {
		flex: 1,
	},
};

RoomSelections.propTypes = propTypes;
RoomSelections.defaultProps = defaultProps;

export default RoomSelections;
