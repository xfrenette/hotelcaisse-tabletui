import React, { Component } from 'react';
import { computed, autorun } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import Part from '../../../components/screens/parts/roomSelections/Part';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
};

const defaultProps = {
};

const ONE_DAY = 24 * 60 * 60 * 1000;

function getToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

function getTomorrowOf(date) {
	return new Date(date.getTime() + ONE_DAY);
}

/**
 * This class will only create the the sub containers (that will manage the Customer and
 * RoomSelections screen parts) and when we quit the screen.
 */
@inject('localizer', 'uuidGenerator', 'business', 'router')
@observer
class RoomSelections extends Component {
	disposers = [];

	@computed
	get inDate() {
		const earliestDate = this.props.order.earliestCheckInDate;
		return earliestDate || getToday();
	}

	@computed
	get outDate() {
		const latestDate = this.props.order.latestCheckOutDate;
		return latestDate || getTomorrowOf(this.inDate);
	}

	get minInDate() {
		return getToday();
	}

	@computed
	get minOutDate() {
		return getTomorrowOf(this.inDate);
	}

	componentWillMount() {
		this.disposers.push(autorun(() => { this.restrictOutDate(); }));
	}

	componentWillUnmount() {
		this.disposers.forEach((disposer) => { disposer(); });
	}

	restrictOutDate() {
		if (this.outDate.getTime() <= this.inDate.getTime()) {
			this.onDateChanged('out', getTomorrowOf(this.inDate));
		}
	}

	onAdd() {
		const roomSelection = new RoomSelection();
		roomSelection.uuid = this.props.uuidGenerator.generate();

		// For now, all RoomSelection have the same start and end dates
		roomSelection.startDate = this.inDate;
		roomSelection.endDate = this.outDate;

		this.props.order.roomSelections.push(roomSelection);
	}

	onDelete(roomSelection) {
		this.props.order.removeRoomSelection(roomSelection);
	}

	onRoomSelect(roomSelection, room) {
		roomSelection.room = room;
	}

	onFieldChange(roomSelection, field, value) {
		roomSelection.setFieldValue(field, value);
	}

	/**
	 * The app supports an Order with RoomSelection having different dates, but, for now, we allow
	 * only the same date for all the RoomSelection of an Order (for simplicity of the UI). When we
	 * implement the calendar, it will be easier to make a clean UI where each RoomSelection has a
	 * different date.
	 *
	 * @param {String} type ('in' or 'out')
	 * @param {Date} date
	 */
	onDateChanged(type, date) {
		this.props.order.roomSelections.forEach((roomSelection) => {
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
				roomSelections={this.props.order.roomSelections.slice()}
				rooms={this.props.business.rooms}
				fields={fields}
				localizer={this.props.localizer}
				inDate={this.inDate}
				outDate={this.outDate}
				minInDate={this.minInDate}
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

RoomSelections.propTypes = propTypes;
RoomSelections.defaultProps = defaultProps;

export default RoomSelections;
