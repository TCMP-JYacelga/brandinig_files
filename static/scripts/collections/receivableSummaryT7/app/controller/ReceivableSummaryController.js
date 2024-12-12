 /**
 * @class GCP.controller.ReceivableSummaryController
 * @extends Ext.app.Controller
 * @author Vikas Tiwari
 */

/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.ReceivableSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ReceivableSummaryView', 'GCP.view.HistoryPopup',
			'Ext.tip.ToolTip'],
	refs : [{
				ref : 'receivableSummaryView',
				selector : 'receivableSummaryView'
			}, {
				ref : 'groupView',
				selector : 'receivableSummaryView groupView'
			},
			/* Quick Filter starts... */
			{
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'receivableSummaryFilterView',
				selector : 'receivableSummaryFilterView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'receivableSummaryFilterView combo[itemId="quickFilterClientCombo"]'
			}, {
				ref : 'receivablePackageCombo',
				selector : 'receivableSummaryFilterView combo[itemId="receivablePackageCombo"]'
			}, {
				ref : 'entryDateBtn',
				selector : 'receivableSummaryFilterView button[itemId="entryDateBtn"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'receivableSummaryFilterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'receivableSummaryFilterView  combo[itemId="savedFiltersCombo"]'
			},{
			    ref:'DateMenu',
			    selector : '#DateMenu'
			}
	/* Quick Filter ends... */
	],
	config : {
		/* Filter Ribbon Configs Starts */
		strPaymentTypeUrl : 'services/instrumentType.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/groupRecViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/groupRecViewFilter/{0}.json',
		strModifySavedFilterUrl : 'services/userfilters/groupRecViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/groupRecViewFilter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/receivablesummary.json',
		strGetModulePrefUrl : 'services/userpreferences/receivablesummary/{0}.json',
		strBatchActionUrl : 'services/receivablesbatch/{0}.json',
		strDefaultMask : '000000000000000000',
		intMaskSize : 21,

		datePickerSelectedDate : [],
		datePickerSelectedEntryDate : [],
		dateFilterLabel :  getLabel('today', 'Today'),
		dateFilterVal : '',
		dateRangeFilterVal : '13',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		receivablePackFilterVal : 'all',
		paymentTypeFilterDesc : 'All',
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
		creationDateFilterVal : '',
		processDateFilterVal : '',
		advFilterProcessSelected : {},
		effectiveDateFilterLabel : getLabel('today', 'Today'),
		creationDateFilterLabel : getLabel('today', 'Today'),
		processDateFilterLabel : getLabel('today', 'Today'),
		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,
		pageKey : 'payStdViewPref',
		paymentTypeAdvFilterVal : null,
		filterMode : '',
		advFilterSelectedClientCode : null,
		/* Filter Ribbon Configs Ends */
		strLocalStorageKey : 'page_receivable_center',
		strPageName : 'receivableSummary',
		objLocalData : null,
		entryDateChanged : false,
		firstLoad : false,
		isCutOff : false // set true when cutoff instruments exist and set false once all cutOff popup action is taken or times goes off
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
//		objLocalStoragePref = me.doGetSavedState();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.firstLoad = true;
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
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences(event);
				});
		$(document).on('wheelScroll', function(event) {
					me.handlWheelScroll();
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences(event);
				});
		$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
		$(document).on('handleProductCutoff',
				function(event, record, strUserMsg, actionResultMsgCounter) {
					me.preHandleProductCutoff(record, strUserMsg,
							actionResultMsgCounter);
				});
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					if ((filterType == "entryDateAdvFilter")
							|| (filterType == "entryDateQuickFilter")) {
						me.handleEntryDateChange(filterType, btn, opts);
					} else if (filterType == "creationDate") {
						me.creationDateChange(btn, opts);
					} else if (filterType == "processDate") {
						me.processDateChange(btn, opts);
					} else if (filterType == "effectiveDate") {
						me.effectiveDateChange(btn, opts);
					}
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
			me.deleteFilterSet(filterCode);
		});
		$(document).on('orderUpGridEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields(); // true will set the all permitted FI data
					me.filterCodeValue = null;
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "creationDate") {
						me.datePickerSelectedDate = dates;
						me.creationDateFilterVal = me.dateRangeFilterVal;
						me.creationDateFilterLabel = "Date Range";
						me.handleCreationDateChange(me.dateRangeFilterVal);
					} else if (filterType == "processDate") {
						me.datePickerSelectedDate = dates;
						me.processDateFilterVal = me.dateRangeFilterVal;
						me.processDateFilterLabel = "Date Range";
						me.handleProcessDateChange(me.dateRangeFilterVal);
					} else if (filterType == "effectiveDate") {
						me.datePickerSelectedDate = dates;
						me.effectiveDateFilterVal = me.dateRangeFilterVal;
						me.effectiveDateFilterLabel = "Date Range";
						me.handleEffectiveDateChange(me.dateRangeFilterVal);
					}
				});
		me.control({
			'receivableSummaryView groupView' : {
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
//					me.doHandleStateChange();
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
				'gridStoreLoad': function(grid, store){
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
					me.firstTime = true;
					me.applyPreferences();
//					if (Ext.isEmpty(widgetFilterUrl))
//						populateAdvancedFilterFieldValue();
//					me.firstTime = true;
//					if (objPaymentSummaryPref) {
//						/*var objJsonData = Ext.decode(objPaymentSummaryPref);
//						if (!Ext.isEmpty(objJsonData.d.preferences)
//								&& Ext.isEmpty(widgetFilterUrl)) {
//							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
//								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
//									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//									me.doHandleSavedFilterItemClick(advData);
//									me.savedFilterVal = advData;
//								}
//							}
//						}*/
//						var objJsonData = Ext.decode(objPaymentSummaryPref);
//						if (!Ext.isEmpty(objJsonData.d.preferences)
//								&& Ext.isEmpty(widgetFilterUrl)) {
//							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
//								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)
//									|| (objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode))) {
//									var advData = objLocalStoragePref 
//													&& !Ext.isEmpty(objLocalStoragePref.filterCode)
//													? objLocalStoragePref.filterCode 
//													: objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//									me.doHandleSavedFilterItemClick(advData);
//									me.savedFilterVal = advData;
//								}
//							} else if(objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)){
//									me.doHandleSavedFilterItemClick(objLocalStoragePref.filterCode);
//									me.savedFilterVal = objLocalStoragePref.filterCode;
//							}
//						}
//					}
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'receivableSummaryFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					//me.handleDateChange(me.dateFilterVal);
				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
//					me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'receivableSummaryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'receivableSummaryFilterView  AutoCompleter[itemId="clientAuto"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(selectedClientDesc)) {
						combo.setValue(selectedClientDesc);
					}
				}
			},
			'receivableSummaryFilterView combo[itemId="receivablePackageCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.receivablePackFilterVal)) {
						combo.setValue(me.receivablePackFilterVal);
					}
				}
			},
			'receivableSummaryFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'receivableSummaryFilterView component[itemId="paymentEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : false,
						//minDate : dtHistoryDate,
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
								me.setDataForFilter();
								me.applyQuickFilter();
								// me.toggleSavePrefrenceAction(true);
							}
						}
					});
					
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						var entryDateLableVal = $('label[for="ProcessDateLabel"]')
								.text();
						var entryDateField = $("#processDate");
						me.handleEntryDateSync('A', entryDateLableVal, null,
								entryDateField);
					}else if (!Ext.isEmpty(widgetFilterUrl)
							&& !Ext.isEmpty(me.dateFilterVal)
							&& !Ext.isEmpty(me.dateFilterLabel)) {
						me.handleDateChange(me.dateFilterVal);
					} else{
						// DHGCPNG44-4696 Payment->Payment Center->PDF. The filter Latest behaves differently from the way it works in Accounts.
						if(_IsEmulationMode == false)
						{
							me.dateFilterVal = defaultDateIndex;
							me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
						}
						else
						{
							me.dateFilterVal = '1';
							me.dateFilterLabel = getLabel('today', 'Today');
						}
						me.handleDateChange(me.dateFilterVal);
						me.setDataForFilter();
						me.applyQuickFilter();
					}
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
					me.assignSavedFilter();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			},
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
			'receivableSummaryFilterView  combo[itemId="statusCombo"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					me.handleStatusClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.statusFilterVal)
							&& 'all' != me.statusFilterVal)
						me.handleStatusFieldSync('A', me.statusFilterVal,
								me.statusFilterDesc);
				}
			},
			'receivableSummaryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'receivableSummaryFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						$('#msClient').val(me.clientFilterVal);
						$('#msClient').niceSelect('update');
					} else {
						combo.setValue(combo.getStore().getAt(0));
						$('#msClient').val(combo.getStore().getAt(0));
						$('#msClient').niceSelect('update');
					}
				}
			}
		});
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'RECSUM_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'RECSUM_OPT_ADVFILTER') {
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
	postHandleAdvancedFilterTabChange : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var objGroupView = me.getGroupView();

		me.populateSavedFilter(filterCode, filterData, false);
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.handleAdvanceFilterCleanUp();
		objGroupView.reconfigureGrid(null);
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
		objGroupView.handleGroupActionsVisibility(buttonMask);
		
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
				if(me.dateFilterVal === '12'){
					if (!Ext.isEmpty(reqJsonInQuick)) {
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
		grid.loadGridData(strUrl, null, null, false);
		/*grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowDoubleClick(record, grid);
				});*/
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
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			if (objData.get('authLevel') === 0
					&& objData.get('paymentType') !== 'QUICKPAY')
				blnAuthInstLevel = true;
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		if (blnAuthInstLevel) {
			buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
			maskArray.push(buttonMask);
		}
		if(arrSelectedRecords.length > 1 && showFxPopup === 'AUTH'){
			buttonMask = me.replaceCharAtIndex(4, '0', buttonMask);
			buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
			maskArray.push(buttonMask);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		objGroupView.handleGroupActionsVisibility(actionMask);
		me.enableNachaDownloadOption(arrSelectedRecords);
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
			var URLJson = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);

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
								|| operator === 'gt' || operator === 'lt' || operator === 'le')) {
					if (filterData[index].detailFilter
							&& filterData[index].detailFilter === 'Y') {
						strDetailUrl = strDetailUrl + ' and ';
					} else {
						strTemp = strTemp + ' and ';
					}
				}
				if(strTemp == ' and ' && !blnFilterApplied){
					strTemp = '';
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
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + filterData[index].field + ' '
										+ filterData[index].operator + ' ' + '\''
										+ filterData[index].value1 + '\'' + ' and '
										+ '\'' + filterData[index].value2 + '\'';
									}
								else{
									strTemp = strTemp + filterData[index].field + ' '
										+ filterData[index].operator + ' ' + '\''
										+ filterData[index].value1 + '\'' + ' and '
										+ '\'' + filterData[index].value2 + '\'';
									}
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
						strTemp = strTemp + arrSortColumn[filterData[index].value1] + ' '
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
								if (isFilterApplied && strTemp != '') {
									strTemp = strTemp + ' and ';
								} else if(strTemp == '' && blnFilterApplied){
									strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}

								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl
											+ filterData[index].field + ' '
											+ filterData[index].operator + ' '
											+ '\'' + objValue + '\'';
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
						if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl 
										+ filterData[index].field + ' '
										+ filterData[index].operator + ' ' + '\''
										+ filterData[index].value1 + '\'';
						}
						else if (filterData[index].dataType === 1) {
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
						// objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ' and ';
									} else if(strTemp != ''){
										strTemp = strTemp + ' and ';
									} else if(strTemp == '' && blnFilterApplied){
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
						case 'le' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
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
			$('#downloadNachaId').removeClass('ui-helper-hidden');
			if (!isDisabled) {
				$('#downloadNachaId a').attr("disabled", false);
				$('#downloadNachaId a').attr("href", "#");
				$("#downloadNachaId").hover(function() {
							$(this).removeClass('downloadNacha-disabled');
						});
			} else {
				$('#downloadNachaId a').attr("disabled", true);
				$('#downloadNachaId a').removeAttr("href");
				$("#downloadNachaId").hover(function() {
							$(this).addClass('downloadNacha-disabled');
						});
			}
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType,remark) {
		var me = this;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'verify' || strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);
		} else if(remark){
			me.preHandleGroupActions(strUrl, remark, grid, arrSelectedRecords,
					strActionType, strAction);
		}else{
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
					'Please enter verify remark');
			titleMsg = getLabel('instrumentVerifyRemarkPopUpFldLbl',
					'Verify Remark');
		} else if (strAction === 'reject') {
			fieldLbl = getLabel('instrumentReturnRemarkPopUpTitle',
					'Please enter return remark');
			titleMsg = getLabel('instrumentReturnRemarkPopUpFldLbl',
					'Return Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText: {
						ok: getLabel('btnOk', 'OK'),
						cancel: getLabel('btncancel', 'Cancel')
						},
					multiline : 4,
					cls : 't7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text)){
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error', 'Reject Remarks cannot be blank'));
							}else{
								me.preHandleGroupActions(strActionUrl, text, grid, arrSelectedRecords, strActionType, strAction);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255
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
								userMessage : remark
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
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								me.postHandleGroupAction(jsonRes, grid,
										strActionType, strAction, records);
								if(showRealTime === 'Y' && ('auth' === strAction || 'send' === strAction || 'submit' === strAction))
								{
									processRealTimePirs(jsonRes,strUrl,strAction);
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
		var groupView = me.getGroupView();
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		var warnLimit = "Warning limit exceeded!";
		var strIsPDCFlagEnabled = 'N';
		var index = 0;
		Ext.each(actionData, function(result) {
			intSerialNo = parseInt(result.serialNo,10);
			record = grid.getRecord(intSerialNo);
			row = grid.getRow(intSerialNo);
			msg = '';
			strIsProductCutOff = 'N';
			strIsRollover = 'N';
			strIsReject = 'N';
			strIsDiscard = 'N';
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
				if(!Ext.isEmpty(error.flag) && 'Y' == error.flag){
				    strIsPDCFlagEnabled  = 'Y';
				}
				if (!Ext.isEmpty(errCode)
						&& (errCode.substr(0, 4) === 'WARN' || errCode === 'GD0002'))
					strIsProductCutOff = 'Y';
			});
			if(strIsProductCutOff == 'Y'){
				if(isNaN(fxTimer))  fxTimer = 10;
				countdown_number = 60*fxTimer;
				me.countdownTrigger(strAction, grid,
				 records, errCode,index,strIsPDCFlagEnabled);
			}else{
				row = grid.getRow(intSerialNo);
				me.handleVisualIndication(row, record, result, strIsProductCutOff,
						true);
				grid.deSelectRecord(record);
				row = grid.getLockedGridRow(intSerialNo);
				me.handleVisualIndication(row, record, result, strIsProductCutOff,
						false);
				if (!Ext.isEmpty(strAction)) {
					if (strAction === 'auth' || strAction === 'release') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode) && errCode === 'GD0002') {
							strIsReject = 'Y';
							strIsDiscard = 'Y';
						}
					} else if (strAction === 'save' || strAction === 'submit'
							|| strAction === 'send') {
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN') {
							strIsRollover = 'Y';
							strIsDiscard = 'Y';
						} else if (!Ext.isEmpty(errCode) && errCode === 'GD0002') {
							strIsDiscard = 'Y';
						}
					}
				}
				var strActionMessage = result.success === 'Y'
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
									.get('dhdDepSlip'),
							actionMessage : strActionMessage
						});
			}
			     index++;
		});
		/*
		 * if (!Ext.isEmpty(arrActionMsg) && errorPanel) {
		 * errorPanel.loadResultData(arrActionMsg); errorPanel.show(); }
		 */
		//me.hideQuickFilter();
		arrMsg = (me.populateActionResult(arrActionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		groupView.setLoading(false);
		// refresh Grid here only when there is no cutoff popup else refresh after cutoff popup actions. check function takeCutOffTranAction below
		if(!me.isCutOff)
			groupView.refreshData();
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
	preHandleProductCutoff : function(errRecord, strUserMsg,
			strAction) {
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
									strUrl, strUserMsg,strActionTaken);
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
		var warnLimit = "Warning limit exceeded!"
		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';

		record = grid.getRecord(parseInt(result.serialNo,10));
		intValue = ((curPage - 1) * pageSize) + parseInt(result.serialNo,10);
		if (Ext.isEmpty(intValue))
			intValue = parseInt(result.serialNo,10);

		if (result.success === 'FX') {
			if(isNaN(fxTimer))  fxTimer = 10;
			countdown_number = 60*fxTimer;
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
								.get('dhdDepSlip'),
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
								.get('dhdDepSlip'),
						actionMessage : strActionTaken + ' '+strActionSuccess
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
		var strActionUrl = 'services/receivableheaderinfo/id.json';
		var jsondata = {'id':strIde};
		Ext.Ajax.request({
					url : strActionUrl,
					method : "POST",
					data : jsondata,
					success : function(response) {
						var resData = Ext.decode(response.responseText);
						if (resData && resData.d && resData.d.receivableHeaderInfo) {
							var hdrInfo = resData.d.receivableHeaderInfo;
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
											title : getLabel(
													'instrumentWarning',
													'Warning'),
											msg : strMsg1
													+ !Ext.isEmpty(strMsg2)
													? '\n' + strMsg2
													: '',
											buttons : Ext.Msg.OKCANCEL,
											style : {
												height : 400
											},
											bodyPadding : 0,
											fn : function(btn, text) {
												if (btn == 'ok') {
													me.preHandleGroupActions(
															strUrl, 'Y', grid,
															arrSelectedRecords,
															strActionType,
															strAction);
												}
											}
										});
							} else {
								if(paymentFxInfo){
									me.preHandleGroupActions(strUrl, paymentFxInfo, grid,
										arrSelectedRecords, strActionType,
										strAction);
								}
								else{
									me.preHandleGroupActions(strUrl, '', grid,
										arrSelectedRecords, strActionType,
										strAction);
								}
							}
						}
					},
					failure : function(response) {
						var errMsg = "";
						groupView.setLoading(false);
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
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var strPmtType = record.get('paymentType');
		
		if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'verify' || actionName === 'auth'
				|| actionName === 'send' || actionName === 'reject'
				|| actionName === 'hold' || actionName === 'release'
				|| actionName === 'stop' || actionName === 'cancel') {
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		} else if (actionName === 'btnHistory') {
			var recIdentifier = record.get('identifier');
			if (!Ext.isEmpty(recIdentifier)) {
				var historyUrl = 'services/receivablesbatch/id/history.json';
				me.showHistory(historyUrl, recIdentifier);
			}
		} else if (actionName === 'btnView' || actionName === 'btnEdit'
				|| actionName === 'btnClone'
				|| actionName === 'btnCloneTemplate') {
			if (!Ext.isEmpty(strPmtType)) {
				var strUrl = '', objFormData = {};
				if (actionName === 'btnView' && strPmtType === 'QUICKPAY')
					strUrl = 'viewPayment.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnEdit')
					strUrl = 'editBatchReceivables.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnView')
					strUrl = 'viewBatchReceivables.form';
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
						.isEmpty(record.get('dhdProduct')) ? record
						.get('dhdProduct') : '';
				objFormData.strActionStatus = !Ext.isEmpty(record
						.get('actionStatus')) ? record.get('actionStatus') : '';
				objFormData.strPhdnumber = !Ext
						.isEmpty(record.get('dhdDepNmbr')) ? record
						.get('dhdDepNmbr') : '';
				objFormData.viewState = record.get('identifier');
				objFormData.buttonIdentifier = record.get("__metadata").__buttonIdentifier;
				if (actionName === 'btnView' || actionName === 'btnEdit') {
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

										me
												.postHandleGroupAction(data,
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
	showHistory : function(url, id) {
		var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
						historyUrl : url,
						identifier : id
					}).show();
		historyPopup.center();
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'buttonIdentifier',
				formData.buttonIdentifier));
		var paymentType = 'PAYMENT';
		if (!Ext.isEmpty(strUrl)
				&& strUrl.toLowerCase().indexOf('template') != -1) {
			paymentType = 'TEMPLATE';
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				paymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'actionName',
				actionName));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCloneAction',
				formData.strCloneAction || 'N'));
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
							if (me.receivablePackFilterVal == 'all'
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
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('processingDate', 'Processing Date')
					+ " (" + me.dateFilterLabel + ")");
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					datePickerRef.datepick('setDate', vToDate);
				} else if(index === '12'){
					datePickerRef.datepick('setDate', vFromDate);
				}else {
					datePickerRef.datepick('setDate',vFromDate);
				}
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		}
		
		if (objDateParams.operator == 'eq')
			dateToField = "";
		else
			dateToField = vToDate;
		
		selectedProcessDate = {
				operator : objDateParams.operator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.dateFilterLabel
		};
		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " ("
				+ me.dateFilterLabel + ")", datePickerRef);
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
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
			'7' : getLabel('daterange', 'Date Range'),
			'12' : getLabel('latest', 'Latest')
		};
		if (!Ext.isEmpty(objPaymentSummaryPref)) {
			var objJsonData = Ext.decode(objPaymentSummaryPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				var strPaymentType = data.quickFilter.paymentType;
				var strPaymentTypeDesc = data.quickFilter.paymentTypeDesc;
				var clientSelected = data.filterClientSelected;
				me.clientFilterVal = clientSelected;
				quickFilterClientValSelected = me.clientFilterVal;
				prefClientCode = clientSelected;

				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '7') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;

						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
					}
					me.receivablePackFilterVal = !Ext.isEmpty(strPaymentType)
							? strPaymentType
							: 'all';
					me.paymentTypeFilterDesc = !Ext.isEmpty(strPaymentTypeDesc)
							? strPaymentTypeDesc
							: 'All';
				}
			}
		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			/*
			 * if (me.dateFilterVal === '12') { // do nothing. } else
			 */if (me.dateFilterVal !== '7') {
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
							paramName : 'ActivationDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
		}

		if (!Ext.isEmpty(me.receivablePackFilterVal)
				&& me.receivablePackFilterVal != 'all') {
			arrJsn.push({
						paramName : 'InstrumentType',
						paramValue1 : me.receivablePackFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(clientFilterVal) && me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		me.filterData = arrJsn;
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
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/receivablesummary/groupViewAdvanceFilter.json',
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
//		me.doHandleStateChange();
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
		$('#tabs-2').find('input, textarea, button, select, label, li, checkbox, option, span, div').attr('disabled','disabled');
		$('#processDateDropDown').find('a').prop('class','');
		$('#msReceivablePackage').multiselect().find('option').prop('disabled',true);
		$('#msCreditAccount').multiselect().find('option').prop('disabled',true);
		$('#msStatus').multiselect().find('option').prop('disabled',true);
		$('#btnAdvFilterSaveAndSearch').attr("disabled", true);
		changeAdvancedFilterTab(1);
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
		$('#tabs-2').find('input, textarea, button, select, label, li, checkbox, option, span, div').attr('disabled',false);
		$('#processDateDropDown').find('a').prop('class','x-btn ui-caret-dropdown x-unselectable x-btn-default-small');
		$('#msReceivablePackage').multiselect().find('option').prop('disabled',false);
		$('#msCreditAccount').multiselect().find('option').prop('disabled',false);
		$('#msStatus').multiselect().find('option').prop('disabled',false);
		$('#tabs-2').find('button').removeClass('ui-state-disabled');
		$('#btnAdvFilterSaveAndSearch').attr("disabled", false);
		changeAdvancedFilterTab(1);
	},
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getReceivableSummaryFilterView();
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
		/*if (me.filterApplied === 'Q') {
			me.filterData = me.getQuickFilterQueryJson();
			me.advFilterData = {};
		} else if (me.filterApplied === 'A') {
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();*/
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getAdvancedFilterQueryJson());
			var reqJson = me.findInAdvFilterData(objJson, "Client");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me
						.removeFromQuickArrJson(arrQuickJson, "Client");
				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "InstrumentType");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"InstrumentType");
				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "ActivationDate");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"ActivationDate");
				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "ActionStatus");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"ActionStatus");
				me.filterData = arrQuickJson;
			}
			var sortByData = getAdvancedFilterSortByJson();
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
			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			me.advFilterCodeApplied = filterCode;
		//}
		/*if (me.filterApplied === 'ALL') {
			//me.filterData = me.getQuickFilterQueryJson();
		}*/
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
	getQuickFilterQueryJson : function() {
		var me = this;
		var receivablePackFilterValArray = [];
		var receivablePackFilterVal = me.receivablePackFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var statusFilterValArray = [];		
		var statusFilterVal = me.statusFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var filterUrl = '';
		var statusFilterDisc = me.statusFilterDesc;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'ActivationDate',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('processingDate', 'Processing Date')
					});
		}
		/*if (receivablePackFilterVal != null && receivablePackFilterVal != 'All'
				&& receivablePackFilterVal != 'all'
				&& receivablePackFilterVal.length >= 1) {
			receivablePackFilterValArray = receivablePackFilterVal.toString();
			jsonArray.push({
						paramName : 'receivablePackage',
						paramValue1 : receivablePackFilterValArray,
						operatorValue : 'in',
						dataType : 'S'
					});
		}*/

		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != null && clientFilterVal != 'all') {
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
		return jsonArray;
	},
	getQuickFilterQueryArray : function() {
		var me = this;
		var receivablePackFilterValArray = [];
		var receivablePackFilterVal = me.receivablePackFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var filterUrl = '';
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			filterUrl = filterUrl + 'ANDEntry Date:' + objDateParams.fieldValue1;
		}
		if (receivablePackFilterVal != null && receivablePackFilterVal != 'All'
				&& receivablePackFilterVal != 'all'
				&& receivablePackFilterVal.length >= 1) {
			receivablePackFilterValArray = receivablePackFilterVal.toString();
			filterUrl = filterUrl +'ANDPayment Category:' + receivablePackFilterValArray;
		}
		if (clientFilterVal != null && clientFilterVal != 'all') {
			filterUrl = filterUrl +'ANDClient:' + clientFilterVal;
		}
		else if(reqClient != null && reqClient != '')
		{
			filterUrl = filterUrl +'ANDClient:'+reqClient ;
		}
		else
		{
			filterUrl = filterUrl +'ANDClient:(ALL)' ;
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
		if (groupInfo && groupInfo.groupTypeCode === 'RECSUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else {
			me.refreshData();
		}
	},
	doSearchOnly : function() {
		var me = this;
		var clientComboBox = me.getReceivableSummaryFilterView()
				.down('combo[itemId="clientCombo"]');
		if (!Ext.isEmpty(selectedClientDesc)
				&& selectedClientDesc != null
				&& $('#msClient').val() != 'all') {
			clientComboBox.setValue(selectedClient);
			me.handleClientFieldSync('fromAdvanceFilter',selectedClient,selectedClientDesc);
		} else if ($('#msClient').val() == 'all') {
			clientComboBox.setValue('all');
			clientFilterVal = '';
			me.handleClientFieldSync('fromAdvanceFilter','','');
		}
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [];
		var entryDateLableVal = $('label[for="ProcessDateLabel"]').text();
		var entryDateField = $("#processDate");

		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString())

		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.applyAdvancedFilter();
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
			me.savedFilterVal = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
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
//		me.doHandleStateChange();
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
							//filterGrid.getStore().reload();
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
		var filterView = me.getReceivableSummaryFilterView();
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
		//me.hideQuickFilter();
		$('#entryDataPicker').removeAttr('disabled', 'disabled');
		//me.disablePreferencesButton("savePrefMenuBtn", false);
	},
	/*----------------------------Summary Ribbon Handling Ends----------------------------*/

	/*----------------------------Preferences Handling Starts----------------------------*/
	handleSavePreferences : function(event) {
		var me = this;
		if ($("#savePrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else
			me.doSavePreferences();
	},
	handleClearPreferences : function(event) {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else
			me.doClearPreferences();
	},
	doSavePreferences : function() {
		var me = this;
		var strUrl = me.strCommonPrefUrl;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : imgIcon
										});

							} else {
								// me.toggleClearPrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.INFO
										});
								me.disablePreferencesButton("savePrefMenuBtn",
										true);
								me.disablePreferencesButton("clearPrefMenuBtn",
										false);
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
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	doClearPreferences : function() {
		var me = this;
		// me.toggleSavePrefrenceAction(false);
		var me = this;
		var strUrl = me.strCommonPrefUrl + "?$clear=true";
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : Ext.encode(arrPref),
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var isSuccess;
					var title, strMsg, imgIcon;
					if (responseData.d.preferences
							&& responseData.d.preferences.success)
						isSuccess = responseData.d.preferences.success;
					if (isSuccess && isSuccess === 'N') {
						title = getLabel('SaveFilterPopupTitle', 'Message');
						strMsg = responseData.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : imgIcon
								});

					} else {
						// me.toggleSavePrefrenceAction(true);
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO,
									fn : function(buttonId) {
										if (buttonId === "ok") {
											window.location.reload();
										}
									}
								});
						me.disablePreferencesButton("savePrefMenuBtn", false);
						me.disablePreferencesButton("clearPrefMenuBtn", true);
					}

				},
				failure : function() {
					var errMsg = "";
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
		}

	},
	/*
	 * getPreferencesToSave : function(localSave) { var me = this; var groupView =
	 * me.getGroupView(); var grid = null; var arrCols = null, objCol = null,
	 * arrColPref = null, arrPref = [], objFilterPref = null; var groupInfo =
	 * null, subGroupInfo = null; if (groupView) { grid = groupView.getGrid();
	 * if (!Ext.isEmpty(grid)) { arrCols = grid.headerCt.getGridColumns();
	 * arrColPref = new Array(); for (var j = 0; j < arrCols.length; j++) {
	 * objCol = arrCols[j]; if (!Ext.isEmpty(objCol) &&
	 * !Ext.isEmpty(objCol.itemId) && objCol.itemId.startsWith('col_') &&
	 * !Ext.isEmpty(objCol.xtype) && objCol.colType != 'actioncontent')
	 * arrColPref.push({ colId : objCol.dataIndex, colHeader : objCol.text,
	 * hidden : objCol.hidden, colType : objCol.colType, width : objCol.width
	 * }); } }
	 * 
	 * groupInfo = groupView.getGroupInfo() || '{}'; subGroupInfo =
	 * groupView.getSubGroupInfo() || {};
	 * 
	 * objFilterPref = me.getFilterPreferences(); arrPref.push({ "module" :
	 * "groupViewFilterPref", "jsonPreferences" : objFilterPref }); // TODO :
	 * Save Active tab for group by "Advanced Filter" to be // discuss if
	 * (groupInfo.groupTypeCode && subGroupInfo.groupCode &&
	 * groupInfo.groupTypeCode !== 'RECSUM_OPT_ADVFILTER') { arrPref.push({ "module" :
	 * "groupByPref", "jsonPreferences" : { groupCode : groupInfo.groupTypeCode,
	 * subGroupCode : subGroupInfo.groupCode } }); arrPref.push({ "module" :
	 * subGroupInfo.groupCode, "jsonPreferences" : { 'gridCols' : arrColPref,
	 * 'pgSize' : grid.getPageSize() } }); } } return arrPref; },
	 */
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			// TODO : Save Active tab for group by "Advanced Filter" to be
			// discuss
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
				if (groupInfo.groupTypeCode !== 'RECSUM_OPT_ADVFILTER'
						|| (groupInfo.groupTypeCode == 'RECSUM_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
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
									'gridCols' : state.grid.columns,
									'pgSize' : state.grid.pageSize,
									'gridSetting' : state.gridSetting,
									'sortState' : state.grid.sortState
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
		var objFilterPref = {};
		var filterPanel = me.getReceivableSummaryFilterView();
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var quickPref = {};
		quickPref.paymentType = me.receivablePackFilterVal;
		quickPref.paymentTypeDesc = me.paymentTypeFilterDesc;
		quickPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.entryDateFrom = me.dateFilterFromVal;
				quickPref.entryDateTo = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				quickPref.entryDateFrom = fieldValue1;
				quickPref.entryDateTo = fieldValue2;
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal))
			objFilterPref.filterClientSelected = me.clientFilterVal;
		return objFilterPref;
	},
	getModuleName : function(strValue1, strValue2) {
		var strLength = strValue1.length > 5 ? 4 : 4;
		var strModule = 'groupView_';

		strModule += strValue1.substr(0, strLength);
		strLength = strValue2.length > 5 ? 4 : 4;
		strModule += '_' + strValue2.substr(0, strLength);

		return strModule.toUpperCase();
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
	replaceCharAtIndex : function(index, character, strInput) {
		return strInput.substr(0, index) + character
				+ strInput.substr(index + 1);
	},

	/*----------------------------Preferences Handling Ends----------------------------*/

	/*-------------------- Download handling Start ------------------- */
	downloadReport : function(actionName) {
		var me = this;
		var action = null ;
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
				//$.download('services/paymentsbatch/nachadownload', arrJson);
			var records = (objOfSelectedGridRecord || []);
				for (var index = 0; index < records.length; index++) {
					arrJson.push({
								identifier : records[index].data.identifier
								});
				}
			}
			var withHeaderFlag = document.getElementById("headerCheckbox").checked;
			var arrExtension = {
				downloadXls : 'xls',
				downloadCsv : 'csv',
				downloadPdf : 'pdf',
				downloadTsv : 'tsv'
			};
			var currentPage = 1;
			var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';

			strExtension = arrExtension[actionName];
			strUrl = 'services/receivablesbatch.' + strExtension;
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
			if (!Ext.isEmpty(arrJson))
				strUrl += '&$identifier={d1:'+ Ext.encode(arrJson)+'}';
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
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'visColsStr', visColsStr));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'txtCSVFlag', withHeaderFlag));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
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
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
		me.handleFieldSync();
//		me.handleClientFieldSync('fromQuickFilter',me.clientFilterVal,me.clientFilterDesc);
	},
	handlePaymentTypeClick : function(combo) {
		var me = this;
		me.receivablePackFilterVal = combo.getValue();
		me.paymentTypeFilterDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		var savedFilterCombo = me.getReceivableSummaryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombo.setValue("");
		if (me.receivablePackFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
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
		var statusValueDesc = [];
		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString());

		var entryDateLableVal = $('label[for="ProcessDateLabel"]').text();
		var entryDateField = $("#processDate");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedClientDesc;
		if(isClientUser()){
			if(!Ext.isEmpty(me.clientFilterVal)){
				objQuickClientField = me.getQuickFilterClientCombo();
				if(!Ext.isEmpty(objQuickClientField)){
					objQuickClientField.setValue(me.clientFilterVal);
				}
			}
		}
		else{
			if(!Ext.isEmpty(selectedClientDesc)){
				objQuickClientAutoCompField = me.getReceivableSummaryFilterView().down('AutoCompleter[itemId="clientAuto]');
				if(!Ext.isEmpty(objQuickClientAutoCompField)){
					objQuickClientAutoCompField.setValue(selectedClientDesc);
				}
			}
		}
	},
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "entryDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
		} else if (filterType == "entryDateAdvFilter") {

		}
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		var toDatePickerRef = $('#entryDataToPicker');
		if (isClientUser()) {
			var clientComboBox = me.getReceivableSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getReceivableSummaryFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}

		var statusComboBox = me.getReceivableSummaryFilterView()
				.down('combo[itemId="statusCombo"]');
		me.statusFilterVal = 'all';

		statusComboBox.selectAllValues();
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getReceivableSummaryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		var entryDatePicker = me.getReceivableSummaryFilterView()
				.down('component[itemId="entryDataPicker"]');
		if( _IsEmulationMode == false)
		{
			me.dateFilterVal = defaultDateIndex;
			me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		}
		else
		{
			me.dateFilterVal = '1';
			me.dateFilterLabel = getLabel('today', 'Today');
		}
		me.handleDateChange(me.dateFilterVal);
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');

		if (_availableClients > 1)
			$("#summaryClientFilterSpan").text('All Companies');
		$("#summaryClientFilter").val('');

		me.resetAllFields(true); // true will set the all permitted FI data
		me.setDataForFilter();
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
		me.dateFilterLabel = me.processDateFilterLabel;
		me.handleProcessDateChange(btn.btnValue);
	},
	creationDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	handleCreationDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);

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
				$('#creationDate').datepick('setDate',vFromDate);
			} else {
				$('#creationDate')
						.datepick('setDate',[vFromDate, vToDate]);
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
				$('#creationDate').datepick('setDate',vFromDate);
			} else {
				$('#creationDate').datepick('setDate',[vFromDate, vToDate]);
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
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.effectiveDateFilterLabel)) {
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date')
					+ " (" + me.effectiveDateFilterLabel + ")");
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
				$('#effectiveDate').datepick('setDate',vFromDate);
			} else {
				$('#effectiveDate')
						.datepick('setDate',[vFromDate, vToDate]);
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
				$('#effectiveDate').datepick('setDate',vFromDate);
			} else {
				$('#effectiveDate')
						.datepick('setDate',[vFromDate, vToDate]);
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
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.processDateFilterLabel)) {
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate',
					'Processing Date')
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
				$('#processDate').datepick('setDate',vFromDate);
			} else {
				$('#processDate').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedProcessDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.processDateFilterLabel
			};
		} else {
			if (index === '1' || index === '2') {
				$('#processDate').datepick('setDate',vFromDate);
			} else {
				$('#processDate').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedProcessDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.processDateFilterLabel
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
				var fromDate = new Date(Ext.Date.parse(collFromDate, dtFormat));
				var toDate = new Date(Ext.Date.parse(collToDate, dtFormat));
				fieldValue1 = Ext.Date.format(
						fromDate,
						strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
						toDate,
						strSqlDateFormat);
				operator = 'bt';
				label = 'Latest';
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
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
					label = 'Date Range';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
					label = 'Date Range';
				}
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
			me.doSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
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
		$(".amountTo").addClass("hidden");
		$(".instAmountTo").addClass("hidden");
		if (!Ext.isEmpty(filterData.sellerValue)) {
			objSellerAutoComp = $("input[type='text'][id='sellerAutocomplete']");
			if (!$(objSellerAutoComp).is(":visible"))
				objSellerAutoComp.val(filterData.sellerValue);
		}
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'ClientReference') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#clientReference").val(fieldVal);
			} else if (fieldName === 'PayerAcct') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#payerAcct").val(fieldVal);
			} else if (fieldName === 'Maker') {
				$("#entryUser").val(fieldVal);
			} else if (fieldName === 'FileName') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#fileName").val(fieldVal);
			} else if (fieldName === 'BatchAmount') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'AmountDdt') {
				me.setInstAmounts(operatorValue, fieldVal, fieldSecondVal);
			} /*else if (fieldName === 'MandateName') {
				$("#mandateName").val(fieldVal);
			}*/ else if (fieldName === 'PayerNamePDT') {
				$("#payerName").val(fieldVal);
			} else if (fieldName === 'OrderingPartyName') {
				$("#filterOrderingPartyAutocomplete").val(fieldVal);
			}

			if (fieldName === 'ActivationDate') {
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
				var multiPayRef = $("input[type='checkbox'][id='multiPayCheckBox']");
				var singlePayRef = $("input[type='checkbox'][id='singlePayCheckBox']");
				if (!Ext.isEmpty(multiPayRef) && !Ext.isEmpty(singlePayRef)) {
					if (fieldVal === 'B') {
						singlePayRef.prop('checked', false);
						multiPayRef.prop('checked', true);
					} else if (fieldVal === 'Q') {
						singlePayRef.prop('checked', true);
						multiPayRef.prop('checked', false);
					} else if (fieldVal === 'B,Q') {
						singlePayRef.prop('checked', true);
						multiPayRef.prop('checked', true);
					}
				}
				isPayCategoryFieldPresent = true;
			} else if (fieldName == 'CreditDebitFlag') {
				var debitRef = $("input[type='checkbox'][id='msDebit']");
				var creditRef = $("input[type='checkbox'][id='msCredit']");
				if (!Ext.isEmpty(debitRef) && !Ext.isEmpty(creditRef))
					if (fieldVal == '') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', true);
					} else if (fieldVal == 'D') {
						debitRef.prop('checked', true);
					} else if (fieldVal = 'C') {
						creditRef.prop('checked', true);
					}
			} else if (fieldName === 'CrossCurrency'
					|| fieldName === 'PrenotePDT' || fieldName === 'Reversal'
					|| fieldName === 'Confidential') {
				me.setRadioGroupValues(fieldName, fieldVal);
			} else if (fieldName === 'receivablePackage'
					|| fieldName === 'ProductType'
					|| fieldName === 'CreditAccount'
					|| fieldName === 'ActionStatus'
					|| fieldName === 'MandateName'
					|| fieldName === 'Channel' || fieldName === 'PayerAcct') {
				me.checkUnCheckMenuItems(fieldName, fieldVal,fieldSecondVal);
				if (fieldName === 'ActionStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}else if(fieldName === 'Client'){
				selectedClientDesc = filterData.filterBy[i].displayValue1;
				selectedFilterClient = fieldVal;
				$('#msClient').val(fieldVal);
				$('#msClient').niceSelect('update');
			}
		}
		if (!isPayCategoryFieldPresent) {
			$("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
					false);
			$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
					false);
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
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;

			if (dateType === 'ActivationDate') {
				dateFilterRef = $('#processDate');
			}
			  if (dateOperator === 'bt') {
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
						$(dateFilterRef).datepick('setDate',[
								formattedFromDate, formattedToDate]);
					}
				}
			}
			else{
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
				}
			}
			if (dateOperator == 'eq')
				dateToField = "";
			else
				dateToField = formattedToDate;
			selectedProcessDate = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : dateToField,
				dateLabel : data.dateFilterLabel
			}
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate',
			'Processing Date'));
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate','Processing Date')+ " ("
					+ selectedProcessDate.dateLabel + ")");
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate','Processing Date')+ " ("
					+ selectedProcessDate.dateLabel + ")");
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

		if (componentName === 'receivablePackage') {
			menuRef = $("select[id='msReceivablePackage']");
			elementId = '#msReceivablePackage';
		} else if (componentName === 'ActionStatus') {
			menuRef = $("select[id='msStatus']");
			elementId = '#msStatus';
		} else if (componentName === 'MandateName') {
			menuRef = $("select[id='mandateName']");
			elementId = '#mandateName';
		} else if (componentName === 'Client') {
			menuRef = $("select[id='msClient']");
			elementId = '#msClient';
		} else if (componentName === 'CreditAccount') {
			menuRef = $("select[id='msCreditAccount']");
			elementId = '#msCreditAccount';
		} else if (componentName === 'InstrumentType') {
			menuRef = $("select[id='msReceivablePackage']");
			elementId = '#msReceivablePackage';
		} else if (componentName === 'Channel') {
			menuRef = $("select[id='msChannel']");
			elementId = '#msChannel';
		} else if (componentName === 'PayerAcct') {
			menuRef = $("select[id='payerAcct']");
			elementId = '#payerAcct';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			var dataArray = data.split(',');
			if (componentName === 'InstrumentType' || componentName === 'receivablePackage') {
				me.receivablePackFilterVal = dataArray;
			}

			if (componentName === 'ActionStatus') {
				data = fieldSecondVal;
				dataArray = data.split(',');
				selectedStatusListSumm = dataArray;
			}
			if (componentName === 'ProductType') {
				selectedProductTypeList = dataArray;
			}
			if (componentName === 'CreditAccount') {
				selectedAccountNoList = dataArray;
			}
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {

			}
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
			$(elementId).multiselect("refresh");
		}
		if(elementId == '#msClient'){
			$('#msClient').niceSelect('update');
		}
	},
	setSortByComboFields : function(fieldName, columnId, buttonText,
			disableFlag) {
		if (!Ext.isEmpty(fieldName)) {

			if (fieldName === 'SortBy') {
				// sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
					var sortByLabelRef = $("#sortBy1AscDescLabel");
					if (!Ext.isEmpty(sortByLabelRef))
						sortBy1ComboSelected(columnId);
						sortByLabelRef.text(buttonText);
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
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#amountFieldFrom").removeClass("hidden");
						$(".amountTo").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
						$("#msAmountLabel").text(getLabel("batchAmountFrom","Batch Amount From"));
					}
				}
			}
		}
		$("#amountOperator").niceSelect('update');
	},
	setInstAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#instAmountFieldFrom");
		var amountFieldRefTo = $("#instAmountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#instAmountOperator').val(operator);
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#instAmountFieldFrom").removeClass("hidden");
						$(".instAmountTo").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
						$("#msInstAmountLabel").text(getLabel("instAmountFrom","Instrument Amount From"));
					}
				}
			}
		}
		$("#instAmountOperator").niceSelect('update');
	},
	resetAllFields : function(bIsClearFI) {
		var me = this;
		resetAllMenuItemsInMultiSelect("#msReceivablePackage");
		resetAllMenuItemsInMultiSelect("#msCreditAccount");
		$("input[type='text'][id='mandateName']").val("");
		selectedProcessDate = {};
		$("#entryUser").val("");
		resetAllMenuItemsInMultiSelect("#msStatus");
		$("#fileName").val("");
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("#instAmountOperator").val($("#instAmountOperator option:first").val());
		$("#amountFieldFrom").val("");
		$("#amountFieldTo").val("");
		$(".amountTo").addClass("hidden");
		$("#msAmountLabel").text(getLabel("batchAmount","Batch Amount"));
		$("#instAmountFieldFrom").val("");
		$("#instAmountFieldTo").val("");
		$(".instAmountTo").addClass("hidden");
		$("#msInstAmountLabel").text(getLabel("instAmount","Instrument Amount"));
		$("#payerName").val("");
		$("#sellerAutocomplete").val("");
		// true will set the all permitted FI data
		if(bIsClearFI) setClientMenuItems("msClient", true, true);
		$("#payerAcct").val("");
		$("input[type='text'][id='clientReference']").val("");
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
		$('#msSortBy2').attr('disabled', true);
		$('#msSortBy3').attr('disabled', true);
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
				'Effective Date'));
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
				'Creation Date'));
		$('#tabs-2').find('input, textarea, button, select, label, li, checkbox, option, span, div').attr('disabled',false);
		$('#processDateDropDown').find('a').prop('class','x-btn ui-caret-dropdown x-unselectable x-btn-default-small');
		$('#msReceivablePackage').multiselect().find('option').prop('disabled',false);
		$('#msCreditAccount').multiselect().find('option').prop('disabled',false);
		$('#msStatus').multiselect().find('option').prop('disabled',false);
		$('#tabs-2').find('button').removeClass('ui-state-disabled');
		$('#btnAdvFilterSaveAndSearch').attr("disabled", false);
		$('#msClient').val('all');
		$('#msClient').niceSelect('update');
		$('#amountOperator,#instAmountOperator').niceSelect('update');
		$("#msSortBy1").niceSelect('update');
		$("#msSortBy2").niceSelect('update');
		$("#msSortBy3").niceSelect('update');
		$("#saveFilterChkBox").attr('checked', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		var objField = me.getReceivableSummaryFilterView()
			.down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
		if(!bIsClearFI){
			me.dateFilterVal = '';
			selectedEntryDate = {};
			me.resetAdvProcessDate();
		}		
	},
	
	resetAdvProcessDate: function(){
		var me = this;
		var objDateParams =null;
		var label = null;
		if(_IsEmulationMode == false)
		{
			objDateParams = me.getDateParam(defaultDateIndex);
			label = getDateIndexLabel(defaultDateIndex);
		}
		else
		{
			objDateParams = me.getDateParam('1');
			label = getDateIndexLabel('1');
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat);
		$('#processDate').datepick('setDate',[vFromDate, vToDate]);
		selectedProcessDate = {
				operator : 'bt',
				fromDate : vFromDate,
				toDate : vToDate,
				dateLabel : label
		};
		
		$('label[for="ProcessDateLabel"]').text(getLabel('processingDate', 'Processing Date') + " (" + selectedProcessDate.dateLabel + ")");
		updateToolTip('processDate',  " (" + label + ")");
	},
	
	/*--------------------Quick Filter End--------------------------*/
	setWidgetFilters : function() {
		var me = this;
		for (var i = 0; i < arrFilterJson.length; i++) {
			if (arrFilterJson[i].field === 'EntryDate') {
				var objDateLbl = {
					'' : getLabel('latest', 'Latest'),
					'3' : getLabel('thisweek', 'This Week'),
					'4' : getLabel('lastweektodate', 'Last Week To Date'),
					'5' : getLabel('thismonth', 'This Month'),
					'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
					'8' : getLabel('thisquarter', 'This Quarter'),
					'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					'12' : getLabel('latest', 'Latest')
				};
				me.dateFilterLabel = objDateLbl[arrFilterJson[i].btnValue];
				me.dateFilterVal = arrFilterJson[i].btnValue;
			}
			if (arrFilterJson[i].field === 'InstrumentType')
				me.receivablePackFilterVal = arrFilterJson[i].value1;
		}
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	 countdownTrigger : function(strAction, grid, records, errorCode,index,strIsPDCFlagEnabled) {
	 var me = this;
		var groupView = me.getGroupView();
		var mins = Math.floor(countdown_number / 60);
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
		
		$('#receivablesFxPopupDiv').dialog({
					title : getLabel("fxPopupTitle","Approve transaction in ") + mins + ":" + sec,
					autoOpen : false,
					maxHeight : 550,
					minHeight : 156,
					width : 735,
					modal : true,
					resizable : false,
					draggable : false,
					close: function(event, ui)
		     	   	{
						clearTimeout(countdown);
						groupView.setLoading(false);
						groupView.refreshData();
		        	}
				});
		var currentFooterDiv="";
		if ('auth' === strAction){
			$('#btnReject').css('display', 'block');
//			currentFooterDiv = "#authFooterButtons";
			if (records[index].data.dhdModule=='C' && entityType=='0') {
				$('#btnDiscard').css('display', 'none');
			}
		}else if('submit' === strAction || 'send' === strAction ){
			$('#btnReject').css('display', 'none');
//			currentFooterDiv = "#submitFooterButtons";
		}
		if('Y' === strIsPDCFlagEnabled){
		   $('#btnRollover').css('display', 'none');
		}
		else{
		   $('#btnCancel').css('display', 'none');
		}
		$('#receivablesFxPopupDiv').dialog("open");
//		$(currentFooterDiv).find('#btnDiscard').unbind('click');
//		$(currentFooterDiv).find('#btnDiscard').bind('click', function() {
		$('#btnDiscard').unbind('click');
		$('#btnDiscard').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions('discard', grid, [records[index]], 'rowAction');
			$('#receivablesFxPopupDiv').dialog("close");
		});
//		$(currentFooterDiv).find('#btnRollover').unbind('click');
//		$(currentFooterDiv).find('#btnRollover').bind('click', function() {
		$('#btnRollover').unbind('click');
		$('#btnRollover').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions(strAction, grid,[records[index]], 'rowAction','Y');
			$('#receivablesFxPopupDiv').dialog("close");
		});
//		$(currentFooterDiv).find('#btnReject').unbind('click');
//		$(currentFooterDiv).find('#btnReject').bind('click', function() {
		$('#btnReject').unbind('click');
		$('#btnReject').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions('reject', grid, records, 'rowAction');
			$('#receivablesFxPopupDiv').dialog("close");
		});
		$('#btnCancel').unbind('click');
		$('#btnCancel').bind('click', function() {
		    clearTimeout(countdown);
            $('#receivablesFxPopupDiv').dialog("close");
        });
		var transactionData = records[index].data;
		var creditAmtRef = document.getElementById("creditAmt");
		creditAmtRef.innerHTML  = transactionData.dhdTotalAmnt;
		var creditCcyRef = document.getElementById("creditCcy");
		creditCcyRef.innerHTML  = transactionData.creditCcy;
		var processingDateRef = document.getElementById("processingDate");
		processingDateRef.innerHTML  = transactionData.activationDate;
		var clientRefrenceRef = document.getElementById("referencedClient");
		clientRefrenceRef.innerHTML  = transactionData.dhdDepSlip;
		clientRefrenceRef.title  = transactionData.dhdDepSlip;
		if (countdown_number > 0) {
			countdown_number--;
			if (countdown_number > 0) {
				countdown = setTimeout(function() {
							me.countdownTrigger(strAction, grid,
									records,errorCode,index,strIsPDCFlagEnabled);
						}, 1000);
			} else {
				$('#receivablesFxPopupDiv').dialog("close");
				clearTimeout(countdown);
			}
		}
	},

	countdownClear : function() {
	    clearTimeout(countdown);
	},
	
	/* State handling at local storage starts */
	doHandleStateChange : function() {
		var me = this, objState = {}, objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objState['filterCode'] = me.savedFilterVal;
		objState['subGroupCode'] = (subGroupInfo || {}).groupCode;
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
					me.updateObjReceivableSummaryPref, args, me, false);
		}
	},
	updateObjReceivableSummaryPref : function(data) {
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
		} else
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
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
                    ? getJsonObj(objPrefData.d.preferences.ColumnSetting.gridCols)
					: (!Ext.isEmpty(arrGenericColumnModel) ? Ext.decode(getJsonObj(arrGenericColumnModel)) : (RECEIVABLE_GENERIC_COLUMN_MODEL || '[]'));
					  
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
		objData["filterUrl"] = 'services/userfilterslist/groupRecViewFilter.json';
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
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReceivableSummaryView(), gridModel = null, objData = null;
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

	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
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
				if (paramName === 'ActivationDate') {
					me.resetActivationDateAsDefault();
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
					if (paramName === 'ActivationDate') {
						me.resetActivationDateAsDefault();
					}
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.setDataForFilter();
			me.refreshData();
		}
	},
	
	resetActivationDateAsDefault : function() {
		var me = this;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.handleDateChange(me.dateFilterVal);
	},
	
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'ActionStatus') {
			var objField = me.getReceivableSummaryFilterView()
					.down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			resetAllMenuItemsInMultiSelect("#msStatus");
		} else if (strFieldName === 'ActivationDate') {
			me.resetActivationDateAsDefault();
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
		} else if (strFieldName === 'AccountNoPDT') {
			resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		} else if (strFieldName === 'MandateName') {
			$("input[type='text'][id='mandateName']").val("");
		} else if (strFieldName === 'PayerNamePDT') {
			$("#payerName").val("");
		} else if (strFieldName === 'PayerAcct') {
			$("#payerAcct").val("");
		} else if(strFieldName === 'receivablePackage'){
			resetAllMenuItemsInMultiSelect("#msReceivablePackage");
		} else if(strFieldName === 'CreditAccount'){
			resetAllMenuItemsInMultiSelect("#msCreditAccount");
		} else if (strFieldName === 'ActivationDate') {
			selectedEffectiveDate = {};
			me.datePickerSelectedEffectiveAdvDate = [];
			$('#effectiveDateFrom').val("");
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date'));
		} else if (strFieldName === 'ValueDate') {
			selectedProcessDate = {};
			me.datePickerSelectedProcessAdvDate = [];
			$('#processDateFrom').val("");
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate',
					'Processing Date'));
		} else if (strFieldName === 'Maker') {
			$("#entryUser").val("");
		} else if (strFieldName === 'Reversal') {
			$("input[type='radio'][id='reversalAll']").prop('checked', true);
			$("input[type='radio'][id='reversal']").prop('checked', false);
		} else if (strFieldName === 'FileName') {
			$("#fileName").val("");
		} else if (strFieldName === 'BatchAmount') {
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountFieldFrom").val("");
			$("#amountFieldTo").val("");
			$(".amountTo").addClass("hidden");
			$("#msAmountLabel").text(getLabel("batchAmount","Batch Amount"));
			$('#amountOperator').niceSelect('update');
		} else if (strFieldName === 'AmountDdt') {
			$("#instAmountOperator").val($("#instAmountOperator option:first").val());
			$("#instAmountFieldFrom").val("");
			$("#instAmountFieldTo").val("");
			$(".instAmountTo").addClass("hidden");
			$("#msInstAmountLabel").text(getLabel("instAmount","Instrument Amount"));
			$('#instAmountOperator').niceSelect('update');
		} else if (strFieldName === 'CreateDate') {
			selectedCreationDate = {};
			me.datePickerSelectedCreationAdvDate = [];
			$("#creationDateFrom").val("");
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
			//$("input[type='text'][id='paymentReference']").val("");
			$("input[type='text'][id='clientReference']").val("");
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
			if (isClientUser()) {
				var clientComboBox = me.getReceivableSummaryFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} else {
				var clientComboBox = me.getReceivableSummaryFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
	},
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		me.statusFilterVal = combo.getSelectedValues();
		me.statusFilterDesc = combo.getRawValue();
		me.handleStatusFieldSync('Q', me.statusFilterVal, null);
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#msStatus");
				var objQuickStatusField = me.getReceivableSummaryFilterView()
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
				var objStatusField = me.getReceivableSummaryFilterView()
						.down('combo[itemId="statusCombo"]');
				if (!Ext.isEmpty(statusData)) {
					objStatusField.setValue(statusData);
					objStatusField.selectedOptions = statusData;
				} else {
					objStatusField.setValue(statusData);
					me.statusFilterVal = '';
				}
				if (objStatusField.isAllSelected()) {
					me.statusFilterVal = 'all';
				}
			}
		}
	},
	handleEntryDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="ProcessDateLabel"]')
				: me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#processDate')
				: $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('processDate', sourceToolTipText);
				//selectedEntryDate = {};
			} else {
				labelToChange.setText(sourceLable);
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		} else {
		}
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
	handlWheelScroll:function(){
		var dateEntry='';
		var dateEnd='';
		dateEntry=this.getDateMenu();
		if(dateEntry!=undefined){
			dateEntry.close();
		}
	},
	handleClientFieldSync : function(calledFrom,clientFilterVal,clientFilterDesc){
		var me = this;
		if(calledFrom === 'fromQuickFilter'){
			$('#msClient').val(clientFilterVal);
			$('#msClient').niceSelect('update');
		} else if(calledFrom === 'fromAdvanceFilter'){
			if (isClientUser()) {
				var clientComboBox = me.getReceivableSummaryFilterView()
						.down('combo[itemId="clientCombo"]');
				if(!clientComboBox.up('container').isHidden())
					clientComboBox.setValue(clientFilterVal);
			} else {
				var clientComboBox = me.getReceivableSummaryFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				clientComboBox.setRawValue(clientFilterDesc);
			}
		}
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
					me.populateSavedFilter('',objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
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
				me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
				me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
			}
		}
	},
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,groupInfo = null,subGroupInfo = null,quickFilterState = {};
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
	assignSavedFilter : function() {
		var me = this;
		if (me.firstTime) {
			me.firstTime = false;

			if (objPaymentSummaryPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objPaymentSummaryPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateSavedFilter('',objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
							me.handleFieldSync();
						}
				}
				else if (!Ext.isEmpty(objJsonData.d.preferences)
						&& Ext.isEmpty(widgetFilterUrl)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if (advData === me.getPaymentSummaryFilterView()
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
			}
		}
	}
});