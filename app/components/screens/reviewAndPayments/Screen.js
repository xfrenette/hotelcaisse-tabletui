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
} from '../../layout';
import { Row, Cell } from '../../elements/table';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import tableStyles from '../../../styles/tables';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	isNew: PropTypes.bool,
	sidebarNode: PropTypes.node,
	customerNode: PropTypes.node,
	roomSelectionsNode: PropTypes.node,
	detailsNode: PropTypes.node,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPressHome: PropTypes.func,
	onReturn: PropTypes.func,
	onDone: PropTypes.func,
};

const defaultProps = {
	sidebarNode: null,
	customerNode: null,
	roomSelectionsNode: null,
	detailsNode: null,
	isNew: false,
	onPressHome: null,
	onReturn: null,
	onDone: null,
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

	/**
	 * Renders the Customer data section
	 *
	 * @return {Node}
	 */
	renderCustomerData() {
		return (
			<View style={layoutStyles.block}>
				{ this.props.customerNode }
			</View>
		);
	}

	/**
	 * Renders the room selections section
	 *
	 * @return {Node}
	 */
	renderRoomSelections() {
		return (
			<View style={layoutStyles.section}>
				{ this.props.roomSelectionsNode }
			</View>
		);
	}

	render() {
		const doneButtonLayout = this.props.order.balance.eq(0)
			? buttonLayouts.primary
			: buttonLayouts.default;

		return (
			<Screen>
				<TopBar
					title={this.t('screens.order.reviewPayments.title')}
					onPressHome={this.props.onPressHome}
				/>
				<View style={styles.screenContent}>
					<ScrollView>
						<MainContent withSidebar>
							{ this.renderCustomerData() }
							{ this.renderRoomSelections() }
							{ this.props.detailsNode }
						</MainContent>
					</ScrollView>
					{ this.props.sidebarNode }
				</View>
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.back')}
						onPress={this.props.onReturn}
					/>
					<Button
						title={this.t('actions.done')}
						layout={doneButtonLayout}
						onPress={this.props.onDone}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

const styles = {
	screenContent: {
		flexDirection: 'row',
		flex: 1,
	},
};

ReviewAndPaymentsScreen.propTypes = propTypes;
ReviewAndPaymentsScreen.defaultProps = defaultProps;

export default ReviewAndPaymentsScreen;
