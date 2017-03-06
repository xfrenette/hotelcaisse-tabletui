import React, { Component } from 'react';
import { View } from 'react-native';
import styles from '../../styles';

class MainContent extends Component {
	render() {
		return (
			<View style={styles.MainContent}>
				{ this.props.children }
			</View>
		);
	}
}

export default MainContent;
