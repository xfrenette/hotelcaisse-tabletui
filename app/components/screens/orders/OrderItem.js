import React, { Component } from 'react';
import { View, TouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import Field from 'hotelcaisse-app/dist/fields/Field';
import Icon from 'react-native-vector-icons/FontAwesome';
import {	Text } from '../../elements';
import styleVars from '../../../styles/variables';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	customerFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
	onPress: PropTypes.func,
};

const defaultProps = {
	onPress: null,
};

class OrderItem extends Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.order.uuid !== this.props.order.uuid;
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @param {Object} variables
	 * @return {String}
	 */
	t(path, variables) {
		return this.props.localizer.t(path, variables);
	}

	render() {
		const order = this.props.order;
		order.customer.fields = this.props.customerFields;
		const customerName = order.customer.get('customer.name');
		const checkInDate = order.earliestCheckInDate;
		const checkOutDate = order.latestCheckOutDate;
		let checkInOutNode = null;

		const balanceAmount = order.balance;
		const rooms = order.roomSelections.map(rs => rs.room.name).join(', ');

		let balanceNode = <View style={styles.balance} />;

		if (checkInDate && checkOutDate) {
			const checkInDateText = this.props.localizer.formatDate(
				checkInDate,
				{ skeleton: 'MMMEd' }
			);
			const checkOutDateText = this.props.localizer.formatDate(
				checkOutDate,
				{ skeleton: 'MMMEd' }
			);

			checkInOutNode = (
				<View style={styles.checkInOut}>
					<Text>{ checkInDateText }</Text>
					<View style={styles.checkInOutArrow}>
					<Icon name="long-arrow-right" />
					</View>
					<Text>{ checkOutDateText }</Text>
				</View>
			);
		}

		if (!balanceAmount.eq(0)) {
			const typeStyle = balanceAmount.gt(0) ? textStyles.toCollect : textStyles.toRefund
			balanceNode = (
				<View style={styles.balance}>
					<Text style={[textStyles.balanceLabel, typeStyle]}>
						{ this.t(`order.balance.${balanceAmount.gt(0) ? 'toCollect' : 'toRefund'}`) }
					</Text>
					<Text style={[textStyles.balance, typeStyle]}>
						{ this.props.localizer.formatCurrency(balanceAmount.toNumber())}
					</Text>
				</View>
			);
		}

		return (
			<TouchableNativeFeedback onPress={this.props.onPress}>
				<View style={styles.item}>
					<Text style={[styles.customerName, textStyles.customerName]}>{ customerName }</Text>
					<View style={styles.roomSelections}>
						<Text style={textStyles.room}>{ rooms }</Text>
						{ checkInOutNode }
					</View>
					{ balanceNode }
				</View>
			</TouchableNativeFeedback>
		);
	}
}

const styles = {
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: styleVars.verticalRhythm / 2,
	},
	customerName: {
		width: 300,
	},
	roomSelections: {
		width: 300,
	},
	checkInOut: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkInOutArrow: {
		paddingHorizontal: 8,
	},
	balance: {
		width: 300,
	},
};

const textStyles = {
	customerName: {
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
	},
	room: {
		fontWeight: 'bold',
	},
	balanceLabel: {
		textAlign: 'right',
	},
	balance: {
		textAlign: 'right',
		fontWeight: 'bold',
	},
	toCollect: {
		color: styleVars.colors.red1,
	},
	toRefund: {
		color: styleVars.colors.orange1,
	},
};

OrderItem.propTypes = propTypes;
OrderItem.defaultProps = defaultProps;

export default OrderItem;
