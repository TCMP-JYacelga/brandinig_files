	Ext.define('GCP.controller.UserCategoryController', {
		extend : 'Ext.app.Controller',
		requires : ['GCP.view.CategoryListView','Ext.ux.gcp.PreferencesHandler'],
		views : ['GCP.view.CategoryListView',  'GCP.view.UserCategoryGridView','GCP.view.UserCategoryFilterView'],
		/**
		 * Array of configs to build up references to views on page.
		 */
		refs : [{
					ref : 'categoryListView',
					selector : 'categoryListView'
				},{
					ref : 'groupView',
					selector : 'categoryListView groupView'
				}, {
					ref : 'searchTextField',
					selector : 'categoryListView textfield[itemId="searchTextField"]'
				},{
					ref:'filterView',
					selector:'filterView'	
				},{
					ref:"filterButton",
					selector : "groupView button[itemId=filterButton]"
				},{
					ref : 'userCategoryFilterView',
					selector : 'userCategoryFilterView'
				}, {
					ref : "categoryCodeFltRef",
					selector : 'userCategoryFilterView AutoCompleter[itemId=userNameFilter]'
				}, {
					ref : "corporationCodeFltRef",
					selector : 'userCategoryFilterView combo[itemId=clientCombo]'
				}, {
					ref : "categoryDescFltRef",
					selector : ' userCategoryFilterView AutoCompleter[itemId=userDescriptionFilter]'
				},{
					ref : 'statusFilterRef',
					selector : 'userCategoryFilterView combo[itemId="userCategoryStatusFilter"]'
				},{
					ref : 'corporationCodeAutocompleterRef',
					selector : 'userCategoryFilterView AutoCompleter[itemId="filterClientAutoCmplterCnt"]'
				}
				,{
					ref : 'userCategoryGridView',
					selector : 'categoryListView userCategoryGridView'
				}, {
					ref : 'userCategoryGridDtlView',
					selector : 'categoryListView userCategoryGridView panel[itemId="userCategoryGridDtlView"]'
				}, {
					ref : 'userCategoryGrid',
					selector : 'categoryListView userCategoryGridView smartgrid[itemId="userCategoryListGrid"]'
				}, {
					ref : 'matchCriteria',
					selector : 'categoryListView radiogroup[itemId="matchCriteria"]'
				},/* {
					ref : 'userCategoryActionBar',
					selector : 'userCategoryGridView userCategoryGroupActionBarView[itemId=userCategoryGroupActionBarView]'
				},*/ {
					ref : 'sellerClientMenuBar',
					selector : 'categoryListView userCategoryFilterView container[itemId="sellerClientMenuBar"]'
				}, {
					ref : 'sellerMenuBar',
					selector : 'categoryListView userCategoryFilterView container[itemId="sellerMenuBar"]'
				}, {
					ref : 'clientMenuBar',
					selector : 'categoryListView userCategoryFilterView container[itemId="clientMenuBar"]'
				}, {
					ref : 'nameDescStatusMenuBar',
					selector : 'categoryListView userCategoryFilterView container[itemId="nameDescStatusMenuBar"]'
				}],
		config : {
			filterData : [],
			sellerFilterVal : null,
			corpFilterVal : null,
			corpFilterDesc : null,
			userStatusFltParamName:'requestState',
			userNameFltParamName:'categoryCode',
			userDescriptionFilterParamName:'categoryDesc',
			strDefaultMask : '000000000000000000',
			reportGridOrder : null,
			strPageName:'roleMst',
			preferenceHandler : null,
			userNamePrefCode:null,
			userDescPrefCode:null,
			userNamePrefDesc:null,
			userDescPrefDesc:null,
			userStatusPrefCode:null,
			userStatusPrefDesc:null,
			isSelectCatCode  : false,
			oldCatCode : '',
			oldCatDesc : '',
			isSelectCatDesc : false,
			objLocalData : null,
			firstLoad : false
		},
		/**
		 * A template method that is called when your application boots. It is
		 * called before the Application's launch function is executed so gives a
		 * hook point to run any code before your Viewport is created.
		 */
		init : function() {
			var me = this;
			me.firstLoad = true;
			me.updateConfig();
			if(objSaveLocalStoragePref){
				me.objLocalData = Ext.decode(objSaveLocalStoragePref);
				objQuickPref = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref 
									&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
				
				me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
			
			}
			$(document).on("handleAddNewUserCategory",function(){
				me.handleAddNewUserCategory();
			});
			$(document).on("handleAddNewUserCategoryTT",function(){
				me.handleAddNewUserCategoryTT(actionName);
			});
			$(document).on("handleAddNewUserCategoryTTT",function(){
				me.handleAddNewUserCategoryTTT();
			});
			$(document).on('performReportAction', function(event, actionName) {
				me.downloadReport(actionName);
			});
			//$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			//	me.handleClientChangeInQuickFilter(isSessionClientFilter);
			//});
			$(document).on('savePreference', function(event) {		
							me.handleSavePreferences();
			});
			$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
			});
			$(document).on('performPageSettings', function(event) {
				me.showPageSettingPopup('PAGE');
			});			
			me.control({
				'pageSettingPopUp' : {
					'applyPageSetting' : function(popup, data,strInvokedFrom) {
						me.applyPageSetting(data,strInvokedFrom);
					},
					'savePageSetting' : function(popup, data,strInvokedFrom) {
						me.savePageSetting(data,strInvokedFrom);
					},
					'restorePageSetting' : function(popup, data, strInvokedFrom) {
						me.restorePageSetting(data, strInvokedFrom);
					}
				},			
				'categoryListView' : {
					render : function(panel, opts) {
					}
				},
				'categoryListView groupView' : {
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
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);			
					},
					'gridRender' : me.doHandleLoadGridData,
					'gridPageChange' : me.doHandleLoadGridData,
					'gridSortChange' : me.doHandleLoadGridData,
					'gridPageSizeChange' : me.doHandleLoadGridData,
					'gridColumnFilterChange' : me.doHandleLoadGridData,
					'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
					'gridStateChange' : function(grid) {
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					},
					'toggleGridPager' : function() {
						me.disablePreferencesButton("savePrefMenuBtn",false);
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
					'gridSettingClick' : function() {
						me.showPageSettingPopup('GRID');
					},
					afterrender : function(panel,opts){
					},
					'render' : function() {
						me.firstTime = true;
						me.applyPreferences();
					}
					
				},
				'userCategoryGridView' : {
					render : function(panel, opts) {
						//me.handleSmartGridLoading();
						//me.setFilterRetainedValues();
					}
				},
				'categoryListView textfield[itemId="searchTextField"]' : {
					change : function(btn, opts) {
						me.searchTrasactionChange();
					}
				},
				'categoryListView radiogroup[itemId="matchCriteria"]' : {
					change : function(btn, opts) {
						me.searchTrasactionChange();
					}
				},
				'userCategoryFilterView' : {
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
						var objDetailFilterPanel = me.getUserCategoryFilterView();
						var objAutocompleterName = objDetailFilterPanel
								.down('AutoCompleter[itemId="userNameFilter"]');
						objAutocompleterName.cfgUrl = 'services/userCategory/filter/catNamesList.json';
						// objAutocompleterName.setValue( '' );
						if(Ext.isEmpty(me.corpFilterVal)){
							objAutocompleterName.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});
						}else{
							objAutocompleterName.cfgExtraParams.push({
								key : '$filtercorporation',
								value : me.corpFilterVal
							});
						}
						var objAutocompleterDesc = objDetailFilterPanel
								.down('AutoCompleter[itemId="userDescriptionFilter"]');
						objAutocompleterDesc.cfgUrl = 'services/userCategory/filter/catDescList.json';
						// objAutocompleterDesc.setValue( '' );
	
						if(Ext.isEmpty(me.corpFilterVal)){
							objAutocompleterDesc.cfgExtraParams.push({
								key : '$filtercorporation',
								value : sessionCorporation
							});
						}else{
							objAutocompleterDesc.cfgExtraParams.push({
								key : '$filtercorporation',
								value : me.corpFilterVal
							});
						}
					},
					handleClientChange : function(clientCode, clientDesc, sellerCode){
						me.corpFilterVal = '';
						me.corpFilterVal = isEmpty(clientCode) ? '' : clientCode;
						me.corpFilterDesc = isEmpty(clientDesc) ? '' : clientDesc;
						//me.corpFilterDesc = clientDesc;
						//me.corpFilterVal = clientCode;
						me.sellerFilterVal = !Ext.isEmpty(sellerCode) ? sellerCode : sessionSellerCode;
						//var objFilterPanel = me.getSellerClientMenuBar();
	
						var ObjUserCategoryFilter=me.getUserCategoryFilterView();
						var objAutocompleterName = ObjUserCategoryFilter
								.down('AutoCompleter[itemId="userNameFilter"]');
						var objAutocompleterDesc = ObjUserCategoryFilter
								.down('AutoCompleter[itemId="userDescriptionFilter"]');
	
						//var objFilterPanel = me.getSellerClientMenuBar();
						var cfgArrayName = objAutocompleterName.cfgExtraParams;
						var cfgArrayDesc = objAutocompleterDesc.cfgExtraParams;
	
						if (cfgArrayName) {
							$.each(cfgArrayName, function(i, v) {
								$.each(v, function(innerKey, innerValue) {
											if (innerValue == '$filtercorporation') {
												v.value = !isEmpty(clientCode) ? clientCode : '';
											}
										})
							});
						} else {
							cfgArrayName.push({
										key : '$filtercorporation',
										value : !isEmpty(clientCode) ? clientCode : ''
									});
						}
	
						if (cfgArrayDesc) {
							$.each(cfgArrayDesc, function(i, v) {
								$.each(v, function(innerKey, innerValue) {
											if (innerValue == '$filtercorporation') {
												v.value = !isEmpty(clientCode) ? clientCode : '';
											}
										})
							});
						} else {
							cfgArrayDesc.push({
										key : '$filtercorporation',
										value : !isEmpty(clientCode) ? clientCode : ''
									});
						}
	
						objAutocompleterName.cfgUrl = 'services/userCategory/filter/catNamesList.json';
						// objAutocompleterName.setValue( '' );
						objAutocompleterName.cfgExtraParams = cfgArrayName;
	
						objAutocompleterDesc.cfgUrl = 'services/userCategory/filter/catDescList.json';
						// objAutocompleterDesc.setValue( '' );
						objAutocompleterDesc.cfgExtraParams = cfgArrayDesc;
						me.applySeekFilter();
	
					},
					render : function(panel, opts) {
						me.setInfoTooltip();
					}
				},
				'userCategoryFilterView AutoCompleter[itemId="userNameFilter"]' : {
					select : function(combo, record, index) {
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
						me.isSelectCatCode = true;
					},
					change : function(combo, record, index, oldVal) {
						me.oldCatCode = oldVal;
						if (record == null) {
							me.applySeekFilter();
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);
							me.isSelectCatCode  = true;	
							me.oldCatCode = "";
						}
					},
					keyup : function(combo, e, eOpts){
						me.isSelectCatCode = false;
					},
					blur : function(combo, record){
						if (me.isSelectCatCode == false && me.oldCatCode != combo.getRawValue()){
							me.applySeekFilter();
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);
						}
						me.oldCatCode = combo.getRawValue();
					},
					boxready : function(combo, width, height, eOpts) { 
						var me = this;
						if (!Ext.isEmpty(me.userNamePrefCode)) {
							combo.setValue(me.userNamePrefCode);
							combo.setRawValue(me.userNamePrefDesc);
						}
						else
							combo.setValue(combo.getStore().getAt(0));
					}
				},
				'userCategoryFilterView AutoCompleter[itemId="userDescriptionFilter"]' : {
					select : function(combo, record, index) {
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
						me.isSelectCatDesc = true;
					},
					change : function(combo, record, index, oldVal) {
						me.oldCatDesc = oldVal;
						if (record == null) {
							me.applySeekFilter();
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);
							me.isSelectCatDesc  = true;	
							me.oldCatDesc = "";
						}
					},
					keyup : function(combo, e, eOpts){
						me.isSelectCatDesc = false;
					},
					blur : function (combo,record){
						if (me.isSelectCatDesc == false && me.oldCatDesc != combo.getRawValue()){
							me.applySeekFilter();
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);
						}
						me.oldCatDesc = combo.getRawValue();
					}
				},
				'userCategoryFilterView  combo[itemId="userCategoryStatusFilter"]' : {
					'select' : function(combo,selectedRecords) {
						combo.isQuickStatusFieldChange = true;
					},
					'blur':function(combo,record){
						if(combo.isQuickStatusFieldChange)
							me.handleStatusFilterClick(combo);
					},
					'boxready' : function(combo, width, height, eOpts){
						if (!Ext.isEmpty(me.userStatusPrefDesc) && me.userStatusPrefDesc != 'All' && me.userStatusPrefDesc != 'all' && 
							!Ext.isEmpty(me.userStatusPrefCode) && me.userStatusPrefCode != 'All' && me.userStatusPrefCode != 'all') {
							var tempArr = new Array();
							tempArr = me.userStatusPrefCode.split(",");
							if(!Ext.isEmpty(tempArr)){
							me.statusFilterVal = 'all';
							combo.setValue(tempArr);
							combo.selectedOptions = tempArr;
							}
							else{
								combo.setValue(tempArr);
								me.statusFilterVal = '';
							}
						}
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
		handleStatusFilterClick : function(combo) {
			var me = this;
			combo.isQuickStatusFieldChange = false;
			me.userStatusPrefCode = combo.getSelectedValues();
			me.userStatusPrefDesc = combo.getRawValue();
			me.setDataForFilter();
			me.applyFilter();
		},	
		setDataForFilter : function() {
			var me = this;
			this.filterData = me.getFilterQueryJson();
		},
		handleSmartGridLoading : function() {
			var me = this;
			me.loadSmartGrid();
			/*
			 * var me = this; var grid = me.getPmtGrid(); if (Ext.isEmpty(grid)) {
			 * me.loadSmartGrid(); } else { me.handleLoadGridData(grid,
			 * grid.store.dataUrl, grid.pageSize, 1, 1, null); }
			 */
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
		applyPageSetting : function(arrPref,strInvokedFrom) {
			var me = this, args = {};;
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
				}else{
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
						me.postHandlePageGridSetting, null, me, false);
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
						me.postHandlePageGridSetting, args, me, false);
			}else{
					me.handleClearLocalPrefernces();
					me.preferenceHandler.clearPagePreferences(me.strPageName, null,
							me.postHandlePageGridSetting, null, me, false);
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
						}
					// TODO : Preferences and existing column model need to be
					// merged
					objGroupView.reconfigureGrid(gridModel);
				}else{
					window.location.reload();
				}
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
		showPageSettingPopup : function(strInvokedFrom) {
			var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
			var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;
	
			me.pageSettingPopup = null;
	
			if (!Ext.isEmpty(objPreference)) {
				objPrefData = Ext.decode(objPreference);
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
			objData["filterUrl"] = 'services/userfilterslist/' +me.strPageName;
			objData["rowPerPage"] = _AvailableGridSize;
			objData["groupByVal"] = objGroupByVal;
			objData["filterVal"] = objDefaultFilterVal;
			objData["gridSizeVal"] = objGridSizeVal;
			objData["rowPerPageVal"] = objRowPerPageVal;
			subGroupInfo = objGroupView.getSubGroupInfo() || {};
			strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
						"Column Settings")
						+ ' : ' + (subGroupInfo.groupDescription || '') : getLabel(
						"Settings", "Settings"));
			me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
						cfgPopUpData : objData,
						cfgGroupView : objGroupView,
						cfgDefaultColumnModel : objColumnSetting,
						cfgViewOnly : _IsEmulationMode,
						cfgInvokedFrom : strInvokedFrom,
						title : strTitle
						//,cfgHideGroupBy : true
					});
			me.pageSettingPopup.show();
			me.pageSettingPopup.center();
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
			var userCategoryFilterView = me.getUserCategoryFilterView();
			if(!Ext.isEmpty(objData))
				strFieldName = objData.paramName || objData.field;
				
			
			if (strFieldName === 'corporationDesc'
					&& !Ext.isEmpty(me.getCorporationCodeFltRef())) {
				me.getCorporationCodeFltRef().setValue('');
				me.resetCorporationFIlter();
				if (!isClientUser()) {
					var clientAutocompleter = me.getUserCategoryFilterView()
							.down('AutoCompleter[itemId="clientAutoCompleter]');
					clientAutocompleter.reset();
				}
			}
				
			if (strFieldName ==='categoryCode' && !Ext.isEmpty(me.getCategoryCodeFltRef())) {
				me.getCategoryCodeFltRef().setValue('');
			}
			if (strFieldName ==='categoryDesc' && !Ext.isEmpty(me.getCategoryDescFltRef())) {
				me.getCategoryDescFltRef().setValue('');
			}
			if(strFieldName === 'requestState'){
				var statusFltId = userCategoryFilterView
				.down('combo[itemId=userCategoryStatusFilter]');
				statusFltId.reset();
				me.userStatusPrefCode = 'all';
				statusFltId.selectAllValues();
			}
			
		},	
		
		
		/*Page setting handling ends here*/	
		getFilterQueryJson : function() {
			var me = this;
			var userNameVal = null, statusVal = null, moduleVal = null, categoryVal = null, subCategoryVal = null, jsonArray = [], clientVal = null, sellerVal = null;
	
			var userCategoryFilterView = me.getUserCategoryFilterView();
			if(Ext.isEmpty(userCategoryFilterView)){
				userNameVal=me.userNamePrefCode
				categoryVal=me.userDescPrefCode;
				statusVal=me.userStatusPrefCode;
			/*	if(undefined != strClientDesc && strClientDesc != ''){
					me.corpFilterDesc=strClientDesc;
					}*/
			}else{
				var userNameFltId = userCategoryFilterView
					.down('AutoCompleter[itemId=userNameFilter]');
	
	
				var userDescriptionFilter = userCategoryFilterView
					.down('AutoCompleter[itemId=userDescriptionFilter]');
					
				if (!Ext.isEmpty(userNameFltId)
					&& !Ext.isEmpty(userNameFltId.getValue())) {
					userNameVal = userNameFltId.getValue().toUpperCase();
				}
	
	
				if (!Ext.isEmpty(userDescriptionFilter)
						&& !Ext.isEmpty(userDescriptionFilter.getValue())) {
					categoryVal = userDescriptionFilter.getValue().toUpperCase();
				}	
			}
			
			var objOfCreateNewFilter = me.getSellerClientMenuBar();
	
			var corpDesc = me.corpFilterDesc;
			var corpVal = me.corpFilterVal;
	
			if (!Ext.isEmpty(corpDesc)) {
				corpDesc = corpDesc.toUpperCase();
			}
	
			if (!Ext.isEmpty(corpVal)) {
				corpVal = corpVal.toUpperCase();
			}
	
			if (!Ext.isEmpty(me.sellerFilterVal)) {
				sellerVal = me.sellerFilterVal;
			}
			if (!Ext.isEmpty(corpDesc)  && !Ext.isEmpty(corpVal) && corpDesc !== 'All') {
				jsonArray.push({
							paramName : 'corporationDesc',
							operatorValue : 'lk',
							paramValue1 : encodeURIComponent(corpDesc.replace(new RegExp("'", 'g'), "\''")),
							paramFieldLable : getLabel('corporation', 'Company Name'),
							dataType : 'S',
							displayType : 5,
							displayValue1 : corpDesc,
							codeValue1 : corpVal
						});
			}
	
			jsonArray=me.getQuickFilterQuery(userNameVal,categoryVal,statusVal,jsonArray);
			return jsonArray;
		},
		getQuickFilterQuery:function(userNameVal,userDescVal,statusVal,jsonArray){	
			var me=this;
			var statusFilterValArray = [];
			var statusFilterDiscArray = [];
			//User Name Query
			//var strStatusDesc = me.getStatusFilter();
			var statusFilterVal = me.userStatusPrefCode;
			var statusFilterDisc = me.userStatusPrefDesc;
			if (!Ext.isEmpty(userNameVal)) {
				jsonArray.push({
							paramName : me.userNameFltParamName,
							paramValue1 : encodeURIComponent(userNameVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S',
							paramFieldLable : getLabel("code", "Role"),
	                        displayType : 5,
	                        displayValue1 : userNameVal								
						});
			}
			
			//User Description Query
			if (userDescVal != null) {
				jsonArray.push({
							paramName : me.userDescriptionFilterParamName,
							paramValue1 : encodeURIComponent(userDescVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S',
							paramFieldLable : getLabel("description", "Description"),
	                        displayType : 5,
	                        displayValue1 : userDescVal
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
		/*loadSmartGrid : function(data) {
			var me = this;
			var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
			var userCategoryGrid = null;
	
			var objWidthMap = {
				"corporationDesc" : 120,
				"categoryCode" : 80,
				"categoryDesc" : 110,
				"userCount" : 90,
				"brEnable" : 60,
				"paymentEnable" : 100,
				"incomingAchEnable" : 115,
				"incomingWireEnable" : 120,
				"positivePayEnable" : 105,
				"checksEnable" : 100,
				"adminEnable" : 100,
				"clientStatus" : 100,
				"fscEnable" : 100,
				"forecastEnable" : 100,
				"tradeEnable" : 100,
				"lmsEnable" : 100,
				"fscEnable" : 100
			};
	
			var gridCols = [{
						"colId" : "corporationDesc",
						"colDesc" : "Corporation"
					}, {
						"colId" : "categoryCode",
						"colDesc" : "Name"
					}, {
						"colId" : "categoryDesc",
						"colDesc" : "Description"
					}];
			if (entity_type === '1')
			{
				 gridCols.shift();
			}
	
			if (brEnable == 'Y') {
				gridCols.push({
							"colId" : "brEnable",
							"colDesc" : "BR"
						});
			}
			if (paymentEnable == 'Y') {
				gridCols.push({
							"colId" : "paymentEnable",
							"colDesc" : "Payment"
						});
			}
			if (incomingAchEnable == 'Y') {
				gridCols.push({
							"colId" : "incomingAchEnable",
							"colDesc" : "Incoming ACH"
						});
			}
			if (incomingWireEnable == 'Y') {
				gridCols.push({
							"colId" : "incomingWireEnable",
							"colDesc" : "Incoming Wires"
						});
			}
			if (positivePayEnable == 'Y') {
				gridCols.push({
							"colId" : "positivePayEnable",
							"colDesc" : "Positive Pay"
						});
			}
			if (checksEnable == 'Y') {
				gridCols.push({
							"colId" : "checksEnable",
							"colDesc" : "Checks"
						});
			}
			if (adminEnable == 'Y') {
				gridCols.push({
							"colId" : "adminEnable",
							"colDesc" : "Admin"
						});
			}
			if (fscEnable == 'Y') {
				gridCols.push({
							"colId" : "fscEnable",
							"colDesc" : "FSC"
						});
			}
			if (forecastEnable == 'Y') {
				gridCols.push({
							"colId" : "forecastEnable",
							"colDesc" : "Forecast"
						});
			}
			if (tradeEnable == 'Y') {
				gridCols.push({
							"colId" : "tradeEnable",
							"colDesc" : "eTrade"
						});
			}
			if (lmsEnable == 'Y') {
				gridCols.push({
							"colId" : "lmsEnable",
							"colDesc" : "Liquidity"
						});
			}
			if (limitEnable == 'Y') {
				gridCols.push({
							"colId" : "limitEnable",
							"colDesc" : "Limit"
						});
			}
	
			gridCols.push({
						"colId" : "requestStateDesc",
						"colDesc" : "Status"
					});
			
			objPref = {
				"pgSize" : "5",
				"gridCols" : gridCols
			};
	
			arrColsPref = objPref.gridCols;
			arrCols = me.getColumns(arrColsPref, objWidthMap);
			pgSize = !Ext.isEmpty(objPref.pgSize) ? parseInt(objPref.pgSize) : 100;
	
			userCategoryGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'userCategoryListGrid',
						itemId : 'userCategoryListGrid',
						pageSize : _GridSizeMaster,
						stateful : false,
						padding : '0 10 10 10',
						showEmptyRow : false,
						rowList : _AvailableGridSize,
						minHeight : 100,
						columnModel : arrCols,
						storeModel : {
	
							fields : ['identifier', 'categoryCode', 'categoryDesc',
									'userCount', 'brEnable', 'paymentEnable',
									'incomingAchEnable', 'incomingWireEnable',
									'positivePayEnable', 'checksEnable',
									'adminEnable', 'clientStatus', '__metadata',
									'lmsEnable', 'requestStateDesc', 'fscEnable',
									'forecastEnable', 'tradeEnable', 'isSubmitted',
									'history', 'limitEnable', 'corporationDesc'],
							proxyUrl : 'services/userCategoryList.json',
							rootNode : 'd.userAdminList',
							totalRowsNode : 'd.__count'
						},
						isRowIconVisible : me.isRowIconVisible,
	
						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex, columnIndex,
									btn, event, record);
						},
						handleMoreMenuItemClick : function(grid, rowIndex,
								cellIndex, menu, event, record) {
							me.handleMoreMenuItemClick(grid, rowIndex, cellIndex,
									menu, event, record);
						},
	
						handleRowMoreMenuItemClick : function(menu, event) {
							var dataParams = menu.ownerCt.dataParams;
						}
	
					});
	
			var userCategoryGridDtlView = me.getUserCategoryGridDtlView();
			if (!Ext.isEmpty(userCategoryGridDtlView)) {
				userCategoryGridDtlView.add(userCategoryGrid);
				userCategoryGridDtlView.doLayout();
			}
		},*/
		/*handleGroupActions : function(btn, opts, record) {
			var me = this;
			var strAction = !Ext.isEmpty(btn.actionName)
					? btn.actionName
					: btn.itemId;
			var strUrl = Ext.String.format('services/userCategory/{0}.json',
					strAction);
			if (strAction === 'reject') {
				me.showRejectPopUp(strAction, strUrl, record);
	
			} else {
				me.preHandleGroupActions(strUrl, '', record);
			}
		},*/
		handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event,
				record) {
			var me = this;
			var dataParams = null;
			if (!Ext.isEmpty(menu.dataParams))
				dataParams = menu.dataParams;
			if (!Ext.isEmpty(dataParams))
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
		},
		/*handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
				record) {
			var me = this;
			var actionName = btn.itemId;
	
			if (actionName === 'submit' || actionName === 'discard'
					|| actionName === 'accept' || actionName === 'reject'
					|| actionName === 'enable' || actionName === 'disable')
				me.handleGroupActions(btn, null, record);
			else if (actionName === 'btnHistory') {
				var recHistory = record.get('history');
				if (!Ext.isEmpty(recHistory)
						&& !Ext.isEmpty(recHistory.__deferred.uri)) {
					me.showHistory(record.get('usrCode'),
							record.get('history').__deferred.uri, record
									.get('identifier'));
				}
			} else if (actionName === 'btnView' || actionName === 'btnEdit'
					|| actionName === 'btnClone'
					|| actionName === 'btnCloneTemplate') {
				var updateIndex = rowIndex;
				var strUrl = '', objFormData = {};
				if (actionName === 'btnView')
					strUrl = 'viewUserAdminCategory.form';
				else if (actionName === 'btnEdit')
					strUrl = 'editUserAdminCategory.form';
				else if (actionName === 'btnClone')
					strUrl = 'cloneCategory.form';
				else if (actionName === 'btnCloneTemplate')
					strUrl = 'editCategoryTemplate.form';
	
				objFormData.viewState = record.data.identifier;
	
				if (actionName === 'btnView' || actionName === 'btnEdit') {
					if (!Ext.isEmpty(strUrl)) {
						me.doSubmitForm(strUrl, objFormData);
					}
	
				} else if (actionName === 'btnClone'
						|| actionName === 'btnCloneTemplate') {
					var strActionUrl = Ext.String.format(
							'services/userCategory/{0}.json',
							(actionName === 'btnClone')
									? 'clone'
									: 'copytotemplate');
					var jsonPost = [{
								serialNo : 1,
								identifier : objFormData.viewState,
								userMessage : ''
							}];
	
					Ext.Ajax.request({
						url : strActionUrl,
						method : 'POST',
						jsonData : Ext.encode(jsonPost),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data) && data.d
									&& data.d.instrumentActions) {
								var result = data.d.instrumentActions[0];
								if (result) {
									if (result.success === 'Y') {
										objFormData.viewState = result.identifier;
										me.doSubmitForm(strUrl, objFormData);
									} else if (result.success === 'N') {
										Ext.MessageBox.show({
													title : getLabel(
															'instrumentErrorPopUpTitle',
															'Error'),
													msg : getLabel(
															'instrumentErrMsg',
															'Unable to perform action..'),
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
	
									}
								}
	
							}
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
						}
					});
	
				}
			}
		},*/
		doSubmitForm : function(strUrl, formData) {
			var me = this;
			var form = null;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
					formData.viewState));
			
			me.setFilterParameters(form);
			
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		viewUserCategoryForm : function(strUrl, formData) {
			var me = this;
			var form = null;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'roleId',
					formData.roleId));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'corpId',
					formData.corpId));
			
			me.setFilterParameters(form);
			
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		showHistory : function(usrCode, url, id) {
		var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
						historyUrl : url,
						usrCode : usrCode,
						identifier : id
					}).show();
		historyPopup.center();			
		setTimeout(function() { autoFocusOnFirstElement(null, 'roleHistoryPopup', true); }, 50);
		},
		createFormField : function(element, type, name, value) {
			var inputField;
			inputField = document.createElement(element);
			inputField.type = type;
			inputField.name = name;
			inputField.value = value;
			return inputField;
		},
		showRejectPopUp : function(strAction, strActionUrl,grid, record) {
			var me = this;
			var titleMsg = '', fieldLbl = '';
			if (strAction === 'reject') {
				fieldLbl = getLabel('enterRejectRemark',
						'Please Enter Reject Remark');
				titleMsg = getLabel('rejectRemark',
						'Reject Remark');
			}
			var msgbox = Ext.Msg.show({
						title : titleMsg,
						msg : fieldLbl,
						buttons : Ext.Msg.OKCANCEL,
						multiline : 4,
						cls : 't7-popup',
						width : 355,
						height : 270,
						bodyPadding : 0,
	                    buttonText: {
	                        ok: getLabel('btnOk','Ok'),
	                        cancel: getLabel('btnCancel','Cancel')
	                    },
						fn : function(btn, text) {
							if (btn == 'ok') {
								if(Ext.isEmpty(text))
								{
									//Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
                                    Ext.MessageBox.show({
                                        title : getLabel('errorTitle','Error'),
                                        msg : getLabel('rejectRestrictionErroMsg', 'Reject Remark field can not be blank'),
                                        buttons : Ext.MessageBox.OK,
                                        cls : 'ux_popup',
                                        icon : Ext.MessageBox.ERROR,
                                        buttonText: {
                                            ok: getLabel('btnOk','Ok')
                                        }
                                    });
								}
								else
								{
									me.preHandleGroupActions(strActionUrl, text, grid, record);
								}
							}
						}
					});
			msgbox.textArea.enforceMaxLength = true;
			msgbox.textArea.inputEl.set({
				maxLength : 255
			});
		},
		/*preHandleGroupActions : function(strUrl, remark, record) {
	
			var me = this;
			var grid = this.getUserCategoryGrid();
	
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = grid.getSelectedRecords();
				records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
						? records
						: [record];
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
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions('000000000000000000');
								grid.refreshData();
								me.applyFilter();
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
	
		},*/
		/*handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
			var me = this;
			var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
			if (!Ext.isEmpty(me.getFilterUrl())) {
				strUrl = strUrl + me.getFilterUrl();
			}
			grid.loadGridData(strUrl, null);
		},*/
		/*getColumns : function(arrColsPref, objWidthMap) {
			var me = this;
			var arrCols = new Array(), objCol = null, cfgCol = null;
			arrCols.push(me.createGroupActionColumn());
			arrCols.push(me.createActionColumn());
			if (!Ext.isEmpty(arrColsPref)) {
				for (var i = 0; i < arrColsPref.length; i++) {
					objCol = arrColsPref[i];
					cfgCol = {};
					cfgCol.colHeader = objCol.colDesc;
					cfgCol.colId = objCol.colId;
					if (!Ext.isEmpty(objCol.colType))
						cfgCol.colType = objCol.colType;
	
					cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
							? objWidthMap[objCol.colId]
							: 120;
					if (objCol.colId === 'amount' || objCol.colId === 'count')
						cfgCol.align = 'right';
	
					if (objCol.colHidden === true) {
						cfgCol.hideable = true;
						cfgCol.hidden = true;
					}
	
					cfgCol.fnColumnRenderer = me.columnRenderer;
					arrCols.push(cfgCol);
				}
			}
			return arrCols;
		},*/
		/*columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
			var me = this;
			var strRetValue = "";
			if (colId === 'col_brEnable' || colId === 'col_brEnable'
					|| colId === 'col_paymentEnable'
					|| colId === 'col_incomingAchEnable'
					|| colId === 'col_incomingWireEnable'
					|| colId === 'col_positivePayEnable'
					|| colId === 'col_checksEnable' || colId === 'col_adminEnable'
					|| colId === 'col_fscEnable' || colId === 'col_forecastEnable'
					|| colId === 'col_tradeEnable' || colId === 'col_lmsEnable'
					|| colId === 'col_limitEnable') {
				if (value == "Y")
					strRetValue = "Yes";
				else if (value == "N")
					strRetValue = "No";
			} else
				strRetValue = value;
			return strRetValue;
		},*/
		/*isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
			var maskSize = 10;
			var maskArray = new Array();
			var actionMask = '';
			var rightsMap = record.data.__metadata.__rightsMap;
			var buttonMask = '';
			var retValue = true;
			var bitPosition = '';
			if (!Ext.isEmpty(maskPosition)) {
				bitPosition = parseInt(maskPosition) - 1;
				maskSize = maskSize;
			}
			if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
				buttonMask = jsonData.d.__buttonMask;
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
			actionMask = doAndOperation(maskArray, maskSize);
	
			var isSameUser = true;
			if (record.raw.makerId === LOGGEDINUSER) {
				isSameUser = false;
			}
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
	
			if ((maskPosition === 6 && retValue)) {
				retValue = retValue && isSameUser;
			} else if (maskPosition === 7 && retValue) {
				retValue = retValue && isSameUser;
			} else if (maskPosition === 2 && retValue) {
				var reqState = record.raw.requestState;
				var submitFlag = record.raw.isSubmitted;
				var validFlag = record.raw.validFlag;
				var isDisabled = (reqState === 3 && validFlag == 'N');
				var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
				retValue = retValue && (!isDisabled) && (!isSubmitModified);
			} else if (maskPosition === 10 && retValue) {
				var submitFlag = record.raw.isSubmitted;
				var reqState = record.raw.requestState;
				retValue = retValue
						&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
			} else if (maskPosition === 8 && retValue) {
				var validFlag = record.raw.validFlag;
				var reqState = record.raw.requestState;
				retValue = retValue && (reqState == 3 && validFlag == 'N');
			} else if (maskPosition === 9 && retValue) {
				var validFlag = record.raw.validFlag;
				var reqState = record.raw.requestState;
				retValue = retValue && (reqState == 3 && validFlag == 'Y');
			}
			return retValue;
		},*/
	
		/*enableValidActionsForGrid : function(grid, record, recordIndex,
				selectedRecords, jsonData) {
			var me = this;
			var buttonMask = '0000000000';
			var maskArray = new Array(), actionMask = '', objData = null;;
	
			if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
				buttonMask = jsonData.d.__buttonMask;
			}
			var isSameUser = true;
			var isDisabled = false;
			var isSubmitted = false;
			maskArray.push(buttonMask);
			for (var index = 0; index < selectedRecords.length; index++) {
				objData = selectedRecords[index];
				maskArray.push(objData.get('__metadata').__rightsMap);
				if (objData.raw.makerId === LOGGEDINUSER) {
					isSameUser = false;
				}
				if (objData.raw.validFlag != 'Y') {
					isDisabled = true;
				}
				if (objData.raw.isSubmitted != null
						&& objData.raw.isSubmitted == 'Y'
						&& objData.raw.requestState != 8
						&& objData.raw.requestState != 4
						&& objData.raw.requestState != 5) {
					isSubmitted = true;
				}
			}
			actionMask = doAndOperation(maskArray, 10);
			me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
					isSubmitted);
		},*/
		enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
				isSubmitted) {
			var me = this;
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
									blnEnabled = blnEnabled
											&& (isSubmitted != undefined && !isSubmitted);
								}
								item.setDisabled(!blnEnabled);
							}
						});
			}
		},
		/*createActionColumn : function() {
			var me = this;
			var objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				items : [{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel('editToolTip', 'Edit'),
							maskPosition : 2
						}, {
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record'),
							maskPosition : 3
						}, {
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel('historyToolTip', 'View History'),
							maskPosition : 4
						}]
			};
			return objActionCol;
		},*/
		/*createGroupActionColumn : function() {
			var me = this;
	
			var objActionCol = {
				colId : 'actioncontent',
				colType : 'actioncontent',
				width : 120,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				items : [{
							text : getLabel('userMstActionSubmit', 'Submit'),
							itemId : 'submit',
							actionName : 'submit',
							maskPosition : 5
						}, {
							text : getLabel('userMstActionDiscard', 'Discard'),
							itemId : 'discard',
							actionName : 'discard',
							maskPosition : 10
						}, {
							text : getLabel('userMstActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 6
						}, {
							text : getLabel('userMstActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 7
						}, {
							text : getLabel('userMstActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 8
						}, {
							text : getLabel('userMstActionDisable', 'Disable'),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 9
						}]
			};
			return objActionCol;
		},*/
		searchTrasactionChange : function() {
			var me = this;
			var searchValue = me.getSearchTextField().value;
			var anyMatch = me.getMatchCriteria().getValue();
			if ('anyMatch' === anyMatch.searchOnPage) {
				anyMatch = false;
			} else {
				anyMatch = true;
			}
	
			var grid = me.getUserCategoryGrid();
			grid.view.refresh();
	
			// detects html tag
			var tagsRe = /<[^>]*>/gm;
			// DEL ASCII code
			var tagsProtect = '\x0f';
			// detects regexp reserved word
			var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
	
			if (searchValue !== null) {
				searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));
	
				if (!Ext.isEmpty(grid)) {
					var store = grid.store;
	
					store.each(function(record, idx) {
						var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
						while (td) {
							cell = td.down('.x-grid-cell-inner');
							matches = cell.dom.innerHTML.match(tagsRe);
							cellHTML = cell.dom.innerHTML.replace(tagsRe,
									tagsProtect);
	
							if (cellHTML === '&nbsp;') {
								td = td.next();
							} else {
								// populate indexes array, set currentIndex, and
								// replace
								// wrap matched string in a span
								cellHTML = cellHTML.replace(searchRegExp, function(
												m) {
											return '<span class="xn-livesearch-match">'
													+ m + '</span>';
										});
								// restore protected tags
								Ext.each(matches, function(match) {
									cellHTML = cellHTML.replace(tagsProtect, match);
								});
								// update cell html
								cell.dom.innerHTML = cellHTML;
								td = td.next();
							}
						}
					}, me);
				}
			}
		},
		applyFilter : function() {
			var me = this;
			/*var grid = me.getUserCategoryGrid();
			if (!Ext.isEmpty(grid)) {
				var strDataUrl = grid.store.dataUrl;
				var store = grid.store;
				var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
						store.sorters);
				strUrl = strUrl + me.getFilterUrl();
				grid.setLoading(true);
				grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
			}*/
			var objGroupView = me.getGroupView();
			var groupInfo = objGroupView.getGroupInfo();
			me.refreshData();
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
					case 'statusFilterOp' :
						var objValue = filterData[index].paramValue1;
						var objArray = objValue.split(',');
						if( objArray.length >= 1 )
						{
							strTemp = strTemp + "(";
						}
						for (var i = 0; i < objArray.length; i++) {
								if(objArray[i] == 12){
									strTemp = strTemp + "(requestState eq '0' and isSubmitted eq 'Y')";
								}
								else if(objArray[i] == 14){
									strTemp = strTemp + "(requestState eq '1' and isSubmitted eq 'Y')";
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
		applySeekFilter : function() {
			var me = this;
			me.setDataForFilter();
			me.filterApplied = 'Q';
			me.applyFilter();
		},
		handleAddNewUserCategory : function() {
			var me = this;
	
			$('#confirmMsgPopup').dialog({
				autoOpen : false,
				title: 'Warning',
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false,
				open: function() {
					  var msg = ' This feature is deprecated. Please use Create New Role TT45. Do you want to continue ?';
					  $(this).html(msg);
				},
				buttons : {
					"Yes" : function() {
						var strCorpCode = ' ' , strCorpDesc =' ' ;
						
						if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
								strCorpCode = me.corpFilterVal;
						if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
							strCorpDesc = me.corpFilterDesc;
						
						var strUrl = "addUserAdminCategory.form";
						var form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'selectedSeller', me.sellerFilterVal));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'selectedCorpCode', strCorpCode));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'selectedCorpDesc', !isEmpty(strCorpCode) ?  strCorpDesc : ''));
						form.action = strUrl;
						
						me.setFilterParameters(form);
						
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},
					"No" : function() {
						$(this).dialog("close");
					}
				}
			});
			$( '#confirmMsgPopup' ).dialog( 'open' );
			
		},
		handleAddNewUserCategoryTT : function(actionName) {
			var me = this;
			var strCorpCode = ' ' , strCorpDesc =' ' ;
			
			if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
					strCorpCode = me.corpFilterVal;
			if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
				strCorpDesc = me.corpFilterDesc;
			if(actionName === 'btnEdit'){
				var strUrl = "editRoleManager.form";
			}
			else if(actionName === 'btnView'){
				var strUrl = "viewRoleManager.form";
			}
				
			var form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedSeller', me.sellerFilterVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedCorpCode', strCorpCode));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedCorpDesc', !isEmpty(strCorpCode) ?  strCorpDesc : ''));
			form.action = strUrl;
			
			me.setFilterParameters(form);
			
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		handleAddNewUserCategoryTTT : function() {
			var me = this;
			var strCorpCode = ' ' , strCorpDesc =' ' ;
			
			if (!Ext.isEmpty(me.corpFilterVal) && me.corpFilterVal != undefined)
					strCorpCode = me.corpFilterVal;
			if (!Ext.isEmpty(me.corpFilterDesc) && me.corpFilterDesc != undefined)
				strCorpDesc = me.corpFilterDesc;
	
			var strUrl = "addRoleManager.form";
				
			var form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedSeller', me.sellerFilterVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedCorpCode', strCorpCode));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'selectedCorpDesc', !isEmpty(strCorpCode) ?  strCorpDesc : ''));
			form.action = strUrl;
			
			me.setFilterParameters(form);
			
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		/* Function sets the filter Panel element values in JSON */
		setFilterParameters : function(form) {
			var me = this;
			var arrJsn = {};
			var userNameVal, statusVal, categoryVal, sellerVal;
			var userCategoryFilterView = me.getUserCategoryFilterView();
			
			if(Ext.isEmpty(userCategoryFilterView)){
				userNameVal=me.userNamePrefCode;
				categoryVal=me.userDescPrefCode;
			}else{
				var userNameFltId = userCategoryFilterView
						.down('AutoCompleter[itemId=userNameFilter]');
			
				var userDescriptionFilter = userCategoryFilterView
						.down('AutoCompleter[itemId=userDescriptionFilter]');
				
				var objOfCreateNewFilter = me.getSellerClientMenuBar();
		
				if (!Ext.isEmpty(userNameFltId)
						&& !Ext.isEmpty(userNameFltId.getValue())) {
					    userNameVal = userNameFltId.getValue().toUpperCase();
				}
				if (!Ext.isEmpty(userDescriptionFilter)
						&& !Ext.isEmpty(userDescriptionFilter.getValue())) {
					categoryVal = userDescriptionFilter.getValue().toUpperCase();
				}
			}
			var corpDesc = me.corpFilterDesc;
			var corpVal = me.corpFilterVal;
			if (!Ext.isEmpty(corpDesc)) {
				corpDesc = corpDesc.toUpperCase();
			}
			if (!Ext.isEmpty(corpVal)) {
				corpVal = corpVal.toUpperCase();
			}
			if (!Ext.isEmpty(me.sellerFilterVal)) {
				sellerVal = me.sellerFilterVal;
			}
			
			arrJsn['categoryCode'] = userNameVal;
			arrJsn['categoryDesc'] = categoryVal;
			arrJsn['corporationDesc'] = corpDesc;
			arrJsn['corporationCode'] = corpVal;
			
			arrJsn['sellerCode'] = sellerVal;
			
	
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
					Ext.encode(arrJsn)));
		},
		
		setFilterRetainedValues : function() {	
			var me = this;
			var userCategoryFilterView = me.getUserCategoryFilterView();
			
			var userNameFltId = userCategoryFilterView
			.down('AutoCompleter[itemId=userNameFilter]');
			userNameFltId.setValue(me.userNamePrefCode);
			
			var userDescriptionFilter = userCategoryFilterView
			.down('AutoCompleter[itemId=userDescriptionFilter]');
			userDescriptionFilter.setValue(me.userDescPrefCode);
			
			var userStatusFilter = userCategoryFilterView
			.down('combo[itemId=userCategoryStatusFilter]');
			if(!Ext.isEmpty(me.userStatusPrefCode)&&!Ext.isEmpty(me.userStatusPrefDesc)){
				userStatusFilter.store.loadRawData([{
							"name" : me.userStatusPrefCode,
							"value" : me.userStatusPrefDesc
						}]
		
				);
				userStatusFilter.setValue(me.userStatusPrefCode);
				userStatusFilter.setRawValue(me.userStatusPrefDesc);
			}
			
			var objOfCreateNewFilter = me.getSellerClientMenuBar();
			var clientCodesFltId;
			if (!isClientUser()) {
				clientCodesFltId = userCategoryFilterView
					.down('combobox[itemId=clientAutoCompleter]');
				if(undefined != strClientDesc && strClientDesc != ''){		
					clientCodesFltId.store.loadRawData({
										"d" : {
											"preferences" : [{
														"CODE" : strClientId,
														"DESCR" : strClientDesc
													}]
										}
									});
		
					clientCodesFltId.suspendEvents();
					clientCodesFltId.setValue(strClientId);
					clientCodesFltId.resumeEvents();
					me.clientCode = strClientId;
					me.corpFilterDesc = strClientDesc;
					
				}else{
					me.clientCode = 'all';			
				}
				
			} else {
				clientCodesFltId = userCategoryFilterView
					.down('combo[itemId="clientCombo"]');
				if(undefined != strClientDesc && strClientDesc != ''){	
					clientCodesFltId.setRawValue(strClientDesc);
					me.clientCode = strClientId;
					me.corpFilterDesc = strClientDesc;				
				}	
				else{	
					clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
					me.clientCode = 'all';
				}
			}
			me.setDataForFilter();
			//me.applyFilter();
			
		},
		setInfoTooltip : function() {
			var me = this;
			var infotip = Ext.create('Ext.tip.ToolTip', {
						target : 'imgFilterInfoGridView',
						listeners : {						
							beforeshow : function(tip) {						
								var client='';
								var	status='';
								var	desc='';
								var userNam='';							
								//me.corpFilterVal
								var filterView = me.getUserCategoryFilterView();
									if (!Ext.isEmpty(me.corpFilterDesc)) 
									{	
										client = me.corpFilterDesc;
									} 
									else 
									{
										if (!isClientUser())							
										client = getLabel('none', 'None');							
										else
										client = getLabel('allCompanies', 'All Companies');	
											
									}
									
									var userStatusFltId = filterView.down('combobox[itemId=userCategoryStatusFilter]');
									var description =filterView.down('combobox[itemId=userDescriptionFilter]');
									var userName =filterView.down('combobox[itemId=userNameFilter]');
									
									
									if(!Ext.isEmpty(userStatusFltId) && !Ext.isEmpty(userStatusFltId.getValue())) 								 {
									status = userStatusFltId.getRawValue();
									} 
									else 
									{
										status = getLabel('all', 'ALL');								
									}
									if(!Ext.isEmpty(description) && !Ext.isEmpty(description.getValue())) 								 {
										desc = description.getRawValue();
									} 
									else 
									{
										desc = getLabel('none', 'None');								
									}
									if(!Ext.isEmpty(userName) && !Ext.isEmpty(userName.getValue())) 								 {
										userNam = userName.getRawValue();
									} 
									else 
									{
										userNam = getLabel('none', 'None');								
									}
									tip.update(getLabel('client', 'Client')
											+ ' : '
											+ client
											+ '<br/>'
											+ getLabel('userNam','User Name')
											+ ' : '
											+ userNam
											+ '<br/>'
											+ getLabel('desc','Description')
											+ ' : '
											+ desc
											+ '<br/>'
											+ getLabel('status','Status')
											+ ' : '
											+ status
											+ '<br/>'
											);
							}
						}
					});
		},
		doHandleGroupByChange : function(menu, groupInfo) {
			var me = this;
			/*if (me.previouGrouByCode === 'ADVFILTER') {
				me.savePrefAdvFilterCode = null;
				me.showAdvFilterCode = null;
				me.filterApplied = 'ALL';
			}
			if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
				me.previouGrouByCode = groupInfo.groupTypeCode;
			} else
				me.previouGrouByCode = null;*/
		},
		doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
				newCard, oldCard) {
			var me = this;
			var objGroupView = me.getGroupView();
			var strModule = '', strUrl = null, args = null;
			groupInfo = groupInfo || {};
			subGroupInfo = subGroupInfo || {};
			if (groupInfo && groupInfo.groupTypeCode) {
					strModule = subGroupInfo.groupCode;
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
			var me=this;
			var objGroupView = me.getGroupView();
			var objSummaryView = me.getCategoryListView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
			arrCols = objPref.gridCols;
			//intPgSize = objPref.pgSize || _GridSizeTxn;
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
			var arrOfParseQuickFilter = [];
			var statusLableFound = false;		
			var objFilterArray =[]; 				
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
			objGroupView.handleGroupActionsVisibility(buttonMask);
			var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
			strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
			
			if(!Ext.isEmpty(me.filterData)){
				if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
					arrOfParseQuickFilter = generateCatFilterArray(me.filterData);
				}
			}
			
			if(arrOfParseQuickFilter) {
					/* To remove duplicate status filter labels*/
					objFilterArray = arrOfParseQuickFilter;
					$.each(objFilterArray, function(index, cfgFilter) {
						if(statusLableFound)
						{
							objFilterArray.splice(index, 1);
						}
						if(cfgFilter.fieldLabel == getLabel('status', 'Status'))
						{
							statusLableFound = true;
						}					
					});				
				me.getFilterView().updateFilterInfo(objFilterArray);
			}		
			
			me.reportGridOrder = strUrl;
			me.disableActions(true);
			grid.loadGridData(strUrl, null, null, false);
			if(undefined != gridRowSingleClick && gridRowSingleClick == 'N')
			{
				grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowClick(record, grid, '');
				});
			}
			else
			{
				grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});
			}
		},
		handleGridRowClick : function(record, grid, columnType) {
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
					me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
				}
			}
		},
		doHandleRowActions : function(actionName, objGrid, record) {
			var me = this;
			var formData = {};	
			var strUrl;
			var groupView = me.getGroupView();
			var grid = groupView.getGrid();
			if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'accept' || actionName === 'reject'
				|| actionName === 'enable' || actionName === 'disable')
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('categoryDesc'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		}else if(actionName === 'btnView' || actionName === 'btnEdit'){
			if(actionName === 'btnEdit'){
				strUrl = "editRoleManager.form";
			}
			else if(actionName === 'btnView'){
				strUrl = "viewRoleManager.form#/Verify";
			}
			formData.roleId = record.data.categoryCode;
			formData.corpId = record.data.corporationCode;
			me.viewUserCategoryForm(strUrl, formData)
		}else if (actionName === 'btnView' || actionName === 'btnEdit'
				|| actionName === 'btnClone'
				|| actionName === 'btnCloneTemplate') {
			//var updateIndex = rowIndex;
			
		//Commented for self-edit
	/*	if (actionName === 'btnEdit'&& 
				 (sessionCategory == record.data.categoryCode && sessionCorporation == record.data.corporationCode))
				{
					Ext.MessageBox.show({
								title : 'Role Edit Error',
								msg : 'User Cannot Edit its Own Role',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				} */
			
			//else 
			//	{
					var strUrl = '', objFormData = {};
					if (actionName === 'btnView')
						strUrl = 'viewUserAdminCategory.form';
					else if (actionName === 'btnEdit')
						strUrl = 'editUserAdminCategory.form';
					else if (actionName === 'btnClone')
						strUrl = 'cloneCategory.form';
					else if (actionName === 'btnCloneTemplate')
						strUrl = 'editCategoryTemplate.form';
	
					objFormData.viewState = record.data.identifier;
	
					if (actionName === 'btnView' || actionName === 'btnEdit') {
						if (!Ext.isEmpty(strUrl)) {
							me.doSubmitForm(strUrl, objFormData);
						}
	
					} else if (actionName === 'btnClone'
							|| actionName === 'btnCloneTemplate') {
						var strActionUrl = Ext.String.format(
								'services/userCategory/{0}.json',
								(actionName === 'btnClone')
										? 'clone'
										: 'copytotemplate');
						var jsonPost = [{
									serialNo : 1,
									identifier : objFormData.viewState,
									userMessage : ''
								}];
	
						Ext.Ajax.request({
							url : strActionUrl,
							method : 'POST',
							jsonData : Ext.encode(jsonPost),
							success : function(response) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data) && data.d
										&& data.d.instrumentActions) {
									var result = data.d.instrumentActions[0];
									if (result) {
										if (result.success === 'Y') {
											objFormData.viewState = result.identifier;
											me.doSubmitForm(strUrl, objFormData);
										} else if (result.success === 'N') {
											Ext.MessageBox.show({
												title : getLabel(
														'errorTitle',
														'Error'),
												msg : getLabel('instrumentErrMsg',
														'Unable to perform action..'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
	
										}
									}
	
								}
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'errorTitle',
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
				//}
			}
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
				if (objData.raw.makerId === LOGGEDINUSER) {
					isSameUser = false;
				}
				if (objData.raw.validFlag != 'Y') {
					isDisabled = true;
				}
				if (objData.raw.isSubmitted != null
						&& objData.raw.isSubmitted == 'Y'
						&& objData.raw.requestState != 8
						&& objData.raw.requestState != 4
						&& objData.raw.requestState != 5) {
					isSubmitted = true;
				}
			}
			actionMask = doAndOperation(maskArray, 10);
			me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
					isSubmitted);
			//objGroupView.handleGroupActionsVisibility(actionMask);
		},
		doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
				strActionType) {
			var me = this;
			if(!Ext.isEmpty(strAction))
				var strAction = strAction;
			var strUrl =null;
			if((strAction ==='accept' || strAction ==='reject' || strAction ==='discard' || strAction === 'enable' 
				|| strAction === 'disable' || strAction === 'submit')){
				strUrl = Ext.String.format('services/rolesCommandApi/{0}.json', strAction);
			}/*else{	
				strUrl = Ext.String.format('services/userCategory/{0}.json', strAction);
			}*/
			if (strAction === 'reject') {
				me.showRejectPopUp(strAction, strUrl,grid, arrSelectedRecords);
	
			} else {
				me.preHandleGroupActions(strUrl, '',grid,arrSelectedRecords);
			}
		},
		preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
			var me = this;
			var groupView = me.getGroupView();
			if (!Ext.isEmpty(groupView)) {
				var me = this;
				if (!Ext.isEmpty(grid)) {
					var arrayJson = new Array();
					var records = (arrSelectedRecords || []);
					
					//if(arrSelectedRecords[0].data.catAccessType=='T'){
						for (var index = 0; index < records.length; index++) {
							arrayJson.push({
										serialNo : grid.getStore().indexOf(records[index])
												+ 1,
										recordKey : records[index].data.identifier,
										userMessage : remark,
										recordDesc : records[index].data.categoryCode
									});
						}
					/*}else{
						for (var index = 0; index < records.length; index++) {
							arrayJson.push({
										serialNo : grid.getStore().indexOf(records[index])
												+ 1,
										identifier : records[index].data.identifier,
										userMessage : remark,
										recordDesc : records[index].data.categoryCode
									});
						}
					}*/
					if (arrayJson)
						arrayJson = arrayJson.sort(function(valA, valB) {
									return valA.serialNo - valB.serialNo
								});
					groupView.setLoading(true);
					Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrayJson),
								timeout: 90000,
								success : function(response) {
									groupView.setLoading(false);
									me.enableDisableGroupActions('000000000000000000');
									groupView.refreshData();
									var errorMessage = '';
									if (response.responseText != '[]') {
										 var jsonData = Ext.decode(response.responseText);
									        if(!Ext.isEmpty(jsonData))
									        {  
									        	for(var i =0 ; i<jsonData.length;i++ )
									        	{
									        		var arrError = jsonData[i].errors;
									        		if(!Ext.isEmpty(arrError))
									        		{
									        			for(var j =0 ; j< arrError.length; j++)
											        	{
										        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
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
												title : getLabel(
														'errorTitle',
														'Error'),
												msg : getLabel(
														'errorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
				}
			}
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
			//grid.removeAppliedSort();
			objGroupView.refreshData();
		},
		handleClearSettings:function(){
			var me=this;
			var userCategoryFilterView = me.getUserCategoryFilterView();
			
			var userNameFltId = userCategoryFilterView
					.down('AutoCompleter[itemId=userNameFilter]');
			
			var statusFltId = userCategoryFilterView
					.down('combo[itemId=userCategoryStatusFilter]');
			statusFltId.reset();
			me.userStatusPrefCode = 'all';
			statusFltId.selectAllValues();
			var userDescFltId = userCategoryFilterView
					.down('AutoCompleter[itemId="userDescriptionFilter"]');
	/*		var userStatusFltId = userCategoryFilterView
					.down('combo[itemId=userCategoryStatusFilter]');
			var userDescriptionFilter = userCategoryFilterView
					.down('AutoCompleter[itemId=userDescriptionFilter]');*/
			userDescFltId.setValue("");
			userNameFltId.setValue("");
			//userStatusFltId.reset();
			//userDescriptionFilter.setValue("");
			me.getCorporationCodeFltRef().setValue('');
			if (!isClientUser()) {
				var clientAutocompleter = me.getUserCategoryFilterView()
						.down('AutoCompleter[itemId="clientAutoCompleter]');
				clientAutocompleter.reset();
			}
			me.corpFilterVal = '';
			me.corpFilterDesc = '';		
			me.filterData=[];
			me.setDataForFilter();
			me.refreshData();
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
			var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';
			strExtension = arrExtension[actionName];
			strUrl = 'services/userCategoryListReport.' + strExtension;
			strUrl += '?$skip=1';
			var objGroupView = me.getGroupView();
			var groupInfo = objGroupView.getGroupInfo();
			var subGroupInfo = objGroupView.getSubGroupInfo();
			strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
			
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
			
			var viscols;
			var visColsStr = "";
			var grid = null;
			var objGroupView = me.getGroupView();
	
			if (!Ext.isEmpty(objGroupView)) {
				var colMap = new Object();
				var colArray = new Array();
				if (!Ext.isEmpty(objGroupView))
					grid = objGroupView.getGrid();
				if (!Ext.isEmpty(grid)) {
					viscols = grid.getAllVisibleColumns();
					var col = null;
	
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
				}
				if (colMap != null) {
					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}
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
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCurrent', currentPage));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'visColsStr', visColsStr));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCSVFlag', withHeaderFlag));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		handleClientChangeInQuickFilter : function(clientCode, clientDesc, sessionSellerCode) {
			var me = this;
			//if (isSessionClientFilter)
			//	me.corpFilterVal = clientCode;
			//else
			me.corpFilterVal = isEmpty(clientCode) ? '' : clientCode;
			me.corpFilterDesc = isEmpty(clientDesc) ? '' : clientDesc;
			me.sellerFilterVal = sessionSellerCode;
			me.filterApplied = 'Q';
			me.setDataForFilter();
			if (me.corpFilterVal == 'all') {
				me.refreshData();
			} else {
				me.applyQuickFilter();
			}
		},
		applyQuickFilter : function() {
			var me = this;
			var groupView = me.getGroupView();
			var grid = groupView.getGrid();		
			var groupInfo = groupView.getGroupInfo() || '{}';
			var subGroupInfo = groupView.getSubGroupInfo() || {};
			me.filterApplied = 'Q';
			if (!Ext.isEmpty(grid)) {
				var strDataUrl = grid.store.dataUrl;
				var store = grid.store;
				var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
						store.sorters);
				strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
				grid.setLoading(true);
				grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
			}
		},
		/*Preference Handling:start*/
		updateConfig : function() {
			var me = this, arrJsn = new Array();
			me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
			me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
			if (!Ext.isEmpty(objPreference)) {
				var objJsonData = Ext.decode(objPreference);
				var data = objJsonData.d.preferences.gridViewFilter;
				if (data != 'undefined' && !Ext.isEmpty(data)) {
					me.userNamePrefCode = data.quickFilter.userNameVal;
					me.userDescPrefCode = data.quickFilter.descVal;
					me.userStatusPrefCode = data.quickFilter.statusVal;
					me.userStatusPrefDesc = data.quickFilter.statusDesc;
					me.corpFilterVal = data.quickFilter.corpCodeVal;
					me.corpFilterDesc = data.quickFilter.corpDescVal;
				}
			}
			me.filterData = me.getQuickFilterQuery(me.userNamePrefCode,
					me.userDescPrefCode, me.userStatusPrefCode, me.filterData);
		},
		handleSavePreferences : function()
		{
			var me = this;
			if($("#savePrefMenuBtn").attr('disabled')) 
				event.preventDefault();
			else{
				var arrPref = me.getPreferencesToSave(false);
					if (arrPref) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePreferences, null, me, true);
							}
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);
			}
		},
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
			var me = this;
			if($("#clearPrefMenuBtn").attr('disabled')) 
				event.preventDefault();
			else{
				me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
				me.disablePreferencesButton("savePrefMenuBtn",false);
				me.disablePreferencesButton("clearPrefMenuBtn",true);	
			}	
		},
		postHandleClearPreferences : function(data, args, isSuccess) {
			var me = this;						
		},
		getFilterPreferences : function() {
			var me = this;
			var objFilterPref = {};
			var objQuickFilterPref = {};
			var userNameVal = null, statusVal = null, descVal = null, statusDesc = null, corpCodeVal = null, corpCodeDesc = null;
	
			var userCategoryFilterView = me.getUserCategoryFilterView();
			if (!Ext.isEmpty(userCategoryFilterView)) {
				var userNameFltId = userCategoryFilterView
						.down('AutoCompleter[itemId=userNameFilter]');
				var userStatusFltId = userCategoryFilterView
						.down('combo[itemId=userCategoryStatusFilter]');
				var userDescriptionFilter = userCategoryFilterView
						.down('AutoCompleter[itemId=userDescriptionFilter]');
				var corporationFilterRef = null;
				if (!Ext.isEmpty(userNameFltId)
						&& !Ext.isEmpty(userNameFltId.getValue())) {
					userNameVal = userNameFltId.getValue().toUpperCase();
				}
	
				if (!Ext.isEmpty(userStatusFltId)
						&& !Ext.isEmpty(userStatusFltId.getValue())
						&& "ALL" != userStatusFltId.getValue().toUpperCase()) {
					statusVal = userStatusFltId.getValue();
					statusDesc = userStatusFltId.getRawValue();
				}
	
				if (!Ext.isEmpty(userDescriptionFilter)
						&& !Ext.isEmpty(userDescriptionFilter.getValue())) {
					descVal = userDescriptionFilter.getValue().toUpperCase();
				}
				
				corpCodeVal= me.corpFilterVal;
				corpCodeDesc= me.corpFilterDesc;
	
			} else {
				userNameVal = me.userNamePrefCode;
				descVal = me.userDescPrefCode;
				statusVal = me.userStatusPrefCode;
				statusDesc = me.userStatusPrefDesc;
				corpCodeVal= me.corpFilterVal;
				corpCodeDesc= me.corpFilterDesc;
			}
			objQuickFilterPref.userNameVal = userNameVal;
			objQuickFilterPref.descVal = descVal;
			objQuickFilterPref.statusVal = statusVal;
			objQuickFilterPref.statusDesc = statusDesc;
			objQuickFilterPref.statusDesc = statusDesc;
			objQuickFilterPref.corpCodeVal = corpCodeVal;
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
		resetCorporationFIlter : function(clientCode, clientDesc, sellerCode) {
			var me = this;
			me.corpFilterVal = '';
			me.corpFilterDesc = '';
			me.sellerFilterVal = !Ext.isEmpty(sellerCode)
					? sellerCode
					: sessionSellerCode;
	
			var ObjUserCategoryFilter = me.getUserCategoryFilterView();
			var objAutocompleterName = ObjUserCategoryFilter
					.down('AutoCompleter[itemId="userNameFilter"]');
			var objAutocompleterDesc = ObjUserCategoryFilter
					.down('AutoCompleter[itemId="userDescriptionFilter"]');
	
			// var objFilterPanel = me.getSellerClientMenuBar();
			var cfgArrayName = objAutocompleterName.cfgExtraParams;
			var cfgArrayDesc = objAutocompleterDesc.cfgExtraParams;
	
			if (cfgArrayName) {
				$.each(cfgArrayName, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = !isEmpty(clientCode)
													? clientCode
													: '';
										}
									})
						});
			} else {
				cfgArrayName.push({
							key : '$filtercorporation',
							value : !isEmpty(clientCode)
									? clientCode
									: ''
						});
			}
	
			if (cfgArrayDesc) {
				$.each(cfgArrayDesc, function(i, v) {
							$.each(v, function(innerKey, innerValue) {
										if (innerValue == '$filtercorporation') {
											v.value = !isEmpty(clientCode)
													? clientCode
													: '';
										}
									})
						});
			} else {
				cfgArrayDesc.push({
							key : '$filtercorporation',
							value : !isEmpty(clientCode) 
									? clientCode
									: ''
						});
			}
	
			objAutocompleterName.cfgUrl = 'services/userCategory/filter/catNamesList.json';
			// objAutocompleterName.setValue( '' );
			objAutocompleterName.cfgExtraParams = cfgArrayName;
	
			objAutocompleterDesc.cfgUrl = 'services/userCategory/filter/catDescList.json';
			// objAutocompleterDesc.setValue( '' );
			objAutocompleterDesc.cfgExtraParams = cfgArrayDesc;
			me.applySeekFilter();
	
		},
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
										if(quickPref[i].paramName == "corporationDesc"){
											me.clientDesc = decodeURIComponent(quickPref[i].displayValue1);
											strClientDesc = me.clientDesc;
											me.corpFilterVal = quickPref[i].codeValue1;
										}
										if(quickPref[i].paramName == "categoryCode"){
											me.userNamePrefCode = quickPref[i].displayValue1;
											me.userNamePrefDesc = quickPref[i].displayValue1;
										}
										if(quickPref[i].paramName == "categoryDesc"){
											me.userDescPrefCode = quickPref[i].displayValue1;
											me.userDescPrefDesc = quickPref[i].displayValue1;
										}
										if(quickPref[i].paramName == "requestState"){
											me.userStatusPrefCode = quickPref[i].paramValue1;
											me.userStatusPrefDesc = quickPref[i].displayValue1;
										}
									}
								}
						}
					}
		}
	});
