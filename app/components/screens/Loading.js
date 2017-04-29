import React from 'react';
import { View, Text } from 'react-native';

const Loading = () => (
	<View style={styles.loading}>
		<Text>Chargement...</Text>
	</View>
);

const styles = {
	loading: {
		backgroundColor: 'yellow',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
};

export default Loading;
