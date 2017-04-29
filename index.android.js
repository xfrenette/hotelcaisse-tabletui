import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import UI from './app/containers/UI';
import UIApp from './app/lib/UI';

let UIConfig = {};

if (__DEV__) {
	UIConfig = require('./env/dev/UIConfig');
}

export default class HotelCaisse extends Component {
	constructor(props) {
		super(props);

		this.ui = new UIApp(UIConfig);
		this.ui.init();
	}

	componentDidMount() {
		this.ui.start();
	}

	render() {
		return (
			<UI ui={this.ui} />
		);
	}
}

AppRegistry.registerComponent('HotelCaisse', () => HotelCaisse);
