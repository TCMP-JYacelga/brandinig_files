Ext.define('Cashweb.store.UserActionStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.UserActionModel',
			autoLoad : false/*,
			proxy : {
				type : 'ajax',
				url : './getAwatingActions.rest',
				reader : {
					type : 'json',
					root : 'useractions',
					successProperty : 'success'
				}
			}*/
		});