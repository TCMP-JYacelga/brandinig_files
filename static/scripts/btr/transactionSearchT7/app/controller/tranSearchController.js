/**
 * @class GCP.controller.tranSearchController
 * @extends Ext.app.Controller
 * @author Shraddha Chauhan
 */
/**
 * This controller is prime controller in Account Summary T7 Controller which
 * handles all measure events fired from GroupView. This controller has
 * important functionality like on any change on grid status or quick filter
 * change, it forms required URL and gets data which is then shown on Summary
 * Grid.
 */
Ext.define('GCP.controller.tranSearchController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil','Ext.ux.gcp.PreferencesHandler','GCP.view.tranSearchSummaryView','GCP.view.tranSearchTiltleView','GCP.view.tranCategoryGridView',
	            'GCP.view.tranSearchFilterView','GCP.view.tranSearchAdvFilterPopUp'],
	refs : [{
				ref : 'tranSearchSummaryView',
				selector : 'tranSearchSummaryView'
			}, {
				ref : 'filterView',
				selector : 'tranSearchFilterView'
			}, {
				ref : 'btnAllCats',
				selector : ' tranSearchFilterView combo[itemId="allCat"]'
			}, {
				ref : 'typeCodeFilter',
				selector : ' tranSearchFilterView combo[itemId="accountsFilterToobar"]' 
			}, {
				ref : 'transactionCategoryPopUp',
				selector : 'tranCategoryPopUpView[itemId="transactionCategoryPopUpView"]'
			}, {
				ref : 'fromDateLabel',
				selector : 'tranSearchFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : 'tranSearchFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'tranSearchFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'dateLabel',
				selector : 'tranSearchFilterView label[itemId="PostingDateLabel"]'
			},{
				ref : 'entryDate',
				selector : 'tranSearchFilterView button[itemId="entryDate"]'
			}, {
				ref : 'postingDate',
				selector : 'tranSearchFilterView button[itemId="postingDate"]'
			}, {
				ref : 'valueDate',
				selector : 'tranSearchFilterView button[itemId="valueDate"]'
			},{
				ref : 'fromEntryDate',
				selector : 'tranSearchFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'tranSearchFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'withHeaderReportCheckbox',
				selector : 'tranSearchSummaryView tranSearchTiltleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'btnSavePreferences',
				selector : ' tranSearchFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : ' tranSearchFilterView button[itemId="btnClearPreferences"]'
			}, {
				ref : 'advanceFilterPopup',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"]'
			}, {
				ref : 'advanceFilterTabPanel',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'filterDetailsTab',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'createNewFilter',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchCreateNewAdvFilter[itemId="tranSearchCreateNewAdvFilter"]'
			}, {
				ref : 'saveSearchBtn',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchCreateNewAdvFilter[itemId="tranSearchCreateNewAdvFilter"] button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchAdvFilterGridView'
			}, {
				ref : 'postingFromDateLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=postingDateLabelsContainer] label[itemId="postingDateFilterFrom"]'
			}, {
				ref : 'postingToDateLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=postingDateLabelsContainer] label[itemId="postingDateFilterTo"]'
			}, {
				ref : 'postingDateRange',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=postingDateRangeContainer] container[itemId="postingDateRangeComponent"]'
			}, {
				ref : 'postingDateLbl',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] label[itemId=postingDateLbl]'
			}, {
				ref : 'postingDateBtn',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] button[itemId=postingDateBtn]'
			}, {
				ref : 'valueFromDateLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=valueDateLabelsContainer] label[itemId="valueDateFilterFrom"]'
			}, {
				ref : 'valueToDateLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=valueDateLabelsContainer] label[itemId="valueDateFilterTo"]'
			}, {
				ref : 'valueDateRange',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=valueDateRangeContainer] container[itemId="valueDateRangeComponent"]'
			}, {
				ref : 'valueDateLbl',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] label[itemId=valueDateLbl]'
			}, {
				ref : 'valueDateBtn',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] button[itemId=valueDateBtn]'
			}, {
				ref : 'sortByCombo',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] combo[itemId="sortByCombo"]'
			}, {
				ref : 'firstThenSortByCombo',
				selector : 'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] combo[itemId="firstThenSortByCombo"]'
			}, {
				ref : 'secondThenSortByCombo',
				selector : 'tranSearchCreateNewAdvFilter[itemId="tranSearchCreateNewAdvFilter"] tranSearchCreateNewAdvFilter[itemId=activityCreateNewAdvFilter] combo[itemId="secondThenSortByCombo"]'
			}, {
				ref : 'amountFromLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=amountLabelsContainer] label[itemId="amountRangeFilterFrom"]'
			}, {
				ref : 'amountToLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=amountLabelsContainer] label[itemId="amountRangeFilterTo"]'
			},{
				ref : 'amountRange',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] container[itemId=amountRangeContainer] container[itemId="amountRangeComponent"]'
			},{
				ref : 'amountTypeBtn',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] button[itemId=amountTypeBtn]'
			}, {
				ref : 'amountMenu',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] menu[itemId="amountMenu"]'
			}, {
				ref : 'amountLabel',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] label[itemId="amountLabel"]'
			}, {
				ref : 'amountNoField',
				selector : 'tranSearchCreateNewAdvFilter[itemId=tranSearchCreateNewAdvFilter] numberfield[itemId="amount"]'
			},{
				ref : 'savedFiltersToolBar',
				selector : ' tranSearchFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'groupView',
				selector : 'tranSearchSummaryView groupView'
			},{
				ref : 'transactionCategoryTabPanel',
				selector : 'tranCategoryPopUpView tabpanel[itemId="transactionCategoryTabPanel"]'
			},
			{
					ref:'filterViewRef',
					selector:'filterView'	
			},
			{
				ref : 'tranCategoryGridView',
				selector : 'tranCategoryGridView'
			},
			{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},
			{
				ref : 'tranCategoryEntryGridView',
				selector : 'tranCategoryEntryGridView'
			}, {
				ref : 'txnCategoryEntryGridViewItemId',
				selector : 'tranCategoryEntryGridView[itemId="transactionCategoryEntryGridView"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'tranSearchFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'saveButton',
				selector : 'transactionCategoryPopUp button[itemId="savebtn"]'
			}
			],
	config : {
		txnFilterName : 'all',
		txnFilter : 'all',
		advTypeCode : [],
        dateFilterVal : defaultDateIndex,
		postIndex :'',
		postDate :'',
        dateFilterLabel : getDateIndexLabel(defaultDateIndex),
        valueDateFilterVal : defaultDateIndex,
        postingDateFilterVal : defaultDateIndex,    
		dateHandler : null,
		deletedCat : null,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		accountFilter : '(ALL)',
        savedFilterVal : '',
		filterData : [],
		typeCodePopup : null,
		identifier : null,
		isFirstRequest : true,
		bIsQuickSavedFilter : false,      // Indicator for saved filter click on Quick filter section
		bIsAdvanceSavedFilter : false,    // Indicator for saved filter click on Advance popup screen
		bIsApplyAdvanceFilter : false,    // Indicator for SEARCH click on Advance popup screen
		postingDateRef : null,
		strSaveActivityNotesUrl : 'services/activities/updateActivitNotes',
		
		strModifySavedFilterUrl : 'services/userfilters/tranSearchSummary/{0}.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/tranSearchSummary.json',
		strGetSavedFilterUrl : 'services/userfilters/tranSearchSummary/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/tranSearchSummary/{0}/remove.json',

		txnDetailsPopup : null,
		checkImagePopup : null,
		txnNotesPopup : null,
		emailPopup : null,
		expandedWirePopup : null,

		filterCodeValue : null,
		objAdvFilterPopup : null,
		filterMode : '',
		advFilterData : [],
		showAdvFilterCode : null,
		advSortByData : [],
		filterApplied : 'ALL',
		advFilterCodeApplied : null,
		SearchOrSave : false,
		savePrefAdvFilterCode : null,

		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,

		accountCalDate : null,
		widgetTypeCodeSet : false,
		mapUrlDetails : {
			'strPrefferdTransactionCategories' : {
				pageName : 'tranSearchSummaryCategories',
				moduleName : 'transactionCategories'
			}
		},
		strPageName : 'transactionSearchSummary',
		selectedAccCcy : null,
		selectedAccSymbol : null,
		strServiceType : null, 
		strServiceParam : null,
		strActivityType : null,
		dateRangeFilterVal : '13',
		datePickerSelectedDate : [],
		datePickerSelectedDateValue : [],
		preferenceHandler : null,
        postingDateFilterLabel : getDateIndexLabel(defaultDateIndex),
        valueDateFilterLabel: getDateIndexLabel(defaultDateIndex),
		amountFilterVal : '',
        amountFilterLabel : getLabel('lessThan','Less Than'),
		transactionCategoryStoreData : null,
        objLocalData : null,
		reportGridOrder : null
	},
	init : function() {
		var me = this;	
		Ext.data.Connection.override({
		    request: function(options){
		        var me = this;
		        if(!options.headers)
		           options.headers = {};
		            
		        var actionUrl = options.url;
				options.headers[csrfTokenName] = csrfTokenValue;
				
		        return me.callOverridden(arguments);
		    }
		});
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.updateConfig();
		me.createPopUps();
        if(objSaveLocalStoragePref){
            me.objLocalData = Ext.decode(objSaveLocalStoragePref);
            var filterType = me.objLocalData && me.objLocalData.d.preferences
                                && me.objLocalData.d.preferences.tempPref 
                                && me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
            me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
        }
		if(!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		
		me.strServiceType = mapService['BR_TXN_SRC_GRID'];
				$(document).on('savePreference', function(event) {
						me.handleSavePreferences(event);
				});
				$(document).on('handleSavedTypeCodeFilterClick', function(event,index) {
					me.handleSavedTypeCodeFilterClick(index);
				});
				$(document).on('clearPreference', function(event) {
						me.handleClearPreferences(event);
				});
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
				$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
				$(document).on('saveAndSearchActionClicked', function() {
					me.handleSaveAndSearchAction(me);
				});
				$(document).on('deleteTypeCodeFilterEvent', function(event, filtervalue, filtertext) {
					me.doDeleteTransactionCategoryGridRecord(event, filtervalue, filtertext);
				});
				$(document).on('filterDateChange',function(event, filterType, btn, opts) {
					if(filterType == "postingDate"){
						 me.postingDateChange(btn,opts);
					 }else if(filterType == "valueDate"){
						 me.valueDateChange(btn,opts);
					 }
				});				
				$(document).on('editActivityFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
				$(document).on('viewActivityFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
				$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
				$(document).on('amountTypeChange',function(event, filterType, btn, opts) {
					me.amountTypeChange(btn);
				});				
				$(document).on('changeSaveButtonlabel', function(event) {
				var saveButton = me.getSaveButton();
				var strLabel = !Ext.isEmpty(selectedFilter)
						? getLabel('update', 'Update')
						: getLabel('save', 'Save');
				
				if (!Ext.isEmpty(saveButton))
					saveButton.setText(strLabel);
				});
				
				$(document).on('loadTypeCodeSetEntryGrid', function(event) {
						me.loadTypeCodeSetEntryGrid();
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
				$(document).on('addNotes', function(event,id,formdata,updatedNote,addedfile) {
					me.doSaveCapturedRemark(id,formdata,updatedNote,addedfile);
				});
				$(document).on('resetAllFieldsEvent', function(event, bClearBtnClicked) {
					me.resetAllFields(bClearBtnClicked);					
				});
				$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
				$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
				$(document).on('deleteTypeCodeEvent', function(event, selectedFilter) {
					me.doHandleShowSelectedTypeCode(selectedFilter);
				});
				$(document).on('handleTransactionSavedFilterClick', function(event) {
					me.handleTransactionSavedFilterClick();
				});
				$(document).on("datePickPopupSelectedDate",function(event,filterType,dates){
					if(filterType=="postingDate"){
						me.datePickerSelectedDate=dates;
						me.postingDateFilterVal = me.dateRangeFilterVal;
						me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
						$('#entryDataPicker').val($('#postingDate').val());
						me.handlePostingDateChange(me.dateRangeFilterVal);
						posting_date_opt = ' (' + me.postingDateFilterLabel +') ';
					}else if(filterType=="valueDate"){
						me.datePickerSelectedDateValue=dates;
						me.valueDateFilterVal = me.dateRangeFilterVal;
						me.valueDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleValueDateChange(me.dateRangeFilterVal);
					}
				});
				$(document).on('triggerSetDataForFilter', function() {
					me.setDataForFilter();
				});

        $(document).on('triggercheckUnCheckMenuItems',function(event, fieldName, fieldVal) {
					me.checkUnCheckMenuItems(fieldName, fieldVal)
				});
				
				if(Ext.isEmpty(widgetFilterUrl)){
					me.updateFilterConfig();
					me.updateAdvFilterConfig();
				}
				else {
					me.setWidgetFilters();
				}
					
		me.control({
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
			},
			'tranSearchSummaryView' : {
				'render' : function(panel) {
                    if (!Ext.isEmpty(objTranSearchGroupByFilterPref)) {
						me.toggleSavePrefrenceAction(false);
						me.toggleClearPrefrenceAction(true);
					}
				}
			},
			'tranSearchSummaryView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActionClick(actionName, grid, record);
				},
				'render' : function() {
					if (objTranSearchGroupByPref) {
						var objJsonData = Ext
								.decode(objTranSearchGroupByPref || {});
						objGroupByPref = objJsonData;
						if (!Ext.isEmpty(objGroupByPref)) {
							me.toggleSavePrefrenceAction(false);
							me.toggleClearPrefrenceAction(true);
						}
					}
					
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					if (objTranSearchPref) {
						var objJsonData = Ext.decode(objTranSearchPref);
                        if (!Ext.isEmpty(objJsonData.d.preferences) && Ext.isEmpty(widgetFilterUrl)) {
                            if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
                                if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}
					var advFilterJson;
                    if (!Ext.isEmpty(me.objLocalData) && !Ext.isEmpty(me.objLocalData.d)
                            && !Ext.isEmpty(me.objLocalData.d.preferences)
                            && !Ext.isEmpty(me.objLocalData.d.preferences.tempPref)
                            && !Ext.isEmpty(me.objLocalData.d.preferences.tempPref.advFilterJson)) {
                        advFilterJson = me.objLocalData.d.preferences.tempPref.advFilterJson;
                    	me.setDataForFilter(advFilterJson);
                    	me.assignSavedFilter();
                    	me.firstTime = false;
                    }
					if(me.firstTime){
						me.setDataForFilter();
					}
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}

			},
			'filterView button[itemId="clearSettingsButton"]' : {
                'click' : function() {
                    me.handleClearSettings();
                }
			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
                    me.resetSavedFilterCombobox();
					me.handleAppliedFilterDelete(btn);
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
									showTransAdvanceFilterPopup();
									me.assignSavedFilter();
							 }
			},
			'tranSearchFilterView component[itemId="transDatePicker"]' : {
							render : function() {
								$('#entryDataPicker').datepick({
											monthsToShow : 1,
											changeMonth : true,
											changeYear : true,
											minDate:dtHistoryDate,
											dateFormat :strjQueryDatePickerDateFormat,
											maxDate : me.getPreviousDate(dtSellerDate),
											rangeSeparator : ' to ',
											onClose : function(dates) {
												if (!Ext.isEmpty(dates)) {
													me.datePickerSelectedDate = dates;
													me.dateFilterVal = me.dateRangeFilterVal;
													me.postingDateFilterVal = me.dateFilterVal; 
													me.dateFilterLabel = getLabel('daterange', 'Date Range');
													me.resetSavedFilterCombobox();
													me.handleDateChange(me.dateRangeFilterVal);
													me.setDataForFilter();
													me.applyQuickFilter();									
												}
											}
								});
							}
				},
			' tranSearchFilterView' : {
				'render' : function(panel) {
					me.handleTransactionCategoryLoading();	
				        me.refreshTransactionCategories();
					var filterView = me.getFilterView();
					filterView.handleInfoToolTip();
					me.readAllAdvancedFilterCode();
					var typeCodeCombo = me.getBtnAllCats();
					if (!Ext.isEmpty(me.txnFilterName))
						typeCodeCombo.setValue(me.txnFilterName);
				},				
				'handleTransactionCategoryFilterClick' : function(btn) {
					me.doHandleTransactionCategoryFilterClick(btn);   //sss
					
				},
				'handleTransCategoryTypeCodeClick' : function(btn) {
					$("#typeCodeTextField").removeClass('requiredField');
					showTypeCodePopup();
				},
				'afterrender' : function(panel, opts) {
					panel.highlightSavedFilter(me.savePrefAdvFilterCode);
					me.updateFilterFields();
				},
				'dateChange' : function(btn) {
					me.toggleFirstRequest(false);
					me.identifier = null;
					me.isHistoryFlag = null;
					me.dateFilterVal = btn.btnValue;
					me.postingDateFilterVal = me.dateFilterVal;
					me.dateFilterLabel = btn.text;
					me.strActivityType = btn.btnValue === '12'
							? 'LATEST'
							: null;
					me.handleDateChange(me.dateFilterVal);
					me.resetSavedFilterCombobox();
					if (btn.btnValue !== '13') {
						me.setDataForFilter();
						me.applyQuickFilter();
					}
				},
				'dateRangeChange' : function(btn) {
					me.toggleFirstRequest(false);
					var dtParams = me.getDateParam('13');
					me.dateFilterFromVal = dtParams.fieldValue1;
					me.dateFilterToVal = dtParams.fieldValue2;
					me.resetSavedFilterCombobox();
					me.setDataForFilter();
					me.applyQuickFilter();
					me.toggleSavePrefrenceAction(true);
				},
				/**
				 * strFilterType can be 'all' / 'latest'
				 */
				'informationFilterClick' : function(strFilterType) {
					me.handleInformationFilterChange(strFilterType);
				},
				'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				},
				'createNewFilterClick' : function(btn, opts) {
					me.doHandleCreateNewFilterClick(btn, opts);
				},
				'moreAdvancedFilterClick' : function(btn) {
					showTypeCodePopup();
				}
			},
			'tranCategoryPopUpView[itemId="transactionCategoryPopUpView"]' : {
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
			'tranSearchSummaryView tranSearchTiltleView' : {
				'performReportAction' : function(btn, opts) {
					me.downloadReport(btn.itemId);
				}
			},
			'tranSearchSummaryView tranSearchFilterView button[itemId="btnSavePreferences"]' : {
				'click' : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
					me.toggleClearPrefrenceAction(true);
				}
			},
			'tranSearchSummaryView tranSearchFilterView button[itemId="btnClearPreferences"]' : {
				'click' : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
					me.toggleSavePrefrenceAction(false);
				}
			},
			'tooltip[itemId="tranSearchInfoToolTip"]' : {
				'beforeshow' : function(tip) {
					me.setInfoToolTipVal(tip);
				}
			},
			
			'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchAdvFilterGridView' : {
				orderUpEvent : me.orderUpDown,
				deleteFilterEvent : me.deleteFilterSet,
				viewFilterEvent : me.viewFilterData,
				editFilterEvent : me.editFilterData,
				filterSearchEvent : me.searchFilterData
			},
			'tranSearchAdvFilterPopUp[itemId="tranSearchAdvFilterPopUp"] tranSearchCreateNewAdvFilter[itemId="tranSearchCreateNewAdvFilter"]' : {
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
				}
			}
		});
	},
	setWidgetFilters : function() {
		var me = this;				
		me.txnFilter = 'all';
		me.txnFilterName = 'all';
		var fromDate = null , toDate = null;
		var objDateLbl = {
				'' : getLabel('latest', 'Latest'),
				'3' : getLabel('thisweek', 'This Week'),
            '4' : getLabel('lastweektodate', 'Last Week To Yesterday'),
				'5' : getLabel('thismonth', 'This Month'),
            '6' : getLabel('lastMonthToDate', 'Last Month To Yesterday'),
				'14' : getLabel('lastmonthonly', 'Last Month Only'),
				'8' : getLabel('thisquarter', 'This Quarter'),
            '9' : getLabel('lastQuarterToDate', 'Last Quarter To Yesterday'),
				'12' : getLabel('latest', 'Latest'),
            '11' : getLabel('lastYearToDate', 'Last Year To Yesterday'),
				'7' : getLabel('dateRange' , 'Date Range')
			};
		for (var i = 0; i < arrFilterJson.length; i++) {
			if (arrFilterJson[i].field === 'postingDate') {
				if(arrFilterJson[i].btnValue === '13'){
					arrFilterJson[i].btnValue = '7';
				}
				me.dateFilterLabel = objDateLbl[arrFilterJson[i].btnValue];
				me.dateFilterVal = arrFilterJson[i].btnValue;
				if (me.dateFilterVal == '7'
					&& !Ext.isEmpty(arrFilterJson[i].value1)){
					fromDate = Ext.Date.parse(arrFilterJson[i].value1, 'Y-m-d');
					toDate = Ext.Date.parse(arrFilterJson[i].value2, 'Y-m-d');
					me.datePickerSelectedDate = [fromDate, toDate];
				}
				
			}else 
			if (arrFilterJson[i].field === 'typecodeset'){
				me.widgetTypeCodeSet = true;
				me.txnFilterName = arrFilterJson[i].value2;
				me.txnFilter = arrFilterJson[i].value1;
				$("#typeCodeSet").val(arrFilterJson[i].value1);
				$("#typeCodeSet").multiselect("refresh");
			}else 
				if (arrFilterJson[i].field === 'typecode'){
					me.txnFilterName = arrFilterJson[i].value2;
					me.txnFilter = arrFilterJson[i].value1;
					$('#typeCode').val(arrFilterJson[i].value1);
				}else
			if(arrFilterJson[i].field === 'account'){
				if (!Ext.isEmpty(arrFilterJson[i].value1)){
					strWidgetAccounts =  arrFilterJson[i].value1;
				}
			}else if(arrFilterJson[i].field === 'amount'){
					me.setAmounts(arrFilterJson[i].operator, arrFilterJson[i].value1, arrFilterJson[i].value1);
			}else if(arrFilterJson[i].field === 'debitCreditFlag'){
				if(arrFilterJson[i].value1 === 'C'){
					$("input[type='checkbox'][id='creditCheckBox']").prop('checked', true);
				}					
				if(arrFilterJson[i].value1 === 'D'){
					$("input[type='checkbox'][id='debitCheckBox']").prop('checked', true);
				}
			}
		}
		me.setDataForFilter();
	},
	doDeleteTransactionCategoryGridRecord : function(event, filterCodeDesc, filterCode) {
	var me = this;
	var objFilterName;
	var preferenceArray = [];
	var savedFilterCombobox = me.getFilterView().down('combo[itemId="allCat"]');
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
		savedFilterCombobox.setValue(getLabel('all','All'));
	}
	me.deleteSavedTypeCode(filterCode);
},
deleteSavedTypeCode : function(filterCode){
	var me = this;
	var preferenceArray = [];
	var rowIndex = -1;
	var grid = me.getTranCategoryEntryGridView();
	var args = {
		//'grid' : grid
	};
	Ext.Ajax.request({
		url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
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
						'tranSearchSummaryCategories',
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
	handleTransactionSavedFilterClick:function(){
        var me = this;
		  if(typeof me.firstTime!=='undefined')
		  {
				$('#postingDate').val(me.postDate); 
				if (!Ext.isEmpty(me.postingDateFilterLabel)) {
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date')
							+ " (" + me.dateFilterLabel + ")");
					
					$('#entryDataPicker').val(me.postDate); 
					if (!Ext.isEmpty(me.dateFilterLabel)) {					
						me.getDateLabel().setText(getLabel('postingDate', 'Posting Date') + " ("
						+me.dateFilterLabel + ")");
					}
					
		       }
         }						
	},
	handleClearSettings:function()
		{
		var me=this;
		var objGroupView = me.getGroupView();
		me.savedFilterVal = '';
		me.savePrefAdvFilterCode = '';
        me.resetSavedFilterCombobox();
        me.dateFilterVal = defaultDateIndex;
        me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
        me.handleDateChange(me.dateFilterVal);      
				
		me.doHandleDeSelectTypeCode();	
		me.filterApplied = 'Q';
		me.filterData=[];
		me.resetAllFields();
		me.setDataForFilter();
		objGroupView.refreshData();
		
	},
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = me.getDateHandler();
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
	},
	updateFilterFields:function(){
		var me=this;
		me.handleDateChange(me.dateFilterVal);
		me.handlePostingDateChange(me.dateFilterVal);
		var savedFilterCombo = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombo.setValue(me.advFilterCodeApplied);
	},	
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
	handleMoreAdvFilterSet : function(btnId) {
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
		this.sendUpdatedOrderedJsonToDb(store);
	},
	sendUpdatedOrderedJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
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
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		
		
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
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
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
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
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;

		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
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
	amountTypeChange : function(btn) {
		var operator = '';
		var me = this;		
		me.amountFilterVal = btn.btnValue;
		me.amountFilterLabel = btn.text;
		
		if (!Ext.isEmpty(me.amountFilterLabel)) {
			$('label[for="AmountLabel"]').text(getLabel('amount',
					'Amount')
					+ " (" + me.amountFilterLabel + ")");
		}
		switch (btn.btnId) {
			case 'btnLtEqTo' :
				// Less Than Equal To
				operator = 'lte';
				break;
			case 'btnGtEqTo' :
				// Greater Than Equal To
				operator = 'gte';
				break;
			case 'btnEqTo' :
				// Equal To
				operator = 'eq';
				break;
			case 'btnAmtRange' :
				// AmountRange
				operator = 'bt';
				break;
			case 'btnLt' :
				// Less Than
				operator = 'lt';
				break;
			case 'btnGt' :
				// Greater Than
				operator = 'gt';
				break;					
		}
		
		selectedAmountType={
					operator:operator			
				};
		
	},
	handleSearchAction : function(btn) {
		var me = this;
		me.doSearchOnly();
	},
	doSearchOnly : function() {
		var me = this;
		me.txnFilterName = $("#typeCodeSet option:selected").text();
		me.bIsApplyAdvanceFilter = true;
		me.applyAdvancedFilter();
		me.bIsApplyAdvanceFilter=false;
	},
		
	handleSavedFilterClick : function() {
		var me = this;
		me.bIsAdvanceSavedFilter = true;
        me.savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;
		$('#postingDate').val($('#entryDataPicker').val());     
		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
            filterCodeRef.val(me.savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
        if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(me.savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
        me.filterCodeValue = me.savedFilterVal;
        me.getSavedFilterData(me.savedFilterVal, this.populateSavedFilter,  applyAdvFilter);
	},	
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');		
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.doSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
		}
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
        var filterCodeVal = null;
        // if (Ext.isEmpty(me.filterCodeValue)) {
        var FilterCode = $("#filterCode").val();
        if (Ext.isEmpty(FilterCode)) {
            paintError('#advancedFltrErrorDiv', '#advancedFilterErrMessage', getLabel('filternameMsg',
                    'Please Enter Filter Name'));
            markRequired('#filterCode');
            return;
        }
        else {
            hideErrorPanel("advancedFltrErrorDiv");
            me.filterCodeValue = FilterCode;
            me.savedFilterVal = FilterCode;
            filterCodeVal = me.filterCodeValue;
        }
        // } else {
        // filterCodeVal = me.filterCodeValue;
        // }
        me.savePrefAdvFilterCode = filterCodeVal;
        // if (Ext.isEmpty(filterCodeVal)) {
        // paintError('#advancedFltrErrorDiv', '#advancedFilterErrMessage',
        //            getLabel('filternameMsg', 'Please Enter Filter Name'));
        //    return;
        //} else {
        hideErrorPanel("advancedFltrErrorDiv");
        me.postSaveFilterRequest(filterCodeVal, callBack);
        //}
	},
	
	postDoSaveAndSearch : function() {
		var me = this;
		objGroupView = null, savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
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
							$('#advFilterPopup').dialog('close');
							fncallBack.call(me);
							//filterGrid.getStore().reload();
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},

	reloadFilters: function(store){
		store.load({
					callback : function() {
						var storeGrid = tranSearchAdvFilterGridStore();
						store.loadRecords(
							storeGrid.getRange(0, storeGrid
											.getCount()), {
								addRecords : false
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
	addColumnsToSortCombos : function() {
		var me = this;
		var sortByComboRef = me.getSortByCombo();
		var columns = [];

		var arrSortByPaymentFields = [{
			"colId" : "postingDate",
			"colDesc" : getLabel("lblpostingDate","Posting Date")
		}, {
			"colId" : "valueDate",
			"colDesc" : getLabel("lblvalueDate","Value Date")
		}, {
			"colId" : "amount",
			"colDesc" : getLabel("lblamount","Amount")
		}, {
			"colId" : "typeCode",
			"colDesc" : getLabel("lbltypeCode","Type Code")
		}];

		var columnPreferenceArray = arrSortByPaymentFields;
		columns.push({
					'colId' : "None",
					'colDesc' : "None"
				});

		for (var index = 0; index < columnPreferenceArray.length; index++) {
			columns.push(columnPreferenceArray[index]);
		}

		if (!Ext.isEmpty(sortByComboRef)) {
			sortByComboRef.getStore().loadData(columns);
		}
	},
	closeFilterPopup : function(btn) {
		var me = this;
		$('#advFilterPopup').dialog("close");
		//me.getAdvanceFilterPopup().close();
	},
	postingDateChange : function(btn, opts) {
		var me = this;
		me.postingDateFilterVal = btn.btnValue;
		me.postingDateFilterLabel = btn.text;
		me.handlePostingDateChange(btn.btnValue);
	},
	valueDateChange : function(btn, opts) {
		var me = this;
		me.valueDateFilterVal = btn.btnValue;
		me.valueDateFilterLabel = btn.text;
		me.handleValueDateChange(btn.btnValue);
	},
	handleAmountChange : function(btn) {
		var me = this;
		var fromAmountLabel = me.getAmountFromLabel();
		var toAmountLabel = me.getAmountToLabel();
		if (index == 'bt') {
			me.getAmountNoField().hide();
			me.getAmountRange().show();
		} else {
			me.getAmountRange().hide();
			me.getAmountNoField().show();
		}
	},
	
		handlePostingDateChange:function(index){
		var me = this;
		var dateToField;
		var datePickerRef=$('#postingDate');
		var objDateParams = me.getDateParam(index,null);
        me.postingDateFilterLabel = objDateParams.label;
        posting_date_opt = " (" + me.postingDateFilterLabel + ")";
		if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
					'Posting Date')
					+ " (" + me.postingDateFilterLabel + ")");
		}
        if (!Ext.isEmpty(me.postingDateFilterLabel) && me.bIsApplyAdvanceFilter) {                 
			me.getDateLabel().setText(getLabel('postingDate', 'Posting Date') + " ("
			+ me.postingDateFilterLabel + ")");
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
					$('#postingDate').datepick('setDate', vFromDate);
				} else {
					$('#postingDate').datepick('setDate', [vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateLabel :  objDateParams.label,
					dateIndex : index
				};
			} else {
				if (index === '1' || index === '2') {
						datePickerRef.datepick('setDate', vFromDate);
				} else {
					$('#postingDate').datepick('setDate', [vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
					dateLabel :  objDateParams.label,
					dateIndex : index
				};
			}
			me.dateFilterFromVal = objDateParams.fieldValue1;
			me.dateFilterToVal = objDateParams.fieldValue2;
			if(me.bIsApplyAdvanceFilter)
				me.handleDateSync('A', me.getDateLabel().text, " (" + me.postingDateFilterLabel + ")", datePickerRef);
	},
	handleValueDateChange:function(index){
		var me = this;
		var dateToField;
		var type = 'Value'
		var objDateParams = me.getDateParam(index,type);
        me.valueDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.valueDateFilterLabel)) {
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
					$('#valueDate').datepick('setDate', vFromDate);
				} else {
					$('#valueDate').datepick('setDate', [vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedValueDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
                    dateLabel :  objDateParams.label,
                    dateIndex : index
				};
			} else {
				if (index === '1' || index === '2') {
						$('#valueDate').datepick('setDate', vFromDate);
					}else{
					$('#valueDate').datepick('setDate', [vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedValueDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField,
                    dateLabel :  objDateParams.label,
                    dateIndex : index
				};
			}
	},
	filterOtherThenSortByComboStore : function(selectedColumnId) {
		var me = this;
		var firstThenSortByComboRef = me.getFirstThenSortByCombo();
		var secondThenSortByComboRef = me.getSecondThenSortByCombo();
		if (selectedColumnId != "None") {
			var sortByComboRef = me.getSortByCombo();
			var currentColumnId = null;
			var currentRecord = null;
			var filteredRecords = [];
			if (!Ext.isEmpty(sortByComboRef)) {
				var comboStoreRef = sortByComboRef.getStore();
				comboStoreRef.each(function(record) {
							currentRecord = record;
							currentColumnId = currentRecord.get('colId');
							if (currentColumnId !== selectedColumnId) {
								filteredRecords.push(currentRecord);
							}
						});

				if (!Ext.isEmpty(firstThenSortByComboRef)) {
					firstThenSortByComboRef.reset();
					firstThenSortByComboRef.setDisabled(false);
                    firstThenSortByComboRef.getStore().loadData(filteredRecords);
				}
				if (!Ext.isEmpty(secondThenSortByComboRef)) {
					secondThenSortByComboRef.reset();
                    secondThenSortByComboRef.getStore().loadData(filteredRecords);
				}
			}
		} else {
			firstThenSortByComboRef.reset();
			secondThenSortByComboRef.reset();
			firstThenSortByComboRef.setDisabled(true);
			secondThenSortByComboRef.setDisabled(true);
		}
	},
	filterSecondThenSortByComboStore : function(selectedColumnId) {
		var me = this;
		var firstThenSortByComboRef = me.getFirstThenSortByCombo();
		var secondThenSortByComboRef = me.getSecondThenSortByCombo();
		if (selectedColumnId != "None") {
			var currentColumnId = null;
			var currentRecord = null;
			var filteredRecords = [];
			if (!Ext.isEmpty(firstThenSortByComboRef)) {
				var comboStoreRef = firstThenSortByComboRef.getStore();
				comboStoreRef.each(function(record) {
							currentRecord = record;
							currentColumnId = currentRecord.get('colId');
							if (currentColumnId !== selectedColumnId) {
								filteredRecords.push(currentRecord);
							}
						});

				if (!Ext.isEmpty(secondThenSortByComboRef)) {
					secondThenSortByComboRef.reset();
					secondThenSortByComboRef.setDisabled(false);
                    secondThenSortByComboRef.getStore().loadData(filteredRecords);
				}
			}
		} else {
			secondThenSortByComboRef.reset();
			secondThenSortByComboRef.setDisabled(true);
		}
	},
	doHandleCreateNewFilterClick : function(btn) {
		var me = this;
		me.filterMode = 'ADD';
		var filterDetailsTab = null;
		var saveSearchBtn = null;
		var objTabPanel = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.filterCodeValue = null;
			filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('createNewFilter',
					'Create New Filter'));
			saveSearchBtn = me.getSaveSearchBtn();
			if (saveSearchBtn) {
				saveSearchBtn.show();
			}
			var objCreateNewFilterPanel = me.getCreateNewFilter();
			me.handleAdvanceFilterCleanUp();
			me.addColumnsToSortCombos();
			me.addAccountType();

		} else {
			me.createAdvanceFilterPopup();
		}

		me.objAdvFilterPopup.show();
		me.objAdvFilterPopup.center();
		objTabPanel = me.getAdvanceFilterTabPanel();
		objTabPanel.setActiveTab(1);
	},
	createAdvanceFilterPopup : function() {
		var me = this;
		if (Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup = Ext.create(
					'GCP.view.tranSearchAdvFilterPopUp', {
						itemId : 'tranSearchAdvFilterPopUp',
						filterPanel : {
							xtype : 'tranSearchCreateNewAdvFilter',
							itemId : 'tranSearchCreateNewAdvFilter',
							margin : '4 0 0 0'
						}
					});

			me.addColumnsToSortCombos();
			me.addAccountType();
		}
	},
	addAccountType : function(){
		var me = this;
		var objAdvFilter = me.getCreateNewFilter();
			Ext.Ajax.request({
						url : 'services/userseek/accountTypeSeek.json',
						method : 'GET',
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var data = responseData.d.preferences;
							if(!Ext.isEmpty(objAdvFilter))
								objAdvFilter.loadAccountTypeMenu(data);
						},
						failure : function() {
							// console.log("Error Occured - Addition Failed");

						}

					});
	},
/*		loadTypeCodeSetGrid : function()
		{
		var me = this;
		$('#typeCodeSetList').empty();
		//var grid = me.getTranCategoryGridView();
		var grid = me.getTranCategoryEntryGridView();
		Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					$('#msSavedFilterTypeCode').empty();
					$('#msSavedFilterTypeCode').append($('<option>', { 
						value: '',
						text : 'Select',
						selected : false
						}));
					if(pref.length > 0){
						$.each(pref,function(index,item){
							$('#msSavedFilterTypeCode').append($('<option>', { 
								value: pref[index].txnCategory,
								text : pref[index].txnCategory,
								selected : pref[index].txnCategory === selectedFilter ? true : false
								}));
						});
					 }
					$('#msSavedFilterTypeCode').multiselect('refresh');
					var jsonData = JSON.parse(data.preference);
					me.transactionCategoryStoreData =  jsonData;
					if (grid) {
						grid.store.removeAll(true);
						grid.loadRawData(pref);
					}
				}
			}
		});
		/*var panel = Ext.create('GCP.view.tranCategoryGridView', {	
								transactionCategoryStoreData : me.transactionCategoryStoreData,		
								renderTo : 'typeCodeSetList'
							});*/
		
	//},
	loadTypeCodeSetEntryGrid : function(mode)
	{
		//if(mode === 'ADD')
		//{
			//$('#typeCodeSetEntryList').empty();
			$('#typeCodeErrorPanelList').empty();
		//}
		if(Ext.isEmpty(filterEntryGrid)){
		filterEntryGrid = Ext.create('GCP.view.tranCategoryEntryGridView', {								
								renderTo : 'typeCodeSetEntryList'
							});
		}			
	},
	doHandleSaveTypeCodeClick : function(txtFieldVal,strMode)
	{
		var me = this;
		var grid = me.getSavedTxnCategories();
		var mode = strMode;
		var errorMsg = null;
        var txtField = $("input[type='text'][id='typeCodeTextField']").val();
		var availableTypeCode = false;
		var data = me.getTransactionCategoryFormData(txtFieldVal);
        var arrError = [];
        if(strMode === 'ADD')
        {
			if (me.validateEntryForm(txtFieldVal,mode, availableTypeCode)) {
				//data = me.getTransactionCategoryFormData(txtFieldVal);
				me.doSaveTransactionCategory(grid, data);
				$("#typeCodeErrorPanelList").text('');
				$('#typeCodeSetPopup').dialog("close");
			}
			else
			{
				if(me.availableTypeCode){
					errorMsg = getLabel('typeCodeError','Type Code Set is already exists');
					$("#typeCodeSetErrorDiv").removeClass("ui-helper-hidden");
					$("#typeCodeSetErrorMessage").text(errorMsg);
				}
			}
        }
        else
        {
            data = me.getTransactionCategoryFormData(txtFieldVal);
            if(!Ext.isEmpty(data.typeCodes)&& !Ext.isEmpty(txtField))
                me.doSaveTransactionCategory(grid, data);
            $("#typeCodeErrorPanelList").text('');              
        }
        if(Ext.isEmpty(data.typeCodes)){
                    errorMsg = getLabel('typeCodeErrorLabel','Type Code selection is mandatory!');
					$("#typeCodeSetErrorDiv").removeClass("ui-helper-hidden");
					$("#typeCodeSetErrorMessage").text(errorMsg);
					arrError.push({
		                "errorCode" : "",
		                "errorMessage" : getLabel('typeCodeErrorLabel',
		                'Type Code selection is mandatory!')
		            });
				}
        if( Ext.isEmpty(txtField)) {
            markRequired($('#typeCodeTextField'));
            $("#typeCodeSetErrorDiv").removeClass("ui-helper-hidden");
            $("#typeCodeSetErrorMessage").text(errorMsg);
            arrError.push({
                "errorCode" : "",
                "errorMessage" : getLabel('filternameMsg',
                'Please Enter Type Code Set Name')});                  
            }
        if(!Ext.isEmpty(arrError))
        {
            paintErrors('typeCodeSetErrorDiv','typeCodeSetErrorMessage',arrError)
        }
		else
		{
				/*data = me.getTransactionCategoryFormData(txtFieldVal);
				me.doSaveTransactionCategory(grid, data);
				$("#typeCodeErrorPanelList").text('');*/
				$('#typeCodeSetPopup').dialog("close");
		me.txnFilterName = txtFieldVal;
		me.handleTransactionCategoryLoading();
		}
	},
	
	getSavedTxnCategories : function(){
		var returnArray = [];
		
		Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
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
		validateEntryForm : function(nickNameField,strMode, availableTypeCode) {
		var me = this;		
		var grid = me.getTranCategoryEntryGridView();
		var transactionCategoryGrid = me.getTranCategoryGridView();
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
				&& strMode !== 'VIEW'){
			retValue = false;
			me.availableTypeCode = true;
		}
		return retValue;
	},
		getTransactionCategoryFormData : function(nickNameField) {
		var me = this;
		var grid = me.getTranCategoryEntryGridView();
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
		/* -----------Transaction Category Pop Up handling starts here---------- */
	handleTransactionCategoryLoading : function() {
		var me = this;
		me.preferenceHandler
				.readModulePreferences(
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						me.postHandleTransactionCategoryLoading, null, me, true);
	},	
	refreshTransactionCategories : function() {
		var me = this;
		var grid = me.transactionCategoryPopup ? me.transactionCategoryPopup
				.down('grid[itemId="transactionCategoryGridView"]') : null;
		Ext.Ajax.request({
			url : 'services/userpreferences/tranSearchSummaryCategories/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
					if (grid) {
						grid.store.removeAll(true);
						grid.loadRawData(pref);
					}
				}
			}
		});

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
		}	
	},
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(objTranSearchGroupByFilterPref)) {
			var objJsonData = objTranSearchGroupByFilterPref;
			if (!Ext.isEmpty(objJsonData.advFilterCode)) {
				var advFilterCode = objJsonData.advFilterCode;
				if (!Ext.isEmpty(advFilterCode)) {
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
	
	handleDateChange : function( index, bClearBtnClicked ) {
				var me = this;	
				var dateToField;
				var objDateParams = me.getDateParam( index );	
		// Choosing date reference - whether advance screen posting date or Quick section posting date
		// If Clicks on Clear button or selecting saved filter from Advance filter screen 
		// then 'postingDate' else 'entryDataPicker'(Posting Date of quick filter)
		var datePickerRef= (bClearBtnClicked || me.bIsAdvanceSavedFilter) ? $('#postingDate') : $('#entryDataPicker');
		
		// Set the Quick section's Posting Date label only if operation happening on quick section
		if (!Ext.isEmpty(me.dateFilterLabel) && !me.bIsAdvanceSavedFilter) {					
			me.getDateLabel().setText(getLabel('postingDate', 'Posting Date') + " (" + me.dateFilterLabel + ")");
				}
				var vFromDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue1, 'Y-m-d' ),strExtApplicationDateFormat );
				var vToDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue2, 'Y-m-d' ),strExtApplicationDateFormat );
				
				if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate)
			} else {				
				datePickerRef.datepick('setDate', [vFromDate, vToDate])
			}
			} else {
			if (index === '1' || index === '2') {							
				datePickerRef.datepick('setDate', vFromDate)
					} else {						
						datePickerRef.datepick('setDate', [vFromDate, vToDate])
					}
			 }
				if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="PostingDateLabel"]').text(
				getLabel('postingDate', 'Posting Date') + " (" +  me.dateFilterLabel + ")");
				}
				me.postIndex=index;
				
				if (objDateParams.operator == 'eq')
					dateToField = "";
				else
					dateToField = vToDate;
				
				selectedPostingDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : dateToField,
				dateLabel : objDateParams.label ,
				dateIndex : index
					};
				me.dateFilterFromVal = objDateParams.fieldValue1;
				me.dateFilterToVal = objDateParams.fieldValue2;
				
		// Sync the Posting Date of Quick and Advance section only if neither CLEAR button click nor 
		// SAVED FILTER selected on Advance Filer popup screen
		if(!bClearBtnClicked && !me.bIsAdvanceSavedFilter){
		}else{
			me.postingDateRef = datePickerRef;
		}
			me.handleDateSync('Q', me.getDateLabel().text, " (" + me.dateFilterLabel + ")", $('#entryDataPicker'));
			},
			
			handleDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="PostingDateLabel"]')
				: me.getDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#postingDate')
				: $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('postingDate', sourceToolTipText);
				selectedEntryDate = {};
			} else {
				labelToChange.setText(sourceLable);
				
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
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
		var strSqlDateFormat = 'Y-m-d';
		/**
		 * 7 : Date Range, 12 : Latest
		 */
		var strDateFilterValue = strFilterType === 'latestlastLogin' ? '13' : '12';
		var strDateFilterLabel = strFilterType === 'latestlastLogin' ? 
						getLabel('latestLogin', 'Latest since last login') 
						: getLabel('latest', 'Latest');


		me.toggleFirstRequest(false);
		me.identifier = null;
		me.isHistoryFlag = null;
		me.dateFilterVal = strDateFilterValue;
		me.dateFilterLabel = strDateFilterLabel;
		me.handleDateChange(me.dateFilterVal);
		if (strDateFilterValue === '13') {
			fromDate = new Date(Ext.Date.parse(dtLastLogin, dtFormat));
			toDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
			
			me.dateFilterFromVal = Ext.Date.format(fromDate, strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(toDate, strSqlDateFormat);
			
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
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var todayDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';label = '';
		var retObj = {};
		var dtJson = {};
		if(type != 'Value' || index == '2')
		date = objDateHandler.getYesterdayDate(date);
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				label = 'Yesterday';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
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
                // Last Week To Yesterday
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
                label = 'Last Week To Yesterday';
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
                // Last Month To Yesterday
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
                label = 'Last Month To Yesterday';
				break;
			case '7' :
                label = 'Date Range';
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				}else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
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
				label = 'This Quarter';
				break;
			case '9' :
                // Last Quarter To Yesterday
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
                label = 'Last Quarter To Yesterday';
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
                // Last Year To Yesterday
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
                label = 'Last Year To Yesterday';
				break;
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month Only';
				break;
			case '12':
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
				var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
				fieldValue1 = Ext.Date.format(fromDate,strSqlDateFormat);
				fieldValue2 = Ext.Date.format(objDateHandler.getYesterdayDate(toDate),strSqlDateFormat);							
				operator = 'bt';
						label = 'Latest';
						break;
			case '13' :
				label = 'Date Range';
				if(type=='Value')
				{
					if (me.datePickerSelectedDateValue.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDateValue[0],strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					}else if (me.datePickerSelectedDateValue.length == 2) {
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
		}
		// comparing with client filter condition

		if (!me.isFirstRequest
				&& Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		return retObj;
	},
	/* -----------Transaction Category Pop Up handling starts here---------- */	
	postHandleTransactionCategoryLoading : function(data, args, isSuccess) {
		var me = this;
		var filterView = me.getFilterView();	
		var	savedTypeCodeCombobox;
		var arrData = (data && data.preference)
				? JSON.parse(data.preference)
				: null;
		if (!Ext.isEmpty(arrData)) {
			if (filterView)
				filterView.addTransactionCategories(arrData, me.txnFilterName);
				
			var typeCodeCombo = me.getBtnAllCats()

			if (!Ext.isEmpty(typeCodeCombo)) {
				var store = typeCodeCombo.getStore();
				store.removeAll(true);
				store.loadData(arrData)
				store.each(function(record)   
			  	{   
		      		if(record.get('txnCategory') === me.txnFilterName){
		      			var comboData = record.data;
		      			me.txnFilter = comboData.typeCodes;
						me.txnFilterName = comboData.txnCategory;
						me.filterApplied = 'Q';
						me.advTypeCode = [];
						me.toggleSavePrefrenceAction(true);
						me.identifier = null;
						me.isHistoryFlag = null;
						$("#typeCodeSet option").filter(function() {
						    return this.text == me.txnFilterName; 
						}).attr('selected', true);
						$("#typeCodeSet").multiselect("refresh");
						me.isHistoryFlag = null;
						savedTypeCodeCombobox = me.getFilterView().down('combo[itemId="allCat"]');
						savedTypeCodeCombobox.setValue(me.txnFilterName);
						setTypeCodeSetValues('#typeCodeSet');
						selectedFilter = me.txnFilterName;
						me.setDataForFilter();
						me.applyQuickFilter();
		      		}
			  	});
			}
		}	
	},
	doHandleTransactionCategoryFilterClick : function(btn) {
		var me = this;
		me.txnFilter = btn.value;
		me.txnFilterName = btn.rawValue;
		selectedFilter = btn.rawValue;
		me.filterApplied = 'Q';
		me.advTypeCode = [];
		me.toggleSavePrefrenceAction(true);
		me.identifier = null;
		me.isHistoryFlag = null;
		me.resetSavedFilterCombobox();
		me.setDataForFilter();
		me.applyQuickFilter();	
		me.handleSyncTxnCategoryFilter(btn);
	
	},
	resetSavedFilterCombobox : function() {
        var me = this;
        var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
        if (savedFilterCombobox)
            savedFilterCombobox.setValue('');
	},	
	doDeleteTransactionCategory : function(grid, rowIndex) {
		var me = this;
		var store = grid ;
		var preferenceArray = [];
		var args = {
			'grid' : grid
		};
		if (store) {
			deletedCat = store.getAt(rowIndex);
			deletedCat = deletedCat.get('txnCategory');
			store.remove(store.getAt(rowIndex));
		}

		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						preferenceArray.push(rec.raw);
					});
		}
		args['data'] = preferenceArray;
		me.preferenceHandler
				.saveModulePreferences(
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleDoDeleteTransactionCategory, args, me,
						false);
	},
	postHandleDoDeleteTransactionCategory : function(data, args, isSuccess) {
		var me = this;
		var grid = args['grid'];
		var objGroupView = me.getGroupView();
		
		var filterView = me.getFilterView();
		if (filterView) {
			if (me.getTxnFilterName() == deletedCat) {
				me.setTxnFilter('all');
				me.setTxnFilterName('all');
				me
						.getBtnAllCats()
						.addCls('cursor_pointer xn-account-filter-btnmenu xn-custom-heighlight');
			}
		
		}
		me.handleTransactionCategoryLoading();
	},
	doTransactionCategoryOrderChange : function(grid,rowIndex,direction) {
		var me = this;
		var store = grid.getStore();
		var record = grid.getStore().getAt(rowIndex);
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
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleTransactionCategoryChange, args, me, true);
	},
	postHandleTransactionCategoryChange : function(data, args, isSuccess) {
		var me = this;
		var grid = args['grid'];
		var filterView = me.getFilterView();
		if (filterView) {
			filterView.addTransactionCategories(args['data'], me.txnFilterName);
		}
	},
	doSaveTransactionCategory : function(grid, record) {
		var me = this;
		var preferenceArray = [];
		var isRecordAdded = false;
		var args = {
			//'grid' : grid
		};
		if (!Ext.isEmpty(grid)) {
			grid.forEach(function(rec) {
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
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						null, args, me, false);
		
	},
	
	doHandleShowSelectedTypeCode : function(selectedFilter) {
		var me = this;
		var typeCodeCombo = me.getBtnAllCats()
		var store = typeCodeCombo.getStore();
		var preferenceArray = [];
		var rowIndex = -1; 
		
		if (store && typeof selectedFilter !== 'undefined')
		{
			var recordToDel = null;
			 store.each(function(record)   
			  {   
		      	if(!Ext.isEmpty(record) && 
					(record.get('txnCategory') === selectedFilter)){
		      		recordToDel = record;
		      		rowIndex = store.indexOf(record);
		      		if(rowIndex >= 0){
		      			
						me.doDeleteTransactionCategory(store, rowIndex);
		      		}
		      	}
			  });
			 
		}
	},
	doHandleDeSelectTypeCode : function(){
			var me = this
			me.getBtnAllCats().setValue('');
			me.txnFilter='';
			selectedFilter = '';
			var grid = me.getTranCategoryEntryGridView();
			if(!Ext.isEmpty(grid))
				grid.getSelectionModel().deselectAll();
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
		//var nickNameTextField = record.get('txnCategory')
		var nickNameTextField = record.txnCategory;
		var grid = me.getTranCategoryEntryGridView();
		var store = grid ? grid.getStore() : null;
		//var arrTypeCode = record.get('typeCodes');
		var arrTypeCode = record.typeCodes;
		
		if (!Ext.isEmpty(nickNameTextField)
				&& nickNameTextField != 'Select') {
				$("#typeCodeTextField").attr('value', nickNameTextField || '');
		}
		
		  grid.typCodeArr= arrTypeCode ;
		  grid.setLoading(true);
		 Ext.Ajax.request({
					url : 'services/userseek/typecodelist?$top=-1',
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var recordsToSelect = [];
						var arrTypeCodes = me.manageTypeCodeJsonObj(data.d.preferences);
						if (!Ext.isEmpty(arrTypeCodes))
							store.loadRawData(arrTypeCodes);
							var arrTypeCode=grid.typCodeArr;
							if (!Ext.isEmpty(arrTypeCode)) {
								grid.store.each(function(rec) {
                                    if (Ext.Array.contains(arrTypeCode, rec.get('CODE')))                                           
                                    {
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

				})
	},
	manageTypeCodeJsonObj: function (jsonObject) {
		var jsonObj ='';
		if(jsonObject  instanceof Object ==false)
			jsonObj =JSON.parse(jsonObject);
		if(jsonObject  instanceof Array)
			jsonObj =jsonObject;
		for (var i = 0; i < jsonObj.length; i++) {
			jsonObj[i].DESCR =  getLabel(jsonObj[i].CODE,jsonObj[i].DESCR);
		}
		if(jsonObject  instanceof Object ==false)
			jsonObj = JSON.stringify(jsonObj)
		return jsonObj;
	},
	doClearTransactionCategoryFormFields : function(mode,grid,record) {
		var me = this;		
		var nickNameTextField = record.txnCategory
		//var grid = me.getTransactionCategoryEntryGridView();
		var store = grid ? grid.getStore() : null;
		var strLabel = mode === 'VIEW'
				? getLabel('update', 'Update')
				: getLabel('save', 'Save');

		if (!Ext.isEmpty(nickNameTextField)) {
			$("#typeCodeTextField").removeAttr("disabled", "disabled"); 
			$("#typeCodeTextField").attr('value', '');
		}
		$("#btnSave button").text( strLabel );

		if (!Ext.isEmpty(store)) {
			store.each(function(record) {
						record.set('typeCodeCheckbox', false);
					});
		}
	},
	/* -----------Transaction Category Pop Up handling ends here---------- */
	
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
        me.advFilterData = {};
        me.filterData = me.getQuickFilterQueryJson();
        var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
        var reqJsonInQuick = me.findInQuickFilterData(me.filterData, 'accountId');
        if (!Ext.isEmpty(reqJsonInQuick)) {
            arrQuickJson = me.filterData;
            if (me.accountFilter == '(ALL)')
                me.filterData = me.removeFromQuickArrJson(arrQuickJson, 'accountId');
        }
        reqJsonInQuick = me.findInAdvFilterData(objJson, 'postingDate');
        if (!Ext.isEmpty(reqJsonInQuick)) {
            arrQuickJson = me.filterData;
            arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "postingDate");
            me.filterData = arrQuickJson;
        }
        reqJsonInQuick = me.findInAdvFilterData(objJson, 'typeCode');
        if (!Ext.isEmpty(reqJsonInQuick)) {
            arrQuickJson = me.filterData;
            arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "typeCode");
            me.filterData = arrQuickJson;
        }
        var sortByData = getAdvancedFilterSortByJson();
        if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
            me.advSortByData = sortByData;
        }
        else {
            me.advSortByData = [];
        }
        // removing sort by fields from adv filter json
        // me.advFilterData = me.removeSortByFieldsFromAdvArrJson(objJson , sortByData);
        objJson = objJson.filter(function(a) {
            return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy")
        });
        for (var i = 0; i < sortByData.length; i++) {
            objJson.push(sortByData[i]);
        }
        me.advFilterData = objJson;

        var filterCode = $("input[type='text'][id='filterCode']").val();
        if (!Ext.isEmpty(filterCode))
            me.advFilterCodeApplied = filterCode;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		// For Intraday activity, date filter should not applied
		//if (me.dateFilterVal != 1)
		
		if (!Ext.isEmpty(index)) {
			if(objDateParams.fieldValue1 == '' && objDateParams.fieldValue2 == ''){
		jsonArray.push({
			paramName : 'postingDate',
					paramIsMandatory : true,
					paramValue1 : Ext.util.Format.date(selectedPostingDate.fromDate, 'Y-m-d'),
					paramValue2 : (!Ext.isEmpty( selectedPostingDate.toDate))? Ext.util.Format.date(selectedPostingDate.toDate, 'Y-m-d'): '',
					operatorValue : selectedPostingDate.operator,
					dataType : 'D',
					paramFieldLable : getLabel('postingDate', 'Posting Date'),
					displayType : index,
					displayValue1 : selectedPostingDate.fromDate,
					dateIndex : selectedPostingDate.dateIndex
				});
			}else {
				jsonArray.push({
					paramName : 'postingDate',
					paramIsMandatory : true,
			paramValue1 : objDateParams.fieldValue1,
			paramValue2 : objDateParams.fieldValue2,
			operatorValue : objDateParams.operator,
			dataType : 'D',
			paramFieldLable : getLabel('postingDate', 'Posting Date'),
					displayType : index,
					displayValue1 : Ext.util.Format.date( Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d' ),strExtApplicationDateFormat ),
					dateIndex : selectedPostingDate.dateIndex
				});
		}
		}
		var typeCodeSet = $("select[id='typeCodeSet']").getMultiSelectValueString();
        var typeCodeSetText = $("#typeCodeSet option:selected").text();
        if (!Ext.isEmpty(typeCodeSet) && !Ext.isEmpty(typeCodeSetText) && typeCodeSetText !== 'all' && typeCodeSet !== 'all')
   	 	{
        	me.txnFilter = me.txnFilter.constructor === Array ? (me.txnFilter).join() : me.txnFilter;
			jsonArray.push({
						paramName : 'typeCodeSet',
						paramValue1 : encodeURIComponent(me.txnFilter.replace(new RegExp("'", 'g'), "\''")),
						paramValue2 : me.txnFilterName,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('typecodeset','Saved Type Code Set'),
						displayType : 6,
						displayValue1 : me.txnFilterName,
						 displayValue1 : ''
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
		var pmtCreateNewAdvFilterRef = me.getCreateNewFilter();
		me.accountFilter = '(ALL)';
		me.advTypeCode = [];
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				var fieldName = filterData[index].field;
				if(fieldName === 'Account')
					me.accountFilter = filterData[index].value1;
				else if(fieldName === 'AccountSet')
					me.accountFilter = filterData[index].value1;
				else if(fieldName === 'typeCode' || fieldName === 'typeCodeSet')
					me.advTypeCode.push(filterData[index].value1);
				else{
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk')
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
					
				case 'btamt' :
					if (isFilterApplied)
						strTemp = strTemp + ' and ';
					strTemp = strTemp + filterData[index].field + ' '
								+ ' bt ' + ' ' + '\''
								+ filterData[index].value1 + '\'' + ' and '
								+ '\'' + filterData[index].value2 + '\''
								+ ' or ' + filterData[index].field + ' '
								+ ' bt ' + ' ' + '\''
								+ (filterData[index].value2*(-1)) + '\'' + ' and '
								+ '\'' + (filterData[index].value1*(-1)) + '\'';
					isFilterApplied = true;
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
					
				case 'eqamt' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].value1;
					if (objValue != 'All') {
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}
						strTemp = strTemp + filterData[index].field + ' '
								+ ' eq ' + ' ' + '\''
								+ objValue + '\'' + ' or '
								+ filterData[index].field + ' '
								+ ' eq ' + ' ' + '\''
								+ (objValue * (-1)) + '\'';
						isFilterApplied = true;
					}
					break;
				
				case 'gt' :
				case 'lt' :
					if(isFilterApplied && (filterData[index].field ==='valueDate') && (strTemp.indexOf('valueDate')>-1)){
						strTemp = strTemp + ' or ';
					}
					else if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
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
					
				case 'gteqtoamt' :
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
					strTemp = strTemp + ')' + ' or '
					+ '(';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'';
					strTemp = strTemp + ' or ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'' + ' and ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + 0
							+ '\'';
					strTemp = strTemp + ')';
					break;
				
				case 'lte' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					if (filterData[index].dataType === 1) {
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + 'date\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + 'date\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ')';
					} else {
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ')';
					}
					break;
				
				case 'lteqtoamt' :
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
							+ '\'' + ' and ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + 0
							+ '\''; 
						strTemp = strTemp + ')' + ' or ';
						
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'' + ' and ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + 0
							+ '\''; 
						strTemp = strTemp + ')';
					break;
				
				case 'lteqtoorgt':
				if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					if("valueDate"==filterData[index].field)
					{
						strTemp = strTemp + '(';
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'eq' + ' ' + 'date\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'lt' + ' ' + 'date\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ')';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
									+ 'gt' + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						strTemp = strTemp + ')';
						strTemp = strTemp + ')';
					}
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
			
		if(strFilter.indexOf("debitCreditFlag") !== -1 && strFilter.indexOf("postedExpectedFlag") !== -1){
			strFilter = me.combineTxnTypeAndPostingFilter(strFilter);
		}
		return strFilter;
	},
	combineTxnTypeAndPostingFilter : function(strFilter){
		var arrFilters = strFilter.split(" and ");
		var retVal = "", mergedFilter="";
		for(var i = 0; i < arrFilters.length; i++){
			if(retVal.length !== 0){
				retVal += ' and ';
			}
			var filter = arrFilters[i];
			if(filter.indexOf("debitCreditFlag") !== -1 || filter.indexOf("postedExpectedFlag") !== -1){
				if(mergedFilter.length !=0)
					mergedFilter += " or ";
				mergedFilter += filter.replace('(','').replace(')','')
			}else{
				retVal += filter;
			}
		}
		if(retVal.length !== 0){
			retVal += ' and ';
		}
		retVal += '(' + mergedFilter + ')';
		return retVal;
	},
	
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		
		if (me.getFilterView())
			me.getFilterView().removeHighlight();
		
		var objGroupView = me.getGroupView();
		objGroupView.refreshData();
	},
	applyAdvancedFilter : function(filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.filterApplied = 'A';
        me.handlePostingDateChange(me.dateFilterVal);
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
		var typeCodeSetText = $("#typeCodeSet option:selected").text();
		me.getBtnAllCats().setRawValue(typeCodeSetText);
		selectedFilter = typeCodeSetText;
		
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
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		me.bIsQuickSavedFilter = true;
        me.resetAllFields();		
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
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
				applyAdvFilter,'VIEW');
		changeAdvancedFltrTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
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
		
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter,'EDIT');
				changeAdvancedFltrTab(1);

	},
	resetAllFields : function(bClearBtnClicked) { // bClearBtnClicked - True, if click on CLEAR button on Advance filter popup screen
		var me = this;
		$("input[type='checkbox'][id='debitCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='creditCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='postedTxnsCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='expectedTxnsCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='hasImageCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='hasAttachmentCheckBox']").prop('checked',
				false);
		//resetAllMenuItemsInMultiSelect("#msProductCategory");
		$('#accountRadio1').prop('checked', true);
		$("input[type='text'][id='amountField']").val("");
		$("input[type='text'][id='amountFieldTo']").val("");
		$("#amountOperator").val('eq');
		$('#amountOperator').niceSelect('update');
		$(".amountTo").addClass("hidden");
		$("#msAmountLabel").text(getLabel("amount","Amount"));	
		
		selectedAmountType={};
		$("input[type='text'][id='notes']").val("");
		
			$('#postingDate').datepick('option','rangeSelect',false);
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.postingDateFilterVal = me.dateFilterVal;
		
		selectedValueDate={};
		$('#valueDate').val("");
		$("#typeCode").val("");
		me.advTypeCode = [];
		$("#msSortBy1").val("");
		$('#msSortBy2 option').remove();
		$("#msSortBy2").append($('<option />', {
			value : "None",
			text :getLabel("none", "None")
			}));
		$('#msSortBy3 option').remove();
		$("#msSortBy3").append($('<option />', {
			value : "None",
			text : getLabel("none", "None")
			}));
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
                $("#msSortBy1").niceSelect('update');
                $("#msSortBy2").niceSelect('update');
                $("#msSortBy3").niceSelect('update');
		$('#sortBy1AscDescLabel').text(getLabel("ascending", "Ascending"));
        $('#sortBy2AscDescLabel').text(getLabel("ascending", "Ascending"));
        $('#sortBy3AscDescLabel').text(getLabel("ascending", "Ascending"));		
		$('#bankReference').val("");
		$('#customerReference').val("");
		$("input[type='text'][id='filterCode']").val("");
		$("input[type='text'][id='filterCode']").prop('disabled', false);
		$('label[for="ValueDateLabel"]').text(getLabel('valueDate', 'Value Date'));
		
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
        markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','filterCode');
		$("#typeCodeSet").val("");
		$("#typeCodeSet").multiselect("refresh");
		resetAllMenuItemsInMultiSelect("#accTyp");
		resetAllMenuItemsInMultiSelect("#accAutoComp")
		//me.doHandleDeSelectTypeCode();
		me.filterCodeValue = null;
		me.resetAdvEntryDate();
    },
	resetAdvEntryDate: function(){
        var me = this;
        var objDateParams = me.getDateParam(defaultDateIndex);
        var label = getDateIndexLabel(defaultDateIndex);
        var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat);
        var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat);
        $('#postingDate').datepick('setDate', [vFromDate, vToDate]);
        selectedPostingDate={
                operator:objDateParams.operator,
                fromDate:vFromDate,
                toDate:vToDate,
                dateLabel :  objDateParams.label,
                dateIndex : defaultDateIndex
            };
        $('label[for="PostingDateLabel"]').text(getLabel('postingDate','Posting Date') + " (" + selectedPostingDate.dateLabel + ")");
        updateToolTip('postingDate',  " (" + selectedPostingDate.dateLabel + ")");
    },	
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter, mode) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var displayValue1 = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		var datePickerRef=$('#postingDate');
		var postingDateLabel = '';
		var formattedFromDate ='';
		var displayValue1 = '';
		
		$('#filterCode').val(filterCode);
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			displayValue1 = filterData.filterBy[i].displayValue1;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			displayValue1 = filterData.filterBy[i].displayValue1
			
			if(fieldName === 'Account' ){			
				$('#accountRadio1').attr('checked',true);
				$('#accAutoComp').val(fieldSecondVal);
				accountId = fieldVal;
			}
			else if(fieldName === 'AccountSet')
			{
				$('#accountRadio2').attr('checked',true);
				$('#accAutoComp').val(fieldSecondVal);
				accountId = fieldVal;
				
			}else if (fieldName === 'SortBy' || fieldName === 'FirstThenSortBy'
					|| fieldName === 'SecondThenSortBy') {
				columnId = fieldVal;
				sortByOption = fieldSecondVal;
				buttonText = getLabel("ascending", "Ascending");
				if (sortByOption !== 'asc')
					buttonText = getLabel("descending", "Descending");
				me.setSortByComboFields(fieldName, columnId, buttonText, true);
			}
			
			
			else if	(fieldName === 'typeCode' && operatorValue === 'eq'){
				$('#typeCode').val(decodeURIComponent(fieldVal));
			}	
			else if(fieldName === 'typeCode' && operatorValue === 'in'){
                     $("#typeCodeSet").val(decodeURIComponent(fieldVal)).attr('selected', true);
                    $("#typeCodeSet").multiselect("refresh");
                }
			else if(fieldName === 'bankReference'){
				$('#bankReference').val(fieldVal);
			}	
			else if(fieldName === 'customerReference'){
				$('#customerReference').val(fieldVal);              
			}	
			else 	if(fieldName === 'noteText'){
				$('#notes').val(fieldVal);
			}	
			
		/*	else if (fieldName === 'actionStatus'
					|| fieldName === 'txnStatus') {
				fieldType = 'combo';
				objCreateNewFilterPanel
						.setValueComboTextFields(objCreateNewFilterPanel,
								fieldName, fieldType, fieldVal);
			} */
			else if (fieldName === 'amount') {
				$("#amountField").val(fieldVal);
				$("#amountField").autoNumeric('set', fieldVal);
				
				if('bt' === operatorValue){
					$(".amountTo").removeClass("hidden");
					$("#msAmountLabel").text(getLabel("amountFrom","Amount From"));
					$("#amountFieldTo").val(fieldSecondVal);
					$("#amountFieldTo").autoNumeric('set', fieldSecondVal);
				}else{
					//$("amountFieldTo").val("");
					$(".amountTo").addClass("hidden");
					$("#msAmountLabel").text(getLabel("amount","Amount"));
				}
				
				
				selectedAmountType.operator = operatorValue;
				$("#amountOperator").val(operatorValue);
                $("#amountOperator").niceSelect('update');
                var amtLabel = operatorValue === 'lt' ? 'Less Than ' : operatorValue === 'gt' ? 'Greater Than' : 'Equal To';
				$('label[for="AmountLabel"]').text(getLabel('amount','Amount') + " (" + amtLabel + ")");	
			}
/*			if (fieldName === 'postingDate' || fieldName === 'valueDate') {
				var formattedFromDate = "";
				var formattedToDate = "";
				var dateIndexVal = filterData.filterBy[i].dateIndexVal;
				var objDateParams = me.getDateParam(dateIndexVal);

				if (fieldName === 'postingDate')
					me.getPostingDateBtn().dateIndex = dateIndexVal;
				else if (fieldName === 'valueDate')
					me.getValueDateBtn().dateIndex = dateIndexVal;

				if (dateIndexVal != 7) {
					formattedFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
							strExtApplicationDateFormat);
					formattedToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
							strExtApplicationDateFormat);
				} else {
					var fromDate = filterData.filterBy[i].value1;
					if (!Ext.isEmpty(fromDate)) {
						formattedFromDate = Ext.util.Format.date(Ext.Date
										.parse(fromDate, 'Y-m-d'),
								strExtApplicationDateFormat);
					}

					var toDate = filterData.filterBy[i].value2;
					if (!Ext.isEmpty(toDate)) {
						formattedToDate = Ext.util.Format.date(Ext.Date.parse(
										toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
					}
				}

				objCreateNewFilterPanel.setSavedFilterDates(fieldName,
						objCreateNewFilterPanel, filterData.filterBy[i],
						formattedFromDate, formattedToDate);
			}*/
			
			else if(fieldName === 'debitFlag')
			{
				$('#debitCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'creditFlag')
			{
				$('#creditCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'postedTxnsFlag')
			{
				$('#postedTxnsCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'expectedTxnsFlag')
			{
				$('#expectedTxnsCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'hasImageFlag')
			{
				$('#hasImageCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'hasAttachmentFlag')
			{
				$('#hasAttachmentCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if (fieldName === 'postingDate') {
				me.postingDateFilterLabel = currentFilterData.dropdownLabel ;
					me.handlePostingDateChange(currentFilterData.dateIndex);
					var postingDateLable = currentFilterData.paramFieldLable + " (" + currentFilterData.dropdownLabel + ")";
					me.handleDateSync('A', postingDateLable, " (" + currentFilterData.dropdownLabel + ")", datePickerRef);
			} else if (fieldName === 'selectedValueDate') {
					selectedValueDate.operator = operatorValue;
					selectedValueDate.fromDate = new Date(fieldVal);
					selectedValueDate.toDate = Ext.isEmpty(fieldSecondVal) ? '' : new Date(fieldSecondVal);
					selectedValueDate.dateLabel =  currentFilterData.dropdownLabel;
					$('#valueDate').datepick('setDate', [vFromDate, vToDate]);
					$('label[for="ValueDateLabel"]').text(!Ext.isEmpty(selectedValueDate.dateLabel) ? getLabel('valueDate','Value Date')+ " ("
							+ selectedValueDate.dateLabel + ")" : getLabel('valueDate','Value Date'));
			}
			else if(fieldName === 'subFacilityCode'){				
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}else if(fieldName === 'accountId' ){			
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#filterCode').val(filterCode);
			$('#filterCode').removeClass('requiredField');
			$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
			markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','filterCode')
		}

		// Render the screen only if SEARCH clicks on to the Advance Filter screen
		if (applyAdvFilter){
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(filterData);
		}
		// Clear the flag post processing
		me.bIsAdvanceSavedFilter = false;
		me.bIsQuickSavedFilter = false;
	},
    setSortByComboFields : function(fieldName, columnId, buttonText, disableFlag) {
		if (!Ext.isEmpty(fieldName)) {

			if (fieldName === 'SortBy') {
				// sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
					var sortByLabelRef = $("#sortBy1AscDescLabel");
					if (!Ext.isEmpty(sortByLabelRef))
						sortByLabelRef.text(buttonText);
				}

				// Sort By
				if (!Ext.isEmpty(columnId)) {
					var sortByComboRef = $("#msSortBy1");
					if (!Ext.isEmpty(sortByComboRef)) {
						sortByComboRef.val(columnId);
                        $("#msSortBy1").niceSelect('update');
                        sortBy1ComboSelected();
                        $('#msSortBy2').attr('disabled', false);
                        $("#msSortBy2").niceSelect();
                        $("#msSortBy2").niceSelect('update');
					}
				}
            }
            else if (fieldName === 'FirstThenSortBy') {
                // sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
                    var thenSortBy2ButtonRef = $("#sortBy2AscDescLabel");
                    if (!Ext.isEmpty(thenSortBy2ButtonRef)) {
                        thenSortBy2ButtonRef.text(buttonText);
					}
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var firstThenSortByCombo = $("#msSortBy2");
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.val(columnId);
                        $("#msSortBy2").niceSelect('update');
                        sortBy2ComboSelected();
                        $('#msSortBy3').attr('disabled', false);
                        $("#msSortBy3").niceSelect();
                        $("#msSortBy3").niceSelect('update');
					}
				}
            }
            else if (fieldName === 'SecondThenSortBy') {
                // sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
                    var thenSortBy3ButtonRef = $("#sortBy3AscDescLabel");
                    if (!Ext.isEmpty(thenSortBy3ButtonRef)) {
                        thenSortBy3ButtonRef.text(buttonText);
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
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'subFacilityCode') {
			menuRef = $("select[id='accTyp']");
			elementId = '#accTyp';
		}else if(componentName === 'account'){
			menuRef = $("select[id='accAutoComp']");
			elementId = '#accAutoComp';
		}else if(componentName === 'accountId'){
			menuRef = $("select[id='accAutoComp']");
			elementId = '#accAutoComp';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");
			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}
			
			var dataArray;
			
			if(Ext.isNumeric(data))
				dataArray = [data];
			else
				dataArray = data.split(',');
				
			if (componentName === 'subFacilityCode') {
				me.paymentTypeFilterVal = dataArray;
			}
			
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
			
			if(componentName === 'subFacilityCode'){
				setDataToAutoComp();
			}
		}
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter, mode) {
		var me = this;		
		me.advFilterData = [];
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					async : false,
					success : function(response) {
						if (!Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter,mode);
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
									cls : 't7_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		
		if (!Ext.isEmpty(objData)) {
			
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			//adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me
						.removeFromAdvanceArrJson(arrAdvJson,paramName);
				if(paramName == 'typeCode')
				{
					me.advTypeCode = [];
				}
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
	
	/* Applied Filters handling ends here */
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName,strFieldOperator;;
		if(!Ext.isEmpty(objData)){
			strFieldName = objData.paramName || objData.field;
			strFieldOperator = objData.operator;
		}
		
		if (strFieldName === 'postingDate') {
			me.postingDateFilterLabel = getLabel('yesterday', 'Yesterday');
			me.dateFilterVal = defaultDateIndex;
			me.postingDateFilterVal = me.dateFilterVal;
			me.dateFilterLabel = getLabel('latest','Latest');
			me.handleDateChange(me.dateFilterVal);
			me.handlePostingDateChange(me.dateFilterVal);
		}else if(strFieldName === 'typeCode'){
		if(strFieldOperator === 'eq'){
				$("#typeCode").val("");
			}else{
				$("#typeCodeSet").val("Select");
				$("#typeCodeSet").multiselect("refresh");
				me.doHandleDeSelectTypeCode();

			}
		}else if(strFieldName === 'bankReference'){
			$("#bankReference").val("");
		}else if(strFieldName === 'customerReference'){
			$("#customerReference").val("");
		}else if(strFieldName === 'noteText'){
			$("#notes").val("");
		}else if(strFieldName === 'accountId'){
			resetAllMenuItemsInMultiSelect("#accAutoComp");
		}else if(strFieldName === 'AccountSet'){
			$('#accountRadio2').attr('checked',true);
			$('#accAutoComp').val("");
		}else if(strFieldName === 'amount'){
			$("#amountField").val("");
			$("#amountFieldTo").val("");
		}else if(strFieldName === 'valueDate'){
			var datePickerRef = $('#valueDate');
			$('#valueDate').val("");
			me.dateFilterVal = '';
			datePickerRef.val('');
			selectedValueDate={};
		} else if(strFieldName === "subFacilityCode"){
			resetAllMenuItemsInMultiSelect("#accTyp");
		} else if(strFieldName === "postedExpectedFlag"){
			   $("input[type='checkbox'][id='postedTxnsCheckBox']").prop('checked', false); 	
			   $("input[type='checkbox'][id='expectedTxnsCheckBox']").prop('checked', false); 
		} else if(strFieldName === "debitCreditFlag"){
			   $("input[type='checkbox'][id='debitCheckBox']").prop('checked', false);
			   $("input[type='checkbox'][id='creditCheckBox']").prop('checked', false); 
		} else if(strFieldName === "hasAttachmentFlag"){
				$("input[type='checkbox'][id='hasAttachmentCheckBox']").prop('checked', false);
		} else if(strFieldName === "hasImageFlag"){
				$("input[type='checkbox'][id='hasImageCheckBox']").prop('checked', false);
		}
		
					
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		if(!Ext.isEmpty(widgetFilterUrl))
		{
			var strUrl = widgetFilterUrl;
			widgetFilterUrl = '';
			return strUrl;
		}
		var me = this, strUrl = '',isFilterApplied = false;
		var strModule = '', args=null ,fieldVal1 , filedVal2;
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});
		
        strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams(isFilterApplied);

		if (!Ext.isEmpty(strAdvancedFilterUrl)) {
			strUrl += "&$filter=";
			strUrl += strAdvancedFilterUrl;
			isFilterApplied = true;
		}
		
		if (me.filterApplied === 'A') {
			strUrl += '&$accountID=' + me.accountFilter;
		}
		
		if ( me.filterApplied != 'Q' ) {
			if ( !Ext.isEmpty(me.dateFilterFromVal) && !Ext.isEmpty(me.dateFilterToVal) ) {
				fieldVal1 = me.dateFilterFromVal;
				filedVal2 = me.dateFilterToVal;
			} else {
				fieldVal1 = dtObj.fieldValue1;
				filedVal2 = dtObj.fieldValue2;
			}
		} else {
			fieldVal1 = dtObj.fieldValue1;
			filedVal2 = dtObj.fieldValue2;
		}
		
		strUrl += '&$activityFromDate=' + fieldVal1;
		strUrl += '&$activityToDate=' + filedVal2;
		if (!Ext.isEmpty(me.identifier))
			strUrl += '&$identifier=' + me.identifier;
		
		if(!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all' && !Ext.isEmpty(me.advTypeCode))
			strUrl += '&$typeCode=' + (me.txnFilter.constructor === Array ? (me.txnFilter).join() : me.txnFilter) +","+ (me.advTypeCode).join();  // for both
		else if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all')
			strUrl += '&$typeCode=' + (me.txnFilter.constructor === Array ? (me.txnFilter).join() : me.txnFilter); // only quick 
		else if(!Ext.isEmpty(me.advTypeCode))
			strUrl += '&$typeCode=' + (me.advTypeCode).join();              //adv type code
	
		
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += '&'+subGroupInfo.groupQuery;
		}
		else
		{
			strUrl += '&$filterOn=&$filterValue=';
		}
		args = {
				'module' : strModule
		};
		if (!Ext.isEmpty(objDefPref['TXNSEARCH']['GRID'][args['module']]))
		{
			strUrl += '&$serviceType='+objDefPref['TXNSEARCH']['GRID'][args['module']]['serviceType'];
			strUrl += '&$serviceParam='+objDefPref['TXNSEARCH']['GRID'][args['module']]['serviceParam'];
		}
		else
		{
			strUrl += '&$serviceType='+mapService['BR_TXN_SRC_GRID'];
			strUrl += '&$serviceParam='+mapService['BR_GRIDVIEW_GENERIC'];
		}
		
		if(me.filterApplied !== 'A'){
			me.accountFilter = '(ALL)';
			if(me.filterApplied != 'ALL') {
				strUrl += '&$accountID=' + me.accountFilter;
			}
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(){
		var me = this;
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});
		var strModule = '', args=null;
		var strUrl= '';
		strUrl += '&$accountID=' + me.accountFilter;
		strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
		strUrl += '&$activityToDate=' + dtObj.fieldValue2;
		if (!Ext.isEmpty(me.identifier))
			strUrl += '&$identifier=' + me.identifier;
		

		if (!Ext.isEmpty(me.isHistoryFlag))
			strUrl += '&$summaryType=' + me.isHistoryFlag;
		if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all')
			strUrl += '&$typeCode=' + (me.txnFilter).join();
		
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

		if (!Ext.isEmpty(objDefPref['TXNSEARCH']['GRID'][me.strServiceParam]))
			model = objDefPref['TXNSEARCH']['GRID'][me.strServiceParam]['columnModel'];
		gridModel = gridModel || {
			"pgSize" : "10",
			"gridCols" : model
					|| objDefPref['TXNSEARCH']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel']
		};
		return gridModel;
	},
	captureRemark : function(record) {
		var strRemark = record.get('noteText') || '' ; 
		var strAction = (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename'))) ? 'ADD' : 'VIEW';
		strNoteFilename = record.get('noteFilename');
		
		showRemarksPopup(strRemark,strAction,strNoteFilename,record);
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
		form.action = 'services/activities/downloadNoteFile';
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
		
	},
	viewEmailAttachment : function(record) {
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
	strUrl += '&$sessionNmbr=' + record.get('sessionNumber');
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
	},
	doSaveCapturedRemark : function(record, formdata,updatedNote,addedfile) {
		var me = this;
		var isError = false;
		var objGroupView = me.getGroupView();
		if (objGroupView)
			objGroupView.setLoading(true);
		
		record = notesRecord;			
		formdata.append("identifier",record.get('identifier'));
		$.ajax({
					url : me.strSaveActivityNotesUrl,
					type : 'POST',
					processData : false,
					contentType : false,
					data : formdata,
					complete : function(XMLHttpRequest, textStatus) {
					},
					success : function(response) {
						if (response && response['success'] == 'Y') {
							
							Ext.MessageBox.show({
								title : getLabel('saveActivityNotesSuccessPopUpTitle',
										'Message'),
								msg : getLabel('saveActivityNotesSuccessPopUpMsg',
										'Notes saved successfully..!'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									} ,
								cls : 'ux_popup',
								icon : Ext.MessageBox.INFO
							});
							
							if (objGroupView)
								objGroupView.setLoading(false);
							
								if (record) {
									record.beginEdit();
									record.set({
												noteText : updatedNote,
												noteFilename : addedfile
											});
									record.endEdit();
									record.commit();
								}
							
						}else {
								Ext.MessageBox.show({
				title : getLabel('saveActivityNotesErrorPopUpTitle', 'Message'),
				msg : getLabel('saveActivityNotesErrorPopUpMsg',
						'Error while saving data..!'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 'ux_popup',
				icon : Ext.MessageBox.ERROR
			});
			if (objGroupView)
								objGroupView.setLoading(false);
							}
					},
					failure : function() {
						Ext.MessageBox.show({
				title : getLabel('saveActivityNotesErrorPopUpTitle', 'Message'),
				msg : getLabel('saveActivityNotesErrorPopUpMsg',
						'Error while saving data..!'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 'ux_popup',
				icon : Ext.MessageBox.ERROR
			});
			if (objGroupView)
								objGroupView.setLoading(false);
					}
				});
		
	},

	createPopUps : function() {
		var me = this;

		if (Ext.isEmpty(me.expandedWirePopup)) {
			me.expandedWirePopup = Ext.create(
					'GCP.view.ExpandedWirePopup', {
						itemId : 'activityExpandedWirePopup'
					});
		}

	},
	/** **************** download report ********************* */
	downloadReport : function(actionName) {
		var me = this;

		var withHeaderFlag =  document.getElementById("headerCheckbox").checked;
		var arrExtension = {
				downloadXls : 'xls',
				downloadCsv : 'csv',
				downloadPdf : 'pdf',
				downloadTsv : 'tsv',
				downloadBAl2 : 'bai2',
				downloadMt940 : 'mt940',
				downloadqbook : 'quickbooks'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var args=null;
		var strModule = '';
		strExtension = arrExtension[actionName];
		strUrl = 'services/transcationSearchSummary/generateReport.' + strExtension;
		strUrl += '?$skip=1';

		// Get subGroupInfo
		var groupView = me.getGroupView();
		groupInfo = groupView.getGroupInfo() || {};
		subGroupInfo = groupView.getSubGroupInfo() || {};
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

		var wdgt = null, grid = null, colMap, colArray, viscols, visColsStr = "", objGroupView, col = null;

		objGroupView = me.getGroupView();

		if (!Ext.isEmpty(objGroupView)) {
			colMap = new Object();
			colArray = new Array();

			grid = objGroupView.getGrid();

			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					if (col.dataIndex && arrDownloadReportColumn[col.dataIndex]) {
						if (colMap[arrDownloadReportColumn[col.dataIndex]]) {
							// ; do nothing
						} else {
							colMap[arrDownloadReportColumn[col.dataIndex]] = 1;
							colArray
									.push(arrDownloadReportColumn[col.dataIndex]);

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
							key, decodeURIComponent(objParam[key])));
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
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
	},
	handleSavedTypeCodeFilterClick : function(rowIndex) {
		var me = this;
		var grid = me.getTranCategoryGridView();
		if(rowIndex >= 0)
			me.doHandleViewTransactionCategory(grid,rowIndex);
		else
			me.clearTypeCodeSelection();
	},
	clearTypeCodeSelection : function(){
		$("#typeCodeTextField").attr('value', '');
		$("#btnSave button").text( getlabel('save',"Save"));
		var me = this;
		var grid = me.getTranCategoryEntryGridView();
		grid.getSelectionModel().deselectAll();
	},
	getPreferencesToSave : function(localSave) {
		
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
		var filterPanelCollapsed = true;
		objFilterPref = me.getFilterPreferences();
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			if (groupInfo.groupTypeCode === 'TXNSEARCH_OPT_ACCTYP') {
				strModule = state.subGroupCode;
			} else if (groupInfo.groupTypeCode === "none") {
				strModule = state.subGroupCode;
			} else {
				strModule = state.groupCode
			}
			arrPref.push({
				"module" : "tranSearchFilterPref",
				"jsonPreferences" : objFilterPref
			});
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode,
							equiCcy : me.equiCcy,
							equiCcySymbol : me.equiCcySymbol
						}
					});
			arrPref.push({
						"module" : strModule,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize,
							'gridSetting' : groupView.getGroupViewState().gridSetting,
							'sortState':state.grid.sortState
						}
					});						
		}
		return arrPref;
		
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		var quickPref = {};
		objFilterPref.txnCatName = me.txnFilterName;
		objFilterPref.txnCatArray = me.txnFilter;
		objFilterPref.advFilterCode = me.savePrefAdvFilterCode;
		
		quickPref.dateFilterVal = me.dateFilterVal;
		
		if (me.dateFilterVal === '13') {
			var strSqlDateFormat = 'Y-m-d';
			if (me.dateFilterVal === '13') {
				me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
				me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
				if (me.datePickerSelectedDate.length == 1) {
					quickPref.entryDateFrom = me.dateFilterFromVal;
				} else if(me.datePickerSelectedDate.length == 2) {
					quickPref.entryDateFrom = me.dateFilterFromVal;
					quickPref.entryDateTo = me.dateFilterToVal;
				}
			}
		}
		objFilterPref.quickFilter = quickPref;
		return objFilterPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(false);
		}
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(false);
		}
	},
	postDoHandleReadPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d.preferences)) {
				me.objActivityFilterPref = data.d.preferences.activityFilterPref;
				me.objActivityGridPref = data.d.preferences[me.strServiceParam];
			}
		}
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		me.txnFilter = 'all';
		me.txnFilterName = 'all';
		var objDateLbl = {
				'' : getLabel('latest', 'Latest'),
               // '1' : getLabel('today', 'Today'),
				'2' : getLabel('yesterday', 'Yesterday'),
				'3' : getLabel('thisweek', 'This Week'),
                '4' : getLabel('lastweektodate', 'Last Week To Yesterday'),
				'5' : getLabel('thismonth', 'This Month'),
                '6' : getLabel('lastMonthToDate', 'Last Month To Yesterday'),
				'14': getLabel('lastmonthonly', 'Last Month Only'),
				'8' : getLabel('thisquarter', 'This Quarter'),
                '9' : getLabel('lastQuarterToDate', 'Last Quarter To Yesterday'),
				'10' : getLabel('thisyear', 'This Year'),
                '11' : getLabel('lastyeartodate', 'Last Year To Yesterday'),
                //'13' : getLabel('daterange', 'Date Range'),
				'12' : getLabel('latest', 'Latest')
		};
		
		if (!Ext.isEmpty(objTranSearchGroupByFilterPref)) {
			var data = objTranSearchGroupByFilterPref;

			if(!Ext.isEmpty(data)){
				if (!Ext.isEmpty(data.txnCatName))
					me.txnFilterName = data.txnCatName;
	
				me.txnFilter = !Ext.isEmpty(data.txnCatArray)
						? data.txnCatArray
						: 'all';
	
				var strDtValue = data.quickFilter.dateFilterVal;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				
				if(!Ext.isEmpty(strDtValue)){
				me.dateFilterVal = strDtValue;
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.filterApplied = 'Q';
				
				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue)) {
							me.dateFilterFromVal = strDtFrmValue;
							me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d');
						}
						if (!Ext.isEmpty(strDtToValue)) {
							me.dateFilterToVal = strDtToValue;
							me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d');
						}
						me.datePickerSelectedEntryDate = me.datePickerSelectedDate;
					}
					
				}
				
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
		}
			var	args = {
					'module' : 'panels'
				};
			me.preferenceHandler.readModulePreferences(me.strPageName,
						'panels', me.postReadPanelPrefrences, args, me, true);	
		}
		else{
			showTransAdvanceFilterPopup();
			 me.assignSavedFilter();
		}
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
				var dtParams = me.getDateParam('13');
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
	
	/************** group view handling *********************/
	
		doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
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
			strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

		} else 
		me.postHandleDoHandleGroupTabChange();
		
        
	},
	
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getTranSearchSummaryView(), gridModel = null, objData = null;
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
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
        // saving local prefrences
        if (allowLocalPreference === 'Y') {
            me.handleSaveLocalStorage();
        }
        var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
                && me.objLocalData.d.preferences.tempPref
                && me.objLocalData.d.preferences.tempPref.pageNo
                ? me.objLocalData.d.preferences.tempPref.pageNo
                : null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
                
        if(!Ext.isEmpty(intPageNo) && me.firstLoad) {
            intNewPgNo = intPageNo;
            intOldPgNo = intPageNo;
        }
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData,strApplicationDateFormat);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
            var advJsonData = (me.advFilterData).map(function(v) {
                return v;
            });
            // remove sort by fields
            advJsonData = advJsonData.filter(function(a) {
                return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy")
            });
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
                arrOfParseAdvFilter = generateFilterArray(advJsonData, strApplicationDateFormat);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
				
			if (arrOfFilteredApplied)
				me.getFilterViewRef().updateFilterInfo(arrOfFilteredApplied);
		}
		me.reportGridOrder = strUrl;
		if (allowLocalPreference === 'Y')
        {
            me.handleSaveLocalStorage();
        }
		grid.loadGridData(strUrl, null, null, false);
		if (!Ext.isEmpty(me.postingDateFilterLabel) && me.isFirstRequest) {                 
            me.getDateLabel().setText(getLabel('postingDate', 'Posting Date') + " (" + me.postingDateFilterLabel + ")");
        }
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
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
				me.doHandleRowActionClick(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
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
					} ,
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
		} else
		{
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
					} ,
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

		if (!Ext.isEmpty(objTranSearchPref)) {
			objPrefData = Ext.decode(objTranSearchPref);
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
					: (objSummaryView.getDefaultColumnPreferences() || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/tranSearchSummary.json';
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
		doHandleRowActionClick : function(actionName, objGrid, record) {
		
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		attachmentRecord = record;
		var recId = record.get('identifier');
		if (actionName === 'notes' || actionName === 'notesAttached') {
			me.captureRemark(record);
		} else if (actionName === 'txnDetails') {
			
		showTxnDetailsPopup(record,record.get('accountNo'),record.get('subFacType'));			
		} else if (actionName === 'email') {
			showEmailPopUp(record);
		} else if (actionName === 'check') {
			if(daejaViewONESupport)
			{
				me.showCheckImageDaejaViewONE(record);
			}
			else
			{
				showCheckImage(record, 'F');
			}
		} else if (actionName === 'expandedWire') {
			me.expandedWirePopup.record = record;
			me.expandedWirePopup.showExpandedWirePopup(record);
		}
		
	},
	
	showCheckImageDaejaViewONE : function( record, side )
	{
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		var me = this;
		var id = record.get('identifier');
		var custRef = record.get('customerRefNo');
		var strUrl = 'services/activities/showChequeImage.json?$isDaejaViewer=Y&checkDepositeNo='+ custRef;
		
		if(document.getElementById("viewONE"))
		{
			removeViewer();
		}
		addViewer('chkImageDiv', strUrl);
		
		$( '#chkImageDiv' ).dialog(
		{
			autoOpen : false,
			height : "800",
			modal : true,
			resizable : true,
			width : "1000",
			title : getLabel('image', 'Image'),
			position: 'center',
			buttons :
			{
				"Cancel" : function()
				{
					$( this ).dialog( "close" );
				}
			}
		} );
		$( '#chkImageDiv' ).dialog( 'open' );
	},
	
	updateDateFilterView : function()
	{
		var me = this;
		var dtEntryDate = null;
		var defaultToDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		var defaultFromDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '13') {
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
	},
	updateSavedFilterComboInQuickFilter : function() {
		  var me = this;
		  var savedFilterCombobox;
		  if(!Ext.isEmpty(me.getFilterView()))
		   savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
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
	assignSavedFilter: function(){
		 var me= this,savedFilterCode='';
        me.resetAllFields();
        if (objTranSearchPref || objSaveLocalStoragePref) {
            var objJsonData = Ext.decode(objTranSearchPref);
            var objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
            if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
                    && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
                        savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                        me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                    }
                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
                        me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
                        //me.handleFieldSync();
                    }
            }
            else if (!Ext.isEmpty(objJsonData.d.preferences) && Ext.isEmpty(widgetFilterUrl)) {
                if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
                    if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
                        var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
                        if(!Ext.isEmpty(me.getFilterView()) && 
                        		advData === me.getFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
                            $("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
                            $("#msSavedFilter").multiselect("refresh");
                            me.savedFilterVal = advData;
                            me.handleSavedFilterClick();
                        }
                    }
                }
            }
        }
	},
	handleFieldSync : function(){
        var me = this;
        
    },
    /* State handling at local storage starts */
    handleSaveLocalStorage : function() {
        var me = this, arrSaveData = [], objSaveState = {}, objAdvJson = {};
        var objGroupView = me.getGroupView(), grid = objGroupView.getGrid(), subGroupInfo = null;
        if (objGroupView)
            subGroupInfo = objGroupView.getSubGroupInfo();
        if (!Ext.isEmpty(me.savedFilterVal)) {
            objSaveState['advFilterCode'] = me.savedFilterVal;
        }
        if (!Ext.isEmpty(me.advFilterData)) {
            objAdvJson['filterBy'] = me.advFilterData;
            objSaveState['advFilterJson'] = objAdvJson;
        }
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
            if(args && args.tempPref){
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
    /* State handling at local storage End */
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

		    
		   if(fieldId=='amount'){  
			if((!creditChecked && !debitChecked) || (creditChecked && debitChecked)){
		    		jsonArray.push({
				        property : 'txnAmount',
				        direction : sortDirection,
				        root : 'data'
				       });
		    	}else if(creditChecked){
				     jsonArray.push({
				        property : 'creditUnit',
				        direction : sortDirection,
				        root : 'data'
				       });
		    	}else if(debitChecked){
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
		 
		 handleSyncTxnCategoryFilter : function(btn){
			 $("#typeCodeSet option").filter(function() {
				    return this.text == btn.rawValue; 
			 }).attr('selected', true);
			 $("#typeCodeSet").multiselect("refresh");
			 selectedFilter = btn.rawValue;
		 },
		 
		 setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
			 $("#amountField").val(amountFromFieldValue);
			 $("#amountOperator").val(operator);
			 $("#amountOperator").niceSelect('update');
				selectedAmountType.operator = operator;
			
			}
			
			
});