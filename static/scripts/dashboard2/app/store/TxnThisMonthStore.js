Ext.define('Cashweb.store.TxnThisMonthStore', {
			extend : 'Ext.data.JsonStore',
			fields: ['TYPECODE_SET', 'AMOUNT', 'COUNT'],
			model : 'Cashweb.model.TxnThisMonthModel',
			autoLoad : false
		});