Ext.define('Cashweb.model.BalancesGridModel', {
			extend : 'Ext.data.Model',
			fields : ['ACCOUNTNO', 'DRCOUNT', 'OPN_LEDGER', 'CRCOUNT', 'CLG_LEDGER','ACCOUNTNAME','OPN_AVAILABLE','CLG_AVAILABLE','CURRENCY',
						'AMOUNT_DR', 'AMOUNT_CR']
		});