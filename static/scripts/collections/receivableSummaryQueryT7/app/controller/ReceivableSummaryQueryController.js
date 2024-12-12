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

Ext.define('GCP.controller.ReceivableSummaryQueryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ReceivableSummaryQueryView', 'GCP.view.HistoryPopup',
			'Ext.tip.ToolTip'],
	refs : [{
				ref : 'receivableSummaryQueryView',
				selector : 'receivableSummaryQueryView'
			}, {
				ref : 'groupView',
				selector : 'receivableSummaryQueryView groupView'
			},
			/* Quick Filter starts... */
			{
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'receivableSummaryQueryFilterView',
				selector : 'receivableSummaryQueryFilterView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'receivableSummaryQueryFilterView combo[itemId="quickFilterClientCombo"]'
			}, {
				ref : 'receivablePackageCombo',
				selector : 'receivableSummaryQueryFilterView combo[itemId="receivablePackageCombo"]'
			}, {
				ref : 'entryDateBtn',
				selector : 'receivableSummaryQueryFilterView button[itemId="entryDateBtn"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'receivableSummaryQueryFilterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'receivableSummaryQueryFilterView  combo[itemId="savedFiltersCombo"]'
			}
	/* Quick Filter ends... */
	],
	config : {
		/* Filter Ribbon Configs Starts */
		strPaymentTypeUrl : 'services/instrumentType.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/groupRecQViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/groupRecQViewFilter/{0}.json',
		strModifySavedFilterUrl : 'services/userfilters/groupRecQViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/groupRecQViewFilter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/receivablesquery.json',
		strGetModulePrefUrl : 'services/userpreferences/receivablesquery/{0}.json',
		strBatchActionUrl : 'services/receivablesquery/{0}.json',
		strDefaultMask : '000000000000000000',
		intMaskSize : 21,

		datePickerSelectedDate : [],
		datePickerSelectedEntryDate : [],
		dateFilterLabel :  getLabel('today', 'Today'),
		dateFilterVal : '', //1
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
		advClientValue : '' ,
		strPageName : 'receivablesquery',
		firstLoad : false
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
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};			
			me.filterData = (!Ext.isEmpty(filterType)) ? filterType : [];
			
		}
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		if (!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		if (Ext.isEmpty(widgetFilterUrl))
		{
			me.updateFilterConfig();
		}
		else {
			me.setWidgetFilters();
		}
		
		populateAdvancedFilterFieldValue();
		
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences(event);
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
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
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
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		/*$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});*/
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
					me.resetAllFields();
					me.filterCodeValue = null;
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

		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});

		me.control({
			'receivableSummaryQueryView groupView' : {
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
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
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
					var me = this;
					//populateAdvancedFilterFieldValue();
					me.firstTime = true;
					me.applyPreferences();
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'receivableSummaryQueryFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					//me.handleDateChange(me.dateFilterVal);
					var clientAuto = me.getReceivableSummaryQueryFilterView().down('combo[itemId="clientAuto"]');
					clientAuto.setValue(strClientFilterDesc);
				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				},
				handlePaymentTypeChangeInQuickFilter : function(combo) {
					me.handlePaymentTypeClick(combo);
				}

			},
			'receivableSummaryQueryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'receivableSummaryQueryFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						//$('#msClient').val(me.clientFilterVal);
						//$('#msClient').niceSelect('update');
					} else {
						combo.setValue(combo.getStore().getAt(0));
						//$('#msClient').val(combo.getStore().getAt(0));
						//$('#msClient').niceSelect('update');
					}
				}
			},

			'receivableSummaryQueryFilterView combo[itemId="receivablePackageCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.receivablePackFilterVal)) {
						combo.setValue(me.receivablePackFilterVal);
					}
				},
				'blur' : function(combo, record) {
						me.handleProductCatClick(combo);
				}
			},
			'receivableSummaryQueryFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						var filterVal = me.savedFilterVal.trim();
						combo.setValue(filterVal);
						$('#savedFilterAs').val(filterVal);
						$('#msSavedFilter').val(filterVal);
					}
				}
			},
			'receivableSummaryQueryFilterView component[itemId="paymentEntryDataPicker"]' : {
				render : function() {
					var islocalPreffApplied = false;
					if(objSaveLocalStoragePref){
						var localPreff = Ext.decode(objSaveLocalStoragePref);
						islocalPreffApplied = (localPreff && localPreff.d.preferences && localPreff.d.preferences.tempPref) ? true:false 
					}
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : false,
						changeYear : false,
						dateFormat : strApplicationDateFormat,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.datePickerSelectedDate = dates;
								me.datePickerSelectedEntryDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.setDataForFilter();
								me.applyQuickFilter();	
								//me.handleFieldSync('Q');
								// me.toggleSavePrefrenceAction(true);
							}
						}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true || true === islocalPreffApplied)
					{
						var entryDateLableVal = $('label[for="ProcessDateLabel"]').text();
						var entryDateField = $("#processDate");
						me.handleProcessingDateSync('A', entryDateLableVal, null, entryDateField);
					}else if (!Ext.isEmpty(widgetFilterUrl)
							&& !Ext.isEmpty(me.dateFilterVal)
							&& !Ext.isEmpty(me.dateFilterLabel)) {
						me.handleDateChange(me.dateFilterVal);
					} else{
						me.dateFilterVal = '1'; // Set to Today
						me.dateFilterLabel = getLabel('today', 'Today');
						me.handleDateChange(me.dateFilterVal);
						me.setDataForFilter();
						me.applyQuickFilter();
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
					showAdvanceFilterPopup();
					me.assignSavedFilter();

				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
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
									me.handleFieldSync('A');
									
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);					
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
	/*doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'RECSUM_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
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
					strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
					me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);
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

	},*/
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReceivableSummaryQueryView(), gridModel = null, objData = null;
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var strModule = '', args = null;
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
	/*postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReceivableSummaryQueryView(), objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
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
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel : {
						sortState : objPref.sortState
					}
				}
			}
		}
		
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		
		objGroupView.reconfigureGrid(gridModel);
	},*/
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid(),groupInfo = null ,subGroupInfo = null;
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
		var me = this;
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

				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'processingDate');

				if(me.dateFilterVal === '12'){
					if (!Ext.isEmpty(reqJsonInQuick)) {
						//reqJsonInQuick.paramValue1 = reqJsonInQuick.paramValue2;
						arrQuickJson = quickJsonData;
						arrQuickJson = me.updateInQuickArrJson(arrQuickJson,'processingDate');
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
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowDoubleClick(record, grid);
				});
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
		} 
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
					var objValue = filterData[index].paramValue1;
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
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						if(filterData[index].field !== "PickupLocation")
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
								} else if (filterData[index].field === "Reversal") {
									strTemp = strTemp
											+ "(InstrumentType eq '62' and actionStatus eq '74')"
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
						var objValue = filterData[index].value1;
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
			strActionType, paymentFxInfo) {
		var me = this;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'verify' || strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else if (strAction === 'submit' || strAction === 'auth') {
			me.doHandleProcessDateCalculation(strAction, strUrl, grid,
					arrSelectedRecords, strActionType, paymentFxInfo);
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
					multiline : 4,
					cls : 't7-popup',
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
								if('auth' === strAction || 'send' === strAction || 'submit' === strAction)
								{
									processRealTimePirs(jsonRes,strUrl,strAction);
								}
							},
							failure : function() {
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
		var warnLimit = "Warning limit exceeded!"
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
				if (!Ext.isEmpty(errCode)
						&& (errCode.substr(0, 4) === 'WARN' || errCode === 'GD0002'))
					strIsProductCutOff = 'Y';
			});
			if(errCode.indexOf('SHOWPOPUP') != -1){
				if(isNaN(fxTimer))  fxTimer = 10;
				countdown_number = 60*fxTimer;
				 me.countdownTrigger(result.paymentFxInfo, strAction, grid,
				 records, errCode);
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
							actionMessage : result.success === 'Y'
									? strActionSuccess
									: (result.success === 'W02' ? warnLimit : msg)
						});
			}
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
		var strUrl = '', objFormData = {};
				if (actionName === 'btnView')
					strUrl = 'viewBatchReceivablesQuery.form';
				
				objFormData.strLayoutType = !Ext.isEmpty(record.get('layout'))
						? record.get('layout')
						: '';
				objFormData.strPaymentType = !Ext.isEmpty(record
						.get('paymentType')) ? record.get('paymentType') : '';
				objFormData.strBankProduct = !Ext
				.isEmpty(record.get('bankProduct')) ? record
				.get('bankProduct') : '';		
				objFormData.strProduct = !Ext
						.isEmpty(record.get('strUdeProductCode')) ? record
						.get('strUdeProductCode') : '';
				objFormData.strActionStatus = !Ext.isEmpty(record
						.get('actionStatus')) ? record.get('actionStatus') : '';
				objFormData.strPhdnumber = !Ext
						.isEmpty(record.get('dhdDepNmbr')) ? record
						.get('dhdDepNmbr') : '';
				objFormData.viewState = record.get('identifier');
				objFormData.buttonIdentifier = record.get("__metadata").__buttonIdentifier;
				objFormData.pdcFlag = record.raw.pdcFlag;
				if (actionName === 'btnView' || actionName === 'btnEdit') {
					if (!Ext.isEmpty(strUrl)) {
						me.doSubmitForm(strUrl, objFormData, actionName);
					}
				}
		},
	showHistory : function(url) {
	var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtBankProduct',
				formData.strBankProduct));
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
		if(formData.hasOwnProperty('pdcFlag'))
		{
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'txtPdcFlag', formData.pdcFlag));
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
			me.getEntryDateLabel().setText(getLabel('processingDate','Processing Date')
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
				datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		}
		if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate))
		{
			selectedProcessDate  = {
					operator : objDateParams.operator,
					fromDate : vFromDate,
					toDate : vToDate,
					dateLabel : me.dateFilterLabel
				};
		}
		else
			selectedProcessDate = {};
		me.handleProcessingDateSync('Q', me.getEntryDateLabel().text, " ("
				+ me.dateFilterLabel + ")", datePickerRef);
		me.filterAppiled = 'A';
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
							paramName : 'processingDate',
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
		var objJson = {};
		var preferenceArray = [];
		$("#msSavedFilter option").each(function() {
					preferenceArray.push($(this).val());
				});
		objJson.filters = preferenceArray;
		/*store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;*/
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
	/*deleteFilterSet : function(grid, rowIndex) {
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
	},*/
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
		$('#creationDateDropDown').find('a').prop('class','');
		$('#msReceivablePrdCat').multiselect().find('option').prop('disabled',true);
		$('#msReceivableProduct').multiselect().find('option').prop('disabled',true);
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
		$('#creationDateDropDown').find('a').prop('class','x-btn ui-caret-dropdown x-unselectable x-btn-default-small');
		$('#msReceivablePrdCat').multiselect().find('option').prop('disabled',false);
		$('#msReceivableProduct').multiselect().find('option').prop('disabled',false);
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
			var filterView = me.getReceivableSummaryQueryFilterView();
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
		} else if (me.filterApplied === 'A') {*/
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
			reqJson = me.findInAdvFilterData(objJson, "processingDate");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"processingDate");

				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "receivablePrdCat");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
						"receivablePrdCat");

				me.filterData = arrQuickJson;
			}
			//me.advFilterData = objJson;
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
		/*}
		if (me.filterApplied === 'ALL') {
			me.filterData = me.getQuickFilterQueryJson();
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
		var receivablePackFilterValArray = [];
		var receivablePackFilterVal = me.receivablePackFilterVal;
		var  receivablePackFilterDesc = me.paymentTypeFilterDesc;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var jsonArray = [];
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'processingDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('activationDate','Activation Date')
					});
		}
		if (receivablePackFilterVal != null && receivablePackFilterVal != 'All'
				&& receivablePackFilterVal != 'all'
				&& receivablePackFilterVal.length >= 1) {
			receivablePackFilterValArray = receivablePackFilterVal.toString();
			if (receivablePackFilterDesc != null && receivablePackFilterDesc != 'All'
				&& receivablePackFilterDesc != 'all'
				&& receivablePackFilterDesc.length >= 1)
				receivablePackFilterDescArray = receivablePackFilterDesc.toString();
			jsonArray.push({
						paramName : 'receivablePrdCat',
						paramFieldLable : getLabel('receivablePrdCat', 'Product Category'),
						paramValue1 : receivablePackFilterValArray,
						operatorValue : 'in',
						dataType : 'S',
						displayType : 5,
						displayValue1 : receivablePackFilterDescArray
					});
		}
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != null && clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'Client',
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						displayValue1 : clientFilterDesc
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
	hideQuickFilter : function() {
		var me = this;
		if (!Ext.isEmpty(me.getFilterView())) {
			me.getFilterView().hide();
			me.getFilterButton().removeCls('filter-icon-hover');
		}
	},
	doSearchOnly : function() {
		var me = this;
		selectedClient = $("#msClient").val();
		me.advClientValue = selectedClientDesc;
		if (selectedClient != null) {
			var clientComboBox = me.getReceivableSummaryQueryFilterView().down('combo[itemId="clientCombo"]');
			clientComboBox.setValue(selectedClient);
			var selectedAutoClient = me.getReceivableSummaryQueryFilterView().down('combo[itemId="clientAuto"]');
			if(selectedClient != 'all')
			{		
				selectedAutoClient.setValue(selectedClientDesc);
				clientComboBox.setValue(selectedClientDesc);
			}
			else
			{			
				selectedAutoClient.setValue('');
				clientComboBox.setValue('all');
				me.clientFilterVal = 'all';
			}
		/*var client = me.getQuickFilterClientCombo();
			client.setValue(selectedClient);
		clientComboBox.setValue(selectedClient);*/
		}
		
		/*var clientComboBox = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="clientCombo"]');
		var clientAutoComp = me.getReceivableSummaryQueryFilterView()
				.down('AutoCompleter[itemId="clientAuto"]');
		if (selectedFilterClient != null && $('#msClient').val() != 'all') {
			if (isClientUser()) 
				clientComboBox.setValue(selectedFilterClient);
			else
				clientAutoComp.setValue(selectedFilterClientDesc);
				
		} else if ($('#msClient').val() == 'all') {
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}*/
		
		var receivablePackageChangedValue = $("#msReceivablePackage")
				.getMultiSelectValue();
		if (!Ext.isEmpty(receivablePackageChangedValue)) {
			var objField = me.getFilterView()
					&& me.getFilterView()
							.down('combo[itemId="receivablePackageCombo"]')
					? me.getFilterView()
							.down('combo[itemId="receivablePackageCombo"]')
					: null;
			if (receivablePackageChangedValue.length == 1) {
				me.receivablePackFilterVal = receivablePackageChangedValue;
				if (objField)
					objField.setValue(me.receivablePackFilterVal);
			} else if (receivablePackageChangedValue.length > 1) {
				me.receivablePackFilterVal = 'all';
				if (objField)
					objField.setValue(me.receivablePackFilterVal);
			}
		}
		if(!Ext.isEmpty($('#savedFilterAs').val()))
			$('#savedFilterAs').val(($('#savedFilterAs').val()).trim())
		me.handleFieldSync('A');
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
                var filterName = $('#savedFilterAs').val();
				var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
				if(Ext.isEmpty(filterName) && SaveFilterChkBoxVal == true)
                	isError = true;
                return;
           } else {
           		isError = false;
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
			savedFilterCombobox.setValue(me.filterCodeValue.trim());
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
		var filterView = me.getReceivableSummaryQueryFilterView();
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
				|| displayType === 6 || displayType === 2 || displayType === 12 || displayType === 13)
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
		var appliedSortByJson = null;
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
		me.disablePreferencesButton("savePrefMenuBtn", false);
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
		var arrPref = [], objFilterPref = null;
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
		var grid = null, objOfSelectedGridRecord = null, objOfGridSelected = null;
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
			var strExtension = '', strUrl = '', strSelect = '';

			strExtension = arrExtension[actionName];
			strUrl = 'services/receivablesquery.' + strExtension;
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
	},
	handlePaymentTypeClick : function(combo) {
		var me = this;
		me.receivablePackFilterVal = combo.getValue();
		me.paymentTypeFilterDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		var savedFilterCombo = me.getReceivableSummaryQueryFilterView()
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
		//me.resetAllFields();
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.savedFilterVal = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		var receivablePackageChangedValue = $("#msReceivablePackage")
				.getMultiSelectValue();
		if (!Ext.isEmpty(receivablePackageChangedValue)) {
			var objField = me.getFilterView()
					&& me.getFilterView()
							.down('combo[itemId="receivablePackageCombo"]')
					? me.getFilterView()
							.down('combo[itemId="receivablePackageCombo"]')
					: null;
			if (receivablePackageChangedValue != ''
					&& receivablePackageChangedValue.length == 1) {
				me.receivablePackFilterVal = receivablePackageChangedValue;
				if (objField)
					objField.setValue(me.receivablePackFilterVal);
			} else if (receivablePackageChangedValue.length > 1) {
				me.receivablePackFilterVal = 'all';
				if (objField)
					objField.setValue(me.receivablePackFilterVal);
			}
		}
		me.handleFieldSync('A');
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		// me.toggleSavePrefrenceAction(true);
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
		} 
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		var toDatePickerRef = $('#entryDataToPicker');

		var clientComboBox = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="quickFilterClientCombo"]');
		var clientComboBox1 = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="clientCombo"]');
		var clientAuto = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="clientAuto"]'); 
		//currency
		$("#dropdownCurrency").val('all');				
		$('#dropdownCurrency').niceSelect('update');
		//clientCombo
		me.clientFilterVal = 'all';
		selectedFilterClientDesc = "";
		selectedFilterClient = "";
		selectedClientDesc = "";
		if (isClientUser()){
			var clientComboBox = me.getReceivableSummaryQueryFilterView()
			.down('combo[itemId="quickFilterClientCombo"]');
			var clientComboBox1 = me.getReceivableSummaryQueryFilterView()
			.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			clientComboBox.setValue(me.clientFilterVal);
			clientComboBox1.setValue(me.clientFilterVal);	
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}
		else{
			var clientAuto = me.getReceivableSummaryQueryFilterView()
			.down('combo[itemId="clientAuto"]'); 
			clientAuto.reset();
			clientAuto.setValue("");
			me.clientFilterVal = "";
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		var receivablePackageComboBox = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="receivablePackageCombo"]');
		me.receivablePackFilterVal = 'all';
		receivablePackageComboBox.selectAllValues();
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getReceivableSummaryQueryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		me.dateFilterVal = '';
		me.dateFilterLabel =  '';
		me.handleDateChange(me.dateFilterVal);
		me.getEntryDateLabel().setText(getLabel('processingDate','Processing Date'));
		datePickerRef.val('');
		toDatePickerRef.val('');
		me.filterApplied = 'Q';

		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.resetAllFields();
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
				toDate : dateToField,
				dateLabel : me.creationDateFilterLabel
			};
		} else {
			if (index === '1' || index === '2') {
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
				toDate : dateToField,
				dateLabel : me.creationDateFilterLabel
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
				var fromDate = new Date(Ext.Date.parse(collFromDate, dtFormat));
                var toDate = new Date(Ext.Date.parse(collToDate, dtFormat));
				fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);;
				operator = 'bt';
				break;
			case '13' :
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
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');	
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		isError = false;
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		}
		else{
			me.savedFilterVal = '';
			me.filterCodeValue = '';
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
			fieldDispVal = filterData.filterBy[i].displayValue1;
			if (fieldName === 'clientReference') {
				$("#clientReference").val(fieldVal);
			}else if(fieldName === 'Client'){
				$('#msClient').val(fieldVal);
				$('#msClient').niceSelect('update');
				filterData.filterBy[i].displayValue1 = $("#msClient option:selected").text();
				//setProductsMenuItems("msReceivableProduct");
				if (isClientUser()) {
					var clientComboBox = me.getReceivableSummaryQueryFilterView()
							.down('combo[itemId="clientCombo"]'); 
					me.clientFilterVal = (fieldVal === "")?'all':fieldVal;
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = $('#msClient option:selected').text();
					selectedClient=fieldVal;
					clientComboBox.setValue(fieldVal);
					me.clientFilterDesc = selectedClientDesc;
					strClientFilterDesc = selectedClientDesc;
			
				} else {
					var clientComboBox = me.getReceivableSummaryQueryFilterView()
							.down('combo[itemId="clientAuto]');
					var tempselectedClientDesc = filterData.filterBy[i].displayValue1;
					clientComboBox.setValue(tempselectedClientDesc);
					clientComboBox.setRawValue(tempselectedClientDesc);
					me.clientDesc = tempselectedClientDesc;
					selectedClientDesc =  tempselectedClientDesc;
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = tempselectedClientDesc;
					selectedClient=fieldVal;
					strClientFilterDesc = selectedClientDesc;
					
				}
			}else if(fieldName === 'ccyCode'){
				$('#dropdownCurrency').val(fieldVal);
				$('#dropdownCurrency').niceSelect('update');
			}
			else if (fieldName === 'txnRef') {
				$("#txnRef").val(fieldVal);
			} else if (fieldName === 'Maker') {
				$("#entryUser").val(fieldVal);
			} else if (fieldName === 'FileName') {
				$("#fileName").val(fieldVal);
			} else if (fieldName === 'batchAmount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'AmountDdt') {
				me.setInstAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'PickupLocation') {
				$("#pickupLocation").val(fieldVal);
			} else if (fieldName === 'InstNo') {
				$("#instNo").val(fieldVal);
			} else if (fieldName === 'OrderingPartyName') {
				$("#filterOrderingPartyAutocomplete").val(fieldVal);
			}

			if (fieldName === 'CreateDate' || fieldName === 'EntryDate'
					|| fieldName === 'processingDate') {
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
			} else if (fieldName === 'receivablePrdCat'
					|| fieldName === 'ProductType'
					|| fieldName === 'creditAccount'
					|| fieldName === 'actionStatus'
					|| fieldName === 'PickupLocation' || fieldName === 'Client'
					|| fieldName === 'Channel' || fieldName === 'txnRef' || fieldName === 'ReceivableProduct'|| fieldName === 'ActionStatusC') {
				me.checkUnCheckMenuItems(fieldName, fieldVal, fieldSecondVal);  
				if (fieldName === 'actionStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
				else if (fieldName === 'ActionStatusC' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}
		}
		if (!isPayCategoryFieldPresent) {
			$("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
					false);
			$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
					false);
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode.trim());
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
			var dateFilterRef = null;
			var dateFilterRefFrom = null;
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
							
			if (dateType === 'processingDate') {
				//dateFilterRef = $('#processDate');
				//var formattedFromDate = Ext.util.Format.date(Ext.Date.parse(data.value1, 'Y-m-d'),
							//strExtApplicationDateFormat);
				//var formattedToDate = Ext.util.Format.date(Ext.Date.parse(data.value2, 'Y-m-d'),
							//strExtApplicationDateFormat);
				
				selectedProcessDate = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate,
				dateLabel : data.dateFilterLabel
			};
			
			dateFilterRefFrom = $('#processDate');
			
			$('label[for="ProcessDateLabel"]').text(getLabel('processingDate','Processing Date')+ " ("
				+ selectedProcessDate.dateLabel + ")");
			}
			else if (dateType === 'CreateDate') {
				
				selectedCreationDate = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate,
				dateLabel : data.dateFilterLabel
			};
			
			dateFilterRefFrom = $('#creationDate');
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
					'Creation Date')
					+ " (" + selectedCreationDate.dateLabel + ")");
			
			}
			if (dateType === 'CreateDate') {
				dateFilterRef = $('#creationDate');
			}
			/*if (dateOperator === 'bt') {
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
			}*/
			if (dateOperator == 'eq')
			{
				$(dateFilterRefFrom).val(formattedFromDate);
			}
			else if (dateOperator === 'bt') {
				$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
			}
		
	}
	},
	setRadioGroupValues : function(fieldName, fieldVal) {
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
	checkUnCheckMenuItems : function(componentName, data, fieldSecondVal) {
		var menuRef = null;
		var elementId = null;
		var me = this;

		if (componentName === 'receivablePrdCat') {
			menuRef = $("select[id='msReceivablePrdCat']");
			elementId = '#msReceivablePrdCat';
		} else if (componentName === 'actionStatus' || componentName === 'ActionStatusC') {
			menuRef = $("select[id='msStatus']");
			elementId = '#msStatus';
		} else if (componentName === 'PickupLocation') {
			menuRef = $("select[id='PickupLocation']");
			elementId = '#pickupLocation';
		} else if (componentName === 'Client') {
			menuRef = $("select[id='msClient']");
			elementId = '#msClient';
		} else if (componentName === 'creditAccount') {
			menuRef = $("select[id='msCreditAccount']");
			elementId = '#msCreditAccount';
		} else if (componentName === 'ProductType' || componentName === 'ReceivableProduct') {
			menuRef = $("select[id='msReceivableProduct']");
			elementId = '#msReceivableProduct';
		} else if (componentName === 'Channel') {
			menuRef = $("select[id='msChannel']");
			elementId = '#msChannel';
		} else if (componentName === 'txnRef') {
			menuRef = $("select[id='txnRef']");
			elementId = '#txnRef';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			//if (componentName === 'actionStatus') 
				//data = fieldSecondVal;
			if (componentName === 'actionStatus' || componentName === 'ActionStatusC') 
				data = fieldSecondVal;
			var dataArray = (typeof data == 'string') ? data.split(',') : data;
			if (componentName === 'InstrumentType') {
				me.receivablePackFilterVal = dataArray;
			}

			if (componentName === 'actionStatus' || componentName === 'ActionStatusC') {
				selectedStatusListSumm = dataArray;
			}
			if (componentName === 'ProductType') {
				selectedProductTypeList = dataArray;
			}
			if (componentName === 'creditAccount') {
				selectedAccountNoList = dataArray;
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
						$('#msSortBy1').niceSelect('update');
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
						$('#msSortBy2').niceSelect('update');
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
						$('#msSortBy3').niceSelect('update');
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
				if(operator == "le")
					operator = "lt";
				if(operator == "ge")
					operator = "gt";
				$('#amountOperator').val(operator);
				$("#amountOperator").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#amountFieldFrom").removeClass("hidden");
						$(".amountTo").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
						$('#amountOperator').niceSelect('update');
					}
				}
			}
		}
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
					}
				}
			}
		}
	},
	resetAllFields : function() {
		var me = this;
		
		selectedAccountNoList=[];
		selectedProductTypeList=[];
		resetAllMenuItemsInMultiSelect("#msReceivablePrdCat");
		resetAllMenuItemsInMultiSelect("#msReceivableProduct");
		resetAllMenuItemsInMultiSelect("#msCreditAccount");
		$("input[type='text'][id='mandateName']").val("");
		selectedProcessDate = {};
		selectedCreationDate = {};
		$('#processDate').val("");
		$('#entryDataPicker').val("");
		$('#creationDate').val("");
		$("#pickupLocation").val("");
		resetAllMenuItemsInMultiSelect("#msStatus");
		$("#fileName").val("");
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("#instAmountOperator").val($("#instAmountOperator option:first").val());
		$("#amountFieldFrom").val("");
		$("#amountFieldTo").val("");
		$("#instAmountFieldFrom").val("");
		$("#instAmountFieldTo").val("");
		$("#pickupLocation").val("");
		$("#txnRef").val("");
		$("#virtualAccNmbr").val("");
		$("input[type='text'][id='clientReference']").val("");
		$("#msSortBy1").val("");
		$('#msSortBy2 option').remove();
		$("#msSortBy2").append($('<option />', {
					value : "None",
					text : getLabel("none","None")
				}));
		$('#msSortBy3 option').remove();
		$("#msSortBy3").append($('<option />', {
					value : "None",
					text : getLabel("none","None")
				}));
		$('#msSortBy2').attr('disabled', true);
		$('#msSortBy3').attr('disabled', true);
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="ProcessDateLabel"]').text(getLabel('processingDate',
				'Processing Date'));
		$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
				'Effective Date'));
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
				'Creation Date'));
		$('#tabs-2').find('input, textarea, button, select, label, li, checkbox, option, span, div').attr('disabled',false);
		$('#processDateDropDown').find('a').prop('class','x-btn ui-caret-dropdown x-unselectable x-btn-default-small');
		$('#creationDateDropDown').find('a').prop('class','x-btn ui-caret-dropdown x-unselectable x-btn-default-small');
		$('#msReceivablePrdCat').multiselect().find('option').prop('disabled',false);
		$('#msReceivableProduct').multiselect().find('option').prop('disabled',false);
		$('#msCreditAccount').multiselect().find('option').prop('disabled',false);
		$('#msStatus').multiselect().find('option').prop('disabled',false);
		$('#tabs-2').find('button').removeClass('ui-state-disabled');
		$('#btnAdvFilterSaveAndSearch').attr("disabled", false);
		$("#msSortBy1").niceSelect('update');
		$("#msSortBy2").niceSelect('update');
		$("#msSortBy3").niceSelect('update');
		$('#msClient').val('all');
		$('#msClient').niceSelect('update');
		if (isClientUser()) {
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
			} else {
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		$('#msReceivablePrdCat').val('all');
		$('#msReceivablePrdCat').niceSelect('update');
		$('#dropdownCurrency').val('all');
		$('#dropdownCurrency').niceSelect('update');
		/*$('#msStatus').val('all');
		$('#msStatus').niceSelect('update');*/
		$('#amountOperator,#instAmountOperator').niceSelect('update');
		$("#saveFilterChkBox").attr('checked', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		var objField = me.getReceivableSummaryQueryFilterView().down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
		me.dateFilterVal = '';
		selectedEntryDate = {};
		me.resetAdvProcessDate();
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
		me.handleFieldSync('A');
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
	 countdownTrigger : function(paymentFxInfo, strAction, grid, records, errorCode) {
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
		var fxRateVal = paymentFxInfo.fxInfoRate;
		var debitAmntVal = paymentFxInfo.debitAmount;
		if (typeof fxRateVal == "undefined") {
			fxRateVal = '';
		}
		if (typeof debitAmntVal == "undefined") {
			debitAmntVal = '';
		}
		$('#fxPopupDiv').dialog({
					title : "Approve transaction in " + mins + ":" + sec,
					autoOpen : false,
					maxHeight : 550,
					minHeight : 156,
					width : 735,
					modal : true,
					resizable : false,
					draggable : false
				});
		$('#fxPopupDiv').dialog("open");
		 $('#fxPopupDiv').on('dialogclose', function(event) {
				clearTimeout(countdown);
				groupView.setLoading(false);
		 });
		$('#cancelFxBtn').unbind('click');
		$('#cancelFxBtn').bind('click', function() {
					clearTimeout(countdown);
					groupView.setLoading(false);
					$('#fxPopupDiv').dialog("close");
				});
		$('#okFxBtn').unbind('click');
		$('#okFxBtn').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions(strAction, grid, records, 'rowAction',
					paymentFxInfo.encryptedFxInfo);
			$('#fxPopupDiv').dialog("close");
		});
		$('#discardBtn').unbind('click');
		$('#discardBtn').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions('discard', grid, records, 'rowAction',
					paymentFxInfo.encryptedFxInfo);
			$('#fxPopupDiv').dialog("close");
		});
		$('#rolloverBtn').unbind('click');
		$('#rolloverBtn').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions(strAction, grid, records, 'rowAction',
					paymentFxInfo.encryptedFxInfo);
			$('#fxPopupDiv').dialog("close");
		});
		$('#rejectBtn').unbind('click');
		$('#rejectBtn').bind('click', function() {
			clearTimeout(countdown);
			me.doHandleGroupActions('reject', grid, records, 'rowAction',
					paymentFxInfo.encryptedFxInfo);
			$('#fxPopupDiv').dialog("close");
		});
		if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER')){
			$('#cutoffAuthRLButtonsUl').removeClass('hidden');
			$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD')){
			$('#cutoffAuthNRButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER'){
			$('#cutoffRLButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD'){
			$('#cutoffNRButtonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl').addClass('hidden');
		}
		else if(errorCode == 'SHOWPOPUP,FX'){
			$('#fxButonsUl').removeClass('hidden');
			$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl').addClass('hidden');
		}
		if(errorCode.indexOf('FX') != -1 && errorCode.indexOf('CUTOFF') != -1){
			$('#disclaimerTextcutoffFXDivView').removeClass('hidden');
			$('#disclaimerTextcutoffDivView, #disclaimerTextFXDivView').addClass('hidden');
			$('#fxDiscalimer').removeClass('hidden');
		}
		else if(errorCode.indexOf('CUTOFF') != -1){
			$('#disclaimerTextcutoffDivView').removeClass('hidden');
			$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView').addClass('hidden');
			$('#fxDiscalimer').addClass('hidden');
		}
		else if(errorCode.indexOf('FX') != -1){
			$('#disclaimerTextFXDivView').removeClass('hidden');
			$('#disclaimerTextcutoffDivView, #disclaimerTextcutoffFXDivView').addClass('hidden');
			$('#fxDiscalimer').removeClass('hidden');
		}
		var debitAmtRef = document.getElementById("debitAmt");
		debitAmtRef.innerHTML  = debitAmntVal;
		var debitCcyRef = document.getElementById("debitCcy");
		debitCcyRef.innerHTML  = paymentFxInfo.debitCurrency;
		var paymentAmtRef = document.getElementById("paymentAmt");
		paymentAmtRef.innerHTML  = paymentFxInfo.paymentAmount;
		var paymentCcyRef = document.getElementById("paymentCcy");
		paymentCcyRef.innerHTML  = paymentFxInfo.paymentCurrency;
		var fxRateRef = document.getElementById("fxRateInfo");
		fxRateRef.innerHTML  = fxRateVal;
		fxRateRef.setAttribute('title', fxRateVal);
		var valueDateRef = document.getElementById("valueDate");
		valueDateRef.innerHTML  = paymentFxInfo.valueDate;
		var paymentRef = document.getElementById("paymentRef");
		paymentRef.innerHTML  = paymentFxInfo.paymentRef;
		paymentRef.setAttribute('title', paymentFxInfo.paymentRef);
		if (countdown_number > 0) {
			countdown_number--;
			if (countdown_number > 0) {
				countdown = setTimeout(function() {
							me.countdownTrigger(paymentFxInfo, strAction, grid,
									records,errorCode);
						}, 1000);
			} else {
				$('#fxPopupDiv').dialog("close");
				clearTimeout(countdown);
			}
		}
	},

	countdownClear : function() {
	    clearTimeout(countdown);
	},

		/* Page setting handling starts here */
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
					? me.getJsonObj(objPrefData.d.preferences.ColumnSetting.gridCols)
					: (!Ext.isEmpty(arrGenericColumnModel) 
							? Ext.decode(me.getJsonObj(Ext.decode(arrGenericColumnModel))) 
									: (RECEIVABLE_GENERIC_COLUMN_MODEL || '[]'));
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
		objData["filterUrl"] = 'services/userfilterslist/groupRecQViewFilter.json';
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
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
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
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {};
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
	doDeleteLocalState : function(){
		var me = this;
		me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
	},
	/* Page setting handling ends here */

assignSavedFilter : function() {
		var me = this,savedFilterCode='';
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
							me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
							me.handleFieldSync('A');
						}
				}
				else if (!Ext.isEmpty(objJsonData.d.preferences)
						&& Ext.isEmpty(widgetFilterUrl)) {
					me.handleFieldSync('Q');
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if (advData === me.getReceivableSummaryQueryFilterView()
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
		else
		{
			me.handleFieldSync('A');
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
				if (paramName === 'processingDate') {
					me.resetProcessingDateAsDefault();
				}
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
					if (paramName === 'processingDate') {
						me.resetProcessingDateAsDefault();
					}
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.setDataForFilter();
			me.refreshData();
		}
	},
	resetProcessingDateAsDefault : function() {
		var me = this;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.handleDateChange(me.dateFilterVal);
	},
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if (strFieldName === 'Client') {
			$("#msClient option:first").attr('selected','selected');
			$("#msClient").niceSelect('update');
			if (isClientUser()) {
				var clientComboBox = me.getReceivableSummaryQueryFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} else {
				var clientComboBox = me.getReceivableSummaryQueryFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		} 
		else if(strFieldName === 'ccyCode'){
			$("#dropdownCurrency").val('all');
			$('#dropdownCurrency').niceSelect('update');
		}
		else if(strFieldName === 'actionStatus'){
			resetAllMenuItemsInMultiSelect("#msStatus");
		}		
		else if(strFieldName === 'receivablePrdCat'){
			var objField = me.getReceivableSummaryQueryFilterView()
					.down('combo[itemId="receivablePackageCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.receivablePackFilterVal = '';
			}
			resetAllMenuItemsInMultiSelect("#msReceivablePrdCat");
		}
		else if(strFieldName === 'creditAccount'){
			resetAllMenuItemsInMultiSelect("#msCreditAccount");
		}
		else if(strFieldName === 'ReceivableProduct'){
			resetAllMenuItemsInMultiSelect("#msReceivableProduct");
		}
		else if(strFieldName === 'clientReference'){
			$('#clientReference').val("");
		}
		else if(strFieldName === 'processingDate'){
			me.resetProcessingDateAsDefault();
		}
		else if(strFieldName === 'CreateDate'){
			selectedCreationDate = {};
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
			'Creation Date'));
			$('#creationDate').val("");	
		}
		else if(strFieldName === 'FileName'){
			$('#fileName').val("");
		}else if(strFieldName === 'PickupLocation')
		{
			$('#pickupLocation').val("");
		}
		else if (strFieldName === 'batchAmount') {
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountFieldFrom").val("");
			$("#amountFieldTo").val("");
			$(".amountTo").addClass("hidden");
			$("#msAmountLabel").text(getLabel("batchAmount","Batch Amount"));
			$('#amountOperator').niceSelect('update');
		}
		else if (strFieldName === 'AmountDdt') {
			$("#instAmountOperator").val($("#instAmountOperator option:first").val());
			$("#instAmountFieldFrom").val("");
			$("#instAmountFieldTo").val("");
			$(".instAmountTo").addClass("hidden");
			$("#msInstAmountLabel").text(getLabel("instAmount","Instrument Amount"));
			$('#instAmountOperator').niceSelect('update');
		}
		else if(strFieldName === 'virtualAccountNmbr')
		{
			$('#virtualAccNmbr').val("");
		}
	},
	handleFieldSync : function(type){
		var me = this;
		
		if(type == 'A')
		{
			var productCatValue = $("#msReceivablePrdCat").getMultiSelectValue();
			var productCatValueDesc = [];
			$('#msReceivablePrdCat :selected').each(function(i, selected) {
					productCatValueDesc[i] = $(selected).text();
				});
			me.handleProductCategory('A',productCatValue,productCatValueDesc);
			var processingDateLableVal = $('label[for="ProcessDateLabel"]').text();
			var processingDateField = $("#processDate");
			me.handleProcessingDateSync('A',processingDateLableVal,null,processingDateField);
		}
		else
		{
			var processDateLableVal = me.getEntryDateLabel();
			var sourceLable = processDateLableVal.initialConfig.text;
			var processDateField = $("#entryDataPicker");
			me.handleProcessingDateSync('Q', sourceLable, null, processDateField);
			var productCatValue = $("#msReceivablePrdCat").getMultiSelectValue();
			var productCatValueDesc = [];
			$('#msReceivablePrdCat :selected').each(function(i, selected) {
					productCatValueDesc[i] = $(selected).text();
				});
			me.handleProductCategory('A',productCatValue,productCatValueDesc);
		}
	},
	/*handleProcessingDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this,labelToChange, valueControlToChange, updatedDateValue;
		labelToChange = me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'A')? $('#entryDataPicker'): $('#processDate');
		//valueControlToChange = (valueChangedAt === 'A')? $('#processDate'): $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
				if (valueChangedAt === 'Q') {
					updateToolTip('entryDate', sourceToolTipText);
				}
				else {
					labelToChange.setText(sourceLable);
				}
				if (!Ext.isEmpty(updatedDateValue)) {
					valueControlToChange.datepick('setDate', updatedDateValue);
				}
			}
	},*/
	handleProcessingDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this,labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		//labelToChange = me.getEntryDateLabel();
		//valueControlToChange = (valueChangedAt === 'A')? $('#entryDataPicker'): $('#processDate');
		//valueControlToChange = (valueChangedAt === 'A')? $('#processDate'): $('#entryDataPicker');
		//updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
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
					updateToolTip('entryDate', sourceToolTipText);
				}
				else {
					labelToChange.setText(sourceLable);
				}
				if (!Ext.isEmpty(updatedDateValue)) {
					valueControlToChange.datepick('setDate', updatedDateValue);
				}
			}
	},
	handleProductCategory : function(type,productData,productDataDesc){
		var me = this;
		if (!Ext.isEmpty(type)) {
			if(type === 'Q'){
				var objProductCatField = $('#msReceivablePrdCat');
				var objQuickProductCatField = me.getReceivableSummaryQueryFilterView()
						.down('combo[itemId="receivablePackageCombo"]');
				if (!Ext.isEmpty(productData)) {
					objProductCatField.val([]);
					objProductCatField.val(productData);
				} else if (Ext.isEmpty(productData)) {
					objProductCatField.val([]);
				}
				objProductCatField.multiselect("refresh");
				if (objQuickProductCatField.isAllSelected()) {
					me.receivablePackFilterVal = 'all';
				}
			}
			else if(type === 'A')
			{
				var objQuickProductCatField = me.getReceivableSummaryQueryFilterView()
						.down('combo[itemId="receivablePackageCombo"]');
				if (!Ext.isEmpty(productData)) {
					//me.receivablePackFilterVal = 'all';
					objQuickProductCatField.setValue(productData);
					objQuickProductCatField.selectedOptions = productData;
				} else {
					objQuickProductCatField.setValue(productData);
					me.receivablePackFilterVal = '';
				}
				if (objQuickProductCatField.isAllSelected()) {
					me.receivablePackFilterVal = 'all';
				}
			}
		}
	},
	handleProductCatClick : function(combo){
		var me = this;
		me.receivablePackFilterVal = combo.getSelectedValues();
		me.handleProductCategory('Q',me.receivablePackFilterVal,null)
		//me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
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
});