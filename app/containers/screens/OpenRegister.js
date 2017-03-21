import React, { Component } from 'react';
import { Text } from 'react-native';
import { Link } from 'react-router-native';

class OpenRegister extends Component {
	render() {
		return <Link to="/"><Text>Vers Home</Text></Link>;
	}
}

export default OpenRegister;
