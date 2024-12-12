Ext.define('Cashweb.store.MessageStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.MessageModel',
			autoLoad : false,
			config : {
				dashboardMessageViewState : null
			},
			proxy : {
				type : 'ajax',
				url : './getMyMessages.rest',
				reader : {
					type : 'json',
					root : 'messages'
				}
			}
				
		});