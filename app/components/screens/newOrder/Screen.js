import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import ProductCategory from 'hotelcaisse-app/dist/business/ProductCategory';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../../layout';
import { Button, Text, BottomBarBackButton } from '../../elements';
import CategorySidebar from './CategorySidebar';
import buttonLayouts from '../../../styles/buttons';

const propTypes = {
	rootProductCategory: PropTypes.instanceOf(ProductCategory),
};

const defaultProps = {
	rootProductCategory: null,
};

class NewOrderScreen extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	renderSidebarContent() {

	}

	render() {
		return (
			<Screen>
				<TopBar
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
				<View style={{ flex: 1 }}>
					<View style={styles.screenContent}>
						<ScrollView style={styles.screenMain}>
							<MainContent>
								<Text>New order</Text>
							</MainContent>
						</ScrollView>
						<CategorySidebar
							style={styles.screenSidebar}
							rootProductCategory={this.props.rootProductCategory}
							backButtonLabel={this.t('actions.back')}
							emptyLabel={this.t('order.categories.empty')}
							onProductPress={(product) => { console.log(product.name); }}
						/>
					</View>
				</View>
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

NewOrderScreen.propTypes = propTypes;
NewOrderScreen.defaultProps = defaultProps;

const styles = {
	screenContent: {
		flexDirection: 'row',
		flex: 1,
	},
	screenMain: {
		flexGrow: 1,
	},
	screenSidebar: {
		flexGrow: 1,
	},
};

export default NewOrderScreen;
