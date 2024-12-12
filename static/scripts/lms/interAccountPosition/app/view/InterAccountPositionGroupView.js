Ext.define( 'GCP.view.InterAccountPositionGroupView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.GroupView','Ext.ux.gcp.GridHeaderFilterView','GCP.view.InterAccountPositionFilterView'
	],
	xtype : 'interAccountPositionGroupView',	
//	bodyPadding : '12 4 2 2',
	autoHeight : true,	
	parent : null,
	initComponent : function()
	{
		var me = this;		
		var groupView = me.createGroupView();
		me.items = [groupView];

		me.on('resize', function() {
			me.doLayout();
		});

		me.callParent(arguments);
	}, 


createGroupView : function() {
	var me = this;
	var arrSorters = new Array();
	var groupView = null;
	var objGroupCodePref = null, objSubGroupCodePref = null;
	var objGroupByPref = {};
	var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
	if (objSweepTxnSummaryPref) {
		var objJsonData = Ext.decode(objSweepTxnSummaryPref);
		objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
		objGridSetting = objJsonData.d.preferences.GridSetting || {};
		arrColumnSetting = objJsonData && objJsonData.d.preferences
				&& objJsonData.d.preferences.ColumnSetting
				&& objJsonData.d.preferences.ColumnSetting.gridCols
				? objJsonData.d.preferences.ColumnSetting.gridCols
				: (INTERACCOUNT_POSITION_COLUMN_MODEL || '[]');
	}		
	groupView = Ext.create('Ext.ux.gcp.GroupView', {			
		cfgGroupByUrl : 'static/scripts/lms/interAccountPosition/data/InterAccGroupBy.json?',
		cfgSummaryLabel :  getLabel( 'lblclearedCheckinquirydtl', 'Summary' ),
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
			cfgContentPanelItems : [{
						xtype : 'interAccountPositionFilterView'
					}],
			cfgContentPanelLayout : {
				type : 'vbox',
				align : 'stretch'
			}
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
			//showPagerForced : true,
			heightOption : objGridSetting.defaultGridSize,
			minHeight : 100,
			hideRowNumbererColumn : true,
			showCheckBoxColumn :  false,
			enableColumnHeaderFilter : true,
			enableColumnAutoWidth : _blnGridAutoColumnWidth,
			showSorterToolbar : _charEnableMultiSort,
			showPagerRefreshLink : false,
			columnHeaderFilterCfg : {
				remoteFilter : true,
				filters : [{
							type : 'list',
							colId : 'actionStatus',
							options : []
						}]
			},
			storeModel : {
				fields :
					[
						'positionDate','openingPosition','netMovement','closingPosition',
						'rateType', 'baseRateCode', 'spread', 'effectiveRate', 'interestAmount'
					],
					proxyUrl : 'getLmsInterAccountPositionList.srvc',
					rootNode : 'd.interAccountPositionList',
			//	sortState : arrSorters,
				totalRowsNode : 'd.__count'
			},
			//groupActionModel : {},
			defaultColumnModel : me.getColumnModel( INTERACCOUNT_POSITION_COLUMN_MODEL ),
			fnColumnRenderer : me.columnRenderer
			//fnRowIconVisibilityHandler : me.isRowIconVisible
		}
	});
	return groupView;
},
columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId) {
	if (record.get('isEmpty')) {
			if (rowIndex === 0 && colIndex === 0) {
				meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
				return getLabel('gridNoDataMsg','No records found !!!');											
			}
		} else
			return value;
},
	getColumnModel : function(arrCols) {
		var me = this, cfgCol = {};
		var arrColumns = [];
		// var arrColumns = [];
		//arrColumns = arrColumns.concat(arrCols);
		if (Ext.isEmpty(arrColumns)) {
			for (var i = 0; i < arrCols.length; i++) {
				objCol = arrCols[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				cfgCol.locked = objCol.locked;
				cfgCol.width = objCol.width;
				cfgCol.sortable = objCol.sortable;
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}
				else if( objCol.colId === 'requestedAmnt' )
				{
					cfgCol.align = 'right';
				}
				if (objCol.colId === 'baseRateCode') {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, rowIndex, colIndex, store, view, colId) {
						var strRet = '';
						var strSubTotal;

						var data = store.proxy.reader.jsonData;
						if (data && data.d && data.d.__subTotal) {
							strSubTotal = data.d.__subTotal;
						}
						// }
						if (null != strSubTotal && strSubTotal != '$0.00') {
							strRet = getLabel('subTotal', 'Sub Total');
						}
						return strRet;
					}
				}
				if (objCol.colId === 'interestAmount') {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, rowIndex, colIndex, store, view, colId) {
						var strRet = '';
						var data = store.proxy.reader.jsonData;
						if (data && data.d && data.d.__subTotal) {
							if (data.d.__subTotal != '$0.00')
								strRet = data.d.__subTotal;
						}
						return strRet;
					}
				}
				
				cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
				//if(cfgCol.width === 120)
					cfgCol.width =  120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrColumns.push( cfgCol );
			}
			
		}
		return (arrColumns || []);
	}
});