/**
 * @class GCP.controller.AccountActivityController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */
/**
 * This controller is prime controller in Account Summary T7 Controller which
 * handles all measure events fired from GroupView. This controller has
 * important functionality like on any change on grid status or quick filter
 * change, it forms required URL and gets data which is then shown on Summary
 * Grid.
 */
Ext.define('GCP.controller.AccountActivityController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.activity.AccountActivityView','Ext.ux.gcp.PageSettingPopUp',
			'GCP.view.common.SummaryRibbonView', 'GCP.view.AccountCenter',
			'GCP.view.activity.AccountActivityGraph', 'Ext.ux.gcp.DateUtil',
			'Ext.ux.gcp.PreferencesHandler',
			//'GCP.view.activity.popup.RemarkPopup',
			'GCP.view.activity.popup.ActivityAdvFilterPopUp',
			'GCP.view.activity.TransactionCategoryGridView','GCP.view.activity.TransactionCategoryEntryGridView',
			'GCP.view.activity.TransactionCategoryPopUpView'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="activitySetting"]'
			},{
				ref : 'accountCenter',
				selector : 'accountCenter'
			}, {
				ref : 'accountActivityView',
				selector : 'accountActivityView'
			},{
				ref : 'genericFilterView',
				selector : 'accountActivityView filterView'
			},{
				ref : 'groupView',
				selector : 'accountActivityView groupView'
			},{
				ref : 'filterView',
				selector : 'accountActivityFilterView'
			},{
				ref : 'moreFilterLink',
				selector : 'accountActivityView filterView label[itemId="createAdvanceFilterLabel"]'
			}, {
				ref : 'btnAllCats',
				selector : 'accountActivityView accountActivityFilterView button[itemId="allCat"]'
			}, {
				ref : 'summaryInfoView',
				selector : 'accountActivityView summaryRibbonView'
			}, {
				ref : 'activityGrid',
				selector : 'accountActivityView smartgrid[itemId="activityGrid"]'
			}, {
				ref : 'transactionCategoryPopUp',
				selector : 'transactionCategoryPopUpView[itemId="transactionCategoryPopUpView"]'
			}, {
				ref : 'fromDateLabel',
				selector : 'accountActivityFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : 'accountActivityFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'accountActivityFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'dateLabel',
				selector : 'accountActivityFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'postingDate',
				selector : 'accountActivityFilterView button[itemId="postingDate"]'
			}, {
				ref : 'fromEntryDate',
				selector : 'accountActivityFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'accountActivityFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'graphPanel',
				selector : 'accountActivityView panel[itemId="activityGraphPanel"]'
			}, {
				ref : 'withHeaderReportCheckbox',
				selector : 'accountActivityView accountActivityTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'btnSavePreferences',
				selector : 'accountActivityView accountActivityFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'accountActivityView accountActivityFilterView button[itemId="btnClearPreferences"]'
			}, {
				ref : 'advanceFilterPopup',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"]'
			}, {
				ref : 'advanceFilterTabPanel',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'filterDetailsTab',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'createNewFilter',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId="activityCreateNewAdvFilter"]'
			}, {
				ref : 'saveSearchBtn',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId="activityCreateNewAdvFilter"] button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityAdvFilterGridView'
			}, {
				ref : 'filterDetailsTab',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'postingFromDateLabel',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=postingDateLabelsContainer] label[itemId="postingDateFilterFrom"]'
			}, {
				ref : 'postingToDateLabel',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=postingDateLabelsContainer] label[itemId="postingDateFilterTo"]'
			}, {
				ref : 'postingDateRange',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=postingDateRangeContainer] container[itemId="postingDateRangeComponent"]'
			}, {
				ref : 'postingDateLbl',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] label[itemId=postingDateLbl]'
			}, {
				ref : 'postingDateBtn',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] button[itemId=postingDateBtn]'
			}, {
				ref : 'valueFromDateLabel',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=valueDateLabelsContainer] label[itemId="valueDateFilterFrom"]'
			}, {
				ref : 'valueToDateLabel',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=valueDateLabelsContainer] label[itemId="valueDateFilterTo"]'
			}, {
				ref : 'valueDateRange',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] container[itemId=valueDateRangeContainer] container[itemId="valueDateRangeComponent"]'
			}, {
				ref : 'valueDateLbl',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] label[itemId=valueDateLbl]'
			}, {
				ref : 'valueDateBtn',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] button[itemId=valueDateBtn]'
			}, {
				ref : 'sortByCombo',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] combo[itemId="sortByCombo"]'
			}, {
				ref : 'firstThenSortByCombo',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] combo[itemId="firstThenSortByCombo"]'
			}, {
				ref : 'secondThenSortByCombo',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] combo[itemId="secondThenSortByCombo"]'
			}, {
				ref : 'amountTypeBtn',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] button[itemId=amountTypeBtn]'
			}, {
				ref : 'amountMenu',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] menu[itemId="amountMenu"]'
			}, {
				ref : 'amountLabel',
				selector : 'activityCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] label[itemId="amountLabel"]'
			}, {
				ref : 'savedFiltersToolBar',
				selector : 'accountActivityView accountActivityFilterView toolbar[itemId="advFilterActionToolBar"]'
			},/*Quick Filter starts...*/
			{
				ref:'entryDateBtn',
				selector:'accountActivityFilterView button[itemId="postingDateBtn"]'
			},{
				ref : 'dateLabel',
				selector : 'accountActivityFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'savedTypeCodeCombo',
				selector : 'accountActivityFilterView combo[itemId="savedTypeCodeCombo"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'accountActivityFilterView combo[itemId="savedFiltersCombo"]'
			},{
				ref : 'savedAccountsCombo',
				selector : 'accountActivityFilterView combo[itemId="savedAccountsCombo"]'
			},{
				ref : 'transactionCategoryEntryGridView',
				selector : 'transactionCategoryEntryGridView'
			},{
				ref : 'transactionCategoryGridView',
				selector : 'transactionCategoryGridView'
			},{
				ref : 'accountActivityGraph',
				selector : 'accountActivityGraph'
			}
			/*Quick Filter ends...*/],
	config : {
		txnFilterName : 'all',
		txnFilter : 'all',
		dateFilterVal : '1',
        dateRangeFilterVal : '13',
		dateFilterLabel : 'Selected Record Date',
		dateHandler : null,
		deletedCat : null,
		preferenceHandler : null,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		accountFilter : '',
		savedFilterVal:'',
		filterData : [],
		advTypeCode : [],
		datePickerSelectedDate : [],
		datePickerSelectedDateValue : [],
		typeCodePopup : null,
		identifier : null,
		summaryType : null,
		isFirstRequest : true,
		strActivitySummaryInfoUrl : 'services/btrActivities/'+summaryType+'/summarytypecodes.srvc',
		strSaveActivityNotesUrl : 'services/btrActivities/'+summaryType+'/updateActivitNotes.srvc',
		strModifySavedFilterUrl : 'services/userfilters/'+strActivityPageName+'/{0}.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/'+strActivityPageName+'.json',
		strGetSavedFilterUrl : 'services/userfilters/'+strActivityPageName+'/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/'+strActivityPageName+'/{0}/remove.json',
		record : [],
		txnDetailsPopup : null,
		checkImagePopup : null,
		txnNotesPopup : null,
		emailPopup : null,
		graphPanelPref:null,
		expandedWirePopup : null,

		filterCodeValue : null,
		objAdvFilterPopup : null,
		filterMode : '',
		advFilterData : [],
		advSortByData : [],
		filterApplied : 'ALL',
		advFilterCodeApplied : '',
		SearchOrSave : false,
		isSelectAccountCode:false,
		savePrefAdvFilterCode : null,

		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,

		pageKey : 'btrActivityViewPref',
		accountCalDate : null,
		expandedWireInfo19 : null,
		mapUrlDetails : {
			'strPrefferdTransactionCategories' : {
				moduleName : 'transactionCategories'
			},
			'strPrefferdTypeCodes' : {
				moduleName : 'summarytypecodes'
			}
		},
		strPageName : strActivityPageName,
		objActivityFilterPref : null,
		objActivityGridPref : null,
		objActivityPanelPref : null,
		selectedAccCcy : null,
		selectedAccSymbol : null,
		strServiceType : mapService['BR_STD_ACT_GRID'],
		strServiceParam : null,
		strActivityType : null,
		transactionCategoryStoreData : null,
		postingDateFilterVal : '',
		valueDateFilterVal:'',
		postingDateFilterLabel : getLabel('selectedRecordDate', 'Selected Record Date'),
		valueDateFilterLabel:getLabel('selectedRecordDate','Selected Record Date'),
		amountFilterVal : '',
		amountFilterLabel : getLabel('lessThanEqTo','Less Than Equal To'),
		firstLoad : false,
		preferencesChanged : false,
		typeCodeUrl : ''
	},
	init : function() {
		var me = this;
		me.updateConfig();
		me.createPopUps();
		me.firstLoad = true;
		me.populateSortByFields();
		$(document).on('addNotes', function(event,id,formdata,updatedNote,addedfile) {
			//var addedfilename= document.getElementsByName('noteFile')[0].files[0].name;
			me.doSaveCapturedRemark(id,formdata,updatedNote,addedfile);
		});
//		$(document).on('loadTypeCodeSetGrid', function(event) {
//			me.loadTypeCodeSetGrid();
//		});
		$(document).on('loadTypeCodeSetEntryGrid', function(event) {
			me.loadTypeCodeSetEntryGrid();
		});
		$(document).on('handleSavedTypeCodeFilterClick', function(event,index) {
			me.handleSavedTypeCodeFilterClick(index);
		});
		$(document).on('deleteTypeCodeFilterEvent', function(event, filterCode, filterCodeDesc) {
			me.doDeleteTransactionCategoryGridRecord(filterCode, filterCodeDesc);
		});
		$(document).on('doHandleSaveTypeCodeClick', function(event,txtFieldVal,strMode) {
			me.doHandleSaveTypeCodeClick(txtFieldVal,strMode);
		});
		$(document).on('deleteTransactionCategory', function(event, grid, rowIndex) {
					me.doDeleteTransactionCategory(grid, rowIndex);
				});
		$(document).on('transactionCategoryOrderChange', function(event, grid, rowIndex, intPosition,
						strDirection) {
			me.doTransactionCategoryOrderChange(grid, rowIndex, intPosition,
						strDirection);
		});
		$(document).on('viewTransactionCategory', function(event,grid,rowIndex) {
			me.doHandleViewTransactionCategory(grid,rowIndex);
		});
		$(document).on('searchActionClicked', function() {
			me.handleSearchAction(me);
		});
		$(document).on('saveAndSearchActionClicked', function() {
			me.handleSaveAndSearchAction(me);
		});
		$(document).on('performPageSettingsActivity', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		$(document).on('performBackActivity', function(event) {
					me.doHandleBackAction(me);
		});
		$(document).on('handleActivitySavedFilterClick', function(event) 
		{
					me.handleActivitySavedFilterClick();
		});
		$(document).on("datePickPopupSelectedDate",function(event,filterType,dates){
			if(filterType=="postingDate"){
				me.datePickerSelectedDate=dates;
				me.postingDateFilterVal = me.dateRangeFilterVal;
				me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
				me.handlePostingDateChange(me.dateRangeFilterVal);
				$('#activityDataPicker').val($('#postingDate').val());
				me.dateFilterVal ='13';
			}else if(filterType=="valueDate"){
				isValueDate = true;
				me.datePickerSelectedDateValue=dates;
				me.valueDateFilterVal = me.dateRangeFilterVal;
				me.valueDateFilterLabel = getLabel('daterange', 'Date Range');
				me.handleValueDateChange(me.dateRangeFilterVal);
			}
		});	
		$(document).on('editActivityFilterEvent', function(event, grid, rowIndex) {
			me.editFilterData(grid, rowIndex);
		});
		$(document).on('viewActivityFilterEvent', function(event, grid, rowIndex) {
			me.viewFilterData(grid, rowIndex);
		});
		$(document).on('clearPopup', function(event) {
			me.handleClearSettings();
		});
		/*$(document).on('deleteActivityFilterEvent', function(event, grid, rowIndex) {
			me.deleteFilterSet(grid, rowIndex);
		});*/
		$(document).on('deleteActivityFilterEvent', function(filter,filterCode) {
			
			me.deleteFilterSet(filterCode);
		});
		$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
			me.orderUpDown(grid, rowIndex, direction)
		});
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
			if(filterType == "postingDate"){
				 me.postingDateChange(btn,opts);
			 }else if(filterType == "valueDate"){
				 me.valueDateChange(btn,opts);
			 }
		});
		$(document).on('amountTypeChange',function(event, filterType, btn, opts) {		
			if(filterType == "amountField"){
				 me.amountTypeChange(btn,opts);
			 }
		});
		$(document).on('graphDivClicked',function() {		
			if(!$('#graghSummaryId').hasClass('ft-accordion-collapsed')){
				if(!Ext.isEmpty(accountGraphView))
					accountGraphView.doLayout();
			}				
		});
		$(document).on('showSelectedTypeCodeFilterPopup', function(event, selectedFilter) {
			me.doHandleShowSelectedFilter(selectedFilter);
		});
		
		$(document).on('performReportActionExpandedWire', function(event) {
					me.downloadExpandedWireReport();
		});
		
		$(document).on('resetAllFieldsEvent', function(event, bClearBtnClicked) {
			me.resetAllFields(bClearBtnClicked);
		});
		GCP.getApplication().on({
			/**
			 * strActivityType can be LATEST / ALL
			 */
			'showActivity' : function(record, strSummaryType, strActivityType) {
				blockUI();
				var strAppDate = dtSellerDate;
				selectedFilter = '';
				me.record = record;
				var dtFormat = strExtApplicationDateFormat;
				me.isFirstRequest = true;
				isActivityOn = true;
				isBalanceOn = false;
				$('#intraPrevDisclaimerText').addClass('ui-helper-hidden');
				$('#brsummarybackdiv').show();
				if( summaryType == 'intraday')
				{
					$('#brsummraytitle').html(getLabel('intradayAccountActivityTitle', 'Account / Account Summary / Intraday / Activities'));
				}
				else
				{
					$('#brsummraytitle').html(getLabel('previousdayAccountActivityTitle', 'Account / Account Summary / Previous Day / Activities'));
				}
				me.summaryType = strSummaryType;
				me.strActivityType = strActivityType;
				me.strServiceParam = record.data.subFacilityCode;
				serviceParam = record.data.subFacilityCode;
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePref, null, me, true);
				me.updateFilterConfig();// sets the preferred filter data
				me.updateAdvFilterConfig(); // sets the adv filter on adv filter
				// toolbar
				if(summaryType === 'intraday'){
					me.dateFilterLabel = getLabel('today', 'Today');
					me.dateFilterVal = '16';
				}
				if(summaryType === 'previousday'){
					if(!Ext.isEmpty(defaultFilterVal) && defaultFilterVal !== 'null'){
						me.dateFilterLabel = me.getDateFileterLabel(defaultFilterVal);
						me.dateFilterVal = defaultFilterVal;
					}
					else{
						me.dateFilterLabel = me.getDateFileterLabel('16');
						me.dateFilterVal = '16';
					}
				}
				else if (strActivityType === 'DATERANGE') {
					me.dateFilterLabel = getLabel('daterange', 'Date Range');
					me.dateFilterVal = '16';
				} else {
					me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
					me.dateFilterVal = defaultDateIndex;
				}
				me.firstLoad = true;
				me.accountFilter = record.data.accountId;
				me.accountCalDate = record.data.accountCalDate;
				me.summaryISODate = record.data.summaryISODate;
				dtSummaryPostingDate = record.data.summaryISODate;
				me.identifier = record.data.sessionNumber;
                sessionNum=record.data.sessionNumber;
				me.isHistoryFlag = record.data.isHistoryFlag;
				me.selectedAccCcy = record.data.currencyCode;
				me.selectedAccCcySymbol = record.data.currencySymbol;
				me.currentAccountNumber = record.data.accountNumber;
				me.currentBalance = record.data.currentBalance;
				if(!Ext.isEmpty(record.get('preSumFromDate')) && !Ext.isEmpty(record.get('preSumToDate')))
				{
					me.summaryISODate1 = record.get('preSumFromDate');
					me.summaryISODate2 = record.get('preSumToDate');
					
					var datePickerRef=$('#activityDataPicker');
					if (me.summaryISODate1 && me.summaryISODate2) {
						vFromDate = new Date(Ext.Date.parse(me.summaryISODate1, 'Y-m-d'));
						vToDate = new Date(Ext.Date.parse(me.summaryISODate2, 'Y-m-d'));
						datePickerRef.setDateRangePickerValue([
								vFromDate, vToDate]);
						if( summaryType == 'intraday')
						{
							me.datePickerSelectedDate =	[vFromDate];	
						}
						else{
							me.datePickerSelectedDate =	[vFromDate, vToDate];	
						}	
					}
					
					
				}
					
				if ($('#graphBar').hasClass('ui-helper-hidden'))
				{
					var blnIsGraphHidden = objClientParameters['enableGraph'] == true
						? false
						: true;
					if (blnIsGraphHidden === false)
					{
						$('#graphBar').removeClass('ui-helper-hidden');
						if(Ext.isEmpty(me.graphPanelPref)){
						   $('#graghSummaryId').removeClass("ft-accordion-collapsed");
						}
						me.loadActivityGraph();
					}
				}
				
				var container = me.getAccountCenter();
				if (!Ext.isEmpty(container)) {
					var activityView = Ext.create(
							'GCP.view.activity.AccountActivityView', {
								summaryType : me
										.getSummaryTypeVal(me.dateFilterVal),
								accountFilter : me.accountFilter,
								accCcySymbol : me.selectedAccCcySymbol,
								gridModel : me.getGridModel()

							});
					container.updateView(activityView);
					container.setActiveCard(1);
					GCP.getApplication().fireEvent(
							'handleTransactionInitiation', me.accountFilter,
							me.accountCalDate, me.identifier,
							me.selectedAccCcy, me.currentAccountNumber,
							me.currentBalance);
				}
				
				$('#accActivityLink').click(function(){
					if (!Ext.isEmpty(me.getFilterView()) && !Ext.isEmpty(me.getFilterView().up('filterView'))) {
						me.getFilterView().up('filterView').destroy();
					}
					if(!Ext.isEmpty(me.getAccountActivityGraph()))
						me.getAccountActivityGraph().destroy();
					GCP.getApplication().fireEvent('showSummary');
				});
				
				//Reports & Download dropdown code for balance	
				me.activityDownloadOptions();
				$(document).on('performActivityReportAction', function(event, actionName) {
					me.downloadReport(actionName);
					$('.ft-dropdown-menu').hide();
				});
				//me.getMoreFilterLink().hide();
									
				var objJsonData='', objLocalJsonData='';
					if (objActivityPref || objSaveActivityLocalStoragePref) {
						objJsonData = Ext.decode(objActivityPref);
						objLocalJsonData = Ext.decode(objSaveActivityLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									me.savePrefAdvFilterCode=objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = me.savePrefAdvFilterCode;
									var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
									savedFilterCombobox.setValue(me.savePrefAdvFilterCode);
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(me.savePrefAdvFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
								}
								else if (!Ext.isEmpty(objJsonData.d.preferences)) {
									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
											me.savePrefAdvFilterCode=objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
											me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
											me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
											var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
											savedFilterCombobox.setValue(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									}
								}
							}
							else if (!Ext.isEmpty(objJsonData.d.preferences)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									me.savePrefAdvFilterCode=objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
									savedFilterCombobox.setValue(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
								}
							}
						}						
					}
					unblockUI();
				
			},			
			'activitySavePreference' : function() {
				me.handleSavePreferences();
			},
			'activityClearPreference' : function() {
				me.handleClearPreferences();
			},
			'activityHandleClearSettings' : function() {
				me.handleClearSettings();
			},
			'activityCreateAdvanceFilterLabel': function() {
				me.filterCodeValue=null;
				showActivityAdvanceFilterPopup(me.filterCodeValue);
			}
		});
		me.control({
			'pageSettingPopUp[itemId="activitySetting"]' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					if(strSummaryType == "intraday")
					{
						me.preferencesChanged = true;
					}
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					if(strSummaryType == "intraday")
					{
						me.preferencesChanged = true;
					}

					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					if(strSummaryType == "intraday")
					{
						me.preferencesChanged = true;
					}

					me.restorePageSetting(data,strInvokedFrom);
				}
			},
			'accountActivityView' : {
				'render' : function(panel) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	
					me.populateSummaryAccountInfo();
					me.handleSummaryInformationRender(panel);
					me.populateActivityGraphTypecodeInfo();
				},
				'afterrender' : function() {
					objFilterPanelView = me.getAccountActivityView();
				}
			},
			'accountActivityFilterView' : {
				'render' : function(panel) {
					me.handleTransactionCategoryLoading();					
					//me.readAllAdvancedFilterCode();
				},
				'beforerender':function(){
					var filterViewRef = me.getFilterView().up('filterView');
					var useSettingsButton = filterViewRef
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				'afterrender' : function(tbar, opts) {
					/*If available in preference then get it*/
//					if (!Ext.isEmpty(me.objActivityFilterPref)){
//						me.dateFilterVal = me.objActivityFilterPref.dateFilterVal;
//						me.dateFilterLabel = me.objActivityFilterPref.dateFilterLabel;
//					}
					me.handleDateChange(me.dateFilterVal);
					/*var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
					if(me.savePrefAdvFilterCode)
					savedFilterCombobox.setValue(me.savePrefAdvFilterCode);*/
						var objLocalJsonData='';
					if (objSaveActivityLocalStoragePref) {
						objLocalJsonData = Ext.decode(objSaveActivityLocalStoragePref);
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
								}
							}
						}
					}
				},
				'handleSavedFilterItemClick':function(comboValue,comboDesc){
					me.doHandleSavedFilterItemClick(comboValue);
					selectedFilter=comboValue;
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				},
				'handleAccountItemClick':function(btn){
					me.doHandleAccountChange(btn);
				},
				'dateChange' : function(btn) {
					me.toggleFirstRequest(false);
					me.identifier = null;
					me.isHistoryFlag = null;
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.strActivityType = btn.btnValue === '12'
							? 'LATEST'
							: null;
					me.handleDateChange(me.dateFilterVal);
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();
						//me.toggleSavePrefrenceAction(true);
					}
				},
				/**
				 * strFilterType can be 'all' / 'latest'
				 */
				'informationFilterClick' : function(strFilterType) {
					me.handleInformationFilterChange(strFilterType);
				}
			},			
			'accountActivityFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					combo.getStore().on( 'load', function( store, records, options ) {
						//Check if saved filter from Preference is present in the list
					    if (!Ext.isEmpty(me.objActivityFilterPref)){
							var prefValuePresent=false;
							me.savedFilterVal = me.objActivityFilterPref.advFilterCode;
							if (!Ext.isEmpty(me.savedFilterVal)){
								var storeData = combo.getStore().data.items;
								for(var i = 0; i<storeData.length; i++){
									if(me.savedFilterVal==storeData[i].data.filterName){
										prefValuePresent=true;
										break;
									}
								}
							}
							if(prefValuePresent)
								combo.setValue(me.savedFilterVal);
							else
								me.savedFilterVal='';
						}
					});  	
				}
			},
			'accountActivityFilterView combo[itemId="savedAccountsCombo"]' : {			
				select:function(combo,record){
					var objDtl ={
							accountId : record[0].get('accountId'),
							accountNumber : record[0].get('accountNumber'),
							accountName : record[0].get('accountName'),
							accountCcy : record[0].get('accountCcy'),
							accountCcySymbol : record[0].get('accountCcySymbol'),
							accountCalDate : record[0].get('accountCalDate'),
							facilityDesc : record[0].get('facilityDesc')
					}
					ribbonAccInfo = objDtl;
					me.doHandleAccountChange(objDtl);
					me.isSelectAccountCode=true;
				},
				change:function(c,r){
					c.getStore().clearFilter();
					/*if(!Ext.isEmpty(c.getValue())){
						var storeAcctNumber,typedValue,storeAccName;
						c.getStore().filter([
						              {filterFn: function(item) {
						            	  storeAcctNumber=item.get("accountNumber").toString().toLowerCase();
										  typedValue=c.getValue().toString().toLowerCase();
										  storeAccName=item.get("accountName").toString().toLowerCase();
						            	   return (storeAcctNumber.indexOf(typedValue)>-1||storeAccName.indexOf(typedValue)>-1) }
						              }
						          ]);
					}*/
				},
				focus:function(c,r){
					c.getStore().clearFilter();
					c.expand();
				},
				/*keyup : function(combo, e, eOpts){
					me.isSelectAccountCode = false;
				},
				blur:function(c,r){
					if(!me.isSelectAccountCode){
						var objDtl ={
								accountId : me.savedTypeCodeVal.accountId,
								accountNumber : me.savedTypeCodeVal.accountNumber,
								accountName : me.savedTypeCodeVal.accountName,
								accountCcy : me.savedTypeCodeVal.accountCcy,
								accountCcySymbol :me.savedTypeCodeVal.accountCcySymbol,
								accountCalDate :me.savedTypeCodeVal.accountCalDate,
								facilityDesc : me.savedTypeCodeVal.facilityDesc
						}
						c.setValue(me.savedTypeCodeVal.accountNumber +' | '+me.savedTypeCodeVal.accountName);
						me.doHandleAccountChange(objDtl);
					}
					me.isSelectAccountCode = false;
				},*/
				
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					var storeData = combo.getStore().data.items;
					/*First we will check whether data is present in preference or not*/
					if (!Ext.isEmpty(me.accountFilter)){
						var accId = me.accountFilter;
						for(var i = 0; i<storeData.length; i++){
						/*Here we will check same data is present in store or not*/
							if(accId == storeData[i].data.accountId){ 
								/*If it is found then we assign to this variable*/
								me.savedTypeCodeVal = storeData[i].data;
								ribbonAccInfo = storeData[i].data;
								break;
							}
						}
					}
					else{ /*If data is not present in preferences then 
							we will assign default value to combo */
						me.savedTypeCodeVal = storeData[0].data; /* That is 'All' */
					}
					if(!Ext.isEmpty(me.savedTypeCodeVal.accountNumber))
						combo.setValue(me.savedTypeCodeVal.accountName +' | '+me.savedTypeCodeVal.accountNumber);
					else 
						combo.setValue(me.record.data.accountName +' | '+me.record.data.accountNumber);
				}
			},
			'accountActivityFilterView combo[itemId="savedTypeCodeCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					var storeData = combo.getStore().data.items;
					/*First we will check whether data is present in preference or not*/
					if (!Ext.isEmpty(me.objActivityFilterPref)){
						var accSetName = me.objActivityFilterPref.txnCatName;
						for(var i = 0; i<storeData.length; i++){
						/*Here we will check same data is present in store or not*/
							if(accSetName == storeData[i].data.btn.btnId){ 
								/*If it is found then we assign to this variable*/
								me.savedTypeCodeVal = storeData[i].data.btn; 
								break;
							}
						}
					}
					else{ /*If data is not present in preferences then 
							we will assign default value to combo */
						if (storeData.length>0)
						me.savedTypeCodeVal = storeData[0].data.btn.btnId; /* That is 'All' */
					}
					combo.setValue(me.savedTypeCodeVal);
				}
			},
			'accountActivityFilterView component[itemId="btrActivityDataPicker"]' : {
				render : function() {
					$('#activityDataPicker').datepick({
								monthsToShow : 1,
								changeMonth : false,
								dateFormat : strjQueryDatePickerDateFormat,
								minDate : dtHistoryDate,
								rangeSeparator : '  to  ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.toggleFirstRequest(false);
										me.datePickerSelectedDate = dates;
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleDateChange(me.dateRangeFilterVal);
										me.setDataForFilter();
										me.applyQuickFilter();
									//	me.toggleSavePrefrenceAction(true);
							if(me.dateFilterLabel === null)
											updateToolTip('postingDate');
				            	    	else
				            	    		updateToolTip('postingDate', me.dateFilterLabel );
									}
								},
								maxDate : !me.isIntraDay() == true ? me.getPreviousDate(dtSellerDate):dtSellerDate
					});
				}
			},
			'accountActivityFilterView label[itemId="createTypeCodeLabel"]' : {
				'click' : function() {
					var objField = me.getFilterView().down('combo[itemId="savedTypeCodeCombo"]');
					selectedFilter = objField.value.btnId;
				showTypeCodeSetPopup();
					//showAdvancedSettingPopup(me);
					/*if (!me.newAccountSetGridTab) {
						me.newAccountSetGridTab = Ext.create(
								'GCP.view.activity.TransactionCategoryPopUpView', {
									renderTo : 'tab2NewAccountSets',
									parent : me,
									width : 450
								});
					}

					if (!me.accountSetGridTab) {
						me.accountSetGridTab = Ext.create(
								'GCP.view.summary.AccountSetGridView', {
									accountSetStoreData : me.accountSets,
									renderTo : 'tab1AccountSets',
									parent : me
								});
					}*/
				}
			},		
			'accountActivityFilterView label[itemId="createAdvFilterLabel"]' : {
				'click' : function() {
					me.filterCodeValue=null;
					selectedFilter=me.savePrefAdvFilterCode;
					showActivityAdvanceFilterPopup();
				}
			},		
			/*'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showActivityAdvanceFilterPopup();
					
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},*/
			'accountActivityView summaryRibbonView' : {
				'render' : function(panel) {
					me.handleSummaryInformationRender(panel);
				},
				'saveSummaryTypeCodes' : function(arrTypeCodes) {
					me.doSaveSummaryTypeCodes(arrTypeCodes);
				},
				'accountChange' : function(btn) {
					me.toggleFirstRequest(false);
					me.doHandleAccountChange(btn);
				}
			},
			'transactionCategoryPopUpView[itemId="transactionCategoryPopUpView"]' : {
				'deleteTransactionCategory' : function(grid, rowIndex) {
					me.doDeleteTransactionCategory(grid, rowIndex);
				},
				'transactionCategoryOrderChange' : function(grid, rowIndex,
						intPosition, strDirection) {
					me.doTransactionCategoryOrderChange(grid);
				},
				'saveTransactionCategory' : function(grid, data) {
					me.doSaveTransactionCategory(grid, data);
				}
			},
			'remarkPopup[itemId="remarkPopup"]' : {
				'viewNoteFile' : function(record) {
					me.downloadNoteFile(record);
				}
			},
			'emailPopUpView[itemId="activityEmailPopUpView"]' : {
				'viewEmailAttachment' : function(record) {
					me.viewEmailAttachment(record);
				}
			},
			'accountActivityView groupView' : {
			//	'render' : me.handleLoadGridData,
				'groupTabChange' : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {
						me.toggleFirstRequest(false);		
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);

					},
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridRender' : me.handleLoadGridData,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				},
				'gridPageSizeChange': me.handleLoadGridData
			},
			'accountActivityView accountActivityTitleView' : {
				'performReportAction' : function(btn, opts) {
					me.downloadReport(btn.itemId);
				}
			},
			'accountActivityView accountActivityFilterView button[itemId="btnSavePreferences"]' : {
				'click' : function(btn, opts) {
					me.handleSavePreferences();
				}
			},
			'accountActivityView accountActivityFilterView button[itemId="btnClearPreferences"]' : {
				'click' : function(btn, opts) {
					me.handleClearPreferences();
				}
			},
			'tooltip[itemId="activityInfoToolTip"]' : {
				'beforeshow' : function(tip) {
					me.setInfoToolTipVal(tip);
				}
			},
			/*'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityAdvFilterGridView' : {
				orderUpEvent : me.orderUpDown,
				deleteFilterEvent : me.deleteFilterSet,
				viewFilterEvent : me.viewFilterData,
				editFilterEvent : me.editFilterData,
				filterSearchEvent : me.searchFilterData
			},
			'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] activityCreateNewAdvFilter[itemId="activityCreateNewAdvFilter"]' : {
				handleSearchAction : function(btn) {
					me.SearchOrSave = false;
					me.handleSearchAction(btn);
				},
				handleSaveAndSearchAction : function(btn) {
					me.SearchOrSave = true;
					me.handleSaveAndSearchAction(btn);
				},
				closeFilterPopup : function(btn) {
					me.closeFilterPopup(btn);
				},
				filterDateChange : function(btn, opts) {
					if (btn.parentMenu.itemId == "postingDateMenu")
						me.postingDateChange(btn, opts);
					else if (btn.parentMenu.itemId == "valueDateMenu")
						me.valueDateChange(btn, opts);
				},
				filterDateRange : function(cmp, newVal) {
					if (cmp.ownerCt.name == "postingDateRange")
						me.handlePostingDateChange(cmp.fieldIndex);
					else if (cmp.ownerCt.name == "valueDateRange")
						me.handleValueDateChange(cmp.fieldIndex);
				},
				sortByComboSelect : function(combo, record) {
					var selectedColumn = combo.getValue();
					if (!Ext.isEmpty(selectedColumn))
						me.filterOtherThenSortByComboStore(selectedColumn);
				},
				firstThenSortByComboSelect : function(combo, record) {
					var selectedColumn = combo.getValue();
					if (!Ext.isEmpty(selectedColumn))
						me.filterSecondThenSortByComboStore(selectedColumn);
				},
				amountTypeChange : function(btn, opts) {
					me.amountTypeChange(btn);
				}
			}*/
			'accountActivityGraph' : {
				'render' : function(panel) {
					me.loadGraphData();
				}
				}
		});
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objActivityView = me.getAccountActivityView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objActivityView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel
				}
                enableDisableSortIcon(me, gridModel, false);
			}
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					}, 
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
			}else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
				if(!Ext.isEmpty(arrPref[0].jsonPreferences.defaultFilterCode))
				{
					me.doHandleSavedFilterItemClick(arrPref[0].jsonPreferences.defaultFilterCode);
					me.savePrefAdvFilterCode = arrPref[0].jsonPreferences.defaultFilterCode;
						var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
									savedFilterCombobox.setValue(me.savePrefAdvFilterCode);
				}
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
	handleActivitySavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilterActivity").val() || selectedFilter;
        me.resetAllFields();
		me.filterCodeValue = null;
		$('#postingDate').val($('#activityDataPicker').val());
		updateToolTip('postingDate',me.postingDateFilterLabel);
		updateToolTip('valueDate',me.valueDateFilterLabel);
		/*if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
					'Posting Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		if (!Ext.isEmpty(me.valueDateFilterLabel)) {
			$('label[for="ValueDateLabel"]').text(getLabel('valueDate',
					'Value Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		updateToolTip('postingDate',me.dateFilterLabel);*/
		var dates=[];
		dates.push(new Date(Ext.Date.parse($('#activityDataPicker').val(), strExtApplicationDateFormat)))
		me.datePickerSelectedDate=dates;
		//me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}
		$("#msSavedFilterActivity option[value='" + savedFilterVal + "']").attr(
					"selected", true);
		$("#msSavedFilterActivity").multiselect("refresh");
		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBoxActivity']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
		{
			saveFilterChkBoxRef.prop('checked', true);
			markAdvFilterNameMandatory('saveFilterChkBoxActivity','advFilterNameLabel','filterCode');
		}			
		else
		{
			saveFilterChkBoxRef.prop('checked', false);
			markAdvFilterNameMandatory('saveFilterChkBoxActivity','advFilterNameLabel','filterCode');
		}
		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter, applyAdvFilter);
		hideErrorPanel("#advancedFltrErrorDiv");
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			var objGroupView = me.getGroupView();			
			var gridModel = null, objData = null;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
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
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountActivityView()) {
					objGroupView =me.getAccountActivityView().createGroupView();
					me.getAccountActivityView().add(objGroupView);		
				}
			}
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			
			selectedFilter = '';
			objSaveActivityLocalStoragePref = '';
			objActivityPref = '';
			me.advFilterData = [];
			me.filterData = [];
			me.txnFilter = 'all';
			me.txnFilterName = 'all';
			advTypeCode=[];
			me.savePrefAdvFilterCode = '';
			
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {				
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
			{
				//window.location.reload();
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountActivityView()) {
					objGroupView =me.getAccountActivityView().createGroupView();
					me.getAccountActivityView().add(objGroupView);
				}
			}				
		} else {
			Ext.MessageBox.show({
				title : getLabel('errorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		
		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objActivityPref)) {
			objPrefData = Ext.decode(objActivityPref);
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
					? me.getJsonObj(objPrefData.d.preferences.ColumnSetting.gridCols)
					: Ext.decode(me.getJsonObj(arrGenericActivityColumnModel) || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName+'.json';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = "{}";//objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					itemId : 'activitySetting',
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/* Page setting handling ends here */
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			me.resetQuickFilterView();

			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getFilterView();
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
								me.doHandleSavedFilterItemClick(filterCode);
							}
						}
					}
				}

				if (!filterPresentOnToolbar) {
					me.doHandleSavedFilterItemClick(filterCode);
				}

			}
		}
	},
	readAllAdvancedFilterCode : function() {
		var me = this;
		var filterView = me.getFilterView();
		Ext.Ajax.request({
					url : me.strReadAllAdvancedFilterCodeUrl,
					async : false,
					success : function(response) {
						var arrFilters = [];
						if (response && response.responseText) {
							var data = Ext.decode(response.responseText);
							if (data && data.d && data.d.filters) {
								arrFilters = data.d.filters;
							}
						}
						if (filterView)
							filterView.addAllSavedFilterCodeToView(arrFilters);
					},
					failure : function(response) {
						// console.log('Bad : Something went wrong with your
						// request');
					}
				});
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
			url : 'services/userpreferences/'+me.strPageName+'/advanceFilterPrefsOrder.json',
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
	updateAdvActionToolbar : function() {
		var me = this;
		var filterView = me.getFilterView();
		Ext.Ajax.request({
			url : 'services/userpreferences/'+me.strPageName+'/advanceFilterPrefsOrder.json',
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
	},
	deleteFilterSet : function(filterCode) {
		/*var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);
		me.filterCodeValue=null;
		
		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		var store = grid.getStore();*/
		
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
		if ( !Ext.isEmpty(filterCode) )
			objFilterName = filterCode;
		

		if (me.savePrefAdvFilterCode == objFilterName) 
		{
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox && me.savePrefAdvFilterCode == objFilterName) 
		{
			me.filterCodeValue = null;
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt( objComboStore.find( 'filterName' , objFilterName ));
			savedFilterCombobox.setValue('');
            me.advFilterData = [];
            me.advSortByData = [];
            enableDisableSortIcon(me, null, true);
		}
		
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
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
		$("#msSavedFilterActivity option").each(function() 
		{
					FiterArray.push($(this).val());
		});
		
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/'+me.strPageName+'/advanceFilterPrefsOrder.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) 
			{
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() 
			{}
		});
	},
	amountTypeChange : function(btn) {
		var me = this;
		me.amountFilterVal = btn.btnValue;
		me.amountFilterLabel = btn.text;
		
		if (!Ext.isEmpty(me.amountFilterLabel)) {
			amountOpLabel = getLabel('amount', 'Amount')+' ('+me.amountFilterLabel+")";
			
			$('label[for="AmountLabel"]').text(getLabel('amount',
					'Amount')
					+ " (" + me.amountFilterLabel + ")");
		}
		
		var operator = '';
		switch (btn.btnId) {
			case 'btnLt' :
				// Less Than
				operator = 'lt';
				break;
			case 'btnGt' :
				// Greater Than
				operator = 'gt';
				break;
			case 'btnEqTo' :
				// Equal To
				operator = 'eq';
				break;
			case 'btnAmtRange' :
				// AmountRange
				operator = 'range';
				break;
		}

		selectedAmountType={
					operator:operator			
				};
	},
	handleSearchAction : function(btn) {
		var me = this;
		var savedFilterComboBox = me.getSavedFiltersCombo();
		savedFilterComboBox.setValue($("#msSavedFilterActivity").val());
		me.savePrefAdvFilterCode = $("#msSavedFilterActivity").val();
		selectedFilter = $("#msSavedFilterActivity").val();
		me.doSearchOnly();
	},
	doSearchOnly : function() {
		var me = this;
		me.txnFilterName = $("#typeCodeSet option:selected").text();
		me.applyAdvancedFilter();
	},
	doHandleBackAction : function(btn) {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView()) && !Ext.isEmpty(me.getFilterView().up('filterView'))) {
						me.getFilterView().up('filterView').destroy();
					}
					if(!Ext.isEmpty(me.getAccountActivityGraph()))
						me.getAccountActivityGraph().destroy();					
					GCP.getApplication().fireEvent('showSummary');
					
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal=null;
		var FilterCode = $("#filterCode").val();
		if(Ext.isEmpty(FilterCode)){
			paintError('#advancedFltrErrorDiv','#advancedFilterErrMessage',getLabel('filternameMsg','Please Enter Filter Name'));
			return;
		}else{
			hideErrorPanel("advancedFltrErrorDiv");
			me.filterCodeValue=FilterCode;
			strFilterCodeVal=me.filterCodeValue;
			me.savePrefAdvFilterCode = me.filterCodeValue;
			selectedFilter = me.filterCodeValue;
			me.savedFilterVal = me.filterCodeValue;
		}

		if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFltrErrorDiv','#advancedFilterErrMessage',getLabel('filternameMsg','Please Enter Filter Name'));	
			return;	
		} else {
			hideErrorPanel("advancedFltrErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		}
		$('#activityAdvFilterPopup').dialog('close');
	},
	postDoSaveAndSearch : function() {
		var me = this;
		me.doSearchOnly();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
		strUrl += '?$mode=' + me.filterMode;
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
										buttonText: {
								            ok: getLabel('btnOk', 'OK')
											} ,
										cls : 'ux_popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#activityAdvFilterPopup').dialog('close');
							fncallBack.call(me);
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('errorPopUpTitle', 'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										} ,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getFilterView();
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
	updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox)) {
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			me.savePrefAdvFilterCode=me.savedFilterVal
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue = null;
		}
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	postingDateChange : function(btn, opts) {
		var me = this;
		me.postingDateFilterVal = btn.btnValue;
		me.postingDateFilterLabel = btn.text;
		postingDateOpLabel = getLabel('postingDate', 'Posting Date') + ' ('+ me.postingDateFilterLabel +")";
		me.handlePostingDateChange(btn.btnValue);
	},
	valueDateChange : function(btn, opts) {
		var me = this;
		me.valueDateFilterVal = btn.btnValue;
		me.valueDateFilterLabel = btn.text;
		valueDateOpLabel = getLabel('valueDate', 'Value Date') + ' ('+ me.valueDateFilterLabel +")";
		me.handleValueDateChange(btn.btnValue);
	},
	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
	postReadPanelPrefrences : function (data, args, isSuccess) {
		var me = this;
		if (data && data.preference) {	
			objPref = Ext.decode(data.preference);
			filterRibbonCollapsed = objPref.filterPanel;
			infoRibbonCollapsed = objPref.infoPanel;
			grafRibbonCollpased = objPref.grafPanel;
		}	
	},
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(me.objActivityFilterPref)) {
			var objJsonData = me.objActivityFilterPref;
			if (!Ext.isEmpty(objJsonData.advFilterCode)) {
				var advFilterCode = objJsonData.advFilterCode;
				if (!Ext.isEmpty(advFilterCode)) {
					me.savePrefAdvFilterCode=advFilterCode;
					me.doHandleSavedFilterItemClick(advFilterCode);
				}
			}
		}
		else
		{
			me.savePrefAdvFilterCode = '';
			me.advFilterData = [];
		}
	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#activityDataPicker');
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			if(summaryType == 'intraday'){
			me.getDateLabel().setText(getLabel('postingDate', 'Entry Date'));
			}
			else{
			me.getDateLabel().setText(getLabel('postingDate', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
			updateToolTip('postingDate',me.dateFilterLabel);			
			}			
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		if (index == '13') {
			if (me.summaryISODate) {
				vFromDate = new Date(Ext.Date.parse(me.summaryISODate, 'Y-m-d'));
				vToDate = vFromDate;
				datePickerRef.setDateRangePickerValue([
						vFromDate, vToDate]);
				me.summaryISODate = null;
			}
			else if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([
						vFromDate, vToDate]);
			}
		} else if (index == '16') {
			vFromDate = Ext.util.Format.date(Ext.Date.parse(dtSellerDate, strExtApplicationDateFormat),'Y-m-d');
			vToDate = vFromDate;
			datePickerRef.setDateRangePickerValue([
					vFromDate, vToDate]);
			if(summaryType ==='intraday'){
			me.summaryISODate = vFromDate;
			}
		} else {
				if (index === '1' || index === '2' || index === '12' || index === '14') {
						if (index === '12') {
							datePickerRef.val('Thru' + '  ' + vFromDate);
						} else{
							datePickerRef.setDateRangePickerValue(vFromDate);
						}	
				} else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				}
		}	
	},
	handleSummaryTypeChange : function(summaryType) {
		var me = this;
		if ('P' == summaryType) {
			me.getDateLabel().setText(getLabel('dateLabelYest',
					'Date (Yesterday)'));
			me.getPostingDate().show();
		} else {
			me.getDateLabel()
					.setText(getLabel('dateLabelToday', 'Date(Today)'));
			me.getPostingDate().hide();
		}
		me.toggleSummaryTypeVal(me.dateFilterVal);
	},
	getSummaryTypeVal : function(index) {
		return (index === '2' || index === '7') ? 'P' : 'I';
	},
	toggleSummaryTypeVal : function(index) {
		var me = this;
		var obj = me.getAccountActivityView();
		var strSummaryType = me.getSummaryTypeVal(index);
		if (obj)
			obj.summaryType = strSummaryType;
		if (strSummaryType === 'P')
			me.summaryType = 'previousday'
		else
			me.summaryType = 'intraday';
	},
	/**
	 * strFilterType can be 'all' / 'latest'
	 */
	handleInformationFilterChange : function(strFilterType) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		var fromDate = null;
		var toDate = null;
		var filterView = null;
		/**
		 * 7 : Date Range, 12 : Latest
		 */
		var strDateFilterValue = strFilterType === 'latest' ? '7' : '12';
		var strDateFilterLabel = strFilterType === 'latest' ? getLabel(
				'daterange', 'Date Range') : getLabel('latest', 'Latest');

		me.toggleFirstRequest(false);
		me.identifier = null;
		me.isHistoryFlag = null;
		me.dateFilterVal = strDateFilterValue;
		me.dateFilterLabel = strDateFilterLabel;
		me.handleDateChange(me.dateFilterVal);
		if (strDateFilterValue === '7') {
			fromDate = new Date(Ext.Date.parse(dtLastLogin, dtFormat));
			toDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
			if (!Ext.isEmpty(me.getFromEntryDate())) {
				me.getFromEntryDate().setMaxValue(fromDate);
				me.getFromEntryDate().setValue(fromDate);
				me.getFromEntryDate().setMinValue(clientFromDate);
			}
			if (!Ext.isEmpty(me.getToEntryDate())) {
				me.getToEntryDate().setMaxValue(toDate);
				me.getToEntryDate().setValue(toDate);
			}
		}
		if (strFilterType === 'all') {
			me.txnFilter = 'all';
			me.txnFilterName = 'all';
			filterView = me.getFilterView();
			if (filterView)
				filterView.doResetTransactionCategoryFilter();
		}

		me.setDataForFilter();
		me.applyQuickFilter();
		me.toggleSavePrefrenceAction(true);
	},
	getDateParam : function(index,type) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		if (!Ext.isEmpty(me.accountCalDate) && index === '2') {
			dtFormat = 'Y-m-d';
			strAppDate = me.accountCalDate;
		}
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat)), dtToDate = null;
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		if (!me.isIntraDay())
			dtToDate = objDateHandler.getYesterdayDate(date);
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(dtToDate, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				var noOfDays = dtJson.fromDate.getDay() - dtToDate.getDay();
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);				
				if(noOfDays == 1)					
					fieldValue1 =  Ext.Date.format(dtToDate, strSqlDateFormat);				
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate ,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate ,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				/*var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				frmDate = !Ext.isEmpty(frmDate)
						? frmDate
						: me.dateFilterFromVal;
				toDate = !Ext.isEmpty(toDate) ? toDate : me.dateFilterToVal;
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';*/
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarter(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
			case '15' :
				// Latest
				if (!me.isIntraDay())
					fieldValue1 = Ext.Date.format(dtToDate, strSqlDateFormat);
				else
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'le';
				break;
			case '13' :
				// Date Range
				if(type=='Value')
				{
					if (me.datePickerSelectedDateValue.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDateValue[0],strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					}else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDateValue[0],strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDateValue[1], strSqlDateFormat);
							operator = 'bt';
					}
				}
				else{
					 if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					}else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
							operator = 'bt';
					}
				}
				break;
				case '14' :
					if (!me.isIntraDay())
						dtJson = me.getLastXDays(dtToDate, xDaysVal);
					else
						dtJson = me.getLastXDays(date, xDaysVal);
				fieldValue1 = Ext.Date.format(dtJson, strSqlDateFormat);
				if (!me.isIntraDay())
					fieldValue2 = Ext.Date.format(dtToDate, strSqlDateFormat);
				else
					fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
				operator = 'bt';
				break;
			case '16' :
				// last 50
				if(brPrvSumLoad && !Ext.isEmpty(me.summaryISODate1) && !Ext.isEmpty(me.summaryISODate2))
				{
					if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					}else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
							operator = 'bt';
					}
				}
				else{
					fieldValue1 = me.summaryISODate == null ? dtSummaryPostingDate : me.summaryISODate;
					fieldValue2 = me.summaryISODate == null ? dtSummaryPostingDate : me.summaryISODate;
					operator = 'le';
				}
				break;
		 case '17' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
		}
		label = me.getDateFileterLabel(index);
		// comparing with client filter condition

		if (!me.isFirstRequest
				&& Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			if(!isValueDate)
				fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	/* -----------Transaction Category Pop Up handling starts here---------- */
	handleTransactionCategoryLoading : function() {
		var me = this;
		me.preferenceHandler
				.readModulePreferences(
						me.strPageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						me.postHandleTransactionCategoryLoading, null, me, true);
	},
	postHandleTransactionCategoryLoading : function(data, args, isSuccess) {
		var me = this;
		var arrItem = [];
		//var filterView = me.getFilterView();		
		//if (filterView)
		//	filterView.addTransactionCategories(arrData, me.txnFilterName);
		
		arrItem.push({
					text : getLabel('all', 'All'),
					btn : {
						btnId : getLabel('all', 'All'),
						typeCodeArray : 'all'
					}
				});
		
		var objWgtCt = me.getSavedTypeCodeCombo();

		if (!Ext.isEmpty(data)) {
			var jsonData = null;
			if (!Ext.isEmpty(data.preference))
				jsonData = JSON.parse(data.preference);

			if (null == jsonData)
				var count = 0;
			else
				var count = jsonData.length;

			if (count !== 0 && null == data.error) {
				var jsonData = JSON.parse(data.preference);
				me.accountSets = jsonData;

				for (var i = 0; i < count; i++) {
					if(!Ext.isEmpty(jsonData[i])
							&& !Ext.isEmpty(jsonData[i].txnCategory)){
						var accSetName = jsonData[i].txnCategory;
						var accSetCount = jsonData[i].typeCodes.length;
						var accSetArray = jsonData[i].typeCodes;
						var strcls = '';
	
						if (this.accountFilterName === accSetName) {
							strcls = 'xn-custom-heighlight';
						} else {
							strcls = 'cursor_pointer xn-account-filter-btnmenu';
						}
						arrItem.push({
							text : accSetName + "(" + accSetCount + ")",
							btn : {
								btnId : accSetName,
								typeCodeArray : accSetArray
							}
						});
					}
				}
			}
		}
		if(!Ext.isEmpty(arrItem))
			objWgtCt.getStore().loadData(arrItem);

		
		// This addListener has been added here because there is a bug in ExtJS
		// 4 that suspendEvents does not work for the listeners added in the
		// controllers.
//		if (!objWgtCt.hasListener('select')) {
		objWgtCt.addListener('select', function(combo, newValue, oldValue,eOpts) {
			var me = this;
			me.comboChanged = true;
			me.disablePreferencesButton("savePrefMenuBtn", false);
			me.disablePreferencesButton("clearPrefMenuBtn", false);
			me.doHandleTransactionCategoryFilterClick(combo.getValue());
		}, me);
//		}
		//test
	},
	doHandleTransactionCategoryFilterClick : function(btn) {
		var me = this;
		if (!Ext.isEmpty(btn.typeCodeArray) && btn.typeCodeArray != 'undefined') {
			me.txnFilter = btn.typeCodeArray;
			me.txnFilterName = btn.btnId;
			advTypeCode=[];
			me.filterApplied = 'Q';
			me.toggleSavePrefrenceAction(false);
			me.identifier = null;
			me.isHistoryFlag = null;
			if(btn.btnId === 'All'){
				$('#typeCodeTextField').val('');
				$("#btnTypeSave button").text( getLabel('save','Save') );
			}
			me.setDataForFilter();
			me.applyQuickFilter();
		}
	},
	doDeleteTransactionCategory : function(grid, rowIndex) {
		var me = this;
		var store = grid.getStore();
		var preferenceArray = [];
		var args = {
			//'grid' : grid
		};
		if (store) {
			deletedCat = store.getAt(rowIndex);
			deletedCat = deletedCat.get('txnCategory');
			store.remove(store.getAt(rowIndex));
		}
		if (rowIndex == 0 || rowIndex == 1) {
			me.accSetChangeFlag = true;
		}

		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						preferenceArray.push(rec.raw);
					});
		}
		args['data'] = preferenceArray;
		me.preferenceHandler
				.saveModulePreferences(
						me.strPageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleDoDeleteTransactionCategory, args, me,
						false);
	},
	postHandleDoDeleteTransactionCategory : function(data, args, isSuccess) {
		var me = this;
		//var grid = args['grid'];
		var objGroupView=me.getGroupView();
	//	var objActGrid = me.getActivityGrid();
		var filterView = me.getFilterView();
		if (filterView) {
			if (me.getTxnFilterName() == deletedCat) {
				me.setTxnFilter('all');
				me.setTxnFilterName('all');
				me
						.getBtnAllCats()
						.addCls('cursor_pointer xn-account-filter-btnmenu xn-custom-heighlight');
			}
			//filterView.addTransactionCategories(args['data'], me.txnFilterName);
			//filterView.refreshTransactionCategories();
			me.handleTransactionCategoryLoading();
		}
		if (objGroupView)
			objGroupView.refreshData();
	},
	doTransactionCategoryOrderChange : function(grid) {
		var me = this;
		var store = grid.getStore();
		var preferenceArray = [];
		var args = {
			'grid' : grid
		};
		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						preferenceArray.push(rec.raw);
					});
		}
		args['data'] = preferenceArray;
		me.preferenceHandler
				.saveModulePreferences(
						me.strPageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleTransactionCategoryChange, args, me, false);
	},
	postHandleTransactionCategoryChange : function(data, args, isSuccess) {
		var me = this;
		//var grid = args['grid'];
		var filterView = me.getFilterView();
		if (filterView) {
			//filterView.addTransactionCategories(args['data'], me.txnFilterName);
		}
	},
	doSaveTransactionCategory : function(savedTypecodeSets, record) {
		var me = this;
		//var store = grid.getStore();
		var preferenceArray = [];
		var isRecordAdded = false;
		var args = {
			//'grid' : grid
		};
		if (!Ext.isEmpty(savedTypecodeSets)) {
			savedTypecodeSets.forEach(function(rec) {
						if (record.txnCategory === rec.txnCategory) {
							isRecordAdded = true;
							preferenceArray.push(record);
						} else
							preferenceArray.push(rec);
					});
		}
		if (!isRecordAdded)
			preferenceArray.push(record);

		args['data'] = preferenceArray;
		me.preferenceHandler
				.saveModulePreferences(
						me.strPageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleTransactionCategoryChange, args, me, false);
	},
	/* -----------Transaction Category Pop Up handling ends here---------- */
	/* -----------Summary Ribbon handling starts here---------- */
	handleSummaryInformationRender : function() {
		var me = this;
		//summary not rendering properly incase of it is collapsed from other screen.
		if ($('#btrSummaryListId').hasClass('ft-accordion-collapsed'))						
		{
			$("#btrSummaryListId").removeClass('ft-accordion-collapsed');
		}
		var typeCodeUrl = '';
		if(me.preferencesChanged)
		{
			typeCodeUrl = me.typeCodeUrl;
			me.preferencesChanged = false;
		}
		else
		{
			typeCodeUrl = me.generateTypeCodeUrl();
			me.typeCodeUrl = typeCodeUrl;
		}
		me.populateSummaryInformationView(typeCodeUrl, false);
	},
	populateSummaryInformationView : function(url, updateFlag) {
		var me = this;
		var model = null; 
		var eqCcy = me.selectedAccCcySymbol;
		currencysymbol = me.selectedAccCcySymbol;
		typeCodesCcy = eqCcy;
		var objMap = {};
			if( objDefPref['ACTIVITY']['RIBBON'][serviceParam] == undefined )	
			{
				if(objDefPref['ACTIVITY']['RIBBON']['BR_RIBBON_GENERIC'] != undefined)
				model = objDefPref['ACTIVITY']['RIBBON']['BR_RIBBON_GENERIC']['columnModel'];
			}
			else
			{
				model = objDefPref['ACTIVITY']['RIBBON'][serviceParam]['columnModel'] || objDefPref['ACTIVITY']['RIBBON']['BR_RIBBON_GENERIC']['columnModel'];
			}
		Ext.Ajax.request({
					url : url,
					method : 'POST',
					params : {
						$identifier: !Ext.isEmpty(me.identifier) ? me.identifier : ''						
					},
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = me.getTypeCodeJsonObj(data.d.summary);
							typeCodes= summaryData;

							$('#activitySummaryPopup #AccountActivityTypeCodeSummary #LblAccountSummary').text("Account Information : ");
							$('#activitySummaryPopup #AccountActivityTypeCodeSummary #RibAccName').text(ribbonAccInfo.accountName+",");
							$('#activitySummaryPopup #AccountActivityTypeCodeSummary #RibAccCurr').text(ribbonAccInfo.accountCcy);
							$('#activitySummaryPopup #AccountActivityTypeCodeSummary #RibAccType').text(ribbonAccInfo.facilityDesc+",");
							$('#activitySummaryPopup #AccountActivityTypeCodeSummary #RibAccNo').text(ribbonAccInfo.accountNumber);
							$('#summaryCarousalActivityTargetDiv').html($('#activitySummaryPopup').html());
							
							if (typeCodes.length > 2)
								$('#activityMoreinfo').removeClass('hidden');
							else
								$('#activityMoreinfo').addClass('hidden');
							
							jQuery.each(summaryData, function(i, val) {
								objMap[(val || {}).typeCode] = val;
							});
							
							jQuery.each( model, function( i, cfg ) {
								var val = (objMap[cfg.colId] || {});
								var sign = val.typeCodeAmount?val.typeCodeAmount<0?-1:1:0
								typeCodesSign = sign;
								var amount = '';
								if (val.dataType === 'count')
								{
									amount = val.typeCodeAmount;
								}
								else
								{
									if(sign !== 0){
										if (val.dataType === 'count')
											amount = (sign==1?val.typeCodeAmount : val.typeCodeAmount);
										else
											amount = (sign==1?eqCcy+''+val.typeCodeAmount : eqCcy + val.typeCodeAmount);
									}
								}
								if(i ==0){
									$('#typeCode0').text(val.typeCodeDescription);
									if(sign !== 0 && typeof val.typeCodeDescription !=='undefined')
										$('#typeCodeAmount0').text(amount);$('#typeCodeAmount0').prop('title', amount); 
								}else if(i ==1){
									$('#typeCode1').text(val.typeCodeDescription);
									if(sign !== 0 && typeof val.typeCodeDescription !=='undefined')
										$('#typeCodeAmount1').text(amount);$('#typeCodeAmount1').prop('title', amount); 
								}else if(i==2){
									$('#typeCode2').text(val.typeCodeDescription);
									if(sign !== 0 && typeof val.typeCodeDescription !=='undefined')
										$('#typeCodeAmount2').text(amount);$('#typeCodeAmount2').prop('title', amount); 
								}
							});
						}
					},
					failure : function(response) {
					}
				});
	},
	generateTypeCodeUrl : function() {
		var me = this;
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		var strSqlDateFormat = 'Y-m-d';
		if (!Ext.isEmpty(me.accountCalDate) && me.dateFilterVal === '2') {
			dtFormat = 'Y-m-d';
			strAppDate = me.accountCalDate;
		}
		var parsedDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		var fromDate = objDateParams.fieldValue1;
		var toDate = objDateParams.fieldValue2;
		var typeCodeUrl =me.strActivitySummaryInfoUrl ;

		typeCodeUrl += '?&$accountID=' + me.accountFilter;
		typeCodeUrl += '&$activityFromDate=' + fromDate;
		typeCodeUrl += '&$activityToDate=' + toDate;	
			
		typeCodeUrl += '&$summaryType=' + strSummaryType;
		/*typeCodeUrl += '&$summaryType=' + me.isHistoryFlag;*/
		typeCodeUrl += '&$accountCurrency=' + me.selectedAccCcy;

		if (!Ext.isEmpty(objDefPref['ACTIVITY']['RIBBON'][me.strServiceParam])) {
			typeCodeUrl += '&$serviceType='
					+ objDefPref['ACTIVITY']['RIBBON'][me.strServiceParam]['serviceType'];
			typeCodeUrl += '&$serviceParam='
					+ objDefPref['ACTIVITY']['RIBBON'][me.strServiceParam]['serviceParam'];
		} else {
			typeCodeUrl += '&$serviceType=' + mapService['BR_STD_ACT_RIBBON'];
			typeCodeUrl += '&$serviceParam=' + mapService['BR_RIBBON_GENERIC'];
		}
		typeCodeUrl += '&$pageName='+me.strPageName;
		typeCodeUrl += '&$moduleName=SUBFAC0301NewUX';
		typeCodeUrl += '&' + csrfTokenName + '=' + csrfTokenValue ;
		return typeCodeUrl;

	},
	isIntraDay : function() {
		var retValue = false;
		var me = this;
		if (!Ext.isEmpty(me.summaryType) && me.summaryType === 'intraday')
			retValue = true;
		return retValue;
	},
	doSaveSummaryTypeCodes : function(arrTypeCode) {
		var me = this;
		var jsonPost = {};
		jsonPost['typeCodes'] = arrTypeCode || [];
		me.preferenceHandler.saveModulePreferences('btrActivitySummaryNewUX',
				me.strServiceParam, jsonPost,
				me.postHandleDoSaveSummaryTypeCodes, null, me, false);
	},
	postHandleDoSaveSummaryTypeCodes : function(data, args, isSuccess) {
		var me = this;
		me.handleSummaryInformationRender();
	},
	/* -----------Summary Ribbon handling starts here---------- */
	setDataForFilter : function() {
		var me = this;
		me.advFilterData = {};
		if (me.filterApplied === 'Q' || me.filterApplied === 'ALL') {
			var objJson = !Ext.isEmpty(me.advFilterData) ? me.advFilterData : getAdvancedFilterQueryJson();
			me.filterData = me.getQuickFilterQueryJson();
			var reqJson = me.findInQuickFilterData(me.filterData, "typeCode");
			if (!Ext.isEmpty(reqJson)) {
				var arrAdvJson = me.removeFromAdvanceArrJson(objJson, "typeCode");
			}	
			me.advFilterData = arrAdvJson;
			me.advSortByData = [];
			
		} else if (me.filterApplied === 'A') {
			
			var objJson = getAdvancedFilterQueryJson();
			me.filterData = me.getQuickFilterQueryJson();
			var reqJson = me.findInAdvFilterData(objJson, "typeCode");
			if (!Ext.isEmpty(reqJson)) {
				me.filterData = me.removeFromQuickArrJson(me.filterData, "typeCode");
			}
			me.advFilterData = objJson;
			var sortByData=getAdvancedFilterSortByJson();
			if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
				me.advSortByData = sortByData;
			} else {
				me.advSortByData = [];
			}
			objJson = objJson.filter(function(a){ return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy") });

			for(var i=0; i<sortByData.length; i++){
				objJson.push(sortByData[i]);
			}
			me.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='filterCode']").val();
			me.advFilterCodeApplied = filterCode;
			var objField = me.getFilterView().down('combo[itemId="savedTypeCodeCombo"]');
			if(!Ext.isEmpty(objField)){
				var comboBox = me.getSavedTypeCodeCombo();						
				comboBox.setValue(me.txnFilterName);
			}
		}
	},
	getJsonObj : function(jsonObject) {
        var jsonObj ='';
        if(jsonObject  instanceof Object ==false)
               jsonObj =JSON.parse(jsonObject);
        if(jsonObject  instanceof Array)
               jsonObj =jsonObject;
        for (var i = 0; i < jsonObj.length; i++) {
               jsonObj[i].colDesc =  getLabel(jsonObj[i].colId,jsonObj[i].colDesc);
               jsonObj[i].colHeader =  getLabel(jsonObj[i].colId,jsonObj[i].colHeader);;
        }
        if(jsonObject  instanceof Object ==false)
               jsonObj = JSON.stringify(jsonObj)
        return jsonObj;
  },
	getTypeCodeJsonObj : function(jsonObject) {
		var jsonObj ='';
		if(jsonObject  instanceof Object ==false)
			jsonObj =JSON.parse(jsonObject);
		if(jsonObject  instanceof Array)
			jsonObj =jsonObject;
		for (var i = 0; i < jsonObj.length; i++) {
			jsonObj[i].typeCodeDescription =  getLabel(jsonObj[i].typeCode,jsonObj[i].typeCodeDescription);
		}
		if(jsonObject  instanceof Object ==false)
			jsonObj = JSON.stringify(jsonObj)
		return jsonObj;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		// For Intraday activity, date filter should not applied
		// if (me.dateFilterVal != 1)
			jsonArray.push({
						paramName : 'date',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('postingDate', 'Date'),
						dateIndex : objDateParams.dateIndex
					});
		if (!Ext.isEmpty(me.txnFilter) && me.txnFilter != 'all') {
			jsonArray.push({
					paramName : 'typeCode',
					paramValue1 : encodeURIComponent(me.txnFilter.toString().replace(new RegExp("'", 'g'), "\''")),
					paramValue2 : me.txnFilterName,
					operatorValue : 'eq',
					dataType : 'S',
					paramFieldLable : getLabel('savedtypecodeset', 'Type Code Set'),
					displayType : 5,
					displayValue1 : me.txnFilterName,
					valueArray : me.txnFilter
					});
		}
		if (!Ext.isEmpty(me.accountFilter) && me.accountFilter != '') {
			jsonArray.push({
						paramName : 'accountId',
						paramIsMandatory : true,
						paramValue1 : me.accountFilter,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('accounts','Accounts'),
						displayType : 5,
						displayValue1 : me.currentAccountNumber
					});
		}
		return jsonArray;
	},
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		advTypeCode = [];

		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
			 if(filterData[index].field=='typeCode' || filterData[index].field =='typeCodeText'){
					advTypeCode.push(filterData[index].value1);
			 }
			 else{
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
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						if (objValue != 'All') {
							if (isFilterApplied) {
								strTemp = strTemp + ' and ';
							} else {
								isFilterApplied = true;
							}
							/*	strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ objValue + '\''; */				
							
							
							if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + objValue
									+ '\'';
							} else {
								strTemp = strTemp + filterData[index].field + ' '
										+ filterData[index].operator + ' ' + '\''
										+ objValue + '\'';
							}
							
							isFilterApplied = true;
						}
						break;
					case 'gt' :
					case 'lt' :
						/*if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}*/
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
					case 'gte' :
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'eq' + ' ' + '\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'gt' + ' ' + '\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ')';
						break;
					case 'lte' :
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'eq' + ' ' + '\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'lt' + ' ' + '\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ')';
						break;
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
									strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}

								strTemp = strTemp + '(';
								for (var i = 0; i < objArray.length; i++) {
									strTemp = strTemp + filterData[index].field
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
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';

		return strFilter;
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		me.loadGraphData();
		me.handleSummaryInformationRender();		
		me.refreshData();
	},
	applyAdvancedFilter : function() {
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.refreshData();
		me.loadGraphData();
        enableDisableSortIcon(me, null, true);
		//me.getActivityGrid().refreshData();
		//resetAllFields();
	},
	handleAdvanceFilterCleanUp : function() {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		if (!Ext.isEmpty(objCreateNewFilterPanel)) {
			objCreateNewFilterPanel.resetErrors(objCreateNewFilterPanel);
			objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
			objCreateNewFilterPanel.enableDisableFields(
					objCreateNewFilterPanel, false);
			objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
					false);
		}
	},
	resetQuickFilterView : function() {
		var me = this;
		me.getDateRangeComponent().hide();
		me.getFromDateLabel().setText(getDateIndexLabel(defaultDateIndex));
		me.getToDateLabel().setText("");
		me.getDateLabel().setText(getLabel('date', 'Date') + "("
				+ getDateIndexLabel(defaultDateIndex) + ")");
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.ribbonDateLbl = null;
		me.ribbonFromDate = null;
		me.ribbonToDate = null;
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.SearchOrSave = true;
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
			var objOfCreateNewFilter = me.getCreateNewFilter();
			me.handleFieldSync();
		}
		me.savePrefAdvFilterCode = filterCode;
		me.savedFilterVal = filterCode;
	},
	handleFieldSync : function(){
		var me = this;
		var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
		var postingDateField = $("#postingDate");
		me.handlePostingDateSync('A', postingDateLableVal, null, postingDateField);
	},
	handlePostingDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		//me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="PostingDateLabel"]')
				: me.getDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#postingDate')
				: $('#activityDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('postingDate', sourceToolTipText);
				//selectedEntryDate = {};
			} else {
				labelToChange.setText(sourceLable);
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue=null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		
/*		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		*/
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter, 'VIEW');
		changeAdvancedFltrTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.filterMode = 'EDIT';
		me.resetAllFields();
		me.filterCodeValue=null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		
		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		var applyAdvFilter = false;

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, me.populateSavedFilter,
				applyAdvFilter, 'EDIT');
		changeAdvancedFltrTab(1);
	},
	resetAllFields : function()  {
		var me = this;
		var d1 = new Date(Ext.Date.parse(dtSummaryPostingDate, 'Y-m-d'));
		var postingDate = Ext.Date.format(d1, strExtApplicationDateFormat);	
		var postingDateLabel="";
		if(summaryType == 'previousday')
		{
			postingDateLabel = getLabel('postingDate', 'Posting Date')+' ('+getLabel('selectedRecordDate', 'Selected Record Date')+')';
		}
		else
		{
			postingDateLabel = getLabel('postingDate', 'Posting Date');
		}
		updateToolTip('postingDate',getLabel('selectedRecordDate', 'Selected Record Date'));
		$("input[type='checkbox'][id='debitCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='creditCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='postedTxnsCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='expectedTxnsCheckBox']").prop('checked',
				false);	
		$("#hasImageCheckBox").prop('checked',false);
		$("#hasAttachmentCheckBox").prop('checked',false);
		var amountlabel=getLabel('amount', 'Amount')+' ('+getLabel('equalTo','Equal To')+')';
		$('label[for="AmountLabel"]').text(amountlabel);		
		$('#typeCodeSet').val('all');
		$('#typeCode').val("");
		$("input[type='text'][id='amountField']").val("");
		selectedAmountType={};
		$("input[type='text'][id='notes']").val("");
		if(summaryType == 'previousday')
		{	selectedPostingDate={};
			$('#postingDate').val(postingDate);			
		}
		selectedValueDate={};
		$('#valueDate').val("");
		$("#typeCode").val("");
		$("#msSortBy1").val("");
		$('#msSortBy2 option').remove();
		$("#msSortBy2").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$('#msSortBy3 option').remove();
		$("#msSortBy3").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
		$("input[type='text'][id='filterCode']").val("");
		$("input[type='text'][id='filterCode']").prop('disabled', false);
		if(summaryType == 'previousday')		
		me.postingDateFilterVal = '16';
		me.postingDateFilterLabel =  getDateDropDownLabesl(me.postingDateFilterVal);
		selectedValueDate={};
		$('#valueDate').val("");		
		$('label[for="ValueDateLabel"]').text(getLabel('valueDate', 'Value Date'));
		$("input[type='text'][id='bankReference']").val("");
		$("input[type='text'][id='customerReference']").val("");
		me.advTypeCode=[];
		$("#msSortBy1").niceSelect('update');
		$("#msSortBy2").niceSelect('update');
		$("#msSortBy3").niceSelect('update');
		$("#typeCodeSet").niceSelect('update');
		$('#bankReference').val("");
		$('#customerReference').val("");		
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);		
		resetAllMenuItemsInMultiSelect("#accTyp");
		resetAllMenuItemsInMultiSelect("#accAutoComp");	
		//me.filterCodeValue = null;	
		me.txnFilter='';
		selectedFilter = '';
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter, mode) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var valueDatePresent = false;
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		selectedFilter=filterCode;
		
		var amountlabel=getLabel('amount', 'Amount')+' ('+getLabel('equalTo','Equal To')+")";
		$('label[for="AmountLabel"]').text(amountlabel);
		$("input[type='text'][id='amountField']").val("");
		selectedAmountType={};

		me.getSavedTypeCodeCombo().setValue('');
		$("#typeCodeSet").val('');
		$("#typeCodeSet").niceSelect('update');
		me.txnFilterName = fieldSecondVal;
		me.txnFilter = decodeURIComponent(fieldVal).split(',');
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if (fieldName === 'debitFlag') {
				$("#debitCheckBox").prop('checked', fieldVal === 'N' ? false : true );
			} else if (fieldName === 'creditFlag') {
				$("#creditCheckBox").prop('checked', fieldVal === 'N' ? false : true );
			}else if(fieldName === 'hasImageFlag')
			{
				$('#hasImageCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'hasAttachmentFlag')
			{
				$('#hasAttachmentCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			} else if (fieldName === 'typeCodeText') {
				$("#typeCode").val(decodeURIComponent(fieldVal));
			} else if (fieldName === 'typeCode') {
				$("#typeCodeSet").val(decodeURIComponent(fieldVal));
				$("#typeCodeSet").niceSelect('update');
				me.txnFilterName = fieldSecondVal;
				me.txnFilter = decodeURIComponent(fieldVal).split(',');
				//Also set on Quick filter Typecode Set
				
				if(!Ext.isEmpty(fieldSecondVal)){
					me.getSavedTypeCodeCombo().setValue(fieldSecondVal);
				}	
			} else if (fieldName === 'amount') {
				$("#amountField").val(fieldVal);
				selectedAmountType.operator = operatorValue;
				var amtLabel = operatorValue === 'lt' ? 'Less Than' : operatorValue === 'gt' ? 'Greater Than' : 'Equal To';
				$('label[for="AmountLabel"]').text(getLabel('amount','Amount') + " (" + amtLabel + ")");
				amountOpLabel = getLabel('amount','Amount') + " (" + amtLabel + ")";
			} else if (fieldName === 'postingDate') {
				selectedPostingDate.operator = operatorValue;
				selectedPostingDate.fromDate = new Date(fieldVal),
				selectedPostingDate.toDate = Ext.isEmpty(fieldSecondVal) ? '' : new Date(fieldSecondVal);
				var dates=[];
				dates[0]=selectedPostingDate.fromDate;
				selectedPostingDate.dateIndex = filterData.filterBy[i].dateIndex;
				var lblDate = getDateDropDownLabesl(selectedPostingDate.dateIndex);
				selectedPostingDate.dateLabel = lblDate;
				me.postingDateFilterLabel = selectedPostingDate.dateLabel ;
				postingDateOpLabel = getLabel('postingDate', 'Posting Date') + ' ('+ lblDate+")";
				$('label[for="PostingDateLabel"]').text(postingDateOpLabel)
				if(Ext.isEmpty(fieldSecondVal))
				{
				    me.datePickerSelectedDate=dates;
					me.postingDateFilterVal = me.dateRangeFilterVal;
					me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
					me.handlePostingDateChange(me.dateRangeFilterVal);
					$('#activityDataPicker').val($('#postingDate').val());
					me.dateFilterVal ='13';
				}
				else
				{
					dates[1]=selectedPostingDate.toDate;
				me.datePickerSelectedDate=dates;
				$('#postingDate').setDateRangePickerValue([selectedPostingDate.fromDate, selectedPostingDate.toDate]);
				$('#activityDataPicker').setDateRangePickerValue([selectedPostingDate.fromDate, selectedPostingDate.toDate]);
				me.getDateLabel().setText(postingDateOpLabel)
				}
				me.handlePostingDateChange(selectedPostingDate.dateIndex)
			} else if (fieldName === 'selectedValueDate' || fieldName === 'valueDate') {
				valueDatePresent = true;
				selectedValueDate.operator = operatorValue;
				selectedValueDate.fromDate = new Date(fieldVal),
				selectedValueDate.toDate = Ext.isEmpty(fieldSecondVal) ? '' : new Date(fieldSecondVal);
				selectedValueDate.dateIndex = filterData.filterBy[i].dateIndex;
				var lblDate = getDateDropDownLabesl(selectedValueDate.dateIndex);
				selectedValueDate.dateLabel = lblDate;
				me.valueDateFilterLabel = selectedValueDate.dateLabel ;
				valueDateOpLabel = getLabel('valueDate', 'Value Date') + ' ('+ lblDate+")";
				$('label[for="ValueDateLabel"]').text(valueDateOpLabel)
				$('#valueDate').setDateRangePickerValue([selectedValueDate.fromDate, selectedValueDate.toDate]);
				me.handleValueDateChange(selectedValueDate.dateIndex);
			}
			else if (fieldName === 'bankReference') {
				$("#bankReference").val(fieldVal);
			}
			else if (fieldName === 'customerReference') {
				$("#customerReference").val(fieldVal);
			}
			else if (fieldName === 'noteText') {
				$("#notes").val(fieldVal);
			}
			else if (fieldName === 'SortBy' || fieldName === 'FirstThenSortBy'	|| fieldName === 'SecondThenSortBy') {
				columnId = fieldVal;
				sortByOption = fieldSecondVal;
				buttonText = getLabel("ascending", "Ascending");
				if (sortByOption !== 'asc')
					buttonText = getLabel("descending", "Descending");
				me.setSortByComboFields(fieldName, columnId, buttonText, true);
			}
			else if (fieldName === 'debitCreditFlag')
			{
				fieldVal  = fieldVal.replace(/%20/g, ' ');
				fieldVal = fieldVal.replace(/%2C/g, ',');
				var array = fieldVal.split(',');

				for (var cnt = 0; cnt < array.length; cnt++) {
					var arrVal = array[cnt];
					arrVal = arrVal.replace(/^\s*/, "").replace(/\s*$/, "");
					if (arrVal == 'D')
					{
						$("#debitCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}else if (arrVal == 'C')
					{
						$("#creditCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}
				}
			}
		}
		if(!valueDatePresent)
			$('#valueDate').val("");
		$("#msSavedFilterActivity option[value='" + selectedFilter + "']").attr(
					"selected", true);
		$("#msSavedFilterActivity").multiselect("refresh");
		if (applyAdvFilter)
			me.applyAdvancedFilter();

	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter, mode) {
		var me = this;
		var objJson;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						if (!Ext.isEmpty(response.responseText)) {
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
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										} ,
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	doHandleAccountChange : function(btn) {
		var me = this;
		var activityView = me.getAccountActivityView();
        me.identifier = sessionNum;
        me.isHistoryFlag = null;
		if (me.dateFilterVal === '7')
			me.toggleFirstRequest(true);
		else
			me.toggleFirstRequest(true);
		me.accountCalDate = btn.accountCalDate;
		//me.handleDateChange(me.dateFilterVal);
		me.accountFilter = btn.accountId;
		me.currentAccountNumber = btn.accountNumber;
		me.selectedAccCcy = btn.accountCcy;
		me.selectedAccCcySymbol = btn.accountCcySymbol;
		me.setDataForFilter();
		me.applyQuickFilter();
		var combo= me.getSavedAccountsCombo();
		combo.setRawValue(btn.accountName+' | '+btn.accountNumber);
		if (activityView) {
			activityView.accCcySymbol = me.selectedAccCcySymbol;
		}
		me.toggleFirstRequest(false);
	},
	loadGraphData : function() {
		var me = this;
		var arrayJson = new Array(), arrGraphData = [];
		var objDateParams = me.getDateParam(me.dateFilterVal) || {};
		var graph = me.getAccountActivityGraph();
		var objJson = {
			fromDate : objDateParams.fieldValue1,
			toDate : objDateParams.fieldValue2,
			accountId : me.accountFilter,
			identifier : (me.identifier || ''),
			typeCode : '',
			summaryType : '',
			serviceParam : me.strServiceParam,
			filterUrl : ''
		};
		// TODO : Handle latest activity
		if (me.strActivityType === 'LATEST' || me.dateFilterVal === '12') {
			objJson.fromDate = null;
			objJson.toDate = null;
			objJson.identifier = null;
		}
		if (!Ext.isEmpty(me.isHistoryFlag))
			objJson.summaryType = me.isHistoryFlag;

		if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all') {
			objJson['typeCode'] = (me.txnFilter).join();
		}
		if(me.filterApplied=='A'){
			var strAdvancedFilterUrl = me
						.generateUrlWithAdvancedFilterParams(false);
			objJson.filterUrl = strAdvancedFilterUrl;
		}
		arrayJson.push(objJson);
		if (graph) {
			graph.loadGraph(arrayJson);
			accountGraphView = graph;
		}
	},
	handleDateChangeCustom : function(index,vFrom,vTo) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#activityDataPicker');
				
		var vFromDate = Ext.Date.parse(vFrom, 'Y-m-d');
		var vToDate = Ext.Date.parse(vTo, 'Y-m-d');
		datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
		 	
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var activityView = me.getAccountActivityView();
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});
		if(summaryType === 'previousday'){
			filterObj = me.getDateParam(defaultFilterVal);
		}
		var objLocalJsonData = '';
		if (objSaveActivityLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveActivityLocalStoragePref);
						
		var intPageNo = objLocalJsonData.d && objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageNo
				? objLocalJsonData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		me.firstLoad = false;
		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		strUrl += this.generateFilterUrl();
		strUrl += '&$accountID=' + me.accountFilter;
		strUrl += '&$accountNo=' + me.currentAccountNumber;
		
		if(!Ext.isEmpty(me.summaryISODate) && defaultFilterVal === '' && summaryType === 'previousday'){
			strUrl += '&$activityFromDate=' + me.summaryISODate;
			strUrl += '&$activityToDate=' + me.summaryISODate;
			me.handleDateChangeCustom(me.dateRangeFilterVal,me.summaryISODate,me.summaryISODate);
		}
		else if(!Ext.isEmpty(dtObj.fieldValue1) && !Ext.isEmpty(dtObj.fieldValue2)){
			strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
			strUrl += '&$activityToDate=' + dtObj.fieldValue2;
			me.handleDateChangeCustom(me.dateRangeFilterVal,dtObj.fieldValue1,dtObj.fieldValue2);
		}
		if(!Ext.isEmpty(me.summaryISODate) && summaryType === 'intraday'){
			strUrl += '&$activityFromDate=' + me.summaryISODate;
			strUrl += '&$activityToDate=' + me.summaryISODate;
			me.handleDateChangeCustom(me.dateRangeFilterVal,me.summaryISODate,me.summaryISODate);
		}
		else if(!Ext.isEmpty(dtObj.fieldValue1) && !Ext.isEmpty(dtObj.fieldValue1)){
			strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
			strUrl += '&$activityToDate=' + dtObj.fieldValue2;
			me.handleDateChangeCustom(me.dateRangeFilterVal,dtObj.fieldValue1,dtObj.fieldValue2);
		}
		if (!Ext.isEmpty(me.identifier))
			strUrl += '&$identifier=' + me.identifier;
		
		strUrl += '&$serviceType=' + me.strServiceType;
		strUrl += '&$serviceParam=' + me.strServiceParam;

		/*if (!Ext.isEmpty(me.isHistoryFlag))*/
			strUrl += '&$summaryType=' + strSummaryType;
		if(!Ext.isEmpty(advTypeCode)&& !Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all'){
			strUrl += '&$typeCode=' + (me.txnFilter).join()+","+advTypeCode.join();  //Both quick+adv type code 
		}else if(!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all'){
			strUrl += '&$typeCode=' + (me.txnFilter).join();  //Only quick type code 
		}else if(!Ext.isEmpty(advTypeCode))
			strUrl += '&$typeCode=' + (advTypeCode).join();  //adv type code
		if(!Ext.isEmpty(selectedClient)){
			strUrl += '&$client=' + selectedClient;
		}
		
		strUrl = strUrl + '&' + csrfTokenName + "=" + csrfTokenValue;
		
		me.filterData = me.getQuickFilterQueryJson();
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				var quickFlag=false;
				var advFlag=false;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
				'date');
					if (!Ext.isEmpty(reqJsonInQuick)) {
						quickFlag=true;
					}
				if(!Ext.Object.isEmpty(me.advFilterData)){
					var reqJsonInAdv = me.findInAdvFilterData(me.advFilterData, 'postingDate');
					if (!Ext.isEmpty(reqJsonInAdv)) {
						advFlag=true;
						$("#activityDataPicker").val(reqJsonInAdv.value1 + " to " + reqJsonInAdv.value2);
					}
				}
				if(quickFlag == true && advFlag == true){
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'date');
					quickJsonData = arrQuickJson;
				}
						
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}

		if (!Ext.Object.isEmpty(me.advFilterData)) {
			var advJsonData = (me.advFilterData).map(function(v) {
				  return  v;
				});
			//remove sort by fields
			advJsonData = advJsonData.filter(function(a){ return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy" )});
			
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(advJsonData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
				
			if (arrOfFilteredApplied)
				me.getGenericFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
		
		if (activityView)
			activityView.setLoading(true);
		grid.loadGridData(strUrl, me.handleTransactionInitiationVisibility,
				null, false, me);
				
		grid.on('cellclick', function(dataView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = dataView.getGridColumns()[cellIndex];
			var columnId = clickedColumn.itemId;			
			me.handleGridRowClick(record, grid, columnId);
		});
		
		if (isSaveLocalPreference)
			me.handleSaveLocalStorage();
	},
	handleGridRowClick : function(record, grid, columnId) {
		if(columnId && columnId !== 'col_actioncontent' && columnId !== 'col_favorite' && columnId !== 'col_checkboxColumn') {
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
			me.doHandleRowIconClick(grid, null,null,arrVisibleActions[0].itemId, record);		
							}
	}		
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '',strAdvanceSortByFilterUrl ='', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL' || me.filterApplied === 'Q') {
			// strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			// if (!Ext.isEmpty(strQuickFilterUrl)) {
			// strUrl += '&$filter=' + strQuickFilterUrl;
			// isFilterApplied = true;
			// }
		} else if (me.filterApplied === 'A') {
			strAdvancedFilterUrl = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				var tempUrl = strAdvancedFilterUrl.trim();
				var substrUrl = tempUrl.substring(0,9);
				if (Ext.isEmpty(strUrl) && substrUrl != "&$orderby") {
					strUrl = "&$filter=";
				}
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
			}
		}
		return strUrl;
	},
	getGridModel : function() {
		var me = this;
		var gridCols = null;
		var gridModel = null;
		var model = null;
		if (typeof me.objActivityGridPref != 'undefined'
				&& !Ext.isEmpty(me.objActivityGridPref)
				&& 'null' !== me.objActivityGridPref)
			gridModel = me.objActivityGridPref;

		if (!Ext.isEmpty(objDefPref['ACTIVITY']['GRID'][me.strServiceParam]))
			model = objDefPref['ACTIVITY']['GRID'][me.strServiceParam]['columnModel'];
		gridModel = gridModel || {
			"pgSize" : 10,
			"gridCols" : model
					|| objDefPref['ACTIVITY']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel']
		};
		return gridModel;
	},
	doHandleRowIconClick : function(grid, rowIndex, columnIndex, strActionName,
			record) {
		var me = this;
		var actionName = strActionName;
		var recId = record.get('identifier');
		if (actionName === 'notes' || actionName === 'notesAttached') {
			me.captureRemark(record);
		} else if (actionName === 'txnDetails') {
			/*me.txnDetailsPopup.recordId = recId;
			me.txnDetailsPopup.currentAccountNumber = me.currentAccountNumber;
			me.txnDetailsPopup.record = record;
			me.txnDetailsPopup.selectedAccCcy = me.selectedAccCcy;
			me.txnDetailsPopup.accSubFacility = me.strServiceParam;
			me.txnDetailsPopup.show();*/
			showTxnDetailsPopup(record,me.currentAccountNumber,me.strServiceParam);
		} else if (actionName === 'eStatement') {
			showEstatementInfoPopup(record);
		} else if (actionName === 'email') {
			/*me.emailPopup = Ext.create(
					'GCP.view.activity.popup.EmailPopUpView', {
						itemId : 'activityEmailPopUpView',
						record : record,
						parent : me.getActivityGrid()
					});
			me.emailPopup.show();*/
			showEmailPopUp(record);
		} else if (actionName === 'check') {
			//me.checkImagePopup.record = record;
			//me.checkImagePopup.show();
			/*showCheckImagePopup(record);*/
			me.showCheckImage(record, 'F');
		} else if (actionName === 'expandedWire') {
			me.expandedWirePopup.record = record;
			me.expandedWirePopup.showExpandedWirePopup(record);
			me.expandedWireInfo19 = record.data.info19;
		}
	},
	
	showCheckImage : function( record, side )
	{
		var me = this;
		if(daejaViewONESupport)
		{
			me.showCheckImageDaejaViewONE(record, side);
		}
		else
		{
			me.showCheckImageJqueryPopup(record, side);
		}
	},
	
	showCheckImageDaejaViewONE : function( record, side )
	{
		$.blockUI({
			overlayCSS : {
				opacity : 0.5
			},
			baseZ : 2000,
			message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css:{ }
		});
		var me = this;
		var id = record.get('identifier');
		
		var strUrl = 'services/btrActivities/'+summaryType+'/displayChequeImage.srvc?$isDaejaViewer=Y&'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + Ext.encode(id) +
		'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
		'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
		'&$side=' + side;
		
		if(document.getElementById("viewONE"))
		{
			document.getElementById("viewONE").closeDocument();
			document.getElementById("viewONE").setView(3);
			document.getElementById("viewONE").openFile(strUrl, 1);
			
		}
		else
		{
			addViewer('chkImageDiv', strUrl);
		}
		$( '#chkImageDiv' ).dialog(
		{
			autoOpen : false,
			height : "800",
			modal : true,
			resizable : true,
			width : "1000",
			title : getLabel('image', 'Image'),
			position: 'center',
			buttons : [{
					text : "Close",
					"class": 'pull-left ft-button-light',
					click : function()
					{
						$( this ).dialog( "close" );
					}
			}],
			close: function( event, ui ) {
				$.unblockUI();
			},
			open: function( event, ui ) {
				$.unblockUI();
    		}
		} );
		$( '#chkImageDiv' ).dialog( 'open' );
	},
	
	showCheckImageJqueryPopup : function(record, side)
	{
		$.blockUI({
			overlayCSS : {
				opacity : 0.5
			},
			baseZ : 2000,
			message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css:{ }});
		var me = this;
		var id = record.get('identifier');
		
		var strUrl = 'services/btrActivities/'+summaryType+'/displayChequeImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + id +
		'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
		'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
		'&$side=' + side;
		
		$.ajax(
		{
			type : 'POST',
			url : strUrl,
			dataType : 'html',
			success : function( data )
			{
				if(data.length!=0)
			   {
				$.unblockUI();

				var jsonData = Ext.decode(data);

				if(jsonData.FrontImage)
				{
					$( '#chkImageDiv' ).html( '<img src="data:image/jpeg;base64,' + jsonData.FrontImage + '"/>' );
					modelBytes = 'Front';
				}

				$( '#chkImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "700",
					modal : true,
					resizable : true,
					width : "1200",
					zIndex: '29001',				
					title : getLabel('image', 'Image'),
					buttons : 
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						},
						
							"Flip Over" : function()
							{
								if(modelBytes=='Front'){
									//$( this ).dialog( "close" );
									//me.showCheckImage(record,'B');
									//$( '#chkImageDiv' ).html( '<img src="data:image/jpeg;base64,' + jsonData.BackImage + '"/>' );
									$( '#chkImageDiv' ).html( '<img src="data:image/jpeg;base64,' + jsonData.BackImage + '"/>' );
									 modelBytes = 'Back';
								 }
								 else
								 {
									 //$( this ).dialog( "close" );
									//me.showCheckImage(record,'F');
									 $( '#chkImageDiv' ).html( '<img src="data:image/jpeg;base64,' + jsonData.FrontImage + '"/>' );
									 modelBytes = 'Front';
								 }
							},
							"Print" : function()
							{
								/*var strFrontUrl = 'services/btrActivities/'+summaryType+'/displayChequeImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + Ext.encode(id) +
								'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
								'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
								'&$side=F';
								strBackUrl = 'services/btrActivities/'+summaryType+'/displayChequeImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+ '&identifier=' + Ext.encode(id) +
								'&$hostImageKey='+ record.get('hostImageKey') + '&$checkDepositeNo='+ record.get('customerRefNo') +'&$summaryType=' + summaryType + '&$accountId=' + record.get('accountId') +
								'&$sessionNo=' + record.get('sessionNumber') + '&$sequenceNo=' + record.get('sequenceNumber') +
								'&$side=B'; */
								//printFrontImage(strFrontUrl,strBackUrl);
								printFrontImage(jsonData.FrontImage, jsonData.BackImage);
							}
						},
						open : function()
						{
							$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
							.css('background-color','#FFF').css('margin-right','10px').css('border','1px solid #4a4a4a');
							$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
							.css('background-color','#FFF').css('margin-right','10px').css('border','1px solid #4a4a4a');
							$('.ui-dialog-buttonpane').find('button:contains("Close")').css('float','left');
							$('.ui-dialog-buttonpane').find('button:contains("Print")').css('float','right');
							$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('float','right');
							//$('.ui-dialog-buttonpane').find('button:contains("Close")').focus();
							//$('.ui-dialog-buttonpane').find('button:contains("Close")').attr('tabindex','1');
							//$('.ui-dialog-buttonpane').find('button:contains("Print")').attr('tabindex','1');
							//$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').attr('tabindex','1').attr('onkeydown','autoFocusOnFirstElement(event, "instrumentImageDiv", false);');								
						}
				} );

				$( '#dialogMode' ).val( '1' );
				$( '#chkImageDiv' ).dialog( 'open' );
			   }
				else
					{
					 $.unblockUI();
						$( '#chkImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
						$( '#chkImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							minHeight : "300",
							modal : true,
							resizable : true,
							width : "300",
							zIndex: '29001',				
							title : getLabel('image', 'Image'),
							/*buttons : 
							{
								"Close" : function()
								{
									$( this ).dialog( "close" );
								}
							}*/
							buttons : [{
								text : "Close",
								id   :"btnClose",
								tabIndex :"1",
								"class": 'pull-left ft-button-light',
								click : function()
								{
									$( this ).dialog( "close" );
								},
								keydown : function()
								{
									restrictTabKey(event);
							}
						}]
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#chkImageDiv' ).dialog( 'open' );
					}
			},
			error : function( request, status, error )
			{
				$.unblockUI();
				$( '#chkImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
				$( '#chkImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					minHeight : "300",
					modal : true,
					resizable : true,
					width : "300",
					zIndex: '29001',				
					title : getLabel('image', 'Image'),
					buttons : 
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
				$( '#dialogMode' ).val( '1' );
				$( '#chkImageDiv' ).dialog( 'open' );
			}
		} );
	},
	
	captureRemark : function(record) {
		/*var me = this;
		popup = Ext.create('GCP.view.activity.popup.RemarkPopup', {
					record : record,
					strRemark : record.get('noteText') || '',
					strAction : (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename'))) 
							? 'ADD'
							: 'VIEW'
				});
		popup.show();
		popup.on('addNotes', function(formdata,updatedNote,addedfile) {
					me.doSaveCapturedRemark(record, formdata,updatedNote,addedfile);
				});*/
		recordVal = record;
		var strRemark = record.get('noteText') || '' ; 
		var strAction = (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename'))) ? 'ADD' : 'VIEW';
		var id = record.get('identifier');
		strNoteFilename = record.get('noteFilename');
		var noteFilePath = strNoteFilename.split('\\');
		if(noteFilePath.length > 1)
			strNoteFilename = noteFilePath[(noteFilePath.length - 1)];
			
		showRemarksPopup(strRemark,strAction,strNoteFilename,id);
		
	},
	downloadNoteFile : function(record) {
		var me = this;
		var isError = false;
		
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
				record.get('identifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'noteFilename',
				record.get('noteFilename')));
		form.action = 'services/btrActivities/'+summaryType+'/downloadNoteFile';
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
		
	},
	/*viewEmailAttachment : function(record) {
		var me = this;
		var strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
		strValue = me.getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));	
		reportType = record.get('isHistoryFlag');		
		if (!Ext.isEmpty(strValue)) {
			if (strValue.indexOf("-") == 0) {
				txnType = 'Debit';
			} else {
				txnType = 'Credit';
			}
		} else  {
			txnType = 'Credit';
		}
	//download txn details report
	var strUrl = 'services/activities/generateReport.pdf?';
	strUrl += '$expand=txndetails';
	strUrl += '&$accountID=' + record.get('accountId');
	strUrl += '&$accountNmbr=' + record.get('accountNo');
	strUrl += '&$sequenceNmbr=' + record.get('sequenceNumber');
	strUrl += '&$sequenceNmbr=' + record.get('sessionNumber');
	strUrl += '&$reportType=' + reportType; // TODO
	strUrl += '&$txnType=' + txnType; 
	strUrl += '&$remApplicable=' + remApplicable; // TODO
							
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN',
	csrfTokenName, tokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);							
	},*/
	doSaveCapturedRemark : function(id,formdata,updatedNote,addedfile) {
		$.blockUI({
			overlayCSS : {
				opacity : 0.5
			},
			baseZ : 2000,
			message: '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css:{ }
		});
		var me = this;
		var isError = false;
		var activityGrid = me.getActivityGrid();
		if (activityGrid)
			activityGrid.setLoading(true);
		var rec = recordVal;			
		formdata.append("identifier",rec.get('identifier'));
		$.ajax({
					url : me.strSaveActivityNotesUrl + '?' + csrfTokenName + '=' + csrfTokenValue ,
					type : 'POST',
					processData : false,
					contentType : false,
					data : formdata,
					complete : function(XMLHttpRequest, textStatus) {
					//if ("error" == textStatus) {
						// TODO : Error handling to be done.
						// alert("Unable to complete your request!");
					//}
					$.unblockUI();
					},
					success : function(response) {
						$.unblockUI();
						if (response && response['success'] == 'Y') {
							me.refreshData();
							
							Ext.MessageBox.show({
								title : getLabel('saveActivityNotesSuccessPopUpTitle',
										'Message'),
								msg : getLabel('saveActivityNotesSuccessPopUpMsg',
										'Notes saved successfully..!'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									} ,
								cls : 't7-popup',
								icon : Ext.MessageBox.INFO
							});
							
							if (activityGrid)
								activityGrid.setLoading(false);
							
								if (rec) {
									rec.beginEdit();
									rec.set({
												noteText : updatedNote,
												noteFilename : addedfile
											});
									rec.endEdit();
									rec.commit();
								}
							
						}else {
								Ext.MessageBox.show({
				title : getLabel('saveActivityNotesErrorPopUpTitle', 'Message'),
				msg : response.errors[0],
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
			if (activityGrid)
								activityGrid.setLoading(false);
							}
					},
					failure : function() {
						$.unblockUI();
						Ext.MessageBox.show({
				title : getLabel('saveActivityNotesErrorPopUpTitle', 'Message'),
				msg : getLabel('saveActivityNotesErrorPopUpMsg',
						'Error while saving data..!'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
							cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
			if (activityGrid)
								activityGrid.setLoading(false);
					}
				});
		
	},

	createPopUps : function() {
		var me = this;
		if (Ext.isEmpty(me.txnNotesPopup)) {
			me.txnNotesPopup = Ext.create(
					'GCP.view.activity.popup.NotesPopUpView', {
						itemId : 'activityNotesPopUpView'
					});
		}
		/*if (Ext.isEmpty(me.txnDetailsPopup)) {
			me.txnDetailsPopup = Ext.create(
					'GCP.view.activity.popup.TxnDetailsPopUp', {
						itemId : 'activityTxnDetailsPopUp'
					});
		}
		if (Ext.isEmpty(me.checkImagePopup)) {
			me.checkImagePopup = Ext.create(
					'GCP.view.activity.popup.CheckPopUp', {
						itemId : 'activityCheckPopUp'
					});
		}*/

		if (Ext.isEmpty(me.expandedWirePopup)) {
			me.expandedWirePopup = Ext.create(
					'GCP.view.activity.popup.ExpandedWirePopup', {
						itemId : 'activityExpandedWirePopup'
					});
		}

	},
	/** **************** download report ********************* */
	downloadReport : function(actionName) {
		var me = this;
		var calledFrom = 'I';
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});		
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		//var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var withHeaderFlag = $("#headerCheckbox").is(':checked');
		var includeSummaryPDFFlag = document.getElementById("includeSummaryPDFReportCheckbox").checked;
		var includeSummaryExportFlag = document.getElementById("includeSummaryExportReportCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadMt950 : 'mt950',
			downloadMt942 : 'mt942',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken'
		};
		var currentPage = 0;
		var strExtension = '';
		var strUrl = '';
		var arrColumn = new Array();
		var strSelect = '';

		strExtension = arrExtension[actionName];
		if (strExtension && grid) {
			strUrl = 'services/btrActivities/'+summaryType+'/generateReport.' + strExtension;
			strUrl = grid.generateUrl(strUrl, grid.pageSize, grid
							.getCurrentPage(), grid.getCurrentPage(),
					grid.store.sorters);
			strUrl += this.generateFilterUrl();
			strUrl += '&$accountID=' + me.accountFilter;
			strUrl += '&$serviceType=' + me.strServiceType;
			strUrl += '&$serviceParam=' + me.strServiceParam;
			if ( me.strActivityType !== 'LATEST'){
				if ( me.dateFilterVal !== '12') {
					if(me.isHistoryFlag !== 'H' && me.isHistoryFlag != null){
						strUrl += '&$activityFromDate=' + me.summaryISODate;
						strUrl += '&$activityToDate=' + me.summaryISODate;
						me.handleDateChangeCustom(me.dateRangeFilterVal,me.summaryISODate,me.summaryISODate);
					}
					else if(!Ext.isEmpty(dtObj.fieldValue1) && !Ext.isEmpty(dtObj.fieldValue1)){
						strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
						strUrl += '&$activityToDate=' + dtObj.fieldValue2;
						me.handleDateChangeCustom(me.dateRangeFilterVal,dtObj.fieldValue1,dtObj.fieldValue2);
					}
					if (!Ext.isEmpty(me.identifier))
						strUrl += '&$identifier=' + me.identifier;
				}
			}

			if(summaryType === 'previousday')
				calledFrom = 'P';
				strUrl += '&$summaryType=' + calledFrom;
			if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all'){
				strUrl += '&$typeCode=' + (me.txnFilter).join();}
			else if(!Ext.isEmpty(advTypeCode))
				strUrl += '&$typeCode=' + (advTypeCode).join();
			if (grid) {
				if (withHeaderFlag) {
					arrColumn = grid.getAllVisibleColumns();
				} else {
					arrColumn = grid.getAllColumns();
				}
				currentPage = grid.getCurrentPage();
				arrColumn = grid.getAllVisibleColumns(); // Fixed for JIRA ID : DHGCP441-610
			}
			if (arrColumn) {
				var col = null;
				var colArray = new Array();
				for (var i = 0; i < arrColumn.length; i++) {
					col = arrColumn[i];
					if (col.dataIndex
							&& arrDownloadReportActivityColumn[col.dataIndex])
						colArray
								.push(arrDownloadReportActivityColumn[col.dataIndex]);
				}
				if (colArray.length > 0)
					strSelect = '&$select=[' + colArray.toString() + ']';
			}

			if(strExtension === 'bai2'){
				var col = null;
				var colArray = new Array();
				if(!Ext.isEmpty(typeCodes)){
					for (var i = 0; i < typeCodes.length; i++) {
						col = typeCodes[i];
						colArray.push(col.typeCode);
					}
					if (colArray.length > 0)
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
					key, decodeURIComponent(objParam[key])));
			});
			
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCurrent', currentPage));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCSVFlag', withHeaderFlag));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'includeSummaryPDFFlag',
					includeSummaryPDFFlag));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'includeSummaryExportFlag',
					includeSummaryExportFlag));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}

	},
	downloadExpandedWireReport : function(actionName){
		var me = this;
		var calledFrom = 'I';
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});		
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var currentPage = 0;
		var strExtension = '';
		var strUrl = '';
		var arrColumn = new Array();
		var strSelect = '';

		if (grid) {
			strUrl = 'services/btrActivities/'+summaryType+'/generateExpandedWireReport';
			strUrl = grid.generateUrl(strUrl, grid.pageSize, grid
							.getCurrentPage(), grid.getCurrentPage(),
					grid.store.sorters);
			strUrl += '&$recKeyNo=' + me.expandedWireInfo19;
			strUrl += '&$accountID=' + me.accountFilter;
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
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}

	
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	/** **************** download report end********************* */

	/* ********************** Preferences Handling start **************** */
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
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
		var arrPref = [], objFilterPref = null, grid = null, gridState = null;
		var infoPanelCollapsed = false, graphPanelCollapsed = false;
		
		// Summary Information Panel
		var summaryInfoPanel = $('#btrSummaryListId');
		if(summaryInfoPanel.hasClass('ft-accordion-collapsed'))
			infoPanelCollapsed = true;
		
		// Graph Panel
		var graphPanel = $('#graghSummaryId');
//		if(graphPanel.hasClass('ft-accordion-collapsed'))
//			graphPanelCollapsed = true;
		
		objFilterPref = me.getFilterPreferences();
		var groupView = me.getGroupView();
		var state = groupView.getGroupViewState();
		arrPref.push({
					"module" : "activityFilterPref",
					"jsonPreferences" : objFilterPref
				});
		arrPref.push({
					"module" : me.strServiceParam,
					"jsonPreferences" : {
						'gridCols' : state.grid.columns,
						'pgSize' : state.grid.pageSize,
						'sortState':state.grid.sortState,
						'gridSetting' : state.gridSetting
					}
				});		
		arrPref.push({
					"module" : "panels",
					"jsonPreferences" : {
						'infoPanel' : infoPanelCollapsed,
						'graphPanel' : graphPanelCollapsed
					}
				});
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		objFilterPref.txnCatName = me.txnFilterName;
		objFilterPref.txnCatArray = me.txnFilter;
		objFilterPref.advFilterCode = me.savePrefAdvFilterCode;
//		objFilterPref.dateFilterVal = me.dateFilterVal;
//		objFilterPref.dateFilterLabel = me.dateFilterLabel;
		return objFilterPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
				me.disablePreferencesButton("savePrefMenuBtn", false);	
				me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
		}		
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			me.disablePreferencesButton("savePrefMenuBtn", false);	
			me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objActivityPref = Ext.encode(data);
				me.handleSummaryInformationRender();
			}
		}
	},
	postDoHandleReadPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d.preferences)) {
				me.objActivityFilterPref = data.d.preferences.activityFilterPref;
				me.objActivityGridPref = data.d.preferences[me.strServiceParam];
				me.objActivityPanelPref = data.d.preferences.panels;
			}
		}
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		me.txnFilter = 'all';
		me.txnFilterName = 'all';
		if (!Ext.isEmpty(me.objActivityFilterPref)) {
			var data = me.objActivityFilterPref;

			if (!Ext.isEmpty(data.txnCatName))
				me.txnFilterName = data.txnCatName;

			me.txnFilter = !Ext.isEmpty(data.txnCatArray)
					? data.txnCatArray
					: 'all';

			if (!Ext.isEmpty(me.txnFilter) && me.txnFilter != 'all') {
				arrJsn.push({
							paramName : 'typeCode',
							paramValue1 : encodeURIComponent(me.txnFilter.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'in',
							dataType : 'A'
						});
			}
			me.filterData = arrJsn;
		}
		var	args = {
				'module' : 'panels'
			};
		me.preferenceHandler.readModulePreferences(me.strPageName,
					'panels', me.postReadPanelPrefrences, args, me, true);	

	},
	setInfoToolTipVal : function(tip) {
		var me = this;
		var account = '', date = '', filterView;
		if (!Ext.isEmpty(tip)) {
			var index = me.dateFilterVal;
			if (index != 7) {
				if (index === '1' || index === '2') {
					date = me.getFromDateLabel().text;
				} else {
					date = me.getFromDateLabel().text
							+ me.getToDateLabel().text;
				}
			} else {
				var dtParams = me.getDateParam('7');
				var from = Ext.Date.format(me.getFromEntryDate().getValue(),
						strExtApplicationDateFormat);
				var to = Ext.Date.format(me.getToEntryDate().getValue(),
						strExtApplicationDateFormat);
				date = from + '-' + to;
			}
			if (me.txnFilterName == 'allTxn' || me.txnFilterName == 'all') {
				account = getLabel('all', 'All');
			} else {
				account = me.txnFilterName;
			}
			tip.update(getLabel('information', 'Information') + ' : '
					+ getLabel('all', 'All') + '<br/>'
					+ getLabel('date', 'Date') + ' : ' + date + '<br/>'
					+ getLabel('txnCat', 'Txn Category') + ' : ' + account);
		}
	},
	handleTransactionInitiationVisibility : function(grid, data, scope) {
		var me = this;
		var activityView = me.getAccountActivityView();
		if (!Ext.isEmpty(data)) {
			if(!Ext.isEmpty(data.d.__errorCode)){
				var errorMsg = data.d._errorMessage;
				if(data.d.__errorCode.substr(0, 3) == "WSE"){
					errorMsg = (data.d.__errorCode + "-" + objWSErrors[data.d.__errorCode]);
				}
				paintError("#realTimeErrorDiv","#realTimeError",errorMsg);
			}
			var fundAccount = data.d.__isFundAccount;
			var loanAccount = data.d.__isLoanAccount;
			var paymentAccount = data.d.__isPaymentAccount;
			var investmentAccount = data.d.__isInvestmentAccount;

			GCP.getApplication().fireEvent(
					'postTransactionInitiationVisibility', paymentAccount,
					loanAccount, fundAccount, investmentAccount);
		}
		if (activityView)
			activityView.setLoading(false);
	},
	toggleFirstRequest : function(blnValue) {
		var me = this;
		me.isFirstRequest = blnValue;
		if (blnValue == false)
			me.strActivityType = null;
	},
	getTxnAmount : function(creditUnit, debitUnit) {
		if (!Ext.isEmpty(creditUnit) && creditUnit != 0) {
			return creditUnit;
		} else if (!Ext.isEmpty(debitUnit) && debitUnit != 0) {
			return debitUnit;
		} else if ((Ext.isEmpty(debitUnit) || debitUnit === 0)
				&& (Ext.isEmpty(creditUnit) || creditUnit === 0)) {
			// console.log("Error Occured.. amount empty");
			return 0
		}
	},
	populateSummaryAccountInfo : function() {
		var me = this;
		$("#currentCurrencyLabelId").show();
		$("#currencyDropdown").show();		
		$("#currAutoCompleter").parent().hide();
		$("#currentCurrencyLabelId").empty();
		$("#currencyCodedropDownId").empty();
		var summaryType = me.summaryType;
		var ctrl = $('#actAccountId'),objOpt = null,objDtl = null,objBtn = null;
		ctrl.empty();
		ctrl.unbind('change');
		Ext.Ajax.request({
			url : 'services/balancesummary/'+summaryType+'/btruseraccounts.json',
			method : 'GET',
			success : function(response) {
				if (response && response.responseText) {
					var data = Ext.decode(response.responseText);
					if (!Ext.isEmpty(data)) {
						var accArray = data.d.btruseraccount || [];

						if (undefined != accArray) {
							$.each(accArray, function(index, item) {
								objOpt = {
									value : item.accountId,
									text : item.accountName + ' , ' + item.accountNumber
								};
								if (isGranularPermissionForClient === 'Y') {
									if ((summaryType == 'intraday' && item.intraDayActivityGranularFlag == 'Y')
											|| (summaryType == 'previousday' && item.previousDayActivityGranularFlag == 'Y')) {
										if (me.accountFilter == item.accountId)
											objOpt.selected = true;
										ctrl.append($('<option>', objOpt));
									}
								} else {
									if (me.accountFilter == item.accountId)
										objOpt.selected = true;
									ctrl.append($('<option>', objOpt));
								}
							});
							if (ctrl.find('option').length > 0) {
								$('#actAccountIdSpan').removeClass('hidden');
								ctrl.bind('change', function(e) {
									objDtl = me.getObjectByKey(accArray,
											'accountId', $(this).val())
											|| {};
									me.doHandleAccountChange({
										accountId : objDtl.accountId,
										accountNumber : objDtl.accountNumber,
										accountName : objDtl.accountName,
										accountCcy : objDtl.accountCcy,
										accountCcySymbol : objDtl.accountCcySymbol,
										accountCalDate : objDtl.accountCalDate
									});

								});
							} else
								$('#actAccountIdSpan').addClass('hidden');
							ctrl.editablecombobox("destroy")
							ctrl.editablecombobox({
										emptyText : 'Select Account'
									});
						}
					}
				}
			},
			failure : function(response) {
				// console.log("Error Occured - In SummaryData
				// renderer");
			}
		});
	},
	getObjectByKey : function(arrObjects, strKey, strVal) {
		var arr = arrObjects || [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][strKey] == strVal) {
				return arr[i];
			}
		}
		return null;
	},
	activityDownloadOptions : function() {
		var me = this;			
		/*$('.ft-pdf-btn').unbind( "click" );		
		if (typeof objClientParameters != 'undefined' && !Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.enableReport)) {				
			if(objClientParameters.enableReport)
			{
				$('.ft-pdf-btn').on("click", function(e) {
					me.downloadReport("downloadReport");		
				});
			}
		}*/
		//$('.ft-pdf-btn').unbind( "click" );
		if (typeof objClientParameters != 'undefined' && !Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.enableReport)) {
			if(objClientParameters.enableReport) {				
				$('#dropDownPDF_AC').on("click", function(e) {
					$(document).trigger("performActivityReportAction", ["downloadReport"]);		
					$('.ft-dropdown-menu').hide();
				});
			}
		}
			
		$("#downloadDropDownItem").empty();
		$("#downloadReportDropDownItem").empty();
		//$("#downloadReportDropDownItem").append('<li><a data-downloadExt="downloadReport" href="#"><span class="ft-icons-pdf-white ft-icons-pdf ft-icons"></span> PDF</a></li>');
		$("#downloadReportDropDownItem").append('<li><a data-downloadExt="downloadReport" id="dropDownPDF_AC" href="#">'+getLabel("pdf","PDF")+'</a></li>');
		$("#downloadReportDropDownItem").append('<div class="ft-dropdown-content-btr"><label class="headerCheckBox"> <input id="includeActivitiesReportCheckbox" disabled = "disabled" type="checkbox" checked="true">'+getLabel("activities","Activities")+'</label></div>');
		$("#downloadReportDropDownItem").append('<div class="ft-dropdown-content-btr"><label class="headerCheckBox"> <input id="includeSummaryPDFReportCheckbox" type="checkbox">'+getLabel("includesummary","Include Summary")+'</label></div>');
		if (typeof objClientParameters != 'undefined' && !Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.exportList)) {				
				var exportArr = objClientParameters.exportList;
				if (!Ext.isEmpty(exportArr)) {
					Ext.each(exportArr, function(exprtEl) {								
								switch (exprtEl) {
									case 'XS' :
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadXls" href="#">'+getLabel("xls","XLS")+'</a></li>');
										break;
									case 'CS' :
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadCsv" href="#">'+getLabel("csv","CSV")+'</a></li>');
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadTsv" href="#">'+getLabel("tsv","TSV")+'</a></li>');
										break;
									case 'PF' :
										break;
									case 'MT' :	
										if(summaryType=='previousday')									
											$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt940" href="#">'+getLabel("mt940","MT940")+'</a></li>');
										break;
									case 'MT2' :	
										if(summaryType=='intraday')									
											$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt942" href="#">'+getLabel("mt942","MT942")+'</a></li>');
										break;
									case 'MT3' :	
										if(summaryType=='previousday')									
											$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt950" href="#">'+getLabel("mt950","MT950")+'</a></li>');
										break;
									case 'BA' :	
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadBAl2" href="#">'+getLabel("bai2","BAl2")+'</a></li>');
										break;
									case 'QBEXP' :
										if(summaryType=='previousday')		
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadqbook" href="#">'+getLabel("quickbooks","QuickBooks")+'</a></li>');
										break;
									case 'QEXP' :
										if(summaryType=='previousday')		
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadquicken" href="#">'+getLabel("quicken","Quicken")+'</a></li>');
										break;
									default :
										break;
								}
							});
				}
				$("#downloadDropDownItem").append('<div class="ft-dropdown-content-btr"><label class="headerCheckBox"> <input id="includeSummaryExportReportCheckbox" type="checkbox">'+getLabel("includesummary","Include Summary")+'</label></div>');			
				$("#downloadDropDownItem").append('<div class="ft-dropdown-content-btr"><label class="headerCheckBox"> <input id="headerCheckbox" type="checkbox">'+getLabel("withheader","With Header")+'</label></div>');	
				$('#downloadDropDownItem li').on("click", function(event) {
					var actionName = $(event.target).attr("data-downloadExt");
					me.downloadReport(actionName);
					$('.ft-dropdown-menu').hide();
				});
				$('#downloadReportDropDownItem li').on("click", function(event) {
					var actionName = $(event.target).attr("data-downloadExt");
					$(document).trigger("performActivityReportAction", [actionName]);
					$('.ft-dropdown-menu').hide();
				});
			}
	},	
	handleClearSettings : function() {
		var me = this;	
		me.identifier = null;
		me.isHistoryFlag = null;
		me.objActivityFilterPref = null;
		me.strActivityType = '';
		if(summaryType==='previousday'){
			me.dateFilterVal = defaultFilterVal;
			me.dateFilterLabel = me.getDateFileterLabel(defaultFilterVal);
		}
		clearPopupNew();
		$('#msSavedFilterActivity').val('');
		$("#msSavedFilterActivity").multiselect("refresh");
		me.savedFilterVal = '';
		me.savePrefAdvFilterCode = null;
		me.advFilterData = null;
		var savedFilterComboBox = me.getSavedFiltersCombo();				
		savedFilterComboBox.setValue(me.savedFilterVal);
        me.filterCodeValue = '';
        selectedFilter = '';
		me.filterApplied = 'Q';
		me.txnFilter = 'all';
		me.txnFilterName = 'All';
		var combobox = me.getSavedTypeCodeCombo();
		combobox.setValue('All');
		selectedFilter = '';
		me.handleDateChange(me.dateFilterVal);
		me.resetAllFields();
		me.setDataForFilter();
        enableDisableSortIcon(me, null, true);
		me.applyQuickFilter();
		
	},
//	loadTypeCodeSetGrid : function()
//	{
//		var me = this;
//		$('#typeCodeSetList').empty();
//		var grid = me.getTransactionCategoryGridView();
//		Ext.Ajax.request({
//			url : 'services/userpreferences/'+me.strPageName+'/transactionCategories.json',
//			method : "GET",
//			async : false,
//			success : function(response) {
//				if (!Ext.isEmpty(response.responseText)) {
//					var data = Ext.decode(response.responseText);
//					pref = Ext.decode(data.preference);
//					var jsonData = JSON.parse(data.preference);
//					me.transactionCategoryStoreData =  jsonData;
//					if (grid) {
//						grid.store.removeAll(true);
//						grid.loadRawData(pref);
//					}
//				}
//			}
//		});
//		var panel = Ext.create('GCP.view.activity.TransactionCategoryGridView', {	
//								transactionCategoryStoreData : me.transactionCategoryStoreData,		
//								renderTo : 'typeCodeSetList'
//							});
//		
//	},
	loadTypeCodeSetEntryGrid : function(mode)
	{
		//if(mode === 'ADD')
		//{
			//$('#typeCodeSetEntryList').empty();
			$('#typeCodeErrorPanelList').empty();
		//}

		if(Ext.isEmpty(filterEntryGrid)){
	      filterEntryGrid = Ext.create('GCP.view.activity.TransactionCategoryEntryGridView', {								
								renderTo : 'typeCodeSetEntryList'
							});
	  }
	  
	},
	handleSavedTypeCodeFilterClick : function(rowIndex)
	{
		var me = this;
		var grid = me.getTransactionCategoryGridView();
		//var grid = me.getTransactionCategoryEntryGridView();
		if(rowIndex >= 0)
			me.doHandleViewTransactionCategory(grid,rowIndex);
		else
			me.clearTypeCodeSelection();
	},
	clearTypeCodeSelection : function(){
		$("#typeCodeTextField").attr('value', '');
		$("#btnTypeSave button").text(getlabel('save','Save') );
		var me = this;
		var grid = me.getTransactionCategoryEntryGridView();
		grid.getSelectionModel().deselectAll();
	},
	doHandleSaveTypeCodeClick : function(txtFieldVal,strMode)
	{
		var me = this;
		var mode = strMode;
		var data = null;
		var savedTypecodeSets = me.getSavedTxnCategories();
		
		if(strMode === 'ADD')
		{
			if (me.validateEntryForm(txtFieldVal,mode)) {
				data = me.getTransactionCategoryFormData(txtFieldVal);
				me.doSaveTransactionCategory(savedTypecodeSets, data);
				$("#typeCodeErrorPanelList").text('');
				$('#typeCodeSetPopup').dialog("close");
			}
			else
			{
				errorMsg = getLabel('typeCodeErrorLabel','Type Code selection is mandatory!');
				$("#typeCodeSetErrorDiv").removeClass("ui-helper-hidden");
				$("#typeCodeSetErrorMessage").text(errorMsg);
			}
		}
		else
		{
			data = me.getTransactionCategoryFormData(txtFieldVal);
			me.doSaveTransactionCategory(savedTypecodeSets, data);
			$("#typeCodeErrorPanelList").text('');
			$('#typeCodeSetPopup').dialog("close");
		}
		me.handleTransactionCategoryLoading();
	},
	getSavedTxnCategories : function(){
		var returnArray = [];
		
		Ext.Ajax.request({
			url : 'services/userpreferences/'+strActivityPageName+'/transactionCategories.json',
			method : 'GET',
			async: false,
			success : function(response) {
				var data = null;
				if(!Ext.isEmpty(response)
						&& !Ext.isEmpty(response.responseText))
					data = Ext.decode(response.responseText);
					if(!Ext.isEmpty(data)
						&& !Ext.isEmpty(data.preference)){
						var responseData = Ext.decode(data.preference);
						if(responseData.length > 0){
							$.each(responseData,function(index){
								if(!Ext.isEmpty(responseData[index])
									&& !Ext.isEmpty(responseData[index].txnCategory)){
									returnArray.push(responseData[index]);
								}
							});
						}
					}
			},
			failure : function(response) {
				// console.log("Ajax Get account sets call failed");
			}
		});
		return returnArray;
	},
	validateEntryForm : function(nickNameField,strMode) {
		var me = this;
		var grid = me.getTransactionCategoryEntryGridView();
		var transactionCategoryGrid = me.getTransactionCategoryGridView();
		var store = grid ? grid.getStore() : null;
		var retValue = true;
		var strNickName = nickNameField;

		if (Ext.isEmpty(strNickName))
			retValue = false;
		if (store && Ext.isEmpty(grid.getSelectionModel().getSelection()))
			retValue = false;
		store = transactionCategoryGrid
				? transactionCategoryGrid.getStore()
				: null;
		if (store && !Ext.isEmpty(store.findRecord('txnCategory', strNickName))
				&& strMode !== 'VIEW')
			retValue = false;
		return retValue;
	},
	getTransactionCategoryFormData : function(nickNameField) {
		var me = this;
		var grid = me.getTransactionCategoryEntryGridView();
		var store = grid ? grid.getStore() : null;
		var arrRecords = null;

		var recData = {};
		recData['txnCategory'] = nickNameField || '';
		recData['typeCodes'] = [];

		arrRecords = grid.getSelectionModel().getSelection();
		
		for(var i=0;i<arrRecords.length;i++)
			recData['typeCodes'].push(arrRecords[i].data.CODE);
		
		return recData;
	},
	doHandleViewTransactionCategory : function(grid,rowIndex) {
		var me = this;
		//var record = grid.getStore().getAt(rowIndex);
		var selectedTypecodes = $("#msSavedFilterTypeCode").val();
		var txnCategory = $("#msSavedFilterTypeCode").find(":selected").text();
		var record = {
			txnCategory : txnCategory,
			typeCodes : selectedTypecodes.split(",")
		};
		me.doSetTransactionCategoryFormFields(grid,record);
	},
	doSetTransactionCategoryFormFields : function(grid,record) {
		var me = this;
		me.doClearTransactionCategoryFormFields('VIEW',grid,record);
		//var nickNameTextField = record.get('txnCategory');
		var nickNameTextField = record.txnCategory;
		var grid = me.getTransactionCategoryEntryGridView();
		var store = grid ? grid.getStore() : null;
		//var arrTypeCode = record.get('typeCodes');
		var arrTypeCode = record.typeCodes;
		if (!Ext.isEmpty(nickNameTextField)
				&& nickNameTextField != 'Select') {
				$("#typeCodeTextField").attr('value', nickNameTextField || '');
		}
        grid.typCodeArr= arrTypeCode;
        grid.setLoading(true);
		Ext.Ajax.request({
			url : 'services/userseek/typecodelist?$top=-1',
			method : 'GET',
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var recordsToSelect = [];
				var arrTypeCodes = manageTypeCodeJsonObj(data.d.preferences);
				if (!Ext.isEmpty(arrTypeCodes))
					store.loadRawData(arrTypeCodes);
				var arrTypeCode=grid.typCodeArr;
				if (!Ext.isEmpty(arrTypeCode)) {
					grid.store.each(function(rec) {
						if (Ext.Array.contains(arrTypeCode, rec.get('CODE'))) {
							/*rec.set('typeCodeCheckbox', true);*/
							recordsToSelect.push(rec);
						}
					});
				}
				grid.getSelectionModel().select(recordsToSelect);	
				grid.setLoading(false);
			},
			failure : function(response) {
				// console.log("Ajax Get account sets call failed");
				grid.setLoading(false);
			}

		});
	},
	doClearTransactionCategoryFormFields : function(mode,grid,record) {
		var me = this;
		var nickNameTextField = record.txnCategory;
		var store = grid ? grid.getStore() : null;
		var strLabel =  getLabel('save', 'Save');

		if (!Ext.isEmpty(nickNameTextField)) {
			$("#typeCodeTextField").removeAttr("disabled", "disabled"); 
			$("#typeCodeTextField").attr('value', '');
		}
		 $("#btnTypeSave button").text( strLabel );

		if (!Ext.isEmpty(store)) {
			store.each(function(record) {
				record.set('typeCodeCheckbox', false);
			});
		}
	},
	handlePostingDateChange:function(index){
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index,null);

		if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
					'Posting Date')
					+ " (" + me.postingDateFilterLabel + ")");
		}
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('postingDate', 'Entry Date')
					+ " (" + me.postingDateFilterLabel + ")");
		}
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			var filterOperator=objDateParams.operator;
			me.dateFilterVal =index;
			if (index == '13') {
				if (filterOperator == 'eq') {
					$('#postingDate').setDateRangePickerValue(vFromDate);
					$('#activityDataPicker').setDateRangePickerValue(vFromDate);
				} else {
					$('#postingDate').setDateRangePickerValue([
							vFromDate, vToDate]);
					$('#activityDataPicker').setDateRangePickerValue([
					               							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateLabel :  getDateDropDownLabesl(index),
					dateIndex : index
				};
			} else {
				if (index === '1' || index === '2' || index === '12') {
					if (index === '12') {
						$('#postingDate').val('Thru' + '  ' + vFromDate);
						$('#activityDataPicker').val('Thru' + '  ' + vFromDate);
					} else {
						$('#postingDate').setDateRangePickerValue(vFromDate);
						$('#activityDataPicker').setDateRangePickerValue(vFromDate);
					}
				} else {
					$('#postingDate').setDateRangePickerValue([
							vFromDate, vToDate]);
					$('#activityDataPicker').setDateRangePickerValue([
					               							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateLabel :  getDateDropDownLabesl(index),
					dateIndex : index
				};
			}
			updateToolTip('postingDate',me.postingDateFilterLabel);
	},
	handleValueDateChange:function(index){
		var me = this;
		var dateToField;
		var type = 'Value';
		var objDateParams = me.getDateParam(index,type);

		if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="ValueDateLabel"]').text(getLabel('valueDate',
					'Value Date')
					+ " (" + me.valueDateFilterLabel + ")");
		}
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			var filterOperator=objDateParams.operator;
			
			if (index == '13') {
				if (filterOperator == 'eq') {
					$('#valueDate').setDateRangePickerValue(vFromDate);
				} else {
					$('#valueDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedValueDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateIndex:index,
					dateLabel :  getDateDropDownLabesl(index)
				};
			} else {
				if (index === '1' || index === '2' || index === '12') {
					if (index === '12') {
						$('#valueDate').val('Thru' + '  ' + vFromDate);
					} else {
						$('#valueDate').setDateRangePickerValue(vFromDate);
					}
				} else {
					$('#valueDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedValueDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateIndex:index,
					dateLabel :  getDateDropDownLabesl(index)
				};
			}
			updateToolTip('valueDate',me.valueDateFilterLabel);
	},
	populateSortByFields : function(){
		$('#msSortBy1').empty();
		$('#msSortBy2').empty();
		$('#msSortBy3').empty();
		setSortByMenuItems("#msSortBy1",arrSortByFields);
		$("#msSortBy2").append($('<option />', {
			value : "None",
			text : getLabel("none", "None")
			}));
		$("#msSortBy3").append($('<option />', {
			value : "None",
			text : getLabel("none", "None")
			}));
		$("#msSortBy1").niceSelect();
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
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
					var sortByComboRef = $("#msSortBy1");
					if (!Ext.isEmpty(sortByComboRef)) {
						sortByComboRef.val(columnId);
						$("#msSortBy1").niceSelect('update');
						$('#msSortBy2').attr('disabled',false);
						$("#msSortBy2").niceSelect();
					}
				}

			} else if (fieldName === 'FirstThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy2AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)){
						sortBy2ComboSelected(columnId); 
						thenSortByButtonRef.text(buttonText);
					}
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var firstThenSortByCombo = $("#msSortBy2");
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.val(columnId);
						$("#msSortBy2").niceSelect('update');
						$('#msSortBy3').attr('disabled',false);
						$("#msSortBy3").niceSelect();
					}
				}

			} else if (fieldName === 'SecondThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy3AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)){
						thenSortByButtonRef.text(buttonText);
					}
				}

				// Second Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var secondThenSortByComboRef = $("#msSortBy3");
					if (!Ext.isEmpty(secondThenSortByComboRef)) {
						secondThenSortByComboRef.val(columnId);
						$("#msSortBy3").niceSelect('update');
					}
				}
			}
		}
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
			grid.refreshData();
		}
	},
	getSortByJsonForSmartGrid : function() {
		var me = this;
		var jsonArray = [];
		var sortDirection = '';
		var fieldId = '';
		var sortOrder = '';
		var sortByData = me.advSortByData;
		var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
   		var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
		if (!Ext.isEmpty(sortByData)) {
			for (var index = 0; index < sortByData.length; index++) {
				fieldId = sortByData[index].value1;
				sortOrder = sortByData[index].value2;

				if (sortOrder != 'asc')
					sortDirection = 'DESC';
				else
					sortDirection = 'ASC';

				if(fieldId=='amount'){
					if(creditChecked){
						jsonArray.push({
									property : 'creditUnit',
									direction : sortDirection,
									root : 'data'
								});					
					}
					if(debitChecked){
						jsonArray.push({
								property : 'debitUnit',
								direction : sortDirection,
								root : 'data'
							});		
					}
				}else{	
					jsonArray.push({
								property : fieldId,
								direction : sortDirection,
								root : 'data'
							});
				}		
			}

		}
		return jsonArray;
	},
	loadActivityGraph : function()
	{
		var me = this;
		$('#graphCarousal').empty();
		var panel = Ext.create('GCP.view.activity.AccountActivityGraph', {								
			renderTo : 'graphCarousal'
		});
		if(!Ext.isEmpty(me.objActivityPanelPref)){
			if(me.objActivityPanelPref.graphPanel == true){
				if(!$('#graghSummaryId').hasClass("ft-accordion-collapsed"))
					$('#graghSummaryId').addClass("ft-accordion-collapsed");					
			}
			else
				$('#graghSummaryId').removeClass("ft-accordion-collapsed");
		}
		
//		$('#graphSummaryExpandCollapseIcon').on("click", function(e) {
//				if(!$('#graghSummaryId').hasClass('ft-accordion-collapsed')){
//				accountGraphView.hide();accountGraphView.show();}
//			});
	},
	populateActivityGraphTypecodeInfo : function() {
		$('#typecodeDropdown').hide();
		$('#currentTypecodeLabelId').hide();
		$('#graphTitleLabelId').text('Graph');
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me=this;		
		var objGroupView = me.getGroupView();	
		var gridModel = null;
		var objLocalJsonData = '';
		if (objSaveActivityLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveActivityLocalStoragePref);
					
		var intPageSize = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageSize
				? objLocalJsonData.d.preferences.tempPref.pageSize
				: '';
		var intPageNo = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageNo
				? objLocalJsonData.d.preferences.tempPref.pageNo
				: 1;
		var sortState = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.sorter
				? objLocalJsonData.d.preferences.tempPref.sorter
				: [];
		if(!Ext.isEmpty(intPageSize)){
			gridModel = {
					pageSize : intPageSize,
					pageNo : intPageNo
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
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	getDateFileterLabel : function(filterVal){
		switch(filterVal) {
			case '16' :
				return getLabel('selectedRecordDate', 'Selected Record Date');
			case '1':
				return getLabel('today', 'Today');
			case '2' :
				return getLabel('yesterday', 'Yesterday');
			case '3' :
				return getLabel('thisweek', 'This Week');
			case '4' :
				return getLabel('lastweektodate', 'Last Week To Date');
			case '5' :
				return getLabel('thismonth', 'This Month');
			case '6' :
				return getLabel('lastMonthToDate', 'Last Month To Date');
			case '8' :
				return getLabel('thisquarter', 'This Quarter');
			case '9' :
				return getLabel('lastQuarterToDate','Last Quarter To Date');
			case '14' :
				return Ext.String.format(getLabel('lastXDays', 'Last {0} Days'), xDaysVal);
			default :
				return getLabel('daterange', 'Date Range');
		}
	},
	doHandleShowSelectedFilter : function(selectedFilter) {
		var me = this;
		var grid = me.getTransactionCategoryGridView()
		var store = grid.getStore();
		var preferenceArray = [];
		var rowIndex = -1; 
		var args = {
			'grid' : grid
		};
		if (store && typeof selectedFilter !== 'undefined')
		{
			var recordToDel = null;
			 store.each(function(record)   
			  {   
		      	if(record.get('txnCategory') === selectedFilter){
		      		recordToDel = record;
		      		rowIndex = store.indexOf(record);
		      		if(rowIndex >= 0){
						 me.doHandleViewTransactionCategory(grid,rowIndex);
		      		}
		      	}
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
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			//adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInAdv)) {
					arrAdvJson = advJsonData;
				arrAdvJson = me
						.removeFromAdvanceArrJson(arrAdvJson,paramName);
					me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) {
						arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.setDataForFilter(); // added this for default posting date
			me.refreshData();
		}
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		if(arr)
		{
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		}
		return reqJson;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		switch(strFieldName) {
	    case 'debitCreditFlag':
	    	$('#debitCheckBox').prop('checked', false);
	    	$('#creditCheckBox').prop('checked', false);
//	        code block
	        break;
	    case 'postingDate':
	    	
//	        code block
	        break;
	    case 'valueDate':
//	        code block
	        break;
	    case 'typeCodeText' :
	    	$('#typeCode').val('');
	    	me.txnFilter = null;
	    	break;
	    case 'typeCode':
	    	var comboBox = me.getSavedTypeCodeCombo();						
			comboBox.setValue('All');
			me.txnFilter = null;
			advTypeCode=[];
//	        code block
	        break;
	    case 'bankReference':
	    	$('#bankReference').val('');
//	        code block
	        break;
	    case 'customerReference':
	    	$('#customerReference').val('');
//	        code block
	        break;
	    case 'noteText':
	    	$('#notes').val('');
//	        code block
	        break;
	    case 'amount':
	    	$('#amountField').val('');
//	        code block
	        break;
	    case 'hasImageFlag':
	    	$("input[type='checkbox'][id='hasImageCheckBox']").prop('checked', false);
//	        code block
	        break;
	    case 'hasAttachmentFlag':
		$("input[type='checkbox'][id='hasAttachmentCheckBox']").prop('checked', false);
//	        code block
	        break;
	    default:
	    	break; 
		}
	
	},
	doDeleteTransactionCategoryGridRecord : function(filterCode, filterCodeDesc) {
		var me = this;
		var objFilterName;
		var preferenceArray = [];
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedTypeCodeCombo"]');
		var objComboStore = null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;
		me.savedFilterVal = '';
		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',
					objFilterName));
			savedFilterCombobox.setValue('All');
		}
		me.deleteSavedTypeCode(filterCode);
	},
	deleteSavedTypeCode : function(filterCode){
		var me = this;
		var preferenceArray = [];
		var rowIndex = -1;
		var grid = me.getTransactionCategoryEntryGridView();
		var args = {
			//'grid' : grid
		};
		Ext.Ajax.request({
			url : 'services/userpreferences/'+strActivityPageName+'/transactionCategories.json',
			method : 'GET',
			success : function(response) {
				if(!Ext.isEmpty(response)
					&& !Ext.isEmpty(response.responseText))
					data = Ext.decode(response.responseText);
				if(!Ext.isEmpty(data)
					&& !Ext.isEmpty(data.preference)){
					var responseData = Ext.decode(data.preference);
					if (responseData)
					{
						var recordToDel = null;
						responseData.forEach(function(record){   
							if(record.txnCategory === filterCode){
					      		recordToDel = record;
					      		rowIndex = responseData.indexOf(record);
					      	}
						 });
						 deletedCat = responseData.splice(rowIndex, 1);
						 deletedCat = deletedCat[0].txnCategory;
					}
					if (!Ext.isEmpty(responseData)) {
						responseData.forEach(function(rec) {
							preferenceArray.push(rec);
						});
					}
					args['data'] = preferenceArray;
					me.handleClearSettings();
					me.preferenceHandler
					.saveModulePreferences(
							me.strPageName,
							me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
							preferenceArray,
							me.postHandleDoDeleteTransactionCategory, args, me,
							false);
				}
			},
			failure : function(response) {
				// console.log("Ajax Get account sets call failed");
			}
		});
	},
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = me.getDateHandler();
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
	},
	getLastXDays : function (dtToday,days){
		var beforeDate = new Date(dtToday);
		beforeDate.setDate(dtToday.getDate()-days);
		return beforeDate;
	},
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
			
		if(!Ext.isEmpty(me.savePrefAdvFilterCode))
			objSaveState['advFilterCode'] = me.savePrefAdvFilterCode;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.getQuickFilterQueryJson()) ? me.getQuickFilterQueryJson() : {};
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
		var me = this, strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
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
	populateTempFilter : function (filterData)
	{
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var operatorValue = '';
		var valueArray = '';
		var formattedFromDate, formattedToDate;
		for (i = 0; i < filterData.length; i++) {
			fieldName = filterData[i].paramName;
			fieldVal = filterData[i].paramValue1;
			fieldSecondVal = filterData[i].paramValue2;
			operatorValue = filterData[i].operatorValue;
			valueArray = filterData[i].valueArray;
			if (fieldName === 'typeCode') {
				var typeCodeComboBox = me.getSavedTypeCodeCombo();
				typeCodeComboBox.setValue(decodeURIComponent(fieldVal));
				me.txnFilter = valueArray;
				me.txnFilterName = fieldSecondVal;
			}
		}
		
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSaveActivityLocalStoragePref = Ext.encode(data);
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveActivityLocalStoragePref = '';
			me.objLocalData = '';
			me.identifier = null;
		me.isHistoryFlag = null;
		me.objActivityFilterPref = null;
		me.strActivityType = 'LATEST';
		if(summaryType==='previousday'){
			me.dateFilterVal = defaultFilterVal;
			me.dateFilterLabel = me.getDateFileterLabel(defaultFilterVal);
		}
		clearPopupNew();
		$('#msSavedFilterActivity').val('');
		$("#msSavedFilterActivity").multiselect("refresh");
		me.savedFilterVal = '';
		me.savePrefAdvFilterCode = null;
		me.advFilterData = null;
		var savedFilterComboBox = me.getSavedFiltersCombo();				
		savedFilterComboBox.setValue(me.savedFilterVal);
		me.filterApplied = 'Q';
		me.txnFilter = 'all';
		me.txnFilterName = 'All';
		var combobox = me.getSavedTypeCodeCombo();
		combobox.setValue('All');
		selectedFilter = '';
		me.handleDateChange(me.dateFilterVal);
		}
	}
});
var posting_date_opt = null;
var value_date_opt = null;
function updateToolTip(filterType,date_option){
	if(filterType === 'postingDate')
		posting_date_opt = date_option;
	else if(filterType === 'valueDate')
		value_date_opt = date_option;
}
