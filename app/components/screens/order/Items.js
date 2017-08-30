import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Item from 'hotelcaisse-app/dist/business/Item';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	Item: PropTypes.func.isRequired,
	oldItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
	newItems: PropTypes.arrayOf(PropTypes.instanceOf(Item)),
};

const defaultProps = {
	oldItems: [],
	newItems: [],
};

@observer
class Items extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	renderOldItems() {
		const ItemRow = this.props.Item;

		return this.props.oldItems.map((item, index) => {
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={index === 0}
					swipeType="refund"
					editable={false}
				/>
			);
		});
	}

	renderNewItems(first = false) {
		const ItemRow = this.props.Item;

		return this.props.newItems.map((item, index) => {
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={first && index === 0}
					swipeType="delete"
					editable={true}
				/>
			);
		});
	}

	render() {
		return (
			<View>
				{ this.renderOldItems() }
				{ this.renderNewItems(this.props.oldItems.length === 0) }
			</View>
		);
	}
}

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
