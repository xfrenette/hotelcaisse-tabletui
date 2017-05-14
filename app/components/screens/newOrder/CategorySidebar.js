import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableNativeFeedback } from 'react-native';
import { observable, computed, autorun } from 'mobx';
import { observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import {	Sidebar } from '../../layout';
import {	Text, Button } from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import typographyStyles from '../../../styles/typography';

const propTypes = {
	style: Sidebar.propTypes.style,
	showCustomProduct: PropTypes.bool,
	backButtonLabel: PropTypes.string.isRequired,
	emptyLabel: PropTypes.string.isRequired,
	customProductLabel: PropTypes.string.isRequired,
	rootProductCategory: PropTypes.instanceOf(ProductCategory),
	onProductPress: PropTypes.func,
	onCustomProductPress: PropTypes.func,
};

const defaultProps = {
	style: null,
	showCustomProduct: false,
	rootProductCategory: null,
	customProductLabel: '',
	onProductPress: null,
	onCustomProductPress: null,
};

@observer
class CategorySidebar extends Component {
	/**
	 * Cache of the back button
	 *
	 * @type {Component}
	 */
	backButton = null;
	/**
	 * List of references to Components
	 *
	 * @type {Object}
	 */
	nodeRefs = {};
	/**
	 * Disposers of autorun's. Will call them when unmounting
	 *
	 * @type {Array}
	 */
	disposers = [];
	/**
	 * Width of the sidebar. Updated when it changes layout.
	 *
	 * @type {Number}
	 */
	@observable
	sidebarWidth = -1;
	/**
	 * Path in the categories hierarchy. When we go a level deeper, it is added at the end.
	 */
	@observable
	categories = [];

	/**
	 * Sets the list of categories from the props and starts autoScrollTop
	 */
	componentWillMount() {
		this.resetCategories(this.props.rootProductCategory);
		this.autoScrollTop();
	}

	/**
	 * Clear the autorun's
	 */
	componentWillUnmount() {
		this.disposers.forEach((disposer) => {
			disposer();
		});
		this.disposers = [];
	}

	/**
	 * When we receive a new rootProductCategory, update the categories array.
	 *
	 * @param {Object} newProps
	 */
	componentWillReceiveProps(newProps) {
		if (newProps.rootProductCategory !== this.props.rootProductCategory) {
			this.resetCategories(newProps.rootProductCategory);
		}
	}

	/**
	 * Listens to changes in the categories array. When we change category, scrolls the sidebar to
	 * the top.
	 */
	autoScrollTop() {
		this.disposers.push(autorun(() => {
			if (this.categories.length > 0 && this.nodeRefs.sidebar) {
				this.nodeRefs.sidebar.scrollTop();
			}
		}));
	}

	/**
	 * To prevent problems where the same Product could be in 2 different categories, this function
	 * generates a unique key based on the current category's uuid and the product's uuid.
	 *
	 * @param {Product} product
	 * @return {String}
	 */
	makeProductKey(product) {
		return `${this.currentCategory.uuid}_${product.uuid}`;
	}

	/**
	 * Resets the categories array to the new root category.
	 *
	 * @param {ProductCategory} newRootCategory
	 */
	resetCategories(newRootCategory) {
		this.categories.clear();

		if (newRootCategory) {
			this.categories.push(newRootCategory);
		}
	}

	/**
	 * Returns the category we currently are in the categories hierarchy
	 *
	 * @return {ProductCategory}
	 */
	@computed
	get currentCategory() {
		if (!this.categories.length) {
			return null;
		}

		return this.categories[this.categories.length - 1];
	}

	/**
	 * Returns true if the category where we are is the root category
	 *
	 * @return {Boolean}
	 */
	@computed
	get isRootCategory() {
		return this.categories.length <= 1;
	}

	/**
	 * Returns the width the buttons must have, based on the current sidebar width.
	 *
	 * @return {Number}
	 */
	@computed
	get buttonWidth() {
		if (this.sidebarWidth === -1) {
			return null;
		}

		const sidePadding = styleVars.horizontalRhythm * 2;
		const gap = styleVars.horizontalRhythm;
		return (this.sidebarWidth - sidePadding - gap) / 2;
	}

	/**
	 * When we press a category, we add it to the categories array
	 *
	 * @param {ProductCategory} category
	 */
	onCategoryPress(category) {
		this.categories.push(category);
	}

	/**
	 * When we press a product, inform the parent component.
	 *
	 * @param {Product} product
	 */
	onProductPress(product) {
		if (this.props.onProductPress) {
			this.props.onProductPress(product);
		}
	}

	/**
	 * When we press the "custom product" button
	 */
	onCustomProductPress() {
		if (this.props.onCustomProductPress) {
			this.props.onCustomProductPress();
		}
	}

	/**
	 * When we press back, go back one step in the categories.
	 */
	onBackPress() {
		if (this.categories.length > 1) {
			this.categories.pop();
		}
	}

	/**
	 * Renders the buttons for the current category.
	 *
	 * @return {Component}
	 */
	renderCurrentCategory() {
		const cat = this.currentCategory;

		if (!cat) {
			return null;
		}

		const subCategories = cat.categories;
		const products = cat.products;
		const buttons = [];
		const style = [styles.buttons];

		products.forEach((product) => {
			buttons.push(this.renderProductButton(product));
		});

		subCategories.forEach((subCategory) => {
			buttons.push(this.renderCategoryButton(subCategory));
		});

		if (this.isRootCategory && this.props.showCustomProduct) {
			buttons.push(this.renderCustomProductButton());
		}

		if (buttons.length === 0) {
			const emptyStyle = [typographyStyles.empty, styles.emptyText];
			const emptyMessage = (
				<Text key="__empty-message" style={emptyStyle}>
					{ this.props.emptyLabel }
				</Text>
			);
			buttons.push(emptyMessage);
		}

		return <View style={style}>{ buttons }</View>;
	}

	/**
	 * Renders a button for a category
	 *
	 * @param {ProductCategory} category
	 * @return {Component}
	 */
	renderCategoryButton(category) {
		const widthStyle = { width: this.buttonWidth };

		return (
			<TouchableNativeFeedback
				key={category.uuid}
				background={TouchableNativeFeedback.Ripple(styleVars.colors.orange2, false)}
				onPress={() => { this.onCategoryPress(category); }}
			>
				<View style={[styles.button, styles.category, widthStyle]}>
					<View>
						<Text style={styles.buttonText}>{ category.name }</Text>
					</View>
					<View>
						<Icon name="ellipsis-h" style={[styles.buttonText, styles.subCategoryIcon]} />
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}

	/**
	 * Renders a button for a product
	 *
	 * @param {Product} product
	 * @return {Component}
	 */
	renderProductButton(product) {
		const widthStyle = { width: this.buttonWidth };

		return (
			<TouchableNativeFeedback
				key={this.makeProductKey(product)}
				background={TouchableNativeFeedback.Ripple(styleVars.colors.blue2, false)}
				onPress={() => { this.onProductPress(product); }}
			>
				<View style={[styles.button, styles.product, widthStyle]}>
					<Text style={styles.buttonText}>{ product.name }</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	/**
	 * Renders a special product button that allows adding a custom item
	 *
	 * @return {Component}
	 */
	renderCustomProductButton() {
		const widthStyle = { width: this.buttonWidth };

		return (
			<TouchableNativeFeedback
				key="__custom-product__"
				background={TouchableNativeFeedback.Ripple(styleVars.colors.blue2, false)}
				onPress={() => { this.onCustomProductPress(); }}
			>
				<View style={[styles.button, styles.customProduct, widthStyle]}>
					<Text style={styles.buttonText}>{ this.props.customProductLabel }</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	/**
	 * Renders the back button
	 *
	 * @return {Component}
	 */
	renderBackButton() {
		if (!this.backButton) {
			const layout = {
				...buttonLayouts.text,
				text: {
					...buttonLayouts.text.text,
					...styles.backText,
				},
			};
			this.backButton = (
				<View style={styles.back}>
					<Button
						type="back"
						hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
						layout={layout}
						title={this.props.backButtonLabel}
						touchEffect="opacity"
						onPress={() => { this.onBackPress(); }}
					/>
				</View>
			);
		}

		return this.backButton;
	}

	render() {
		let back = null;

		if (!this.isRootCategory) {
			back = this.renderBackButton();
		}

		return (
			<Sidebar
				ref={(node) => { this.nodeRefs.sidebar = node; }}
				style={this.props.style}
				onLayout={({ nativeEvent }) => { this.sidebarWidth = nativeEvent.layout.width; }}
			>
				{ back }
				{ this.renderCurrentCategory() }
			</Sidebar>
		);
	}
}

CategorySidebar.propTypes = propTypes;
CategorySidebar.defaultProps = defaultProps;

const styles = {
	buttons: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: -styleVars.verticalRhythm,
		flex: 1,
	},
	button: {
		marginBottom: styleVars.verticalRhythm,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		backgroundColor: styleVars.theme.mainColor,
		height: styleVars.verticalRhythm * 3,
		borderRadius: 4,
	},
	buttonText: {
		color: styleVars.colors.white1,
		textAlign: 'center',
	},
	emptyText: {
		color: styleVars.colors.grey2,
	},
	product: {
	},
	category: {
		backgroundColor: styleVars.colors.orange1,
	},
	customProduct: {
		backgroundColor: styleVars.colors.green1,
	},
	subCategoryIcon: {
		fontSize: 20,
	},
	back: {
		flexDirection: 'row',
		marginBottom: styleVars.verticalRhythm,
		marginTop: -styleVars.verticalRhythm,
	},
	backText: {
		color: styleVars.colors.white1,
	},
};

export default CategorySidebar;
