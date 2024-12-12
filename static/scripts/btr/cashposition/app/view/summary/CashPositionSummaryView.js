
Ext.define('GCP.view.summary.CashPositionSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'cashPositionSummaryView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.summary.CashPositionSummaryFilterView'],
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
		var objGroupByPref = {}

		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if (objSummaryGroupByPref) 
		{
			var objJsonData = Ext.decode(objSummaryGroupByPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CASH_POSITION_GENERIC_COLUMN_MODEL || '[]');
		}


		if (objSummaryGroupByPref) 
		{
			var objJsonData = Ext.decode(objSummaryGroupByPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}
		if(objSavedLocalSummaryPref){
			var objLocalData = Ext.decode(objSavedLocalSummaryPref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl :'services/grouptype/cashPositionSummary/groupBy.json?$filterGridId=GRD_BR_CASHSUMM',
					cfgSummaryLabel : 'Cash Position Summary',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGeneralSetting.defaultGroupByCode,
					cfgSubGroupCode : objLocalSubGroupCode || objGeneralSetting.defaultGroupByCode,
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
					cfgParentCt : me,
					enableQueryParam:false,
					cls : 't7-grid',					
					cfgShowFilter : true,										
					cfgShowRefreshLink : false,
					cfgSmartGridSetting : true,
					cfgAutoGroupingDisabled:true,
					cfgShowAdvancedFilterLink : false,
					cfgShowRibbon : true,
					cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalTargetDiv"></div>'}], itemId : 'summaryCarousal',showSetting : false },
					getActionColumns : function() {
						if(hasfeatureAccount.toLowerCase() ==='true' || hasfeatureAccountDetails.toLowerCase() ==='true'){
					    	return[me.createActionColumn()]
						}
					},	
					cfgFilterModel : {
						cfgContentPanelItems : [{
									xtype : 'cashPositionSummaryFilterView'
								}],
						cfgContentPanelLayout : {
							type : 'vbox',
							align : 'stretch'
						}
					},
					cfgGridModel : {
						pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
						showSorterToolbar : _charEnableMultiSort,
						enableColumnAutoWidth : _blnGridAutoColumnWidth, 
						rowList : _AvailableGridSize,
						heightOption : objGridSetting.defaultGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : false,
						showPagerRefreshLink : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
						fields : ['txnCategoryDesc', 'txnCategoryTypeCode','creditCount','totalCreditAmount','currenySymbol',
							'debitCount', 'totalDebitAmount','accountId','__metadata'],
					    proxyUrl : 'services/cashPositionsummary/summary',
						rootNode : 'd.summary',
						totalRowsNode : 'd.__count'
					   }, 
						fnRowIconVisibilityHandler : me.isRowIconVisible,
						defaultColumnModel : me.getDefaultColumnModel(arrColumnSetting),
						/**
						 * @cfg{Function} fnColumnRenderer Used as default
						 *                column renderer for all columns if
						 *                fnColumnRenderer is not passed to the
						 *                grids column model
						 */
						fnColumnRenderer : me.columnRenderer
					}
				});
		return groupView
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var retValue = false;
	
		if( itmId === 'account')
		{
			if(hasfeatureAccount.toLowerCase() ==='true')	
			 retValue = true;	
		}
		if( itmId === 'txnDetails')
		{
			if(hasfeatureAccountDetails.toLowerCase() ==='true')	
			 retValue = true;	
		}
		return retValue;
	},

	getDefaultColumnModel : function(arrCols) {
		var me = this, columnModel = null;
		columnModel = [];
		columnModel=me.getColumns(arrCols)
		return columnModel;
	},
	createActionColumn : function() {
		var me = this;
		var optionlist = [];
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 108,
			colHeader: getLabel('actions', 'Actions'),
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 0
		};
			/*items : [{
						itemId : 'account',
						itemCls : 'grid-row-action-icon icon-account',
						toolTip : getLabel('account', 'Account'),
						itemLabel : getLabel('Account', 'Account')
					}, {
						itemId : 'txnDetails',
						itemCls : 'grid-row-action-icon icon-transaction',
						toolTip : getLabel('txnDetails', 'Transaction Details'),
						itemLabel : getLabel('txnDetails',
								'Transaction Details')
					}
					]*/
					
			
		optionlist.push({
				itemId : 'account',
				itemLabel : getLabel('Account', 'Account')		
				});
	
		optionlist.push({
				itemId : 'txnDetails',
				itemLabel : getLabel('txnDetails', 'Transaction Details')		
				});
		objActionCol.items = optionlist;		
		return objActionCol;
	},

	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//if(hasfeatureAccount.toLowerCase() ==='true' || hasfeatureAccountDetails.toLowerCase() ==='true'){
		//    arrCols.push(me.createActionColumn());
		//}

		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId ==='col_totalDebitAmount'){
			var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
						.get('currenySymbol') : '';
			strRetValue = strCCY+value;
		} else if(colId ==='col_totalCreditAmount'){
			var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
					.get('currenySymbol') : '';
		strRetValue = strCCY+value;
	}
		else{
			strRetValue=value;
		}
		
		return strRetValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});