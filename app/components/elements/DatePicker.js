import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	DatePickerAndroid,
	TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleVars from '../../styles/variables';

const propTypes = {
	date: PropTypes.instanceOf(Date),
	onSelectDate: PropTypes.func,
	minDate: PropTypes.instanceOf(Date),
};

const defaultProps = {
	date: new Date(),
	onSelectDate: null,
	minDate: null,
};

class DatePicker extends Component {
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
	 * it to onSelectDate with it.
	 */
	async onPress() {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open(this.pickerOptions);

			if (action !== DatePickerAndroid.dismissedAction) {
				const newDate = DatePicker.buildDate(year, month, day);
				this.onSelectDate(newDate);
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
	onSelectDate(date) {
		if (this.props.onSelectDate) {
			this.props.onSelectDate(date);
		}
	}

	/**
	 * Returns the date as the text to display in the "input".
	 *
	 * @return {String}
	 */
	get renderedDate() {
		const date = this.props.date;
		return `${date.getDate()}/${date.getMonth()}`;
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

/**
 * From a year, a month and a day, builds a Date object.
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 * @return {Date}
 */
DatePicker.buildDate = (year, month, day) => {
	const date = new Date(0);
	date.setYear(year);
	date.setMonth(month);
	date.setDate(day);

	return date;
};

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
