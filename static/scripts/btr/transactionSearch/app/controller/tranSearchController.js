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
	requires : ['Ext.ux.gcp.DateUtil','Ext.ux.gcp.PreferencesHandler','GCP.view.tranSearchSummaryView','GCP.view.tranSearchTiltleView',
	            'GCP.view.tranSearchFilterView','GCP.view.tranSearchAdvFilterPopUp'],
	refs : [{
				ref : 'tranSearchSummaryView',
				selector : 'tranSearchSummaryView'
			}, {
				ref : 'filterView',
				selector : 'tranSearchSummaryView tranSearchFilterView'
			}, {
				ref : 'btnAllCats',
				selector : 'tranSearchSummaryView tranSearchFilterView button[itemId="allCat"]'
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
				selector : 'tranSearchFilterView label[itemId="dateLabel"]'
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
				selector : 'tranSearchSummaryView tranSearchFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'tranSearchSummaryView tranSearchFilterView button[itemId="btnClearPreferences"]'
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
			},/* {
				ref : 'filterDetailsTab',
				selector : 'activityAdvFilterPopUp[itemId="activityAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			},*/ {
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
				selector : 'tranSearchSummaryView tranSearchFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'groupView',
				selector : 'tranSearchSummaryView groupView'
			},{
				ref : 'transactionCategoryTabPanel',
				selector : 'tranCategoryPopUpView tabpanel[itemId="transactionCategoryTabPanel"]'
			}],
	config : {
		txnFilterName : 'all',
		txnFilter : 'all',
		dateFilterVal : '12',
		dateFilterLabel : 'Latest',
		valueDateFilterVal : '1',
		valueDateFilterLabel : 'Latest',
		dateHandler : null,
		deletedCat : null,
		preferenceHandler : null,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		accountFilter : '(ALL)',
		filterData : [],
		typeCodePopup : null,
		identifier : null,
		isFirstRequest : true,
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
		advSortByData : [],
		filterApplied : 'ALL',
		advFilterCodeApplied : '',
		SearchOrSave : false,
		savePrefAdvFilterCode : null,

		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,

		accountCalDate : null,
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
		strActivityType : null
	},
	init : function() {
		var me = this;
		me.updateConfig();
		me.createPopUps();
		if(!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		if(Ext.isEmpty(widgetFilterUrl)){		
			me.updateFilterConfig();
			me.updateAdvFilterConfig();
		}
		else {
			me.setWidgetFilters();
		}
		me.strServiceType = mapService['BR_TXN_SRC_GRID'];
		me.control({
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
					me.doHandleRowActionClick(grid, rowIndex, columnIndex,
							actionName, record);
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
				}

			},
			'tranSearchSummaryView tranSearchFilterView' : {
				'render' : function(panel) {
					me.handleTransactionCategoryLoading();
					var filterView = me.getFilterView();
					filterView.handleInfoToolTip();
					me.readAllAdvancedFilterCode();
				},
				'handleTransactionCategoryFilterClick' : function(btn) {
					me.doHandleTransactionCategoryFilterClick(btn);
				},
				'afterrender' : function(panel, opts) {
					//me.handleDateChange(me.dateFilterVal);
					me.updateDateFilterView();
					panel.highlightSavedFilter(me.savePrefAdvFilterCode);
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
						me.toggleSavePrefrenceAction(true);
					}
				},
				'dateRangeChange' : function(btn) {
					me.toggleFirstRequest(false);
					var dtParams = me.getDateParam('7');
					me.dateFilterFromVal = dtParams.fieldValue1;
					me.dateFilterToVal = dtParams.fieldValue2;
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
				'handleSavedFilterItemClick' : function(strFilterCode, btn) {
					me.resetQuickFilterView();
					me.doHandleSavedFilterItemClick(strFilterCode);
				},
				'createNewFilterClick' : function(btn, opts) {
					me.doHandleCreateNewFilterClick(btn, opts);
				},
				'moreAdvancedFilterClick' : function(btn) {
					me.handleMoreAdvFilterSet(btn.itemId);
				}
			},
			'tranCategoryPopUpView[itemId="transactionCategoryPopUpView"] tranCategoryGridView[itemId="transactionCategoryGridView"]' : {
				'deleteTransactionCategory' : function(grid, rowIndex) {
					me.doDeleteTransactionCategory(grid, rowIndex);
				},
				'transactionCategoryOrderChange' : function(grid, rowIndex,
						intPosition, strDirection) {
					me.doTransactionCategoryOrderChange(grid,rowIndex,intPosition);
				},
				'viewTransactionCategory' : function(grid,rowIndex){
					me.doHandleViewTransactionCategory(grid,rowIndex);
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
				/*filterAmountRange : function(cmp, newVal) {
					me.handleAmountChange(cmp.fieldIndex);
				},*/
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
			}
		});
	},
	setWidgetFilters : function() {
		var me = this;				
		me.txnFilter = 'all';
		me.txnFilterName = 'all';
		for (var i = 0; i < arrFilterJson.length; i++) {
			if (arrFilterJson[i].field === 'postingDate') {
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
			if (arrFilterJson[i].field === 'typecodeset'){
				me.txnFilterName = arrFilterJson[i].value2;
				me.txnFilter = arrFilterJson[i].value1;
			}
		}
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
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateAdvActionToolbar();
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
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			// me.refreshData();
			me.closeFilterPopup();
		}

		var store = grid.getStore();
		me.sendUpdatedOrderJsonToDb(store);
		me.deleteFilterCodeFromDb(objFilterName);
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
		switch (btn.btnId) {
			case 'btnLtEqTo' :
				// Less Than Equal To
				operator = 'lteqto';
				break;
			case 'btnGtEqTo' :
				// Greater Than Equal To
				operator = 'gteqto';
				break;
			case 'btnEqTo' :
				// Equal To
				operator = 'eq';
				break;
			case 'btnAmtRange' :
				// AmountRange
				operator = 'bt';
				break;
		}
		me.handleAmountChange(btn.btnValue);
		if (!Ext.isEmpty(me.getAmountTypeBtn())) {
			me.getAmountTypeBtn().amtOperator = operator;
		}

		var menuItems = me.getAmountMenu();
		var itemMenu = menuItems.down("[btnValue=" + operator + "]")
		if (!Ext.isEmpty(itemMenu)) {
			var textVal = itemMenu.text;
			me.getAmountLabel().setText(getLabel('amount', 'Amount') + "("
					+ textVal + ")");
		}
	},
	handleSearchAction : function(btn) {
		var me = this;
		me.doSearchOnly();
	},
	doSearchOnly : function() {
		var me = this;
		if (!Ext.isEmpty(me.ribbonDateLbl))
			me.getDateLabel().setText(me.ribbonDateLbl);

		if (me.dateFilterVal !== '7') {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();

			if (!Ext.isEmpty(me.ribbonFromDate))
				me.getFromDateLabel().setText(me.ribbonFromDate);
			if (!Ext.isEmpty(me.ribbonToDate))
				me.getToDateLabel().setText(me.ribbonToDate);
			else {
				me.getToDateLabel().setText('');
			}
		} else {
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
			me.getFromEntryDate().setValue(me.ribbonFromDate);
			me.getToEntryDate().setValue(me.ribbonToDate);
		}
		me.applyAdvancedFilter();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var errorlabel = objCreateNewFilterPanel
				.down('label[itemId="errorLabel"]');
		if (me.filterCodeValue === null) {
			var FilterCode = objCreateNewFilterPanel
					.down('textfield[itemId="filterCode"]');
			if (Ext.isEmpty(FilterCode)) {
				Ext.MessageBox.alert('Input', 'Enter Filter Name');
				return;
			}
			var FilterCodeVal = FilterCode.getValue();
		} else {
			var FilterCodeVal = me.filterCodeValue;
		}

		if (Ext.isEmpty(FilterCodeVal)) {
			errorlabel.setText(getLabel('filternameMsg',
					'Please Enter Filter Name'));
			errorlabel.show();
		} else {
			errorlabel.hide();
			me.postSaveFilterRequest(FilterCodeVal, callBack);
		}
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
		var objOfCreateNewFilter = me.getCreateNewFilter();
		objJson = objOfCreateNewFilter.getAdvancedFilterJsonForFiltersSave(
				FilterCodeVal, objOfCreateNewFilter);
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
							fncallBack.call(me);
							me.reloadGridRawData();
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
					"colDesc" : "Posting Date"
				}, {
					"colId" : "valueDate",
					"colDesc" : "Value Date"
				}, {
					"colId" : "amount",
					"colDesc" : "Amount"
				}, {
					"colId" : "typeCode",
					"colDesc" : "Type Code"
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
		me.getAdvanceFilterPopup().close();
	},
	postingDateChange : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handlePostingDateChange(btn.btnValue);
	},
	valueDateChange : function(btn, opts) {
		var me = this;
		me.valueDateFilterVal = btn.btnValue;
		me.valueDateFilterLabel = btn.text;
		me.handleValueDateChange(btn.btnValue);
	},
	handleAmountChange : function(index) {
		var me = this;
		me.getAmountTypeBtn().amtIndex = index;
		var fromAmountLabel = me.getAmountFromLabel();
		var toAmountLabel = me.getAmountToLabel();
		if (index == 'bt') {
			// me.getAmountFromLabel().hide();
			// me.getAmountToLabel().hide();
			me.getAmountNoField().hide();
			me.getAmountRange().show();
		} else {
			me.getAmountRange().hide();
			me.getAmountNoField().show();
			// me.getPostingDateRange().hide();
			// me.getAmountFromLabel().show();
			// me.getAmountToLabel().show();
		}
	},
	handlePostingDateChange : function(index) {
		var me = this;
		me.getPostingDateBtn().dateIndex = index;
		var fromDateLabel = me.getPostingFromDateLabel();
		var toDateLabel = me.getPostingToDateLabel();
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var objDateParams = objCreateNewFilterPanel.getDateParam(
				objCreateNewFilterPanel, index, 'posting', me.dateHandler);

		if (index == '7') {
			me.getPostingFromDateLabel().hide();
			me.getPostingToDateLabel().hide();
			me.getPostingDateRange().show();
		} else {
			me.getPostingDateRange().hide();
			me.getPostingFromDateLabel().show();
			me.getPostingToDateLabel().show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getPostingDateLbl().setText(getLabel('postingDate',
					'Posting Date')
					+ " (" + me.dateFilterLabel + ")");
			me.ribbonDateLbl = getLabel('date', 'Date') + " ("
					+ me.dateFilterLabel + ")";
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);

		if (index !== '7') {
			if (index === '0') {
				fromDateLabel.setText("");
				toDateLabel.setText("");

				me.ribbonFromDate = null;
				me.ribbonToDate = null;
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);

				me.ribbonFromDate = vFromDate + " - ";
				me.ribbonToDate = vToDate;
			}
		} else if (index === '7') {
			me.ribbonFromDate = vFromDate;
			me.ribbonToDate = vToDate;
		}
	},
	handleValueDateChange : function(index) {
		var me = this;
		me.getValueDateBtn().dateIndex = index;
		var fromDateLabel = me.getValueFromDateLabel();
		var toDateLabel = me.getValueToDateLabel();
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var objDateParams = objCreateNewFilterPanel.getDateParam(
				objCreateNewFilterPanel, index, 'value', me.dateHandler);

		if (index == '7') {
			me.getValueFromDateLabel().hide();
			me.getValueToDateLabel().hide();
			me.getValueDateRange().show();
		} else {
			me.getValueDateRange().hide();
			me.getValueFromDateLabel().show();
			me.getValueToDateLabel().show();
		}

		if (!Ext.isEmpty(me.valueDateFilterLabel)) {
			me.getValueDateLbl().setText(getLabel('valueDate', 'Value Date')
					+ " (" + me.valueDateFilterLabel + ")");
		}
		if (index !== '7') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '0') {
				fromDateLabel.setText("");
				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
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
	handleDateChange : function(index) {
		var me = this;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index);
		var fromDate = null, toDate = null, strFromDate = null, strToDate = null, strFormat = strExtApplicationDateFormat;

		me.dateFilterFromVal = objDateParams.fieldValue1;
		fromDate = objDateParams.fieldValue1;
		me.dateFilterToVal = objDateParams.fieldValue2;
		toDate = objDateParams.fieldValue2;

		if ('7' === index || '13' === index) {
			if (me.summaryISODate) {
				fromDate = new Date(Ext.Date.parse(me.summaryISODate, 'Y-m-d'));
				toDate = fromDate;
				me.summaryISODate = null;
				me.dateFilterFromVal = fromDate;
				me.dateFilterToVal = toDate;
			}
			toDateLabel.hide();
			fromDateLabel.hide();
			if('13' === index)
				me.dateFilterLabel = getLabel('latestLogin', 'Latest since last login');
			else 
				me.dateFilterLabel = getLabel('daterange', 'Date Range');
			me.getDateRangeComponent().show();
		} else if('latestlastLogin' === index){
			toDateLabel.hide();
			fromDateLabel.hide();
			me.getDateRangeComponent().show();
		} 
		else {
			strFromDate = Ext.util.Format.date(Ext.Date
							.parse(fromDate, 'Y-m-d'), strFormat);
			strToDate = Ext.util.Format.date(Ext.Date.parse(toDate, 'Y-m-d'),
					strFormat);
			if (index === '1' || index === '2') {
				fromDateLabel.setText(strFromDate);
				toDateLabel.setText("");
			} else if (index === '12') {
				fromDateLabel.setText(getLabel("latest", "Latest"));
				toDateLabel.setText('');
			} else {
				fromDateLabel.setText(strFromDate + " - ");
				toDateLabel.setText(strToDate);
			}
			me.getDateRangeComponent().hide();
			fromDateLabel.show();
			toDateLabel.show();
		}
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('date', 'Date') + " ("
					+ me.dateFilterLabel + ")");
		}
		if (!Ext.isEmpty(me.getFromEntryDate())) {
			me.getFromEntryDate().setMaxValue(fromDate);
			me.getFromEntryDate().setValue(fromDate);
			me.getFromEntryDate().setMinValue(clientFromDate);
		}
		if (!Ext.isEmpty(me.getToEntryDate())) {
			//me.getToEntryDate().setMaxValue(toDate);
			me.getToEntryDate().setValue(toDate);
			// me.getToEntryDate().setMinValue(clientFromDate);
		}
	},
	/*handleSummaryTypeChange : function(summaryType) {
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
	},*/
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
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		if (!Ext.isEmpty(me.accountCalDate) && index === '2') {
			dtFormat = 'Y-m-d';
			strAppDate = me.accountCalDate;
		}
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
				fieldValue2 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
			case '13':
				// Date Range or Latest since last login
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				frmDate = !Ext.isEmpty(frmDate)
						? frmDate
						: me.dateFilterFromVal;
				toDate = !Ext.isEmpty(toDate) ? toDate : me.dateFilterToVal;
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
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
		// comparing with client filter condition

		if (!me.isFirstRequest
				&& Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
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
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						me.postHandleTransactionCategoryLoading, null, me, true);
	},
	postHandleTransactionCategoryLoading : function(data, args, isSuccess) {
		var me = this;
		var filterView = me.getFilterView();
		var arrData = (data && data.preference)
				? JSON.parse(data.preference)
				: null;
		if (filterView)
			filterView.addTransactionCategories(arrData, me.txnFilterName);
	},
	doHandleTransactionCategoryFilterClick : function(btn) {
		var me = this;
		me.txnFilter = btn.typeCodeArray;
		me.txnFilterName = btn.btnId;
		me.filterApplied = 'Q';
		me.toggleSavePrefrenceAction(true);
		me.identifier = null;
		me.isHistoryFlag = null;
		me.applyQuickFilter();
	},
	doDeleteTransactionCategory : function(grid, rowIndex) {
		var me = this;
		var store = grid.getStore();
		var preferenceArray = [];
		var args = {
			'grid' : grid
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
						me.mapUrlDetails['strPrefferdTransactionCategories'].pageName,
						me.mapUrlDetails['strPrefferdTransactionCategories'].moduleName,
						preferenceArray,
						me.postHandleDoDeleteTransactionCategory, args, me,
						true);
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
			filterView.addTransactionCategories(args['data'], me.txnFilterName);
			filterView.refreshTransactionCategories();
		}
		if (objGroupView)
			objGroupView.refreshData();
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
		var store = grid.getStore();
		var preferenceArray = [];
		var isRecordAdded = false;
		var args = {
			'grid' : grid
		};
		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						if (record.txnCategory === rec.raw.txnCategory) {
							isRecordAdded = true;
							preferenceArray.push(record);
						} else
							preferenceArray.push(rec.raw);
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
						me.postHandleTransactionCategoryChange, args, me, true);
	},
	doHandleViewTransactionCategory : function(grid,rowIndex) {
		var me = this;
		var tabPanel = me.getTransactionCategoryTabPanel();
		var record = grid.getStore().getAt(rowIndex);
		var tab = null,entryView = null;
		if (tabPanel) {
			tab = tabPanel.items.getAt(1);
			tab.mode = 'VIEW';
			entryView = tabPanel.down('panel[itemId="transactionCategoryEntryView"]');
			entryView.setTransactionCategoryFormFields(record);
			tabPanel.setActiveTab(1);
		}
	},
	/* -----------Transaction Category Pop Up handling ends here---------- */
	
	setDataForFilter : function() {
		var me = this;
		if (me.filterApplied === 'Q' || me.filterApplied === 'ALL') {
			me.filterData = me.getQuickFilterQueryJson();
		} else if (me.filterApplied === 'A') {
			var objOfCreateNewFilter = me.getCreateNewFilter();
			var objJson = objOfCreateNewFilter
					.getAdvancedFilterValueJsonForSearch(objOfCreateNewFilter);
			me.advFilterData = objJson;
			var filterCode = objOfCreateNewFilter
					.down('textfield[itemId="filterCode"]').getValue();
			me.advFilterCodeApplied = filterCode;
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		// For Intraday activity, date filter should not applied
		// if (me.dateFilterVal != 1)
		jsonArray.push({
					paramName : me.getPostingDate().filterParamName,
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D'
				});
		if (me.txnFilter != null && me.txnFilter != 'all') {
			jsonArray.push({
						paramName : 'typeCode',
						paramValue1 : me.txnFilter,
						operatorValue : 'in',
						dataType : 'A'
					});
		}
		if (me.accountFilter != null && me.accountFilter != '') {
			jsonArray.push({
						paramName : 'accountId',
						paramValue1 : me.accountFilter,
						operatorValue : 'eq',
						dataType : 'S'
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
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				var fieldName = filterData[index].field;
				if(fieldName === 'Account')
					me.accountFilter = filterData[index].value1;
				else if(fieldName === 'AccountSet')
					me.accountFilter = filterData[index].value1;
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
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ objValue + '\'';
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
					if (isFilterApplied) {
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
				case 'gteqto' :
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
				
				case 'lteqto' :
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
		// console.log(strFilter);
		return strFilter;
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		
		if (me.getFilterView())
			me.getFilterView().removeHighlight();
		
		var objGroupView = me.getGroupView();
		objGroupView.refreshData();
	},
	applyAdvancedFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter();
		objGroupView.refreshData();
		me.handleAdvanceFilterCleanUp();
		me.closeFilterPopup();
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
		if (Ext.isEmpty(me.objAdvFilterPopup)) {
			// TODO : To be handled
			me.createAdvanceFilterPopup();
		}
		if (!Ext.isEmpty(filterCode)) {
			me.SearchOrSave = true;
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
			var objOfCreateNewFilter = me.getCreateNewFilter();
		}
		me.savePrefAdvFilterCode = filterCode;
		me.toggleSavePrefrenceAction(true);
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();

		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, true);
		objCreateNewFilterPanel.resetErrors(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel, true);
		
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var objTabPanel = me.getAdvanceFilterTabPanel();
		var applyAdvFilter = false;
		// var filterView = me.getPaymentSummaryFilterView();
		// if (filterView)
		// filterView.highlightSavedFilter(filterCode);

		me.getSaveSearchBtn().hide();
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter, 'VIEW');
		objTabPanel.setActiveTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.filterMode = 'EDIT';
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}

		objCreateNewFilterPanel.resetErrors(objCreateNewFilterPanel);
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		var objTabPanel = me.getAdvanceFilterTabPanel();
		var applyAdvFilter = false;
		me.getSaveSearchBtn().show();

		me.filterCodeValue = filterCode;
		me.getSavedFilterData(filterCode, me.populateSavedFilter,
				applyAdvFilter, 'EDIT');
		objTabPanel.setActiveTab(1);

	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter, mode) {
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
		var objSellerAutoComp = null;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setValue(filterCode);

		if (mode == 'EDIT') {
			objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
					.setDisabled(true);
		}

		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if(fieldName === 'Account' || fieldName === 'AccountSet'){
				objCreateNewFilterPanel.setRadioGroupValues(objCreateNewFilterPanel, fieldName, fieldVal);
				objCreateNewFilterPanel.setAutoCompleterValues(objCreateNewFilterPanel, fieldName, fieldVal,fieldSecondVal);
				
			}else if (fieldName === 'sortByCombo' || fieldName === 'firstThenSortByCombo'
					|| fieldName === 'secondThenSortByCombo') {
				fieldType = 'combo';
				objCreateNewFilterPanel
						.setValueComboTextFields(objCreateNewFilterPanel,
								fieldName, fieldType, fieldVal);
			}else if (fieldName === 'typeCode' || fieldName === 'bankReference'
					|| fieldName === 'customerReference'
					|| fieldName === 'noteText') {
				fieldType = 'textfield';
				objCreateNewFilterPanel
						.setValueComboTextFields(objCreateNewFilterPanel,
								fieldName, fieldType, fieldVal);
			} else if (fieldName === 'actionStatus'
					|| fieldName === 'txnStatus') {
				fieldType = 'combo';
				objCreateNewFilterPanel
						.setValueComboTextFields(objCreateNewFilterPanel,
								fieldName, fieldType, fieldVal);
			} else if (fieldName === 'amount') {
				if(fieldVal < 0)
					fieldVal = fieldVal * (-1);
				if(fieldSecondVal < 0)
					fieldSecondVal = fieldSecondVal * (-1);
				objCreateNewFilterPanel.setAmounts(objCreateNewFilterPanel,
						operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'postingDate' || fieldName === 'valueDate') {
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
			} else if (fieldName === 'debitFlag' || fieldName === 'creditFlag'
					|| fieldName === 'postedTxnsFlag'
					|| fieldName === 'expectedTxnsFlag'
					|| fieldName === 'hasImageFlag'
					|| fieldName === 'hasAttachmentFlag') {
				objCreateNewFilterPanel.setCheckBoxes(objCreateNewFilterPanel,
						fieldName, fieldVal);
			} else if(fieldName === 'subFacilityCode'){
				objCreateNewFilterPanel.checkUnCheckMenuItems(
						objCreateNewFilterPanel, fieldName, fieldVal);
			}
		}

		if (mode === 'VIEW') {
			objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
					.setValue(filterCode);
			objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
					true);
		}

		if (applyAdvFilter)
			me.applyAdvancedFilter();

	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter, mode) {
		var me = this;
		var objOfCreateNewFilter = me.getCreateNewFilter();
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
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
		if(!Ext.isEmpty(me.dateFilterFromVal) && !Ext.isEmpty(me.dateFilterToVal)){
			fieldVal1 = me.dateFilterFromVal;
			filedVal2 = me.dateFilterToVal;
		}
		else {
			fieldVal1 = dtObj.fieldValue1;
			filedVal2 = dtObj.fieldValue2;
		}
		
		if (me.strActivityType !== 'LATEST' && me.dateFilterVal !== '12') {
			strUrl += '&$activityFromDate=' + fieldVal1;
			strUrl += '&$activityToDate=' + filedVal2;
			if (!Ext.isEmpty(me.identifier))
				strUrl += '&$identifier=' + me.identifier;
		}
		if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all')
			strUrl += '&$typeCode=' + (me.txnFilter).join();
		
		
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
		
		if (me.filterApplied === 'A') {
				strAdvancedFilterUrl = me
						.generateUrlWithAdvancedFilterParams(isFilterApplied);
				
				if (!Ext.isEmpty(strAdvancedFilterUrl)) {
					if (!Ext.isEmpty(strUrl)) {
						strUrl += "&$filter=";
					}
					strUrl += strAdvancedFilterUrl;
					isFilterApplied = true;
				}
			strUrl += '&$accountID=' + me.accountFilter;
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
		if (me.strActivityType !== 'LATEST' && me.dateFilterVal !== '12') {
			strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
			strUrl += '&$activityToDate=' + dtObj.fieldValue2;
			if (!Ext.isEmpty(me.identifier))
				strUrl += '&$identifier=' + me.identifier;
		}
		//strUrl += '&$serviceType=' + me.strServiceType;
		//strUrl += '&$serviceParam=' + me.strServiceParam;
		

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
		var me = this;
		popup = Ext.create('GCP.view.RemarkPopup', {
					record : record,
					strRemark : record.get('noteText') || '',
					strAction : (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename'))) 
							? 'ADD'
							: 'VIEW'
				});
		popup.show();
		popup.on('addNotes', function(formdata,updatedNote,addedfile) {
					me.doSaveCapturedRemark(record, formdata,updatedNote,addedfile);
				});
		
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
					
		formdata.append("identifier",record.get('identifier'));
		$.ajax({
					url : me.strSaveActivityNotesUrl,
					type : 'POST',
					processData : false,
					contentType : false,
					data : formdata,
					complete : function(XMLHttpRequest, textStatus) {
					//if ("error" == textStatus) {
						// TODO : Error handling to be done.
						// alert("Unable to complete your request!");
					//}
					},
					success : function(response) {
						if (response && response['success'] == 'Y') {
							
							Ext.MessageBox.show({
								title : getLabel('saveActivityNotesSuccessPopUpTitle',
										'Message'),
								msg : getLabel('saveActivityNotesSuccessPopUpMsg',
										'Notes saved successfully..!'),
								buttons : Ext.MessageBox.OK,
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
		if (Ext.isEmpty(me.txnDetailsPopup)) {
			me.txnDetailsPopup = Ext.create(
					'GCP.view.TxnDetailsPopUp', {
						itemId : 'activityTxnDetailsPopUp'
					});
		}
		if (Ext.isEmpty(me.checkImagePopup)) {
			me.checkImagePopup = Ext.create(
					'GCP.view.CheckPopUp', {
						itemId : 'activityCheckPopUp'
					});
		}

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

		var withHeaderFlag = me.getWithHeaderReportCheckbox().checked;
		var arrExtension = {
				downloadXls : 'xls',
				downloadCsv : 'csv',
				downloadReport : 'pdf',
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

		//strUrl += '&$expand=liquidity';// + index.groupByType;

		// var strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
		// Added for new Query
		//strUrl += '&$filter=';// + strQuickFilterUrl;
		//strUrl += '&$summaryType=' + me.summaryType;
		//strUrl += '&$strAccountId=' + me.accountFilter;
		
		strUrl += '&$accountID=' + me.accountFilter;
		
		// Get subGroupInfo
		var groupView = me.getGroupView();
		groupInfo = groupView.getGroupInfo() || {};
		subGroupInfo = groupView.getSubGroupInfo() || {};
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += '&'+subGroupInfo.groupQuery;
		} else {
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
		// dateFilterIndex 12 : latest
		if (me.strActivityType !== 'LATEST' && me.dateFilterVal !== '12') {
			strUrl += '&$activityFromDate=' + dtObj.fieldValue1;
			strUrl += '&$activityToDate=' + dtObj.fieldValue2;
			if (!Ext.isEmpty(me.identifier))
				strUrl += '&$identifier=' + me.identifier;
		}
		if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all')
			strUrl += '&$typeCode=' + (me.txnFilter).join();

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

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
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
	getPreferencesToSave : function(localSave) {
		/*var me = this;
		var arrPref = [], objFilterPref = null, grid = null, gridState = null;
		var filterPanelCollapsed = true, infoPanelCollapsed = true, grafPanelCollapsed = true;
		var infoPanel = me.getSummaryInfoView(); 
		filterPanelCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
		objFilterPref = me.getFilterPreferences();
		grid = me.getActivityGrid();
		gridState = grid.getGridState();
		arrPref.push({
					"module" : "activityFilterPref",
					"jsonPreferences" : objFilterPref
				});
		arrPref.push({
					"module" : me.strServiceParam,
					"jsonPreferences" : {
						'gridCols' : gridState.columns,
						'pgSize' : gridState.pageSize,
						'sortState':gridState.sortState
					}
				});		
		arrPref.push({
					"module" : "panels",
					"jsonPreferences" : {
						'filterPanel' : filterPanelCollapsed
					}
				});	
		return arrPref;*/
		
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
		var filterPanelCollapsed = true;
		filterPanelCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
		objFilterPref = me.getFilterPreferences();
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			if (groupInfo.groupTypeCode === 'ACCTYPE') {
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
							'sortState':state.grid.sortState
						}
					});			
			arrPref.push({
						"module" : "panels",
						"jsonPreferences" : {
							'filterPanel' : filterPanelCollapsed
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
				
				if (strDtValue === '7') {
					if (!Ext.isEmpty(strDtFrmValue))
						me.dateFilterFromVal = strDtFrmValue;

					if (!Ext.isEmpty(strDtToValue))
						me.dateFilterToVal = strDtToValue;
				}
				
				if (!Ext.isEmpty(me.dateFilterVal)) {
					var strVal1 = '', strVal2 = '';
					if (me.dateFilterVal !== '7') {
						var dtParams = me.getDateParam(me.dateFilterVal);
						if (!Ext.isEmpty(dtParams))
						{
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					} 
					
				}
				
				if (!Ext.isEmpty(me.txnFilter) && me.txnFilter != 'all') {
					arrJsn.push({
								paramName : 'typeCode',
								paramValue1 : me.txnFilter,
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
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'ACCTYPE') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
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
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getTranSearchSummaryView(),arrSortState=new Array(),objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			if (!Ext.isEmpty(objDefPref['TXNSEARCH']['GRID'][args['module']]))
			{
			arrCols = objPref.gridCols
					|| objDefPref['TXNSEARCH']['GRID'][args['module']]['columnModel']
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			else
			{
			arrCols = objPref.gridCols
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			
			intPgSize = objPref.pgSize || _GridSizeTxn;
			arrSortState=objPref.sortState;
			colModel = objSummaryView.getColumns(arrCols);
		} else {
			intPgSize = _GridSizeTxn;
			if (!Ext.isEmpty(objDefPref['TXNSEARCH']['GRID'][args['module']]))
			{
			arrCols = objDefPref['TXNSEARCH']['GRID'][args['module']]['columnModel']
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			else
			{
			arrCols = objSummaryView.getDefaultColumnPreferences() || null;
			}
			
			colModel = objSummaryView.getColumns(arrCols);
		}
		if (colModel) {
			gridModel = {
				columnModel : colModel,
				pageSize : intPgSize,
				storeModel:{
					  sortState:arrSortState
                    }
			};
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		grid.loadGridData(strUrl, null, null, false);
	},
	doHandleRowActionClick : function(grid, rowIndex, columnIndex, actionName,
			record) {
		
		var me = this;
		var recId = record.get('identifier');
		if (actionName === 'notes') {
			me.captureRemark(record);
		} else if (actionName === 'txnDetails') {
			me.txnDetailsPopup.recordId = recId;
			me.txnDetailsPopup.currentAccountNumber = record.get('accountNo');
			me.txnDetailsPopup.record = record;
			me.txnDetailsPopup.accSubFacility = record.get('subFacType');
			me.txnDetailsPopup.show();
		} else if (actionName === 'email') {
			me.emailPopup = Ext.create(
					'GCP.view.EmailPopUpView', {
						itemId : 'activityEmailPopUpView',
						record : record,
						parent : me.getGroupView()
					});
			me.emailPopup.show();
		} else if (actionName === 'check') {
			if(daejaViewONESupport)
			{
				me.showCheckImageDaejaViewONE(record);
			}
			else
			{
				me.checkImagePopup.record = record;
				me.checkImagePopup.show();
			}
		} else if (actionName === 'expandedWire') {
			me.expandedWirePopup.record = record;
			me.expandedWirePopup.showExpandedWirePopup(record);
		}
		
	},
	updateDateFilterView : function() {
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
			title : 'Image',
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
	}
	
});
