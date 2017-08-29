import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { Text, Title } from '../../elements';
import { MainContent, Screen, TopBar } from '../../layout';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';
import Button from '../../elements/Button';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
	canAddTransaction: PropTypes.bool,
	CategorySidebar: PropTypes.func.isRequired,
	BottomBar: PropTypes.func.isRequired,
	Items: PropTypes.func.isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	isNew: false,
	canAddTransaction: false,
	onPressHome: null,
	onDone: null
};

class OrderScreen extends Component {
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

	render() {
		const CategorySidebar = this.props.CategorySidebar;
		const BottomBar = this.props.BottomBar;
		const Items = this.props.Items;

		return (
			<Screen>
				<TopBar
					title={this.t('screens.order.title')}
					onPressHome={this.props.onPressHome}
				/>
				<View style={viewStyles.container}>
					<View style={viewStyles.col1}>
						<ScrollView style={viewStyles.scrollView}>
							<MainContent withSidebar expanded>
								<View style={viewStyles.orderActions}>
									<View style={viewStyles.orderActionsButton}>
										<Button
											layout={[buttonLayouts.text]}
											title="Envoyer par courriel"
										/>
									</View>
									<View style={viewStyles.orderActionsButton}>
										<Button
											layout={[buttonLayouts.text]}
											title="Notes (*)"
										/>
									</View>
								</View>
								<View style={[viewStyles.header, layoutStyles.block]}>
									<View style={viewStyles.customer}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
											<Text style={textStyles.customerEmphasis}>Xavier Frenette</Text>
										</View>
										<View>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
												<View style={{ flex: 1 }}>
													<View style={{ flexDirection: 'row', alignItems: 'center'}}>
														<Icon name="phone" style={{ paddingRight: 10 }} />
														<Text>514-799-7770</Text>
													</View>
													<View style={{ flexDirection: 'row', alignItems: 'center'}}>
														<Icon name="envelope" style={{ paddingRight: 10 }} />
														<Text style={textStyles.customerLink}>xavier@xavierfrenette.com</Text>
													</View>
												</View>
												<View style={{ flex: 1 }}>
													<View style={{ flexDirection: 'row', alignItems: 'center'}}>
														<Icon name="bed" style={{ paddingRight: 10 }} />
														<Text style={{ fontWeight: 'bold' }}>Chambre 1, Chambre 7.1</Text>
													</View>
													<View style={{ flexDirection: 'row', alignItems: 'center'}}>
														<Icon name="sign-in" style={{ paddingRight: 10 }} />
														<Text>mar. 8 juil.</Text>
														<Icon name="sign-out" style={{ paddingLeft: 20, paddingRight: 10 }} />
														<Text>jeu. 10 juil.</Text>
													</View>
												</View>
											</View>
										</View>
										<View style={{ marginTop: styleVars.verticalRhythm / 2 }}>
											<Button
												layout={[buttonLayouts.text]}
												title="Modifier les informations"
											/>
										</View>
									</View>
								</View>

								<View style={layoutStyles.block}>
									<Items />
								</View>
								<View style={layoutStyles.block}>
									<Title style={layoutStyles.title}>Crédits</Title>
									<View style={{ alignItems: 'flex-start' }}>
										<Button title="Ajouter un crédit" />
									</View>
								</View>
								<View>
									<Title>Paiements</Title>
								</View>
							</MainContent>
						</ScrollView>
						<BottomBar style={viewStyles.totalBar} />
					</View>
					<CategorySidebar style={viewStyles.sidebar}/>
				</View>
			</Screen>
		);
	}
}

const viewStyles = {
	container: {
		flexDirection: 'row',
		flex: 1,
	},
	col1: {
		flex: 1,
	},
	sidebar: {
		width: 300,
	},
	scrollView: {
		flex: 1,
		flexGrow: 1,
	},
	totalBar: {
		flexShrink: 1,
	},
	orderActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	orderActionsButton: {
		marginLeft: styleVars.horizontalRhythm,
	},
	header: {
		marginBottom: styleVars.verticalRhythm / 2,
		borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.lineColor,
		paddingBottom: styleVars.verticalRhythm,
	},
	customer: {
		flex: 1,
	},
};

const textStyles = {
	customerEmphasis: {
		fontWeight: 'bold',
		//color: styleVars.theme.mainColor,
		fontSize: styleVars.bigFontSize,
	},
	customerLink: {
		textDecorationLine: 'underline',
	},
};

OrderScreen.propTypes = propTypes;
OrderScreen.defaultProps = defaultProps;

export default OrderScreen;
