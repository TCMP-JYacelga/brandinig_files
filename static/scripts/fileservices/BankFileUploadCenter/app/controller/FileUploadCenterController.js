Ext.define('GCP.controller.FileUploadCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateHandler'],
	views : ['Ext.ux.gcp.PreferencesHandler',
			'GCP.view.FileUploadCenterFilterView', 'Ext.ux.gcp.AutoCompleter','GCP.view.FileUploadAdvFilterPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'fileUploadCenterView',
				selector : 'fileUploadCenterView'
			}, {
				ref : 'groupView',
				selector : 'fileUploadCenterView groupView'
			}, {
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : 'fileUploadCenterFilterView',
				selector : 'fileUploadCenterFilterView'
			},
			{
				ref : 'importDatePicker',
				selector : 'fileUploadCenterView groupView container[itemId="importDateContainer"] panel[itemId="importDatePanel"] button[itemId="importDatePicker"]'
			}, {
				ref : 'importDateLabel',
				selector : 'fileUploadCenterFilterView label[itemId="importDateLabel"]'
			},
			{
				ref : 'savedFiltersCombo',
				selector : 'fileUploadCenterFilterView combo[itemId="savedFiltersCombo"]'
			},
			{
				ref : 'filterSellerPanel',
				selector : 'fileUploadCenterFilterView container[itemId="filterSellerCnt"]'
			},
			{
				ref : 'filterClientPanel',
				selector : 'fileUploadCenterFilterView container[itemId="filterClientAutoCmplterCnt"]'
			},
			{
				ref : 'sellerAutoCompleter',
				selector : 'fileUploadCenterFilterView combobox[itemId="fileUploadSellerId"]'
			},
			{
				ref : 'clientAutoCompleter',
				selector : 'fileUploadCenterFilterView AutoCompleter[itemId="fileClientCodeId"]'
			},
			{
				ref : 'advanceFilterPopup',
				selector : 'fileUploadAdvFilterPopup'
			},
			{
				ref : 'savedFiltersToolBar',
				selector : 'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'fileUploadAdvFilterPopup  fileUploadAdvFilterGridView'
			},
			{
				ref : 'fileNameAdvFilter',
				selector : 'fileUploadCreateNewAdvFilter textfield[itemId=fileNameFilterItemId]'
			},
			{
				ref : 'userAdvFilter',
				selector : 'fileUploadCreateNewAdvFilter textfield[itemId=userFilterItemId]'
			},
			{
				ref : 'importDateFromField',
				selector : 'fileUploadCreateNewAdvFilter datefield[itemId=importDateFrmFilterItemId]'
			},
			{
				ref : 'importDateToField',
				selector : 'fileUploadCreateNewAdvFilter datefield[itemId=importDateToFilterItemId]'
			},
			{
				ref : 'statusAdvFilter',
				selector : 'fileUploadCreateNewAdvFilter combobox[itemId=statusFilterItemId]'
			},
			{
				ref : 'saveFilterAsAdvFilter',
				selector : 'fileUploadCreateNewAdvFilter textfield[itemId=saveFilterAsFilterItemId]'
			},
			{
				ref : 'saveSearchBtn',
				selector : 'fileUploadAdvFilterPopup fileUploadCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			},
			{
				ref : 'fromDateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="dateFilterFrom"]'
			}, 
			{
				ref : 'toDateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="dateFilterTo"]'
			}, 
			{
				ref : 'dateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="importDateLabel"]'
			}, 
			{
				ref : 'entryDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="entryDate"]'
			}, 
			{
				ref : 'fromEntryDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView datefield[itemId="fromDate"]'
			}, 
			{
				ref : 'toEntryDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView datefield[itemId="toDate"]'
			}, 
			{
				ref : 'dateRangeComponent',
				selector : 'fileUploadCenterView fileUploadCenterFilterView container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'filterDetailsTab',
				selector : 'fileUploadAdvFilterPopup panel[itemId="filterDetailsTab"]'
			},
			{
				ref : 'btnClearPreferences',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnSavePreferences"]'
			}
			],
	config : {
		filterData : [],
		advFilterData : [],
		datePickerSelectedDate : [],
		typeFilterVal : 'All',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		savedFilterVal : '',
		filterCodeValue : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'All',
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		reportGridOrder : null,		
		dateFilterLabel : getLabel('today', 'Today'),
		gridInfoDateFilterLabel : getLabel('today', 'Today'),
		dateHandler : null,
		//commonPrefUrl : 'services/userpreferences/fileUpload.json',
		urlGridFilterPref : 'services/userpreferences/fileUploadCenter.json',
		strModifySavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/fileUploadCenter.json',
		strGetModulePrefUrl : 'services/userpreferences/fileUploadCenter/{0}.json',
		strBatchActionUrl : 'services/templatesbatch/{0}.json',
		strAdvFilterUrl : 'services/userpreferences/fileUploadCenter/groupViewAdvanceFilter.json',
		objUploadFilePopup : null,
		objAdvFilterPopup : null,
		sellerVal : null,
		sellerFilterVal : 'all',
		clientFilterVal : 'all',
		clientFilterDesc : null,
		strPageName : 'fileUploadCenter' ,
		initialSmartGridRender : true,
		entityType : entityType == 1 ? 'CLIENT' : 'BANK',   
		strReadAllAdvancedFilterCodeUrl : 'userfilterslist/fileUploadCenter.srvc'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		this.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
		var filterDays = 999;
		clientFromDate = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		//clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);	
		me.updateFilterConfig();
		me.updateConfig();
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
				});
		$(document).on('refreshData', function() {
			me.refreshData();
		});
		me.objUploadFilePopup = Ext.create('GCP.view.FileUploadPopUp', {
					parent : 'fileUploadCenterView',
					itemId : 'fileUploadPopupId'
				});
		me.control({
					
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
						}
					},
					'filterView menu[itemId="importDateMenu"]' : {
						'click' : function(menu, item, e, eOpts) {
							me.dateFilterVal = item.btnValue;
							me.dateFilterLabel = item.text;
							me.handleDateChange(item.btnValue);
							me.filterApplied = 'Q';
							me.setDataForFilter();
							me.applyQuickFilter();
							// me.toggleSavePrefrenceAction(true);
						}
					},
					'filterView component[itemId="importDatePicker"]' : {
						render : function() {
							$('#importDateQuickPicker').datepick({
										monthsToShow : 1,
										changeMonth : false,
										rangeSeparator : '  to  ',
										dateFormat : strApplicationDefaultFormat,
										onClose : function(dates) {
											if (!Ext.isEmpty(dates)) {
												me.datePickerSelectedDate = dates;
												me.dateFilterVal = '13';
												me.dateFilterLabel = 'Date Range';
												me.handleDateChange('13');
												me.setDataForFilter();
												me.applyQuickFilter();
												me.toggleSavePrefrenceAction(true);
											}
										}

									});
						}

					},
					'filterView label[itemId="createAdvanceFilterLabel"]' : {
						'click' : function() {
							showAdvanceFilterPopup();
						}
					},
					'filterView button[itemId="clearSettingsButton"]' : {
						'click' : function() {
							me.handleClearSettings();
						}
					},
					'fileUploadCenterFilterView' : {
						handleSavedFilterItemClick : function(comboValue,
								comboDesc) {
							me.doHandleSavedFilterItemClick(comboValue);							
						},
						/*handleClientChangeInQuickFilter : function(combo) {						 
							me.handleClientChangeInQuickFilter(combo);
						},*/
						
						afterrender : function(panel, eOpts)
							{														
								me.updateFilterFields();
								if(entityType == 1)
								{
									me.filterEntityType('CLIENT');
								}
								me.filterApplied = 'Q';
								me.setDataForFilter();
							},
						'render' : function(){
							me.setInfoTooltip();
							me.readAllAdvancedFilterCode();
						},
						'filterEntityType' : function(entityType){
							me.filterEntityType(entityType);
						},
						'filterSeller' : function(seller) {
							me.sellerFilterVal = seller ;
							me.filterApplied = 'Q';
							me.setDataForFilter();
							me.applyQuickFilter();
							
						},
						'filterClient' : function(clientCode, clientDesc) {
							me.clientFilterVal = clientCode;
							me.clientFilterDesc = clientDesc;
							me.filterApplied = 'Q';
							me.setDataForFilter();
							me.applyQuickFilter();
							
						},
						'dateChange' : function(item, opts){
							me.dateFilterVal = item.btnValue;
							me.dateFilterLabel = item.text;
							me.handleDateChange(item.btnValue);
							me.filterApplied = 'Q';
							if (item.btnValue !== '7') {
								me.setDataForFilter();
								me.applyQuickFilter();
							}
							
						},
						'moreAdvancedFilterClick' : function(btn) {
							me.handleMoreAdvFilterSet(btn.itemId);
						}
					},
					'fileUploadCenterView groupView' : {
						'groupByChange' : function(menu, groupInfo) {
							// me.doHandleGroupByChange(menu, groupInfo);
						},
						'groupTabChange' : function(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard) {
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);		
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
							me.disablePreferencesButton("savePrefMenuBtn", false);
						},
						'gridRowActionClick' : function(grid, rowIndex,
								columnIndex, actionName, record) {
							me.handleRowIconClick(actionName, grid, record);
						},
						'groupActionClick' : function(actionName,
								isGroupAction, maskPosition, grid,
								arrSelectedRecords) {
							if (isGroupAction === true)
								me.doHandleGroupActions(actionName, grid,
										arrSelectedRecords, 'groupAction');
						},
						'gridStoreLoad' : function(grid, store) {
							me.disableActions(false);
							me.refreshGrid(grid);
						}
					},
					'fileUploadCenterFilterView  combo[itemId="quickFilterClientCombo"]' : {
						'afterrender' : function(combo, newValue, oldValue, eOpts) {
							if (!Ext.isEmpty(me.clientFilterVal)) {
								combo.setValue(me.clientFilterVal);
							}
						}
					},
					'fileUploadCenterFilterView combo[itemId="savedFiltersCombo"]' : {
						'afterrender' : function(combo, newValue, oldValue, eOpts) {
							if (!Ext.isEmpty(me.savedFilter)) {
							combo.setValue(me.savedFilter);
							}
						}
					},
					'fileUploadCenterView groupView smartgrid' : {
						'afterrender' : function(){
							var isShowClientCol = me.entityType == 'BANK' ? false : true;
							//me.hideShowClientColumn(isShowClientCol);
						}
					},
					'fileUploadCenterView fileUploadCenterFilterView  panel[itemId="advFilterPanel"]  button[itemId="newFilter"]' : {
						'click' : function(btn, opts) {
							me.showAdvanceFilterPopup();
						}
					},
					'fileUploadAdvFilterPopup fileUploadCreateNewAdvFilter' : {
						'handleSearchAction' : function(btn) {
							me.applyAdvancedFilter(btn);
							me.closeFilterPopup();
						},
						'handleSaveAndSearchAction' : function(btn) {
							me.handleSaveAndSearchAdvFilter(btn);
							//me.closeFilterPopup();
						},
						'closeFilterPopup' : function(btn) {
							me.closeFilterPopup(btn);
						}
					},
					'fileUploadAdvFilterPopup fileUploadAdvFilterGridView' : {
						'orderUpEvent' : me.orderUpDown,
						'deleteFilterEvent' : me.deleteFilterSet,
						'viewFilterEvent' : me.viewFilterData,
						'editFilterEvent' : me.editFilterData,
						'filterSearchEvent' : me.searchFilterData
					},
					'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnSavePreferences"]' : {
						click : function(btn, opts) {
							me.toggleSavePrefrenceAction(false);
							me.handleSavePreferences();
						}
					},
					'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnClearPreferences"]' : {
						click : function(btn, opts) {
							me.toggleClearPrefrenceAction(false);
							me.handleClearPreferences();
						}
					},
					'fileUploadCenterView fileUploadCenterFilterView button[itemId="goBtn"]' : {
							click : function(btn, opts) {
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();

									if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
											var dtParams = me.getDateParam('7');
											me.dateFilterFromVal = dtParams.fieldValue1;
											me.dateFilterToVal = dtParams.fieldValue2;
											me.setDataForFilter();
											me.applyQuickFilter();
											me.toggleSavePrefrenceAction(true);
										}

									}
						}
				});
		
		
	},
		 updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var fileUploadCenterFilterView = me.getFileUploadCenterFilterView();
				/*if (entityType !='1') {
					clientCodesFltId = fileUploadCenterFilterView.down('combobox[itemId=clientAutoCompleter]');
					if(undefined != me.clientCode && me.clientCode != ''){		
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientFilterDesc);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientFilterDesc = 'all';			
					}
					
				} else {
					clientCodesFltId = fileUploadCenterFilterView.down('combo[itemId="quickFilterClientCombo"]');
					if(undefined != me.clientFilterVal && me.clientFilterVal != ''  && me.clientFilterDesc != '' && me.clientFilterVal != 'all'){	
						clientCodesFltId.setRawValue(me.clientFilterDesc);			
					}	
					else{	
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientFilterDesc = 'all';
					}
				}*/
				
				var selectedFilter = me.getFileUploadCenterFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
				selectedFilter.setValue(me.savedFilterVal);
				
				me.handleDateChange(me.dateFilterVal);
			},
			hideShowClientColumn : function(isShowClientColumn){
				var me = this;
				var groupView = me.getGroupView();
				if(null != groupView.down('smartgrid'))
				{
					var columnModel = groupView.down('smartgrid').getAllColumns();
					var i = 0;
					for( i = 0; i < columnModel.length; i++){
						var column = columnModel[i];
						if(column.itemId == 'col_ahtskClientDesc'){
							if(isShowClientColumn)
								column.show();
							else
								column.hide();
						}
						if(column.itemId == 'col_ahtskSrc'){
							if(isShowClientColumn)
								column.width = arrColsPref.ahtskSrc;
							else
								column.width = parseInt(arrColsPref.ahtskSrc,10) + 100;
						}
					}
				}
			},
			filterEntityType : function(strEntityType){
				var me = this;
				me.entityType = strEntityType;
				var filterView = me.getFileUploadCenterFilterView();
				if(strEntityType === 'BANK'){
					var clientAutoCompleter = me.getClientAutoCompleter();
					filterView.clientCode = null;
					filterView.clientDesc = null;
					clientAutoCompleter.setValue(null);
					me.hideSellerPanel();
					me.hideClientPanel();
				}
				else if(strEntityType === 'BANK_CLIENT' || strEntityType === 'CLIENT'){
					filterView.clientCode = 'ALL';
					me.clientFilterVal = 'all';
					var clientAutoCompleter = me.getClientAutoCompleter();
					clientAutoCompleter.store.loadRawData({
																		"d" : {
																			"preferences" : [{
																						"CODE" : 'ALL',
																						"DESCR" : 'ALL'
																					}]
																		}
																	});
					clientAutoCompleter.setValue('ALL');
					if(entityType == 0)
					{
						//me.showSellerpanel();
					}
					
					me.showClientpanel();
				}
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			hideSellerPanel : function(){
				var me = this;
				var sellerFilterPanel = me.getFilterSellerPanel();
				if (!Ext.isEmpty(sellerFilterPanel)) {
					sellerFilterPanel.hide();
				}
			},
			showSellerpanel : function(){
				var me = this;
				var sellerFilterPanel = me.getFilterSellerPanel();
				if (!Ext.isEmpty(sellerFilterPanel)) {
					sellerFilterPanel.show();
				}
			},
			hideClientPanel : function(){
				var me = this;
				var clientFilterPanel = me.getFilterClientPanel();
				if (!Ext.isEmpty(clientFilterPanel)) {
					clientFilterPanel.hide();
				}
			},
			showClientpanel : function(){
				var me = this;
				var clientFilterPanel = me.getFilterClientPanel();
				if (!Ext.isEmpty(clientFilterPanel)) {
					clientFilterPanel.show();
				}
			},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applySeekFilter();
		}
	},
	handleImportAdvDateChange : function() {
		var me = this;
		var index = '13';
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
			selectedImportDateInAdvFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	handleImportDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "importDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterApplied = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
		}
	},
	handleClearSettings : function() {
		var me = this;
		var fileUploadFilterView=me.getFileUploadCenterFilterView();
		/*if(!isClientUser){
				clientFilterId=fileUploadFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');			
				me.clientFilterVal = 'all';	
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
		}else{
			clientFilterId=fileUploadFilterView.down('combo[itemId="quickFilterClientCombo"]');
			me.clientFilterVal = 'all';	
			clientFilterId.setValue(me.clientFilterVal);	
		}
		var clientComboBox = me.getFileUploadCenterFilterView().down('combo[itemId="quickFilterClientCombo"]');
		me.clientFilterVal = 'all';
		clientComboBox.setValue(me.clientFilterVal);*/
		var savedFilterComboBox = me.getFileUploadCenterFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.clearValue();
		var importDatePicker = me.getFileUploadCenterFilterView()
				.down('component[itemId="importDatePicker"]');
		me.dateFilterVal = '1';
		me.dateFilterLabel = getLabel('today', 'Today');
		me.handleDateChange(me.dateFilterVal);
		me.filterApplied = 'ALL';
		me.setDataForFilter();
		me.refreshData();

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
	creationDateChange : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleDateChange(btn.btnValue);
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'FILECEN_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
					 me.toggleSavePrefrenceAction(true);
				} else {
					me.savedFilterVal = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					var gridModel = {
						showCheckBoxColumn : false
					};
					objGroupView.reconfigureGrid(gridModel);
				}

			} else {
				args = {
					scope : me
				};
				strModule = subGroupInfo.groupCode;
				/*strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);*/
						me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, args, me, true);
			}
		}

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getFileUploadCenterView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
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
					showCheckBoxColumn : false,
					storeModel : {
						sortState : arrSortState
					}
				};
			}
		} else {
			gridModel = {
				showCheckBoxColumn : false
			};
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
		me.disableActions(true);
		/*
		 * strUrl = strUrl + '?&' + csrfTokenName + '=' + csrfTokenValue +
		 * me.getFilterUrl(subGroupInfo, groupInfo);
		 */
		strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue ;
		strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType ;
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
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
	  		me.handleRowIconClick(arrVisibleActions[0].itemId, grid, record);
		}
	},
	handleRowIconClick : function(actionName, grid, record) {
		var me = this;
		if (actionName === 'btnViewError' || actionName === 'btnViewRepair') {    
			// FTGCPBDB-4831 Redirect to Payment center is not available in other module .hence to maintain the consistency the change has been done and remeoved from Payment
			me.showErrorReport(record);
		} else if (actionName === 'btnViewOk'){
			if (!record.get('isEmpty')){
				if(!Ext.isEmpty(record.raw.phdRecordKeyNo)) {		
				me.viewInPaymentSummary(record);
				//me.viewPaymentRejectRepair(record); commented for the JIRA FTMNTBANK-1748			
				}else{					
					// Do nothing for the files upload from otherthan payment service.
				}
			}
		}
	},
	viewInPaymentSummary : function(record) {
		var me = this;
		var strUrl = 'paymentSummary.form',filter='',filterDetail='',arrFilterJson=[];
		if (!Ext.isEmpty(record.get('ahtskSrc')))		
			filter = filter + "FileName lk '" + record.get('ahtskSrc')+ "'";
		if (!Ext.isEmpty(filterDetail)) 	/*To pass detail level filter parameters (if any)*/					
			filter = filter + '&$filterDetail=' + filterDetail;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				record.get('paymentIdentifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				record.get('phdProduct')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPaymentType', 'BB'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
				record.get('phdNumber')));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',
					filter));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
					JSON.stringify(arrFilterJson)));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	viewPaymentRejectRepair : function(record) {
		var me = this;
		var strUrl = 'editMultiPayment.form';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				record.get('paymentIdentifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				record.get('phdProduct')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPaymentType', 'BB'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
				record.get('phdNumber')));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	viewUploadedFile : function(record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		strUrl = "viewUploadedFile.srvc";
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
				record.get('recordKeyNo')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskSrc',
				record.get('ahtskSrc')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskdata',
				record.get('ahtskdata')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskid',
				record.get('ahtskid')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	showErrorReport : function(record) {
//		Ext.create('GCP.view.FileUploadErrorPopUp', {
//			record : record,
//			url : 'fileUploadCenterList/errorReport.srvc?' + csrfTokenName
//					+ '=' + csrfTokenValue,
//			identifier : record.get("identifier"),
//			ahtskid : record.get("ahtskid")
//		}).show();
		//FTGCPBDB-2520
		var me = this;
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.get("recordKeyNo") ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.get("ahtskdata") ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.get("ahtskclient") ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getFileUploadCenterGridViewRef();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '='
					+ csrfTokenValue;
			strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType ;
			me.getFileUploadCenterGridViewRef().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'FILECEN_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	setDataForFilter : function() {
		var arrQuickJson = {};
		var me = this;
		if (me.filterApplied === 'Q') {
			me.filterData = me.getQuickFilterQueryJson();
		} else if (me.filterApplied === 'A') {
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = me.getAdvancedFilterQueryJson();
			var reqJson = me.findInAdvFilterData(objJson,"uploadDateFilter");
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"uploadDateFilter");
				me.filterData = arrQuickJson;
				me.updateQuickFilterDate(reqJson);
			}
			me.advFilterData = objJson;

			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			me.advFilterCodeApplied = filterCode;
		}
		if (me.filterApplied === 'ALL') {
			me.filterData = me.getQuickFilterQueryJson();
		}
	},
	updateQuickFilterDate : function(jsonDate){
		var me = this;
		var fromDateVal = me.getImportDateFromField();
		var toDateVal = me.getImportDateToField();
		var fromDate = null;
		var toDate = null;
		var vFromDate = null, vToDate = null;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		fromDateLabel.show();
		toDateLabel.show();
		
		if(!Ext.isEmpty(fromDateVal.getValue())){
			fromDate = fromDateVal.getValue();
			vFromDate = Ext.util.Format.date(fromDate, strExtApplicationDateFormat);
		}
		if(!Ext.isEmpty(toDateVal.getValue())){
			toDate = toDateVal.getValue();
			vToDate = Ext.util.Format.date(
									toDate, strExtApplicationDateFormat);
		}
		me.getImportDateLabel().setText(getLabel('importDate',
					'Import Date')
					+ " ( Date Range )");
		
					
					if (!Ext.isEmpty(vFromDate) && Ext.isEmpty(vToDate)) {
						fromDateLabel.setText(vFromDate);
						toDateLabel.setText("");
					} else if (!Ext.isEmpty(vFromDate) && !Ext.isEmpty(vToDate)) {
						fromDateLabel.setText(vFromDate + " - ");
						toDateLabel.setText(vToDate);
						
					}
			
	},
	removeFromQuickArrJson : function(arr, key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) { // Find array element which
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false', strAdvFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'Q') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			
		} else {
			
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}

			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);

			if (!Ext.isEmpty(strAdvFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=" + strAdvFilterUrl;
				} else {
					strUrl = strUrl + ' and ' + strAdvFilterUrl;
				}
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
	generateUrlWithAdvancedFilterParams : function(me) {
		var thisClass = this;
		// var filterData = thisClass.filterData;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
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
						&& (operator === 'bt' || operator === 'eq'
								|| operator === 'lk' || operator === 'gt' || operator === 'lt'))
					strTemp = strTemp + ' and ';
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
						isInCondition = this.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							isFilterApplied = true;
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + objArray[i] + '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or '
							}
							break;
						}
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
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied) {
			strFilter = strTemp;
		} else {
			strFilter = '';
		}
		return strFilter;
	},
	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}
		return retValue;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var actionFilterVal = this.actionFilterVal;
		var sellerFilterVal = me.sellerFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if (index != '12') {
			jsonArray.push({
						paramName : 'uploadDateFilter',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					});
		}
		if (me.typeFilterVal != null && me.typeFilterVal != 'All') {
			jsonArray.push({
						paramName : 'taskStatus',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		if (sellerFilterVal != null && !Ext.isEmpty(sellerFilterVal) && sellerFilterVal != 'all') {
			jsonArray.push({
							paramName : 'sellerCode',
							operatorValue : 'eq',
							paramValue1 : encodeURIComponent(sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
							dataType :'S'
					});
		}
		if (clientFilterVal != null && !Ext.isEmpty(clientFilterVal) && clientFilterVal != 'all') {
			jsonArray.push({
							paramName : 'clientCode',
							operatorValue : 'eq',
							paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
							dataType :'S'
					});
			me.entityType = 'BANK_CLIENT';
		}
		return jsonArray;
	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 3);
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 3;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				if (entityType === '1' && cfgCol.colId !== 'ahtskclient') {
					arrCols.push(cfgCol);
				} else if (entityType === '0') {
					arrCols.push(cfgCol);
				}

			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 32,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnViewError',
						itemCls : 'icon_deleted',
						toolTip : getLabel('viewToolTip', 'View Error Report'),
						maskPosition : 1
					}, {
						itemId : 'btnViewRepair',
						itemCls : 'icon_repair',
						toolTip : getLabel('underRepairToolTip', 'Under Repair'),
						maskPosition : 2
					}, {
						itemId : 'btnViewOk',
						itemCls : 'icon_completed',
						toolTip : getLabel('completeToolTip', 'Completed'),
						maskPosition : 3
					}]
		};
		return objActionCol;
	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
			target : 'imgFilterInfoGridView',
			listeners : {
				// Change content dynamically depending on which element
				// triggered the show.
				beforeshow : function(tip) {
					var fileUploadCenterFilterView = me
							.getFileUploadCenterFilterView();
					var client;
					var clientCombo = fileUploadCenterFilterView
							.down('combobox[itemId="clientCodeId"]');
					var paymentTypeVal = '';
					var paymentActionVal = '';
					var dateFilter = me.dateFilterLabel;
					if (!Ext.isEmpty(clientCombo)
							&& !Ext.isEmpty(clientCombo.getValue())) {
						client = clientCombo.rawValue;
					} else {
						client = getLabel('none', 'None');
					}
					if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
						paymentTypeVal = 'All';
						me.showAdvFilterCode = null;
					} else {
						paymentTypeVal = me.paymentTypeFilterDesc;
					}

					if (me.paymentActionFilterVal == 'all') {
						paymentActionVal = 'All';
					} else {
						paymentActionVal = me.paymentActionFilterDesc;
					}
					if (entityType == 0) {
						tip.update(getLabel("clientName", "Company Name")
								+ ' : ' + client + '<br/>'
								+ getLabel('date', 'Date') + ':' + dateFilter
								+ '<br/>' + 'Type : ' + me.typeFilterVal
								+ '<br/>');
					} else {
						if (me.clientFilterDesc == ""
								|| me.clientFilterDesc == null)
							client = 'All Companies';
						else
							client = me.clientFilterDesc;
						tip.update(getLabel("clientName", "Company Name")
								+ " : " + client + '<br>' + 'Date : '
								+ dateFilter + '<br/>' + 'Type : '
								+ me.typeFilterVal + '<br/>');
					}
				}
			}
		});
	},
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
	handleDateChange : function(index) {
				var me = this;
				var filterView = me.getFileUploadCenterFilterView();
				var fromDateLabel = me.getFromDateLabel();
				var toDateLabel = me.getToDateLabel();
				var objDateParams = me.getDateParam(index, null);
				var fromDate = me.getFromEntryDate();
				var toDate = me.getToEntryDate();

				if (fromDate && objDateParams.fieldValue1)
					fromDate.setValue(objDateParams.fieldValue1);
				if (toDate && objDateParams.fieldValue2)
					toDate.setValue(objDateParams.fieldValue2);

				if (index == '7') {
				var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
							strExtApplicationDateFormat ));
					me.getDateRangeComponent().show();
					me.getFromDateLabel().hide();
					me.getToDateLabel().hide();				
					me.getFromEntryDate().setValue( dtEntryDate );
					me.getToEntryDate().setValue( dtEntryDate );
					//me.getFromEntryDate().setMinValue(clientFromDate);
					//me.getToEntryDate().setMinValue(clientFromDate);
					
				} else {
					me.getDateRangeComponent().hide();
					me.getFromDateLabel().show();
					me.getToDateLabel().show();
				}

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText(getLabel('date', 'Date') + " ("
							+ me.dateFilterLabel + ")");
				}
				if (index !== '7') { 
					 vFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
							strExtApplicationDateFormat);
					 vToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
							strExtApplicationDateFormat);
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							// Do nothing for latest
							fromDateLabel.setText('' + '  ' + vFromDate);
						} else
							fromDateLabel.setText(vFromDate);

						toDateLabel.setText("");
					} else {
						fromDateLabel.setText(vFromDate + " - ");
						toDateLabel.setText(vToDate);
						me.vFromDate1 = vFromDate;
						me.vToDate1 = vToDate;
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
						var frmDate, toDate;
						if (!Ext.isEmpty(dateType)) {
							var objCreateNewFilterPanel = me.getCreateNewFilter();
							if (dateType == "process") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=processFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=processToDate]')
										.getValue();
							} else if (dateType == "effective") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=effectiveFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=effectiveToDate]')
										.getValue();
							} else if (dateType == "creation") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=creationFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=creationToDate]')
										.getValue();
							}

						} else {
							frmDate = me.getFromEntryDate().getValue();
							toDate = me.getToEntryDate().getValue();
						}
						frmDate = frmDate || date;
						toDate = toDate || frmDate;

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
					case '12' :
						// Latest
						 //fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						// fieldValue2 = fieldValue1;
						 //operator = 'le';
						break;
				}
				// comparing with client filter condition
				if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
					//fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
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
			//'12' : getLabel('latest', 'Latest'),
			'12' : getLabel('daterange', 'Date Range')

		};
		if (!Ext.isEmpty(objFileUploadCenterPref)) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.importDate;
				var strDtFrmValue = data.quickFilter.importDateFrom;
				var strDtToValue = data.quickFilter.importDateTo;

				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
				
					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;

						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
					}
					else
					{
						var dtParams = me.getDateParam(strDtValue);
						if (!Ext.isEmpty(dtParams)
								&& !Ext.isEmpty(dtParams.fieldValue1)) {
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					}
				}

				var clientSelected = data.filterClientSelected;
				me.clientFilterVal = clientSelected;
				me.clientFilterDesc = data.filterClientDesc;
				arrJsn = me.createAndSetJsonForFilterData();
				var advFilterCode = data.advFilterCode;
				me.savedFilterVal = advFilterCode;
				me.doHandleSavedFilterItemClick(advFilterCode);
			}
		}
		me.filterData = arrJsn;
	},
	createAndSetJsonForFilterData : function() {
		var me = this;
		var arrJsn = new Array();
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
							paramName : 'uploadDateFilter',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
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
		return arrJsn;
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		if (!Ext.isEmpty(filterCode)) {
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);			
		}
		me.showAdvFilterCode = filterCode;
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
	updateConfig : function()
		{
					var me = this;
					me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
					me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		},
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
				if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePreferences, null, me, true);
				}
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
	},
	handleClearPreferences : function() {
		var me = this;
		var sUrl = '?' + csrfTokenName + '=' + csrfTokenValue;
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
				me.disablePreferencesButton("savePrefMenuBtn",false);
				me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
				var me = this;
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
			},
	postHandleClearPreferences : function(data, args, isSuccess) {
				var me = this;
			},	
	/*doSavePreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref + '?' + csrfTokenName + '='
				+ csrfTokenValue;
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
											cls : 'ux_popup',
											icon : imgIcon
										});

							} else {
								// me.toggleClearPrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},	*/
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	},
/*	doClearPreferences : function() {
		var me = this;
		// me.toggleSavePrefrenceAction(false);
		var me = this;
		var strUrl = me.urlGridFilterPref + '?$clear=true' + '&'
				+ csrfTokenName + '=' + csrfTokenValue;
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
									cls : 'ux_popup',
									icon : imgIcon
								});

					} else {
						// me.toggleSavePrefrenceAction(true);
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.INFO
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
								cls : 'ux_popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}

	},*/
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null;
		if (groupView) {
			grid = groupView.getGrid()
			var gridState = grid.getGridState();
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
					&& groupInfo.groupTypeCode !== 'FILECEN_OPT_ADVFILTER') {
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
								'gridCols' : gridState.columns,
								'pgSize' : gridState.pageSize,
								'gridSetting' : groupView.getGroupViewState().gridSetting,
								'sortState' : gridState.sortState
							}
						});
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {};
		var filterPanel = me.getFileUploadCenterFilterView();
		
		var currentFilterValue;
		if(typeof me.getSavedFiltersCombo() !== 'undefined'){
		 currentFilterValue = me.getSavedFiltersCombo().value;
		}
		if (!Ext.isEmpty(currentFilterValue)) {
			advFilterCode = currentFilterValue;
		}else{
		   advFilterCode = me.savedFilterVal;
		
		}
		
		/*if (!Ext.isEmpty(me.savedFilterVal)) {
			advFilterCode = me.savedFilterVal;
		}*/
		var quickPref = {};
		quickPref.importDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.importDateFrom = me.dateFilterFromVal;
				quickPref.importDateTo = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				quickPref.importDateFrom = fieldValue1;
				quickPref.importDateTo = fieldValue2;
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal))
		{
			objFilterPref.filterClientSelected = me.clientFilterVal;
			objFilterPref.filterClientDesc = me.clientFilterDesc;
			
		}	
		return objFilterPref;
	},
	handleType : function(btn) {
		var me = this;
		// me.toggleSavePrefrenceAction(true);
		me.typeFilterVal = btn.btnValue;
		me.typeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyFilterData();
	},
	applyFilterData : function() {
		var me = this;
		me.getFileUploadCenterGridViewRef().refreshData();
	},
	createFileFormatList : function() {
		var me = this;
		// var eventCodesFilterRef = me.getFileUploadDtlRef();
		var strUrl = 'fileFormatTypes.srvc?';
		strUrl = strUrl + '$filter=' + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					params : {
						csrfTokenName : tokenValue
					},
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							me.createList(data.d.fileUploadCenter);
						}
					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	createList : function(jsonData) {
		var me = this;
		var objfileUploadDtlRefPanel = me.getFileUploadDtlRef();
		var infoArray = this.createFileFormatMenuList(jsonData, me);
		objfileUploadDtlRefPanel.add({
					xtype : 'button',
					border : 0,
					filterParamName : 'ccyCode',
					itemId : 'ccyCodeCombo',// Required
					cls : 'xn-custom-arrow-button cursor_pointer w1',
					menu : Ext.create('Ext.menu.Menu', {
								items : infoArray
							})
				})
	},
	createFileFormatMenuList : function(jsonData, me) {
		var infoArray = new Array();
		if (jsonData) {
			for (var i = 0; i < jsonData.length; i++) {
				infoArray.push({
							text : getLabel('label' + i, jsonData[i].ccyCode),
							btnId : 'btn' + jsonData[i].ccyCode,
							btnValue : i,
							code : jsonData[i].ccyCode,
							parent : this,
							handler : function(btn, opts) {
								me.setCcyCode(btn);
							}
						});
			}
		}
		return infoArray;
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	resetAllFields : function() {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
		.down('fileUploadCreateNewAdvFilter');		
		objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'textfield[itemId="saveFilterAsFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="saveFilterAsFilterItemId"]' ).setDisabled(false);
		objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setDisabled(false);
		objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setValue('All');
		objCreateNewFilterPanel.down( 'textfield[itemId="statusFilterItemId"]' ).setDisabled(false);
		objCreateNewFilterPanel.down( 'textfield[itemId="userFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="userFilterItemId"]' ).setDisabled(false);
		objCreateNewFilterPanel.down( 'datefield[itemId="importDateFrmFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="importDateFrmFilterItemId"]' ).setDisabled(false);
		objCreateNewFilterPanel.down( 'datefield[itemId="importDateToFilterItemId"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="importDateToFilterItemId"]' ).setDisabled(false);
		var errorlabel = objCreateNewFilterPanel.down('label[itemId="errorLabel"]');
			errorlabel.setText('');
			errorlabel.hide();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('createNewFilter', 'Create New Filter'));		
	},
	handleSearchActionGridView : function(btn) {
		var me = this;
		me.doAdvSearchOnly();
	},
	doAdvSearchOnly : function() {
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.applyAdvancedFilter();
	},
	closeGridViewFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	handleRangeFieldsShowHide : function(objShow) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj1 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo1"]');
		var soobj1 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo2"]');
		var toobj2 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo2"]');
		var soobj2 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo3"]');
		var toobj3 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo3"]');
		var soobj3 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo4"]');
		var toobj4 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo4"]');
		if (toobj1) {
			toobj1.setDisabled(false);
			soobj1.setDisabled(false);
		}

		if (toobj2) {
			toobj2.setDisabled(false);
			soobj2.setDisabled(false);
		}

		if (toobj3) {
			toobj3.setDisabled(false);
			soobj3.setDisabled(false);
		}

		if (toobj4) {
			toobj4.setDisabled(false);
		}

	},
	applyAdvancedFilter : function() {
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.refreshData();
		me.resetAllFields();
		me.updateAdvActionToolbar();
		me.closeFilterPopup();
	},
	postDoSaveAndSearch : function() {
		var me = this;
		me.doAdvSearchOnly();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format('userfilters/fileUploadCenter/{0}.srvc',
				FilterCodeVal);
		var objJson;
		objJson = me.getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
							//me.reloadFilters(filterGrid.getStore());
							//me.updateSavedFilterComboInQuickFilter();
							me.readAllAdvancedFilterCode();
							me.reloadGridRawData();
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
		store.reload({
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
		//this.sendUpdatedOrderJsonToDb(store);
	},
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (me.savedFilterVal == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.readAllAdvancedFilterCode();
		//me.sendUpdatedOrderJsonToDb(store);
		//me.reloadFilters(store);
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
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
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('fileUploadCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				true);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAsFilterItemId"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAsFilterItemId"]')
				.setDisabled(true);
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;

		me.getSaveSearchBtn().show();

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, me.populateSavedFilter,
				applyAdvFilter);
		objTabPanel.setActiveTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		me.filterCodeValue = filterCode;
		var strUrl = 'userfilters/fileUploadCenter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		var urlSave = strUrl ;
		Ext.Ajax.request({
					url : urlSave,
					headers: objHdrCsrfParams,
					method : 'GET',
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
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('fileUploadCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAsFilterItemId"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAsFilterItemId"]')
				.setDisabled(true);
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;

		me.getSaveSearchBtn().show();

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, me.populateSavedFilter,
				applyAdvFilter);
		objTabPanel.setActiveTab(1);
	},
	searchActionClicked : function(me) {
		var filterCode = $('#savedFilterAs').val();
		me.savedFilterVal = filterCode;
		me.doAdvSearchOnly();
		me.updateSavedFilterComboInQuickFilter();
	},
	saveAndSearchActionClicked : function(me) {
		me.savedFilterVal = null;	
		me.handleSaveAndSearchAction();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("input[type='text'][id='savedFilterAs']");
		if (Ext.isEmpty(FilterCode)) {
			Ext.MessageBox.alert('Input', 'Enter Filter Name');
			return;
		}
		strFilterCodeVal = FilterCode.val();
		me.savedFilterVal = strFilterCodeVal;
		if (Ext.isEmpty(strFilterCodeVal)) {
			if ($('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').removeClass('ui-helper-hidden');
				$('#advancedFilterErrorMessage').text(getLabel('filternameMsg',
						'Please Enter Filter Name'));
			}
		} else {
			if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
			}
			me.postSaveFilterRequest(strFilterCodeVal, callBack);
		}
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this, popup = this.getAdvanceFilterPopup();
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
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'fileName') {
				me.getFileNameAdvFilter().setValue(fieldVal);
			} else if (fieldName === 'userName') {
				me.getUserAdvFilter().setValue(fieldVal);
			}

			if (fieldName === 'uploadDateFilter') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			} else if (fieldName === 'status') {
				me.getStatusAdvFilter().setValue(fieldVal);
			}
		}
		if (!Ext.isEmpty(filterCode)) {
			me.getSaveFilterAsAdvFilter().setValue(filterCode);
		}
		if (applyAdvFilter)
			me.applyAdvancedFilter();
	},
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			//var popup = this.getAdvanceFilterPopup()
			var dateFilterRef = null;
			var dateOperator = data.operator;
			var importDateFrom = me.getImportDateFromField();
			var importDateTo = me.getImportDateToField();
			
			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					importDateFrom.setValue(formattedFromDate);
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					var toDate = data.value2;
					importDateFrom.setValue(formattedFromDate);
					if (!Ext.isEmpty(toDate)) {
						var formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
						importDateTo.setValue(formattedToDate);
					}
				}
			}
		
			selectedImportDateInAdvFilter = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate
			};
			
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	updateStatusFilterView : function() {
		var me = this;
		var statuslabelValue = me.getStatusLabel();
		var objStatusLbl = {
			'All' : getLabel('AllStatus', 'All'),
			'N' : getLabel('newStatus', 'New'),
			'C' : getLabel('completedStatus', 'Completed'),
			'E' : getLabel('abortedStatus', 'Aborted'),
			'T' : getLabel('rejectedStatus', 'Rejected'),
			'R' : getLabel('runningStatus', 'Running'),
			'Q' : getLabel('inQueueStatus', 'In Queue')
		};
		if (!Ext.isEmpty(me.typeFilterVal)) {
			statuslabelValue.setText(objStatusLbl[me.typeFilterVal]);
		}
	},
	createSellerClientMenuList : function() {
		var me = this;
		var filterPanel = me.getSellerClientMenuBar();

		var objSellerStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/sellerList.json'
					}
				});
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
	},
	createClientMenuList : function() {
		var me = this;
		var filterPanel = me.getSellerClientMenuBar();

		var objClientStore = Ext.create('Ext.data.Store', {
					fields : ['clientId', 'clientDescription'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/clientList.json'
					}
				});
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
	},
	showHideSellerClientMenuBar : function(entityType) {
		var me = this;
		if (entityType === '0') {
			me.createSellerClientMenuList();
		} else {
			if (client_count > 1) {
				me.createClientMenuList();
			}
		}

	},
	applySeekFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		me.filterApplied = 'Q';
		// TODO : Currently both filters are in sync
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType ;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	downloadReport : function(actionName) {
		var me = this;

		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
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
		strUrl = 'services/getFileUploadCenterList/getFileUploadCenterDynamicReport.'
				+ strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl(subGroupInfo,groupInfo);
		strUrl += strQuickFilterUrl;
		strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType ;
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

		var grid = null;
		if (!Ext.isEmpty(objGroupView)) {
			if (!Ext.isEmpty(objGroupView))
				grid = objGroupView.getGrid();
			viscols = grid.getAllVisibleColumns();
			for (var j = 0; j < viscols.length; j++) {
				col = viscols[j];
				if (col.dataIndex && arrSortColumn[col.dataIndex]) {
					if (colMap[arrSortColumn[col.dataIndex]]) {
						// ; do nothing
					} else {
						colMap[arrSortColumn[col.dataIndex]] = 1;
						colArray.push(arrSortColumn[col.dataIndex]);
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
		
		//var strToken = '&' + csrfTokenName + '=' + csrfTokenValue;
		//strUrl += strToken;
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
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	
	refreshGrid : function(grid) {
		var me = this;
		if (null != grid && intervalFlag) {
			var records = grid.getStore().data.items;
			intervalFlag = false;
			for (var i = 0; i < records.length; i++) {
				if ("New" === records[i].data.ahtskStatus) {
					intervalFlag = true;
				}
			}
		}
		if( countr < refreshCount && intervalFlag && refreshIntervalTime)
		{
			countr++;
			setTimeout( function()
			{
				me.refreshData();
			}, refreshIntervalTime * 1000 );
		}
	},
	/*Advance Filter Popup*/
	showAdvanceFilterPopup : function() {
		var me = this, filter = me.getFileUploadCenterFilterView();
		me.filterCodeValue = null;
		var data = me.getQuickFilterQueryJson();
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('fileUploadCreateNewAdvFilter');
		//me.advanceFilterPopup.sellerVal = data['sellerCode'];
		me.resetAllFields();
		me.advanceFilterPopup.show();
		me.advanceFilterPopup.down('tabpanel').setActiveTab(1);
	},
	createAdvanceFilterPopup : function() {
		var me = this, filter = me.getFileUploadCenterFilterView();
		var data = me.getQuickFilterQueryJson();
		me.advanceFilterPopup = Ext.create(
				'GCP.view.FileUploadAdvFilterPopup');
	},
	closeFilterPopup : function(btn) {
		var me = this;
		var advFilterPopup = me.getAdvanceFilterPopup();
		advFilterPopup.close();
	},
	
	getAdvancedFilterQueryJson : function() {
			var objJson = null;
			var jsonArray = [];
			var me = this;
			var fromDateField = me.getImportDateFromField();
			var toDateField = me.getImportDateToField();
			// File Name
			var fileNameVal = me.getFileNameAdvFilter().value;
            fileNameVal = fileNameVal.toLowerCase();
			if (!Ext.isEmpty(fileNameVal)) {
				jsonArray.push({
							field : 'fileName',
							operator : 'lk',
							value1 : encodeURIComponent(fileNameVal.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 0
						});
			}

			// User Name
			var userNameVal = me.getUserAdvFilter().value;
            userNameVal = userNameVal.toLowerCase();
			if (!Ext.isEmpty(userNameVal)) {
				jsonArray.push({
							field : 'userName',
							operator : 'lk',
							value1 : encodeURIComponent(userNameVal.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 0
						});
			}

			// Import Date
			
			if (!Ext.isEmpty(fromDateField)) {
				var opeartor = null;
				if(!Ext.isEmpty(fromDateField) && !Ext.isEmpty(fromDateField.value)){
					opeartor = 'eq';
					if(!Ext.isEmpty(toDateField.value)){
						opeartor = 'bt';
					}
				}
				jsonArray.push({
							field : 'uploadDateFilter',
							operator : opeartor,
							value1 : Ext.util.Format.date(
									fromDateField.value, 'Y-m-d'),
							value2 : (!Ext
									.isEmpty(toDateField.value))
									? Ext.util.Format.date(
											toDateField.value,
											'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}

			// Sort By
			var statusAdvFilterVal = me.getStatusAdvFilter();
			if (!Ext.isEmpty(statusAdvFilterVal) && statusAdvFilterVal.getValue() != "All"
					&& statusAdvFilterVal != "None" && statusAdvFilterVal.getValue() !== "") {
				jsonArray.push({
							field : 'statusCombo',
							operator : 'eq',
							value1 : statusAdvFilterVal.getValue(),
							dataType : 0,
							displayType : 6
						});
			}
			objJson = jsonArray;
			return objJson;
		},
	getAdvancedFilterValueJson : function(FilterCodeVal) {
			var jsonArray = [];
			var me = this;
			var fromDateField = me.getImportDateFromField();
			var toDateField = me.getImportDateToField();
			
			// File Name
			var fileNameVal = me.getFileNameAdvFilter().value;
			if (!Ext.isEmpty(fileNameVal)) {
				jsonArray.push({
							field : 'fileName',
							operator : 'lk',
							value1 : fileNameVal,
							value2 : '',
							dataType : 0,
							displayType : 4
						});
			}

			// User Name
			var userNameVal = me.getUserAdvFilter().value;
			if (!Ext.isEmpty(userNameVal)) {
				jsonArray.push({
							field : 'userName',
							operator : 'lk',
							value1 : userNameVal,
							value2 : '',
							dataType : 0,
							displayType : 4
						});
			}

			// Import Date
			if (!Ext.isEmpty(fromDateField)) {
				var opeartor = null;
				if(!Ext.isEmpty(fromDateField) && !Ext.isEmpty(fromDateField.value)){
					opeartor = 'eq';
					if(!Ext.isEmpty(toDateField.value)){
						opeartor = 'bt';
					}
				}
				jsonArray.push({
							field : 'uploadDateFilter',
							operator : opeartor,
							value1 : Ext.util.Format.date(
									fromDateField.value, 'Y-m-d'),
							value2 : (!Ext
									.isEmpty(toDateField.value))
									? Ext.util.Format.date(
											toDateField.value,
											'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}

			// Status
			var statusAdvFilterCombo = me.getStatusAdvFilter();
			if (!Ext.isEmpty(statusAdvFilterCombo) && statusAdvFilterCombo.getValue() !== "All" && statusAdvFilterCombo.getValue() !== "") {
				jsonArray.push({
							field : 'status',
							operator : 'eq',
							value1 : statusAdvFilterCombo.getValue(),
							dataType : 0,
							displayType : 6
						});
			}

			objJson = {};
			objJson.filterBy = jsonArray;
			if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
				objJson.filterCode = FilterCodeVal;
			return objJson;
		},
	overrideValuesOfQuickFilter : function(advFilterData) {
		var me = this;
		var sellerCombo = me.getFilterUpperPanel()
				.down('combobox[itemId="paymentQueueSellerId"]');
		var clientAutoCompleter = me.getFilterUpperPanel()
				.down('combobox[itemId="bankProcessingQueueClientId"]');
		for (var i = 0; i < advFilterData.length; i++) {
			if (advFilterData[i].field === 'seller'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				sellerCombo.setValue(advFilterData[i].value1);
			if (advFilterData[i].field === 'clientName'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				clientAutoCompleter.setValue(advFilterData[i].value1);
		}
	},
	handleSaveAndSearchAdvFilter : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('fileUploadCreateNewAdvFilter');
		var advGridView = me.getAdvanceFilterPopup()
				.down('fileUploadAdvFilterGridView');
		me.filterCodeValue = objCreateNewFilterPanel.down('textfield[itemId="saveFilterAsFilterItemId"]').getValue();
		if (me.filterCodeValue === null) {
			var filterCode = me.getSaveFilterAsAdvFilter();
			var filterCodeVal = filterCode.getValue();
			me.filterCodeValue = filterCodeVal;
		} else {
			var filterCodeVal = me.filterCodeValue;
		}
		var callBack = this.postDoSaveAndSearch;
		
		var errorlabel = objCreateNewFilterPanel
		.down('label[itemId="errorLabel"]');
		if (Ext.isEmpty(filterCodeVal)) {
			errorlabel.setText(getLabel('filternameMsg',
					'Please Enter Filter Name'));
			errorlabel.show();
		} else {
			errorlabel.setText('');
			errorlabel.hide();
			me.postSaveFilterRequest(filterCodeVal, callBack);
			me.getAllSavedAdvFilterCode();
			me.closeFilterPopup();
		}
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		var filterView = me.getFileUploadCenterFilterView();
		var strUrl = me.strReadAllAdvancedFilterCodeUrl;
		Ext.Ajax.request({
					url : strUrl ,
					headers:objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);

						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						if (filterView)
							filterView.addAllSavedFilterCodeToView(arrFilters);

					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	updateAdvActionToolbar : function() {
		var me = this;
		var filterView = me.getFileUploadCenterFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
		Ext.Ajax.request({
					url :  strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var filters = responseData.d;
						if (filterView)
							filterView
									.addAllSavedFilterCodeToView(filters.filters);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	readAllAdvancedFilterCode : function() {
		var me = this;
		var filterView = me.getFileUploadCenterFilterView();		
		//var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl);
		Ext.Ajax.request({
					url :  strUrl ,
					headers: objHdrCsrfParams,
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
	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		var objTabPanel = null;
		var filterDetailsTab = null;
		var clientContainer = null;
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}

		me.advanceFilterPopup.show();
		objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		objTabPanel.setActiveTab(0);
		// commented beacause currently not present
		/*
		 * if (!Ext.isEmpty(objTabPanel)) clientContainer =
		 * objTabPanel.getTabBar() .down('container[itemId=clientContainer]');
		 * if (!Ext.isEmpty(objTabPanel)) clientContainer.setVisible(false);
		 */
		filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
	},
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getFileUploadCenterFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = me.strReadAllAdvancedFilterCodeUrl;
		Ext.Ajax.request({
			url : strUrl,
			headers: objHdrCsrfParams,
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
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getFileUploadCenterFilterView();
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
	setInfoTooltip : function() {
		var me = this, filter = me.getFileUploadCenterFilterView(), arrFilter = [];;
		Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoStdView',
					listeners : {
						'beforeshow' : function(tip) {
							var data = me.getQuickFilterQueryJson();
							var financialInstitutionVal = sellerCode;
							var entityTypeFilterLabel = "";
							var entityTypeFilter = me.clientFilterDesc;
								if(me.entityType === 'BANK_CLIENT')
									{
									entityTypeFilterLabel = 'Client';
									if(entityTypeFilter === null)
										entityTypeFilter ='ALL';
									else
										entityTypeFilter = me.clientFilterDesc;
									}
								else if(me.entityType === 'BANK')
									{
									entityTypeFilterLabel = 'Bank';
									entityTypeFilter = 'Bank';
									}
									
							
							var advfilter = (me.filterCodeValue || getLabel(
									'none', 'None'));
							tip.update(getLabel('lblfinancialinstitution',
									'Financial Insitution')
									+ ' : '
									+ financialInstitutionVal
									+ '<br/>'
									+getLabel('lblByBank',
									'By '+entityTypeFilterLabel)
									+ ' : '
									+ entityTypeFilter
									+ '<br/>'
									+getLabel('lblDate',
									'Date')
									+ ' : '
									+ me.dateFilterLabel
									+ '<br/>'
									+ getLabel('lbladvancedfilter',
											'Advanced Filter')
									+ ' : '
									+ advfilter);
						}
					}
				});

	}
});