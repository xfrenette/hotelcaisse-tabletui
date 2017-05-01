export default {
	title: 'Fermeture de caisse',
	fields: {
		POSTRef: 'Numéro de lot du terminal de point de vente (TPV)',
		POSTAmount: 'Montant total du lot du TPV',
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
		closingCanceled: 'Fermeture de caisse annulée',
		closed: 'Caisse fermée',
		externallyOpened: 'La caisse vient d\'être ouverte depuis un autre terminal',
		fieldsInvalid: {
			title: 'Champs invalides',
			content: 'Assurez-vous de saisir le numéro de lot, le total du lot et de bien indiquer le montant dans la caisse à la fermeture.',
		},
	},
};
