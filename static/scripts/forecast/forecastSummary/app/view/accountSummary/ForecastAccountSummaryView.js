/** 
 * @class GCP.view.accountSummary.ForecastAccountSummaryView
 * @extends Ext.panel.Panel
 * @author Aditi Joshi
 */
Ext.define('GCP.view.accountSummary.ForecastAccountSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountSummaryView',
	requires : ['Ext.ux.gcp.GroupView',
			'GCP.view.accountSummary.ForecastAccountSummaryFilterView'],
	autoHeight : true,
	width : '100%',
	initComponent : function() {
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
		var groupView = null;
		var strGridId = 'GRD_CFF_ACCSUM';
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
        var objLocalGroupCode = null;
		if (objSummaryPref) {
			var objJsonData = Ext.decode(objSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');
		}
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
            objLocalGroupCode = objLocalData && objLocalData.d.preferences
                        		&& objLocalData.d.preferences.tempPref 
		                        && objLocalData.d.preferences.tempPref.groupTypeCode ? objLocalData.d.preferences.tempPref.groupTypeCode : null;                                    
		}
		
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : Ext.String
					.format(
							'services/grouptype/forecastAccountSummary/CFFACCSUM.json?$filterGridId={0}&$columnModel=true',
							strGridId),
			cfgSummaryLabel : getLabel('Forecast', 'Forecast'),
			cfgGroupByLabel : getLabel('grpBy', 'Grouped By'),
			cfgGroupCode : (!Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgParentCt : me,
			cfgSubGroupCode : objLocalSubGroupCode,
			enableQueryParam : false,
			cfgShowRibbon : true,
			cfgRibbonModel : {
				items : [{
							xtype : 'container',
							html : '<div id="summaryCarousalTargetDiv"></div>'
						}],
				itemId : 'summaryCarousal',
				showSetting : true
			},
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'forecastAccountSummaryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				itemId : 'accSummaryFilterView'
			},
			getActionColumns : function() {
				return [me.createActionColumn()]
			},
			cfgCaptureColumnSettingAt : !Ext
					.isEmpty(_charCaptureGridColumnSettingAt)
					? _charCaptureGridColumnSettingAt
					: 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showPagerRefreshLink : false,
				showSummaryRow : false,
				showEmptyRow : false,
				showPager : true,
				autoSortColumnList : true,
				minHeight : 100,
				storeModel : {
					fields : ['glId','accDesc','openingBalance','inFlows','outFlows','closingBalance','eqvOpeningBalance',
							'eqvClosingBalance','eqvOutFlows','eqvInFlows',
					'subFacilityDesc','clientDesc','currency','bankDesc','currencySymbol','branchName','obligationId'],
					proxyUrl : 'services/forecastSummary/accountSummary',
					rootNode : 'd.summary',
					totalRowsNode : 'd.__count'
				},
				fnRowIconVisibilityHandler : true,
				defaultColumnModel : (arrGenericColumnModel || FORECAST_SUMM_GENERIC_COLUMN_MODEL || []),
				fnColumnRenderer : me.columnRenderer,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				heightOption : objGridSetting.defaultGridSize,
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
			return true;
	},
	createActionColumn : function() {
		var me = this;
		var optionlist = [];
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : 'Actions',
			locked : true,
			width : 108,
			lockable : false,
			sortable : false,
			hideable : false,
			items : [],
			visibleRowActionCount : 1
		};

		optionlist.push({
					itemId : 'btnViewPeriodSummary',
					itemLabel : getLabel('viewRecord',
							'View Records')
				});
		objActionCol.items = optionlist;
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "", strEqRetValue = "";
		var column = view.getHeaderAtIndex(colIndex);
		
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return;
			
			if(colId === 'col_openingBalance' || colId === 'col_inFlows' || colId === 'col_outFlows' || colId === 'col_closingBalance')
		{
				if (!Ext.isEmpty(record.get('currencySymbol'))) {
					strRetValue = record.get('currencySymbol') + ' ' + value;
			}
			    if(colId === 'col_openingBalance')
				{
					strEqRetValue = record.get('eqvOpeningBalance');
				}
				if(colId === 'col_inFlows')
				{
					strEqRetValue = record.get('eqvInFlows');
				}
				if(colId === 'col_outFlows')
				{
					strEqRetValue = record.get('eqvOutFlows');
				}
				if(colId === 'col_closingBalance')
				{
					strEqRetValue = record.get('eqvClosingBalance');
				}
				meta.tdAttr = 'title="' + hoverCcySymbol + ' ' +strEqRetValue + '"';
		}

			// populating data in remaining column
			if (Ext.isEmpty(strRetValue)) {
				strRetValue = value;
			}
		
		return strRetValue;
	}
});