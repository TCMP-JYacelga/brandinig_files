
Ext.define('GCP.view.account.AccountView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountView',
	requires : [/*'GCP.view.activity.AccountActivityTitleView',			
			'GCP.view.common.SummaryRibbonView',*/
			'GCP.view.account.AccountFilterView', 'Ext.Ajax',
			'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel',
			'Ext.container.Container', 'Ext.button.Button', 'Ext.menu.Menu',
			'Ext.form.field.Text','Ext.ux.gcp.GridHeaderFilterView'],
	autoHeight : true,
	width : '100%',	
	gridModel : null,
	accountFilter : null,
	accCcySymbol : null,
	initComponent : function() {
		var me = this;			
		var groupView=me.createGroupView();
		me.items=[/*{
					xtype : 'transactionInitiationView',
					itemId : 'transferFunds',
					hidden : true
				},*/groupView];
		me.callParent(arguments);
	},
	createGroupView:function(){
		var me=this;
		var groupView = null;
		var strGridId = 'GRD_BR_CASHACCOUNT';
		var arrCols = new Array(),arrSorters=new Array(),arrColsPref = null;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var data = me.gridModel;
		arrColsPref = data.gridCols;
		arrSorters=data.sortState;
		var data = me.gridModel;
		arrColsPref = data.gridCols;
		arrSorters=data.sortState;
		arrCols = me.getColumns(arrColsPref);
		pgSize = data.pgSize || _GridSizeTxn;
		showPager = data.gridSetting
					&& !Ext.isEmpty(data.gridSetting.showPager)
					? data.gridSetting.showPager
					: true;
		heightOption = data.gridSetting
				&& !Ext.isEmpty(data.gridSetting.heightOption)
				? data.gridSetting.heightOption
				: null;	
		
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objAccountGroupByPref) 
		{
			var objJsonData = Ext.decode(objAccountGroupByPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CASH_POSITION_GENERIC_ACCOUNT_COLUMN_MODEL || '[]');
		}

		if (objAccountGroupByPref) 
		{
			var objJsonData = Ext.decode(objAccountGroupByPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}
		
		if(objSavedLocalAccntPref){
			var objLocalData = Ext.decode(objSavedLocalAccntPref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		groupView=Ext.create("Ext.ux.gcp.GroupView",{
			cfgGroupByUrl : Ext.String.format('services/grouptype/cashpositionAccount/groupBy.json?$filterGridId={0}', strGridId),
			cfgSummaryLabel : 'Account',
			cfgGroupByLabel : 'Group By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode,
			cfgSubGroupCode : objLocalSubGroupCode || objGeneralSetting.defaultGroupByCode,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgParentCt : me,
			enableQueryParam:false,
			itemId : 'activityGrid',
			cls : 't7-grid',					
			cfgShowFilter : true,											
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
		    cfgAutoGroupingDisabled:true,
		    cfgShowAdvancedFilterLink : false,
		    cfgShowRibbon : true,
		    getActionColumns : function() {
		    	if(hasfeatureAccountDetails.toLowerCase() ==='true'){
		  			return[me.createActionColumn()]
				}
		    },	
			cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalAccountTargetDiv"></div>'}], itemId : 'summaryCarousal',showSetting : false },
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'accountFilterView'
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
						fields : ['summaryDate','accountNumber', 'accountName', 'privelgeFlag','accountType',
							'transactionCategory', 'creditCount', 'debitCount',
							'identifier', 'debit', 'credit','currenySymbol','availableBalance','ledgerBalance'],
						proxyUrl : 'services/cashPositionsummary/accounts',
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					},
					fnRowIconVisibilityHandler : me.isRowIconVisible,
					defaultColumnModel : me.getDefaultColumnModel(arrColumnSetting),
					fnColumnRenderer : me.columnRenderer
			}
		});
		return groupView;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
	  var retValue = true;
	  /*var granularAccountDetailFlag = record.get('privelgeFlag');;
		if(itmId==='txnDetails'){
			if(!Ext.isEmpty(granularAccountDetailFlag) && granularAccountDetailFlag=='Y' ){
				return true;
			}	
		}*/
		return retValue;
	},
	getDefaultColumnModel : function(arrCols) {
		var me = this, columnModel = null;
		columnModel = [];
		columnModel=me.getColumns(arrCols)
		return columnModel;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//if(hasfeatureAccountDetails.toLowerCase() ==='true'){
		//  arrCols.push(me.createActionColumn())
		//}
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.isTypeCode)
					cfgCol.metaInfo = {
						isTypeCode : cfgCol.isTypeCode
					};
				if (cfgCol.colId !== 'noteText') {
					arrCols.push(cfgCol);
				} else {
					/**
					 * Notes column to be shown if user is entitled for Notes
					 * feature
					 */
					if (objClientParameters.enableNotes === true)
						arrCols.push(cfgCol);
				}
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
	
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
			
			
			optionlist.push({
			    itemId : 'txnDetails',
				itemLabel : getLabel('cptransaction', 'Transaction Details')	
				});
		objActionCol.items = optionlist;
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		if(colId ==='col_debit'){
			var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
						.get('currenySymbol') : '';
			if(!Ext.isEmpty(record.get('debit')))
				strRetValue = strCCY+value;
			else
				strRetValue = strCCY+'0.00';
		} else if(colId ==='col_credit'){
			var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
					.get('currenySymbol') : '';
			if(!Ext.isEmpty(record.get('credit')))
				strRetValue = strCCY+value;
			else
				strRetValue = strCCY+'0.00';		
	}
		else{
			strRetValue=value;
		}
		
		return strRetValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	refreshGroupView : function() {
		var me = this;
		var grid = me.down('grid[xtype="smartgrid"]');
		if (!Ext.isEmpty(grid)) {
			grid.refreshData();
		}
	}
});