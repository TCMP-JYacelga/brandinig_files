Ext.define('GCP.view.HeaderOrderGridView', {
	extend : 'Ext.grid.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'headerOrderGridView',
	selType : 'rowmodel',
	itemId : "headerOrderGridView",
	padding : '10 0 0 0',
	autoHeight : true,
	minHeight : 200,
	height : 200,
	width : '100%',
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
		var me = this;
		var rowNumberer = Ext.create('Ext.grid.column.Column', {
			text : "Default Width",
			colId : 'defaultClient',
			align : 'center',
			hideable : false,
			sortable : false,
			menuDisabled : true,
			width : 100,
			minWidth : 35,
			renderer : function(value, metaData, record, rowIdx, colIdx, store) {
				if(me.up('window').itemId === "gridTypeGridCodePopup"){
					var defWidth = record.data.gridDefaultWidth;
				}	
				else if(me.up('window').itemId === "gridTypeHeaderCodePopup"){
					var defWidth = record.data.headerDefaultWidth;
				}	
				var typeCode = record.data.typeCode;
				retVal = '<input type="textfield" name="defaultWidth" id = "width_' +typeCode+ '" value = '+defWidth+'>';
				return retVal; 	
			}
		});
		this.columns = [
		{
			header : getLabel('typeCode', 'Type Code'),
			dataIndex : 'typeCode',
			width : 90
		},
		{
			header : getLabel('typeDescription', 'Type Code Desc'),
			dataIndex : 'typeDescription',
			width : 190
		}, {
			xtype : 'actioncolumn',
			width : 55,
			header : getLabel('order', 'Order'),
			align:'center',
			parent : this,
			items : [{
				iconCls : 'grid-row-up-icon',
				tooltip :  getLabel('up', 'Up'),
				handler : function(grid, rowIndex, colIndex) {

						this.parent.fireEvent('orderUpEvent', grid, rowIndex,
								-1);

				}
			}, {
				iconCls : 'grid-row-down-icon',
				tooltip : getLabel('down', 'Down'),
				handler : function(grid, rowIndex, colIndex) {

						this.parent
								.fireEvent('orderUpEvent', grid, rowIndex, 1);

				}
			}]
		},rowNumberer];
		
		this.callParent(arguments);
	},
	loadRawData : function(data, append) {
		var me=this;
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