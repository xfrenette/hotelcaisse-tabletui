import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { View, ScrollView } from 'react-native';
import {
	Button,
	BottomBarBackButton,
	Title,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Container,
} from '../../layout';
import CustomerFields from './CustomerFields';
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	customerFields: PropTypes.shape({
		fields: PropTypes.array,
		labels: PropTypes.object,
	}),
};

const defaultProps = {
	customerFields: { fields: [], labels: {} },
};

class CustomerRoomSelectionsScreen extends Component {

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
			<Screen>
				<TopBar
					title={this.t('customerRoomSelections.title')}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('customer.section.title') }
								</Title>
								<CustomerFields
									customerFields={this.props.customerFields}
									fieldErrorMessage={this.t('errors.fieldInvalidValue')}
								/>
							</View>
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('roomSelections.section.title') }
								</Title>
							</View>
						</Container>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.back')}
					/>
					<Button
						title={this.t('actions.next')}
						layout={buttonLayouts.primary}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

CustomerRoomSelectionsScreen.propTypes = propTypes;
CustomerRoomSelectionsScreen.defaultProps = defaultProps;

export default CustomerRoomSelectionsScreen;
