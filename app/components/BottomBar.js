import React, { Component } from 'react';
import {
	View,
	Text,
 } from 'react-native';
import styles from '../styles';

class BottomBar extends Component {
	render() {
		return (
			<View style={styles.BottomBar}>
				{ this.props.children }
			</View>
		);
	}
}

export default BottomBar;
