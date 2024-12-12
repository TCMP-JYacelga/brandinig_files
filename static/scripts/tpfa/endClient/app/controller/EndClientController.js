
Ext.define('GCPA.controller.EndClientController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp','GCPA.view.HistoryPopup','GCPA.view.EndClientClosureSummaryPopUp'],
	views : ['GCPA.view.HistoryPopup', 'GCPA.view.EndClientFilterView',
	         'GCPA.view.EndClientView','GCPA.view.EndClientClosureSummaryPopUp'],
	refs : [{
		ref : 'groupView',
		selector : 'endClientView groupView'
	}, {
		ref : 'grid',
		selector : 'endClientView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'endClientView groupView filterView'
	}, {
		ref : 'endClientView',
		selector : 'endClientView'
	}],
	config : {
		strPageName:'endClientProfile',
		pageSettingPopup : null,
		endClientClosureSummaryPopup : null,
		isAgentSelected : false,
		isEndClientSelected : false,
		isActNumSelected : false,
		preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		filterAgentName : null,
		filterAgentDesc : null,
		filterEndClientName : null,
		filterEndClientDesc : null,
		filterActNumName : null,
		filterActNumDesc : null,
		userStatusPrefCode :'',
		userStatusPrefDesc :''
	},
	init : function() {
		var me = this;
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction();
		});
		me.updateConfig();
		
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		me.control({
			'endClientView groupView' : {
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
			'endClientClosureSummaryPopup' : {
				'refreshGridData' : function() {
					var gView = me.getGroupView();
					gView.refreshData();
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
					me.resetAllFilters();
				}
			},
			
			
			'endClientFilterView AutoCompleter[itemId="agentAutocompleter"]' : {
				select : function(combo, record) {
					me.filterAgentName = combo.getValue();
					me.filterAgentDesc = combo.getRawValue();
					me.isAgentSelected = true;
					me.setDataForFilter();
					me.applyFilter();
					$(document).trigger("handleClientChangeInQuickFilter",
														false);
					
				},
	
				change : function( combo, record, oldVal )
				{
					me.filterAgentName = combo.getValue();
					me.filterAgentDesc = combo.getRawValue();
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterAgentName = "";
							me.filterAgentDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isAgentSelected = true;
						}
					}else{
						me.isAgentSelected = false;
					}
					$(document).trigger("handleClientChangeInQuickFilter",
							false);

				},
				keyup : function(combo, e, eOpts){
					me.isAgentSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isAgentSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.filterAgentName = combo.getValue();
								me.filterAgentDesc = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isAgentSelected = true;
					}
				}
			},
			
			'endClientFilterView AutoCompleter[itemId="endClientAutocompleter"]' : {
				select : function(combo, record) {
					me.filterEndClientName = combo.getValue();
					me.filterEndClientDesc = combo.getRawValue();
					me.isEndClientSelected = true;
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterEndClientName = "";
							me.filterEndClientDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isEndClientSelected = true;
						}
					}else{
						me.isEndClientSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isEndClientSelected=false;
					},
				blur : function(combo, The, eOpts ){
					if(me.isEndClientSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.filterEndClientName = combo.getRawValue();
								me.filterEndClientDesc = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isEndClientSelected = true;
					}
				}
			},
			
			'endClientFilterView AutoCompleter[itemId="actNumAutocompleter"]' : {
				select : function(combo, record) {
					me.filterActNumName = combo.getValue();
					me.filterActNumDesc = combo.getRawValue();
					me.isActNumSelected = true;
					me.setDataForFilter();
					me.applyFilter();
				
				},
	
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterActNumName = "";
							me.filterActNumDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isActNumSelected = true;
						}
					}else{
						me.isActNumSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isActNumSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isActNumSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.filterActNumName = combo.getValue();
								me.filterActNumDesc = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isActNumSelected = true;
					}
				}
			},
			'endClientFilterView  combo[itemId="statusFilter"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							var me = this;
								combo.isQuickStatusFieldChange = false;
								me.userStatusPrefCode = "";
								me.userStatusPrefDesc = "";
								me.setDataForFilter();
								me.applyFilter();
						}
					}else
					{
						combo.isQuickStatusFieldChange = false;
					}
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusFilterClick(combo);
				}
			}
			
		});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
	},
	handleStatusFilterClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.userStatusPrefCode = combo.getSelectedValues();
		me.userStatusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	resetAllFilters : function() {

		var me = this;
	
		var agentAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agentAutocompleter"]');
		agentAutocompleter.setValue("");
		
		var endClientAutocompleter = me.getFilterView().down('AutoCompleter[itemId="endClientAutocompleter"]');
		endClientAutocompleter.setValue("");
		
		var actNumAutocompleter = me.getFilterView().down('AutoCompleter[itemId="actNumAutocompleter"]');
		actNumAutocompleter.setValue("");
	
		var statusFltId = me.getFilterView().down('combo[itemId=statusFilter]');
			statusFltId.reset();
			me.userStatusPrefCode = 'all';
			statusFltId.selectAllValues();
			me.filterData=[];
			me.refreshData();
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/endClient/{0}', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		}
		else if(strAction === 'close') {
			if(tpfaR2Enabled == 'Y'){
			this.showAccountClosurePopUp(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
			}
			else {
				return;
			}
		}
		else {
			this.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	
	getEndClientDesc : function(selectedRecord) {
		var endClientDesc ;
		var category=selectedRecord.data.clientCategory;
		if(category==="COMPANY"){
		endClientDesc = selectedRecord.get('registeredCompanyName')
				}
		else if(category==="PARTNERSHP"){
		endClientDesc =selectedRecord.get('tradeName');
				}
		else if(category==="TRUST"){
		endClientDesc =selectedRecord.get('trustName');		
				}
		else if(category==="INDIVIDUAL"){		
		endClientDesc = selectedRecord.get('firstName')+" "+selectedRecord.get('lastName');			
				}
		return endClientDesc;
	},
	
	showAccountClosurePopUp : function (strUrl, remark,grid, arrSelectedRecords,strActionType, strAction) {

		var me = this;	
		var isErrorPresent =false;	
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			if(null!= records && records.length > 1){
				me.enableDisableGroupActions( '0000000000', true );
				return;
			}
			var endClientDesc = me.getEndClientDesc(records[0]);

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
				$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							//groupView.refreshData();
							// me.applyFilter();
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								if(null!= jsonData.ERROR){	
									errorMessage = jsonData.ERROR.errors[0].errorCode + " : "+ jsonData.ERROR.errors[0].defaultMessage + "<br/>";
			        				isErrorPresent=true;
								}
								
								if(!Ext.isEmpty(jsonData))
						        {						        	
							        if('' != errorMessage && null != errorMessage)
							        {
							         //Ext.Msg.alert("Error",errorMessage);
							        	Ext.MessageBox.show({
											title : getLabel('errorTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        	me.enableDisableGroupActions( '0000000000', true );
							        	groupView.refreshData();
							        	$.unblockUI();
							        }
							        else if(!isErrorPresent){
							        	//show the Closure Summary Pop up
							        	me.enableDisableGroupActions( '0000000000', true );
							        	groupView.refreshData();
							        	$.unblockUI();
							        	me.showAccountClosureSummary(jsonData,endClientDesc);
							        }
						        }	
							}
						},
						failure : function() {
							$.unblockUI();
							var errMsg = "";
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
	
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('userRejectRemarkPopUpTitle',
					'Please enter reject remark');
			titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
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
											cls : 'ux_popup',
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
				|| actionName === 'close' ){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {

					var strRetValue = "";
					var category=record.data.clientCategory;
					if(category==="COMPANY"){
							me.showHistory(record.get('registeredCompanyName'),
							record.get('history').__deferred.uri, record
								.get('identifier'));
								}
					else if(category==="PARTNERSHP"){
							me.showHistory(record.get('tradeName'),
							record.get('history').__deferred.uri, record
								.get('identifier'));
								}
					else if(category==="TRUST"){
							me.showHistory(record.get('trustName'),
							record.get('history').__deferred.uri, record
								.get('identifier'));
								}
					else if(category==="INDIVIDUAL"){
							me.showHistory(record.get('firstName')+" "+record.get('lastName'),
							record.get('history').__deferred.uri, record
								.get('identifier'));
								}
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = 'editEndClientMasterSetUp.srvc';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = 'viewEndClientMaster.srvc';
			me.submitForm(strUrl, record, rowIndex);
		} else {

		}
	},
	
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.viewState;
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'productType', "P"));
		//Populate client ID in case of single client
		
		document.body.appendChild(form);
		form.action = "addEndClientSetUp.srvc";
		form.target = "";
		form.method = "POST";
		form.submit();
	},
	
	showHistory : function(endClientName, url, id) {
	var historyPopup =	Ext.create('GCPA.view.HistoryPopup', {
					historyUrl : url,
					profileName : endClientName,
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
				isSubmit,arrSelectedRecords);
	},
	
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit,arrSelectedRecords) {
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
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if(item.maskPosition === 8 && blnEnabled) {
								if(arrSelectedRecords.length > 1){
								blnEnabled = false;
								}
								else {
									blnEnabled = blnEnabled && !isDisabled;
								}
							}
							else if (item.maskPosition === 10 && blnEnabled) {
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
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)) {
			me.resetFieldOnDelete(objData);
		}
	},
	resetFieldOnDelete : function(objData) {
		var me = this,
			strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
	 if(strFieldName === "agent") {
			var agentAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agentAutocompleter"]');
		agentAutocompleter.setValue("");
		} else if(strFieldName === "endClient") {
		var endClientAutocompleter = me.getFilterView().down('AutoCompleter[itemId="endClientAutocompleter"]');
		endClientAutocompleter.setValue("");
		} else if(strFieldName === "actNum") {
		var actNumAutocompleter = me.getFilterView().down('AutoCompleter[itemId="actNumAutocompleter"]');
		actNumAutocompleter.setValue("");
		}
		else if(strFieldName === 'requestState'){
			var statusFltId = me.getFilterView().down('combo[itemId=statusFilter]');
			statusFltId.reset();
			me.userStatusPrefCode = 'all';
			statusFltId.selectAllValues();
			me.setDataForFilter();
		}
	},
	
	
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = me.filterAgentName;
		me.clientDesc = me.filterAgentDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.updateFilterparams();
		me.setDataForFilter();
		me.applyFilter();
	},
	updateFilterparams : function() {
		var me = this;
		var agentAutocompleter = me.getFilterView().down('AutoCompleter[itemId="agentAutocompleter"]');
		var endClientAutocompleter = me.getFilterView().down('AutoCompleter[itemId="endClientAutocompleter"]');
		var actNumAutocompleter = me.getFilterView().down('AutoCompleter[itemId="actNumAutocompleter"]');
	
		var sellerFilter = {
			key : '$sellerCode',
			value : strSellerId
		};
		agentAutocompleter.cfgExtraParams = [];
		agentAutocompleter.cfgExtraParams.push(sellerFilter);
		endClientAutocompleter.cfgExtraParams = [];
		endClientAutocompleter.cfgExtraParams.push(sellerFilter);
		actNumAutocompleter.cfgExtraParams = [];
		actNumAutocompleter.cfgExtraParams.push(sellerFilter);
		if(me.clientCode && 'ALL' !== me.clientCode) {
			var clientFilter = {
				key : '$filtercode1',
				value : me.clientCode
			};
			agentAutocompleter.cfgExtraParams.push(clientFilter);
			endClientAutocompleter.cfgExtraParams.push(clientFilter);
			actNumAutocompleter.cfgExtraParams.push(clientFilter);
		}
		//agentAutocompleter.setValue("");
		//adminFeeProfAutocompleter.setValue("");
		
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
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
			strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
			if(!Ext.isEmpty(me.filterEndClientName) ){
				strUrl +=me.filterEndClientName;
			}
			if (groupInfo && groupInfo.groupTypeCode === 'INPAYSO_OPT_STATUS') {
				strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
			}
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.updateFilterInfo();
		objGroupView.refreshData();
	},
	updateFilterInfo : function() {
		var me = this;
		var arrInfo = generateFilterArray(me.filterData);
		if(isClientUser()) {
		
		}
		me.getFilterView().updateFilterInfo(arrInfo);
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
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
										else if(objArray[i] == 6){
											strTemp = strTemp + "(requestState eq '6' and validFlag eq 'N')";
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
								
						}
						
						else if(filterData[index].paramName=='endClient'){
						
						//strTemp = strTemp + "( trade_name lk '"+ filterData[index].paramValue1 + "' or trust_name lk '"+ filterData[index].paramValue1 +"' or registered_company_name lk '"+filterData[index].paramValue1 + "' or first_name lk '"+ filterData[index].paramValue1 + "' or last_name lk '"+ filterData[index].paramValue1 +"' or full_name lk '"+filterData[index].paramValue1 + "')";
						strTemp = strTemp + "( endClientName lk '"+filterData[index].paramValue1 + "')"; 						
						isFilterApplied = true;
						
						
						}
				else {
			
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
		clientCodeVal = null,
		statusFilterValArray = [],
		statusFilterDiscArray = [],
		statusFilterVal = me.userStatusPrefCode,
		statusFilterDisc = me.userStatusPrefDesc,
		jsonArray = [];
		
		if(!Ext.isEmpty(me.filterAgentName)) {
			jsonArray.push({
				paramName : 'agent',
				operatorValue : 'lk',
				paramValue1 : me.filterAgentName,
				dataType : 'S',
				paramFieldLable : getLabel('Agent', 'Agent'),
				displayType : 5,
				displayValue1 : me.filterAgentDesc
			});
		}
		if(!Ext.isEmpty(me.filterEndClientName)) {
			jsonArray.push({
				paramName : 'endClient',
				operatorValue : 'lk',
				paramValue1 : me.filterEndClientDesc.toLowerCase(),
				dataType : 'S',
				paramFieldLable :  getLabel('endClient', 'End Client'),
				displayType : 5,
				displayValue1 : me.filterEndClientDesc
			});
		}
		if(!Ext.isEmpty(me.filterActNumName)) {
			jsonArray.push({
				paramName : 'actNum',
				operatorValue : 'lk',
				paramValue1 : me.filterActNumDesc,
				dataType : 'S',
				paramFieldLable :getLabel('subActNo', 'Sub-Account Number'),
				displayType : 5,
				displayValue1 : me.filterActNumDesc
			});
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
		var objSummaryView = me.getEndClientView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
	var me = this, args = {};
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			me.preferenceHandler.readPagePreferences(me.strPageName,
					me.updateObjLRSOSummaryPref, args, me, false);
		}
	},
	updateObjLRSOSummaryPref : function(data) {
		objEndClientPref = Ext.encode(data);
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

	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objEndClientPref)) {
			objPrefData = Ext.decode(objEndClientPref);
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
					: END_CLIENT_COLUMNS || '[]';

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		else
		{
		objColumnSetting= END_CLIENT_COLUMNS;
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
		strUrl = 'services/generateEndClientReport.' + strExtension;
		strUrl += '?$skip=1';
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		strUrl += this.getFilterUrl(subGroupInfo,groupInfo);
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
	},
	
	showAccountClosureSummary : function(jsonData, endClientDesc) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.endClientClosureSummaryPopup = null;	
		me.endClientClosureSummaryPopup = Ext.create('GCPA.view.EndClientClosureSummaryPopUp', {
					cfgSummaryContent : endClientDesc,
					cfgPopUpData : jsonData				
				});
		me.endClientClosureSummaryPopup.show();
		me.endClientClosureSummaryPopup.center();
	}
});