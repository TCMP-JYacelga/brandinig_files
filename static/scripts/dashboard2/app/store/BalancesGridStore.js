Ext.define('Cashweb.store.BalancesGridStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.BalancesGridModel',
			autoLoad : false
			/*sorters : [{
			    property: 'ACCOUNTNAME',
			    direction: 'ASC'
			    }]*/
		});