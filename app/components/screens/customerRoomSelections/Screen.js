import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react/native';
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
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	customerNode: PropTypes.node.isRequired,
	roomSelectionsNode: PropTypes.node.isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onNext: PropTypes.func,
	validate: PropTypes.func,
};

const defaultProps = {
	onPressHome: null,
	onReturn: null,
	onNext: null,
	validate: null,
};

@inject('ui')
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

	/**
	 * Call the validate prop method and returns its result, or return undefined.
	 *
	 * @return {[type]}
	 */
	validate() {
		if (this.props.validate) {
			return this.props.validate();
		}

		return undefined;
	}

	/**
	 * When the user presses the next button, we validate. If valid, call the onNext prop, else show
	 * an alert.
	 */
	onNext() {
		const validationRes = this.validate();

		if (validationRes === undefined) {
			this.props.onNext();
		} else {
			this.props.ui.showErrorAlert(
				this.t('errors.invalidFieldsAlert.title'),
				this.t('errors.invalidFieldsAlert.message')
			);
		}
	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('screens.order.customerRoomSelections.title')}
					onPressHome={this.props.onPressHome}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('customer.section.title') }
								</Title>
								{ this.props.customerNode }
							</View>
							<View style={layoutStyles.section}>
								<Title style={layoutStyles.title}>
									{ this.t('roomSelections.section.title') }
								</Title>
								{ this.props.roomSelectionsNode }
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
						onPress={() => { this.onNext(); }}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

CustomerRoomSelectionsScreen.propTypes = propTypes;
CustomerRoomSelectionsScreen.defaultProps = defaultProps;

export default CustomerRoomSelectionsScreen;
