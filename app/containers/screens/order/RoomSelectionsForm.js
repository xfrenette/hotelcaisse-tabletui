import React, { Component } from 'react';
import { autorun, computed } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import PropTypes from 'prop-types';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Part from '../../../components/screens/order/RoomSelectionsForm';

const propTypes = {
	roomSelections: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(RoomSelection)).isRequired,
};

const defaultProps = {
};

/**
 * Duration, in milliseconds of a single day
 *
 * @type {Number}
 */
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Returns a Date for today, with time set to 0:00:00:000
 *
 * @return {Date}
 */
function getToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

/**
 * Returns a Date the day after (24 hours) the supplied date
 *
 * @return {Date}
 */
function getTomorrowOf(date) {
	return new Date(date.getTime() + ONE_DAY);
}

/**
 * Container for only the RoomSelections part
 */
@inject('localizer', 'uuidGenerator', 'business', 'router')
@observer
class RoomSelectionsForm extends Component {
	/**
	 * Disposers for autorun calls
	 *
	 * @type {Array<Function>}
	 */
	disposers = [];

	/**
	 * Date to show as the checkin date. Will be the earliest checkin date of all current
	 * RoomSelections, or today if no earliest date.
	 *
	 * @return {Date}
	 */
	@computed
	get inDate() {
		let earliestDate = null;

		this.props.roomSelections.forEach((rs) => {
			if (!earliestDate || earliestDate.getTime() > rs.startDate.getTime()) {
				earliestDate = rs.startDate;
			}
		});

		return earliestDate || getToday();
	}

	/**
	 * Date to show as the checkout date. Will be the latest checkout date of all current
	 * RoomSelections, or tomorrow if no latest date.
	 *
	 * @return {Date}
	 */
	@computed
	get outDate() {
		let latestDate = null;

		this.props.roomSelections.forEach((rs) => {
			if (!latestDate || latestDate.getTime() < rs.endDate.getTime()) {
				latestDate = rs.endDate;
			}
		});

		return latestDate || getTomorrowOf(this.inDate);
	}

	/**
	 * Returns the minimum date available in the choeckout calendar: the day after the checkin date.
	 *
	 * @return {Date}
	 */
	@computed
	get minOutDate() {
		return getTomorrowOf(this.inDate);
	}

	/**
	 * When mounting, create an autorun for restrictOutDate(). Also set the fields attribute of each
	 * roomSelection
	 */
	componentWillMount() {
		this.disposers.push(autorun(() => { this.restrictOutDate(); }));
		this.setRoomSelectionsFields(this.props.roomSelections);
	}

	/**
	 * When unmounting, clear the autoruns
	 */
	componentWillUnmount() {
		this.disposers.forEach((disposer) => { disposer(); });
	}

	setRoomSelectionsFields(roomSelections) {
		const fields = this.props.business.roomSelectionFields;
		roomSelections.forEach((roomSelection) => { roomSelection.fields = fields; });
	}

	/**
	 * Ensure the the checkout date is always at least the day after the checkin date. If not,
	 * updates the checkout date.
	 */
	restrictOutDate() {
		// if (this.outDate.getTime() <= this.inDate.getTime()) {
		// 	this.onDateChanged('out', getTomorrowOf(this.inDate));
		// }
	}

	/**
	 * When the user wants to add a new RoomSelection
	 */
	onAdd() {
		const roomSelection = new RoomSelection();
		roomSelection.uuid = this.props.uuidGenerator.generate();

		// For now, all RoomSelection have the same start and end dates
		roomSelection.startDate = this.inDate;
		roomSelection.endDate = this.outDate;

		// Set the fields attribute
		this.setRoomSelectionsFields([roomSelection]);

		// Pre-select the first room
		roomSelection.room = this.props.business.rooms[0];

		this.props.roomSelections.push(roomSelection);
	}

	/**
	 * When the user wants to delete a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 */
	onDelete(roomSelection) {
		this.props.roomSelections.remove(roomSelection);
	}

	/**
	 * When the user selects a room for a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 * @param {Room} room
	 */
	onRoomSelect(roomSelection, room) {
		roomSelection.room = room;
	}

	/**
	 * When the user changes the value of a field of a RoomSelection
	 *
	 * @param {RoomSelection} roomSelection
	 * @param {Field} field
	 * @param {mixed} value
	 */
	onFieldChange(roomSelection, field, value) {
		roomSelection.setFieldValue(field, value);
	}

	/**
	 * When the user changes the checkin (type = 'in') or checkout (type = 'out') date.
	 *
	 * The app supports an Order with RoomSelection having different dates, but, for now, we allow
	 * only the same date for all the RoomSelection of an Order (for simplicity of the UI). When we
	 * implement the calendar, it will be easier to make a clean UI where each RoomSelection has a
	 * different date.
	 *
	 * @param {String} type ('in' or 'out')
	 * @param {Date} date
	 */
	onDateChanged(type, date) {
		this.props.roomSelections.forEach((roomSelection) => {
			if (type === 'in') {
				roomSelection.startDate = date;
			} else {
				roomSelection.endDate = date;
			}
		});
	}

	render() {
		const fields = this.props.business.roomSelectionFields;

		return (
			<Part
				roomSelections={this.props.roomSelections}
				rooms={this.props.business.rooms}
				fields={fields}
				localizer={this.props.localizer}
				inDate={this.inDate}
				outDate={this.outDate}
				minOutDate={this.minOutDate}
				onAdd={() => { this.onAdd(); }}
				onDelete={(rs) => { this.onDelete(rs); }}
				onRoomSelect={(...attrs) => { this.onRoomSelect(...attrs); }}
				onFieldChange={(...attr) => { this.onFieldChange(...attr); }}
				onDateChanged={(...attrs) => { this.onDateChanged(...attrs); }}
			/>
		);
	}
}

RoomSelectionsForm.propTypes = propTypes;
RoomSelectionsForm.defaultProps = defaultProps;

export default RoomSelectionsForm;
