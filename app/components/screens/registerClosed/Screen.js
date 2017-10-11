import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Register from 'hotelcaisse-app/dist/business/Register';
import {
	Button,
	Text,
	Title,
} from '../../elements';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Container,
} from '../../layout';
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';
import styleVars from '../../../styles/variables';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer).isRequired,
	cashFloat: PropTypes.number.isRequired,
	register: PropTypes.instanceOf(Register).isRequired,
	onHome: PropTypes.func,
};

const defaultProps = {
	onHome: null,
};

class RegisterClosedScreen extends Component {
	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @param {Object} params
	 * @return {String}
	 */
	t(path, params = {}) {
		return this.props.localizer.t(path, params);
	}

	render() {
		const register = this.props.register;

		const cashFloatText = this.props.localizer.formatCurrency(this.props.cashFloat);
		const totalCash = register.closingCash;
		const totalCashText = this.props.localizer.formatCurrency(totalCash.toNumber());
		const postAmountText = this.props.localizer.formatCurrency(register.POSTAmount.toNumber());
		const total = totalCash.add(register.POSTAmount);
		const totalText = this.props.localizer.formatCurrency(total.toNumber());
		const dateText = this.props.localizer.formatDate(register.closedAt, { skeleton: 'yyyyMMMd' })

		return (
			<Screen>
				<TopBar
					title={this.t('screens.register.closed.title')}
					onPressHome={this.props.onHome}
				/>
				<MainContent style={viewStyles.mainContent}>
					<Container layout="oneColCentered">
						<View style={layoutStyles.block}>
							<Title style={layoutStyles.title}>{ this.t('registerClosed.instructions.title') }</Title>
							<Text>{ this.t('registerClosed.instructions.message', { cashLeft: cashFloatText}) }</Text>
						</View>
						<View style={viewStyles.graphic}>
							<View style={viewStyles.bill}>
								<Text style={textStyles.amount}>{ totalCashText }</Text>
							</View>
							<Icon style={textStyles.icon} name="arrow-down" />
							<View style={viewStyles.envelope}>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.number') }</Text>
									<Text style={textStyles.value}>{ register.number }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.date') }</Text>
									<Text style={textStyles.value}>{ dateText }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.employee') }</Text>
									<Text style={textStyles.value}>{ register.employee }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.POSTRef') }</Text>
									<Text style={textStyles.value}>{ register.POSTRef }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.cashTotal') }</Text>
									<Text style={textStyles.value}>{ totalCashText }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.POSTTotal') }</Text>
									<Text style={textStyles.value}>{ postAmountText }</Text>
								</View>
								<View style={viewStyles.row}>
									<Text style={textStyles.label}>{ this.t('registerClosed.labels.total') }</Text>
									<Text style={textStyles.value}>{ totalText }</Text>
								</View>
							</View>
						</View>
					</Container>
				</MainContent>
				<BottomBar>
					<View />
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.primary}
						onPress={this.props.onDone}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

const viewStyles = {
	mainContent: {
		flex: 1,
	},
	graphic: {
		alignItems: 'center',
	},
	bill: {
		borderWidth: 5,
		borderColor: styleVars.colors.green2,
		width: styleVars.horizontalRhythm * 8,
		height: styleVars.verticalRhythm * 3,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: styleVars.verticalRhythm,
	},
	envelope: {
		marginTop: styleVars.verticalRhythm,
		width: styleVars.horizontalRhythm * 15,
		borderWidth: 5,
		borderColor: styleVars.colors.grey1,
		padding: styleVars.verticalRhythm,
	},
	row: {
		flexDirection: 'row',
	},
};

const textStyles = {
	amount: {
		color: styleVars.colors.green2,
		fontSize: styleVars.verticalRhythm * 1.5,
		lineHeight: styleVars.verticalRhythm * 2,
		fontWeight: 'bold',
	},
	icon: {
		fontSize: styleVars.verticalRhythm * 2,
		color: styleVars.colors.grey2,
	},
	label: {
		width: 125,
		fontWeight: 'bold',
	},
	value: {

	},
};

RegisterClosedScreen.propTypes = propTypes;
RegisterClosedScreen.defaultProps = defaultProps;

export default RegisterClosedScreen;
