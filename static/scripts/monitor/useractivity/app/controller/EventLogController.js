/**
 * @class GCP.controller.PaymentSummaryController
 * @extends Ext.app.Controller
 * @author Shraddha Chauhan
 */

Ext.define('GCP.controller.EventLogController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.FilterView','Ext.ux.gcp.DateUtil','Ext.ux.gcp.PreferencesHandler'
	          ],
	views : ['GCP.view.eventLog.EventLogView','GCP.view.eventLog.EventLogFilterView','Ext.tip.ToolTip'],
	
	refs : [{
				ref : 'filterView',
				selector : 'filterView'
			},{
				ref : 'eventLogView',
				selector : 'eventLogView'
			},{
				ref : 'groupView',
				selector : 'eventLogView groupView'
			},{
				ref : 'eventLogFilterView',
				selector : 'eventLogFilterView'
			},{
				ref : 'btnSavePreferences',
				selector : 'eventLogView eventLogFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'eventLogView eventLogFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'eventLogSellerRef',
				selector : 'eventLogFilterView combo[itemId="sellerCode_id"]'
			},{
				ref : 'fromDateLabel',
				selector : 'eventLogView eventLogFilterView label[itemId="dateFilterFrom"]'
			},{
				ref : 'toDateLabel',
				selector : 'eventLogView eventLogFilterView label[itemId="dateFilterTo"]'
			},{
				ref : 'dateLabel',
				selector : 'eventLogFilterView label[itemId="dateLabel"]'
			},{
				ref : 'entryDate',
				selector : 'eventLogFilterView button[itemId="entryDate"]'
			},{
				ref : 'fromEntryDate',
				selector : 'eventLogView eventLogFilterView datefield[itemId="fromDate"]'
			},{
				ref : 'toEntryDate',
				selector : 'eventLogView eventLogFilterView datefield[itemId="toDate"]'
			},{
				ref : 'dateRangeComponent',
				selector : 'eventLogView eventLogFilterView container[itemId="dateRangeComponent"]'
			},{
				ref : 'advanceFilterPopup',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"]'
			},{
				ref : 'advanceFilterTabPanel',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
			},{
				ref : 'filterDetailsTab',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			},{
				ref : 'createNewFilter',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter]'
			},{
				ref : 'creationFromDateLabel',
				selector : 'eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] container[itemId=creationDate] label[itemId="dateFilterFrom"]'
			}, {
				ref : 'creationToDateLabel',
				selector : 'eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] container[itemId=creationDate] label[itemId="dateFilterTo"]'
			}, {
				ref : 'creationDateRange',
				selector : 'eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] container[itemId=creationDate] container[itemId="dateRangeComponent"]'
			}, {
				ref : 'creationDateLbl',
				selector : 'eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] label[itemId=creationDateLbl]'
			},{
				ref : 'saveSearchBtn',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] button[itemId="saveAndSearchBtn"]'
			},{
				ref : 'clientCombo',
				selector : 'eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter] combobox[itemId="clientIdCombo"]'
			},{
				ref : 'savedFiltersToolBar',
				selector : 'eventLogView eventLogFilterView toolbar[itemId="advFilterActionToolBar"]'
			},{
				ref : 'advFilterGridView',
				selector : 'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] eventLogAdvFilterGridView'
			},{
				ref : 'bankUser',
				selector : 'eventLogFilterView checkbox[itemId="eventBankUserCheckbox"]'
			}],
	config : {
		previouGrouByCode : null,
		savePrefAdvFilterCode : null,
		showAdvFilterCode : null,
		filterApplied : 'ALL',
		advFilterData : [],
		filterData : [],
		clientValue :'',
		clientValueDesc :'',
		userValue :'',
		userValueDesc:'',
		datePickerSelectedDate : [],
		dateRangeFilterVal : '7',
		dateFilterLabel : getLabel('today', 'Today'),
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		savedFilterVal : '',
		dateHandler : null,
		preferencesHandler : null,
		objAdvFilterPopup : null,
		filterMode :'',
		creationDateFilterVal : '1',
		creationDateFilterLabel : getLabel('today', 'Today'),
		bankUserFlag:false, 
		SearchOrSave : false,
		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,
		filterCodeValue : null,
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/eventGrpViewFilter.json',
		strModifySavedFilterUrl : 'services/userfilters/eventGrpViewFilter/{0}.json',
		strGetModulePrefUrl : 'services/userpreferences/eventlog/{0}.json',
		strCommonPrefUrl : 'services/userpreferences/eventlog.json',
		strGetSavedFilterUrl : 'services/userfilters/eventGrpViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/eventGrpViewFilter/{0}/remove.json',
		reportGridOrder : null,
		strPageName : 'eventlog',
		syncAdvFilterWithQuick : true
	},
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');	
		me.preferencesHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');	
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		me.updateFilterConfig();
		$(document).on('dateChange',
				function(event, filterType, btn, opts) {
					if ((filterType == "entryDateAdvFilter")
							|| (filterType == "eventEntryDateQuickFilter")) {
						me.handleEntryDateChange(filterType, btn, opts);
					} else if (filterType == "creationDate") {
						me.creationDateChange(btn, opts);
					}
				});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		$(document).on('savePreference', function(event) {
			me.handleSavePreferences(event);
		});
		$(document).on('clearPreference', function(event) {
			me.handleClearPreferences(event);
		});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue = null;
		});
		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
		});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
			me.viewFilterData(grid, rowIndex);
		});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
			me.editFilterData(grid, rowIndex);
		});
		$(document).on('orderUpEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
			me.deleteFilterSet(grid, rowIndex);
		});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "creationDate") {
						me.datePickerSelectedDate = dates;
						me.creationDateFilterVal = me.dateRangeFilterVal;
						me.creationDateFilterLabel = "Date Range";
						me.dateFilterVal = me.dateRangeFilterVal;
						me.dateFilterLabel = "Date Range";
						me.handleCreationDateChange(me.dateRangeFilterVal);
						if(dates.length == 1){
							selectedCreationDate = {
									operator :'eq',
									fromDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat),									
									toDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat)
								};
						} else if(dates.length == 2){
							selectedCreationDate = {
							operator :'bt',
							fromDate : Ext.util.Format.date(Ext.Date
									.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat),
							toDate : Ext.util.Format.date(Ext.Date
									.parse(Ext.Date.format(dates[1],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat)
							};
						}
					}
				});
		me.control({
			'eventLogView groupView' : {
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
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'render' : function(panel, opts) {
					if ((!Ext.isEmpty(objEventSavePreferences))) {
						var objJsonData = Ext.decode(objEventSavePreferences);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.groupViewFilterPref)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.groupViewFilterPref.advFilterCode)) {
									var advData = objJsonData.d.preferences.groupViewFilterPref.advFilterCode;
									me.doHandleSavedFilterItemClick(advData, null);
									me.savedFilterVal = advData;
								}
							}
						}
					}
				}
			},
			'eventLogView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn,opts);
				}
			},
			'eventLogView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'eventLogFilterView' :{
				'beforerender' : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				'afterrender' : function(panel){
					me.handleDateChange(me.dateFilterVal,me.dateFilterLabel);
					me.setClientComboValue();
					me.updateQuickClientName(me.clientValue,'');
					me.updateQuickUserName(me.userValue,me.userValueDesc);
					me.updateQuickBankUserFlag(me.bankUserFlag);
				},
				'handleClientChange' : function(combo,  record) {
					me.handleClientChange(combo,record);
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handleUserChange' : function(user , userDesc){
					me.handleUserChange(user, userDesc);
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
					 objAdvSyncWithQuick = true;
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				},
//				'handleSavedFilterItemClick' : function(strFilterCode, filterDesc) {
//					me.doHandleSavedFilterItemClick(strFilterCode, filterDesc);
//				},
//				'createNewFilterClick' : function(btn, opts) {
//					me.doHandleCreateNewFilterClick(btn, opts);
//				},
//				'moreAdvancedFilterClick' : function(btn) {
//					me.handleMoreAdvFilterSet(btn.itemId);
//				},
				'handlebankuser':function(){
					 if(blnEventLogBankUser){
						$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',me.getBankUser().getValue());
						me.handleBankUserChange();
					 }
				}
			},
			'eventLogFilterView component[itemId="eventQuickEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : false,
						minDate : dtHistoryDate,
						maxDate: dtApplicationDate,
						changeYear : false,
						rangeSeparator : '  to  ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.datePickerSelectedDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal,me.dateFilterLabel);
								me.setDataForFilter();
								me.applyQuickFilter();
								me.disablePreferencesButton("savePrefMenuBtn",false);
							}
						}
					});
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();

				}
			},'eventLogFilterView combo[itemId="sellerCode_id"]' :
			{
				render : function( combo, newValue, oldValue )
				{
					var eventLogFilterView = me.getEventLogFilterView();
					var userNameFltId= eventLogFilterView.down('AutoCompleter[itemId="userNameFltId"]');
					var clientAutoComFiltr =  eventLogFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
					
					if( combo.getValue())
					{
						userNameFltId.cfgExtraParams =
						[
							{
								key : '$filterseller',
								value : combo.getValue()
							}
						];

						clientAutoComFiltr.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : combo.getValue()
							}					
						];							
					}
					else
					{
						userNameFltId.cfgExtraParams =
							[
								{
									key : '$filterseller',
									value : null
								}
							];

							clientAutoComFiltr.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : 'null'
								}					
							];		
					}
				
				},
				change : function( combo, newValue, oldValue )
				{
					if( combo.getValue() )
					{
						var eventLogFilterView = me.getEventLogFilterView();
						var userNameFltId= eventLogFilterView.down('AutoCompleter[itemId="userNameFltId"]');
						userNameFltId.cfgExtraParams =
						[
							{
								key : '$filterseller',
								value : combo.getValue()
							},{
								 key : '$filtercorporation',
								 value : strClientId
							}						
						];
						
						var clientAutoComFiltr =  eventLogFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
						clientAutoComFiltr.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : combo.getValue()
							}					
						];					
												
					}
				}
			},
			
			'eventLogFilterView AutoCompleter[itemId="clientAutoCompleter"]' : {
				select : function( combo, record, index )
				{
					me.filterApplied = 'Q';
					me.clientCode = combo.value;
					selectAdvClientCode = combo.value;
					selectAdvClientDesc = combo.rawValue;
					if(isClientUser())
						$("#advclient").val(selectAdvClientCode);
					else
						$("#advclientauto").val(selectAdvClientDesc);
					me.doSearchOnly();
				}				
			},
			
			'eventLogFilterView AutoCompleter[itemId="userNameFltId"]' : {
				select : function( combo, record, index )
				{
					me.filterApplied = 'Q';
					me.userName = '';		
					selectAdvUserNameCode = combo.getValue();
					selectAdvUserNameDesc = combo.getRawValue();
					$("#advusername").val(selectAdvUserNameDesc);
					me.doSearchOnly();
				},
				'render':function(combo){
							combo.listConfig.width = 200;							
				},				
				change : function( combo, record, index )
				{
					me.userName = combo.getRawValue();
					if(me.userName === ''){
						me.userValue = '';
						selectAdvUserNameCode = '';
					}
					if(isClientUser()){
							combo.cfgExtraParams=[{
							 key : '$filterseller',
							 value : sessionSellerCode
							},{
							 key : '$filtercorporation',
							 value : sessionCorporation
							}]
						   }
					if(Ext.isEmpty(combo.getValue())){
						me.filterApplied = 'Q';
						me.doSearchOnly();
					}
				}
				
			}

//			'eventLogView eventLogFilterView toolbar[itemId="dateToolBar"]' : {
//				afterrender : function(tbar, opts) {
//					me.updateDateFilterView();
//				}
//			},
//			'eventLogCreateNewAdvFilter[itemId="stdViewAdvFilter"]' : {
//				filterDateChange : function(btn, opts) {
//						me.creationDateChange(btn, opts);
//				},
//				filterDateRange : function(cmp, newVal) {
//						me.handleCreationDateChange(cmp.fieldIndex);
//				}
//			},
//			'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] eventLogCreateNewAdvFilter[itemId=stdViewAdvFilter]' : {
//				handleSearchAction : function(btn) {
//					filterUrl='';
//					me.SearchOrSave = false;
//					me.handleSearchAction(btn);
//				},
//				handleSaveAndSearchAction : function(btn) {
//					filterUrl='';
//					me.SearchOrSave = true;
//					me.handleSaveAndSearchAction(btn);
//				},
//				closeFilterPopup : function(btn) {
//					me.closeFilterPopup(btn);
//				},
//				handleRangeFieldsShowHide : function(objShow) {
//					me.handleRangeFieldsShowHide(objShow);
//				}
//			},
//			'eventLogAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] eventLogAdvFilterGridView' : {
//				orderUpEvent : function(grid, rowIndex, direction){
//					me.orderUpDown(grid, rowIndex, direction);
//				},
//				deleteFilterEvent : function (grid, rowIndex){
//					me.deleteFilterSet(grid, rowIndex);
//				},
//				viewFilterEvent : function(grid, rowIndex){
//					me.viewFilterData(grid, rowIndex);
//				},
//				editFilterEvent : function (grid, rowIndex){
//					me.editFilterData(grid, rowIndex);
//				},
//				filterSearchEvent : function(filterCode){
//					me.searchFilterData(filterCode);
//				}
//			}
		});
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'EVENTLOG_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'EVENTLOG_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	disablePreferencesButton : function(btnId,boolVal) {
		var me = this;
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'EVENTLOG_OPT_ADVFILTER') {
				filterUrl = '';
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode != 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						objAdvSyncWithQuick = false;
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
				} else {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					args = {
						scope : me
					};
					strModule = subGroupInfo.groupCode;
					strUrl = Ext.String.format(me.strGetModulePrefUrl,
							strModule);
					me.getSavedPreferences(strUrl,
							me.postHandleDoHandleGroupTabChange, args);
				}

			} else {
				args = {
					scope : me
				};
				var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (subGroupInfo.groupCode) : subGroupInfo.groupCode;
				strModule = colPrefModuleName;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
			}
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
		var objSummaryView = me.getEventLogView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		var showPager=null,heightOption=null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager)
			? objPref.gridSetting.showPager
			: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			colModel = objSummaryView.getColumnModel(arrCols);
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
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var objGroupView = me.getGroupView();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
		me.reportGridOrder = strUrl;
		strUrl = strUrl + '&'+ csrfTokenName + '='
				+ csrfTokenValue;
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}
		
		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);

			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid);
		});
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
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
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
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			var URLJson = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			strAdvancedFilterUrl = URLJson;
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=";
					
				}
				else 
					strUrl += ' and ';
				
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
			}

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
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
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
						// Special case we need to send to_date in datetime to get the 
						// right set of records in faster manner.
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[index].paramValue2 + ' 23:59:59\'';
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
						// Special case we need to send to_date in datetime to get the 
						// right set of records in faster manner.
						strTemp = strTemp + filterData[index].paramName + ' '
								+ 'bt' + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[index].paramValue1 + ' 23:59:59\'';
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
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var retUrl = {};
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk'
								|| operator === 'gt' || operator === 'lt')
						&& !isEmpty(strTemp)) {
						strTemp = strTemp + ' and ';
				}

				switch (operator) {
					case 'bt' :
						if (filterData[index].dataType === 1) {
							// Special case we need to send to_date in datetime to get the 
							// right set of records in faster manner.
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'datetime\''
									+ filterData[index].value2 + ' 23:59:59\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						isFilterApplied = true;
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
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						
						break;
					case 'eq' :
						isInCondition = me.isInCondition(filterData[index]);
						if (objValue != 'All') {
							if (isFilterApplied && strTemp.length > 0) {
								strTemp = strTemp + ' and ';
							} else {
								isFilterApplied = true;
							}
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
								if (filterData[index].dataType === 1) {
									// Special case we need to send to_date in datetime to get the 
									// right set of records in faster manner.
									strTemp = strTemp + filterData[index].field
									+ ' ' + 'bt'
									+ ' ' + 'date\'' + objValue
									+ '\'' + ' and ' + 'datetime\''
									+ objValue + ' 23:59:59\'';
								} else {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + '\'' + objValue + '\'';
								}
								isFilterApplied = true;
								break;
							}
						}
						if( filterData[ index ].dataType === 'D' ){
							// Special case we need to send to_date in datetime to get the 
							// right set of records in faster manner.
							isFilterApplied = true
							strTemp = strTemp + filterData[ index ].field + ' '
								+ 'bt' + ' ' + 'date\''
								+ filterData[ index ].value1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[ index ].value1 + ' 23:59:59\'';
						}
						else
						{
							isFilterApplied = true;
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + '\'' + filterData[ index ].value1 + '\'' ;
						}	
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied  && strTemp.length > 0) {
										strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}
									strTemp = strTemp + '(';
								for (var i = 0; i < objArray.length; i++) {
			
										strTemp = strTemp
												+ filterData[index].field
												+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										if (i != objArray.length - 1)
											strTemp = strTemp + ' or ';

									
								}
			
									strTemp = strTemp + ')';
								
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
		
		return strFilter;
	},
	handleClientChange : function (combo,record){
		var me = this;
		if(!Ext.isEmpty(combo))
			me.clientValue = combo.getValue();
		selectAdvClientCode = me.clientValue;
		if(record && record[0].data)
			me.clientValueDesc = record[0].data.DESCR;
		selectAdvClientDesc = me.clientValueDesc;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
		
	},
	setDataForFilter : function(applyAdvFilter) {
		var me = this;
		//me.getSearchTxnTextInput().setValue('');
		var arrQuickJson;
		var bankUser=me.getBankUser();
		if(!Ext.isEmpty(bankUser)){
			me.bankUserFlag=bankUser.getValue();
		}
		me.filterApplied = '';
		/*if (this.filterApplied === 'Q') {
			me.filterData = me.getQuickFilterQueryJson();
			
		} else if (this.filterApplied === 'A') {*/
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();
			
			if(objAdvSyncWithQuick === true){
			var reqJson = me.findNodeInJsonData(objJson,'field','isAdmin');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','isAdmin');
				me.filterData = arrQuickJson;
				me.updateQuickBankUserFlag(reqJson.value1);
			}else if(me.bIsAdvFilterApplied){
				me.updateQuickBankUserFlag(1);
			}
			
			var reqJson = me.findNodeInJsonData(objJson,'field','clientFilterId');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','clientFilterId');
				me.filterData = arrQuickJson;
				me.updateQuickClientName(reqJson.value1,reqJson.displayValue1);
			}else if(me.bIsAdvFilterApplied){
				me.updateQuickClientName('', '');
			}
			
			var reqJson = me.findNodeInJsonData(objJson,'field','userCode');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','userCode');
				me.filterData = arrQuickJson;
				me.updateQuickUserName(reqJson.value1,reqJson.displayValue1);
			}else if(me.bIsAdvFilterApplied){
				me.updateQuickUserName('', '');
			}
			
			var reqJson = me.findNodeInJsonData(objJson,'field','dateTime');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','dateTime');
				me.filterData = arrQuickJson;
				
				if(!Ext.isEmpty(reqJson.value1) && (me.bIsAdvFilterApplied || applyAdvFilter)){
					me.datePickerSelectedDate[0]=Ext.Date.parse(reqJson.value1, 'Y-m-d');
					
					if(!Ext.isEmpty(reqJson.value2) && reqJson.value1 !== reqJson.value2){
						me.datePickerSelectedDate[1]=Ext.Date.parse(reqJson.value2, 'Y-m-d');
					}
					//me.dateFilterVal = me.creationDateFilterVal;
					//me.dateFilterLabel = me.creationDateFilterLabel;
					me.handleDateChange(me.dateFilterVal, me.dateFilterLabel);
				}
			}
		}
		//}
		this.advFilterData = objJson;
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		this.advFilterCodeApplied = filterCode;
		
	},
	applyQuickFilter : function() {
		var me = this;
		filterUrl='';
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'EVENTLOG_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var sellerVal;
		var objDateParams = me.getDateParam(index);
		var clientFilterVal = '';
		var clientFilterDesc = '';
		var userCodeValue = '';
		var userValueDesc = '';
		var objDateParams = me.getDateParam(index);
		var clientComboBox = me.getEventLogFilterView().down('AutoCompleter[itemId="clientAutoCompleter"]');
		if (!Ext.isEmpty(clientComboBox) && !Ext.isEmpty(clientComboBox.getValue())) {
			clientFilterVal = clientComboBox.getValue();
			clientFilterDesc = clientComboBox.getRawValue();
		}
		var userNameFltId= me.getEventLogFilterView().down('AutoCompleter[itemId="userNameFltId"]');
		if (!Ext.isEmpty(index)) {
		jsonArray.push({
					paramName : 'dateTime',
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D',
					paramFieldLable : getLabel('dateTime','Last Login')
				});
		}
		if(!Ext.isEmpty(clientFilterVal) && clientFilterVal!= 'all' ){
			jsonArray.push({
				paramName : 'clientFilterId',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('clientId','Company Name'),
				displayValue1 : clientFilterDesc
			});
		}
		if(!Ext.isEmpty(userNameFltId) && !Ext.isEmpty(userNameFltId.getValue())){
			jsonArray.push({
				paramName : 'userCode',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(me.userValue.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('userCode','User Name'),
				displayValue1 : me.userValueDesc
			});
		}
		if(me.bankUserFlag){
		jsonArray.push({
						paramName : 'isAdmin',
						paramValue1 : "0,2,3", // Admin,on-behalf,Emulation
						operatorValue : 'in',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('isAdmin','Bank User'),
						displayValue1 : "Yes"
					}); 
		}else{
			jsonArray.push({
				paramName : 'isAdmin',
				paramValue1 : 1,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('isAdmin','Bank User'),
				displayValue1 : "No"
			});
		}
		var sellerFilter = me.getEventLogSellerRef();
		if (!Ext.isEmpty(sellerFilter) && !Ext.isEmpty(sellerFilter.getValue())) {
			sellerVal = sellerFilter.getValue().toUpperCase();
		}

		jsonArray.push({
					paramName : 'sellerCode',
					paramValue1 : sellerVal,
					operatorValue : 'eq',
					dataType : 'S',
					paramFieldLable : getLabel('lblSeller', 'Financial Institute')
				});
		return jsonArray;
		
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		objGroupView.refreshData();
	},
	handleUserChange : function(user,userDesc){
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.userValue = user;
		me.userValueDesc = userDesc;
		selectAdvUserNameCode = user;
		selectAdvUserNameDesc = userDesc;		
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "eventEntryDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue , me.dateFilterLabel);
			me.filterAppiled = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
		} else if (filterType == "entryDateAdvFilter") {

		}
	},
	handleDateChange : function(index,objLabel) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');

		if (!Ext.isEmpty(objLabel)) {
			// Setting the Quick Date Filter label
			me.getDateLabel().setText(getLabel('dateToday', 'Last Login') + " (" + objLabel + ")");
			me.creationDateFilterLabel = objLabel;
			// Setting the Advance Date Filter label
			$('label[for="CreationDateLabel"]').text(getLabel('advDate','Last Login')	+ " (" + me.creationDateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		if (index == '7') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.val(vFromDate);
				$('#creationDate').val(vFromDate);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};					
			} else {
				datePickerRef.val([vFromDate +' to '+ vToDate]);
				$('#creationDate').val([vFromDate +' to '+ vToDate]);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};				
			}
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					datePickerRef.val('Till' + '  ' + vFromDate);
					$('#creationDate').val('Till' + '  ' + vFromDate);
				} else {
					datePickerRef.val(vFromDate);
					$('#creationDate').val(vFromDate);
				}
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};					
			} else {
				datePickerRef.val([vFromDate +' to '+ vToDate]);
				$('#creationDate').val([vFromDate +' to '+ vToDate]);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};				
			}
		}
	},
	getDateParam : function(index, dateType) {
		var me = this;
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
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
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
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	/*updateDateFilterView : function() {
		var me = this;
		var dtEntryDate = null;
		var defaultToDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		var defaultFromDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromEntryDate().setValue(dtEntryDate);
				} else {
					me.getFromEntryDate().setValue(defaultFromDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToEntryDate().setValue(dtEntryDate);
				} else {
					me.getToEntryDate().setValue(defaultToDate);
				}
			} else {
				me.getFromEntryDate().setValue(defaultFromDate);
				me.getToEntryDate().setValue(defaultToDate);
			}
		}

	},*/
	/*doHandleCreateNewFilterClick : function(btn) {
		var me = this;
		me.filterMode = 'ADD';
		var objCreateNewFilterPanel = null;
		var filterDetailsTab = null;
		var saveSearchBtn = null;
		var objTabPanel = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			// me.filterCodeValue = null;
			filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('createNewFilter',
					'Create New Filter'));
			saveSearchBtn = me.getSaveSearchBtn();
			if (saveSearchBtn) {
				saveSearchBtn.show();
			}
			
		} else {
			me.createAdvanceFilterPopup();
		}

		objCreateNewFilterPanel = me.getCreateNewFilter();
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);
		// me.getPreloadsOnAdvanceFilter(objCreateNewFilterPanel);

		me.objAdvFilterPopup.show();
		me.objAdvFilterPopup.center();
		objTabPanel = me.getAdvanceFilterTabPanel();
		objTabPanel.setActiveTab(1);
	}*/
	/*createAdvanceFilterPopup : function() {
		var me = this;
		if (Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup = Ext.create(
					'GCP.view.eventLog.EventLogAdvancedFilterPopup', {
						itemId : 'stdViewAdvancedFilter',
						filterPanel : {
							xtype : 'eventLogCreateNewAdvFilter',
							itemId : 'stdViewAdvFilter',
							margin : '4 0 0 0'						}
					});

			// TODO:To be handled
			//me.updateAdvFilterConfig();
		}
	},*/
	creationDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	handleCreationDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.creationDateFilterLabel)) {
			$('label[for="CreationDateLabel"]').text(getLabel('advDate',
					'Last Login')
					+ " (" + me.creationDateFilterLabel + ")");
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '7') {
			if (filterOperator == 'eq') {
				$('#creationDate').val(vFromDate);
				//$('#entryDataPicker').setDateRangePickerValue(vFromDate);
			} else {
				$('#creationDate').val([vFromDate+' to '+ vToDate]);
				//$('#entryDataPicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : vToDate
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					$('#creationDate').val('Till' + '  ' + vFromDate);
					//$('#entryDataPicker').val('Till' + '  ' + vFromDate);
				} else {
					$('#creationDate').val(vFromDate);
					//$('#entryDataPicker').setDateRangePickerValue(vFromDate);
				}
			} else {
				$('#creationDate').val([vFromDate+' to '+ vToDate]);
				//$('#entryDataPicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : vToDate
			};
		}
	},
	handleBankUserChange : function(){
		var me = this;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	searchActionClicked : function(me) {
		me.bIsAdvFilterApplied = true;
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		me.filterApplied = 'A';
		me.doSearchOnly();
		if (savedFilterCombobox)
			savedFilterCombobox.setValue('');
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip('');
		me.bIsAdvFilterApplied = false;
	},
	doSearchOnly : function() {
		var me = this;
		//me.handleDateChange(me.creationDateFilterVal,me.creationDateFilterLabel);
		if(me.filterApplied == 'A')
		{
			me.applyAdvancedFilter();
		}
		else
		{
			me.applyQuickFilter();
		}
		
	},
	applyAdvancedFilter : function(isAdvFilter) {
		var me = this;
		var objGroupView = me.getGroupView();

		me.filterApplied = 'A';
		me.setDataForFilter(isAdvFilter);
		//me.resetAllFields();
		me.refreshData();
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
/*	handleAdvanceFilterCleanUp : function() {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var searchOrSaveFlag = me.SearchOrSave;
		if (!Ext.isEmpty(searchOrSaveFlag)) {
			if (searchOrSaveFlag) {
				if (!Ext.isEmpty(objCreateNewFilterPanel)) {
					objCreateNewFilterPanel
							.resetAllFields(objCreateNewFilterPanel);
					objCreateNewFilterPanel.enableDisableFields(
							objCreateNewFilterPanel, false);
					objCreateNewFilterPanel.removeReadOnly(
							objCreateNewFilterPanel, false);
				}

			}
		}

	},*/
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType && (displayType === 4 || displayType === 3)) {
			retValue = true;
		}
		return retValue;
	},
	saveAndSearchActionClicked : function(me) {
		me.bIsAdvFilterApplied = true;
		me.handleSaveAndSearchAction();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		me.filterCodeValue = $("#savedFilterAs").val();
		if (me.filterCodeValue === null) {
			var FilterCode = $("#savedFilterAs").val();
			if (Ext.isEmpty(FilterCode)) {
				paintError('#advancedFilterErrorDiv',
						'#advancedFilterErrorMessage', getLabel(
								'filternameMsg', 'Please Enter Filter Name'));
				return;
			} else {
				hideErrorPanel("advancedFilterErrorDiv");
				me.filterCodeValue = FilterCode;
				strFilterCodeVal = me.filterCodeValue;
			}
		} else {
			strFilterCodeVal = me.filterCodeValue;
		}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		}

	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal,me.dateFilterVal);
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
										cls : 'ux_popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							filterGrid.getStore().reload();
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	postDoSaveAndSearch : function() {
		var me = this;
		//me.doSearchOnly();
		me.applyAdvancedFilter();
		me.bIsAdvFilterApplied = false;
	},
	/*handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		var objTabPanel = null;
		var filterDetailsTab = null;
		var clientContainer = null;
		if (Ext.isEmpty(me.objAdvFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		me.objAdvFilterPopup.show();
		objTabPanel = me.getAdvanceFilterTabPanel();
		objTabPanel.setActiveTab(0);
		filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
	},*/
	doHandleSavedFilterItemClick : function(filterCode, filterDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.SearchOrSave = true;
			me.advFilterData = {};
			me.datePickerSelectedDate = [];
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		filterCode = Ext.util.Format.htmlDecode(filterCode);
		var objOfCreateNewFilter = me.getCreateNewFilter();
		var objJson;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var dateToField;
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		me.updateQuickUserName('', '');
		addAdvFilterFieldsData();
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = decodeURIComponent(filterData.filterBy[i].value1);
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			fieldDisplayVal = filterData.filterBy[i].displayValue1;
			if(fieldName === 'dateTime'){
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						filterData.filterBy[i].value1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
						filterData.filterBy[i].value2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var index = filterData.filterBy[i].dateVal;
				filterOperator = operatorValue;
				me.creationDateFilterVal = index;
				me.creationDateFilterLabel = me.getLabel(index);
				me.dateFilterVal = index;
				me.dateFilterVal = me.getLabel(index);
				if (index == '7') {
					if (filterOperator == 'eq') {
						$('#creationDate').val(vFromDate);
						$('#entryDataPicker').val(vFromDate);
					} else {
						$('#creationDate').val([vFromDate+" to "+ vToDate]);
						$('#entryDataPicker').val([vFromDate+" to "+vToDate]);
						
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedCreationDate = {
						operator : filterOperator,
						fromDate : vFromDate,
						toDate : vToDate
					};
					if (vFromDate) {
						me.datePickerSelectedDate[0] = new Date(Ext.Date.parse(vFromDate, strExtApplicationDateFormat))
					}
					if (dateToField) {
						me.datePickerSelectedDate[1] = new Date(Ext.Date.parse(dateToField, strExtApplicationDateFormat))
					}
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							$('#creationDate').val('Till' + '  ' + vFromDate);
							$('#entryDataPicker').val('Till' + '  ' + vFromDate);
						} else {
							$('#creationDate').val(vFromDate);
							$('#entryDataPicker').val(vFromDate);
						}
					} else {
						$('#creationDate').val([vFromDate +' to '+ vToDate]);
						$('#entryDataPicker').val([vFromDate+' to '+ vToDate]);
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedCreationDate = {
						operator : filterOperator,
						fromDate : vFromDate,
						toDate : vToDate
					};
				}
			}
			
			if(fieldName === 'clientFilterId'){
				if(isClientUser())
					$("#advclient").val(fieldVal);
				else{
					$("#advclientauto").val(fieldSecondVal);
					
					selectAdvClientDesc = fieldSecondVal;
					selectAdvClientCode = fieldVal;
				}
			}
			else if(fieldName === 'userCategory'){
				$("#advrole").val(fieldVal);
			}
			else if(fieldName === 'userCode'){
				$("#advusername").val(fieldDisplayVal);
				selectAdvUserNameDesc = fieldDisplayVal;
				selectAdvUserNameCode = fieldVal;
			}
			else if(fieldName === 'ipAdress'){
				$("#advipaddress").val(fieldVal);
			}
			else if(fieldName === 'userMessage'){
				$("#advusermessage").val(fieldVal);
			}
			else if(fieldName === 'trackingNumber'){
				$("#advtrackingno").val(fieldVal);
			}
			else if(fieldName === 'pagecode'){
				$("#advpage").val(fieldVal);
			}
			else if(fieldName === 'channel'){
				//$("#advchannel").val(fieldVal);
				$("#advchannel > [value="+ fieldVal +"]").attr("selected", "true");
			}
			else if(fieldName === 'module_id'){				
				$("#advmodule > [value="+ fieldVal +"]").attr("selected", "true");
			}
			else if(fieldName === 'emulatingUsrId'){
				$("#advemulatinguserid").val(fieldVal);
			}
			else if(fieldName === 'department'){
				$("#advdepartment").val(fieldVal);
			}
			else if(fieldName === 'isAdmin'){
				$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',true);
			}
			
			if (fieldName === 'dateTime') {
			me.setSavedFilterDates(fieldName, currentFilterData);
			}
		
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
		}
		if (applyAdvFilter){
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(applyAdvFilter);
		}
	},
	getLabel : function(dateVal) {
		var objDateLbl = {
				'1' : getLabel('today', 'Today'),
				'2' : getLabel('yesterday', 'Yesterday'),
				'3' : getLabel('thisweek', 'This Week'),
				'4' : getLabel('lastweektodate', 'Last Week To Date'),
				'5' : getLabel('thismonth', 'This Month'),
				'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
				'8' : getLabel('thisquarter', 'This Quarter'),
				'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
				'10' : getLabel('thisyear', 'This Year'),
				'11' : getLabel('lastyeartodate', 'Last Year To Date'),
				'7' : getLabel('daterange', 'Date Range')
		};
		return objDateLbl[dateVal];
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);

		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;

		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}

		this.sendUpdatedOrderJsonToDb(store);
	},
	sendUpdatedOrderJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/eventlog/groupViewAdvanceFilter.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
/*	updateAdvActionToolbar : function() {
		var me = this;
		var filterView = me.getEventLogFilterView();
		Ext.Ajax.request({
			url : 'services/userpreferences/eventlog/groupViewAdvanceFilter.json',
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var filters = JSON.parse(responseData.preference);
				if (filterView)
					filterView.addAllSavedFilterCodeToView(filters.filters);

			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},*/
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var objGroupView = me.getGroupView();
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}

		var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb(store);
		store.reload();
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
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
//	populateAndDisableSavedFilter : function(filterCode, filterData,
//			applyAdvFilter) {
//		var me = this;
//		var fieldName = '';
//		var fieldVal = '';
//		var fieldSecondVal = '';
//		var currentFilterData = '';
//		var fieldType = '';
//		var columnId = '';
//		var sortByOption = '';
//		var buttonText = '';
//		var operatorValue = '';
//		var objSellerAutoComp = null;
//		var objCreateNewFilterPanel = me.getCreateNewFilter();
//		var objAdvTabPanel = me.getAdvanceFilterTabPanel();
//		if (!Ext.isEmpty(filterData.sellerValue)) {
//			if (!Ext.isEmpty(objAdvTabPanel))
//				objSellerAutoComp = objAdvTabPanel
//						.down('AutoCompleter[itemId="sellerAutoCompleter"]');
//			if (!Ext.isEmpty(objSellerAutoComp))
//				objSellerAutoComp.setValue(filterData.sellerValue);
//		}
//		for (i = 0; i < filterData.filterBy.length; i++) {
//			fieldName = filterData.filterBy[i].field;
//			fieldVal = filterData.filterBy[i].value1;
//			fieldSecondVal = filterData.filterBy[i].value2;
//			currentFilterData = filterData.filterBy[i];
//			operatorValue = filterData.filterBy[i].operator;
//
//			if (fieldName === 'ipAdress' || fieldName === 'userMessage'
//				|| fieldName === 'trackingNumber' || fieldName === 'accountNo'
//				|| fieldName === 'field1'
//				|| fieldName === 'field2' || fieldName === 'field3' ||fieldName === 'systemMessage'
//				|| fieldName === 'department') {
//			fieldType = 'textfield';
//			} else if (fieldName === 'userCategory' || fieldName === 'userCode' || fieldName === 'emulatingUserId') {
//				fieldType = 'AutoCompleter';
//			}
//			else if (fieldName === 'CreateDate' || fieldName === 'EntryDate'
//				|| fieldName === 'ActivationDate') {
//				objCreateNewFilterPanel.setSavedFilterDates(
//					objCreateNewFilterPanel, fieldName, currentFilterData,
//					false);
//			} else if (fieldName === 'page' ) {
//			fieldType = 'combobox';
//			} else if (fieldName === 'clientId'){
//				if(isClientUser()){
//					fieldType = 'combobox';
//					fieldName = 'clientIdCombo';
//			}
//			else{
//				fieldType = 'AutoCompleter';
//				fieldName = 'clientId';
//			}
//			}else
//				fieldType = 'label';
//		
//		
//			var fieldObj = objCreateNewFilterPanel.down('' + fieldType
//					+ '[itemId="' + fieldName + '"]');
//
//			if (!Ext.isEmpty(fieldObj)) {
//				if (fieldType == "label")
//					fieldObj.setText(fieldVal);
//				else
//					fieldObj.setValue(fieldVal);
//			}
//
//		}
//
//		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
//				.setValue(filterCode);
//		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, true);
//	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		var applyAdvFilter = false;

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);

	},
	searchFilterData : function(filterCode) {
		var me = this;
		filterCode = Ext.util.Format.htmlEncode(filterCode);
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getEventLogFilterView();
			if (filterView)
				filterView.highlightSavedFilter(filterCode);
			if (!Ext.isEmpty(objToolbar)) {
				var tbarItems = objToolbar.items.items;
				if (tbarItems.length >= 1) {
					for (var index = 0; index < 2; index++) {
						currentBtn = tbarItems[index];
						if (currentBtn) {
							if (currentBtn.itemId === filterCode) {
								filterPresentOnToolbar = true;
								me.doHandleSavedFilterItemClick(filterCode,
										currentBtn, true);
							}
						}
					}
				}

				if (!filterPresentOnToolbar) {
					me
							.doHandleSavedFilterItemClick(filterCode, emptyBtn,
									false);
				}

			}
		}
	},
	findNodeInJsonData : function(arr, paramName, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromArrJson : function(arr, paramName, key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	updateQuickBankUserFlag : function(value){
		var me = this;
		var quickBankUserChkBox = me.getBankUser();
		blnEventLogBankUser = false;
		var reg = new RegExp(/[\(\)]/g);
		objValue = String(value).replace(reg, '');
		var objArray = objValue.split(',');
		if(!Ext.isEmpty(value) && (objArray.indexOf('0') > -1 ||objArray.indexOf('2') > -1 ||objArray.indexOf('3') > -1)){
			quickBankUserChkBox.setValue(true);
		}else{
			quickBankUserChkBox.setValue(false);
		}
		blnEventLogBankUser = true;
		me.bankUserFlag = true;
	},
	updateQuickClientName : function(value,desc){
		var me = this;
		var objOfEventLogFilterView = me.getEventLogFilterView();
		if(isClientUser()){
			if (!Ext.isEmpty(objOfEventLogFilterView))
				var quickClientCombo = objOfEventLogFilterView.down('combobox[itemId="quickFilterClientCombo"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClientCombo))
				quickClientCombo.setValue(value);
			me.clientValue = value;
		}
		else{
			var quickClientAutoComp;
			if (!Ext.isEmpty(objOfEventLogFilterView)){
				 quickClientAutoComp = objOfEventLogFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClientAutoComp))
				quickClientAutoComp.setValue(value);
			quickClientAutoComp.setRawValue(desc);
			me.clientValue = value;
			}
		}
	},
	updateQuickUserName : function(value,desc){
		var me = this;
		var objOfEventLogFilterView = me.getEventLogFilterView();
		var quickUserNameAutoComp;
		if (!Ext.isEmpty(objOfEventLogFilterView))
				quickUserNameAutoComp = objOfEventLogFilterView.down('AutoCompleter[itemId="userNameFltId"]');
			
		if(!Ext.isEmpty(value) && !Ext.isEmpty(quickUserNameAutoComp))
			quickUserNameAutoComp.setValue(value);
		
		quickUserNameAutoComp.setRawValue(desc);
		me.userValue = value;
	},
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getEventLogFilterView();
		Ext.Ajax.request({
			url : me.strReadAllAdvancedFilterCodeUrl,
			method : 'GET',
			success : function(response) {
				var decodedJson = Ext.decode(response.responseText);
				var arrJson = new Array();

				if (!Ext.isEmpty(decodedJson.d.filters)) {
					for (i = 0; i < decodedJson.d.filters.length; i++) {
						arrJson.push({
									"filterName" : decodedJson.d.filters[i]
								});
					}
				}
				gridView.loadRawData(arrJson);
				if (filterView)
					filterView
							.addAllSavedFilterCodeToView(decodedJson.d.filters);
			},
			failure : function(response) {
				// console.log("Ajax Get data Call Failed");
			}

		});
	},
	handleClearPreferences : function() {
		var me = this;
		me.doClearPreferences();
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	doClearPreferences : function() {
		var me = this;
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		me.preferencesHandler.clearPagePreferences(me.strPageName,arrPref,null,null,me,true);

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
			var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (subGroupInfo.groupCode) : subGroupInfo.groupCode;
			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
				if (groupInfo.groupTypeCode !== 'EVENTLOG_OPT_ADVFILTER'
					|| (groupInfo.groupTypeCode == 'EVENTLOG_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
				
				arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : groupInfo.groupTypeCode,
							subGroupCode : subGroupInfo.groupCode
						}
					});
				
				arrPref.push({
							"module" : colPrefModuleName,
							"jsonPreferences" : {
								 'gridCols' : gridState.columns,
								 'pgSize' : gridState.pageSize,
								 'sortState':gridState.sortState,
								 'gridSetting' : groupView.getGroupViewState().gridSetting
							}
						});
				}
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {},strSqlDateFormat = 'Y-m-d';
		
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var quickPref = {};
		quickPref.client = me.clientValue;
		quickPref.user = me.userValue;
		quickPref.userDesc = me.userValueDesc;
		quickPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);				
			if (me.datePickerSelectedDate.length == 1) {
				quickPref.entryDateFrom = me.dateFilterFromVal;	
			}	
			else if(me.datePickerSelectedDate.length == 2){
				quickPref.entryDateFrom = me.dateFilterFromVal;	
				quickPref.entryDateTo = me.dateFilterToVal;			
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		
		return objFilterPref;
	},
	handleSavePreferences : function() {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);	
		me.doSavePreferences();
	},
	doSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		me.preferencesHandler.savePagePreferences(me.strPageName,arrPref,null,null,me,true);
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..
		var objDateLbl = {
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweektodate', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date'),
			'7' : getLabel('daterange', 'Date Range')
		};
		if (!Ext.isEmpty(objEventSavePreferences)) {
			var objJsonData = Ext.decode(objEventSavePreferences);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				var strclient = data.quickFilter.client;
				var strUser = data.quickFilter.user;
				var strUserDesc = data.quickFilter.userDesc;
				
				me.clientValue = strclient;
				me.userValue = strUser;
				me.userValueDesc = strUserDesc;

				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '7') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;
						me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
						me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
					}
				}
			}
		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '7') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				strOpt = 'bt';
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						// strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
					|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))
				arrJsn.push({
							paramName : 'dateTime',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
		}

		if(!Ext.isEmpty(me.clientValue) && me.clientValue !== null && me.clientValue!= 'all' ){
			arrJsn.push({
				paramName : 'clientFilterId',
				operatorValue : 'eq',
				paramValue1 : me.clientValue,
				dataType : 'S'
			});
		}
		if(!Ext.isEmpty(me.userValue) && me.userValue !== null && me.userValue!= 'all' ){
			arrJsn.push({
				paramName : 'userCode',
				operatorValue : 'eq',
				paramValue1 : me.userValue,
				dataType : 'S'
			});
		}
		if(me.bankUserFlag){
			arrJsn.push({
						paramName : 'isAdmin',
						paramValue1 : 0,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		me.filterData = arrJsn;
	},
	handleReportAction : function( btn, opts )
	{
		var me = this;
		me.downloadReport( btn.itemId );
	},
	downloadReport : function(actionName) {
		var me = this;
		//var withHeaderFlag = me.getWithHeaderCheckbox().checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			loanCenterDownloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
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
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();

		strExtension = arrExtension[actionName];
		strUrl = 'services/eventLog/getDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
		strUrl += strQuickFilterUrl;
		strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType;
		
		var strOrderBy = me.reportGridOrder;
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

		var grid = null;
		if (!Ext.isEmpty(objGroupView)) {
			if (!Ext.isEmpty(objGroupView))
				grid = objGroupView.getGrid();
			viscols = grid.getAllVisibleColumns();
			for (var j = 0; j < viscols.length; j++) {
				col = viscols[j];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex]) {
					if (colMap[arrDownloadReportColumn[col.dataIndex]]) {
						// ; do nothing
					} else {
						colMap[arrDownloadReportColumn[col.dataIndex]] = 1;
						colArray.push(arrDownloadReportColumn[col.dataIndex]);
					}
				}
			}
			if (colMap != null) {
				visColsStr = visColsStr + colArray.toString();
				strSelect = '&$select=[' + colArray.toString() + ']';
			}
		}
		strUrl = strUrl + strSelect;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
			objParam[arrMatches[1]] = arrMatches[2];
		}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));

		// var strToken = '&' + csrfTokenName + '=' + csrfTokenValue;
		// strUrl += strToken;
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
		/*form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));*/
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
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		me.clientValue = 'all';
		/*
		if(isClientUser()){
			var clientComboBox = me.getEventLogFilterView().down('AutoCompleter[itemId="clientAutoCompleter"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getEventLogFilterView().down('AutoCompleter[itemId="clientAutoCompleter"]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		
		if(!isClientUser()){
			var objBankUser = me.getEventLogFilterView().down('checkbox[itemId="eventBankUserCheckbox"]');
			objBankUser.setValue(false);
		}
		me.bankUserFlag = false;*/
		
		var objUserAutoComp = me.getEventLogFilterView().down('AutoCompleter[itemId="userNameFltId"]');
		me.userValue = '';
		objUserAutoComp.setValue(me.userValue);
		objUserAutoComp.setRawValue(me.userValue);
		selectAdvUserNameCode ='';
		selectAdvUserNameDesc = '';
		
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getEventLogFilterView().down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		me.dateFilterVal = '1';
		me.dateFilterLabel = getLabel('today', 'Today');
		me.handleDateChange(me.dateFilterVal,me.dateFilterLabel);
		me.filterApplied = 'Q';

		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},
	setClientComboValue : function(){
		var me = this;
		var objClientCombo;
		var objFilterView = me.getEventLogFilterView();
		if(!Ext.isEmpty(objFilterView))
			objClientCombo = objFilterView.down('combo[itemId="quickFilterClientCombo"]');
		if(!Ext.isEmpty(objClientCombo)){
			objClientCombo.select(objClientCombo.getStore().getAt(0));
		}
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',false);
		me.bankUserFlag = false;
		me.getBankUser().setValue(false);
		$("#advclient").val("");
		$("#advclientauto").val("");
		selectedCreationDate = {};
		$("#creationDate").val("");
		$("#advrole").val("");
		$("#advusername").val("");
		$("#advipaddress").val("");
		$("#advusermessage").val("");
		$("#advtrackingno").val("");
		$("#advpage").val("");
		$("#advchannel").val("");
		$("#advmodule").val("");
		$("#advemulatinguserid").val("");
		$("#advdepartment").val("");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		me.creationDateFilterVal = '1';
		me.creationDateFilterLabel = getLabel('today', 'Today');
		me.filterCodeValue = '';
		selectAdvClientCode = "";
		selectAdvClientDesc = "";
		$('label[for="CreationDateLabel"]').text(getLabel('today', 'Today'));
		if(isClientUser()){
			var clientComboBox = me.getEventLogFilterView().down('AutoCompleter[itemId="clientAutoCompleter"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getEventLogFilterView().down('AutoCompleter[itemId="clientAutoCompleter"]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		if(!isClientUser()){
			var objBankUser = me.getEventLogFilterView().down('checkbox[itemId="eventBankUserCheckbox"]');
			objBankUser.setValue(false);
		}
		
		me.resetAdvCreationDate();
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
		else{
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
		}
	},
	
	resetAdvCreationDate: function(){
		var me = this;
		var formattedFromDate;
		var objDateParams = me.getDateParam('1');
		var vFromDate = objDateParams.fieldValue1;
		var dateFilterRef = $('#creationDate');
		if (!Ext.isEmpty(vFromDate)) {
			formattedFromDate = Ext.util.Format.date(Ext.Date.parse(vFromDate, 'Y-m-d'), strExtApplicationDateFormat);
			$(dateFilterRef).val(formattedFromDate);
		}
		selectedCreationDate = {
				operator : 'eq',
				fromDate : formattedFromDate,
				toDate : formattedFromDate
			};
	},
	
	setSavedFilterDates : function(dateType, data) {
		var objDateLbl = {
				'1' : getLabel('today', 'Today'),
				'2' : getLabel('yesterday', 'Yesterday'),
				'3' : getLabel('thisweek', 'This Week'),
				'4' : getLabel('lastweektodate', 'Last Week To Date'),
				'5' : getLabel('thismonth', 'This Month'),
				'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
				'8' : getLabel('thisquarter', 'This Quarter'),
				'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
				'10' : getLabel('thisyear', 'This Year'),
				'11' : getLabel('lastyeartodate', 'Last Year To Date'),
				'7' : getLabel('daterange', 'Date Range')
		};
		var dateLabel = '';
		var me = this;
		var dateFilterRef = null;
		var dateOperator = data.operator;
		var dateVal = data.dateVal;
		
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(dateVal)) {
			me.dateFilterVal =data.dateVal;
			me.dateFilterLabel = objDateLbl[dateVal]
			dateLabel = objDateLbl[dateVal];
			
			if (!Ext.isEmpty(dateLabel)) {
				$('label[for="CreationDateLabel"]').text(getLabel('advDate',
						'Last Login')
						+ " (" + dateLabel + ")");
			}
			
			if (me.dateFilterVal !== '7') {
				var dtParams = me.getDateParam(dateVal);
				
				data.value1 = dtParams.fieldValue1;
				data.value2 = dtParams.fieldValue2;
				
			}
			

			if (dateType === 'dateTime') {
				dateFilterRef = $('#creationDate');
			} 
			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
					$('#entryDataPicker').val(formattedFromDate);
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					var toDate = data.value2;
					if (!Ext.isEmpty(toDate)) {
						var formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
						$(dateFilterRef).val([formattedFromDate+' to '+ formattedToDate]);
						$('#entryDataPicker').val([formattedFromDate+' to '+formattedToDate]);		
					}
				}
			}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}

	}
});