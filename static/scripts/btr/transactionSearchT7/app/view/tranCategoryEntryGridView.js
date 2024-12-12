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
	maxHeight : 334,
	scroll : 'vertical',
	width : 'auto',//'100%',
	typCodeArr:[],
	cls : 't7-grid',
	initComponent : function() {
		var me = this;
		var store = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			/*proxy : {
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
			},*/
			autoLoad : false
		});
		me.store = store;
		me.selModel = new Ext.selection.CheckboxModel({
			checkOnly : true,
			headerWidth : 39,
			ignoreRightMouseSelection : true,
			injectCheckbox : 0,
			renderer : function(value, metaData, record, rowIndex, colIndex,
					store, view) {
				if (record.get('isEmpty'))
					return '';
				else {
					var baseCSSPrefix = Ext.baseCSSPrefix;
					metaData.tdCls = baseCSSPrefix + 'grid-cell-special '
							+ baseCSSPrefix + 'grid-cell-row-checker';
					return '<div class="' + baseCSSPrefix
							+ 'grid-row-checker">&#160;</div>';

				}
			}
		});
		me.columns = [/*{
					xtype : 'rownumberer',
					text : '#',
					align : 'center',
					hideable : false,
					sortable : false,
					tdCls : 'xn-grid-cell-padding ',
					width : 35
				}*//*{
					xtype : 'checkcolumn',
					dataIndex : 'typeCodeCheckbox',
					hideable : false,
					sortable : false,
					width : 60
				},*/ {
					header : getLabel('typeCode', 'Type Code'),
					dataIndex : 'CODE',
					draggable:false,
					sortable:true,
					hideable:false,
					menuDisabled:true,
					enableColumnMove : false,
					flex : 40,
					resizable : false
				}, {
					header : getLabel('description', 'Type Code Description'),
					dataIndex : 'DESCR',
					draggable:false,
					sortable:true,
					hideable:false,
					menuDisabled:true,
					enableColumnMove : false,
					flex : 60,
					resizable : false
				}];
		/*Ext.Ajax.request({
					url : 'services/userseek/typecodelist',
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var arrTypeCodes = data.d.preferences;
						if (!Ext.isEmpty(arrTypeCodes))
							me.store.loadRawData(arrTypeCodes);
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}

				});*/
		me.callParent(arguments);
	}

});