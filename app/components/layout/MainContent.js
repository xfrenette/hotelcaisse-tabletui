import React, { Component } from 'react';
import { View } from 'react-native';
import styleVars from '../../styles/variables';

const styles = {
	MainContent: {
		paddingHorizontal: styleVars.mainContentSidePadding,
		paddingVertical: 2 * styleVars.horizontalRhythm,
	},
};

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
