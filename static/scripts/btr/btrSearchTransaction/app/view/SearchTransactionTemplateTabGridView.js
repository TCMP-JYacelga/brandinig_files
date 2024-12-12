Ext.define('GCP.view.SearchTransactionTemplateTabGridView', {
	extend : 'Ext.grid.Panel',
	requires : ['Ext.grid.column.Action'],
	xtype : 'searchTransactionTemplateTabGridView',
	selType : 'rowmodel',
	itemId : "searchTransactionTemplateTabGridView",
	padding : '10 0 0 0',
	minHeight : 300,
	autoHeight : true,
	height : 480,
	width : '100%',
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
		var me = this;
		this.columns = [{
					xtype : 'rownumberer',
					text : '#',
					align : 'center',
					hideable : false,
					sortable : false,
					tdCls : 'xn-grid-cell-padding ',
					width : 30
				}, {
					xtype : 'actioncolumn',
					width : 40,
					parent : this,
					align : 'center',
					sortable : false,
					items : [{
						iconCls : 'grid-row-delete-icon',
						tooltip : getLabel('delete', 'Delete'),
						handler : function(grid, rowIndex, colIndex) {
							this.parent.fireEvent('deleteSearchTxnTemplate',
									grid, rowIndex);
						}
					}]

				}, {
					header : getLabel('template', 'Template'),
					dataIndex : 'templateName',
					width : 290,
					renderer : function(value) {
						return value
								+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="searchLink" class="small-button_underline thePoniter ux_font-size14-normal filterSearchLink cursor_pointer">'
								+ getLabel('searchUsingFilter',
										'Search Using Filter') + '</span>'
					}
				}, {
					xtype : 'actioncolumn',
					width : 70,
					parent : this,
					align : 'center',
					sortable : false,
					items : [{
						iconCls : 'linkbox seeklink',
						tooltip : getLabel('view', 'View'),
						handler : function(grid, rowIndex, colIndex) {
							this.parent.fireEvent('viewTemplate', grid,
									rowIndex);
						}
					}, {
						iconCls : 'grid-row-action-icon  xn-adv-filter-grid-action-icon icon-edit',
						tooltip : getLabel('edit', 'Edit'),
						handler : function(grid, rowIndex, colIndex) {
							this.parent.fireEvent('editTemplate', grid,
									rowIndex);
						}
					}]

				}, {
					xtype : 'actioncolumn',
					width : 55,
					header : getLabel('order', 'Order'),
					align : 'center',
					parent : this,
					sortable : false,
					items : [{
						iconCls : 'grid-row-up-icon',
						tooltip : getLabel('up', 'Up'),
						handler : function(grid, rowIndex, colIndex) {
							this.parent.fireEvent('templateOrderUpEvent', grid,
									rowIndex, -1);
						}
					}, {
						iconCls : 'grid-row-down-icon',
						tooltip : getLabel('down', 'Down'),
						handler : function(grid, rowIndex, colIndex) {
							this.parent.fireEvent('templateOrderUpEvent', grid,
									rowIndex, 1);
						}
					}]
				}];
		this.callParent(arguments);
	},
	loadRawData : function(data, append) {
		var me = this;
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
	}
});