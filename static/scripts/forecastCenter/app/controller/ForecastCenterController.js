Ext.define('GCP.controller.ForecastCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ForecastCenterFilterView', 'GCP.view.HistoryPopup','GCP.view.ForecastCenterSummaryView'],
	refs : [{
		ref : 'groupView',
		selector : 'forecastCenterSummaryView groupView'
	}, {
		ref : 'grid',
		selector : 'forecastCenterSummaryView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'forecastCenterSummaryView groupView filterView'
	}, {
		ref : 'forecastCenterSummaryView',
		selector : 'forecastCenterSummaryView'
	},
	{
		ref : 'effectiveDateLabel',
		selector : 'forecastCenterFilterView label[itemId="effectiveDateLabel"]'
	
	}, {
		ref : 'forecastCenterFilterView',
		selector : 'forecastCenterFilterView'
	},{
		ref : 'accountCombo',
		selector : 'forecastCenterFilterView combo[itemId="accountCombo"]'
	}],
	config : {
		strPageName:'forecastCenter',
		strModifySavedFilterUrl : 'services/userfilters/forecastCenter/{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/forecastCenter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/forecastCenter/{0}/remove.json',
		pageSettingPopup : null,
		strDefaultMask : '000000000000000000',
		entryDateFilterVal : '',
		effectiveDateFilterVal : '',
		startDateFilterVal : '',
		effectiveDateQuickFilterVal :'',
		effectiveDateFilterLabel : getLabel('today', 'Today'),
		entryDateFilterLabel : getLabel('today', 'Today'),
		startDateFilterLabel : getLabel('today', 'Today'),
		endDateFilterLabel : getLabel('today', 'Today'),
		effectiveDateQuickFilterLabel : getLabel('today', 'Today'),
		dateHandler : null,
		datePickerSelectedDate : [],
		isCompanySelected : false,
		dateRangeFilterVal : '13',
		advSortByData : [],
		accountFilterVal : 'All',
		reportGridOrder : null,
		objLocalData : null,
		entryDateChanged : false,
		firstLoad : false,
		pageSettingsRestored : false
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
//		populateAdvancedFilterFieldValue();
		//objLocalStoragePref = me.doGetSavedState();
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
			
		}
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction();
		});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					//me.handleDateChange(filterType, btn, opts);
					if(filterType === 'effectiveDateQuickFilter')
					{
						me.handleEffectiveDateChange(filterType, btn, opts);
					}
					if(filterType === 'effectiveDate')
					{
						me.effectiveDateChange(btn, opts);
					}
					});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue = null;
		});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "effectiveDate") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedDate = dates;
						me.effectiveDateFilterVal = me.dateRangeFilterVal;
						me.effectiveDateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handleEffectiveDateInAdvFilterChange(me.dateRangeFilterVal);
					}
				});
		me.control({
			'forecastCenterSummaryView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,

				'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
				'render' : function() {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					var objJsonData='', objLocalJsonData='',savedFilterCode='';
					if (objForecastCenterPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objForecastCenterPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									var effectiveDateLableVal = $('label[for="effectiveDateDropDownLabel"]').text();
									var effectiveDateField = $("#effectiveDate");
									me.handleEffectiveDateSync('A', effectiveDateLableVal, null, effectiveDateField);
									var accountChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
									me.handleAccountNoFieldSync('A', accountChangedValue);
								}
								
							}
							else if (!Ext.isEmpty(objJsonData)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								}
							}
						}	
						
					
						/*
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)|| (objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode))) {
									var advData = objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode) ? objSaveLocalStoragePref.filterCode : objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							} 
							 else if(objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode)){
									me.doHandleSavedFilterItemClick(objSaveLocalStoragePref.filterCode);
									me.savedFilterVal = objSaveLocalStoragePref.filterCode;
							}
						}
					*/
					}
					}
			},
		'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			},
		'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					getAdvancedFilterPopup('advanceFilterPurchaseOrder.form', 'filterForm');
					me.assignSavedFilter();
				}
			},
			
		'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				},
				'render' : function() {
					
				}
			},
		'forecastCenterFilterView AutoCompleter[itemId="clientAuto"]' : {
				select : function(combo, record) {
					selectedFilterClient = combo.getValue();
					selectedFilterClientDesc = combo.getDisplayValue();
					selectedClient = selectedFilterClient;
					//gets the disclaimer text for selected client
					me.getDisclaimerTextForClient(selectedClient);
					
					//fetch group by packages according to client
					var groupView = me.getGroupView();
					if(groupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
						me.getCFFGroupByData();
					}
					
					me.handleClientChangeInQuickFilter();
					me.isCompanySelected = true;
					
				},
				
				change : function( combo, record, oldVal )
				{
					selectedFilterClient = combo.getValue();
					selectedFilterClientDesc = combo.getDisplayValue();
					selectedClient = selectedFilterClient;
					var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
					accountCombo.setValue("");
					me.filterAccount = "all";
					if(($("#dropdownCompany").val() !== "all")
						|| ($("#dropdownCompany").val() === "all"
							&& selectedClient == null)) {
						me.handleClientChangeInQuickFilter();
					}
					me.isCompanySelected = true;
				},
				keyup : function(combo, e, eOpts){
					me.isCompanySelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isCompanySelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
						selectedFilterClient = combo.getValue();
						selectedFilterClientDesc = combo.getValue();
						selectedClient = selectedFilterClient;
						me.handleClientChangeInQuickFilter();
						me.isCompanySelected = true;
					}
				},
				boxready : function(combo, width, height, eOpts) { //Change
					var me = this;
					if (!Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode  && 'all' !== me.clientCode) {
						combo.setValue(me.clientCode);
						combo.setRawValue(me.clientDesc);
					}
					else
						combo.setValue(combo.getStore().getAt(0));
				}
				
			},
		'forecastCenterFilterView combo[itemId="clientCombo"]' : {
			select : function(combo, record) {
							selectedFilterClient = combo.getValue();
							selectedFilterClientDesc = combo.getDisplayValue();
							selectedClient = selectedFilterClient;

							if(selectedFilterClient  === "all")
							{
							var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
							accountCombo.setValue("");
							me.filterAccount = "all";
							}

							//gets the disclaimer text for selected client
							me.getDisclaimerTextForClient(selectedClient);
							
							//fetch group by packages according to client
							var groupView = me.getGroupView();
							if(groupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
								me.getCFFGroupByData();
							}
							
							me.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
							
							},
			change : function( combo, record, oldVal )
				{
							selectedFilterClient = combo.getValue();
							selectedFilterClientDesc = combo.getDisplayValue();
							selectedClient = selectedFilterClient;
							if(selectedFilterClient  === "all")
							{
							var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
							accountCombo.setValue("");
							me.filterAccount = "all";
							}
							if((!Ext.isEmpty($("#dropdownCompany").val())) && $("#dropdownCompany").val() !== "all")
								me.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
				},
			boxready : function(combo, width, height, eOpts) {
							var me = this;
							if (!Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode  && 'all' !== me.clientCode) {
								combo.setValue(me.clientCode);
							}
							else
								combo.setValue(combo.getStore().getAt(0));
				}
		},
		'forecastCenterFilterView combo[itemId="accountCombo"]' : {
				select : function(combo, record, eOpts) {
					me.filterAccount = combo.getValue();
					me.filterAccountDesc = combo.getRawValue();
					me.isAccountSelected = true;
					me.handleAccountNoFieldSync('Q', me.filterAccount);
					me.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyFilter();
					
				},
				boxready : function(combo) {
					//var value = combo.getStore().getAt(0);
					//combo.setValue(value);
					var accCombo = $("#dropdownAccountNo").val();
					if (!Ext.isEmpty(accCombo) &&  accCombo !== 'selectAccount' && accCombo !== 'all') {
						combo.setValue($("#dropdownAccountNo").getMultiSelectValue());
					}
					if (!Ext.isEmpty(me.accountFilterVal)
							&& 'all' != me.accountFilterVal && 'selectAccount' != me.accountFilterVal)
						me.handleAccountNoFieldSync('Q', me.accountFilterVal);
				}
		},
		'forecastCenterFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
		'forecastCenterFilterView component[itemId="effectiveDatePicker"]' : {
				render : function() {
					$('#effectiveDatePicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
						minDate : dtHistoryDate,
						maxDate : forecastRestrictionDate,
						changeYear : true,
						dateFormat : strApplicationDateFormat,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.dateRangeFilterVal = '13';
								me.datePickerSelectedDate = dates;
								me.datePickerSelectedEffectiveDate = dates;
								me.effectiveDateQuickFilterVal = me.dateRangeFilterVal;
								me.effectiveDateQuickFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.setDataForFilter();
								me.applyFilter();
							}
						}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || !Ext.isEmpty($("#effectiveDate")[0].value)) {
						var effectiveDateQuickFilterVal = $('label[for="effectiveDateDropDownLabel"]')
								.text();
						var effectiveDateField = $("#effectiveDate");//put advanced filter 'eff date id'
						me.handleEffectiveDateSync('A', effectiveDateQuickFilterVal, null, effectiveDateField);
					} else if (!Ext.isEmpty(me.effectiveDateQuickFilterVal)
							&& !Ext.isEmpty(me.effectiveDateQuickFilterLabel)) {
						me.handleDateChange(me.effectiveDateQuickFilterVal);
					} else{
						me.effectiveDateQuickFilterVal = '1'; // Set to Today
						me.effectiveDateQuickFilterLabel = getLabel('today', 'Today');
						me.handleDateChange(me.effectiveDateQuickFilterVal);
						me.setDataForFilter();
						me.applyFilter();
					}
					var currentDate = $.datepick.parseDate(strApplicationDateFormat, dtApplicationDate);
					var filterEndDate = new Date();
					filterEndDate.setDate(currentDate.getDate() + parseInt(filterDays,10));
					/*$("#effectiveDatePicker").datepick("option",
							"maxDate", filterEndDate);*/
				}
			},
		'forecastCenterFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					

				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					//me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
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
			if(groupInfo.groupTypeCode === "CFFTC_OPT_PKG")
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
		var objSummaryView = me.getForecastCenterSummaryView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) 
			objPref = Ext.decode(data.preference);
			
			//intPgSize = objPref.pgSize || _GridSizeMaster;
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
		colModel = arrCols;
		showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
		heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPageSize,
					pageNo : intPageNo,
					//showPagerForced : false,
					heightOption : heightOption
					/*storeModel:{
						sortState:objPref.sortState
					}*/
				};
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

	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
			
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
		objActionResult = {
				'order' : []
			};
			
		var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		if(me.firstLoad && Ext.isEmpty(objGroupView.cfgGroupCode) && !Ext.isEmpty(objGroupView.cfgGroupByData)){
			me.pageSettingsRestored = true;
		}
		
		if(me.firstLoad && (objGroupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored)){
			me.getCFFGroupByData();
		}
		
		me.firstLoad = false;
		
		me.disableActions(true);
		var columns=grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="requestStateDesc" ){
	        	col.sortable=false;
	        }
        });
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter) + "&$filter="+ me.getFilterUrl(subGroupInfo, groupInfo) ;//+ "&" + csrfTokenName + "=" + csrfTokenValue;
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = (me.filterData).map(function(v) {
					  return  v;
					});
				
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'forecastDate');
				if(!Ext.isEmpty(filterDays) && filterDays !== '999' && me.dateFilterVal === '12'){
				if (!Ext.isEmpty(reqJsonInQuick)) {
					//reqJsonInQuick.paramValue1 = reqJsonInQuick.paramValue2;
					arrQuickJson = quickJsonData;
					arrQuickJson = me.updateInQuickArrJson(arrQuickJson,
							'forecastDate');
					quickJsonData = arrQuickJson;
				}
				}
				//
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'clientCode');
				if(!Ext.isEmpty(reqJsonInQuick) && (strEntityType === "0") && ((reqJsonInQuick.paramValue1 === "")  ))
					quickJsonData.splice('clientCode',1);
				//
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}
		if (!Ext.isEmpty(me.advFilterData)) {
			
			var advJsonData = (me.advFilterData).map(function(v) {
			  return  v;
			});
			
			reqJsonInAdv = me.findInAdvFilterData(advJsonData,'clientCode');
			if(!Ext.isEmpty(reqJsonInAdv) && (strEntityType === "0") && ((reqJsonInAdv.displayValue1 === "") ))
			{
				advJsonData.splice('clientCode',1);
			}
			
			//remove sort by fields
			advJsonData = advJsonData.filter(function(a){ return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy" )});
			
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {			
				arrOfParseAdvFilter = generateFilterArray(advJsonData, strApplicationDateFormat);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);

			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
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
		
		
	},
	
	handleGridRowClick : function(record, grid, columnType) {
		if (columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
		var me = this;
		if (actionName === 'submit' || actionName === 'auth'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' ){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('scmProductName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = 'editForecastTransaction.form';
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = 'viewForecastTransaction.form';
			me.submitForm(strUrl, record, rowIndex);
		} else {

		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/cff/{0}', strAction);
		if (strAction === 'submit') {
			if(!Ext.isEmpty(arrSelectedRecords[0].data.parentRecordKeyNo) && (arrSelectedRecords[0].data.requestState == 3 || arrSelectedRecords[0].data.requestState == 1)){
				this.getModifySubsequentTransactionsConfirmationPopup(grid, arrSelectedRecords, strActionType);
			}else{
				this.submitForecastTransaction('N', grid, arrSelectedRecords, strActionType);
			}
		} else if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			this.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	getModifySubsequentTransactionsConfirmationPopup : function(grid, arrSelectedRecords, strActionType) {
		var objDialog = $('#recurringTransactionsConfirmationPopup');
		var me = this;
		objDialog.dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			draggable : false,
			width : 540,
			title : "Message",
			buttons : {
				"Ok" : function() {
					$(this).dialog("close");
					var flag = 'N';
					var flagY = $('#modifySubsequent1').is(':checked');
					var flagN = $('#modifySubsequent2').is(':checked');
					if(flagY === true)
						flag = 'Y';
					else if(flagN === true)
						flag = 'N';
					$("[name=modifySubsequent]").removeAttr("checked");
					me.submitForecastTransaction(flag, grid, arrSelectedRecords, strActionType);
				},
				Cancel : function() {
					$(this).dialog('destroy');
				}
			}
		});
		objDialog.dialog('open');
		objDialog.dialog('option', 'position', 'center');
	},
	submitForecastTransaction : function(subsequentModificationFlag, grid, arrSelectedRecords, strActionType){
		var msg = "";
		var me = this;
		var groupView = me.getGroupView();
		var arrayJson = new Array();
		var strAction = "submit";
		var records = (arrSelectedRecords || []);
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
				serialNo : grid.getStore().indexOf(records[index])
						+ 1,
				identifier : records[index].data.identifier,
				userMessage : subsequentModificationFlag
			});
		}
		
		$.ajax({
			url : "services/cff/submit",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				var msg="";
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
						});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							actionMessage : msg
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					var jsonRes = data;
					me.postHandleGroupAction(jsonRes, grid, strActionType, strAction, records);
					groupView.refreshData();
				}
			},
			error : function(data){
			}
		});
	},
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords,strActionType, strAction) {
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
							var jsonRes = Ext.JSON
									.decode(response.responseText);
							groupView.refreshData();
							me.postHandleGroupAction(jsonRes, grid,
									strActionType, strAction, records);
							
							
							
							/*var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								jsonData = jsonData.d ? jsonData.d : jsonData;		
								
								if(!Ext.isEmpty(jsonData))
						        {
						        	for(var i =0 ; i<jsonData.length;i++ )
						        	{
						        		var arrError = jsonData[i].errors;
						        		if(!Ext.isEmpty(arrError))
						        		{
						        			for(var j =0 ; j< arrError.length; j++)
								        	{
						        				for(var j = 0 ; j< arrError.length; j++)
									        	{
							        				errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									        	}
								        	}
						        		}
						        		
						        	}
							        if('' != errorMessage && null != errorMessage)
							        {
							        
							        	Ext.MessageBox.show({
											title : getLabel('errorTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        } 
						        }	
							}*/
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		var me = this;
		var groupView = me.getGroupView();
		var objGrid = groupView.getGrid() || null;
		var msg = '',errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg, strActionMessage = '';
		if (!Ext.isEmpty(jsonData))
			actionData = jsonData;
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		Ext.each(actionData, function(result) {
			intSerialNo = parseInt(result.serialNo,10);
			record = objGrid.getRecord(intSerialNo);
			row = objGrid.getRow(intSerialNo);
			msg = '';
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
			});
			
				row = objGrid.getRow(intSerialNo);
				
				strActionMessage = result.success === 'Y'
									? strActionSuccess
									: msg;
				if(result.success === 'Y'){
					strActionMessage += ' <p class="error_font">'+ msg + '</p>';
				}
				arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('forecastReference'),
							actionMessage :strActionMessage
						});
			
		});
		arrMsg = (me.populateActionResult(arrActionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	populateActionResult : function(arrActionMsg) {
		var me = this, arrResult = [];
		if (!Ext.isEmpty(objActionResult)) {
			Ext.each((arrActionMsg || []), function(cfgMsg) {
				if (!Ext.Array.contains(objActionResult.order,
						cfgMsg.actualSerailNo))
					objActionResult.order.push(cfgMsg.actualSerailNo);
				objActionResult[cfgMsg.actualSerailNo] = me.cloneObject(cfgMsg);
			});

			Ext.each((objActionResult.order || []), function(key) {
						if (objActionResult[key]) {
							arrResult.push(objActionResult[key]);
						}
					});
		}
		return arrResult;
	},
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('userRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
							}
							else
							{
								me.handleGroupActions(strUrl, text, grid, arrSelectedRecords,strActionType, "reject");
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	submitForm : function(strUrl, record, rowIndex) {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid',
				'Y'));
				
		form.action = strUrl;
		//me.setFilterParameters(form);

		document.body.appendChild(form);
		form.submit();
	},
	
	handleEntryAction : function() {
		var me = this;
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		//Populate client ID in case of single client
		if(isClientUser()) {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount() === 1) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'clientId', selectedClient));
			}
		}
		document.body.appendChild(form);
		form.action = "forecastInitiation.form";
		form.submit();
		document.body.removeChild(form);
	},
	
		
	showHistory : function(scmProductDesc, url, id) {
	var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					scmProduct : scmProductDesc,
					identifier : id
				}).show();
		historyPopup.center();			
	},
	
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
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

							if ((item.maskPosition === 5 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 6 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	getSortByJsonForSmartGrid : function() {
		var me = this;
		var jsonArray = [];
		var sortDirection = '';
		var fieldId = '';
		var sortOrder = '';
		var sortByData = me.advSortByData;
		if (!Ext.isEmpty(sortByData)) {
			for (var index = 0; index < sortByData.length; index++) {
				fieldId = sortByData[index].value1;
				sortOrder = sortByData[index].value2;

				if (sortOrder != 'asc')
					sortDirection = 'DESC';
				else
					sortDirection = 'ASC';

				jsonArray.push({
							property : fieldId,
							direction : sortDirection,
							root : 'data'
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
			if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}
		objGroupView.refreshData();
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	handleEffectiveDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;

		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="effectiveDateDropDownLabel"]')
				: me.getEffectiveDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#effectiveDate')
				: $('#effectiveDatePicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('effectiveDate', sourceToolTipText);
				//selectedEffectiveDate = {};
			} else {
				labelToChange.setText(sourceLable);
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
	},
	handleAccountNoFieldSync : function(type, accountData) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objAccountField = $("#dropdownAccountNo");
				var objQuickAccountField = me.getFilterView()
						.down('combo[itemId="accountCombo"]');
				if (!Ext.isEmpty(accountData)) {
					objAccountField.val([]);
					objAccountField.val(accountData);
				} else if (Ext.isEmpty(accountData)) {
					objAccountField.val([]);
				}
				objAccountField.niceSelect("update");
				//if (objQuickAccountField.isAllSelected()) {
				//	me.accountFilterVal = 'selectAccount';
				//}
			}
			if (type === 'A') {
				var objAccountField = me.getFilterView()
						.down('combo[itemId="accountCombo"]');
				if (!Ext.isEmpty(accountData)) {
					me.accountFilterVal = 'selectAccount';
					if(accountData[0] === "selectAccount")
						objAccountField.setValue("");
					else
						objAccountField.setValue(accountData);
					objAccountField.selectedOptions = accountData;
				} else {
					objAccountField.setValue(accountData);
					me.accountFilterVal = '';
				}
			}
		}
	},
	handleEffectiveDateChange : function (filterType, btn, opts)
	{
		var me = this;
		me.effectiveDateQuickFilterVal = btn.btnValue;
		me.effectiveDateQuickFilterLabel = btn.text;
		me.handleDateChange(btn.btnValue);
		me.filterAppiled = 'Q';
		me.setDataForFilter();
		me.applyFilter();
		
	},
	handleDateChange : function(index)
	{
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#effectiveDatePicker');
		if (!Ext.isEmpty(me.effectiveDateQuickFilterLabel)) {
				me.getEffectiveDateLabel().setText(getLabel('effectiveDate', 'Effective Date')
				+ " (" + me.effectiveDateQuickFilterLabel + ")");
			}
				
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
		if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate))
		{
			selectedEffectiveDate = {
					operator : objDateParams.operator,
					fromDate : vFromDate,
					toDate : vToDate,
					dateLabel : objDateParams.label
				};
		}
		else
			selectedEffectiveDate = {};
		me.handleEffectiveDateSync('Q', me.getEffectiveDateLabel().text, " ("
				+ me.effectiveDateFilterLabel + ")", datePickerRef);
		me.filterAppiled = 'A';
	},
	effectiveDateChange : function(btn, opts) {
		var me = this;
		me.effectiveDateFilterVal = btn.btnValue;
		me.effectiveDateFilterLabel = btn.text;
		me.handleEffectiveDateInAdvFilterChange(btn.btnValue);
	},
	handleEffectiveDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'effectiveDate');

		if (!Ext.isEmpty(me.effectiveDateFilterLabel)) {
			$('label[for="effectiveDateDropDownLabel"]').text(getLabel('effectiveDate',
							'Effective Date')
							+ " (" + me.effectiveDateFilterLabel + ")");
			
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#effectiveDate').datepick('setDate', vFromDate);
			} else {
				$('#effectiveDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEffectiveDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#effectiveDate').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#effectiveDate').datepick('setDate', vFromDate);
				} else {
					$('#effectiveDate').datepick('setDate', vFromDate);
				}
			} else {
				$('#effectiveDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEffectiveDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		}
	},

	getDateParam : function(index, dateType) {
		var me = this;
		me.dateRangeFilterVal = index;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '', label = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				label = 'Today';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				label = 'Yesterday';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Week';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Week To Date';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Month';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month To Date';
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
				label = 'This Quarter';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Quarter To Date';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Year';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Year To Date';
				break;
			case '12' :
				// Latest
				if(!Ext.isEmpty(filterDays) && filterDays !== '999'){
					fieldValue1 = Ext.Date.format(dtHistoryDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
					operator = 'bt';
					label = 'Latest';
				}
				else{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'le';
					label = 'Latest';
				}
				break;
			 case '14' :
				// Last Month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month only';
				break;	
			 case '13' :
				// Date Range
				if (!isEmpty(me.datePickerSelectedDate)) {
					if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedDate[1], strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		
		return retObj;
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
		var me = this, args = {};
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			me.preferenceHandler.readPagePreferences(me.strPageName,
					me.updateObjSummaryPref, args, me, false);
		}
	},
	updateObjSummaryPref : function(data) {
		objForecastCenterPref = Ext.encode(data);
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
				if(groupInfo.groupTypeCode === "CFFTC_OPT_PKG")
					strModule = 'all';
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
			if(groupInfo.groupTypeCode === "CFFTC_OPT_PKG")
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
					};
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
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objForecastCenterPref)) {
			objPrefData = Ext.decode(objForecastCenterPref);
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
					: (!Ext.isEmpty(arrGenericColumnModel) ? Ext.decode(arrGenericColumnModel) : (FORECAST_GENERIC_COLUMN_MODEL || '[]'));
			

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		else if (Ext.isEmpty(objForecastCenterPref))
		{
			objColumnSetting = FORECAST_GENERIC_COLUMN_MODEL;
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/forecastCenter.json';
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
	/*Page setting handling ends here*/
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		selectedClient = selectedFilterClient;
		selectedClientDesc = selectedFilterClientDesc;
		$("#dropdownCompany").val(selectedClient);
		$("#dropdownCompany").niceSelect('update');
		//me.updateFilterparams();
		var accURL ="";
		if(!isEmpty(selectedFilterClient) && selectedFilterClient !='all')
			 accURL =  'services/userseek/forecastAccountsSeek.json?$sellerCode='+ strSeller + '&$filtercode1='+selectedFilterClient;
		else
			 accURL =  'services/userseek/forecastAccountsSeek.json?$sellerCode='+ strSeller + '&$filtercode1='+"";
		var AccountStore = Ext.create('Ext.data.Store', {
											autoLoad: true,
											fields : ["CODE", "DESCR","DISPLAYFIELD"],
												proxy : { type : 'ajax',
												url : accURL,
												/*extraParams: {
													'$client':  selectedFilterClient
												},*/
											 
											reader : {
													type : 'json',
													root : 'd.preferences'
												},
												listeners: {
										            load: function( store, records, successful, eOpts ) {
										                //store.insert(0, {
														//			CODE : 'all',
														//			DESCR : getLabel('allAccounts', 'All')
														//	})
										                } 
													}	
												}			        
										});	
				
		me.getAccountCombo().bindStore(AccountStore);
		$("#dropdownPackage option").remove();		
		setPackageItems("dropdownPackage");
		$("#dropdownAccountNo  option").remove();
		setAccountNumberItems("#dropdownAccountNo");
		var accountChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
		me.handleAccountNoFieldSync('A', accountChangedValue);
		me.setDataForFilter();
		me.applyFilter();
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy : getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "clientCode");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "clientCode");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "forecastDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "forecastDate");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "accountId");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"accountId");
			me.filterData = arrQuickJson;
		}
		var sortByData = getAdvancedFilterSortByJson();
		if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
			me.advSortByData = sortByData;
		} else {
			me.advSortByData = [];
		}
		//removing sort by fields from adv filter json
		//me.advFilterData = me.removeSortByFieldsFromAdvArrJson(objJson , sortByData);
		objJson = objJson.filter(function(a){ return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy") });

		for(var i=0; i<sortByData.length; i++){
			objJson.push(sortByData[i]);
		}
		me.advFilterData = objJson;
	},
	getQuickFilterQueryJson : function() {
		var me = this,
		clientParamName = null,
		clientNameOperator = null,
		clientCodeVal = null,
		
		jsonArray = [];
		if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode  && 'all' !== me.clientCode) {
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
				displayValue1 : me.clientDesc
			});
		}
		else if ((strEntityType === "0") && ( null === me.clientCode ||'ALL' === me.clientCode || '' === me.clientCode || me.clientCode === undefined || 'all' === me.clientCode) ){
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : '',
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : ''
			});
		}
		if(!Ext.isEmpty(me.filterAccount) && "ALL" !== me.filterAccount && "all" !== me.filterAccount && "All" !== me.filterAccount	&& me.filterAccount !== "selectAccount") {
			jsonArray.push({
				paramName : 'accountId',
				operatorValue : 'eq',
				paramValue1 : me.filterAccount,
				dataType : 'S',
				paramFieldLable : getLabel('filterAccountNo', 'Account Number'),
				displayType : 5,
				displayValue1 : me.filterAccountDesc
			});
		}
		var index = me.effectiveDateQuickFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'forecastDate',// effective date
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('effectiveDate', 'Effective Date'),
						dateLabel : objDateParams.label
					});
		}
		return jsonArray;
	},
	applyFilter : function() {
		
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		if (groupInfo && groupInfo.groupTypeCode === 'CFFTC_OPT_STATUS') {
			objGroupView.setActiveTab('all');
		} else {
			me.refreshData();
		}
			
		
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams();
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}

		var URLJson = me.generateUrlWithAdvancedFilterParams(isFilterApplied);
		var strDetailUrl = URLJson.detailFilter;
		if (!Ext.isEmpty(strDetailUrl) && strDetailUrl.indexOf(' and') == 0) {
				strDetailUrl = strDetailUrl.substring(4, strDetailUrl.length);
			}
		strAdvancedFilterUrl = URLJson.batchFilter;
		if (!Ext.isEmpty(strAdvancedFilterUrl)
				&& strAdvancedFilterUrl.indexOf(' and ') == strAdvancedFilterUrl.length
						- 5) {
			strAdvancedFilterUrl = strAdvancedFilterUrl.substring(0,
					strAdvancedFilterUrl.length - 5);
		}
		if (!Ext.isEmpty(strAdvancedFilterUrl)) {
			if (Ext.isEmpty(strUrl)) {
				strUrl = "&$filter=";
			}
			strUrl += strAdvancedFilterUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strDetailUrl)) {
			strUrl += "&$filterDetail=" + strDetailUrl;
			isFilterApplied = true;
		}
		//
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
		var strFilter = '';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
					for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].paramName === "Client")
					continue;
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
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var retUrl = {};
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var blnDtlFilterApplied = false;
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		var strDetailUrl = '';
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk'
								|| operator === 'gt' || operator === 'lt' || operator === 'statusFilterOp')) {
					if (filterData[index].detailFilter
							&& filterData[index].detailFilter === 'Y') {
						strDetailUrl = strDetailUrl + ' and ';
					} else {
						strTemp = strTemp + ' and ';
					}
				}

				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
							isFilterApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						isFilterApplied = true;
						if (filterData[index].detailFilter
								&& filterData[index].detailFilter === 'Y') {
							strDetailUrl = strDetailUrl
									+ filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
									blnDtlFilterApplied = true;
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'eq' :
						isInCondition = me.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							if (objValue != 'All') {
								if (isFilterApplied && !(filterData[index].detailFilter && filterData[index].detailFilter === 'Y')) {
									strTemp = strTemp + ' and ';
								} else {
									if(blnDtlFilterApplied)
									strDetailUrl = strDetailUrl + ' and ';
									isFilterApplied = true;
								}

								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl
											+ filterData[index].field + ' '
											+ filterData[index].operator + ' '
											+ '\'' + objValue + '\'';
											blnDtlFilterApplied = true;
								} else if (filterData[index].dataType === 1) {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + 'date\''
											+ filterData[index].value1 + '\'';
								} else if (filterData[index].field === "Reversal") {
									strTemp = strTemp
											+ "(InstrumentType eq '62' and ActionStatus eq '74')"
								} else {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + '\'' + objValue + '\'';
								}
								isFilterApplied = true;
							}
						}
						if (filterData[index].field === 'InstrumentType')
							me.paymentTypeAdvFilterVal = filterData[index].value1;
						break;
					case 'gt' :
					case 'lt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'statusFilterOp' :
					isFilterApplied = true;
					var objValue = (filterData[index].value1).toString();
					var objArray = objValue.split(',');
					if( objArray.length >= 1 )
					{
						strTemp = strTemp + "(";
					}
					for (var i = 0; i < objArray.length; i++) {
							if(objArray[i] == 0){ //draft
								strTemp = strTemp + "((requestState eq '0') and isSubmitted eq 'N')";
							}
							else if(objArray[i] == 4){ //approved
								strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
							}
							else if(objArray[i] == 3 || objArray[i] == 2){ //pending approval or submitted
								strTemp = strTemp + "((requestState eq '0' or requestState eq '1' )  and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){ //pending submit
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objArray = null;
						var objValue = filterData[index].value1;
						if(Array.isArray(objValue))
						{
							objArray = filterData[index].value1;
						}
						else
						{
							if(objValue != undefined)
							objArray = objValue.split(',');
						}
						//var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ' and ';
									} else {
										strTemp = strTemp + ' and ';
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
												+ filterData[index].field
												+ ' eq ';
										strDetailUrl = strDetailUrl + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strDetailUrl = strDetailUrl
													+ ' or ';
									} else {
										strTemp = strTemp
												+ filterData[index].field
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
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';
		retUrl.batchFilter = strFilter;
		retUrl.detailFilter = strDetailUrl;
		return retUrl;
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#effectiveDatePicker');
		
		if (isClientUser()) {
			var clientComboBox = me.getForecastCenterFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			me.clientCode = "";
			clientComboBox.setValue(me.clientFilterVal);
			
		} else {
			var clientComboBox = me.getForecastCenterFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			clientComboBox.setValue("");
			me.clientCode = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			
		}
		
		//on clear filter displaying all the packages
		if(objGroupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
			me.getCFFGroupByData();
		}
		
		me.effectiveDateFilterVal = '';
		me.effectiveDateFilterLabel = '';
		me.effectiveDateQuickFilterVal = '';
		me.effectiveDateQuickFilterLabel = '';
		me.handleDateChange(me.effectiveDateQuickFilterVal);
		me.getEffectiveDateLabel().setText(getLabel('effectiveDate', 'Effective Date'));
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getForecastCenterFilterView()
			.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
			if((accountCombo.getValue() !== "") && (accountCombo.getValue() !== "All") && (accountCombo.getValue() !== "ALL"))
				accountCombo.setValue("");
	
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		
		if(entityType === "0"){
			$('#cffDisclaimerText').text('');
			$('#cffDisclaimerTextWrap').addClass('hidden');
		}
		
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();

	},
	resetAllFields : function() {
		var me = this;
		  
		$("#saveFilterChkBox").attr('checked', false);
		me.datePickerSelectedDate = [];
		$('#effectiveDate').val("");
		selectedEffectiveDate = {};
		$('label[for="effectiveDateDropDownLabel"]').text(getLabel('effectiveDateDropDown','Effective Date'));
		updateToolTip('effectiveDate',null);
		//var effectiveDateAdvFilterLabel = $('label[for="effectiveDateDropDownLabel"]').text(getLabel('effectiveDateDropDown', 'Effective Date'));
		me.getEffectiveDateLabel().setText(getLabel('effectiveDateDropDown', 'Effective Date'));
		$('#txtForecastRef').val("");
		resetAllMenuItemsInMultiSelect("#dropdownStatus");
		resetAllMenuItemsInMultiSelect("#dropdownPackage");
		$("#dropdownCompany").val($("#dropdownCompany option:first").val());
		$("#dropdownAccountNo").val($("#dropdownAccountNo option:first").val());
		$("#dropdownForecastType").val($("#dropdownForecastType option:first").val());
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("#txtAmount").val("");
		$("#amountFieldTo").addClass("hidden");
		$("#amountToLabel").text("");
		$("#amountFieldTo").val("");
		
		$("#tranAmountOperator").val($("#tranAmountOperator option:first").val());
		$("#tranTxtAmount").val("");
		$("#tranAmountFieldTo").addClass("hidden");
		$("#tranAmountToLabel").text("");
		$("#tranAmountFieldTo").val("");
		
		$("input[type='checkbox'][id='optCredit']").prop('checked', false);
		$("input[type='checkbox'][id='optDebit']").prop('checked', false);
		$("input[type='checkbox'][id='optYes']").prop('checked', false);
		$("input[type='checkbox'][id='optNo']").prop('checked', false);
		$("#dropdownSortBy1").val("");
		$('#dropdownSortBy2 option').remove();
		$("#dropdownSortBy2").append($('<option />', {
					value : "None",
					text : getLabel('none', 'None')
				}));
		$('#dropdownSortBy3 option').remove();
		$("#dropdownSortBy3").append($('<option />', {
					value : "None",
					text : getLabel('none', 'None')
				}));
		$('#dropdownSortBy2').attr('disabled', true);
		$('#dropdownSortBy3').attr('disabled', true);
		
		$("input[type='text'][id='savedFilterAs']").val("");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$('#dropdownCompany').niceSelect('update');
		$('#dropdownAccountNo').niceSelect('update');
		$('#dropdownStatus').niceSelect('update');
		$('#dropdownPackage').niceSelect('update');
		$('#dropdownForecastType').niceSelect('update');
		$('#amountOperator').niceSelect('update');
		$("#dropdownSortBy1").niceSelect('update');
		$("#dropdownSortBy2").niceSelect('update');
		$("#dropdownSortBy3").niceSelect('update');
		
	},
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var advJsonData = (me.advFilterData).map(function(v) {
				  return v;
				});
		
		var quickJsonData = (me.filterData).map(function(v) {
				  return v;
				});
		
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null;
			// adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				me.advFilterData = arrAdvJson;
			}
			 //quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		var objGroupView = me.getGroupView();
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if (strFieldName === 'forecastDate') {
			var datePickerRef = $('#effectiveDatePicker');
			me.effectiveDateFilterVal = '';
			me.getEffectiveDateLabel().setText(getLabel('date', 'Effective Date'));
			datePickerRef.val('');

			me.effectiveDateQuickFilterVal = '';
			me.effectiveDateQuickFilterLabel = '';
			me.handleDateChange(me.effectiveDateQuickFilterVal);
			
			updateToolTip('entryDate',null);
		} 
		else if(strFieldName === "accountId") {
			var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
			accountCombo.setValue("");
			me.filterAccount = "all";
		}
		
		else if (strFieldName === 'forecastAmount') {
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountOperator").niceSelect('update');
			$("#txtAmount").val("");
			$("#amountFieldTo").val("");
			$(".amountTo").addClass('hidden');
			$("#amountFieldTo").addClass("hidden");
			$("#amountLabel").text(getLabel("amount","Forecast Amount"));
		}
		else if (strFieldName === 'transactionAmount') {
			$("#tranAmountOperator").val($("#tranAmountOperator option:first").val());
			$("#tranAmountOperator").niceSelect('update');
			$("#tranTxtAmount").val("");
			$("#tranAmountFieldTo").val("");
			$(".tranAmountTo").addClass('hidden');
			$("#tranAmountFieldTo").addClass("hidden");
			$("#tranAmountLabel").text(getLabel("txnamount","Transaction Amount"));
		}
		else if(strFieldName === "clientCode") {
			if(strEntityType === "1") {
				var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
				var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
					accountCombo.setValue("");
					me.filterAccount = "all";
				if(clientCombo.getStore().getCount()>=2) {
					var record = clientCombo.getStore().getAt(0);
					clientCombo.setValue(record);
					changeClientAndRefreshGrid(record.data.CODE, record.data.DESCR);
				} else {
					changeClientAndRefreshGrid('', '');
				}
				me.clientCode = '';
			} else {
				me.resetClientAutocompleter();
			}
			var objComapnyField = $("#dropdownCompany");
			objComapnyField.val('all');
			objComapnyField.niceSelect('update');
			
			//on clear filter displaying all the packages
			if(objGroupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
				me.getCFFGroupByData();
			}
		} 
		else if (strFieldName === 'forecastMyproduct') {
			resetAllMenuItemsInMultiSelect("#dropdownPackage");
		} 
		else if (strFieldName === 'requestState') {
			resetAllMenuItemsInMultiSelect("#dropdownStatus");
		}
		else if (strFieldName === 'isRepetitive') {
			var yesRef = $("input[type='checkbox'][id='optYes']");
			yesRef.prop('checked', false);
			var noRef = $("input[type='checkbox'][id='optNo']");
			noRef.prop('checked', false);
		}
		else if (strFieldName === 'transactionType') {
			var debitRef = $("input[type='checkbox'][id='optDebit']");
			debitRef.prop('checked', false);
			var creditRef = $("input[type='checkbox'][id='optCredit']");
			creditRef.prop('checked', false);
		}
		else if (strFieldName === 'forecastType') {
			$("#dropdownForecastType").val($("#dropdownForecastType option:first").val());
		}
		else if(strFieldName === 'forecastReference'){
			$("#txtForecastRef").val("");
		}
		
	},
	resetClientAutocompleter : function() {
		var me = this;
		var clientAuto = me.getFilterView().down("combo[itemId='clientAuto']");
		clientAuto.setRawValue("");
		selectedFilterClient = '';
		selectedFilterClientDesc = '';
		me.clientCode = '';
		var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
			accountCombo.setValue("");
			me.filterAccount = "all";
		me.handleClientChangeInQuickFilter();
		$('#cffDisclaimerText').text('');
		$('#cffDisclaimerTextWrap').addClass('hidden');
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
	updateInQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				ai.paramValue1 = ai.paramValue2;
				ai.operatorValue = "le";
			}
		}
		return arr;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
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
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	doSearchOnly : function() {
		var me = this;
		var groupView = me.getGroupView();
		var selectedAccountInAdv = "";
		if ($('#dropdownAccountNo').val() !== 'all'){
			selectedAccountInAdv = $('#dropdownAccountNo').getMultiSelectValue();
		}
		var clientComboBox = null;
		if (isClientUser()) {
					clientComboBox = me.getForecastCenterFilterView()
							.down('combo[itemId="clientCombo"]');
					if (selectedClient != null) {
						clientComboBox.setValue(selectedClient);
					me.clientCode = selectedClient;
					me.getDisclaimerTextForClient(selectedClient);
					}
					else if ($('#dropdownCompany').val() == 'all') {
								clientComboBox.setValue('all');
								me.clientFilterVal = '';
								me.clientCode = '';
								me.clientDesc = '';
					}					
			}
		else {
					clientComboBox = me.getForecastCenterFilterView()
							.down('combo[itemId="clientAuto"]');
					var tempselectedClientDesc = selectedClientDesc;
					if (selectedClientDesc != null && $('#dropdownCompany').val() != 'all') {
						clientComboBox.setValue(selectedClient);
						clientComboBox.setRawValue("");
						clientComboBox.setRawValue(tempselectedClientDesc);
						me.clientDesc = tempselectedClientDesc;
						me.clientCode = selectedClient;
						selectedClientDesc =  tempselectedClientDesc;
						me.getDisclaimerTextForClient(selectedClient);
					}
					else if ($('#dropdownCompany').val() == 'all') {
								clientComboBox.setValue('');
								me.clientFilterVal = '';
								me.clientCode = '';
								me.clientDesc = '';
					}					
			}
		
		if(!Ext.isEmpty(selectedClient)){
			
			if(groupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
				me.getCFFGroupByData();
			}
		}
		
		var statusChangedValue = $("#dropdownStatus").getMultiSelectValue();
		var statusValueDesc = [];

		var effectiveDateQuickFilterVal = $('label[for="effectiveDateDropDownLabel"]')
		.text();
		var effectiveDateField = $("#effectiveDate");

		$('#dropdownStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});
		//var accountNoChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
		//me.handleAccountNoFieldSync('A', accountNoChangedValue);
		me.handleAccountNoFieldSync('A', selectedAccountInAdv);
		$('#dropdownAccountNo').val(selectedAccountInAdv);
		$('#dropdownAccountNo').niceSelect("update");

		me.handleEffectiveDateSync('A', effectiveDateQuickFilterVal, null, effectiveDateField);

		me.applyAdvancedFilter();
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.savedFilterVal = '';
			me.filterCodeValue = '';
			me.doSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
		}
	},
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 
						|| displayType === 6 || displayType === 2)
				//&& strValue 
				) {
			retValue = true;
		}
		return retValue;
	},
	setSortByComboFields : function(fieldName, columnId, buttonText,
			disableFlag) {
		if (!Ext.isEmpty(fieldName)) {

			if (fieldName === 'SortBy') {
				// sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
					var sortByLabelRef = $("#sortBy1AscDescLabel");
					if (!Ext.isEmpty(sortByLabelRef)){
						sortBy1ComboSelected(columnId);
						sortByLabelRef.text(buttonText);
					}
				}

				// Sort By
				if (!Ext.isEmpty(columnId)) {
					if(columnId == "glId")
						columnId = "accountId";
					if(columnId == "productDesc")
						columnId = "forecastMyproduct";
					var sortByComboRef = $("#dropdownSortBy1");
					if (!Ext.isEmpty(sortByComboRef)) {
						sortByComboRef.val(columnId);
						$("#dropdownSortBy1").niceSelect('update');
						$('#dropdownSortBy2').attr('disabled',false);
						$("#dropdownSortBy2").niceSelect();
					}
				}

			}
			else if (fieldName === 'FirstThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy2AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)) {
						sortBy2ComboSelected(columnId);
						thenSortByButtonRef.text(buttonText);
					}
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					if(columnId == "glId")
						columnId = "accountId";
					if(columnId == "productDesc")
						columnId = "forecastMyproduct";
					var firstThenSortByCombo = $("#dropdownSortBy2");
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.val(columnId);
						$("#dropdownSortBy2").niceSelect('update');
						$('#dropdownSortBy3').attr('disabled',false);
						$("#dropdownSortBy3").niceSelect();
					}
				}

			} else if (fieldName === 'SecondThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy3AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)) {
						sortBy3ComboSelected(columnId);
						thenSortByButtonRef.text(buttonText);
					}
				}

				// Second Then Sort By
				if (!Ext.isEmpty(columnId)) {
					if(columnId == "glId")
						columnId = "accountId";
					if(columnId == "productDesc")
						columnId = "forecastMyproduct";
					var secondThenSortByComboRef = $("#dropdownSortBy3");
					if (!Ext.isEmpty(secondThenSortByComboRef)) {
						secondThenSortByComboRef.val(columnId);
						$("#dropdownSortBy3").niceSelect('update');
					}
				}
			}
		}
	},
	removeSortByFieldsFromAdvArrJson : function(advFilterJson , sortByJson){
		for(var index = 0 ; index < sortByJson.length ; index++){
			for(var index1 = 0 ; index1 < advFilterJson.length ; index1++){
				if( sortByJson[index].field === advFilterJson[index1].field){
					advFilterJson.splice(index1,1);
				}
			}
		}
		
		return advFilterJson;
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("#savedFilterAs").val();
		if (Ext.isEmpty(FilterCode)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
			me.savedFilterVal = me.filterCodeValue; 
		}
		
		me.savePrefAdvFilterCode = strFilterCodeVal;
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		
	},
	postDoSaveAndSearch : function() {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		var objAdvSavedFilterComboBox = $("#msSavedFilter");
		if (objAdvSavedFilterComboBox) {
			blnOptionPresent = $("#msSavedFilter option[value='"
					+ me.filterCodeValue + "']").length > 0;
			if (blnOptionPresent === true) {
				objAdvSavedFilterComboBox.val(me.filterCodeValue);
			} else if (blnOptionPresent === false) {
				$(objAdvSavedFilterComboBox).append($('<option>', {
							value : me.filterCodeValue,
							text : me.filterCodeValue
						}));

				if (!Ext.isEmpty(me.filterCodeValue))
					arrValues.push(me.filterCodeValue);
				objAdvSavedFilterComboBox.val(arrValues);
				objAdvSavedFilterComboBox.multiselect("refresh");
			}
		}
		me.doSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
		me.savedFilterVal = me.filterCodeValue;
		//me.doHandleStateChange();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters
								&& responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle',
									'Message');
							strMsg = responseData.d.filters.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							me.updateSavedFilterComboInQuickFilter();
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
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.savedFilterVal = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}

		var statusChangedValue = $("#dropdownStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#dropdownStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});
		var effectiveDateLableVal = $('label[for="effectiveDateDropDownLabel"]').text();
		var effectiveDateField = $("#effectiveDate");
		me.handleEffectiveDateSync('A', effectiveDateLableVal, null, effectiveDateField);
		var accountChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
		me.handleAccountNoFieldSync('A', accountChangedValue);
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		me.resetAllFields();
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'clientCode') {
				columnId = fieldVal;
				$("#dropdownCompany").val(fieldVal);
				$("#dropdownCompany").niceSelect('update');
				if (isClientUser()) {
					var clientComboBox = me.getForecastCenterFilterView()
							.down('combo[itemId="clientCombo"]');
					me.clientCode = fieldVal;
					me.clientDesc = filterData.filterBy[i].displayValue1;
					me.clientFilterVal = (fieldVal === "")?'all':me.clientDesc;
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = me.clientDesc ;
					selectedClient=me.clientCode;
					clientComboBox.setValue(me.clientCode);
					//clientComboBox.setRawValue(me.clientCode);
			
				} else {
					var clientComboBox = me.getForecastCenterFilterView()
							.down('combo[itemId="clientAuto]');
					me.clientCode = fieldVal;
					me.clientDesc = filterData.filterBy[i].displayValue1;
					var tempselectedClientDesc = me.clientDesc
					clientComboBox.setValue(me.clientCode);
					clientComboBox.setRawValue(tempselectedClientDesc);
					me.clientDesc = tempselectedClientDesc;
					selectedClientDesc =  tempselectedClientDesc;
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = me.clientDesc ;
					selectedClient=me.clientCode;
					
				}
				me.getDisclaimerTextForClient(me.clientCode);
			}
			else if (fieldName === 'requestState') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'requestState' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}			
			else if (fieldName === 'forecastReference') {
				$("#txtForecastRef").val(fieldVal);
			} else if (fieldName === 'forecastAmount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			}
			else if(fieldName === 'transactionAmount'){
				me.setTranAmounts(operatorValue, fieldVal, fieldSecondVal);
			}
			else if (fieldName === 'forecastType') {
				columnId = fieldVal;
				$("#dropdownForecastType").val(fieldVal);
				$("#dropdownForecastType").niceSelect('update');
			} 
			else if (fieldName === 'SortBy'
					|| fieldName === 'FirstThenSortBy'
					|| fieldName === 'SecondThenSortBy') {
				columnId = fieldVal;
				sortByOption = fieldSecondVal;
				buttonText = getLabel("ascending", "Ascending");
				if (sortByOption !== 'asc')
					buttonText = getLabel("descending", "Descending");
				me.setSortByComboFields(fieldName, columnId, buttonText, true);
			}			

			else if (fieldName === 'forecastDate' ) {
				me.setSavedFilterDates(fieldName, currentFilterData);
			} 
			else if (fieldName == 'transactionType') {
				var debitRef = $("input[type='checkbox'][id='optDebit']");
				var creditRef = $("input[type='checkbox'][id='optCredit']");
				if (!Ext.isEmpty(debitRef) && !Ext.isEmpty(creditRef))
					if (fieldVal == '') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', true);
					} else if (fieldVal == 'D') {
						debitRef.prop('checked', true);
					} else if (fieldVal = 'C') {
						creditRef.prop('checked', true);
					}
			}
			else if (fieldName == 'isRepetitive') {
				var yesRef = $("input[type='checkbox'][id='optYes']");
				var noRef = $("input[type='checkbox'][id='optNo']");
				if (!Ext.isEmpty(yesRef) && !Ext.isEmpty(noRef))
					if (fieldVal == '') {
						yesRef.prop('checked', true);
						noRef.prop('checked', true);
					} else if (fieldVal == 'Y') {
						yesRef.prop('checked', true);
					} else if (fieldVal = 'N') {
						noRef.prop('checked', true);
					}
			}
			else if (fieldName === 'forecastMyproduct') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'forecastMyproduct' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}	
			else if (fieldName === 'accountId') {
				$("#dropdownAccountNo").val(fieldVal);
				$("#dropdownAccountNo").niceSelect('update');
			
			}				
		}

		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
			$("#msSavedFilter option[value='" + filterCode + "']").attr(
					"selected", true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
		}
		if (applyAdvFilter) {
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(filterData);
		}
	},
	setRadioGroupValues : function(fieldName, fieldVal) {
		var me = this;
		if (!Ext.isEmpty(fieldName)) {
			var radioGroupRef = null;

			if (fieldName === 'forecastAmountDrCr') {
				radioGroupRef = $("input[type='radio'][name='optTransactionType']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='optTransactionType'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}

			if (fieldName === 'isRepetitive') {
				radioGroupRef = $("input[type='radio'][name='optIsRecurring']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='optIsRecurring'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}
		}
	},
	setSavedFilterDates : function(dateType, data) {
	 if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
		var me = this;
		var dateFilterRefFrom = null;
		/* var dateFilterRefTo = null; */
		var formattedFromDate, fromDate, toDate, formattedToDate;
		var dateOperator = data.operator;

		fromDate = data.value1;
		if (!Ext.isEmpty(fromDate))
			formattedFromDate = Ext.util.Format
					.date(Ext.Date.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);

		toDate = data.value2;
		if (!Ext.isEmpty(toDate))
			formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate,
							'Y-m-d'), strExtApplicationDateFormat);

		if (dateType === 'forecastDate') {
			selectedEffectiveDate = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate,
				dateLabel : data.dropdownLabel
			};
			dateFilterRefFrom = $('#effectiveDate');
			$('label[for="effectiveDateDropDownLabel"]').text(getLabel('effectiveDate','Effective Date')+ " ("
				+ selectedEffectiveDate.dateLabel + ")");
		} 
		if (dateOperator === 'eq') {
				$(dateFilterRefFrom).val(formattedFromDate);
			}
		else if (dateOperator === 'bt') {
					$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
					
				}
	} 
},

setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#txtAmount");
		var amountFieldRefTo = $("#amountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOperator').val(operator);
				$("#amountOperator").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator === "bt") {
						$("#txtAmount").removeClass("hidden");
						$("#amountFieldTo").removeClass("hidden"); 
						$(".amountTo").removeClass("hidden"); 
						$("#amountToLabel").text("Amount To");
						$("#amountLabel").text(getLabel("amountFrom","Amount From"));
						amountFieldRefTo.val(amountToFieldValue);
					}
					else
					{
						$('.amountTo').val('');
						$(".amountTo").addClass("hidden");
						$("#amountToLabel").text("");
						$("#amountLabel").text(getLabel("amount","Amount"));
					}
				}
			}
		}
	},
	
	setTranAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#tranTxtAmount");
		var amountFieldRefTo = $("#tranAmountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#tranAmountOperator').val(operator);
				$("#tranAmountOperator").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator === "bt") {
						$("#tranTxtAmount").removeClass("hidden");
						$("#tranAmountFieldTo").removeClass("hidden"); 
						$(".tranAmountTo").removeClass("hidden"); 
						$("#tranAmountToLabel").text("Transaction Amount To");
						$("#tranAmountLabel").text(getLabel("amountFrom"," Transaction Amount From"));
						amountFieldRefTo.val(amountToFieldValue);
					}
					else
					{
						$('.tranAmountTo').val('');
						$(".tranAmountTo").addClass("hidden");
						$("#tranAmountToLabel").text("");
						$("#tranAmountLabel").text(getLabel("tranAmount","Transaction Amount"));
					}
				}
			}
		}
	},
	
	/*saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},*/
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
		strUrl = 'services/generateForecastCenterListReport.'+strExtension;
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
		
		//strUrl += this.generateFilterUrl();
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
getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					async : false,
					success : function(response) {
						if (!Ext.isEmpty(response)
								&& !Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter);
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
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'requestState') {
			menuRef = $("select[id='dropdownStatus']");
			elementId = '#dropdownStatus';
		} 
		else if (componentName === 'forecastMyproduct') {
			menuRef = $("select[id='dropdownPackage']");
			elementId = '#dropdownPackage';
		} 
		else if (componentName === 'accountId') {
			menuRef = $("select[id='dropdownAccountNo']");
			elementId = '#dropdownAccountNo';
		} 
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			var dataArray = (typeof data == 'string') ? data.split(',') : data;
			if (componentName === 'requestState') {
				selectedStatusListSumm = dataArray;
			}
			
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=\""
								+ itemArray[index].value + "\"]").prop(
								"selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
		}

	},
updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox)
				&& savedFilterCombobox.getStore().find('code',
						me.filterCodeValue) >= 0) {
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue = null;
		}
	},
	assignSavedFilter : function() {
		var me = this;
		if (me.firstTime) {
			me.firstTime = false;
			var objJsonData='', objLocalJsonData='',savedFilterCode = '';
					if (objForecastCenterPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objForecastCenterPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y' ) 
						{
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
								savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							}
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
								me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
								var effectiveDateLableVal = $('label[for="effectiveDateDropDownLabel"]').text();
								var effectiveDateField = $("#effectiveDate");
								me.handleEffectiveDateSync('A', effectiveDateLableVal, null, effectiveDateField);
								var accountChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
								me.handleAccountNoFieldSync('A', accountChangedValue);
							}
								
						}
						else if (!Ext.isEmpty(objJsonData)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								if (advData === me.getForecastCenterFilterView()
									.down('combo[itemId="savedFiltersCombo"]')
										.getValue()) {
									$("#msSavedFilter option[value='" + advData
											+ "']").attr("selected", true);
									$("#msSavedFilter").multiselect("refresh");
									me.savedFilterVal = advData;
									me.handleSavedFilterClick();
								}
							}
						}
						
			/*if (objForecastCenterPref) {
				var objJsonData = Ext.decode(objForecastCenterPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if (advData === me.getForecastCenterFilterView()
									.down('combo[itemId="savedFiltersCombo"]')
									.getValue()) {
								$("#msSavedFilter option[value='" + advData
										+ "']").attr("selected", true);
								$("#msSavedFilter").multiselect("refresh");
								me.savedFilterVal = advData;
								me.handleSavedFilterClick();
							}
						}
					}
				}
			}*/
			}
		}
	},
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;
		me.savedFilterVal = '';
		//me.doHandleStateChange();
		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',
					objFilterName));
			savedFilterCombobox.setValue('');
		}
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
		// store.reload();
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						success : function(response) {

						},
						failure : function(response) {
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
		}
	},
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/forecastCenter/groupViewAdvanceFilter.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
				me.resetAllFields();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.savedFilterVal = me.filterCodeValue;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	getDisclaimerTextForClient : function(selectedClient) {
		if(selectedClient === "all" && entityType === "1"){
			selectedClient = "";
		}
		var me = this;
		$.ajax({
			url : 'services/getDisclaimerTextForClient.json?$sellerCode='+ strSeller + '&$clientCode=' + selectedClient,
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
		/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,groupInfo = null ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView){
		    groupInfo = objGroupView.getGroupInfo();
			subGroupInfo = objGroupView.getSubGroupInfo();
		}
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
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
	
	filterCffPackages : function(){
		
		var me = this;
		var groupView = me.getGroupView();
		var filteredCffPackageList = [], cffPackageList = [];
		
		if(groupView.cfgGroupCode === 'CFFTC_OPT_PKG' || me.pageSettingsRestored){
			
			if(!Ext.isEmpty(me.groupByData)){
			
				if(!Ext.isEmpty(me.clientCode) && me.clientCode !='%'){
					for (var i = 0; i < me.groupByData.length; i++) {
						
						if(me.groupByData[i].groupTypeCode === 'CFFTC_OPT_PKG' && !Ext.isEmpty(me.groupByData[i].groups)){
							
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
		var strGroupByUrl = 'services/grouptype/forecastCenter/CFFTC.json?$filterGridId=GRD_FORECASTCENTER&$columnModel=true';
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
