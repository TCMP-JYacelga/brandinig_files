Ext.define('GCP.view.InvoiceCreationDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pOInvoiceCreationDetailsView',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var strUrl = 'services/invoiceview/invoiceCreationDetails/('+viewState+')';
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
						fields : ['invoiceNumber','invoiceAmount','totalAcceptedAmount','displaystate','invoiceDueDate','outstandingAmount', 'identifier','viewState'],
						proxyUrl : strUrl,
						rootNode : 'd.invoiceCreationDetails',
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
					"colId" : "invoiceNumber",
					"colDesc" : getLabel('invoiceNumber', 'Invoice Number'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "invoiceAmount",
					"colDesc" : getLabel('invoiceAmount', 'Invoice Amount'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "totalAcceptedAmount",
					"colDesc" : getLabel('totalAcceptedAmount', 'Total Accepted Amount'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "displaystate",
					"colDesc" : getLabel('status', 'Status'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "invoiceDueDate",
					"colDesc" : getLabel('invoiceDueDate', 'Invoice Due Date'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "outstandingAmount",
					"colDesc" : getLabel('outstandingAmount', 'Outstanding Amount'),
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
		strRetValue = isEmpty(value) ? "" : value;

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