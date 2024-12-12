Ext.define('Cashweb.store.TransactionsPortletStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.TransactionsPortletModel',
			autoLoad : false
			/*sorters : [{
			    property: 'DATE',
			    direction: 'DESC'
			    }]*/
		});