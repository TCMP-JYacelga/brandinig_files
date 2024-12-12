Ext.define('GCP.controller.AVMSVMController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.SlabGridView','Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.AvmSvmView',
			'GCP.view.AvmSvmGridView', 'GCP.view.HistoryPopup',
			'GCP.view.SlabGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'avmSvmView',
				selector : 'avmSvmView'
			},{
				ref : 'groupView',
				selector : 'avmSvmView groupView'
			},{
				ref:'filterView',
				selector:'filterView'		
			}, {
				ref : 'avmSvmFilterView',
				selector : 'avmSvmFilterView'
			}, {
				ref : 'avmSvmGridView',
				selector : 'avmSvmView avmSvmGridView'
			}, {
				ref : 'avmSvmGrid',
				selector : 'avmSvmView avmSvmGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'avmSvmDtlView',
				selector : 'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'avmSvmView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'groupActionBar',
				selector : 'avmSvmView avmSvmGridView avmSvmGroupActionBar'
			}, {
				ref : 'searchTextInput',
				selector : 'avmSvmGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'avmSvmGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'svmGrid',
				selector : 'slabGridSignView[id="slabGridSignView"] smartgrid'
			}, {
				ref : 'clientCodesFltCombo',
				selector : 'avmSvmView avmSvmFilterView combo[itemId=clientCodesFltId]'
			}, {
				ref : 'matrixNameFltCombo',
				selector : 'avmSvmView avmSvmFilterView AutoCompleter[itemId=matrixNameFltId]'
			}, {
				ref : 'matrixTypeToolBar',
				selector : 'avmSvmView avmSvmFilterView toolbar[itemId="matrixTypeToolBar"]'
			}, {
				ref : 'svmGrid',
				selector : 'slabGridSignView[id="slabGridSignView"] smartgrid'
			},{
				ref : 'statusFilterRef',
				selector : 'avmSvmView avmSvmFilterView combo[itemId="matrixStatusFilter"]'
			}],
	config : {
		matrixTypeVal : 'all',
		matrixTypeDesc : null,
		clientCode : '',
		clientDesc : '',
		filterData : [],
		copyByClicked : '',
		clientFilterVal : '',
		clientFilterDesc : '',
		selectedSeller : '',
		matrixNameFltParamName:'matrixName',
		strPageName:'approvalMatrix',
		preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		objLocalData : null,
		filterApplied : 'ALL',
		isMatrixName : false,
		oldMatrixName : '',
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
		var filterType ;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			if (me.objLocalData && me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref)
			{
				filterType = me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
				me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
				this.filterData = me.objLocalData.d.preferences.tempPref.quickFilterJson ;
			}	
		}
		
		me.updateConfig();
		$(document).on("handleMatrixEntryAction",function(){
			me.handleMatrixEntryAction();
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);						
		});
		$(document).on('savePreference', function(event) {		
					me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
		});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup();
		});
		GCP.getApplication().on({
					detailUpdated : function() {
						me.refreshGrid();
					}
				});
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},				
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},	
			'avmSvmView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					//me.doHandleGroupByChange(menu, groupInfo);
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
					me.doHandleRowActions(actionName, grid, record,rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function() {
					
				},
				'gridStoreLoad' : function(grid, store) {
								me.disableActions(false);
				},
				afterrender : function(panel,opts){
					//me.setDataForFilter();
				//	me.setFilterRetainedValues();
				}
			},
			'avmSvmView avmSvmFilterView button[itemId="filterBtnId"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'avmSvmGridView' : {
				render : function(panel) {
				//	me.handleSmartGridConfig();
					me.setFilterRetainedValues();
				}
			},
			'avmSvmGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'avmSvmGridView toolbar[itemId=avmSvmGroupActionBar_Dtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			/*'avmSvmView avmSvmGridView panel[itemId="avmSvmDtlView"]' : {
				render : function() {
					me.setInfoTooltip();
					
				}
			},*/
			'avmSvmFilterView' : {
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
				afterrender:function(){
					me.setFilterRetainedValues();
					if( storeLength < 2 )
					{
						var avmSvmFilterView = me.getAvmSvmFilterView();		
						var matrixNameAuto = avmSvmFilterView.down('AutoCompleter[itemId=matrixNameFltId]');
						if (!Ext.isEmpty(matrixNameAuto)) {
							
							matrixNameAuto.cfgExtraParams.push({
								key : '$sellerId',
								value : strSellerId
							});
							
							matrixNameAuto.cfgExtraParams.push({
								key : '$clientId',
								value : me.clientCode
							});							
						}
					}
					me.applyPreferences();
				},
				handleMatrixType : function(combo) {
					me.handleMatrixType(combo);
				},
				handleClientChangeFilter : function( combo ) {
					me.handleClientChangeFilter( combo );
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'avmSvmFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'avmSvmFilterView AutoCompleter[itemId=matrixNameFltId]' : {
				select : function(combo, opts) {
					allowSaveLocalFilter = 'Y';
					me.setDataForFilter();
					me.applyFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);		
					me.isMatrixName = true;
				},
				change : function(combo, newValue, oldValue, eOpts) {
					me.oldMatrixName = oldValue;
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
						me.isMatrixName = true;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isMatrixName = false;
				},
				keydown: function(combi, e, eOpts){
					me.changeFilterParams();
				},
				blur : function(combo, record){
					if (me.isMatrixName == false && me.oldMatrixName != combo.getRawValue()){
						me.applySeekFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);			
					}
					me.oldMatrixName = combo.getRawValue();
				}
			},
			'avmSvmFilterView  combo[itemId="matrixStatusFilter"]' : {
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
		me.statusPrefCode = combo.getSelectedValues();
		me.statusPrefDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		allowSaveLocalFilter = 'Y';
		me.setDataForFilter();
		me.applyFilter();
	},
	/*Page setting handling starts here*/
	applyPageSetting : function(arrPref) {
		var me = this;
		if (!Ext.isEmpty(arrPref)) {
			me.handleClearLocalPrefernces();
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandlePageGridSetting, null, me, false);
		}
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
	restorePageSetting : function() {
		var me = this;
		me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandlePageGridSetting, null, me, false);
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
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
	showPageSettingPopup : function() {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objApprovalMatrixPref)) {
			objPrefData = Ext.decode(objApprovalMatrixPref);
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
					: (AVM_SVM_GENERIC_COLUMN_MODEL || '[]');

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

		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	
	/*Page setting handling ends here*/
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
		var matrixNameFilter;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		var clientComboToolBarRef = me.getAvmSvmFilterView();
		
		
		var matrixTypeToolBar = me.getAvmSvmFilterView()
		.down('combo[itemId="matrixTypeToolBar"]');
		
		if (strFieldName ==='clientId') {
			/*me.clientFilterVal = 'All';
			me.clientFilterDesc = 'All Companies';
			clientComboToolBarRef.setValue('All');*/
			if(isClientUser())
			{
				var clientCombo = clientComboToolBarRef.down('combobox[itemId=clientCombo]');
				clientCombo.setValue("");
				me.clientCode = "";
				me.clientDesc = "";	
			}
			else
			{
				clientComboToolBarRef.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
			matrixNameFilter = me.getMatrixNameFltCombo();
			matrixNameFilter.cfgExtraParams = null;
			matrixNameFilter.setValue('');
		}
		
		if (strFieldName ==='matrixType' && !Ext.isEmpty(matrixTypeToolBar)) {
			matrixTypeToolBar.setValue('All');
			me.matrixTypeVal = 'all';
			me.matrixTypeDesc = '';
		}
		
		if (strFieldName ==='matrixName' && !Ext.isEmpty(me.getMatrixNameFltCombo())) {
			me.getMatrixNameFltCombo().setValue('');
			me.matrixNameFltParamName = '';
		}
		if(strFieldName === 'requestState'){
			var statusFltId = me.getAvmSvmFilterView()
			.down('combo[itemId=matrixStatusFilter]');
			statusFltId.reset();
			me.statusPrefCode = 'all';
			statusFltId.selectAllValues();
		}
		
	},
	/*Applied Filters handling ends here*/
	
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule='',args=null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'APPMATRIX_OPT_STATUS') {
				strModule = subGroupInfo.groupCode;
			} else if (groupInfo.groupTypeCode === "none") {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
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
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAvmSvmView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [];
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
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
		
		me.disableActions(true);
		grid.loadGridData(strUrl, null, null, false);
/*		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid);
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
	},
	handleGridRowDoubleClick : function(record, grid) {
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
	},
	doHandleRowActions : function(actionName, objGrid, record,rowIndex) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard'){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('axmName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewApprovalMatrix.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editApprovalMatrix.form', record, rowIndex);
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if(!Ext.isEmpty(strAction))
			var strAction = strAction;
		var strUrl = Ext.String.format('services/authMatrixList/{0}',
				strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl,grid, arrSelectedRecords);

		} else {
			me.preHandleGroupActions(strUrl,"",grid,arrSelectedRecords);
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
		// Set Retaining Filter Parameters
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getClientCodesFltCombo())) {
			me.getClientCodesFltCombo().setValue('');
		}
		if (!Ext.isEmpty(me.getMatrixNameFltCombo())) {
			me.getMatrixNameFltCombo().setValue('');
			me.getMatrixNameFltCombo().setRawValue('');
		}
		if (!Ext.isEmpty(me.getMatrixTypeToolBar())) {
			me.matrixTypeVal = 'all';
			me.getMatrixTypeToolBar().items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						item.addCls('xn-account-filter-btnmenu');
					});
			var allBtn = me.getMatrixTypeToolBar()
					.down('button[btnId="allPaymentType"]');
			allBtn.addCls('xn-custom-heighlight');
		}
		return;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var filterView = me.getAvmSvmFilterView();
		// set Matrix Name Filter Value
		var matrixNameFltId = filterView
				.down('combobox[itemId=matrixNameFltId]');
        matrixNameFltId.setValue("");
        

		// Set Matrix Type Filter Value
		var matrixTypeToolBar = filterView
				.down('combo[itemId="matrixTypeToolBar"]');
		matrixTypeToolBar.setValue(me.matrixTypeVal);	
		var statusFilter = filterView
   		.down('combo[itemId=matrixStatusFilter]');
   		if(!Ext.isEmpty(me.statusPrefCode)&&!Ext.isEmpty(me.statusPrefDesc)){
   			statusFilter.store.loadRawData([{
   						"name" : me.statusPrefCode,
   						"value" : me.statusPrefDesc
   					}]
   	
   			);
   			statusFilter.setValue(me.statusPrefCode);
   			statusFilter.setRawValue(me.statusPrefDesc);
   		}   
		me.changeFilterParams();
	},

	/*
	 * The Function call on seller Drop down value chnages , and update seller
	 * param value of Client Auto Completer URL
	 */
	changeFilterParams : function() {
		var me = this;
		var avmSvmFilterView = me.getAvmSvmFilterView();

		var matrixNameAuto = avmSvmFilterView
				.down('AutoCompleter[itemId=matrixNameFltId]');

		if (!Ext.isEmpty(matrixNameAuto)) {
			matrixNameAuto.cfgExtraParams = new Array();
		}

		var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');

		if (!Ext.isEmpty(sellerCombo)) {
			matrixNameAuto.cfgExtraParams.push({
						key : '$sellerId',
						value : sellerCombo.getValue()
					});
		} else {

			matrixNameAuto.cfgExtraParams.push({
						key : '$sellerId',
						value : strSellerId
					});
		}
		if( storeLength < 2 )
		{
			matrixNameAuto.cfgExtraParams.push({
				key : '$clientId',
				value : me.clientCode
			});
		}
	},
	handleGridHeader : function() {
		var me = this;
		//var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		/*if (!Ext.isEmpty(gridHeaderPanel)) {
			gridHeaderPanel.removeAll();
		}*/
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		createNewPanel.add({
					xtype : 'button',
					border : 0,
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s ',
					text : getLabel('createNewMatrix', 'Create New : Matrix'),
					parent : this,
					itemId : 'btnCreateNewMatrix'
				});

	},
	handleMatrixType : function(combo) {
		var me = this;
		var matrixTypeToolBarRef = me.getAvmSvmFilterView()
				.down('combo[itemId="matrixTypeToolBar"]');
		me.matrixTypeVal = combo.getValue();
		me.matrixTypeDesc = combo.getRawValue();
		allowSaveLocalFilter = 'Y';
		me.setDataForFilter();
		me.applyFilter();
	},
	handleClientChangeFilter : function(combo) {
		var me = this;
		var clientComboToolBarRef = me.getAvmSvmFilterView()
				.down('combo[itemId="clientComboItem"]');
		
		me.clientFilterVal = combo.getValue();
		me.clientFilterDesc = combo.getRawValue();
		
		
		if( me.clientFilterVal == 'All' )
		{
			matrixNameFilter = me.getMatrixNameFltCombo();
			matrixNameFilter.cfgExtraParams = null;
			matrixNameFilter.setValue('');
		}
		else
		{
			var avmSvmFilterView = me.getAvmSvmFilterView();		
			var matrixNameAuto = avmSvmFilterView.down('AutoCompleter[itemId=matrixNameFltId]');

			if (!Ext.isEmpty(matrixNameAuto)) {
				
				matrixNameAuto.cfgExtraParams = new Array();
				
				matrixNameAuto.cfgExtraParams.push({
					key : '$sellerId',
					value : strSellerId
				});
				
				matrixNameAuto.cfgExtraParams.push({
					key : '$clientId',
					value : me.clientCode
				});							
			}			
		}
		allowSaveLocalFilter = 'Y';
		me.setDataForFilter();
		me.applyFilter();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.setLoading(true);
		grid.loadGridData(strUrl, null);
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
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
		if (allowSaveLocalFilter == 'Y')
		{
			me.handleSaveLocalStorage();
		}
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, matrixNameVal = null, matrixTypeVal = null, clientCodeVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;
		var statusFilterVal = me.statusPrefCode;
 		var statusFilterDisc = me.statusPrefDesc;
		var avmSvmFilterView = me.getAvmSvmFilterView();
		if(Ext.isEmpty(avmSvmFilterView)){
			matrixNameVal=strMatrixName;
			if(undefined != strClientId && strClientId != ''){
				//me.clientFilterVal=strClientId;
			}
		}else{
			var sellerFltId = avmSvmFilterView.down('combobox[itemId=sellerFltId]');
			var matrixNameFltId = avmSvmFilterView
					.down('combobox[itemId=matrixNameFltId]');
	
			if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
					&& "ALL" != sellerFltId.getValue()) {
				sellerVal = sellerFltId.getValue();
			}
	
			if (!Ext.isEmpty(sellerVal)) {
				jsonArray.push({
							paramName : sellerFltId.filterParamName,
							paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
	
			if (!Ext.isEmpty(matrixNameFltId)
					&& !Ext.isEmpty(matrixNameFltId.getValue())) {
				matrixNameVal = matrixNameFltId.getValue();
			}
	
		}

		if (!Ext.isEmpty(matrixNameVal)) {
				jsonArray.push({
							paramName : Ext.isEmpty(me.matrixNameFltParamName)?
												'matrixName' : me.matrixNameFltParamName,
							paramValue1 : encodeURIComponent(matrixNameVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('matrixName', 'Matrix Name'),
							displayValue1 : matrixNameVal							
						});
			}
		if (!Ext.isEmpty(me.matrixTypeVal) && "all" != me.matrixTypeVal) {
			matrixTypeVal = me.matrixTypeVal;
		}

		if (!Ext.isEmpty(matrixTypeVal)) {
			jsonArray.push({
						paramName : 'matrixType',
						paramValue1 : encodeURIComponent(matrixTypeVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('matrixType', 'Matrix Type'),
						displayValue1 : me.matrixTypeDesc
					});
		}
		if (!Ext.isEmpty(me.clientCode) &&  me.clientCode !== null &&  me.clientCode !== 'All') 
		{
			if (!Ext.isEmpty(me.clientCode)) {
				clientCodeVal = me.clientCode;
			} else {
				clientCodeVal = strClientId;
			}
			jsonArray.push({
					paramName : 'clientId',
					operatorValue : 'eq',
					paramValue1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
					dataType :'S',
					displayType : 5,
					paramFieldLable : getLabel('company', 'Company Name'),
					displayValue1 :me.clientDesc					
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
	applyFilter : function() {
		var me=this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	
	showHistory : function(matrixName, url, id) {
		var historyPopup = Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					identifier : id,
					matrixName : matrixName
				}).show();
		historyPopup.center();
		Ext.getCmp('btnApprMatrixHistoryPopupClose').focus();
	},


	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
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
	showRejectVerifyPopUp : function(strAction, strActionUrl,grid, record) {
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
					buttonText: {
						ok: getLabel('btnOk', 'OK'),
						cancel:getLabel('btncancel', 'cancel')
					} , 
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text,grid,record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
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
									Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												errorMessage),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							}
							me.enableDisableGroupActions('0000000000', true);
						//	grid.refreshData();
							groupView.setLoading(false);
							groupView.refreshData();
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
		var form;
		var selectedClient = null;
		var strUrl = 'addApprovalMatrix.form';
		var avmSvmFilterView = me.getAvmSvmFilterView();
	//	var sellerCombo = avmSvmFilterView.down('combobox[itemId=sellerFltId]');
	//	var clientCodesFltId = avmSvmFilterView
	//			.down('combobox[itemId=clientCodesFltId]');
	//	selectedClient = clientCodesFltId.getValue();
		
		var errorMsg = null;
		selectedClient=(me.clientFilterVal=='all'?'':me.clientFilterVal);
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				me.selectedSeller));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				selectedClient));
		me.setFilterParameters(form);
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var matrixTypeVal = null;
		var matrixNameVal = null;
		var arrJsn = {};
		var selectedClient,selectedClientDesc;
		var avmSvmFilterView = me.getAvmSvmFilterView();
		if(Ext.isEmpty(avmSvmFilterView)){
			matrixNameVal=strMatrixName;
			matrixTypeVal=strMatrixType;
			selectedClient=strClientId;
			selectedClientDesc=filterClientDesc;
		}else{
			//var clientCodesFltId = avmSvmFilterView.down('combobox[itemId=clientCodesFltId]');
			var matrixNameFltId = avmSvmFilterView.down('combobox[itemId=matrixNameFltId]');
			//selectedClient = clientCodesFltId.getValue();
			if (!Ext.isEmpty(matrixNameFltId)&& !Ext.isEmpty(matrixNameFltId.getValue())) {
				matrixNameVal = matrixNameFltId.getValue();
			//	selectedClientDesc=clientCodesFltId.getRawValue()
			 }
			 if (!Ext.isEmpty(me.matrixTypeVal) && "all" != me.matrixTypeVal) {
				matrixTypeVal = me.matrixTypeVal;
			}
		}
		//arrJsn['sellerId'] = me.selectedSeller;
		arrJsn['clientId'] = me.clientCode;
		arrJsn['clientDesc'] = me.clientDesc;
		arrJsn['matrixType'] = matrixTypeVal;
		arrJsn['matrixName'] = matrixNameVal;
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
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var client = '';
							var authtype = '';
							var matrixname = '';
							var	status='';
							var avmSvmFilterView = me.getAvmSvmFilterView();
							var sellerFltId = avmSvmFilterView
									.down('combobox[itemId=sellerFltId]');
							var matrixNameFltId = avmSvmFilterView
									.down('combobox[itemId=matrixNameFltId]');
							/*var clientCodesFltId = avmSvmFilterView
									.down('combobox[itemId=clientCodesFltId]');*/
							var statusFltId = avmSvmFilterView.down('combobox[itemId=matrixStatusFilter]');
							if (!Ext.isEmpty(matrixNameFltId)
									&& !Ext.isEmpty(matrixNameFltId.getValue())) {
								matrixname = matrixNameFltId.getValue();
							} else {
								matrixname = getLabel('none', 'None');
							}							
							/*if (!Ext.isEmpty(clientCodesFltId)	&& !Ext.isEmpty(me.clientFilterDesc)) {
								client = me.clientFilterDesc;							
							} else {
								client = getLabel('allCompanies', 'All Companies');		
							}*/
							if (!Ext.isEmpty(me.matrixTypeVal)
									&& "all" != me.matrixTypeVal) {
								if (me.matrixTypeVal == 0)
									authtype = getLabel('authorization',
											'Authorization');
								else
									authtype = getLabel('signatory',
											'Signatory');
							} else {
								authtype = getLabel('all', 'ALL');
							}
							if(!Ext.isEmpty(statusFltId) && !Ext.isEmpty(statusFltId.getValue())) 								 {
								status = statusFltId.getRawValue();
							} 
							else 
							{
								status = getLabel('all', 'ALL');								
							}
							tip.update(getLabel("matrixType","Matrix Type")
												+ ' : '	
												+ authtype+ '<br/>'
												+ getLabel("clientName",
														"Company Name")+ ' : '
												+ client+ '<br/>'
												+ getLabel("matrixName",
														"Matrix Name")
												+ ' : '
												+ matrixname
												+ '<br/>'
												+ getLabel('status','Status')
												+ ' : '
												+ status
												+ '<br/>');
							
				
						}
					}
				});
	},
	applySeekFilter : function()
	{
		var me = this;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyFilter();
	},
	applyQuickFilter : function()
	{
		var me = this;
		me.getAvmSvmGrid().refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if(grid){
			grid.removeAppliedSort();
		}
		objGroupView.refreshData();
	},
	handleClearSettings:function(){
		var me=this;
		var avmSvnFilterView = me.getAvmSvmFilterView();
		
		/*var clientComboToolBarRef = me.getAvmSvmFilterView()
		.down('combo[itemId="clientComboItem"]');
		me.clientComboToolBarRef = 'all';
	
		if(!Ext.isEmpty(clientComboToolBarRef))
		{
			clientComboToolBarRef.setValue('All');
			me.clientFilterVal = 'All';
			me.clientFilterDesc = 'All Companies';	
		}*/
		var statusFltId = avmSvnFilterView
		.down('combo[itemId=matrixStatusFilter]');
		statusFltId.reset();
		me.statusPrefCode = 'all';
		statusFltId.selectAllValues();
		if(isClientUser())
		{
			var clientCombo = avmSvnFilterView.down('combobox[itemId=clientCombo]');
			me.clientCode = "";
			me.clientDesc = "";
			me.clientFilterVal = getLabel('allCompanies', 'All companies');
			clientCombo.setValue(me.clientFilterVal);
		}
		else
		{
			avmSvnFilterView.down('AutoCompleter[itemId=clientComboAuto]').setValue("");
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		
		var matrixTypeFltId = avmSvnFilterView
				.down('combo[itemId=matrixTypeToolBar]');
		matrixTypeFltId.setValue('all');
		me.matrixTypeVal = 'all';
		
		var matrixNameFilter = avmSvnFilterView
				.down('AutoCompleter[itemId=matrixNameFltId]');
		if (!Ext.isEmpty(matrixNameFilter)) {
			matrixNameFilter.setValue('');
			matrixNameFilter.cfgExtraParams = null;
			me.matrixNameFilter = 'all';
		}
		
/*		matrixNameFilter.suspendEvents();
		matrixNameFilter.reset();
		matrixNameFilter.resumeEvents();
		matrixTypeFltId.suspendEvents();
		matrixTypeFltId.setValue("all");
		matrixTypeFltId.resumeEvents();*/
		me.filterData=[];
		me.refreshData();
	},
	handleClientChangeInQuickFilter : function( clientCode ,clientDesc ) {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.filterApplied = 'Q';
		me.changeFilterParams();
		allowSaveLocalFilter = 'Y';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyFilter();
		}
	},
	/*Preference Handling:start*/
	updateConfig : function() {
		var me = this,arrJsn=new Array();
		var statusFilterValArray = [];
		var statusFilterDiscArray = [];
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if( !Ext.isEmpty( objApprovalMatrixPref ) )
				{
					var objJsonData = Ext.decode( objApprovalMatrixPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						strMatrixName = data.quickFilter.matrixNameVal;
						me.matrixTypeVal=data.quickFilter.matrixTypeVal;
						me.statusPrefCode = data.quickFilter.statusVal;
						me.statusPrefDesc = data.quickFilter.statusDesc;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientFilterVal = data.filterSelectedClientCode;
							me.clientFilterDesc = data.filterSelectedClientDesc;
						}		
					}	
					
				}
				if (!Ext.isEmpty(strMatrixName)) {
					arrJsn.push({
							paramName : Ext.isEmpty(me.matrixNameFltParamName)
											? 'matrixName' : me.matrixNameFltParamName,
							paramValue1 : encodeURIComponent(strMatrixName.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S'
					});
				}
						
				if (!Ext.isEmpty(me.matrixTypeVal)) {
					arrJsn.push({
								paramName : 'matrixType',
								paramValue1 : encodeURIComponent(me.matrixTypeVal.replace(new RegExp("'", 'g'), "\''")),
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
		var matrixNamePrefVal = null, matrixTypePrefVal = null;
		var avmSvmFilterView = me.getAvmSvmFilterView();
		var statusVal = null,statusDesc = null;
		if(Ext.isEmpty(avmSvmFilterView)){
			matrixNamePrefVal=strMatrixName;
			matrixTypePrefVal=me.matrixTypeVal;
			statusVal = me.statusPrefCode;
			statusDesc = me.statusPrefDesc;
		}else{
			var matrixNameFltId = avmSvmFilterView.down('combobox[itemId=matrixNameFltId]');
			var matrixTypeFilterId = avmSvmFilterView.down('combo[itemId="matrixTypeToolBar"]');
			var statusFltId = avmSvmFilterView.down('combo[itemId=matrixStatusFilter]');
			if (!Ext.isEmpty(matrixNameFltId) && !Ext.isEmpty(matrixNameFltId.getValue())) {
				matrixNamePrefVal = matrixNameFltId.getValue().trim();
			}
			if (!Ext.isEmpty(matrixTypeFilterId) && !Ext.isEmpty(matrixTypeFilterId.getValue())) {
				matrixTypePrefVal = matrixTypeFilterId.getValue().trim();
			}
			if (!Ext.isEmpty(statusFltId)
					&& !Ext.isEmpty(statusFltId.getValue())
					&& "ALL" != statusFltId.getValue().toUpperCase()) {
				statusVal = statusFltId.getValue();
				statusDesc = statusFltId.getRawValue();
			}
		}
		objQuickFilterPref.matrixNameVal=matrixNamePrefVal;
		objQuickFilterPref.matrixTypeVal=matrixTypePrefVal;
		objFilterPref.filterSelectedClientCode = me.clientCode;
		objFilterPref.filterSelectedClientDesc = me.clientDesc;
		objFilterPref.quickFilter = objQuickFilterPref;
		objQuickFilterPref.statusVal = statusVal;
		objQuickFilterPref.statusDesc = statusDesc;
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
	
	/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,groupInfo = null,subGroupInfo = null,quickFilterState = {};
		if (objGroupView){
			subGroupInfo = objGroupView.getSubGroupInfo();
			groupInfo = objGroupView.getGroupInfo();
		}
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['groupTypeCode'] = (groupInfo || {}).groupTypeCode;
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
	applyPreferences : function(){
		var me = this, objLocalJsonData='';
		if (objApprovalMatrixPref || objSaveLocalStoragePref) {
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						if (objLocalJsonData && objLocalJsonData.d.preferences
								&& objLocalJsonData.d.preferences.tempPref)
						{
							me.handleQuickFilterFieldSync(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
							me.setDataForFilter();
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
	handleQuickFilterFieldSync : function(filterData) {
		var me = this;
		var fieldName,fieldVal,displayValue1;
		var avmSvmFilterView = me.getAvmSvmFilterView();
		for (var i = 0; i < filterData.length; i++) 
		{
			fieldName = filterData[i].paramName;
			fieldVal = filterData[i].paramValue1;
			displayValue1 = filterData[i].displayValue1;
			if (fieldName == 'clientId')
			{
				me.clientCode = decodeURIComponent(fieldVal);
				me.clientDesc = decodeURIComponent(displayValue1);
				//populate client
				if(isClientUser())
				{
					var clientCombo = avmSvmFilterView.down('combobox[itemId=clientCombo]');
					selectedFilterClient = fieldVal
					clientCombo.setValue(fieldVal);
				}
				else
				{
					var adminClientCombo = avmSvmFilterView.down('AutoCompleter[itemId=clientComboAuto]');
					adminClientCombo.setValue(fieldVal);
					adminClientCombo.setRawValue(displayValue1);
					selectedFilterClient = fieldVal;
				}
			}
			else if (fieldName == 'matrixType')
			{
				//populate matrix type
				var matrixTypeFilterId = avmSvmFilterView.down('combo[itemId="matrixTypeToolBar"]');
				me.matrixTypeVal = fieldVal;
				me.matrixTypeDesc = displayValue1 ;
				matrixTypeFilterId.setValue(fieldVal);
			}
			else if (fieldName == 'matrixName')
			{
				//populate matrix name
				var matrixNameFltId = avmSvmFilterView.down('combobox[itemId=matrixNameFltId]')
				matrixNameFltId.setValue(fieldVal);
			}	
			else if (fieldName == 'requestState')	
			{
				//populate status 
				var objStatusField = avmSvmFilterView.down('combo[itemId=matrixStatusFilter]');
				if (!Ext.isEmpty(fieldVal)) 
				{
					//me.statusFilterVal = fieldVal;
					me.statusPrefCode = fieldVal;
					me.statusPrefDesc = displayValue1 ;
					objStatusField.setValue(fieldVal.split(','));
					objStatusField.selectedOptions = fieldVal.split(',');
				} 
				else 
				{
					objStatusField.reset();
					me.statusPrefCode = 'all';
					objStatusField.selectAllValues();
				}
			}
		}
	}
	
});