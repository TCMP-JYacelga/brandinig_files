Ext.define('Cashweb.store.UserAccountsStore',{
	extend : 'Ext.data.Store',
	autoLoad : false,
	storeId: 'user-accounts-store',
	fields : ['id','account_number']
	/*proxy : {
		type : 'ajax',
		url : './getUserAccounts.rest',
		reader : {
			type : 'json',
			root : 'userAccounts'
		}
	}*/
});