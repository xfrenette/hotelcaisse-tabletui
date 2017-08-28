import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import LocalStoragesScreen from '../../../components/screens/dev/LocalStorages';

@inject('ui', 'localizer', 'router')
@observer
class LocalStorages extends Component {
	@observable
	storagesContent = new Map();
	@observable
	loadingStorages = new Map();

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		if (this.props.localizer) {
			return this.props.localizer.t(path);
		}

		return path;
	}

	get storages() {
		return this.props.ui.settings.localStorages || {};
	}

	componentWillMount() {
		Object.keys(this.storages).forEach(key => { this.loadingStorages.set(key, true); });
	}

	componentDidMount() {
		Object.entries(this.storages).forEach(([key, storage]) => {
			storage.readRaw()
				.then(data => {
					this.loadingStorages.set(key, false);
					this.storagesContent.set(key, data);
				});
		});
	}

	componentWillUnmount() {
		this.storagesContent.clear();
		this.loadingStorages.clear();
	}

	reloadStorage(key) {
		if (this.storages[key]) {
			const storage = this.storages[key];
			this.loadingStorages.set(key, true);
			storage.readRaw()
				.then(data => {
					this.loadingStorages.set(key, false);
					this.storagesContent.set(key, data);
				});
		}
	}

	onPressHome() {
		this.props.router.replace('/');
	}

	onClearPress(key) {
		if (this.storages[key]) {
			this.storages[key].clear();
			this.reloadStorage(key);
		}
	}

	render() {
		return (
			<LocalStoragesScreen
				localizer={this.props.localizer}
				storages={Object.keys(this.storages)}
				storagesContent={this.storagesContent.toJS()}
				loadingStorages={this.loadingStorages.toJS()}
				onPressHome={() => { this.onPressHome(); }}
				onClearPress={(key) => { this.onClearPress(key); }}
			/>
		);
	}
}

export default LocalStorages;
