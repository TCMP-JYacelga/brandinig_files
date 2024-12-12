Ext.define('GCP.controller.ForecastAccountSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.accountSummary.ForecastAccountSummaryFilterView', 'GCP.view.accountSummary.ForecastAccountSummaryView', 'GCP.view.ForecastSummaryCenter'],
	refs : [{
		ref : 'groupView',
		selector : 'accountSummaryView groupView'
	}, {
		ref : 'grid',
		selector : 'accountSummaryView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'accountSummaryView groupView filterView'
	}, {
		ref : 'accountSummaryView',
		selector : 'accountSummaryView'
	},{
		ref : 'forecastAccountSummaryFilterView',
		selector : 'forecastAccountSummaryFilterView'
	},{
		ref : 'accountAuto',
		selector : 'forecastAccountSummaryFilterView AutoCompleter[itemId="accNmbrAuto"]'
	}, {
		ref : 'forecastSummaryCenter',
		selector : 'accountCenter'
	}],
	config : {
		strPageName:'forecastAccountSummary',
		equiCcy : 'USD',
		equiCcySymbol : '$',
		strModifySavedFilterUrl : 'services/userfilters/forecastAccountSummary/{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/forecastAccountSummary/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/forecastAccountSummary/{0}/remove.json',
		pageSettingPopup : null,
		strRibbonPageName : strRibbonPageName,
		reportGridOrder : null,
		newTitle : 'Forecast Summary',
		savedFilterVal : '',
		filterCodeValue : null,
		showAdvFilterCode : null,
		firstLoad : false,
		objLocalData : null
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		/*me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');*/
		populateAdvancedFilterFieldValue();
		
		//Save and retain local preferences
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
			
		}
		
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction();
		});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		}); 
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue = null;
			selectedClient = "";
		});
		me.equiCcy = (!Ext.isEmpty(strSellerCcy) ? strSellerCcy : 'USD');
		me.equiCcySymbol = (!Ext.isEmpty(strSellerCcySymbol) ? strSellerCcySymbol : '$');
		
		GCP.getApplication().on({
			'showSummary' : function(record, summaryType) {
				$('#cffSummaryBackDiv').hide();
				if(entityType === "1"){
					$('#cffDisclaimerText').html(disclaimerText);
				}else{
					me.getDisclaimerText(me.clientCode, "AccountSummary");
				}
				$('#cffSummaryTitle').html('Cashflow Forecast / Forecast Summary');
				var container = me.getForecastSummaryCenter();
				container.setActiveCard(0);
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			}
		}),
		me.control({
			'accountSummaryView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
			/*	'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,*/

				'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				/*'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
				},*/
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				},
				'render' : function() {
					if(document.title !== me.newTitle)
						document.title = me.newTitle;
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					var objJsonData='', objLocalJsonData='',savedFilterCode='';
					if (objSummaryPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objSummaryPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
									for(var i=0;i<quickPref.length;i++){
										if(quickPref[i].paramName == "accountNo"){
											me.filterAccount = quickPref[i].paramValue1;
											me.filterAccountDesc = quickPref[i].displayValue1;
										}
										
									}
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
								}
								
								else if (!Ext.isEmpty(objJsonData.d.preferences)) {
									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
											me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
											me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									}
								}
							}
							else if (!Ext.isEmpty(objJsonData.d.preferences)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								}
							}
						}
						
//						if (!Ext.isEmpty(objJsonData.d.preferences)) {
//							if (!Ext
//									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
//								if (!Ext
//										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
//									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//									me.doHandleSavedFilterItemClick(advData);
//									me.savedFilterVal = advData;
//								}
//							} 
//						}
						
					}
				}
			},
		'filterView[itemId="accSummaryFilterView"] combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
		'filterView[itemId="accSummaryFilterView"]' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			},
		'filterView[itemId="accSummaryFilterView"] label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					getAdvancedFilterPopup();
					me.assignSavedFilter();
				}
			},
		'filterView[itemId="accSummaryFilterView"] button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				},
				'render' : function() {
				
				}
			},
			'forecastAccountSummaryFilterView combo[itemId="clientCombo"]' : {
			select : function(combo, record) {
							me.selectedFilterClient = combo.getValue();
							me.selectedFilterClientDesc = combo.getDisplayValue();
							selectedClient = me.selectedFilterClient;
							selectedClientDesc = me.selectedFilterClientDesc;
							me.getDisclaimerText(selectedClient,"AccountSummary");
							$("#dropdownCompany").val(selectedClient);
							$("#dropdownCompany").niceSelect('update');
							me.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
							
							},
			boxready : function(combo, width, height, eOpts) {
//								combo.setValue(combo.getStore().getAt(0));
							}
		},
		'forecastAccountSummaryFilterView AutoCompleter[itemId="clientAuto"]' : {
				select : function(combo, record) {
					me.selectedFilterClient = combo.getValue();
					me.selectedFilterClientDesc = combo.getDisplayValue();
					selectedClient = me.selectedFilterClient;
					selectedClientDesc = me.selectedFilterClientDesc;
					//gets the disclaimer text for selected client
					me.getDisclaimerText(selectedClient,"AccountSummary");
					$("#dropdownCompany").val(selectedClient);
					$("#dropdownCompany").niceSelect('update');
					$("#dropdownAccountNo  option").remove();		
					setAccountNumberItems("#dropdownAccountNo");
					me.handleClientChangeInQuickFilter();
					me.isCompanySelected = true;
					
				},
				
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue())) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.selectedFilterClient = combo.getValue();
							me.selectedFilterClientDesc = combo.getDisplayValue();
							selectedClient = me.selectedFilterClient;
							selectedClientDesc = me.selectedFilterClientDesc;
							$("#dropdownCompany").val(selectedClient);
							$("#dropdownCompany").niceSelect('update');
							$("#dropdownAccountNo  option").remove();		
							setAccountNumberItems("#dropdownAccountNo");
							me.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
						}
					}else{
						me.isCompanySelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isCompanySelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isCompanySelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.selectedFilterClient = combo.getValue();
								me.selectedFilterClientDesc = combo.getValue();
								selectedClient = me.selectedFilterClient;
								selectedClientDesc = me.selectedFilterClientDesc;
								$("#dropdownCompany").val(selectedClient);
								$("#dropdownCompany").niceSelect('update');
								$("#dropdownAccountNo  option").remove();		
								setAccountNumberItems("#dropdownAccountNo");
								me.handleClientChangeInQuickFilter();
								me.isCompanySelected = true;
					}
				}
				
			},
		'forecastAccountSummaryFilterView AutoCompleter[itemId="accNmbrAuto"]' : {
				select : function(combo, record) {
					me.filterAccount = combo.getValue();
					me.filterAccountDesc = combo.getRawValue();
					me.isAccountSelected = true;
					$("#dropdownAccountNo").val(me.filterAccount);
					$("#dropdownAccountNo").niceSelect('update');
					me.handleClientChangeInQuickFilter();
					me.handleAccountNoFieldSync('Q', me.filterAccount);
				},
				
				change : function( combo, record, oldVal )
				{
					if(Ext.isEmpty(combo.getRawValue())) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							
							me.filterAccount = combo.getValue();
							me.filterAccountDesc = combo.getDisplayValue();
							$("#dropdownAccountNo").val(me.filterAccount);
							$("#dropdownAccountNo").niceSelect('update');
							me.handleClientChangeInQuickFilter();
							me.handleAccountNoFieldSync('Q', me.filterAccount);
							me.isAccountSelected = true;
						}
					}else{
						me.isAccountSelected = false;
					}
				},
				keyup : function(combo, e, eOpts){
					me.isAccountSelected = false;
				},
				blur : function(combo, The, eOpts ){
					if(me.isAccountSelected == false  
							&& !Ext.isEmpty(combo.getRawValue()) ){
								me.filterAccount = combo.getValue();
								me.filterAccountDesc = combo.getValue();
								$("#dropdownAccountNo").val(me.filterAccount);
								$("#dropdownAccountNo").niceSelect('update');
								me.handleClientChangeInQuickFilter();
								me.handleAccountNoFieldSync('Q', me.filterAccount);
								me.isAccountSelected = true;
					}
				},
				boxready : function(combo, width, height, eOpts){
					var me = this;
					//var objAccountField = me.getForecastAccountSummaryFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
					
					if (!Ext.isEmpty(me.filterAccount)) {
							combo.setValue(me.filterAccount);
							combo.setRawValue(me.filterAccountDesc);
						}
						else
							combo.setValue(combo.getStore().getAt(0));
					me.retainAccountNo(combo);
				}
				
			},	
		'forecastAccountSummaryFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					var clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
					if ((clientComboBox.store.getCount() < 2) && isClientUser())
						{
							var actNumAutocompleter = me.getForecastAccountSummaryFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
							actNumAutocompleter.cfgExtraParams = [];
							var clientFilter = {
								key : '$filtercode1',
								value : strClient
							};
							actNumAutocompleter.cfgExtraParams.push(clientFilter);
						}
					me.clientCode = strClient;
				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					//me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
				

			},
		'pageSettingPopUp[itemId="accountSummaryPageSetting"]' : {
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
			'summaryRibbonSettingPopup[itemId="summaryDialog"]' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applySummaryRibbonPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.saveSummaryRibbonPageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restoreSummaryRibbonPageSetting(data,strInvokedFrom);
				}
			},
			'ribbonView[itemId="summaryCarousal"]' : {
				'ribbonSettingClick' : function() {
					me.showRibbonSetting();
				},
				'afterrender' : function() {
					var generalSettings =  objSummaryInfoPopupPref 
										&& Ext.decode(objSummaryInfoPopupPref).d.preferences
										&& Ext.decode(objSummaryInfoPopupPref).d.preferences.GeneralSetting
										? Ext.decode(objSummaryInfoPopupPref).d.preferences.GeneralSetting
										: '';
										
					var currencyDesc =  generalSettings && generalSettings.defaultCcyDesc 
									  ? generalSettings.defaultCcyDesc  : me.equiCcy;
										  
					var currencyCode = generalSettings && generalSettings.defaultCcyCode 	
					  				 ? generalSettings.defaultCcyCode  : me.equiCcy;
					 
					var currencySymbol = generalSettings && generalSettings.defaultCcySymbol 	
					  				 ? generalSettings.defaultCcySymbol  : me.equiCcySymbol;
					  				 
					me.doHandleCurrencyChange(currencyCode, currencySymbol);
					 
					if(!Ext.isEmpty(currencyCode))
						$('#summaryCarousal_SPAN').text(' in ' + currencyCode);
				},
				'expand' : function(panel) {
					afterCreateCarouselReq();
					panel.doLayout();
				}
			}
		});

	},
	/*Gets the disclaimer Text for selected client in filter and summary type page*/
	getDisclaimerText : function(selectedClient, summaryType) {
		if(selectedClient === "all" && entityType === "1"){
			selectedClient = "";
		}
		var me = this;
		$.ajax({
			url : 'services/getDisclaimerText?$sellerCode='+ strSeller + '&$clientCode=' + selectedClient + '&$summaryType=' + summaryType,
			type : 'POST',
			contentType : "application/json",
			success :function(data){
				if(!Ext.isEmpty(data) && !Ext.isEmpty(data.d) && !Ext.isEmpty(data.d.disclaimerText)){					
					var disclaimerText = data.d.disclaimerText;
					$('#cffDisclaimerText').text(disclaimerText);
					$('#cffDisclaimerTextWrap').removeClass('hidden');
				}else {
					$('#cffDisclaimerText').text('');
					$('#cffDisclaimerTextWrap').addClass('hidden');
				}
				
			},
			error : function(data){
			}
		});
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
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
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAccountSummaryView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
			if (data && data.preference) {
				objPref = Ext.decode(data.preference);
				arrCols = objPref.gridCols || null;
				intPgSize = objPref.pgSize || _GridSizeMaster;
				colModel = arrCols;
				showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
				heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
				if (colModel) {
					gridModel = {
						columnModel : colModel,
						//pageSize : intPgSize,
						//showPagerForced : showPager,
						heightOption : heightOption,
						storeModel:{
							sortState:objPref.sortState
						}
					};
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

	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];

		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
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
		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter) + "&$filter="+ me.getFilterUrl(subGroupInfo, groupInfo);
		
		if(!Ext.isEmpty(selectedClient))
			strUrl = strUrl + "&$clientCode=" + selectedClient;
		if(!Ext.isEmpty(me.filterAccount))
			strUrl = strUrl + "&$accountNo=" + me.filterAccount;
		strUrl = strUrl + "&$eqCurrency="+me.equiCcy;
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = (me.filterData).map(function(v) {
					  return  v;
					});
				
					reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'clientCode');
				if(!Ext.isEmpty(reqJsonInQuick) && (strEntityType === "0") && ((reqJsonInQuick.paramValue1 === "")  ))
					quickJsonData.splice('clientCode',1);
				
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}
		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);

			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		/*if (arrOfFilteredApplied)
		me.getFilterView().updateFilterInfo(arrOfFilteredApplied);*/
		//TODO update above condition with respect to adv filter later
		
		grid.loadGridData(strUrl, null, null, false);
		objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
		me.reportGridOrder = strUrl;
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
		me.handleSummaryInformationRender();
		if (isClientUser()){
			var clientComboBox = me.getForecastAccountSummaryFilterView()
			.down('combo[itemId="clientCombo"]');
			clientComboBox.setValue(selectedClient);
		}
		else{
			var clientComboBox = me.getForecastAccountSummaryFilterView()
			.down('combo[itemId="clientAuto]');
			clientComboBox.setValue(selectedClient);
			clientComboBox.setRawValue(selectedClientDesc);
		}
		var objAccountField = me.getForecastAccountSummaryFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
		me.retainAccountNo(objAccountField);
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
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},
	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		//TODO implement at time of periodic summary dev
		var me = this;
		var strEventName = null;
		summaryType = 'PeriodicSummary';
		if(actionName === 'btnViewPeriodSummary')
			strEventName = 'showPeriod';
		GCP.getApplication().fireEvent(strEventName, record, summaryType);
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
		var me = this, args = {};
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			me.preferenceHandler.readPagePreferences(me.strPageName,
					me.updateObjSummaryPref, args, me, false);
		}
	},
	updateObjSummaryPref : function(data) {
		objSummaryPref = Ext.encode(data);
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
		} else {
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
					};
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
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objSummaryPref)) {
			objPrefData = Ext.decode(objSummaryPref);
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
			 * preferences/gridsets/user defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		else if (Ext.isEmpty(objSummaryPref))
		{
			objColumnSetting = FORECAST_SUMM_GENERIC_COLUMN_MODEL;
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/forecastAccountSummary.json';
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
					itemId : 'accountSummaryPageSetting',
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/*Page setting handling ends here*/
	
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = me.selectedFilterClient;
		me.clientDesc = me.selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.updateFilterparams();
		me.setDataForFilter();
		me.applyFilter();
	},
	updateFilterparams : function() {
		var me = this;
		var actNumAutocompleter = me.getFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
		actNumAutocompleter.cfgExtraParams = [];
		if(me.clientCode && 'ALL' !== me.clientCode && 'all' !== me.clientCode) {
			var clientFilter = {
				key : '$filtercode1',
				value : me.clientCode
			};
			actNumAutocompleter.cfgExtraParams.push(clientFilter);
		}
		
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		//TODO Adv filter handling
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy : getAdvancedFilterQueryJson());
				
		var reqJson = me.findInAdvFilterData(objJson, "clientCode");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "clientCode");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "accountNo");

		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"accountNo");

			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "inFlows");

		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"inFlows");

			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;
	},
	getQuickFilterQueryJson	: function() {
		var me = this,
		clientParamName = null,
		clientNameOperator = null,
		clientCodeVal = null,
		
		jsonArray = [];
		if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'all' !== me.clientCode  && 'ALL' !== me.clientCode ) {
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : clientCodeVal,
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : me.clientDesc
			});
		}
		else if ((strEntityType === "0") && ( null === me.clientCode ||'ALL' === me.clientCode || '' === me.clientCode || me.clientCode === undefined || 'all' === me.clientCode) ){
			clientParamName = 'clientCode';
			clientNameOperator = 'eq';
			clientCodeVal = me.clientCode;
			jsonArray.push({
				paramName : clientParamName,
				paramValue1 : '',
				operatorValue : clientNameOperator,
				dataType : 'S',
				paramFieldLable : getLabel('lblcompany', 'Company Name'),
				displayType : 5,
				displayValue1 : ''
			});
		}
		if(!Ext.isEmpty(me.filterAccount) && "ALL" !== me.filterAccount && "all" !== me.filterAccount) {
			jsonArray.push({
				paramName : 'accountNo',
				operatorValue : 'lk',
				paramValue1 : me.filterAccount.toUpperCase(),
				dataType : 'S',
				paramFieldLable : getLabel('accountnumber', 'Account Number'),
				displayType : 5,
				displayValue1 : me.filterAccountDesc
			});
		}
		
		return jsonArray;
	},
	applyFilter : function() {
		var me = this;
		
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			if (groupInfo && groupInfo.groupTypeCode === 'CFF_ACCSUM_OPT_ACCTYPE') {
				strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
			}
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.refreshData();
		
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupType = (subGroupInfo && subGroupInfo.groupId)
		? subGroupInfo.groupId
		: '';
		var strGroupQuery = '';
		
			if (subGroupInfo && subGroupInfo.groupCode && subGroupInfo.groupQuery)
				strGroupQuery = subGroupInfo.groupQuery + ' \''+ subGroupInfo.groupCode + '\'';	
		
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams();
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}
//TODO adv filter handling
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

		//
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		
		if (Ext.isEmpty(strUrl) && (strEntityType === "0"))
			strUrl += '&$filter=clientCode eq \'\'';

		return strUrl;		
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
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else if (filterData[index].field === "AllTxnType") {
									strTemp = strTemp
											+ '(inFlows bt '+ '\'' + filterData[index].value1 + '\'' + ' and ' + '\'' + filterData[index].value2
											+ '\' or outFlows bt '+ '\'' + filterData[index].value1 + '\'' + ' and ' + '\'' + filterData[index].value2 + '\')'
						} 
						else {
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
								} else if (filterData[index].field === "AllTxnType") {
									strTemp = strTemp
											+ '(inFlows eq '+ '\'' + objValue + '\' or outFlows eq '+ '\'' + objValue + '\')'
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
						} else if (filterData[index].field === "AllTxnType") {
									strTemp = strTemp
											+ '(inFlows '+ filterData[index].operator + '\'' + filterData[index].value1 + '\' or outFlows '+ filterData[index].operator + '\'' + filterData[index].value1 + '\')'
						}
						else {
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
	generateUrlWithQuickFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var strFilter = '&$filter=';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
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
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	assignSavedFilter : function(){
		var me = this;
		if (me.firstTime) {
			me.firstTime = false;
			var objJsonData='', objLocalJsonData='',savedFilterCode = '';
			var accountChangedValue = "";
			if (objForecastCenterPref || objSaveLocalStoragePref) {
				objJsonData = Ext.decode(objForecastCenterPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				
				if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
					if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
									for(var i=0;i<quickPref.length;i++){
										if(quickPref[i].paramName == "accountNo"){
											me.filterAccount = quickPref[i].paramValue1;
											me.filterAccountDesc = quickPref[i].displayValue1;
											accountChangedValue = quickPref[i].displayValue1;
										}
										
									}
								}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
							//var accountChangedValue = $("#dropdownAccountNo").getMultiSelectValue();
							
							for(var i=0;i<me.advFilterData.length;i++){
								if(me.advFilterData[i].field == "accountNo"){
									 accountChangedValue = me.advFilterData[i].displayValue1;
								}
							}
							me.handleAccountNoFieldSync('A', accountChangedValue);
						}
						else if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							}
						}
					}
					else if (!Ext.isEmpty(objJsonData.d.preferences)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
							me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
						}
					}
				}
			}
			else if (objForecastCenterPref) {
				var objJsonData = Ext.decode(objForecastCenterPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if (advData === me.getForecastAccountSummaryFilterView()
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
	
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		
		if (isClientUser()) {
			var clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			me.selectedFilterClientDesc = "";
			me.selectedFilterClient = "";
			selectedClient = "";
			clientComboBox.setValue(me.clientFilterVal);
			
		} else {
			var clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('AutoCompleter[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientCode = '';
			me.selectedFilterClientDesc = "";
			selectedClient = "";
			me.selectedFilterClient = "";
			
		}
		
		var accountComboBox = me.getForecastAccountSummaryFilterView()
					.down('AutoCompleter[itemId="accNmbrAuto]');
			accountComboBox.reset();
			me.filterAccount = "";
			me.filterAccountDesc = "";
		
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getForecastAccountSummaryFilterView()
			.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		/*var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
			accountCombo.setValue("ALL");*/
	
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		
		if(entityType === "0"){
			$('#cffDisclaimerText').text('');
			$('#cffDisclaimerTextWrap').addClass('hidden');
		}

		//me.resetAllFields(); //TODO Need impl for adv filter
		me.handleClientChangeInQuickFilter();
		
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();

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
	updateInQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				ai.paramValue1 = ai.paramValue2;
				ai.operatorValue = "le";
			}
		}
		return arr;
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
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
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
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.savedFilterVal = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}

		/*var statusChangedValue = $("#dropdownStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#dropdownStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});
		var effectiveDateLableVal = $('label[for="effectiveDateDropDownLabel"]').text();
		var effectiveDateField = $("#effectiveDate");
		me.handleEffectiveDateSync('A', effectiveDateLableVal, null, effectiveDateField);
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;*/
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
			 //quick
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
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if(strFieldName === "accountNo") {
			var accountCombo = me.getFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
			accountCombo.setRawValue("");
			me.filterAccount = '';
			me.filterAccountDesc = '';
			$("#dropdownAccountNo option:first").attr('selected','selected');
			$("#dropdownAccountNo").niceSelect('update');
		} 
		else if(strFieldName === "clientCode") {
			$("#dropdownCompany option:first").attr('selected','selected');
			$("#dropdownCompany").niceSelect('update');
			$("#dropdownAccountNo option:first").attr('selected','selected');
			$("#dropdownAccountNo").niceSelect('update');
			var accountCombo = me.getFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
			accountCombo.setRawValue("");
			me.filterAccount = '';
			me.filterAccountDesc = '';
			if(strEntityType === "1") {
				var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
				if(clientCombo.getStore().getCount()>=2) {
					var record = clientCombo.getStore().getAt(0);
					clientCombo.setValue(record);
					me.selectedFilterClient = record.data.CODE;
					me.selectedFilterClientDesc = record.data.DESCR;
				} else {
					me.selectedFilterClient = '';
					me.selectedFilterClientDesc = '';
				}
			} else {
				me.resetClientAutocompleter();
			}
		}
		else if(strFieldName === "accountType"){
			$("#dropdownAccountType option:first").attr('selected','selected');
			$("#dropdownAccountType").niceSelect('update');
		}
		else if(strFieldName === "ccyCode"){
			$("#dropdownCurrency option:first").attr('selected','selected');
			$("#dropdownCurrency").niceSelect('update');
		}
		else if(strFieldName === "inFlows" || strFieldName === "outFlows" || strFieldName === "AllTxnType"){
			$('#forecastAmount').val('');
			$('.amountTo').val('');
			$(".amountTo").addClass("hidden");
			$("#amountLabel").text(getLabel("amount","Amount"));
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountOperator").niceSelect('update');
			$("input[type='radio'][id='transTypeAll']").prop('checked', true);	
		}
		me.handleClientChangeInQuickFilter();
	},
	resetClientAutocompleter : function() {
		var me = this;
		var clientAuto = me.getFilterView().down("combo[itemId='clientAuto']");
		clientAuto.reset();
		me.selectedFilterClient = '';
		me.selectedFilterClientDesc = '';
		$('#cffDisclaimerText').text('');
		$('#cffDisclaimerTextWrap').addClass('hidden');
	},
	handleSummaryInformationRender : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var subGroupInfo = objGroupView	.getSubGroupInfo()||{};
		var groupInfo = objGroupView.getGroupInfo();
		var summaryInfoUrl = "services/forecastSummary/accountSummaryInfo?$eqCurrency="+me.equiCcy+ me.getFilterUrl(subGroupInfo, groupInfo);
		if(!Ext.isEmpty(selectedClient))
			summaryInfoUrl = summaryInfoUrl + "&$clientCode=" + selectedClient;
		if(!Ext.isEmpty(me.filterAccount))
			summaryInfoUrl = summaryInfoUrl + "&$accountNo=" + me.filterAccount;
		me.populateSummaryInformationView(summaryInfoUrl);
	},
	populateSummaryInformationView : function(strUrl) {
		var me = this;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
     		objParam[arrMatches[1]] = arrMatches[2];
    	}
        var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
        strUrl = strGeneratedUrl;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					params:objParam,
					success : function(response) {
						var data = null;
						if (!Ext.isEmpty(response) && !Ext.isEmpty(response.responseText))
							data = Ext.decode(response.responseText);
						
						if (!Ext.isEmpty(data)) {
							summaryData = data.d.summary;
							
						var objSummaryInfoPrf = Ext.decode(objSummaryInfoPopupPref);
							var colPrefSettings = objSummaryInfoPrf && objSummaryInfoPrf.d.preferences
					&& objSummaryInfoPrf.d.preferences.ColumnSetting
					&& objSummaryInfoPrf.d.preferences.ColumnSetting.gridCols
					? objSummaryInfoPrf.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericRibbonColumnModel || '[]');
							var summaryPrefData = [],k=0;
							
							for(var i=0 ; i < summaryData.length ; i++){
								for(var j=0; j < colPrefSettings.length ; j++ ){
									if(summaryData[i].infoType == colPrefSettings[j].colId && colPrefSettings[j].hidden != true){
										summaryPrefData[k] = summaryData[i];
										summaryPrefData[k].colSequence  = colPrefSettings[j].colSequence;
										summaryPrefData[k].hidden  = colPrefSettings[j].hidden;
										k++;
								}
								}
							}							
							summaryPrefData.sort(function(a, b){
								 return a.colSequence-b.colSequence
							});
							summaryData = summaryPrefData;
							equiCcyLogo = me.equiCcySymbol;
							afterCreateCarouselReq();
							$('#currentCurrencyLabelId').html(me.equiCcy);
							currencysymbol = me.equiCcySymbol;
							$('#currAutoCompleter').val(me.equiCcy);
						}
					},
					failure : function(response) {
						// console.log("Error Occured - In SummaryData
						// renderer");
					}
				});
	},
	doHandleCurrencyChange : function(strCcy, strCcySymbol) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.equiCcy = strCcy;
		me.equiCcySymbol = strCcySymbol;
		hoverCcySymbol = strCcySymbol;
		
		if (objGroupView)
			objGroupView.refreshData();

	},
	showRibbonSetting : function() {
		
		var me=this;
		var objSummaryInfoPrf = Ext.decode(objSummaryInfoPopupPref);
		var objRibbonColumnSetting = objSummaryInfoPrf && objSummaryInfoPrf.d.preferences
					&& objSummaryInfoPrf.d.preferences.ColumnSetting
					&& objSummaryInfoPrf.d.preferences.ColumnSetting.gridCols
					&& objSummaryInfoPrf.d.preferences.ColumnSetting.gridCols.length > 0
					? objSummaryInfoPrf.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericRibbonColumnModel || '[]');
		me.ribbonSettingsPopup = Ext.create(
				'GCP.view.accountSummary.SummaryRibbonSettingPopup',
				{
					itemId : 'summaryDialog',
					cfgDefaultColumnModel : objRibbonColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgPopUpData : {
						currencyUrl : 'services/userseek/eqvcurrency.json?$top=-1',
						cfgData : Ext.decode(objSummaryInfoPopupPref)
					}
				});
		me.ribbonSettingsPopup.show();
		me.ribbonSettingsPopup.center();
	},
	applySummaryRibbonPageSetting : function(arrPref, strInvokedFrom) {
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
				me.preferenceHandler.saveModulePreferences(me.strRibbonPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferenceHandler.savePagePreferences(me.strRibbonPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	restoreSummaryRibbonPageSetting : function(arrPref, strInvokedFrom) {
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
			me.preferenceHandler.clearPagePreferences(me.strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, args, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(me.strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, null, me, false);
	},
	saveSummaryRibbonPageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from summary ribbon page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strRibbonPageName, arrPref,
					me.postHandleSummaryTypeCodeSavePageSetting, args, me, false);
		}
	},
	resetAllFields : function() {
		var me = this;
		$('#forecastAmount').val('');
		$('.amountTo').val('');
		$(".amountTo").addClass("hidden");
		$("#amountLabel").text(getLabel("amount","Amount"));
		$("#dropdownAccountNo").val($("#dropdownAccountNo option:first").val());
		$("#dropdownCompany").val($("#dropdownCompany option:first").val());
		$("#dropdownAccountType").val($("#dropdownAccountType option:first").val());
		$("#dropdownCurrency").val($("#dropdownCurrency option:first").val());
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("input[type='radio'][id='transTypeAll']").prop('checked', true);		
		$('#savedFilterAs').val('');
		$("#saveFilterChkBox").attr('checked', false);
		
		$("input[type='text'][id='savedFilterAs']").val("");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		
		$('#dropdownCompany').niceSelect('update');
		$('#dropdownAccountType').niceSelect('update');
		$('#dropdownCurrency').niceSelect('update');
		$('#amountOperator').niceSelect('update');
		$('#dropdownAccountNo').niceSelect('update');
	},
	searchActionClicked : function(me){
		var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
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
			objGroupView.setFilterToolTip(me.filterCodeValue || '');
			me.savedFilterVal = me.filterCodeValue;
		}
	},
	doSearchOnly : function() {
		var me = this;
		var clientComboBox =null;
		if (isClientUser()) {
			clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			if (selectedClient != null && $('#dropdownCompany').val() != 'all') {
				clientComboBox.setValue(selectedClient);
				me.clientCode = selectedClient;
				me.updateFilterparams();
			}else{
				clientComboBox.setValue('');
				me.clientCode = '';
				me.updateFilterparams();
			}
		} else {
			clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('AutoCompleter[itemId="clientAuto]');
			if (selectedClientDesc != null && $('#dropdownCompany').val() != 'all') {
				clientComboBox.setValue(selectedClientDesc);
				me.clientCode = selectedClient;
				me.updateFilterparams();
			}else{
				clientComboBox.setValue('');
			}
		}
		if (selectedClient != null) {
			me.getDisclaimerText(selectedClient,"AccountSummary");
		} 

	
		if ($('#dropdownAccountNo :selected')[0] != undefined)
			var selectedAccountNo = $('#dropdownAccountNo :selected')[0].label;
		else
			var selectedAccountNo = $('#dropdownAccountNo :selected');
		me.handleAccountNoFieldSync('A', selectedAccountNo);

		me.applyAdvancedFilter();
	},
	handleSavedFilterClick : function(){
		//new added code
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
		me.savedFilterVal = me.filterCodeValue;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},	
	handleSaveAndSearchAction : function(){
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
			me.savedFilterVal = me.filterCodeValue;
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
		//me.doHandleStateChange();
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
	//newly added
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
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/forecastAccountSummary/groupViewAdvanceFilter.json',
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
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'clientCode') {
				columnId = fieldVal;
				$("#dropdownCompany").val(fieldVal);
				$("#dropdownCompany").niceSelect('update');
				if (isClientUser()) {
					var clientComboBox = me.getForecastAccountSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
					me.clientCode = fieldVal;
					me.clientDesc = filterData.filterBy[i].displayValue1;
					me.clientFilterVal = (fieldVal === "")?'all':me.clientDesc;
					selectedFilterClientDesc = "" ;
					selectedFilterClient = "";
					me.selectedFilterClient = me.clientCode;
					selectedClientDesc = me.clientDesc ;
					selectedClient=me.clientCode;
					clientComboBox.setValue(me.clientCode);
					setAccountNumberItems("#dropdownAccountNo");
					//clientComboBox.setRawValue(me.clientCode);
			
				} else {
					var clientComboBox = me.getForecastAccountSummaryFilterView()
							.down('combo[itemId="clientAuto]');
					me.clientCode = fieldVal;
					me.clientDesc = filterData.filterBy[i].displayValue1;
					clientComboBox.setValue(me.clientCode);
					clientComboBox.setRawValue(me.clientDesc);
					selectedFilterClientDesc = "" ;
					selectedFilterClient = "";
					selectedFilterClientDesc = "" ;
					me.selectedFilterClient = me.clientCode;
					selectedClientDesc = me.clientDesc ;
					selectedClient=me.clientCode;
					setAccountNumberItems("#dropdownAccountNo");
				}
				//me.getDisclaimerText(me.clientCode);
			}
			else if(fieldName === 'ccyCode'){
				columnId = fieldVal;
				$("#dropdownCurrency").val(fieldVal);
				$("#dropdownCurrency").niceSelect('update');
			}
			else if (fieldName === 'accountType') {
				columnId = fieldVal;
				$("#dropdownAccountType").val(fieldVal);
				$("#dropdownAccountType").niceSelect('update');
			}
			else if (fieldName === 'accountNo') {
				$("#dropdownAccountNo").val(fieldVal);
				$("#dropdownAccountNo").niceSelect('update');
				me.filterAccount = filterData.filterBy[i].value1;
				me.handleAccountNoFieldSync('A', filterData.filterBy[i].displayValue1);
			}
			else if(fieldName === "inFlows"){
				$('#forecastAmount').val(fieldVal);
				if(operatorValue == 'bt')
				{
					$(".amountTo").removeClass("hidden");
					$("#amountFieldTo").removeClass("hidden");
					$("#amountLabel").text(getLabel("amountFrom","Amount From"));
					$('#amountFieldTo').val(fieldSecondVal);
				}
				else
				{
					$('.amountTo').val('');
					$(".amountTo").addClass("hidden");
					$("#amountLabel").text(getLabel("amount","Amount"));
				}
				
				$("#amountOperator").val(operatorValue);
				$("#amountOperator").niceSelect('update');
				$("input[type='radio'][id='transTypeC']").prop('checked', true);	
			}
			else if(fieldName === "outFlows"){
				$('#forecastAmount').val(fieldVal);
				if(operatorValue == 'bt')
				{
					$(".amountTo").removeClass("hidden");
					$("#amountFieldTo").removeClass("hidden");
					$("#amountLabel").text(getLabel("amountFrom","Amount From"));
					$('#amountFieldTo').val(fieldSecondVal);
				}
				else
				{
					$('.amountTo').val('');
					$(".amountTo").addClass("hidden");
					$("#amountLabel").text(getLabel("amount","Amount"));
				}
				$("#amountOperator").val(operatorValue);
				$("#amountOperator").niceSelect('update');
				$("input[type='radio'][id='transTypeD']").prop('checked', true);	
			}
			else if(fieldName === "AllTxnType"){
				$('#forecastAmount').val(fieldVal);
				if(operatorValue == 'bt')
				{
					$(".amountTo").removeClass("hidden");
					$("#amountFieldTo").removeClass("hidden");
					$("#amountLabel").text(getLabel("amountFrom","Amount From"));
					$('#amountFieldTo').val(fieldSecondVal);
				}
				else
				{
					$('.amountTo').val('');
					$(".amountTo").addClass("hidden");
					$("#amountLabel").text(getLabel("amount","Amount"));
				}
				$("#amountOperator").val(operatorValue);
				$("#amountOperator").niceSelect('update');
				$("input[type='radio'][id='transTypeAll']").prop('checked', true);	
			}
		}
		me.updateFilterparams();
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
		//}
		
},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/generateForecastSummaryReport.'+strExtension;
		strUrl += '?$skip=1';
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		var filterUrl = me.getFilterUrl(subGroupInfo,groupInfo);
		var filterData = me.filterData;
		var columnFilterUrl = me.getFilterUrl(filterData);
		
		if (!Ext.isEmpty(filterUrl)) {
			strUrl += filterUrl;
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += ' and ' + columnFilterUrl;
		} else {
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += "&$filter=" + columnFilterUrl;
		}
		
		//strUrl += this.generateFilterUrl();
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
		
		var count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
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
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		for (var i = 0; i < arrSelectedrecordsId.length; i++) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', arrSelectedrecordsId[i]));
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
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 
						|| displayType === 6 || displayType === 2)
				//&& strValue 
				) {
			retValue = true;
		}
		return retValue;
	},
	handleAccountNoFieldSync : function(type, accountData) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objAccountField = $("#dropdownAccountNo");
				var objQuickAccountField = me.getForecastAccountSummaryFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
			
				if (!Ext.isEmpty(accountData)) {
					objAccountField.val([]);
					objAccountField.val(accountData);
				} else if (Ext.isEmpty(accountData)) {
					objAccountField.val('');
				}
			$('#dropdownAccountNo').niceSelect('update');
			}
			if (type === 'A') {
				var objAccountField = me.getForecastAccountSummaryFilterView().down('AutoCompleter[itemId="accNmbrAuto"]');
				
				if (!Ext.isEmpty(accountData) && accountData != "Select Account Number") {
					//me.filterAccount = '';
					objAccountField.setValue(accountData);
					//objAccountField.selectedOptions = accountData;
				} else {
					objAccountField.setValue('');
					//me.accountFilterVal = '';
				}
			}
		}
	},
	
	retainAccountNo : function(combo){
		var me=this;
		if(!Ext.isEmpty(me.advFilterData)){
			for(var i=0;i<me.advFilterData.length;i++){
				if(me.advFilterData[i].field == "accountNo"){
					combo.setValue(me.advFilterData[i].value1);
					combo.setRawValue(me.advFilterData[i].displayValue1);
				}
			}
		}
	},
	
/* State handling at local storage starts */
	
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid(),groupInfo= null ,subGroupInfo = null,quickFilterState = {};
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
		}else {
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
	doDeleteLocalState : function(){
		var me = this;
		me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
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
});