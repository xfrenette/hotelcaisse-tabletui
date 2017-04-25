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
		success: 'Entrée d\'argent enregistrée',
	},
	addOut: {
		title: 'Ajout d\'une sortie d\'argent',
		success: 'Sortie d\'argent enregistrée',
	},
	moneyOut: {
		title: 'Sorties d\'argent',
		empty: 'Aucune sortie',
	},
	moneyIn: {
		title: 'Entrées d\'argent',
		empty: 'Aucune entrée',
	},
	errors: {
		emptyDescription: 'Veuillez spécifier une description',
		invalidAmount: 'Veuillez spécifier un montant valide',
	},
	deletion: {
		title: 'Supprimer',
		message: 'Voulez-vous confirmer la suppression ?',
	},
};
