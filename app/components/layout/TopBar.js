import React, { Component } from 'react';
import {	View,	TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from '../elements';
import styleVars from '../../styles/variables';

const propTypes = {
	title: React.PropTypes.string,
	backHome: React.PropTypes.bool,
	onPressHome: React.PropTypes.func,
};

const defaultProps = {
	title: null,
	backHome: true,
	onPressHome: null,
};

class TopBar extends Component {
	onPressHome() {
		if (this.props.onPressHome) {
			this.props.onPressHome();
		}
	}

	renderBackHome() {
		return (
			<TouchableOpacity style={styles.sideIcon} onPress={() => { this.onPressHome(); }}>
				<Icon name="home" style={styles.icon} />
			</TouchableOpacity>
		);
	}

	render() {
		let backHome = <View />;
		if (this.props.backHome) {
			backHome = this.renderBackHome();
		}

		return (
			<View style={styles.topBar} elevation={1}>
				{ backHome }
				<Text style={styles.text}>
					{ this.props.title }
				</Text>
				<View style={styles.sideIcon} />
			</View>
		);
	}
}

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

const styles = {
	topBar: {
		backgroundColor: styleVars.theme.mainColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: styleVars.verticalRhythm * 2,
		paddingHorizontal: styleVars.sidePadding,
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lighter,
	},
	sideIcon: {
		width: 3 * styleVars.verticalRhythm,
	},
	text: {
		color: styleVars.theme.overlayColor,
		fontSize: styleVars.bigFontSize,
	},
	icon: {
		color: styleVars.theme.overlayColor,
		fontSize: styleVars.verticalRhythm,
	},
};

export default TopBar;
