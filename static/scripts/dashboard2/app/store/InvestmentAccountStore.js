Ext.define('Cashweb.store.InvestmentAccountStore', {
			extend : 'Ext.data.Store',
			requires: ['Cashweb.model.InvestmentAccountModel'],
			model : 'Cashweb.model.InvestmentAccountModel',
			config: {
				investmentAccountViewstate: null
			},
			proxy : {
				type : 'ajax',
				reader : {
					type : 'json',
					root : 'investmentAccount'
				}
		}
			
});