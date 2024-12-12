/**
 * @class GCP.controller.AccountActivityController
 * @extends Ext.app.Controller
 * @author Sofiyan Memon
 */
/**
 * This controller is prime controller in Periodic Summary Controller which
 * handles all measure events fired from GroupView. This controller has
 * important functionality like on any change on grid status or quick filter
 * change, it forms required URL and gets data which is then shown on Summary
 * Grid.
 */
Ext.define('GCP.controller.PeriodicSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.ForecastSummaryCenter', 'GCP.view.periodicSummary.PeriodicSummaryView'],
	refs : [{
		ref : 'forecastSummaryCenter',
		selector : 'accountCenter'
	}, {
		ref : 'periodicSummaryView',
		selector : 'periodicSummaryView'
	}, {
		ref : 'periodicGrid',
		selector : 'periodicSummaryView groupView smartgrid'
	}, {
		ref : 'groupView',
		selector : 'periodicSummaryView groupView'
	}, {
		ref : 'filterView',
		selector : 'periodicSummaryView groupView filterView'
	}],
	config : {
		strPageName : strPeriodicPageName,
		companyName : null, 
		companyCode : null,
		clientCode : null,
		accountNumber : null,
		accountDesc : null,
		objPeriodicFilterPref : null,
		objPeriodicGridPref : null,
		objPeriodicPanelPref : null,
		filterData : [],
		isCompanySelected : false,
		filterAccount : null,
		filterAccountDesc : null,
		dateHandler : null,
		vFromDate : null,
		vToDate : null,
		datePickerSelectedDate : null,
		reportGridOrder : null,
		newTitle : 'Periodic Summary'
	},
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		$(document).on('performReportActionPeriodic', function(event, actionName) {
			me.downloadPeriodicReport(actionName);
		});
		me.control({
			'periodicSummaryView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			}
		});
		GCP.getApplication().on({
			'showPeriod' : function(record, summaryType) {
				var strAppDate = dtSellerDate;
				var dtFormat = strExtApplicationDateFormat;
				me.isFirstRequest = true;
				isPeriodOn = true;
				isTxnOn = false;
				me.companyName = record.data.clientDesc;
				me.companyCode = record.raw.clientCode;
				me.clientCode = me.companyCode;
				selectedFilterClient = me.clientCode;
				selectedFilterClientDesc = record.data.clientDesc;
				me.accountNumber = record.raw.glId;
				me.accountId = record.raw.accountId;
				me.accountDesc = record.raw.glId + ' | ' + record.raw.accDesc;
				me.filterAccount = me.accountId;
				me.filterAccountDesc = me.accountDesc;
				me.filterPeriodType = selectedFilterPeriodicType;
				me.filterPeriodDesc = selectedFilterPeriodicDesc;
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePref, null, me, true);
				me.updateFilterConfig();
				$('#cffSummaryBackDiv').show();
				if(entityType === "1"){
					$('#cffDisclaimerText').html(periodicDisclaimerText);
				}else{
					me.getDisclaimerText(me.clientCode, "PeriodicSummary");
				}
				$('#cffSummaryTitle').html(getLabel('periodicTitle', 'Cashflow Forecast / Forecast Summary / Periodic Summary'));
				var container = me.getForecastSummaryCenter();
				if (!Ext.isEmpty(container)) {
					var periodicView = Ext.create(
							'GCP.view.periodicSummary.PeriodicSummaryView', {
								companyName : me.companyName
							});
					container.updateView(periodicView);
					container.setActiveCard(1);
				}
			
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			}
		});
		$(document).on('performPageSettingsPeriodic', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		$(document).on('performBackPeriodic', function(event) {
			me.doHandleBackAction(me);
		});
		me.control({
			'periodicSummaryFilterView combo[itemId="clientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts){
					me.updateFilterConfig();
					combo.setValue(me.companyName);
				},
				select : function(combo, record) {
					selectedFilterClient = combo.getValue();
					selectedFilterClientDesc = combo.getDisplayValue();
					me.getDisclaimerText(selectedFilterClient, "PeriodicSummary");
					me.handleClientChangeInQuickFilter();
					me.isCompanySelected = true;
					
				}
			},
			'periodicSummaryFilterView combo[itemId="clientComboAuto"]' : {
				select : function(combo, record) {
					selectedFilterClient = combo.getValue();
					selectedFilterClientDesc = combo.getDisplayValue();
					//Gets the disclaimer text for selected client
					me.getDisclaimerText(selectedFilterClient, "PeriodicSummary");
					me.handleClientChangeInQuickFilter();
					me.isCompanySelected = true;
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
								selectedFilterClient = me.companyCode;
								selectedFilterClientDesc = combo.getDisplayValue();
								me.handleClientChangeInQuickFilter();
								var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
								me.filterAccount = me.accountId;
								me.filterAccountDesc = me.accountNumber;
								accountCombo.setValue(me.filterAccountDesc);
								me.isCompanySelected = true;
					}
				},
				'afterrender' : function(combo, newValue, oldValue, eOpts){
					me.updateFilterConfig();
					combo.setValue(me.companyName);
				}
			},
			'periodicSummaryFilterView combo[itemId="accountCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts){
					me.changeClientAndRefreshGrid();
					combo.setValue(me.accountDesc);
				},
				select : function(combo, record, eOpts) {
					me.filterAccount = record[0].data.CODE;
					me.filterAccountDesc = combo.getRawValue();
					me.isAccountSelected = true;
					me.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyFilter();
					
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterAccount = "";
							me.filterAccountDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isAccountSelected = true;
						}
					}else{
						me.isAccountSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isAccountSelected = false;
				}
			},
			'periodicSummaryFilterView combo[itemId="periodTypeCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts){
					combo.setValue(me.accountDesc);
				},
				select : function(combo, record, eOpts) {
					me.filterPeriodType = combo.getValue();
					me.filterPeriodDesc = combo.getRawValue();
					selectedFilterPeriodicType = me.filterPeriodType; 
					preferedPeriodType = selectedFilterPeriodicType; 
					selectedFilterPeriodicDesc = me.filterPeriodDesc;
					me.isPeriodSelected = true;
					me.filterApplied = 'Q';
					saveScreenFilters();
					me.setDataForFilter();
					me.applyFilter();
					
				},
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.filterPeriodType = "";
							me.filterPeriodDesc = "";
							me.setDataForFilter();
							me.applyFilter();
							me.isPeriodSelected = true;
						}
					}else{
						me.isAccountSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isPeriodSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isPeriodSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
						
								me.filterPeriodType = combo.getRawValue();
								me.filterPeriodDesc = combo.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isPeriodSelected = true;
					}
				}
			},
			'periodicSummaryFilterView component[itemId="periodDatePicker"]' : {
				render : function() {
					$('#periodDatePicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
						minDate : dtHistoryDate,
						changeYear : true,
						dateFormat : strApplicationDateFormat,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.datePickerSelectedDate = dates;
								me.handleDateChange();
								me.setDataForFilter();
								me.applyFilter();
							}
						}
					});
					if(!Ext.isEmpty(me.datePickerSelectedDate)){
						me.handleDateChange();
					}
					var currentDate = dtHistoryDate;
					var filterEndDate = new Date();
					filterEndDate.setDate(currentDate.getDate() + parseInt(filterDays,10));
					$("#periodDatePicker").datepick("option",
							"maxDate", filterEndDate);
				}
			},
			'pageSettingPopUp[itemId="periodicSetting"]' : {
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
			'filterView[itemId="periodicFilterView"] button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView[itemId="periodicFilterView"]' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			}
		});
	},
	doHandleBackAction : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView())) {
//			me.getFilterView().destroy();
			me.handleClearSettings();
		}
		GCP.getApplication().fireEvent('showSummary');
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#periodDatePicker');
		
		if (isClientUser()) {
			var clientComboBox = me.getFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = me.companyName;
			selectedFilterClientDesc = me.companyName;
			selectedFilterClient = me.companyCode;
			selectedClientDesc = me.companyName;
			me.clientCode = me.companyCode;
			me.clientDesc = me.companyName;
			clientComboBox.setValue(me.clientFilterVal);
			me.changeClientAndRefreshGrid();
			
		} else {
			var clientComboBox = me.getFilterView()
					.down('combo[itemId="clientComboAuto]');
			selectedFilterClient = me.companyCode;
			selectedFilterClientDesc = me.companyName;
			me.clientCode = me.companyCode;
			me.clientDesc = me.companyName;
			me.clientFilterVal = me.companyName;
			clientComboBox.setValue(me.clientFilterVal);
			me.changeClientAndRefreshGrid();
		}
		
		var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
		var accountFilterVal = me.accountDesc;
		me.filterAccount = me.accountId;
		me.filterAccountDesc = me.accountDesc;
		accountCombo.setValue(accountFilterVal);
		
		var periodTypeCombo = me.getFilterView().down('combo[itemId="periodTypeCombo"]');
		var periodTypeFilterVal = selectedFilterPeriodicDesc;
		me.filterPeriodType = selectedFilterPeriodicType;
		me.filterPeriodDesc = selectedFilterPeriodicDesc;
		periodTypeCombo.setValue(periodTypeFilterVal);
		
		me.datePickerSelectedDate = '';
		me.handleDateChange();
		
		if(entityType === "0"){
			$('#cffDisclaimerText').text('');
			$('#cffDisclaimerTextWrap').addClass('hidden');
		}
		
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
		me.updateFilterInfo();
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
			if(Ext.isEmpty(objData.paramName)){
				var arr = me.findInQuickFilterData(objData);
				if(!Ext.isEmpty(arr))
					strFieldName = arr.paramName || arr.field;
			} else
				strFieldName = objData.paramName || objData.field;
		var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
		if(strFieldName === "clientCode") {
			if (isClientUser()) {
				var clientComboBox = me.getFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = me.companyName;
				selectedFilterClientDesc = me.companyName;
				selectedFilterClient = me.companyCode;
				me.clientCode = me.companyCode;
				selectedClientDesc = me.companyName;
				clientComboBox.setValue(me.clientFilterVal);
				me.changeClientAndRefreshGrid();
				var accountFilterVal = me.accountDesc;
				me.filterAccount = me.accountId;
				me.filterAccountDesc = me.accountDesc;
				accountCombo.setValue(accountFilterVal);
				
			} else {
				var clientComboBox = me.getFilterView()
						.down('combo[itemId="clientComboAuto]');
				me.clientFilterVal = me.companyName;
				selectedFilterClient = me.companyCode;
				me.clientCode = me.companyCode;
				selectedFilterClientDesc = me.companyName;
				clientComboBox.setValue(me.clientFilterVal);
				me.changeClientAndRefreshGrid();
				var accountFilterVal = me.accountDesc;
				me.filterAccount = me.accountId;
				me.filterAccountDesc = me.accountDesc;
				accountCombo.setValue(accountFilterVal);
			}
		}  else if(strFieldName === "accountId") {
			me.filterAccount = me.accountId;
			me.filterAccountDesc = me.accountDesc;
			var accountDescription = me.accountDesc;
			accountCombo.setValue(accountDescription);
		} else if(strFieldName === 'period'){
			var periodTypeCombo = me.getFilterView().down('combo[itemId="periodTypeCombo"]');
			var periodTypeFilterVal = selectedFilterPeriodicDesc;
			me.filterPeriodType = selectedFilterPeriodicType;
			me.filterPeriodDesc = selectedFilterPeriodicDesc;
			periodTypeCombo.setValue(periodTypeFilterVal);
		}else  if(strFieldName === 'Date'){
			me.datePickerSelectedDate = '';
			me.handleDateChange();
			var datePickerRef = $('#periodDatePicker');
			if(Ext.isEmpty(me.vFromDate) || Ext.isEmpty(me.vToDate))
				datePickerRef.datepick('setDate', [me.vFromDate, me.vToDate]);
		}
		me.setDataForFilter();
		me.applyFilter();
	},
	findInQuickFilterData : function(arr) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == 'Date') {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	resetAllFields : function() {
		var me = this;
		me.datePickerSelectedDate = [];
		$('#periodDatePicker').val("");
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		objGroupView.refreshData();
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
		me.changeClientAndRefreshGrid();
	},
	changeClientAndRefreshGrid : function(accountCode, accountDesc){
		var me = this;
		var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
		var accountComboStore = me.getAccountStore();
		accountCombo.bindStore(accountComboStore);
		accountCombo.reset();
		if(!Ext.isEmpty(accountComboStore.getAt(0)))
			accountCombo.setValue(accountComboStore.getAt(0).data.DISPLAYFIELD);
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		
		var grid = me.getPeriodicGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
			strUrl = strUrl + me.getFilterUrl() + "&$clientCode=" + selectedFilterClient + "&$accountId=" + me.filterAccount;
			strUrl = strUrl + "&$periodicType=" + me.filterPeriodType + "&$startDate=" + me.vFromDate + "&$endDate=" + me.vToDate;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.updateFilterInfo();
	},
	updateFilterInfo : function() {
		var me = this;
		var arrInfo = generateFilterArray(me.filterData,strApplicationDateFormat) || [];
		var clientFilterIndex = -1, strValue = '',arrDate = [];
		
		arrInfo.push({
			fieldId : me.filterPeriodType,
			fieldLabel : 'Period Type',
			fieldTipValue : me.filterPeriodDesc,
			fieldValue : me.filterPeriodDesc,
			fieldObjData : []
		});
		
		if(!Ext.isEmpty(me.datePickerSelectedDate)){
			var objDateParams = me.getDateParam();
			arrDate = generateFilterArray([{
					paramName : "Date",
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D',
					paramFieldLable : getLabel('date1', 'Date')
				}]) || [];
		}
		me.getFilterView().updateFilterInfo(arrInfo.concat(arrDate));
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		me.postHandleDoHandleGroupTabChange();
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPeriodicSummaryView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeMaster;
			colModel = arrCols;
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
		if(document.title !== me.newTitle)
			document.title = me.newTitle;
		var objGroupView = me.getGroupView();
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + "&$filter=" + me.getFilterUrl(subGroupInfo, groupInfo) + "&$clientCode=" + selectedFilterClient + "&$accountId=" + me.filterAccount;
		strUrl = strUrl + "&$periodicType=" + me.filterPeriodType + "&$startDate=" + me.vFromDate + "&$endDate=" + me.vToDate;
//		me.setDataForFilter();
		grid.loadGridData(strUrl, null, null, false);
		objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
		me.reportGridOrder = strUrl;
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
		me.updateFilterInfo();
	},
	handleGridRowClick : function(record, grid, columnType) {
		if (columnType !== 'actioncontent') {
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
	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		//TODO implement at time of periodic summary dev
		var me = this;
		var strEventName = null;
		summaryType = 'TransactionSummary';
		if(actionName === 'btnViewTxnSummary')
			strEventName = 'showTransactionView';
		GCP.getApplication().fireEvent(strEventName, record, summaryType);
	},
	postDoHandleReadPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d.preferences)) {
				me.objPeriodicFilterPref = data.d.preferences.periodicFilterPref;
				me.objPeriodicGridPref = data.d.preferences[me.strServiceParam];
				me.objPeriodicPanelPref = data.d.preferences.panels;
			}
		}
	},
	handleDateChange : function() {
		var me = this,objDateParams = me.getDateParam(),datePickerRef = $('#periodDatePicker'),frmDate,toDate;
		
		me.vFromDate =  objDateParams.fieldValue1;
		me.vToDate = objDateParams.fieldValue2;
		
		frmDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		toDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		
		if (objDateParams.operator == 'eq') {
			datePickerRef.datepick('setDate', frmDate);
		}  else{
			datePickerRef.datepick('setDate', [frmDate, toDate]);
		}
	},
	getDateParam : function(dateType) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		if (!isEmpty(me.datePickerSelectedDate)) {
			if (me.datePickerSelectedDate.length == 1) {
				fieldValue1 = Ext.Date.format(
						me.datePickerSelectedDate[0], strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
			} else if (me.datePickerSelectedDate.length == 2) {
				fieldValue1 = Ext.Date.format(
						me.datePickerSelectedDate[0], strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
						me.datePickerSelectedDate[1], strSqlDateFormat);
				operator = 'bt';
			}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
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
		if (me.clientCode != 'all' && clientCount > 1) {
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : clientCodeVal,
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : selectedFilterClientDesc
			});
		}
		
		var accountFilter = me.getFilterView().down("combo[itemId='accountCombo']");
		
		if(isEmpty(me.filterAccount)){
			 me.filterAccount = !Ext.isEmpty(accountFilter.getStore().getAt(0)) ? accountFilter.getStore().getAt(0).data.CODE : '';
			me.filterAccountDesc = !Ext.isEmpty(accountFilter.getStore().getAt(0)) ? accountFilter.getStore().getAt(0).data.DISPLAYFIELD : '';
		}
		
		if(!Ext.isEmpty(me.accountNumber)) {
			jsonArray.push({
				paramName : 'accountId',
				operatorValue : 'lk',
				paramValue1 : me.filterAccount,
				dataType : 'S',
				paramFieldLable : getLabel('cffPackage1', 'Account Number'),
				displayType : 5,
				displayValue1 :me.filterAccountDesc
			});
		}
		return jsonArray;
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
				if( filterData[index].paramName != 'validity'){
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					}
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
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var screenPref = objSelectedScreenFilter 
						&& objSelectedScreenFilter.d 
						&& objSelectedScreenFilter.d.preferences 
						&& objSelectedScreenFilter.d.preferences.screenFilters || null;
		
		if (!Ext.isEmpty(screenPref) && screenPref !== undefined && Ext.isEmpty(preferedPeriodType)) {
			var data = objSelectedScreenFilter;

			if (!Ext.isEmpty(data.d.preferences.screenFilters.period))
				me.filterPeriodType = data.d.preferences.screenFilters.period;
		} else if(!Ext.isEmpty(preferedPeriodType)){
			switch(preferedPeriodType){
			case "D":
				selectedFilterPeriodicType ="D";
				me.filterPeriodType = selectedFilterPeriodicType;
				selectedFilterPeriodicDesc = "Daily";
				me.filterPeriodDesc = selectedFilterPeriodicDesc;
				break;
			case "W":
				selectedFilterPeriodicType ="W";
				me.filterPeriodType = selectedFilterPeriodicType; 
				selectedFilterPeriodicDesc = "Weekly";
				me.filterPeriodDesc = selectedFilterPeriodicDesc;
				break;
			case "M":
				selectedFilterPeriodicType ="M";
				me.filterPeriodType = selectedFilterPeriodicType;
				selectedFilterPeriodicDesc = "Monthly";
				me.filterPeriodDesc = selectedFilterPeriodicDesc;
				break;
			default:
				selectedFilterPeriodicType ="D";
				me.filterPeriodType = selectedFilterPeriodicType;
				selectedFilterPeriodicDesc = "Daily";
				me.filterPeriodDesc = selectedFilterPeriodicDesc;
				break;
			}
		} else{
			me.filterPeriodType = 'D';
			me.filterPeriodDesc = 'Daily';
		}
		
		if (me.clientCode != 'all' && clientCount > 1) {
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = selectedFilterClient;
			arrJsn.push({
				paramName : clientParamName,
				paramValue1 : clientCodeVal,
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : me.companyName
			});
		}
		
		if(!Ext.isEmpty(me.accountId)) {
			arrJsn.push({
				paramName : 'accountId',
				operatorValue : 'lk',
				paramValue1 : me.accountId,
				dataType : 'S',
				paramFieldLable : getLabel('cffPackage1', 'Account Number'),
				displayType : 5,
				displayValue1 : me.accountDesc
			});
		}
		me.filterData = arrJsn;
		var	args = {
				'module' : 'panels'
			};
		me.preferenceHandler.readModulePreferences(me.strPageName,
					'panels', me.postReadPanelPrefrences, args, me, true);	
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
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objPeriodicPref)) {
			objPrefData = Ext.decode(objPeriodicPref);
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
					: arrPeriodicGenericGridColumnModel || '[]';

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["filterUrl"] = '';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
		"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : Ext.decode(objColumnSetting) || PERIODIC_SUMM_GENERIC_COLUMN_MODEL,
					cfgViewOnly : _IsEmulationMode,
					itemId : 'periodicSetting',
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
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
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getPeriodicSummaryView()) {
					objGroupView =me.getPeriodicSummaryView().createGroupView();
					me.getPeriodicSummaryView().add(objGroupView);
				}
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
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					};
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			}
			else{
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getPeriodicSummaryView()) {
					objGroupView =me.getPeriodicSummaryView().createGroupView();
					me.getPeriodicSummaryView().add(objGroupView);
				}
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
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
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
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objPeriodicPref = Ext.encode(data);
			}
		}
	},
	/*Page setting handling ends here*/
	/*Gets the disclaimer Text for selected client in filter and summary type page*/
	getDisclaimerText : function(selectedClient, summaryType) {
		if(selectedClient === "all" && entityType === "1"){
			selectedClient = "";
		}
		var me = this;
		$.ajax({
			url : 'services/getDisclaimerText?$sellerCode='+ strSeller + '&$clientCode=' + selectedClient + '&$summaryType=' + summaryType,
			type : 'POST',
			contentType : "application/json",
			success :function(data){
				if(!Ext.isEmpty(data) && !Ext.isEmpty(data.d) && !Ext.isEmpty(data.d.disclaimerText)){					
					var disclaimerText = data.d.disclaimerText;
					$('#cffDisclaimerText').text(disclaimerText);
					$('#cffDisclaimerTextWrap').removeClass('hidden');
				}else {
					$('#cffDisclaimerText').text('');
					$('#cffDisclaimerTextWrap').addClass('hidden');
				}
				
			},
			error : function(data){
			}
		});
	},
	getAccountStore : function(){
		var data;
		var me = this;
		var accountStore = Ext.create('Ext.data.Store', {
			fields : ['DISPLAYFIELD','ACCT_NMBR', 'CODE', 'DESCR']
		});
		accountStore.removeAll();
		Ext.Ajax.request({
			url : 'services/userseek/forecastAccountsSeek.json?$filtercode1=' + me.clientCode,
			method : 'GET',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				if (accountStore) {
					accountStore.removeAll();
					var count = data.length;
					for(var i=0; i<count; i++) {
						var record = {
							'DISPLAYFIELD' : data[i].DISPLAYFIELD,
							'ACCT_NMBR' : data[i].ACCT_NMBR,
							'CODE' : data[i].CODE,
							'DESCR' : data[i].DESCR
						}
						accountStore.add(record);
					}
				}
			},
			failure : function() {
			}
		});
		return accountStore;
	},
	
	downloadPeriodicReport : function(actionName) {
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
		strUrl = 'services/generateForecastPeriodicReport.'+strExtension;
		strUrl += '?$skip=1';
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		var filterUrl = me.getFilterUrl(subGroupInfo,groupInfo);
		var filterData = me.filterData;
		var columnFilterUrl = me.getFilterUrl(filterData);
		
		if (!Ext.isEmpty(filterUrl)) {
			strUrl += filterUrl;
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += ' and ' + columnFilterUrl;
		} else {
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += "&$filter=" + columnFilterUrl;
		}
		
		strUrl += "&$clientCode=" + selectedFilterClient + "&$accountId=" + me.filterAccount;
		strUrl = strUrl + "&$periodicType=" + me.filterPeriodType + "&$startDate=" + me.vFromDate + "&$endDate=" + me.vToDate;
		
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
				if (col.dataIndex && arrPeriodicDownloadReportColumn[col.dataIndex])
					colArray.push(arrPeriodicDownloadReportColumn[col.dataIndex]);
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
		form.name = 'frmMainPeriodic';
		form.id = 'frmMainPeriodic';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						key, objParam[key]));
				});
				
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
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
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
});