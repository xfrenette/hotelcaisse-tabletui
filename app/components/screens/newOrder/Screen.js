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
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import CategorySidebar from './CategorySidebar';
import ItemRow from './ItemRow';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';
import tableStyles from '../../../styles/tables';

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

	onItemQuantityChange(item, quantity) {
		if (this.props.onItemQuantityChange) {
			this.props.onItemQuantityChange(item, quantity);
		}
	}

	onItemRemove(item) {
		if (this.props.onItemRemove) {
			this.props.onItemRemove(item);
		}
	}

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

	renderItemsHeader() {
		if (!this.components.itemsHeader) {
			this.components.itemsHeader = (
				<Row header>
					<Cell style={cellStyles.name} />
					<Cell style={cellStyles.unitPrice}>
						<Text style={[styles.headerCell, tableStyles.header]}>$ / unité</Text>
					</Cell>
					<Cell style={cellStyles.quantity}>
						<Text style={[styles.headerCell, tableStyles.header]}>Qté / Nb nuits</Text>
					</Cell>
					<Cell style={cellStyles.actions} />
				</Row>
			);
		}

		return this.components.itemsHeader;
	}

	render() {
		return (
			<Screen>
				{ this.renderTopBar() }
				<View style={{ flex: 1 }}>
					<View style={styles.screenContent}>
						<ScrollView style={styles.screenMain}>
							<ScrollView horizontal>
								<View style={{ width: 724 }}>
									<MainContent withSidebar>
										{ this.renderItemsHeader() }
										{ this.items.length ? this.renderItems() : this.renderEmptyItems() }
									</MainContent>
								</View>
							</ScrollView>
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
		width: 100,
	},
	productName: {
		fontSize: styleVars.bigFontSize,
	},
	productDescription: {
		fontSize: styleVars.smallFontSize,
	},
	productNameAndVariant: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	productVariantDropdown: {
		width: 175,
		marginLeft: styleVars.horizontalRhythm,
	},
	emptyItems: {
		flex: 1,
	},
	headerCell: {
		textAlign: 'center',
	},
};

const cellStyles = {
	name: {
		flex: 1,
	},
	unitPrice: {
		width: 100,
		alignItems: 'center',
	},
	quantity: {
		width: 120,
	},
	actions: {
		width: 30,
	},
};

export default NewOrderScreen;
