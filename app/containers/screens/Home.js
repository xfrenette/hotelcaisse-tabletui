import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Link } from 'react-router-native';

class Home extends Component {
	render() {
		return (
			<View style={{ backgroundColor: '#abcdef', flex: 1 }}>
				<Link to="/register/open"><Text>Vers OpenRegister</Text></Link>
			</View>
		);
	}
}

export default Home;
