export default {
	total: 'Total',
	balance: {
		toPay: 'À payer',
		toCollect: 'À percevoir',
		toRefund: 'À rembourser',
	},
	credit: 'Dépôt',
	credits: {
		label: 'Dépôts',
		empty: 'Pour ajouter un dépôt, appuyez le bouton ci-dessous',
		fields: {
			note: 'Description',
			amount: 'Montant',
		},
		errors: {
			note: 'Ne peut être vide',
			amount: 'Doit être positif',
		},
	},
	payments: {
		label: 'Paiements',
		modal: {
			title: 'Enregistrer le paiement',
		},
		fields: {
			mode: 'Mode de paiement',
			amount: 'Montant',
		},
	},
	note: {
		label: 'Notes',
		instructions: 'Les notes sont utilisées uniquement à l\'interne et n\'apparaitront pas sur la facture.',
	},
	actions: {
		addCredit: 'Ajouter un dépôt',
		addPayment: 'Enregistrer le paiement',
		startNew: 'Nouvelle',
		continue: 'Continuer',
	},
	categories: {
		empty: 'Cette catégorie est vide',
	},
	customProduct: 'Produit spécial',
	refunds: {
		label: 'Remboursements',
	},
	items: {
		label: 'Items',
		labelNew: 'Nouveaux items',
		labelFixed: 'Items actuels',
		empty: 'Ajoutez un item depuis les produits à droite.',
		fields: {
			customProductName: 'Nom du produit (obligatoire)',
		},
		errors: {
			name: 'Ne peut être vide',
			price: 'Doit être positif',
		},
		qty: 'Qté',
		unitPrice: 'Prix',
		subtotal: 'Sous-total',
		total: 'Total',
	},
	continueDraft: {
		title: 'Inscription en cours',
		message: 'Une inscription est déjà en cours, souhaitez-vous la continuer ou en créer une nouvelle ?',
		actions: {
			continue: 'Continuer',
			new: 'Nouvelle',
		},
	},
	list: {
		empty: 'Aucune fiche n\'a encore été créée.',
		current: 'Clients actuels',
		today: 'Départs aujourd\'hui',
		yesterday: 'Partis hier',
		leftOn: 'Partis le %{date}',
		actions: {
			loadNext: 'Charger plus de fiches',
		},
		noMore: 'Fin des fiches',
	},
};
