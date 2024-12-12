Ext.define('GCP.view.InvoiceLoanOverduesView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pOLoanOverduesView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/invoiceview/loanOverdueDetails/('+viewState+')';
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
						fields : ['invoiceFinanceReferenceNumber','overdueDescription','overdueDate','overdueActionDesc','overdueAmnt'],
						proxyUrl : strUrl,
						rootNode : 'd.loanOverdueDetails',
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
					"colId" : "overdueDescription",
					"colDesc" : getLabel('overdueDescription', 'Overdue Description'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "overdueDate",
					"colDesc" : getLabel('overdueDate', 'Overdue Date'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "overdueActionDesc",
					"colDesc" : getLabel('overdueActionDesc', 'Overdue Action Description'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "overdueAmnt",
					"colDesc" : getLabel('overdueAmnt', 'Overdue Amount'),
					"sortable" : false,
					"menuDisabled" : false,
					"colType" : 'number'
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
		}else if((colId === "col_overdueAmnt") && !Ext.isEmpty(value)){
			strReturnValue = currencyCode+" "+value;
		}else{
			strReturnValue = value;
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