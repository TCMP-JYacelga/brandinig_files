Ext.define('GCP.view.loanRepaymentView', {
	extend : 'Ext.container.Container',
	xtype : 'loanRepaymentView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.loanRepaymentFilterView'],
	
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView(selectedFilterLoggerDesc);
		me.items = [groupView];
		me.callParent(arguments);
	},
	
	createGroupView : function(selectedFilterLoggerDesc) {
		var me = this,
			groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objLoanRepaymentCenterPref = objLRCBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objLoanRepaymentCenterPref = objLRCSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		
		if (objLoanRepaymentCenterPref) {
			var objJsonData = Ext.decode(objLoanRepaymentCenterPref);
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
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			//cfgGroupByUrl : 'static/scripts/fsc/loanRepaymentCenterBNR/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/loanRepaymentCenter/LRC.json?$filterGridId=GRD_FSC_LONREPAY&$columnModel=false&$filterscreen='+selectedFilterLoggerDesc,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			selectedFilterLoggerDesc : selectedFilterLoggerDesc,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'loanRepaymentFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['clientCode','identifier','sessionId','invPaymentProductsNull',
					          'invoiceReference','creditDebitNotestate','transmitted','loanOutStandingAmount',
					          'netPaymentAmount','settledAmount','loanPyamnetUnderProcess','loanReference',
					          'beanName', 'loanDueDate', 'productWorkflow', 'scmMyProduct','invoiceAmount',
					          'scmMyProductName','invoiceCurrencyCode','buyerSeller','enteredBy','clientDescription',
					          'loanInternalReferenceNmbr','loanInvoiceSize','loanReleaseDate','invoicePoFlag',
					          'module','loanAmount','aliasClientDescription','requestState','lastRequestState',
					          'validFlag','makerId','__metadata','status','financeIntRefNo','currencySymbol','companyId'],
					proxyUrl : 'services/loanRepaymentList/'+selectedFilterLoggerDesc+'.json',
					//proxyUrl : 'static/scripts/fsc/loanRepaymentCenterBNR/data/summaryData.json',
					rootNode : 'd.summaryList',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : !Ext.isEmpty(Ext.decode(arrGenericColumnModel))
										? arrGenericColumnModel
										: !Ext.isEmpty(LOAN_REPAYMENT_CENTER_COLUMNS)
										? LOAN_REPAYMENT_CENTER_COLUMNS : [],
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			}
		});
		return groupView;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		
		if(colId === 'col_payments' && value != '') {
			if("PENDING" === record.get('status')){
					strRetValue = getLabel('Ppending_payment','Pending Payment');
					meta.tdAttr = 'data-qtip="Payment Pending"';
			} else if("PARTIAL" === record.get('status')){
				 strRetValue = getLabel('partially_paid','Partially paid');
				 meta.tdAttr = 'data-qtip="Partially Paid"';
			} else if(parseInt(record.data.settledAmount,10) 
				== parseInt(record.data.loanAmount,10)){
					strRetValue = getLabel('completely_paid','Completely Paid');
			}
		} /*else if(colId === 'col_buyerSeller'){
			var anchorClient = getLabel('anchorClient','Anchor Client');
			if(strSessionClient
					&& strSessionClient === record.data.clientCode){
				strRetValue = record.data.buyerSeller;
			} else{
				strRetValue = record.data.clientDescription;
				if(!Ext.isEmpty(strRetValue)) {
					meta.tdAttr = 'data-qtip="' + anchorClient + '"';
				}
			}
			if('TRUE' !== record.data.anchorClient)
				strRetVal = record.data.clientDescription;
		}*/ else if(colId === 'col_invoiceAmount'
					|| colId === 'col_loanAmount'
					|| colId === 'col_loanOutStandingAmount'){
			strRetValue = record.get('currencySymbol') + ' ' + value;
		} else if(colId === 'col_invoicePoFlag' && value != ''){
			if(value === "I"){
                meta.tdAttr = 'data-qtip='+getLabel("invoice","Invoice");
				strRetValue = "Invoice";
			} else if(value === "P"){
                meta.tdAttr = 'data-qtip='+getLabel("purchaseorder","Purchase Order");
				strRetValue = "PO";
			}
			//strRetValue = value;
			//meta.align = "center";
		}
		else
			strRetValue	= value;
		return strRetValue;
	},
	
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['payNow']);
		var objActions = {
			'payNow' : {
				actionName : 'payNow',
				isGroupAction : true,
				itemText : getLabel('loanRepayActionPayNow', 'Pay Now'),
				maskPosition : 1
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 111;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = false;
		if(maskPosition === 2){
			if(record.data.invoicePoFlag === "I"){
				retValue = true;
			}
		} else if(maskPosition === 3){
			if(record.data.invoicePoFlag === "P"){
				retValue = true;
			}
		} else
			retValue = true;
		return retValue;
	},

	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['payNow','viewInvoice','viewPO'];
		var arrRowActions = [];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colHeader: getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},

	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'payNow' :
						itemsArray.push({
							text : getLabel('loanRepayActionPayNow', 'Pay Now'),
							actionName : 'payNow',
							itemId : 'payNow',
							maskPosition : 1
							});
						break;
						
					case 'viewInvoice' :
						itemsArray.push({
							text : getLabel('viewInvoice', 'View Invoice'),
							actionName : 'viewInvoice',
							itemId : 'viewInvoice',
							maskPosition : 2
							});
						break;
						
					case 'viewPO' :
						itemsArray.push({
							text : getLabel('viewPo', 'View PO'),
							actionName : 'viewPO',
							itemId : 'viewPO',
							maskPosition : 3
							});
						break;
				}
			}
		}
		return itemsArray;
	}
});