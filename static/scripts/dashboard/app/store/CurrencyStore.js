Ext.define('Cashweb.store.CurrencyStore', {
	extend : 'Ext.data.Store',
	fields: ['ccy_code'],
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : './getCurrency.rest',
		reader : {
			type : 'json',
			root : 'currency'
		}
	}
		
});