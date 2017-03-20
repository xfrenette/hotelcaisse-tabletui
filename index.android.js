import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './app/containers/App';
import createRoutes from './app/config/routes';

export default class HotelCaisse extends Component {
	render() {
		return (
			<App routes={createRoutes()} />
		);
	}
}

AppRegistry.registerComponent('HotelCaisse', () => HotelCaisse);
