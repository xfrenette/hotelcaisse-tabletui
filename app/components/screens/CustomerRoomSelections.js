import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import { View, ScrollView } from 'react-native';
import {
	Button,
	BottomBarBackButton,
	Title,
} from '../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Container,
} from '../layout';
import buttonLayouts from '../../styles/buttons';
import layoutStyles from '../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
};

class CustomerRoomSelections extends Component {

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

CustomerRoomSelections.propTypes = propTypes;
CustomerRoomSelections.defaultProps = defaultProps;

export default CustomerRoomSelections;
