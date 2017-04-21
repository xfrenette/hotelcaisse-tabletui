export default {
	title: 'Gestion de caisse',
	actions: {
		addOut: 'Ajouter une sortie',
		addIn: 'Ajouter une entrée',
	},
	fields: {
		amount: 'Montant',
		description: 'Description',
	},
	addIn: {
		title: 'Ajout d\'une entrée d\'argent',
	},
	addOut: {
		title: 'Ajout d\'une sortie d\'argent',
	},
	moneyOut: {
		title: 'Sorties d\'argent',
	},
	moneyIn: {
		title: 'Entrées d\'argent',
	},
	errors: {
		emptyDescription: 'Veuillez spécifier une description',
		invalidAmount: 'Veuillez spécifier un montant valide',
	},
};
