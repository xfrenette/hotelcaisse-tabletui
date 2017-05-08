import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import Order from 'hotelcaisse-app/dist/business/Order';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../../layout';
import {
	Button,
	Text,
	BottomBarBackButton,
	Title,
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import CategorySidebar from './CategorySidebar';
import ItemRow from './ItemRow';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	rootProductCategory: PropTypes.instanceOf(ProductCategory),
	localizer: PropTypes.instanceOf(Localizer),
	onAddProduct: PropTypes.func,
	onItemQuantityChange: PropTypes.func,
	onItemRemove: PropTypes.func,
	onItemVariantChange: PropTypes.func,
};

const defaultProps = {
	rootProductCategory: null,
	localizer: null,
	onAddProduct: null,
	onItemQuantityChange: null,
	onItemRemove: null,
	onItemVariantChange: null,
};

@observer
class NewOrderScreen extends Component {
	components = {
		items: {},
	};

	/**
	 * Returns the items in the Order
	 *
	 * @return {Array<Item>}
	 */
	@computed
	get items() {
		return this.props.order.items;
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	/**
	 * When we add a product from the CategorySidebar
	 *
	 * @param {Product} product
	 */
	onAddProduct(product) {
		if (this.props.onAddProduct) {
			this.props.onAddProduct(product);
		}
	}

	/**
	 * When the quantity of an item changes
	 *
	 * @param {Item} item
	 * @param {Number} quantity
	 */
	onItemQuantityChange(item, quantity) {
		if (this.props.onItemQuantityChange) {
			this.props.onItemQuantityChange(item, quantity);
		}
	}

	/**
	 * When an item is removed
	 *
	 * @param {Item} item
	 */
	onItemRemove(item) {
		if (this.props.onItemRemove) {
			this.props.onItemRemove(item);
		}
	}

	/**
	 * When another variant of an item is selected
	 *
	 * @param {Item} item
	 * @param {Product} variant The new variant (must be a variant of the item's current Product)
	 */
	onItemVariantChange(item, variant) {
		if (this.props.onItemVariantChange) {
			this.props.onItemVariantChange(item, variant);
		}
	}

	/**
	 * Message rendered in the items list when we don't have any items
	 *
	 * @return {Component}
	 */
	renderEmptyItems() {
		return (
			<Row first>
				<Cell style={styles.emptyItems}>
					<Text style={typographyStyles.empty}>{ this.t('order.items.empty') }</Text>
				</Cell>
			</Row>
		);
	}

	/**
	 * List of items
	 *
	 * @return {Component}
	 */
	renderItems() {
		const items = this.items.map((item, index) => this.renderItem(item, index === 0));

		return (
			<View>

				{ items }
			</View>
		);
	}

	/**
	 * Render a single item line
	 *
	 * @param {Item} item
	 * @param {Boolean} isFirst
	 * @return {Component}
	 */
	renderItem(item, isFirst) {
		const uuid = item.uuid;

		if (!this.components.items[uuid]) {
			this.components.items[uuid] = (
				<ItemRow
					key={uuid}
					item={item}
					isFirst={isFirst}
					cellStyles={cellStyles}
					localizer={this.props.localizer}
					onQuantityChange={(qty) => { this.onItemQuantityChange(item, qty); }}
					onRemove={() => { this.onItemRemove(item); }}
					onVariantChange={(variant) => { this.onItemVariantChange(item, variant); }}
				/>
			);
		}

		return this.components.items[uuid];
	}

	/**
	 * Renders the credits section
	 *
	 * @return {Component}
	 */
	renderCredits() {
		const credits = this.props.order.credits;
		const hasCredits = !!credits.length;
		let creditsLines = null;

		if (hasCredits) {
			creditsLines = credits.map(
				(credit, index) => this.renderCredit(credit, index === 0)
			);
		} else {
			creditsLines = (
				<View style={styles.emptyCredits}>
					<Text style={typographyStyles.empty}>{ this.t('order.credits.empty') }</Text>
				</View>
			);
		}

		return (
			<View style={styles.credits}>
				<Title style={styles.title}>{ this.t('order.credits.label') }</Title>
				{ creditsLines }
				<View style={styles.actions}>
					<Button title={this.t('order.actions.addCredit')} />
				</View>
			</View>
		);
	}

	/**
	 * Renders a single credit line
	 *
	 * @return {Component}
	 */
	renderCredit() {

	}

	/**
	 * Renders the top bar of the screen
	 *
	 * @return {Component}
	 */
	renderTopBar() {
		if (!this.components.topBar) {
			this.components.topBar = (
				<TopBar
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
			);
		}

		return this.components.topBar;
	}

	/**
	 * Renders the sidebar with the products and categories
	 *
	 * @return {Component}
	 */
	renderCategorySidebar() {
		if (!this.components.categorySidebar) {
			this.components.categorySidebar = (
				<CategorySidebar
					style={styles.screenSidebar}
					rootProductCategory={this.props.rootProductCategory}
					backButtonLabel={this.t('actions.back')}
					emptyLabel={this.t('order.categories.empty')}
					onProductPress={(product) => { this.onAddProduct(product); }}
				/>
			);
		}

		return this.components.categorySidebar;
	}

	/**
	 * Renders the bottom bar of the screen
	 *
	 * @return {Component}
	 */
	renderBottomBar() {
		if (!this.components.bottomBar) {
			this.components.bottomBar = (
				<BottomBar>
					<BottomBarBackButton
						title={this.t('actions.cancel')}
					/>
					<Button
						title={this.t('actions.next')}
						layout={buttonLayouts.primary}
					/>
				</BottomBar>
			);
		}

		return this.components.bottomBar;
	}

	render() {
		const hasItems = !!this.items.length;

		return (
			<Screen>
				{ this.renderTopBar() }
				<View style={{ flex: 1 }}>
					<View style={styles.screenContent}>
						<ScrollView style={styles.screenMain}>
							<MainContent withSidebar>
								<Title style={styles.title}>{ this.t('order.items.label') }</Title>
								{ hasItems ? this.renderItems() : this.renderEmptyItems() }
								{ hasItems ? this.renderCredits() : null }
							</MainContent>
						</ScrollView>
						{ this.renderCategorySidebar() }
					</View>
				</View>
				{ this.renderBottomBar() }
			</Screen>
		);
	}
}

NewOrderScreen.propTypes = propTypes;
NewOrderScreen.defaultProps = defaultProps;

const styles = {
	screenContent: {
		flexDirection: 'row',
		flex: 1,
	},
	screenSidebar: {
		width: 300,
	},
	emptyItems: {
		flex: 1,
	},
	emptyCredits: {
	},
	headerCell: {
		textAlign: 'center',
	},
	total: {
		flexDirection: 'row',
	},
	totalAmount: {
		fontSize: styleVars.verticalRhythm,
		fontWeight: 'bold',
	},
	totalLabel: {
		fontSize: styleVars.smallFontSize,
		marginRight: 20,
		fontStyle: 'italic',
	},
	credits: {
		marginTop: styleVars.baseBlockMargin * 2,
	},
	actions: {
		alignItems: 'flex-start',
		marginTop: styleVars.baseBlockMargin,
	},
	title: {
		marginBottom: styleVars.baseBlockMargin,
	},
};

const cellStyles = {
	name: {
		flex: 1,
	},
	totalPrice: {
		width: 85,
		alignItems: 'flex-end',
	},
	quantity: {
		width: 120,
	},
	actions: {
		width: 30,
	},
};

export default NewOrderScreen;
