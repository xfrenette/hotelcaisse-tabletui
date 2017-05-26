import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react/native';
import Localizer from 'hotelcaisse-app/dist/Localizer';
import CashMovement from 'hotelcaisse-app/dist/business/CashMovement';
import {
	Button,
	Message,
	Text,
	Title,
} from '../../elements';
import { Row, Cell } from '../../elements/table';
import {
	TopBar,
	BottomBar,
	Screen,
	MainContent,
	Container,
} from '../../layout';
import buttonLayouts from '../../../styles/buttons';
import tableStyles from '../../../styles/tables';
import layoutStyles from '../../../styles/layout';
import typographyStyles from '../../../styles/typography';
import AddModal from './AddModal';
import CashMovementRow from './CashMovementRow';

const propTypes = {
	onFinish: PropTypes.func,
	onAdd: PropTypes.func,
	onDelete: PropTypes.func,
	validate: PropTypes.func,
	cashMovements: PropTypes.arrayOf(PropTypes.instanceOf(CashMovement)),
	localizer: PropTypes.instanceOf(Localizer).isRequired,
};

const defaultProps = {
	onFinish: null,
	onAdd: null,
	onDelete: null,
	validate: null,
	cashMovements: [],
};

@observer
class ManageRegisterScreen extends Component {
	/**
	 * References to React Nodes
	 *
	 * @type {Object}
	 */
	nodeRefs = {};

	/**
	 * Called when press the "finish" button.
	 */
	onFinish() {
		if (this.props.onFinish) {
			this.props.onFinish();
		}
	}

	/**
	 * Called when we delete a CashMovement
	 *
	 * @param {CashMovement} cashMovement
	 */
	onDelete(cashMovement) {
		if (this.props.onDelete) {
			this.props.onDelete(cashMovement);
		}
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
	showModal() {
		this.nodeRefs.addModal.reset();
		this.nodeRefs.addModal.show();
	}

	/**
	 * Renders the rows of the cash movements table
	 *
	 * @return {Node}
	 */
	renderRows() {
		return this.props.cashMovements.map(cashMovement => (
			<CashMovementRow
				key={cashMovement.uuid}
				cashMovement={cashMovement}
				localizer={this.props.localizer}
				cellStyles={cellStyles}
				onDelete={() => { this.props.onDelete(cashMovement); }}
			/>
		));
	}

	/**
	 * Renders the empty message
	 *
	 * @return {Node}
	 */
	renderEmpty() {
		return (
			<Text style={typographyStyles.empty}>
				{ this.t('manageRegister.table.empty') }
			</Text>
		);
	}

	/**
	 * Renders the table of cash movements
	 *
	 * @return {Node}
	 */
	renderTable() {
		return (
			<View>
				<Row first>
					<Cell first style={cellStyles.time}>
						<Text style={tableStyles.header}>
							{ this.t('manageRegister.table.cols.time') }
						</Text>
					</Cell>
					<Cell style={cellStyles.note}>
						<Text style={tableStyles.header}>
							{ this.t('manageRegister.table.cols.note') }
						</Text>
					</Cell>
					<Cell last style={cellStyles.amount}>
						<Text style={tableStyles.header}>
							{ this.t('manageRegister.table.cols.amount') }
						</Text>
					</Cell>
				</Row>
				{ this.renderRows() }
				<Message type="info">{ this.t('messages.swipeLeftToDelete') }</Message>
			</View>
		);
	}

	render() {
		const hasCashMovements = this.props.cashMovements.length > 0;

		return (
			<Screen>
				<TopBar
					title={this.t('manageRegister.title')}
					onPressHome={() => { this.onFinish(); }}
				/>
				<ScrollView>
					<MainContent>
						<Container layout="oneColCentered">
							<Title style={layoutStyles.title}>{ this.t('manageRegister.table.title') }</Title>
							<View style={layoutStyles.block}>
								{ hasCashMovements ? this.renderTable() : this.renderEmpty() }
							</View>
							<View style={styles.actions}>
								<Button
									title={this.t('manageRegister.actions.add')}
									onPress={() => { this.showModal(); }}
								/>
							</View>
						</Container>
					</MainContent>
					<AddModal
						ref={(node) => { this.nodeRefs.addModal = node; }}
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
	actions: {
		alignItems: 'flex-start',
	},
};

const cellStyles = {
	time: {
		width: 80,
	},
	note: {
		flex: 1,
	},
	amount: {
		width: 160,
		alignItems: 'flex-end',
	},
};

ManageRegisterScreen.propTypes = propTypes;
ManageRegisterScreen.defaultProps = defaultProps;

export default ManageRegisterScreen;
