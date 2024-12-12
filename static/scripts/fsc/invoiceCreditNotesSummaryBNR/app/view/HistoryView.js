Ext.define('GCP.view.HistoryView', {
	extend : 'Ext.panel.Panel',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	width : 735,
	id : 'historyViewId',
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var storeData = this.loadHistoryData(this.historyUrl, this.identifier);
		this.items = [{
			xtype : 'grid',
			scroll : 'vertical',
			cls : 't7-grid',
			forceFit : true,
			store : storeData,
			columns : [{
						xtype : 'rownumberer',
						text : "#",
						width : 32
					}, {
						dataIndex : 'userDesc',
						text : getLabel('userDesc','User Name'),
						width : 100,
						menuDisabled : true
					}, {
						dataIndex : 'logDate',
						// xtype : 'datecolumn',
						text : getLabel('logDate','Date Time'),
						// format : 'n/j/Y, H:i A',
						width : 130,
						menuDisabled : true
					}, {
						dataIndex : 'statusDesc',
						text : getLabel('statusDesc','Action'),
						width : 140,
						menuDisabled : true,
						renderer : function(value, meta, record, rowIndex, colIndex, store,view, colId)
						{
                                   var value1 = value.replace(/\s/g,'');
                                   value = getLabel(value1,value)
                                   meta.tdAttr = 'title="' + value + '"';
                                   return value;
                        }

					}, {
						dataIndex : 'rejectRemarks',
						text : getLabel('rejectRemarks','Remark'),
						width : 200,
						menuDisabled : true,
						renderer : function(val, meta, rec, rowIndex, colIndex,
								store) {
							if (val.length > 35)
								meta.tdAttr = 'title="' + val + '"';
							return val;
						}
					}]
		}];
		this.callParent(arguments);
	},

	loadHistoryData : function(historyUrl, id) {
		var me = this;
		var storeData = null;
		Ext.Ajax.request({
					url : historyUrl,
					method : 'POST',
					jsonData : Ext.encode(id),
					async : false,
					success : function(response) {
						var historyData = Ext.decode(response.responseText);
						historyData = historyData.d.history
						if (historyData) {
							storeData = Ext.create('Ext.data.Store', {
										fields : ['invoiceState', 'logDate',
												'statusDesc', 'userCode',
												'userDesc', 'rejectRemarks'],
										data : historyData,
										reader : {
											type : 'json',
											root : 'history'
										}
									});
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : 'Error',
									msg : 'Error while fetching data..!',
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									icon : Ext.MessageBox.ERROR
								});
					}
				});
		return storeData;
	}
});
