import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import PropTypes from 'prop-types';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { View } from 'react-native';
import {
	Button,
	Text,
} from '../../elements';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';

const propTypes = {
	order: PropTypes.instanceOf(Order).isRequired,
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	onEditRoomSelections: PropTypes.func,
};

const defaultProps = {
	onEditRoomSelections: null,
};

@observer
class RoomSelections extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	render() {
		const checkInDate = this.props.order.earliestCheckInDate;
		const checkOutDate = this.props.order.latestCheckOutDate;
		const formattedCheckIn = this.props.localizer.formatDate(checkInDate, { skeleton: 'MMMEd' });
		const formattedCheckOut = this.props.localizer.formatDate(checkOutDate, { skeleton: 'MMMEd' });
		const rooms = this.props.order.roomSelections.map(rs => rs.room.name);

		return (
			<View style={styles.editableBlock}>
				<View style={styles.editableBlockData}>
					<View style={styles.checkInOuts}>
						<View style={styles.checkInOut}>
							<Text style={styles.checkInOutTitle}>
								{ this.t('roomSelections.checkinShort') }
							</Text>
							<Text>{ formattedCheckIn }</Text>
						</View>
						<View style={styles.checkInOut}>
							<Text style={styles.checkInOutTitle}>
								{ this.t('roomSelections.checkoutShort') }
							</Text>
							<Text>{ formattedCheckOut }</Text>
						</View>
						<View style={styles.rooms}>
							<Text style={styles.room}>{ rooms.join(', ') }</Text>
						</View>
					</View>
				</View>
				<Button
					layout={buttonLayouts.text}
					title={this.t('actions.edit')}
					onPress={this.props.onEditRoomSelections}
				/>
			</View>
		);
	}
}

const styles = {
	checkInOuts: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
	},
	rooms: {
		marginRight: styleVars.horizontalRhythm * 2,
	},
	checkInOut: {
		marginRight: styleVars.horizontalRhythm * 2,
	},
	checkInOutTitle: {
		fontWeight: 'bold',
	},
	room: {
		fontWeight: 'bold',
	},
	editableBlock: {
		flexDirection: 'row',
	},
	editableBlockData: {
		flex: 1,
	},
};

RoomSelections.propTypes = propTypes;
RoomSelections.defaultProps = defaultProps;

export default RoomSelections;
