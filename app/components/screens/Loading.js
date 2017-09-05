import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading = () => (
	<View style={styles.loading}>
		<ActivityIndicator size="large" />
	</View>
);

const styles = {
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
};

export default Loading;
