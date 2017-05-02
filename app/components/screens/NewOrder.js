import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../layout';
import { Button, Text, BottomBarBackButton } from '../elements';
import buttonLayouts from '../../styles/buttons';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
};

class NewOrder extends Component {
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
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
				<ScrollView>
					<MainContent>
						<Text>New order</Text>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.cancel')}
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

NewOrder.propTypes = propTypes;
NewOrder.defaultProps = defaultProps;

export default NewOrder;
