import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import {
	Button,
	Title,
	Text,
	TrashButton,
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
} from '../../layout';
import buttonLayouts from '../../../styles/buttons';
import styleVars from '../../../styles/variables';
import tableStyles from '../../../styles/tables';
import typographyStyles from '../../../styles/typography';
import AddModal from './AddModal';

const propTypes = {
	onFinish: PropTypes.func,
	onAdd: PropTypes.func,
	onDeleteCashMovement: PropTypes.func,
	validate: PropTypes.func,
	cashMovements: PropTypes.arrayOf(PropTypes.instanceOf(CashMovement)),
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onFinish: null,
	onAdd: null,
	onDeleteCashMovement: null,
	validate: null,
	cashMovements: [],
};

@inject('ui')
@observer
class ManageRegisterScreen extends Component {
	/**
	 * References to React Nodes
	 *
	 * @type {Object}
	 */
	nodeRefs = {};
	/**
	 * Reference to the add modal
	 *
	 * @type {Node}
	 */
	addModal = null;

	/**
	 * Called when press the "finish" button.
	 */
	onFinish() {
		if (this.props.onFinish) {
			this.props.onFinish();
		}
	}

	/**
	 * Called when pressing the "add out" button. Shows the modal.
	 */
	onAddOut() {
		this.showModal();
	}

	/**
	 * Called when pressing the "add in" button. Shows the modal.
	 */
	onAddIn() {
		this.showModal();
	}

	/**
	 * Simple alias to this.props.localizer.t
	 *
	 * @param {String} path
	 * @return {String}
	 */
	t(path) {
		return this.props.localizer.t(path);
	}

	/**
	 * Shows the modal
	 */
	showModal(type) {
		this.addModal.reset();
		this.addModal.show(type);
	}

	/**
	 * Called when the user presses the trash icon of a CashMovement line.
	 *
	 * @param {CashMovement} cashMovement
	 */
	onPressDeleteCashMovement(cashMovement) {
		this.showDeleteConfirm(cashMovement);
	}
	/**
	 * Called when the user confirms the suppression in the confirm alert.
	 *
	 * @param {CashMovement} cashMovement
	 */
	onConfirmDelete(cashMovement) {
		if (this.props.onDeleteCashMovement) {
			this.props.onDeleteCashMovement(cashMovement);
		}
	}

	/**
	 * Returns all CashMovement of a certain type ('in' or 'out')
	 *
	 * @param {String} type 'in' or 'out'
	 * @return {Array}
	 */
	getCashMovements(type) {
		return this.props.cashMovements.filter((cashMovement) => {
			if (type === 'in') {
				return cashMovement.amount.isPositive();
			}

			return cashMovement.amount.isNegative();
		});
	}

	/**
	 * Renders the rows of CashMovement
	 *
	 * @param {Array} cashMovements
	 * @return {Component}
	 */
	renderCashMovementRows(cashMovements) {
		const rows = cashMovements.map((cashMovement, i) => {
			const isLast = i === cashMovements.length - 1;
			return this.renderCashMovementRow(cashMovement, isLast);
		});

		return (
			<View>{ rows }</View>
		);
	}

	/**
	 * Renders a single row of CashMovement.
	 *
	 * @param {CashMovement} cashMovement
	 * @param {Boolean} isLast
	 * @return {Component}
	 */
	renderCashMovementRow(cashMovement, isLast) {
		const absAmount = cashMovement.amount.abs().toNumber();
		const formattedAmount = this.props.localizer.formatCurrency(absAmount);

		return (
			<Row key={cashMovement.uuid} last={isLast}>
				<Cell first><Text>{ cashMovement.note }</Text></Cell>
				<Cell style={styles.priceCol}><Text>{ formattedAmount }</Text></Cell>
				<Cell last style={tableStyles.cellDelete}>
					<TrashButton onPress={() => { this.onPressDeleteCashMovement(cashMovement); }} />
				</Cell>
			</Row>
		);
	}

	render() {
		const movementsIn = this.getCashMovements('in');
		const movementsOut = this.getCashMovements('out');

		let movementsInRows = null;
		let movementsOutRows = null;

		if (!movementsIn.length) {
			movementsInRows = (
				<View style={styles.emptyMessage}>
					<Text style={typographyStyles.empty}>{ this.t('manageRegister.moneyIn.empty') }</Text>
				</View>
			);
		} else {
			movementsInRows = (
				<View style={styles.cashMovementsTable}>
					{ this.renderCashMovementRows(movementsIn) }
				</View>
			);
		}

		if (!movementsOut.length) {
			movementsOutRows = (
				<View style={styles.emptyMessage}>
					<Text style={typographyStyles.empty}>{ this.t('manageRegister.moneyOut.empty') }</Text>
				</View>
			);
		} else {
			movementsOutRows = (
				<View style={styles.cashMovementsTable}>
					{ this.renderCashMovementRows(movementsOut) }
				</View>
			);
		}

		return (
			<Screen>
				<TopBar
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
				<ScrollView>
					<MainContent>
						<View style={styles.inOutColumns}>
							<View style={[styles.inOutColumn, styles.inOutColumnFirst]}>
								<Title>{ this.t('manageRegister.moneyOut.title') }</Title>
								{ movementsOutRows }
								<View style={styles.actions}>
									<Button
										title={this.t('manageRegister.actions.addOut')}
										onPress={() => { this.onAddOut(); }}
									/>
								</View>
							</View>

							<View style={[styles.inOutColumn, styles.inOutColumnLast]}>
								<Title>{ this.t('manageRegister.moneyIn.title') }</Title>
								{ movementsInRows }
								<View style={styles.actions}>
									<Button
										title={this.t('manageRegister.actions.addIn')}
										onPress={() => { this.onAddIn(); }}
									/>
								</View>
							</View>
						</View>
					</MainContent>
					<AddModal
						ref={(node) => { this.addModal = node; }}
						localizer={this.props.localizer}
						validate={this.props.validate}
						onAdd={this.props.onAdd}
					/>
				</ScrollView>
				<BottomBar>
					<View />
					<Button
						title={this.t('actions.done')}
						layout={buttonLayouts.primary}
						onPress={() => { this.onFinish(); }}
					/>
				</BottomBar>
			</Screen>
		);
	}
}

const styles = {
	inOutColumns: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	inOutColumn: {
		marginHorizontal: styleVars.horizontalRhythm,
		flex: 1,
	},

	inOutColumnFirst: {
		marginLeft: 0,
	},

	inOutColumnLast: {
		marginRight: 0,
	},

	actions: {
		flexDirection: 'row',
	},

	priceCol: {
		alignItems: 'flex-end',
		flex: 0,
	},

	cashMovementsTable: {
		marginBottom: styleVars.baseBlockMargin,
	},

	emptyMessage: {
		marginVertical: styleVars.baseBlockMargin,
	},
};

ManageRegisterScreen.propTypes = propTypes;
ManageRegisterScreen.defaultProps = defaultProps;

export default ManageRegisterScreen;
