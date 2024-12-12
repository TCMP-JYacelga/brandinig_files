/**
 * @class GCP.controller.ReceivableSummaryController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */

/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.ReceivableSummaryController', {
	extend : 'Ext.app.Controller',
	requires : [Ext.ux.gcp.DateUtil],
	views : ['GCP.view.PaymentSummaryView', 'GCP.view.HistoryPopup',
			'Ext.tip.ToolTip'],
	refs : [{
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'paymentSummaryView',
				selector : 'paymentSummaryView'
			}, {
				ref : 'groupView',
				selector : 'paymentSummaryView groupView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'paymentSummaryView groupView container[itemId="clientContainer"] combo[itemId="quickFilterClientCombo"]'
			}, {
				ref : 'paymentTypeCombo',
				selector : 'paymentSummaryView groupView container[itemId="paymentTypeContainer"] combo[itemId="paymentTypeCombo"]'
			}, {
				ref : 'entryDatePicker',
				selector : 'paymentSummaryView groupView container[itemId="entryDateContainer"] panel[itemId="entryDatePanel"] button[itemId="entryDatePicker"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'filterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'filterView  combo[itemId="savedFiltersCombo"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'paymentSummaryView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'nachaDownloadBtn',
				selector : 'paymentSummaryView menuitem[itemId="downloadNacha"]'
			}],
	config : {
		/* Filter Ribbon Configs Starts */
		strPaymentTypeUrl : 'services/instrumentType.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/tempGroupViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/tempGroupViewFilter/{0}.json',
		strModifySavedFilterUrl : 'services/userfilters/tempGroupViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/tempGroupViewFilter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/templatesummary.json',
		strGetModulePrefUrl : 'services/userpreferences/templatesummary/{0}.json',
		strBatchActionUrl : 'services/templatesbatch/{0}.json',
		strAdvFilterUrl : 'services/userpreferences/templatesummary/groupViewAdvanceFilter.json',
		strDefaultMask : '000000000000000000000',
		intMaskSize : 21,

		dateFilterLabel : getLabel('latest', 'Latest'),
		dateFilterVal : '12',
		dateRangeFilterVal : '13',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		datePickerSelectedDate : [],
		creationDatePickerSelectedDate : [],
		clientFilterVal : null,
		clientFilterDesc : getLabel('allCompanies', 'All companies'),
		paymentTypeFilterVal : 'all',
		paymentTypeFilterDesc : 'All',
		savedFilterVal : '',
		entryDateAdvFilterVal : '',
		creationDateFilterVal : '',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		advFilterEntryDateSelected : {},
		filterApplied : 'ALL',
		dateHandler : null,
		filterCodeValue : null,
		showAdvFilterCode : null,
		objAdvFilterPopup : null,
		previouGrouByCode : null,
		reportGridOrder : null,
		
		savePrefAdvFilterCode : null,
		localPreHandler : null,
		advFilterCodeApplied : null,
		SearchOrSave : false,
		entryDateAdvFilterLabel : getLabel('today', 'Today'),
		creationDateFilterLabel : getLabel('today', 'Today'),
		pageKey : 'payStdViewPref',
		paymentTypeAdvFilterVal : null
		/* Filter Ribbon Configs Ends */
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.updateFilterConfig();
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});

		$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
		$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});
		$(document).on('orderUpGridEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
				});
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					if (filterType == "entryDateAdvFilter") {
						me.entryDateInAdvFilterChange(btn, opts);
					} else if (filterType == "creationDate") {
						me.creationDateChange(btn, opts);
					}
				});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('updateAdvFilterConfig', function(event) {
					me.updateAdvFilterConfig();
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "creationDate") {
						me.datePickerSelectedDate = dates;
						me.creationDateFilterVal = me.dateRangeFilterVal;
						me.creationDateFilterLabel = "Date Range";
						me.handleCreationDateChange(me.dateRangeFilterVal);
					} else if (filterType == "entryDateAdvFilter") {
						me.datePickerSelectedDate = dates;
						me.entryDateAdvFilterVal = me.dateRangeFilterVal;
						me.entryDateAdvFilterLabel = "Date Range";
						me
								.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
						me.advFilterEntryDateSelected = {
							btnValue : me.dateRangeFilterVal,
							text : me.entryDateAdvFilterLabel,
							selectedDate : me.datePickerSelectedDate
						}
					}
				});
		me.control({
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
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
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
					if (objTemplateSummaryPref) {
						var objJsonData = Ext.decode(objTemplateSummaryPref);
						objGroupByPref = objJsonData.d.preferences.groupByPref;
						/*
						 * if (!Ext.isEmpty(objGroupByPref)) { //
						 * me.toggleSavePrefrenceAction(false); //
						 * me.toggleClearPrefrenceAction(true); }
						 */
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.groupViewFilterPref)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.groupViewFilterPref.advFilterCode)) {
									var advData = objJsonData.d.preferences.groupViewFilterPref.advFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvancedSettingPopup(me);
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'filterView combo[itemId="paymentTypeCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.paymentTypeFilterVal)) {
						combo.setValue(me.paymentTypeFilterVal);
					}
				}
			},
			'filterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'filterView component[itemId="templateEntryDataPicker"]' : {
				render : function() {
					$('#templateDataPicker').datepick({
								monthsToShow : 1,
								changeMonth : false,
								changeYear : false,
								rangeSeparator : '  to  ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.datePickerSelectedDate = dates;
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = 'Date Range';
										me
												.handleDateChange(me.dateRangeFilterVal);
										me.setDataForFilter();
										me.applyQuickFilter();
										// me.toggleSavePrefrenceAction(true);
									}
								}

							});
				}

			},
			'filterView' : {
				afterrender : function(tbar, opts) {
					me.handleDateChange(me.dateFilterVal);
				},
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					var advFilterButton = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(advFilterButton)) {
						if (isHidden('AdvanceFilter'))
							advFilterButton.hide();
						else
							advFilterButton.show();
					}
				}

			},
			'filterView menu[itemId="entryDateMenu"]' : {
				'click' : function(menu, item, e, eOpts) {
					me.dateFilterVal = item.btnValue;
					me.dateFilterLabel = item.text;
					me.handleDateChange(item.btnValue);
					me.filterAppiled = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
					// me.toggleSavePrefrenceAction(true);
				}
			},
			'paymentSummaryView ' : {
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				},
				handlePaymentTypeChangeInQuickFilter : function(combo) {
					me.handlePaymentTypeClick(combo);
				}
			},
			'paymentSummaryView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			}
		});
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		me.doSearchOnly();
		if (savedFilterCombobox)
			savedFilterCombobox.setValue('');
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip('');
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();;
		var clientComboBox = me.getFilterView()
				.down('combo[itemId="quickFilterClientCombo"]');
		me.clientFilterVal = 'all';
		clientComboBox.setValue(me.clientFilterVal);
		var paymentTypeComboBox = me.getFilterView()
				.down('combo[itemId="paymentTypeCombo"]');
		me.paymentTypeFilterVal = 'all';
		paymentTypeComboBox.setValue(me.paymentTypeFilterVal);
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		var entryDatePicker = me.getFilterView()
				.down('component[itemId="templateEntryDataPicker"]');
		me.dateFilterVal = '12';
		me.dateFilterLabel = getLabel('latest', 'Latest');
		me.handleDateChange(me.dateFilterVal);
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.setDataForFilter();
		me.refreshData();

	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'TEMPSUM_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'TEMPSUM_OPT_ADVFILTER') {
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
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'TEMPSUM_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savePrefAdvFilterCode = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.getSavedFilterData(strFilterCode,
								me.postHandleAdvancedFilterTabChange, false);
					}
					// me.toggleSavePrefrenceAction(true);
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
				strModule = subGroupInfo.groupCode;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
			}
		}

	},
	postHandleAdvancedFilterTabChange : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.populateAndDisableSavedFilter(filterCode, filterData, false);
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.resetAllFields();
		me.filterCodeValue = null;
		objGroupView.reconfigureGrid(null);
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPaymentSummaryView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;
			colModel = objSummaryView.getColumnModel(arrCols);
			arrSortState = objPref.sortState;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel : {
						sortState : arrSortState
					}
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
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
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowDoubleClick(record, grid);
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
			URLJson = me.generateUrlWithAdvancedFilterParams(isFilterApplied);
			var strDetailUrl = URLJson.detailFilter;
			if (!Ext.isEmpty(strDetailUrl) && strDetailUrl.indexOf(' and') == 0) {
				strDetailUrl = strDetailUrl.substring(4, strDetailUrl.length);
			}

			strAdvancedFilterUrl = URLJson.batchFilter;
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
								if (isFilterApplied) {
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
						// objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
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
				$('#downloadNachaId').attr("disabled", false);
			} else {
				$('#downloadNachaId').attr("disabled", true);
				// TODO add disable styling for this and then remove below line
				$('#downloadNachaId').addClass('ui-helper-hidden');
			}
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'verify' || strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}

	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'verify') {
			titleMsg = getLabel('instrumentVerifyRemarkPopUpTitle',
					'Please enter verify remark');
			fieldLbl = getLabel('instrumentVerifyRemarkPopUpFldLbl',
					'Verify Remark');
		} else if (strAction === 'reject') {
			titleMsg = getLabel('instrumentReturnRemarkPopUpTitle',
					'Please enter return remark');
			fieldLbl = getLabel('instrumentReturnRemarkPopUpFldLbl',
					'Return Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					cls : 't7-popup',
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, grid,
									arrSelectedRecords, strActionType,
									strAction);
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
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								me.postHandleGroupAction(jsonRes, grid,
										strActionType, strAction, records);
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
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		var warnLimit = "Warning limit exceeded!"
		Ext.each(actionData, function(result) {
					intSerialNo = parseInt(result.serialNo,10);
					record = grid.getRecord(intSerialNo);
					row = grid.getRow(intSerialNo);
					msg = '';
					strIsProductCutOff = 'N';
					Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : '
										+ error.errorMessage + "</br>";
								errCode = error.code;
								if (!Ext.isEmpty(errCode)
										&& errCode.substr(0, 4) === 'WARN')
									strIsProductCutOff = 'Y';
							});
					row = grid.getRow(intSerialNo);
					me.handleVisualIndication(row, record, result,
							strIsProductCutOff, true);
					grid.deSelectRecord(record);
					row = grid.getLockedGridRow(intSerialNo);
					me.handleVisualIndication(row, record, result,
							strIsProductCutOff, false);
					arrActionMsg.push({
								success : result.success,
								actualSerailNo : result.serialNo,
								isProductCutOff : strIsProductCutOff,
								actionTaken : 'Y',
								lastActionUrl : strAction,
								reference : Ext.isEmpty(record) ? '' : record
										.get('clientReference'),
								actionMessage : result.success === 'Y'
										? strActionSuccess
										: (result.success === 'W02'
												? warnLimit
												: msg)
							});

				});
		me.hideQuickFilter();
		if (!Ext.isEmpty(arrActionMsg)) {
			getRecentActionResult(arrActionMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		groupView.setLoading(false);

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
										? 'N'
										: 'Y'
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
			arrSelectedRecords, strActionType) {
		var me = this;
		var groupView = me.getGroupView();
		var strIde = arrSelectedRecords[0].data.identifier;
		var strActionUrl = 'services/paymentheaderinfo(' + strIde + ').json?'+csrfTokenName+'=' + tokenValue;
		Ext.Ajax.request({
					url : strActionUrl,
					method : "POST",
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
								me.preHandleGroupActions(strUrl, '', grid,
										arrSelectedRecords, strActionType,
										strAction);
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
		var objFilterView = me.getFilterView();
		if (!Ext.isEmpty(objFilterView)) {
			objFilterView.hide();
			var filterButton = groupView.down('button[itemId="filterButton"]');
			filterButton.filterVisible = false;
			filterButton.removeCls('filter-icon-hover');
		}
		var strPmtType = record.get('paymentType');
		if ((strPmtType != 'QUICKPAY') && actionName === 'auth'
				&& record.get('authLevel') == 0) {
			actionName = 'btnView';
		}
		if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'verify' || actionName === 'auth'
				|| actionName === 'send' || actionName === 'reject'
				|| actionName === 'hold' || actionName === 'release'
				|| actionName === 'stop' || actionName === 'disable'
				|| actionName === 'enable') {
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri);
			}
		} else if (actionName === 'btnView' || actionName === 'btnEdit'
				|| actionName === 'btnClone'
				|| actionName === 'btnCloneTemplate') {
			if (!Ext.isEmpty(strPmtType)) {
				var strUrl = '', objFormData = {};
				if (actionName === 'btnView' && strPmtType === 'QUICKPAY')
					strUrl = 'viewTemplate.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnEdit')
					strUrl = 'editMultiTemplate.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnView')
					strUrl = 'viewMultiTemplate.form';
				else if (actionName === 'btnEdit' && strPmtType === 'QUICKPAY')
					strUrl = 'editTemplate.form';
				else if (actionName === 'btnClone' && strPmtType === 'QUICKPAY')
					strUrl = 'singlePaymentTemplateEntry.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnClone')
					strUrl = 'multiPaymentTemplateEntry.form';
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
				objFormData.viewState = record.get('identifier');

				if (actionName === 'btnView' || actionName === 'btnEdit') {
					if (!Ext.isEmpty(strUrl)) {
						me.doSubmitForm(strUrl, objFormData);
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
										me.doSubmitForm(strUrl, objFormData);
									} else if (result.success === 'N') {
										Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel('instrumentErrMsg',
													'Unable to perform action..'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.ERROR
										});

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
										cls : 't7-popup',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});

				}
			}
		}
	},
	showHistory : function(url) {
	var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url
				}).show();
	historyPopup.center();			
	},
	doSubmitForm : function(strUrl, formData) {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				'TEMPLATE'));
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
							if (me.paymentTypeFilterVal == 'all'
									&& me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else if (me.filterApplied == 'A'
									|| me.filterApplied == 'Q') {
								paymentTypeVal = me.paymentTypeFilterDesc;
							}
							tip.update(getLabel('paymentType', 'Payment Type')
									+ ' : '
									+ paymentTypeVal
									+ '<br/>'
									+ getLabel('date', 'Date')
									+ ' : '
									+ dateFilter
									+ '<br/>'
									+ getLabel('advancedFilter',
											'Advanced Filter') + ':'
									+ advfilter);
						}
					}
				});

	},
	readAllAdvancedFilterCode : function() {
		var me = this;
		var filterView = me.getReceivableSummaryFilterView();
		Ext.Ajax.request({
					url : me.strReadAllAdvancedFilterCodeUrl,
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
	},
	handlePaymentTypeClick : function(combo) {
		var me = this;
		var savedFilterCombo = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombo.setValue("");
		me.paymentTypeFilterVal = combo.getValue();
		me.paymentTypeFilterDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.paymentTypeFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#templateDataPicker');

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
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
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					datePickerRef.val('Till' + '  ' + vFromDate);
				} else {
					datePickerRef.setDateRangePickerValue(vFromDate);
				}
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
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
				$('#creationDate').setDateRangePickerValue(vFromDate);
			} else {
				$('#creationDate')
						.setDateRangePickerValue([vFromDate, vToDate]);
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
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					$('#creationDate').val('Till' + '  ' + vFromDate);
				} else {
					$('#creationDate').setDateRangePickerValue(vFromDate);
				}
			} else {
				$('#creationDate')
						.setDateRangePickerValue([vFromDate, vToDate]);
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
	handleEntryDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.creationDateFilterLabel)) {
			$('label[for="entryDateAdvFilterLabel"]').text(getLabel(
					'entryDate', 'Entry Date')
					+ " (" + me.entryDateAdvFilterLabel + ")");
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
				$('#entryDateAdvFilter').setDateRangePickerValue(vFromDate);
			} else {
				$('#entryDateAdvFilter').setDateRangePickerValue([vFromDate,
						vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDateInAdvFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					$('#entryDateAdvFilter').val('Till' + '  ' + vFromDate);
				} else {
					$('#entryDateAdvFilter').setDateRangePickerValue(vFromDate);
				}
			} else {
				$('#entryDateAdvFilter').setDateRangePickerValue([vFromDate,
						vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDateInAdvFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.getSavedFilterData(filterCode, me.populateAndDisableSavedFilter,
					true);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		me.resetAllFields();
		// me.toggleSavePrefrenceAction(true);
	},
	getPreloadsOnAdvanceFilter : function(advFilterPanel) {
		var me = this;
		var fromDateRef = '';
		var toDateRef = '';
		var fromDate = '';
		var toDate = '';
		var paymentTypeCode = me.paymentTypeFilterVal;
		if (me.dateFilterVal !== '7') {
			fromDateRef = me.getFromDateLabel();
			toDateRef = me.getToDateLabel();

			if (!Ext.isEmpty(fromDateRef) && !Ext.isEmpty(toDateRef)) {
				if (me.dateFilterVal === '1' || me.dateFilterVal === '2') {
					fromDate = fromDateRef.text;
					toDate = fromDateRef.text;
				} else {
					fromDate = fromDateRef.text;
					toDate = toDateRef.text;
				}
			}
		} else {
			fromDate = me.getFromEntryDate().getValue();
			toDate = me.getToEntryDate().getValue();
		}

		advFilterPanel.setPreloadsOnAdvanceFilter(advFilterPanel,
				me.dateFilterVal, fromDate, toDate, me.dateFilterLabel,
				paymentTypeCode);

	},

	addColumnsToSortCombos : function() {
		var me = this;
		var sortByComboRef = me.getSortByCombo();
		var columns = [];
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
	addProductCategoryRadioGroup : function() {
		var me = this;
		var productCategoryRadioGroupRef = me.getProductCategoryRadioGroup();
		if (!Ext.isEmpty(productCategoryRadioGroupRef)) {
			Ext.Ajax.request({
						url : me.strPaymentTypeUrl,
						method : 'POST',
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var data = responseData.d.instrumentType;
							me.addRadioBtnsToProductCategoryGroup(data,
									productCategoryRadioGroupRef);
						},
						failure : function() {
							// console.log("Error Occured - Addition
							// Failed");

						}
					});

		}
	},

	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(objTemplateSummaryPref)) {
			var objJsonData = Ext.decode(objTemplateSummaryPref);
			if (!Ext.isEmpty(objJsonData.d.preferences)) {
				if (!Ext.isEmpty(objJsonData.d.preferences.groupViewFilterPref)) {
					if (!Ext
							.isEmpty(objJsonData.d.preferences.groupViewFilterPref.advFilterCode)) {
						var advData = objJsonData.d.preferences.groupViewFilterPref.advFilterCode;

						if (!Ext.isEmpty(advData)) {
							me.showAdvFilterCode = advData;
							me.savePrefAdvFilterCode = advData;
							var strUrl = Ext.String.format(
									me.strGetSavedFilterUrl, advData);
							Ext.Ajax.request({
								url : strUrl,
								async : false,
								method : 'GET',
								success : function(response) {
									var responseData = Ext
											.decode(response.responseText);
									var applyAdvFilter = false;
									me.populateAndDisableSavedFilter(advData,
											responseData, applyAdvFilter);
									var objJson = getAdvancedFilterQueryJson();
									me.advFilterData = objJson;
									me.resetAllFields();
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
					}
				}
			}
		}
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
		if (!Ext.isEmpty(objTemplateSummaryPref)) {
			var objJsonData = Ext.decode(objTemplateSummaryPref);
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
				quickFilterClientDescSelected = me.clientFilterDesc;
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
					me.paymentTypeFilterVal = !Ext.isEmpty(strPaymentType)
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
							paramName : 'EntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
		}
		if (!Ext.isEmpty(me.paymentTypeFilterVal)
				&& me.paymentTypeFilterVal != 'all') {
			arrJsn.push({
						paramName : 'InstrumentType',
						paramValue1 : me.paymentTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'Client',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		me.filterData = arrJsn;
	},
	creationDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	entryDateInAdvFilterChange : function(btn, opts) {
		var me = this;
		me.entryDateAdvFilterVal = btn.btnValue;
		me.entryDateAdvFilterLabel = btn.text;
		me.handleEntryDateInAdvFilterChange(btn.btnValue);
		me.advFilterEntryDateSelected = {
			btnValue : me.entryDateAdvFilterVal,
			text : me.entryDateAdvFilterLabel
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
				/*
				 * var frmDate, toDate; if (!Ext.isEmpty(dateType)) { var
				 * objCreateNewFilterPanel = me.getCreateNewFilter(); if
				 * (dateType == "process") { frmDate = objCreateNewFilterPanel
				 * .down('datefield[itemId=processFromDate]') .getValue();
				 * toDate = objCreateNewFilterPanel
				 * .down('datefield[itemId=processToDate]') .getValue(); } else
				 * if (dateType == "effective") { frmDate =
				 * objCreateNewFilterPanel
				 * .down('datefield[itemId=effectiveFromDate]') .getValue();
				 * toDate = objCreateNewFilterPanel
				 * .down('datefield[itemId=effectiveToDate]') .getValue(); }
				 * else if (dateType == "creation") { frmDate =
				 * objCreateNewFilterPanel
				 * .down('datefield[itemId=creationFromDate]') .getValue();
				 * toDate = objCreateNewFilterPanel
				 * .down('datefield[itemId=creationToDate]') .getValue(); } }
				 * else { frmDate = me.getFromEntryDate().getValue(); toDate =
				 * me.getToEntryDate().getValue(); } frmDate = frmDate || date;
				 * toDate = toDate || frmDate;
				 * 
				 * fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				 * fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				 * operator = 'bt';
				 */
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
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'le';
				break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length >= 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							'Y-m-d');
					fieldValue2 = fieldValue1;
					operator = 'eq';
					if (me.datePickerSelectedDate.length == 2) {
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedDate[1], 'Y-m-d');
						operator = 'bt';
					}
				}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
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
					firstThenSortByComboRef.getStore()
							.loadData(filteredRecords);
				}
				if (!Ext.isEmpty(secondThenSortByComboRef)) {
					secondThenSortByComboRef.reset();
					secondThenSortByComboRef.getStore()
							.loadData(filteredRecords);
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
					secondThenSortByComboRef.getStore()
							.loadData(filteredRecords);
				}
			}
		} else {
			secondThenSortByComboRef.reset();
			secondThenSortByComboRef.setDisabled(true);
		}
	},
	/*
	 * toggleSavePrefrenceAction : function(isVisible) { var me = this; var
	 * btnPref = me.getBtnSavePreferences(); if (!Ext.isEmpty(btnPref))
	 * btnPref.setDisabled(!isVisible); // TODO : To be handled var
	 * arrStdViewPref = {};
	 * 
	 * var objMainNode = {}; var objpreferences = {}; objpreferences.preferences =
	 * arrStdViewPref; objMainNode.d = objpreferences; },
	 * toggleClearPrefrenceAction : function(isVisible) { var me = this; var
	 * btnPref = me.getBtnClearPreferences(); if (!Ext.isEmpty(btnPref))
	 * btnPref.setDisabled(!isVisible); },
	 */
	resetAdvancedFilterFieldOnSellerChange : function(combo, record) {
		var me = this;
		var strUrl = Ext.String.format('services/swseller/{0}.json', combo
						.getValue());

		Ext.Ajax.request({
					url : strUrl,
					method : "GET",
					success : function(response) {
						me.addClientMenuItems();
						me.addMyProductsMenuItems();
						me.addStatusMenuItems();
						me.addSendingAccountsMenuItems();
						me.addProductCategoryRadioGroup();
						// me.addCompanyIdMenuItems();
					},
					failure : function(response) {
						// console.log('Error Occured');
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
			FiterArray.push(preferenceArray[i]);
		}

		objJson.filters = FiterArray;
		Ext.Ajax.request({
					url : me.strAdvFilterUrl,
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
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);
		me.filterCodeValue = null;

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
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
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

		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);

	},
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {
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
				$("input[type='text'][id='paymentReference']").val(fieldVal);
			} else if (fieldName === 'TemplateName') {
				$("input[type='text'][id='templateName']").val(fieldVal);
			} else if (fieldName === 'Maker') {
				$("input[type='text'][id='entryUser']").val(fieldVal);
			} else if (fieldName === 'Channel') {
				$("input[type='text'][id='channel']").val(fieldVal);
			} else if (fieldName === 'FileName') {
				$("input[type='text'][id='fileName']").val(fieldVal);
			} else if (fieldName === 'Amount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'RecieverName') {
				$("input[type='text'][id='receiverName']").val(fieldVal);
			} else if (fieldName === 'ReceiverId') {
				$("input[type='text'][id='receiverId']").val(fieldVal);
			} else if (fieldName === 'MicrNo') {
				$("input[type='text'][id='checkNo']").val(fieldVal);
			}

			if (fieldName === 'CreateDate' || fieldName === 'EntryDate'
					|| fieldName === 'ActivationDate') {
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
			} else if (fieldName === 'CreditDebitFlag'
					|| fieldName === 'CrossCurrency' || fieldName === 'Prenote'
					|| fieldName === 'Confidential') {
				me.setRadioGroupValues(fieldName, fieldVal);
			} else if (fieldName === 'InstrumentType'
					|| fieldName === 'ProductType' || fieldName === 'AccountNo'
					|| fieldName === 'ActionStatus'
					|| fieldName === 'CompanyId' || fieldName === 'Client') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
		}
		var paymentTypeChangedValue = $("#msProductCategory")
				.getMultiSelectValue();
		if (!Ext.isEmpty(paymentTypeChangedValue)) {
			var objField = me.getFilterView()
					&& me.getFilterView()
							.down('combo[itemId="paymentTypeCombo"]')
					? me.getFilterView()
							.down('combo[itemId="paymentTypeCombo"]')
					: null;
			if (paymentTypeChangedValue !="" && paymentTypeChangedValue.length == 1) {
				me.paymentTypeFilterVal = paymentTypeChangedValue;
				if (objField)
					objField.setValue(me.paymentTypeFilterVal);
			} else if (paymentTypeChangedValue.length > 1) {
				me.paymentTypeFilterVal = 'all';
				if (objField)
					objField.setValue(me.paymentTypeFilterVal);
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
		}
		if (applyAdvFilter) {
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter();
		}
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objJson;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					async : false,
					success : function(response) {
						if (!Ext.isEmpty(response)) {
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

	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;

			if (dateType === 'CreateDate') {
				dateFilterRef = $('#creationDate');
			} else if (dateType === 'EntryDate') {
				dateFilterRef = $('#entryDateAdvFilter');
			}

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
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
						$(dateFilterRef).setDateRangePickerValue([
								formattedFromDate, formattedToDate]);
					}
				}
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

			if (fieldName === 'CreditDebitFlag') {
				radioGroupRef = $("input[type='radio'][name='CreditDebitFlag']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='CreditDebitFlag'][value="
								+ fieldVal + "]").prop('checked', true);
					}
				}
			}

			if (fieldName === 'Prenote') {
				radioGroupRef = $("input[type='radio'][name='prenotes']");
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						$("input[type='radio'][name='prenotes'][value="
								+ fieldVal + "]").prop('checked', true);
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
	setSortByComboFields : function(fieldName, columnId, buttonText,
			disableFlag) {
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
					}
				}

			} else if (fieldName === 'FirstThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy2AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)) {
						sortBy1ComboSelected();
						thenSortByButtonRef.text(buttonText);
					}
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var firstThenSortByCombo = $("#msSortBy2");
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.val(columnId);
					}
				}

			} else if (fieldName === 'SecondThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy3AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)) {
						sortBy2ComboSelected();
						thenSortByButtonRef.text(buttonText);
					}
				}

				// Second Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var secondThenSortByComboRef = $("#msSortBy3");
					if (!Ext.isEmpty(secondThenSortByComboRef)) {
						secondThenSortByComboRef.val(columnId);
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
			if (componentName === 'InstrumentType') {
				me.paymentTypeFilterVal =dataArray;
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
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {

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
						amountFieldRefTo.val(amountToFieldValue);
					}
				}
			}
		}
	},
	setDataForFilter : function() {
		var me = this;
		var arrQuickJson = {};
		if (me.filterApplied === 'Q') {
			me.filterData = me.getQuickFilterQueryJson();
			me.advFilterData = {};
		} else if (me.filterApplied === 'A') {
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();
			var reqJson = me.findInAdvFilterData(objJson, "Client");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me
						.removeFromQuickArrJson(arrQuickJson, "Client");
				me.filterData = arrQuickJson;
			}
			var reqJson = me.findInAdvFilterData(objJson, "EntryDate");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"EntryDate");
				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "InstrumentType");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"InstrumentType");
				me.filterData = arrQuickJson;
			}
			me.advFilterData = objJson;
			var sortByData = getAdvancedFilterSortByJson();
			if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
				me.advSortByData = sortByData;
			} else {
				this.advSortByData = [];
			}

			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			me.advFilterCodeApplied = filterCode;
		}
		if (me.filterApplied === 'ALL') {
			me.filterData = me.getQuickFilterQueryJson();
		}
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
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		jsonArray.push({
					paramName : 'EntryDate',
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D'
				});
		if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'all'
			&& paymentTypeFilterVal != 'All' && paymentTypeFilterVal.length >= 1) {
			paymentTypeFilterValArray = paymentTypeFilterVal.toString();
			jsonArray.push({
						paramName : getLabel('instrumentType', 'InstrumentType'),
						paramValue1 : paymentTypeFilterValArray,
						operatorValue : 'in',
						dataType : 'S'
					});
		}
		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return jsonArray;
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		if (groupInfo && groupInfo.groupTypeCode === 'TEMPSUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	handleSearchAction : function(btn) {
		var me = this;
		me.doSearchOnly();
	},
	doSearchOnly : function() {
		var me = this;
		if (selectedClient != null) {
			var clientComboBox = me.getFilterView()
					.down('combo[itemId="quickFilterClientCombo"]');
			clientComboBox.setValue(strClient);
		}
		if (!jQuery.isEmptyObject(me.advFilterEntryDateSelected)) {
			if (!jQuery
					.isEmptyObject(me.advFilterEntryDateSelected.selectedDate)) {
				me.datePickerSelectedDate = me.advFilterEntryDateSelected.selectedDate;
			}
			me.dateFilterVal = me.advFilterEntryDateSelected.btnValue;
			me.dateFilterLabel = me.advFilterEntryDateSelected.text;
			me.handleDateChange(me.dateFilterVal);
			me.setDataForFilter();
		}
		var paymentTypeChangedValue = $("#msProductCategory")
				.getMultiSelectValue();
		if (!Ext.isEmpty(paymentTypeChangedValue)) {
			var objField = me.getFilterView()
					&& me.getFilterView()
							.down('combo[itemId="paymentTypeCombo"]')
					? me.getFilterView()
							.down('combo[itemId="paymentTypeCombo"]')
					: null;
			if (paymentTypeChangedValue.length == 1) {
				me.paymentTypeFilterVal = paymentTypeChangedValue;
				if (objField)
					objField.setValue(me.paymentTypeFilterVal);
			} else if (paymentTypeChangedValue.length > 1) {
				me.paymentTypeFilterVal = 'all';
				if (objField)
					objField.setValue(me.paymentTypeFilterVal);
			}
		}
		me.applyAdvancedFilter();
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='checkbox'][id='multiPayCheckBox']")
				.prop('checked', true);
		$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
				true);
		$("input[type='radio'][id='msCrossCurrencyAll']").prop('checked', true);
		$("input[type='radio'][id='msCreditDebitFlagAll']").prop('checked',
				true);
		$("input[type='radio'][id='msPrenotesAll']").prop('checked', true);
		$("input[type='radio'][id='msConfidentialAll']").prop('checked', true);
		resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		resetAllMenuItemsInMultiSelect("#msProducts");
		resetAllMenuItemsInMultiSelect("#msStatus");
		resetAllMenuItemsInMultiSelect("#msProductCategory");
		resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		$("input[type='text'][id='entryUser']").val("");
		$("input[type='text'][id='receiverId']").val("");
		$("input[type='text'][id='templateName']").val("");
		$("input[type='text'][id='paymentReference']").val("");
		$("input[type='text'][id='receiverId']").val("");
		$("input[type='text'][id='receiverName']").val("");
		$("#filterOrderingPartyAutocomplete").val("");
		$("#amountFieldFrom").val("");
		$("#amountFieldTo").val("");
		$("#msSortBy1").val("");
		$("#msSortBy2").val("");
		$("#msSortBy3").val("");
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
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("input[type='text'][id='amountEqualTo']").val("");
		$("input[type='text'][id='checkNo']").val("");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		selectedCreationDate = {};
		selectedEntryDateInAdvFilter = {};
		advFilterEndDateSelected = '';
		$('label[for="endDateLabel"]').text(getLabel('endDate', 'End Date'));
		$('label[for="entryDateAdvFilterLabel"]').text(getLabel('entryDate',
				'Entry Date'));
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
				'Creation Date'));
		$("#creationDate").val("");
		$('#entryDateAdvFilter').val("");
	},
	handleSaveAndSearchAction : function() {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
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
	postDoSaveAndSearch : function() {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		me.doSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	applyAdvancedFilter : function() {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		// me.resetAllFields();
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
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
							$('#advancedSettingPopup2').dialog('close');
							fncallBack.call(me);
							filterGrid.getStore().reload();
							me.updateSavedFilterComboInQuickFilter();
							// me.reloadGridRawData();
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
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5)
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
	/*
	 * refreshGroupViewData : function(e) { this.refreshData(); },
	 */
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
		$('#templateDataPicker').removeAttr('disabled', 'disabled');
		me.disablePreferencesButton("savePrefMenuBtn", false);
	},
	hideQuickFilter : function() {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView())) {
			me.getFilterView().hide();
			me.getFilterButton().filterVisible = false;
			me.getFilterButton().removeCls('filter-icon-hover');
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
		if (!Ext.isEmpty(objTabPanel))
			clientContainer = objTabPanel.getTabBar()
					.down('container[itemId=clientContainer]');
		if (!Ext.isEmpty(objTabPanel))
			clientContainer.setVisible(false);
		filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
	},
	/*----------------------------Summary Ribbon Handling Ends----------------------------*/

	/*----------------------------Preferences Handling Starts----------------------------*/
	handleSavePreferences : function() {
		var me = this;
		me.doSavePreferences();
	},
	handleClearPreferences : function() {
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
								/*
								 * if (!Ext.isEmpty(me.getBtnSavePreferences()))
								 * me.toggleSavePrefrenceAction(true);
								 */
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											cls : 't7-popup',
											buttons : Ext.MessageBox.OK,
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
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
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
				if (groupInfo.groupTypeCode !== 'TEMPSUM_OPT_ADVFILTER'
						|| (groupInfo.groupTypeCode == 'TEMPSUM_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
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

		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var quickPref = {};
		quickPref.paymentType = me.paymentTypeFilterVal;
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
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
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
							serialNo : objOfGridSelected.getStore()
									.indexOf(objOfSelectedGridRecord[0])
									+ 1,
							identifier : objOfSelectedGridRecord[0].data.identifier,
							userMessage : ' '
						});

				if (!Ext.isEmpty(arrJson)) {
					$.download('services/paymentsbatch/nachadownload', arrJson);
					$('#downloadNachaId').addClass('ui-helper-hidden');
				}
			}
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

			strExtension = arrExtension[actionName];
			strUrl = 'services/templatesbatch.' + strExtension;
			strUrl += '?$skip=1';
			var objGroupView = me.getGroupView();
			var groupInfo = objGroupView.getGroupInfo();
			var subGroupInfo = objGroupView.getSubGroupInfo();
			strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
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
			if (arrAvailableBatchColumn) {
				if (arrAvailableBatchColumn.length > 0)
					strSelect = '&$select=['
							+ arrAvailableBatchColumn.toString() + ']';
			}
			var viscols;
			var visColsStr = "";
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
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
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
		}
	}
		/*-------------------- Download handling End ------------------- */
});