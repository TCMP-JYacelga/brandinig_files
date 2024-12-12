Ext.define('GCP.view.InvoiceReconciliationDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'poInvoiceReconciliationDetailsView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/invoiceview/invoicereconcilationDetails/('+viewState+')';
		var smartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					cls : 't7-grid',
					padding : '0 10 0 10',
					minHeight : 0,
					showPager : true,
					pageSize : pageSize,
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
		var arrColsPref = [
				{
					colType : 'emptyColumn',
					colId : 'emptyCol',
					colDesc : '',
					locked : true,
					resizable : false,
					draggable : false,
					width : 0.1,
					minWidth : 0.1
				},
		        {
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
				cfgCol.locked = Ext.isEmpty(objCol.locked) ? false : objCol.locked;
				cfgCol.resizable = Ext.isEmpty(objCol.resizable) ? true : objCol.resizable;
				cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? false : objCol.draggable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = cfgCol.colId == 'emptyCol' ? 0.1 : 120;
				if (!Ext.isEmpty(objCol.minWidth)) {
					cfgCol.minWidth = objCol.minWidth;
				}
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