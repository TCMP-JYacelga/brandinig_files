Ext.define('Cashweb.store.OverdueBillsStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.OverdueBillsModel',
			autoLoad : false
			/*sorters : [{
			    property: 'COUNTER_PARTY',
			    direction: 'ASC'
			    }]*/
		});