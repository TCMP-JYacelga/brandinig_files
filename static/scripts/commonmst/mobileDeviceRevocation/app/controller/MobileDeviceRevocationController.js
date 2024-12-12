/**
 * @class GCP.controller.MobileDeviceRevocation
 * @extends Ext.app.Controller
 * @author Gaurav Kabra
 */

Ext.define('GCP.controller.MobileDeviceRevocationController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp'],
	refs : [{
		ref : 'groupView',
		selector : 'mobileDeviceRevocationView groupView'
	}, {
		ref : 'grid',
		selector : 'mobileDeviceRevocationView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'mobileDeviceRevocationView groupView filterView'
	}, {
		ref : 'mobileDeviceRevocationView',
		selector : 'mobileDeviceRevocationView'
	}],
	config : {
		strPageName:'mobileRevocation',
		pageSettingPopup : null,
		isUserSelected : false,
		isDeviceSeleted : false,
		isCompanySelected : false,
		defaultButtonMask : "0"
	},
	init : function() {
		var me = this;
		me.updateConfig();
		
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		GCP.getApplication().on('revokeDevices', function(mapUids) {
			if(_IsEmulationMode != true){
				me.revokeDevices(mapUids);
			}
		});
		
		me.control({
			'mobileDeviceRevocationView groupView' : {
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
					if(_IsEmulationMode != true){
						me.doHandleRowIconClick(actionName, grid, record);
					}
					else{
						 Ext.MessageBox.alert('Emulation Mode', 'This request cannot be completed as you are in Emulation Mode', function(){
					          return true;
					     });
					    }
				},
				'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true){
						if(_IsEmulationMode != true){
							me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
						}
						else{
							 Ext.MessageBox.alert('Emulation Mode', 'This request cannot be completed as you are in Emulation Mode', function(){
						          return true;
						     });
						    }
						}
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
					me.resetAllFilters();
				}
			},
			'mobileDeviceRevocationFilterView AutoCompleter[itemId="clientComboAuto"]' : {
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
							/*	me.filterUserName = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();*/
								selectedFilterClient = combo.getValue();
								selectedFilterClientDesc = combo.getValue();
								me.handleClientChangeInQuickFilter();
								me.isCompanySelected = true;
					}
				}
			},
			
			'mobileDeviceRevocationFilterView AutoCompleter[itemId="userNameAutocompleter"]' : {
				select : function(combo, record) {
					me.filterUserName = combo.getValue();
					me.isUserSelected = true;
					me.setDataForFilter();
					me.applyFilter();
				},
				/*change : function(combo, newValue, oldValue, eOpts) {
					if(Ext.isEmpty(newValue)) {
						me.filterUserName = "";
						me.setDataForFilter();
						me.applyFilter();
					}
				}*/
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue())) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterUserName = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isUserSelected = true;
						}
					}else{
						me.isUserSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isUserSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isUserSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.filterUserName = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isUserSelected = true;
					}
				}
			},
			'mobileDeviceRevocationFilterView AutoCompleter[itemId="deviceNameAutocompleter"]' : {
				select : function(combo, record) {
					me.filterDeviceName = combo.getValue();
					me.isDeviceSeleted = true;
					me.setDataForFilter();
					me.applyFilter();
				},
				/*change : function(combo, newValue, oldValue, eOpts) {
					if(Ext.isEmpty(newValue)) {
						me.filterDeviceName = "";
						me.setDataForFilter();
						me.applyFilter();
					}
				}*/
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue())) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterDeviceName = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isDeviceSeleted = true;
						}
					}else{
						me.isDeviceSeleted = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isDeviceSeleted = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isDeviceSeleted == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
						
								me.filterDeviceName = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isDeviceSeleted = true;
					}
				}
			}
		});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
	},
	

	revokeDevices : function(mapUids) {
		var me = this, strPostFix =  'revokeDevices.form';
		var strUrl = strDevoiceRevokationUrl, paramToSend = null;
		if (!($.isEmptyObject(mapUids)) && strUrl) {
			strUrl += '/' + strPostFix;
			paramToSend = {};
			paramToSend['mapUids'] = mapUids, $.ajax({
				url : strUrl,
				crossDomain : true,
				type : "POST",
				contentType : 'application/x-www-form-urlencoded',
				data : paramToSend,
				success : function(response) {
					if (response.success === true) {
						me.updatedRevokedDevices(mapUids);
					} else {
						// TODO : Failure to handled
						var jsonPost = [], arrData = response && response.data
								? response.data
								: [], arrMapsFailed = [], arrMapsSuccess = [], strSuccessMapUid = null, strFailedMapUid = null;
						Ext.each(arrData, function(cfg, index) {
									arrMapsFailed.push(cfg.MAPuid);
								});
						strFailedMapUid = arrMapsFailed.toString();
						Ext.each(mapUids.split(',') || [], function(id, index) {
									jsonPost.push({
												'mapUid' : id,
												'success' : !Ext.Array
														.contains(
																arrMapsFailed,
																id)
											});
									if (!Ext.Array.contains(arrMapsFailed, id))
										arrMapsSuccess.push(id);
								});
						strSuccessMapUid = arrMapsSuccess.toString();
						if (Ext.isEmpty(strSuccessMapUid)) {
							me.paintActionMessage(jsonPost);
							me
									.getGroupView()
									.handleGroupActionsVisibility(me.defaultButtonMask);
						} else {
							me.updatedRevokedDevices(strSuccessMapUid,
									strFailedMapUid);
						}
					}
				},
				error : function() {
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg1',
										'Error while performing revocation..'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk','Ok')
						        },
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},
	
	updatedRevokedDevices : function(strMapIds,strFailedMapUid) {
		// TODO: update action to be handled
		var me = this;
		var groupView = me.getGroupView();
		var strActionUrl = 'services/revokeMobileUser', arrMapIds = null, jsonPost = [];
		var jsonPost = [];
		arrMapIds = !Ext.isEmpty(strMapIds) ? strMapIds.split(',') : [];
		Ext.each(arrMapIds || [], function(id, index) {
					jsonPost.push({
								serialNo : index + 1,
								recordDesc : id,
								userMessage : ''
							});
				});
		if (jsonPost.length > 0){
			groupView.setLoading(true);
			Ext.Ajax.request({
						url : strActionUrl,
						method : 'POST',
						jsonData : Ext.encode(jsonPost),
						success : function(response) {
							groupView.setLoading(false);
							var data = Ext.decode(response.responseText) || [];
							var arrMsg = [], arrFailedId = [];
							Ext.each(data, function(cfg, index) {
									arrMsg.push({
												'mapUid' : cfg.successValue,
												'success' : cfg.success === 'Y'
											});
								});
						arrFailedId = !Ext.isEmpty(strFailedMapUid) ? strFailedMapUid.split(',') : [];
						if(arrFailedId.length > 0)
						Ext.each(arrFailedId, function(id,
											index) {
										arrMsg.push({
													'mapUid' : id,
													'success' : false
												});
									});
							me.paintActionMessage(arrMsg);
							me.keepActionPanelVisible = true;
							groupView.refreshData();
						},
						failure : function() {
							var errMsg = "";
							groupView.setLoading(false);
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg1',
												'Error while performing revocation..'),
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	/**
	 * @example [{'mapUid' : '95a439c7ccb3bb0121b2bc02378170d', 'success' : true}, {'mapUid' : '95a439c7ccb3bb0121b2bc02378170d', 'success' : false}]
	 * 
	 * */
	paintActionMessage : function(arrRecords){
		//TODO : Error handling to be done
		var me = this;
		var messages = [];
		var gridStore = me.getGrid().getStore();
		var gridRecords = Ext.isEmpty(gridStore.data.items) ? [] : gridStore.data.items;
		arrRecords.forEach(function(record) {
			var message = {};
			var deviceName = "";
			gridRecords.forEach(function(gridRecord) {
				if(gridRecord.data.mapUid === record.mapUid) {
					deviceName = gridRecord.data.deviceName;
				}
			});
			message['success'] = record.success;
			message['actionMessage'] = deviceName + ((record.success === true) ? " Revocation Successful" : " Revocation Failed");
			messages.push(message);
		});
		getRecentActionResult(messages);
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
		var userNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="userNameAutocompleter"]');
		userNameAutocompleter.setValue("");
		var deviceNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="deviceNameAutocompleter"]');
		deviceNameAutocompleter.setValue("");
	},
	
	doHandleRowIconClick : function(actionName, grid, record) {
		if(actionName === 'revoke') {
			var popupView = null;
			var popupStore = [];
			popupStore.push(record.data);
			popupView = Ext.create('GCP.view.MobileDeviceRevocationGridPopup', {
				title : getLabel('selectDeviceToRevoke', 'Selected Device to Revoke'),
				data : Ext.isEmpty(popupStore) ? [] : popupStore
			});
			popupView.show();
		}
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		if (!Ext.isEmpty(strActionType) && strActionType === 'groupAction') {
			me.handleGroupActions(grid, arrSelectedRecords);
		} else {
			/*me.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords, strActionType);*/
		}
	},
	
	handleGroupActions : function(grid, arrSelectedRecords) {
		var popupStore = [];
		arrSelectedRecords.forEach(function(selectedItem, index, selectedItems) {
			popupStore.push(selectedItem.data);
		});
		var popupView = Ext.create('GCP.view.MobileDeviceRevocationGridPopup', {
			title : 'Confirmation',
			data : Ext.isEmpty(popupStore) ? [] : popupStore
		});
		popupView.show();
	},

	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this,
			objGroupView = me.getGroupView(),
			buttonMask = "1",
			maskArray = [],
			actionMask = '',
			objData = null;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__metadata.__buttonMask)) {
			buttonMask = jsonData.d.__metadata.__buttonMask;
		}

		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, 1);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},

	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		if(!Ext.isEmpty(objData)) {
			me.resetFieldOnDelete(objData);
		}
	},
	
	resetFieldOnDelete : function(objData) {
		var me = this,
			strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if(strFieldName === "clientCode") {
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
		} else if(strFieldName === "userName") {
			var userNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="userNameAutocompleter"]');
			userNameAutocompleter.setValue("");
		} else if(strFieldName === "deviceName") {
			var deviceNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="deviceNameAutocompleter"]');
			deviceNameAutocompleter.setValue("");
		}
	},
	
	resetClientAutocompleter : function() {
		var me = this;
		var clientAuto = me.getFilterView().down("combo[itemId='clientComboAuto']");
		clientAuto.setRawValue("");
		selectedFilterClient = '';
		selectedFilterClientDesc = '';
		$(document).trigger("handleClientChangeInQuickFilter");
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
		var userNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="userNameAutocompleter"]');
		var deviceNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="deviceNameAutocompleter"]');
		var sellerFilter = {
			key : '$sellerCode',
			value : strSellerId
		};
		userNameAutocompleter.cfgExtraParams = [];
		deviceNameAutocompleter.cfgExtraParams = [];
		userNameAutocompleter.cfgExtraParams.push(sellerFilter);
		deviceNameAutocompleter.cfgExtraParams.push(sellerFilter);
		if(me.clientCode) {
			var clientFilter = {
				key : '$filtercode1',
				value : me.clientCode
			};
			userNameAutocompleter.cfgExtraParams.push(clientFilter);
			deviceNameAutocompleter.cfgExtraParams.push(clientFilter);
		}
		userNameAutocompleter.setValue("");
		deviceNameAutocompleter.setValue("");
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
			strUrl = strUrl + me.getFilterUrl() + "&$filter="+ me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.updateFilterInfo();
	},
	updateFilterInfo : function() {
		var me = this;
		var arrInfo = generateFilterArray(me.filterData);
		if(isClientUser()) {
			if(getClientData().length >= 1) {
				var clientFilterIndex = -1;
				arrInfo.forEach(function(appliedFilterObj, appliedFilterObjIndex) {
					if(appliedFilterObj.fieldId == "clientCode") clientFilterIndex = appliedFilterObjIndex;
				});
				if(clientFilterIndex !== -1) {
					arrInfo.splice(clientFilterIndex, 1);
				}
			}
		}
		me.getFilterView().updateFilterInfo(arrInfo);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}

		return strUrl;
	},
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var strFilter = '';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
			for ( var index = 0; index < filterData.length; index++) {
				if (isFilterApplied) {
					strTemp = strTemp + ' and ';
				}
				strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue + ' ' + '\'' + filterData[index].paramValue1 + '\'';
				isFilterApplied = true;
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
		jsonArray = [];
		if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode)) {
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : clientCodeVal,
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company'),
				displayType : 5,
				displayValue1 : me.clientDesc
			});
		}
		if(!Ext.isEmpty(me.filterUserName)) {
			jsonArray.push({
				paramName : 'userName',
				operatorValue : 'lk',
				paramValue1 : me.filterUserName.toUpperCase(),
				dataType : 'S',
				paramFieldLable : getLabel('userName', 'User Name'),
				displayType : 5,
				displayValue1 : me.filterUserName
			});
		}
		if(!Ext.isEmpty(me.filterDeviceName)) {
			jsonArray.push({
				paramName : 'deviceName',
				operatorValue : 'lk',
				paramValue1 : me.filterDeviceName.toUpperCase(),
				dataType : 'S',
				paramFieldLable : getLabel('mobileDeviceName', 'Mobile Device Name'),
				displayType : 5,
				displayValue1 : me.filterDeviceName
			});
		}
		return jsonArray;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
		var me = this,
			strModule = '',
			strUrl = null,
			args = null,
			strFilterCode = null,
			objGroupView = me.getGroupView();

		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode;
			me.preferenceHandler.readModulePreferences(me.strPageName, strModule, me.postHandleDoHandleGroupTabChange, args, me, true);
			colModel = me.getMobileDeviceRevocationView().getColumnModel(MOB_DEVICE_REVOCATION_COLUMNS);
		}
	},

	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getMobileDeviceRevocationView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
			heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
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
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter) + "&$filter="+ me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
		if (!(me.keepActionPanelVisible) && (!$('#actionResultDiv').hasClass('ui-helper-hidden'))) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		} else {
			me.keepActionPanelVisible = false;
		}
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		objGroupView.handleGroupActionsVisibility(me.defaultButtonMask);

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
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objMobileRevocaionPref)) {
			objPrefData = Ext.decode(objMobileRevocaionPref);
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
			 * preferences/gridsets/uder defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: MOB_DEVICE_REVOCATION_COLUMNS || '[]';

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
		objData["rowPerPage"] = _GridSizeMaster;
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
		
		var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
		var objGroupView = me.getGroupView();
		var arrSelectedrecordsId = [];
		if (!Ext.isEmpty(objGroupView))
			grid = objGroupView.getGrid();

		if (!Ext.isEmpty(grid)) {
			var objOfRecords = grid.getSelectedRecords();
			if (!Ext.isEmpty(objOfRecords)) {
				objOfGridSelected = grid;
				objOfSelectedGridRecord = objOfRecords;
			}
		}
		if ((!Ext.isEmpty(objOfGridSelected))
				&& (!Ext.isEmpty(objOfSelectedGridRecord))) {
			for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
				arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
			}
		}

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateMobileRevocationListReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += this.getFilterUrl();
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
		for(var i=0; i<arrSelectedrecordsId.length; i++){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
					arrSelectedrecordsId[i]));
		}	
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
	}
});