Ext.define('GCP.view.ClientBankReportDistributionDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'distributionList',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

	initComponent : function() {
		var me = this;
		if (Ext.isEmpty( me.title))
			 me.title = getLabel("lblDistributionID","Distribution ID");
		this.title = me.title;
		var strUrl = 'cpon/clientServiceSetup/bankReportDistributions.json';
		var colModel = me.getColumns();
		var pgSize = null;
		pgSize = _GridSizeMaster;
		bankReportDistGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : pgSize,
			xtype : 'bankReportDistGrid',
			itemId : 'bankReportDistGrid',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			rowList : _AvailableGridSize,
			padding : '5 0 0 0',
			minHeight : 0,
			columnModel : colModel,
			storeModel : {
				fields : [ 'distributionId', 'identifier','description',
						'distributionMethod', 'bankReportCode' ],
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
		this.items = [ bankReportDistGrid ];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
			"colId" : "distributionId",
			"colDesc" : getLabel("distributionId","Distribution ID"),
			"width" : 150
		}, {
			"colId" : "description",
			"colDesc" : getLabel("distributionName","Distribution Name"),
			"width" : 100
		}, {
			"colId" : "distributionMethod",
			"colDesc" : getLabel("lblMethod","Method"),
			"width" : 70
		},{
			"colId" : "bankReportCode",
			"colDesc" : getLabel("lblbankReportCode","Report Name"),
			"width" : 100
		}];
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
		}  else {
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
