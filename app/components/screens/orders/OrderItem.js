import React, { Component } from 'react';
import { View, TouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import Icon from 'react-native-vector-icons/FontAwesome';
import {	Text } from '../../elements';
import styleVars from '../../../styles/variables';

const propTypes = {
	order: PropTypes.number.isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPress: PropTypes.func,
};

const defaultProps = {
	onPress: null,
};

const OrderItem = (props) => {
	const customerName = 'Vincent-Olivier Arsenault-Chapdelaine';
	const checkInDate = 'lun. 5 mai';
	const checkOutDate = 'mar. 6 mai';

	const rand = Math.random();
	const balanceAmount = rand < 0.1
		? new Decimal(-12.34)
		: (rand > 0.9 ? new Decimal(8.34) : new Decimal(0));

	let balance = <View style={styles.balance} />;

	if (!balanceAmount.eq(0)) {
		balance = (
			<Text style={[styles.balance, textStyles.balance]}>
				{ props.localizer.formatCurrency(balanceAmount.toNumber())}
			</Text>
		);
	}

	return (
		<TouchableNativeFeedback onPress={props.onPress}>
			<View style={styles.item}>
				<Text style={[styles.customerName, textStyles.customerName]}>{ customerName }</Text>
				<View style={styles.roomSelections}>
					<Text style={textStyles.room}>Chambre 1, chambre 5</Text>
					<View style={styles.checkInOut}>
						<Text>{ checkInDate }</Text>
						<View style={styles.checkInOutArrow}>
							<Icon name="long-arrow-right" />
						</View>
						<Text>{ checkOutDate }</Text>
					</View>
				</View>
				{ balance }
			</View>
		</TouchableNativeFeedback>
	);
};

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
