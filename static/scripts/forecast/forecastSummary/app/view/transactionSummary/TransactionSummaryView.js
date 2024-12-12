Ext.define('GCP.view.transactionSummary.TransactionSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'transactionSummaryView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.transactionSummary.TransactionSummaryFilterView'],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		groupView = null;
		var strGridId = 'GRD_CFF_TXNSUM';
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objTransactionPref) {
			var objJsonData = Ext.decode(objTransactionPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:Ext.decode(arrGenericTxnColumnModel || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : Ext.String.format('services/grouptype/forecastTransactionSummary/CFFTXNSUM.json?$filterGridId={0}&$columnModel=true',
							strGridId),
			cfgParentCt : me,
			cls : 't7-grid',
			itemId : 'transactionSummGrid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting || TRANSACTION_SUMM_GENERIC_COLUMN_MODEL,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'transactionSummaryFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				itemId : 'txnSummaryFilterView'
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
				itemId : 'transactionSummGrid',
				showPager : true,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['equivalentAmount','forecastAmountDrCr','isSubmitted', 'requestStateDesc', 'validFlag', 'requestState',
					'makerId', '__metadata', 'history', 'identifier','makerStamp','checkerStamp',
					'checkerId', 'credits', 'debits' ,'forecastDate','inFlows','outFlows','settledAmount',
					'forecastMyProduct','forecastReference','forecastAmount','clientDesc','forecastStatus','forecastType','ccyCode','ccySymbol'],
				    proxyUrl : 'services/forecastSummary/transactionSummary',
					rootNode : 'd.summary',
					totalRowsNode : 'd.__count'
				},
				defaultColumnModel : me.getColumnModel(TRANSACTION_SUMM_GENERIC_COLUMN_MODEL),
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			}
		});
		return groupView;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
			return true;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			
		var strRetValue = "", strEqRetValue = "";
		if(colId === 'col_inFlows' || colId === 'col_outFlows' || colId === 'col_settledAmount' || colId === 'col_forecastAmount')
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('ccySymbol'))){
					strRetValue = record.get('ccySymbol') + ' ' + value;
						}
				}
			}
		if(colId === 'col_forecastAmount'){
			if (!Ext.isEmpty(record.get('ccySymbol')) && !Ext.isEmpty(record.get('equivalentAmount')))
				strRetValue = record.get('ccySymbol') + ' ' +record.get('equivalentAmount');
		}
			
		if (Ext.isEmpty(strRetValue)) {
				strRetValue = value;
			
		}
		
		return strRetValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	getGroupActionModel : function(){},
	createGroupActionColumn : function() {
		var objActionCol = [];
		return objActionCol;
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
					itemId : 'btnViewTxn',
					itemLabel : getLabel('view',
							'View Record')
				});
		objActionCol.items = optionlist;
		return objActionCol;
	}
});