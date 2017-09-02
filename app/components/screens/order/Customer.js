import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { PropTypes as PropTypesMobx } from 'mobx-react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CustomerModel from 'hotelcaisse-app/dist/business/Customer';
import Field from 'hotelcaisse-app/dist/fields/Field';
import RoomSelection from 'hotelcaisse-app/dist/business/RoomSelection';
import { Button, Text } from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	customer: PropTypes.instanceOf(CustomerModel).isRequired,
	customerFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
	roomSelections: PropTypesMobx.observableArrayOf(PropTypes.instanceOf(RoomSelection)).isRequired,
	onCustomerEdit: PropTypes.func,
};

const defaultProps = {
	onCustomerEdit: null,
};

const visibleFieldTypes = {
	PhoneField: {
		icon: 'phone',
	},
	EmailField: {
		icon: 'envelope',
		email: true,
	},
};

@observer
class Customer extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	@computed
	get hasData() {
		return this.props.customer && this.props.customer.fieldValues.size > 0;
	}

	get customerName() {
		const customerField = this.props.customerFields.find(f => f.role === 'customer.name');
		return this.props.customer.getFieldValue(customerField);
	}

	renderNoData() {
		return (
			<View style={viewStyles.buttons}>
				<Button
					title={this.t('order.actions.fillCustomer')}
					layout={[buttonLayouts.default, buttonLayouts.small]}
					onPress={this.props.onCustomerEdit}
				/>
			</View>
		);
	}

	renderFields() {
		const nodes = [];

		this.props.customerFields.forEach((field) => {
			if (!visibleFieldTypes[field.type]) {
				return;
			}

			const value = this.props.customer.getFieldValue(field);

			if (!value) {
				return;
			}

			const data = visibleFieldTypes[field.type];

			nodes.push(
				<View key={field.id} style={viewStyles.value}>
					<Icon name={data.icon} style={textStyles.icon} />
					<Text>{ value }</Text>
				</View>
			);
		});

		return nodes;
	}

	renderRoomSelections() {
		let startDate;
		let endDate;
		const rooms = [];

		this.props.roomSelections.forEach((rs) => {
			rooms.push(rs.room.name);

			if (!startDate || rs.startDate.getTime() < startDate.getTime()) {
				startDate = rs.startDate;
			}

			if (!endDate || rs.endDate.getTime() > endDate.getTime()) {
				endDate = rs.endDate;
			}
		});

		const startText = this.props.localizer.formatDate(startDate, { skeleton: 'MMMEd' });
		const endText = this.props.localizer.formatDate(endDate, { skeleton: 'MMMEd' });

		return (
			<View>
				<View style={viewStyles.value}>
					<Icon name="bed" style={textStyles.icon} />
					<Text style={textStyles.emphasis}>{ rooms.join(', ') }</Text>
				</View>
				<View style={viewStyles.value}>
					<Icon name="sign-in" style={textStyles.icon} />
					<Text>{ startText }</Text>
					<Icon name="sign-out" style={[textStyles.icon, textStyles.outIcon]} />
					<Text>{ endText }</Text>
				</View>
			</View>
		);
	}

	renderCustomerRoomSelections() {
		return (
			<View>
				<View>
					<Text style={textStyles.strong}>{ this.customerName }</Text>
				</View>
				<View style={viewStyles.content}>
					<View style={viewStyles.cols}>
						<View style={viewStyles.col}>
							{ this.renderFields() }
						</View>
						<View style={viewStyles.col}>
							{ this.renderRoomSelections() }
						</View>
					</View>
				</View>
				<View style={viewStyles.buttons}>
					<Button
						layout={[buttonLayouts.default, buttonLayouts.small]}
						title={this.t('order.actions.editCustomer')}
						onPress={this.props.onCustomerEdit}
					/>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View>
				{ this.hasData ? this.renderCustomerRoomSelections() : this.renderNoData() }
			</View>
		);
	}
}

const viewStyles = {
	buttons: {
		alignItems: 'flex-start',
	},
	content: {
		marginBottom: styleVars.verticalRhythm / 2,
	},
	value: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cols: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
	},
	col: {
		flex: 1,
	},
};

const textStyles = {
	strong: {
		fontWeight: 'bold',
		fontSize: styleVars.bigFontSize,
	},
	emphasis: {
		fontWeight: 'bold',
	},
	link: {
		textDecorationLine: 'underline',
	},
	icon: {
		width: 20,
	},
	outIcon: {
		marginLeft: 20,
	},
};

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
