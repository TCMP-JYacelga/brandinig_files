Ext.define(
	'GCP.controller.AgreementFrequencyController',
{
extend : 'Ext.app.Controller',
requires : [],
views : ['GCP.view.AgreementFrequencyView','GCP.view.AgreementFrequencyFilterView','GCP.view.HistoryPopup'],
refs : [
	{
		ref : 'agreementFrequencyView',
		selector : 'agreementFrequencyView'
	},
	{
		ref : 'groupView',
		selector : 'agreementFrequencyView groupView'
	},
	{
		ref:'filterView',
		selector:'agreementFrequencyView groupView filterView'	
	},
	{
		ref : 'agreementFrequencyFilterView',
		selector : 'agreementFrequencyFilterView'
	},
	{
		ref : 'sellerCode',
		selector : 'agreementFrequencyFilterView combo[itemId="entitledSellerIdItemId"]'
	},
	{
		ref : 'statusId',
		selector : 'agreementFrequencyFilterView combo[itemId="agreementFreqStatusId"]'
	}
	],
	config : {
		//	selectedMst : 'agreementFrequency',
		pageSettingPopup : null,
		filterData : [],
		strDefaultMask : '000000000000000000',
		//reportGridOrder : null,
		strPageName : 'agreementFrequencyMst',
		preferenceHandler : null,
		isDefaultMatrix : false,
		oldDefaultMatrix : '',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		isQuickStatusFieldChange : false,
		filterCodeValue : null,
		sellerFilterVal : 'all',
		sellerFilterDesc : 'all',
		clientFilterVal : 'all',
		clientFilterDesc : 'all',
		agreementCodeFilterVal : 'all',
		agreementCodeFilterDesc : 'all',
		filterApplied : 'ALL',
		urlGridPref : 'userpreferences/agreementMst/gridView.srvc?',
		urlGridFilterPref : 'userpreferences/agreementMst/gridViewFilter.srvc?',
		firstLoad : false
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction('addAgreementFrequencyScheduleMst.srvc');
		});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		me.updateConfig();
		if (objSaveLocalStoragePref) {
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData
					&& me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref
					&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson
					: {};

			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref
					: [];
		}
		me.control({
		'agreementFrequencyView groupView' : {
			'groupTabChange' : function(groupInfo,
					subGroupInfo, tabPanel,
					newCard, oldCard) {
				me.doHandleGroupTabChange(
						groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard);
			},
			'gridRender' : me.doHandleLoadGridData,
			'gridPageChange' : me.doHandleLoadGridData,
			'gridSortChange' : me.doHandleLoadGridData,
			'gridPageSizeChange' : me.doHandleLoadGridData,
			'gridColumnFilterChange' : me.doHandleLoadGridData,
			'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
			'gridSettingClick' : function() {
				me.showPageSettingPopup('GRID');
			},
			'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
			'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
				},
			'gridStoreLoad' : function(grid, store) {
				me.disableActions(false);
			},
			afterrender : function(panel, opts) {
			},
			'render' : function() {
				me.firstTime = true;
			//	me.applyPreferences();
			}
		},
		'pageSettingPopUp' : {
			'applyPageSetting' : function(popup,
					data, strInvokedFrom) {
				me.applyPageSetting(data,
						strInvokedFrom);
			},
			'savePageSetting' : function(popup,
					data, strInvokedFrom) {
				me.savePageSetting(data,
						strInvokedFrom);
			},
			'restorePageSetting' : function(popup,
					data, strInvokedFrom) {
				me.restorePageSetting(data,
						strInvokedFrom);
			}
		},
		'agreementFrequencyFilterView' : {
			afterrender : function(panel, opts) {
				var objLocalJsonData='';
				if (objSaveLocalStoragePref) {
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
					if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
						if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
								me.filterData = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
								me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
							}
						}
					}
				}
			}
		//me.handleClientChangeInQuickFilter();
		},
		'agreementFrequencyFilterView combo[itemId="entitledSellerIdItemId"]' : {
			select : function(combo, record, index) {
				me.sellerFilterDesc = combo.getRawValue();
				me.sellerFilterVal = combo.getValue();
				var objAutocompleter = me.getFilterView().down('AutoCompleter[itemId="clientCodeAuto"]');
				objAutocompleter.cfgUrl = 'services/userseek/AgreementFrequencyClientCodeSeek.json';
				objAutocompleter.setValue('');
				objAutocompleter.cfgExtraParams = [ {
					key : '$filtercode1',
					value : combo.getValue()
				} ];
				
			},
			change : function(combo , record,index) 
			{
				if(combo.value == ''|| combo.value == null) {
					me.sellerFilterVal = 'all';
					me.sellerFilterDesc = 'all';
				}
			}
		},
		'agreementFrequencyFilterView AutoCompleter[itemId="clientCodeAuto"]' : {
			select : function(combo, record, index) {
				var me = this;
				me.clientFilterVal =  record[0].data.CODE;
				me.clientFilterDesc = record[0].data.DESCRIPTION;
				var objAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
				objAutocompleter.cfgUrl = 'services/userseek/AgreementFreqAgreementCodeSummSeek.json';
				objAutocompleter.setValue('');
				objAutocompleter.cfgExtraParams = [
						{
							key : '$filtercode1',
							value : strSellerId
						},
						{
							key : '$filtercode2',
							value : me.clientFilterVal
						}];
				me.setDataForFilter();
				me.applyFilter();
				me.isDefaultMatrix = true;
			},
			change : function(combo, newValue, oldValue, eOpts) {
				me.oldDefaultMatrix = oldValue;
				if(Ext.isEmpty(combo.getRawValue())) {
					if(!Ext.isEmpty(oldValue) && oldValue.replace(/[%]/g,"") !== "") {
					me.clientFilterVal = 'all';
					me.clientFilterDesc = 'all';
					var objAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
					objAutocompleter.cfgUrl = 'services/userseek/AgreementFreqAgreementCodeSummSeekAll.json';
					objAutocompleter.setValue('');
					objAutocompleter.cfgExtraParams = [
						{
							key : '$filtercode1',
							value : strSellerId
						}];
					me.setDataForFilter();
					me.applyFilter();
					me.isDefaultMatrix = true;
					me.oldDefaultMatrix = "";
				}
				}
			},
			keyup : function(combo, e, eOpts){
				me.isDefaultMatrix = false;
			},
			blur : function(combo, record){
				if (me.isDefaultMatrix == false && !Ext.isEmpty(combo.getRawValue())){
					me.clientFilterVal = combo.getRawValue();
					//me.agreementCodeFilterDesc = combo.getRawValue();
					me.setDataForFilter();
					me.applyFilter();
				}
				me.oldDefaultMatrix = combo.getRawValue();	
			}
		},
		
		'agreementFrequencyFilterView combo[itemId="clientCodeCombo"]' : {
			select : function(combo, record, index) {
				me.clientFilterVal = record[0].data.CODE;
				me.clientFilterDesc = record[0].data.DESCR;
				var objAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
				objAutocompleter.cfgUrl = 'services/userseek/AgreementFreqAgreementCodeSummSeek.json';
				objAutocompleter.setValue('');
				objAutocompleter.cfgExtraParams = [
					{
						key : '$filtercode1',
						value : strSellerId
					},
					{
						key : '$filtercode2',
						value : me.clientFilterVal
				}];
				me.setDataForFilter();
				me.applyFilter();
				me.isDefaultMatrix = true;
			},
			change : function(combo, newValue, oldValue, eOpts) {
				me.oldDefaultMatrix = oldValue;
				if (newValue == '' || null == newValue) {
					me.clientFilterVal = 'all';
					me.clientFilterDesc = 'all';
					me.setDataForFilter();
					me.applyFilter();
					me.isDefaultMatrix = true;
					me.oldDefaultMatrix = "";
				}
			},
			keyup : function(combo, e, eOpts){
				me.isDefaultMatrix = false;
			}
		},
		
		'agreementFrequencyFilterView AutoCompleter[itemId="agreementCodeItemId"]' : {
			select : function(combo, record, index) {
				me.agreementCodeFilterVal = combo.getRawValue();
				me.agreementCodeFilterDesc = record[0].data.DESCRIPTION;
				me.setDataForFilter();
				me.applyFilter();
				me.isDefaultMatrix = true;
			},
			change : function(combo, newValue, oldValue, eOpts) {
				me.oldDefaultMatrix = oldValue;
				if (newValue == '' || null == newValue) {
					me.agreementCodeFilterVal = 'all';
					me.agreementCodeFilterDesc = 'all';				
					me.setDataForFilter();
					me.applyFilter();
					me.isDefaultMatrix = true;
					me.oldDefaultMatrix = "";
				}
			},
			keyup : function(combo, e, eOpts){
				me.isDefaultMatrix = false;
			},
			blur : function(combo, record){
				if (me.isDefaultMatrix == false && !Ext.isEmpty(combo.getRawValue())){
					me.agreementCodeFilterVal = combo.getRawValue();
					me.agreementCodeFilterVal = me.agreementCodeFilterVal.toUpperCase();
					//me.agreementCodeFilterDesc = combo.getRawValue();
					me.setDataForFilter();
					me.applyFilter();
				}
				me.oldDefaultMatrix = combo.getRawValue();	
			}
		},
		'agreementFrequencyFilterView combobox[itemId=agreementFreqStatusId]' : {
			'select' : function(combo,selectedRecords) {
				combo.isQuickStatusFieldChange = true;
			},
			'blur':function(combo,record){
				me.handleStatusClick(combo);
			},
			'boxready' : function(combo, width, height, eOpts){
					if (!Ext.isEmpty(me.statusFilterDesc) && me.statusFilterDesc != 'All' && me.statusFilterDesc != 'all' && 
						!Ext.isEmpty(me.statusFilterVal) && me.statusFilterVal != 'All' && me.statusFilterVal != 'all') {
						if(!Ext.isEmpty(me.statusFilterVal)){
						combo.setValue(me.statusFilterVal);
						}
						else{
							combo.setValue(me.statusFilterVal);
							me.statusFilterVal = '';
						}
					}
				}
		},
		'filterView' : {
			appliedFilterDelete : function(btn) {
				me.handleAppliedFilterDelete(btn);
			}
		},
		'filterView button[itemId="clearSettingsButton"]' : {
			'click' : function() {
				me.handleClearSettings();
			}
		}
		});
	},
	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext
				.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext
				.create('Ext.ux.gcp.PreferencesHandler');
		if (!Ext.isEmpty(objAgreeFreqMstPref)) {
			var objJsonData = Ext
					.decode(objAgreeFreqMstPref);
			var data = objJsonData.d.preferences.gridViewFilter;
		}
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
		newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && groupInfo.groupTypeCode && _charCaptureGridColumnSettingAt === 'L') {
			if (groupInfo.groupTypeCode === 'AGREESCHEDULE_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			args = {
				'module' : strModule
			};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			if(!Ext.isEmpty(args)){
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	populateTempFilter : function(filterData)
	{
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var operatorValue = '';
		var valueArray = '';
		var dispval = '';
		for (i = 0; i < filterData.length; i++) {
			fieldName = filterData[i].paramName;
			fieldVal = filterData[i].paramValue1;
			fieldSecondVal = filterData[i].paramValue2;
			operatorValue = filterData[i].operatorValue;
			valueArray = filterData[i].valueArray;
			dispval = filterData[i].displayValue1;
		if(fieldName == 'agreementCode')
		{
			var agreeCodeAuto = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
			agreeCodeAuto.setValue(fieldVal);
			me.agreementCodeFilterVal = fieldVal;
			me.agreementCodeFilterDesc = dispval;
		}
		if(fieldName == 'clientCode')
		{
			var clientCombo = me.getFilterView().down("combo[itemId='clientCodeCombo']");
			var clientAuto = me.getFilterView().down("combo[itemId='clientCodeAuto']");
			if(clientCombo != null)
			{
				clientCombo.setValue(dispval);
				me.clientFilterVal = fieldVal;
				me.clientFilterDesc = dispval;
			}
			if(clientAuto != null)
			{
				clientAuto.setValue(dispval);
				me.clientFilterVal = fieldVal;
				me.clientFilterDesc = dispval;
			}		
			
		}
		if(fieldName == 'statusFilter')
		{
			var statusMultiselect = me.getStatusId();
			statusMultiselect.setValue(fieldVal);
			statusMultiselect.selectedOptions = fieldVal;
			me.userStatusPrefCode = fieldVal;
			me.userStatusPrefDesc = dispval;
			me.statusFilterVal = fieldVal;
			me.statusFilterDesc = dispval;
		}
		if(isClientUser && fieldName == 'sellerCode')
		{
			var sellerIdCombo = me.getFilterView().down("combo[itemId='entitledSellerIdItemId']");
			if(sellerIdCombo != null)
			{
				sellerIdCombo.setValue(fieldVal);
				me.sellerFilterDesc = dispval;
				me.sellerFilterVal = fieldVal;
			}
			
		}
		}
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	postHandleGroupTabChange : function(data, args) {
		var me=this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAgreementFrequencyView(), objPref = null, gridModel = null, intPageSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		
		var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
		  && me.objLocalData.d.preferences.tempPref
		  && me.objLocalData.d.preferences.tempPref.pageSize
		  ? me.objLocalData.d.preferences.tempPref.pageSize
		  : '';
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: 1;
		var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
			&& me.objLocalData.d.preferences.tempPref
			&& me.objLocalData.d.preferences.tempPref.sorter
			? me.objLocalData.d.preferences.tempPref.sorter
			: [];
		
		if (data && data.preference) 
			objPref = Ext.decode(data.preference);
		if (_charCaptureGridColumnSettingAt === 'L' && objPref
			&& objPref.gridCols) {
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPageSize,
					pageNo : intPageNo,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					//  sortState:objPref.sortState
                    }
				}
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
				gridModel = gridModel ? gridModel : {};
				gridModel.pageSize = intPageSize;
				gridModel.pageNo = intPageNo;
				gridModel.storeModel = {sortState: sortState};
				
			}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('agreementFrequencyMst/{0}.srvc', strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);
		}else {
			me.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('userRejectRemarkPopUpTitle',
									'Please Enter Reject Remark');
			titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText:{
						ok: getLabel('btnOk','OK'),
						cancel:getLabel('btnCancel','Cancel')
					},
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remark field can not be blank'));
							}
							else
							{
								me.handleGroupActions(strUrl, text, grid, arrSelectedRecords,strActionType, "reject");
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords,strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
					serialNo : grid.getStore().indexOf(records[index])
							+ 1,
					identifier : records[index].data.identifier,
					userMessage : remark
					
				});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					var jsonRes = Ext.JSON
							.decode(response.responseText);
					groupView.refreshData();
					me.postHandleGroupAction(jsonRes, grid,
							strActionType, strAction, records);
					var errorMessage = '';
					if (response.responseText != '[]') {
						var jsonData = Ext
								.decode(response.responseText);
						jsonData = jsonData.d ? jsonData.d : jsonData;		
						
						if(!Ext.isEmpty(jsonData))
						{
							for(var i =0 ; i<jsonData.length;i++ )
							{
								var arrError = jsonData[i].errors;
								if(!Ext.isEmpty(arrError))
								{
									for(var j =0 ; j< arrError.length; j++)
									{
										for(var j = 0 ; j< arrError.length; j++)
										{
											errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
										}
									}
								}
								
							}
							if('' != errorMessage && null != errorMessage)
							{
							
								Ext.MessageBox.show({
									title : getLabel('errorTitle','Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
							} 
						}	
					}
				},
				failure : function() {
					Ext.MessageBox.show({
						title : getLabel('errorTitle', 'Error'),
						msg : getLabel('errorPopUpMsg',
								'Error while fetching data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		}
	},
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		var me = this;
		var groupView = me.getGroupView();
		var objGrid = groupView.getGrid() || null;
		var msg = '',errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, strActionMessage = '';
		if (!Ext.isEmpty(jsonData))
			actionData = jsonData;
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		Ext.each(actionData, function(result) {
			intSerialNo = parseInt(result.serialNo,10);
			record = objGrid.getRecord(intSerialNo);
			row = objGrid.getRow(intSerialNo);
			msg = '';
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
			});
			
				row = objGrid.getRow(intSerialNo);
				
				strActionMessage = result.success === 'Y'
									? strActionSuccess
									: msg;
				if(result.success === 'Y'){
					strActionMessage += ' <p class="error_font">'+ msg + '</p>';
				}
				arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('forecastReference'),
							actionMessage :strActionMessage
						});
			
		});
		/*arrMsg = (me.populateActionResult(arrActionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}*/
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
	},
	/*
	populateActionResult : function(arrActionMsg) {
		var me = this, arrResult = [];
		if (!Ext.isEmpty(objActionResult)) {
			Ext.each((arrActionMsg || []), function(cfgMsg) {
				if (!Ext.Array.contains(objActionResult.order,
						cfgMsg.actualSerailNo))
					objActionResult.order.push(cfgMsg.actualSerailNo);
				objActionResult[cfgMsg.actualSerailNo] = me.cloneObject(cfgMsg);
			});

			Ext.each((objActionResult.order || []), function(key) {
						if (objActionResult[key]) {
							arrResult.push(objActionResult[key]);
						}
					});
		}
		return arrResult;
	},*/
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.firstLoad = false;
		var arrOfParseQuickFilter = [];
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
		var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
		&& me.objLocalData.d.preferences.tempPref
		&& me.objLocalData.d.preferences.tempPref.pageNo
		? me.objLocalData.d.preferences.tempPref.pageNo
		: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.firstLoad = false;
		
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		strUrl = strUrl + "&"+ csrfTokenName + "=" + csrfTokenValue + "&$entityType="+entityType;
		me.reportGridOrder = strUrl;		
		me.disableActions(true);
		var columns = grid.columns;
	
		var columns=grid.columns;
		Ext.each(columns, function(col) {
			col.sortable=true;
			
			if(col.dataIndex=="requestStateDesc")
			{
				col.sortable=false;
			}               	
	       
        });
		grid.loadGridData(strUrl, null, null, false);
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
		//Hide seller code
		arrOfParseQuickFilter = arrOfParseQuickFilter.filter(function(e){
				return !(e.hasOwnProperty('fieldId') && e['fieldId'] === 'sellerCode');
		});
		
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
	},
	handleGridRowClick : function(record, grid, columnType) {
		if (columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
			var me = this;
			var columnModel = null;
			var columnAction = null;
			if (!Ext.isEmpty(grid.columnModel)) {
				columnModel = grid.columnModel;
				for (var index = 0; index < columnModel.length; index++) {
					if (columnModel[index].colId == 'actioncontent') {
						columnAction = columnModel[index].items;
						break;
					}
				}
			}
			var arrVisibleActions = [];
			var arrAvailableActions = [];
			if (!Ext.isEmpty(columnAction))
				arrAvailableActions = columnAction;
			var store = grid.getStore();
			var jsonData = store.proxy.reader.jsonData;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var btnIsEnabled = false;
					if (!Ext.isEmpty(grid)
							&& !Ext.isEmpty(grid.isRowIconVisible)) {
						btnIsEnabled = grid.isRowIconVisible(store, record,
								jsonData, arrAvailableActions[count].itemId,
								arrAvailableActions[count].maskPosition);
						if (btnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
							btnIsEnabled = false;
						}
					}
				}
			}
			if (!Ext.isEmpty(arrVisibleActions)) {
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},
	/*Preference Handling:end*/
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					var objData = (arrId).map(function(v) {
					  return  v;
					});
					objData.forEach( function(val,indx){
								joinVal = val.indexOf('^') > -1 ? val.replace(/\^/g,',') : val;
								objData[indx]=joinVal;
							});
					
					objData = objData.toString();
					objData = objData.split(',');
					if (0 != objData.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < objData.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + objData[count] + '\'';
							if (count != objData.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				case 'statusFilterOp':
					//var objValue = filterData[index].paramValue1;
					//var objArray = objValue.split(',');
					var objArray = filterData[index].paramValue1;
					var objUser = filterData[index].makerUser;
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + "(";
					}
					for (var i = 0; i < objArray.length; i++) {
							if(objArray[i] == 12){ //submitted
								strTemp = strTemp + "((requestState eq '0' or requestState eq '1') and validFlag eq 'N' and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(requestState eq '1' and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 30){ //Pending Send
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '0')";
							}
							else if(objArray[i] == 31 || objArray[i] == 34){ //Sent to bank or Pending verify
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '1')";
							}
							else if(objArray[i] == 32){ //active
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '2')";
							}
							else if(objArray[i] == 33){//Verify Rejected
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '3')";
							}
							else if(objArray[i] == 11){ // Suspended
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N' and isSubmitted eq 'N' and verifyState eq '2')";
							}
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){ //New or Modified
								strTemp = strTemp + "(requestState eq '"+objArray[i]+"' and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq '"+objArray[i]+"')";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
					
					}
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + ")";
						isFilterApplied = true;
					}
					break;
				default :
					// Default opertator is eq
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	doHandleRowIconClick : function(actionName, objGrid, record,rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' 
				|| actionName === 'verify' || actionName === 'send' ){
			me.doHandleGroupActions(actionName, objGrid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
                    && !Ext.isEmpty(recHistory.__deferred.uri) && !Ext.isEmpty(record.get('identifier')))  {
				me.showHistory(record);
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = 'editAgreementFrequencySchedule.srvc';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl ='viewAgreementFrequencySchedule.srvc';
			me.submitForm(strUrl, record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.viewState;
		var form;

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'viewState', viewState));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(record) {
		var historyPopup = Ext.create('GCP.view.HistoryPopup', {
            historyUrl : record.get('history').__deferred.uri+ "?"+ csrfTokenName + "=" + csrfTokenValue, identifier: record.get('identifier') 
		}).show();
		historyPopup.center();
	},
	setDataForFilter : function() {
	this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		if (me.sellerFilterVal != 'all') {
			jsonArray.push({
				paramName : 'sellerCode',
				paramValue1 : me.sellerFilterVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				displayValue1 : me.sellerFilterDesc,
				paramFieldLable : getLabel('financialInstitution', 'Financial Institution')
			});
		} else {
			jsonArray.push({
				paramName : 'sellerCode',
				paramValue1 : strSellerId,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				displayValue1 : me.sellerFilterDesc,
				paramFieldLable : getLabel('financialInstitution', 'Financial Institution')
			});
		}
		if (me.clientFilterVal != 'all') {
			jsonArray.push({
				paramName : 'clientCode',
				paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'eq',
				dataType : 'S',
				displayValue1 : me.clientFilterDesc,
				paramFieldLable : getLabel('companyname','Company Name'),
				displayType : 5
			});
		}
		if (me.agreementCodeFilterVal != 'all') {
			jsonArray.push({
				paramName : 'agreementCode',
				paramValue1 : encodeURIComponent(me.agreementCodeFilterVal.replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'lk',
				dataType : 'S',
				displayValue1 : me.agreementCodeFilterVal,
				paramFieldLable : getLabel('lbl.notionalMst.agreementCode','Agreement Code')
			});
		}
		var statusFilterValue = me.statusFilterVal;
		var statusFilterDesc = me.statusFilterDesc;
		if (statusFilterValue != null && statusFilterValue != 'all'
		 && statusFilterValue.length > 0)
			jsonArray.push(
			   {
					paramName : 'statusFilter',
					paramValue1 : statusFilterValue,
					operatorValue : 'statusFilterOp',
					makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S',
					displayValue1 : statusFilterDesc,
					paramFieldLable : getLabel('lms.notionalMst.status', 'Status'),
					displayType : 5
			   } );
		return jsonArray;
	},
	applyFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		objGroupView.refreshData();
	},
	handleStatusClick : function(combo) {
		var me = this;
		var allSelected= null;
		combo.isQuickStatusFieldChange = false;
		allSelected = combo.isAllSelected();
		if(allSelected === true){
			me.statusFilterVal = 'all';
			me.statusFilterDesc = 'All';
		} else {
			me.statusFilterVal = combo.getSelectedValues();
			me.statusFilterDesc = combo.getRawValue();
		}
		me.setDataForFilter();
		me.applyFilter();
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			me.findAndRemoveFromQuickArrJson(quickJsonData,paramName);
			me.resetFieldOnDelete(objData);
			me.applyFilter();
		}
	},
	findAndRemoveFromQuickArrJson : function(quickJsonData,paramName)
	{
		var me = this;
		var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
		if (!Ext.isEmpty(reqJsonInQuick)) {
			arrQuickJson = quickJsonData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
			me.filterData = arrQuickJson;
		}
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldOnDelete : function(objData)
	{
		var me= this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		switch(strFieldName)
		{
			case 'agreementCode' :
				me.resetAgreementCode();
			break;
			case 'clientCode' :
				me.resetClient();
				me.resetAgreementCode();
			case 'statusFilter' :
				var statusField = me.getFilterView().down("checkcombo");
				statusField.selectAllValues();
				me.statusFilterVal = 'all';
				me.statusFilterDesc = null;
				break;
		}
		
	},
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		//me.updateFilterparams();
		me.setDataForFilter();
		me.applyFilter();
	},
	resetClient : function()
	{
		var me = this;
		if(entityType === '0')
		{
			var clientAutoCom = me.getFilterView().down("AutoCompleter[itemId='clientCodeAuto']");
			clientAutoCom.setValue("");
		}
		else
		{
			var clientCombo = me.getFilterView().down("combo[itemId='clientCodeCombo']");
			var clientStore = clientCombo.getStore();
			if(clientStore.getCount()) {
				clientCombo.setValue(clientStore.getAt(0));
				me.clientFilterVal = 'all';
				me.clientFilterDesc = 'ALL';
			}
		}
	},
	resetAgreementCode : function()
	{
		var me = this;
		var agreementCodeAutoCom = me.getFilterView().down("AutoCompleter[itemId='agreementCodeItemId']");
		agreementCodeAutoCom.setValue("");
	},
	handleClearSettings:function(){
		var me = this;
		var quickJsonData = me.filterData;
		me.resetClient();
		me.findAndRemoveFromQuickArrJson(quickJsonData,'clientCode');
		me.resetAgreementCode();
		me.findAndRemoveFromQuickArrJson(quickJsonData,'agreementCode');
		var statusField = me.getFilterView().down("checkcombo");
		statusField.selectAllValues();
		me.statusFilterVal = 'all';
		me.statusFilterDesc = null;
		me.applyFilter();
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord,
	intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;
		;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) buttonMask = jsonData.d.__buttonMask;

		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);

		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState != 8 && objData.raw.requestState != 4
					&& objData.raw.requestState != 5) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 11);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled, isSubmit);
	},
	
	enableDisableGroupActions : function(actionMask,isSameUser, isDisabled, isSubmit)
	{
		var me=this;		
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext	.each(arrItems,function(item) {
				strBitMapKey = parseInt(item.maskPosition,10) - 1;
				if (strBitMapKey || strBitMapKey == 0) {
					blnEnabled = isActionEnabled(actionMask,strBitMapKey);
					if ((item.maskPosition === 2 && blnEnabled)) {
						blnEnabled = blnEnabled	&& isSameUser;
					}
					else if (item.maskPosition === 3 && blnEnabled) {
						blnEnabled = blnEnabled	&& isSameUser;
					}
					else if (item.maskPosition === 6 && blnEnabled)
					{
					   blnEnabled = blnEnabled && !isSubmit;
					}
					item.setDisabled(!blnEnabled);
				}
			});
		}
	},
	handleEntryAction : function(strUrl) {
		var me = this;
		var form;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'sellerId', strSellerId));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objAgreeFreqMstPref)) {
			objPrefData = Ext.decode(objAgreeFreqMstPref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;

			 objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: AGREEMENT_FREQUENCY_GENERIC_COLUMN_MODEL || '[]';
			
			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		else if (Ext.isEmpty(objAgreeFreqMstPref))
		{
			objColumnSetting = AGREEMENT_FREQUENCY_GENERIC_COLUMN_MODEL;
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = me.urlGridPref;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
		"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), subGroupInfo = groupView
						.getSubGroupInfo()
						|| {}, objPref = {}, groupInfo = groupView
						.getGroupInfo()
						|| '{}', strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				if(groupInfo.groupTypeCode === "GRD_AGREE_SCHEDULE")
					strModule = 'all';
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					};
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView(), subGroupInfo = groupView
					.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};
			if(groupInfo.groupTypeCode === "AGREESCHEDULE_OPT_STATUS")
					strModule = 'all';
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							pref.module = strModule;
							return false;
						}
					});
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	}

});
