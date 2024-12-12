Ext.define('GCP.view.InvoiceLoanSettlementDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pOLoanSettlementDetailsView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/invoiceview/loanSettlementDetails/('+viewState+')';
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
						fields : ['invoiceFinanceReferenceNumber','receiptAmount','transactionAmount','settledAmount','loanSettlementDate'],
						proxyUrl : strUrl,
						rootNode : 'd.settlementDetails',
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
					"colId" : "invoiceFinanceReferenceNumber",
					"colDesc" : getLabel('reference', 'Reference'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "settlementMode",
					"colDesc" : getLabel('settlementMode', 'Settlement Mode'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "receiptAmount",
					"colDesc" : getLabel('receiptAmount', 'Receipt Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "transactionAmount",
					"colDesc" : getLabel('transactionAmount', 'Transaction Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "settledAmount",
					"colDesc" : getLabel('settledAmount', 'Settled Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
				}, {
					"colId" : "loanSettlementDate",
					"colDesc" : getLabel('loanSettlementDate', 'Loan Settlement Date'),
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
		var strRetValue = "";
		if(Ext.isEmpty(value)){
			strReturnValue = "";
		}else if((colId === "col_settledAmount" || colId === "col_transactionAmount" || colId === "col_receiptAmount") && !Ext.isEmpty(value)){
			strRetValue = currencyCode+" "+value;
		}else{
			strRetValue = value;
		}
		return strRetValue;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='
				+ encodeURIComponent($('#viewState').val()) + '&$client=' +selectedClient;
		grid.loadGridData(strUrl, null, null, false);

	}
	
	
});