Ext.define('GCP.controller.ClientSetupController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.ClientSetupView', 'GCP.view.ClientSetupGridView',
			'GCP.view.CopyByClientPopupView', 'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientSetupView',
				selector : 'clientSetupView'
			}, 
			{
				ref : 'groupView',
				selector : 'clientSetupView groupView'
			},{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			},{
				ref : 'clientSetupFilterView',
				selector : 'clientSetupFilterView'
			},{
				ref : 'createNewToolBar',
				selector : 'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'clientSetupGridView',
				selector : 'clientSetupView clientSetupGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'clientSetupGrid',
				selector : 'clientSetupView clientSetupGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'clientSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'clientSetupGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'clientSetupGridView smartgrid'
			}, {
				ref : "corporationFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="corporationFilter"]'
			}, {
				ref : "clientFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="clientFilter"]'
			}, {
				ref : "statusFilter",
				selector : 'clientSetupView clientSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'clientSetupView clientSetupGridView clientGroupActionBarView'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'clientSetupView clientSetupTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'brandingPkgListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			}, {
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}, {
				ref : 'clientInlineBtn',
				selector : 'clientSetupView clientSetupFilterView button[itemId="clientBtn"]'
			}, {
				ref : 'mandateNameFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=mandateNameFltId]'
			}, {
				ref : 'mandateDebtorRefFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=mandateDebtorRefFltId]'
			},{
				ref : 'mandateStatusDescriptionFilter',
				selector : 'clientSetupFilterView combo[itemId=mandateStatusDescriptionFltId]'
			},{
				ref : 'payerNameFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=payerNameFltId]'
			},{
				ref : 'requestStatusDescriptionFilter',
				selector : 'clientSetupFilterView combo[itemId=requestStatusFilter]'
			}

	],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode:'',
		clientDesc:'',
		brandingPkgListCount : 0,
		pageSettingPopup : null,
		filterData : [],
		sellerOfSelectedClient : '',
		copyByClicked : '',
		strDefaultMask : '000000000000000000',
		filterMandateName:'mandateName',
		filterAccountNo :'mandateDebtorRef',
		filterMandateStatusDescription : 'mandateStatus',
		filterRequestStatusDescription : 'requestStatus',
		filterPayerName:'displPayerName',
		reportGridOrder : null,		
		strPageName:'mandateMst',
		preferenceHandler : null,
		isDefaultMatrix: false,
		oldDefaultMatrix : '',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		requestStatusFilterVal : 'all',
		requestStatusFilterDesc : 'All',
		isQuickStatusFieldChange : false
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.clientCode =$("#summaryClientFilterSpan").val(),
		me.clientDesc = $("#summaryClientFilterSpan").text(),
		me.firstLoad = true;
		me.updateConfig();
		if(objSaveLocalStoragePref){
				me.objLocalData = Ext.decode(objSaveLocalStoragePref);
				objQuickPref = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref 
									&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
				
				me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
			
			}
		GCP.getApplication().on({
					showClientPopup : function(brandingpkg) {
						me.copyByClicked = brandingpkg;
						copybypopup = Ext.create(
								'GCP.view.CopyByClientPopupView', {
									itemId : 'copybypopup'
								});
						(copybypopup).show();
					}

				});
					$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
						me.handleClientChangeInQuickFilter(isSessionClientFilter);
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
		});
        $(document).on("handleAddNewUserCategory",function(){
			me.handleClientEntryAction();
		});
        $(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
        $(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
        });
		me.control({
			
			'clientSetupView clientSetupTitleView' : {
				'performReportAction' : function(btn, opts) {
					this.handleReportAction(btn, opts);
				}
			},
			'clientSetupFilterView' : {
			beforerender:function(){
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					var createAdvanceFilterLabel = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(createAdvanceFilterLabel)) {
						createAdvanceFilterLabel.hide();
					}
				},
				afterrender : function(panel, opts) {	
					me.setFilterRetainedValues();
				},
				'handleClientChange' : function(strClientCode,
							strClientDescr, strSellerId){
					me.sellerOfSelectedClient = strSellerId;
					me.clientCode = strClientCode;
					me.clientDesc = strClientDescr;	
                    var objDetailFilterPanel = me.getClientSetupFilterView();			
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'clientSetupFilterView combo[itemId=clientCombo]' : {
				'boxready' : function(combo, width, height, eOpts) { 
					var me = this;
					if (!Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode  && 'all' !== me.clientCode) {
						combo.setValue(me.clientCode);
					}
					else
						combo.setValue(combo.getStore().getAt(0));
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=clientComboAuto]' : {
				'boxready' : function(combo, width, height, eOpts) { 
					var me = this;
					if (!Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode  && 'all' !== me.clientCode) {
						combo.setValue(me.clientCode);
						combo.setRawValue(me.clientDesc);
					}
					else
						combo.setValue(combo.getStore().getAt(0));
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=mandateNameFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isDefaultMatrix = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldDefaultMatrix = oldValue;
					if (newValue == '' || null == newValue) {						
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isDefaultMatrix = true;
						me.oldDefaultMatrix = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isDefaultMatrix = false;
				},
				blur : function(combo, record){
					if (me.isDefaultMatrix == false && me.oldDefaultMatrix != combo.getRawValue()){
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}
					me.oldDefaultMatrix = combo.getRawValue();	
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=mandateDebtorRefFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isDefaultMatrix = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldDefaultMatrix = oldValue;
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
						me.isDefaultMatrix = true;
						me.oldDefaultMatrix = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isDefaultMatrix = false;
				},
				blur : function(combo, record){
					if (me.isDefaultMatrix == false && me.oldDefaultMatrix != combo.getRawValue()){
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}
					me.oldDefaultMatrix = combo.getRawValue();	
				}
			},
			'clientSetupFilterView combobox[itemId=mandateStatusDescriptionFltId]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					//if(combo.isQuickStatusFieldChange)
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
			'clientSetupFilterView combobox[itemId=requestStatusFilter]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
						me.handleRequestStatusClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts){
						if (!Ext.isEmpty(me.requestStatusFilterDesc) && me.requestStatusFilterDesc != 'All' && me.requestStatusFilterDesc != 'all' && 
							!Ext.isEmpty(me.requestStatusFilterVal) && me.requestStatusFilterVal != 'All' && me.requestStatusFilterVal != 'all') {
							if(!Ext.isEmpty(me.requestStatusFilterVal)){
							combo.setValue(me.requestStatusFilterVal);
							}
							else{
								combo.setValue(me.requestStatusFilterVal);
								me.requestStatusFilterVal = '';
							}
						}
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=payerNameFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);
					me.isDefaultMatrix = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldDefaultMatrix = oldValue;
					if (newValue == '' || null == newValue) {						
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isDefaultMatrix = true;
						me.oldDefaultMatrix = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isDefaultMatrix = false;
				},
				blur : function(combo, record){
					if (me.isDefaultMatrix == false && me.oldDefaultMatrix != combo.getRawValue()){
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}
					me.oldDefaultMatrix = combo.getRawValue();	
				}
			},
           'clientSetupView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);			
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},						
				'gridStoreLoad' : function(grid, store) {
						me.disableActions(false);
				},
			
				afterrender : function(panel,opts){
				},
				'render' : function() {
						me.firstTime = true;
						me.applyPreferences();
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
			
			'clientSetupView button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			}
		});
	},
	
	// method to handle client list and branding pkg list link click

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
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
	handleRequestStatusClick : function(combo) {
		var me = this;
		var allSelected= null;
		combo.isQuickStatusFieldChange = false;
		allSelected = combo.isAllSelected();
		if(allSelected === true){
			me.requestStatusFilterVal = 'all';
			me.requestStatusFilterDesc = 'All';
		} else {
			me.requestStatusFilterVal = combo.getSelectedValues();
			me.requestStatusFilterDesc = combo.getRawValue();
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
			reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) {
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
				me.filterData = arrQuickJson;
			}
			me.resetFieldOnDelete(objData);
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
	resetFieldOnDelete : function(objData) {
		var me = this,
			strFieldName;
		var statusField = me.getFilterView().down('combo[itemId="mandateStatusDescriptionFltId"]');
		var requestStatusField = me.getFilterView().down('combo[itemId="requestStatusFilter"]');
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if(strFieldName === "clientId") {
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
		} else if(strFieldName === "mandateName") {
			var userNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="mandateNameFltId"]');
			userNameAutocompleter.setValue("");
		} else if(strFieldName === "mandateDebtorRef") {
			var debtorNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="mandateDebtorRefFltId"]');
			debtorNameAutocompleter.setValue("");
		}
		else if(strFieldName === "displPayerName") {
			var payerNameAutocompleter = me.getFilterView().down('AutoCompleter[itemId="payerNameFltId"]');
			payerNameAutocompleter.setValue("");
		}
		else if (strFieldName ==='mandateStatus' && !Ext.isEmpty(statusField)) {
			statusField.selectAllValues();
			me.statusFilterVal = 'all';
			//me.statusFilterVal = null;
			me.statusFilterDesc = null;
		}
		else if (strFieldName ==='requestStatus' && !Ext.isEmpty(requestStatusField)) {
			requestStatusField.selectAllValues();
			me.requestStatusFilterVal = 'all';
			me.requestStatusFilterDesc = null;
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
		if (!Ext.isEmpty(me.getMandateNameFilterAuto())) {
			me.getMandateNameFilterAuto().setValue('');
		}
		if (!Ext.isEmpty(me.getAccountNoFilterAuto())) {
			me.getAccountNoFilterAuto().setValue('');
		}
		if (!Ext.isEmpty(me.getPayerNameFilterAuto())) {
			me.getPayerNameFilterAuto().setValue('');
		}
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
		var strFilterParam = '';
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
				case 'statusFilterOp' :
					var objValue = filterData[index].paramValue1;
					var objUser = filterData[index].makerUser;
					var objArray = objValue;
					for (var i = 0; i < objArray.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
							if(objArray[i] == 12){
								strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
							}
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5')) and makerId ne '"+objUser+"' )";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq "+objArray[i]+")";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
							if(i == (objArray.length -1))
							strTemp = strTemp + ')';
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

	showHistory : function(isClient, clientName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
	},


	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				/*
				 * blnRetValue = me.isRowIconVisible(store, record, jsonData,
				 * null, arrMenuItems[a].maskPosition);
				 */
				// arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit, isActionAppl) {
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
								blnEnabled = blnEnabled && isSameUser && isActionAppl;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser && isActionAppl;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit && isActionAppl;
							}else if (item.maskPosition === 5 && blnEnabled) {
								blnEnabled = blnEnabled && isActionAppl;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/mandateMaster/{0}.srvc?', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);

		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					cls:'t7-popup',
					buttons : Ext.Msg.OKCANCEL,
                    buttonText : {
                        ok:getLabel('btn_Ok','OK'),
                        cancel:getLabel('btncancel', 'Cancel')
                    },
					multiline : 4,
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
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
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(response) {
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions('000000000000000000');
								groupView.setLoading(false);
								groupView.refreshData();
								var errorMessage = '';
								if (response.responseText != '[]') {
									var jsonData = Ext
											.decode(response.responseText);
									Ext.each(jsonData[0].errors, function(error,
													index) {
												errorMessage = errorMessage
														+ error.errorMessage
														+ "<br/>";
											});
									if ('' != errorMessage && null != errorMessage) {
										Ext.Msg.alert("Error", errorMessage);
									}
								}
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_clientType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = getLabel('corporation', 'Corporation');
				} else {
					strRetValue = getLabel('subsidiary', 'Subsidiary');
				}
			}
		} else if (colId === 'col_variance') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('brandingPkgName'))) {
					strRetValue = Math.floor((Math.random() * 100) + 1);
				}
			}
		} else if (colId === 'col_corporationName') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = record.get('clientName');
				} else {
					strRetValue = value;
				}
			}
		} else if (colId === 'col_bankPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_clientPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_copyBy') {
			strRetValue = '<a class="underlined" onclick="showClientPopup(\''
					+ record.get('brandingPkgName') + '\')">' + value + '</a>';
		} else {
			strRetValue = value;
		}

		return strRetValue;
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	handleClientEntryAction : function(entryType) {
		var me = this;
		var selectedClient = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var selectedSeller = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;//sellerCombo.getValue();
		selectedClient = me.clientCode === 'all' ? '' : me.clientCode;//clientCodesFltId.getValue();
		var form;
		var strUrl = 'addMandate.form';

		var errorMsg = null;

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		if(!Ext.isEmpty(selectedSeller))
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerCode',
					selectedSeller));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				isEmpty(selectedClient) ? strClientId : selectedClient));
		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var matrixTypeVal = null;
		var mandateDebtorRef = null, mandateDebtorRefVal = null,mandateStatusDescription = null, mandateStatusDescriptionVal = null,requestStatusDescription = null,requestStatusDescriptionVal = null;
		var mandateNameVal = null;
		var payerNameVal = null;
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(Ext.isEmpty(clientSetupFilterView)){
		  
		}else{
		var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var mandateNameFltId = clientSetupFilterView
				.down('combobox[itemId=mandateNameFltId]');
		var mandateDebtorRefFltId = clientSetupFilterView
				.down('combobox[itemId=mandateDebtorRefFltId]');
		var mandateStatusDescriptionFltId = clientSetupFilterView
				.down('combo[itemId=mandateStatusDescriptionFltId]');
		var requestStatusFilter = clientSetupFilterView
		.down('combo[itemId=requestStatusFilter]');
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		if (!Ext.isEmpty(mandateNameFltId)
				&& !Ext.isEmpty(mandateNameFltId.getValue())) {
			mandateNameVal = mandateNameFltId.getValue();
		}
		if (!Ext.isEmpty(mandateDebtorRefFltId)
				&& !Ext.isEmpty(mandateDebtorRefFltId.getValue())) {
			mandateDebtorRef = mandateDebtorRefFltId.getValue(), mandateDebtorRefVal = mandateDebtorRef
					.trim();
		}
		if (!Ext.isEmpty(mandateStatusDescriptionFltId)
				&& !Ext.isEmpty(mandateStatusDescriptionFltId.getValue())) {
			mandateStatusDescription = mandateStatusDescriptionFltId.getValue(), mandateStatusDescriptionVal = mandateStatusDescription
					.trim();
		}
		if (!Ext.isEmpty(requestStatusFilter)
				&& !Ext.isEmpty(requestStatusFilter.getValue())) {
			requestStatusDescription = requestStatusFilter.getValue(), requestStatusDescriptionVal = requestStatusDescription
					.trim();
		}
		if (!Ext.isEmpty(payerNameFltId)
				&& !Ext.isEmpty(payerNameFltId.getValue())) {
			payerNameVal = payerNameFltId.getValue();
		}
		}
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;;
		arrJsn['clientId'] = isEmpty(me.clientCode) ? strClientId : me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['mandateName'] = mandateNameVal;
		arrJsn['accountNmbr'] = mandateDebtorRefVal;
		arrJsn['payerName'] = payerNameVal;
		arrJsn['mandateStatusDescription'] = mandateStatusDescriptionVal;
		arrJsn['requestStatusDescription'] = requestStatusDescriptionVal;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var client = '';
							var mandateName = '';
							var accountNumber = '';
							var payerName = '';
							var clientSetupFilterView = me.getClientSetupFilterView();
					
							var mandateNameFltId = clientSetupFilterView
									.down('combobox[itemId=mandateNameFltId]');
					
							var mandateDebtorRefFltId = clientSetupFilterView
									.down('combobox[itemId=mandateDebtorRefFltId]');
							var mandateStatusDescriptionFltId = clientSetupFilterView
									.down('combo[itemId=mandateStatusDescriptionFltId]');
							var requestStatusFilter = clientSetupFilterView
							.down('combo[itemId=requestStatusFilter]');
							var payerNameFltId = clientSetupFilterView
									.down('combobox[itemId=payerNameFltId]');		
							if (!Ext.isEmpty(mandateNameFltId)
									&& !Ext.isEmpty(mandateNameFltId.getValue())) {
								mandateName =mandateNameFltId.getValue();
							}else
								mandateName = getLabel('none','None');
												
							if (!Ext.isEmpty(mandateDebtorRefFltId)
									&& !Ext.isEmpty(mandateDebtorRefFltId.getValue())) {
								accountNumber = mandateDebtorRefFltId.getValue();
							}else
								accountNumber = getLabel('none','None');
								
							if (!Ext.isEmpty(mandateStatusDescriptionFltId)
									&& !Ext.isEmpty(mandateStatusDescriptionFltId.getValue())) {
								status = mandateStatusDescriptionFltId.getRawValue();
							} else {
								status = getLabel('all', 'ALL');
							}
							if (!Ext.isEmpty(requestStatusFilter)
									&& !Ext.isEmpty(requestStatusFilter.getValue())) {
								requestStatus = requestStatusFilter.getRawValue();
							} else {
								requestStatus = getLabel('all', 'All');
							}
							if (!Ext.isEmpty(payerNameFltId)
									&& !Ext.isEmpty(payerNameFltId.getValue())) {
								payerName =payerNameFltId.getValue();
							}else
								payerName = getLabel('none','None');
							
								client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');
								tip.update(getLabel('grid.column.company', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('mandateName', 'Mandate Name')
										+ ' : '
										+ mandateName
										+ '<br/>'
										+ getLabel('debtRefNo', 'Debtor Reference')
										+ ' : '
										+ accountNumber
										+ '<br/>'
										+ getLabel('mandateStatus', 'Mandate Status')
										+ ' : '
										+ status
										+ '<br/>'
										+ getLabel('requestStatus', 'Status')
										+ ' : '
										+ requestStatus
										+ '<br/>'
										+ getLabel('payerName', 'Payer Name')
										+ ' : '
										+ payerName);
						}
					}
				});
	},
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateMandatesListReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += this.generateFilterUrl();
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
	generateFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '';
		me.setDataForFilter();
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(me) {
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';

			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
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
	
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		// me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode && _charCaptureGridColumnSettingAt === 'L') {
			if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
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
	postHandleGroupTabChange : function(data, args) {
	//	var me = args.scope;
		var me=this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) 
			objPref = Ext.decode(data.preference);
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
		if (_charCaptureGridColumnSettingAt === 'L' && objPref
			&& objPref.gridCols) {
			arrCols = objPref.gridCols || null;
//			intPgSize = objPref.pgSize || _GridSizeTxn;
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
					  sortState:objPref.sortState
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
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
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
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [];
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		me.reportGridOrder = strUrl;		
		me.disableActions(true);
		var columns=grid.columns;
		Ext.each(columns, function(col) {
	               	col.sortable=false;
	       
        });
		grid.loadGridData(strUrl, null, null, false);
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
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
			me.handleGridRowDoubleClick(record, grid, columnType);
		});
	},
	handleGridRowDoubleClick : function(record, grid, columnType) {
		var me = this;
		var columnModel = null;
		var columnAction = null;
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
					if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var selectedRecord=grid.getSelectionModel().getSelection()[0];
		var rowIndex = grid.store.indexOf(selectedRecord);
		if (actionName === 'submit' || actionName === 'discard'
			|| actionName === 'accept' || actionName === 'reject'
			|| actionName === 'enable' || actionName === 'disable')
		me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
	else if (actionName === 'btnHistory') {
		var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				if ('client' == me.selectedMst) {
					me.showHistory(true, record.get('clientDesc'), record
									.get('history').__deferred.uri, record
									.get('identifier'));
				}
			}
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('viewMandate.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editMandate.form', record, rowIndex);
		}
		}
	},
	submitExtForm : function(strUrl, record, rowIndex) {
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

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, selectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		var isActionAppl = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) 
		{
			objData = selectedRecords[index];
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
			isActionAppl = validateActionButtons(objData.raw.editMode);
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled, isSubmit, isActionAppl);
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/mandateMaster/{0}.srvc?', strAction);
		if (strAction === 'reject') {
			me.showRejectPopUp(strAction, strUrl, grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
		}
	},
	showRejectPopUp : function(strAction, strActionUrl,grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
                    buttonText : {
                        ok:getLabel('btn_Ok','OK'),
                        cancel:getLabel('btncancel', 'Cancel')
                    },
					multiline : 4,
					cls:'t7-popup',
					draggable : false,
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text)){
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error', 'Reject Remarks cannot be blank'));
							}else{
								me.preHandleGroupActions(strActionUrl, text,grid,record);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, mandateNameVal = null, mandateDebtorRefVal = null,statusVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var mandateStatusDescription = null, mandateStatusDescriptionVal = null, payerNameVal = null;
		var clientParamName = null, clientNameOperator = null;
		var clientNamesFltId = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		var requestStatusFilterDiscArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDisc = me.statusFilterDesc;
		var requestStatusFilterVal = me.requestStatusFilterVal;
		var requestStatusFilterDesc = me.requestStatusFilterDesc;
		if(Ext.isEmpty(clientSetupFilterView)){
			mandateNameVal=mandateName;
			mandateDebtorRefVal=accountNmbr;
			mandateStatusDescriptionVal=mandateStatusDescription;
			mandateNameVal = payerName;
			if(undefined != strClientDescription && strClientDescription != ''){
				me.clientDesc=strClientDescription;
			}
		}else{
		var mandateNameFltId = clientSetupFilterView
				.down('combobox[itemId=mandateNameFltId]');
		var mandateDebtorRefFltId = clientSetupFilterView.down('combobox[itemId=mandateDebtorRefFltId]');
		
		var mandateStatusDescriptionFltId = clientSetupFilterView
				.down('combo[itemId=mandateStatusDescriptionFltId]');
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');		
		if (!Ext.isEmpty(mandateNameFltId)
				&& !Ext.isEmpty(mandateNameFltId.getValue())) {
			mandateName = mandateNameFltId.getValue(), mandateNameVal = mandateName
					.trim();
		}
       
	
		if (!Ext.isEmpty(mandateDebtorRefFltId)
				&& !Ext.isEmpty(mandateDebtorRefFltId.getValue())) {
			mandateDebtorRef = mandateDebtorRefFltId.getValue();
			mandateDebtorRefVal = mandateDebtorRef.trim();
		}
		
		if (!Ext.isEmpty(mandateStatusDescriptionFltId)
				&& !Ext.isEmpty(mandateStatusDescriptionFltId.getValue())) {
			mandateStatusDescription = mandateStatusDescriptionFltId.getDisplayValue(), mandateStatusDescriptionVal = mandateStatusDescription
					.trim();
		}
		if (!Ext.isEmpty(payerNameFltId)
				&& !Ext.isEmpty(payerNameFltId.getValue())) {
			payerName = payerNameFltId.getValue(), payerNameVal = payerName
					.trim();
		}
       
       }
		
       if (!Ext.isEmpty(mandateNameVal)) {
			jsonArray.push({
						paramName : me.filterMandateName,
						paramValue1 : encodeURIComponent(mandateNameVal.replace(new RegExp("'", 'g'), "\''")),
						paramFieldLable : getLabel('mandateName', 'Mandate Name'),
						operatorValue : 'lk',
						dataType : 'S',
						displayValue1 : me.mandateNameVal
					});
		}
		if (!Ext.isEmpty(mandateDebtorRefVal)) {
			jsonArray.push({
						paramName : me.filterAccountNo,
						paramValue1 : encodeURIComponent(mandateDebtorRefVal.replace(new RegExp("'", 'g'), "\''")),
						paramFieldLable : getLabel('debtRefNo', 'Mandate Debtor Reference'),
						operatorValue : 'lk',
						dataType : 'S',
						displayValue1 : me.mandateDebtorRefVal
					});
		}
		if (statusFilterVal != null && statusFilterVal != 'All'
			&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
			
			//'To be Verified' status had to codes 'T' and 'N' so passing both
			//if(statusFilterVal.toString().indexOf('T') > -1){
			//	if(jQuery.inArray("N",statusFilterVal) == -1){
			//			statusFilterVal.push("N");
			//		};
				
			//}
			
			if (statusFilterDisc != null && statusFilterDisc != 'All'
				&& statusFilterDisc != 'all'
				&& statusFilterDisc.length >= 1)
				statusFilterDiscArray = statusFilterDisc.toString();
				
			jsonArray.push({
					paramName : me.filterMandateStatusDescription,
					paramValue1 : statusFilterVal,
					operatorValue : 'in',
					dataType : 'S',
					paramFieldLable : getLabel('mandateStatus', 'Mandate Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
		}
		if (!Ext.isEmpty(me.clientDesc)&&!Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
			clientParamName = 'clientId';
			clientNameOperator = 'eq';
			if (!Ext.isEmpty(me.clientCode)) {
				clientCodeVal = me.clientCode;
			} else {
				clientCodeVal = strClientId;
			}

			if (!Ext.isEmpty(clientCodeVal)) {
				jsonArray.push({
							paramName : clientParamName,
							paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : clientNameOperator,
							paramFieldLable :  getLabel('companyName', 'Company Name'),
							dataType : 'S',
							displayType : 5,
							displayValue1 : me.clientDesc
						});
			}
		}
		if (!Ext.isEmpty(payerNameVal)) {
			jsonArray.push({
						paramName : me.filterPayerName,
						paramValue1 : encodeURIComponent(payerNameVal.replace(new RegExp("'", 'g'), "\''")),
						paramFieldLable :  getLabel('payerName', 'Payer Name'),
						operatorValue : 'lk',
						dataType : 'S',
						displayValue1 : me.payerNameVal
					});
		}
		
		if(entityType === "0")
		{
			jsonArray.push({
						paramName : 'seller',
						paramValue1 : encodeURIComponent(strSellerId.replace(new RegExp("'", 'g'), "\''")),
						paramFieldLable :  getLabel('financialInstitution', 'Financial Institution'),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						displayValue1 : strSellerDesc
					});
		}
		if (requestStatusFilterVal != null && requestStatusFilterVal != 'All'
			&& requestStatusFilterVal != 'all' && requestStatusFilterVal.length >= 1) 
		{
			
			if (requestStatusFilterDesc != null && requestStatusFilterDesc != 'All'
				&& requestStatusFilterDesc != 'all'
				&& requestStatusFilterDesc.length >= 1)
				requestStatusFilterDiscArray = requestStatusFilterDesc.toString();
			
			jsonArray.push({
				paramName : me.filterRequestStatusDescription,
				paramValue1 : requestStatusFilterVal,
				operatorValue : 'statusFilterOp',
				makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S',
				paramFieldLable : getLabel('status', 'Status'),
				displayType : 5,
				displayValue1 : requestStatusFilterDiscArray
					});
		}
		
		return jsonArray;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		// set Mandate Party Name Filter Value
		var mandateNameFltId = clientSetupFilterView
				.down('combobox[itemId=mandateNameFltId]');
		mandateNameFltId.setValue(mandateName);

		var mandateDebtorRefFltId = clientSetupFilterView
				.down('combobox[itemId=mandateDebtorRefFltId]');
		mandateDebtorRefFltId.setValue(accountNmbr);
		
		var payerNameFltId = clientSetupFilterView
				.down('combobox[itemId=payerNameFltId]');
		payerNameFltId.setValue(payerName);
		me.changeFilterParams();
	   }

	},
	changeFilterParams : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var mandateNameFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=mandateNameFltId]');
		var accNoFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=mandateDebtorRefFltId]');
				
		var mandateStatusDescription = clientSetupFilterView
				.down('combo[itemId=mandateStatusDescriptionFltId]');
		var requestStatusDescription = clientSetupFilterView
		.down('combo[itemId=requestStatusFilter]');
		var payerNameFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=payerNameFltId]');
		if (!Ext.isEmpty(mandateNameFltAuto)) {
			mandateNameFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(accNoFltAuto)) {
			accNoFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(payerNameFltAuto)) {
			payerNameFltAuto.cfgExtraParams = new Array();
		}
			if (!Ext.isEmpty(mandateNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				mandateNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(accNoFltAuto)  && !Ext.isEmpty(strSellerId)) {
				accNoFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(payerNameFltAuto) && !Ext.isEmpty(strSellerId)) {
				payerNameFltAuto.cfgExtraParams.push({
							key : '$sellerId',
							value : strSellerId
						});
			}
			if (!Ext.isEmpty(mandateNameFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				mandateNameFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
			if (!Ext.isEmpty(accNoFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
				accNoFltAuto.cfgExtraParams.push({
							key : '$clientId',
							value : me.clientCode
						});
			}
	},
	applyFilter : function() {
	    var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
		}
		//grid.removeAppliedSort();
		objGroupView.refreshData();
	},
	handleClearSettings:function(){
		var me=this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
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
			var mandateNameFltId = clientSetupFilterView
					.down('combobox[itemId=mandateNameFltId]');
		
			var mandateDebtorRefFltId = clientSetupFilterView
					.down('combobox[itemId=mandateDebtorRefFltId]');
					
			var mandateStatusDescriptionFltId = clientSetupFilterView
					.down('combo[itemId=mandateStatusDescriptionFltId]');
			me.statusFilterVal = null;
			me.statusFilterDesc = null;
			mandateStatusDescriptionFltId.selectAllValues();
			
			var requestStatusFilter = clientSetupFilterView
			.down('combo[itemId=requestStatusFilter]');
			me.requestStatusFilterVal = null;
			me.requestStatusFilterDesc = null;
			requestStatusFilter.selectAllValues();
			
			var payerNameFltId = clientSetupFilterView
					.down('combobox[itemId=payerNameFltId]');
		
			mandateNameFltId.setValue("");
			mandateDebtorRefFltId.setValue("");
			payerNameFltId.setValue("");
			//mandateStatusDescriptionFltId.reset();
			me.filterData=[];
			me.refreshData();
		}
	},	
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objMandateMstPref ) )
				{
					var objJsonData = Ext.decode( objMandateMstPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						mandateName = data.quickFilter.mandateNameVal;
						accountNmbr=data.quickFilter.mandateDebtorRefVal;
						mandateStatusDescription=data.quickFilter.mandateDebtorRefValVal;
						payerName = data.quickFilter.payerNameVal;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientCode = data.filterSelectedClientCode;
							me.clientDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}

				if (!Ext.isEmpty(mandateName)) {
					arrJsn.push({
								paramName : me.filterMandateName,
								paramValue1 : encodeURIComponent(mandateName.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(accountNmbr)) {
					arrJsn.push({
								paramName : me.filterAccountNo,
								paramValue1 : encodeURIComponent(accountNmbr.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(mandateStatusDescription)) {
					arrJsn.push({
								paramName : me.filterMandateStatusDescription,
								paramValue1 : encodeURIComponent(mandateStatusDescription.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(me.clientDesc)&&!Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
					clientParamName = 'clientId';
					clientNameOperator = 'eq';
					if (!Ext.isEmpty(me.clientCode)) {
						clientCodeVal = me.clientCode;
					} else {
						clientCodeVal = strClientId;
					}
		
					if (!Ext.isEmpty(clientCodeVal)) {
						arrJsn.push({
									paramName : clientParamName,
									paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : clientNameOperator,
									dataType : 'S'
								});
					}
				}
				if (!Ext.isEmpty(payerName)) {
					arrJsn.push({
								paramName : me.filterPayerName,
								paramValue1 : encodeURIComponent(payerName.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (userType == '1') {
					$("#summaryClientFilterSpan").text(me.clientDesc);
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
				}else if(userType=='0'){
					$("#summaryClientFilter").val(me.clientDesc);
					changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
				}
				me.filterData = arrJsn;
	},
	handleSavePreferences : function()
	{
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
					}
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);		
	},
	postHandleSavePreferences : function(data, args, isSuccess) {},
	getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				  if(groupView){
					grid=groupView.getGrid()
					var gridState=grid.getGridState();				
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					
							
						arrPref.push({
							"module" : "groupByPref",
							"jsonPreferences" : {
								groupCode : groupInfo.groupTypeCode,
								subGroupCode : subGroupInfo.groupCode
							}
						});
					arrPref.push({
							"module" : subGroupInfo.groupCode,
							"jsonPreferences" : {
								'gridCols' : gridState.columns,
								'pgSize' : gridState.pageSize,
								'sortState' : gridState.sortState,
								'gridSetting' : groupView.getGroupViewState().gridSetting
							}
						});
				
				}
				objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
				return arrPref;
	},
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
			me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;						
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		var objQuickFilterPref = {};
		var mandateNameVal = null, mandateDebtorRefVal = null,payerNameVal = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		
		if(Ext.isEmpty(clientSetupFilterView)){
			mandateNameVal=mandateName;
			mandateDebtorRefVal=accountNmbr;
			payerNameVal=payerName;
		}else{
			var mandateNameFltId = clientSetupFilterView
					.down('combobox[itemId=mandateNameFltId]');
			var mandateDebtorRefFltId = clientSetupFilterView.down('combobox[itemId=mandateDebtorRefFltId]');
			var payerNameFltId = clientSetupFilterView
					.down('combobox[itemId=payerNameFltId]');
		}
		if (!Ext.isEmpty(mandateNameFltId)
					&& !Ext.isEmpty(mandateNameFltId.getValue())) {
				mandateName = mandateNameFltId.getValue(), mandateNameVal = mandateName
						.trim();
		}
		if (!Ext.isEmpty(mandateDebtorRefFltId)
				&& !Ext.isEmpty(mandateDebtorRefFltId.getValue())) {
			mandateDebtorRef = mandateDebtorRefFltId.getValue();
			mandateDebtorRefVal = mandateDebtorRef.trim();
		}
		if (!Ext.isEmpty(payerNameFltId)
					&& !Ext.isEmpty(payerNameFltId.getValue())) {
				payerName = payerNameFltId.getValue(), payerNameVal = payerName
						.trim();
		}
		objQuickFilterPref.mandateNameVal =mandateNameVal;
		objQuickFilterPref.mandateDebtorRefVal=mandateDebtorRefVal;
		objQuickFilterPref.payerNameVal =payerNameVal;
		objFilterPref.filterSelectedClientCode = me.clientCode;
		objFilterPref.filterSelectedClientDesc = me.clientDesc;
		objFilterPref.quickFilter = objQuickFilterPref;
		return objFilterPref;
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			{
				$("#"+btnId).css("color",'grey');			
				$("#"+btnId).css('cursor','default').removeAttr('href');
				$("#"+btnId).css('pointer-events','none');
			}
		else
			{
				$("#"+btnId).css("color",'#FFF');
				$("#"+btnId).css('cursor','pointer').attr('href','#');
				$("#"+btnId).css('pointer-events','all');				
			}
	},
	/*Preference Handling:end*/
	
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	
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
				var groupView = me.getGroupView(), 
				subGroupInfo = groupView.getSubGroupInfo() || {},
				objPref = {}, 
				groupInfo = groupView.getGroupInfo() || '{}';
				var strModule ='';
				if (groupInfo && groupInfo.groupTypeCode) {
					if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
						strModule = subGroupInfo.groupCode;
					} else {
						strModule = groupInfo.groupTypeCode
					}
				}
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
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
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView(), 
			subGroupInfo = groupView.getSubGroupInfo() || {}, 
			objPref = {}, 
			groupInfo = groupView.getGroupInfo() || '{}',
			strModule = '', 
			args = {};
			if (groupInfo && groupInfo.groupTypeCode) {
				if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
					strModule = subGroupInfo.groupCode;
				} else {
					strModule = groupInfo.groupTypeCode
				}
			}
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			Ext.each(arrPref || [], function(pref) {
				if (pref.module === 'ColumnSetting') {
					pref.module = strModule;
					return false;
				}
			});
			args['strInvokedFrom'] = strInvokedFrom;
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else {
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
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
				window.location.reload();
//				objGroupView.reconfigureGrid(gridModel);
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

		if (!Ext.isEmpty(objMandateMstPref)) {
			objPrefData = Ext.decode(objMandateMstPref);
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
					: (USER_CATEGORY_GENERIC_COLUMN_MODEL || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objGroupView.cfgShowAdvancedFilterLink= false;
		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = '';//'services/userfilterslist/' +me.strPageName;
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
					cfgGridHeight : 240,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/*Page setting handling ends here*/
	/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
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
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	},
	applyPreferences : function(){
		var me = this, objLocalJsonData='';
		if ( objSaveLocalStoragePref) {
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
									for(var i=0;i<quickPref.length;i++){
										if(quickPref[i].paramName == "clientId"){
											me.clientCode = quickPref[i].paramValue1;
											me.clientDesc = quickPref[i].displayValue1
										}
										else if(quickPref[i].paramName == "mandateName"){
											mandateName = quickPref[i].paramValue1;
											
										}
										else if(quickPref[i].paramName == "mandateDebtorRef"){
											accountNmbr = quickPref[i].paramValue1;
											
										}
										else if(quickPref[i].paramName == "mandateStatus"){
											me.statusFilterVal = quickPref[i].paramValue1;
											me.statusFilterDesc = quickPref[i].displayValue1;
										}
										else if(quickPref[i].paramName == "requestStatus"){
											me.requestStatusFilterVal = quickPref[i].paramValue1;
											me.requestStatusFilterDesc = quickPref[i].displayValue1;
										}
										else if(quickPref[i].paramName == "displPayerName"){
											payerName = decodeURIComponent(quickPref[i].paramValue1);
											
										}
										else if(quickPref[i].paramName == "seller"){
											strSellerId = quickPref[i].paramValue1;
											strSellerDesc = quickPref[i].displayValue1;
										}										
									}
								}
						}
					}
		}
	
});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}
