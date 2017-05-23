import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { View, ScrollView } from 'react-native';
import {
	Button,
	BottomBarBackButton,
	Text,
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
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onSave: PropTypes.func,
};

const defaultProps = {
	onPressHome: null,
	onReturn: null,
	onSave: null,
};

@observer
class ReviewAndPaymentsScreen extends Component {

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
							<Text>{this.props.order.uuid || 'null'}</Text>
						</Container>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.back')}
						onPress={this.props.onReturn}
					/>
					<Button
						title={this.t('actions.save')}
						layout={buttonLayouts.primary}
						onPress={this.props.onSave}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

ReviewAndPaymentsScreen.propTypes = propTypes;
ReviewAndPaymentsScreen.defaultProps = defaultProps;

export default ReviewAndPaymentsScreen;
