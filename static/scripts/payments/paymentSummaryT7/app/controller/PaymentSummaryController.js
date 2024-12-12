/**
 * @class GCP.controller.PaymentSummaryController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */
 
/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.PaymentSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.PaymentSummaryView', 'GCP.view.HistoryPopup',
			'Ext.tip.ToolTip'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			}, {
				ref : 'paymentSummaryView',
				selector : 'paymentSummaryView'
			}, {
				ref : 'groupView',
				selector : 'paymentSummaryView groupView'
			},
			/* Quick Filter starts... */
			{
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'paymentSummaryFilterView',
				selector : 'paymentSummaryFilterView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'paymentSummaryFilterView combo[itemId="clientCombo"]'
			}, {
				ref : 'paymentTypeCombo',
				selector : 'paymentSummaryFilterView combo[itemId="paymentTypeCombo"]'
			}, {
				ref : 'entryDateBtn',
				selector : 'paymentSummaryFilterView button[itemId="entryDateBtn"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'paymentSummaryFilterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'paymentSummaryFilterView  combo[itemId="savedFiltersCombo"]'
			},{
			    ref:'DateMenu',
			    selector : '#DateMenu'
			}
	/* Quick Filter ends... */
	],
	config : {
		/* Filter Ribbon Configs Starts */
		strPaymentTypeUrl : 'services/instrumentType.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/groupViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/groupViewFilter/{0}.json',
		strModifySavedFilterUrl : 'services/userfilters/groupViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/groupViewFilter/{0}/remove.json',
		strPageName : 'paymentsummary',
		strGetModulePrefUrl : 'services/userpreferences/paymentsummary/{0}.json',
		strBatchActionUrl : 'services/paymentsbatch/{0}.json',
		strDefaultMask : '000000000000000000',
		intMaskSize : 23,
		strLocalStorageKey : 'page_payment_center',
		datePickerSelectedDate : [],
		datePickerSelectedEntryAdvDate : [],
		datePickerSelectedEffectiveAdvDate : [],
		datePickerSelectedProcessAdvDate : [],
		datePickerSelectedEntryDate : [],
		dateFilterLabel : getDateIndexLabel(defaultDateIndex),
		dateFilterVal : defaultDateIndex,
		dateRangeFilterVal : '13',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		paymentTypeFilterVal : 'all',
		paymentTypeFilterDesc : 'All',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		payRefValue : '',	
		//payRefDesc : '',
		savedFilterVal : '',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		filterApplied : 'ALL',
		dateHandler : null,
		filterCodeValue : null,
		showAdvFilterCode : null,
		objAdvFilterPopup : null,
		previouGrouByCode : null,
		reportGridOrder : null,
		clientFilterVal : 'all',
		clientFilterDesc : getLabel('allCompanies', 'All companies'),
		advFilterSelectedClientDesc : null,

		savePrefAdvFilterCode : null,
		localPreHandler : null,
		advFilterCodeApplied : null,
		effectiveDateFilterVal : '',
		EntryDateFilterVal : '',
		processDateFilterVal : '',
		advFilterProcessSelected : {},
		effectiveDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		EntryDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		processDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,
		paymentTypeAdvFilterVal : null,
		filterMode : '',
		advFilterSelectedClientCode : null,
		pageSettingPopup : null,
		objLocalData : null,
		entryDateChanged : false,
		firstLoad : false,
		statusWidgetFilter : false,
		clientWidgetFilter : false,
		statusarray : [],
		statusarraydesc : '',
		parentBatchReferenceFilterVal :'',
		parentBatchReferenceFilterDesc: getLabel('parentBatchTrackingId', 'Parent Batch Tracking Id') ,	
		countdownTimerVal : null,
		tranInfoSection : false,
		isCutOff : false // set true when cutoff instruments exist and set false once all cutOff popup action is taken or times goes off
		/* Filter Ribbon Configs Ends */
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		//objLocalStoragePref = me.doGetSavedState();
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
			
			me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
			
		}
		if (!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);

		if (!Ext.isEmpty(widgetFilterUrl)) {
			populateAdvancedFilterFieldValue();
			me.setWidgetFilters();
		}
		else
			populateAdvancedFilterFieldValue();

		$("#savePrefMenuBtn").attr('disabled', true);
		$("#clearPrefMenuBtn").attr('disabled', true);
		$(document).on('wheelScroll', function(event) {
					me.handlWheelScroll();
				});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		/*
		 * $(document).on('savePreference', function(event) { //
		 * me.toggleSavePrefrenceAction(false); me.handleSavePreferences(event);
		 * }); $(document).on('clearPreference', function(event) {
		 * me.handleClearPreferences(event); });
		 */
		$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
		$(document).on('performCustomizeAction', function(event, arg1) {
			performCustomAction(me, arg1);
		});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});

		$(document).on('handleProductCutoff',
				function(event, record, strUserMsg, actionResultMsgCounter) {
					me.preHandleProductCutoff(record, strUserMsg,
							actionResultMsgCounter);
				});

		$(document).on('triggerSetDataForFilter', function() {
					me.setDataForFilter();
				});

		$(document).on('triggercheckUnCheckMenuItems',
				function(event, fieldName, fieldVal) {
					me.checkUnCheckMenuItems(fieldName, fieldVal)
				});

		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					if (filterType == "entryDateQuickFilter") {
						me.handleEntryDateChange(filterType, btn, opts);
					} else if (filterType == "entryDate") {
						me.entryDateChange(btn, opts);
					} else if (filterType == "processDate") {
						me.processDateChange(btn, opts);
					} else if (filterType == "effectiveDate") {
						me.effectiveDateChange(btn, opts);
					}
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		/*
		 * $(document).on('orderUpGridEvent', function(event, grid, rowIndex,
		 * direction) { me.orderUpDown(grid, rowIndex, direction) });
		 * $(document).on('viewFilterEvent', function(event, grid, rowIndex) {
		 * me.viewFilterData(grid, rowIndex); });
		 * $(document).on('editFilterEvent', function(event, grid, rowIndex) {
		 * me.editFilterData(grid, rowIndex); });
		 */
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
					if(!isClientUser() && ($('msClientAutocomplete').val() != null || $('msClientAutocomplete').val() != undefined))
					{
					  me.resetClientField();
					}
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		$(document).on('handlePaymentReferenceChangeInQF',
				function() {
					me.handlePaymentReferenceChangeInQF();
				});	
		$(document).on('handleParentBatchReferenceChange',
				function() {
					me.handleParentBatchReferenceChange();
				});	
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "entryDateFrom") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedEntryAdvDate = dates;
						me.entryDateFilterVal = me.dateRangeFilterVal;
						me.entryDateFilterLabel = getLabel('daterange',
								'Date Range');
						me
								.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
					} /*
						 * else if (filterType == "creationDateTo") {
						 * me.dateRangeFilterVal = '13';
						 * me.datePickerSelectedCreationAdvDate[1] = dates[0];
						 * if(isEmpty(me.datePickerSelectedCreationAdvDate[0]))
						 * me.datePickerSelectedCreationAdvDate[0] = new
						 * Date($('#creationDateFrom').val());
						 * me.creationDateFilterVal = me.dateRangeFilterVal;
						 * me.creationDateFilterLabel = getLabel('daterange',
						 * 'Date Range');
						 * me.handleCreationDateChange(me.dateRangeFilterVal); }
						 */else if (filterType == "processDateFrom") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedProcessAdvDate = dates;
						me.processDateFilterVal = me.dateRangeFilterVal;
						me.processDateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handleProcessDateChange(me.dateRangeFilterVal);
					} else if (filterType == "effectiveDateFrom") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedEffectiveAdvDate = dates;
						me.effectiveDateFilterVal = me.dateRangeFilterVal;
						me.effectiveDateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handleEffectiveDateChange(me.dateRangeFilterVal);
					}
				});
		$(document).off('approvalConfirmed');
		$(document).on('approvalConfirmed', function(eventName, objArgs) {
			var strUrl = objArgs[0];
			var remarks = objArgs[1];
			var grid = objArgs[2];
			var arrSelectedRecords = objArgs[3];
			var strActionType = objArgs[4];
			var strAction = objArgs[5];
			me.preHandleGroupActions(strUrl, remarks, grid, arrSelectedRecords,
					strActionType, strAction);
		});
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},
			'paymentSummaryView groupView' : {
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
							//me.doHandleStateChange();
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
				},
				'toggleGridPager' : function() {
				},
				'gridStoreLoad' : function(grid, store) {
					isGridLoaded = true;
					disableGridButtons(false);
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
				'render' : function() {
					/*if (Ext.isEmpty(widgetFilterUrl))
						populateAdvancedFilterFieldValue();*/
					me.firstTime = true;
					me.applyPreferences();
					//else
						//allowLocalPreference = 'N';	
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'paymentSummaryFilterView' : {
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
				/*
				 * handlePaymentTypeChangeInQuickFilter : function(combo) {
				 * me.handlePaymentTypeClick(combo); }
				 */

			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.resetSavedFilterCombo();
					me.handleAppliedFilterDelete(btn);
				}
			},
			'paymentSummaryFilterView  combo[itemId="statusCombo"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange) {
						me.resetSavedFilterCombo();
						me.handleStatusClick(combo);
					}
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.statusFilterVal)
							&& 'all' != me.statusFilterVal)
						me.handleStatusFieldSync('A', me.statusFilterVal,
								me.statusFilterDesc);
				}
			},
			'paymentSummaryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'paymentSummaryFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					var elementId;
					if(!isClientUser()){
						elementId="#msClientAutocomplete";
					}
					else{
						elementId="#msClient";
					}
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						$(elementId).val(me.clientFilterVal);
						$(elementId).niceSelect('update');
					} else {
						combo.setValue(combo.getStore().getAt(0));
						$(elementId).val(combo.getStore().getAt(0));
						$(elementId).niceSelect('update');
					}
				}
			},
			'paymentSummaryFilterView  AutoCompleter[itemId="clientAuto"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(selectedClientDesc)) {
						combo.setValue(selectedClientDesc);
					}
				}
			},
			'paymentSummaryFilterView combo[itemId="paymentTypeCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.paymentTypeFilterVal)
							&& (me.paymentTypeFilterVal != 'all')) {
						combo.selectedOptions = me.paymentTypeFilterVal
								.split(',');
						combo.setRawValue(me.paymentTypeFilterDesc);
					}
				}
			},
			'paymentSummaryFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'paymentSummaryFilterView component[itemId="paymentEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
						minDate : dtHistoryDate,
						changeYear : true,
						dateFormat : strApplicationDateFormat,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.dateRangeFilterVal = '13';
								me.datePickerSelectedDate = dates;
								me.datePickerSelectedEntryDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.resetSavedFilterCombo();
								me.setDataForFilter();
								me.applyQuickFilter();
							}
						}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						var entryDateLableVal = $('label[for="EntryDateLabel"]')
								.text();
						var entryDateField = $("#entryDateFrom");
						me.handleEntryDateSync('A', entryDateLableVal, null,
								entryDateField);
					} else if (!Ext.isEmpty(widgetFilterUrl)
							&& !Ext.isEmpty(me.dateFilterVal)
							&& !Ext.isEmpty(me.dateFilterLabel)) {
						me.handleDateChange(me.dateFilterVal);
						me.handleFieldSync();
					} else{
						// DHGCPNG44-4696 Payment->Payment Center->PDF. The filter Latest behaves differently from the way it works in Accounts.
						me.dateFilterVal = defaultDateIndex;
						me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
						me.handleDateChange(me.dateFilterVal);
						me.resetSavedFilterCombo();
						me.setDataForFilter();
						me.applyQuickFilter();
					}

				}
			},
			'paymentSummaryFilterView component[itemId="paymentEntryToDataPicker"]' : {
				render : function() {
					$('#entryDataToPicker').datepick({
								monthsToShow : 1,
								changeMonth : false,
								changeYear : false,
								// rangeSelect : false,
								withoutRange : true,
								// rangeSeparator : ' to ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.dateRangeFilterVal = '13';
										me.datePickerSelectedDate[1] = dates[0];
										me.datePickerSelectedEntryDate[1] = dates[0];
										me.dateFilterVal = me.dateRangeFilterVal;
										/*
										 * me.dateFilterLabel =
										 * getLabel('daterange', 'Date Range');
										 */
										me
												.handleDateChange(me.dateRangeFilterVal);
										// me.toEntryDate
										me.datePickerSelectedDate[1] = dates[0];
										me.resetSavedFilterCombo();
										me.setDataForFilter();
										me.applyQuickFilter();
										// me.toggleSavePrefrenceAction(true);
									}
								}
							});
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
					me.assignSavedFilter();
					var sendingAcctNo =$("select[id='msSendingAccounts']").getMultiSelectValueString();
					if(!Ext.isEmpty(selectedFilterClientDesc) && Ext.isEmpty(sendingAcctNo) && !sendingAccntCallSkip)
					{
						setSendingAccountMenuItems("msSendingAccounts");
					}
					if(isClientUser() && Ext.isEmpty(selectedFilterClientDesc) && Ext.isEmpty(sendingAcctNo) && !sendingAccntCallSkip)
					{
						setSendingAccountMenuItems("msSendingAccounts");
					}
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			}

		});
	},
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode ='';
		if (objPaymentSummaryPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objPaymentSummaryPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									if(isFilterCodeExist(objLocalJsonData.d.preferences.tempPref.advFilterCode, $('#msSavedFilter')[0]))
									{
										savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
										me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									}
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									me.handleFieldSync();
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);
						
						
						/*if (!Ext.isEmpty(objJsonData.d.preferences)
								&& Ext.isEmpty(widgetFilterUrl)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode) || (objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode))) {
									var advData = objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode) ? objSaveLocalStoragePref.filterCode : objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							} else if(objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode)){
									me.doHandleSavedFilterItemClick(objSaveLocalStoragePref.filterCode);
									me.savedFilterVal = objSaveLocalStoragePref.filterCode;
							}
						}*/
						
					}
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences) && Ext.isEmpty(widgetFilterUrl)) {
			if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
				var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
				if(isFilterCodeExist(advData, $('#msSavedFilter')[0]))
				{
					me.doHandleSavedFilterItemClick(advData);
					me.savedFilterVal = advData;
				}				
			}
		}
	},
	handlWheelScroll:function(){
	var dateEntry='';
	var dateEnd=''
	dateEntry=this.getDateMenu();
		if(dateEntry!=undefined){
		dateEntry.close();
		}
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPaymentSummaryView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		var intPageSize = _GridSizeTxn;
		var intPageNo = 1;
		var sortState = null;
		if(Ext.isEmpty(widgetFilterUrl)){
			intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						  && me.objLocalData.d.preferences.tempPref
						  && me.objLocalData.d.preferences.tempPref.pageSize
						  ? me.objLocalData.d.preferences.tempPref.pageSize
						  : '';
			intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
							&& me.objLocalData.d.preferences.tempPref
							&& me.objLocalData.d.preferences.tempPref.pageNo
							? me.objLocalData.d.preferences.tempPref.pageNo
							: 1;
			sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.sorter
						? me.objLocalData.d.preferences.tempPref.sorter
						: [];
		}
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
		// If sorting is given from advance filter then do not allow sorting on grid.
		// And not even show sorting icon to any column in this case.
		// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//		enableDisableSortIcon(me, gridModel, false);		
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
		var me = this, args = {};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		} else {
			me.preferenceHandler.readPagePreferences(me.strPageName,
					me.updateObjPaymentSummaryPref, args, me, false);
		}
	},
	updateObjPaymentSummaryPref : function(data) {
		objPaymentSummaryPref = Ext.encode(data);
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
				me.doDeleteLocalState();
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objPaymentSummaryPref)) {
			objPrefData = Ext.decode(objPaymentSummaryPref);
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
					: Ext.decode(arrGenericColumnModel || '[]');
			objColumnSetting = me.getJsonObj(objColumnSetting);
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
		objData["filterUrl"] = 'services/userfilterslist/groupViewFilter.json';
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
	/* Page setting handling ends here */

	/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,groupInfo = null,subGroupInfo = null,quickFilterState = {};
		if (objGroupView){
			subGroupInfo = objGroupView.getSubGroupInfo();
			groupInfo = objGroupView.getGroupInfo();
		}
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
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
	doHandleStateChange : function() {
		var me = this, objState = {}, objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objState['filterCode'] = me.savedFilterVal;
		objState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		// Below handling is not feasible as causing pagination failure at component level
		//objState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		//objState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objLocalStoragePref = objState;
		me.preferenceHandler.setLocalPreferences(me.strLocalStorageKey,Ext.encode(objState));
	},
	doGetSavedState : function() {
		var me = this;
		return Ext.decode(me.preferenceHandler.getLocalPreferences(me.strLocalStorageKey));
	},
	doDeleteLocalState : function(){
		var me = this;
		me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
	},
	/* State handling at local storage ends */

	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'PAYSUM_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'PAYSUM_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	/**
	 * This method will be used to create the Grid Model based on Group By
	 * parameter. You can pass Grid Model to reconfigureGrid method. If you
	 * passed null then the default Grid Model will used.
	 */
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
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var intPageNo = 1;
		if(allowLocalPreference === 'Y' && Ext.isEmpty(widgetFilterUrl) && !_IsEmulationMode)
			me.handleSaveLocalStorage();
		
		if(me.tranInfoSection == false && me.isCutOff == false)
		{
			if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
				$('#actionResultDiv').addClass('ui-helper-hidden');
				if ($('#actionResultInfoDiv').children('.row').length > 0) {
					$('#actionResultInfoDiv').children('.row').remove();
				}
			}
		}
		else
		{
			me.tranInfoSection = false;
		}
		objActionResult = {
			'order' : []
		};
		objGroupView.handleGroupActionsVisibility(buttonMask);
		if(Ext.isEmpty(widgetFilterUrl)){
			intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref
					&& me.objLocalData.d.preferences.tempPref.pageNo
					? me.objLocalData.d.preferences.tempPref.pageNo
					: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		}
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.firstLoad = false;
		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		if (!Ext.isEmpty(widgetFilterUrl)) {
			strUrl = strUrl + '&$filter=' + widgetFilterUrl;
			widgetFilterUrl = '';
		} else {
			var filterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
			var columnFilterUrl = me.generateColumnFilterUrl(filterData);
			if (!Ext.isEmpty(filterUrl)) {
				strUrl += filterUrl;
				if (!Ext.isEmpty(columnFilterUrl))
					strUrl += ' and ' + columnFilterUrl;
			} else {
				if (!Ext.isEmpty(columnFilterUrl))
					strUrl += "&$filter=" + columnFilterUrl;
			}
		}

		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							'Seller');
					quickJsonData = arrQuickJson;
				}
				
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'EntryDate');
				if(!Ext.isEmpty(filterDays) && filterDays !== '999' && me.dateFilterVal === '12'){
					if (!Ext.isEmpty(reqJsonInQuick)) {
						//reqJsonInQuick.paramValue1 = reqJsonInQuick.paramValue2;
						arrQuickJson = quickJsonData;
						arrQuickJson = me.updateInQuickArrJson(arrQuickJson,
								'EntryDate');
						quickJsonData = arrQuickJson;
					}
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
			var advJsonData = (me.advFilterData).map(function(v) {
				  return  v;
				});
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

		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false, null, null, this.gridDataPreprocessor);
		
		if(undefined != gridRowSingleClick && gridRowSingleClick == 'N')
		{
			grid.on('cellDblClick', function(tableView, td, cellIndex, record, tr,
					rowIndex, e) {				
				var clickedColumn = tableView.getGridColumns()[cellIndex];
				var columnType = clickedColumn.colType;
				if (Ext.isEmpty(columnType)) {
					var containsCheckboxCss = (clickedColumn.cls
							.indexOf('x-column-header-checkbox') > -1)
					columnType = containsCheckboxCss
							? 'checkboxColumn'
							: '';
				}
				me.handleGridRowClick(record, grid, columnType);
				
			});
		}
		else
		{
			grid.on('cellclick', function(tableView, td, cellIndex, record, tr,
							rowIndex, e) {
						var clickedColumn = tableView.getGridColumns()[cellIndex];
						var columnType = clickedColumn.colType;
						if (Ext.isEmpty(columnType)) {
							var containsCheckboxCss = (clickedColumn.cls
									.indexOf('x-column-header-checkbox') > -1)
							columnType = containsCheckboxCss
									? 'checkboxColumn'
									: '';
						}
						me.handleGridRowClick(record, grid, columnType);
					});
		}
	},
	gridDataPreprocessor : function(grid, data) {
		var me = this;
		var strUrl = 'services/payments/async-txn-status'
		console.log(data);			
		var postData = {
			'filter': []
		};

		if (data.d.batch.length == 0)
		{
			return data;
		}

		for (bat in data.d.batch) {
			if (data.d.batch[bat].identifier != null)
				postData.filter.push(data.d.batch[bat].identifier);
		}

		console.log(postData);

		var response = Ext.Ajax.request({
			async: false,
			headers: {'Content-Type': 'application/json'},
			waitTitle: 'Connecting',
			waitMsg: 'Sending data...',                                     
			url: strUrl,
			method: 'POST',
			jsonData : Ext.encode( postData )
		});

		var items = Ext.decode(response.responseText);

		for (var i=0;i<items.length; i++)
		{
			var item = items[i];
			for (bat in data.d.batch) {
				if (data.d.batch[bat].identifier == item.refRecordKeyNo && item.complete === false)
				{                                             
					data.d.batch[bat].__metadata.__rightsMap='0000000000000110110000';
					data.d.batch[bat].__metadata.__inProgress='Y';
					data.d.batch[bat].actionStatus = 'In Progress';
					data.d.batch[bat].actionState = 99;
				}
				//1000011010000111110000
			}
		}
		return data;
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
				me
						.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		} else {
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
			buttonMask = jsonData.d.__metadata.__buttonMask;

		maskArray.push(buttonMask);
		var isCrossCcy = false;
		var actionState = "";
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			if (objData.get('authLevel') === 0
					&& objData.get('paymentType') !== 'QUICKPAY')
				blnAuthInstLevel = true;
			maskArray.push(objData.get('__metadata').__rightsMap);
			var debitCcy = objData.get('debitAccountCcy');
			var txnCcy = objData.get('paymentCcy');
			actionState = objData.get('actionState');
			if(!Ext.isEmpty(debitCcy) && !Ext.isEmpty(txnCcy) && txnCcy !== debitCcy){
				isCrossCcy = true;
			}
		}
		
		if (blnAuthInstLevel && allowInstLvlSend != 'true') {	 
			buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
			maskArray.push(buttonMask);
		}
		if (arrSelectedRecords.length > 1 && showFxPopup === 'AUTH' && isCrossCcy) {
			buttonMask = me.replaceCharAtIndex(4, '0', buttonMask);
			buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
			maskArray.push(buttonMask);
		}
		
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		if(actionState == "30")
		{
			actionMask = me.replaceCharAtIndex(6, '1', actionMask);
		}
		objGroupView.handleGroupActionsVisibility(actionMask);
		me.enableNachaDownloadOption(arrSelectedRecords);
		
		if(allowInstLvlSend === 'true'){
			var selectedAmnt, totalAmnt=0.00;
			for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			selectedAmnt = objData.data.amount;
			if(selectedAmnt.includes(','))
			{
				for (var i = 0; i <= selectedAmnt.split(/[\,\?]+/).length; i++) {
					selectedAmnt = selectedAmnt.replace(',', '');
				}
			}
			totalAmnt = parseFloat(totalAmnt) + parseFloat(selectedAmnt);
		}
			$('.hdrSelectedAmountFormatted_HdrInfo').html(objRecord.data.currency + totalAmnt.toLocaleString(usrLocale.substring(0,2),{minimumFractionDigits: 2}));
			$('.selectedInstCount_HdrInfo').html(arrSelectedRecords.length);
			$('#batchSelectedAmnt').show();
			if(objData == null)
				$('#batchSelectedAmnt').hide();
		}
		
	},
	generateColumnFilterUrl : function(filterData) {
		var strTempUrl = '';
		var obj = null, arrValues = null;
		var arrNested = null
		// TODO: This is currently handled only for type list, to be handled for
		// rest types
		if (filterData) {
			for (var key in filterData) {
				obj = filterData[key] || {};
				arrValues = obj.value || [];
				if (obj.type === 'list') {
					Ext.each(arrValues, function(item) {
								if (item) {
									arrNested = item.split(',');
									Ext.each(arrNested, function(value) {
												strTempUrl += strTempUrl
														? ' or '
														: '';
												strTempUrl += arrSortColumn[key]
														+ ' eq \''
														+ value
														+ '\'';
											});
								}
							});
					if (strTempUrl)
						strTempUrl = '( ' + strTempUrl + ' )';
				}
			}
		}
		return strTempUrl;
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
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
		if (Ext.isEmpty(strUrl ) && !Ext.isEmpty(strAdvancedFilterUrl) && strAdvancedFilterUrl.indexOf(' and') == 0) {
			strAdvancedFilterUrl = strAdvancedFilterUrl.substring(4, strAdvancedFilterUrl.length);
		}
		if (!Ext.isEmpty(strAdvancedFilterUrl)) {
			var tempUrl = strAdvancedFilterUrl.trim();
			var substrUrl = tempUrl.substring(0,9);
			if (Ext.isEmpty(strUrl) && substrUrl != "&$orderby") {
				strUrl = "&$filter=";
			}
			strUrl += strAdvancedFilterUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strDetailUrl)) {
			strUrl += "&$filterDetail=" + strDetailUrl;
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

			filterData = me.checkAndAddGlobalSearchFilter(filterData, me);		//added to show payment summary as per selected global search card
			
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk'
								|| operator === 'gt' || operator === 'lt')) {
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
						if (filterData[index].dataType === 1 || filterData[index].dataType === 'D') {
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
								} else if (filterData[index].dataType === 1  || filterData[index].dataType === 'D') {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + 'date\''
											+ filterData[index].value1 + '\'';
								} else if (filterData[index].field === "Reversal") {
									strTemp = strTemp
											+ "(InstrumentType eq 'ACH' and PhdReference eq 'REVERSAL')"
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						var filterFieldId = filterData[index].field;
						// objValue = objValue.replace(reg, '');
						if(filterFieldId =='CompanyId' || filterFieldId == 'AccountNo' || filterFieldId == 'Channel'){
							objValue = decodeURIComponent(objValue);
						}
						var objArray = objValue.split(',');
						var joinVal ='';
						if(filterFieldId =='CompanyId' || filterFieldId == 'AccountNo' || filterFieldId == 'Channel'){
								objArray.forEach( function(val,indx){
								joinVal = val.indexOf('^') > -1 ? val.replace(/\^/g,',') : val;
								objArray[indx]=encodeURIComponent(joinVal);
							});
						}
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
										blnDtlFilterApplied = true;
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
	enableNachaDownloadOption : function(arrSelectedRecords) {
		if (!isClientUser()) {
			var me = this;
			var isDisabled = true;
			var count = 0;
			count = (arrSelectedRecords && !Ext
					.isEmpty(arrSelectedRecords.length))
					? arrSelectedRecords.length
					: 0;
			isDisabled = (count === 1) ? false : true;
			if (!isDisabled) {
				$('#downloadNachaId').removeClass('ui-helper-hidden');
				$('#downloadNachaId a').attr("disabled", false);
				$('#downloadNachaId a').attr("href", "#");
				$("#downloadNachaId").hover(function() {
							$(this).removeClass('downloadNacha-disabled');
						});
			} else {
				$('#downloadNachaId').addClass('ui-helper-hidden');
				$('#downloadNachaId a').attr("disabled", true);
				$('#downloadNachaId a').removeAttr("href");
				$("#downloadNachaId").hover(function() {
							$(this).addClass('downloadNacha-disabled');
						});
			}
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType, paymentFxInfo) {
		var me = this, isRekeyVerificationApplicable = false;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		$.each(arrSelectedRecords, function(index, cfg) {
			if(cfg.data.recKeyCheck == 'Y'){
					isRekeyVerificationApplicable = true;
					return false;
			}					
		});
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} 
		else if(strAction === 'verify')
		{
			me.showVerifyConfirmationPopUp(strAction, strUrl, grid,arrSelectedRecords, strActionType);
		}
		else if(strAction === 'verifySubmit')
		{
			if ((arrSelectedRecords[0].raw.actionState == 108 || arrSelectedRecords[0].raw.actionState == 109) && arrSelectedRecords[0].raw.verifyDeletedBatchCount == 0 && arrSelectedRecords[0].raw.verifyRejectedBatchCount == 0) {
				me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
						strActionType, strAction);
			}
			else
			{
				me.showVerifyConfirmationPopUp(strAction, strUrl, grid,arrSelectedRecords, strActionType);
			}
		}
		else if (strAction === 'submit' || strAction === 'auth' || strAction === 'send' ) {
				if (paymentFxInfo) {
						me.preHandleGroupActions(strUrl, paymentFxInfo,
								grid, arrSelectedRecords,
								strActionType, strAction);
				} else {
					if (('Y' === chrApprovalConfirmationAllowed || isRekeyVerificationApplicable)
							&& strAction === 'auth')
						me.showApprovalConfirmationPopupView(strUrl,
								'', grid, arrSelectedRecords,
								strActionType, strAction);
					else
						me.preHandleGroupActions(strUrl, '', grid,
								arrSelectedRecords, strActionType,
								strAction);
				}

		} else if (strAction === 'reversal') {
			me.showReversalConfirmationPopup(strUrl, '', grid,
					arrSelectedRecords, strActionType, strAction);
		}else if (strAction === 'pullToBank' || strAction === 'pullToBankReject' || strAction === 'pullToBankApprove') {
			me.showPullToBankPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		}else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
						strActionType, strAction);
		}

	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'verify') {
			fieldLbl = getLabel('instrumentVerifyRemarkPopUpTitle',
					'Please Enter Verify Remark');
			titleMsg = getLabel('instrumentVerifyRemarkPopUpFldLbl',
					'Verify Remark');
		} else if (strAction === 'reject') {
			fieldLbl = '<label class= "required">' +getLabel('instrumentReturnRemarkPopUpTitle',
					'Please Enter Reject Remark') + '</label>';
			titleMsg = getLabel('instrumentReturnRemarkPopUpFldLbl',
					'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
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
											'RejError',
											'Reject Remarks cannot be blank'),
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										}, 
									cls : 'xn-popup message-box',
									icon : Ext.MessageBox.ERROR
								});
							}else{
							me.preHandleGroupActions(strActionUrl, text, grid,
									arrSelectedRecords, strActionType,
									strAction);
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
	showVerifyConfirmationPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'verify') {
			fieldLbl = getLabel('verifyConfirmationMsg',
			'All unverified Instruments are selected for Verification. Do you want to continue?') ;
			titleMsg = getLabel('verifyConfirmation',
					'Verify Confirmation');
		}
		else if(strAction === 'verifySubmit')
		{
			fieldLbl = getLabel('submitConfirmationMsg',
			'Batch will get split after last verification .Do you want to continue?') ;
			titleMsg = getLabel('submitConfirmation',
					'Submit Confirmation');
		}
		Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
			cls : 't7-popup',
			width: 355,
			height : 200,
			bodyPadding : 0,
			fn : function(btn) {
				if (btn === 'ok') {
					if (btn == 'ok') {
						me.preHandleGroupActions(strActionUrl,'', grid,
								arrSelectedRecords, strActionType,
								strAction);
					}
				}
			}
		});
	},
	showPullToBankPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		 if (strAction === 'pullToBank' || strAction === 'pullToBankReject' || strAction === 'pullToBankApprove') {
			fieldLbl = '<label class= "required">' +getLabel('instrumentVerifyPullToBankPopUpTitle',
					'Please Enter Remark') + '</label>';
			titleMsg = getLabel('pullToBankPopUpLbl','Remarks');
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
					value :'Pull To Bank -',
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
											'Remarks cannot be blank'),
									buttons : Ext.MessageBox.OK,
									cls : 'xn-popup message-box',
									icon : Ext.MessageBox.ERROR
								});
							}else{
							me.preHandleGroupActions(strActionUrl, text, grid,
									arrSelectedRecords, strActionType,
									strAction);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255,
					id : 'txtrejectPullToBank',
					cols :"43" ,
					rows : "4",
					cls : "x-form-field",
					style : "resize: none;"
				});
		$('#txtrejectPullToBank').bind('blur',function(){
			markRequired(this);
		});
		$('#txtrejectPullToBank').bind('focus',function(){
			removeMarkRequired(this);
		});
		$('#txtrejectPullToBank').keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
			}
		});
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark,
								flipProduct : flipProduct,
								filterValue1 : (records[index].data.recKeyIdentifier) ? records[index].data.recKeyIdentifier : ''
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				groupView.setLoading(true);
				if(strUrl.indexOf("?")>0)
					strUrl+="&"+csrfTokenName+"="+tokenValue;
				else	
					strUrl+="?"+csrfTokenName+"="+tokenValue;
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								groupView.setLoading(false);
								me.tranInfoSection = true;
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								me.postHandleGroupAction(jsonRes, grid,
										strActionType, strAction, records);
								if (showRealTime === 'Y' && ('auth' === strAction
										|| 'send' === strAction
										|| 'submit' === strAction)) {
									processRealTimePirs(jsonRes, strUrl,
											strAction);
								}
							},
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		var me = this;
		var productList;
		var flipFlag = 'N'
		var cutOffInst =   {"instruments":[]};
		var groupView = me.getGroupView();
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg, strActionMessage = '';
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
		if(strAction == "pullToBank")
			strAction = "pullToBankAdmn";
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!')
		Ext.each(actionData, function(result) {
			intSerialNo = parseInt(result.serialNo,10);
			record = grid.getRecord(intSerialNo);
			row = grid.getRow(intSerialNo);
			msg = '';
			strIsProductCutOff = 'N';
			strIsRollover = 'N';
			strIsReject = 'N';
			strIsDiscard = 'N';
			var showPopup = 'N';
			
			
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
				if (!Ext.isEmpty(errCode)
						&& (errCode.substr(0, 4) === 'WARN' || errCode === 'GD0002'))
				{
					strIsProductCutOff = 'Y';
					showPopup = 'Y';
					 if(error.flag == 'Y')
						{ 
						 	flipFlag = error.flag;
						 	productList = error.productMap;
						 	if(!isEmpty(error.disableCutoffBtn)){
						 		disableCutoffBtns = error.disableCutoffBtn;  
							  }
						}
				}
				if (errCode.indexOf('SHOWPOPUP') != -1) {
					showPopup = 'Y';
				}
				if("SHOWPOPUP,CUTOFF,ROLLOVER,FLIP" == errCode )
					{
						productList = error.productMap;
						if(!isEmpty(error.disableCutoffBtn)){
							disableCutoffBtns = error.disableCutoffBtn;  
						  }
					}
					
			});
			if (showPopup === 'Y') {
				if (isNaN(fxTimer))
					fxTimer = 10;
				var countdown_number = 60 * fxTimer;
					cutOffInst.instruments.push({
						    "paymentFxInfo": result.paymentFxInfo,
						    "strAction":strAction,
						    "grid":grid,
						    "record" : record,
						    "errorCode" : errCode
						  });
			} else {
				row = grid.getRow(intSerialNo);
				me.handleVisualIndication(row, record, result,
						strIsProductCutOff, true);
				grid.deSelectRecord(record);
				row = grid.getLockedGridRow(intSerialNo);
				me.handleVisualIndication(row, record, result,
						strIsProductCutOff, false);
				if (!Ext.isEmpty(strAction)) {
					if (strAction === 'auth' || strAction === 'release') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						}
					} else if (strAction === 'save' || strAction === 'submit'
							|| strAction === 'send') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsDiscard = 'Y';
						}
					}
				}
				strActionMessage = result.success === 'Y'
									? strActionSuccess
									: (result.success === 'W02'
											? warnLimit
											: msg);
				if(result.success === 'Y' && result.isWarning === 'Y'){
					strActionMessage += ' <p class="error_font">'+ msg + '</p>';
				}
				arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							isProductCutOff : strIsProductCutOff,
							isRollover : strIsRollover,
							isReject : strIsReject,
							isDiscard : strIsDiscard,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('clientReference'),
							actionMessage :strActionMessage
						});
			}
		});
		
		if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0 )
			{
				me.countdownTimerVal = null;
				me.isCutOff=  true;
				if (isNaN(fxTimer))
					fxTimer = 10;
				var countdown_number = 60 * fxTimer;
				me.countdownTimerVal = countdown_number;
				me.takeCutOffTranAction(cutOffInst,0, productList,flipFlag);
				me.showCutOffTimer(me.countdownTimerVal);
			}
		
		/*
		 * if (!Ext.isEmpty(arrActionMsg) && errorPanel) {
		 * errorPanel.loadResultData(arrActionMsg); errorPanel.show(); }
		 */
		me.hideQuickFilter();
		arrMsg = (me.populateActionResult(arrActionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		groupView.setLoading(false);
		// refresh Grid here only when there is no cutoff popup else refresh after cutoff popup actions. check function takeCutOffTranAction below
		if(!me.isCutOff)
		{
			blnRolloverclicked = false;	
			groupView.refreshData();
		}
	},
	takeCutOffTranAction : function(cutOffInst,index, productList,flipFlag) {
		var me = this;
		var groupView = me.getGroupView();
		if(cutOffInst.instruments.length > index )
		{	
			if(me.countdownTimerVal > 0)
				me.showCutOffPopup(cutOffInst,index, productList,flipFlag);
		}
		else if(me.countdownTimerVal > 0)
		{
			// when no instrument is pending to take action and timer is still running, clear it out.
			clearTimeout(countdown);
			me.isCutOff=  false;
			groupView.refreshData();
		}
		else
		{	// when cutoff times has expired and cutoff popup action not taken or not yet completed
			me.isCutOff=  false;
			blnRolloverclicked = false ;
			// to close all popup windows if any open. fr example of reject action, reject Remark
		//	var win = Ext.WindowManager.getActive();
		//	if(!Ext.isEmpty(win))
		//		win.close();
			// to close all Open window popup. fr example of reject action, reject Remark
			groupView.refreshData();
		}
	},
	showCutOffTimer : function(countdown_number) {
		var me = this;
		var inLabel = "in " ;
		var colen = ":";
			
			mins = Math.floor(countdown_number / 60);
			var sec = countdown_number % 60;
			if (mins <= 9) {
				mins = "0" + mins;
			}
			if (sec <= 9) {
				sec = "0" + sec;
			}
			if (mins < 1) {
				mins = "00";
			}
			
			if (countdown_number > 0) {
				countdown_number--;
				me.countdownTimerVal = countdown_number;
				if (countdown_number > 0) {
					countdown = setTimeout(function() {
								$("#timePartDisplay").text(getLabel('fxPopupDisclaimer', 'Take Action ') + inLabel + mins
										+ colen + sec);
								$("#timePartInfoIcon").addClass('fa fa-info-circle');
								me.showCutOffTimer(countdown_number);	
							}, 1000);
				} else {
					$('#fxPopupDiv').dialog("close");
					clearTimeout(countdown);
				}
			}			
	},
	showCutOffPopup : function(cutOffInst,index, productList,flipFlag){
		
		var me = this,records = [];
		var paymentFxInfo = cutOffInst.instruments[index].paymentFxInfo;
		var strAction = cutOffInst.instruments[index].strAction;
		var grid = cutOffInst.instruments[index].grid;
		var record = cutOffInst.instruments[index].record;
		var errorCode = cutOffInst.instruments[index].errorCode;
		
		var groupView = me.getGroupView();
		var fxRateVal = paymentFxInfo.fxInfoRate;
		records.push(record);
		
		if (typeof fxRateVal == "undefined") {
			fxRateVal = '';
		}
		
		if(FXCNTRGET == 'Y' && !Ext.isEmpty(paymentFxInfo.debitCurrency)  && !Ext.isEmpty(paymentFxInfo.paymentCurrency) &&
				paymentFxInfo.debitCurrency !=  paymentFxInfo.paymentCurrency )
		{
			var fxRateRef = document.getElementById("fxRateInfo");
			fxRateRef.innerHTML = fxRateVal;
			fxRateRef.setAttribute('title', fxRateVal);
			$('#fxRateInfoDiv').removeClass('hidden');
			$('#timePartDiv').removeClass('hidden');
			$('#debitAmtDiv').removeClass('hidden');
			
		}
		else
		{
			$('#fxRateInfoDiv').addClass('hidden');
			$('#timePartDiv').addClass('hidden');
			$('#debitAmtDiv').addClass('hidden');
		}
		// on popup render by default first remove the text already present for timer part along with info icon.
		//$('#fxRateInfoDiv').removeClass('hidden');
		//$('#timePartDiv').removeClass('hidden');
		$("#timePartDisplay").text('');
		$("#timePartInfoIcon").removeClass('fa fa-info-circle');
		
		var debitAmntVal = paymentFxInfo.debitAmount;
		
		if (typeof debitAmntVal == "undefined") {
			debitAmntVal = '';
		}
		if(errorCode == "WARNCUT002")
		{
			me.doHandleGroupActions(strAction, grid, records, 'rowAction',
					paymentFxInfo.encryptedFxInfo);
			me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
		}
		else 
		{
			$('#fxPopupDiv').dialog({
				title : getLabel('fxPopupTitle', 'Cutoff time or effective date has lapsed. Continue with changed effective date?'),
				autoOpen : false,
				maxHeight : 550,
				minHeight : 156,
				width : 1000,
				modal : true,
				resizable : false,
				draggable : false,
				close: function(event, ui)
	     	   	{
					closeApprovalConfirmationPopup();
					me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
	        	}
	        });		
			$('#fxPopupDiv').dialog("open");
			$('#cancelFxBtn').unbind('click');
			$('#cancelFxBtn').bind('click', function() {
						groupView.setLoading(false);
						$('#fxPopupDiv').dialog("close");
						me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
					});
			$('#okFxBtn').unbind('click');
			$('#okFxBtn').bind('click', function() {
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#discardBtnNoRollover').unbind('click');
			$('#discardBtnNoRollover').bind('click', function() {
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#discardBtnForWARN').unbind('click');
			$('#discardBtnForWARN').bind('click', function() {
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});		
			$('#discardBtn').unbind('click');
			$('#discardBtn').bind('click', function() {
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#discardPopupBtn').unbind('click');
			$('#discardPopupBtn').bind('click', function() {
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#rolloverBtn').unbind('click');
			$('#rolloverBtn').bind('click', function() {
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#rolloverBtnForWARN').unbind('click');
			$('#rolloverBtnForWARN').bind('click', function() {
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});		
			$('#rejectBtn').unbind('click');
			$('#rejectBtn').bind('click', function() {
				me.doHandleGroupActions('reject', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			$('#rejectPopupBtn').unbind('click');
			$('#rejectPopupBtn').bind('click', function() {
				me.doHandleGroupActions('reject', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});
			
			$('#flipBtnForWARNBtn').unbind('click');
			$('#flipBtnForWARNBtn').bind('click', function() {
				//clearTimeout(countdown);
				var field = $('#flipList');
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden'); 
					$('#productListselectDiv').addClass('hidden');				
				}
				else{
					$("#productListselectDiv").empty();
					me.createFlipView(productList);
				}
				
			});
			$('#discardBtnForWARNFlip').unbind('click');
			$('#discardBtnForWARNFlip').bind('click', function() {
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});		
			
			$('#rolloverBtnForWARNFlip').unbind('click');
			$('#rolloverBtnForWARNFlip').bind('click', function() {
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
				me.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag);
			});		
			
			$('#flipNRBtn').unbind('click');
			$('#flipNRBtn').bind('click', function() {
				clearTimeout(countdown);
				var field = $('#flipList');
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{
					$("#productListselectDiv").empty();
					me.createFlipView(productList);
				}			
			});
			
			$('#flipPopupBtn').unbind('click');
			$('#flipPopupBtn').bind('click', function() {
				clearTimeout(countdown);
				var field = $('#flipList');
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{
					$("#productListselectDiv").empty();
					me.createFlipView(productList);
				}			
			});
			
			$('#discardFlipBtn').unbind('click');
			$('#discardFlipBtn').bind('click', function() {
				clearTimeout(countdown);
				me.doHandleGroupActions('discard', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
			});
			$('#rejectFlipBtn').unbind('click');
			$('#rejectFlipBtn').bind('click', function() {
				clearTimeout(countdown);
				me.doHandleGroupActions('reject', grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
			});
			$('#rolloverFlipBtn').unbind('click');
			$('#rolloverFlipBtn').bind('click', function() {
				clearTimeout(countdown);
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				$('#fxPopupDiv').dialog("close");
			});		
			
			$('#okFlipBtn').unbind('click');
			$('#okFlipBtn').bind('click', function() {
							
				var newproductmap = me.getNewProductMap();
				if(newproductmap == ""){
					$('#messageContentDivFlip').removeClass('hidden');
					$('#messageAreaFlip').empty().removeClass('hidden').append("Please select flip product for all products or take other cut off action.")
					return false;
				}	
				clearTimeout(countdown);
				flipProduct = newproductmap;
				me.doHandleGroupActions(strAction, grid, records, 'rowAction',
						paymentFxInfo.encryptedFxInfo);
				flipProduct = undefined ;
				$('#flipProductList').addClass('hidden');
				$('#fxPopupDiv').dialog("close");
			});
			$('#flipBtn').unbind('click');
			$('#flipBtn').bind('click', function() {
				//clearTimeout(countdown);
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{
					$("#productListselectDiv").empty();
					me.createFlipView(productList);
				}
				
			});
			$('#flipProductList,#cutoffRLFlipButtonsUl,#cutoffNRFlipButtonsUl,#cutoffAuthNRFlipButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
			if ('auth' === strAction
					&& (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER')) {
				$('#cutoffAuthRLButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			} else if ('auth' === strAction
					&& (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD')) {
				$('#cutoffAuthNRButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			} else if (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER'
					|| errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER') {
				$('#cutoffRLButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			} else if (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD'
					|| errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD') {
				$('#cutoffNRButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			} else if ('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,ROLLOVER,FLIP')  ) {
				$('#cutoffAuthRLFPButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
						.addClass('hidden');
			}
			else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,DISCARD,FLIP')  ) {
				$('#cutoffAuthNRFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			}
			else if (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,ROLLOVER,FLIP') {
				$('#cutoffRLFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
						.addClass('hidden');
			}
			else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,DISCARD,FLIP' ) {
				$('#cutoffNRFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
						.addClass('hidden');
			}
			else if (errorCode == 'SHOWPOPUP,FX') {
				$('#fxButonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl')
						.addClass('hidden');
			}
			if (errorCode.indexOf('FX') != -1 && errorCode.indexOf('CUTOFF') != -1) {
				$('#disclaimerTextcutoffFXDivView').removeClass('hidden');
				$('#disclaimerTextcutoffDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').removeClass('hidden');
			} else if (errorCode.indexOf('CUTOFF') != -1) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
			}
			else if (errorCode.indexOf('WARN') != -1 && 'Y' == flipFlag) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
				$('#cutoffRLFlipButtonsUl').removeClass('hidden');			
			}	
			else if (errorCode.indexOf('WARN') != -1) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffRLButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffRLFlipButtonsUl')
				.addClass('hidden');
				if(strAction == 'submit')
				{
					$('#cutoffAuthRLFPButtonsUl').addClass('hidden');
				}
			}	
			else if (errorCode.indexOf('GD0002') != -1 && 'Y' == flipFlag) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
				$('#cutoffNRFlipButtonsUl').removeClass('hidden');
			}	
			else if (errorCode.indexOf('GD0002') != -1) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffNRButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl')
				.addClass('hidden');
			}		
			else if (errorCode.indexOf('FX') != -1) {
				$('#disclaimerTextFXDivView').removeClass('hidden');
				$('#disclaimerTextcutoffDivView, #disclaimerTextcutoffFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').removeClass('hidden');
			}
			var confidentialFlag = paymentFxInfo.confidentialFlag;
			var formattedAmtValue = paymentFxInfo.formattedAmtValue;
			if(confidentialFlag == 'Y')
			{
				
				var debitAmtRef = document.getElementById("debitAmt");
				debitAmtRef.innerHTML = formattedAmtValue;
				var debitCcyRef = document.getElementById("debitCcy");
				debitCcyRef.innerHTML = "";
				debitAmtRef.setAttribute('title', formattedAmtValue);
				debitCcyRef.setAttribute('title', formattedAmtValue);
				var paymentAmtRef = document.getElementById("paymentAmt");
				paymentAmtRef.innerHTML = formattedAmtValue;
				var paymentCcyRef = document.getElementById("paymentCcy");
				if (typeof paymentFxInfo.paymentCurrency == "undefined") {
					paymentFxInfo.paymentCurrency = '';
				}
				paymentCcyRef.innerHTML = "";
				paymentAmtRef.setAttribute('title', formattedAmtValue);
				paymentCcyRef.setAttribute('title', formattedAmtValue);
				}
			else
			{
				var debitAmtRef = document.getElementById("debitAmt");
				debitAmtRef.innerHTML = debitAmntVal;
				var debitCcyRef = document.getElementById("debitCcy");
				debitCcyRef.innerHTML = paymentFxInfo.debitCurrency;
				debitAmtRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
				debitCcyRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
				var paymentAmtRef = document.getElementById("paymentAmt");
				paymentAmtRef.innerHTML = paymentFxInfo.paymentAmount;
				var paymentCcyRef = document.getElementById("paymentCcy");
				paymentCcyRef.innerHTML = paymentFxInfo.paymentCurrency;
				paymentAmtRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
				paymentCcyRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
			}
			var valueDateRef = document.getElementById("valueDate");
			valueDateRef.innerHTML = paymentFxInfo.valueDate;
			var paymentRef = document.getElementById("paymentRef");
			if (typeof paymentFxInfo.paymentRef == "undefined")	
			{
				paymentRef.innerHTML = '';
			}
			else
			{
				paymentRef.innerHTML = paymentFxInfo.paymentRef;
			}
			paymentRef.setAttribute('title', paymentRef.innerHTML);		
		}
		
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
	preHandleProductCutoff : function(errRecord, strUserMsg, strAction) {
		var me = this;

		if (strUserMsg != 'Y') {
			// DO NOTHING.. if user has not selected 'Y'
			me.refreshData();
			return;
		}

		var strSerialNo = errRecord.actualSerailNo;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var objGridRecord = grid.getRecord(parseInt(strSerialNo,10));
		// var strUrl = Ext.String.format(me.strBatchActionUrl,
		// errRecord.lastActionUrl);
		var strActionTaken = strAction;
		var strIdentifier = objGridRecord.get('identifier');
		var objJson = new Array();
		var strActionUrl = null;
		if (strActionTaken === 'Rollover') {
			strActionUrl = errRecord.lastActionUrl;
			strMsg = strUserMsg;
		} else if (strActionTaken === 'Reject') {
			strActionUrl = 'reject';
			strMsg = errRecord.actionMessage;
		} else if (strActionTaken === 'Discard') {
			strActionUrl = 'discard';
			strMsg = errRecord.actionMessage;
		}
		var strUrl = Ext.String.format(me.strBatchActionUrl, strActionUrl);
		objJson.push({
					serialNo : strSerialNo,
					identifier : strIdentifier,
					userMessage : strUserMsg
				});

		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						if (response && response.responseText)
							me.postHandleProductCutoff(Ext
											.decode(response.responseText),
									strUrl, strUserMsg, strActionTaken);
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
	postHandleProductCutoff : function(objData, strLastActionUrl, strUserMsg,
			strActionTaken) {
		me = this;
		var result = null;
		if (objData && objData.d && objData.d.instrumentActions)
			result = Ext.isEmpty(objData.d.instrumentActions)
					? new Array()
					: objData.d.instrumentActions[0];
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var curPage = grid.getCurrentPage();
		var pageSize = grid.getPageSize();
		var intValue = 0;
		var modelRecord;
		var msg = '', strIsProductCutOff = 'N', errCode = '', record = '';
		var actionMsg = [], arrMsg = [];
		var row = null;
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!')
		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';

		record = grid.getRecord(parseInt(result.serialNo,10));
		intValue = ((curPage - 1) * pageSize) + parseInt(result.serialNo,10);
		if (Ext.isEmpty(intValue))
			intValue = parseInt(result.serialNo,10);

		if (result.success === 'FX') {
			if (isNaN(fxTimer))
				fxTimer = 10;
			countdown_number = 60 * fxTimer;
			// me.countdownTrigger(result.paymentFxInfo, strAction, grid,
			// records);
		} else if (result.success === 'N') {

			Ext.each(result.errors, function(error) {
						msg = msg + error.code + ' : ' + error.errorMessage
								+ '<br/>';
						errCode = error.code;
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 3) === 'WARN')
							strIsProductCutOff = 'Y';
					});
			if (strIsProductCutOff == 'Y') {
				if (!Ext.isEmpty(strAction)) {
					if (strAction === 'auth' || strAction === 'send') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						}
					} else if (strAction === 'save' || strAction === 'submit') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode)
								&& errCode === 'GD0002') {
							strIsDiscard = 'Y';
						}
					}
				}
			}
			actionMsg.push({
						success : result.success,
						serialNo : intValue,
						actualSerailNo : result.serialNo,
						isProductCutOff : strIsProductCutOff,
						actionTaken : 'N',
						isRollover : strIsRollover,
						isReject : strIsReject,
						isDiscard : strIsDiscard,
						lastActionUrl : strLastActionUrl,
						reference : Ext.isEmpty(record) ? '' : record
								.get('clientReference'),
						actionMessage : result.success === 'Y'
								? strActionSuccess
								: (result.success === 'W02' ? warnLimit : msg)
					});
		} else {
			actionMsg.push({
						success : result.success,
						serialNo : intValue,
						actualSerailNo : result.serialNo,
						isProductCutOff : strIsProductCutOff,
						actionTaken : 'N',
						lastActionUrl : strLastActionUrl,
						reference : Ext.isEmpty(record) ? '' : record
								.get('clientReference'),
						actionMessage : strActionTaken + ' ' + strActionSuccess
					});

		}
		/* Update the error div */
		/*
		 * if (!Ext.isEmpty(actionMsg)) { getRecentActionResult(actionMsg); }
		 * 
		 * 
		 * if (!Ext.isEmpty(actionMsg[0])) { updateActionMessage(actionMsg[0],
		 * actionResultMsgCounter); }
		 */
		arrMsg = (me.populateActionResult(actionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}
		row = grid.getRow(intValue);
		me
				.handleVisualIndication(row, record, result,
						strIsProductCutOff, true);
		row = grid.getLockedGridRow(intValue);
		me.handleVisualIndication(row, record, result, strIsProductCutOff,
				false);

	},
	/**
	 * Show visual indication in grid and update the row i.e Red for Error,
	 * Green for Success and Orange for Warning
	 * 
	 * @param {Ext.data.Model}
	 *            targetRow reference to grid row
	 * @param {Ext.data.Model}
	 *            targetRecord reference to grid record
	 * @param {JSONObject}
	 *            resultData response data
	 * @param {Boolean}
	 *            strIsProductCutOff is product cutoff
	 */
	handleVisualIndication : function(targetRow, targetRecord, resultData,
			strIsProductCutOff, blnUpdateRecord) {
		if (targetRow) {
			if (resultData.success === 'Y') {
				if (blnUpdateRecord) {
					targetRecord.beginEdit();
					targetRecord.set({
								actionStatus : resultData.updatedStatus,
								txnDate : resultData.effectiveDate,
								__metadata : {
									__rightsMap : resultData.__metadata.__rightsMap
								},
								identifier : resultData.identifier,
								isActionTaken : 'Y'
							});
					targetRecord.endEdit();
					targetRecord.commit();
				}
				targetRow.addCls('xn-success-row xn-disabled-row');
			} else {
				if (blnUpdateRecord) {
					targetRecord.beginEdit();
					targetRecord.set({
								isActionTaken : resultData.success === 'N'
										&& strIsProductCutOff === 'Y'
										? 'Y'
										: 'N'
							});
					targetRecord.endEdit();
					targetRecord.commit();
				}
				if (strIsProductCutOff === 'Y') {
					targetRow.addCls('xn-warn-row xn-disabled-row');
				} else {
					targetRow.addCls('xn-error-row');
				}
			}
		}
	},
	/*
	 * me.doHandleProcessDateCalculation(strAction, strUrl, grid,
	 * arrSelectedRecords, strActionType);
	 */
	doHandleProcessDateCalculation : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType, paymentFxInfo) {
		var me = this;
		var groupView = me.getGroupView();
		var strIde = arrSelectedRecords[0].data.identifier;			
		var strActionUrl = 'services/paymentheaderinfo.json';
		Ext.Ajax.request({
			url : strActionUrl,
			method : "POST",
			data : {
				'$id' : strIde,
				'csrfTokenName' : tokenValue
			},
			success : function(response) {
				var resData = Ext.decode(response.responseText);
				if (resData && resData.d && resData.d.paymentHeaderInfo) {
					var hdrInfo = resData.d.paymentHeaderInfo;
					var strMsg1 = '', strMsg2 = '', strCnt1 = 0, strCnt2 = 0;
					if (hdrInfo.offsetDateExceedCount > 0) {
						strMsg1 = hdrInfo.offsetDateMessage;
						strCnt1 = hdrInfo.offsetDateExceedCount;
					}
					if (hdrInfo.instCutoffExceedCount > 0) {
						strMsg2 = hdrInfo.offsetDateMessage;
						strCnt2 = hdrInfo.instCutoffExceedCount;
					}
					if (strCnt1 > 0 || strCnt2 > 0) {
						Ext.Msg.show({
									title : getLabel('instrumentWarning',
											'Warning'),
									msg : strMsg1 + !Ext.isEmpty(strMsg2)
											? '\n' + strMsg2
											: '',
									buttons : Ext.Msg.OKCANCEL,
									buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
									style : {
										height : 400
									},
									bodyPadding : 0,
									fn : function(btn) {
										if (btn === 'ok') {
											if ('Y' === chrApprovalConfirmationAllowed
													&& strAction === 'auth') {
												me
														.showApprovalConfirmationPopupView(
																strUrl,
																'Y',
																grid,
																arrSelectedRecords,
																strActionType,
																strAction);
											} else {
												me.preHandleGroupActions(
														strUrl, 'Y', grid,
														arrSelectedRecords,
														strActionType,
														strAction);
											}
										}
									}
								});
					} else {
					}
				}
			},
			failure : function(response) {
				var errMsg = "";
				groupView.setLoading(false);
				Ext.MessageBox.show({
							title : getLabel('instrumentErrorPopUpTitle',
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
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var strPmtType = record.get('paymentType');
		if ((strPmtType != 'QUICKPAY') && (actionName === 'auth')
				&& record.get('authLevel') == 0) {
			actionName = 'btnView';
		}
		if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'verify' || actionName === 'auth'
				|| actionName === 'send' || actionName === 'reject'
				|| actionName === 'hold' || actionName === 'release'
				|| actionName === 'stop' || actionName === 'reversal' || actionName === 'verifySubmit') {
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri) && !Ext.isEmpty(record.get('identifier'))) {
				me.showHistory(record);
			}
		} else if (actionName === 'btnView' || actionName === 'btnEdit'
				|| actionName === 'btnClone'
				|| actionName === 'btnCloneTemplate'
				|| actionName === 'btnViewMySend' || actionName === 'btnViewMyAuth') {
			if (!Ext.isEmpty(strPmtType)) {
				var strUrl = '', objFormData = {};
				if (actionName === 'btnView' && strPmtType === 'QUICKPAY')
					strUrl = 'viewPayment.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnEdit')
					strUrl = 'editMultiPayment.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& (actionName === 'btnView' || actionName === 'btnViewMySend' || actionName === 'btnViewMyAuth'))
					strUrl = 'viewMultiPayment.form';
				else if (actionName === 'btnEdit' && strPmtType === 'QUICKPAY')
					strUrl = 'editPayment.form';
				else if (actionName === 'btnClone' && strPmtType === 'QUICKPAY')
					strUrl = 'editPayment.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnClone')
					strUrl = 'editMultiPayment.form';
				else if (actionName === 'btnCloneTemplate'
						&& strPmtType === 'QUICKPAY')
					strUrl = 'editTemplate.form';
				else if (actionName === 'btnCloneTemplate'
						&& (strPmtType === 'BB' || strPmtType === 'RR'))
					strUrl = 'editMultiTemplate.form';

				objFormData.strLayoutType = !Ext.isEmpty(record.get('layout'))
						? record.get('layout')
						: '';
				objFormData.strPaymentType = !Ext.isEmpty(record
						.get('paymentType')) ? record.get('paymentType') : '';
				objFormData.strProduct = !Ext
						.isEmpty(record.get('productType')) ? record
						.get('productType') : '';
				objFormData.strActionStatus = !Ext.isEmpty(record
						.get('actionStatus')) ? record.get('actionStatus') : '';
				objFormData.strPhdnumber = !Ext
						.isEmpty(record.get('phdnumber')) ? record
						.get('phdnumber') : '';
						objFormData.strPirMode = !Ext
						.isEmpty(record.get('pirMode')) ? record
						.get('pirMode') : '';
				
				objFormData.viewState = record.get('identifier');
				objFormData.buttonIdentifier = record.get("__metadata").__buttonIdentifier;
				objFormData.txtBenefCode = record.get('systemBenefCode');
				if (actionName === 'btnView' || actionName === 'btnEdit' || actionName === 'btnViewMySend' || actionName === 'btnViewMyAuth') {
					if (!Ext.isEmpty(strUrl)) {
						me.doSubmitForm(strUrl, objFormData, actionName);
					}

				} else if (actionName === 'btnClone'
						|| actionName === 'btnCloneTemplate') {
					var strActionUrl = Ext.String.format(me.strBatchActionUrl,
							(actionName === 'btnClone')
									? 'clone'
									: 'copytotemplate');
					var jsonPost = [{
								serialNo : 1,
								identifier : objFormData.viewState,
								userMessage : ''
							}];

					Ext.Ajax.request({
						url : strActionUrl,
						method : 'POST',
						jsonData : Ext.encode(jsonPost),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data) && data.d
									&& data.d.instrumentActions) {
								var result = data.d.instrumentActions[0];
								if (result) {
									if (result.success === 'Y') {
										objFormData.viewState = result.identifier;
										objFormData.strCloneAction = 'Y'
										me.doSubmitForm(strUrl, objFormData,
												actionName);
									} else if (result.success === 'N') {
										me.tranInfoSection = true;
										me.postHandleGroupAction(data,
														grid, 'rowAction',
														actionName, record);

									}
								}

							}
						},
						failure : function() {
							var errMsg = "";
							widget.setLoading(false);
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});

				}
			}
		}
	},
	showHistory : function(record) {
		var historyPopup = Ext.create('GCP.view.HistoryPopup', {
					historyUrl : record.get('history').__deferred.uri, identifier: record.get('identifier')
				}).show();
		historyPopup.center();
		Ext.getCmp('btnTxnHistoryPopupClose').focus();
	},
	doSubmitForm : function(strUrl, formData, actionName) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLayout',
				formData.strLayoutType));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				formData.viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				formData.strProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPaymentType', formData.strPaymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtActionStaus', formData.strActionStatus));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
				formData.strPhdnumber));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'buttonIdentifier', formData.buttonIdentifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPirMode',
				formData.strPirMode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtBenefCode',
                formData.txtBenefCode));

		var paymentType = 'PAYMENT';
		if (!Ext.isEmpty(strUrl)
				&& strUrl.toLowerCase().indexOf('template') != -1) {
			paymentType = 'TEMPLATE';
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				paymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'actionName',
				actionName));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtCloneAction', formData.strCloneAction || 'N'));
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

	/*----------------------------Summary Ribbon Handling Starts----------------------------*/
	setInfoTooltip : function() {
		var me = this;
		Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoStdView',
					listeners : {
						'beforeshow' : function(tip) {
							var paymentTypeVal = '';
							var dateFilter = me.dateFilterLabel;
							var advfilter = (me.showAdvFilterCode || getLabel(
									'none', 'None'));
							if (me.paymentTypeFilterVal == 'all'
									&& me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else if (me.filterApplied == 'A'
									|| me.filterApplied == 'Q') {
								paymentTypeVal = me.paymentTypeFilterDesc;
							}
							tip.update(getLabel('paymentType',
									'Product Category')
									+ ' : '
									+ paymentTypeVal
									+ '<br/>'
									+ getLabel('date', 'Date')
									+ ' : '
									+ dateFilter
									+ '<br/>'
									+ getLabel('advancedFilter',
											'Advanced Filter')
									+ ':'
									+ advfilter);
						}
					}
				});

	},

	handleDateChange : function(index) {
		var me = this,dateToField;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');
		/* var toDatePickerRef = $('#entryDataToPicker'); */
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		var filterOperator = objDateParams.operator;
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {
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
		
		if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
		
		selectedEntryDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.dateFilterLabel
			};

		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " ("
						+ me.dateFilterLabel + ")", datePickerRef);

	},
	/*
	 * orderUpDown : function(grid, rowIndex, direction) { var record =
	 * grid.getStore().getAt(rowIndex);
	 * 
	 * var store = grid.getStore(); if (!record) { return; } var index =
	 * rowIndex;
	 * 
	 * if (direction < 0) { index--; if (index < 0) { return; } var beforeRecord =
	 * store.getAt(index); store.remove(beforeRecord); store.remove(record);
	 * 
	 * store.insert(index, record); store.insert(index + 1, beforeRecord); }
	 * else { if (index >= grid.getStore().getCount() - 1) { return; } var
	 * currentRecord = record; store.remove(currentRecord); var afterRecord =
	 * store.getAt(index); store.remove(afterRecord); store.insert(index,
	 * afterRecord); store.insert(index + 1, currentRecord); }
	 * this.sendUpdatedOrderJsonToDb(store); },
	 */
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/paymentsummary/groupViewAdvanceFilter.json',
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
		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.resetEntryDateAsDefault();
			me.resetAllFields();
			me.setDataForFilter();
			// If sorting is given from advance filter then do not allow sorting on grid.
			// And not even show sorting icon to any column in this case.
			// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//			enableDisableSortIcon(me, null, true);		
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',
					objFilterName));
			if(savedFilterCombobox.getValue() == objFilterName)
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
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		me.advFilterData = [];
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					headers: objHdrCsrfParams,
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
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getPaymentSummaryFilterView();
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
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		//me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getAdvancedFilterQueryJson());
		if (!Ext.isEmpty(widgetFilterUrl)) {
			objJson = me.setObjJson();
		}
		var reqJson = me.findInAdvFilterData(objJson, "Client");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "Client");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "ActionStatus");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"ActionStatus");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "EntryDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "EntryDate");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "pullToBank");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "pullToBank");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "parentBacthRefId");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "parentBacthRefId");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "ClientReference");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "ClientReference");
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
		
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if (!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;

	},
	setObjJson : function() {
		var objJson = null;
		var jsonArray = [];
		var me = this;
			for (var i = 0; i < arrFilterJson.length; i++) 
			{
				if (arrFilterJson[i].field === 'PayCategory') 
				{
					jsonArray.push({
						field : 'PayCategory',
						operator : arrFilterJson[i].operator,
						value1 : arrFilterJson[i].value1,
						value2 : arrFilterJson[i].value2,
						displayType : 5,
						fieldLabel : getLabel('PayCategory1', 'Payment'),
						displayValue1 : arrFilterJson[i].value2
					});
				}
				if (arrFilterJson[i].field === 'Client') 
				{
					jsonArray.push({
						field : 'Client',
						operator : arrFilterJson[i].operator,
						value1 : arrFilterJson[i].value1,
						value2 : arrFilterJson[i].value2,
						displayType : 5,
						fieldLabel : getLabel('lblcompany', 'Company Name'),
						displayValue1 : arrFilterJson[i].value2
					});
				}
				if (arrFilterJson[i].field === 'PayReqEntryDate' || arrFilterJson[i].field === 'EntryDate') 
				{
					var bracketPos1 = arrFilterJson[i].dateLabel.indexOf('(');
					var bracketPos2 = arrFilterJson[i].dateLabel.indexOf(')');
					var lable = arrFilterJson[i].dateLabel.substr(parseInt(bracketPos1,10)+1,parseInt(bracketPos2,10)-1);
					lable =	lable.replace('(','');
					lable =	lable.replace(')','');
					jsonArray.push({
					field : 'EntryDate',
					operator : arrFilterJson[i].operator,
					value1 : arrFilterJson[i].value1,
					value2 : arrFilterJson[i].value2,
					dataType : arrFilterJson[i].dataType,
					displayType : arrFilterJson[i].displayType,
					fieldLabel : getLabel('EntryDate','Entry Date'),
					dropdownLabel : lable,
					dropdownIndex : arrFilterJson[i].dropdownIndex,
					displayValue1 : arrFilterJson[i].value1,
					displayValue2 : arrFilterJson[i].value2
					});
				}else if (arrFilterJson[i].field === 'CreditDebitFlag') 
				{
					var instTypeDesc = arrFilterJson[i].value1;
					var creditDebitType = "";
					var creditDebitTypeDesc = "";
					if(instTypeDesc == "C,D")
					{
						creditDebitTypeDesc = "Both";
						creditDebitType = '';
					}
					else if(instTypeDesc == "D")
					{
						creditDebitType = 'D';
						creditDebitTypeDesc = "Debit";
					}
					else if(instTypeDesc == "C")
					{
						creditDebitType = 'C';
						creditDebitTypeDesc = "Credit";
					}	
					if (!Ext.isEmpty(creditDebitType)) {
						jsonArray.push({
									field : 'CreditDebitFlag',
									operator : arrFilterJson[i].operator,
									value1 : encodeURIComponent(creditDebitType.replace(new RegExp("'", 'g'), "\''")),
									value2 : '',
									dataType : 0,
									displayType : 12,
									fieldLabel : getLabel('CreditDebitFlag','Transaction Type'),
									displayValue1 : creditDebitTypeDesc
								});
					}
				}
				else if(arrFilterJson[i].field === 'InstrumentType' || arrFilterJson[i].field === 'ProductCategory')
				{
					var instTypeDesc = '';
					if(arrFilterJson[i].value1.indexOf(",") > 0)
						{
						  var instTypeArr = arrFilterJson[i].value1.split(',');
						  for (var k = 0; k < instTypeArr.length; k++)
							  {
							     instTypeDesc =instTypeDesc + me.getInstTypeParam(instTypeArr[k]);
							     if( k < (instTypeArr.length-1))
							    	 instTypeDesc =instTypeDesc+",";
							  }
						}
					else
						{
						 	instTypeDesc = me.getInstTypeParam(arrFilterJson[i].value1);
						}
					jsonArray.push({
							field : 'InstrumentType',
							operator : arrFilterJson[i].operator,
							value1 : arrFilterJson[i].value1,
							value2 : '',
							dataType : arrFilterJson[i].dataType,
							displayType : arrFilterJson[i].displayType, 
							fieldLabel : getLabel('PaymentCategory','Payment Type'),
							displayValue1 : instTypeDesc
						});
				}
				else if(arrFilterJson[i].field === 'ProductType')
				{
					var prdTypeDesc = '';
					if(arrFilterJson[i].value1.indexOf(",") > 0)
						{
						  var instTypeArr = arrFilterJson[i].value1.split(',');
						  for (var j = 0; j < instTypeArr.length; j++)
							  {
							  	 prdTypeDesc =prdTypeDesc + me.getProductTypeParam(instTypeArr[j]);
							     if( j < (instTypeArr.length-1))
							    	 prdTypeDesc =prdTypeDesc+",";
							  }
						}
					else
						{
							prdTypeDesc = me.getProductTypeParam(arrFilterJson[i].value1);
						}
					jsonArray.push({
						field : 'ProductType',
						operator : 'in',
						value1 : arrFilterJson[i].value1,
						value2 : '',
						dataType : 0,
						displayType : 11,// 6,
						fieldLabel : getLabel('PaymentMethod','Payment Package'),
						displayValue1 : prdTypeDesc
					});
				}
				
				else if(arrFilterJson[i].field === 'Maker')
				{
					jsonArray.push({
						field : 'Maker',
						operator : arrFilterJson[i].operator,
						value1 : encodeURIComponent(arrFilterJson[i].value1.replace(new RegExp("'", 'g'), "\''")),
						value2 : arrFilterJson[i].value2,
						dataType :arrFilterJson[i].dataType,
						displayType : arrFilterJson[i].displayType, 
						fieldLabel : getLabel('entryUser','Entry User'),
						displayValue1 : decodeURIComponent(arrFilterJson[i].value2)
					});
				}else if(arrFilterJson[i].field === 'ReceiverCode')
				{
					jsonArray.push({
						field : 'ReceiverCode',
						operator : arrFilterJson[i].operator,
						value1 : encodeURIComponent(arrFilterJson[i].value1.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType :arrFilterJson[i].dataType,
						displayType : arrFilterJson[i].displayType, 
						fieldLabel : getLabel('receiverCode','Receiver Code'),
						displayValue1 : arrFilterJson[i].value1
					});
				}else if(arrFilterJson[i].field === 'AccountNoPDT')
				{
					jsonArray.push({
						field : 'AccountNo',
						operator : 'in',
						value1 : encodeURIComponent(arrFilterJson[i].value1.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 11, //0,
						detailFilter : 'Y',
						fieldLabel : getLabel('sendingaccount','Sending Account'),
						displayValue1 : arrFilterJson[i].value1
					});
				}else if(arrFilterJson[i].field === 'Status' || arrFilterJson[i].field === 'ActionStatus')
				{
					if(arrFilterJson[i].paramValue1 != "" 
						&& arrFilterJson[i].paramValue1 != "ALL")
					{
						var statusValueDesc = [];
						statusarray = arrFilterJson[i].statusarray;						
						var statusDesc = '';
						if (!Ext.isEmpty(arrFilterJson[i].statusarray))
						{
							for (var j = 0; j < arrFilterJson[i].statusarray.length; j++)
							  {
								statusDesc =statusDesc + me.getStatusParam(arrFilterJson[i].statusarray[j]);
							     if( j < (arrFilterJson[i].statusarray.length-1))
							    	 statusDesc = statusDesc+",";
							  }
						}
						me.statusarraydesc = statusDesc;
						
						jsonArray.push({
							field : 'ActionStatus',
							operator : 'in',
							value1 : arrFilterJson[i].paramValue1,
							value2 : arrFilterJson[i].value2,
							dataType : 0,
							displayType :11,// 6,
							fieldLabel : getLabel('status','Status'),
							displayValue1 : statusDesc
							
						});
					}
				}
				else if(arrFilterJson[i].field === 'Amount')
				{
					if (!Ext.isEmpty(amountOperator)) {
						jsonArray.push({
									field : 'Amount',
									operator : arrFilterJson[i].operator,							
									value1 : arrFilterJson[i].value1,
									value2 : arrFilterJson[i].value1,
									dataType : 2,
									displayType :2,// 3,
									fieldLabel : getLabel('amount','Amount'),
									displayValue1 : arrFilterJson[i].value1
								});
					}
				}
			}
			objJson = jsonArray;
			return objJson;
		},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
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
	removeFromAdvanceArrJson : function(arr, key) {
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
		// var paymentTypeFilterValArray = [];
		// var paymentTypeFilterVal = me.paymentTypeFilterVal;
		// var paymentTypeFilterDiscArray = [];
		// var payementTypeFilterDisc = me.paymentTypeFilterDesc;
		var statusFilterValArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var entryDateValArray = [];
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var parentBatchReferenceFilterVal = me.parentBatchReferenceFilterVal;
		var parentBatchReferenceFilterDesc = me.parentBatchReferenceFilterDesc;
		var jsonArray = [];
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'EntryDate',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('date', 'Entry Date')
					});
		}
		if(strEntityType === '0' && (pullToBankEdit === 'Y' || pullToBankAuth === 'Y' || pullToBankView === 'Y')){
			var objPullToBankParams = document.getElementById("pullToBank").value;
			var filterType='';
			filterType = (objPullToBankParams === 'No' ? 'N' : ((objPullToBankParams === 'Yes') ? 'Y' : objPullToBankParams));
			if (objPullToBankParams !=='' && objPullToBankParams !== null && objPullToBankParams !== 'All') {
			jsonArray.push({
							paramName : 'pullToBank',
							paramIsMandatory : true,	
							paramValue1 :filterType,
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('lbl.pullToBank', 'Pull To Bank'),
							displayValue1 : objPullToBankParams
						});
			   }
			}
		if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
			statusFilterValArray = statusFilterVal.toString();

			if (statusFilterDisc != null && statusFilterDisc != 'All'
					&& statusFilterDisc != 'all'
					&& statusFilterDisc.length >= 1)
				statusFilterDiscArray = statusFilterDisc.toString();

			jsonArray.push({
						paramName : getLabel('ActionStatus', 'ActionStatus'),
						paramValue1 : statusFilterValArray,
						operatorValue : 'in',
						dataType : 'S',
						paramFieldLable : getLabel('lblStatus', 'Status'),
						displayType : 5,
						displayValue1 : statusFilterDiscArray
					});
		}
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : clientFilterDesc
					});
		}
		if (!Ext.isEmpty(parentBatchReferenceFilterVal)/* && parentBatchReferenceFilterVal != 'all'*/) {
			jsonArray.push({
						paramName : 'parentBacthRefId',
						paramValue1 : parentBatchReferenceFilterVal,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('parentBatchTrackingId', 'Parent Batch Tracking Id'),
						displayValue1 : parentBatchReferenceFilterVal
					});
		}
		//Below code is no more required. This will be removed.
		if (false && strSeller != null && strSeller != 'all') {
			jsonArray.push({
						paramName : 'Seller',
						paramValue1 : encodeURIComponent(strSeller.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('seller', 'Seller'),
						displayValue1 : strSeller
					});
		}

		return jsonArray;
	},
	getQuickFilterQueryArray : function() {
		var me = this;
		var paymentTypeFilterValArray = [];		
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var statusFilterValArray = [];		
		var statusFilterVal = me.statusFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var filterUrl = '';
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			if(Ext.isEmpty(objDateParams.fieldValue2) && !Ext.isEmpty(objDateParams.fieldValue1)){
				objDateParams.fieldValue2 = objDateParams.fieldValue1;
			}
			var fromDt = objDateParams.fieldValue1.split("-");
			var toDt = objDateParams.fieldValue2.split("-");

			filterUrl = filterUrl + 'ANDEntry From Date{BT}|' + fromDt[2]+'/'+fromDt[1]+'/'+fromDt[0]+','+toDt[2]+'/'+toDt[1]+'/'+toDt[0]
						+'ANDEntry To Date{BT}|'+fromDt[2]+'/'+fromDt[1]+'/'+fromDt[0]+','+toDt[2]+'/'+toDt[1]+'/'+toDt[0];
			
		}
		if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'All'
				&& paymentTypeFilterVal != 'all'
				&& paymentTypeFilterVal.length >= 1) {
			paymentTypeFilterValArray = paymentTypeFilterVal.toString();
			filterUrl = filterUrl + 'ANDPayment Category:'
					+ paymentTypeFilterValArray;
		}
		if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all'
				&& statusFilterVal.length >= 1) {
			statusFilterValArray = statusFilterVal.toString();
			filterUrl = filterUrl + 'ANDStatus:'
					+ statusFilterValArray;
		}
		if (clientFilterVal != null && clientFilterVal != 'all') {
			filterUrl = filterUrl + 'ANDClient:' + clientFilterVal;
		} else if (reqClient != null && reqClient != '') {
			filterUrl = filterUrl + 'ANDClient:' + reqClient;
		}
		
		return filterUrl;
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		if (groupInfo && groupInfo.groupTypeCode === 'PAYSUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else {

			me.refreshData();
		}
	},
	hideQuickFilter : function() {
		/*
		 * var me = this; if (!Ext.isEmpty(me.getFilterView())) {
		 * me.getFilterView().hide(); me.getFilterButton().filterVisible =
		 * false; me.getFilterButton().removeCls('filter-icon-hover'); }
		 */
	},
	doSearchOnly : function() {
		var me = this;
		var clientComboBox = me.getPaymentSummaryFilterView()
				.down('combo[itemId="clientCombo"]');
		var clientAutoComp = me.getPaymentSummaryFilterView()
				.down('AutoCompleter[itemId="clientAuto"]');
		var strValue= null;
		if(!isClientUser()){
			strValue = $('#msClientAutocomplete').val();
		}
		else{
			strValue = $('#msClient').val();
		}
		if (selectedClient != null && strValue != 'all') {
			if (isClientUser()) 
				clientComboBox.setValue(selectedClient);
			else
				clientAutoComp.setValue(selectedClientDesc);
				
		} else if (strValue == 'all') {
			clientComboBox.setValue('all');
			me.clientFilterVal = '';
			selectedFilterClient='';
		}		
		var paymentReferenceA = $("#paymentReference").val();
		$("input[type='text'][name='paymentReference1']").val(paymentReferenceA);		
		
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [];
		statusarray = [];
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateFrom");

		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString())

		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);

		/*
		 * if (!Ext.isEmpty(paymentTypeChangedValue)) { var objField =
		 * me.getFilterView() && me.getFilterView()
		 * .down('combo[itemId="paymentTypeCombo"]') ? me.getFilterView()
		 * .down('combo[itemId="paymentTypeCombo"]') : null; if
		 * (paymentTypeChangedValue.length == 1) { me.paymentTypeFilterVal =
		 * paymentTypeChangedValue; if (objField)
		 * objField.setValue(me.paymentTypeFilterVal); } else if
		 * (paymentTypeChangedValue.length > 1) { me.paymentTypeFilterVal =
		 * 'all'; if (objField) objField.setValue(me.paymentTypeFilterVal); } }
		 */
		me.applyAdvancedFilter();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		// if (me.filterCodeValue === null) {
		var FilterCode = $("#savedFilterAs").val();
		if (Ext.isEmpty(FilterCode)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			markRequired('#savedFilterAs');
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			me.savedFilterVal = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
		}
		// } else {
		// strFilterCodeVal = me.filterCodeValue;
		// }
		me.savePrefAdvFilterCode = strFilterCodeVal;
		// if (Ext.isEmpty(strFilterCodeVal)) {
		// paintError('#advancedFilterErrorDiv',
		// '#advancedFilterErrorMessage', getLabel('filternameMsg',
		// 'Please Enter Filter Name'));
		// return;
		// } else {
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		// }
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

	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		// me.resetAllFields();
		// me.filterCodeValue=null;
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
		// If sorting is given from advance filter then do not allow sorting on grid.
		// And not even show sorting icon to any column in this case.
		// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//		enableDisableSortIcon(me, null, true);		
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
							// filterGrid.getStore().reload();
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
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getPaymentSummaryFilterView();
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
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 
						|| displayType === 6 || displayType === 2)
				&& strValue /*
							 * && strValue.match(reg)
							 */) {
			retValue = true;
		}
		return retValue;
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
		me.hideQuickFilter();
		$('#entryDataPicker').removeAttr('disabled', 'disabled');
	},
	/*----------------------------Summary Ribbon Handling Ends----------------------------*/

	/*----------------------------Preferences Handling Starts----------------------------*/

	replaceCharAtIndex : function(index, character, strInput) {
		return strInput.substr(0, index) + character
				+ strInput.substr(index + 1);
	},

	/*----------------------------Preferences Handling Ends----------------------------*/

	/*-------------------- Download handling Start ------------------- */
	downloadReport : function(actionName) {
		var me = this;
		var action = null;
		if (actionName === "downloadNacha") {
			var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
			var objGroupView = me.getGroupView();
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
				var arrJson = new Array();
				arrJson.push({
							identifier : objOfSelectedGridRecord[0].data.identifier
						});
				if (!Ext.isEmpty(arrJson))
					$.download('services/paymentsbatch/nachadownload', arrJson);
			}
		} else if (actionName === "downloadFedWire") {
			var filter = null;
			var filterUrl = null;
			if (me.filterApplied === 'Q') {
				filter = me.getQuickFilterQueryArray();
			} else if (me.filterApplied === 'A') {
				filter = getAdvanceFilterQueryArray();
				
				if(jQuery.isEmptyObject(selectedEntryDate)){
					//Quick filter entry date
					if (!Ext.isEmpty(me.dateFilterVal)) {
						if(Ext.isEmpty(me.getDateParam(me.dateFilterVal).fieldValue2) && !Ext.isEmpty(me.getDateParam(me.dateFilterVal).fieldValue1)){
							me.getDateParam(me.dateFilterVal).fieldValue2 = me.getDateParam(me.dateFilterVal).fieldValue1;
						}
						var fromDt = me.getDateParam(me.dateFilterVal).fieldValue1.split("-");
						var toDt = me.getDateParam(me.dateFilterVal).fieldValue2.split("-");

						filter = filter + 'ANDEntry From Date{BT}|' + fromDt[2]+'/'+fromDt[1]+'/'+fromDt[0]+','+toDt[2]+'/'+toDt[1]+'/'+toDt[0]
									+'ANDEntry To Date{BT}|'+fromDt[2]+'/'+fromDt[1]+'/'+fromDt[0]+','+toDt[2]+'/'+toDt[1]+'/'+toDt[0];
					}
				}
				if(!isClientUser()){
				  var clientVal = $('#msClientAutocomplete').val();
				}
				else{
					var clientVal = $('#msClient').val();
				}
				if(Ext.isEmpty(clientVal) || clientVal === 'all' )
				{
					//Quick filter client
					if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
							filter = filter + 'ANDClient:' + me.clientFilterVal;
						} else if (reqClient != null && reqClient != '') {
							filter = filter + 'ANDClient:' + reqClient;
						}
				}
			
			} else if (me.filterApplied === 'ALL') {
				filter = me.getQuickFilterQueryArray();
			}

			if (!Ext.isEmpty(filter)) {
				filterUrl = '&$filter=' + filter;
			}
			$.download('services/paymentsbatch/fedwireDownload', filterUrl);
		} else {
			var withHeaderFlag = document.getElementById("headerCheckbox").checked;
			var arrExtension = {
				downloadXls : 'xls',
				downloadCsv : 'csv',
				downloadPdf : 'pdf',
				downloadTsv : 'tsv'
			};
			var currentPage = 1;
			var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';

			var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
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

			strExtension = arrExtension[actionName];
			strUrl = 'services/paymentsbatch.' + strExtension;
			strUrl += '?$skip=1';
			var objGroupView = me.getGroupView();
			var groupInfo = objGroupView.getGroupInfo();
			var subGroupInfo = objGroupView.getSubGroupInfo();
			strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
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
			if (arrAvailableBatchColumn) {
				if (arrAvailableBatchColumn.length > 0)
					strSelect = '&$select=['
							+ arrAvailableBatchColumn.toString() + ']';
			}
			var viscols;
			var visColsStr = "";
			var grid = null;
			var objGroupView = me.getGroupView();

			if (!Ext.isEmpty(objGroupView)) {
				var colMap = new Object();
				var colArray = new Array();
				if (!Ext.isEmpty(objGroupView))
					grid = objGroupView.getGrid();

				if (!Ext.isEmpty(grid)) {
					viscols = grid.getAllVisibleColumns();
					var col = null;

					for (var j = 0; j < viscols.length; j++) {
						col = viscols[j];
						if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
							if (colMap[arrSortColumnReport[col.dataIndex]]) {
								// ; do nothing
							} else {
								colMap[arrSortColumnReport[col.dataIndex]] = 1;
								colArray
										.push(arrSortColumnReport[col.dataIndex]);

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

			var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			strUrl = strUrl.substring(0, strUrl.indexOf('?'));

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
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCurrent', currentPage));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'visColsStr', visColsStr));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCSVFlag', withHeaderFlag));
			for (var i = 0; i < arrSelectedrecordsId.length; i++) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'identifier', arrSelectedrecordsId[i]));
			}
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	},

	/*-------------------- Download handling End ------------------- */
	/*--------------------Quick Filter Start------------------------*/
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
		me.clientFilterDesc = selectedClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		
		if(!isClientUser() && !isEmpty(me.clientFilterVal) && 'all' !=me.clientFilterVal)
		{
			$.ajax({
					url : 'services/swclient/' + me.clientFilterVal + '.json',
					success:function(response)
					{
						console.log('Success : ');
					}
			});
		}
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyQuickFilter();
		}
	},
	handlePaymentReferenceChangeInQF : function() {
		var me = this;
		me.payRefValue = payRefFilterValue;	
		//me.payRefDesc = payRefFilterDesc;
		console.log('payRefValue in QF: '+me.payRefValue);
		me.filterApplied = 'Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		
		me.applyQuickFilter();
	},
	handleParentBatchReferenceChange : function() {
		var me = this;
		me.parentBatchReferenceFilterVal = payBatchRefFilterValue;
		console.log('parentBatchReferenceFilterVal : '+me.parentBatchReferenceFilterVal);
		me.filterApplied = 'Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		me.applyQuickFilter();
	},	
	handlePaymentTypeClick : function(combo) {
		var me = this;
		me.paymentTypeFilterVal = combo.getValue();
		me.paymentTypeFilterDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		var savedFilterCombo = me.getPaymentSummaryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombo.setValue("");
		if (me.paymentTypeFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyQuickFilter();
		}
	},
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		//me.savedFilterVal = '';
		//me.filterCodeValue = '';
		me.statusFilterVal = combo.getSelectedValues();
		me.statusFilterDesc = combo.getRawValue();
		me.handleStatusFieldSync('Q', me.statusFilterVal, null);
		me.filterApplied = 'Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.handleFieldSync();
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	handleFieldSync : function(){
		var me = this;
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [],objQuickClientField;
		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});
				var sendingAcntsValue = $("#msSendingAccounts").getMultiSelectValue();
				var objStatusField = $("#msSendingAccounts");
				if (!Ext.isEmpty(sendingAcntsValue)) {
					objStatusField.val([]);
					objStatusField.val(sendingAcntsValue);
				} else if (Ext.isEmpty(sendingAcntsValue)) {
					objStatusField.val([]);
				}
				objStatusField.multiselect("refresh");
		if(!Ext.isEmpty(widgetFilterUrl))
		{//only in case req through widget and status filter is not there in request, so need to reset values in status combo
			if(!me.clientWidgetFilter)
			{
				me.clientFilterVal = '';
				me.clientFilterDesc = '';
				selectedFilterClient = '';
			}
			if(!me.statusWidgetFilter)
			{
				statusChangedValue ="";
				statusValueDesc="";
				me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc.toString());
				resetAllMenuItemsInMultiSelect("#msStatus");
			}
		}
		if(!Ext.isEmpty(widgetFilterUrl) && !Ext.isEmpty(me.statusarray))
		{//only in case req through widget and status Array is not empty
			statusChangedValue =statusarray;
			statusValueDesc= me.statusarraydesc;
			me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
					.toString());
		}
		else
		{
			me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
					.toString());
		}
		
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateFrom");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.clientFilterVal = selectedFilterClient;
		if(isClientUser()){
			if(!Ext.isEmpty(me.clientFilterVal)){
				objQuickClientField = me.getQuickFilterClientCombo();
				if(!Ext.isEmpty(objQuickClientField)){
					objQuickClientField.setValue(me.clientFilterVal);
				}
			}
			$('#msClient').val(me.clientFilterVal);
			$('#msClient').niceSelect('update');
		}
		else{
  		if(!Ext.isEmpty(selectedFilterClientDesc)){
  			objQuickClientAutoCompField = me.getPaymentSummaryFilterView().down('AutoCompleter[itemId="clientAuto]');
  			if(!Ext.isEmpty(objQuickClientAutoCompField)){
  				objQuickClientAutoCompField.setValue(selectedFilterClientDesc);
  			}
  		}
  		$('#msClientAutocomplete').val(selectedFilterClientDesc);
  		$('#msClientAutocomplete').niceSelect('update');
		}	
	},
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "entryDateQuickFilter") {
			//me.savedFilterVal = '';
			//me.filterCodeValue = '';
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled = 'Q';
			me.datePickerSelectedDate = [];
			me.datePickerSelectedEntryDate = [];
			me.resetSavedFilterCombo();
			me.setDataForFilter();
			me.applyQuickFilter();
		} else if (filterType == "entryDateAdvFilter") {

		}
	},
	handleClearSettings : function() {
		var me = this;
		var isHandleClearSettings = true;
		me.resetAllFields(isHandleClearSettings);
		me.resetClientField();
		me.resetSavedFilterCombo();
		var entryDatePicker = me.getPaymentSummaryFilterView()
		.down('component[itemId="paymentEntryToDataPicker"]');
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.handleDateChange(me.dateFilterVal);
		me.setDataForFilter();
		// If sorting is given from advance filter then do not allow sorting on grid.
		// And not even show sorting icon to any column in this case.
		// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//		enableDisableSortIcon(me, null, true);
		me.refreshData();
	},
	effectiveDateChange : function(btn, opts) {
		var me = this;
		me.effectiveDateFilterVal = btn.btnValue;
		me.effectiveDateFilterLabel = btn.text;
		me.handleEffectiveDateChange(btn.btnValue);
	},
	processDateChange : function(btn, opts) {
		var me = this;
		me.processDateFilterVal = btn.btnValue;
		me.processDateFilterLabel = btn.text;
		me.handleProcessDateChange(btn.btnValue);
	},
	creationDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	entryDateChange : function(btn, opts) {
		var me = this;
		me.entryDateFilterVal = btn.btnValue;
		me.entryDateFilterLabel = btn.text;
		me.handleEntryDateInAdvFilterChange(btn.btnValue);
	},
	handleEntryDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'entryDate');
		me.entryDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.entryDateFilterLabel)) {
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
					'Entry Date')
					+ " (" + me.entryDateFilterLabel + ")");
			updateToolTip('entryDate',  " (" + me.entryDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#entryDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.entryDateFilterLabel,
				dropdownIndex : index
			};
		} else {
			if (index === '1' || index === '2') {
				$('#entryDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.entryDateFilterLabel,
				dropdownIndex : index
			};
		}
	},
	handleCreationDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'creationDate');
		me.creationDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.creationDateFilterLabel)) {
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
					'Creation Date')
					+ " (" + me.creationDateFilterLabel + ")");
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#creationDate').setDateRangePickerValue(vFromDate);
			} else {
				$('#creationDateFrom').setDateRangePickerValue([vFromDate,vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2') {
				$('#creationDateFrom').setDateRangePickerValue(vFromDate);
			} else {
				$('#creationDateFrom').setDateRangePickerValue([vFromDate,vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	handleEffectiveDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'effectiveDate');
		me.effectiveDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.effectiveDateFilterLabel)) {
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date')
					+ " (" + me.effectiveDateFilterLabel + ")");
			updateToolTip('effectiveDate',  " (" +  me.effectiveDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#effectiveDate').datepick('setDate', vFromDate);
			} else {
				$('#effectiveDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEffectiveDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2') {
				$('#effectiveDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#effectiveDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEffectiveDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	handleProcessDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'processDate');
		me.processDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.processDateFilterLabel)) {
			$('label[for="ProcessDateLabel"]').text(getLabel('processDate',
					'Process Date')
					+ " (" + me.processDateFilterLabel + ")");
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#processDate').setDateRangePickerValue(vFromDate);
			} else {
				$('#processDateFrom').setDateRangePickerValue([vFromDate,vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedProcessDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2') {
				$('#processDateFrom').setDateRangePickerValue(vFromDate);
			} else {
				$('#processDateFrom').setDateRangePickerValue([vFromDate,vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedProcessDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	getInstTypeParam : function(instType) {
		var value ;
		$('#msProductCategory option').each(function(i, selected){
			if($(selected).val()===instType)
			{
				value = $(selected).text();
			}
		});
		return value;
	},
	getProductTypeParam : function(instType) {
		var value ;
		$('#msProducts option').each(function(i, selected){
			if($(selected).val()===instType)
			{
				value = $(selected).text();
			}
		});
		return value;
	},
	getStatusParam : function(statusVal) {
		var value ;
		$('#msStatus option').each(function(i, selected){
			if($(selected).val()===statusVal)
			{
				value = $(selected).text();
			}
		});
		return value;
	},
	getDateParam : function(index, dateType) {
		var me = this;
		me.dateRangeFilterVal = index;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '',label = '';
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
				if ('creationDate' === dateType
						&& !isEmpty(me.datePickerSelectedCreationAdvDate)) {
					if (me.datePickerSelectedCreationAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedCreationAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedCreationAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedCreationAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedCreationAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('entryDate' === dateType
						&& !isEmpty(me.datePickerSelectedEntryAdvDate)) {
					if (me.datePickerSelectedEntryAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('effectiveDate' === dateType
						&& !isEmpty(me.datePickerSelectedEffectiveAdvDate)) {
					if (me.datePickerSelectedEffectiveAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEffectiveAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedEffectiveAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEffectiveAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedEffectiveAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('processDate' === dateType
						&& !isEmpty(me.datePickerSelectedProcessAdvDate)) {
					if (me.datePickerSelectedProcessAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedProcessAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedProcessAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedProcessAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedProcessAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				break;
			 case '12' :
					var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
					var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
					fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(
							toDate,
							strSqlDateFormat);
					operator = 'bt';
					label = 'Latest';
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		return retObj;
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
			$('#advancedFilterPopup').dialog("close");
		}
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
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
		var isPayCategoryFieldPresent = false;
		var objSellerAutoComp = null;
		var transactionTypeflag = false;
		if (!Ext.isEmpty(filterData.sellerValue)) {
			objSellerAutoComp = $("input[type='text'][id='sellerAutocomplete']");
			if (!$(objSellerAutoComp).is(":visible"))
				objSellerAutoComp.val(filterData.sellerValue);
		}
		for (var i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			fleldDisplayVal = filterData.filterBy[i].displayValue1;
			fleldDropdownLabel = filterData.filterBy[i].dropdownLabel;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'ClientReference') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#paymentReference").val(fieldVal);
				$("input[type='text'][name='paymentReference1']").val(fieldVal);	
			} else if (fieldName === 'TemplateName') {
				if(!Ext.isEmpty(fieldVal))
				{
					fieldVal = decodeURIComponent(fleldDisplayVal);
				}
				$("#templateName").val(fieldVal);
			} else if (fieldName === 'Maker') {
				if(!Ext.isEmpty(fieldSecondVal)) 
				{
					fieldSecondVal = decodeURIComponent(fieldSecondVal); 
				}				
				$("#entryUser").val(fieldSecondVal); 
				$("input[type='text'][id='entryUser']").attr('item_id',fieldVal); 
			} else if (fieldName === 'MakerBranchCode') {
                if(!Ext.isEmpty(fieldSecondVal))
                {
                    fieldSecondVal = decodeURIComponent(fieldSecondVal);
                }
                $("#entryBranch").val(fieldSecondVal);
                $("input[type='text'][id='entryBranch']").attr('item_id',fieldVal);
            } else if (fieldName === 'ReceiverCode') {
				if(!Ext.isEmpty(fieldVal)) 
				{
					fieldVal = decodeURIComponent(fleldDisplayVal); 
				}				
				$("#receiverCode").val(fieldVal) 
			} else if (fieldName === 'FileName') {
				if(!Ext.isEmpty(fieldVal))
				{
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("#fileName").val(fieldVal);
			} else if (fieldName === 'Amount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'ReceiverNamePDT') {
				if(!Ext.isEmpty(fieldVal))
				{
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("#receiverName").val(fieldVal);
			} else if (fieldName === 'ReceiverId') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#receiverId").val(fieldVal);
			} else if (fieldName === 'OrderingPartyName') {
				if(!Ext.isEmpty(fieldVal))
				{
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("#filterOrderingPartyAutocomplete").val(fieldVal);
			}

			if (fieldName === 'CreateDate' || fieldName === 'EntryDate'
					|| fieldName === 'ActivationDate'
					|| fieldName === 'ValueDate') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			} else if (fieldName === 'SortBy'
					|| fieldName === 'FirstThenSortBy'
					|| fieldName === 'SecondThenSortBy') {
				columnId = fieldVal;
				sortByOption = fieldSecondVal;
				buttonText = getLabel("ascending", "Ascending");
				if (sortByOption !== 'asc')
					buttonText = getLabel("descending", "Descending");
				me.setSortByComboFields(fieldName, columnId, buttonText, true);
			} else if (fieldName == 'PayCategory') {
				/*
				 * REMOVED THE SINGLE AND BATCH CHECK-BOX FROM ADVANCED FILTER
				 * var multiPayRef =
				 * $("input[type='checkbox'][id='multiPayCheckBox']"); var
				 * singlePayRef =
				 * $("input[type='checkbox'][id='singlePayCheckBox']"); if
				 * (!Ext.isEmpty(multiPayRef) && !Ext.isEmpty(singlePayRef)) {
				 * if (fieldVal === 'B') { singlePayRef.prop('checked', false);
				 * multiPayRef.prop('checked', true); } else if (fieldVal ===
				 * 'Q') { singlePayRef.prop('checked', true);
				 * multiPayRef.prop('checked', false); } else if (fieldVal ===
				 * 'B,Q') { singlePayRef.prop('checked', true);
				 * multiPayRef.prop('checked', true); } }
				 */
				isPayCategoryFieldPresent = true;
			} else if (fieldName == 'CreditDebitFlag') {
				transactionTypeflag = true;
				var debitRef = $("input[type='checkbox'][id='msDebit']");
				var creditRef = $("input[type='checkbox'][id='msCredit']");
				if (!Ext.isEmpty(debitRef) && !Ext.isEmpty(creditRef))
					if (fieldVal == '') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', true);
					} else if (fieldVal == 'D') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', false);
					} else if (fieldVal == 'C') {
						creditRef.prop('checked', true);
						debitRef.prop('checked', false);
					}
			} else if (fieldName === 'CrossCurrency'
					|| fieldName === 'PrenotePDT' || fieldName === 'Reversal'
					|| fieldName === 'Confidential') {
				me.setRadioGroupValues(fieldName, fieldVal);
			} else if (fieldName === 'InstrumentType'
					|| fieldName === 'ProductType'
					|| fieldName === 'AccountNo'
					|| fieldName === 'ActionStatus'
					|| fieldName === 'CompanyId' 
					|| fieldName === 'Channel' || fieldName === 'CompanyID') {
				 if(fieldName === 'AccountNo' || fieldName === 'Channel')
				 {
					 if(!Ext.isEmpty(fieldVal)){
							fieldVal = decodeURIComponent(fieldVal);
						}
						if(fieldName === 'AccountNo'){
							setSendingAccountMenuItems("msSendingAccounts");
							sendingAccntCallSkip = true;
						}
				 }
				me.checkUnCheckMenuItems(fieldName, fieldVal,fieldSecondVal);
				if (fieldName === 'ActionStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			} else if(fieldName === 'Client'){
				selectedFilterClient = fieldVal;
				selectedClient = fieldVal;
				selectedClientDesc = filterData.filterBy[i].displayValue1;
				if(!isClientUser()){
				  $('#msClientAutocomplete').val(selectedClientDesc);
				}
				else{
					$('#msClient').val(selectedClientDesc);
					$('#msClient').niceSelect('update');
				}
				selectedFilterClientDesc = selectedClientDesc;
				var isAcntPresent = false;
				for (var j = 0; j < filterData.filterBy.length; j++) {
					if(filterData.filterBy[j].field === 'AccountNo'){
						isAcntPresent = true;
						break;
					}
				}
				var sendingAcctNo =$("select[id='msSendingAccounts']").getMultiSelectValueString();
				if(Ext.isEmpty(sendingAcctNo) && !isAcntPresent && sendingAccntCallSkip){
					setSendingAccountMenuItems("msSendingAccounts");
				}
			}
			
		}
		if(!transactionTypeflag)
			{
				var debitRef = $("input[type='checkbox'][id='msDebit']");
				var creditRef = $("input[type='checkbox'][id='msCredit']");
				debitRef.prop('checked', true);
				creditRef.prop('checked', true);
			}
		/*
		 * REMOVED THE SINGLE AND BATCH CHECK-BOX FROM ADVANCED FILTER if
		 * (!isPayCategoryFieldPresent) {
		 * $("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
		 * false);
		 * $("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
		 * false); }
		 */
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
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRefFrom = null;
			/* var dateFilterRefTo = null; */
			var formattedFromDate, fromDate, toDate, formattedToDate;
			var dateOperator = data.operator;
			var label =null;
			fromDate = data.value1;
			toDate = data.value2;
			label =data.dropdownLabel;
			if(!Ext.isEmpty(me.advFilterData))
			{
				for (i = 0; i < me.advFilterData.length; i++)
				{
					if(me.advFilterData[i].field === 'EntryDate')
					{
						dateOperator = me.advFilterData[i].operator;
						fromDate = me.advFilterData[i].value1;
						toDate = me.advFilterData[i].value2;
						label = me.advFilterData[i].dropdownLabel;
						break;
					}
				}
			}
			if (!Ext.isEmpty(fromDate))
				formattedFromDate = Ext.util.Format
						.date(Ext.Date.parse(fromDate, 'Y-m-d'),
								strExtApplicationDateFormat);

			
			if (!Ext.isEmpty(toDate))
				formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate,
								'Y-m-d'), strExtApplicationDateFormat);

			if (dateType === 'CreateDate') {
				selectedCreationDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#creationDateFrom');
				/* dateFilterRefTo = $('#creationDateTo'); */
			} else if (dateType === 'EntryDate') {
				selectedEntryDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : label
				};
				dateFilterRefFrom = $('#entryDateFrom');
				$('label[for="EntryDateLabel"]').text(getLabel('EntryDate','Entry Date')+ " ("
						+ selectedEntryDate.dateLabel + ")");
				$('label[for="EntryDateLabel"]').text(getLabel('EntryDate','Entry Date')+ " ("
						+ selectedEntryDate.dateLabel + ")");
				entry_date_opt = label;
				
			} else if (dateType === 'ValueDate') {
				selectedProcessDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#processDateFrom');
				/* dateFilterRefTo = $('#processDateTo'); */
			} else if (dateType === 'ActivationDate') {
				selectedEffectiveDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#effectiveDateFrom');
				/* dateFilterRefTo = $('#effectiveDateTo'); */
			}


			if (dateOperator === 'eq' || dateOperator === 'le') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
					}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	setRadioGroupValues : function(fieldName, fieldVal) {
		var me = this;
		if (!Ext.isEmpty(fieldName)) {
			var radioGroupRef = null;

			if (fieldName === 'CrossCurrency') {
				radioGroupRef = $("input[type='radio'][name='CrossCurrency']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='CrossCurrency'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}

			if (fieldName === 'PrenotePDT') {
				radioGroupRef = $("input[type='radio'][name='prenotes']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='prenotes'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}

			if (fieldName === 'Reversal') {
				radioGroupRef = $("input[type='radio'][name='reversal']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='reversal'][value="
								+ fieldVal + "]").prop('checked', true);
						optReversalClicked('reversal', 'msStatus', '15');
					}
				}
			}

			if (fieldName === 'Confidential') {
				radioGroupRef = $("input[type='radio'][name='confidential']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='confidential'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}

		}
	},
	checkUnCheckMenuItems : function(componentName, data,fieldSecondVal) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'ProductType') {
			menuRef = $("select[id='msProducts']");
			elementId = '#msProducts';
		} else if (componentName === 'ActionStatus') {
			menuRef = $("select[id='msStatus']");
			elementId = '#msStatus';
		} else if (componentName === 'CompanyId') {
			menuRef = $("select[id='msCompanyId']");
			elementId = '#msCompanyId';
		} else if (componentName === 'Client') {
			menuRef = $("select[id='msClient']");
			elementId = '#msClient';
		} else if (componentName === 'AccountNo') {
			menuRef = $("select[id='msSendingAccounts']");
			elementId = '#msSendingAccounts';
		} else if (componentName === 'InstrumentType') {
			menuRef = $("select[id='msProductCategory']");
			elementId = '#msProductCategory';
		} else if (componentName === 'Channel') {
			menuRef = $("select[id='msChannel']");
			elementId = '#msChannel';
		} else if (componentName === 'CompanyID') {
			menuRef = $("select[id='msCompanyId']");
			elementId = '#msCompanyId';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			if ( componentName === 'ActionStatus' && !Ext.isEmpty(fieldSecondVal) ) 
				data = fieldSecondVal;
			var dataArray = (typeof data == 'string') ? data.split(',') : data;
			if (componentName === 'InstrumentType') {
				me.paymentTypeFilterVal = dataArray;
			}

			if (componentName === 'ActionStatus') {
				selectedStatusListSumm = dataArray;
			}
			if (componentName === 'ProductType') {
				selectedProductTypeList = dataArray;
			}
			if (componentName === 'AccountNo') {
				selectedAccountNoList = dataArray;
			}
			if(!Ext.isEmpty(dataArray))
			{
				for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
					for (var index = 0; index < itemArray.length; index++) {
						var dataArrayIndxVal = (dataArray[dataIndex].indexOf('^')>-1) ? dataArray[dataIndex].split('^') : dataArray[dataIndex];
						if (dataArrayIndxVal == itemArray[index].value) {
							$(elementId + " option[value=\""
									+ itemArray[index].value + "\"]").prop(
									"selected", true);
							break;
						}
					}
				}
			}
			$(elementId).multiselect("refresh");
		}
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
					if (!Ext.isEmpty(thenSortByButtonRef)) {
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
					if (!Ext.isEmpty(thenSortByButtonRef)) {
						sortBy3ComboSelected(columnId);
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
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#amountFieldFrom");
		var amountFieldRefTo = $("#amountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOperator').val(operator);
				$("#amountOperator").niceSelect('update');
				handleAmountOperatorChange($('#amountOperator'));
				amonutFieldRefFrom.val(amountFromFieldValue);
				amonutFieldRefFrom.removeAttr('disabled', 'disabled');
				amonutFieldRefFrom.autoNumeric('set', amountFromFieldValue); 
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$(".amountTo").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
						amountFieldRefTo.removeAttr('disabled', 'disabled');
						amountFieldRefTo.autoNumeric('set', amountToFieldValue); 
					}
				}
			}
		}
	},
	resetAllFields : function(isHandleClearSettings) {
		var me = this;
		if(!isClientUser()){
		  $('#msClientAutocomplete').val("");
		}
		else{
			$('#msClient').val('all');
			$("#msClient").niceSelect('update');
		}
		resetAllMenuItemsInMultiSelect("#msProductCategory");
		resetAllMenuItemsInMultiSelect("#msProducts");
		$("#msSendingAccounts  option").remove();
		var elSendAcnts = $("#msSendingAccounts").multiselect();
		elSendAcnts.attr('multiple',true);
		elSendAcnts.multiselect('refresh');
		$("#saveFilterChkBox").attr('checked', false);
		$("#savedFilterAslbl").removeClass("required");		
		removeMarkRequired('#savedFilterAs');
		$("input[type='text'][id='templateName']").val("");
		me.datePickerSelectedEntryAdvDate = [];
		me.dateFilterVal = '';
		selectedEffectiveDate = {};
		me.datePickerSelectedEffectiveAdvDate = [];
		$('#effectiveDateFrom').val("");
		selectedProcessDate = {};
		me.datePickerSelectedProcessAdvDate = [];
		$('#processDateFrom').val("");
		$("#entryUser").val("");
		$("#entryBranch").val("");
		$("#receiverCode").val("");
		resetAllMenuItemsInMultiSelect("#msStatus");
		$("#fileName").val("");
		$("#amountOperator").val('eq');
		$(".amountTo").addClass("hidden");
		$("#msAmountLabel").text(getLabel("amount","Amount"));		
		$("#amountFieldFrom").val("");
		$("#amountFieldTo").val("");
		$("#creationDate").val("");
		resetAllMenuItemsInMultiSelect("#msChannel");
		$("#receiverName").val("");
		$("#filterOrderingPartyAutocomplete").val("");
		$("input[type='radio'][id='msConfidentialAll']").prop('checked', true);
		$("input[type='text'][id='paymentReference']").val("");
		$("input[type='text'][name='paymentReference1']").val("");		
		$("input[type='checkbox'][id='msCredit']").prop('checked', false);
		$("input[type='checkbox'][id='msDebit']").prop('checked', false);
		$("input[type='radio'][id='msCrossCurrencyAll']").prop('checked', true);
		$("#receiverId").val("");
		resetAllMenuItemsInMultiSelect("#msCompanyId");
		$("input[type='radio'][id='msPrenotesAll']").prop('checked', true);
		$("#msSortBy1").val("");
		$('#msSortBy2 option').remove();
		$("#msSortBy2").append($('<option />', {
					value : "None",
					text : getLabel('none', 'None')
				}));
		$('#msSortBy3 option').remove();
		$("#msSortBy3").append($('<option />', {
					value : "None",
					text : getLabel('none', 'None')
				}));
		$('#msSortBy2').attr('disabled', true);
		$('#msSortBy3').attr('disabled', true);
		$("#msSortBy1").niceSelect('update');
		$("#msSortBy2").niceSelect('update');
		$("#msSortBy3").niceSelect('update');
		$('#sortBy1AscDescLabel').text(getLabel("ascending", "Ascending"));
        $('#sortBy2AscDescLabel').text(getLabel("ascending", "Ascending"));
        $('#sortBy3AscDescLabel').text(getLabel("ascending", "Ascending")); 		
		$("input[type='radio'][id='reversalAll']").prop('checked', true);
		$("input[type='radio'][id='reversal']").prop('checked', false);
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="ProcessDateLabel"]').text(getLabel('processDate',
				'Process Date'));
		$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
				'Effective Date'));
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$('#amountOperator').niceSelect('update');
		$("input[type='text'][id='parentBatchTrackingId']").val("");
		var objField = me.getPaymentSummaryFilterView().down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
		
		resetAllMenuItemsInMultiSelect("#msStatus");
		var objField1 = me.getPaymentSummaryFilterView().down('textfield[itemId="parentBatchReference1"]');
		if (!Ext.isEmpty(objField1)) {
			me.parentBatchReferenceFilterVal = '';
			objField1.setValue(me.parentBatchReferenceFilterVal);
		}
		if(!isHandleClearSettings){
			me.dateFilterVal = '';
			selectedEntryDate = {};
			me.resetAdvEntryDate();
		}
		$('#pullToBank').val('No');
		$("#pullToBank").niceSelect('update');
	},
	
	resetAdvEntryDate: function(){
		var me = this;
		var objDateParams =null;
		var label = null;
		objDateParams = me.getDateParam(defaultDateIndex);
		label = getDateIndexLabel(defaultDateIndex);
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat);
		$('#entryDateFrom').datepick('setDate',[vFromDate, vToDate]);
		selectedEntryDate = {
				operator : 'bt',
				fromDate : vFromDate,
				toDate : vToDate,
				dateLabel : label
		};
		
		$('label[for="EntryDateLabel"]').text(getLabel('entryDate', 'Entry Date') + " (" + selectedEntryDate.dateLabel + ")");
		updateToolTip('entryDate',  " (" + selectedEntryDate.dateLabel + ")");
	},
		
	/*--------------------Quick Filter End--------------------------*/
	setWidgetFilters : function() {
		var me = this;
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweektodate', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
			'7' : getLabel('daterange', 'Date Range'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'12' : getLabel('latest', 'Latest')
		};
		for (var i = 0; i < arrFilterJson.length; i++) {
			if (arrFilterJson[i].field === 'EntryDate' || arrFilterJson[i].field === 'PayReqEntryDate'
					|| arrFilterJson[i].field === 'creationDate') {
				if(arrFilterJson[i].btnValue === '13') arrFilterJson[i].btnValue = '7'
				me.dateFilterLabel = objDateLbl[arrFilterJson[i].btnValue];
				me.dateFilterVal = arrFilterJson[i].btnValue;
				if (me.dateFilterVal == '7'
						&& !Ext.isEmpty(arrFilterJson[i].value1))
					me.datePickerSelectedEntryAdvDate = [
							arrFilterJson[i].value1, arrFilterJson[i].value2];
			} else if (arrFilterJson[i].field === 'sendingAccnt' || arrFilterJson[i].field === 'AccountNo' 
						|| arrFilterJson[i].field === 'AccountNoPDT') {
				if (!Ext.isEmpty(arrFilterJson[i].value1))
					strWidgetSendingAccounts = arrFilterJson[i].value1;
			} else if (arrFilterJson[i].field === 'ProductCategory'
					|| arrFilterJson[i].field === 'InstrumentType') {
				if (!Ext.isEmpty(arrFilterJson[i].value1))
					strWidgetPaymentCategory = arrFilterJson[i].value1;
			} else if (arrFilterJson[i].field === 'Client') {
				me.clientWidgetFilter =true;
				me.clientFilterVal = arrFilterJson[i].value1;
				me.clientFilterDesc = arrFilterJson[i].value2;
				selectedFilterClient = arrFilterJson[i].value1;
			} else if (arrFilterJson[i].field === 'Status' || arrFilterJson[i].field === 'ActionStatus') {
				me.statusWidgetFilter =true;
				if (!Ext.isEmpty(arrFilterJson[i].statusarray))
					me.statusarray = arrFilterJson[i].statusarray;
				if(!Array.isArray(arrFilterJson[i].paramValue1)){
					me.statusFilterVal = arrFilterJson[i].paramValue1;					
				}else{
					me.statusFilterVal = arrFilterJson[i].paramValue1.split(",");
				}
				me.statusFilterDesc = arrFilterJson[i].displayValue1;
				if (!Ext.isEmpty(arrFilterJson[i].paramValue1))
					me.checkUnCheckMenuItems('ActionStatus',
							arrFilterJson[i].paramValue1,arrFilterJson[i].value2);
			} else if (arrFilterJson[i].field === 'paymentCategory'
				|| arrFilterJson[i].field === 'ProductType') {
				if (!Ext.isEmpty(arrFilterJson[i].value1))
					strWidgetProductType = arrFilterJson[i].value1;
			}else if(arrFilterJson[i].field === 'Maker'){
				$("#entryUser").val(decodeURIComponent(arrFilterJson[i].value2));
				$("#entryUser").attr('item_id',arrFilterJson[i].value1);
			}else if(arrFilterJson[i].field === 'CreditDebitFlag'){
				if(arrFilterJson[i].value1 === 'C')					
					$("input[type='checkbox'][id='msCredit']").prop('checked', true);
				if(arrFilterJson[i].value1 === 'D')
					$("input[type='checkbox'][id='msDebit']").prop('checked', true);
			}else if(arrFilterJson[i].field === 'Amount'){				
				me.setAmounts(arrFilterJson[i].operator, arrFilterJson[i].value1, arrFilterJson[i].value1);
			}
		}
		me.setDataForFilter();
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	countdownClear : function() {
		clearTimeout(countdown);
	},
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null;
			// adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				if (paramName === 'EntryDate') {
					me.resetEntryDateAsDefault();
					arrAdvJson.push( me.getTemplateStartDateJson());
				}
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
					if (paramName === 'EntryDate') {
						me.resetEntryDateAsDefault();
						arrQuickJson.push( me.getTemplateStartDateJson());
					}
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.setDataForFilter();
			me.refreshData();
		}
	},
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#msStatus");
				var objQuickStatusField = me.getPaymentSummaryFilterView()
						.down('combo[itemId="statusCombo"]');
				if (!Ext.isEmpty(statusData)) {
					objStatusField.val([]);
					objStatusField.val(statusData);
				} else if (Ext.isEmpty(statusData)) {
					objStatusField.val([]);
				}
				objStatusField.multiselect("refresh");
				if (objQuickStatusField.isAllSelected()) {
					me.statusFilterVal = 'all';
				}
			}
			if (type === 'A') {
				var objStatusField = me.getPaymentSummaryFilterView()
						.down('combo[itemId="statusCombo"]');
				if (!Ext.isEmpty(statusData)) {
					me.statusFilterVal = 'all';
					objStatusField.setValue(statusData);
					objStatusField.selectedOptions = statusData;
				} else {
					objStatusField.setValue(statusData);
					me.statusFilterVal = '';
				}
			}
		}
	},
	handleEntryDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="EntryDateLabel"]')
				: me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#entryDateFrom')
				: $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
				//selectedEntryDate = {};
			} else {
				labelToChange.setText(sourceLable);
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'ActionStatus') {
			var objField = me.getPaymentSummaryFilterView()
					.down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			resetAllMenuItemsInMultiSelect("#msStatus");
		} else if (strFieldName === 'EntryDate') {
			me.resetEntryDateAsDefault();
		} /*else if (strFieldName === 'parentBacthRefId') {
			var objField1 = me.getPaymentSummaryFilterView().down('textfield[itemId="parentBatchReference1"]');
			if (!Ext.isEmpty(objField1)) {
				me.parentBatchReferenceFilterVal = '';
				objField1.setValue(me.parentBatchReferenceFilterVal);
			}
		}*/ else if (strFieldName === 'parentBacthRefId') {
			$("input[type='text'][id='parentBatchTrackingId']").val("");
		} else if (strFieldName === 'PayCategory') {
			/*
			 * REMOVED THE SINGLE AND BATCH CHECK-BOX FROM ADVANCED FILTER
			 * $("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
			 * false);
			 * $("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',false);
			 */
		} else if (strFieldName === 'InstrumentType') {
			resetAllMenuItemsInMultiSelect("#msProductCategory");
		} else if (strFieldName === 'ProductType') {
			resetAllMenuItemsInMultiSelect("#msProducts");
		} else if (strFieldName === 'AccountNo') {
			resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		} else if (strFieldName === 'TemplateName') {
			$("input[type='text'][id='templateName']").val("");
		} else if (strFieldName === 'ActivationDate') {
			selectedEffectiveDate = {};
			me.datePickerSelectedEffectiveAdvDate = [];
			$('#effectiveDateFrom').val("");
			/* $('#effectiveDateTo').val(""); */
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date'));
		} else if (strFieldName === 'ValueDate') {
			selectedProcessDate = {};
			me.datePickerSelectedProcessAdvDate = [];
			$('#processDateFrom').val("");
			/* $('#processDateTo').val(""); */
			$('label[for="ProcessDateLabel"]').text(getLabel('processDate',
					'Process Date'));
		} else if (strFieldName === 'Maker') {
			$("#entryUser").val("");
			$("#entryUser").attr('item_id',"");
		} else if (strFieldName === 'MakerBranchCode') {
            $("#entryBranch").val("");
            $("#entryBranch").attr('item_id',"");
        } else if (strFieldName === 'ReceiverCode') {
			$("#receiverCode").val("");
		} else if (strFieldName === 'Reversal') {
			$("input[type='radio'][id='reversalAll']").prop('checked', true);
			$("input[type='radio'][id='reversal']").prop('checked', false);
		} else if (strFieldName === 'FileName') {
			$("#fileName").val("");
		} else if (strFieldName === 'Amount') {
			$("#amountOperator").val('eq');
			$("#amountOperator").niceSelect('update');
			$(".amountTo").addClass("hidden");
			$("#msAmountLabel").text(getLabel("amount","Amount"));
			$("#amountFieldFrom").val("");
			$("#amountFieldTo").val("");
		} else if (strFieldName === 'CreateDate') {
			selectedCreationDate = {};
			me.datePickerSelectedCreationAdvDate = [];
			$("#creationDateFrom").val("");
			/* $("#creationDateTo").val(""); */
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
					'Creation Date'));
		} else if (strFieldName === 'Channel') {
			resetAllMenuItemsInMultiSelect("#msChannel");
		} else if (strFieldName === 'ReceiverNamePDT') {
			$("#receiverName").val("");
		} else if (strFieldName === 'OrderingPartyName') {
			$("#filterOrderingPartyAutocomplete").val("");
		} else if (strFieldName === 'Confidential') {
			$("input[type='radio'][id='msConfidentialAll']").prop('checked',
					true);
		} else if (strFieldName === 'ClientReference') {
			$("input[type='text'][id='paymentReference']").val("");
			$("input[type='text'][name='paymentReference1']").val("");
		} else if (strFieldName === 'CreditDebitFlag') {
			$("input[type='checkbox'][id='msCredit']").prop('checked', false);
			$("input[type='checkbox'][id='msDebit']").prop('checked', false);
		} else if (strFieldName === 'CrossCurrency') {
			$("input[type='radio'][id='msCrossCurrencyAll']").prop('checked',
					true);
		} else if (strFieldName === 'ReceiverId') {
			$("#receiverId").val("");
		} else if (strFieldName === 'CompanyId') {
			resetAllMenuItemsInMultiSelect("#msCompanyId");
		} else if (strFieldName === 'PrenotePDT') {
			$("input[type='radio'][id='msPrenotesAll']").prop('checked', true);
		} else if (strFieldName === 'Client') {
			// Quick Filter Client Selection Fields
			me.resetClientField();
			// Advance Filter Client Combo Field
			if(isClientUser()){
				$('#msClient').val('all');
				$("#msClient").niceSelect('update');
			}
		}
	},
	showApprovalConfirmationPopupView : function(strUrl, remark, grid,
			arrSelectedRecords, strActionType, strAction) {
		if(showDrawerLocalName == 'Y')
			var arrColumnModel = APPROVAL_CONFIRMATION_COLUMN_MODEL_WITH_DRAWER;
		else
			var arrColumnModel = PAYMENT_APPROVAL_CONFIRMATION_COLUMN_MODEL;
		var storeFields = ['clientReference', 'sendingAccount', 'recieverName', 'drawerLocalName', 'recKeyCheck',
				'amount','count', 'productCategoryDesc', 'productTypeDesc','currency',
				'txnDate','file','pullToBank','pullToBankRemarks'];
		showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
				storeFields, [strUrl, remark, grid, arrSelectedRecords,
						strActionType, strAction]);
	},
	assignSavedFilter : function() {
		var me = this,savedFilterCode='';
		me.resetAllFields();
		if (objPaymentSummaryPref || objSaveLocalStoragePref) {
			var objJsonData = Ext.decode(objPaymentSummaryPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
					&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
						savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					}
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
						me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
						me.handleFieldSync();
					}
			}
			else if (!Ext.isEmpty(objJsonData.d.preferences) && Ext.isEmpty(widgetFilterUrl)) {
				if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
						var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
						if (advData === me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()) {
							$("#msSavedFilter option[value='" + advData + "']").attr("selected", true);
							$("#msSavedFilter").multiselect("refresh");
							me.savedFilterVal = advData;
							me.handleSavedFilterClick();
						}
					}
				}
			}
		}
	},
	showReversalConfirmationPopup : function(strUrl, remark, grid,
			arrSelectedRecords, strActionType, strAction) {
		var me = this;		
		var _objDialog = $('#reverseConfirmationPopup');
		_objDialog.dialog({
			bgiframe : true,
			autoOpen : false,
			modal : true,
			resizable : false,
			width : "320px",
			buttons : [
				{
					text:getLabel('btnOk','Ok'),
					click : function() {
						me.preHandleGroupActions(strUrl, '', grid,
								arrSelectedRecords, strActionType,
								strAction);
						$(this).dialog("close");	
					}
				},
				{
					text:getLabel('btncancel','Cancel'),
					click : function() {
						$(this).dialog('destroy');
					}
				}
				]
		});
		_objDialog.dialog('open');
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
	resetEntryDateAsDefault : function() {
		var me = this;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.handleDateChange(me.dateFilterVal);
	},
	getTemplateStartDateJson : function() {
		var me = this;
		var jsonObject = {};
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsonObject = {
						paramName : 'TemplateStartDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('startDate', 'Start Date')
					};
		}
		return jsonObject;
	},
	resetSavedFilterCombo : function() {
		var me = this, savedFilterComboBox = null;
		me.savedFilterVal='';
		savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterComboBox))
			savedFilterComboBox.setValue(me.savedFilterVal);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$("#saveFilterChkBox").attr('checked', false);
		$("#savedFilterlbl").removeClass("required");
		removeMarkRequired('#savedFilterAs');		
	},
	resetClientField : function (){
		var me = this, clientComboBox = null;
		if(isClientUser()){
			clientComboBox = me.getPaymentSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			clientComboBox = me.getPaymentSummaryFilterView()
					.down('AutoCompleter[itemId="clientAuto]');
			//clientComboBox.reset();
			clientComboBox.setValue("");
			me.clientFilterVal = '';
		}
		
		selectedFilterClient = "";
		selectedClientDesc = "";
	},
	createFlipView : function (productList){
		var rows = 1;
		for(m in productList){
			
			 var select = $("<select></select>").attr("id", "flipList"+rows).attr("name",  "flipList"+rows).attr("cssClass", "w15_7 rounded ux_no-margin").attr("class", "nice-select form-control jq-nice-select").attr("maxlength","40");
			 select.append($("<option></option>").attr("value", "").text("Select Product").attr("selected", "true"));
			 for(var i=0; i<productList[m].length;i++){
				var newProduct = productList[m][i];
				var optionValue =newProduct.substring(0,newProduct.indexOf(":"));
				var optionText = newProduct.substring(eval(newProduct.indexOf(":")+1));
				if(!isEmpty($.trim(newProduct))){
					select.append($("<option></option>").attr("value", optionValue).text(optionText));
				}
			}
			var divBreached = $("<div>"+m.substring(m.indexOf("-")+1)+"</div>").attr("class", "col-sm-3 form-group");
			select.attr("oldproduct" ,  m.substring(0, m.indexOf("-")))
			var divNew = $("<div></div>").attr("class", "col-sm-3 ").append(select);
			var flipRowDiv = $("<div></div").attr("class", "row form-group").append(divBreached).append(divNew);
			
			$("#productListselectDiv").append(flipRowDiv);
			rows++;
		}
	},
	getNewProductMap: function(){
		
		var newProductMap = {};
		var newProductSelectlist = $("select[id^='flipList']");
		for(var i=0; i<newProductSelectlist.size();i++){
			if($(newProductSelectlist[i]).attr("value") != undefined && $(newProductSelectlist[i]).attr("value") !="" ){
				newProductMap[$(newProductSelectlist[i]).attr("oldproduct")] = $(newProductSelectlist[i]).attr("value");
			}else{
				newProductMap = "";
				break;
			}
		}
		
		return newProductMap;
	},
    checkAndAddGlobalSearchFilter : function(filterData, me) {
  		if(gsPhdNumber !== '' && gsPhdNumber !== null) {
  			me.advFilterData = [{}];
  			filterData = [
  							{field: 'EntryDate', operator: 'eq', value1: gsEntryDate, value2: '', dataType: 1, displayType : 6},
  							{field: 'PHDNumber', operator: 'eq', value1: gsPhdNumber, dataType : 'S', displayType : 5}
  						];	
  						me.advFilterData = [{field: 'EntryDate', operator: 'eq', value1: gsEntryDate, value2: '', dataType: 1, displayType : 6, fieldLabel: "Entry Date"}];
  						
  						$("#entryDataPicker").val(Ext.util.Format.date(Ext.Date.parse(gsEntryDate, 'Y-m-d'), strExtApplicationDateFormat));
  						$('label[for="EntryDateLabel"]').text(getLabel('entryDate', 'Entry Date') + getLabel('daterange','Date Range'));
  						
  						//reset these global search filter once done
  						gsPhdNumber = null;
  						gsEntryDate = null;
  						
  			return filterData;		
		}  	   
  	    return filterData;
    }
});