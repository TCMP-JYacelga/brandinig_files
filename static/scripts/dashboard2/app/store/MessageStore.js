Ext.define('Cashweb.store.MessageStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.MessageModel',
			autoLoad : false
			/*sorters : [{
			    property: 'eventTime',
			    direction: 'DESC'
			    }]*/
		});