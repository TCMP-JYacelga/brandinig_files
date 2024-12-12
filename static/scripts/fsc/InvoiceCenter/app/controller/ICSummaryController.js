Ext.define('GCP.controller.ICSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ICSummaryView', 	'Ext.tip.ToolTip'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			}, {
				ref : 'iCSummaryView',
				selector : 'iCSummaryView'
			}, {
				ref : 'groupView',
				selector : 'iCSummaryView groupView'
			},
			/* Quick Filter starts... */
			{
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'iCSummaryFilterView',
				selector : 'iCSummaryFilterView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'iCSummaryFilterView combo[itemId="quickFilterClientCombo"]'
			}, {
				ref : 'entryDateBtn',
				selector : 'iCSummaryFilterView button[itemId="entryDateBtn"]'
			}, {
				ref : 'entryDateLabel',
				selector : 'iCSummaryFilterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'iCSummaryFilterView  combo[itemId="savedFiltersCombo"]'
			},{
			    ref:'DateMenu',
			    selector : '#DateMenu'
			}
	/* Quick Filter ends... */
	],
	config : {
		/* Filter Ribbon Configs Starts */
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/ICCenterGroupViewFilter{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/ICCenterGroupViewFilter{0}/{1}.json',
		strModifySavedFilterUrl : 'services/userfilters/ICCenterGroupViewFilter{0}/{1}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/ICCenterGroupViewFilter{0}/{1}/remove.json',
		strPageName : 'invoiceCenter{0}',
		strGetModulePrefUrl : 'services/userpreferences/invoiceCenter{0}/{1}.json',
		strBatchActionUrl : 'services/invoiceCenter/{0}.json',
		strDefaultMask : '000000000000000000',
		intMaskSize : 13,
		strLocalStorageKey : 'page_invoice_center',

		datePickerSelectedDate : [],
		datePickerSelectedPOAdvDate : [],
		datePickerSelecteddueAdvDate : [],
		dateFilterLabel : getLabel('latest', 'Latest'),
		dateFilterVal : '',
		dateRangeFilterVal : '13',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		savedFilterVal : '',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		filterApplied : 'ALL',
		dateHandler : null,
		filterCodeValue : null,
		showAdvFilterCode : null,
		
		previouGrouByCode : null,
		reportGridOrder : null,
		clientFilterVal : (Ext.isEmpty(selectedFilterClient) ?  'all' : selectedFilterClient),
		clientFilterDesc : getLabel('selectedFilterClient', selectedFilterClientDesc),
		advFilterSelectedClientDesc : null,

		savePrefAdvFilterCode : null,
		localPreHandler : null,
		advFilterCodeApplied : null,
		EntryDateFilterVal : '',
		DueDateFilterVal : '',
		processDateFilterVal : '',
		advFilterProcessSelected : {},
		pODateFilterLabel : getLabel('today', 'Today'),
		EntryDateFilterLabel : getLabel('today', 'Today'),
		dueDateFilterLabel : getLabel('today', 'Today'),
		filtersAppliedCount : 1,
		pageSettingPopup : null,
		entryDateChanged :false,
		localSortState : [],
		objLocalData : null
		/* Filter Ribbon Configs Ends */
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
			
			me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
			
		}
		
		//populating advanced filter values on init
		populateAdvancedFilterFieldValue();
		
		if (!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		$("#savePrefMenuBtn").attr('disabled', true);
		$("#clearPrefMenuBtn").attr('disabled', true);
		$(document).on('wheelScroll', function(event) {
					me.handlWheelScroll();
				});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
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
					} else if (filterType == "invoiceDate") {
						me.pODateChange(btn, opts);
					}else if (filterType == "invoiceDueDate") {
						me.dueDateChange(btn, opts);
					}
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
					setClientCodeMenuItems("dropdownClientCode");
					setProductMenuItems("dropdownProduct");
				});
		$(document).on('handleLoggerChangeInQuickFilter',
				function() {
					me.handleLoggerChangeInQuickFilter(selectedFilterLoggerDesc);
				});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "entryDateFrom") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedEntryAdvDate = dates;
						me.entryDateFilterVal = me.dateRangeFilterVal;
						me.entryDateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
						updateToolTip('entryDate', " ("+me.entryDateFilterLabel+")");
					} else if (filterType == "invoiceDate") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedPOAdvDate = dates;
						me.pODateFilterVal = me.dateRangeFilterVal;
						me.pODateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handlePODateChange(me.dateRangeFilterVal);
						updateToolTip('invoiceDate', " ("+me.pODateFilterLabel+")");
					}else if (filterType == "invoiceDueDate") {
						me.dateRangeFilterVal = '13';
						me.datePickerSelecteddueAdvDate = dates;
						me.dueDateFilterVal = me.dateRangeFilterVal;
						me.dueDateFilterLabel = getLabel('daterange',
								'Date Range');
						me.handledueDateChange(me.dateRangeFilterVal);
						updateToolTip('invoiceDueDate', " ("+me.dueDateFilterLabel+")");
					}
				});
		$(document).on('handlePOverifyAction',
				function(event, strUrl, arrSelectedRecords, strAction) {
					var strActionType = null, grid;
					var groupView = me.getGroupView();
					var grid = groupView.getGrid();
					var objOfRecords = grid.getSelectedRecords();
					me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
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
			'iCSummaryView groupView' : {
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
						//	me.doHandleStateChange();
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
					me.firstTime = true;
				//	populateAdvancedFilterFieldValue();
					me.applyPreferences();
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'iCSummaryFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					// me.handleDateChange(me.dateFilterVal);
				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
				//	me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			},
			'iCSummaryFilterView  combo[itemId="statusCombo"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.statusFilterVal)
							&& 'all' != me.statusFilterVal)
						me.handleStatusFieldSync('A', me.statusFilterVal,
								me.statusFilterDesc);
				}
			},
			'iCSummaryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'iCSummaryFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterDesc)) {
						combo.setValue(me.clientFilterDesc);
						$('#msClient').val(me.clientFilterVal);
					} else {
						combo.setValue(combo.getStore().getAt(0));
						$('#msClient').val(combo.getStore().getAt(0));
					}
				}
			},
			'iCSummaryFilterView  combo[itemId="clientAuto"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterDesc)) {
						combo.setValue(me.clientFilterDesc);
						
					} 
				}
			},
			'iCSummaryFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'iCSummaryFilterView component[itemId="pOEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
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
							}
						}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						var entryDateLableVal = $('label[for="EntryDateLabel"]')
								.text();
						var entryDateField = $("#entryDateFrom");
						me.handleEntryDateSync('A', entryDateLableVal, null,
								entryDateField);
					} else if (!Ext.isEmpty(me.dateFilterVal)
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
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					getAdvancedFilterPopup('advanceFilterInvoice.form', 'filterForm');
					me.assignSavedFilter();
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
		
		var me = this,savedFilterCode = '';

		//applying preferences
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objPOSummaryPref = objPOBuyerSummaryPref;
			objSaveLocalStoragePref = objSaveLocalStoragePrefBuyer;
		}else if(selectedFilterLoggerDesc == 'SELLER'){
			objPOSummaryPref = objPOSellerSummaryPref;
			objSaveLocalStoragePref = objSaveLocalStoragePrefSeller;
		}
		
		if (objPOSummaryPref || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objPOSummaryPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
					savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
				}
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
					me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
					me.handleFieldSync();
				}
		}
		else
			me.applySavedDefaultPreference(objJsonData);
		}
		
		
		/*if(selectedFilterLoggerDesc == 'BUYER')
		{
			objPOSummaryPref = objPOBuyerSummaryPref;
			if (objPOSummaryPref) {
				var objJsonData = Ext.decode(objPOSummaryPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext
							.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							me.doHandleSavedFilterItemClick(advData);
							me.savedFilterVal = advData;
						}
					}
					else
						me.savedFilterVal = "";
				}
			}
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{
			objPOSummaryPref = objPOSellerSummaryPref;
			if (objPOSummaryPref) {
				var objJsonData = Ext.decode(objPOSummaryPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext
							.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							me.doHandleSavedFilterItemClick(advData);
							me.savedFilterVal = advData;
						}
					}
					else
							me.savedFilterVal = "";
				}
			}
		}*/
			
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences)) {
			if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
				me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
				me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
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
		var objSummaryView = me.getICSummaryView(), gridModel = null, objData = null;
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
		objGroupView.reconfigureGrid(gridModel);
	},

	/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
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
			me.preferenceHandler.readPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
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
				me.preferenceHandler.saveModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
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
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
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
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objPOSummaryPref = objPOBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objPOSummaryPref = objPOSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		if (!Ext.isEmpty(objPOSummaryPref)) {
			objPrefData = Ext.decode(objPOSummaryPref);
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
					: Ext.decode(me.getJsonObj(arrGenericColumnModel) || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/ICCenterGroupViewFilter'+selectedFilterLoggerDesc+'.json';
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

	
	/*handling of local preferences starts here*/
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		me.localSortState = grid.getSortState();
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(me.localSortState) ? me.localSortState :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState){
		var me = this;
		var args = {},pageName = Ext.String.format(me.strPageName, selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this;
		var pageName = Ext.String.format(me.strPageName, selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';
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
		if(selectedFilterLoggerDesc == 'BUYER'){
			objSaveLocalStoragePrefBuyer = objSaveLocalStoragePref;
		} else if(selectedFilterLoggerDesc == 'SELLER'){
			objSaveLocalStoragePrefSeller = objSaveLocalStoragePref;
		}
	},
	/*handling of local preferences ends here*/
	
	/*handling of clearing local preferences starts here*/
	handleClearLocalPrefernces : function(){
		var me = this;
		var args = {},pageName = Ext.String.format(me.strPageName, selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';;
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this;
		var args = {},pageName = Ext.String.format(me.strPageName, selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';
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
	/*handling of clearing local preferences ends here*/
	
	
	/* State handling at local storage starts */
	doHandleStateChange : function() {
	
	},
	doDeleteLocalState : function(){
		var me = this;

	},
	/* State handling at local storage ends */
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
			me.preferenceHandler.readModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();

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
 

postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) { 
		var me = this;
		me.filtersAppliedCount = 1;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		
		//applying local preferences
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
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
			}
		}
		
		var tempArrOfParseQuickFilter = [];
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('seller', 'Seller') : getLabel('buyer', 'Buyer'));
		loggedInAsFilter = {"fieldId" : "loggedInAs","fieldLabel": getLabel('sellerOrBuyerr', 'View as'), "dataType":"S","operatorValue":"eq","fieldTipValue":clientModeDesc,"fieldValue" :clientModeDesc};
		tempArrOfParseQuickFilter.push(loggedInAsFilter);
		for(var index = 0; index < arrOfParseQuickFilter.length; index++)
		{
			if(arrOfParseQuickFilter[index].fieldId !== "createdBy")
			{
				tempArrOfParseQuickFilter[index + 1] = arrOfParseQuickFilter[index];
			}
			if((arrOfParseQuickFilter[index].fieldId === "Client") &&(arrOfParseQuickFilter[index].fieldValue === undefined))
			{
				tempArrOfParseQuickFilter[index + 1].fieldValue ="All Companies";
				tempArrOfParseQuickFilter[index + 1].fieldTipValue ="All Companies";
			}
		}
		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = tempArrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
		 			
		if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
		me.filtersAppliedCount = arrOfFilteredApplied.length;
		me.handleClearFilterButtonHideAndShow();
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);

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
				me
						.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		} else {
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		maskArray.push(buttonMask);
		var isCrossCcy = false;
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
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
		var isClientFilterApplied = false;
		var strClientFilterUrl='';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		var filterData = me.filterData;
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
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].paramName === "Client")
			{
					strClientFilterUrl = filterData[index].paramValue1;
			}
			if (!Ext.isEmpty(strClientFilterUrl)) {
				strUrl += '&$clientFilter=' + strClientFilterUrl;
				isClientFilterApplied = true;
			}
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
	enableNachaDownloadOption : function(arrSelectedRecords) {

	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords, strActionType);
		} else if (strAction === 'submit' || strAction === 'authourize' || strAction === 'send') {
				me.preHandleGroupActions(strUrl, '',
								grid, arrSelectedRecords,
								strActionType, strAction);

		} else if (strAction === 'uploadToOtherSystem') {
			me.doUploadToOtherSystem(arrSelectedRecords);
		} else if (strAction === 'payNow') {
			 me.doSubmitForAdvancePayment('invoicePayment.form', arrSelectedRecords, null, grid);
		} else if ( (strAction === 'verify' && selectedFilterLoggerDesc == 'SELLER')){
				showAcceptancePopup(arrSelectedRecords);
		} else {
				me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords, strActionType, strAction);
		}
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
								selectedClient : records[index].data.company
								
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
								groupView.setLoading(false);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								groupView.refreshData();
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
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		actionData = jsonData;
		Ext.each(actionData, function(result) {
			msg = '';
			intSerialNo = parseInt(result.serialNo,10);
			record = grid.getRecord(intSerialNo);
			row = grid.getRow(intSerialNo);
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
				if (!Ext.isEmpty(errCode))
					strIsProductCutOff = 'Y';
				if (errCode.indexOf('SHOWPOPUP') != -1) {
					showPopup = 'Y';
				}
			});
			
				row = grid.getRow(intSerialNo);
				grid.deSelectRecord(record);
				arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('invoiceNumber'),
							actionMessage : result.success === 'Y'
									? strActionSuccess
									: msg
						});
			
		});
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
	/*
	 * me.doHandleProcessDateCalculation(strAction, strUrl, grid,
	 * arrSelectedRecords, strActionType);
	 */
	doHandleProcessDateCalculation : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType, paymentFxInfo) {
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
									title : getLabel('instrumentWarning',
											'Warning'),
									msg : strMsg1 + !Ext.isEmpty(strMsg2)
											? '\n' + strMsg2
											: '',
									buttons : Ext.Msg.OKCANCEL,
									buttonText:{
										ok: getLabel('btnOk','OK'),
										cancel:getLabel('btnCancel','Cancel')
									},
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
		if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'authourize'
				|| actionName === 'send' || actionName === 'reject'
				) {
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				//me.showHistory(record.get('history').__deferred.uri);
			}
		} else if (actionName === 'btnView' || actionName === 'btnEdit') {
		
			var strUrl = '', objFormData = {};
			if (actionName === 'btnEdit')
			{
				strUrl = 'editInvoice.form';
			}
			else if (actionName === 'btnView')
			{
				strUrl = 'viewInvoice.form';
			}
			 
			me.doSubmitForm(strUrl, record, actionName); 
		}
		else if (actionName === 'payNow') {
			var strUrl = '', objFormData = {};
			strUrl = 'invoicePayment.form';
			var recArray = new Array();
			recArray.push(record);
			me.doSubmitForAdvancePayment(strUrl, recArray, actionName, grid); 
		}
		else if (actionName === 'requestFinance') {
			var strUrl = '', objFormData = {};
			strUrl = 'invoiceFinanceEntry.form';
			me.doSubmitForm(strUrl, record, actionName); 
		}
		else if (actionName === 'accept') {
			if(selectedFilterLoggerDesc == 'SELLER'){
				var arrSelectedRecords = [];
				arrSelectedRecords[0] = record;
				showAcceptancePopup(arrSelectedRecords);
			}else{
				var strUrl = '', objFormData = {};
				strUrl = 'showAcceptance.form';
				me.doSubmitForm(strUrl, record, actionName); 
			}
		}
		else if (actionName === 'addInvoice') {
			var strUrl = '', objFormData = {};
			strUrl = 'newInvoice.form';
			me.doCreateInvoice(strUrl, record, actionName); 
		}
		else if (actionName === 'verify') {
			if (selectedFilterLoggerDesc == 'BUYER'){
				var strUrl = '', objFormData = {};
				strUrl = 'showAcceptance.form';
				me.doSubmitForm(strUrl, record, actionName);
			}else{
				var arrSelectedRecords = [];
				arrSelectedRecords[0] = record;
				showAcceptancePopup(arrSelectedRecords);
			}
		}
		else if (actionName === 'paymentBond') {
			var strUrl = '', objFormData = {};
			strUrl = 'invoicePaymentBondEntry.form';
			me.doSubmitForm(strUrl, record, actionName); 
		}
	},
	doSubmitForm : function(strUrl, record, actionName) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInvIntRefNum',
				record.data.invoiceNumber));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				record.data.identifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPOCenterClientCode',	record.data.company));				
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'enteredByClient',	record.data.company));		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	doHandlePayNowAction : function(strUrl, arrSelectedRecords, actionName ){
		var me = this,strClient = null;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		//form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInvNum',
		//		record.data.poInternalRefNmbr));
		var arrayJson = new Array();
		$.each(arrSelectedRecords, function(index, cfg) {
			//strClient = cfg.data.companyName;
			arrayJson.push({"viewState" :cfg.data.identifier});			
		});
				
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				Ext.encode(arrayJson)));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLCMyClientCode',
				(arrSelectedRecords[0].data.company)));		
				
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	doSubmitForAdvancePayment : function(strUrl, arrSelectedRecords, actionName, grid) {
		var me = this;
		var groupView = me.getGroupView();
		groupView.setLoading(true);
		var arrayJson = new Array();
		var records = (arrSelectedRecords || []);
		for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								selectedClient : records[index].data.company
							});
		}
		Ext.Ajax.request({
			url : 'services/invoiceCenter/validateInvoicePayment',
			method : 'POST',
			jsonData : Ext.encode(arrayJson),
			success : function(jsonData) {
				groupView.setLoading(false);
				var jsonRes = Ext.JSON
						.decode(jsonData.responseText);
				if (jsonRes && jsonRes.d && jsonRes.d.isError
						&& jsonRes.d.isError) {

					me.postHandleGroupAction(
							jsonRes.d.resultList, grid,
							'PayNow', 'rowAction', records);
				} else {
					me.doHandlePayNowAction(strUrl,
							arrSelectedRecords, actionName);
				}
				// groupView.refreshData();
			},
			failure : function() {
				var errMsg = "";
				groupView.setLoading(false);
				Ext.MessageBox.show({
					title : getLabel(
							'invoiceErrorPopUpTitle',
							'Error'),
					msg : getLabel('invoiceErrorPopUpMsg',
							'Error while fetching data..!'),
					buttons : Ext.MessageBox.OK,
					cls : 't7-popup',
					icon : Ext.MessageBox.ERROR
				});
			}
		});
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

	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');
		/* var toDatePickerRef = $('#entryDataToPicker'); */
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('entryDate', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
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
	
		if (objDateParams.operator == 'eq')
			dateToField = "";
		else
			dateToField = vToDate;
	
		selectedEntryDate = {
			operator : objDateParams.operator,
			fromDate : vFromDate,
			toDate : dateToField,
			dateLabel : objDateParams.label
		};

		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " ("
						+ me.dateFilterLabel + ")", datePickerRef);

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
			} else {
				labelToChange.setText(!Ext.isEmpty(selectedEntryDate.dateLabel) ? getLabel('entryDate','Entry Date')+ " ("
						+ selectedEntryDate.dateLabel + ")" : getLabel('entryDate','Entry Date'));
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
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
		var strUrl = 'services/userpreferences/invoiceCenter{0}/groupViewAdvanceFilter.json';
		Ext.Ajax.request({
			url : Ext.String.format(strUrl, selectedFilterLoggerDesc),
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
	//	me.doHandleStateChange();
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
			strUrl = Ext.String.format(strUrl, selectedFilterLoggerDesc, objFilterName);
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
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, selectedFilterLoggerDesc, filterCode);
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
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
			me.savedFilterVal = savedFilterVal;
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
		me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "invoiceBatchNumber");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "invoiceBatchNumber");
			me.filterData = arrQuickJson;
		}
		var reqJson = me.findInAdvFilterData(objJson, "invoiceNumber");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "invoiceNumber");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "poreferenceNumber");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"poreferenceNumber");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "invoiceDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "invoiceDate");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;
		
		reqJson = me.findInAdvFilterData(objJson, "invoiceDueDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "invoiceDueDate");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;
		
		reqJson = me.findInAdvFilterData(objJson, "invoiceAmount");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "invoiceAmount");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		reqJson = me.findInAdvFilterData(objJson, "scmMyProductName");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "scmMyProductName");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		reqJson = me.findInAdvFilterData(objJson, "invoiceStatus");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"invoiceStatus");
			me.filterData = arrQuickJson;
		}
		
		reqJson = me.findInAdvFilterData(objJson, "ClientCode");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "ClientCode");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		reqJson = me.findInAdvFilterData(objJson, "createdBy");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "createdBy");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;
		
		reqJson = me.findInAdvFilterData(objJson, "EntryDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "EntryDate");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if (!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;

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
		var statusFilterValArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var entryDateValArray = [];
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var jsonArray = [];
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'EntryDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('entryDate', 'Entry Date')
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
						paramName :'invoiceStatus',
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
						paramFieldLable : getLabel('lblcompanyName', 'Company Name'),
						displayValue1 : clientFilterDesc
					});
		}
		if (strSeller != null && strSeller != 'all' && strSeller != '') {
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
		/*if (!Ext.isEmpty(createdByVal) && (me.filterApplied == 'Q')) { 
			jsonArray.push({
						paramName : 'createdBy',
						paramValue1 : createdByVal,
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('createdBy', 'Created By'),
						displayValue1 : createdByVal
					});
		}*/
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
		if (groupInfo && groupInfo.groupTypeCode === 'PAYSUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else {

			me.refreshData();
		}
	},
	hideQuickFilter : function() {

	},
	doSearchOnly : function() {
		var me = this;
		/*var clientComboBox = me.getICSummaryFilterView()
				.down('combo[itemId="clientCombo"]');
		if (selectedClient != null && $('#msClient').val() != 'all') {
			clientComboBox.setValue(selectedClient);
		} else if ($('#msClient').val() == 'all') {
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}*/
		var statusChangedValue = $("#pOStatus").getMultiSelectValue();
		var statusValueDesc = [];
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateFrom");
		$('#pOStatus :selected').each(function(i, selected) {
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
			strFilterCodeVal = me.filterCodeValue;
		}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		me.savedFilterVal = FilterCode;
		
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
	//	me.doHandleStateChange();
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
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, selectedFilterLoggerDesc, FilterCodeVal);
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
	handleLoggerChangeInQuickFilter : function(selectedFilterLoggerDesc) {
		var me = this;
		var gridPanel = me.getICSummaryView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getICSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getICSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getICSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
		me.localSortState = [];
		me.savedFilterVal = '';
		me.advFilterData = '';
		var buyerSellerPref={}, args={};
		var savedFilterComboBox = me.getICSummaryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		
		me.advFilterData = '';
		var pageName = Ext.String.format(me.strPageName, selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';
		me.preferenceHandler.readPagePreferences(strLocalPrefPageName,
				me.updateObjLocalPref, args, me, false);
		if(selectedFilterLoggerDesc =='BUYER'){
			buyerSellerPref = Ext.decode(objSaveLocalStoragePrefBuyer);
		}else
		{
			buyerSellerPref =  Ext.decode(objSaveLocalStoragePrefSeller);
		}
		//advanced filter data
		if(buyerSellerPref.d.preferences && buyerSellerPref.d.preferences.tempPref && buyerSellerPref.d.preferences.tempPref.advFilterJson && allowLocalPreference === 'Y')
		{
			me.advFilterData =buyerSellerPref.d.preferences.tempPref.advFilterJson.filterBy;
			if(buyerSellerPref.d.preferences.tempPref.advFilterCode){
				me.savedFilterVal = buyerSellerPref.d.preferences.tempPref.advFilterCode;
			}
		}	
		//sorters
		if (!Ext.isEmpty(buyerSellerPref.d.preferences) && (!Ext.isEmpty(buyerSellerPref.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPref.d.preferences.tempPref.sorter) && allowLocalPreference === 'Y'  )
		{
			me.localSortState = buyerSellerPref.d.preferences.tempPref.sorter;
		}	
		me.getSavedFilterData(me.savedFilterVal, me.populateSavedFilter, true);
		
		if(me.savedFilterVal === "")				
		{
			// reset all fields and applu default entry date filter as 'today'
			me.resetAllFields();
			me.refreshData();
			me.dateFilterVal = '1'; // Set to Today
			me.dateFilterLabel = getLabel('today', 'Today');
			me.handleDateChange(me.dateFilterVal);
			me.setDataForFilter();
			me.applyQuickFilter();
			var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
			var entryDateField = $("#entryDateFrom");
			me.handleEntryDateSync('A', entryDateLableVal, null,
									entryDateField);
		
		}
		savedFilterComboBox.setValue(me.savedFilterVal);
		me.applyPreferences();	
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
		var statusChangedValue = $("#pOStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#pOStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString());
		
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateFrom");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
	},
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "entryDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled = 'Q';
			me.datePickerSelectedDate = [];
			me.datePickerSelectedEntryDate = [];
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
			var clientComboBox = me.getICSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
			setClientCodeMenuItems("dropdownClientCode");
			setProductMenuItems("dropdownProduct");
		} else {
			var clientComboBox = me.getICSummaryFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}

		var statusComboBox = me.getICSummaryFilterView()
				.down('combo[itemId="statusCombo"]');
		me.statusFilterVal = 'all';

		statusComboBox.selectAllValues();
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getICSummaryFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		var entryDatePicker = me.getICSummaryFilterView()
				.down('component[itemId="entryDataPicker"]');
		me.dateFilterVal = '';
		me.dateFilterLabel = '';
		me.handleDateChange(me.dateFilterVal);
		me.getEntryDateLabel().setText(getLabel('entryDate', 'Entry Date'));
		datePickerRef.val('');
		toDatePickerRef.val('');
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');

		$("#summaryClientFilter").val('');

		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();

	},
	pODateChange : function(btn, opts) {
		var me = this;
		me.pODateFilterVal = btn.btnValue;
		me.pODateFilterLabel = btn.text;
		me.handlePODateChange(btn.btnValue);
	},
	dueDateChange : function(btn, opts) {
		var me = this;
		me.dueDateFilterVal = btn.btnValue;
		me.dueDateFilterLabel = btn.text;
		me.handledueDateChange(btn.btnValue);
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
		if (!Ext.isEmpty(me.entryDateFilterLabel)) {
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
					'Entry Date')
					+ " (" + me.entryDateFilterLabel + ")");
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
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#entryDateFrom').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#entryDateFrom').datepick('setDate', vFromDate);
				} else {
					$('#entryDateFrom').datepick('setDate', vFromDate);
				}
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
				dateLabel : objDateParams.label
			};
		}
	},
	handlePODateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'invoiceDate');

		if (!Ext.isEmpty(me.pODateFilterLabel)) {
			$('label[for="pODateLabel"]').text(getLabel('invoiceDate',
					'Date')
					+ " (" + me.pODateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#pOODate').datepick('setDate', vFromDate);
			} else {
				$('#pODate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedPODate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#pODate').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#pODate').datepick('setDate', vFromDate);
				}else {
					$('#pODate').datepick('setDate', vFromDate);

				}
			} else {
				$('#pODate').datepick('setDate', [vFromDate, vToDate]);

			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedPODate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		}
	},
	handledueDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'invoiceDueDate');

		if (!Ext.isEmpty(me.dueDateFilterLabel)) {
			$('label[for="dueDateLabel"]').text(getLabel('invoiceDueDate',
					'Due Date')
					+ " (" + me.dueDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#dueDate').datepick('setDate', vFromDate);
			} else {
				$('#dueDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selecteddueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#dueDate').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#dueDate').datepick('setDate', vFromDate);
				}else {
					$('#dueDate').datepick('setDate', vFromDate);

				}
			} else {
				$('#dueDate').datepick('setDate', [vFromDate, vToDate]);

			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selecteddueDate = {
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
				label = '';
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
				}
				else{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'le';
				}
				label = 'Latest';
				break;
			 case '14' :
				// Last Month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month Only';
				break;	
			 case '13' :
				// Date Range
				label = 'Date Range';
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
				if ('entryDate' === dateType
						&& !isEmpty(me.datePickerSelectedEntryAdvDate)) {
					if (me.datePickerSelectedEntryAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
				if ('invoiceDate' === dateType
						&& !isEmpty(me.datePickerSelectedPOAdvDate)) {
					if (me.datePickerSelectedPOAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedPOAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedPOAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedPOAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedPOAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
				if ('invoiceDueDate' === dateType
						&& !isEmpty(me.datePickerSelecteddueAdvDate)) {
					if (me.datePickerSelecteddueAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelecteddueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelecteddueAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelecteddueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelecteddueAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
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
		var fieldType = '';
		var columnId = '';
	
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
			if (fieldName === 'invoiceBatchNumber') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#txtBatchReference").val(fieldVal);
			}else if (fieldName === 'invoiceNumber') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#txtInvoiceReference").val(fieldVal);
			} else if (fieldName === 'poreferenceNumber') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("#txtPoReference").val(fieldVal);
			} else if (fieldName === 'invoiceAmount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'createdBy') {
				columnId = fieldVal;
				var updateVal;
				if(fieldVal === 'Client' )
					updateVal= 'C';
				else if (fieldVal === 'Bank' )
					updateVal= 'B';
				$("#createdBy").val(updateVal);
				$("#createdBy").niceSelect('update');
			} 
			if (fieldName === 'EntryDate'|| fieldName === 'invoiceDate' || fieldName === 'invoiceDueDate') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			} 
			else if (fieldName === 'invoiceStatus') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'invoiceStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}
			else if (fieldName === 'Product') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'Product' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}
			else if (fieldName === 'Beneficiary') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'Beneficiary' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
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

			if (dateType === 'invoiceDate') {
				selectedPODate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				dateFilterRefFrom = $('#pODate');
				$('label[for="pODateLabel"]').text(!Ext.isEmpty(selectedPODate.dateLabel) ? getLabel('date','Date')+ " ("
						+ selectedPODate.dateLabel + ")" : getLabel('date','Date'));
				/* dateFilterRefTo = $('#creationDateTo'); */
			} else if (dateType === 'EntryDate') {
				selectedEntryDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				dateFilterRefFrom = $('#entryDateFrom');
				me.getEntryDateLabel().setText(!Ext.isEmpty(selectedEntryDate.dateLabel) ? getLabel('entryDate','Entry Date')+ " ("
						+ selectedEntryDate.dateLabel + ")" : getLabel('entryDate','Entry Date'));
				
			}else if (dateType === 'invoiceDueDate') {
				selecteddueDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate,
						dateLabel : data.dropdownLabel
					};
					dateFilterRefFrom = $('#dueDate');
					$('label[for="dueDateLabel"]').text(!Ext.isEmpty(selecteddueDate.dateLabel) ? getLabel('dueDate','Due Date')+ " ("
							+ selecteddueDate.dateLabel + ")" : getLabel('dueDate','Due Date'));
				} 

			if (dateOperator === 'eq') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
						/*$(dateFilterRefTo).setDateRangePickerValue(formattedToDate);*/
					}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'Product') {
			menuRef = $("select[id='dropdownProduct']");
			elementId = '#dropdownProduct';
		} else if (componentName === 'Beneficiary') {
			menuRef = $("select[id='dropdownClientCode']");
			elementId = '#dropdownClientCode';
		} else if (componentName === 'invoiceStatus') {
			menuRef = $("select[id='POStatus']");
			elementId = '#pOStatus';
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
			if (componentName === 'Product') {
				productFilterVal = dataArray;
			}

			if (componentName === 'invoiceStatus') {
				selectedStatusListSumm = dataArray;
			}
			if (componentName === 'Beneficiary') {
				selectedBeneList = dataArray;
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
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#txtAmount");
		var amountFieldRefTo = $("#amountFieldTo");
		amountFieldRefTo.addClass('hidden');
		$('.amountTo').addClass('hidden');
		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOperator').val(operator);
				$('#amountOperator').niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#msAmountLabel").text(getLabel("amountFrom","Amount From"));
						$("#txtAmount").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
						amountFieldRefTo.removeClass('hidden');
						$('.amountTo').removeClass('hidden');
					}else{
						amountFieldRefTo.addClass('hidden');
						$('.amountTo').addClass('hidden');
					}
				}
			}
		}
	},
	resetAllFields : function() {
		var me = this;
		$('#msClient').val('all');
		$("#saveFilterChkBox").attr('checked', false);

		selectedPODate = {};
		me.datePickerSelectedPOAdvDate = [];
		$('#pODate').val("");
		$('label[for="pODateLabel"]').text(getLabel('Date','Date'));
		updateToolTip('invoiceDate',null);
		selecteddueDate = {};
		me.datePickerSelecteddueAdvDate = [];
		$('#dueDate').val("");
		$('label[for="dueDateLabel"]').text(getLabel('dueDate',
				'Due Date'));
		updateToolTip('invoiceDueDate',null);
		$("#txtBatchReference").val("");
		$("#txtInvoiceReference").val("");
		$("#txtPoReference").val("");
		$("#amountOperator").val($("#amountOperator option:first").val());	
		$("#txtAmount").val("");
		$("#amountFieldTo").val("");
		$(".amountTo").addClass("hidden");
		$("#msAmountLabel").text(getLabel("amount","Amount"));
		resetAllMenuItemsInMultiSelect("#dropdownClientCode");
		resetAllMenuItemsInMultiSelect("#dropdownProduct");
		resetAllMenuItemsInMultiSelect("#pOStatus");
		$("#createdBy").val($("#createdBy option:first").val());
		$("input[type='text'][id='savedFilterAs']").val("");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		var objField = me.getICSummaryFilterView()
				.down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
		selectedEntryDate = {};
		me.datePickerSelectedEntryAdvDate = [];
		$("#entryDateFrom").val("");
		$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
				'Entry Date'));
		updateToolTip('entryDate',null);
		me.getEntryDateLabel().setText(getLabel('entryDate', 'Entry Date'));
		$('#entryDataPicker').val("");
		$('#msClient').niceSelect('update');
		$('#amountOperator').niceSelect('update');
		$("#dropdownClientCode").niceSelect('update');
		$("#dropdownProduct").niceSelect('update');
		$("#createdBy").niceSelect('update');
	},
	/*--------------------Quick Filter End--------------------------*/
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
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#pOStatus");
				var objQuickStatusField = me.getICSummaryFilterView()
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
				var objStatusField = me.getICSummaryFilterView()
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

	doUploadToOtherSystem : function(arrSelectedRecords) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		var arrayJson = new Array();
		$.each(arrSelectedRecords, function(index, cfg) {
			arrayJson.push({"viewState" :cfg.data.identifier});			
		});
		
	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				Ext.encode(arrayJson)));
				
		form.action = 'invoiceDownload.seek';
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	doCreateInvoice : function(strUrl, record, actionName) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProductCode',
				record.data.scmMyProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProductName',
				record.data.scmMyProductDesc));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProductWorkflow',
				record.data.productWorkflow));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProductRelClient',
				record.data.mypRelClient));	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPoRef',
						record.data.poReferenceNmbr));	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPoInternalReference',
						record.data.poInternalRefNmbr));	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'dealerVendorFromPO',
						record.data.dealerVendorCode));	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProductClient',
						(!Ext.isEmpty(selectedClient) ? selectedClient : strClient)));					
		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
		downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/invoiceCenterReport/'+selectedFilterLoggerDesc+'.'+strExtension;
		strUrl += '?$skip=1';
		filterData = me.filterData;
		//strUrl += this.getFilterUrl();
		//var filterUrl = me.generateFilterUrl();
		var groupView = me.getGroupView(), subGroupInfo = groupView
			.getSubGroupInfo()
			|| {}, objPref = {}, groupInfo = groupView
			.getGroupInfo()
			|| '{}', strModule = subGroupInfo.groupCode;
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
		if(!Ext.isEmpty(me.filterValidityName) && "ALL" !== me.filterValidityName){
				strUrl += "&validity=" +me.filterValidityName;
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
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex])
					colArray.push(arrDownloadReportColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() + ']';
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
	
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'invoiceStatus') {
			var objField = me.getICSummaryFilterView()
					.down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			resetAllMenuItemsInMultiSelect("#pOStatus");
		} else if (strFieldName === 'EntryDate') {
			var datePickerRef = $('#entryDataPicker');
			me.dateFilterVal = '';
			me.getEntryDateLabel().setText(getLabel('entryDate', 'Entry Date'));
			datePickerRef.val('');

			selectedEntryDate = {};
			me.datePickerSelectedEntryAdvDate = [];
			$("#entryDateFrom").val("");
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
					'Entry Date'));
			updateToolTip('entryDate',null);
		} else if (strFieldName === 'invoiceBatchNumber') {
			$("#txtBatchReference").val("");
		}else if (strFieldName === 'invoiceNumber') {
			$("#txtInvoiceReference").val("");
		} else if (strFieldName === 'poreferenceNumber') {
			$("#txtPoReference").val("");
		} else if (strFieldName === 'invoiceDate') {
			selectedPODate = {};
			me.datePickerSelectedPOAdvDate = [];
			$('#pODate').val("");
			$('label[for="pODateLabel"]').text(getLabel('Date',
					'Date'));
			updateToolTip('invoiceDate',null);
		} else if (strFieldName === 'invoiceDueDate') {
			selecteddueDate = {};
			me.datePickerSelecteddueAdvDate = [];
			$('#dueDate').val("");
			$('label[for="dueDateLabel"]').text(getLabel('dueDate',
					'Due Date'));
			updateToolTip('invoiceDueDate',null);
		} else if (strFieldName === 'invoiceAmount') {
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#txtAmount").val("");
			$("#amountFieldTo").val("");
		} else if (strFieldName === 'Beneficiary') {
			resetAllMenuItemsInMultiSelect("#dropdownClientCode");
		} else if (strFieldName === 'scmMyProductName') {
			resetAllMenuItemsInMultiSelect("#dropdownProduct");
		} else if (strFieldName === 'createdBy') {
			$("#createdBy").val($("#createdBy option:first").val());
		} else if (strFieldName === 'Client') {
			if (isClientUser()) {
				var clientComboBox = me.getICSummaryFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
				setClientCodeMenuItems("dropdownClientCode");
				setProductMenuItems("dropdownProduct");
			} else {
				var clientComboBox = me.getICSummaryFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
		$('#amountOperator').niceSelect('update');
		$("#dropdownClientCode").niceSelect('update');
		$("#dropdownProduct").niceSelect('update');
		$("#createdBy").niceSelect('update');
	},
	assignSavedFilter : function() {
		var me = this,savedFilterCode='';
		if (me.firstTime) {
			me.firstTime = false;

			if (objPOSummaryPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objPOSummaryPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
							me.handleFieldSync();
						}
				}else if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if (advData === me.getPOSummaryFilterView()
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
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid, 	arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('PORemarkPopUpTitle',
					'Please enter return remark');
			titleMsg = getLabel('PORemarkPopUpFldLbl',
					'Return Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText:{
						ok: getLabel('btnOk','OK'),
						cancel:getLabel('btnCancel','Cancel')
					},
					multiline : 4,
					cls : 't7-popup',
					width: 355,
					height : 270,
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
	handleClearFilterButtonHideAndShow : function()
	{
		var me = this;
		var filterView = me.getFilterView();
		if(me.filtersAppliedCount <= 1)
			filterView.down('button[itemId="clearSettingsButton"]').hide();
		else
			filterView.down('button[itemId="clearSettingsButton"]').show();
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('seller', 'Seller') : getLabel('buyer', 'Buyer'));
		var loggedInDisplayText = Ext.String.format('{0} : {1}', getLabel('sellerOrBuyerr', 'View as'), clientModeDesc);
		if(!Ext.isEmpty(filterView.down('button[text='+loggedInDisplayText+']')))
		{
			filterView.down('button[text='+loggedInDisplayText+']').addCls('no-close-icon');
			filterView.down('button[text='+loggedInDisplayText+']').setIconCls('');
		}
	}
});
