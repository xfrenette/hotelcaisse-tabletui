import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	DatePickerAndroid,
	TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import styleVars from '../../styles/variables';

const propTypes = {
	date: PropTypes.instanceOf(Date),
	onDateSelect: PropTypes.func,
	minDate: PropTypes.instanceOf(Date),
	localizer: PropTypes.instanceOf(Localizer),
	format: PropTypes.string,
};

const defaultProps = {
	date: new Date(),
	onDateSelect: null,
	minDate: null,
	localizer: null,
	format: 'MMMEd',
};

class DatePicker extends Component {
	/**
	 * From a year, a month and a day, builds a Date object. The returned date will have time
	 * 00:00:00:0000.
	 *
	 * @param {Number} year
	 * @param {Number} month
	 * @param {Number} day
	 * @return {Date}
	 */
	static buildDate = (year, month, day) => {
		const date = new Date();
		date.setFullYear(year, month, day);
		date.setHours(0, 0, 0, 0);

		return date;
	};

	/**
	 * Returns the options for the date picker
	 *
	 * @return {Object}
	 */
	get pickerOptions() {
		const pickerOptions = {
			date: this.props.date,
			mode: 'calendar',
		};

		if (this.props.minDate) {
			pickerOptions.minDate = this.props.minDate;
		}

		return pickerOptions;
	}

	/**
	 * Called when we press the "input". Will show the date picker. If a date is selected, will call
	 * it to onDateSelect with it.
	 */
	async onPress() {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open(this.pickerOptions);

			if (action !== DatePickerAndroid.dismissedAction) {
				const newDate = this.constructor.buildDate(year, month, day);
				this.onDateSelect(newDate);
			}
		} catch (e) {
			// do nothing
		}
	}

	/**
	 * When a date is selected.
	 *
	 * @param {Date} date
	 */
	onDateSelect(date) {
		if (this.props.onDateSelect) {
			this.props.onDateSelect(date);
		}
	}

	/**
	 * Returns the date as the text to display in the "input".
	 *
	 * @return {String}
	 */
	get renderedDate() {
		const date = this.props.date;

		if (!this.props.localizer) {
			return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		}

		return this.props.localizer.formatDate(date, { skeleton: this.props.format });
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={() => { this.onPress(); }}
			>
				<View style={styles.input}>
					<Text style={styles.text}>{ this.renderedDate }</Text>
					<Icon name="calendar" style={styles.icon} />
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = {
	input: {
		borderWidth: 1,
		borderColor: styleVars.input.borderColor,
		borderRadius: styleVars.input.borderRadius,
		height: styleVars.input.height,
		backgroundColor: styleVars.input.backgroundColor,
		paddingHorizontal: styleVars.input.sidePadding,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	text: {
		color: styleVars.theme.mainColor,
	},
	icon: {
		color: styleVars.theme.mainColor,
		fontSize: 18,
	},
};

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
