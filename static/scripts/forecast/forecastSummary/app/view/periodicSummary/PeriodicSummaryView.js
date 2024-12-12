/** 
 * @class GCP.view.activity.AccountActivityView
 * @extends Ext.panel.Panel
 * @author Sofiyan Memon
 */
Ext.define('GCP.view.periodicSummary.PeriodicSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'periodicSummaryView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.periodicSummary.PeriodicSummaryFilterView'],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objPeriodicPref) {
			var objJsonData = Ext.decode(objPeriodicPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:(PERIODIC_SUMM_GENERIC_COLUMN_MODEL || []);
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/forecast/forecastSummary/data/periodicGroupBy.json?$filterGridId=groupViewFilter',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			itemId : 'periodicGrid',
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'periodicSummaryFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				itemId : 'periodicFilterView'
			},
			getActionColumns : function() {
				return [me.createActionColumn()]
			},
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				itemId : 'periodicGrid',
				minHeight : 100,
				showCheckBoxColumn : false,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['glId','accDesc','openingBalance','inFlows','outFlows','closingBalance', 'period', 'forecastDate','forecastToDate',
								'subFacilityDesc','clientDesc','currency','bankDesc','currencySymbol','branchName','obligationId','clientCode'],
				    proxyUrl : 'services//forecastSummary/periodicSummary',
					rootNode : 'd.summary',
					totalRowsNode : 'd.__count'
				},
				defaultColumnModel : me.getColumnModel(arrColumnSetting || PERIODIC_SUMM_GENERIC_COLUMN_MODEL),
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId === 'col_period'){
			if(!Ext.isEmpty(value) && value === 'D'){
				strRetValue = getLabel('daily', 'Daily');
			}
			else if(!Ext.isEmpty(value) && value === 'M'){
				strRetValue = getLabel('monthly', 'Monthly');
			}
			else if(!Ext.isEmpty(value) && value === 'W'){
				strRetValue = getLabel('weekly', 'Weekly');
			}
		}
		else if(colId === 'col_openingBalance' || colId === 'col_inFlows' || colId === 'col_outFlows' || colId === 'col_closingBalance')
		{
				if (!Ext.isEmpty(record.get('currencySymbol'))) {
					strRetValue = record.get('currencySymbol') + ' ' + value;
			}
		}
		else
			strRetValue = value;
		return strRetValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	getGroupActionModel : function(){},
	createActionColumn : function() {
		var me = this;
		var optionlist = [];
		optionlist.push({
			itemId : 'btnViewTxnSummary',
			itemLabel : getLabel('view',
					'View')
		});
		var objActionCol = null;
		objActionCol = {
				colId : 'actioncontent',
				colType : 'actioncontent',
				colHeader : 'Actions',
				width : 108,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				items : optionlist,
				visibleRowActionCount : 1
			};
			return objActionCol;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
	}
});