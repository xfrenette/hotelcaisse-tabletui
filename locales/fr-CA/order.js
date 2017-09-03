export default {
	total: 'Total',
	balance: {
		label: 'Solde',
		toPay: 'À payer',
		toCollect: 'À percevoir',
		toRefund: 'À rembourser',
		paid: 'Payé',
		cannotSaveRegisterClosed: 'La caisse doit être ouverte pour pouvoir ajouter les paiements' +
		' et les remboursements.',
	},
	details: {
		subTotal: 'Sous-total',
		credits: 'Crédits',
		taxes: 'Taxes',
		payments: 'Paiements',
	},
	credit: {
		label: 'Crédit',
		modal: {
			edit: {
				title: 'Modifier le crédit',
			},
			new: {
				title: 'Ajouter un crédit',
			},
			fields: {
				note: 'Description',
				amount: 'Montant',
			},
			errors: {
				note: 'Ne peut être vide',
				amount: 'Doit être positif',
			},
		},
	},
	transactions: {
		label: 'Transactions et crédits',
		message: 'Glisser une transaction ou un crédit vers la gauche pour le retirer. Noter que' +
		' les transactions déjà enregistrées ne peuvent plus être retirées.',
	},
	transaction: {
		payment: {
			label: 'Paiement',
			modal: {
				edit: {
					title: 'Modifier le paiement',
				},
				new: {
					title: 'Ajouter le paiement',
				},
				fields: {
					mode: 'Mode de paiement',
					amount: 'Montant',
				},
			}
		},
		refund: {
			label: 'Remboursement',
			modal: {
				edit: {
					title: 'Modifier le remboursement',
				},
				new: {
					title: 'Ajouter le remboursement',
				},
				fields: {
					mode: 'Mode de remboursement',
					amount: 'Montant',
				},
			},
		},
		modal: {
			errors: {
				amount: 'Doit être positif',
			},
		}
	},
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
			title: 'Ajouter le paiement',
		},
		fields: {
			mode: 'Mode de paiement',
			amount: 'Montant',
		},
	},
	customProduct: {
		label: 'Produit spécial',
		modal: {
			title: 'Produit spécial',
			fields: {
				name: 'Nom du produit',
				price: 'Prix',
			},
			errors: {
				name: 'Ne peut être vide',
				price: 'Doit être positif',
			},
		},
	},
	itemRefund: {
		modal: {
			title: 'Quantité à rembourser (maximum: %{max})',
		},
	},
	refunds: {
		label: 'Remboursements',
		modal: {
			title: 'Ajouter le remboursement',
		},
		fields: {
			mode: 'Mode de remboursement',
			amount: 'Montant',
		},
	},
	notes: {
		modal: {
			title: 'Editer les notes',
			instructions: 'Les notes sont utilisées uniquement à l\'interne et n\'apparaitront pas' +
				' sur la facture.',
			placeholder: '(Aucune note. Saisir ici une note pour cette inscription.)',
		},
	},
	addTransactionError: {
		registerClosed: {
			title: 'Caisse fermée',
			message: 'Les paiements et remboursements peuvent être ajoutés seulement quand' +
				' la caisse est ouverte.',
		},
		nullBalance: {
			title: 'Aucun solde',
			message: 'Cette inscription a été payée en totalité, vous ne pouvez ajouter un' +
				' paiement supplémentaire.',
		},
	},
	actions: {
		addCredit: 'Ajouter un crédit',
		savePayment: 'Ajouter le paiement',
		saveRefund: 'Ajouter le remboursement',
		startNew: 'Nouvelle',
		continue: 'Continuer',
		details: 'Détails',
		remove: 'Retirer',
		refund: 'Rembourser',
		fillCustomer: 'Saisir les informations du client',
		fillCustomerShort: 'Saisir informations client',
		editCustomer: 'Modifier les informations',
		editNotes: 'Éditer les notes',
	},
	customer: {
		modal: {
			title: 'Informations du client et chambres',
		},
		customerInfo: 'Informations du client',
		roomSelectionsInfo: 'Chambres',
	},
	categories: {
		empty: 'Cette catégorie est vide',
	},
	items: {
		label: 'Items',
		labelNew: 'Nouveaux items',
		labelFixed: 'Items actuels',
		empty: 'Pour débuter, ajoutez un premier item depuis les produits à droite.',
		message: 'Glisser un item vers la gauche pour le retirer (nouveaux items) ou le' +
		' rembourser (anciens items).',
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
			message: 'Il reste un montant à percevoir. Confirmez-vous que vous souhaitez' +
			' enregistrer et quitter sans ajouter le paiement ?',
		},
		refund: {
			title: 'Montant à rembourser',
			message: 'Il reste un montant à rembourser. Confirmez-vous que vous souhaitez' +
			' enregistrer et quitter sans ajouter le remboursement ?',
		},
	},
	quitNotSaved: {
		new: {
			title: 'Définir comme brouillon ?',
			message: 'Cette inscription n\'a pas été enregistrée. Souhaitez-vous la définir comme' +
			' brouillon pour la continuer plus tard ?',
		},
		old: {
			title: 'Quitter sans enregistrer',
			message: 'Si vous quittez, les modifications seront perdues. Souhaitez-vous quitter ?',
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
