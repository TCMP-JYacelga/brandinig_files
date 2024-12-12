Ext.define('GCP.view.POInvoiceReconciliationDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'poInvoiceReconciliationDetailsView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/purchaseorderview/invoicereconcilationDetails/('+viewState+')';
		var smartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					cls : 't7-grid',
					padding : '0 10 0 10',
					minHeight : 0,
					showPager : false,
					columnModel : me.getColumns(),
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					enableColumnHeaderMenu : false,
					storeModel : {
						fields : ['source','receiptRefNumber','receiptAmount','receiptCleared','amountReconciled','reconciledDate'],
						proxyUrl : strUrl,
						rootNode : 'd.invoiceReconcilationDetails',
						totalRowsNode : 'd.count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					}

				});
		me.items = [smartGrid];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "source",
					"colDesc" : getLabel('source', 'Source'),
					"sortable" : false,
					"menuDisabled" : false
				},{
					"colId" : "receiptRefNumber",
					"colDesc" : getLabel('receiptRefNo', 'Receipt Reference Number'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "receiptAmount",
					"colDesc" : getLabel('receiptAmnt', 'Receipt Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "receiptCleared",
					"colDesc" : getLabel('receiptClearedAmnt', 'Receipt Cleared'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "amountReconciled",
					"colDesc" : getLabel('amntReconciled', 'Amount Reconciled'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
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
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strReturnValue = "";
		
		if(Ext.isEmpty(value)){
			strReturnValue = "";
		}else if((colId === "col_receiptAmount" || colId === "col_amountReconciled") && !Ext.isEmpty(value)){
			strReturnValue = currencyCode+" "+value;
		}else{
			strReturnValue =  value;
		}
		
		return strReturnValue;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='
				+ encodeURIComponent($('#viewState').val()) + '&$client=' +selectedClient;
		grid.loadGridData(strUrl, null, null, false);

	}
	
	
});