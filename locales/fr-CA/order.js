export default {
	total: 'Total',
	balance: {
		label: 'Solde',
		toPay: 'À payer',
		toCollect: 'À percevoir',
		toRefund: 'À rembourser',
		paid: 'Payé',
		cannotSaveRegisterClosed: 'La caisse doit être ouverte pour pouvoir enregistrer les paiements et les remboursements.',
	},
	details: {
		subTotal: 'Sous-total',
		credits: 'Crédits',
		taxes: 'Taxes',
		payments: 'Paiements',
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
	refunds: {
		label: 'Remboursements',
		modal: {
			title: 'Enregistrer le remboursement',
		},
		fields: {
			mode: 'Mode de remboursement',
			amount: 'Montant',
		},
	},
	note: {
		label: 'Notes',
		instructions: 'Les notes sont utilisées uniquement à l\'interne et n\'apparaitront pas sur la facture.',
	},
	actions: {
		addCredit: 'Ajouter un crédit',
		savePayment: 'Enregistrer le paiement',
		saveRefund: 'Enregistrer le remboursement',
		startNew: 'Nouvelle',
		continue: 'Continuer',
		details: 'Détails',
	},
	categories: {
		empty: 'Cette catégorie est vide',
	},
	customProduct: 'Produit spécial',
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
		actions: {
			edit: 'Modifier les items',
		},
		refund: 'Remboursement',
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
	doneNonZeroBalance: {
		payment: {
			title: 'Montant à percevoir',
			message: 'Il reste un montant à percevoir. Confirmez-vous que vous souhaitez continuer sans enregistrer un paiement ?',
		},
		refund: {
			title: 'Montant à rembourser',
			message: 'Il reste un montant à rembourser. Confirmez-vous que vous souhaitez continuer sans enregistrer un remboursement ?',
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
