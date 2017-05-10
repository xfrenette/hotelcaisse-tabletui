import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TextInput as NativeTextInput } from 'react-native';
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
	TextInput,
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import CategorySidebar from './CategorySidebar';
import ItemRow from './ItemRow';
import Credits from './Credits';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';
import layoutStyles from '../../../styles/layout';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	rootProductCategory: PropTypes.instanceOf(ProductCategory),
	localizer: PropTypes.instanceOf(Localizer),
	creditValidate: PropTypes.func,
	onProductAdd: PropTypes.func,
	onCreditAdd: PropTypes.func,
	onItemQuantityChange: PropTypes.func,
	onItemRemove: PropTypes.func,
	onCreditRemove: PropTypes.func,
	onItemVariantChange: PropTypes.func,
	onNoteChange: PropTypes.func,
};

const defaultProps = {
	rootProductCategory: null,
	localizer: null,
	creditValidate: null,
	onProductAdd: null,
	onCreditAdd: null,
	onItemQuantityChange: null,
	onItemRemove: null,
	onCreditRemove: null,
	onItemVariantChange: null,
	onNoteChange: null,
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

	onCreditRemove(credit) {
		if (this.props.onCreditRemove) {
			this.props.onCreditRemove(credit);
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

	onCreditAdd() {
		if (this.props.onCreditAdd) {
			this.props.onCreditAdd();
		}
	}

	onNoteChange(note) {
		if (this.props.onNoteChange) {
			this.props.onNoteChange(note);
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
		const credits = this.props.order.credits.slice();

		return (
			<View style={layoutStyles.section}>
				<Title style={layoutStyles.title}>{ this.t('order.credits.label') }</Title>
				<Credits
					localizer={this.props.localizer}
					creditValidate={this.props.creditValidate}
					onCreditAdd={() => { this.onCreditAdd(); }}
					onCreditRemove={(credit) => { this.onCreditRemove(credit); }}
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
					onProductPress={(product) => { this.onProductAdd(product); }}
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

	/**
	 * Renders the 'notes' section
	 *
	 * @return {Component}
	 */
	renderNotes() {
		return (
			<View style={layoutStyles.section}>
				<Title style={layoutStyles.title}>{ this.t('order.note.label') }</Title>
				<TextInput
					multiline
					numberOfLines={4}
					onChangeText={(note) => { this.onNoteChange(note); }}
				/>
				<Text style={[typographyStyles.instructions]}>{ this.t('order.note.instructions') }</Text>
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
						<ScrollView style={styles.screenMain}>
							<MainContent withSidebar>
								<Title style={layoutStyles.title}>{ this.t('order.items.label') }</Title>
								<View style={layoutStyles.section}>
									{ hasItems ? this.renderItems() : this.renderEmptyItems() }
								</View>
								{ shouldShowCredits ? this.renderCredits() : null }
								{ shouldShowNotes ? this.renderNotes() : null }
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
