import React, { Component } from 'react';
import { inject } from 'mobx-react/native';
import ComponentElement from '../../../components/screens/order/CategorySidebar';

@inject('business', 'localizer')
class CategorySidebar extends Component {
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
			<ComponentElement
				showCustomProduct={true}
				backButtonLabel={this.t('actions.back')}
				emptyLabel={this.t('order.categories.empty')}
				customProductLabel={this.t('order.customProduct')}
				rootProductCategory={this.props.business.rootProductCategory}
				{...this.props}
			/>
		);
	}
}

export default CategorySidebar;
