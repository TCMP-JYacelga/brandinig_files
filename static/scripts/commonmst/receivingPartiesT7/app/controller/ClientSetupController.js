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
			},/*{
				ref : 'clientNamesFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=clientAutoCompleter]'
			},*/ {
				ref : 'receiverNameFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=receiverNameFltId]'
			}, {
				ref : 'accountNoFilterAuto',
				selector : 'clientSetupFilterView AutoCompleter[itemId=accountNoFltId]'
			},{
				ref : 'statusFilterRef',
				selector : 'clientSetupFilterView combo[itemId="receiverStatusFilter"]'
			}

	],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		clientCode:'',
		accountNoVal:'',
		accountNoCode:'',
		clientDesc:'',
		brandingPkgListCount : 0,
		filterData : [],
		sellerOfSelectedClient : '',
		copyByClicked : '',
		strDefaultMask : '000000000000000000',
		filterReceiverName:'receiverName',
		filterAccountNo :'accountNo',
		reportGridOrder : null,		
		strPageName:'receiverMst',
		preferenceHandler : null,
		isAccountNo : false,
		isReceiverName : false,
		oldAccountNo : '',
		oldReceiverName : '',
		statusPrefCode:null,
		statusPrefDesc:null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.clientCode =$("#summaryClientFilterSpan").val(),
		me.clientDesc = $("#summaryClientFilterSpan").text(),
		me.updateConfig();
		if(objReceiverMstLocalPref)
			me.objLocalData = Ext.decode(objReceiverMstLocalPref);
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
			'clientSetupFilterView AutoCompleter[itemId=receiverNameFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);
					me.isReceiverName = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldReceiverName = oldValue;
					if (newValue == '' || null == newValue) {						
						me.setDataForFilter();
						if(oldValue && oldValue != '%')
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isReceiverName = true;
						me.oldReceiverName = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isReceiverName = false;
				},
				blur : function(combo, record){
					if (me.isReceiverName == false && me.oldReceiverName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					}
					me.oldReceiverName = combo.getRawValue();	
				},
				boxready : function (combo, width, height, eOpts ){
					combo.setValue(receiverName);
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=accountNoFltId]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.isAccountNo = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldAccountNo = oldValue;
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						if(oldValue && oldValue != '%')
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
						me.isAccountNo = true;
						me.oldAccountNo = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isAccountNo = false;
				},
				blur : function(combo, record){
					if (me.isAccountNo == false && me.oldAccountNo != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					}
					me.oldAccountNo = combo.getRawValue();
				},
				boxready : function (combo, width, height, eOpts ){
					combo.setValue(accountNmbr);
				}
			},
			'clientSetupFilterView  combo[itemId="receiverStatusFilter"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusFilterClick(combo);
				}
			},
			'clientSetupFilterView combo[itemId=clientCombo]' : {
				boxready : function(combo, width, height, eOpts) {
					combo.setValue(me.clientCode);
				}
			},
			'clientSetupFilterView AutoCompleter[itemId=clientComboAuto]' : {
				boxready : function(combo, width, height, eOpts) {
					combo.setValue(me.clientCode);
					combo.setRawValue(me.clientDesc);
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
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
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
				'render' : function() {
					me.applyPreferences();
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
			
				afterrender : function(panel,opts){
					//me.setFilterRetainedValues();
					//me.clientCode = strClientId;
					//me.clientDesc = strClientDescription;	
					//me.setInfoTooltip();	
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
			},'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			}
		});
	},
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='', quickFilterData = [];
			if (objReceiverMstPref || objReceiverMstLocalPref) {
				objJsonData = Ext.decode(objReceiverMstPref);
				objLocalJsonData = Ext.decode(objReceiverMstLocalPref); 
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
						me.filterData = quickFilterData = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
						Ext.each(quickFilterData, function(item) {
								if (item) {
									if(item.paramName === 'receiverName')
										receiverName = decodeURIComponent(item.displayValue1);
									else if(item.paramName === 'accountNo')
										{
											accountNmbr = decodeURIComponent(item.displayValue1);
											me.accountNoVal =  decodeURIComponent(item.displayValue1);
											me.accountNoCode =  decodeURIComponent(item.paramValue1);
										}
									else if(item.paramName === 'clientId'){
										me.clientCode = decodeURIComponent(item.paramValue1);;
										me.clientDesc = decodeURIComponent(item.displayValue1);
									}
								}
						});
					}
				}
			}
	},
	handleStatusFilterClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusPrefCode = combo.getSelectedValues();
		me.statusPrefDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},	
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.refreshData();
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
			} else{
				window.location.reload();
			}
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting,subGroupInfo;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objReceiverMstPref)) {
			objPrefData = Ext.decode(objReceiverMstPref);
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
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
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
	
	/* State handling at local storage starts */
	
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},  
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},  
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	},
	/*Applied Filters handling starts here*/
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
			me.changeFilterParams();
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
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if (strFieldName ==='receiverName' && !Ext.isEmpty(me.getReceiverNameFilterAuto())) {
			me.getReceiverNameFilterAuto().setValue('');
		}
		if (strFieldName ==='accountNo' && !Ext.isEmpty(me.getAccountNoFilterAuto())) {
			me.getAccountNoFilterAuto().setValue('');
		}
		if(strFieldName === 'clientId'){
			
			/*me.clientDesc='';
			me.clientCode='';
			if(_availableClients> 1)
				$("#summaryClientFilterSpan").text('All Companies');
			$("#summaryClientFilter").val('');*/
			
			if(isClientUser()){
				var clientCombo = clientSetupFilterView.down('combobox[itemId=clientCombo]');
				clientCombo.setValue("");
				me.clientCode = "";
				me.clientDesc = "";	
			}else{
				clientSetupFilterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
			
		}
		if(strFieldName === 'requestState'){
			var statusFltId = clientSetupFilterView
			.down('combo[itemId=receiverStatusFilter]');
			statusFltId.reset();
			me.statusPrefCode = 'all';
			statusFltId.selectAllValues();
		}
	},
	/*Applied Filters handling ends here*/
	
	// method to handle client list and branding pkg list link click

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	resetAllFilters : function() {
		var me = this;
		/*if(isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				me.getClientInlineBtn().setText(getLabel('allCompanies', 'All Companies'));
			}
		else	
			if (!Ext.isEmpty(me.getClientNamesFilterAuto())) {
				me.getClientNamesFilterAuto().setValue('');
			}*/
		if (!Ext.isEmpty(me.getReceiverNameFilterAuto())) {
			me.getReceiverNameFilterAuto().setValue('');
		}
		if (!Ext.isEmpty(me.getAccountNoFilterAuto())) {
			me.getAccountNoFilterAuto().setValue('');
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
		Ext.getCmp('btnReceivingParttiesHistoryPopupClose').focus();
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

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/receiversList/{0}', strAction);
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
			fieldLbl = '<label class= "required">' +getLabel('instrumentReturnRemarkPopUpTitle',
			'Please Enter Reject Remark') + '</label>';
			 titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			buttonText: {
	            ok: getLabel('btnOk', 'OK'),
	            cancel:getLabel('btnCancel','Cancel')
				}, 
			multiline : 4,
			cls : 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					if(text == null || text == "")
					{
						Ext.MessageBox.show({
							title : getLabel(
									'instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel(
									'Error',
									'Reject Remarks cannot be blank'),
							buttons : Ext.MessageBox.OK,
							cls : 'xn-popup message-box',
							icon : Ext.MessageBox.ERROR
						});
					} else {
						me.preHandleGroupActions(strActionUrl, text, grid, record);
				}
			}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255,
					id : 'txtrejectRemark',
					cols :"43" ,
					rows : "4",
					cls : "x-form-field",
					style : "resize: none;"
		});
		$('#txtrejectRemark').bind('blur',function(){
			markRequired(this);
		});
		$('#txtrejectRemark').bind('focus',function(){
			removeMarkRequired(this);
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
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(response) {
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions('000000000000000000');
								//grid.refreshData();
								//me.applyFilter();
								groupView.setLoading(false);
								if( response.responseText == '[]')
								{
								 groupView.refreshData();
								}
								var errorMessage = '';
								if (response.responseText != '[]') {
									var jsonData = Ext
											.decode(response.responseText);
									
									if(jsonData != null && !jsonData.d)
									{
										groupView.refreshData();
										Ext.each(jsonData[0].errors, function(error,
														index) {
													errorMessage = errorMessage
															+  getLabel(error.code,error.errorMessage)
															+ "<br/>";
												});
										if ('' != errorMessage && null != errorMessage) {
											//Ext.Msg.alert("Error", errorMessage);
											Ext.MessageBox.show({
												title : getLabel(
														'instrumentErrorPopUpTitle',
														'Error'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												buttonText: {
										            ok: getLabel('btnOk', 'OK')
													}, 
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
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												}, 
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
		me.changeFilterParams();
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
		var strUrl = 'addApprovalMatrix.form';
		var clientSetupFilterView = me.getClientSetupFilterView();
		//var sellerCombo = clientSetupFilterView
		//		.down('combobox[itemId=sellerFltId]');
		//var clientCodesFltId = clientSetupFilterView
		//		.down('combobox[itemId=clientNamesFltId]');
		var selectedSeller = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;//sellerCombo.getValue();
		selectedClient = (Ext.isEmpty(me.clientCode) || me.clientCode === 'all') ? '' : me.clientCode;//clientCodesFltId.getValue();
		var form;
		var strUrl = 'addBeneficiary.form';

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
				selectedClient));
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
		var accountNo = null, accountNoVal = null;
		var receiverNameVal = null;
		var arrJsn = {};
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(Ext.isEmpty(clientSetupFilterView)){
		  
		}else{
		var sellerCombo = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');
		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverNameVal = receiverNameFltId.getValue();
		}
		if (!Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getValue())) {
			accountNo = accountNoFltId.getValue(), accountNoVal = accountNo
					.trim();
		}
		}
		arrJsn['sellerId'] = (!Ext.isEmpty(me.sellerOfSelectedClient)) ? me.sellerOfSelectedClient : strSellerId;;
		arrJsn['clientId'] = me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['receiverName'] = receiverNameVal;
		arrJsn['accountNmbr'] = accountNoVal;
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
							var	status='';
							var receiverName = '';
							var accountNumber = '';
							var clientSetupFilterView = me.getClientSetupFilterView();
					
							var receiverNameFltId = clientSetupFilterView
									.down('combobox[itemId=receiverNameFltId]');
					
							var accountNoFltId = clientSetupFilterView
									.down('combobox[itemId=accountNoFltId]');
							var statusFltId = clientSetupFilterView.down('combobox[itemId=receiverStatusFilter]');
							if (!Ext.isEmpty(receiverNameFltId)
									&& !Ext.isEmpty(receiverNameFltId.getValue())) {
								receiverName =receiverNameFltId.getValue();
							}else
								receiverName = getLabel('none','None');
												
							if(!Ext.isEmpty(statusFltId) && !Ext.isEmpty(statusFltId.getValue())) 								 {
								status = statusFltId.getRawValue();
							} 
							else 
							{
								status = getLabel('all', 'ALL');								
							}
							if (!Ext.isEmpty(accountNoFltId)
									&& !Ext.isEmpty(accountNoFltId.getValue())) {
								accountNumber = accountNoFltId.getValue();
							}else
								accountNumber = getLabel('none','None');
								client = (me.clientDesc != '') ? me.clientDesc : getLabel('allcompanies', 'All Companies');
								tip.update(getLabel('client', 'Company Name')
										+ ' : '
										+ client
										+ '<br/>'
										+ getLabel('receiverCode', 'Receiver Code')
										+ ' : '
										+ receiverName
										+ '<br/>'
										+ getLabel('accountNumber', 'Account')
										+ ' : '
										+ accountNumber
										+ '<br/>'
										+ getLabel('status','Status')
										+ ' : '
										+ status
										+ '<br/>');
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
		strUrl = 'services/generateReceiversListReport.' + strExtension;
		strUrl += '?$skip=1';
		var objGroupView = me.getGroupView();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		var groupInfo = objGroupView.getGroupInfo();
		strUrl += this.generateFilterUrl(subGroupInfo, groupInfo);
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
		for (var i = 0; i < arrSelectedrecordsId.length; i++) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', arrSelectedrecordsId[i]));
		}
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '';
		me.setDataForFilter();
		var groupView = me.getGroupView();
		var tabFilter = me.getFilterUrl(groupView
				.getSubGroupInfo(), groupView.getGroupInfo());

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		return tabFilter;
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
		// TODO : Commented the code.
		// me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'RECPAR_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} else if(groupInfo.groupTypeCode === 'none') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
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
	postHandleGroupTabChange : function(data, args) {
	//	var me = args.scope;
		var me=this;
		me.handleReconfigureGrid(data);
		/*var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
		objGroupView.reconfigureGrid(gridModel);*/
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getClientSetupView(), gridModel = null, objData = null;
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
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [] ;
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		//objGroupView.handleGroupActionsVisibility(buttonMask);
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.pageNo
						? me.objLocalData.d.preferences.tempPref.pageNo
						: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo))	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
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
		if(arrOfParseQuickFilter)
				me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);

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
					me.showHistory(true, Ext.htmlDecode(record.get('clientDesc')), record
									.get('history').__deferred.uri, record
									.get('identifier'));
				}
			}
	} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		if (actionName === 'btnView') {
			me.submitExtForm('viewBeneficiary.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editBeneficiary.form', record, rowIndex);
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
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
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
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/receiversList/{0}', strAction);
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
			fieldLbl = '<label class= "required">' +getLabel('instrumentReturnRemarkPopUpTitle',
			'Please Enter Reject Remark') + '</label>';
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			multiline : 4,
			cls : 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					if(text == null || text == "")
					{
						Ext.MessageBox.show({
							title : getLabel(
									'instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel(
									'Error',
									'Reject Remarks cannot be blank'),
							buttons : Ext.MessageBox.OK,
							cls : 'xn-popup message-box',
							icon : Ext.MessageBox.ERROR
						});
					} else {
					me.preHandleGroupActions(strActionUrl,text,grid,record);
				}
			}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255,
					id : 'txtrejectRemark',
					cols :"43" ,
					rows : "4",
					cls : "x-form-field",
					style : "resize: none;"
		});
		$('#txtrejectRemark').bind('blur',function(){
			markRequired(this);
		});
		$('#txtrejectRemark').bind('focus',function(){
			removeMarkRequired(this);
		});
	},
	setDataForFilter : function() {
		var me = this;
		//me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, receiverNameVal = null, accountNoVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [] ,statusFilterValArray = null;
		var clientParamName = null, clientNameOperator = null;
		var clientNamesFltId = null;
		var accountNoMaskFlt = null;
		var statusFilterVal = me.statusPrefCode;
		var statusFilterDisc = me.statusPrefDesc;
		
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(Ext.isEmpty(clientSetupFilterView)){
		receiverNameVal=receiverName;
		accountNoVal=me.accountNoVal;
		if(undefined != strClientDescription && strClientDescription != ''){
				me.clientDesc=strClientDescription;
				}
		}else{
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');

		
		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverName = receiverNameFltId.getValue().replace(/amp;/g, ''), receiverNameVal = receiverName
					.trim();
		}
       
		var accountNoFltId = clientSetupFilterView.down('combobox[itemId=accountNoFltId]');
		if (Ext.isEmpty(me.accountNoCode) && !Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getValue())) {
			var accountNmbrTemp = accountNoFltId.getValue();
			me.accountNoCode = accountNmbrTemp.trim();
		}
		if (Ext.isEmpty(me.accountNoVal) && !Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getRawValue())) {
			var accountMask = accountNoFltId.getRawValue();
			me.accountNoVal = accountMask.trim();
		}
		
       }
		
       if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : me.filterReceiverName,
						paramValue1 : encodeURIComponent(receiverNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable : getLabel('receiverCode', 'Receiver Code'),
						displayType : 5,
						displayValue1 : receiverNameVal
					});
		}
		if (!Ext.isEmpty(me.accountNoCode)) {
			jsonArray.push({
						paramName : me.filterAccountNo,
						paramValue1 : me.accountNoCode.toUpperCase(),
						operatorValue : 'lk',
						dataType : 'S',
						paramFieldLable :  getLabel('accountNo', 'Account'),
						displayType : 5,
						displayValue1 : me.accountNoVal
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
							dataType : 'S',
							paramFieldLable :  getLabel('lblcompany', 'Company Name'),
							displayType : 5,
							displayValue1 : me.clientDesc
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
	setFilterRetainedValues : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		// set Receiver Party Name Filter Value
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');
		receiverNameFltId.setValue(receiverName);

		// set Ordering Party ID Filter Value
		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		accountNoFltId.setValue(accountNmbr);
		
		var statusFilter = clientSetupFilterView
		.down('combo[itemId=receiverStatusFilter]');
		if(!Ext.isEmpty(me.statusPrefCode)&&!Ext.isEmpty(me.statusPrefDesc)){
			statusFilter.store.loadRawData([{
						"name" : me.statusPrefCode,
						"value" : me.statusPrefDesc
					}]
	
			);
			statusFilter.setValue(me.statusPrefCode);
			statusFilter.setRawValue(me.statusPrefDesc);
		}
		// Set Client Name Filter Value
		/*var clientCodesFltId ;
		if (userType == '0') {
			clientCodesFltId = clientSetupFilterView
				.down('combobox[itemId=clientAutoCompleter]');
			if(undefined != strClientDescription && strClientDescription != ''){		
				clientCodesFltId.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strClientId,
													"DESCR" : strClientDescription
												}]
									}
								});
	
				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(strClientId);
				clientCodesFltId.resumeEvents();
				me.clientCode = strClientId;
			}else{
				me.clientCode = 'all';			
			}
			
		} else {
			clientCodesFltId = clientSetupFilterView
				.down('combo[itemId="clientCombo"]');
			if(undefined != strClientDescription && strClientDescription != ''){	
				clientCodesFltId.setValue(strClientDescription);
				me.clientCode = strClientId;	
			}	
			else{	
				clientCodesFltId.setValue(getLabel('allCompanies', 'All Companies'));
				me.clientCode = 'all';
			}
		}*/
		me.changeFilterParams();
	   }

	},
	changeFilterParams : function() {
		var me = this;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var receiverNameFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=receiverNameFltId]');
		var accNoFltAuto = clientSetupFilterView
				.down('AutoCompleter[itemId=accountNoFltId]');
		if (!Ext.isEmpty(receiverNameFltAuto)) {
			receiverNameFltAuto.cfgExtraParams = new Array();
		}
		if (!Ext.isEmpty(accNoFltAuto)) {
			accNoFltAuto.cfgExtraParams = new Array();
		}
			
		if (!Ext.isEmpty(receiverNameFltAuto) && me.clientCode!= 'all' && me.clientCode!= null) {
			receiverNameFltAuto.cfgExtraParams.push({
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
		var clientSetupFilterView = me.getClientSetupFilterView();
		if(!Ext.isEmpty(clientSetupFilterView)){
		  /*if(!isClientUser()){
				clientFilterId=clientSetupFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
				me.clientCode='';
				me.clientDesc='';
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
		}else{
			clientFilterId=clientSetupFilterView.down('combo[itemId="clientCombo"]');
			me.strClientDescription=getLabel('allCompanies', 'All companies');
			clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));	
		}*/
		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=receiverNameFltId]');

		var accountNoFltId = clientSetupFilterView
				.down('combobox[itemId=accountNoFltId]');
		var statusFltId = clientSetupFilterView
		.down('combo[itemId=receiverStatusFilter]');
		statusFltId.reset();
		me.statusPrefCode = 'all';
		statusFltId.selectAllValues();
		if(isClientUser()){
			var clientCombo = clientSetupFilterView.down('combobox[itemId=clientCombo]');
			me.clientCode = "";
			me.clientDesc = "";
			me.clientFilterVal = 'all';
			clientCombo.setValue(me.clientFilterVal);
		}else{
			clientSetupFilterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		receiverNameFltId.setValue("");
		accountNoFltId.setValue("");		
		me.clientDesc='';
		me.clientCode='';
		me.accountNoVal='';
		me.accountNoCode='';
		if(_availableClients>1)
			$("#summaryClientFilterSpan").text('All Companies');
		$("#summaryClientFilter").val('');		
		me.filterData=[];
		me.refreshData();
		me.changeFilterParams();
		}
	},	
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objReceiverMstPref ) )
				{
					var objJsonData = Ext.decode( objReceiverMstPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						receiverName = data.quickFilter.receiverNameVal;
						accountNmbr=data.quickFilter.accountNoVal;
						me.statusPrefCode = data.quickFilter.statusVal;
						me.statusPrefDesc = data.quickFilter.statusDesc;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientCode = data.filterSelectedClientCode;
							me.clientDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}

				if (!Ext.isEmpty(receiverName)) {
					arrJsn.push({
								paramName : me.filterReceiverName,
								paramValue1 : encodeURIComponent(receiverName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S'
							});
				}
				if (!Ext.isEmpty(accountNmbr)) {
					arrJsn.push({
								paramName : me.filterAccountNo,
								paramValue1 : encodeURIComponent(accountNmbr.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
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
				if (me.statusPrefCode != null && me.statusPrefCode != 'All'
					&& me.statusPrefCode != 'all' && me.statusPrefCode.length >= 1) {
				statusFilterValArray = me.statusPrefCode.toString();

				if (me.statusPrefDesc != null && me.statusPrefDesc != 'All'
						&& me.statusPrefDesc != 'all'
						&& me.statusPrefDesc.length >= 1)
					statusFilterDiscArray = me.statusPrefDesc.toString();

				arrJsn.push({
							paramName : 'requestState',
							paramValue1 : statusFilterValArray,
							operatorValue : 'statusFilterOp',
							dataType : 'S',
							paramFieldLable : getLabel('status', 'Status'),
							displayType : 5,
							displayValue1 : statusFilterDiscArray
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
		var receiverNameVal = null, accountNoVal = null;
		var clientSetupFilterView = me.getClientSetupFilterView();
		var statusVal = null,statusDesc = null;
		if(Ext.isEmpty(clientSetupFilterView)){
			receiverNameVal=receiverName;
			accountNoVal=accountNmbr;
			statusVal = me.statusPrefCode;
			statusDesc = me.statusPrefDesc;
		}else{
			var receiverNameFltId = clientSetupFilterView
					.down('combobox[itemId=receiverNameFltId]');
			var accountNoFltId = clientSetupFilterView.down('combobox[itemId=accountNoFltId]');
			var statusFltId = clientSetupFilterView.down('combo[itemId=receiverStatusFilter]');
		}
		if (!Ext.isEmpty(receiverNameFltId)
					&& !Ext.isEmpty(receiverNameFltId.getValue())) {
				receiverName = receiverNameFltId.getValue(), receiverNameVal = receiverName
						.trim();
		}
		if (!Ext.isEmpty(accountNoFltId)
				&& !Ext.isEmpty(accountNoFltId.getValue())) {
			accountNo = accountNoFltId.getValue();
			accountNoVal = accountNo.trim();
		}
		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
			statusDesc = statusFltId.getRawValue();
		}
		objQuickFilterPref.receiverNameVal =receiverNameVal;
		objQuickFilterPref.accountNoVal=accountNoVal;
		objFilterPref.filterSelectedClientCode = me.clientCode;
		objFilterPref.filterSelectedClientDesc = me.clientDesc;
		objQuickFilterPref.statusVal = statusVal;
		objQuickFilterPref.statusDesc = statusDesc;
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
	}
	
});
function showClientPopup(brandingPkg) {
	GCP.getApplication().fireEvent('showClientPopup', brandingPkg);
}