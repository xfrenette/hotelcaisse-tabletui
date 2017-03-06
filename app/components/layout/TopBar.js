import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ToastAndroid,
 } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';

class TopBar extends Component {
	onBackHomePressed() {
		ToastAndroid.show('Retour à l\'accueil', ToastAndroid.SHORT);
	}

	renderBackHome() {
		return (
			<TouchableOpacity style={styles.TopBarSideIcon} onPress={this.onBackHomePressed}>
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
