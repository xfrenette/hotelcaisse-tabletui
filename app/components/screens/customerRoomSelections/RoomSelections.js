import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Room from 'hotelcaisse-app/dist/business/Room';
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
	fields: PropTypes.shape({
		fields: PropTypes.array,
		labels: PropTypes.object,
	}).isRequired,
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

class RoomSelections extends Component {
	nodeCache = {};

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
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
					<Label>{this.t('roomSelections.checkin')}</Label>
					<DatePicker />
				</View>
				<View style={styles.datepicker}>
					<Label>{this.t('roomSelections.checkout')}</Label>
					<DatePicker />
				</View>
			</View>
		);
	}

	renderRoomNamesDropdown() {
		if (!this.nodeCache.roomNamesDropdown) {
			const Option = Dropdown.Option;
			const options = this.props.rooms.map(
				room => <Option key={room.uuid} value={room.uuid} label={room.name} />
			);

			this.nodeCache.roomNamesDropdown = (
				<Dropdown>
					{ options }
				</Dropdown>
			);
		}

		return this.nodeCache.roomNamesDropdown;
	}

	renderRoomSelectionFields() {
		const fields = this.props.fields.fields;
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
		if (!this.nodeCache.tableHeaderRow) {
			const labels = this.props.fields.labels;
			const fields = this.props.fields.fields;

			const cols = fields.map((field, index) => {
				const isLast = index === fields.length - 1;
				const label = labels[field.uuid];

				return (
					<Cell
						last={isLast}
						style={[cellStyles.fieldHeader, cellStyles.field]}
						key={field.uuid}
					>
						<Text style={tableStyles.header}>{ label }</Text>
					</Cell>
				);
			});

			this.nodeCache.tableHeaderRow = (
				<Row first>
					<Cell style={cellStyles.name} first>
						<Text style={tableStyles.header}>{ this.t('roomSelections.table.name') }</Text>
					</Cell>
					{ cols }
				</Row>
			);
		}

		return this.nodeCache.tableHeaderRow;
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
