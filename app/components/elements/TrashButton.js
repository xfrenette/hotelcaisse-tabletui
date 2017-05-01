import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleVars from '../../styles/variables';

const propTypes = {
	onPress: PropTypes.func,
};

const defaultProps = {
	onPress: null,
};

class TrashButton extends Component {
	/**
	 * When we press on the button
	 */
	onPress() {
		if (this.props.onPress) {
			this.props.onPress();
		}
	}

	render() {
		return (
			<TouchableOpacity
				hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
				onPress={() => { this.onPress(); }}
			>
				<View>
					<Icon name="trash-o" style={styles.icon} />
				</View>
			</TouchableOpacity>
		);
	}
}

TrashButton.propTypes = propTypes;
TrashButton.defaultProps = defaultProps;

const styles = {
	icon: {
		color: styleVars.theme.dangerColor,
		fontSize: styleVars.baseFontSize + 4,
	},
};

export default TrashButton;
