import React, { Component } from 'react';
import { View } from 'react-native';
import { STATES } from 'hotelcaisse-app/dist/business/Register';
import { Button } from '../elements';

const propTypes = {
	registerState: React.PropTypes.number.isRequired,
	onLinkPressed: React.PropTypes.func,
};

const defaultProps = {
	onLinkPressed: null,
};

class Home extends Component {
	onLinkPressed(key) {
		if (this.props.onLinkPressed) {
			this.props.onLinkPressed(key);
		}
	}

	render() {
		const mainButtons = [];
		const subButtons = [];

		if (this.props.registerState === STATES.OPENED) {
			mainButtons.push((
				<Button
					key="new-order"
					onPress={() => { this.onLinkPressed('new-order'); }}
					title="Nouvelle inscription"
				/>
			));
			subButtons.push((
				<Button
					key="manage-register"
					onPress={() => { this.onLinkPressed('manage-register'); }}
					title="Gestion de caisse"
				/>
			));
			subButtons.push((
				<Button
					key="close-register"
					onPress={() => { this.onLinkPressed('close-register'); }}
					title="Fermer la caisse"
				/>
			));
		} else {
			mainButtons.push((
				<Button
					key="open-register"
					onPress={() => { this.onLinkPressed('open-register'); }}
					title="Ouvrir la caisse"
				/>
			));
		}

		mainButtons.push((
			<Button
				key="find-order"
				onPress={() => { this.onLinkPressed('find-order'); }}
				title="Retrouver une inscription"
			/>
		));

		mainButtons.push((
			<Button
				key="test"
				onPress={() => { this.onLinkPressed('test'); }}
				title="Test"
			/>
		));

		return (
			<View>
				{ mainButtons }
				{ subButtons }
			</View>
		);
	}
}

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
