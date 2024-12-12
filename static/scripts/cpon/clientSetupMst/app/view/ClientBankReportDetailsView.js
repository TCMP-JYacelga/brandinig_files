Ext.define('GCP.view.ClientBankReportDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankReportList',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

	initComponent : function() {
		var me = this;
		if (Ext.isEmpty( me.title))
			 me.title = getLabel("lblList","List");
		this.title = me.title;
		var strUrl = 'cpon/clientServiceSetup/bankReports.json';
		var colModel = me.getColumns();
		var pgSize = null;
		pgSize = _GridSizeMaster;
		bankReportsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : pgSize,
			xtype : 'bankReportGrid',
			itemId : 'bankReportGrid',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			rowList : _AvailableGridSize,
			padding : '5 0 0 0',
			minHeight : 0,
			columnModel : colModel,
			storeModel : {
				fields : [ 'bankReportDesc', 'identifier',
						'distributionMethod', 'statusFlag', 'recordKeyNo','relativeTypeId',
						'bankReportCode', 'filterCount' ],
				proxyUrl : strUrl,
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			},
			checkBoxColumnRenderer : function(value, metaData, record,
					rowIndex, colIndex, store, view) {

			}

		});
		bankReportsGrid.on('cellclick', function(me, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			if (td.className.match('x-grid-cell-col_filterCount')) {
				if (record.data.distributionMethod === 'A') {
					var reportFilterPopup = Ext.create(
							'GCP.view.AccountBasedAccReportPopup', {
								showCheckBoxColumn : false,
								bankReportCode : record.data.bankReportCode
							});
					var reportName = record.data.bankReportDesc;
					reportFilterPopup.query('label[itemId=aReportName]')[0]
							.setText(reportName);
					reportFilterPopup.show();
				} else if (record.data.distributionMethod === 'F') {
					var reportFilterPopup = Ext.create(
							'GCP.view.ReportFilterPopup', {
								bankReportCode : record.data.bankReportCode
							});
					reportFilterPopup.show();
				}
			}
		});
		this.items = [ bankReportsGrid ];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
			"colId" : "bankReportDesc",
			"colDesc" : getLabel("bnkRptName","Report Name"),
			"width" : 150
		}, {
			"colId" : "assignmentStatus",
			"colDesc" : getLabel("assigned","Assigned"),
			"width" : 100
		}, {
			"colId" : "distributionMethod",
			"colDesc" : getLabel("lblType","Type"),
			"width" : 70
		} /*{
			"colId" : "filterCount",
			"colDesc" : getLabel("bankRptReportFilter","Report Filter"),
			"width" : 80
		}, {
			"colId" : "statusFlag",
			"colDesc" : getLabel("status","Status"),
			"width" : 120
		}*/ ];
		if (!Ext.isEmpty(arrColsPref)) {
			for ( var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = objCol.width;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_distributionMethod') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "A" == record.get('distributionMethod')) {
					strRetValue = getLabel('bankRptReportAccount', 'Account');
				} else if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "G" == record.get('distributionMethod')) {
					strRetValue = getLabel('group', 'Group');
				} else if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "F" == record.get('distributionMethod')) {
					strRetValue = getLabel('field', 'Field');
				}
			}
		} else if (colId === 'col_statusFlag') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('statusFlag'))
						&& "Y" == record.get('statusFlag')) {
					strRetValue = getLabel('active', 'Active');
				} else if (!Ext.isEmpty(record.get('statusFlag'))
						&& "N" == record.get('statusFlag')) {
					strRetValue = getLabel('inactive', 'Inactive');
				}
			}
		} else if (colId === 'col_assignmentStatus') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('recordKeyNo'))) {
					strRetValue = getLabel('assigned', 'Assigned');
				} else {
					strRetValue = getLabel('unassigned', 'Unassigned');
				}
			}
		} else if (colId === 'col_filterCount' && value > 0) {
			strRetValue = '<span class="underlined">' + value + '</span>';
		} else {
			strRetValue = value;
		}
		return strRetValue;

	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		gridCountAfterRender++;
		enableDisableGridButtons(false);
	}
});
