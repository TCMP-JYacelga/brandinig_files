Ext.define('Cashweb.store.BroadcastStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.BroadcastModel',
			autoLoad : false,
			config : {
				dashboardBroadcastViewState : null
			}
		});