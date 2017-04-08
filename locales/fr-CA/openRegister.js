export default {
	title: 'Ouverture de caisse',
	fields: {
		employee: 'Nom de l\'employé(e)',
		moneyInput: 'Billets et monnaies dans la caisse à l\'ouverture',
		total: 'Total',
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
