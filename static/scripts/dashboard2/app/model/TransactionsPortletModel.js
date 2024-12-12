Ext.define('Cashweb.model.TransactionsPortletModel', {
	extend : 'Ext.data.Model',
	fields : [  'TYPECODEDESC', 'BANKRFERENCE', 'TXN_AMNT', 'DATE', 'ACCOUNT',
			'CURRENCY', 'CREDIT_DEBIT', 'VALUE_DATE','TYPE' ]
});