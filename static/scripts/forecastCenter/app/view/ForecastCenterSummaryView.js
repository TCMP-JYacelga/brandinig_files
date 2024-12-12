Ext.define('GCP.view.ForecastCenterSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'forecastCenterSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.ForecastCenterFilterView'
			],
	autoHeight : true,
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
		var groupView = null, blnShowAdvancedFilter = true;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var objLocalGroupCode = null;
		if (objForecastCenterPref) {
			var objJsonData = Ext.decode(objForecastCenterPref);
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
		//cfgGroupByUrl :'services/grouptype/purchaseOrderCenter/PO.json?$filterGridId=GRD_FSC_POCEN&$filterscreen=BUYER', 
			cfgGroupByUrl : 'services/grouptype/forecastCenter/CFFTC.json?$filterGridId=GRD_FORECASTCENTER&$columnModel=true',
			cfgSummaryLabel : getLabel('Forecast', 'Forecast'),
			cfgGroupByLabel : getLabel('grpBy', 'Grouped By'),
			cfgGroupCode : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'forecastCenterFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				showSorterToolbar : _charEnableMultiSort,
				stateful : false,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus'
								//options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields :['productDesc','transactionAmount','forecastReferenceDay','forecastPeriod','transactionType','requestStateDesc','clientDesc','accountCurr','accountId','addSettledAmount','addSettledAmountDrCr','autoCloseFlag','balanceOutstandingAmount','autoCloseDays','balanceOutstandingDrCr','beanName','ccyCode','ccySymbol','checkerId','checkerStamp','clientCode','clientId','corporationId','forecastAmount','forecastAmountDrCr','forecastDate','forecastExpectation','forecastExpectationFrom','forecastExpectationTo','forecastMyproduct','forecastReference','rejectRemarks','forecastStatus','forecastType','frequencyCode','glId','identifier','isAuth','isRepetitive','lastRequestState','makerId','makerStamp','recordKeyNo','requestState','sellerCode','settledAmount','settledAmountDrCr','validFlag','__metadata','startEffectiveDate','endEffectiveDate','parentRecordKeyNo','history'],
					proxyUrl : 'services/forecastCenterGridList.json',
					rootNode : 'd.transactions',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				//defaultColumnModel : (arrGenericColumnModel || FORECAST_GENERIC_COLUMN_MODEL || []),
				defaultColumnModel : (arrGenericColumnModel || FORECAST_GENERIC_COLUMN_MODEL || []),
				fnColumnRenderer : me.columnRenderer,
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 5 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 6 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 1 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 9 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 7 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId === 'col_forecastAmount' || colId === 'col_settledAmount' || colId === 'col_transactionAmount')
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('ccySymbol'))) {
					strRetValue = record.get('ccySymbol') + ' ' + value;
			}
		}
		}
		else if(colId === 'col_transactionType'){
			if(!Ext.isEmpty(value) && value === 'C'){
				strRetValue = getLabel('credit', 'Credit');
			}
			else if(!Ext.isEmpty(value) && value === 'D'){
				strRetValue = getLabel('debit', 'Debit');
			}
		}
		else if(colId === 'col_isRepetitive'){
			if(!Ext.isEmpty(value) && value === 'N'){
				strRetValue = getLabel('no', 'No');
			}
			else if(!Ext.isEmpty(value) && value === 'Y'){
				strRetValue = getLabel('yes', 'Yes');
			}
		}
		else if(colId === 'col_frequencyCode'){
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
		else if(colId === 'col_forecastPeriod'){
		
			var frequencyCode = record.get('frequencyCode');
			var forecastPeriod = record.get('forecastPeriod');
			if((!Ext.isEmpty(freqMapForPeriod[frequencyCode])) && (!Ext.isEmpty(freqMapForPeriod[frequencyCode][forecastPeriod])))
				strRetValue = freqMapForPeriod[frequencyCode][forecastPeriod];
			else
				strRetValue = value;
		
		}
		else if(colId === 'col_forecastReferenceDay'){
		
			var frequencyCode = record.get('frequencyCode');
			var forecastReferenceDay = record.get('forecastReferenceDay');
			if((!Ext.isEmpty(freqMapForRefDay[frequencyCode])) && (!Ext.isEmpty(freqMapForRefDay[frequencyCode][forecastReferenceDay])))
				strRetValue = freqMapForRefDay[frequencyCode][forecastReferenceDay];
			else
				strRetValue = value;
		
		}
		else
			strRetValue = value
			
		return strRetValue;
	},

	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Discard', 'Accept','Reject'];
		var objActions = {
			/*'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('forecastActionSubmit', 'Submit'),
				maskPosition : 4
			},*/
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('forecastActionDiscard', 'Discard'),
				maskPosition : 9
			},
			'Accept' : {
				actionName : 'auth',
				itemText : getLabel('forecastActionApprove', 'Approve'),
				maskPosition : 5
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('forecastActionReject', 'Reject'),
				maskPosition : 6

			}/*,
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('forecastActionEnable', 'Enable'),
				maskPosition : 7
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('forecastActionDisable', 'Suspend'),
				maskPosition : 8
			}*/
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	
	},
	createGroupActionColumn : function() {

		var me = this;
		var colItems = [];
		var finalColItems = [];
		var availableActions = ['Submit', 'Discard', 'Accept', 'Reject'];
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			maskPosition : 1
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 2
				// fnClickHandler : viewRecord
			}];
		var objActionCol = null;

		colItems = me.getGroupActionColItems(availableActions);
		if(!Ext.isEmpty(allowHistory) && (allowHistory === 'Y')){
			var objAction =  {
					itemId : 'btnHistory',
					itemCls : 'grid-row-action-icon icon-history',
					itemLabel : getLabel('historyToolTip', 'View History'),
					maskPosition : 3
				};
			arrRowActions.splice(2, 0,objAction);
		}
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : 'Action',
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
					case 'Submit' :
						itemsArray.push({
							text : getLabel('forecastActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 4
								
						});
						break;
					case 'Discard' :
						itemsArray.push({
							text : getLabel('forecastActionDiscard',
									'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 9
								
							});
						break;
					
					case 'Reject' :
						itemsArray.push({
							text : getLabel('forecastActionReturnToMaker',
									'Reject'),
							actionName : 'reject',
							itemId : 'reject',
							maskPosition : 6
								
							});
						break;
					case 'Accept' :
						itemsArray.push({
							text : getLabel('forecastActionApprove', 'Approve'),
							actionName : 'auth',
							itemId : 'auth',
							maskPosition : 5
								
						});
						break;
					
				}

			}
		}
		return itemsArray;
	}

});