import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { MainContent, Screen, TopBar } from '../../layout';
import styleVars from '../../../styles/variables';
import buttonLayouts from '../../../styles/buttons';
import layoutStyles from '../../../styles/layout';
import Button from '../../elements/Button';
import Title from '../../elements/Title';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
	canAddTransaction: PropTypes.bool,
	CategorySidebar: PropTypes.func.isRequired,
	BottomBar: PropTypes.func.isRequired,
	Items: PropTypes.func.isRequired,
	CreditsTransactions: PropTypes.func.isRequired,
	ModalCredit: PropTypes.func.isRequired,
	ModalTransaction: PropTypes.func.isRequired,
	Customer: PropTypes.func.isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
	onCreditEdit: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	isNew: false,
	canAddTransaction: false,
	onPressHome: null,
	onDone: null,
	onCreditEdit: null,
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

	onCreditEdit(credit) {
		if (this.props.onCreditEdit) {
			this.props.onCreditEdit(credit);
		}
	}

	onTransactionEdit(transaction) {
		if (this.props.onTransactionEdit) {
			this.props.onTransactionEdit(transaction);
		}
	}

	render() {
		const CategorySidebar = this.props.CategorySidebar;
		const BottomBar = this.props.BottomBar;
		const Items = this.props.Items;
		const CreditsTransactions = this.props.CreditsTransactions;
		const ModalCredit = this.props.ModalCredit;
		const ModalTransaction = this.props.ModalTransaction;
		const Customer = this.props.Customer;

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
									<Customer />
								</View>
								<View style={layoutStyles.section}>
									<Items />
								</View>
								<View>
									<Title style={layoutStyles.title}>Transactions et crédits</Title>
									<CreditsTransactions
										onCreditEdit={(credit) => { this.onCreditEdit(credit); }}
									/>
								</View>
							</MainContent>
						</ScrollView>
						<BottomBar
							style={viewStyles.totalBar}
							onCreditAdd={() => { this.onCreditEdit(null); }}
							onTransactionAdd={() => { this.onTransactionEdit(null); }}
						/>
					</View>
					<CategorySidebar style={viewStyles.sidebar}/>
				</View>
				<ModalCredit />
				<ModalTransaction />
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
		//borderBottomWidth: 2,
		borderBottomColor: styleVars.theme.lineColor,
		paddingBottom: styleVars.verticalRhythm,
	},
};

const textStyles = {
};

OrderScreen.propTypes = propTypes;
OrderScreen.defaultProps = defaultProps;

export default OrderScreen;
