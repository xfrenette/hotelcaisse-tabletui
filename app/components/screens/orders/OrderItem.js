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

	render() {
		const order = this.props.order;
		order.customer.fields = this.props.customerFields;
		const customerName = order.customer.get('customer.name');
		const checkInDate = this.props.localizer.formatDate(
			order.earliestCheckInDate,
			{ skeleton: 'MMMEd' }
		);
		const checkOutDate = this.props.localizer.formatDate(
			order.latestCheckOutDate,
			{ skeleton: 'MMMEd' }
		);
		const balanceAmount = order.balance;
		const rooms = order.roomSelections.map(rs => rs.room.name).join(', ');

		let balanceNode = <View style={styles.balance} />;

		if (!balanceAmount.eq(0)) {
			balanceNode = (
				<Text style={[styles.balance, textStyles.balance]}>
					{ this.props.localizer.formatCurrency(balanceAmount.toNumber())}
				</Text>
			);
		}

		return (
			<TouchableNativeFeedback onPress={this.props.onPress}>
				<View style={styles.item}>
					<Text style={[styles.customerName, textStyles.customerName]}>{ customerName }</Text>
					<View style={styles.roomSelections}>
						<Text style={textStyles.room}>{ rooms }</Text>
						<View style={styles.checkInOut}>
							<Text>{ checkInDate }</Text>
							<View style={styles.checkInOutArrow}>
								<Icon name="long-arrow-right" />
							</View>
							<Text>{ checkOutDate }</Text>
						</View>
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
	balance: {
		textAlign: 'right',
	},
};

OrderItem.propTypes = propTypes;
OrderItem.defaultProps = defaultProps;

export default OrderItem;
