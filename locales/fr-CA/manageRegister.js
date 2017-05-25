export default {
	title: 'Gestion de caisse',
	actions: {
		addOut: 'Ajouter une sortie',
		addIn: 'Ajouter une entrée',
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
	moneyOut: {
		title: 'Sorties d\'argent',
		empty: 'Aucune sortie',
	},
	moneyIn: {
		title: 'Entrées d\'argent',
		empty: 'Aucune entrée',
	},
	deletion: {
		title: 'Supprimer',
		message: 'Voulez-vous confirmer la suppression ?',
	},
};
