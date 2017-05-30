export default {
	POSTBatch: 'Lot du terminal de point de vente (TPV)',
	fields: {
		POSTRef: 'Numéro du lot',
		POSTAmount: 'Montant du lot',
		cashAmount: 'Billets et monnaies dans la caisse à la fermeture',
		total: 'Total',
	},
	inputErrors: {
		POSTRef: 'Veuillez spécifier un numéro de référence',
		POSTAmount: 'Veuillez entrer un montant valide',
		cashAmount: 'Veuillez entrer un montant valide',
	},
	actions: {
		close: 'Fermer la caisse',
	},
	messages: {
		closed: 'Caisse fermée',
	},
};
