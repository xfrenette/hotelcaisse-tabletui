export default {
	fields: {
		employee: 'Nom de l\'employé(e)',
		cashAmount: 'Billets et monnaies dans la caisse à l\'ouverture',
		total: 'Total',
	},
	inputErrors: {
		employee: 'Veuillez entrer un nom',
		cashAmount: 'Veuillez entrer un montant valide',
	},
	actions: {
		open: 'Ouvrir la caisse',
	},
	messages: {
		openingCanceled: 'Ouverture de caisse annulée',
		opened: 'Caisse ouverte',
		externallyOpened: 'La caisse vient d\'être ouverte depuis un autre terminal',
		fieldsInvalid: {
			title: 'Champs invalides',
			content: 'Assurez-vous de saisir le nom de l\'employée et de bien indiquer le montant dans la caisse à l\'ouverture.',
		},
	},
};
