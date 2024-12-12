Ext.define('GCP.view.debitNoteCenterView', {
	extend : 'Ext.container.Container',
	xtype : 'debitNoteCenterView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.debitNoteCenterFilterView'],
	
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
			objDebitNoteCenterPref = objDNCBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objDebitNoteCenterPref = objDNCSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		
		if (objDebitNoteCenterPref) {
			var objJsonData = Ext.decode(objDebitNoteCenterPref);
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
			//cfgGroupByUrl : 'static/scripts/fsc/debitNoteCenterBNR/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/debitNoteCenter/DNC.json?$filterGridId=GRD_FSC_DRNOTE&$columnModel=false&$filterscreen='+selectedFilterLoggerDesc,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgSubGroupCode : objLocalSubGroupCode,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			selectedFilterLoggerDesc : selectedFilterLoggerDesc,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'debitNoteCenterFilterView'
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
				pageSize :  objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['__metadata','reference','entryDate',
					          'invoiceAmount','subsidiaryDesc','buyerSellerDesc',
					          'scmMyProductName','requestStateDesc','clientDescription',
					          'aliasClientDescription','anchorClient','beanName',
					          'buyerSeller','canAuth','clientCode','creditDebitNotestate',
					          'creditDebitProduct','dealerVendorCode','displaystate',
					          'enteredBy','enteredByClient','history','identifier',
					          'invoiceCurrencyCode','invoiceNoteType','lastRequestState',
					          'makerId','module','prdOrAccount','productWorkflow','currencySymbol',
					          'recordKeyNo','requestState','scmMyProduct','transmitted','validFlag'],
					proxyUrl : 'services/debitNotesList/'+selectedFilterLoggerDesc+'.json',
					//proxyUrl : 'static/scripts/fsc/debitNoteCenterBNR/data/summaryData.json',
					rootNode : 'd.summaryList',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				/*defaultColumnModel : !Ext.isEmpty(Ext.decode(arrGenericColumnModel))
										? arrGenericColumnModel
										: !Ext.isEmpty(DEBIT_NOTE_CENTER_COLUMNS)
										? DEBIT_NOTE_CENTER_COLUMNS : [],*/
				defaultColumnModel : !Ext.isEmpty(Ext.decode(arrGenericColumnModel))
										? arrGenericColumnModel
										: !Ext.isEmpty(DEBIT_NOTE_CENTER_COLUMNS)
										? DEBIT_NOTE_CENTER_COLUMNS : [],
				
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			}
		});
		return groupView;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		
		if(colId === 'col_invoiceAmount'
				&& record.get('currencySymbol')){
			strRetValue = record.get('currencySymbol') + ' ' + value;
		}
		else if(colId==='col_requestStateDesc')
		{
			value = value.replace(/\s/g,'');   
			strRetValue = getLabel(value,value)
			
		}
		else{
			strRetValue	= value;
		}
		
		if(!Ext.isEmpty(value)){
				meta.tdAttr = 'data-qtip="'+value+'"';
		}
		//strRetValue	= value;
		return strRetValue;
	},
	
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['submit','discard','auth','reject','send']);
		var objActions = {
			'submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('dnsubmit', 'Submit'),
				maskPosition : 8
			},
			'discard' : {
				actionName : 'discard',
				isGroupAction : true,
				itemText : getLabel('dndiscard', 'Discard'),
				maskPosition : 4
			},
			'auth' : {
				actionName : 'authorize',
				isGroupAction : true,
				itemText : getLabel('dnauthorize', 'Approve'),
				maskPosition : 5
			},
			'reject' : {
				actionName : 'reject',
				isGroupAction : true,
				itemText : getLabel('dnreject', 'Reject'),
				maskPosition : 6
			},
			'send' : {
				actionName : 'send',
				isGroupAction : true,
				itemText : getLabel('dnsend', 'Send'),
				maskPosition : 7
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 9;
			var maskArray = new Array();
			var actionMask = '';
			var rightsMap = record.data.__metadata.__rightsMap;
			var buttonMask = '';
			var retValue = true;
			var bitPosition = '';
			if (!Ext.isEmpty(maskPosition)) {
				bitPosition = parseInt(maskPosition,10) - 1;
				maskSize = maskSize;
			}
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__buttonMask))
				buttonMask = jsonData.d.__buttonMask;
			
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
				
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
		
			retValue = isActionEnabled(actionMask, bitPosition);
			
			return retValue;
	},

	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['edit','viewRecord','history','authorize','reject','send'];
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
					case 'edit' :
						itemsArray.push({
							itemId : 'btnEdit',
							text : getLabel('editRecord', 'Modify Record'),
							actionName : 'btnEdit',
							maskPosition : 1
							});
						break;
						
					case 'viewRecord' :
						itemsArray.push({
							itemId : 'btnView',
							text : getLabel('ViewRecord', 'View Record'),
							actionName : 'btnView',
							maskPosition : 2
							});
						break;
						
					case 'history' :
						itemsArray.push({
							itemId : 'btnHistory',
							text : getLabel('history', 'View History'),
							actionName : 'btnHistory',
							maskPosition : 3
							});
						break;
					case 'authorize' :
						itemsArray.push({
							itemId : 'authorize',
							text : getLabel('dnauthorize', 'Approve'),
							actionName : 'btnAuthorize',
							maskPosition : 5
							});
						break;
					case 'reject' :
						itemsArray.push({
							itemId : 'reject',
							text : getLabel('dnreject', 'Reject'),
							actionName : 'btnReject',
							maskPosition : 6
							});
						break;
					case 'send' :
						itemsArray.push({
							itemId : 'send',
							text : getLabel('dnsend', 'Send'),
							actionName : 'btnReject',
							maskPosition : 7
							});
						break;
				}
			}
		}
		return itemsArray;
	}
});