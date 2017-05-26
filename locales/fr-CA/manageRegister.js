export default {
	title: 'Gestion de caisse',
	actions: {
		add: 'Ajouter une opération',
	},
	table: {
		empty: 'Pour ajouter une opération (entrée ou sortie d\'argent), utilisez le bouton ci-dessous.',
		title: 'Mouvements d\'argent de la caisse',
		cols: {
			time: 'Heure',
			note: 'Description',
			amount: 'Montant',
		},
	},
	modal: {
		title: 'Nouvelle opération',
		types: {
			in: 'Entrée d\'argent',
			out: 'Sortie d\'argent',
		},
		fields: {
			type: 'Type d\'opération',
			amount: 'Montant',
			note: 'Description',
		},
		errors: {
			amount: 'Veuillez entrer un montant valide',
			note: 'Veuillez spécifier une description valide',
		},
	},
};
