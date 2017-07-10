import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CustomerModel from 'hotelcaisse-app/dist/business/Customer';
import { View } from 'react-native';
import {
	Button,
	Text,
} from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';

const propTypes = {
	customer: PropTypes.instanceOf(CustomerModel).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onEditCustomer: PropTypes.func,
};

const defaultProps = {
	onEditCustomer: null,
};

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

	render() {
		return (
			<View style={styles.editableBlock}>
				<View style={styles.editableBlockData}>
					<Text style={styles.customerName}>{ this.props.customer.get('customer.name') }</Text>
					<Text>{ this.props.customer.get('customer.email') }</Text>
				</View>
				<Button
					layout={buttonLayouts.text}
					title={this.t('actions.edit')}
					onPress={this.props.onEditCustomer}
				/>
			</View>
		);
	}
}

const styles = {
	customerName: {
		fontWeight: 'bold',
		color: styleVars.theme.mainColor,
		fontSize: styleVars.bigFontSize,
	},
	editableBlock: {
		flexDirection: 'row',
	},
	editableBlockData: {
		flex: 1,
	},
};

Customer.propTypes = propTypes;
Customer.defaultProps = defaultProps;

export default Customer;
