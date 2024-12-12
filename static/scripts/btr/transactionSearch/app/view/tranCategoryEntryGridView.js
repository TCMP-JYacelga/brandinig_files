/**
 * @class GCP.view.tranCategoryEntryGridView
 * @extends Ext.grid.Panel
 * @author Sharddha Chauhan
 */
Ext.define('GCP.view.tranCategoryEntryGridView', {
	extend : 'Ext.grid.Panel',
	xtype : 'tranCategoryEntryGridView',
	requires : ['Ext.Ajax', 'Ext.grid.column.CheckColumn', 'Ext.data.Store'],
	selType : 'rowmodel',
	autoScroll : true,
	itemId : "transactionCategoryEntryGridView",
	height : 350,
	width : '100%',
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
		var me = this;
		var store = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			proxy : {
				type : 'ajax',
				url : 'services/userseek/typecodelist',
				reader : {
					type : 'json'
				}
			},
			// Overrided as in extjs 4.2.0 removes the load event call.
			loadRawData : function(data, append) {
				var objStore = me.store;
				result = objStore.proxy.reader.read(data), records = result.records;
				if (result.success) {
					objStore.currentPage = objStore.currentPage === 0
							? 1
							: objStore.currentPage;
					objStore.totalCount = result.total;
					objStore.loadRecords(records, append
									? objStore.addRecordsOptions
									: undefined);
					objStore.fireEvent('load', objStore, records, true);
				}
			},
			autoLoad : false
		});
		me.store = store;
		me.columns = [{
					xtype : 'rownumberer',
					text : '#',
					align : 'center',
					hideable : false,
					sortable : false,
					tdCls : 'xn-grid-cell-padding ',
					width : 30
				}, {
					header : getLabel('typeCode', 'Type Code'),
					dataIndex : 'CODE',
					width : 90
				}, {
					header : getLabel('description', 'Description'),
					dataIndex : 'DESCR',
					width : 245
				}, {
					xtype : 'checkcolumn',
					dataIndex : 'typeCodeCheckbox',
					hideable : false,
					sortable : false,
					width : 55
				}];
		Ext.Ajax.request({
					url : 'services/userseek/typecodelist',
					method : 'GET',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var arrTypeCodes = data.d.preferences;
						if (!Ext.isEmpty(arrTypeCodes))
							me.store.loadRawData(arrTypeCodes);
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}

				});
		me.callParent(arguments);
	}

});