/** 
 * @class GCP.view.summary.AccountSummaryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.summary.AccountSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountSummaryView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.summary.AccountSummaryFilterView'],
	autoHeight : true,
	width : '100%',
	//cls : 'ux_panel-background',
	equiCcy : null,
	equiCcySymbol : null,
	initComponent : function() {
		var me = this;
		var isInfoHidden = false;
		if (summaryType === 'previousday') 
		{
			isInfoHidden = true;				
		}
		var groupView = me.createGroupView(isInfoHidden);		
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGroupView : function(isInfoHidden) {
		var me = this;
		var groupView = null;
		var strGridId = 'GRD_BR_ACCSUM';
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
					: Ext.decode(arrGenericGridColumnModel || '[]');
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
			if(gridOrSummary=='widget')
				objLocalSubGroupCode ='all';
		
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : Ext.String
							.format(
									'services/grouptype/btrSummary/groupBy.json?$filter={0}&$filterGridId={1}',
									summaryType , strGridId),
					cfgSummaryLabel : 'Accounts',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : (!Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
					cfgSubGroupCode : objLocalSubGroupCode,
					cfgParentCt : me,
					enableQueryParam:false,
					cfgShowRibbon : objClientParameters.enableSummaryRibbon,
					cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalTargetDiv"></div>'}], itemId : 'summaryCarousal',showSetting : true },
					cls : 't7-grid',					
					cfgShowFilter : true,
					cfgShowRefreshLink : false,
					cfgSmartGridSetting : false,
					cfgAutoGroupingDisabled : true,
					cfgShowAdvancedFilterLink : true,
					cfgFilterModel : {
						cfgContentPanelItems : [{
									xtype : 'accountSummaryFilterView'
								}],
						cfgContentPanelLayout : {
							type : 'vbox',
							align : 'stretch'
						}
					},
					getActionColumns : function() {
						return [me.createFavoriteActionColumn(),me.createActionColumn()]
					},
					cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgGridModel : {
						pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						//showCheckBoxColumn : true,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						showPagerRefreshLink : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						autoSortColumnList : true,
						minHeight : 100,
						storeModel : {
							fields : ['accountNumber', 'accountName', 'country' , 'region', 
									'mapTypeCodes', 'mapTypeCodeAmounts',
									'mapTypeCodeEquiAmounts', 'currentBalance',
									'ledgerBalance', 'summaryDate', 'float',
									'isFavorite', 'accountId', 'currencyCode','currencySymbol',
									'equiCurrencyCode','equiCurrencySymbol', 'accountCalDate',
									'bankCode', 'bankName', 'summaryISODate',
									'sessionNumber', 'subFacilityDesc','subFacilityCode','identifier',
									'typeOfAccount', 'branchCode','isHistoryFlag','granularIntraDayActivityFlag',
									'granularPrevDayActivityFlag','granularPrevDaySummaryFlag',
									'obligationNumber','clientName','companyId','granularEstatementsFlag'],
							proxyUrl : 'services/balancesummary/'+summaryType+'/liquidity.srvc',
							rootNode : 'd.summary',
							totalRowsNode : 'd.__count'
						},
						fnRowIconVisibilityHandler : me.isRowIconVisible,
						defaultColumnModel : me.getDefaultColumnModel(),
						/**
						 * @cfg{Function} fnColumnRenderer Used as default
						 *                column renderer for all columns if
						 *                fnColumnRenderer is not passed to the
						 *                grids column model
						 */
						fnColumnRenderer : me.columnRenderer,
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						heightOption : objGridSetting.defaultGridSize,
						showSorterToolbar : _charEnableMultiSort//For Multisort
					}
				});
		return groupView
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		
		var retValue = false;
		var granularIntraDayActivityFlag = record.data.granularIntraDayActivityFlag;
		var granularPrevDayActivityFlag = record.data.granularPrevDayActivityFlag;
		var granularPrevDaySummaryFlag = record.data.granularPrevDaySummaryFlag;
		var granularEstatementsFlag = 'N';
		granularEstatementsFlag = record.data.granularEstatementsFlag;

		if (itmId === 'btnLatestActivity') {
		
			if (enableIntraDayActivityflag && enablePrevDayActivityflag )
				{
					if(isGranularPermissionForClient  == 'Y')
					{
						if( granularIntraDayActivityFlag == 'Y' && granularPrevDayActivityFlag == 'Y')
							retValue = true;
						else if(granularIntraDayActivityFlag == 'Y' && record.data.isHistoryFlag == 'I' )
							retValue = true;
						else if(granularPrevDayActivityFlag == 'Y' && record.data.isHistoryFlag == 'H' )
							retValue = true;	
					}
					else
						retValue = true;
				}
			else if( enableIntraDayActivityflag  && record.data.isHistoryFlag == 'I' )
			{ 	
				if(isGranularPermissionForClient  == 'Y')
					{	if(granularIntraDayActivityFlag == 'Y')
						retValue = true;		
					}
				else
					retValue = true;	
			}		
			else if(enablePrevDayActivityflag && record.data.isHistoryFlag == 'H' )
				{ 
					if(isGranularPermissionForClient  == 'Y')
					{
						if( granularPrevDayActivityFlag =='Y')
							retValue = true;	
					}
					else
						retValue = true;
				}
		} 
		if( itmId === 'btnBalances')
		{
			if(enablePrevDaySummary && summaryType ==='previousday')
			{
				if (isGranularPermissionForClient == 'Y') {
					if (granularPrevDaySummaryFlag == 'Y')
						retValue = true;
				} else
					retValue = true;	
			}				
		}	 
		if( itmId === 'btnAdditionalInfo')
			retValue = true;			
		if( itmId === 'btneStatements')
			{
				if(enableEstatementsflag){
					if (isGranularPermissionForClient == 'Y') {
						if (granularEstatementsFlag == 'Y')
							retValue = true;
					} else
						retValue = true;
				}
			}
		return retValue;
	},

	getDefaultColumnModel : function() {
		var me = this, columnModel = null;
		if(objDefPref['SUMMARY']['GRID'][mapService['BR_GRIDVIEW_GENERIC']])
			columnModel = me.getColumns(objDefPref['SUMMARY']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel'] || []);
		else	
			columnModel = [];
		return columnModel;
	},
	getDefaultColumnPreferences : function () {
		if(objDefPref['SUMMARY']['GRID'][mapService['BR_GRIDVIEW_GENERIC']])
			return objDefPref['SUMMARY']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel'];
		else 
			return [];
	},
	createActionColumn : function() {
		var me = this;
		var optionlist = [];
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			locked : true,
			width : 108,
			lockable : false,
			sortable : false,
			hideable : false,
			items : [],
			visibleRowActionCount : 0
		};
	
		

			optionlist.push(/*{
				itemId : 'btnActivity',
				itemLabel : getLabel('activities', 'Activities')
					// fnClickHandler : viewRecord
				},*/ {
				itemId : 'btnLatestActivity',
				itemLabel : getLabel('latestActivities', 'Latest Activities')
					// fnClickHandler : viewRecord				
				});
	
		optionlist.push({
				itemId : 'btnBalances',
				itemLabel : getLabel('balances', 'Balances')
					// fnVisibilityHandler : isIconVisible
					// fnClickHandler : showHistory					
				}, {
				itemId : 'btnAdditionalInfo',
				itemLabel : getLabel('additionalAccInfo', 'Account Information')
				}, {
					itemId : 'btneStatements',
					itemLabel : getLabel('eStatementsInfo', 'eStatements')
					});
		objActionCol.items = optionlist;
		return objActionCol;
	},
	createFavoriteActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'favorite',
			align : 'left', 
			colHeader : getLabel('favorite', 'Favorite'),
			width : 90,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			fnColumnRenderer : function(a,b,c) {
				if (b.record.data.isFavorite === 'Y') {
					return "<a class='linkbox icon-misc-favorite'><i class='fa fa-star'></i></a>";
				} else {
					return "<a class='linkbox icon-misc-nonfavorite'><i class='fa fa-star'></i></a>";
				}
			},
			items : [{
				itemId : 'btnfavorite',
				itemCls : 'linkbox misc-icon icon-misc-nonfavorite',
				toolTip : getLabel('favorite', 'Favorite'),
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
					if (record.data.isFavorite === 'Y') {
						if(!_IsEmulationMode)
						record.set("isFavorite", "N");
						var accId = record.data.accountId;
						me.fireEvent('removeFavoriteAccount', accId, me);
					} else {
						if(!_IsEmulationMode)
						record.set("isFavorite", "Y");
						var accId = record.data.accountId;
						me.fireEvent('addFavoriteAccount', accId, me);
					}
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty')) {
						if (record.data.isFavorite === 'Y') {
							var iconClsClass = 'linkbox misc-icon icon-misc-favorite';
							return iconClsClass;
						} else {
							var iconClsClass = 'linkbox misc-icon icon-misc-nonfavorite';
							return iconClsClass;
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createFavoriteActionColumn());
		//arrCols.push(me.createActionColumn());

		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.metaInfo && cfgCol.metaInfo.isTypeCode && cfgCol.metaInfo.isTypeCode === 'Y'){
						cfgCol.sortable = false;
				}
				if (i === 0) {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var strRet = getLabel('total', 'Total');
						return strRet;
					}
				}
				// Summary Render logic will goes here, use allowSubTotal
				if (cfgCol.allowSubTotal === 'Y') {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, rowIndex, colIndex, store, view, colId) {
						var strRet = '';
						var strKey = colId;
						if (strKey && !this.hidden) {
							var data = store.proxy.reader.jsonData, objMap = null;
							strKey = strKey.substring(4);
							if (data && data.d && data.d.__columnSubTotal) {
								objMap = data.d.__columnSubTotal;
								if (!Ext.isEmpty(objMap)
										&& !Ext.isEmpty(objMap[strKey])) {
									strRet = ' ' + (me.equiCcySymbol || '')
											+ ' ' + objMap[strKey];
								}
							}
						}
						return strRet;
					}
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "", strEqRetValue = "";
		var column = view.getHeaderAtIndex(colIndex);
		var isTypeCode = (column.metaInfo && column.metaInfo.isTypeCode)
				? column.metaInfo.isTypeCode
				: 'N';
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return;
		if (isTypeCode === 'N') {
			if (colId === 'col_favorite') {
				var me = this;
				if (!record.get('isEmpty')) {
					if (record.data.isFavorite === 'Y') {
						strRetValue = '<a onclick="'
								+ this.myfunction()
								+ 'class="linkbox misc-icon icon-misc-favorite"></a>';
					} else {
						strRetValue = '<a title="'
								+ '" class="linkbox misc-icon icon-misc-nonfavorite"></a>';
					}
				}
			} else
				strRetValue = value;
		} else {
			var strDataType = column.colType || 'string';
			var strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record
					.get('currencySymbol') : '';
			if (strDataType != 'amount')
				strCCY = '';
			var typecode = colId.substring(4);
			var colVal = record.get('mapTypeCodeAmounts')[typecode];
			
			if (colVal != '' && colVal != undefined){
			
			if (  colVal == 0 || colVal == 0.00) {
				if (strDataType == 'amount') {
					strRetValue = strCCY + ' ' + '0.00';
				} else {
					strRetValue = '';
				}
			} else
				strRetValue = strCCY + ' ' + colVal;
			}
			else {
				strRetValue = '';
			}

			// Equivalent CCY amount to be displayed on tooltip
			strCCY = !Ext.isEmpty(record.get('equiCurrencySymbol')) ? record
					.get('equiCurrencySymbol') : '';
			if (strDataType != 'amount')
				strCCY = '';
			typecode = colId.substring(4);
			colVal = record.get('mapTypeCodeEquiAmounts')[typecode];
			if (colVal == null || colVal == 0 || colVal == 0.00) {
				strEqRetValue = strCCY + ' ' + '0.00';
			} else
				strEqRetValue = strCCY + ' ' + colVal;
			// populating data in remaining column
			if (Ext.isEmpty(strRetValue)) {
				strRetValue = value;
			}
		}
		if(strEqRetValue != null && strEqRetValue != undefined && strEqRetValue != "")
		{
			meta.tdAttr = 'title="' + strEqRetValue + '"';
		}
		else if(strRetValue != null && strRetValue != undefined && strRetValue != "")
		{
			meta.tdAttr = 'title="' + strRetValue + '"';
		}
		return strRetValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});