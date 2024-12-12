/**
 * @class GCP.controller.ReconRuleController
 * @extends Ext.app.Controller
 * @author A Kumkar
 */

Ext.define('GCP.controller.ReconRuleController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp','GCP.view.HistoryPopup'],
	views : ['GCP.view.HistoryPopup', 'GCP.view.ReconRuleFilterView',
	         'GCP.view.ReconRuleView'],
	refs : [{
		ref : 'groupView',
		selector : 'reconRuleView groupView'
	}, {
		ref : 'grid',
		selector : 'reconRuleView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'reconRuleView groupView filterView'
	}, {
		ref : 'reconRuleView',
		selector : 'reconRuleView'
	},
	{
		ref : "productFilter",
		selector : 'reconRuleView reconRuleFilterView combobox[itemId="productComboAuto"]'
	}],
	config : {
		strPageName:'invoiceReconRules',
		productCode :'',
		productDesc :'',
		userStatusPrefCode :'',
		userStatusPrefDesc :'',
		isScmProductSelected : false,
		pageSettingPopup : null,
		isCompanySelected : false,
		preferenceHandler : null,
		strDefaultMask : '000000000000000000'

	},
	init : function() {
		var me = this;
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction();
		});
		me.updateConfig();
		
		$(document).on('handleProductChangeInQuickFilter',function(event) {
			me.handleProductChangeInQuickFilter();
		});
		
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		me.control({
			'reconRuleView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridSettingClick' : function(){
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
				}
			},
			
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restorePageSetting(data,strInvokedFrom);
				}
			},
			
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				},
				afterrender : function() {
					me.handleClientChangeInQuickFilter();
				}
			},
			
			'filterView button[itemId="clearSettingsButton"]' : {
				click : function() {
					me.handleClearSettings();
				}
			},
			'reconRuleFilterView  combo[itemId="statusFilter"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusFilterClick(combo);
				}
			},
			'reconRuleFilterView AutoCompleter[itemId="clientComboAuto"]' : {
				select : function(combo, record) {
					selectedFilterClient = combo.getValue();
					selectedFilterClientDesc = combo.getDisplayValue();
					me.handleClientChangeInQuickFilter();
					me.isCompanySelected = true;
					//$(document).trigger("handleClientChangeInQuickFilter", false);
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue())) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							
							selectedFilterClient = combo.getValue();
							selectedFilterClientDesc = combo.getDisplayValue();
							me.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
						}
					}else{
						me.isCompanySelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isCompanySelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isCompanySelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								selectedFilterClient = combo.getValue();
								selectedFilterClientDesc = combo.getValue();
								me.handleClientChangeInQuickFilter();
								me.isCompanySelected = true;
					}
				}
			},
			'reconRuleFilterView AutoCompleter[itemId="productComboAuto"]' : {
				select : function(combo, record) {
					me.productCode = combo.getValue();
					me.productDesc = combo.getRawValue();
					me.isScmProductSelected = true;
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.productCode = "";
							me.productDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isScmProductSelected = true;
						}
					}else{
						me.isScmProductSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isScmProductSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isScmProductSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.productCode = combo.getRawValue();
								me.productDesc = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								//me.isScmProductSelected = true;
					}
				}
			}
		});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
	},
	handleClearSettings:function(){
		var me=this;
		var filterView = me.getFilterView();
		if(!Ext.isEmpty(filterView)){
		
		var productCombo = filterView
				.down('combobox[itemId=productComboAuto]');

		if(isClientUser()){
			var clientCombo = filterView.down('combobox[itemId=clientCombo]');
			me.clientCode = "";
			me.clientDesc = "";
			me.clientFilterVal = 'ALL';
			clientCombo.setValue(me.clientFilterVal);
		}else{
			filterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		var statusFltId = filterView
				.down('combo[itemId=statusFilter]');
		statusFltId.reset();
		me.userStatusPrefCode = 'all';
		statusFltId.selectAllValues();
		productCombo.setValue("");
		me.clientDesc='';
		me.clientCode='';
		me.productDesc='';
		me.productCode='';
		me.filterData=[];
		me.refreshData();
		}
	},	

	resetAllFilters : function() {
		var me = this;
		if(entityType === "1") {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount()) {
				var record = clientCombo.getStore().getAt(0);
				clientCombo.setValue(record);
				changeClientAndRefreshGrid(record.data.CODE, record.data.DESCR);
			} else {
				changeClientAndRefreshGrid('', '');
			}
		} else {
			me.resetClientAutocompleter();
		}
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/reconRule/{0}', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			this.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
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
					buttonText: {
			            ok: getLabel('btnOk', 'OK'),
						cancel: getLabel('btncancel', 'Cancel')
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
								Ext.Msg.show({
									title:getLabel('errorTitle', 'Error'),
										msg: getLabel('rejectRestrictionErroMsg', 'Reject Remark field can not be blank'),
									buttonText:{
										ok:getLabel('btnOk', 'OK')
									}
									
								})
							//	Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remark field can not be blank'));
							}
							else
							{
								me.handleGroupActions(strUrl, text, grid, arrSelectedRecords);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
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
							userMessage : remark,
							recordDesc : records[index].data.scmProductName
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
							// TODO : Action Result handling to be done here
							groupView.refreshData();
							// me.applyFilter();
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								jsonData = jsonData.d ? jsonData.d : jsonData;		
								/*Ext.each(jsonData[0].errors, function(error,
												index) {
											errorMessage = errorMessage
													+ error.errorMessage
													+ "<br/>";
										});*/
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
							         //Ext.Msg.alert("Error",errorMessage);
							        	Ext.MessageBox.show({
											title : getLabel('errorTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											buttonText:{
												ok:getLabel('btnOk', 'OK')
											},
											cls : 'ux_popup',
											draggable : false,
											icon : Ext.MessageBox.ERROR
										});
							        } 
						        }	
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										buttonText:{
											ok:getLabel('btnOk', 'OK')
										},
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},

	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' ){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('clientDesc'),record.get('scmMyProductDesc'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = 'editInvoiceReconRule.form';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = 'viewInvReconRule.form';
			me.submitForm(strUrl, record, rowIndex);
		} else {

		}
	},
	
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid',
				'Y'));
				
		form.action = strUrl;
		//me.setFilterParameters(form);

		document.body.appendChild(form);
		form.submit();
	},
	
	handleEntryAction : function() {
		var me = this;
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		//Populate client ID in case of single client
		if(isClientUser()) {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount() === 1) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'clientId', selectedFilterClient));
			}
		}
		document.body.appendChild(form);
		form.action = "newinvoiceReconRule.form";
		form.target = "";
		form.method = "POST";
		form.submit();
	},
	
		
	showHistory : function(clientDesc, scmProductDesc, url, id) {
	var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					clientName : clientDesc,
					scmProduct : scmProductDesc,
					identifier : id
				}).show();
		historyPopup.center();			
	},
	
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
			
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
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var me=this;		
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);

							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	
		handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			me.resetFieldInQuickFilterOnDelete(objData);
			me.refreshData();
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
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		var filterView = me.getFilterView();
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if ((strFieldName ==='productCode' || strFieldName ==='scmMyProductDesc' ) && !Ext.isEmpty(me.getProductFilter())) {
			me.getProductFilter().setValue('');
			me.productCode='';
			me.productDesc='';
		}
		if(strFieldName === 'clientId'){
			if(isClientUser()){
				var clientCombo = filterView.down('combobox[itemId=clientCombo]');
				clientCombo.setValue("");
				me.clientCode = "";
				me.clientDesc = "";	
			}else{
				filterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
		if(strFieldName === 'requestState'){
			var statusFltId = filterView
			.down('combo[itemId=statusFilter]');
			statusFltId.reset();
			me.userStatusPrefCode = 'all';
			statusFltId.selectAllValues();
		}
	},
	handleProductChangeInQuickFilter :function() {
		var me = this;
		me.productCode = scmProductCode;
		me.productDesc = scmProductName;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	handleStatusFilterClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.userStatusPrefCode = combo.getSelectedValues();
		me.userStatusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.updateFilterparams();
		me.setDataForFilter();
		me.applyFilter();
	},
	updateFilterparams : function() {
		var me = this;
		var scmProductAutocompleter = me.getFilterView().down('AutoCompleter[itemId="productComboAuto"]');
		scmProductAutocompleter.cfgExtraParams = [];
		if(me.clientCode && 'ALL' !== me.clientCode) {
			var clientFilter = {
				key : '$filtercode1',
				value : me.clientCode
			};
		scmProductAutocompleter.cfgExtraParams.push(clientFilter);
		}
		scmProductAutocompleter.setValue("");
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		grid.removeAppliedSort();
		objGroupView.refreshData();
		me.updateFilterInfo();
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
			strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.updateFilterInfo();
	},
	updateFilterInfo : function() {
		var me = this;
		var arrInfo = generateFilterArray(me.filterData);
		if(isClientUser()) {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount() <= 1) {
				var clientFilterIndex = -1;
				arrInfo.forEach(function(appliedFilterObj, appliedFilterObjIndex) {
					if(appliedFilterObj.fieldId == "clientId") clientFilterIndex = appliedFilterObjIndex;
				});
				if(clientFilterIndex !== -1) {
					arrInfo.splice(clientFilterIndex, 1);
				}
			}
		}
		me.getFilterView().updateFilterInfo(arrInfo);
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		subGroupInfo = subGroupInfo || me.getGroupView().getSubGroupInfo();
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams();
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var strFilter = '&$filter=';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
			for ( var index = 0; index < filterData.length; index++) {
				if (isFilterApplied) {
					strTemp = strTemp + ' and ';
				}
				if(filterData[index].operatorValue=='statusFilterOp'){
					var objValue = filterData[index].paramValue1;
					var objArray = objValue.split(',');
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + "(";
					}
					for (var i = 0; i < objArray.length; i++) {
							if(objArray[i] == 12){
								strTemp = strTemp + "((requestState eq '0' or requestState eq '1') and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N')";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
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
					
				}else{
					strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue + ' ' + '\'' + filterData[index].paramValue1 + '\'';
					isFilterApplied = true;
				}
			}
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	setDataForFilter : function() {
		var me = this;
		me.filterData = me.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this,
		clientParamName = null,
		clientNameOperator = null,
		clientCodeVal = null;
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		var statusFilterVal = me.userStatusPrefCode;
		var statusFilterDisc = me.userStatusPrefDesc;
		jsonArray = [];
		if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode) {
			clientParamName = 'clientId';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : me.clientDesc
			});
		}
		if (!Ext.isEmpty(me.productDesc)&&!Ext.isEmpty(me.productCode) && me.productCode!= 'all' ) {
			var productFilterParam = me.isScmProductSelected === true ? 'productCode' : 'scmMyProductDesc';
			if (!Ext.isEmpty(me.productCode)) {
					jsonArray.push({
								paramName : productFilterParam,
								paramValue1 : encodeURIComponent(me.productCode.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable :  getLabel('lblproduct', 'SCF Package'),
								displayType : 5,
								displayValue1 : me.productDesc
							});
				}
		}
		//Status Query
		if (statusFilterVal != null && statusFilterVal != 'All'
			&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
		statusFilterValArray = statusFilterVal.toString();

		if (statusFilterDisc != null && statusFilterDisc != 'All'
				&& statusFilterDisc != 'all'
				&& statusFilterDisc.length >= 1)
			statusFilterDiscArray = statusFilterDisc.toString();

		jsonArray.push({
					paramName : 'requestState',
					paramValue1 : statusFilterValArray,
					operatorValue : 'statusFilterOp',
					dataType : 'S',
					paramFieldLable : getLabel('status', 'Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
		}
		return jsonArray;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Need to refactor for non us market
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();
	},

	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReconRuleView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeMaster;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
			heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					//pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
						sortState:objPref.sortState
					}
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},

	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter) + "&$filter="+ me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
		me.disableActions(true);
		var columns=grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="requestStateDesc" ){
	        	col.sortable=false;
	        }
        });
		grid.loadGridData(strUrl, null, null, false);
		objGroupView.handleGroupActionsVisibility(me.strDefaultMask);

		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
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

	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},

	/*Page setting handling starts here*/
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
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
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
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
		} else
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},

	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objReconRulePref)) {
			objPrefData = Ext.decode(objReconRulePref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/user defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: RECON_RULE_COLUMNS || '[]';

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = '';
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
	/*Page setting handling ends here*/

	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateReconRuleReport.' + strExtension;
		strUrl += '?$skip=1';
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		strUrl += this.getFilterUrl(subGroupInfo, groupInfo);
		if(!Ext.isEmpty(me.filterValidityName) && "ALL" !== me.filterValidityName){
				strUrl += "&validity=" +me.filterValidityName;
			}
		var strOrderBy = me.reportGridOrder;
		if(!Ext.isEmpty(strOrderBy)){
			var orderIndex = strOrderBy.indexOf('orderby');
			if(orderIndex > 0){
				strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if(indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0,indexOfamp);
				strUrl += '&$'+strOrderBy;
			}				
		}			
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		arrColumn = grid.getAllVisibleColumns();

		if (arrColumn) {
			var col = null;
			var colArray = new Array();
			for (var i = 0; i < arrColumn.length; i++) {
				col = arrColumn[i];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex])
					colArray.push(arrDownloadReportColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() + ']';
		}
		strUrl = strUrl + strSelect;

		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		         while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';

		Object.keys(objParam).map(function(key) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						key, objParam[key]));
				});

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	}
});