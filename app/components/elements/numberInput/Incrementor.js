import React, { Component } from 'react';
import { TouchableHighlight, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleVars from '../../../styles/variables';

const propTypes = {
	type: PropTypes.oneOf([-1, 1]).isRequired,
	onPress: PropTypes.func,
};

const defaultProps = {
	onPress: () => {},
};

class Incrementor extends Component {
	onPress() {
		if (!this.props.onPress) {
			return;
		}

		requestAnimationFrame(() => {
			this.props.onPress();
		});
	}

	render() {
		const type = this.props.type;
		const iconName = type === 1 ? 'plus' : 'minus';
		const buttonStyle = [styles.button];

		if (type === 1) {
			buttonStyle.push(styles.more);
		} else {
			buttonStyle.push(styles.less);
		}

		const icon = <Icon name={iconName} style={styles.icon} />;

		return (
			<TouchableHighlight
				style={buttonStyle}
				underlayColor={styleVars.colors.grey1}
				onPress={() => { this.onPress(); }}
			>
				{ icon }
			</TouchableHighlight>
		);
	}
}

Incrementor.propTypes = propTypes;
Incrementor.defaultProps = defaultProps;

const incrementorButtonWidth = 30;

const styles = {
	button: {
		position: 'absolute',
		top: 1,
		height: styleVars.input.height - 2,
		justifyContent: 'center',
	},
	icon: {
		lineHeight: 10,
		fontSize: 12,
		width: incrementorButtonWidth,
		textAlign: 'center',
		alignSelf: 'center',
		color: styleVars.theme.mainColor,
	},
	more: {
		right: 1,
		borderLeftWidth: 1,
		borderLeftColor: styleVars.theme.lineColor,
	},
	less: {
		left: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.theme.lineColor,
	},
};

export default Incrementor;
