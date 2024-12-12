Ext.define('GCP.view.InvestmentSweepGroupView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.GroupView', 'Ext.ux.gcp.GridHeaderFilterView', 'GCP.view.InvestmentSweepFilterView' ],
	xtype : 'investmentSweepGroupView',
	// bodyPadding : '12 4 2 2',
	autoHeight : true,
	parent : null,
	initComponent : function()
	{
		var me = this;
		var groupView = me.createGroupView();
		me.items = [ groupView ];

		me.on('resize', function()
		{
			me.doLayout();
		});

		me.callParent(arguments);
	},

	createGroupView : function()
	{
		var me = this;
		var arrSorters = new Array();
		var groupView = null;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGroupByPref = {};
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objSweepTxnSummaryPref)
		{
			var objJsonData = Ext.decode(objSweepTxnSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences && objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols ? objJsonData.d.preferences.ColumnSetting.gridCols
					: (INVESTMENT_SWEEP_QUERY_COLUMN_MODEL || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/lms/investmentSweepQuery/data/InvestmentSweepGroupBy.json?',
			cfgSummaryLabel : getLabel('lblclearedCheckinquirydtl', 'Summary'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [ {
					xtype : 'investmentSweepFilterView'
				} ],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function()
			{
				return me.getActionColumnModel();
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showEmptyRow : false,
				showPager : true,
				showSummaryRow : true,
				// showPagerForced : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				hideRowNumbererColumn : true,
				showCheckBoxColumn : false,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				showPagerRefreshLink : false,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [ {
						type : 'list',
						colId : 'actionStatus',
						options : []
					} ]
				},
				storeModel : {
					fields : [ 'positionDate', 'cumulativeInvestmentAmount', 'totalReturnedAmount', 'openingPosition', 'investmentScheme',
							'recordKeyNo' ,'acct1Ccy'],
					proxyUrl : 'getLmsInvestmentSweepList.srvc',
					rootNode : 'd.investmentSweepList',
					// sortState : arrSorters,
					totalRowsNode : 'd.__count'
				},
				// groupActionModel : {},
				defaultColumnModel : me.getColumnModel(INVESTMENT_SWEEP_QUERY_COLUMN_MODEL),
				fnColumnRenderer : me.columnRenderer
			// fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId)
	{
		if (record.get('isEmpty'))
		{
			if (rowIndex === 0 && colIndex === 0)
			{
				meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
				return getLabel('gridNoDataMsg', 'No records found !!!');
			}
		}
		else if(colId==='col_cumulativeInvestmentAmount' || colId==='col_totalReturnedAmount')
			{
			value = record.get("acct1Ccy")+ "  " + value;
			return value;
			}
		else
			return value;
	},
	getActionColumnModel : function()
	{
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			width : 108,
			colHeader : getLabel('action', 'Action'),
			sortable : false,
			locked : true,
			lockable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : [ {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('lblViewDetails', 'View Details'),
				itemLabel : 'View Record',
				maskPosition : 3
			} ]
		};
		var arrColumns = [ objActionCol ];
		return arrColumns;
	},
	getColumnModel : function(arrCols)
	{
		var me = this, cfgCol = {};
		var arrColumns = [];
		// var arrColumns = [];
		// arrColumns = arrColumns.concat(arrCols);
		if (Ext.isEmpty(arrColumns))
		{
			for (var i = 0; i < arrCols.length; i++)
			{
				objCol = arrCols[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				cfgCol.locked = objCol.locked;
				cfgCol.width = objCol.width;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number") cfgCol.align = 'right';
				}
				cfgCol.width = !Ext.isEmpty(objCol.width) ? objCol.width : 120;
				// if(cfgCol.width === 120)
				//cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrColumns.push(cfgCol);
			}
		}
		return (arrColumns || []);
	}
});