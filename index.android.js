import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import UI from './app/containers/UI';
import UIApp from './app/lib/UI';
import DEVConfig from './env/dev/UIConfig';
import PRODConfig from './env/prod/UIConfig';

const UIConfig = __DEV__ ? DEVConfig : PRODConfig;

export default class HIRDLPOS extends Component {
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

AppRegistry.registerComponent('HIRDLPOS', () => HIRDLPOS);
