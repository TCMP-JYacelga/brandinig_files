
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	//width : 650,
	width : 735,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	layout : 'fit',
	modal : true,
	resizable : false,
	cls:'xn-popup',
	draggable : false,

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('instrumentHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('instrumentHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {
			
			var storeData = this.loadHistoryData(this.historyUrl, this.identifier);
			this.title = getLabel('creditNoteHistoryTitle', 'Credit Note History');
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
							text : getLabel('invoiceHistoryColumnUserName',
									'User Name'),
							width : 100,
							menuDisabled : true
						}, {
							dataIndex : 'logDate',
							//xtype : 'datecolumn',
							text : getLabel('invoicesHistoryColumnDateTime',
									'Date Time'),
							//format : 'n/j/Y, H:i A',
							width : 130,
							menuDisabled : true
						},{
							dataIndex : 'statusDesc',
							text : getLabel('invoiceHistoryColumnAction',
									'Action'),
							width : 140,
							menuDisabled : true,
 renderer : function(value, meta, record, rowIndex, colIndex, store,
			                            view, colId){
								var value1 = value.replace(/\s/g,'');
			                         value = getLabel(value1,value)
			                          meta.tdAttr = 'title="' + value + '"';
			                        return value;
			                    }
						},{
							dataIndex : 'rejectRemarks',
							text : getLabel(
									'invoiceHistoryColumnRemark',
									'Remark'),
							width : 200,
							menuDisabled : true,
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
				                    if(val.length > 35)
				                    meta.tdAttr = 'title="' + val + '"';
				                    return val;
				            }
						}]
			}];
			this.bbar = ['->',{
				text : getLabel('btnClose', 'Close'),
				handler : function() {
					thisClass.close();
				}
			}];
		}
		this.callParent();
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
				if(historyData){
					 storeData = Ext.create('Ext.data.Store', {
						fields : ['invoiceState','logDate','statusDesc', 'userCode','userDesc','rejectRemarks'],
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
							title : getLabel('prfHistoryPopUpTitle', 'Error'),
							msg : getLabel('prfHistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							
							icon : Ext.MessageBox.ERROR,
								buttonText: {
			            ok: getLabel('btnOk', 'OK')
						} 
						});
			}
		});
		return storeData;
	}
});
