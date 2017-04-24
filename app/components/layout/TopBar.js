import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styleVars from '../../styles/variables';

const styles = {
	TopBar: {
		backgroundColor: styleVars.theme.mainColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: styleVars.verticalRhythm * 2,
		paddingHorizontal: styleVars.sidePadding,
		borderTopWidth: 1,
		borderTopColor: styleVars.theme.lighter,
	},
	TopBarSideIcon: {
		width: 3 * styleVars.verticalRhythm,
	},
	TopBarText: {
		color: styleVars.theme.overlayColor,
		fontSize: styleVars.rem(1.2),
	},
	TopBarIcon: {
		color: styleVars.theme.overlayColor,
		fontSize: styleVars.verticalRhythm,
	},
};

class TopBar extends Component {
	onBackHome() {
		ToastAndroid.show('Retour à l\'accueil', ToastAndroid.SHORT);
	}

	renderBackHome() {
		return (
			<TouchableOpacity style={styles.TopBarSideIcon} onPress={this.onBackHome}>
				<Icon name="home" style={styles.TopBarIcon} />
			</TouchableOpacity>
		);
	}

	render() {
		let backHome = <Text />;
		if (this.props.backHome) {
			backHome = this.renderBackHome();
		}

		return (
			<View style={styles.TopBar} elevation={1}>
				{ backHome }
				<Text style={styles.TopBarText}>
					{ this.props.title }
				</Text>
				<View style={styles.TopBarSideIcon} />
			</View>
		);
	}
}

TopBar.propTypes = {
	title: React.PropTypes.string,
	backHome: React.PropTypes.bool,
};

TopBar.defaultProps = {
	backHome: true,
};

export default TopBar;
