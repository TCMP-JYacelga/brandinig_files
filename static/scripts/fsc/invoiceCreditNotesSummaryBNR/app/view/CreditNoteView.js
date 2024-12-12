Ext.define('GCP.view.CreditNoteView', {
	extend : 'Ext.container.Container',
	xtype : 'creditNoteView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.CreditNoteFilterView'],
	
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView(selectedFilterLoggerDesc);
		me.items = [groupView];
		me.callParent(arguments);
	},
	
	createGroupView : function(selectedFilterLoggerDesc) {
		var me = this,
			groupView = null;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objCreditNoteCenterPref = objCNBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
			objSaveLocalStoragePref = objSaveBuyerLocalStoragePref;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objCreditNoteCenterPref = objCNSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
			objSaveLocalStoragePref = objSaveSellerLocalStoragePref;
		}
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if (objCreditNoteCenterPref) {
			var objJsonData = Ext.decode(objCreditNoteCenterPref);
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
			//cfgGroupByUrl : 'static/scripts/fsc/invoiceCreditNotesSummaryBNR/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/creditNoteCenter/CNC.json?$filterGridId=GRD_FSC_CRNOTE&$columnModel=false&$filterscreen='+selectedFilterLoggerDesc,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			selectedFilterLoggerDesc : selectedFilterLoggerDesc,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'creditNoteFilterView'
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
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
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
					fields : ['__metadata','identifier','reference','entryDate','invoiceAmount','subsidiaryDesc','buyerSellerDesc','scmMyProductName','requestStateDesc','history','currencySymbol'],
					proxyUrl : 'services/creditNotesList/'+selectedFilterLoggerDesc+'.json',
					rootNode : 'd.summaryList',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : !Ext.isEmpty(Ext.decode(arrGenericColumnModel))
										? arrGenericColumnModel
										: !Ext.isEmpty(CREDIT_NOTE_CENTER_COLUMNS)
										? CREDIT_NOTE_CENTER_COLUMNS : [],
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
		}else{
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
				itemText : getLabel('cnsubmit', 'Submit'),
				maskPosition : 8
			},
			'discard' : {
				actionName : 'discard',
				isGroupAction : true,
				itemText : getLabel('cndiscard', 'Discard'),
				maskPosition : 4
			},
			'auth' : {
				actionName : 'authorize',
				isGroupAction : true,
				itemText : getLabel('cnauthorize', 'Approve'),
				maskPosition : 5
			},
			'reject' : {
				actionName : 'reject',
				isGroupAction : true,
				itemText : getLabel('cnreject', 'Reject'),
				maskPosition : 6
			},
			'send' : {
				actionName : 'send',
				isGroupAction : true,
				itemText : getLabel('cnsend', 'Send'),
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
							text : getLabel('cnauthorize', 'Approve'),
							actionName : 'btnAuthorize',
							maskPosition : 5
							});
						break;
					case 'reject' :
						itemsArray.push({
							itemId : 'reject',
							text : getLabel('cnreject', 'Reject'),
							actionName : 'btnReject',
							maskPosition : 6
							});
						break;
					case 'send' :
						itemsArray.push({
							itemId : 'send',
							text : getLabel('cnsend', 'Send'),
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