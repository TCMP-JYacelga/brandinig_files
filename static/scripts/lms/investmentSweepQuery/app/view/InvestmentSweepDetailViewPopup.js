Ext.define('GCP.view.InvestmentSweepDetailViewPopup', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.SmartGrid' ],
	xtype : 'investmentSweepDetailViewPopup',
	itemId : 'detailSnapshotGrid',
	listeners : {
		'resize' : function()
		{
			$('#executionSnapShotView').dialog('option', 'position', 'center');
		}
	},
	initComponent : function()
	{
		var me = this;
		this.items = [ {
			xtype : 'container',
			width : 'auto',
			cls : 't7-popup',
			layout : 'vbox',
			defaults : {
				labelAlign : 'top',
				labelSeparator : ''
			},
			items : [ {
				xtype : 'panel',
				width : '100%',
				itemId : 'snapShotGridPanel',
				items : []
			} ]
		} ];
		this.callParent(arguments);
	},
	getSnapShotGridConfig : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"investmentAmount" : 200,
			"txnType" : 200,
			"txnRemarks" : 200
		};
		arrColsPref = [ {
			"colId" : "investmentAmount",
			"colHeader" : "Movement",
			"colType" : "number",
			"sortable" : false,
			"draggable" : false
		}, {
			"colId" : "txnType",
			"colHeader" : "Transaction Type",
			"sortable" : false,
			"draggable" : false
		}, {
			"colId" : "txnRemarks",
			"colHeader" : "Remarks",
			"sortable" : false,
			"draggable" : false
		} ];

		storeModel = {
			fields : [ 'investmentAmount', 'txnType', 'txnRemarks' ,'acct1Ccy'],
			proxyUrl : 'checkManagementGridList/view.srvc',
			rootNode : 'd.investmentSweepList',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	getSnapGridColumns : function(arrColsPref, objWidthMap, record)
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref))
		{
			for (var i = 0; i < arrColsPref.length; i++)
			{
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.draggable = objCol.draggable;
				if (!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number") cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId)
	{
		var strRetValue = value;
		//var positionDate = record.get('positionDate');
	 if(colId==='col_investmentAmount')
		{
		 strRetValue = record.get("acct1Ccy")+ "   " + value;
		return strRetValue;
		}
	else if (!Ext.isEmpty(value))
			meta.tdAttr = 'title="' + value + '"';
		return strRetValue;
	},
	handleSnapShotGridLoading : function(arrCols, storeModel, parentRecord)
	{
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var objGridPanel = me.down('panel[itemId="snapShotGridPanel"]');
		var objSnapGrid = Ext.getCmp('snapShotGrid');

		if (typeof objSnapGrid == 'undefined')
		{
			objSnapGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
				id : 'snapShotGrid',
				itemId : 'snapShotGrid',
				cls : 't7-grid ft-padding-bottom',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				enableColumnHeaderMenu : false,
				showEmptyRow : false,
				hideRowNumbererColumn : false,
				showSummaryRow : false,
				// padding : '0 0 12 0',
				showCheckBoxColumn : false,
				rowList : [ 5, 10, 25, 50, 100, 500 ],
				minHeight : 100,
				maxHeight : 270,
				columnModel : arrCols,
				storeModel : storeModel,
				isRowMoreMenuVisible : false,
				isRowIconVisible : me.isDtlRowIconVisible,
				handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record)
				{
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},
				listeners : {
					render : function(grid)
					{
						me.handleLoadGridData(grid, objSnapGrid.pageSize, 1, 1, null, parentRecord);
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord);
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord);
					},
					pagechange : function(pager, current, oldPageNum)
					{
						me.handleLoadGridData(pager, current, oldPageNum);
					}
				}
			});
			objSnapGrid.view.refresh();
			objGridPanel.add(objSnapGrid);
			objGridPanel.doLayout();
		}
	},
	handleLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters, record)
	{
		var me = this;
		url = 'investmentSweepQuerySnapShotGrid.srvc';
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + '$invRecKey=' + record.get('recordKeyNo') + '&' + csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	}
});
