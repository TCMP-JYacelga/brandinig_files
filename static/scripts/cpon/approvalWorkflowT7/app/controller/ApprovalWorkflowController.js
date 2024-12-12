Ext.define('GCP.controller.ApprovalWorkflowController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.ApprovalWorkflowView',
			'GCP.view.ApprovalWorkflowFilterView',
			'GCP.view.ApprovalWorkflowGridView', 'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'approvalWorkflowView',
				selector : 'approvalWorkflowView'
			}, {
				ref : 'approvalWorkflowTitleView',
				selector : 'approvalWorkflowTitleView'
			}, {
				ref : 'approvalWorkflowFilterView',
				selector : 'approvalWorkflowFilterView'
			}, {
				ref : 'approvalWorkflowGridView',
				selector : 'approvalWorkflowGridView'
			}, {
				ref : 'groupView',
				selector : 'approvalWorkflowGridView groupView'
			}, {
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'approvalWorkflowGrid',
				selector : 'approvalWorkflowGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'approvalWorkflowDtlView',
				selector : 'approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'approvalWorkflowGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'groupActionBar',
				selector : 'approvalWorkflowGridView approvalWorkflowGroupActionBar'
			}, {
				ref : 'searchTextInput',
				selector : 'approvalWorkflowGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'approvalWorkflowGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'approvalWorkflowGridView smartgrid'
			}, {
				ref : 'clientCodesFltCombo',
				selector : 'approvalWorkflowFilterView combo[itemId=clientCodesFltId]'
			}, {
				ref : 'clientInlineBtn',
				selector : 'approvalWorkflowFilterView combo[itemId="clientBtn"]'
			}, {
				ref : 'clientComboRef',
				selector : 'approvalWorkflowFilterView combo[itemId="clientCombo"]'
			}, {
				ref : 'defaultMatrixFltRef',
				selector : 'approvalWorkflowFilterView AutoCompleter[itemId="defaultMatrixFltId"]'
			}, {
				ref : 'statusFltRef',
				selector : 'approvalWorkflowGridView approvalWorkflowFilterView combo[itemId="statusFltId"]'
			}
			],
	config : {
		filterData : [],
		strDefaultMask : '000000000000000000',
		strPageName:'approvalWorkflow',
		clientCode : null,
		clientDesc : null,
		preferenceHandler : null,
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		isDefaultMatrix : false,
		oldDefaultMatrix : ''
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.updateConfig();
		if(objApprovalWrkLocalPref)
			me.objLocalData = Ext.decode(objApprovalWrkLocalPref);
		$(document).on('addApprWorkflow', function() {
					me.handleMatrixEntryAction();
				});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",false);	
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
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
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},			
			'approvalWorkflowGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateNewMatrix"]' : {
				click : function() {
					me.handleMatrixEntryAction();
				}
			},
			'approvalWorkflowGridView' : {
				render : function(panel) {
					// me.handleSmartGridConfig();
					// me.setFilterRetainedValues();
				}
			},
			'approvalWorkflowFilterView combo[itemId=clientCombo]' : {
				boxready : function(combo, width, height, eOpts) {
					combo.setValue(me.clientCode);
				}
			},
			'approvalWorkflowFilterView AutoCompleter[itemId=clientComboAuto]' : {
				boxready : function(combo, width, height, eOpts) {
					combo.setValue(me.clientCode);
					combo.setRawValue(me.clientDesc);
				}
			},
			'approvalWorkflowGridView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
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
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					// me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function() {
					me.applyPreferences();
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
				afterrender : function(panel, opts) {
					// me.setFilterRetainedValues();
				}
			},
			'approvalWorkflowGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'approvalWorkflowGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'approvalWorkflowGridView toolbar[itemId=approvalWorkflowGroupActionBar_Dtl]' : {
				performGroupAction : function(btn, opts) {
					me.doHandleGroupActions(btn);
				}
			},
			'approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"]' : {
				render : function() {
					me.setInfoTooltip();
//					me.handleGridHeader();
				}
			},
			'approvalWorkflowFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'approvalWorkflowFilterView' : {
				beforerender : function() {
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
				handleClientChange : function( combo ) {

					var filterView = me.getApprovalWorkflowFilterView();
					me.clientCode = combo.getValue();
					me.clientDesc = combo.getRawValue();
					var defaultMatrixName = filterView
					.down('combobox[itemId=defaultMatrixFltId]');
					defaultMatrixName.setValue('');
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				},
				afterrender : function(panel, opts) {
					me.setFilterRetainedValues();
					if( storeLength < 2 )
					{
						var approvalFilterView = me.getApprovalWorkflowFilterView();
						var defaultMatrixName = approvalFilterView
						.down('combobox[itemId=defaultMatrixFltId]');
						
						if (!Ext.isEmpty(defaultMatrixName)) {
							defaultMatrixName.cfgExtraParams = [{
										key : '$clientId',
										value : strClientId
									}];
						}
					}	
				}
			},
			'approvalWorkflowFilterView combobox[itemId=defaultMatrixFltId]' : {
				select : function(btn, opts) {
				//	me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isDefaultMatrix = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldDefaultMatrix = oldValue;
					if (newValue == '' || null == newValue) {
					//	me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isDefaultMatrix = true;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isDefaultMatrix = false;
				},
				blur : function(combo, record){
					if (me.isDefaultMatrix == false && me.oldDefaultMatrix != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}
					me.oldDefaultMatrix = combo.getRawValue();	
				},
				boxready : function (combo, width, height, eOpts ){
					combo.setValue(filterDefaultMatrix);
					combo.setRawValue(filterDefaultMatrixDesc);
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
			},
			'approvalWorkflowFilterView  combo[itemId="statusFltId"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				},
				'boxready' : function (combo, width, height, eOpts ){
					if(!Ext.isEmpty(me.statusFilterVal) && me.statusFilterVal !='all')
						combo.setValue(me.statusFilterVal.split(','));
				}
				
			}		
		});
	},
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='', quickFilterData = [];
			if (objApprovalWrkPref || objApprovalWrkLocalPref) {
				objJsonData = Ext.decode(objApprovalWrkPref);
				objLocalJsonData = Ext.decode(objApprovalWrkLocalPref); 
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
						me.filterData = quickFilterData = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
						Ext.each(quickFilterData, function(item) {
								if (item) {
									if(item.paramName === 'defaultMatrix'){
										filterDefaultMatrix = decodeURIComponent(item.paramValue1);
										filterDefaultMatrixDesc = decodeURIComponent(item.displayValue1);
									}else if(item.paramName === 'workflowRequestState'){
										var stt = decodeURIComponent(item.displayValue1);
										me.statusFilterVal = decodeURIComponent(item.paramValue1);
										me.statusFilterDesc = decodeURIComponent(item.displayValue1);
									} else if(item.paramName === 'approvalClientId' || item.paramName === 'clientCode'){
										me.clientCode = decodeURIComponent(item.paramValue1);;
										me.clientDesc = decodeURIComponent(item.displayValue1);
										me.clientFilterVal = item.paramValue1;
										me.clientFilterDesc =item.displayValue1;
									}
								}
						});
					}
				}
			}
	},
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusFilterVal = combo.getSelectedValues();
		me.statusFilterDesc = combo.getRawValue();
	//	me.handleStatusFieldSync(me.statusFilterVal,null);
	//	me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyFilter();
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.refreshData();
	},
	handleClearSettings : function() {
		var me = this;
		var approvalWorkflowFilterView = me.getApprovalWorkflowFilterView();
		var statusFltId = approvalWorkflowFilterView.down('combo[itemId=statusFltId]');
		statusFltId.reset();
		me.statusFilterVal = 'all';
		statusFltId.selectAllValues();
		me.resetClientField();
		var defaultMatrixFltId = approvalWorkflowFilterView
				.down('AutoCompleter[itemId=defaultMatrixFltId]');
		defaultMatrixFltId.setValue("");
		if (!Ext.isEmpty(defaultMatrixFltId)) {
			defaultMatrixFltId.cfgExtraParams = null;
		}

		me.filterData = [];
		me.refreshData();
	},
	/*Page setting handling starts here*/
	savePageSetting : function(arrPref, strInvokedFrom) {
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
		} else{
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
					}
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
			} else{
				window.location.reload();
			}
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting,subGroupInfo;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster,strTitle='';

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objApprovalWrkPref)) {
			objPrefData = Ext.decode(objApprovalWrkPref);
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
					: (APPR_WRKFLOW_GENERIC_COLUMN_MODEL || '[]');

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
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	
	/*Page setting handling ends here*/
	
	/*Local preferences Handling starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();

		objSaveState['filterAppliedType'] = me.filterApplied;
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
	
	/*Local preferences Handling ends */
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					if( paramName == 'approvalClientId'  || paramName == 'clientCode' )
					{
					    me.resetClientField();
						me.clientCode = null;
						me.clientDesc = null;						
					}
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
		var matrixFilter;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if ( ( strFieldName ==='approvalClientId' || strFieldName ==='clientCode' ) && !Ext.isEmpty(me.getClientComboRef())) {
			me.getClientComboRef().setValue('all');
			matrixFilter = me.getDefaultMatrixFltRef();
			matrixFilter.cfgExtraParams = null;
		}
		if (strFieldName ==='defaultMatrix' && !Ext.isEmpty(me.getDefaultMatrixFltRef())) {
			me.getDefaultMatrixFltRef().setValue('');
		}
		if (strFieldName ==='statusFltId' && !Ext.isEmpty(me.getStatusFltRef())) {
			me.getStatusFltRef().setValue('All');
		}

		
		if(strFieldName === 'workflowRequestState'){
			var objField = me.getStatusFltRef();
			if(!Ext.isEmpty(objField)){
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			//resetAllMenuItemsInMultiSelect("#msStatus");
		}
		
	},
	/*Applied Filters handling ends here*/	
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		/*if(grid){
			grid.removeAppliedSort();
		}*/
		objGroupView.refreshData();
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [];
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.pageNo
						? me.objLocalData.d.preferences.tempPref.pageNo
						: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo))	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		objGroupView.handleGroupActionsVisibility(buttonMask);
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, intPageNo, intOldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);

		if(_availableClients == 1){
		var paramName = 'clientId';
				var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					var arrQuickJson = me.filterData;
					me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
				}
		}
		
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		
		grid.loadGridData(strUrl, null, null, false);
/*		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid,rowIndex);
		});*/
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
//				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
	},
	handleGridRowDoubleClick : function(record, grid, rowIndex) {
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
			me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record, rowIndex);
		}
	},
	
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule='',args=null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			strModule = subGroupInfo.groupCode
			if (groupInfo.groupTypeCode === 'APPWORKFLOW_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} 
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}	
	},
	postHandleGroupTabChange1 : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getApprovalWorkflowGridView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
				}
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	postHandleGroupTabChange : function(data, args) {
		var me=this;
		me.handleReconfigureGrid(data);
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getApprovalWorkflowGridView(), gridModel = null, objData = null;
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
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPageSize,
					pageNo : intPageNo
					
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
	resetAllFilters : function() {
		var me = this;
		var filterView = me.getApprovalWorkflowFilterView();
		var defaultMatrixName = filterView
				.down('combobox[itemId=defaultMatrixFltId]');
		var statusName = filterView.down('combobox[itemId=statusFltId]');
		if (isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				me.getClientInlineBtn().setText(getLabel('all', 'All'));
			} else if (!Ext.isEmpty(me.getClientCodesFltCombo())) {
				me.getClientCodesFltCombo().setValue('');
			}
		if (!Ext.isEmpty(defaultMatrixName)) {
			defaultMatrixName.setValue('');
		}
		if (!Ext.isEmpty(statusName)) {
			statusName.setValue('');
		}
		return;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var arrJson = [];
		var form = document.createElement('FORM');
		var filterView = me.getApprovalWorkflowFilterView();

		var defaultMatrixName = filterView
				.down('combobox[itemId=defaultMatrixFltId]');
		var statusName = filterView.down('combobox[itemId=statusFltId]');
		
		if(!Ext.isEmpty(filterDefaultMatrix)){
			defaultMatrixName.store.loadRawData({
						"filterList" : [{
									"name" : filterDefaultMatrix,
									"value" : filterDefaultMatrixDesc
								}]
	
					});
			defaultMatrixName.suspendEvents();
	
			defaultMatrixName.resumeEvents();
		}

		if(!Ext.isEmpty(filterStatus)){
			statusName.store.loadRawData([{
						"name" : filterStatus,
						"value" : filterStatusDesc
					}]
	
			);
			statusName.suspendEvents();
			statusName.setValue(filterStatus);
			statusName.resumeEvents();
		}	

	},

	changeFilterParams : function() {
		var me = this;
		var approvalFilterView = me.getApprovalWorkflowFilterView();
		var selectedClient = null;

		var defaultMatrixName = approvalFilterView
				.down('combobox[itemId=defaultMatrixFltId]');

		if (!Ext.isEmpty(me.clientCode))
			selectedClient = me.clientCode;
		
		if (!Ext.isEmpty(defaultMatrixName)) {
			defaultMatrixName.cfgExtraParams = [{
						key : '$clientId',
						value : selectedClient
					}];
		}
	},
	handleGridHeader : function() {
		var me = this;
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		createNewPanel.add({
					xtype : 'button',
					border : 0,
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s cursor_pointer font_bold ux_toolbar-header ux_no-padding ',
					text : getLabel('createNewMatrix',
							'Create New Approval Matrix		  Workflow'),
					parent : this,
					itemId : 'btnCreateNewMatrix'
				});

	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
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
/*				case 'in' :
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
					break;*/
				case 'in' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].paramValue1;
					// objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + ' and ';
								} else {
									// strTemp = strTemp + ' and ';
									strTemp = strTemp;
								}
							} else {
								isFilterApplied = true;
							}

							if (filterData[index].detailFilter
									&& filterData[index].detailFilter === 'Y') {
								strDetailUrl = strDetailUrl + '(';
							} else {
								strTemp = strTemp + '(';
							}
							for (var i = 0; i < objArray.length; i++) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									
										strDetailUrl = strDetailUrl
										+ filterData[index].paramName
										+ ' eq ';
										strDetailUrl = strDetailUrl + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strDetailUrl = strDetailUrl + ' or ';
								} else {
									
									
									if( objArray[i].length > 2 )
									{
										strTemp = strTemp + '(';
										var arrayList = objArray[i].split('.');
										for (var x = 0; x < arrayList.length; x++) {
											
											if( x == 0)
											{
												strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ';
											}
											else
											{
												strTemp = strTemp
												+ 'workflowValidFlag'
												+ ' eq ';												
											}
											strTemp = strTemp + '\''
													+ arrayList[x] + '\'';
											if (x != arrayList.length - 1)
											{
												strTemp = strTemp + ' and ';
											}
											else
											{
												strTemp = strTemp + ')';
											}
										}
										
										if (i != objArray.length - 1)
										{
											strTemp = strTemp + ' or ';
										}
										
									}
									else
									{
										strTemp = strTemp
										+ filterData[index].paramName
										+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										if (i != objArray.length - 1)
											strTemp = strTemp + ' or ';										
											}
								}
							}
							if (filterData[index].detailFilter
									&& filterData[index].detailFilter === 'Y') {
								strDetailUrl = strDetailUrl + ')';
							} else {
								strTemp = strTemp + ')';
							}
						}
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
	setDataForFilter : function() {
		var me = this;
		// me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, clientVal = null, matrixNameVal = null, matrixTypeVal = null, clientCodeVal = null, statusVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
		var defaultMatrixName = null, defaultMatNameVal = null, defaultMatNameDesc = null;
		var statusName = null;
		var statusDesc = null;
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDisc = me.statusFilterDesc;
		var approvalWorkflowFilterView = me.getApprovalWorkflowFilterView();

		if (Ext.isEmpty(approvalWorkflowFilterView)) {

			if (undefined != filterStatus && filterStatus != '') {
				statusVal = filterStatus;
			}

			if (undefined != filterDefaultMatrix && filterDefaultMatrix != '') {
				defaultMatNameVal = filterDefaultMatrix;
			}

		} else {
			defaultMatrixName = approvalWorkflowFilterView
					.down('combobox[itemId=defaultMatrixFltId]');

			if (!Ext.isEmpty(defaultMatrixName))
			{	
				defaultMatNameVal = defaultMatrixName.getValue();
				defaultMatNameDesc = defaultMatrixName.getRawValue();
			}

			statusName = approvalWorkflowFilterView
					.down('combobox[itemId=statusFltId]');
			if (!Ext.isEmpty(defaultMatrixName) && !Ext.isEmpty(defaultMatNameDesc))
			{	
				defaultMatNameVal = defaultMatNameVal;//.toUpperCase();
				//defaultMatNameDesc = defaultMatNameDesc;//.toUpperCase();
				defaultMatNameDesc = defaultMatNameDesc.replace("Maker-Checker", "makerchecker");
				
			}
			if (!Ext.isEmpty(statusName)) {
				statusVal = statusName.getValue();
				statusDesc = statusName.getRawValue();
			}
		}
		
		if (userType == '0') {
			clientParamName = 'clientCode';
			clientNameOperator = 'lk';
			clientVal = me.clientDesc;
		} else {
			clientParamName = 'approvalClientId';
			clientNameOperator = 'eq';
			clientVal = me.clientCode;
		}

		if (!Ext.isEmpty(me.clientCode) && me.clientCode !== 'All' && me.clientCode !== 'all') {
			jsonArray.push({
						paramName : clientParamName,
						paramValue1 : encodeURIComponent(clientVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : clientNameOperator,
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('company', 'Company Name'),
						displayValue1 : me.clientDesc
					});
		}
		if (!Ext.isEmpty(defaultMatNameDesc)) {
			jsonArray.push({
						paramName : 'defaultMatrix',
						paramValue1 : encodeURIComponent(defaultMatNameDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',

						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('defaultMatrix', 'Default Matrix'),
						displayValue1 : defaultMatNameDesc
					});
		}
		
		if (statusFilterVal != null && statusFilterVal != 'All'
			&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
		statusFilterValArray = statusFilterVal.toString();

		if (statusFilterDisc != null && statusFilterDisc != 'All'
				&& statusFilterDisc != 'all'
				&& statusFilterDisc.length >= 1)
			statusFilterDiscArray = statusFilterDisc.toString();

		jsonArray.push({
					paramName : 'workflowRequestState',
					paramValue1 : statusFilterValArray,
					operatorValue : 'in',
					dataType : 'S',
					paramFieldLable : getLabel('status', 'Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
	}		

/*		if (!Ext.isEmpty(statusVal) && 'ALL' != statusVal) {
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'workflowIsSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel('status', 'Status'),
								displayValue1 : statusDesc
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'workflowValidFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel('status', 'Status'),
								displayValue1 : statusDesc
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'workflowValidFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			} else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'workflowIsSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			}
			if (strInFlag) // Used for Submitted & Rejected status
			{
				jsonArray.push({
							paramName : 'workflowRequestState',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			} else {
				jsonArray.push({
							paramName : 'workflowRequestState',
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : statusDesc
						});
			}
		}*/

		return jsonArray;
	},
/*	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},*/
	
	applyFilter : function() {
		var me=this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},

	handleSmartGridConfig : function() {
		var me = this;
		var approvalWorkflowGrid = me.getApprovalWorkflowGrid();
		var objConfigMap = me.getApprovalWorkflowConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(approvalWorkflowGrid))
			approvalWorkflowGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = _GridSizeMaster;
		approvalWorkflowGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
			// padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
		});

		var approvalWorkflowDtlView = me.getApprovalWorkflowDtlView();
		approvalWorkflowDtlView.add(approvalWorkflowGrid);
		approvalWorkflowDtlView.doLayout();
	},

	doHandleRowIconClick : function(actionName, objGrid, record, rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.doHandleGroupActions(actionName, objGrid, [record],
					'groupAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('axmName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewTcwAuthMatrixWorkflowMst.form', record,
					rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editTcwAuthMatrixWorkflowMst.form', record,
					rowIndex);
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
	showHistory : function(matrixName, url, id) {
	var historyPopup = Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					//cls:'t7-popup',
					identifier : id,
					matrixName : matrixName
				}).show();
	historyPopup.center();
	Ext.getCmp('btnApprWrkFlwHistoryPopupClose').focus(); 
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
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
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
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;

				if ((cfgCol.colId == 'rClientDesc' && userType == '0')
						|| isMultipleClientAvailable
						|| (cfgCol.colId != 'rClientDesc')) {
					arrCols.push(cfgCol);
				}
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
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

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,
			locked : true,
			items : [{
						text : getLabel('actionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('actionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('actionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('actionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('actionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('actionDisable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
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
			if (objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var me = this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView
				.down('toolbar[itemId="groupActionToolBar"]');
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

	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format(
				'services/approvalMatrixWorkflowList/{0}', strAction);
		strUrl = strUrl + '.srvc?';
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords);
		} else {
			this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords);
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('rejectPopupTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('RejectRemark', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			buttonText: {
	            ok: getLabel('btnOk', 'OK'),
				cancel: getLabel('cancel', 'Cancel')
				},
			multiline : 4,
			cls : 't7-popup',
			width : 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					me.preHandleGroupActions(strActionUrl, text, grid, record);
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
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			for (var index = 0; index < arrSelectedRecords.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore()
									.indexOf(arrSelectedRecords[index])
									+ 1,
							identifier : arrSelectedRecords[index].data.identifier,
							recordDesc : arrSelectedRecords[index].data.axmName,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl +csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions('0000000000', true);
							me.refreshData();
							me.applyFilter();
							var errorMessage = '';
							if(response.responseText != '[]')
						       {
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
												title : getLabel('instrumentErrorPopUpTitle','Error'),
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

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_axmName') {
			if ((!Ext.isEmpty(record.get('defaultAxmcode')) && record.get('defaultAxmcode') == 'MAKERCHECKER')
					|| (!Ext.isEmpty(record.get('axmName')) && record.get('axmName') == 'MAKERCHECKER')) 
			{
				strRetValue = getLabel('makerchecker', 'Maker-Checker');
			} else
				strRetValue = value;
		} else
			strRetValue = value;

		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},

	getApprovalWorkflowConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"clientDesc" : '25%',
			"axmType" : '30%',
			"axmName" : '25%',
			"axmCurrency" : '20%',
			"noOfSlabs" : '20%',
			"requestStateDesc" : '20%'
		};

		arrColsPref = [{
					"colId" : "rClientDesc",
					"colDesc" : "Client"
				}, {
					"colId" : "axmName",
					"colDesc" : "Default Matrix"
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : "Status"
				}];

		storeModel = {
			fields : ['defaultAxmcode', 'isSubmitted', 'requestStateDesc',
					'__metadata', 'history', 'identifier', 'clientId',
					'rClientDesc', 'axmName'],
			proxyUrl : 'services/approvalMatrixWorkflowList.json',
			rootNode : 'd.profile',
			totalRowsNode : 'd.__count'
		};
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
	searchOnPage : function() {
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
	handleMatrixEntryAction : function() {
		var me = this;
		var selectedClient = null;
		if (!Ext.isEmpty(me.getApprovalWorkflowView())) {
			/*var clientCodesFltId = me.getApprovalWorkflowView()
					.down('combobox[itemId=clientCodesFltId]');*/
			if (!Ext.isEmpty(me.clientCode))
				selectedClient = me.clientCode;
			else
				selectedClient = strClientId;
		} else {
			selectedClient = strClientId;
		}

		var form;
		var strUrl = 'addTcwAuthMatrixWorkflowMst.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				strSellerId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				selectedClient));
		form.action = strUrl;
		me.setFilterParameters(form);
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

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var clientCodesFltId;
		var selectedClient;
		var defaultMatrixNameVal,defaultMatrixNameDesc,statusNameVal,statusNameDesc,clientDescVal;
		var workflowFilterView = me.getApprovalWorkflowFilterView();
		// var sellerCombo = workflowFilterView
		// .down('combobox[itemId=sellerFltId]');

		if (Ext.isEmpty(workflowFilterView)) {
			selectedClient = strClientId;
			defaultMatrixNameVal = filterDefaultMatrix;
			defaultMatrixNameDesc = filterDefaultMatrixDesc;
			statusNameVal = filterStatus;
			statusNameDesc = filterStatusDesc;
			
		} else {
			/*if (!isClientUser()) {
				clientCodesFltId = workflowFilterView
						.down('combobox[itemId=clientCodesFltId]');

				if (!Ext.isEmpty(clientCodesFltId))
					selectedClient = clientCodesFltId.getValue();
			} else {
				clientCodesFltId = workflowFilterView
						.down('combo[itemId="clientBtn"]');

				if (!Ext.isEmpty(clientCodesFltId))
					selectedClient = clientCodesFltId.code;
			}*/
			// var selectedSeller = sellerCombo.getValue();
			selectedClient = me.clientCode;
			var defaultMatrixName = workflowFilterView
					.down('combobox[itemId=defaultMatrixFltId]');
			defaultMatrixNameVal = defaultMatrixName.getValue();
			defaultMatrixNameDesc = defaultMatrixName.getRawValue();
					
			var statusName = workflowFilterView
					.down('combobox[itemId=statusFltId]');
			statusNameVal = statusName.getValue();
			statusNameDesc = statusName.getRawValue();
			// arrJsn['sellerId'] = selectedSeller;
			if (me.clientDesc) 
				clientDescVal = me.clientDesc;

		}

		arrJsn['clientId'] = selectedClient;
		arrJsn['clientDesc'] = clientDescVal;
		arrJsn['defaultMatrix'] = defaultMatrixNameVal
		arrJsn['defaultMatrixDesc'] = defaultMatrixNameDesc;
		arrJsn['status'] = statusNameVal;
		arrJsn['statusDesc'] = statusNameDesc;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'approvalWorkflowFilterView-1016_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var client = '';
							var defaultMatrix = '';
							var matrixname = '';
							var status = '';
							var approvalWorkflowFilterView = me
									.getApprovalWorkflowFilterView();
							// var sellerFltId = approvalWorkflowFilterView
							// .down('combobox[itemId=sellerFltId]');
							/*var clientCodesFltId = approvalWorkflowFilterView
									.down('combobox[itemId=clientCodesFltId]');*/

							// if (!Ext.isEmpty(sellerFltId)
							// && !Ext.isEmpty(sellerFltId.getValue())) {
							// seller = sellerFltId.getValue();
							// } else {
							// seller = getLabel('allcompanies', 'All
							// Companies');
							// }

							if (!Ext.isEmpty(me.clientDesc)
									&& me.clientCode != 'all') {
								client = me.clientDesc;
							} else {
								client = getLabel('allCompanies',
										'All Companies');
							}
							var filterView = me.getApprovalWorkflowFilterView();
							var defaultMatrixName = filterView
									.down('combobox[itemId=defaultMatrixFltId]');
							var statusName = filterView
									.down('combobox[itemId=statusFltId]');

							if (!Ext.isEmpty(defaultMatrixName)
									&& !Ext.isEmpty(defaultMatrixName
											.getValue())) {
								defaultMatrix = defaultMatrixName.getValue();
							} else {
								defaultMatrix = getLabel('none', 'None');
							}

							if (!Ext.isEmpty(statusName)
									&& !Ext.isEmpty(statusName.getValue())) {
								status = statusName.getRawValue();
							} else {
								status = getLabel('all', 'ALL');
							}

							tip.update(getLabel("grid.column.company", "Company Name")
									+ ' : ' + client + '<br/>'
									+ getLabel("matrixType", "Matrix Type")
									+ ' : ' + defaultMatrix + '<br/>'
									+ getLabel("Status", "Status") + ' : '
									+ status);

						}
					}
				});
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		me.setDataForFilter();
		if (me.clientCode === 'all') {
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objApprovalWrkPref ) )
				{
					var objJsonData = Ext.decode( objApprovalWrkPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					var statusVal=null,statusDesc;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						filterDefaultMatrix = data.quickFilter.defaultMatrixNameVal;
						filterDefaultMatrixDesc = data.quickFilter.defaultMatrixNameDesc;
						statusVal=data.quickFilter.statusVal;
						statusDesc=data.quickFilter.statusDesc;
						filterStatus=statusVal;
						filterStatusDesc=statusDesc;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientFilterVal = data.filterSelectedClientCode;
							me.clientFilterDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}

				if (!Ext.isEmpty(filterDefaultMatrix)) {
					arrJsn.push({
								paramName : 'defaultMatrix',
								paramValue1 : encodeURIComponent(filterDefaultMatrix.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
		
				if (!Ext.isEmpty(statusVal) && 'ALL' != statusVal) {
					var strInFlag = false;
					if (statusVal == 12 || statusVal == 3) {
						if (statusVal == 12) // Submitted
						{
							statusVal = new Array(0, 1);
							arrJsn.push({
										paramName : 'workflowIsSubmitted',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
							strInFlag = true;
						} else // Valid/Authorized
						{
							arrJsn.push({
										paramName : 'workflowValidFlag',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
					} else if (statusVal == 11) // Disabled
					{
						statusVal = 3;
						arrJsn.push({
									paramName : 'workflowValidFlag',
									paramValue1 : 'N',
									operatorValue : 'eq',
									dataType : 'S'
								});
					} else if (statusVal == 0 || statusVal == 1) // New and Modified
					{
						arrJsn.push({
									paramName : 'workflowIsSubmitted',
									paramValue1 : 'N',
									operatorValue : 'eq',
									dataType : 'S'
								});
					}
					if (strInFlag) // Used for Submitted & Rejected status
					{
						arrJsn.push({
									paramName : 'workflowRequestState',
									paramValue1 : statusVal,
									operatorValue : 'in',
									dataType : 'S'
								});
					} else {
						arrJsn.push({
									paramName : 'workflowRequestState',
									paramValue1 : statusVal,
									operatorValue : 'eq',
									dataType : 'S'
								});
					}
				}
				if (!Ext.isEmpty(me.clientDesc)&&!Ext.isEmpty(me.clientCode) && me.clientCode!= 'all' ) {
					clientParamName = 'clientId';
					clientNameOperator = 'eq';
					if (!Ext.isEmpty(me.clientCode)) {
						clientCode = me.clientCode;
					} else {
						clientCode = strClientId;
					}
		
					if (!Ext.isEmpty(clientCode)) {
						arrJsn.push({
									paramName : clientParamName,
									paramValue1 : encodeURIComponent(clientCode.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : clientNameOperator,
									dataType : 'S'
								});
					}
				}
				if (userType == '1') {
					$("#summaryClientFilterSpan").text(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}else if(userType=='0'){
					$("#summaryClientFilter").val(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}
				me.filterData = arrJsn;
	},
	handleSavePreferences : function()
	{
		var me = this;
		/*if($("#savePrefMenuBtn").attr('disabled')) 
			event.preventDefault();
		else
			me.savePreferences();*/
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
		var defaultMatrixName = null, defaultMatNameVal = null,defaultMatrixNameDesc;
		var statusFldId = null,statusVal = null,statusDesc;
		var approvalWorkflowFilterView = me.getApprovalWorkflowFilterView();

		if (Ext.isEmpty(approvalWorkflowFilterView)) {
			if (undefined != filterStatus && filterStatus != '') {
				statusVal = filterStatus;
				statusDesc=filterStatusDesc;
			}

			if (undefined != filterDefaultMatrix && filterDefaultMatrix != '') {
				defaultMatNameVal = filterDefaultMatrix;
			}

		} else {
			defaultMatrixName = approvalWorkflowFilterView
					.down('combobox[itemId=defaultMatrixFltId]');

			if (!Ext.isEmpty(defaultMatrixName)){
				defaultMatNameVal = defaultMatrixName.getValue();
				defaultMatrixNameDesc=defaultMatrixName.getRawValue();
			}	

			statusFldId = approvalWorkflowFilterView.down('combobox[itemId=statusFltId]');
			if (!Ext.isEmpty(statusFldId)) {
				statusVal = statusFldId.getValue();
				statusDesc=statusFldId.getRawValue();
			}
		}
				
		objQuickFilterPref.defaultMatrixNameVal=defaultMatNameVal;
		objQuickFilterPref.defaultMatrixNameDesc=defaultMatrixNameDesc;
		objQuickFilterPref.statusVal=statusVal;
		objQuickFilterPref.statusDesc=statusDesc;
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
	resetClientField : function (){
		var me = this;
		if(isClientUser()){
			var clientComboBox = me.getApprovalWorkflowFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getApprovalWorkflowFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
		}
		selectedFilterClientDesc = "";
		selectedFilterClient = "";
		selectedClientDesc = "";
		me.clientCode = 'all';
		me.clientDesc = 'All Companies';
	}
	/*Preference Handling:end*/


});