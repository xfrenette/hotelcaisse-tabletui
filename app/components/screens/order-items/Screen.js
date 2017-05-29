import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Alert, BackHandler } from 'react-native';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';
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
	TextInput,
	Message,
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import CategorySidebar from './CategorySidebar';
import ItemRow from './ItemRow';
import CustomItemRow from './CustomItemRow';
import Credits from './Credits';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	allowCustomProduct: PropTypes.bool,
	order: PropTypes.instanceOf(Order).isRequired,
	rootProductCategory: PropTypes.instanceOf(ProductCategory),
	localizer: PropTypes.instanceOf(Localizer),
	creditValidate: PropTypes.func,
	customProductValidate: PropTypes.func,
	onItemRemove: PropTypes.func,
	onItemQuantityChange: PropTypes.func,
	onItemVariantChange: PropTypes.func,
	onProductAdd: PropTypes.func,
	onCustomProductAdd: PropTypes.func,
	onCustomProductNameChange: PropTypes.func,
	onCustomProductPriceChange: PropTypes.func,
	onCreditAdd: PropTypes.func,
	onCreditRemove: PropTypes.func,
	onCreditAmountChange: PropTypes.func,
	onCreditNoteChange: PropTypes.func,
	onNoteChange: PropTypes.func,
	onNext: PropTypes.func,
	onLeave: PropTypes.func,
};

const defaultProps = {
	allowCustomProduct: false,
	rootProductCategory: null,
	localizer: null,
	creditValidate: null,
	customProductValidate: null,
	onItemRemove: null,
	onItemQuantityChange: null,
	onItemVariantChange: null,
	onProductAdd: null,
	onCustomProductAdd: null,
	onCustomProductNameChange: null,
	onCustomProductPriceChange: null,
	onCreditAdd: null,
	onCreditRemove: null,
	onCreditAmountChange: null,
	onCreditNoteChange: null,
	onNoteChange: null,
	onNext: null,
	onLeave: null,
};

@inject('ui')
@observer
class OrderItemsScreen extends Component {
	/**
	 * Cache of some components.
	 *
	 * @type {Object}
	 */
	components = {};
	/**
	 * Callback for the custom back handler of this screen.
	 *
	 * @type {Function}
	 */
	backHandler = null;
	/**
	 * Set to true to prevent autofocus when creating new custom item. Used when creating the
	 * existing custom items.
	 *
	 * @type {Boolean}
	 */
	blockAutoFocus = false;

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
	 * Initializes the components object when mounting. Prevent autoFocus.
	 */
	componentWillMount() {
		this.blockAutoFocus = true;
		this.components.items = {};
	}

	/**
	 * When we mount, we add the back handler. Re-allow autoFocus.
	 */
	componentDidMount() {
		this.blockAutoFocus = false;
		this.addBackHandler();
	}

	/**
	 * When unmounting, we remove the back handler and clear the components cache
	 */
	componentWillUnmount() {
		this.removeBackHandler();
		this.components = {};
	}

	/**
	 * Adds the back handler that calls onLeave
	 */
	addBackHandler() {
		this.backHandler = () => {
			this.onLeave();
			return true;
		};

		BackHandler.addEventListener('hardwareBackPress', this.backHandler);
	}

	/**
	 * Removes the custom back handler
	 */
	removeBackHandler() {
		BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
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
	onProductAdd(product) {
		if (this.props.onProductAdd) {
			this.props.onProductAdd(product);
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
	 * When the "Add credit" button is pressed.
	 */
	onCreditAdd() {
		if (this.props.onCreditAdd) {
			this.props.onCreditAdd();
		}
	}

	/**
	 * When the order's note field changes
	 *
	 * @param {String} note
	 */
	onNoteChange(note) {
		if (this.props.onNoteChange) {
			this.props.onNoteChange(note);
		}
	}

	/**
	 * When the name of a custom product changes.
	 *
	 * @param {Product} product
	 * @param {String} name
	 */
	onCustomProductNameChange(product, name) {
		if (this.props.onCustomProductNameChange) {
			this.props.onCustomProductNameChange(product, name);
		}
	}

	/**
	 * When the price of a custom product changes.
	 *
	 * @param {Product} product
	 * @param {Decimal} price
	 */
	onCustomProductPriceChange(product, price) {
		if (this.props.onCustomProductPriceChange) {
			this.props.onCustomProductPriceChange(product, price);
		}
	}


	/**
	 * When we try to leave the screen, we show an alert warning data could be lost.
	 */
	onLeave() {
		Alert.alert(
			null,
			this.t('messages.dataLostIfQuit'),
			[
				{ text: this.t('actions.cancel') },
				{
					text: this.t('actions.leave'),
					onPress: () => { this.leave(); },
				},
			],
			{ cancelable: true }
		);
	}

	/**
	 * When we press the "Next" button, to go to the next screen, we validate the order. If it is not
	 * valid, we show an error.
	 */
	onNextPress() {
		const res = this.props.order.validate();

		if (res === undefined) {
			this.onNext();
		} else {
			this.props.ui.showErrorAlert(
				this.t('order.editItems.error.title'),
				this.t('order.editItems.error.message')
			);
		}
	}

	/**
	 * Go to the next screen.
	 */
	onNext() {
		if (this.props.onNext) {
			this.props.onNext();
		}
	}

	/**
	 * Leave the screen
	 */
	leave() {
		if (this.props.onLeave) {
			this.props.onLeave();
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
				<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
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
		const isCustom = item.product.isCustom;
		const RowComponent = isCustom ? CustomItemRow : ItemRow;
		let props = null;

		if (isCustom) {
			const product = item.product;

			// Props specific to CustomItemRow
			props = {
				onNameChange: (name) => { this.onCustomProductNameChange(product, name); },
				onPriceChange: (price) => { this.onCustomProductPriceChange(product, price); },
				autoFocus: !this.blockAutoFocus,
				validate: this.props.customProductValidate,
			};
		} else {
			// Props specific to ItemRow
			props = {
				onVariantChange: (variant) => { this.onItemVariantChange(item, variant); },
			};
		}

		if (!this.components.items[uuid]) {
			this.components.items[uuid] = (
				<RowComponent
					key={uuid}
					item={item}
					isFirst={isFirst}
					localizer={this.props.localizer}
					onQuantityChange={(qty) => { this.onItemQuantityChange(item, qty); }}
					onRemove={() => { this.onItemRemove(item); }}
					{...props}
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
		const credits = this.props.order.credits.slice();

		return (
			<View style={layoutStyles.section}>
				<Title style={layoutStyles.title}>{ this.t('order.credits.label') }</Title>
				<Credits
					localizer={this.props.localizer}
					validate={this.props.creditValidate}
					onCreditAdd={() => { this.onCreditAdd(); }}
					onCreditRemove={this.props.onCreditRemove}
					onAmountChange={this.props.onCreditAmountChange}
					onNoteChange={this.props.onCreditNoteChange}
					credits={credits}
				/>
			</View>
		);
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
					title={this.t('order.new.title')}
					onPressHome={() => { this.onLeave(); }}
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
					showCustomProduct={this.props.allowCustomProduct}
					rootProductCategory={this.props.rootProductCategory}
					backButtonLabel={this.t('actions.back')}
					emptyLabel={this.t('order.categories.empty')}
					customProductLabel={this.t('order.customProduct')}
					onProductPress={(product) => { this.onProductAdd(product); }}
					onCustomProductPress={this.props.onCustomProductAdd}
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
						onPress={() => { this.onLeave(); }}
					/>
					<Button
						title={this.t('actions.next')}
						layout={buttonLayouts.primary}
						onPress={() => { this.onNextPress(); }}
					/>
				</BottomBar>
			);
		}

		return this.components.bottomBar;
	}

	/**
	 * Renders the 'notes' section
	 *
	 * @return {Component}
	 */
	renderNotes() {
		return (
			<View>
				<Title style={layoutStyles.title}>{ this.t('order.note.label') }</Title>
				<TextInput
					multiline
					numberOfLines={4}
					onChangeText={(note) => { this.onNoteChange(note); }}
					value={this.props.order.note}
				/>
				<Text style={[typographyStyles.instructions]}>{ this.t('order.note.instructions') }</Text>
			</View>
		);
	}

	/**
	 * Renders the bar with the total
	 *
	 * @return {Component}
	 */
	renderTotalBar() {
		const total = this.props.order.total;
		const formattedTotal = this.props.localizer.formatCurrency(total.toNumber());

		return (
			<View style={styles.totalBar}>
				<Text style={styles.totalAmount}>{ formattedTotal }</Text>
			</View>
		);
	}

	render() {
		const hasItems = !!this.items.length;
		const shouldShowCredits = hasItems || this.props.order.credits.length > 0;
		const shouldShowNotes = hasItems || this.props.order.note.length > 0;

		return (
			<Screen>
				{ this.renderTopBar() }
				<View style={{ flex: 1 }}>
					<View style={styles.screenContent}>
						<View style={styles.screenMain}>
							<ScrollView>
								<MainContent withSidebar style={styles.mainContent}>
									<View style={layoutStyles.section}>
										<Title style={layoutStyles.title}>
											{ this.t('order.items.label') }
										</Title>
										{ hasItems ? this.renderItems() : this.renderEmptyItems() }
									</View>
									{ shouldShowCredits ? this.renderCredits() : null }
									{ shouldShowNotes ? this.renderNotes() : null }
								</MainContent>
							</ScrollView>
							{ this.renderTotalBar() }
						</View>
						{ this.renderCategorySidebar() }
					</View>
				</View>
				{ this.renderBottomBar() }
			</Screen>
		);
	}
}

OrderItemsScreen.propTypes = propTypes;
OrderItemsScreen.defaultProps = defaultProps;

const styles = {
	screenContent: {
		flexDirection: 'row',
		flex: 1,
	},
	screenMain: {
		flex: 1,
	},
	screenSidebar: {
		width: 300,
	},
	mainContent: {
		paddingBottom: styleVars.verticalRhythm * 5,
	},
	emptyItems: {
		flex: 1,
	},
	headerCell: {
		textAlign: 'center',
	},
	totalBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: (styleVars.verticalRhythm * 3) - 1,
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lineColor,
		backgroundColor: styleVars.colors.transparentWhite1,
		paddingHorizontal: styleVars.horizontalRhythm,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	totalAmount: {
		fontSize: styleVars.verticalRhythm * 1.5,
		lineHeight: styleVars.verticalRhythm * 1.5,
		color: styleVars.theme.mainColor,
	},
	totalLabel: {
		marginRight: 15,
	},
	credits: {
		marginTop: styleVars.baseBlockMargin * 2,
	},
};

export default OrderItemsScreen;
