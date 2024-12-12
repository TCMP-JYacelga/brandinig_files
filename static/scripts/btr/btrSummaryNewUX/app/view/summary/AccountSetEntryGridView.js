/**
 * @class GCP.view.summary.AccountSetEntryGridView
 * @extends Ext.grid.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSetEntryGridView', {
	extend : 'Ext.grid.Panel',
	xtype : 'accountSetEntryGridView',
	requires : ['Ext.Ajax', 'Ext.grid.column.CheckColumn', 'Ext.data.Store'],
	selType : 'rowmodel',
	scroll : 'vertical',
	itemId : "accountSetEntryGridView",
	maxHeight : 285,
	width : 'auto',//'100%',
	cls : 'xn-grid-cell-inner t7-grid',
	initComponent : function() {
		var me = this;
		var store = Ext.create('Ext.data.Store', {
			fields : ['accountId', 'accountName', 'accountNumber',
					'facilityCode','accountCcy','facilityDesc','bankDesc','bankCode']
			/*proxy : {
				type : 'ajax',
				url : 'services/balancesummary/btruseraccounts',
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
			autoLoad : false*/
		});
		me.store = store;
		me.selModel = new Ext.selection.CheckboxModel({
			checkOnly : true,
			headerWidth : _GridCheckBoxWidth,
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
					width : 40

				}, */
				{
					header : getLabel('accNo', 'Account'),
					dataIndex : 'accountNumber',
					draggable:false,
					sortable:false,
					hideable:false,
					resizable:false,
					menuDisabled:true,
					flex : 50,
					renderer : function(value, metadata) {
						metadata.tdAttr = 'title="' + value + '"';
						return value;
				}
				}, {
					header : getLabel('accName', 'Account Name'),
					dataIndex : 'accountName',
					draggable:false,
					sortable:false,
					hideable:false,
					resizable:false,
					menuDisabled:true,
					flex : 50,
					renderer : function(value, metadata) {
						metadata.tdAttr = 'title="' + value + '"';
						return value;
				}
				},{
					header : getLabel('accCCY', 'Currency'),
					dataIndex : 'accountCcy',
					draggable:false,
					sortable:false,
					resizable:false,
					hideable:false,
					menuDisabled:true,
					flex : 30,
					renderer : function(value, metadata) {
						metadata.tdAttr = 'title="' + value + '"';
						return value;
				}
				},{
					header : getLabel('bankName', 'Bank Name'),
					dataIndex : 'bankDesc',
					flex : 60,
					draggable:false,
					sortable:false,
					resizable:false,
					hideable:false,
					menuDisabled:true,
					renderer : function(value, metadata) {
						metadata.tdAttr = 'title="' + value + '"';
						return value;
				}
				},{
					header : getLabel('accType', 'Account Type'),
					dataIndex : 'facilityDesc',
					draggable:false,
					resizable:false,
					sortable:false,
					hideable:false,
					menuDisabled:true,
					flex : 60,
					renderer : function(value, metadata) {
						metadata.tdAttr = 'title="' + value + '"';
						return value;
				}
				}];
		/*Ext.Ajax.request({
					url : 'services/balancesummary/btruseraccounts',
					method : 'GET',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var btruseraccounts = data.d.btruseraccount;
						if (!Ext.isEmpty(btruseraccounts))
							me.store.loadRawData(btruseraccounts);
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}

				});*/
		me.callParent(arguments);
	}

});