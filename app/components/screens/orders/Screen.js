import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { View, ScrollView } from 'react-native';
import {
	Button,
	Text,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../../layout';
import buttonLayouts from '../../../styles/buttons';

const propTypes = {
	orders: PropTypes.arrayOf(PropTypes.instanceOf(Order)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
	onViewOrder: PropTypes.func,
};

const defaultProps = {
	onPressHome: null,
	onDone: null,
	onViewOrder: null,
};

@observer
class OrdersScreen extends Component {
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
					title={this.t('screens.orders.title')}
					onPressHome={this.props.onPressHome}
				/>
				<ScrollView>
					<MainContent>
					</MainContent>
				</ScrollView>
				<BottomBar>
					<View />
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.default}
						onPress={this.props.onDone}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

const styles = {
};

OrdersScreen.propTypes = propTypes;
OrdersScreen.defaultProps = defaultProps;

export default OrdersScreen;
