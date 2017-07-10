import React, { Component } from 'react';
import { View, SectionList, ActivityIndicator } from 'react-native';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import Field from 'hotelcaisse-app/dist/fields/Field';
import utils from 'hotelcaisse-app/dist/utils';
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
	loading: PropTypes.bool,
	hasMoreOrders: PropTypes.bool,
	customerFields: PropTypes.arrayOf(PropTypes.instanceOf(Field)).isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
	onOrderPress: PropTypes.func,
	onLoadNextOrders: PropTypes.func,
};

const defaultProps = {
	loading: false,
	hasMoreOrders: false,
	onPressHome: null,
	onDone: null,
	onOrderPress: null,
	onLoadNextOrders: null,
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Takes a list of Orders and groups them by checkout date. If a [currentGroups] is passed, the
 * Orders will be added to this array, else an new array is returned.
 *
 * @param {Array<Orders>} orders
 * @param {Array} currentGroups
 * @return {Array}
 */
function groupOrders(orders, currentGroups = []) {
	const groups = [...currentGroups];
	const tomorrow = new Date(Date.now() + ONE_DAY);
	tomorrow.setHours(0, 0, 0, 0);
	const today = new Date(tomorrow.getTime() - ONE_DAY);
	const yesterday = new Date(today.getTime() - ONE_DAY);
	let lastDate;

	if (groups.length) {
		const lastGroup = groups[groups.length - 1];
		const lastOrder = lastGroup.orders[lastGroup.orders.length - 1];
		lastDate = utils.dateMin(lastOrder.latestCheckOutDate, tomorrow);
		lastDate = lastDate.getTime();
	}

	orders.forEach((order) => {
		const groupDate = utils.dateMin(order.latestCheckOutDate, tomorrow);

		if (groupDate.getTime() !== lastDate) {
			let date;

			if (groupDate.getTime() >= tomorrow.getTime()) {
				date = 'current';
			} else if (groupDate.getTime() >= today.getTime()) {
				date = 'today';
			} else if (groupDate.getTime() >= yesterday.getTime()) {
				date = 'yesterday';
			} else {
				date = groupDate;
			}

			groups.push({
				date,
				orders: [],
			});
		}

		groups[groups.length - 1].orders.push(order);
		lastDate = groupDate.getTime();
	});

	return groups;
}

@observer
class OrdersScreen extends Component {
	nodesCache = {};
	orderSections = [];

	@observable
	working = false;

	@computed
	get loading() {
		return this.props.loading || this.working;
	}

	/**
	 * When mounting, do the sections if we have orders
	 */
	componentWillMount() {
		if (this.props.orders.length) {
			this.updateOrderSections(this.props.orders);
		}
	}

	/**
	 * When receiving new orders, redo the sections
	 *
	 * @param {Object} newProps
	 */
	componentWillReceiveProps(newProps) {
		if (newProps.orders !== this.props.orders) {
			this.updateOrderSections(newProps.orders);
		}
	}

	/**
	 * Updates the orderSections array. The Order (in props.orders) are grouped by "section". In our
	 * case, a "section" is all the Order which have the same checkout date. The sections are
	 * ordered by checkout date descending. Note that all the Order that have a checkout date
	 * greater or equal to tomorrow will be grouped together (even if they have different checkout
	 * dates). Sets to true the working property while making the sections.
	 *
	 * @return {Array}
	 */
	updateOrderSections(orders) {
		this.working = true;
		const groups = groupOrders(orders);
		const sections = groups.map(({ date, orders }) => {
			const key = typeof date === 'string' ? date : date.toString();
			let title;

			switch (date) {
				case 'current':
				case 'today':
				case 'yesterday': {
					title = this.t(`order.list.${date}`);
					break;
				}
				default: {
					const formattedDate = this.props.localizer.formatDate(date, { skeleton: 'MMMEd' });
					title = this.t('order.list.leftOn', { date: formattedDate });
				}
			}

			return {
				key,
				title,
				data: orders,
			};
		});

		this.orderSections = sections;
		this.working = false;
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @param {Object} variables
	 * @return {String}
	 */
	t(path, variables) {
		return this.props.localizer.t(path, variables);
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
	 * When the user wants to load the next orders
	 */
	loadNextOrders() {
		if (this.props.onLoadNextOrders) {
			this.props.onLoadNextOrders();
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
				customerFields={this.props.customerFields}
			/>
		);
	}

	/**
	 * Node to show when we don't have any Order to show
	 *
	 * @return {Node}
	 */
	renderEmpty() {
		if (!this.nodesCache.empty) {
			this.nodesCache.empty = (
				<Text style={typographyStyles.empty}>
					{ this.t('order.list.empty') }
				</Text>
			);
		}

		return this.nodesCache.empty;
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
		if (!this.nodesCache.separator) {
			this.nodesCache.separator = <View style={styles.separator} />;
		}

		return this.nodesCache.separator;
	}

	/**
	 * Renders the separator between the sections (a simple spacer).
	 *
	 * @return {Node}
	 */
	renderSectionSeparator() {
		if (!this.nodesCache.sectionSeparator) {
			this.nodesCache.sectionSeparator = <View style={styles.sectionSeparator} />;
		}

		return this.nodesCache.sectionSeparator;
	}

	/**
	 * Renders the list footer: if we have more Order, a button to load them, else a message that we
	 * reached the end of the list
	 *
	 * @return {Note}
	 */
	renderListFooter() {
		let content;

		if (this.loading) {
			content = this.renderLoader();
		} else if (this.props.hasMoreOrders) {
			content = this.renderLoadMoreButton();
		} else {
			content = <Text>{this.t('order.list.noMore')}</Text>;
		}

		return <View style={styles.listFooter}>{ content }</View>;
	}

	renderLoadMoreButton() {
		if (!this.nodesCache.loadMore) {
			this.nodesCache.loadMore = (
				<Button
					title={this.t('order.list.actions.loadNext')}
					onPress={() => { this.loadNextOrders(); }}
					layout={buttonLayouts.default}
				/>
			);
		}

		return this.nodesCache.loadMore;
	}

	renderLoader() {
		return <ActivityIndicator size="large" />;
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
				keyExtractor={order => order.uuid}
				ListFooterComponent={() => this.renderListFooter()}
				ItemSeparatorComponent={() => this.renderSeparator()}
				SectionSeparatorComponent={() => this.renderSectionSeparator()}
			/>
		);
	}

	render() {
		const sections = this.orderSections;
		let content = null;

		if (sections.length) {
			content = this.renderOrders(sections);
		} else if (this.loading) {
			content = this.renderLoader();
		} else {
			content = this.renderEmpty();
		}

		return (
			<Screen>
				<TopBar
					title={this.t('screens.orders.title')}
					onPressHome={this.props.onPressHome}
				/>
				<MainContent style={styles.mainContent}>
					{ content }
				</MainContent>
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
	mainContent: {
		flex: 1,
	},
	separator: {
		height: 1,
		backgroundColor: styleVars.theme.lineColor,
	},
	sectionSeparator: {
		height: styleVars.verticalRhythm,
	},
	listFooter: {
		paddingTop: styleVars.verticalRhythm,
	},
};

OrdersScreen.propTypes = propTypes;
OrdersScreen.defaultProps = defaultProps;

export default OrdersScreen;
