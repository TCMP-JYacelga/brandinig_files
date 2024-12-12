Ext
		.define(
				'GCP.controller.AccountConfigurationController',
				{
					extend : 'Ext.app.Controller',
					requires : ['GCP.view.AccountConfigurationFilterView', 'GCP.view.AccountConfigurationGridView'],
					views : [ 'GCP.view.AccountConfigurationView', 'GCP.view.AccountConfigurationFilterView', 'GCP.view.AccountConfigurationGridView',
							'GCP.view.CopyByAccountPopupView', 'GCP.view.HistoryPopup',  'Ext.util.Point' ],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'clientSetupView',
								selector : 'clientSetupView'
							},
							{
								ref : 'filterView',
								selector : 'filterView'
							},
							{
								ref : 'accountConfigurationFilterView',
								selector : 'accountConfigurationFilterView'
							},
							{
								ref : 'specificFilterPanel',
								selector : 'accountConfigurationFilterView panel[itemId="specificFilter"]'
							},
							{
								ref : 'clientSetupGridView',
								selector : 'clientSetupView clientSetupGridView'
							},
							{
								ref : 'clientSetupDtlView',
								selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]'
							},
							{
								ref : 'gridHeader',
								selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
							},
							{
								ref : 'groupView',
								selector : 'clientSetupView clientSetupGridView groupView'
							},
							{
								ref : 'searchTextInput',
								selector : 'clientSetupGridView textfield[itemId="searchTextField"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'clientSetupGridView radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'grid',
								selector : 'clientSetupGridView smartgrid'
							},
							{
								ref : 'groupActionBar',
								selector : 'clientSetupView clientSetupGridView clientGroupActionBarView'
							},
							{
								ref : 'clientListLink',
								selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
							},
							{
								ref : 'accNmbrContainer',
								selector : 'accountConfigurationFilterView container[itemId="accNmbrContainer"]'
							},
							{
								ref : 'accNameContainer',
								selector : 'accountConfigurationFilterView container[itemId="accNameContainer"]'
							},
							{
								ref : 'clientNamesFltIdAuto',
								selector : 'accountConfigurationFilterView AutoCompleter[itemId="clientNamesFltId"]'
							},
							{
								ref : 'accNmbrFltIdAuto',
								selector : 'accountConfigurationFilterView AutoCompleter[itemId="accNmbrFltId"]'
							},
							{
								ref : 'accNickNmFltIdAuto',
								selector : 'accountConfigurationFilterView AutoCompleter[itemId="accNickNmFltId"]'
							}, 
							{
								ref : 'btnSavePreferences',
								selector : ' accountConfigurationFilterView button[itemId="btnSavePreferencesItemId"]'
							},
							{
								ref : 'btnClearPreferences',
								selector : ' accountConfigurationFilterView button[itemId="btnClearPreferences"]'
							}],
					config : {
						filterData : [],
						showClientFlag : false,
						clientCode : '',
						clientDesc : '',
						sellerFilterVal : null,
						filterApplied : 'ALL',
						strGetModulePrefUrl : 'services/userpreferences/accountConfigurations/{0}.json',
						filterAccntNumber : '',
						filterAccNickName : '',
						clientNameField : '',
						selectedFilterClientDesc: '',
						strPageName : 'accountConfigurations',
						isAccNmbr : false,
						isAccNickNm : false,
						reportOrderByURL : null,
						oldAccNmbr : '',
						oldAccNickNm : ''
					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.sellerFilterVal = strSellerId;
						
						me.clientCode =$("#summaryClientFilterSpan").val();
						me.clientDesc = $("#summaryClientFilterSpan").text();
						me.selectedFilterClientDesc = $("#summaryClientFilter").val();
						
						GCP.getApplication().on({

						});
						
						$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
							me.handleClientChangeInQuickFilter(isSessionClientFilter);
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);	
						});
						
						$(document).on('savePreference', function(event) {		
							me.handleSavePreferences();
						});
						
						$(document).on('performReportAction', function(event, actionName) {
							me.downloadReport(actionName);
						});
						
						$(document).on('performPageSettings', function(event){
							me.showPageSettingPopup();
						});
						
						$(document).on('clearPreference', function(event) {
							me.handleClearPreferences();
						});		
						me.updateFilterConfig();
						me.updateConfig();
						me.control({
							'pageSettingPopUp' : {
								'applyPageSetting' : function(popup, data) {
									me.applyPageSetting(data);
								},
								'savePageSetting' : function(popup, data, strInvokedFrom) {
									me.savePageSetting(data, strInvokedFrom);
								},
								'restorePageSetting' : function(popup) {
									me.restorePageSetting();
								}
							},
									'filterView' : {
										beforerender : function() {
											var useSettingsButton = me.getFilterView()
													.down('button[itemId="useSettingsbutton"]');
											var advFilter = me.getFilterView().down('label[itemId="createAdvanceFilterLabel"]');
											if (!Ext.isEmpty(useSettingsButton)) {
												useSettingsButton.hide();
											}
											if (!Ext.isEmpty(advFilter)) {
												advFilter.hide();
											}
										},
										
										appliedFilterDelete : function(btn) {
											me.handleAppliedFilterDelete(btn);
										}
									},
									'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();
										}
									},
									'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
										click : function() {
											me.filterData = [];
											me.showClientList();
//											me.handleSpecificFilter();
											me.handleGridHeader();
										}
									},
									'clientSetupGridView groupView' : {
										'groupTabChange' : function(groupInfo, subGroupInfo,
												tabPanel, newCard, oldCard) {
											me.toggleFirstRequest(false);		
											me.doHandleGroupTabChange(groupInfo, subGroupInfo,
													tabPanel, newCard, oldCard);

										},
										'gridPageChange' : me.handleLoadGridData,
										'gridSortChange' : me.handleLoadGridData,
										'gridRender' : me.handleLoadGridData,
										'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
										'gridStateChange' : function(grid) {
											me.disablePreferencesButton("savePrefMenuBtn", false);
											me.disablePreferencesButton("clearPrefMenuBtn", false);
										},
										'gridRowActionClick' : function(grid, rowIndex, columnIndex,
												actionName, record) {
											me.doHandleRowIconClick(actionName, grid, record);
										},
										'groupActionClick' : function(actionName, isGroupAction,
												maskPosition, grid, arrSelectedRecords) {
											if (isGroupAction === true)
												me.handleGroupActions(actionName, grid,
														arrSelectedRecords, 'groupAction');
										},
										'gridPageSizeChange': me.handleLoadGridData,
										afterrender : function() {
											if (objAccountConfigurationPref) {
												me.toggleSavePrefrenceAction(false);
												me.toggleClearPrefrenceAction(true);
											}
										}
									},
									'clientSetupGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									},
									
									'accountConfigurationFilterView AutoCompleter[itemId="accNmbrFltId"]' : {
										select : function(combo, record, index) {
											me.applyQuickFilter();
											me.isAccNmbr = true;
										},
										change : function(combo, newValue,
												oldValue, eOpts) {
											me.oldAccNmbr = oldValue;
											if (newValue == ''
													|| null == newValue) {
												me.applyQuickFilter();
												me.isAccNmbr = true;
												me.oldAccNmbr = "";
											}
										},
										keyup : function(combo, e, eOpts){
											me.isAccNmbr = false;
										},
										blur : function(combo, record){
											if (me.isAccNmbr == false && me.oldAccNmbr != combo.getRawValue()){
												me.applySeekFilter();
												me.disablePreferencesButton("savePrefMenuBtn",false);
												me.disablePreferencesButton("clearPrefMenuBtn",false);	
											}
											me.oldAccNmbr = combo.getRawValue();
										}
									},
									'accountConfigurationFilterView AutoCompleter[itemId="accNickNmFltId"]' : {
										select : function(combo, record, index) {
											me.applyQuickFilter();
											me.isAccNickNm = true;
										},
										change : function(combo, newValue,
												oldValue, eOpts) {
											me.oldAccNickNm = oldValue;
											if (newValue == ''
													|| null == newValue) {
												me.applyQuickFilter();
												me.isAccNickNm = true;
												me.oldAccNickNm = "";
											}
										},
										keyup : function(combo, e, eOpts){
											me.isAccNickNm = false;
										},
										blur : function(combo, record){
											if (me.isAccNickNm == false && me.oldAccNickNm != combo.getRawValue()){
												me.applySeekFilter();
												me.disablePreferencesButton("savePrefMenuBtn",false);
												me.disablePreferencesButton("clearPrefMenuBtn",false);	
											}
											me.oldAccNickNm = combo.getRawValue();
										}
									},
									'accountConfigurationFilterView' : {
										'handleClientChange' : function(client,
												clientDesc) {
											if (client === 'all') {
												me.clientCode = '';
												me.clientDesc = '';
											} else {
												me.clientCode = client;
												me.clientDesc = clientDesc;
											}
											var accountNameFilterView = me.getAccountConfigurationFilterView();
											me.filterAccntNumber = accountNameFilterView.down('combobox[itemId=accNmbrFltId]').getValue();
											me.filterAccNickName = accountNameFilterView.down('combobox[itemId=accNickNmFltId]').getValue();
											me.applySeekFilter();
										},
										render : function(panel, opts) {
											me.setInfoTooltip();
										},
										afterrender : function(view) {
											me.updateFilterFields();
										}
									},
									'filterView button[itemId="clearSettingsButton"]' : {
										'click' : function() {
											me.resetAllFilters();
										}
									}
								});
					},
					resetAllFilters : function() {
						var me = this;
						if (!Ext.isEmpty($("#summaryClientFilter").val())) {
							$("#summaryClientFilter").val('');
							handleResetSummaryClientFilter();
						}
						if (!Ext.isEmpty(me.getAccNmbrFltIdAuto())) {
							me.getAccNmbrFltIdAuto().setValue('');
						}
						if (!Ext.isEmpty(me.getAccNickNmFltIdAuto())) {
							me.getAccNickNmFltIdAuto().setValue('');
						}
						
						if(entityType === "1") {
							if(getClientData().length > 1) {
								var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
								clientCombo.setValue(clientCombo.getStore().getAt(0));
								changeClientAndRefreshGrid('all',getLabel('allCompanies', 'All Companies'));
							}
						} else {
							me.resetClientAutocompleter();
						}
						
						me.setDataForFilter();
						me.refreshData();
					},
					applySeekFilter : function() {
						var me = this;
						var accountNameFilterView = me.getAccountConfigurationFilterView();
						me.filterAccntNumber = accountNameFilterView.down('combobox[itemId=accNmbrFltId]').getValue();
						me.filterAccNickName = accountNameFilterView.down('combobox[itemId=accNickNmFltId]').getValue();
						me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
					},
					applyFilterData : function() {
						var me = this;
						me.getGroupView().refreshData();
					},
					changeFilterParams : function() {
						var me = this;
						var accountConfigurationFilterView = me
								.getAccountConfigurationFilterView();
						var clientCodesFltId = accountConfigurationFilterView
								.down('AutoCompleter[itemId=clientCodeId]');
						if (!Ext.isEmpty(me.getAccNmbrFltIdAuto())) {
							me.getAccNmbrFltIdAuto().cfgExtraParams = new Array();
						}
						if (!Ext.isEmpty(me.getAccNickNmFltIdAuto())) {
							me.getAccNickNmFltIdAuto().cfgExtraParams = new Array();
						}
						if (entityType == 0 && !Ext.isEmpty(clientCodesFltId)) {
							clientCodesFltId.cfgExtraParams = new Array();
						}
						if (entityType == 0) {
							if (!Ext.isEmpty(clientCodesFltId)) {
								clientCodesFltId.cfgExtraParams.push({
									key : '$sellerCode',
									value : me.sellerFilterVal
								});
							}
							if (!Ext.isEmpty(me.getAccNmbrFltIdAuto())) {
								me.getAccNmbrFltIdAuto().cfgExtraParams.push({
									key : '$sellerCode',
									value : me.sellerFilterVal
								});
							}
							if (!Ext.isEmpty(me.getAccNickNmFltIdAuto())) {
								me.getAccNickNmFltIdAuto().cfgExtraParams
										.push({
											key : '$sellerCode',
											value : me.sellerFilterVal
										});
							}
						}
						if (!Ext.isEmpty(clientCodesFltId)
								&& me.clientCode != 'all'
								&& me.clientCode != null) {
							if (!Ext.isEmpty(me.getAccNickNmFltIdAuto())) {
								me.getAccNickNmFltIdAuto().cfgExtraParams
										.push({
											key : '$clientId',
											value : me.clientCode
										});
							}
							if (!Ext.isEmpty(me.getAccNmbrFltIdAuto())
									&& me.clientCode != 'all'
									&& me.clientCode != null) {
								me.getAccNmbrFltIdAuto().cfgExtraParams.push({
									key : '$clientId',
									value : me.clientCode
								});
							}
						}
					},
					applyQuickFilter : function() {
						var me = this;
						var accountNameFilterView = me.getAccountConfigurationFilterView();
						me.filterAccntNumber = accountNameFilterView.down('combobox[itemId=accNmbrFltId]').getValue();
						me.filterAccNickName = accountNameFilterView.down('combobox[itemId=accNickNmFltId]').getValue();
						this.setDataForFilter();
						this.applyFilter();
					},
					setFilterRetainedValues : function() {
						var me = this;
						var filterView = me
								.getAccountConfigurationFilterView();
						
						// set Account No Filter Value
						var accountNoFltId = filterView
								.down('combobox[itemId=accNmbrFltId]');
						accountNoFltId.setValue(filterAccountNmbr);

						// Set Client Name Filter Value
						var clientCodesFltId = null;
						if (entityType == '0') {
							clientCodesFltId = filterView
									.down('AutoCompleter[itemId=clientCodeId]');
							if (undefined != strClientDesc
									&& strClientDesc != '') {
								clientCodesFltId.store.loadRawData({
									"d" : {
										"preferences" : [ {
											"CODE" : strClientId,
											"DESCR" : strClientDesc
										} ]
									}
								});

								clientCodesFltId.suspendEvents();
								clientCodesFltId.setValue(strClientId);
								clientCodesFltId.resumeEvents();
								me.clientCode = strClientId;
							} else {
								me.clientCode = 'all';
							}

						} else {
							clientCodesFltId = filterView
									.down('button[itemId="clientBtn"]');
							if (undefined != strClientDesc
									&& strClientDesc != '') {
								clientCodesFltId.setText(strClientDesc);
								me.clientCode = strClientId;
							} else {
								clientCodesFltId.setText(getLabel(
										'allCompanies', 'All Companies'));
								me.clientCode = 'all';
							}
						}
						me.changeFilterParams();
					},

					// method to handle client list and branding pkg list link
					// click
					handleGridHeader : function() {
						var me = this;
						var gridHeaderPanel = me.getGridHeader();
						var createNewPanel = me.getCreateNewToolBar();
						if (!Ext.isEmpty(gridHeaderPanel)) {
							gridHeaderPanel.removeAll();
						}
						if (!Ext.isEmpty(createNewPanel)) {
							createNewPanel.removeAll();
						}
					},
					
					handleAppliedFilterDelete : function(btn) {
						var me = this;
						var objData = btn.data;
						if(!Ext.isEmpty(objData)) {
							me.resetFieldOnDelete(objData);
						}
					},
					
					resetFieldOnDelete : function(objData) {
						var me = this,strFieldName;
						if(!Ext.isEmpty(objData))
							strFieldName = objData.paramName || objData.field;
						if(strFieldName === "accNmbr") {
							var appliedFilterId = me.getAccountConfigurationFilterView().down('AutoCompleter[itemId=accNmbrFltId]');
							appliedFilterId.setValue("");
						} else if(strFieldName === "accNickName") {
							var appliedFilterId = me.getAccountConfigurationFilterView().down('AutoCompleter[itemId=accNickNmFltId]');
							appliedFilterId.setValue("");
						} else if(strFieldName === "clientCode") {
							if(entityType === "1") {
								if(getClientData().length > 1) {
									var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
									clientCombo.setValue(clientCombo.getStore().getAt(0));
									changeClientAndRefreshGrid('all',getLabel('allCompanies', 'All Companies'));
								}
							} else {
								me.resetClientAutocompleter();
							}
						}
					},
					
					showClientList : function(btn, opts) {
						var me = this;
						me.handleSmartGridConfig();
					},
					handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter) {
						var me = this;
						me.setDataForFilter();
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
						me.reportOrderByURL = strUrl;
						grid.loadGridData(strUrl, null, null, false);
						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if(Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							me.handleGridRowClick(record, grid, columnType);
						});
						
						me.updateFilterInfo();
						
					},
					getFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this;
						var strQuickFilterUrl = '';
						var strMasterFilterUrl = '';
						var strUrl = '';
						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
						var isFilterApplied = false;
						if (me.filterApplied === 'ALL' || me.filterApplied === 'Q') {
							strQuickFilterUrl = me.generateUrlWithFilterParams(me);
							if (!Ext.isEmpty(strQuickFilterUrl)) {
								strUrl += '&$filter=' + strQuickFilterUrl;
								isFilterApplied = true;
							}
						}
						if (!Ext.isEmpty(strGroupQuery)) {
							if (isFilterApplied)
								strUrl += ' and ' + strGroupQuery;
							else
								strUrl += '&$filter=' + strGroupQuery;
						}

						return strUrl;
					},
					generateUrlForMaster : function() {
						var me = this;
						var strUrl = '';
						return strUrl;
					},
					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var strFilter = '';
						var strTemp = '';
						var strFilterParam = '';
						var isFilterApplied = false;
						for ( var index = 0; index < filterData.length; index++) {

							if (isFilterApplied){
								strTemp = strTemp + ' and ';
							}
							var decodeParam1 = decodeURIComponent(filterData[index].paramValue1);
							var decodeParam2 = decodeURIComponent(filterData[index].paramValue2);
							switch (filterData[index].operatorValue) {
							case 'bt':
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ decodeParam1
											+ '\'' + ' and ' + 'date\''
											+ decodeParam2
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ decodeParam1
											+ '\'' + ' and ' + '\''
											+ decodeParam2
											+ '\'';
								}
								break;
							default:
								// Default opertator is eq
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ decodeParam1
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ decodeParam1
											+ '\'';
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

					setDataForFilter : function() {
						var me = this;
//						me.getSearchTextInput().setValue('');
						this.filterData = this.getFilterQueryJson();
					},
					getFilterQueryJson : function() {
						var me = this;
						var sellerVal = null, clientParamName = null, accountNoVal = null, clientNameOperator = null, clientCodeVal = null, accountNickNmVal = null, jsonArray = [];
						var clientNamesFltId = null;
						if (!Ext.isEmpty(me.filterAccntNumber)) {
							jsonArray.push({
								paramName : "accNmbr",
								paramValue1 : encodeURIComponent(me.filterAccntNumber.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable : getLabel('accountNmbr', 'Account'),
								displayType : 5,
								displayValue1 : me.filterAccntNumber
							});
						}


						if (!Ext.isEmpty(me.filterAccNickName)) {
							jsonArray.push({
								paramName : "accNickName",
								paramValue1 : encodeURIComponent(me.filterAccNickName.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable : getLabel('accountNickNm', 'Account Nickname'),
								displayType : 5,
								displayValue1 : me.filterAccNickName
							});
						}
						if (!Ext.isEmpty(me.clientDesc)
								&& !Ext.isEmpty(me.clientCode)
								&& me.clientCode != 'all') {
							clientParamName = 'clientCode';
							clientNameOperator = 'eq';
							if (!Ext.isEmpty(me.clientCode)) {
								clientCodeVal = me.clientCode;
							} else {
								clientCodeVal = me.clientCode;
							}

							if (!Ext.isEmpty(clientCodeVal)) {
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
						}
						return jsonArray;
					},
					refreshData : function() {
						var me = this;
						var objGroupView = me.getGroupView();
						var grid = objGroupView.getGrid();
						if (grid) {
							/*if (!Ext.isEmpty(me.advSortByData)) {
								appliedSortByJson = me.getSortByJsonForSmartGrid();
								grid.removeAppliedSort();
								grid.applySort(appliedSortByJson);
							} else {
								grid.removeAppliedSort();
							}*/
						}
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
							var strUrl = grid.generateUrl(strDataUrl,
									grid.pageSize, 1, 1, store.sorters);
							strUrl = strUrl + me.getFilterUrl();
							var groupView = me.getGroupView();
							var groupInfo = groupView.getGroupInfo() || '{}';
							var subGroupInfo = groupView.getSubGroupInfo() || {};

							strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
							me.getGrid().setLoading(true);
							grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null, false);
						}
						me.updateFilterInfo();
					},
					
					updateFilterInfo : function() {
						me=this;
						var arrInfo = generateFilterArray(me.filterData);
						
						if(entityType === "1") {
							if(getClientData().length === 1) {
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
					
					handleSmartGridConfig : function() {
						var me = this;
						var clientGrid = me.getgroupView();
						var objConfigMap = me.getClientSetupConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(clientGrid))
							clientGrid.destroy(true);

						arrCols = me.getColumns(objConfigMap.arrColsPref,
								objConfigMap.objWidthMap);
						/*
						 * if (!Ext.isEmpty(clientGrid)) { var store =
						 * clientGrid.createGridStore(objConfigMap.storeModel);
						 * var columns = clientGrid.createColumns(arrCols);
						 * clientGrid.reconfigure(store, columns);
						 * clientGrid.down('pagingtoolbar').bindStore(store);
						 * clientGrid.refreshData(); } else {
						 */
//						me.handleSmartGridLoading(arrCols,
//								objConfigMap.storeModel);

					},
					
					handleGridRowClick : function(record, grid,columnType) {
						if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
								me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
							}
						}
					},

					doHandleRowIconClick : function(actionName, grid, record) {
						var me = this;
						var actionName = actionName;
						if (actionName === 'submit' || actionName === 'accept'
								|| actionName === 'enable'
								|| actionName === 'disable'
								|| actionName === 'reject'
								|| actionName === 'discard')
							me.handleGroupActions(actionName, grid, [record], 'rowAction');
						else if (actionName === 'btnHistory') {
							var recHistory = record.get('history');

							if (!Ext.isEmpty(recHistory)
									&& !Ext.isEmpty(recHistory.__deferred.uri)) {
								me.showHistory(record.get('acmAccountDesc'),
										record.get('history').__deferred.uri,
										record.get('identifier'));
							}
						} else if (actionName === 'btnView') {
							me.submitForm('viewClientAccount.form', record);
						} else if (actionName === 'btnEdit') {
							me.submitForm('editClientAccount.form', record);
						}
					},
					
					submitForm : function(strUrl, record) {
						var me = this;
						var viewState = record.data.identifier;
						var form, inputField;

						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'viewState', viewState));

						form.action = strUrl;
//						me.setFilterParameters(form);
						document.body.appendChild(form);
						form.submit();
					},

					/* Function sets the filter Panel element values in JSON */
					setFilterParameters : function(form) {
						var me = this;
						var accountNoVal = null, accountNickName = null;
						var matrixNameVal = null;
						var arrJsn = {};
						var filterView = me.getAccountConfigurationFilterView();
						var accountNoFltId = filterView
								.down('combobox[itemId=accNmbrFltId]');
						var selectedSeller = (!Ext.isEmpty(me.sellerFilterVal)) ? me.sellerFilterVal
								: strSellerId;
						var selectedClient = me.clientCode;
						var accountNickNmFltId = filterView
								.down('combobox[itemId=accNickNmFltId]');
						if (!Ext.isEmpty(accountNoFltId)
								&& !Ext.isEmpty(accountNoFltId.getValue())) {
							accountNoVal = accountNoFltId.getValue();
						}
						if (!Ext.isEmpty(accountNickNmFltId)
								&& !Ext.isEmpty(accountNickNmFltId.getValue())) {
							accountNickName = accountNickNmFltId.getValue();
						}
						arrJsn['sellerId'] = selectedSeller;
						arrJsn['clientId'] = selectedClient;
						arrJsn['clientDesc'] = me.clientDesc;
						arrJsn['accountNmbr'] = accountNoVal;
						arrJsn['accountNickName'] = accountNickName;
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'filterData', Ext.encode(arrJsn)));
						console.log(arrJsn);
					},

					showHistory : function(acmAccountDesc, url, id) {
						Ext.create('GCP.view.HistoryPopup', {
							historyUrl : url,
							accountDesc : acmAccountDesc,
							identifier : id
						}).show();
						Ext.getCmp('btnAccountConfigHistoryPopupClose').focus(); 
					},

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
						var viscols;
						var col = null;
						var visColsStr = "";
						var colMap = new Object();
						var colArray = new Array();

						strExtension = arrExtension[actionName];
						strUrl = 'services/getAccountConfigurationReport.' + strExtension;
						strUrl += '?$skip=1';
						var objGroupView = me.getGroupView();
						var groupInfo = null, subGroupInfo = null;
						groupInfo = objGroupView.getGroupInfo() || '{}';
						subGroupInfo = objGroupView.getSubGroupInfo() || {};
						var strQuickFilterUrl = me.getFilterUrl(subGroupInfo,groupInfo);
						strUrl += strQuickFilterUrl;

						var strOrderBy = me.reportOrderByURL;
						if (!Ext.isEmpty(strOrderBy)) {
							var orderIndex = strOrderBy.indexOf('orderby');
							if (orderIndex > 0) {
								strOrderBy = strOrderBy
										.substring(orderIndex, strOrderBy.length);
								var indexOfamp = strOrderBy.indexOf('&$');
								if (indexOfamp > 0)
									strOrderBy = strOrderBy.substring(0, indexOfamp);
								strUrl += '&$' + strOrderBy;
							}
						}

						var grid = objGroupView.getGrid();
						viscols = grid.getAllVisibleColumns();
						for (var j = 0; j < viscols.length; j++) {
							col = viscols[j];
							if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
								if (colMap[arrSortColumnReport[col.dataIndex]]) {
									// ; do nothing
								} else {
									colMap[arrSortColumnReport[col.dataIndex]] = 1;
									colArray.push(arrSortColumnReport[col.dataIndex]);

								}
							}

						}
						if (colMap != null) {

							visColsStr = visColsStr + colArray.toString();
							strSelect = '&$select=[' + colArray.toString() + ']';
						}

						strUrl = strUrl + strSelect;

						var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
						while (arrMatches = strRegex.exec(strUrl)) {
							objParam[arrMatches[1]] = arrMatches[2];
						}
						var count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
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
								arrSelectedrecordsId
										.push(objOfSelectedGridRecord[i].data.identifier);
							}
						}
						strUrl = strUrl.substring(0, strUrl.indexOf('?'));
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';

						Object.keys(objParam).map(function(key) {
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', key,
									objParam[key]));
						});

						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
								currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
								withHeaderFlag));
						for (var i = 0; i < arrSelectedrecordsId.length; i++) {
							form.appendChild(me.createFormField('INPUT', 'HIDDEN',
									'identifierGrid', arrSelectedrecordsId[i]));
						}
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},
	
					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						arrCols.push(me.createGroupActionColumn());
						arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = !Ext
										.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
										: 120;

								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},

					handleRowMoreMenuClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
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
						if (!Ext.isEmpty(menu.items)
								&& !Ext.isEmpty(menu.items.items))
							arrMenuItems = menu.items.items;
						if (!Ext.isEmpty(arrMenuItems)) {
							for ( var a = 0; a < arrMenuItems.length; a++) {
								/*
								 * blnRetValue = me.isRowIconVisible(store,
								 * record, jsonData, null,
								 * arrMenuItems[a].maskPosition);
								 */
								// arrMenuItems[a].setVisible(blnRetValue);
							}
						}
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},

					
					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData) {
						var me = this;
						var buttonMask = '0000000000';
						var maskArray = new Array(), actionMask = '', objData = null;
						;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
						}
						var isSameUser = true;
						var isDisabled = false;
						var isSubmit = false;
						maskArray.push(buttonMask);
						for ( var index = 0; index < selectedRecords.length; index++) {
							objData = selectedRecords[index];
							var recKey = objData.raw.recordKeyNo;
							maskArray
									.push(objData.get('__metadata').__rightsMap);
							if (objData.raw.makerId === USER
									|| (recKey == undefined)) {
								isSameUser = false;
							}
							if (objData.raw.validFlag != 'Y'
									&& (recKey != undefined)) {
								isDisabled = true;
							}
							if (objData.raw.requestState == 0
									|| objData.raw.requestState == 1) {
								isSubmit = true;
							}
						}
						actionMask = doAndOperation(maskArray, 10);
						me.enableDisableGroupActions(actionMask, isSameUser,
								isDisabled, isSubmit, objData);
					},
					
					doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
							objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
									var me = this;
									var objGroupView = me.getGroupView();
									var buttonMask = me.strDefaultMask;
									var blnAuthInstLevel = false;
									var maskArray = new Array(), actionMask = '', objData = null;;

									if (!Ext.isEmpty(jsonData)
											&& !Ext.isEmpty(jsonData.d.__buttonMask))
										buttonMask = jsonData.d.__buttonMask;

									var isSameUser = true;
									var isDisabled = false;
									var isSubmitted = false;
									maskArray.push(buttonMask);
									for (var index = 0; index < arrSelectedRecords.length; index++) {
										objData = arrSelectedRecords[index];
										maskArray.push(objData.get('__metadata').__rightsMap);
										if(objData.data.makerId === null || objData.data.makerId === "" || objData.data.makerId === "undefined"){
											isSameUser = false;
										}
										else{
											if (objData.data.makerId === USER) {
												isSameUser = false;
											}
										}
										if (objData.raw.validFlag != 'Y') {
											isDisabled = true;
										}
										if (objData.raw.isSubmitted != null
												&& objData.raw.isSubmitted == 'Y'
												&& objData.raw.requestState != 8
												&& objData.raw.requestState != 7
												&& objData.raw.requestState != 4
												&& objData.raw.requestState != 5) {
											isSubmitted = true;
											strEmptyRecKey = false;
										}
									}
							actionMask = doAndOperation(maskArray, 10);
							me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
									isSubmitted, objData);
					},

					enableDisableGroupActions : function(actionMask,
							isSameUser, isDisabled, isSubmitted, objData) {
						var me = this;
						var objGroupView = me.getGroupView();
						var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
						var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
						var strEmptyRecKey = false;
						if (!Ext.isEmpty(actionBar)
								&& !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext
									.each(
											arrItems,
											function(item) {
												strBitMapKey = parseInt(item.maskPosition,10) - 1;
												if(objData !== null && objData !== undefined){
													strEmptyRecKey = (objData.raw.recordKeyNo == undefined);
												}
												if (strBitMapKey) {
													blnEnabled = isActionEnabled(
															actionMask,
															strBitMapKey);
													if ((item.maskPosition === 6 && blnEnabled)) {
														blnEnabled = blnEnabled
																&& isSameUser;
													} else if (item.maskPosition === 7
															&& blnEnabled) {
														blnEnabled = blnEnabled
																&& isSameUser;
													} else if (item.maskPosition === 8
															&& blnEnabled) {
														blnEnabled = blnEnabled
																&& isDisabled;
													} else if (item.maskPosition === 9
															&& blnEnabled) {
														blnEnabled = blnEnabled
																&& !isDisabled;
													} else if (item.maskPosition === 5
															&& blnEnabled) {
														var reqState = objData.raw.requestState;
														var submitFlag = objData.raw.isSubmitted;
														var submitResult = (reqState === 0 && submitFlag == 'N' && strEmptyRecKey);
														blnEnabled = blnEnabled
														&& (!submitResult);
													} else if (item.maskPosition === 10
															&& blnEnabled) {
														var reqState = objData.raw.requestState;
														var submitFlag = objData.raw.isSubmitted;
														var submitResult = (reqState === 0 && submitFlag == 'N' && strEmptyRecKey);
														blnEnabled = blnEnabled
														&& (!submitResult);
													}
													item
															.setDisabled(!blnEnabled);
												}
											});
						}
					},

					handleGroupActions : function(strAction, grid, arrSelectedRecords,
							strActionType) {
						var me = this;
						var strUrl = Ext.String.format(
								'services/clientAccountList/{0}.srvc?', strAction);
						if (strAction === 'reject') {
							this.showRejectVerifyPopUp(strAction, strUrl, grid,
									arrSelectedRecords, strActionType);

						} else {
							this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
									strActionType, strAction);
						}

					},

					showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
							arrSelectedRecords, strActionType) {
						var me = this;
						var titleMsg = '', fieldLbl = '';
						if (strAction === 'reject') {
							fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
									'Please Enter Reject Remark');
							titleMsg = getLabel('prfRejectRemarkPopUpFldLbl',
									'Reject Remark');
						}
						var msgbox = Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							multiline : 4,
							cls: 't7-popup',
							width: 355,
							height : 270,
							bodyPadding : 0,
							fn : function(btn, text) {
								if (btn == 'ok') {
									me.preHandleGroupActions(strActionUrl, text,
											grid, arrSelectedRecords,
											strActionType, strAction);
								}
							}
						});
						msgbox.textArea.enforceMaxLength = true;
						msgbox.textArea.inputEl.set({
							maxLength : 255
						});
					},

					preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
							strActionType, strAction) {

						var me = this;
						var grid = this.getGrid();
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var records = (arrSelectedRecords || []);
							for ( var index = 0; index < records.length; index++) {
								arrayJson
										.push({
											serialNo : grid.getStore().indexOf(
													records[index]) + 1,
											identifier : records[index].data.identifier,
											userMessage : remark
										});
							}
							if (arrayJson)
								arrayJson = arrayJson
										.sort(function(valA, valB) {
											return valA.serialNo
													- valB.serialNo
										});

							Ext.Ajax
									.request({
										url : strUrl + csrfTokenName + "=" + csrfTokenValue,
										method : 'POST',
										jsonData : Ext.encode(arrayJson),
										success : function(response) {
											// TODO : Action Result handling to
											// be done here
											me.enableDisableGroupActions(
													'0000000000', true);
											grid.refreshData();
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox
													.show({
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

					},

					/**
					 * Finds all strings that matches the searched value in each
					 * grid cells.
					 * 
					 * @private
					 */
					
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},
					
					
					toggleFirstRequest : function(blnValue) {
						var me = this;
						me.isFirstRequest = blnValue;
						if (blnValue == false)
							me.strActivityType = null;
					},
					
					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
							newCard, oldCard) {
						var me=this;		
						var objGroupView = me.getGroupView();
						var args = null;
						var strModule = '', strUrl = null, args = null, strFilterCode = null;
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo) {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
							me.preferenceHandler.readModulePreferences(me.strPageName,
									strModule, me.postHandleDoHandleGroupTabChange, args, me, true);
						}
						//objGroupView.reconfigureGrid(objGroupView.cfgGridModel);
					},
					
					
					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext
								.create(
										'Ext.tip.ToolTip',
										{
											target : 'accountConfigurationFilterView-1016_header_hd-textEl',
											listeners : {
												// Change content dynamically
												// depending on which element
												// triggered the show.
												beforeshow : function(tip) {
													var accountNo = '';
													var accNickName = '';
													var client = '';
													var filterView = me
															.getAccountConfigurationFilterView();
													var accountNoFltId = filterView
															.down('combobox[itemId=accNmbrFltId]');
													var accNickNmFltId = filterView
															.down('combobox[itemId=accNickNmFltId]');
													if (!Ext
															.isEmpty(accountNoFltId)
															&& !Ext
																	.isEmpty(accountNoFltId
																			.getValue())) {
														accountNo = accountNoFltId
																.getValue();
													} else {
														accountNo = getLabel(
																'none', 'None');
													}
													if (!Ext
															.isEmpty(accNickNmFltId)
															&& !Ext
																	.isEmpty(accNickNmFltId
																			.getValue())) {
														accNickName = accNickNmFltId
																.getValue();
													} else {
														accNickName = getLabel(
																'none', 'None');
													}
													if (entityType == 1) {
														client = (me.clientDesc != '') ? me.clientDesc
																: getLabel(
																		'allcompanies',
																		'All Companies');
													} else {
														client = (me.clientDesc != '') ? me.clientDesc
																: getLabel(
																		'none',
																		'None');
													}
													tip
															.update(getLabel(
																	'client',
																	'Company Name')
																	+ ' : '
																	+ client
																	+ '<br/>'
																	+ getLabel(
																			'accountno',
																			'Account')
																	+ ' : '
																	+ accountNo
																	+ '<br/>'
																	+ getLabel(
																			'accountNickName',
																			'Account Nickname')
																	+ ' : '
																	+ accNickName);
												}
											}
										});
					},
					
					handleClientChangeInQuickFilter : function(isSessionClientFilter) {
						var me = this;
						me.clientCode = selectedFilterClient;
						me.clientDesc = selectedFilterClientDesc;// combo.getRawValue();
						quickFilterClientValSelected = me.clientCode;
						quickFilterClientDescSelected = me.clientDesc;
						if(me.clientCode === undefined || me.clientCode === null || me.clientCode === "")
							me.clientCode = 'all';
						me.filterApplied = 'Q';
						me.updateFilterparams();
						me.setDataForFilter();
						if (me.clientCode === 'all') {
							me.filterApplied = 'ALL';
							me.refreshData();

						} else {
							me.applyFilter();
						}
					},
					updateFilterparams : function() {
						var me = this;
						var accountAutocompleter = me.getFilterView().down('AutoCompleter[itemId="accNmbrFltId"]');
						accountAutocompleter.cfgExtraParams = [];
						if(me.clientCode && 'all' !== me.clientCode) {
							var clientFilter = {
								key : '$clientId',
								value : me.clientCode
							};
						accountAutocompleter.cfgExtraParams.push(clientFilter);
						}
						accountAutocompleter.setValue("");
					},
					resetClientAutocompleter : function() {
						var me = this;
						var clientAuto = me.getFilterView().down("combo[itemId='clientComboAuto']");
						clientAuto.setRawValue("");
						selectedFilterClient = '';
						selectedFilterClientDesc = '';
						$(document).trigger("handleClientChangeInQuickFilter", false);
					},
					
					/*############### Page setting handling (START) ###############*/
					applyPageSetting : function(arrPref) {
						var me = this;
						if (!Ext.isEmpty(arrPref)) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref, me.postHandlePageGridSetting, null, me, false);
						}
					},
					savePageSetting : function(arrPref, strInvokedFrom) {
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref, me.postHandleSavePageSetting, args, me, false);
						}
					},
					
					postHandleSavePageSetting : function(data, args, isSuccess) {
						if(isSuccess === 'N') {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
					},
					restorePageSetting : function() {
						var me = this;
						me.preferenceHandler.clearPagePreferences(me.strPageName, null, me.postHandlePageGridSetting, null, me, false);
					},
					postHandlePageGridSetting : function(data, args, isSuccess) {
						if (isSuccess === 'Y') {
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
					showPageSettingPopup : function() {
						
						var me = this,
							objData = {},
							objGroupView = me.getGroupView(),
							objPrefData,
							objGeneralSetting,
							objGridSetting,
							objColumnSetting;
						
						var objGroupByVal = '',
							objDefaultFilterVal = '',
							objGridSizeVal = '',
							objRowPerPageVal = _GridSizeTxn;
						
						me.pageSettingPopup = null;
							
						if(!Ext.isEmpty(objAccountConfigurationPref)) {
							objPrefData = Ext.decode(objAccountConfigurationPref);
							
							objGeneralSetting = objPrefData && objPrefData.d.preferences
								&& objPrefData.d.preferences.GeneralSetting
								? objPrefData.d.preferences.GeneralSetting
								: null;
							objGridSetting = objPrefData && objPrefData.d.preferences
								&& objPrefData.d.preferences.GridSetting
								? objPrefData.d.preferences.GridSetting
								: null;
								
							if (!Ext.isEmpty(objGeneralSetting)) {
								objGroupByVal = objGeneralSetting.defaultGroupByCode;
								objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
							} if (!Ext.isEmpty(objGridSetting)) {
								objGridSizeVal = objGridSetting.defaultGridSize;
								objRowPerPageVal = objGridSetting.defaultRowPerPage;
							}
							
						}
						
						if(objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting && objPrefData.d.preferences.ColumnSetting.gridCols) {
							objColumnSetting = objPrefData.d.preferences.ColumnSetting.gridCols;
						} else {
							objColumnSetting = ACC_CONF_DEFAULT_COLUMN_MODEL || [];
						}
						
						objGroupView.cfgShowAdvancedFilterLink= false;
						objData["groupByData"] = objGroupView ? objGroupView.cfgGroupByData : [];
						objData["filterUrl"] = 'services/userfilterslist/' + me.strPageName;
						objData["rowPerPage"] = _AvailableGridSize;
						objData["groupByVal"] = objGroupByVal;
						objData["filterVal"] = objDefaultFilterVal;
						objData["gridSizeVal"] = objGridSizeVal;
						objData["rowPerPageVal"] = objRowPerPageVal;
						
						me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting,
							cfgViewOnly : _IsEmulationMode
						});
						
						me.pageSettingPopup.show();
						me.pageSettingPopup.center();
					},
					/*############### Page setting handling ( END ) ###############*/
					
		/********* Preference Handling Starts **************/	
					
					updateConfig : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
					},
					
					updateFilterConfig : function() {
						var me = this;
						var arrJsn = new Array();
						// TODO : Localization to be handled..
						

						if (!Ext.isEmpty(objAccountConfigurationPref)) {
							var objJsonData = Ext.decode(objAccountConfigurationPref);
							var data = objJsonData.d.preferences.filterPref;
							if (!Ext.isEmpty(data)) {
								if(!Ext.isEmpty(data.clientName)){
									me.clientDesc = data.clientName;
								}
								if(!Ext.isEmpty(data.accountNo)){
									me.filterAccntNumber = data.accountNo;
								}
							 	if(!Ext.isEmpty(data.accountNickName)){
							 		me.filterAccNickName = data.accountNickName;
							 	}
							}
						}
//						if (entityType == '1') {
//							$("#summaryClientFilterSpan").text(me.clientDesc);
//							changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
//						}else if(entityType=='0'){
//							$("#summaryClientFilter").val(me.clientDesc);
//							changeClientAndRefreshGrid(me.clientCode,me.clientDesc)
//						}
					},
					
					updateFilterFields : function(){
						var me=this;
						var clientCodesFltId;
						var accountConfigurationFilterView = me.getAccountConfigurationFilterView();
						var accountNumber = accountConfigurationFilterView.down('combobox[itemId=accNmbrFltId]');
						var accountNickNameId = accountConfigurationFilterView.down('combobox[itemId=accNickNmFltId]');
						
						if(me.filterAccntNumber != null && me.filterAccntNumber != "") { 
							accountNumber.setValue(me.filterAccntNumber);
						}
						
						if(me.filterAccNickName != null && me.filterAccNickName != "") { 
							accountNickNameId.setValue(me.filterAccNickName);
						}
					},
					
					handleSavePreferences : function()
					{
						var me = this;
						if ($("#savePrefMenuBtn").attr('disabled'))
							event.preventDefault();
						else{
							var arrPref = me.getPreferencesToSave(false);
							if (arrPref) {
								me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
										me.postHandleSavePreferences, null, me, true);
							}
						}		
					},
					postHandleSavePreferences : function(data, args, isSuccess) {
						var me = this;
						if (isSuccess === 'N') {
								me.disablePreferencesButton("savePrefMenuBtn", false);	
								me.disablePreferencesButton("clearPrefMenuBtn", true);	
						} else {
							me.disablePreferencesButton("clearPrefMenuBtn", false);	
							me.disablePreferencesButton("savePrefMenuBtn", true);	
						}
					},
					toggleSavePrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnSavePreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},
					toggleClearPrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnClearPreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args.scope;
						var objGroupView = me.getGroupView();
						var objSummaryView = me.getClientSetupGridView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
						var colModel = null, arrCols = null;
						if (data && data.preference) {
							objPref = Ext.decode(data.preference);
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
					getPreferencesToSave : function(localSave) {
								var me = this;
								var groupView = me.getGroupView();
								var grid = null;
								var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
								var groupInfo = null, subGroupInfo = null;
								if(groupView){
								  grid = groupView.getGrid();
								  var gridState = grid.getGridState();
								  groupInfo = groupView.getGroupInfo() || '{}';
								  subGroupInfo = groupView.getSubGroupInfo() || {};
								  if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
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
								}
								objFilterPref = me.getFilterPreferences();
									arrPref.push({
												"module" : "filterPref",
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
						var clientNamesFltId = null, accountNo = null, accountNickName = null, clientName = null;
						objFilterPref.clientName = me.clientDesc;
						objFilterPref.accountNo = me.filterAccntNumber;
						objFilterPref.accountNickName = me.filterAccNickName;
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
					}
					
					/********* Preference Handling Ends **************/
				});
function showEnrichments(record) {
	var me = this;
	var viewState = record;
	var form;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
			viewState));
	form.action = "editAccountEnrichments.form";
	document.body.appendChild(form);
	form.submit();
}
