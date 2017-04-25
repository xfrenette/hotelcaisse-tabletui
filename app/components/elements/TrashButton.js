import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Text from './Text';
import styleVars from '../../styles/variables';

const styles = {
	Icon: {
		color: styleVars.theme.dangerColor,
		fontSize: styleVars.baseFontSize + 4,
	},
};

const propTypes = {
	onPress: React.PropTypes.func,
};

const defaultProps = {
	onPress: null,
};

class TrashButton extends Component {
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
					<Icon name="trash-o" style={styles.Icon} />
				</View>
			</TouchableOpacity>
		);
	}
}

TrashButton.propTypes = propTypes;
TrashButton.defaultProps = defaultProps;

export default TrashButton;
