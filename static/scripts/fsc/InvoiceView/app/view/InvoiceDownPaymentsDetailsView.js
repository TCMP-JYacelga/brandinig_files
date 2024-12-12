Ext.define('GCP.view.InvoiceDownPaymentsDetailsView',{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	xtype:'poLineItemsGridView',
	
	initComponent : function(){
		var me = this;
		var strUrl = 'services/invoiceview/downPaymentDetails/('+viewState+')';
		 var downPaymentsDetailsSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid',{
			 	stateful : false,
				showEmptyRow : false,
				showCheckBoxColumn : false,
				hideRowNumbererColumn : true,
				cls : 't7-grid',
				padding : '0 10 0 10',
				minHeight : 0,
				showPager : true,
				pageSize : pageSize,
				columnModel : me.getColumnModel(),
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				enableColumnHeaderMenu : false,
				storeModel:{
				fields:['source','receiptRefNumber','receiptAmount','receiptCleared','amountReconciled','reconciledDate'],
				proxyUrl:strUrl,
				rootNode:'d.downPaymentDetails',
				totalRowsNode :'d.count'
				
			},
			listeners:{
				render : function(grid) {
					me.handleLoadGridData(grid,
							grid.store.dataUrl, grid.pageSize,
							1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData
			}
			
	 });
		me.items=[downPaymentsDetailsSmartGrid];
		
		me.on('resize',function(){
			me.doLayout();
		});
		
		me.callParent(arguments);
	},
	
	getColumnModel : function(){
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		
		var arrColsPref = [
		           {
		        	   "colId" : "source",
						"colDesc" : getLabel('source', 'Source'),
						"sortable" : false,
						"menuDisabled" : false
		        	   
		           },
		           {
		        	   "colId" : "receiptRefNumber",
						"colDesc" : getLabel('receiptReferenceNumber', 'Receipt Reference Number'),
						"sortable" : false,
						"menuDisabled" : false
		           },
		           {
		        	   	"colId" : "receiptAmount",
						"colDesc" : getLabel('receiptAmount', 'Receipt Amount'),
						"sortable" : false,
						"menuDisabled" : false
		           },
		           {
		        	   "colId" : "receiptCleared",
						"colDesc" : getLabel('receiptClearedAmnt', 'Receipt Cleared'),
						"sortable" : false,
						"menuDisabled" : false
		           },
		           {
		        	   "colId" : "amountReconciled",
						"colDesc" : getLabel('amountReconciled', 'Amount Reconciled with this Invoice'),
						"sortable" : false,
						"menuDisabled" : false
		           },
		           {
		        	    "colId" : "reconciledDate",
						"colDesc" : getLabel('reconciledDate', 'Reconciled date'),
						"sortable" : false,
						"menuDisabled" : false
		           }];
		          
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						if (!Ext.isEmpty(objCol.colType)) {
							cfgCol.colType = objCol.colType;
							if (cfgCol.colType === "number")
								cfgCol.align = 'right';
						}
		
						cfgCol.width = 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
		
					}
				}
		return arrCols;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId){
		
		var strReturnValue = "";
		if(Ext.isEmpty(value)){
			strReturnValue = "";
		}else if((colId === "col_amountReconciled" ||colId === "col_receiptAmount") && !Ext.isEmpty(value)){
			strReturnValue = currencyCode+" "+value;
		}else{
			strReturnValue =  value;
		}
		
		return strReturnValue;
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='+ encodeURIComponent($('#viewState').val())+ '&$client=' +selectedClient;;
		grid.loadGridData(strUrl, null, null, false);

	}
});