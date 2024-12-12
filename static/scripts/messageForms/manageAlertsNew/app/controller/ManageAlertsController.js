Ext
		.define(
				'GCP.controller.ManageAlertsController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.ManageAlertsView',
							  'GCP.view.CreateAlertPopup',
							  'GCP.view.ManageAlertsGridGroupView' ],
					refs : [
							{
								ref : 'manageAlertsView',
								selector : 'manageAlertsView'
							},
							{
								ref : 'manageAlertsFilterView',
								selector : 'manageAlertsFilterView'
							},
							{
								ref : 'manageAlertsGridGroupView',
								selector : 'manageAlertsView manageAlertsGridGroupView'
							},
							{
								ref : 'groupView',
								selector : 'manageAlertsGridGroupView groupView'
							},
							{
								ref : 'statusTypeToolBar',
								selector : 'manageAlertsView manageAlertsFilterView toolbar[itemId="statusTypeToolBar"]'
							},
							{
								ref : 'btnCreateNewAlert',
								selector : 'manageAlertsView toolbar[itemId="initAlertActionToolBar"] button[itemId="btnCreateNewAlert"]'
							},
							/*{
								ref : 'manageAlertsTab',
								selector : 'manageAlertsView manageAlertsTitleViewType button[itemId="loanCenterSiTabItemId"]'
							},*/
							{	
								ref : 'filterView',
								selector : 'filterView'
							}
							],
					config : {
						moduleTypeVal : 'all',
						moduleTypeDesc : 'all',
						statusTypeVal : 'all',
						statusTypeDesc : 'all',
						subscriptionTypeVal : 'all',
						filterData : [],
						strGetModulePrefUrl : 'services/userpreferences/manageAlerts/{0}.json',
						strPageName : 'manageAlerts' ,
						strDefaultMask : '0000000000'
					},
					init : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						$(document).on('addAlertAction',function(event) {
							me.handleAlertEntryAction();
						});$(document).on('performPageSettings', function(event) {
						me.showPageSettingPopup('PAGE');
						});
						me
								.control({
									/*'manageAlertsView toolbar[itemId="initAlertActionToolBar"] button[itemId="btnCreateNewAlert"]' : {
										click : function() {
											me.handleAlertEntryAction();
										}
									},*/
									/*'manageAlertsView manageAlertsFilterView button[itemId="filterBtnId"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
										}
									},*/
									'manageAlertsGridGroupView groupView' : {
										'groupByChange' : function(menu, groupInfo) {
											// me.doHandleGroupByChange(menu, groupInfo);
										},
										'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
												newCard, oldCard) {
											me.doHandleGroupTabChange(groupInfo, subGroupInfo,
													tabPanel, newCard, oldCard);
										},
										'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
													newPgNo, oldPgNo, sorter, filterData) {				
												me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
													newPgNo, oldPgNo, sorter, filterData);
												me.handleCreateNewBtn();
										},				
										'gridPageChange' : me.doHandleLoadGridData,
										'gridSortChange' : me.doHandleLoadGridData,
										'gridPageSizeChange' : me.doHandleLoadGridData,
										'gridColumnFilterChange' : me.doHandleLoadGridData,
										'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
										'gridStateChange' : function(grid) {
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
										'gridSettingClick' : function(){
											me.showPageSettingPopup('GRID');
										},
										/*'render' : function()  {
										//	populateAdvancedFilterFieldValue();
										//	me.firstTime = true;
											if (objManagePref) {
												var objJsonData = Ext.decode(objManagePref);
												if (!Ext.isEmpty(objJsonData.d.preferences)) {
													if (!Ext
															.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
														if (!Ext
																.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
															var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
															//me.doHandleSavedFilterItemClick(advData);
															//me.savedFilterVal = advData;
														}
													}
												}
											}
										}*/
										afterrender : function() {
											if (objGridViewPref) {
											}
										}
									},
									'filterView' : {
										appliedFilterDelete : function(btn){
											me.handleAppliedFilterDelete(btn);
										}
									},
									'manageAlertsFilterView' : {
										beforerender : function() {
											var useSettingsButton = me.getFilterView()
													.down('button[itemId="useSettingsbutton"]');
											if (!Ext.isEmpty(useSettingsButton)) 
												useSettingsButton.hide();
											
											var advanceFilterLbl = me.getFilterView()
													.down('label[itemId="createAdvanceFilterLabel"]');
											if (!Ext.isEmpty(advanceFilterLbl)) 
												advanceFilterLbl.hide();
										},
										handleStatusType : function(btn, btnDesc) {
											me.handleStatusType(btn, btnDesc);
										}
									},
									'filterView button[itemId="clearSettingsButton"]' : {
										'click' : function() {
											me.handleClearSettings();
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
									}
									/*'manageAlertsView manageAlertsTitleViewType' : {
										render : function(btn, opts) {
											me.preHandleTabPermissions(btn);
										}
									}*/
								});
					},
					handleCreateNewBtn : function() {
						var me = this;
						var btnCreateNewAlertRef = me.getBtnCreateNewAlert();
						Ext.Ajax
								.request({
									url : 'services/getPermissions.json',
									method : 'POST',
									success : function(response) {
										if (!Ext.isEmpty(response.responseText)) {
											var data = Ext
													.decode(response.responseText);
											if (!Ext.isEmpty(data.permissions)) {
												var permissionData = data.permissions;
												if (!Ext
														.isEmpty(permissionData.EDIT)
														&& permissionData.EDIT == true) {
													if (!Ext
															.isEmpty(btnCreateNewAlertRef))
														btnCreateNewAlertRef
																.show();
												} else {
													if (!Ext
															.isEmpty(btnCreateNewAlertRef))
														btnCreateNewAlertRef
																.hide();
												}
											}
										}
									},
									failure : function(response) {
									}
								});
					},
					/*handleGridHeader : function() {
						var me = this;
						var gridHeaderPanel = me.getGridHeader();
						var createNewPanel = me.getCreateNewToolBar();
						if (!Ext.isEmpty(gridHeaderPanel)) {
							gridHeaderPanel.removeAll();
						}
						if (!Ext.isEmpty(createNewPanel)) {
							createNewPanel.removeAll();
						}

						createNewPanel.add(); 

					},*/
					/*handleSmartGridConfig : function() {
						var me = this;
						var manageAlertsGrid = me.getManageAlertsGrid();
						var objConfigMap = me.getManageAlertsConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(manageAlertsGrid))
							manageAlertsGrid.destroy(true);

						arrCols = me.getColumns(objConfigMap.arrColsPref,
								objConfigMap.objWidthMap);
						me.handleSmartGridLoading(arrCols,
								objConfigMap.storeModel);

					},*/
					/*handleSmartGridLoading : function(arrCols, storeModel) {
						var me = this;
						var pgSize = null;
						pgSize = 10;
						manageAlertsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : pgSize,
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							rowList : [ 5, 10, 15, 20, 25, 30 ],
							minHeight : 0,
							columnModel : arrCols,
							storeModel : storeModel,
							isRowIconVisible : me.isRowIconVisible,
							handleRowMoreMenuClick : me.handleRowMoreMenuClick,

							handleRowIconClick : function(tableView, rowIndex,
									columnIndex, btn, event, record) {
								me.handleRowIconClick(tableView, rowIndex,
										columnIndex, btn, event, record);
							},
							handleMoreMenuItemClick : function(grid, rowIndex,
									cellIndex, menu, event, record) {
								var dataParams = menu.dataParams;
								me.handleRowIconClick(dataParams.view,
										dataParams.rowIndex,
										dataParams.columnIndex, menu, null,
										dataParams.record);
							}
						});

						var manageAlertsDtlView = me.getManageAlertsDtlView();
						manageAlertsDtlView.add(manageAlertsGrid);
						manageAlertsDtlView.doLayout();
					},*/
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
								blnRetValue = me.isRowIconVisible(store,
										record, jsonData, null,
										arrMenuItems[a].maskPosition);
								arrMenuItems[a].setVisible(blnRetValue);
							}
						}
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'btnView') {
							showViewCustomAlertForm(record.data.recViewState, record.data.subscriptionType);
						} else if (actionName === 'btnEdit') {
							showEditCustomAlertForm(record.data.recViewState);
						}
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
							newCard, oldCard) {
						var me = this;
						var objGroupView = me.getGroupView();
						var strModule = '', strUrl = null, args = null, strFilterCode = null;
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo) {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
							me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
									args);
						}
					},
					getSavedPreferences : function(strUrl, fnCallBack, args) {
						var me = this;
						Ext.Ajax.request({
									url : strUrl,
									method : 'GET',
									success : function(response) {
										var data = null;
										if (response && response.responseText)
											data = Ext.decode(response.responseText);
										Ext.Function.bind(fnCallBack, me);
										if (fnCallBack)
											fnCallBack(data, args);
									},
									failure : function() {
									}

								});
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args.scope;
						var objGroupView = me.getGroupView();
						var objSummaryView = me.getManageAlertsGridGroupView(), objPref = null, gridModel = null, intPgSize = null;
						var colModel = null, arrCols = null;
						if (data && data.preference) {
							objPref = Ext.decode(data.preference);
							arrCols = objPref.gridCols || null;
							intPgSize = objPref.pgSize || _GridSizeTxn;
							colModel = objSummaryView.getColumnModel(arrCols);
							if (colModel) {
								gridModel = {
									columnModel : colModel,
									pageSize : intPgSize,
									storeModel:{
									  sortState:objPref.sortState
									}

								};
							}
						}
						objGroupView.reconfigureGrid(gridModel);
					},
					/*getManageAlertsConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						if(strEntity=='0')
						{
							objWidthMap = {
									"eventDesc" : '30%',
									"subscriptionDesc" : '25%',
									"clientDesc" : '17%',
									"moduleName" : '17%',
									"_strGroup" : '17%',
									"validFlag" : '9%'
								};	
							arrColsPref = [ {
								"colId" : "eventDesc",
								"colDesc" : "Event"
							}, {
								"colId" : "subscriptionDesc",
								"colDesc" : "Subscription"
							},{
								"colId" : "clientDesc",
								"colDesc" : "Client"
							}, {
								"colId" : "moduleName",
								"colDesc" : "Module"
							}, {
								"colId" : "_strGroup",
								"colDesc" : "Group"
							}, {
								"colId" : "validFlag",
								"colDesc" : "Status"
							} ];							
						}
						else
						{
							objWidthMap = {
									"eventDesc" : '30%',
									"subscriptionDesc" : '25%',									
									"moduleName" : '17%',
									"_strGroup" : '17%',
									"validFlag" : '9%'
								};	

							arrColsPref = [ {
								"colId" : "eventDesc",
								"colDesc" : "Event"
							}, {
								"colId" : "subscriptionDesc",
								"colDesc" : "Subscription"
							}, {
								"colId" : "moduleName",
								"colDesc" : "Module"
							}, {
								"colId" : "group",
								"colDesc" : "Group"
							}, {
								"colId" : "validFlag",
								"colDesc" : "Status"
							} ];							
						}


						storeModel = {
							fields : [ '_strGroup', 'eventDesc', 'moduleName','clientDesc',
									'subscriptionDesc', 'version', 'validFlag',
									'identifier', 'eventName',
									'subscriptionName', 'subscriptionType',
									'recViewState', '__rightsMap','group' ],
							proxyUrl : 'services/manageAlertsList.json',
							rootNode : 'd.manageAlerts',
							totalRowsNode : 'd.__count'
						};
						objConfigMap = {
							"objWidthMap" : objWidthMap,
							"arrColsPref" : arrColsPref,
							"storeModel" : storeModel
						};
						return objConfigMap;
					},*/
					/*getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								if(cfgCol.colHeader == "Status")
									cfgCol.sortable = false;
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
					},*/
					/*handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this;
						// me.setDataForFilter();
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						// strUrl = strUrl + me.getFilterUrl();
						grid.setLoading(true);
						grid.loadGridData(strUrl, null);
					},*/
					doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData) {
						var me = this;
						var objGroupView = me.getGroupView();
						var buttonMask = me.strDefaultMask;
						var arrOfParseQuickFilter = [];
						objGroupView.handleGroupActionsVisibility(buttonMask);
						var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
						me.reportGridOrder = strUrl;
						strUrl += me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;

						if(!Ext.isEmpty(me.filterData)){
							if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
								arrOfParseQuickFilter = generateFilterArray(me.filterData);
							}
						}
						
						if(arrOfParseQuickFilter) {
							me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
						}
						grid.loadGridData(strUrl, null, null, false);
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
						strFieldName = objData.paramName || objData.field;	
						me.typeFilterVal = 'Select';
						var eventFiltersCombo = me.getManageAlertsFilterView()
								.down('combo[itemId="statusId"]');
						eventFiltersCombo.setValue(me.typeFilterVal);
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
							me.resetFieldInQuickFilterOnDelete(objData);
							me.refreshData();
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
							} else
								me.preferenceHandler.savePagePreferences(me.strPageName,
										arrPref, me.postHandlePageGridSetting, args, me, false);
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
								}
							// TODO : Preferences and existing column model need to be
							// merged
							objGroupView.reconfigureGrid(gridModel);
						} else
							window.location.reload();
						} else {
							Ext.MessageBox.show({
										title : getLabel('instrumentErrorPopUpTitle', 'Error'),
										msg : getLabel('errorMsg',
												'Error while apply/restore setting'),
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
						var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting, strTitle = null, subGroupInfo;
						var objGroupByVal = '', objDefaultFilterVal = '', objColumnSetting ,objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;
						var objSummaryView = me.getManageAlertsGridGroupView();
						objColumnSetting = objSummaryView.getDefaultColumnModel();
						me.pageSettingPopup = null;
						
						if (!Ext.isEmpty(objManagePref)) {
							objPrefData = Ext.decode(objManagePref);
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
									: (objSummaryView.getDefaultColumnModel() || '[]');

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
						objData["filterUrl"] = 'services/userfilterslist/' +me.strPageName;
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
					doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
							objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
						var me = this;
						var objGroupView = me.getGroupView();
						var buttonMask = me.strDefaultMask;		
						var maskArray = new Array(), actionMask = '', objData = null;;
						if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
							buttonMask = jsonData.d.__buttonMask;
						maskArray.push(buttonMask);
						for (var index = 0; index < arrSelectedRecords.length; index++) {
							objData = arrSelectedRecords[index];
							maskArray.push(objData.get('__metadata').__rightsMap);
						}
						actionMask = doAndOperation(maskArray, 9);
						objGroupView.handleGroupActionsVisibility(actionMask);
					},
					doHandleRowActions : function(actionName, objGrid, record) {
						var me = this;
						if (actionName === 'btnView') {
							showViewCustomAlertForm(record.data.recViewState, record.data.subscriptionType);
						} else if (actionName === 'btnEdit') {
							showEditCustomAlertForm(record.data.recViewState);
						}
					},
					doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
							strActionType) {
						var me = this;
						var strUrl;
						strUrl = Ext.String.format('services/managealert/{0}.srvc?',
								strAction);
						me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
								strActionType, strAction);
					},
					handleAlertEntryAction : function() {
						var form, inputField;
						var me = this;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.action = 'addCustomAlerts.srvc';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
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
					/*displayModules : function() {
						var me = this;
						var objModulePanel = me.getModuleTypeToolBar();
						Ext.Ajax
								.request({
									url : 'services/getModuleList.json?',
									method : "POST",
									async : false,
									success : function(response) {
										if (!Ext.isEmpty(response.responseText)) {
											var data = Ext
													.decode(response.responseText);
											var modules = data.d.manageAlerts;
											for ( var i = 0; i < 3; i++) {
												if (!Ext.isEmpty(modules[i])) {
													objModulePanel
															.add({
																text : modules[i].moduleName,
																code : modules[i].moduleCode,
																btnDesc : modules[i].moduleName,
																btnId : modules[i].moduleCode,
																parent : this,
																cls : 'f13',
																handler : function(
																		btn,
																		opts) {
																	me
																			.handleModuleType(btn);
																}
															});
												}
											}
											if (modules.length > 3) {
												objModulePanel
														.add({
															text : getLabel(
																	'more',
																	'more>>'),
															code : 'lnkmore',
															btnDesc : getLabel(
																	'more',
																	'more>>'),
															btnId : 'lnkmore',
															parent : this,
															cls : 'f13',
															handler : function(
																	btn, opts) {
																me
																		.handleModuleType(btn);
															}
														});
											}
										}
									},
									failure : function(response) {
										// console.log('Error
										// Occured-addAllAccountSet');
									}
								});
					},
					handleModuleType : function(btn) {
						var me = this;
						var moduleTypeToolBarRef = me.getModuleTypeToolBar();

						if (!Ext.isEmpty(moduleTypeToolBarRef)) {
							moduleTypeToolBarRef.items.each(function(item) {
								item.removeCls('xn-custom-heighlight');
							});
						}
						btn.addCls('xn-custom-heighlight');
						me.moduleTypeVal = btn.code;
						me.moduleTypeDesc = btn.btnDesc;
						me.setDataForFilter();
						me.applyFilter();
					},*/
					handleStatusType : function(btn, btnDesc) {
						var me = this;
						var statusTypeToolBarRef = me.getStatusTypeToolBar();

						if (!Ext.isEmpty(statusTypeToolBarRef)) {
							statusTypeToolBarRef.items.each(function(item) {
								item.removeCls('xn-custom-heighlight');
							});
						}
						//btn.addCls('xn-custom-heighlight');
						me.statusTypeVal = btn;
						me.statusTypeDesc = btnDesc;
						me.setDataForFilter();
						me.applyFilter();
					},
					/*handleSubscriptionType : function(btn) {
						var me = this;
						var subscriptionTypeToolBarRef = me
								.getSubscriptionTypeToolBar();

						if (!Ext.isEmpty(subscriptionTypeToolBarRef)) {
							subscriptionTypeToolBarRef.items
									.each(function(item) {

										item.removeCls('xn-custom-heighlight');
									});
						}
						btn.addCls('xn-custom-heighlight');
						me.subscriptionTypeVal = btn.code;
						me.setDataForFilter();
						me.applyFilter();
					},*/
					/*searchOnPage : function() {
						var me = this;
						var searchValue = me.getSearchTextInput().value;
						var anyMatch = me.getMatchCriteria().getValue();
						if ('anyMatch' === anyMatch.searchOnPage) {
							anyMatch = false;
						} else {
							anyMatch = true;
						}

						var grid = me.getGrid();
						grid.view.refresh();

						// detects html tag
						var tagsRe = /<[^>]*>/gm;
						// DEL ASCII code
						var tagsProtect = '\x0f';
						// detects regexp reserved word
						var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

						if (searchValue !== null) {
							searchRegExp = new RegExp(searchValue, 'g'
									+ (anyMatch ? '' : 'i'));

							if (!Ext.isEmpty(grid)) {
								var store = grid.store;

								store
										.each(
												function(record, idx) {
													var td = Ext
															.fly(
																	grid.view
																			.getNode(idx))
															.down('td'), cell, matches, cellHTML;
													while (td) {
														cell = td
																.down('.x-grid-cell-inner');
														matches = cell.dom.innerHTML
																.match(tagsRe);
														cellHTML = cell.dom.innerHTML
																.replace(
																		tagsRe,
																		tagsProtect);

														if (cellHTML === '&nbsp;') {
															td = td.next();
														} else {
															// populate indexes
															// array, set
															// currentIndex, and
															// replace
															// wrap matched
															// string in a span
															cellHTML = cellHTML
																	.replace(
																			searchRegExp,
																			function(
																					m) {
																				return '<span class="xn-livesearch-match">'
																						+ m
																						+ '</span>';
																			});
															// restore protected
															// tags
															Ext
																	.each(
																			matches,
																			function(
																					match) {
																				cellHTML = cellHTML
																						.replace(
																								tagsProtect,
																								match);
																			});
															// update cell html
															cell.dom.innerHTML = cellHTML;
															td = td.next();
														}
													}
												}, me);
							}
						}
					},*/
					/*setInfoTooltip : function() {
						var me = this;
						var infotip = Ext
								.create(
										'Ext.tip.ToolTip',
										{
											target : 'manageAlertsFilterView-1024_header_hd-textEl',
											listeners : {
												// Change content dynamically
												// depending on which element
												// triggered the show.
												beforeshow : function(tip) {

													if (!Ext
															.isEmpty(me.moduleTypeDesc)
															&& "all" != me.moduleTypeDesc) {
														authtype = me.moduleTypeDesc;
													} else {
														authtype = getLabel(
																'all', 'All');
													}

													if (!Ext
															.isEmpty(me.statusTypeVal)
															&& "all" != me.statusTypeVal) {
														if (me.statusTypeVal == 'Y')
															status = getLabel(
																	'active',
																	'Active');
														else
															status = getLabel(
																	'inactive',
																	'Inactive');
													} else {
														status = getLabel(
																'all', 'All');
													}

													if (!Ext
															.isEmpty(me.subscriptionTypeVal)
															&& "all" != me.subscriptionTypeVal) {
														if (me.subscriptionTypeVal == 'S')
															type = getLabel(
																	'standard',
																	'Standard');
														else
															type = getLabel(
																	'custom',
																	'Custom');
													} else {
														type = getLabel('all',
																'All');
													}

													tip.update(getLabel(
															"module", "Module")
															+ ' : '
															+ authtype
															+ '<br/>'
															+ getLabel("type",
																	"Type")
															+ ' : '
															+ type
															+ '<br/>'
															+ getLabel(
																	"status",
																	"Status")
															+ ' : ' + status);

												}
											}
										});
					},*/
					/*columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";

						if (colId === 'col_validFlag') {
							if (!Ext.isEmpty(record.get('validFlag'))
									&& record.get('validFlag') == 'N') {
								strRetValue = getLabel('active', 'Active');
							} else
								strRetValue = getLabel('inactive', 'Inactive');
						} else
							strRetValue = value;

						return strRetValue;
					},*/
					/*createActionColumn : function() {
						var me = this;
						var objActionCol = {
							colType : 'actioncontent',
							colId : 'action',
							width : 60,
							locked : true,
							items : [ {
								itemId : 'btnView',
								itemCls : 'grid-row-action-icon icon-view',
								toolTip : getLabel('viewToolTip', 'View'),
								maskPosition : 7
							}, {
								itemId : 'btnEdit',
								itemCls : 'grid-row-action-icon icon-edit',
								toolTip : getLabel('editToolTip', 'Edit'),
								maskPosition : 8
							} ]
						};
						return objActionCol;

					},*/
					/*isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						if (!Ext.isEmpty(record.get('subscriptionType'))
								&& record.get('subscriptionType') == 'S' )
								if(maskPosition == 7)
								{
									return true;
								}
								else
								{
									return false;
								}
						else {
							var maskSize = 11;
							var maskArray = new Array();
							var actionMask = '';
							var rightsMap = record.data.__rightsMap;
							var buttonMask = '';
							var retValue = true;
							var bitPosition = '';
							if (!Ext.isEmpty(maskPosition)) {
								bitPosition = parseInt(maskPosition) - 1;
								maskSize = maskSize;
							}
							if (!Ext.isEmpty(jsonData)
									&& !Ext.isEmpty(jsonData.d.__buttonMask))
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

							if (maskPosition === 2 && retValue) {
								// var reqState = record.raw.requestState;
								// var submitFlag = record.raw.isSubmitted;
								var validFlag = record.data.validFlag;
								var isDisabled = (validFlag == 'N');
								// var isSubmitModified = (reqState === 1 &&
								// submitFlag == 'Y');
								retValue = retValue && (!isDisabled);
							}
							return retValue;
						}
					},*/
					setDataForFilter : function() {
						var me = this;						
						this.filterData = this.getFilterQueryJson();
						
					},
					getFilterQueryJson : function() {
						var me = this;
						var module = null, type = null, status = null, statusDesc = null, jsonArray = [];

						/*if (!Ext.isEmpty(me.moduleTypeVal)
								&& "all" != me.moduleTypeVal) {
							module = me.moduleTypeVal;
						}
						if (!Ext.isEmpty(module)) {
							jsonArray.push({
								paramName : 'event_module',
								paramValue1 : module,
								operatorValue : 'eq',
								dataType : 'S'
							});
						}
						if (!Ext.isEmpty(me.subscriptionTypeVal)
								&& "all" != me.subscriptionTypeVal) {
							type = me.subscriptionTypeVal;
						}
						if (!Ext.isEmpty(type)) {
							jsonArray.push({
								paramName : 'subscription_type',
								paramValue1 : type,
								operatorValue : 'eq',
								dataType : 'S'
							});
						}*/
						if (!Ext.isEmpty(me.statusTypeVal)
								&& "all" != me.statusTypeVal) {
							status = me.statusTypeVal;
							statusDesc = me.statusTypeDesc;
						}
						if (!Ext.isEmpty(status)) {
							
							
							jsonArray.push({
								/*paramName : 'valid_flag',
								paramValue1 : status,
								operatorValue : 'eq',
								dataType : 'S',
								paramFieldLable : getLabel("status","Status"),
								//btnDesc : getLabel('active', 'Active')*/
								paramName : 'valid_flag',
								paramValue1 : status,
								operatorValue : 'eq',
								dataType : 'S',
								paramFieldLable : getLabel("status","Status"),
								displayType : 5,
								displayValue1 : statusDesc
							});
						}

						return jsonArray;
					},
					applyFilter : function() {
						var me = this;
						var groupView = me.getGroupView();
						var grid = groupView.getGrid();	
						var groupInfo = groupView.getGroupInfo() || '{}';
						var subGroupInfo = groupView.getSubGroupInfo() || {};
						if (!Ext.isEmpty(grid)) {
							var strDataUrl = grid.store.dataUrl;
							var store = grid.store;
							var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
									store.sorters);
							strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
							//grid.setLoading(true);
							//grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
							groupView.refreshData();
						}
					},
					generateFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this;
						var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
								? subGroupInfo.groupQuery
								: '';
						strQuickFilterUrl = me.generateUrlWithFilterParams(me);
						if (!Ext.isEmpty(strQuickFilterUrl)) {
							strUrl += '&$filter=' + strQuickFilterUrl;
							isFilterApplied = true;
						}
						if (!Ext.isEmpty(strGroupQuery)) {
							if (!Ext.isEmpty(strUrl))
								strUrl += ' and ' + strGroupQuery;
							else
								strUrl += '&$filter=' + strGroupQuery;
						}
						return strUrl;
					},
					getFilterUrl : function() {
						var me = this;
						var strQuickFilterUrl = '';
						strQuickFilterUrl = me
								.generateUrlWithFilterParams(this);
						return strQuickFilterUrl;
					},
					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '';
						var strTemp = '';
						var strFilterParam = '';
						for ( var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\''
										+ ' and ' + '\''
										+ filterData[index].paramValue2 + '\'';
								break;
							case 'in':
								var arrId = filterData[index].paramValue1;
								if (0 != arrId.length) {
									strTemp = strTemp + '(';
									for ( var count = 0; count < arrId.length; count++) {
										strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ' + '\'' + arrId[count]
												+ '\'';
										if (count != arrId.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;
							default:
								// Default opertator is eq
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
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
						//var isSubmit = false;
						maskArray.push(buttonMask);
						for ( var index = 0; index < selectedRecords.length; index++) {
							objData = selectedRecords[index];
							maskArray.push(objData.get('__rightsMap'));
							if (objData.raw.makerId === USER) {
								isSameUser = false;
							}
							if (objData.raw.validFlag != 'N') {
								isDisabled = true;
							}
							/*if (objData.raw.isSubmitted == 'Y'
									&& objData.raw.requestState == 0) {
								isSubmit = true;
							}*/
						}
						actionMask = doAndOperation(maskArray, 9);
						me.enableDisableGroupActions(actionMask, isSameUser,
								isDisabled);
						/*
						 * var me = this; var grid = me.getGrid(); var enableBtn =
						 * me.getAssignBtn(); var disableBtn =
						 * me.getUnassignBtn(); var deleteBtn =
						 * me.getDeleteBtn();
						 * 
						 * var enableActionEnabled = false; var
						 * disableActionEnabled = false; var stdTypeSelected =
						 * false; var blnEnabled = false;
						 * 
						 * if (Ext.isEmpty(grid.getSelectedRecords())) {
						 * deleteBtn.setDisabled(true); } else {
						 * Ext.each(grid.getSelectedRecords(), function(item) {
						 * if (item.data.subscriptionType == "S") {
						 * stdTypeSelected = true; if (item.data.validFlag ==
						 * "N") { disableActionEnabled = true; } else if
						 * (item.data.validFlag == "Y") { enableActionEnabled =
						 * true; } } else { if (item.data.validFlag == "N") {
						 * disableActionEnabled = true; } else if
						 * (item.data.validFlag == "Y") { enableActionEnabled =
						 * true; } } deleteBtn.setDisabled(false); }); }
						 * 
						 * if (!disableActionEnabled && !enableActionEnabled) {
						 * disableBtn.setDisabled(!blnEnabled);
						 * enableBtn.setDisabled(!blnEnabled); } else if
						 * (disableActionEnabled && enableActionEnabled) {
						 * enableBtn.setDisabled(!blnEnabled);
						 * disableBtn.setDisabled(!blnEnabled); } else if
						 * (enableActionEnabled) {
						 * enableBtn.setDisabled(blnEnabled); } else if
						 * (disableActionEnabled) {
						 * disableBtn.setDisabled(blnEnabled); }
						 * 
						 * if (stdTypeSelected) { deleteBtn.setDisabled(true); }
						 */
					},
					enableDisableGroupActions : function(actionMask,
							isSameUser, isDisabled) {
						var actionBar = this.getGroupActionBar();
						var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
						if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext.each(arrItems, function(item) {
										strBitMapKey = parseInt(item.maskPosition,10) - 1;
										if (strBitMapKey) {
											blnEnabled = isActionEnabled(actionMask,
													strBitMapKey);
													
											if (item.maskPosition === 4 && blnEnabled) {
												blnEnabled = blnEnabled && isDisabled;
											} else if (item.maskPosition === 5 && blnEnabled) {
												blnEnabled = blnEnabled && !isDisabled;
											} else if (item.maskPosition === 6 && blnEnabled) {
												blnEnabled = blnEnabled;// && !isSubmit;
											}
											item.setDisabled(!blnEnabled);
										}
									});
						}
					},
					/*handleGroupActions : function(btn, record) {
						var me = this;
						var strUrl;
						var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName
								: btn.itemId;
						strUrl = Ext.String.format('services/managealert/{0}',
								strAction);
						this.preHandleGroupActions(strUrl, '', record);

					},*/
					preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
								strActionType, strAction) {
						var me = this;
						var groupView = this.getGroupView();
						if (!Ext.isEmpty(groupView)) {
							if (!Ext.isEmpty(grid)) {
								var arrayJson = new Array();
								var records = (arrSelectedRecords || []);
								for ( var index = 0; index < records.length; index++) {
									arrayJson.push({
										serialNo : grid.getStore().indexOf(
												records[index]) + 1,
										identifier : records[index].data.identifier,
										userMessage : records[index].data.subscriptionType
									});
								}
								if (arrayJson)
										arrayJson = arrayJson.sort(function(valA, valB) {
											   return valA.serialNo - valB.serialNo
										});

								Ext.Ajax
										.request({
											url : strUrl + csrfTokenName + "=" + csrfTokenValue,
											method : 'POST',
											jsonData : Ext.encode(arrayJson),
											success : function(response) {
												var jsonRes = Ext.JSON
													.decode(response.responseText);
												var errorMessage = '';
												var record = jsonRes.d.instrumentActions[0].errors;
												if( record != null && record != 'undefined' )
												{
													for(var i=0;i<record.length;i++){
													 errorMessage = errorMessage + record[i].code +' : '+ record[i].errorMessage+"<br/>";
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
												groupView.setLoading(false);
												me.refreshData();
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
						}
					},
					/*preHandleTabPermissions : function() {
						var me = this;
						Ext.Ajax.request({
							url : 'services/getEventTemplateCode.json',
							method : 'POST',
							success : function(response) {
								var errorMessage = '';
								if (response.responseText == '')
									me.getManageAlertsTab().setVisible(false);
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
							}resetFieldInQuickFilterOnDelete
						});
					},*/
					refreshData : function() {
						var me = this;
						var groupView = me.getGroupView();
						var grid = groupView.getGrid();		
						var groupInfo = groupView.getGroupInfo() || '{}';
						var subGroupInfo = groupView.getSubGroupInfo() || {};
						var oldPageNum = 1;
						var current = 1;
						me.doHandleLoadGridData(groupInfo, subGroupInfo,grid, grid.store.dataUrl, grid.pageSize, 1, 1, null, null);		
					},
					handleClearSettings : function() {
						var me = this;
					//	me.statusTypeVal = 'all';
					//	me.filterApplied = 'ALL';
						var me = this;
						var statusFiltersCombo = me.getManageAlertsFilterView()
						.down('combo[itemId="statusId"]');
						statusFiltersCombo.setValue('Select');
						me.statusFiltersCombo = "";						
						me.typeFilterVal = "Select";
					//	me.advFilterData = null;	
						me.filterData =[];
						me.filterApplied = 'Select';
						statusFiltersCombo.reset();
						//me.setDataForFilter();
						me.refreshData();
						//me.setDataForFilter();
						//me.refreshData();
					}
					
					
					
				});