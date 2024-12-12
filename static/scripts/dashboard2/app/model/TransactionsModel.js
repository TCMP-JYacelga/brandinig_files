Ext.define('Cashweb.model.TransactionsModel',{
	extend : 'Ext.data.Model',
	fields : [{ name : 'date'}, 'bene_or_sender','amount','typecode','debit_credit']
});