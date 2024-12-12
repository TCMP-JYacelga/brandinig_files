
Ext.define('GCP.view.transaction.TransactionView', {
	extend : 'Ext.panel.Panel',
	xtype : 'transactionView',
	requires : ['Ext.panel.Panel', 'Ext.container.Container', 'Ext.Img',
			'Ext.form.Label', 'Ext.button.Button', 'Ext.form.field.Text',
			'GCP.view.transaction.TransactionFilterView'],
	autoHeight : true,
	width : '100%',
	accountFilter : null,
	gridModel : null,
	summaryType : null,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.on('refreshGroupView', function() {
			me.refreshGroupView();
		});
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGroupView:function(){
		var me=this;
		var groupView = null;
		var strGridId = 'GRD_BR_CASHTXN';
		var arrCols = new Array(),arrSorters=new Array(),arrColsPref = null;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var objLocalGroupCode = null;
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

		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objTxnGroupByPref) 
		{
			var objJsonData = Ext.decode(objTxnGroupByPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CASH_POSITION_GENERIC_TXN_COLUMN_MODEL || '[]');
		}
		
	 	if (objTxnGroupByPref) {
			var objJsonData = Ext.decode(objTxnGroupByPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}
		if(objSavedLocalTxnPref){
			var objLocalData = Ext.decode(objSavedLocalTxnPref);
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
		groupView=Ext.create("Ext.ux.gcp.GroupView",{
			cfgGroupByUrl : Ext.String.format('services/grouptype/cashpositionTransaction/groupBy.json?$filterscreen=cashpositiontxn&$filterGridId=GRD_BR_CASHTXN'),
			cfgSummaryLabel : 'Transactions',
			cfgGroupByLabel : 'Group By',
			cfgGroupCode : (!Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objLocalSubGroupCode || objGeneralSetting.defaultGroupByCode,
			cfgParentCt : me,
			enableQueryParam:false,
			itemId : 'activityGrid',
			cls : 't7-grid',					
			cfgShowFilter : true,											
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled:false,
			cfgShowRibbon : true,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			getActionColumns : function() {
				return[me.createActionColumn()]
			},
			cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalTxnTargetDiv"></div>'}], itemId : 'summaryCarousal',showSetting : false },
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'transactionFilterView'
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
						fields : ['accountID','accountNumber','accountName', 'accountType', 'transactionDate',
							'transactionCategory', 'typeCode', 'typeCodeDesc','bankReference','remittanceText','remittanceTextFlag',
							'identifier', 'customerReference', 'textField','noteText','transactionAmt','credit','debit','currenySymbol','txnType',
							'__metadata'],
						proxyUrl : 'services/cashPositionsummary/transactions',
						rootNode : 'd.details',
						sortState:arrSorters,
						totalRowsNode : 'd.__count'
					},
					fnRowIconVisibilityHandler : me.isRowIconVisible,
					defaultColumnModel : me.getDefaultColumnModel(arrColumnSetting),
					fnColumnRenderer : me.columnRenderer
			}
		});
		return groupView;
	},
	getDefaultColumnModel : function(arrCols) {
		var me = this, columnModel = null;
		columnModel = [];
		columnModel=me.getColumns(arrCols)
		return columnModel;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
	
		return true;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
					arrCols.push(cfgCol);
				
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
	
	/*var arrCols = new Array();
	arrCols.push({
			itemId : 'notes',
			itemCls : 'grid-row-action-icon icon-notes',
			toolTip : getLabel('notes', 'Notes'),
			itemLabel : getLabel('notes', 'Notes')
		});
	arrCols.push({
			itemId : 'txnDetails',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('txnDetails', 'Transaction Details'),
			itemLabel : getLabel('txnDetails',
								'Transaction Details')

		});
	arrCols.push({
			itemId : 'email',
			itemCls : 'grid-row-email-icon',
			toolTip : getLabel('email', 'Email'),
			itemLabel : getLabel('email', 'Email')
		});
		if((enableIntraDayImageflag && summaryType == 'intraday')|| (enablePrevDayImageflag && summaryType == 'previousday') )
		{
		arrCols.push({
			itemId : 'check',
			itemCls : 'grid-row-check-icon',
			toolTip : getLabel('checkimg', 'Image'),
			itemLabel : getLabel('checkimg', 'Image')
		});
		}
		*/
	var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 108,
			colHeader: getLabel('actions', 'Actions'),
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : [{
						itemId : 'txnDetails',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('txnDetails', 'Transaction Details'),
						itemLabel : getLabel('txnDetails',
								'Transaction Details')
					}
					]
					
			
			};		
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		
		if(colId=='col_credit'){
			  var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
					.get('currenySymbol') : '';
			  if (!Ext.isEmpty(record.get('transactionAmt')) && (record.get('transactionAmt')>0 && record.get('txnType') ==='C'))
						return strCCY+Ext.util.Format.number(Math.abs(record.get('transactionAmt')),'0,000.00');
			}if(colId=='col_debit'){
			  var strCCY = !Ext.isEmpty(record.get('currenySymbol')) ? record
						.get('currenySymbol') : '';
			  if (!Ext.isEmpty(record.get('transactionAmt')) && (record.get('transactionAmt')>0 && record.get('txnType') ==='D'))
						return strCCY+Ext.util.Format.number(Math.abs(record.get('transactionAmt')),'0,000.00');
		}
		if ((colId === 'col_credit') || (colId === 'col_debit')) {
			if (value == null || value == 0 || value == 0.00) {
					strRetValue = "";
				}
		}else{
			strRetValue = value;
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