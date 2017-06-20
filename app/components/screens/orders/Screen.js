import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { View, ScrollView, SectionList } from 'react-native';
import {
	Button,
	Title,
	Text,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../../layout';
import OrderItem from './OrderItem';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';
import styleVars from '../../../styles/variables';

const propTypes = {
	orders: PropTypes.arrayOf(PropTypes.instanceOf(Order)).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
	onOrderPress: PropTypes.func,
};

const defaultProps = {
	onPressHome: null,
	onDone: null,
	onOrderPress: null,
};

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

	/**
	 * Returns the Order (in props.orders) grouped by "section". In our case, a "section" is all the
	 * Order there the customer left at the same date. The sections are ordered by checkout date.
	 *
	 * @return {Array}
	 */
	get orderSections() {
		// TODO
		return [
			{ key: 's1', title: this.t('order.list.current'), data: [1,2,3] },
			{ key: 's2', title: this.t('order.list.yesterday'), data: [4,5,6] },
			{ key: 's3', title: this.t('order.list.older'), data: [7,8,9] },
		];
	}

	/**
	 * When the user presses an Order
	 *
	 * @param {Order} order
	 */
	onOrderPress(order) {
		if (this.props.onOrderPress) {
			this.props.onOrderPress(order);
		}
	}

	/**
	 * Renders an Order item
	 *
	 * @param {Order} order
	 * @return {Node}
	 */
	renderOrder(order) {
		return (
			<OrderItem
				order={order}
				localizer={this.props.localizer}
				onPress={() => { this.onOrderPress(order); }}
			/>
		);
	}

	/**
	 * Node to show when we don't have any Order to show
	 *
	 * @return {Node}
	 */
	renderEmpty() {
		return (
			<Text style={typographyStyles.empty}>
				{ this.t('order.list.empty') }
			</Text>
		);
	}

	/**
	 * Renders a section header
	 *
	 * @param {Object} section
	 * @return {Node}
	 */
	renderSectionHeader(section) {
		return <Title>{section.title}</Title>;
	}

	/**
	 * Renders the separator between the items (a simple line).
	 *
	 * @return {Node}
	 */
	renderSeparator() {
		return <View style={styles.separator} />;
	}

	/**
	 * Renders the separator between the sections (a simple spacer).
	 *
	 * @return {Node}
	 */
	renderSectionSeparator() {
		return <View style={styles.sectionSeparator} />;
	}

	/**
	 * Renders the Orders list
	 *
	 * @return {Node}
	 */
	renderOrders(sections) {
		return (
			<SectionList
				renderItem={({ item }) => this.renderOrder(item)}
				renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
				sections={sections}
				keyExtractor={i => i}
				ItemSeparatorComponent={this.renderSeparator}
				SectionSeparatorComponent={this.renderSectionSeparator}
			/>
		);
	}

	render() {
		const sections = this.orderSections;
		let content = null;

		if (sections.length) {
			content = this.renderOrders(sections);
		} else {
			content = this.renderEmpty();
		}

		return (
			<Screen>
				<TopBar
					title={this.t('screens.orders.title')}
					onPressHome={this.props.onPressHome}
				/>
				<ScrollView>
					<MainContent>
						{ content }
					</MainContent>
				</ScrollView>
				<BottomBar>
					<View />
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.primary}
						onPress={this.props.onDone}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

const styles = {
	separator: {
		height: 1,
		backgroundColor: styleVars.theme.lineColor,
	},
	sectionSeparator: {
		height: styleVars.verticalRhythm,
	},
};

OrdersScreen.propTypes = propTypes;
OrdersScreen.defaultProps = defaultProps;

export default OrdersScreen;
