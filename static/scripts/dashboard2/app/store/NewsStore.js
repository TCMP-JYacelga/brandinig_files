Ext.define('Cashweb.store.NewsStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.NewsModel',
			autoLoad : false,
			config : {
				dashboardNewsViewState : null
			}
		});