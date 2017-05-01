import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Text from './Text';
import styleVars from '../../styles/variables';

const propTypes = {
	type: PropTypes.oneOf(['info', 'warning', 'error']),
	children: PropTypes.node.isRequired,
};

const defaultProps = {
	type: 'info',
};

const Message = (props) => {
	const viewStyle = [styles.message];
	const textStyle = {};
	let icon;

	switch (props.type) {
		case 'warning':
			textStyle.color = colors.warning;
			viewStyle.push({ borderLeftColor: colors.warning });
			icon = <Icon name="info-circle" style={textStyle} />;
			break;
		case 'error':
			textStyle.color = colors.error;
			viewStyle.push({ borderLeftColor: colors.error });
			icon = <Icon name="info-circle" style={textStyle} />;
			break;
		case 'info':
		default:
			textStyle.color = colors.info;
			viewStyle.push({ borderLeftColor: colors.info });
			icon = <Icon name="info-circle" style={[textStyle, styles.icon]} />;
			break;
	}

	return (
		<View style={styles.container}>
			{ icon }
			<View style={viewStyle}>
				<Text style={textStyle}>{ props.children }</Text>
			</View>
		</View>
	);
};

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

const colors = {
	info: styleVars.colors.blue1,
	warning: styleVars.colors.blue1,
	error: styleVars.colors.blue1,
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: styleVars.baseBlockMargin * 2,
		left: -27,
	},
	message: {
		borderLeftWidth: 4,
		paddingLeft: 10,
		paddingVertical: styleVars.verticalRhythm / 2,
		overflow: 'visible',
		flex: 1,
	},
	icon: {
		marginRight: 12,
		fontSize: 18,
		paddingTop: (styleVars.verticalRhythm / 2) + 3,
	},
});

export default Message;
