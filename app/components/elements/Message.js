import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Text from './Text';
import styleVars from '../../styles/variables';

const colors = {
	info: styleVars.colors.blue1,
	warning: styleVars.colors.blue1,
	error: styleVars.colors.blue1,
};

const styles = StyleSheet.create({
	MessageContainer: {
		flexDirection: 'row',
		marginBottom: 2 * styleVars.baseBlockMargin,
		left: -27,
	},
	Message: {
		borderLeftWidth: 4,
		paddingLeft: 10,
		paddingVertical: styleVars.verticalRhythm / 2,
		overflow: 'visible',
		flex: 1,
	},
	MessageIcon: {
		marginRight: 12,
		fontSize: 18,
		paddingTop: styleVars.verticalRhythm / 2 + 3,
	}
});

class Message extends Component {
	render() {
		const viewStyle = [styles.Message];
		const textStyle = {};
		let icon;

		switch(this.props.type) {
			case 'info':
				textStyle.color = colors.info;
				viewStyle.push({ borderLeftColor: colors.info });
				icon = <Icon name="info-circle" style={[textStyle, styles.MessageIcon]} />
				break;
			case 'warning':
				textStyle.color = colors.warning;
				viewStyle.push({ borderLeftColor: colors.warning });
				icon = <Icon name="info-circle" style={textStyle} />
				break;
			case 'error':
				textStyle.color = colors.error;
				viewStyle.push({ borderLeftColor: colors.error });
				icon = <Icon name="info-circle" style={textStyle} />
				break;
		}

		return (
			<View style={styles.MessageContainer}>
				{ icon }
				<View style={viewStyle}>
					<Text style={textStyle}>{ this.props.children }</Text>
				</View>
			</View>
		);
	}
}

Message.propTypes = {
	style: React.PropTypes.object,
	type: React.PropTypes.oneOf(['info', 'warning', 'error']),
};

Message.defaultProps = {
	type: 'info',
};

export default Message;
