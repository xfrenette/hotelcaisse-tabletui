import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Item from 'hotelcaisse-app/dist/business/Item';
import ItemRow from './Item';


const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	items: PropTypes.arrayOf(PropTypes.instanceOf(Item)).isRequired,
	isNew: PropTypes.bool,
};

const defaultProps = {
	isNew: true,
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

	render() {
		const items = this.props.items.map((item, index) => {
			//tmp
			if (index === 1) {
				item.quantity = -1 * item.quantity;
			}
			//end tmp
			return (
				<ItemRow
					key={item.uuid}
					item={item}
					localizer={this.props.localizer}
					isFirst={index === 0}
					swipeType="delete"
					editable={false}
				/>
			);
		});

		return (
			<View>
				{ items }
			</View>
		);
	}
}

const viewStyles = {

};

const textStyles = {

};

Items.propTypes = propTypes;
Items.defaultProps = defaultProps;

export default Items;
