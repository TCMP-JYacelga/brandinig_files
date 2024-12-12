
Ext.define('GCP.controller.CashPositionSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.summary.CashPositionSummaryView','Ext.form.field.ComboBox'],
	refs : [{
				ref : 'cashPositionCenter',
				selector : 'cashPositionCenter'
			}, {
				ref : 'cashPositionSummaryView',
				selector : 'cashPositionSummaryView'
			}, {
				ref : 'groupView',
				selector : 'cashPositionSummaryView groupView'
			}, {
				ref : 'summarygroupView',
				selector : 'cashPositionSummaryView groupView'
			}, {
				ref : 'genericFilterView',
				selector : 'filterView'
			},{
				ref : 'cashFilterView',
				selector : 'cashPositionSummaryFilterView'
			},{
				ref : 'accountCombo',
				selector : 'cashPositionSummaryFilterView combobox[itemId="viewAccountCombo"]'
			},
			{
				ref : 'txnCombo',
				selector : 'cashPositionSummaryFilterView combobox[itemId="viewcategoryCombo"]'
			},{
				ref : 'accountSetPopUp',
				selector : 'accountSetPopUpView[itemId="AccountSetPopUpView"]'
			}, {
				ref : 'summaryInfoView',
				selector : 'cashPositionSummaryView summaryInformationView'
			},{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="pagesettingCashPosition"]'
			}],
	config : {
	txncategory:'ALL',
	txncategoryDesc : null,
	toDate:null,
	accountFilter:'ALL',
	accountFilterDesc : null,
	fromDate:null,
    strReadSummaryInfoUrl : 'services/cashPositionsummary/summarytypecodes',
    strPageName : 'cashPositionsummary',
    prfAccountFilter:null,
    prfTxnCategory:null,
	reportGridOrder : null,
	strGridDetailTabSelected : null,
	pageSettingPopup : null,
	objLocalData : null,
	firstLoad : false
	},
	
	init : function() {
          var me = this;
          me.firstLoad = true;
			me.updateConfigs();
	        if(objSavedLocalSummaryPref && isSaveLocalPreference){
				me.objLocalData = Ext.decode(objSavedLocalSummaryPref);
				var filterType = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref 
									&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
				me.filterApplied = "Q";
				if(!Ext.isEmpty(me.objLocalData.d.preferences.tempPref) && !Ext.isEmpty(me.objLocalData.d.preferences.tempPref.quickFilterJson))
					me.filterData = me.objLocalData.d.preferences.tempPref.quickFilterJson;
			}
			$(document).on('performReportAction', function(event, actionName) {
				me.downloadReport(actionName);
			});
			$(document).on('handleClientChangeInQuickFilter',
					function(isSessionClientFilter) 
					{
						me.handleClientChangeInQuickFilter(isSessionClientFilter);
					});
			$(document).on('savePreference', function(event) {											
				if($('#accBalLink').length > 0)
					GCP.getApplication().fireEvent('transactionSavePreference');
				else if($('#accActivityLink').length > 0)
					GCP.getApplication().fireEvent('accountSavePreference');
				else
					me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
				if($('#accBalLink').length > 0)
					GCP.getApplication().fireEvent('transactionClearPreference');
				else if($('#accActivityLink').length > 0)
					GCP.getApplication().fireEvent('accountClearPreference');
				else					
					me.handleClearPreferences();
		});
		$(document).on('performPageSettings', function(event) 
				{
					me.showPageSettingPopup('PAGE');
				});
				$('#cpsummarybackdiv').hide();
			GCP.getApplication().on({
					'showSummary' : function(record, strSummaryType) {
						/*var container = me.getCashPositionCenter();
						if (!Ext.isEmpty(container)) {
							container.updateView(null);
							container.setActiveCard(0);
						}*/
						isAccountViewOn = false;
						istransactionViewOn = false;
						$('#brsummraytitle').html(getLabel('txnSummaryTitle1', 'Account / Cash Position Summary'));
						me.pageTitleLoad();
						me.handleSummaryInformationRender();
					},
					'backToParentView' : function() {
						GCP.getApplication().fireEvent('showSummary');
					}
				});
				
			me.control({
				'ribbonView[itemId="summaryCarousal"]' : {
						expand : function(panel) {
							console.log('creating caousals');
							 me.handleSummaryInformationRender();				
							panel.doLayout();
						}	
					},
				'cashPositionSummaryFilterView':{
					beforerender:function(){
						summaryFilterPanel=me.getGenericFilterView();
					   var useSettingsButton = me.getGenericFilterView()
							.down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
								useSettingsButton.hide();
							}
							var createAdvanceFilterLabel = me.getGenericFilterView()
									.down('label[itemId="createAdvanceFilterLabel"]');
							if (!Ext.isEmpty(createAdvanceFilterLabel)) {
								createAdvanceFilterLabel.hide();
							}
					  },
					render:function(cmp){
						var accountCombo=me.getAccountCombo();
						 var txnCombo=me.getTxnCombo();
						if(me.txncategory!="ALL"){
								txnCombo.setValue(me.txncategory);
						}else{
							txnCombo.setValue("ALL");
						}
						if(me.accountFilter!="ALL"){
							accountCombo.setValue(me.accountFilter);
						}else{
							accountCombo.setValue("ALL");
						}
					}
			},
			   'cashPositionSummaryView' : {
				'render' : function() {		
					me.handleSummaryInformationRender();
				}
			},
			    'cashPositionSummaryView groupView' : {
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
							me.disablePreferencesButton("savePrefMenuBtn", false);
					         me.disablePreferencesButton("clearPrefMenuBtn", false);	
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	
					//me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActionClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'render' : function() {
					me.applyPreferences();
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}

			},
			'cashPositionSummaryView summaryInformationView' : {
				'render' : function(panel) {
					me.handleSummaryInformationRender(panel);
				}
			},
			'cashPositionSummaryView groupView smartgrid' : {
				'cellclick' : me.handleGridRowClick
			},
			'cashPositionSummaryFilterView combobox[itemId="viewAccountCombo"]':{
				'select' : function(combo, selectedRecords) {
					combo.isQuickAccountFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickAccountFieldChange)
						me.handleAccountClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.accountFilter) && 'all' != me.accountFilter && me.accountFilter != 'ALL'){
						combo.setValue((decodeURIComponent(me.accountFilter)).split(',').map(Number));
						combo.selectedOptions = (decodeURIComponent(me.accountFilter)).split(',');
					}
				}
			  
			},
			'cashPositionSummaryFilterView combobox[itemId="viewcategoryCombo"]':{
				'select' : function(combo, selectedRecords) {
					combo.isQuickTxnCategoryFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickTxnCategoryFieldChange)
						me.handleTxnCategoryClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.txncategory) && 'all' != me.txncategory && me.txncategory != 'ALL'){
						combo.setValue((decodeURIComponent(me.txncategory)).split(','));
						combo.selectedOptions = (decodeURIComponent(me.txncategory)).split(',');
					}	
				}
			  },
			  'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSummarySettings();
				}
			},
			 'filterView' : 
			 {
				appliedFilterDelete : function(btn)
				{
					if(!isAccountViewOn && !istransactionViewOn)
					{
						me.handleAppliedFilterDelete(btn);
					}
				}
			},
			'pageSettingPopUp[itemId="pagesettingCashPosition"]' : {
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
			
			});
	},	
	
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='';
		if (!Ext.isEmpty(objSavedLocalSummaryPref)) {
			objLocalJsonData = Ext.decode(objSavedLocalSummaryPref);
			if(!Ext.isEmpty(objLocalJsonData) && !Ext.isEmpty(me.filterData)){
				var txncategoryJson = me.findInQuickFilterData(me.filterData, 'categoryId');
				var accountFilterJson = me.findInQuickFilterData(me.filterData, 'accountId');
				if(!Ext.isEmpty(txncategoryJson))
					me.txncategory = txncategoryJson.paramValue1;
				if(!Ext.isEmpty(accountFilterJson))
					me.accountFilter = accountFilterJson.paramValue1;
			}
		}
	},
	handleAccountClick : function(combo) {
		var me = this;
		combo.isQuickAccountFieldChange = false;
		me.accountFilter = combo.getSelectedValues();
		me.accountFilterDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	handleTxnCategoryClick : function(combo) {
		var me = this;
		combo.isQuickTxnCategoryFieldChange = false;
		me.txncategory = combo.getSelectedValues();
		me.txncategoryDesc = combo.getRawValue();
		me.setDataForFilter();
		me.applyFilter();
	},
	updateConfigs : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');		
		var	args = {
				'module' : 'panels'
			};
		me.preferenceHandler.readModulePreferences(me.strPageName,
					'filterPref', me.postReadfilterPrefrences, args, me, true);	
		
				
					
	},
	postReadfilterPrefrences : function (data, args, isSuccess) {
		var me = this;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			me.txncategory = objPref.txnCategory;
			me.prfTxnCategory=me.txncategory;
			me.accountFilter = objPref.accountFilter;
			me.prfAccountFilter=me.accountFilter;
		}	
	},

	handleSavePreferences : function() {
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
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getSummarygroupView();
		var grid = null;
		var arrPref = [];
		var groupInfo = null, subGroupInfo = null, strModule = null;
		var infoPanelCollapsed = false;
		var infoPanel = me.getSummaryInfoView(); 
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			
			
			// Summary Information Panel
		var summaryInfoPanel = $('#btrSummaryListId');
		if(summaryInfoPanel.hasClass('ft-accordion-collapsed'))
			infoPanelCollapsed = true;
			
			/*if (groupInfo.groupTypeCode === 'acctype') {
				strModule = state.subGroupCode;
			} else {
				strModule = state.groupCode
			}*/
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : groupInfo.groupTypeCode,
							subGroupCode :subGroupInfo.groupCode
						}
					});
			arrPref.push({
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize,
							'sortState':state.grid.sortState,
							'gridSetting' : groupView.getGroupViewState().gridSetting
							
						}
					});			
			
			arrPref.push({
						"module" : "filterPref",
						"jsonPreferences" : {
							'txnCategory' : me.txncategory,
							'accountFilter' : me.accountFilter
						}
					});			
		}
		return arrPref;
	},
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{	
			var arrPref = me.getPreferencesToSave(false);
			 me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					 me.postHandleClearPreferences, null, me, true);
			
				me.disablePreferencesButton("savePrefMenuBtn", false);
				me.disablePreferencesButton("clearPrefMenuBtn", true);
		}	
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		
		if (isSuccess && isSuccess === 'Y') {
						  me.disablePreferencesButton("savePrefMenuBtn",true);
			              me.disablePreferencesButton("clearPrefMenuBtn",false);	
						}
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		               if (isSuccess && isSuccess === 'Y') {
							me.disablePreferencesButton("savePrefMenuBtn", false);
							me.disablePreferencesButton("clearPrefMenuBtn", true);	
						}
						
	},
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var objGroupView = me.getSummarygroupView();
		
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		me.firstLoad = false;
		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) 
			{
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) 
				{
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				var reqJsonAccount = me.findInQuickFilterData(quickJsonData,'Account');
				if(!Ext.isEmpty(reqJsonAccount) || me.accountFilter == "")
				{
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Account');
					quickJsonData = arrQuickJson;
				}
				var reqJsonCategory = me.findInQuickFilterData(quickJsonData,'TransactionCategory');
				if(!Ext.isEmpty(reqJsonAccount) || me.txncategory == "")
				{
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'TransactionCategory');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}
		me.advFilterData = [];
		if (!Ext.isEmpty(me.advFilterData)) 
		{ 
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) 
		{
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
			if ( arrOfFilteredApplied )
				me.getGenericFilterView().updateFilterInfo(arrOfFilteredApplied);
		}

		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		
		if (isSaveLocalPreference)
			me.handleSaveLocalStorage();
	},
	handleGridRowClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		var clickedColumn = view.getGridColumns()[cellIndex];
		var columnType = clickedColumn.colType;
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
		var objGroupView = me.getSummarygroupView();
		var grid = objGroupView.getGrid();
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
				me.doHandleRowActionClick(grid, null, null, arrVisibleActions[0].itemId,  record);
			}
		} else {
		}
	},
	doHandleRowActionClick : function(grid, rowIndex, columnIndex, actionName,
			record) {
		var me = this;
		var strEventName = null;
		var recId = record.raw.identifier;
		var filterData=me.updateFilterConfig(record);
	    
		var strActivityType = 'ALL';
		if (actionName === 'account') {
			strEventName = 'showAccount';
		}  else if (actionName === 'txnDetails') {
			strEventName = 'showTranscation';
		} 
		strGridDetailTabSelected = strEventName;
		if (strEventName) {
			var group = me.getSummarygroupView();
			if (!Ext.isEmpty(group))
			{
				var filterButton = group.down('button[itemId="filterButton"]');
				if (filterButton) {					
					if (filterButton.filterVisible) {
						filterButton.panel.hide();
						filterButton.filterVisible = false;
						filterButton.removeCls('filter-icon-hover');
					}
				}
			}			
				GCP.getApplication().fireEvent(strEventName, record,
						 strActivityType,filterData,false);


		}
	},
	updateFilterConfig:function(record){
	var me=this;
	filterData={};
	me.txncategory=record.raw.txnCategoryId;
	filterData.txncatType=record.raw.txnCategoryId;
	filterData.txnCategoryDesc= record.raw.txnCategoryDesc;
	
//	filterData.txncatType=me.txncategory;
	//filterData.accountFilter=record.raw.accountId;
	return filterData;
	},
	
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this, strUrl = '&$txncategory={0}&$accountID={1}';
		var strModule = '', args=null;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
	
		if (!Ext.isEmpty(strGroupQuery)) {
				strUrl += '&$filter=' + strGroupQuery;
		}
		strUrl = Ext.String.format(strUrl, me.txncategory,me.accountFilter);
		
		return strUrl;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getSummarygroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		// me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode) {
			strModule = subGroupInfo.groupCode;
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
		
	},
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me=this;		
		var arrSortState=new Array(),objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		var objGroupView = me.getSummarygroupView();	
		var objSummaryView=me.getCashPositionSummaryView();
		
		var objLocalJsonData = '';
		if (objSavedLocalSummaryPref)
					objLocalJsonData = Ext.decode(objSavedLocalSummaryPref);
						
		var intPageSize = objLocalJsonData.d && objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageSize
				? objLocalJsonData.d.preferences.tempPref.pageSize
				: '';
			var intPageNo =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
						&&objLocalJsonData.d.preferences.tempPref
						&&objLocalJsonData.d.preferences.tempPref.pageNo
						?objLocalJsonData.d.preferences.tempPref.pageNo
						: 1;
		var sortState =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
					&&objLocalJsonData.d.preferences.tempPref
					&&objLocalJsonData.d.preferences.tempPref.sorter
					?objLocalJsonData.d.preferences.tempPref.sorter
					: [];
				
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = intPageSize || objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getDefaultColumnModel(arrCols);
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
					  sortState:sortState || objPref.sortState
                    },
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
	
	
	
	handleSummaryInformationRender : function() {
		var me = this;
		//summary not rendering properly incase of it is collapsed from other screen.
		if ($('#btrSummaryListId').hasClass('ft-accordion-collapsed'))						
		{
			$("#btrSummaryListId").removeClass('ft-accordion-collapsed');
		} 	
		var typeCodeUrl = me.generateTypeCodeUrl();
		me.populateSummaryInformationView(typeCodeUrl, false);
	},
	getTxnTypeJsonObj : function(jsonObject) {
		var jsonObj ='';
		if(jsonObject  instanceof Object ==false)
			jsonObj =JSON.parse(jsonObject);
		if(jsonObject  instanceof Array)
			jsonObj =jsonObject;
		for (var i = 0; i < jsonObj.length; i++) {
			jsonObj[i].txnDescription =  getLabel(jsonObj[i].txnType,jsonObj[i].txnDescription);
		}
		if(jsonObject  instanceof Object ==false)
			jsonObj = JSON.stringify(jsonObj)
		return jsonObj;
	},
	populateSummaryInformationView : function(strUrl, updateFlag) {
		var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = me.getTxnTypeJsonObj(data.d.summary);
							$('#summaryCarousalTargetDiv').carousel({
								 data : summaryData,
								 titleNode : "txnDescription",
								 //contentNode:"typeCodeAmount",
								 contentRenderer: function(value) {
										return  value.currenySymbol + " " + Ext.util.Format.number(value.typeCodeAmount , '0,000.00') ;	
									},	
								 transactionNode:'txnCount'	
								});
						}
					},
					failure : function(response) {
						
					}
				});
	},
	generateTypeCodeUrl : function() {
		var me = this;
		var groupView = me.getSummarygroupView();
		var typeCodeUrl = me.strReadSummaryInfoUrl;

		return typeCodeUrl;
	},
	
	doHandleSwitchTo : function() {
		var me = this;
		var url = null;
	      url = "cashPositionTxnCenter.form";
		
		if (!Ext.isEmpty(url))
			me.submitSwitchForm(url);
	},
	submitSwitchForm : function(url) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.action = url;
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
	
	pageTitleLoad : function() {
		var me = this;
		var isLinkHidden = false;
		var strSummaryLbl = getLabel('cpsummary', 'Cash Position Summary');
         $("ul.ft-extra-nav").html('<li class="ft-extra-active"><a>' +  strSummaryLbl + '</a></li>');
		 me.doHandleSwitchTo();

	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var args=null;
		var strModule = '';
		var visColsStr = "";
		strExtension = arrExtension[actionName];
		if(typeof strGridDetailTabSelected == 'undefined' || strGridDetailTabSelected == null || strGridDetailTabSelected == ''){
			strUrl = 'services/cashPositionsummary/generateReport.' + strExtension;
		}	
		else{
			if(strGridDetailTabSelected == 'showAccount'){	
				this.getController('AccountController').downloadReportAccnt(actionName);
				return;
			}
			else{ 	
				this.getController('TransactionController').downloadReportTxn(actionName);
				return;
			}
		}

		strUrl += '?$skip=1';
		var objGroupView = me.getSummarygroupView();
		var groupInfo = objGroupView.getGroupInfo() || '{}';	
		var subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		
		var strOrderBy = me.reportGridOrder;
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
			if (orderIndex > 0) {
				strOrderBy = strOrderBy.substring(orderIndex,
						strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;
			}
		}
		
		if (!Ext.isEmpty(objGroupView)) {
			colMap = new Object();
			colArray = new Array();

			grid = objGroupView.getGrid();

			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					if (col.dataIndex && arrDownloadSummaryReportColumn && arrDownloadSummaryReportColumn[col.dataIndex]) {
						if (colMap[arrDownloadSummaryReportColumn[col.dataIndex]]) {
							// ; do nothing
						} else {
							colMap[arrDownloadSummaryReportColumn[col.dataIndex]] = 1;
							colArray
									.push(arrDownloadSummaryReportColumn[col.dataIndex]);

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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	setDataForFilter : function(filterData) 
	{
		var me = this;
		var getGenericFilterView = me.getGenericFilterView();
		if(!Ext.isEmpty(getGenericFilterView))
		{
			var accountCombo = me.getAccountCombo();
			var txnCombo = me.getTxnCombo();
			if(!Ext.isEmpty(accountCombo.getValue()))
			{
			  me.accountFilter = accountCombo.getValue();
			  me.accountFilterDesc =  accountCombo.getRawValue();
			}
			if(!Ext.isEmpty(txnCombo.getValue()))
			{
			  me.txncategory = txnCombo.getValue();
			  me.txncategoryDesc =  txnCombo.getRawValue();
			}
		}
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "Client");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me
					.removeFromQuickArrJson(arrQuickJson, "Client");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "TransactionCategory");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"TransactionCategory");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "Account");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "Account");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		var sortByData = getAdvancedFilterSortByJson();
		if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
			me.advSortByData = sortByData;
		} else {
			me.advSortByData = [];
		}

		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if(!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;
			
	},
	applyFilter : function() {
	    var me = this;
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getSummarygroupView();
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
	},
	handleClearSummarySettings:function(){
		var me=this;
		var cashFilterView=me.getCashFilterView();
		if(!Ext.isEmpty(cashFilterView)){
			var accountCombo=me.getAccountCombo();
			me.accountFilter = 'ALL';
			accountCombo.selectAllValues();
			
		    var txnCombo=me.getTxnCombo();
		    me.txncategory="ALL";
		    txnCombo.selectAllValues();
		     
			me.filterData=[];
			me.refreshData();
		}
	},removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
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
	getQuickFilterQueryJson : function() {
		var me = this;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var entryDateValArray = [];
		var txncategory = me.txncategory;
		var accountFilter = me.accountFilter;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var txncategoryDesc = me.txncategoryDesc;
		var accountFilterDesc = me.accountFilterDesc;
		var accountFilterValArray = [];
		var accountFilterDescArray = [];
		var txncategoryValArray = [];
		var txncategoryDescArray = [];
		var jsonArray = [];
		var accountFilterArray = (!Ext.isEmpty(accountFilter)) ? accountFilter.split(',') : [];
		if(txncategory.length>0)
			var txnCatFilterArray = txncategory.split(',');
		else
			var txnCatFilterArray = txncategory;
		
		if(filterAccountDataCount==accountFilterArray.length)
				accountFilter = 'ALL';
		
		if(filterTxnCategoryCount==txnCatFilterArray.length)
				txncategory = 'ALL';
				
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'ALL') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : clientFilterVal
					});
		}
		if (accountFilter != null && accountFilter != 'ALL'
			&& accountFilter != 'all' && accountFilter.length >= 1) {
		accountFilterValArray = accountFilter.toString();

			if (accountFilterDesc != null && accountFilterDesc != 'ALL'
				&& accountFilterDesc != 'all'
				&& accountFilterDesc.length >= 1)
			accountFilterDescArray = accountFilterDesc.toString();
		
			jsonArray.push({
						paramName : 'accountId',
						paramValue1 : encodeURIComponent(accountFilterValArray.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'in',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('account','Account'),
						displayValue1 : accountFilterDescArray
					});
		}
		
		if (txncategory != null && txncategory != 'ALL'
			&& txncategory != 'all' && txncategory.length >= 1) {
		txncategoryValArray = txncategory.toString();

			if (txncategoryDesc != null && txncategoryDesc != 'ALL'
				&& txncategoryDesc != 'all'
				&& txncategoryDesc.length >= 1)
			txncategoryDescArray = txncategoryDesc.toString();
			
			jsonArray.push({
						paramName : 'categoryId',
						paramValue1 : encodeURIComponent(txncategoryValArray.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'in',
						dataType : 'S',
						displayType : 5,
						paramFieldLable :getLabel('txncategory','Transaction category'),
						displayValue1 : txncategoryDescArray
					});
		}

		return jsonArray;
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) 
	{
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)? 'all': selectedClient;
			
		me.clientFilterDesc = selectedClientDesc;
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') 
		{
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} 
		else 
		{
			me.applyQuickFilter();
		}
	},
	handleAppliedFilterDelete : function(btn)
	{
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData))
		{
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) 
			{
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
				me.filterData = arrQuickJson;
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		var accountFilter = me.accountFilter;
		
		if(strFieldName ==='accountId')
		{
		var accountComboBox = me.getCashFilterView().down('combo[itemId="viewAccountCombo"]');
			me.accountFilter = 'ALL';
			accountComboBox.setValue(me.accountFilter);
		}
		else if(strFieldName ==='categoryId')
		{
			var cateGoryComboBox = me.getCashFilterView().down('combo[itemId="viewcategoryCombo"]');
			me.txncategory = 'ALL';
			cateGoryComboBox.setValue(me.txncategory);
		}
		else if(strFieldName ==='Client')
		{			
			if(isClientUser())
			{
				var clientComboBox = me.getGenericFilterView().down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'ALL';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} 
			else 
			{
				var clientComboBox = me.getGenericFilterView().down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
	},savePageSetting : function(arrPref, strInvokedFrom) { 
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
		else
		{
			var me = this;
			me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), 
				subGroupInfo = groupView.getSubGroupInfo()|| {}, 
				objPref = {},
				groupInfo = groupView.getGroupInfo()|| '{}', 
				strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) 
						{
							if (pref.module === 'ColumnSetting') 
							{
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} 
			else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
restorePageSetting : function(arrPref, strInvokedFrom) { 
		//For US, NON US market		
		var me = this;
		if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
				{
					var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};

			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) 
			{
				if (pref.module === 'ColumnSetting') 
				{
					pref.module = strModule;
					return false;
				}
			});
			me.preferenceHandler.clearPagePreferences(me.strPageName,
			arrPref,me.postHandleRestorePageSetting, args, me, false);
		} 
		else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView(), gridModel = null;
			if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				
				if (args.objPref && args.objPref.gridCols)
					gridModel = 
					{
						columnModel : args.objPref.gridCols
					}
				objGroupView.reconfigureGrid(gridModel);
			}
			else
				{
					//window.location.reload();
					me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

					if (objGroupView)
						objGroupView.destroy(true);
					if (me.getCashPositionSummaryView()) 
					{
						objGroupView =me.getCashPositionSummaryView().createGroupView();
						me.getCashPositionSummaryView().add(objGroupView);
					
					}
				}
		} 
		else 
		{
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
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'&& _charCaptureGridColumnSettingAt === 'L') 
			{
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} 
			else
				{
					//window.location.reload();
					me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
	
					if (objGroupView)
						objGroupView.destroy(true);
					if (me.getCashPositionSummaryView()) 
					{
						objGroupView =me.getCashPositionSummaryView().createGroupView();
						me.getCashPositionSummaryView().add(objGroupView);
					
					}
				}
		} 
		else 
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) 
	{
		var me = this, objData = {}, objGroupView =  me.getSummarygroupView(), 
		objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '',
		objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		me.pageSettingPopup = null;

					if (!Ext.isEmpty(objSummaryGroupByPref))
					{
						//Replace as per screen saved preferences
						objPrefData = Ext.decode(objSummaryGroupByPref); //Replace as per screen saved preferences
						
						objGeneralSetting = objPrefData && objPrefData.d.preferences &&
						objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
						
						objGridSetting = objPrefData && objPrefData.d.preferences && 
						objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting : null;
						/**
						 * This default column setting can be taken from
						 * preferences/gridsets/under defined( js file)
						 */
						objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
								&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
								: (CASH_POSITION_GENERIC_COLUMN_MODEL || '[]'); 
						// For Dynamic profile will change column model as per grid set profile define at filter view js file
								
						if (!Ext.isEmpty(objGeneralSetting)) 
						{
							objGroupByVal = objGeneralSetting.defaultGroupByCode;
							objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
						}
						if (!Ext.isEmpty(objGridSetting)) 
						{
							objGridSizeVal = objGridSetting.defaultGridSize;
							objRowPerPageVal = objGridSetting.defaultRowPerPage;
						}
					}

					objData["groupByData"] = objGroupView? objGroupView.cfgGroupByData : [];
					objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
					objData["rowPerPage"] = _AvailableGridSize;
					objData["groupByVal"] = objGroupByVal;
					objData["filterVal"] = objDefaultFilterVal;
					objData["gridSizeVal"] = objGridSizeVal;
					objData["rowPerPageVal"] = objRowPerPageVal;
					subGroupInfo = objGroupView.getSubGroupInfo() || {};
					strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings","Column Settings") 
							+ ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
					
					me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
								cfgPopUpData : objData,
								cfgGroupView : objGroupView,
								cfgDefaultColumnModel : objColumnSetting,
								cfgViewOnly : _IsEmulationMode,
								cfgInvokedFrom : strInvokedFrom,
								title : strTitle,
								itemId : 'pagesettingCashPosition'
							});
					me.pageSettingPopup.show();
					me.pageSettingPopup.center();
	},
	/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objSaveState['filterAppliedType'] = "Q";
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
	saveLocalPref : function(arrSaveData){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(arrSaveData)) {
			args['tempPref'] = arrSaveData;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, arrSaveData,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this, strLocalPrefPageName = me.strPageName+'_TempPref';
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
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objSummaryGroupByPref = Ext.encode(data);
			}
		}
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSavedLocalSummaryPref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSavedLocalSummaryPref);
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
			objSavedLocalSummaryPref = '';
			me.objLocalData = '';
			var cashFilterView=me.getCashFilterView();
			if(!Ext.isEmpty(cashFilterView)){
				var accountCombo=me.getAccountCombo();
				me.accountFilter = 'ALL';
				accountCombo.selectAllValues();
				var txnCombo=me.getTxnCombo();
			    me.txncategory="ALL";
			    txnCombo.selectAllValues();
			    me.filterData=[];
			}
		}
	}
});