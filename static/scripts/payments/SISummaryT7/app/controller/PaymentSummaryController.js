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
	requires : [Ext.ux.gcp.DateUtil],
	views : ['GCP.view.PaymentSummaryView', 'GCP.view.HistoryPopup', 'Ext.tip.ToolTip'],
	refs : [{
				ref : 'paymentSummaryView',
				selector : 'paymentSummaryView'
			}, {
				ref : 'groupView',
				selector : 'paymentSummaryView groupView'
			},
			/*Quick Filter starts...*/
			{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			},{
				ref:'paymentSummaryFilterView',
				selector:'paymentSummaryFilterView'
			},{
				ref:'quickFilterClientCombo',
				selector:'paymentSummaryFilterView combo[itemId="clientCombo"]'
			},{
				ref:'quickFilterClientAuto',
				selector:'paymentSummaryFilterView combo[itemId="clientAuto"]'
			},{
				ref:'paymentTypeCombo',
				selector:'paymentSummaryFilterView combo[itemId="paymentTypeCombo"]'
			},{
				ref:'entryDateBtn',
				selector:'paymentSummaryFilterView button[itemId="entryDateBtn"]'
			},{
				ref : 'entryDateLabel',
				selector : 'paymentSummaryFilterView label[itemId="entryDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'paymentSummaryFilterView  combo[itemId="savedFiltersCombo"]'
			},{
			    ref:'DateMenu',
			    selector : '#DateMenu'
			}
			/*Quick Filter ends...*/
			],
	config : {
		/* Filter Ribbon Configs Starts */
		strPaymentTypeUrl : 'services/instrumentType.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/siGroupViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/siGroupViewFilter/{0}.json',
		strModifySavedFilterUrl : 'services/userfilters/siGroupViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/siGroupViewFilter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/sisummary.json',
		strGetModulePrefUrl : 'services/userpreferences/sisummary/{0}.json',
		strBatchActionUrl : 'services/standingInstructions/{0}',
		strAdvFilterUrl : 'services/userpreferences/sisummary/groupViewAdvanceFilter.json',
		strDefaultMask : '000000000000000000000',
		intMaskSize : 21,
		strPageName : 'sisummary',
		
		datePickerSelectedDate : [],
		dateFilterLabel : getDateIndexLabel(defaultDateIndex),
		dateFilterVal : defaultDateIndex,
		dateRangeFilterVal : '',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		paymentTypeFilterVal : 'all',
		paymentTypeFilterDesc : 'All',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		savedFilterVal:'',
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
		scheduleDateFilterVal:'',
		advFilterProcessSelected:{},
		effectiveDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		creationDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		scheduleDateFilterLabel: getDateIndexLabel(defaultDateIndex),
		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,
		pageKey : 'siStdViewPref',
		paymentTypeAdvFilterVal : null,
		filterMode : '',
		advFilterSelectedClientCode : null,
		entryDateFilterVal : defaultDateIndex,
		entryDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		entryDateChanged : false,
		tranInfoSection : false
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
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
			
			me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
			
		}
		
		populateAdvancedFilterFieldValue();
		//me.updateFilterConfig();
		$(document).on('wheelScroll', function(event) {
					me.handlWheelScroll();
				});
		$(document).on('savePreference', function(event) {
			//	me.toggleSavePrefrenceAction(false);
				me.handleSavePreferences();
		});
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		});
		$(document).on('clearPreference', function(event) {
				me.handleClearPreferences();
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
		$(document).on('updateQuickFilterClient',
				function(event,value) {
					me.updateQuickFilterClient(value);
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter){
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
			 if ((filterType == "entryDateAdvFilter")||(filterType=="entryDateQuickFilter")){
				 me.handleEntryDateChange(filterType,btn,opts);
			 }else if(filterType == "creationDate"){
				 me.creationDateChange(btn,opts);
			 }else if(filterType == "scheduleDate"){
				 me.scheduleDateChange(btn,opts);
			 }else if(filterType == "effectiveDate"){
				 me.effectiveDateChange(btn,opts);
			 }
		});
 		$(document).on('deleteFilterEvent', function(event, filterCode) {
			me.deleteFilterSet(filterCode);
		});
		$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
			//me.orderUpDown(grid, rowIndex, direction)
		});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
			me.viewFilterData(grid, rowIndex);
		});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
			me.editFilterData(grid, rowIndex);
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue=null;
		});
		$(document).on("datePickPopupSelectedDate",function(event,filterType,dates){
			me.dateRangeFilterVal = '13';
			me.datePickerSelectedDate=dates;
			if(filterType=="creationDate"){
				me.creationDateFilterVal = me.dateRangeFilterVal;
				me.creationDateFilterLabel = getDateIndexLabel(me.dateRangeFilterVal);
				me.handleCreationDateChange(me.dateRangeFilterVal);
			}else if(filterType=="scheduleDate"){
				me.scheduleDateFilterVal = me.dateRangeFilterVal;
				me.scheduleDateFilterLabel = getDateIndexLabel(me.dateRangeFilterVal);
				me.handleScheduleDateChange(me.dateRangeFilterVal);
			}else if (filterType == "entryDateAdvFilter") {
				me.entryDateFilterVal = me.dateRangeFilterVal;
				me.entryDateFilterLabel = getDateIndexLabel(me.dateRangeFilterVal);
				me.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
				/*me.advFilterEntryDateSelected = {
						btnValue : me.dateRangeFilterVal,
						text : me.entryDateAdvFilterLabel,
						selectedDate : me.datePickerSelectedDate
				}*/
			}
	});	
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
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
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'toggleGridPager' : function() {
					me.disablePreferencesButton("savePrefMenuBtn",false);
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
				//	populateAdvancedFilterFieldValue();
					me.firstTime = true;
					me.applyPreferences();
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'paymentSummaryFilterView':{
				beforerender:function(){
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				/*afterrender : function(tbar, opts) {
					me.handleDateChange(me.dateFilterVal); 
				},*/
				handleSavedFilterItemClick:function(comboValue,comboDesc){
					me.savedFilterVal = comboValue;
					me.doHandleSavedFilterItemClick(comboValue,comboDesc);
				},
				handlePaymentTypeChangeInQuickFilter:function(combo){
					me.handlePaymentTypeClick(combo);
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn){
					me.resetSavedFilterCombo();
					me.handleAppliedFilterDelete(btn);
				}
			},
			'filterView menu[itemId="entryDateMenu"]' : {
				'click' : function(menu, item, e, eOpts) {
					me.dateFilterVal = item.btnValue;
					me.dateFilterLabel = item.text;
					me.handleDateChange(item.btnValue);
					me.filterAppiled = 'Q';
					//selectedEntryDateInAdvFilter = {};
					me.resetSavedFilterCombo();
					me.setDataForFilter();
					me.applyQuickFilter();
					me.entryDateAdvFilterVal = me.dateFilterVal;
					me.entryDateAdvFilterLabel = me.dateFilterLabel;
					me.handleEntryDateInAdvFilterChange(me.dateFilterVal);
					// me.toggleSavePrefrenceAction(true);
				}
			},
			'paymentSummaryFilterView combo[itemId="paymentTypeCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.paymentTypeFilterVal) && (me.paymentTypeFilterVal !== '')) {
						combo.selectedOptions = me.paymentTypeFilterVal.split(',');
						combo.setRawValue(me.paymentTypeFilterDesc);
					}
				}
			},
			'paymentSummaryFilterView  combo[itemId="statusCombo"]' : {
				'select' : function(combo,selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur':function(combo,record){
					if(combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				}
			},
			'paymentSummaryFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'paymentSummaryFilterView AutoCompleter[itemId="clientAuto"]' : {
				'select' : function(combo, record) {
					selectedClientDesc = combo.getRawValue();
					selectedClient = combo.getValue();
					selectedFilterClientDesc = combo.getRawValue();
					selectedFilterClient = combo.getValue();
					me.resetSavedFilterCombo();
					me.handleClientChangeInQuickFilter(false);
				},
				'change' : function(combo, record) {
					if (Ext.isEmpty(combo.getValue()) && !Ext.isEmpty(selectedClient)) {
						selectedClientDesc = "";
						selectedClient = "";
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
						me.resetSavedFilterCombo();
						me.handleClientChangeInQuickFilter(false);
					}
				},
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal != "all") {
						combo.setValue(me.clientFilterVal);
						combo.setRawValue(selectedClientDesc);
					}
				}
			},
			'paymentSummaryFilterView component[itemId="paymentEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
								monthsToShow : 1,
								changeMonth :true,
								changeYear :true,
								//minDate:dtHistoryDate,
								dateFormat : strApplicationDefaultFormat,
								rangeSeparator : '  to  ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.datePickerSelectedDate = dates;
										me.dateRangeFilterVal = '13';
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = getDateIndexLabel(me.dateRangeFilterVal);
										me.handleDateChange(me.dateRangeFilterVal);
										//selectedEntryDateInAdvFilter = {};
										me.resetSavedFilterCombo();
										me.setDataForFilter();
										me.applyQuickFilter();
										me.entryDateAdvFilterVal = me.dateRangeFilterVal;
										me.entryDateAdvFilterLabel = me.dateFilterLabel;
										me.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
									}
								}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						//me.handleEntryDateSync();
						var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
						var entryDateField = $("#entryDateAdvFilter");
						me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
					} else {
						// DHGCPNG44-4696 Payment->Payment Center->PDF. The filter Latest behaves differently from the way it works in Accounts.
						me.dateFilterVal = defaultDateIndex;
						me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
						me.handleDateChange(me.dateFilterVal);
						me.resetSavedFilterCombo();
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
			'paymentSummaryFilterView combo[itemId="clientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal != "all") {
						combo.setValue(me.clientFilterVal);
						$('#msClient').val(me.clientFilterVal);
						$('#msClient').niceSelect('update');
					} else {
						combo.setValue(combo.getStore().getAt(0));
						$('#msClient').val(combo.getStore().getAt(0));
						$('#msClient').niceSelect('update');
					}
				},
				'select' : function(combo, record) {
					selectedClientDesc = combo.getDisplayValue();
					selectedClient = combo.getValue();
					me.resetSavedFilterCombo();
					me.handleClientChangeInQuickFilter(false);
				}
			}
		});
	},
	applyPreferences : function(){
	
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode='';
		if (objPaymentSummaryPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objPaymentSummaryPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateAndDisableSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									me.handleFieldSync();
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);
		}
		
		/*if (objPaymentSummaryPref) {
			var objJsonData = Ext.decode(objPaymentSummaryPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref;
			if (!Ext.isEmpty(objJsonData.d.preferences)) {
				if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
						var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
						me.doHandleSavedFilterItemClick(advData);
						me.savedFilterVal=advData;
					}
				}
			}
		}*/
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences))
		{
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
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}else{
			me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjPaymentSummaryPref,args, me,false);
		}
	},
	
	updateObjPaymentSummaryPref : function(data){	
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
		objData["filterUrl"] = 'services/userfilterslist/siGroupViewFilter.json';
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
	/*Page setting handling ends here*/
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'SISUM_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'SISUM_OPT_ADVFILTER') {
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
		me.populateAndDisableSavedFilter(filterCode, filterData, false);
		me.filterApplied = 'A';
		me.setDataForFilter();
		//me.handleAdvanceFilterCleanUp();
		me.resetAllFields();
		me.filterCodeValue = null;
		objGroupView.reconfigureGrid(null);
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPaymentSummaryView(), gridModel = null, objData = null;
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
		// If sorting is given from advance filter then do not allow sorting on grid.
		// And not even show sorting icon to any column in this case.
		// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//		enableDisableSortIcon(me, gridModel, false);		
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var buttonMask = me.strDefaultMask;
		
		//saving local prefrences
		if(allowLocalPreference === 'Y'  && !_IsEmulationMode)
			me.handleSaveLocalStorage();
		
		if(me.tranInfoSection == false)
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
		if(!Ext.isEmpty(filterUrl))
		{
			strUrl += filterUrl;
			if(!Ext.isEmpty(columnFilterUrl))
				strUrl += ' and ' +columnFilterUrl;
		}
		else
		{
			if(!Ext.isEmpty(columnFilterUrl))	
				strUrl += "&$filter="+columnFilterUrl;
		}
		
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
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}

		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		
		/*grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid);
		});*/
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
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
				//	objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + ' and ';
								} else {
									//strTemp = strTemp + ' and ';
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
										strDetailUrl = strDetailUrl
												+ ' or ';
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						var filterFieldId = filterData[index].field;
						// objValue = objValue.replace(reg, '');
						if(filterFieldId =='CompanyId' || filterFieldId == 'AccountNo'){
							objValue = decodeURIComponent(objValue);
						}
						var objArray = objValue.split(',');
						var joinVal ='';
						if(filterFieldId =='CompanyId' || filterFieldId == 'AccountNo'){
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
			var  isDisabled = true;
			var count = 0;
			count = (arrSelectedRecords && !Ext.isEmpty(arrSelectedRecords.length))
					? arrSelectedRecords.length
					: 0;
			isDisabled = (count === 1) ? false : true;
			$('#downloadNachaId').removeClass('ui-helper-hidden');
			if(!isDisabled){
				$('#downloadNachaId a').attr("disabled",false);
				$('#downloadNachaId a').attr("href","#");		
				$("#downloadNachaId").hover(function() {
				    $(this).removeClass('downloadNacha-disabled'); 
				});
			}else{
				$('#downloadNachaId a').attr("disabled",true);
				$('#downloadNachaId a').removeAttr("href");
				$("#downloadNachaId").hover(function() {
				    $(this).addClass('downloadNacha-disabled'); 
				});
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
			fieldLbl = getLabel('instrumentVerifyRemarkPopUpTitle',
					'Please enter verify remark');
			titleMsg = getLabel('instrumentVerifyRemarkPopUpFldLbl',
					'Verify Remark');
		} else if (strAction === 'reject') {
			fieldLbl = '<label class= "required">' +getLabel('instrumentReturnRemarkPopUpTitle',
			'Please Enter Reject Remark') + '</label>';
			titleMsg = getLabel('instrumentReturnRemarkPopUpFldLbl',
					'Return Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
					multiline : 4,
					cls: 't7-popup',
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
											'Error',
											'Reject Remarks cannot be blank'),
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
								me.tranInfoSection = true;
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
											cls : 'ux_popup',
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

		var strActionSuccess = getLabel(strAction + (!isEmpty(strEntryType)
						? strEntryType
						: ''), 'Action Successful');
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!');
		Ext.each(actionData, function(result) {
					intSerialNo = parseInt(result.serialNo,10);
					record = grid.getRecord(intSerialNo);
					row = grid.getRow(intSerialNo);
					msg = '';
					strIsProductCutOff = 'N';
					Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : '
										+ error.errorMessage;
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
	/*	if (!Ext.isEmpty(arrActionMsg) && errorPanel) {
			errorPanel.loadResultData(arrActionMsg);
			errorPanel.show();
		}*/
				
		/*me.hideQuickFilter();*/
		if (!Ext.isEmpty(arrActionMsg)) {
			getRecentActionResult(arrActionMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		groupView.setLoading(false);
		// refresh Grid here only after transaction action info shown over actionResultDiv		
		groupView.refreshData();
	},
	preHandleProductCutoff : function(errRecord, strUserMsg,actionResultMsgCounter) {
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
		var strUrl = Ext.String.format(me.strBatchActionUrl, errRecord.lastActionUrl);
		var strIdentifier = objGridRecord.get('identifier');
		var objJson = new Array();

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
							me.postHandleProductCutoff(Ext.decode(response.responseText),
									strUrl, strUserMsg, actionResultMsgCounter);
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
	postHandleProductCutoff : function(objData, strLastActionUrl, strUserMsg,actionResultMsgCounter) {
		me = this;
		var result = Ext.isEmpty(objData.d.instrumentActions)
				? new Array()
				: objData.d.instrumentActions[0];
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var curPage = grid.getCurrentPage();
		var pageSize = grid.getPageSize();
		var intValue = 0;
		var modelRecord;
		var msg = '', strIsProductCutOff = 'N', errCode = '', record = '';
		var actionMsg = [];
		var row = null;
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!');
		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');

		record = grid.getRecord(parseInt(result.serialNo,10));
		intValue = ((curPage - 1) * pageSize) + parseInt(result.serialNo,10);
		if (Ext.isEmpty(intValue))
			intValue = parseInt(result.serialNo,10);
		Ext.each(result.errors, function(error) {
					msg = msg + error.code + ' : ' + error.errorMessage
							+ '<br/>';
					errCode = error.code;
					if (!Ext.isEmpty(errCode)
							&& errCode.substr(0, 3) === 'WARN')
						strIsProductCutOff = 'Y';
				});
		actionMsg.push({
					success : result.success,
					serialNo : intValue,
					actualSerailNo : result.serialNo,
					isProductCutOff : strIsProductCutOff,
					actionTaken : 'N',
					lastActionUrl : strLastActionUrl,
					reference : Ext.isEmpty(record) ? '' : record
							.get('clientReference'),
					actionMessage : result.success === 'Y'
							? strActionSuccess
							: (result.success === 'W02' ? warnLimit : msg)
				});
		/* Update the error div */
		if (!Ext.isEmpty(actionMsg[0])) {
			updateActionMessage(actionMsg[0], actionResultMsgCounter);
		}
		row = grid.getRow(intValue);
		me.handleVisualIndication(row, record, result,
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
											title : getLabel(
													'instrumentWarning',
													'Warning'),
											msg : strMsg1
													+ !Ext.isEmpty(strMsg2)
													? '\n' + strMsg2
													: '',
											buttons : Ext.Msg.OKCANCEL,
											buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
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
									cls : 'ux_popup',
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
					&& !Ext.isEmpty(recHistory.__deferred.uri) && !Ext.isEmpty(record.get('identifier'))) {
				me.showHistory(record);
			}
		} else if (actionName === 'btnView' || actionName === 'btnEdit'
				|| actionName === 'btnClone'
				|| actionName === 'btnCloneTemplate') {
			if (!Ext.isEmpty(strPmtType)) {
				var strUrl = '', objFormData = {};
				if (actionName === 'btnView' && strPmtType === 'QUICKPAYSTI')
					strUrl = 'viewPayment.form';
				else if ((strPmtType === 'STI') && actionName === 'btnEdit')
					strUrl = 'editMultiPayment.form';
				else if ((strPmtType === 'STI') && actionName === 'btnView')
					strUrl = 'viewMultiPayment.form';
				else if (actionName === 'btnEdit'
						&& strPmtType === 'QUICKPAYSTI')
					strUrl = 'editPayment.form';
				else if ((strPmtType === 'BB' || strPmtType === 'RR')
						&& actionName === 'btnEdit')
					strUrl = 'editMultiPayment.form';
				else if (actionName === 'btnClone'
						&& strPmtType === 'QUICKPAYSTI')
					strUrl = 'editPayment.form';
				else if ((strPmtType === 'STI') && actionName === 'btnClone')
					strUrl = 'editMultiPayment.form';

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
											cls : 'ux_popup',
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
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});

				}
			}
		}
	},
	showHistory : function(record) {
		var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				'SI'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'buttonIdentifier',
				formData.buttonIdentifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPirMode',
				formData.strPirMode));
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
							tip.update(getLabel('paymentType', 'Product Category')
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
	
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index) , dateToField = '';
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
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
		if (objDateParams.operator  == 'eq')
			dateToField = "";
		else
			dateToField = vToDate;
		selectedEntryDateInAdvFilter = {
				operator : objDateParams.operator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.dateFilterLabel
		};
			
		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
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
			/*'7' : getLabel('daterange', 'Date Range'),*/
			'12' : getLabel('latest', 'Latest'),
			'13' : getLabel('daterange', 'Date Range')
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
					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue)) {
							me.dateFilterFromVal = strDtFrmValue;
							me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d');
						}
						if (!Ext.isEmpty(strDtToValue)) {
							me.dateFilterToVal = strDtToValue;
							me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d');
						}
					}
				}
				me.paymentTypeFilterVal = !Ext.isEmpty(strPaymentType)
							? strPaymentType
							: 'all';
				me.paymentTypeFilterDesc = !Ext.isEmpty(strPaymentTypeDesc)
							? strPaymentTypeDesc
							: 'All';
			}
		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			/*
			 * if (me.dateFilterVal === '12') { // do nothing. } else
			 */if (me.dateFilterVal !== '13') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						strOpt = 'bt';
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
							dataType : 'D',
							fieldLabel: getLabel('date', 'Entry Date')
						});
		}

		if (!Ext.isEmpty(me.paymentTypeFilterVal)
				&& me.paymentTypeFilterVal != 'all') {
			arrJsn.push({
						paramName : 'InstrumentType',
						paramValue1 : encodeURIComponent(me.paymentTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'in',
						dataType : 'S'
					});
		}

		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		me.filterData = arrJsn;
	},
	
	/*toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
		// TODO : To be handled
		var arrStdViewPref = {};

		var objMainNode = {};
		var objpreferences = {};
		objpreferences.preferences = arrStdViewPref;
		objMainNode.d = objpreferences;
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},*/
	
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
			url : 'services/userpreferences/sisummary/advanceFilterOrderList.json',
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
	updateSavedFilterComboInQuickFilter:function(){
		var me=this;
		var savedFilterCombobox = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox) && savedFilterCombobox.getStore().find('code',me.filterCodeValue) >= 0) {
			me.reloadFilters(savedFilterCombobox.getStore());
			//savedFilterCombobox.getStore().reload();
			if(me.filterCodeValue!=null){
				me.savedFilterVal=me.filterCodeValue;
			}else{
				me.savedFilterVal='';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue=null;
		}
	},
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;

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
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
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
		me.filterCodeValue=null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		
		Ext.Ajax.request({
					url : strUrl,
					headers: objHdrCsrfParams,
					method : 'GET',
					async : false,
					success : function(response) {
						if(!Ext.isEmpty(response)&&!Ext.isEmpty(response.responseText)){
							var responseData = Ext.decode(response.responseText);
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue=null;
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
		me.getSavedFilterData(savedFilterVal, this.populateAndDisableSavedFilter,
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
		var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "Client");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me
					.removeFromQuickArrJson(arrQuickJson, "Client");
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
		me.advFilterData = objJson;

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
		if(!Ext.isEmpty(filterCode))
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
	removeFromAdvanceArrJson : function(arr,key){
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
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var statusFilterValArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(!Ext.isEmpty(objDateParams.fieldValue1)){
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
		/*if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'all' && paymentTypeFilterVal != 'All' && paymentTypeFilterVal.length >= 1) {
		paymentTypeFilterValArray = paymentTypeFilterVal.toString();
			jsonArray.push({
						paramName : getLabel('instrumentType', 'InstrumentType'),
						paramValue1 : paymentTypeFilterValArray,
						operatorValue : 'in',
						dataType : 'S',
						paramFieldLable : getLabel('instrumentType', 'InstrumentType'),
						displayType : 5,
						displayValue1 : me.paymentTypeFilterDesc
					});
		}*/
		
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
		
		if (!Ext.isEmpty(me.clientFilterVal) && clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayType : 5,
						displayValue1 : me.clientFilterDesc
						
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
		if(objGroupView)
			objGroupView.toggleFilterIcon(true);
		if (groupInfo && groupInfo.groupTypeCode === 'SISUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	doSearchOnly : function() {
		var me = this;		
		if (isClientUser()) {
			var clientComboBox = me.getPaymentSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
		} else {
			var clientComboBox = me.getPaymentSummaryFilterView()
					.down('AutoCompleter[itemId=clientAuto]');
		}

		if (selectedClient != null && $('#msClient').val() != 'all') {
			clientComboBox.setValue(selectedClient);
			clientComboBox.setRawValue(selectedClientDesc);
		} else if ($('#msClient').val() == 'all') {
			if (!isClientUser())
				clientComboBox.setValue('');
			else
				clientComboBox.setValue('all');
			me.clientFilterVal = '';
		}
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString());
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateAdvFilter");		
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.applyAdvancedFilter();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal=null;
		//if (me.filterCodeValue === null) {
		var FilterCode = $("#savedFilterAs").val();
		if(Ext.isEmpty(FilterCode)){
			paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',getLabel('filternameMsg','Please Enter Filter Name'));
			markRequired('#savedFilterAs');
			return;
		}else{
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue=FilterCode;
			strFilterCodeVal=me.filterCodeValue;
			me.savedFilterVal = FilterCode;
		}
		/*} else {
			strFilterCodeVal = me.filterCodeValue;
		}*/
		me.savePrefAdvFilterCode = strFilterCodeVal;
		/*if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',getLabel('filternameMsg','Please Enter Filter Name'));	
			return;	
		} else {*/
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		//}

	},
	postDoSaveAndSearch : function() {
		var me = this, objGroupView = null,savedFilterCombobox = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if(savedFilterCombobox){
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
	
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if(objGroupView)
			objGroupView.toggleFilterIcon(true);
		//me.resetAllFields(); 
		//me.filterCodeValue=null;
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
										cls : 'ux_popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							//filterGrid.getStore().reload();
							//me.reloadFilters(filterGrid.getStore());
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	reloadFilters: function(store){
		store.load({
								callback : function() {
									var storeGrid = filterGridStore();
									
									store.loadRecords(
											storeGrid.getRange(0, storeGrid
															.getCount()), {
												addRecords : false
											});

								}
							});
	},
	updateQuickFilterClient : function(value){
		var me = this;
		var quickClientCombo = me.getQuickFilterClientCombo();
		if(!Ext.isEmpty(quickClientCombo))quickClientCombo.setValue(value);
	},
	removeFromArrJson : function(arr, paramName, key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findNodeInJsonData : function(arr, paramName, key) { // Find array element which
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				reqJson = ai;
			}
		}
		return reqJson;
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
						|| displayType === 12 || displayType === 13 || displayType === 6 || displayType === 2)
				&& strValue) {
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
		/*me.hideQuickFilter();*/
		$('#entryDataPicker').removeAttr('disabled','disabled');
		me.disablePreferencesButton("savePrefMenuBtn",false);
	},
	hideQuickFilter: function(){
		var me = this;
		if(!Ext.isEmpty(me.getFilterView()))
		{
			me.getFilterView().hide();
			if(typeof (me.getFilterButton()) !== 'undefined'){
				me.getFilterButton().filterVisible = false;
				me.getFilterButton().removeCls('filter-icon-hover');
			}
		}
	},
	/*----------------------------Summary Ribbon Handling Ends----------------------------*/

	/*----------------------------Preferences Handling Starts----------------------------*/
	handleSavePreferences : function(event) {
		var me = this;
		if($("#savePrefMenuBtn").attr('disabled')) 
			event.preventDefault();
		else
			me.doSavePreferences();
	},
	handleClearPreferences : function(event) {
		var me = this;
		if($("#clearPrefMenuBtn").attr('disabled')) 
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
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
								//	me.toggleSavePrefrenceAction(true);
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : imgIcon
										});

							} else {
							//	me.toggleClearPrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.INFO
										});
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);		
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
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	},
	doClearPreferences : function() {
		var me = this;
	//	me.toggleSavePrefrenceAction(false);
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
				//		me.toggleSavePrefrenceAction(true);
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO,
									fn: function(buttonId) {
								        if (buttonId === "ok") {
								           window.location.reload();
								        }
									}
								});
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",true);
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
	/*getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null;
		if (groupView) {
			grid = groupView.getGrid();
			if (!Ext.isEmpty(grid)) {
				arrCols = grid.headerCt.getGridColumns();
				arrColPref = new Array();
				for (var j = 0; j < arrCols.length; j++) {
					objCol = arrCols[j];
					if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
							&& objCol.itemId.startsWith('col_')
							&& !Ext.isEmpty(objCol.xtype)
							&& objCol.colType != 'actioncontent')
						arrColPref.push({
									colId : objCol.dataIndex,
									colHeader : objCol.text,
									hidden : objCol.hidden,
									colType : objCol.colType,
									width : objCol.width
								});
				}
			}

			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};

			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			// TODO : Save Active tab for group by "Advanced Filter" to be
			// discuss
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode
					&& groupInfo.groupTypeCode !== 'SISUM_OPT_ADVFILTER') {
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
								'gridCols' : arrColPref,
								'pgSize' : grid.getPageSize()
							}
						});
			}
		}
		return arrPref;
	},*/
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
				if (groupInfo.groupTypeCode !== 'SISUM_OPT_ADVFILTER'
						|| (groupInfo.groupTypeCode == 'SISUM_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
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
		var strSqlDateFormat = 'Y-m-d';
		var filterPanel = me.getPaymentSummaryFilterView();
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var quickPref = {};
		quickPref.paymentType = me.paymentTypeFilterVal;
		quickPref.paymentTypeDesc = me.paymentTypeFilterDesc;
		quickPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
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
					$.download('services/standingInstructions/nachadownload', arrJson);
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
					arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
				}
			}

			strExtension = arrExtension[actionName];
			strUrl = 'services/standingInstructions.' + strExtension;
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
								colArray.push(arrSortColumnReport[col.dataIndex]);

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
			for(var i=0; i<arrSelectedrecordsId.length; i++){
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
						arrSelectedrecordsId[i]));
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
		if(isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else 	
			me.clientFilterVal = isEmpty(selectedClient) ? 'all' : selectedClient;
		me.clientFilterDesc = selectedClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		$('#msClient').val(selectedClient);
		me.filterApplied = 'Q';
		
		if(!isEmpty(me.clientFilterVal) && 'all' !=me.clientFilterVal)
		{
			$.ajax({
					url : 'services/swclient/' + me.clientFilterVal + '.json',
					success:function(response)
					{
						console.log('Success : ');
					}
				});
		}
		//syncing client 
		me.handleClientSync(me.filterApplied , me.clientFilterVal , me.clientFilterDesc);
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		var savedFilterCombo = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombo.setValue("");
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.refreshData();
			
		} else {
			me.applyQuickFilter();
		}
	},
	handleClientSync : function(filterAppliedOn , clientCode , clientDescription){
		var me = this;
		var componentTypeFlag = 'C' , clientComponent = null;
		if (isClientUser()) {
			clientComponent = me.getQuickFilterClientCombo();
		} else {
			clientComponent = me.getQuickFilterClientAuto();
			componentTypeFlag = 'A';
		}
		
		if('Q' === filterAppliedOn){
			$('#msClient').val(clientCode);
			$('#msClient').niceSelect('update');
			
		}else if('A' === filterAppliedOn && null != clientComponent){
			
			if('C' === componentTypeFlag){
				clientComponent.setValue((clientCode == null || clientCode == ""||clientCode == "all") ? clientComponent.getStore().getAt(0) : clientCode);
			}else if('A' === componentTypeFlag){
				clientComponent.setValue(clientDescription);
			}
		}
	},	
	handlePaymentTypeClick : function(combo) {
		var me = this;
		var savedFilterCombo = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');		
		savedFilterCombo.setValue("");
		me.paymentTypeFilterVal = combo.getValue();
		me.paymentTypeFilterDesc = combo.getRawValue();
		me.filterApplied='Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
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
		me.statusFilterVal = combo.getSelectedValues();
		me.statusFilterDesc = combo.getRawValue();
		me.handleStatusFieldSync('Q',me.statusFilterVal,null);
		me.filterApplied = 'Q';
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateAndDisableSavedFilter,
					true);
		}

		me.handleFieldSync();
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		// me.toggleSavePrefrenceAction(true);
	
	},
	handleFieldSync : function(){
		var me = this;
		
		//syncing status
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [],objQuickClientField;
		$('#msStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});
		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc
						.toString());

		//syncing entry date
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateAdvFilter");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		
		//syncing client
		if(selectedFilterClient != null)
			me.handleClientSync('A',selectedFilterClient,selectedClientDesc);
	},
	handleEntryDateChange:function(filterType,btn,opts){
		var me=this;
		if(filterType=="entryDateQuickFilter"){
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled='Q';
			me.datePickerSelectedDate = [];
			me.resetSavedFilterCombo();
			me.setDataForFilter();
			me.applyQuickFilter();
		}else if(filterType=="entryDateAdvFilter"){
			me.entryDateAdvFilterChange(btn, opts);
		}
	},
	
	entryDateAdvFilterChange : function(btn, opts) {
		var me = this;
		me.entryDateFilterVal = btn.btnValue;
		me.entryDateFilterLabel = btn.text;
		me.entryDateAdvFilterVal = btn.btnValue;
		me.entryDateAdvFilterLabel = btn.text;
		me.handleEntryDateInAdvFilterChange(btn.btnValue);
		/*me.advFilterEntryDateSelected = {
				btnValue : me.entryDateAdvFilterVal,
				text : me.entryDateAdvFilterLabel
		}*/
	},
	
	handleEntryDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);
		me.entryDateAdvFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.entryDateAdvFilterLabel)) {
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate', 'Entry Date') + " (" + me.entryDateAdvFilterLabel + ")");
			updateToolTip('entryDateAdvFilter',  " (" + me.entryDateAdvFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#entryDateAdvFilter').datepick('setDate',vFromDate);
			} else {
				$('#entryDateAdvFilter').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDateInAdvFilter = {
					operator : filterOperator,
					fromDate : vFromDate,
					toDate : dateToField,
					dateLabel : me.entryDateAdvFilterLabel
			};
		} else {
			if (index === '1' || index === '2') {
				$('#entryDateAdvFilter').datepick('setDate',vFromDate);
			} else {
				$('#entryDateAdvFilter').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDateInAdvFilter = {
					operator : filterOperator,
					fromDate : vFromDate,
					toDate : dateToField,
					dateLabel : me.entryDateAdvFilterLabel
			};
		}
	},
	
	handleClearSettings : function() {
		var me = this;
		var isHandleClearSettings = true;
		me.resetSavedFilterCombo();
		var entryDatePicker = me.getPaymentSummaryFilterView()
		.down('component[itemId="paymentEntryDataPicker"]');
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.handleDateChange(me.dateFilterVal);
		me.resetAllFields(isHandleClearSettings);
		me.resetClientField();
		me.setDataForFilter();
		
		// If sorting is given from advance filter then do not allow sorting on grid.
		// And not even show sorting icon to any column in this case.
		// Hence need to reconfigure Grid again with sortable functionality on and off accordingly
//		enableDisableSortIcon(me, null, true);
		me.refreshData();
	},
	effectiveDateChange:function(btn,opts){
		var me = this;
		me.effectiveDateFilterVal = btn.btnValue;
		me.effectiveDateFilterLabel = btn.text;
		me.handleEffectiveDateChange(btn.btnValue);
	},
	scheduleDateChange:function(btn,opts){
		var me = this;
		me.scheduleDateFilterVal = btn.btnValue;
		me.scheduleDateFilterLabel = btn.text;
		me.handleScheduleDateChange(btn.btnValue);
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
		var objDateParams = me.getDateParam(index,null);

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
			var filterOperator=objDateParams.operator;
			
			if (index == '13') {
				if (filterOperator == 'eq') {
					$('#creationDate').setDateRangePickerValue(vFromDate);
				} else {
					$('#creationDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedCreationDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			} else {
				if (index === '1' || index === '2') {
					$('#creationDate').setDateRangePickerValue(vFromDate);
				} else {
					$('#creationDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedCreationDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			}
	},
	handleEffectiveDateChange:function(index){
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index,null);
		me.effectiveDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.effectiveDateFilterLabel)) {
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date')
					+ " (" + me.effectiveDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
			var filterOperator=objDateParams.operator;
			
			if (index == '13') {
				if (filterOperator == 'eq') {
					$('#effectiveDate').datepick('setDate',vFromDate);
				} else {
					$('#effectiveDate').datepick('setDate',[vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedEffectiveDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			} else {
				if (index === '1' || index === '2') {
					$('#effectiveDate').datepick('setDate',vFromDate);
				} else {
					$('#effectiveDate').datepick('setDate',[vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedEffectiveDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			}
	},
	handleScheduleDateChange:function(index){
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index,null);
		me.scheduleDateFilterLabel = objDateParams.label;
		if (!Ext.isEmpty(me.scheduleDateFilterLabel)) {
			$('label[for="ScheduleDateLabel"]').text(getLabel('scheduleDate',
					'Start Date')
					+ " (" + me.scheduleDateFilterLabel + ")");
			updateToolTip('scheduleDate',  " (" +  me.scheduleDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
			var filterOperator=objDateParams.operator;
			
			if (index == '13') {
				if (filterOperator == 'eq') {
					$('#scheduleDate').datepick('setDate',vFromDate);
				} else {
					$('#scheduleDate').datepick('setDate',[vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedScheduleDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			} else {
				if (index === '1' || index === '2') {
					$('#scheduleDate').datepick('setDate',vFromDate);
				} else {
					$('#scheduleDate').datepick('setDate',[vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedScheduleDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
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
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'last month only';
				break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
					label = 'Date Range';
				}else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
				}
				break;
			case '12' :
				// Latest
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
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		return retObj;
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null,savedFilterCombobox = me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.savedFilterVal = '';
			me.filterCodeValue = '';
			me.doSearchOnly();
			if(savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
			$('#advancedFilterPopup').dialog("close");
		}
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},
	
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fleldDisplayVal = '';
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
		for (var i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			fleldDisplayVal = filterData.filterBy[i].displayValue1;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'ClientReference') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("input[type='text'][id='paymentReference']").val(fieldVal);
			} else if (fieldName === 'TemplateName') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}			
				$("input[type='text'][id='templateName']").val(fieldVal);
			} else if (fieldName === 'Maker') {
				if(!Ext.isEmpty(fieldSecondVal)){
					fieldSecondVal = decodeURIComponent(fieldSecondVal);
				}				
				$("input[type='text'][id='entryUser']").val(fieldSecondVal);
				$("input[type='text'][id='entryUser']").attr('item_id',fieldVal);
			} else if (fieldName === 'MakerBranchCode') {
                if(!Ext.isEmpty(fieldSecondVal))
                {
                    fieldSecondVal = decodeURIComponent(fieldSecondVal);
                }
                $("#entryBranch").val(fieldSecondVal);
                $("input[type='text'][id='entryBranch']").attr('item_id',fieldVal);
            } else if (fieldName === 'ReceiverCode') {
				if(!Ext.isEmpty(fieldVal)) {
					fieldVal = decodeURIComponent(fleldDisplayVal); 	
				}	
				$("#receiverCode").val(fieldVal) 
			} else if (fieldName === 'Channel') {
				$("input[type='text'][id='channel']").val(fieldVal);
			} else if (fieldName === 'FileName') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("input[type='text'][id='fileName']").val(fieldVal);
			} else if (fieldName === 'Amount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'BeneName') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("input[type='text'][id='receiverName']").val(fieldVal);
			} else if (fieldName === 'ReceiverId') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}
				$("input[type='text'][id='receiverId']").val(fieldVal);
			} else if (fieldName === 'MicrNo') {
				$("input[type='text'][id='checkNo']").val(fieldVal);
			}else if (fieldName === 'OrderingPartyName') {
				if(!Ext.isEmpty(fieldVal)){
					fieldVal = decodeURIComponent(fieldVal);
				}				
				$("input[type='text'][id='filterOrderingPartyAutocomplete']").val(fieldVal);
			}

			if (fieldName === 'CreateDate' || fieldName === 'EntryDate'
					|| fieldName === 'ActivationDate' || fieldName === 'siEffectiveDate') {
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
					|| fieldName === 'CompanyId') {
				 if(fieldName === 'AccountNo')
					 {
					 if(!Ext.isEmpty(fieldVal)){
							fieldVal = decodeURIComponent(fieldVal);
						}
					 }
				me.checkUnCheckMenuItems(fieldName, fieldVal, fieldSecondVal);
				if(fieldName === 'ActionStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}else if(fieldName === 'Client'){
                selectedFilterClient = fieldVal;
                selectedClientDesc = filterData.filterBy[i].displayValue1;
                me.clientFilterVal = selectedFilterClient;
                $('#msClient').val(fieldVal);
                $('#msClient').niceSelect('update');
			}
		}
		var paymentTypeChangedValue = $("#msProductCategory")
				.getMultiSelectValue();

		if (!isPayCategoryFieldPresent) {
			$("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
					false);
			$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
					false);
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
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
	
	setPaymentCategoryCheckBoxes: function(fieldVal){
		var multiPayRef = $("input[type='checkbox'][id='multiPayCheckBox']");
		var singlePayRef = $("input[type='checkbox'][id='singlePayCheckBox']");
		if (!Ext.isEmpty(multiPayRef) && !Ext.isEmpty(singlePayRef))
		{
			if (fieldVal == 'B,Q') {
				multiPayRef.prop('checked', true);
				singlePayRef.prop('checked', true);
			} else if (fieldVal == 'B') {
				singlePayRef.prop('checked', false);
				multiPayRef.prop('checked', true);
			} else if (fieldVal == 'Q') {
				singlePayRef.prop('checked', true);
				multiPayRef.prop('checked', false);
			} else if(fieldVal==''){
				singlePayRef.prop('checked', false);
				multiPayRef.prop('checked', false);
			}
		}
	},
	setCRDRCheckBoxes: function(fieldVal){
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
	},
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator , formattedFromDate = "" ,formattedToDate = "" ;

			if (dateType === 'CreateDate') {
				dateFilterRef = $('#creationDate');
			} else if (dateType === 'siEffectiveDate') {
				dateFilterRef = $('#scheduleDate');
			}else if (dateType === 'EntryDate') {
				dateFilterRef = $('#entryDateAdvFilter');
			}
			 

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					 formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),strExtApplicationDateFormat);
					 formattedToDate = "";
					$(dateFilterRef).val(formattedFromDate);
				}

			} else if (dateOperator === 'bt') {	
				 var fromDate = data.value1;
				 	if (!Ext.isEmpty(fromDate)) { 
					  formattedFromDate = Ext.util.Format.date(Ext.Date.parse(fromDate, 'Y-m-d'), strExtApplicationDateFormat);
					 var toDate = data.value2; 
					 if (!Ext.isEmpty(toDate)) { 
						formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate, 'Y-m-d'), strExtApplicationDateFormat);
					 $(dateFilterRef).datepick('setDate',[formattedFromDate,formattedToDate]);
					 }
				 }
			} 
			
			if (dateType === 'CreateDate') {
				selectedCreationDate={
					operator:dateOperator,
					fromDate:formattedFromDate,
					toDate:formattedToDate
				};
			 } else if (dateType === 'siEffectiveDate') {
				selectedScheduleDate={
					operator:dateOperator,
					fromDate:formattedFromDate,
					toDate:formattedToDate
				};
			 }
			 else if (dateType === 'EntryDate') {
				selectedEntryDateInAdvFilter = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				$('label[for="EntryDateLabel"]').text(getLabel('EntryDate','Entry Date')+ " ("
						+ selectedEntryDateInAdvFilter.dateLabel + ")");
				$('label[for="EntryDateLabel"]').text(getLabel('EntryDate','Entry Date')+ " ("
						+ selectedEntryDateInAdvFilter.dateLabel + ")");
				entry_date_opt = data.dropdownLabel;
			}
		}else {
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
			} else if (fieldName === 'CreditDebitFlag'){
				var debitRef = $("input[type='checkbox'][id='msDebit']");
				var creditRef = $("input[type='checkbox'][id='msCredit']");
				if (!Ext.isEmpty(debitRef) && !Ext.isEmpty(creditRef)){
					if (fieldVal == '') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', true);
					} else if (fieldVal == 'D') {
						debitRef.prop('checked', true);
						creditRef.prop('checked', false);
					} else if (fieldVal = 'C') {
						creditRef.prop('checked', true);
						debitRef.prop('checked', false);
					}
				}
			}
		}
	},
	checkUnCheckMenuItems : function(componentName, data, fieldSecondVal) {
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
		} else if (componentName === 'Client') {
			menuRef = $("select[id='msClient']");
			elementId = '#msClient';
			me.clientFilterVal = data;
		} else if (componentName === 'AccountNo') {
			menuRef = $("select[id='msSendingAccounts']");
			elementId = '#msSendingAccounts';
		} else if (componentName === 'InstrumentType') {
			menuRef = $("select[id='msProductCategory']");
			elementId = '#msProductCategory';
		}else if (componentName === 'Channel') {
			menuRef = $("select[id='msChannel']");
			elementId = '#msChannel';
		}else if (componentName === 'CompanyId') {
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

			if (componentName === 'ActionStatus') 
				data = fieldSecondVal;
			var dataArray = (typeof data == 'string') ? data.split(',') : data;
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
			if (componentName === 'Client') {
				me.clientFilterVal = data;
				selectedClient = data;
			}
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {

			}
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					var dataArrayIndxVal = (dataArray[dataIndex].indexOf('^')>-1) ? dataArray[dataIndex].split('^') : dataArray[dataIndex];
					if (dataArrayIndxVal == itemArray[index].value) {
						$(elementId + " option[value=\"" + itemArray[index].value
								+ "\"]").prop("selected", true);
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
					if (!Ext.isEmpty(thenSortByButtonRef))
					{
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
		$("#msSortBy2").niceSelect('destroy');
		$("#msSortBy3").niceSelect('destroy');
		var me = this;
		$("input[type='checkbox'][id='multiPayCheckBox']")
				.prop('checked', true);
		$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
				true);
		$('#msClient').val('all');
		$('#msClient').niceSelect('update');
		resetAllMenuItemsInMultiSelect("#msProductCategory");
		resetAllMenuItemsInMultiSelect("#msProducts");
		resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		$("input[type='text'][id='templateName']").val("");
		selectedCreationDate={};
		$("#creationDate").val("");
		selectedCreationDate={};
		$('#scheduleDate').val("");
		selectedScheduleDate={};
		$('#processDate').val("");
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
		$("input[type='checkbox'][id='msCredit']").prop('checked',false);
		$("input[type='checkbox'][id='msDebit']").prop('checked',false);
		$("input[type='radio'][id='msCrossCurrencyAll']").prop('checked', true);
		$("#receiverId").val("");
		resetAllMenuItemsInMultiSelect("#msCompanyId");
		$("input[type='radio'][id='msPrenotesAll']").prop('checked', true);
		$("#msSortBy1").val('None');
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
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="ProcessDateLabel"]').text(getLabel('processDate', 'Process Date'));
		$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate', 'Effective Date'));
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate', 'Creation Date'));
		$('label[for="ScheduleDateLabel"]').text(getLabel('scheduleDate', 'Start Date'));
		$("#saveFilterChkBox").attr('checked', false);
		$("#savedFilterlbl").removeClass("required");
		removeMarkRequired('#savedFilterAs');	
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#amountOperator").niceSelect('update');
		$("#msSortBy1").niceSelect('update');
		
		var objField = me.getPaymentSummaryFilterView().down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
		
		if(!isHandleClearSettings){
			me.dateFilterVal = '';
			selectedEntryDateInAdvFilter = {};
			me.resetAdvEntryDate();
			//me.resetEntryDateAsDefault();
		}
	},
	
	resetAdvEntryDate: function(){
		var me = this;
		var objDateParams =null;
		var label = null;
		objDateParams = me.getDateParam(defaultDateIndex);
		label = getDateIndexLabel(defaultDateIndex);
		
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		
		$('#entryDateAdvFilter').datepick('setDate',[vFromDate, vToDate]);
		selectedEntryDateInAdvFilter = {
				operator : 'bt',
				fromDate : vFromDate,
				toDate : vToDate,
				dateLabel : label
		};
		
		$('label[for="EntryDateLabel"]').text(getLabel('entryDate', 'Entry Date') + " (" + selectedEntryDateInAdvFilter.dateLabel + ")");
		updateToolTip('entryDateAdvFilter',  " (" + selectedEntryDateInAdvFilter.dateLabel + ")");
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
				if (paramName === 'EntryDate') {
					me.resetEntryDateAsDefault();
					arrAdvJson.push( me.getTemplateStartDateJson());
				}
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
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
	handleStatusFieldSync : function(type,statusData,statusDataDesc){
		var me = this;
		if(!Ext.isEmpty(type)){
			if(type === 'Q'){
				var objStatusField = $("#msStatus");
				var objQuickStatusField = me.getPaymentSummaryFilterView().down('combo[itemId="statusCombo"]');
				if(!Ext.isEmpty(statusData)){
					objStatusField.val([]);
					objStatusField.val(statusData);
				}
				else if(Ext.isEmpty(statusData)){
					objStatusField.val([]);
				}
				objStatusField.multiselect("refresh");
				if(objQuickStatusField.isAllSelected()) {
					me.statusFilterVal = 'all';
				}
			}
			if(type === 'A'){
				var objStatusField = me.getPaymentSummaryFilterView().down('combo[itemId="statusCombo"]');
				if(!Ext.isEmpty(statusData)) {
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

	handleEntryDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="EntryDateLabel"]') : me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#entryDateAdvFilter') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
	},
	
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'ActionStatus') {
			var objField = me.getGroupView()
					.down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			resetAllMenuItemsInMultiSelect("#msStatus");
		} else if (strFieldName === 'EntryDate') {
			me.resetEntryDateAsDefault();
		} else if (strFieldName === 'PayCategory') {
			$("input[type='checkbox'][id='multiPayCheckBox']").prop('checked',
					false);
			$("input[type='checkbox'][id='singlePayCheckBox']").prop('checked',
					false);
		} else if (strFieldName === 'InstrumentType') {
			resetAllMenuItemsInMultiSelect("#msProductCategory");
		} else if (strFieldName === 'ProductType') {
			resetAllMenuItemsInMultiSelect("#msProducts");
		} else if (strFieldName === 'AccountNoPDT') {
			resetAllMenuItemsInMultiSelect("#msSendingAccounts");
		} else if (strFieldName === 'TemplateName') {
			$("input[type='text'][id='templateName']").val("");
		} else if (strFieldName === 'ActivationDate') {
			selectedEffectiveDate = {};
			me.datePickerSelectedEffectiveAdvDate = [];
			$('#effectiveDateFrom').val("");
			$('#effectiveDateTo').val("");
			$('label[for="EffectiveDateLabel"]').text(getLabel('effectiveDate',
					'Effective Date'));
		} else if (strFieldName === 'ValueDate') {
			selectedProcessDate = {};
			me.datePickerSelectedProcessAdvDate = [];
			$('#processDateFrom').val("");
			$('#processDateTo').val("");
			$('label[for="ProcessDateLabel"]').text(getLabel('processDate',
					'Process Date'));
		} else if (strFieldName === 'Maker') {
			$("#entryUser").val("");
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
			$("#creationDateTo").val("");
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
			$('#msClient').val('all');
			$("#msClient").niceSelect('update');
		}
	},
	assignSavedFilter: function(){
		var me= this,savedFilterCode='';
		me.resetAllFields();
			if (objPaymentSummaryPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objPaymentSummaryPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateAndDisableSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
							me.handleFieldSync();
						}
				}
				else if (objPaymentSummaryPref) {
					var objJsonData = Ext.decode(objPaymentSummaryPref);
					if (!Ext.isEmpty(objJsonData.d.preferences)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								if(advData === me.getPaymentSummaryFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
								$("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
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
	
		/* State handling at local storage starts */
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
		}
	,resetEntryDateAsDefault : function() {
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
		selectedFilterClientDesc = "";
		selectedFilterClient = "";
		selectedClientDesc = "";
		selectedClient = "";
		if(isClientUser()){
			clientComboBox = me.getPaymentSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			clientComboBox = me.getPaymentSummaryFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
		}
	},
	/*--------------------Quick Filter End--------------------------*/
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
  }
});