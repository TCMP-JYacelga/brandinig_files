Ext.define('Cashweb.store.AccountStore', {
			extend : 'Ext.data.Store',
			requires: ['Cashweb.model.AccountModel'],
			model : 'Cashweb.model.AccountModel',
			autoLoad : false,
			config: {
				dashboardAccountViewstate: null
			},
			proxy : {
				type : 'ajax',
//				url : './getUserDasboardAccounts.rest',
				reader : {
					type : 'json',
					root : 'dashboardAccounts'
				}
			}
			
		});