import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Order from 'hotelcaisse-app/dist/business/Order';
import Room from 'hotelcaisse-app/dist/business/Room';
import Field from 'hotelcaisse-app/dist/fields/Field';
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
import RoomSelections from './RoomSelections';
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	rooms: PropTypes.arrayOf(PropTypes.instanceOf(Room)),
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	customerFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)),
	roomSelectionFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)),
	onAddRoomSelection: PropTypes.func,
	onDeleteRoomSelection: PropTypes.func,
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onNext: PropTypes.func,
};

const defaultProps = {
	rooms: [],
	customerFields: [],
	roomSelectionFields: [],
	onAddRoomSelection: null,
	onDeleteRoomSelection: null,
	onPressHome: null,
	onReturn: null,
	onNext: null,
};

@observer
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
					onPressHome={this.props.onPressHome}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('customer.section.title') }
								</Title>
								<CustomerFields
									fields={this.props.customerFields}
									fieldErrorMessage={this.t('errors.fieldInvalidValue')}
								/>
							</View>
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('roomSelections.section.title') }
								</Title>
								<RoomSelections
									roomSelections={this.props.order.roomSelections.slice()}
									rooms={this.props.rooms}
									fields={this.props.roomSelectionFields}
									onAdd={this.props.onAddRoomSelection}
									onDelete={this.props.onDeleteRoomSelection}
									localizer={this.props.localizer}
								/>
							</View>
						</Container>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.back')}
						onPress={this.props.onReturn}
					/>
					<Button
						title={this.t('actions.next')}
						layout={buttonLayouts.primary}
						onPress={this.props.onNext}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

CustomerRoomSelectionsScreen.propTypes = propTypes;
CustomerRoomSelectionsScreen.defaultProps = defaultProps;

export default CustomerRoomSelectionsScreen;
