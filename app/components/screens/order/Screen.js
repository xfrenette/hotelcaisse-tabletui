import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, } from 'react-native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import Order from 'hotelcaisse-app/dist/business/Order';
import { MainContent, Screen, TopBar } from '../../layout';
import styleVars from '../../../styles/variables';
import layoutStyles from '../../../styles/layout';
import Title from '../../elements/Title';

const propTypes = {
	localizer: PropTypes.instanceOf(Localizer),
	order: PropTypes.instanceOf(Order),
	isNew: PropTypes.bool,
	canAddTransaction: PropTypes.bool,
	hasTransactionsOrCredits: PropTypes.bool,
	CategorySidebar: PropTypes.func.isRequired,
	BottomBar: PropTypes.func.isRequired,
	Items: PropTypes.func.isRequired,
	CreditsTransactions: PropTypes.func.isRequired,
	ModalCredit: PropTypes.func.isRequired,
	ModalTransaction: PropTypes.func.isRequired,
	ModalCustomer: PropTypes.func,
	ModalNotes: PropTypes.func,
	ModalCustomProduct: PropTypes.func,
	Customer: PropTypes.func.isRequired,
	Header: PropTypes.func.isRequired,
	onPressHome: PropTypes.func,
	onDone: PropTypes.func,
	onCreditEdit: PropTypes.func,
	onTransactionEdit: PropTypes.func,
	onCustomerEdit: PropTypes.func,
	onNotesEdit: PropTypes.func,
};

const defaultProps = {
	localizer: null,
	isNew: false,
	hasTransactionsOrCredits: false,
	canAddTransaction: false,
	onPressHome: null,
	onDone: null,
	onCreditEdit: null,
	onTransactionEdit: null,
	onCustomerEdit: null,
	onNotesEdit: null,
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

	onCustomProductAdd() {
		if (this.props.onCustomProductEdit) {
			this.props.onCustomProductEdit(null);
		}
	}

	render() {
		const CategorySidebar = this.props.CategorySidebar;
		const BottomBar = this.props.BottomBar;
		const Items = this.props.Items;
		const CreditsTransactions = this.props.CreditsTransactions;
		const ModalCredit = this.props.ModalCredit;
		const ModalTransaction = this.props.ModalTransaction;
		const ModalCustomer = this.props.ModalCustomer;
		const ModalNotes = this.props.ModalNotes;
		const ModalCustomProduct = this.props.ModalCustomProduct;
		const Customer = this.props.Customer;
		const Header = this.props.Header;
		const transactionCreditsTitle = this.props.hasTransactionsOrCredits
			? <Title style={layoutStyles.title}>{ this.t('order.transactions.label') }</Title>
			: null

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
								<View style={[viewStyles.header, layoutStyles.block]}>
									<Header onNotesEdit={this.props.onNotesEdit} />
									<Customer onCustomerEdit={this.props.onCustomerEdit} />
								</View>
								<View style={layoutStyles.section}>
									<Title style={layoutStyles.title}>
										{ this.t('order.items.label') }
									</Title>
									<Items
										onCustomProductEdit={this.props.onCustomProductEdit}
									/>
								</View>
								<View>
									{ transactionCreditsTitle }
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
							onCustomerEdit={this.props.onCustomerEdit}
						/>
					</View>
					<CategorySidebar
						style={viewStyles.sidebar}
						onCustomProductAdd={() => { this.onCustomProductAdd(); }}
					/>
				</View>
				<ModalCredit />
				<ModalTransaction />
				<ModalCustomer />
				<ModalNotes />
				<ModalCustomProduct />
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
	header: {
		marginBottom: styleVars.verticalRhythm,
	},
};

const textStyles = {
};

OrderScreen.propTypes = propTypes;
OrderScreen.defaultProps = defaultProps;

export default OrderScreen;
