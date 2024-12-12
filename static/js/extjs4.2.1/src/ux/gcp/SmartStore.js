Ext.define('Ext.ux.gcp.SmartStore', {
	extend : 'Ext.data.Store',
	config : {
		multiSort : true,
		showEmptyRow : true
	},
	/**
	 * @cfg {boolean} remoteSort True to defer any sorting operation to the
	 *      server. If false, sorting is done locally on the client. Defaults
	 *      to: false
	 */
	remoteSort : true,
	/**
	 * @cfg {Object} fields This may be used in place of specifying a model
	 *      configuration. The fields should be a set of Ext.data.Field
	 *      configuration objects. The store will automatically create a
	 *      Ext.data.Model with these fields. In general this configuration
	 *      option should only be used for simple stores like a two-field store
	 *      of ComboBox. For anything more complicated, such as specifying a
	 *      particular id property or associations, a Ext.data.Model should be
	 *      defined and specified for the model config.
	 */
	fields : [],
	/**
	 * @cfg {Object/boolean} autoLoad If data is not specified, and if autoLoad
	 *      is true or an Object, this store's load method is automatically
	 *      called after creation. If the value of autoLoad is an Object, this
	 *      Object will be passed to the store's load method.
	 */
	autoLoad : false,
	/**
	 * @cfg {number} pageSize The Proxy to use for this Store. This can be
	 *      either a string, a config object or a Proxy instance - see setProxy
	 *      for details.
	 */
	pageSize : 20,
	/**
	 * @cfg {number} pageSize The Proxy to use for this Store. This can be
	 *      either a string, a config object or a Proxy instance - see setProxy
	 *      for details.
	 */
	proxy : {
		type : 'memory',
		reader : {
			type : 'json',
			root : '',
			totalProperty : ''
		}
	},
	// Overrided as in extjs 4.2.0 removes the load event call.
	loadRawData : function(data, append) {
		var me = this, result = me.proxy.reader.read(data), records = result.records, intCurrentPage = 1;;
		if (result.success) {
			if (result.total < (me.pageSize * me.currentPage)) {
				intCurrentPage = parseInt(result.total / me.pageSize) + 1;
			} else
				intCurrentPage = me.currentPage === 0 ? 1 : me.currentPage;
			me.currentPage = intCurrentPage 
			me.totalCount = result.total;
			me.loadRecords(records, append ? me.addRecordsOptions : undefined);
			me.fireEvent('load', me, records, true);
			me.fireEvent('smartStoreLoad', me, records, true);
		}
	},
	/**
	 * @cfg {Object} listeners A config object containing one or more event
	 *      handlers to be added to this object during initialization. This
	 *      should be a valid listeners config object as specified in the
	 *      addListener example for attaching multiple handlers at once.
	 */
	listeners : {
		load : function(store) {
			if (!Ext.isEmpty(store.showEmptyRow) && store.showEmptyRow === true) {
				var records = new Array();
				var pgSize = store.pageSize ? store.pageSize : 20;
				store.emptyRowCount = pgSize - store.getCount();
				var emptyRecord = {
					'isEmpty' : true
				};
				for (var i = pgSize - store.getCount(); i > 0; i--) {
					records.push(emptyRecord);
				}
				store.add(records);
				if (store.emptyRowCount == pgSize) {
					store.currentPage = 0;
				}
			}
		}
	}
});
