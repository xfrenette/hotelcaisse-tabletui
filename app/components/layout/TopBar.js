import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleVars from '../../styles/variables';

const propTypes = {
	title: React.PropTypes.string,
	backHome: React.PropTypes.bool,
};

const defaultProps = {
	title: null,
	backHome: true,
};

class TopBar extends Component {
	onBackHome() {
		ToastAndroid.show('Retour à l\'accueil', ToastAndroid.SHORT);
	}

	renderBackHome() {
		return (
			<TouchableOpacity style={styles.sideIcon} onPress={this.onBackHome}>
				<Icon name="home" style={styles.icon} />
			</TouchableOpacity>
		);
	}

	render() {
		let backHome = <Text />;
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
