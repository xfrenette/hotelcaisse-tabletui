import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
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
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import { Label } from '../../elements/form';
import typographyStyles from '../../../styles/typography';
import tableStyles from '../../../styles/tables';
import styleVars from '../../../styles/variables';

const propTypes = {
	rooms: PropTypes.arrayOf(PropTypes.instanceOf(Room)),
	roomSelections: PropTypes.arrayOf(PropTypes.instanceOf(RoomSelection)),
	fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldObject)).isRequired,
	fieldErrorMessage: PropTypes.string,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func,
};

const defaultProps = {
	rooms: [],
	roomSelections: [],
	fieldErrorMessage: 'error',
	onAdd: null,
	onDelete: null,
};

const ONE_DAY = 24 * 60 * 60 * 1000;

@observer
class RoomSelections extends Component {
	nodeRefs = {};
	@observable
	inDate = null;
	@observable
	outDate = null;

	componentWillMount() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		this.inDate = today;
		this.outDate = new Date(today.getTime() + ONE_DAY);
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

	restrictOutDatePicker(inDate) {
		if (this.outDate.getTime() - inDate.getTime() < ONE_DAY) {
			this.outDate = new Date(inDate.getTime() + ONE_DAY);
		}
	}

	onAdd() {
		if (this.props.onAdd) {
			this.props.onAdd();
		}
	}

	onDelete(roomSelection) {
		if (this.props.onDelete) {
			this.props.onDelete(roomSelection);
		}
	}

	onDateSelect(type, date) {
		if (type === 'in') {
			this.inDate = date;
			this.restrictOutDatePicker(date);
		} else {
			this.outDate = date;
		}
	}

	renderEmptyList() {
		return (
			<View>
				<Text style={typographyStyles.empty}>{ this.t('roomSelections.empty') }</Text>
			</View>
		);
	}

	renderRoomSelections() {
		const roomSelections = this.props.roomSelections.map(
			roomSelection => this.renderRoomSelection(roomSelection)
		);

		return (
			<View>
				{ this.renderDatePickers() }
				{ this.renderTableHeaderRow() }
				{ roomSelections }
				<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
			</View>
		);
	}

	renderRoomSelection(roomSelection) {
		return (
			<SwipeDelete
				key={roomSelection.uuid}
				label={this.t('actions.delete')}
				onDelete={() => { this.onDelete(roomSelection); }}
			>
				<Row>
					<Cell style={cellStyles.name} first>
						{ this.renderRoomNamesDropdown() }
					</Cell>
					{ this.renderRoomSelectionFields() }
				</Row>
			</SwipeDelete>
		);
	}

	renderDatePickers() {
		return (
			<View style={styles.datepickers}>
				<View style={styles.datepicker}>
					<Label>{ this.t('roomSelections.checkin') }</Label>
					<DatePicker
						date={this.inDate}
						minDate={new Date()}
						localizer={this.props.localizer}
						onDateSelect={(date) => { this.onDateSelect('in', date); }}
					/>
				</View>
				<View style={styles.datepicker}>
					<Label>{ this.t('roomSelections.checkout') }</Label>
					<DatePicker
						date={this.outDate}
						ref={(node) => { this.nodeRefs.datePickerOut = node; }}
						minDate={new Date(this.inDate.getTime() + ONE_DAY)}
						localizer={this.props.localizer}
						onDateSelect={(date) => { this.onDateSelect('out', date); }}
					/>
				</View>
			</View>
		);
	}

	renderRoomNamesDropdown() {
		if (!this.nodeRefs.roomNamesDropdown) {
			const Option = Dropdown.Option;
			const options = this.props.rooms.map(
				room => <Option key={room.uuid} value={room.uuid} label={room.name} />
			);

			this.nodeRefs.roomNamesDropdown = (
				<Dropdown>
					{ options }
				</Dropdown>
			);
		}

		return this.nodeRefs.roomNamesDropdown;
	}

	renderRoomSelectionFields() {
		const fields = this.props.fields;
		return fields.map((field, index) => {
			const isLast = index === field.length - 1;
			return (
				<Cell key={field.uuid} last={isLast} style={cellStyles.field}>
					<Field field={field} />
				</Cell>
			);
		});
	}

	renderTableHeaderRow() {
		if (!this.nodeRefs.tableHeaderRow) {
			const fields = this.props.fields;

			const cols = fields.map((field, index) => {
				const isLast = index === fields.length - 1;

				return (
					<Cell
						last={isLast}
						style={[cellStyles.fieldHeader, cellStyles.field]}
						key={field.uuid}
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
