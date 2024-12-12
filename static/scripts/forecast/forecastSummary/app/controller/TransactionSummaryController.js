Ext.define('GCP.controller.TransactionSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.ForecastSummaryCenter', 'GCP.view.transactionSummary.TransactionSummaryView'],
	refs : [{
		ref : 'forecastSummaryCenter',
		selector : 'accountCenter'
	}, {
		ref : 'transactionSummaryView',
		selector : 'transactionSummaryView'
	}, {
		ref : 'grid',
		selector : 'transactionSummaryView groupView smartgrid[itemId="transactionSummGrid"]'
	}, {
		ref : 'groupView',
		selector : 'transactionSummaryView groupView'
	},{
		ref : 'pageSettingPopUp',
		selector : 'pageSettingPopUp[itemId="txnSetting"]'
	},{
		ref : 'filterView',
		selector : 'transactionSummaryView groupView filterView'
	}],
	config : {
		strPageName:'forecastTransactionSummary',
		companyName : null, 
		clientCode : null,
		periodRecord : null,
		dateHandler : null,
		datePickerSelectedDate : [],
		periodicDateQuickFilterVal :'',
		dateRangeFilterVal : '13',
		periodicDate : '',
		fromDate : '',
		toDate : '',
		forecastAccount : '',
		forecastAccountDesc : '',
		fromDate : '',
		toDate : '',
		filterAccount : null,
		filterAccountDesc : null,
		isAccountSelected : null,
		reportGridOrder : null,
		newTitle : 'Transaction Summary',
		pageSettingsRestored : false,
		firstLoad : false
		},
	init : function() {
		var me = this;
		var companyName, accountNumber;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		$(document).on('performPageSettingsTransaction', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		$(document).on('performBackTransaction', function(event) {
			me.doHandleBackAction(me);
		});
		$(document).on('performReportActionTransaction', function(event, actionName) {
			me.downloadTxnReport(actionName);
		});
		me.control({
			'transactionSummaryView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'render':function(){
					me.firstLoad = true;
				}
			},
			
			'transactionSummaryView combo[itemId="accountCombo"]' : {
			blur : function(combo, The, eOpts ){
				if(me.isAccountSelected == false  
						&& !Ext.isEmpty(combo.getRawValue()) ){
							me.filterAccount = combo.getValue();
							me.filterAccountDesc = combo.getValue();
							me.isAccountSelected = true;
							me.setDataForFilter();
							me.applyFilter();
				}
			},
			afterrender : function(combo, newValue, oldValue, eOpts){
				if((!Ext.isEmpty(me.forecastAccount)) && (!Ext.isEmpty(me.forecastAccountDesc))){
					combo.setValue(me.forecastAccount);
					me.filterAccount = me.forecastAccount;
					me.filterAccountDesc = me.forecastAccountDesc;
					me.isAccountSelected = true;
					me.setDataForFilter();
					me.applyFilter();
				}
				else{
					me.filterAccount = '';
					me.filterAccountDesc = '';
					me.isAccountSelected = false;
				}
			}
		},
		'transactionSummaryView component[itemId="periodicDatePicker"]' : {
			render : function() {
				$('#periodicDatePicker').datepick({
					//monthsToShow : 1,
					changeMonth : false,
					//minDate : dtHistoryDate,
					changeYear : false,
					dateFormat : strApplicationDateFormat,
					rangeSeparator : ' to ',
					onClose : function(dates) {
						if (!Ext.isEmpty(dates)) {
							me.dateRangeFilterVal = '13';
							me.periodicDateQuickFilterVal = me.dateRangeFilterVal;
							me.datePickerSelectedDate = dates;
							me.datePickerSelectedEffectiveDate = dates;
							me.handleDateChange(me.dateRangeFilterVal);
							me.setDataForFilter();
							me.applyFilter();
						}
					}
				});

			},
			'afterrender' : function(){
				me.datePickerSelectedDate = [];
				var datePickerRef = $('#periodicDatePicker');
				datePickerRef.datepick('setDate', [me.periodicDate]);
				$('#periodicDatePicker').val(me.periodicDate);
				if (!Ext.isEmpty(me.periodicDate)) {
					me.periodicDateQuickFilterVal = '13';
					if((!Ext.isEmpty(me.fromDate)) && (!Ext.isEmpty(me.toDate))){
						var fromDate = new Date(Ext.Date.parse(me.fromDate, strExtApplicationDateFormat));
						var toDate = new Date(Ext.Date.parse(me.toDate, strExtApplicationDateFormat));
						me.datePickerSelectedDate.push(fromDate);
						me.datePickerSelectedDate.push(toDate);
					}
					else if((!Ext.isEmpty(me.fromDate)) && Ext.isEmpty(me.toDate)){
						var fromDate = new Date(Ext.Date.parse(me.fromDate, strExtApplicationDateFormat));
						me.datePickerSelectedDate.push(fromDate);
					}
					else{
						me.datePickerSelectedDate = [];
						me.periodicDateQuickFilterVal = '';
					}
					me.handleDateChange(me.periodicDateQuickFilterVal);
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		},
			'pageSettingPopUp[itemId="txnSetting"]' : {
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
		GCP.getApplication().on({
			'showTransactionView' : function(record) {
				me.periodRecord = record;
				me.datePickerSelectedDate = [];
				isTxnOn = true;
				isPeriodOn = false;
				var strAppDate = dtSellerDate;
				var dtFormat = strExtApplicationDateFormat;
				me.isFirstRequest = true;
				$('#cffSummaryBackDiv').show();
				//me.companyName = record.data.clientDesc;
				me.clientCode = record.data.clientCode;
				selectedFilterClient = me.clientCode;
				me.fromDate = record.data.forecastDate
				me.toDate = record.data.forecastToDate;
				if(!Ext.isEmpty(me.toDate))
					var concatEffectiveDate = me.fromDate + " " + "to" + " " + me.toDate;
				else
					var concatEffectiveDate = me.fromDate;
				me.periodicDate="";
				me.periodicDate = concatEffectiveDate;
				me.forecastAccount = record.data.glId;
				me.forecastAccountDesc = record.data.accDesc;
				if(entityType === "1"){
					$('#cffSummaryBackDiv').show();
					$('#cffDisclaimerText').html(txnDisclaimerText);
				}else{
					me.getDisclaimerText(me.clientCode, "TxnSummary");
				}
				$('#cffSummaryTitle').html(getLabel('transactionTitle', 'Cashflow Foreacast / Forecast Summary / Periodic Summary / Transaction Summary'));
				var container = me.getForecastSummaryCenter();
				if (!Ext.isEmpty(container)) {
					var transactionSummView = Ext.create(
							'GCP.view.transactionSummary.TransactionSummaryView', {
//								summaryType : me
//										.getSummaryTypeVal(me.dateFilterVal),
//								accountFilter : me.accountFilter,
//								accCcySymbol : me.selectedAccCcySymbol,
//								gridModel : me.getGridModel()

							});
					container.updateView(transactionSummView);
					container.setActiveCard(2);
				}
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			}
		});
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Need to refactor for non us market
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode
			if(groupInfo.groupTypeCode === "CFF_TXNSUM_OPT_PKG")
					strModule = 'all';
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);
		} else
			me.postHandleDoHandleGroupTabChange();
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getTransactionSummaryView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
		
		if(Ext.isEmpty(objGroupView.cfgGroupCode) && !Ext.isEmpty(objGroupView.cfgGroupByData)){
			me.pageSettingsRestored = true;
		}
		
		if(me.firstLoad && (objGroupView.cfgGroupCode === 'CFF_TXNSUM_OPT_PKG' || me.pageSettingsRestored)){
			me.getCFFGroupByData();
		}
		
		me.firstLoad = false;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter) + "&$filter="+ me.getFilterUrl(subGroupInfo, groupInfo);
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;

				
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);


			}
		}
		if (arrOfParseQuickFilter)
		me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);

		
		//TODO update above condition with respect to adv filter later
		
		grid.loadGridData(strUrl, null, null, false);
		me.reportGridOrder = strUrl;
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType, rowIndex);
		});
		$('#periodicDatePicker').val(me.periodicDate);
	},
	handleDateChange : function(index)
	{
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#periodicDatePicker');
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}


		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					datePickerRef.datepick('setDate', vToDate);
				} else if(index === '12'){
					datePickerRef.datepick('setDate', vFromDate);
				} else {
					datePickerRef.datepick('setDate', vFromDate);
				}
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		}
	},
	getDateParam : function(index) {
		var me = this;

		me.dateRangeFilterVal = index;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Widget Date Filter
				if (!isEmpty(me.datePickerSelectedEntryAdvDate)) {
					if (me.datePickerSelectedEntryAdvDate.length == 1) {
						fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
						fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
						fieldValue2 = me.datePickerSelectedEntryAdvDate[1];
						if (fieldValue1 == fieldValue2)
							operator = 'eq';
						else
							operator = 'bt';
					}
				}
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				// Latest
				if(!Ext.isEmpty(filterDays) && filterDays !== '999'){
					fieldValue1 = Ext.Date.format(dtHistoryDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
					operator = 'bt';
				}
				else{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'le';
				}
				break;
			 case '14' :
				// Last Month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;	
			 case '13' :
				// Date Range
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
				
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
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
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		objGroupView.refreshData();
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupType = (subGroupInfo && subGroupInfo.groupId)
		? subGroupInfo.groupId
		: '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams();
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strQuickFilterUrl = strQuickFilterUrl + "and clientCode eq " + "'" + me.clientCode + "'";
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
	generateUrlWithQuickFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var strFilter = '&$filter=';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			if (Ext.isEmpty(filterData[index].operatorValue)) {
				isFilterApplied = false;
				continue;
			}
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
									strTemp = strTemp
											+ filterData[index].paramName
											+ ' eq ';
									strTemp = strTemp + '\'' + objArray[i]
											+ '\'';
									if (i != objArray.length - 1)
										strTemp = strTemp + ' or ';

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
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
			me.refreshData();
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.filterData = me.getQuickFilterQueryJson();
	},
	getQuickFilterQueryJson : function() {
		var me = this,
		jsonArray = [];
		
		if(!Ext.isEmpty(me.filterAccount)) {
			jsonArray.push({
				paramName : 'accountId',
				operatorValue : 'lk',
				paramValue1 : me.filterAccount,
				dataType : 'S',
				paramFieldLable : getLabel('cffPackage1', 'Account Number'),
				displayType : 5,
				displayValue1 : me.filterAccount
			});
		}
		
		var index = me.periodicDateQuickFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(objDateParams)) {
			if(!Ext.isEmpty(objDateParams.fieldValue1) || !Ext.isEmpty(objDateParams.fieldValue2))
			{
			jsonArray.push({
						paramName : 'forecast_date',// periodic date
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('periodicDate', 'Period')
					});
			}
		}
		
		return jsonArray;
	},
	handleGridRowClick : function(record, grid, columnType, rowIndex) {
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
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record, rowIndex);
			}
		}
	},
	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		var me = this;
		var strEventName = null;
		
		if(actionName === 'btnViewTxn'){
			handleForecastDetailViewGridRowAction(grid, rowIndex,
					null, actionName, null, record);
		}
		//GCP.getApplication().fireEvent(strEventName, record, summaryType);
	},
	/* Page setting handling starts here */
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
				title : getLabel('errorPopUpTitle', 'Error'),
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
						me.updateObjSummaryPref, null, me, true);
		}
	},
	updateObjSummaryPref : function(data) {
		objTransactionPref = Ext.encode(data);
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		args['strInvokedFrom'] = strInvokedFrom;
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
				if(groupInfo.groupTypeCode === "CFF_TXNSUM_OPT_PKG")
					strModule = 'all';
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
			if(groupInfo.groupTypeCode === "CFF_TXNSUM_OPT_PKG")
					strModule = 'all';		
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
			var objGroupView = me.getGroupView();			
			var gridModel = null, objData = null;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					}
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
			{
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.updateObjSummaryPref, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getTransactionSummaryView()) {
					objGroupView =me.getTransactionSummaryView().createGroupView();
					me.getTransactionSummaryView().add(objGroupView);		
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
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {				
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
			{
				//window.location.reload();
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.updateObjSummaryPref, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getTransactionSummaryView()) {
					objGroupView =me.getTransactionSummaryView().createGroupView();
					me.getTransactionSummaryView().add(objGroupView);
				}
			}				
		} else {
			Ext.MessageBox.show({
				title : getLabel('errorPopUpTitle', 'Error'),
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
		if (!Ext.isEmpty(objTransactionPref)) {
			objPrefData = Ext.decode(objTransactionPref);
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
					: Ext.decode(arrGenericTxnColumnModel || '[]');
					
			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		else if (Ext.isEmpty(objTransactionPref))
		{
			objColumnSetting = TRANSACTION_SUMM_GENERIC_COLUMN_MODEL;
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = '';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
		"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					itemId : 'txnSetting',
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
	doHandleBackAction : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView()) && !Ext.isEmpty(me.getFilterView().up('filterView'))) {
			me.getFilterView().up('filterView').destroy();
		}
		GCP.getApplication().fireEvent('showPeriod',me.periodRecord);
	},
	downloadTxnReport : function(actionName) {
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
		strUrl = 'services/generateForecastTxnReport.'+strExtension;
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
				if (col.dataIndex && arrTxnDownloadReportColumn[col.dataIndex])
					colArray.push(arrTxnDownloadReportColumn[col.dataIndex]);
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
		form.name = 'frmMainTxnSummary';
		form.id = 'frmMainTxnSummary';
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
	},
	
filterCffPackages : function(){
		
		var me = this;
		var groupView = me.getGroupView();
		var filteredCffPackageList = [], cffPackageList = [];
		
		if(groupView.cfgGroupCode === 'CFF_TXNSUM_OPT_PKG' || me.pageSettingsRestored){
			
			if(!Ext.isEmpty(me.groupByData)){
			
				if(!Ext.isEmpty(me.clientCode) && me.clientCode !='%'){
					for (var i = 0; i < me.groupByData.length; i++) {
						
						if(me.groupByData[i].groupTypeCode === 'CFF_TXNSUM_OPT_PKG' && !Ext.isEmpty(me.groupByData[i].groups)){
							
							cffPackageList = me.groupByData[i].groups;
							
							if(!Ext.isEmpty(cffPackageList)){
								for (var j = 0; j < cffPackageList.length; j++) {
									
									if(cffPackageList[j].filterCode === me.clientCode){
										filteredCffPackageList.push(cffPackageList[j]);
										
									}
								}
							}
							me.groupByData[i].groups = filteredCffPackageList;
							break;
						}
					}
					groupView.cfgGroupByData = me.groupByData
					// if client code is present show packages specific to client
					groupView.generateGroupByMenus(me.groupByData);
				}else{
					// if client code is empty show all the packages
					groupView.generateGroupByMenus(me.groupByData);
				}
				
			}
		}
	},
	
	getCFFGroupByData : function(){
		var me = this;
		var strGroupByUrl = 'services/grouptype/forecastTransactionSummary/CFFTXNSUM.json?$filterGridId=GRD_CFF_TXNSUM&$columnModel=true';
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strGroupByUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			strGeneratedUrl = strGroupByUrl.substring(0, strGroupByUrl.indexOf('?'));
		}
		strGeneratedUrl = !Ext.isEmpty(strGeneratedUrl)
				? strGeneratedUrl
				: strGroupByUrl;
		
		Ext.Ajax.request({
				url : strGeneratedUrl,
				method : 'POST',
				params : objParam,
				success : function(response) {
					var arrData = [];
					if (!Ext.isEmpty(response.responseText)) {
						var data = Ext.decode(response.responseText);
						arrData = (data.d && data.d.groupTypes)
								? data.d.groupTypes
								: [];
					}
					me.groupByData = arrData;
					me.filterCffPackages();
				},
				failure : function(response) {
					// TODO: Error handling to be done here
				}
			});
	}
});