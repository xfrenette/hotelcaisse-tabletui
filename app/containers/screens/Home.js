import React, { Component } from 'react';
import { Text } from 'react-native';
import { Link } from 'react-router-native';

class Home extends Component {
	render() {
		return <Link to="/register/open"><Text>Vers OpenRegister</Text></Link>;
	}
}

export default Home;
