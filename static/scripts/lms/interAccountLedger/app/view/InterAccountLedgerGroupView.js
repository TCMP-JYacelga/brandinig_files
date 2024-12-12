Ext.define( 'GCP.view.InterAccountLedgerGroupView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.GroupView','Ext.ux.gcp.GridHeaderFilterView','GCP.view.InterAccountLedgerFilterView'
	],
	xtype : 'interAccountLedgerGroupView',	
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
				: (INTERACCOUNT_LEDGER_COLUMN_MODEL || '[]');
	}		
	groupView = Ext.create('Ext.ux.gcp.GroupView', {			
		cfgGroupByUrl : 'static/scripts/lms/interAccountLedger/data/InterAccGroupBy.json?',
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
						xtype : 'interAccountLedgerFilterView'
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
						'POSITION_DATE','MOV_ID','DR_CR','AMOUNT','OPENING_POSITION'
					],
					proxyUrl : 'getLmsInterAccountLedgerList.srvc',
					rootNode : 'd.commonDataTable',
					totalRowsNode : 'd.__count'
				},
			//groupActionModel : {},
			defaultColumnModel : me.getColumnModel( INTERACCOUNT_LEDGER_COLUMN_MODEL ),
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
	var me = this;		
	var arrColumns = [];
	//var arrColumns = [];
	arrColumns = arrColumns.concat(arrCols);
	return (arrColumns || []);
}
});