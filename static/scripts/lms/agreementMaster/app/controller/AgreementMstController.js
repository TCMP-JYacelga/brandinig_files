Ext
		.define(
				'GCP.controller.AgreementMstController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'Ext.ux.gcp.PageSettingPopUp', 'GCP.view.HistoryPopup' ],
					views : [ 'GCP.view.HistoryPopup', 'GCP.view.AgreementMstFilterView', 'GCP.view.AgreementMstSummaryView' ],
					refs : [ {
						ref : 'groupView',
						selector : 'agreementMstSummaryView groupView'
					}, {
						ref : 'grid',
						selector : 'agreementMstSummaryView groupView smartgrid'
					}, {
						ref : 'filterView',
						selector : 'agreementMstSummaryView groupView filterView'
					}, {
						ref : 'agreementMstSummaryView',
						selector : 'agreementMstSummaryView'
					}, {
						ref : 'agreementMstFilterView',
						selector : 'agreementMstFilterView'
					} ],
					config : {
						strPageName : 'agreementMst',
						strModifySavedFilterUrl : 'services/userfilters/agreementMst/{0}.json',
						strGetSavedFilterUrl : 'services/userfilters/agreementMst/{0}.json',
						strRemoveSavedFilterUrl : 'services/userfilters/agreementMst/{0}/remove.json',
						pageSettingPopup : null,
						isCompanySelected : false,
						strDefaultMask : '000000000000000000',
						userStatusPrefCode : '',
						userStatusPrefDesc : '',
						clientFilterVal : 'all',
						clientFilterDesc : '',
						agreementCodeFilterVal : 'all',
						agreementCodeFilterDesc : "",
						structureTypeFilterVal : 'all',
						structureTypeFilterDesc : "",
						dateHandler : null,
						objLocalData : null,
						firstLoad : false
					},
					init : function() {
						var me = this;
						me.firstLoad = true;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						if(objSaveLocalStoragePref){
							me.objLocalData = Ext.decode(objSaveLocalStoragePref);
							objQuickPref = me.objLocalData && me.objLocalData.d.preferences
												&& me.objLocalData.d.preferences.tempPref 
												&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
							
							me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
							
						}
						$(document).on("handleEntryAction", function() {
							me.handleEntryAction();
						});
						me.updateConfig();
						$(document).on('deleteFilterEvent', function(event, filterCode) {
							me.deleteFilterSet(filterCode);
						});
						$(document).on('searchActionClicked', function() {
							me.searchActionClicked(me);
						});

						$(document).on('performReportAction', function(event, actionName) {
							me.downloadReport(actionName);
						});

						$(document).on('performPageSettings', function(event) {
							me.showPageSettingPopup('PAGE');
						});
						$(document).on('handleSavedFilterClick', function(event) {
							me.handleSavedFilterClick();
						});
						$(document).on('filterDateChange', function(event, filterType, btn, opts) {
							// me.handleDateChange(filterType, btn, opts);
							if (filterType === 'entryDate')
								me.entryDateChange(btn, opts);
							else
								if (filterType === 'originalDate')
									me.originalDateChange(btn, opts);
								else
									if (filterType === 'startDate')
										me.startDateChange(btn, opts);
									else
										if (filterType === 'endDate') me.endDateChange(btn, opts);

						});
						$(document).on('resetAllFieldsEvent', function() {
							me.resetAllFilters();
							me.filterCodeValue = null;
						});
						$(document).on("datePickPopupSelectedDate", function(event, filterType, dates) {
							if (filterType == "entryDate") {
								me.dateRangeFilterVal = '13';
								me.datePickerSelectedEntryAdvDate = dates;
								me.entryDateFilterVal = me.dateRangeFilterVal;
								me.entryDateFilterLabel = getLabel('daterange', 'Date Range');
								me.handleEntryDateChange(me.dateRangeFilterVal);
							}
							else
								if (filterType == "originalDate") {
									me.dateRangeFilterVal = '13';
									me.datePickerSelectedOriginalAdvDate = dates;
									me.originalDateFilterVal = me.dateRangeFilterVal;
									me.originalDateFilterLabel = getLabel('daterange', 'Date Range');
									me.handleOriginalDateChange(me.dateRangeFilterVal);
								}
								else
									if (filterType == "startDate") {
										me.dateRangeFilterVal = '13';
										me.datePickerSelectedStartAdvDate = dates;
										me.startDateFilterVal = me.dateRangeFilterVal;
										me.startDateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleStartDateChange(me.dateRangeFilterVal);
									}
									else
										if (filterType == "endDate") {
											me.dateRangeFilterVal = '13';
											me.datePickerSelectedEndAdvDate = dates;
											me.endDateFilterVal = me.dateRangeFilterVal;
											me.endDateFilterLabel = getLabel('daterange', 'Date Range');
											me.handleEndDateChange(me.dateRangeFilterVal);
										}
						});
						me
								.control({
									'agreementMstSummaryView groupView' : {
										'groupTabChange' : me.doHandleGroupTabChange,
										'gridRender' : me.doHandleLoadGridData,
										'gridPageChange' : me.doHandleLoadGridData,
										'gridSortChange' : me.doHandleLoadGridData,
										'gridPageSizeChange' : me.doHandleLoadGridData,
										'gridColumnFilterChange' : me.doHandleLoadGridData,
										'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
										'gridSettingClick' : function() {
											me.showPageSettingPopup('GRID');
										},
										'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
											me.doHandleRowIconClick(actionName, grid, record, rowIndex);
										},
										'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid,
												arrSelectedRecords) {
											if (isGroupAction === true)
												me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
										},
										'gridStoreLoad' : function(grid, store) {
											me.disableActions(false);
										},
										'render' : function() {
											populateAdvancedFilterFieldValue();
											me.firstTime = true;
											var objJsonData='', objLocalJsonData='',savedFilterCode='';
											if (objAgreementMstPref || objSaveLocalStoragePref) {
												objJsonData = Ext.decode(objAgreementMstPref);
												objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
												
												if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y' ) 
													 {
														if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
															savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
															me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
														}
														if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
															me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
														}
														if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
															me.populateQuickFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.quickFilterJson,true);
														}
													}
													else  {
														if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
															me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
															me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
														}
													}
											}
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

									'filterView' : {
										appliedFilterDelete : function(btn) {
											me.handleAppliedFilterDelete(btn);
										},
										afterrender : function() {
											me.handleClientChangeInQuickFilter();
										}
									},
									'filterView label[itemId="createAdvanceFilterLabel"]' : {
										'click' : function() {
											getAdvancedFilterPopup('advanceFilterLMS.form', 'filterForm');
											me.assignSavedFilter();
										}
									},
									'filterView button[itemId="clearSettingsButton"]' : {
										click : function() {
											me.handleClearSettings();

										}
									},
									'agreementMstFilterView' : {
										beforerender : function() {
											var useSettingsButton = me.getFilterView().down('button[itemId="useSettingsbutton"]');
											if (!Ext.isEmpty(useSettingsButton)) {
												useSettingsButton.hide();
											}
										},
										handleSavedFilterItemClick : function(comboValue, comboDesc) {
											me.savedFilterVal = comboValue;
											me.doHandleSavedFilterItemClick(comboValue, comboDesc);
										}
									},
									'agreementMstFilterView AutoCompleter[itemId="clientComboAuto"]' : {
										select : function(combo, record) {
											var objAgreementAutocompleter = me.getAgreementMstFilterView().down(
													'combo[itemId="agreementCodeItemId"]');
											objAgreementAutocompleter.setValue('');
											objAgreementAutocompleter.cfgSeekId = "sweepMstAgreementCodeSeek";
											objAgreementAutocompleter.cfgExtraParams = [ {
												key : '$filtercode1',
												value : strSellerId
											}, {
												key : '$filtercode2',
												value : record[0].data.CODE
											}

											];
											me.clientFilterVal = combo.getValue();
											me.clientFilterDesc = combo.getDisplayValue();
											selectedFilterClient = me.clientFilterVal;
											selectedFilterClientDesc = me.clientFilterDesc;
											me.handleClientSync('Q', me.clientFilterVal);
											me.handleClientChangeInQuickFilter();
											setAgreementNameMenuItems('#dropdownAgreementName');
											me.isCompanySelected = true;

										},
										change : function(combo, record, oldVal) {
											if (Ext.isEmpty(combo.getRawValue())) {
												if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {

													var objAgreementAutocompleter = me.getAgreementMstFilterView().down(
															'combo[itemId="agreementCodeItemId"]');
													objAgreementAutocompleter.setValue('');
													objAgreementAutocompleter.cfgSeekId = "sweepMstAgreementCodeSeekAll";

													me.clientFilterVal = combo.getValue();
													me.clientFilterDesc = combo.getDisplayValue();
													selectedFilterClient = me.clientFilterVal;
													selectedFilterClientDesc = me.clientFilterDesc;
													me.handleClientSync('Q', me.clientFilterVal);
													me.handleClientChangeInQuickFilter();
													setAgreementNameMenuItems('#dropdownAgreementName');
													me.isCompanySelected = true;
												}
											}
											else {
												me.isCompanySelected = false;
											}
										},
										keyup : function(combo, e, eOpts) {
											me.isCompanySelected = false;
										},
										blur : function(combo, The, eOpts) {
											if (me.isCompanySelected == false && !Ext.isEmpty(combo.getRawValue())) {
												me.clientFilterVal = combo.getValue();
												me.clientFilterDesc = combo.getValue();
												selectedFilterClient = me.clientFilterVal;
												selectedFilterClientDesc = me.clientFilterDesc;
												me.handleClientChangeInQuickFilter();
												me.isCompanySelected = true;
											}
										},
										boxready : function(combo, width, height, eOpts) { 
											var me = this;
											if (!Ext.isEmpty(me.clientFilterVal) && 'ALL' !== me.clientFilterDesc  && 'all' !== me.clientFilterVal) {
												combo.setValue(me.clientFilterVal);
												combo.setRawValue(me.clientFilterDesc);
											}
											else
												combo.setValue(combo.getStore().getAt(0));
										}
									},
									'agreementMstFilterView combo[itemId="clientCombo"]' : {
										select : function(combo, record) {
											if (combo.getValue() !== "all") {
												var objAgreementAutocompleter = me.getAgreementMstFilterView().down(
														'combo[itemId="agreementCodeItemId"]');
												objAgreementAutocompleter.setValue('');
												objAgreementAutocompleter.cfgSeekId = "sweepMstAgreementCodeSeek";
												objAgreementAutocompleter.cfgExtraParams = [ {
													key : '$filtercode1',
													value : strSellerId
												}, {
													key : '$filtercode2',
													value : record[0].data.CODE
												}

												];
											}

											me.clientFilterVal = combo.getValue();
											me.clientFilterDesc = combo.getDisplayValue();
											selectedFilterClient = me.clientFilterVal;
											selectedFilterClientDesc = me.clientFilterDesc;
											me.handleClientSync('Q', me.clientFilterVal);
											me.handleClientChangeInQuickFilter();
											setAgreementNameMenuItems('#dropdownAgreementName');
											me.isCompanySelected = true;
										},
										change : function(combo, record, oldVal) {
											if (Ext.isEmpty(combo.getRawValue()) || combo.getValue() === "all") {
												if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
													var objAgreementAutocompleter = me.getAgreementMstFilterView().down(
															'combo[itemId="agreementCodeItemId"]');
													objAgreementAutocompleter.setValue('');
													objAgreementAutocompleter.cfgSeekId = "sweepMstAgreementCodeSeek";
													objAgreementAutocompleter.cfgExtraParams = [ {
														key : '$filtercode1',
														value : strSellerId
													}, {
														key : '$filtercode2',
														value : strClient
													}

													];
												}
											}

										},
										render : function(combo, width, height, eOpts) {
											var me = this;
											if (!Ext.isEmpty(me.clientFilterVal) && 'ALL' !== me.clientFilterVal
													&& 'all' !== me.clientFilterVal) {
												combo.setValue(me.clientFilterVal);
											}
											else
												combo.setValue(combo.getStore().getAt(0));
										}
									},
									'agreementMstFilterView AutoCompleter[itemId="agreementCodeItemId"]' : {
										select : function(combo, record, index) {
											me.agreementCodeFilterVal = combo.getValue();
											me.agreementCodeFilterDesc = combo.getRawValue();
											me.isAgreementSelected = true;
											me.handleAgreementSync('Q', me.agreementCodeFilterVal);
											me.setDataForFilter();
											me.applyFilter();
										},

										change : function(combo, record, oldVal) {
													me.agreementCodeFilterVal = combo.getValue();
													me.agreementCodeFilterDesc = combo.getDisplayValue();
													me.isAgreementSelected = true;
													me.handleAgreementSync('Q', me.agreementCodeFilterVal);
													//me.setDataForFilter();
													//me.applyFilter();
												
											
										},
										keyup : function(combo, e, eOpts) {
											me.isAgreementSelected = false;
										},
										blur : function(combo, The, eOpts) {
											if (me.isAgreementSelected == false && !Ext.isEmpty(combo.getRawValue())) {
												me.agreementCodeFilterVal = combo.getValue();
												me.agreementCodeFilterDesc = combo.getValue();
												me.isAgreementSelected = true;
												me.setDataForFilter();
												me.applyFilter();
											}
										},
										boxready : function(combo, width, height, eOpts) { 
											var me = this;
											if (!Ext.isEmpty(me.agreementCodeFilterVal) && 'all' !== me.agreementCodeFilterVal) {
												combo.setValue(me.agreementCodeFilterVal);
												combo.setRawValue(me.agreementCodeFilterDesc);
											}
											else
												combo.setValue(combo.getStore().getAt(0));
										}
									},
									'agreementMstFilterView combo[itemId="structureTypeId"]' : {
										select : function(combo, record, index) {
											me.structureTypeFilterVal = combo.getValue();
											me.structureTypeFilterDesc = combo.getDisplayValue();
											me.handleStructureTypeSync('Q', me.structureTypeFilterVal);
											me.setDataForFilter();
											me.applyFilter();
										},
										change : function(combo, record, oldVal) {
											if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
												if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
													me.structureTypeFilterVal = "all";
													me.structureTypeFilterDesc = "";
													me.handleStructureTypeSync('Q', me.structureTypeFilterVal);
													// me.setDataForFilter();
													// me.applyFilter();

												}
											}
										},
										'afterrender' : function(combo, newValue, oldValue, eOpts) {
											if (!Ext.isEmpty(me.structureTypeFilterVal)) {
												combo.setValue(me.structureTypeFilterVal);
											}
											else
												combo.setValue(combo.getStore().getAt(0));
										}
									},
									'agreementMstFilterView  combo[itemId="statusId"]' : {
										'select' : function(combo, selectedRecords) {
											combo.isQuickStatusFieldChange = true;
										},
										'blur' : function(combo, record) {
											if (combo.isQuickStatusFieldChange) me.handleStatusFilterClick(combo);
										},
										boxready : function(combo, width, height, eOpts) {
											if (!Ext.isEmpty(me.userStatusPrefDesc) && me.userStatusPrefDesc != 'All'
													&& me.userStatusPrefDesc != 'all' && !Ext.isEmpty(me.userStatusPrefCode)
													&& me.userStatusPrefCode != 'All' && me.userStatusPrefCode != 'all') {
												var tempArr = [];
												tempArr = me.userStatusPrefCode;
												if (!Ext.isEmpty(tempArr)) {
													me.statusFilterVal = 'all';
													combo.setValue(tempArr);
													combo.selectedOptions = tempArr;
												}
												else {
													combo.setValue(tempArr);
													me.statusFilterVal = '';
												}
											}
										}
									},
									'agreementMstFilterView combo[itemId="savedFiltersCombo"]' : {
										'afterrender' : function(combo, newValue, oldValue, eOpts) {
											if (!Ext.isEmpty(me.savedFilterVal)) {
												combo.setValue(me.savedFilterVal);
											}
										}
									}
								});
						$(document).on('handleClientChangeInQuickFilter', function(event) {
							me.handleClientChangeInQuickFilter();
						});
					},
					handleClientSync : function(type, clientVal) {
						var me = this;
						if (!Ext.isEmpty(type)) {
							if (type === 'Q') {
								var objCompanyField = $("#dropdownCompany");
								if (!Ext.isEmpty(clientVal)) {
									objCompanyField.val('');
									objCompanyField.val(clientVal);
								}
								else
									if (Ext.isEmpty(clientVal)) {
										objCompanyField.val('');
									}
								objCompanyField.niceSelect("update");
							}
							if (type === 'A') {
								var objCompanyField = null;
								if (isClientUser()) {
									objCompanyField = me.getAgreementMstFilterView().down('combo[itemId="clientCombo"]');
									if (clientVal === "All companies")
										{
										objCompanyField.setValue("");
										me.clientFilterVal = "";
										me.clientFilterDesc = "";
										}
									else
										objCompanyField.setValue(clientVal);

								}
								else {
									objCompanyField = me.getAgreementMstFilterView().down('combo[itemId="clientComboAuto]');
									if (clientVal === "All companies")
										{
										objCompanyField.setValue("");
										me.clientFilterVal = "";
										me.clientFilterDesc = "";
										}
									else
										objCompanyField.setValue(clientVal);
								}

							}
						}

					},
					handleAgreementSync : function(type, agreement) {
						var me = this;
						if (!Ext.isEmpty(type)) {
							if (type === 'Q') {
								var objAgreementField = $("#dropdownAgreementName");
								if (!Ext.isEmpty(agreement)) {
									objAgreementField.val('');
									objAgreementField.val(agreement);
								}
								else
									if (Ext.isEmpty(agreement)) {
										objAgreementField.val('');
									}
							}
							if (type === 'A') {
								var objAgreementField = me.getFilterView().down('combo[itemId="agreementCodeItemId"]');
								objAgreementField.setValue(agreement);
							}
						}
					},
					handleStructureTypeSync : function(type, structureType) {
						var me = this;
						if (!Ext.isEmpty(type)) {
							if (type === 'Q') {
								var objStructureTypeField = $("#dropdownStructureType");
								if (!Ext.isEmpty(structureType)) {
									objStructureTypeField.val([]);
									objStructureTypeField.val(structureType);
								}
								else
									if (Ext.isEmpty(structureType)) {
										objStructureTypeField.val([]);
									}
								objStructureTypeField.niceSelect("update");

							}
							if (type === 'A') {
								var objStructureTypeField = me.getFilterView().down('combo[itemId="structureTypeId"]');
								objStructureTypeField.setValue(structureType);
							}
						}
					},
					deleteFilterSet : function(filterCode) {
						var me = this;
						var objFilterName;
						var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
						var objComboStore = null;
						if (!Ext.isEmpty(filterCode)) objFilterName = filterCode;
						me.filterCodeValue = null;
						me.savedFilterVal = '';
						// me.doHandleStateChange();
						if (me.savePrefAdvFilterCode == objFilterName) {
							me.advFilterData = [];
							me.filterApplied = 'A';
							me.refreshData();
						}
						if (savedFilterCombobox) {
							objComboStore = savedFilterCombobox.getStore();
							objComboStore.removeAt(objComboStore.find('filterName', objFilterName));
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
									// console.log('Bad : Something went wrong
									// with your
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
							url : 'services/userpreferences/agreementMst/groupViewAdvanceFilter.json',
							method : 'POST',
							jsonData : objJson,
							async : false,
							success : function(response) {
								me.updateSavedFilterComboInQuickFilter();
								me.resetAllFilters();
							},
							failure : function() {
								// console.log("Error Occured - Addition
								// Failed");

							}

						});
					},
					searchActionClicked : function(me) {
						var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down(
								'combo[itemId="savedFiltersCombo"]');
						var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
						isError = false;
						if (SaveFilterChkBoxVal === true) {
							me.handleSaveAndSearchAction();
						}
						else {
							me.savedFilterVal = '';
							me.filterCodeValue = '';
							me.doSearchOnly();
							if (savedFilterCombobox) savedFilterCombobox.setValue('');
							objGroupView = me.getGroupView();
							objGroupView.setFilterToolTip('');
						}
					},
					doSearchOnly : function() {
						var me = this;
						var selectedClientInAdv = "all";
						if ($('#dropdownCompanyName').val() !== 'all') {
							selectedClientInAdv = $("#dropdownCompany option:selected").text();
						}
						me.handleClientSync('A', selectedClientInAdv);

						var selectedStructureTypeInAdv = "all";
						if ($('#dropdownStructureType').val() !== 'all') {
							selectedStructureTypeInAdv = $('#dropdownStructureType').getMultiSelectValue();
						}
						me.handleStructureTypeSync('A', selectedStructureTypeInAdv);

						var selectedAgreementInAdv = "all";
						if ($('#dropdownAgreementName').val() !== 'all') {
							selectedAgreementInAdv = $('#dropdownAgreementName').getMultiSelectValue();
						}
						me.handleAgreementSync('A', selectedAgreementInAdv);

						me.applyAdvancedFilter();
					},
					applyAdvancedFilter : function(filterData) {
						var me = this, objGroupView = me.getGroupView();
						me.filterApplied = 'A';
						me.setDataForFilter(filterData);
						me.refreshData();
						if (objGroupView) objGroupView.toggleFilterIcon(true);
						objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
					},
					doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
						var me = this;
						if (!Ext.isEmpty(filterCode)) {
							me.savePrefAdvFilterCode = filterCode;
							me.showAdvFilterCode = filterCode;
							me.savedFilterVal = filterCode;
							me.resetAllFilters();
							me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
						}
						me.savePrefAdvFilterCode = filterCode;
						me.showAdvFilterCode = filterCode;
					},
					getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
						var me = this;
						var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
						Ext.Ajax.request({
							url : strUrl,
							method : 'GET',
							async : false,
							success : function(response) {
								if (!Ext.isEmpty(response) && !Ext.isEmpty(response.responseText)) {
									var responseData = Ext.decode(response.responseText);
									fnCallback.call(me, filterCode, responseData, applyAdvFilter);
								}
							},
							failure : function() {
								Ext.MessageBox.show({
									title : getLabel('instrumentErrorPopUpTitle', 'Error'),
									msg : getLabel('instrumentErrorPopUpMsg', 'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
							}
						});
					},
					populateQuickFilter : function(filterCode, filterData, applyAdvFilter) {
						var me = this;
						var fieldName = '';
						for (i = 0; i < filterData.length; i++) {
							fieldName = filterData[i].paramFieldLable;
							if(fieldName === 'Status'){
								me.userStatusPrefCode = filterData[i].paramValue1.split(',');
								me.userStatusPrefDesc = filterData[i].displayValue1;
							}
						}
						me.setDataForFilter(filterData);
					},
					populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
						var me = this;
						var fieldName = '';
						var fieldVal = '';
						var currentFilterData = '';
						if(filterData.filterBy != null)
						{
							var length = filterData.filterBy.length;
						}
						me.resetAllFilters();
						for (i = 0; i < length; i++) {
							fieldName = filterData.filterBy[i].field;
							fieldVal = filterData.filterBy[i].value1;
							currentFilterData = filterData.filterBy[i];
							displayValue1 = filterData.filterBy[i].displayValue1;
							if (fieldName === 'clientCode') {
								$("#dropdownCompany").val(fieldVal);
								$("#dropdownCompany").niceSelect('update');
								var clientComboBox ="";
								if (isClientUser()) {
									clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientCombo"]');

								}
								else {
									clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientComboAuto]');

								}
								me.clientFilterVal = fieldVal;
								me.clientFilterDesc = filterData.filterBy[i].displayValue1;
								selectedFilterClientDesc = (fieldVal === "") ? 'all' : me.clientFilterDesc;
								selectedFilterClient = me.clientFilterVal;
								clientComboBox.setValue(me.clientFilterDesc);
								// me.getDisclaimerTextForClient(me.clientFilterVal);
							}
							else
								if (fieldName === 'agreementName') {
									$("#dropdownAgreementName").val(displayValue1);
									if ($('#dropdownAgreementName').val() !== 'all') {
										selectedAgreementInAdv = $('#dropdownAgreementName').getMultiSelectValue();
									}
									me.handleAgreementSync('A', selectedAgreementInAdv);
								}
								else
									if (fieldName === 'structureType') {
										$("#dropdownStructureType").val(fieldVal);
										$("#dropdownStructureType").niceSelect('update');

										if ($('#dropdownStructureType').val() !== 'all') {
											selectedStructureTypeInAdv = $('#dropdownStructureType').getMultiSelectValue();
										}
										me.structureTypeFilterVal = fieldVal;
										me.handleStructureTypeSync('A', selectedStructureTypeInAdv);
									}
									else
										if (fieldName === 'chargeAccount') {
											$("#dropdownChargeAccount").val(displayValue1);
										}
										else
											if (fieldName === 'agreementCurrency') {
												$("#dropdownAgreementCCY").val(fieldVal);
											}
											else
												if (fieldName === 'entryDate' || fieldName === 'originalDate'
														|| fieldName === 'startDate' || fieldName === 'endDate') {
													me.setSavedFilterDates(fieldName, currentFilterData);
												}
												else if(fieldName === 'participatingAccount')
													{
														$("#dropDownParticipatingAcc").val(fieldVal);
													}

						}

						if (!Ext.isEmpty(filterCode)) {
							$('#savedFilterAs').val(filterCode);
							$("#msSavedFilter option[value='" + filterCode + "']").attr("selected", true);
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
							var dateFilterRefFrom = null;
							var formattedFromDate, fromDate, toDate, formattedToDate;
							var dateOperator = data.operator;

							fromDate = data.value1;
							if (!Ext.isEmpty(fromDate))
								formattedFromDate = Ext.util.Format.date(Ext.Date.parse(fromDate, 'Y-m-d'),
										strExtApplicationDateFormat);

							toDate = data.value2;
							if (!Ext.isEmpty(toDate))
								formattedToDate = Ext.util.Format
										.date(Ext.Date.parse(toDate, 'Y-m-d'), strExtApplicationDateFormat);

							if (dateType === 'entryDate') {
								selectedEntryDate = {
									operator : dateOperator,
									fromDate : formattedFromDate,
									toDate : formattedToDate,
									dateLabel : data.dropdownLabel
								};
								dateFilterRefFrom = $('#entryDate');
								$('label[for="entryDateDropDownLabel"]').text(getLabel('entryDateDropDown','Agreement Entry Date')+ " ("
										+ selectedEntryDate.dateLabel + ")");
							}
							else
								if (dateType === 'originalDate') {
									selectedOriginalDate = {
										operator : dateOperator,
										fromDate : formattedFromDate,
										toDate : formattedToDate,
										dateLabel : data.dropdownLabel
									};
									dateFilterRefFrom = $('#originalDate');
									$('label[for="originalDateDropDownLabel"]').text(getLabel('originalDate','Original Start Date')+ " ("
											+ selectedOriginalDate.dateLabel + ")");
								}

								else
									if (dateType === 'startDate') {
										selectedStartDate = {
											operator : dateOperator,
											fromDate : formattedFromDate,
											toDate : formattedToDate,
											dateLabel : data.dropdownLabel
										};
										dateFilterRefFrom = $('#startDate');
										$('label[for="startDateDropDownLabel"]').text(getLabel('startDate','Agreement Start Date')+ " ("
												+ selectedStartDate.dateLabel + ")");
									}
									else
										if (dateType === 'endDate') {
											selectedEndDate = {
												operator : dateOperator,
												fromDate : formattedFromDate,
												toDate : formattedToDate,
												dateLabel : data.dropdownLabel
											};
											dateFilterRefFrom = $('#endDate');
											$('label[for="endDateDropDownLabel"]').text(getLabel('endDate', 'Agreement End Date'));
											$('label[for="endDateDropDownLabel"]').text(getLabel('endDate','Agreement End Date')+ " ("
													+ selectedEndDate.dateLabel + ")");
										}
							
							if (dateOperator === 'eq') {
								$(dateFilterRefFrom).val(formattedFromDate);
							}
							else
								if (dateOperator === 'bt') {
									$(dateFilterRefFrom).datepick('setDate', [ formattedFromDate, formattedToDate ]);

								}
						}
						else {
							// console.log("Error Occured - date filter details
							// found empty");
						}
					},
					handleSaveAndSearchAction : function(btn) {
						var me = this;
						var callBack = me.postDoSaveAndSearch;
						var strFilterCodeVal = null;
						var FilterCode = $("#savedFilterAs").val();
						if (Ext.isEmpty(FilterCode)) {
							paintError('#advancedFilterErrorDiv', '#advancedFilterErrorMessage', getLabel('filternameMsg',
									'Please Enter Filter Name'));
							var filterName = $('#savedFilterAs').val();
							var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
							.is(':checked');
							if(Ext.isEmpty(filterName) && SaveFilterChkBoxVal == true)
			                	isError = true;
							return;
						}
						else {
							isError = false;
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
						var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down(
								'combo[itemId="savedFiltersCombo"]');
						var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
						if (savedFilterCombobox) {
							savedFilterCombobox.getStore().reload();
							savedFilterCombobox.setValue(me.filterCodeValue);
						}
						var objAdvSavedFilterComboBox = $("#msSavedFilter");
						if (objAdvSavedFilterComboBox) {
							blnOptionPresent = $("#msSavedFilter option[value='" + me.filterCodeValue + "']").length > 0;
							if (blnOptionPresent === true) {
								objAdvSavedFilterComboBox.val(me.filterCodeValue);
							}
							else
								if (blnOptionPresent === false) {
									$(objAdvSavedFilterComboBox).append($('<option>', {
										value : me.filterCodeValue,
										text : me.filterCodeValue
									}));

									if (!Ext.isEmpty(me.filterCodeValue)) arrValues.push(me.filterCodeValue);
									objAdvSavedFilterComboBox.val(arrValues);
									objAdvSavedFilterComboBox.multiselect("refresh");
								}
						}
						me.doSearchOnly();
						objGroupView = me.getGroupView();
						objGroupView.setFilterToolTip(me.filterCodeValue || '');
						me.savedFilterVal = me.filterCodeValue;
						// me.doHandleStateChange();
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
								if (responseData.d.filters && responseData.d.filters.success)
									isSuccess = responseData.d.filters.success;

								if (isSuccess && isSuccess === 'N') {
									title = getLabel('instrumentSaveFilterPopupTitle', 'Message');
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
								Ext.MessageBox.show({
									title : getLabel('instrumentErrorPopUpTitle', 'Error'),
									msg : getLabel('instrumentErrorPopUpMsg', 'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
							}
						});

					},
					updateSavedFilterComboInQuickFilter : function() {
						var me = this;
						var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
						if (!Ext.isEmpty(savedFilterCombobox)
								&& savedFilterCombobox.getStore().find('code', me.filterCodeValue) >= 0) {
							savedFilterCombobox.getStore().reload();
							if (me.filterCodeValue != null) {
								me.savedFilterVal = me.filterCodeValue;
							}
							else {
								me.savedFilterVal = '';
							}
							savedFilterCombobox.setValue(me.savedFilterVal);
							me.filterCodeValue = null;
						}
					},
					entryDateChange : function(btn, opts) {
						var me = this;
						me.entryDateFilterVal = btn.btnValue;
						me.entryDateFilterLabel = btn.text;
						me.handleEntryDateChange(btn.btnValue);
					},
					handleEntryDateChange : function(index) {
						var me = this;
						var dateToField;
						var objDateParams = me.getDateParam(index, 'entryDate');

						if (!Ext.isEmpty(me.entryDateFilterLabel)) {
							$('label[for="entryDateDropDownLabel"]').text(
									getLabel('entryDate', 'Agreement Entry Date') + " (" + me.entryDateFilterLabel + ")");
						}
						var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue1));
						var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue2));
						var filterOperator = objDateParams.operator;

						if (index == '13') {
							if (filterOperator == 'eq') {
								$('#entryDate').datepick('setDate', vFromDate);
							}
							else {
								$('#entryDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate))
							{
								selectedEntryDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedEntryDate = {};
							
						}
						else {
							if (index === '1' || index === '2' || index === '12') {
								if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
									$('#entryDate').datepick('setDate', vToDate);
								}
								else
									if (index === '12') {
										$('#entryDate').datepick('setDate', vFromDate);
									}
									else {
										$('#entryDate').datepick('setDate', vFromDate);

									}
							}
							else {
								$('#entryDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate))
							{
								selectedEntryDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedEntryDate = {};
						}
					},
					originalDateChange : function(btn, opts) {
						var me = this;
						me.originalDateFilterVal = btn.btnValue;
						me.originalDateFilterLabel = btn.text;
						me.handleOriginalDateChange(btn.btnValue);
					},
					handleOriginalDateChange : function(index) {
						var me = this;
						var dateToField;
						var objDateParams = me.getDateParam(index, 'originalDate');

						if (!Ext.isEmpty(me.originalDateFilterLabel)) {
							$('label[for="originalDateDropDownLabel"]').text(
									getLabel('originalDate', 'Original Start Date') + " (" + me.originalDateFilterLabel + ")");
						}
						var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue1));
						var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue2));
						var filterOperator = objDateParams.operator;

						if (index == '13') {
							if (filterOperator == 'eq') {
								$('#originalDate').datepick('setDate', vFromDate);
							}
							else {
								$('#originalDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedOriginalDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedOriginalDate = {};
							
						}
						else {
							if (index === '1' || index === '2' || index === '12') {
								if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
									$('#originalDate').datepick('setDate', vToDate);
								}
								else
									if (index === '12') {
										$('#originalDate').datepick('setDate', vFromDate);
									}
									else {
										$('#originalDate').datepick('setDate', vFromDate);

									}
							}
							else {
								$('#originalDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedOriginalDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedOriginalDate = {};
						}
					},
					startDateChange : function(btn, opts) {
						var me = this;
						me.startDateFilterVal = btn.btnValue;
						me.startDateFilterLabel = btn.text;
						me.handleStartDateChange(btn.btnValue);
					},
					handleStartDateChange : function(index) {
						var me = this;
						var dateToField;
						var objDateParams = me.getDateParam(index, 'startDate');

						if (!Ext.isEmpty(me.startDateFilterLabel)) {
							$('label[for="startDateDropDownLabel"]').text(
									getLabel('startDate', 'Agreement Start Date') + " (" + me.startDateFilterLabel + ")");
						}
						var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue1));
						var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue2));
						var filterOperator = objDateParams.operator;

						if (index == '13') {
							if (filterOperator == 'eq') {
								$('#startDate').datepick('setDate', vFromDate);
							}
							else {
								$('#startDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedStartDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedStartDate = {};
							
						}
						else {
							if (index === '1' || index === '2' || index === '12') {
								if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
									$('#startDate').datepick('setDate', vToDate);
								}
								else
									if (index === '12') {
										$('#startDate').datepick('setDate', vFromDate);
									}
									else {
										$('#startDate').datepick('setDate', vFromDate);

									}
							}
							else {
								$('#startDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedStartDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedStartDate = {};
						}
					},
					endDateChange : function(btn, opts) {
						var me = this;
						me.endDateFilterVal = btn.btnValue;
						me.endDateFilterLabel = btn.text;
						me.handleEndDateChange(btn.btnValue);
					},
					handleEndDateChange : function(index) {
						var me = this;
						var dateToField;
						var objDateParams = me.getDateParam(index, 'endDate');

						if (!Ext.isEmpty(me.endDateFilterLabel)) {
							$('label[for="endDateDropDownLabel"]').text(
									getLabel('endDate', 'Agreement End Date') + " (" + me.endDateFilterLabel + ")");
						}
						var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue1));
						var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue2));
						var filterOperator = objDateParams.operator;

						if (index == '13') {
							if (filterOperator == 'eq') {
								$('#endDate').datepick('setDate', vFromDate);
							}
							else {
								$('#endDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedEndDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedEndDate = {};
							
						}
						else {
							if (index === '1' || index === '2' || index === '12') {
								if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
									$('#endDate').datepick('setDate', vToDate);
								}
								else
									if (index === '12') {
										$('#endDate').datepick('setDate', vFromDate);
									}
									else {
										$('#endDate').datepick('setDate', vFromDate);

									}
							}
							else {
								$('#endDate').datepick('setDate', [ vFromDate, vToDate ]);

							}
							if (filterOperator == 'eq')
								dateToField = "";
							else
								dateToField = vToDate;
							if(!Ext.isEmpty(vFromDate) || !Ext.isEmpty(dateToField))
							{
								selectedEndDate = {
										operator : objDateParams.operator,
										fromDate : vFromDate,
										toDate : dateToField,
										dateLabel : objDateParams.label
									};
							}
							else
								selectedEndDate = {};
						}
					},
					handleStatusFilterClick : function(combo) {
						var me = this;
						combo.isQuickStatusFieldChange = false;
						me.userStatusPrefCode = combo.getSelectedValues();
						me.userStatusPrefDesc = combo.getRawValue();
						me.setDataForFilter();
						me.applyFilter();
					},

					handleClearSettings : function() {
						var me = this, objGroupView = me.getGroupView();
						var clientComboBox;

						if (isClientUser())
							clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientCombo"]');
						else
							clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientComboAuto]');
						me.clientFilterVal = 'all';
						me.clientFilterDesc = '';
						selectedFilterClientDesc = "";
						selectedFilterClient = "all";
						clientComboBox.setValue('');

						me.savedFilterVal = '';
						var savedFilterComboBox = me.getAgreementMstFilterView().down('combo[itemId="savedFiltersCombo"]');
						savedFilterComboBox.setValue(me.savedFilterVal);

						var agreementCodeAuto = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
						agreementCodeAuto.setValue("");

						var structureTypeCombo = me.getFilterView().down('combo[itemId="structureTypeId"]');
						structureTypeCombo.setValue("ALL");

						var statusFltId = me.getFilterView().down('combo[itemId=statusId]');
						statusFltId.reset();
						me.userStatusPrefCode = 'all';
						statusFltId.selectAllValues();
						me.filterData = [];
						me.filterApplied = 'Q';
						if (objGroupView) objGroupView.toggleFilterIcon(false);
						objGroupView.setFilterToolTip('');

						me.resetAllFilters();
						me.setDataForFilter();
						me.refreshData();

					},
					resetAllFilters : function() {
						var me = this;

						$("#dropdownCompany").val($("#dropdownCompany option:first").val());
						me.clientFilterVal = 'all';
						me.clientFilterDesc = '';
						selectedFilterClientDesc = "";
						selectedFilterClient = "all";

						$("#dropdownAgreementName").val("");
						$("#dropdownStructureType").val($("#dropdownStructureType option:first").val());
						$("#dropdownChargeAccount").val("");
						$("#dropdownAgreementCCY").val("");
						$("#dropDownParticipatingAcc").val("");

						me.datePickerSelectedEntryAdvDate = [];
						me.datePickerSelectedOriginalAdvDate = [];
						me.datePickerSelectedStartAdvDate = [];
						me.datePickerSelectedEndAdvDate = [];
						$('#entryDate').val("");
						selectedEntryDate = {};
						$('label[for="entryDateDropDownLabel"]').text(getLabel('entryDateDropDown', 'Agreement Entry Date'));
						updateToolTip('entryDate', null);

						$('#originalDate').val("");
						selectedOriginalDate = {};
						$('label[for="originalDateDropDownLabel"]').text(getLabel('originalDate', 'Original Start Date'));
						updateToolTip('originalDate', null);

						$('#startDate').val("");
						selectedStartDate = {};
						$('label[for="startDateDropDownLabel"]').text(getLabel('startDate', 'Agreement Start Date'));
						updateToolTip('startDate', null);

						$('#endDate').val("");
						selectedEndDate = {};
						$('label[for="endDateDropDownLabel"]').text(getLabel('endDate', 'Agreement End Date'));
						updateToolTip('endDate', null);

						$("input[type='text'][id='savedFilterAs']").val("");
						$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
						$("#saveFilterChkBox").attr('checked', false);

						$("#msSavedFilter").val("");
						$("#msSavedFilter").multiselect("refresh");

						$('#dropdownCompany').niceSelect('update');
						$('#dropdownStructureType').niceSelect('update');

					},

					doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
						var strUrl = Ext.String.format('agreementMst/{0}.srvc?', strAction);
						strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
						if (strAction === 'reject') {
							this.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords, strActionType);

						}
						else {
							this.handleGroupActions(strUrl, '', grid, arrSelectedRecords, strActionType, strAction);
						}
					},

					showRejectVerifyPopUp : function(strAction, strUrl, grid, arrSelectedRecords, strActionType) {
						var me = this;
						var titleMsg = '', fieldLbl = '';
						if (strAction === 'reject') {
							fieldLbl = getLabel('userRejectRemarkPopUpTitle', 'Please enter reject remark');
							titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
						}
						var msgbox = Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							multiline : 4,
							cls : 't7-popup',
							width : 355,
							height : 270,
							bodyPadding : 0,
							fn : function(btn, text) {
								if (btn == 'ok') {
									if (Ext.isEmpty(text)) {
										Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg',
												'Reject Remark field can not be blank'));
									}
									else {
										me.handleGroupActions(strUrl, text, grid, arrSelectedRecords);
									}
								}
							}
						});
						msgbox.textArea.enforceMaxLength = true;
						msgbox.textArea.inputEl.set({
							maxLength : 255
						});
					},

					handleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
						var me = this;
						var groupView = me.getGroupView();
						if (!Ext.isEmpty(groupView)) {
							var arrayJson = new Array();
							var records = (arrSelectedRecords || []);
							for (var index = 0; index < records.length; index++) {
								arrayJson.push({
									serialNo : grid.getStore().indexOf(records[index]) + 1,
									identifier : records[index].data.identifier,
									userMessage : remark,
									recordDesc : records[index].data.scmProductName
								});
							}
							if (arrayJson) arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});

							Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrayJson),
								success : function(response) {
									// TODO : Action Result handling to be done
									// here
									groupView.refreshData();
									// me.applyFilter();
									var errorMessage = '';
									if (response.responseText != '[]') {
										var jsonData = Ext.decode(response.responseText);
										jsonData = jsonData.d ? jsonData.d : jsonData;
										/*
										 * Ext.each(jsonData[0].errors,
										 * function(error, index) { errorMessage =
										 * errorMessage + error.errorMessage + "<br/>";
										 * });
										 */
										if (!Ext.isEmpty(jsonData)) {
											for (var i = 0; i < jsonData.length; i++) {
												var arrError = jsonData[i].errors;
												if (!Ext.isEmpty(arrError)) {
													for (var j = 0; j < arrError.length; j++) {
														for (var j = 0; j < arrError.length; j++) {
															errorMessage = errorMessage + arrError[j].code + ' : '
																	+ arrError[j].errorMessage + "<br/>";
														}
													}
												}

											}
											if ('' != errorMessage && null != errorMessage) {
												var msgBox = new Ext.window.MessageBox();
												msgBox.autoShow=true;
												msgBox.autoScroll=true;
												msgBox.overflowY='auto';
												msgBox.show({
													title : getLabel('errorTitle', 'Error'),
												    msg : errorMessage,
												    buttons : Ext.MessageBox.OK,
												    cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR,
													autoScroll: true,
													scope: this
												});
											}
										}
									}
								},
								failure : function() {
									Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							});
						}
					},

					doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
						var me = this;
						if (actionName === 'submit' || actionName === 'accept' || actionName === 'reject'
								|| actionName === 'discard' || actionName === 'enable' || actionName === 'disable'
								/*|| actionName === 'verify'*/ || actionName === 'send' ) {
							me.doHandleGroupActions(actionName, grid, [ record ], 'rowAction');
						}
						else if(actionName === 'verify' ){
								var startDate = Ext.Date.parse(record.get('startDate'), strExtApplicationDateFormat);
								var endDate = Ext.Date.parse(record.get('endDate'), strExtApplicationDateFormat);
								var approvalCount = record.get('approvalCount');
                                var applDate =  Ext.Date.parse(strApplDate, strExtApplicationDateFormat);
                                var msgLbl = '';
                                var blnshowPopup =false;
                                if( startDate< applDate && approvalCount ==1)
                                {
                                  msgLbl = 'Agreement Start Date should be greater than System Date.';
                                  blnshowPopup = true;
                                } 
                                if( endDate < applDate){
                                	msgLbl = 'Agreement End Date should be greater than System Date.Record is rejected.';
                                    blnshowPopup = true;
                                }
                                if(blnshowPopup){
                                	var strUrl = Ext.String.format('agreementMst/{0}.srvc', actionName);
                                    me.showDateChangePopUpExt (actionName, strUrl, grid, record, 'rowAction',msgLbl);
                                }
                                else{
                                	me.doHandleGroupActions(actionName, grid, [ record ], 'rowAction');
                                }
						}
						else
							if (actionName === 'btnHistory') {
								var recHistory = record.get('history');

								if (!Ext.isEmpty(recHistory) && !Ext.isEmpty(recHistory.__deferred.uri)) {
									me.showHistory(record.get('agreementName'), record.get('history').__deferred.uri, record
											.get('identifier'));
								}
							}
							else
								if (actionName === 'btnEdit') {
									var strUrl = 'editAgreementMaster.srvc';
									me.submitForm(strUrl, record, rowIndex);
								}
								else
									if (actionName === 'btnView') {
										var strUrl = 'viewAgreementMaster.srvc';
										me.submitForm(strUrl, record, rowIndex);
									}
									else
										if (actionName === 'btnTreeView') {
											showAgreementSweepTree('viewAgreementSweepTree.srvc', record, rowIndex);
										}
					},
					
					showDateChangePopUpExt : function(strAction, strUrl, grid, arrSelectedRecords, strActionType,msgLbl) {
                        var me = this;
                        var titleMsg = '';
                        if (strAction === 'verify') {
                            titleMsg = getLabel('Message', 'Message');
                        }
                        Ext.Msg.show({
                            title : titleMsg,
                            msg : msgLbl,
                            buttons : Ext.Msg.OK,
                            cls : 't7-popup',
                            width : 355,
                            height : 210,
                            fn : function(btn, text) {
                                if (btn == 'ok') {
                                    me.handleGroupActions(strUrl, text, grid,  [ arrSelectedRecords ]);
                                }
                            }
                        });
                    },
					 showDateChangePopUp : function (){
                        $('#dateChangeOkButton').unbind('click');
                        $('#dateChangeOkButton').bind('click',function(){
                            $('#dateChangeMsgPopup').dialog("close");
                        });
                        $('#dateChangeMsgPopup').dialog({
                            autoOpen : false,
                            maxHeight: 550,
                            width : 400,
                            modal : true,
                            resizable: false,
                            draggable: false
                        });
                        $('#dateChangeMsgPopup').dialog("open");
                        $('#textContent').focus();
                    },

					submitForm : function(strUrl, record, rowIndex) {
						var me = this;
						var viewState = record.data.viewState;
						var form;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState', viewState));

						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();

					},

					handleEntryAction : function() {
						var me = this;
						var form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));

						// Populate client ID in case of single client
						if (isClientUser()) {
							var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
							if (clientCombo.getStore().getCount() === 1) {
								form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId', selectedFilterClient));
							}
						}
						document.body.appendChild(form);
						form.action = "showAgreementMstEntryForm.srvc";
						form.target = "";
						form.method = "POST";
						form.submit();
					},
					/*
					 * Duplicate method
					 */
//					createFormField : function(element, type, name, value) {
//						var inputField;
//						inputField = document.createElement(element);
//						inputField.type = type;
//						inputField.name = name;
//						inputField.value = value;
//						return inputField;
//					},

					showHistory : function(scmProductDesc, url, id) {
						var historyPopup = Ext.create('GCP.view.HistoryPopup', {
							historyUrl : url + "?"+ csrfTokenName + "=" + csrfTokenValue,
							scmProduct : scmProductDesc,
							identifier : id
						}).show();
						historyPopup.center();
					},

					doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex,
							arrSelectedRecords, jsonData) {
						var me = this;
						var buttonMask = me.strDefaultMask;
						var maskArray = new Array(), actionMask = '', objData = null;
						;

						if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) buttonMask = jsonData.d.__buttonMask;

						var isSameUser = true;
						var isDisabled = false;
						var isSubmit = false;
						maskArray.push(buttonMask);

						for (var index = 0; index < arrSelectedRecords.length; index++) {
							objData = arrSelectedRecords[index];
							maskArray.push(objData.get('__metadata').__rightsMap);
							if (objData.raw.makerId === USER) {
								isSameUser = false;
							}
							if (objData.raw.validFlag != 'Y') {
								isDisabled = true;
							}
							if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState != 8 && objData.raw.requestState != 4
									&& objData.raw.requestState != 5) {
								isSubmit = true;
							}
						}
						actionMask = doAndOperation(maskArray, 11);
						me.enableDisableGroupActions(actionMask, isSameUser, isDisabled, isSubmit);
					},

					enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
						var me = this;
						var objGroupView = me.getGroupView();
						var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
						var blnEnabled = false, strBitMapKey = null;
						if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext.each(arrItems, function(item) {
								strBitMapKey = parseInt(item.maskPosition,10) - 1;
								if (strBitMapKey || strBitMapKey == 0) {
									blnEnabled = isActionEnabled(actionMask, strBitMapKey);
									if ((item.maskPosition === 2 && blnEnabled)) {
										blnEnabled = blnEnabled && isSameUser;
									}
									else
										if (item.maskPosition === 3 && blnEnabled) {
											blnEnabled = blnEnabled && isSameUser;
										}
										else
											if (item.maskPosition === 6 && blnEnabled) {
												blnEnabled = blnEnabled && !isSubmit;
											}

									item.setDisabled(!blnEnabled);
								}
							});
						}
					},

					handleAppliedFilterDelete : function(btn) {
						var me = this;
						var objData = btn.data;
						if (!Ext.isEmpty(objData)) {
							me.resetFieldOnDelete(objData);
							me.setDataForFilter();
							me.refreshData();
						}

					},
					resetFieldOnDelete : function(objData) {
						var me = this, strFieldName;
						if (!Ext.isEmpty(objData)) strFieldName = objData.paramName || objData.field;

						if (strFieldName === "clientCode") {
							if (isClientUser())
								clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientCombo"]');
							else
								clientComboBox = me.getAgreementMstFilterView().down('combo[itemId="clientComboAuto]');
							me.clientFilterVal = 'all';
							me.clientFilterDesc = '';
							selectedFilterClientDesc = "";
							selectedFilterClient = "all";
							clientComboBox.setValue("");
							me.handleClientSync('Q', me.clientFilterVal);
						}
						else
							if (strFieldName === "agreementName") {
								var agreementCodeAuto = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
								agreementCodeAuto.setValue("");
								me.agreementCodeFilterVal = "";
								me.agreementCodeFilterDesc = "";
								me.handleAgreementSync('Q', me.agreementCodeFilterVal);

							}
							else
								if (strFieldName === "structureType") {
									var structureTypeCombo = me.getFilterView().down('combo[itemId="structureTypeId"]');
									structureTypeCombo.setValue("ALL");
								}
								else
									if (strFieldName === 'statusFilter') {
										var statusFltId = me.getFilterView().down('combo[itemId=statusId]');
										statusFltId.reset();
										me.userStatusPrefCode = 'all';
										statusFltId.selectAllValues();

									}
									else
										if (strFieldName === 'agreementName') {
											$("#dropdownAgreementName").val("");
										}
										else
											if (strFieldName === 'structureType') {
												$("#dropdownStructureType").val($("#dropdownStructureType option:first").val());
											}
											else
												if (strFieldName === 'chargeAccount') {
													$("#dropdownChargeAccount").val("");
												}
												else
													if (strFieldName === 'agreementCurrency') {
														$("#dropdownAgreementCCY").val("");
													}
													else
														if (strFieldName === 'entryDate') {
															selectedEntryDate = {};
															me.datePickerSelectedEntryAdvDate = [];
															$('#entryDate').val("");
															$('label[for="entryDateDropDownLabel"]').text(
																	getLabel('entryDate', 'Agreement Entry Date'));
														}
														else
															if (strFieldName === 'originalDate') {
																selectedOriginalDate = {};
																me.datePickerSelectedOriginalAdvDate = [];
																$('#originalDate').val("");
																$('label[for="originalDateDropDownLabel"]').text(
																		getLabel('originalDate', 'Original Start Date'));
															}
															else
																if (strFieldName === 'startDate') {
																	selectedStartDate = {};
																	me.datePickerSelectedStartAdvDate = [];
																	$('#startDate').val("");
																	$('label[for="startDateDropDownLabel"]').text(
																			getLabel('startDate', 'Agreement Start Date'));
																}
																else
																	if (strFieldName === 'endDate') {
																		selectedEndDate = {};
																		me.datePickerSelectedEndAdvDate = [];
																		$('#endDate').val("");
																		$('label[for="endDateDropDownLabel"]').text(
																				getLabel('endDate', 'Agreement End Date'));
																	}
																	else 
																		if(strFieldName === 'participatingAccount') {
																			$("#dropDownParticipatingAcc").val("");
																		}
																	
					},

					handleClientChangeInQuickFilter : function() {
						var me = this;
						me.clientFilterVal = selectedFilterClient;
						me.clientFilterDesc = selectedFilterClientDesc;
						// me.updateFilterparams();
						me.setDataForFilter();
						me.applyFilter();
					},
					updateFilterparams : function() {
						var me = this;
						var agreementCodeAuto = me.getFilterView().down('AutoCompleter[itemId="agreementCodeItemId"]');
						var structureTypeCombo = me.getFilterView().down('combo[itemId="structureTypeId"]');
						agreementCodeAuto.setValue("");
						structureTypeCombo.setValue("ALL");
					},
					assignSavedFilter : function() {
						var me = this;
						if (me.firstTime) {
							me.firstTime = false;

							var objJsonData='', objLocalJsonData='',savedFilterCode = '';
							if (objAgreementMstPref || objSaveLocalStoragePref) {
								objJsonData = Ext.decode(objAgreementMstPref);
								objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
								
								if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y' ) 
									 {
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
											savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
											me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
										}
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
											me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
										}
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
											me.populateQuickFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.quickFilterJson,true);
										}
									}
									else if (!Ext.isEmpty(objJsonData.d.preferences)) {
										if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
											var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
											if (advData === me.getForecastCenterFilterView()
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
					},
					handleSavedFilterClick : function() {
						var me = this;
						var savedFilterVal = $("#msSavedFilter").val();
						me.resetAllFilters();
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
						me.getSavedFilterData(savedFilterVal, this.populateSavedFilter, applyAdvFilter);
					},
					isInCondition : function(data) {
						var retValue = false;
						var displayType = data.displayType;
						if (displayType
								&& (displayType === 4 || displayType === 3 || displayType === 5 || displayType === 12
										|| displayType === 13 || displayType === 6 || displayType === 2)
						
						) {
							retValue = true;
						}
						return retValue;
					},
					refreshData : function() {
						var me = this;
						var objGroupView = me.getGroupView();
						var grid = objGroupView.getGrid();
						if (grid) {
							grid.removeAppliedSort();
						}
						objGroupView.refreshData();
					},
					applyFilter : function() {
						var me = this;
						var objGroupView = me.getGroupView();
						var groupInfo = objGroupView.getGroupInfo();
						me.filterApplied = 'Q';
						objGroupView.setFilterToolTip('');
						if (objGroupView) objGroupView.toggleFilterIcon(true);
						if (groupInfo && groupInfo.groupTypeCode === 'AGREEMENT_MST_OPT_STATUS') {
							objGroupView.setActiveTab('all');
						}
						else {
							me.refreshData();
						}
					},

					getFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this;
						var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery) ? subGroupInfo.groupQuery : '';
						strQuickFilterUrl = me.generateUrlWithQuickFilterParams();

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
								&& strAdvancedFilterUrl.indexOf(' and ') == strAdvancedFilterUrl.length - 5) {
							strAdvancedFilterUrl = strAdvancedFilterUrl.substring(0, strAdvancedFilterUrl.length - 5);
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

						return strUrl;
					},
					generateUrlWithQuickFilterParams : function() {
						var me = this;
						var filterData = me.filterData;
						var strFilter = '&$filter=';
						var strTemp = '';
						var isFilterApplied = false;
						if (!Ext.isEmpty(filterData)) {
							for (var index = 0; index < filterData.length; index++) {

								if (isFilterApplied) {
									strTemp = strTemp + ' and ';
								}
								if (filterData[index].operatorValue == 'statusFilterOp') {
									var objValue = filterData[index].paramValue1;
									var objUser = filterData[index].makerUser;
									var objArray = objValue.split(',');
									if (objArray.length >= 1) {
										strTemp = strTemp + "(";
									}
									for (var i = 0; i < objArray.length; i++) {
										if(objArray[i] == 12){ //New submitted
											strTemp = strTemp + "(requestState eq '0' and isSubmitted eq 'Y')";
										}
										else if(objArray[i] == 14){ //Modified submitted
											strTemp = strTemp + "(requestState eq '1' and isSubmitted eq 'Y')";
										}
										else if(objArray[i] == 30){ //Pending Send
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '0')";
										}
										else if(objArray[i] == 31 || objArray[i] == 34){ //Sent to bank or Pending verify
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '1')";
										}
										else if(objArray[i] == 32){ //active
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '2')";
										}
										else if(objArray[i] == 33){//Verify Rejected
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y' and isSubmitted eq 'N' and verifyState eq '3')";
										}
										else if(objArray[i] == 11){ // Suspended
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N')";
										}
										else if(objArray[i] == 13){
											strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
										}
										else if(objArray[i] == 0 || objArray[i] == 1){ //New or Modified
											strTemp = strTemp + "(requestState eq '"+objArray[i]+"' and isSubmitted eq 'N')";
										}
										else{
											strTemp = strTemp + "(requestState eq '"+objArray[i]+"')";
										}
										if(i != (objArray.length -1)){
											strTemp = strTemp + ' or ';
										}
								}
									if (objArray.length >= 1) {
										strTemp = strTemp + ")";
										isFilterApplied = true;
									}

								}
								else {
									strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue + ' '
											+ '\'' + filterData[index].paramValue1 + '\'';
									isFilterApplied = true;
								}

							}
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
						var operator = '';
						var isInCondition = false;
						var strDetailUrl = '';
						if (!Ext.isEmpty(filterData)) {
							for (var index = 0; index < filterData.length; index++) {
								isInCondition = false;
								operator = filterData[index].operator;
								if (isFilterApplied
										&& (operator === 'bt' || operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'statusFilterOp')) {
									if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ' and ';
									}
									else {
										strTemp = strTemp + ' and ';
									}
								}

								switch (operator) {
									case 'bt':
										isFilterApplied = true;
										if (filterData[index].dataType === 1) {
											strTemp = strTemp + filterData[index].field + ' ' + filterData[index].operator + ' '
													+ 'date\'' + filterData[index].value1 + '\'' + ' and ' + 'date\''
													+ filterData[index].value2 + '\'';
										}
										else {
											strTemp = strTemp + filterData[index].field + ' ' + filterData[index].operator + ' '
													+ '\'' + filterData[index].value1 + '\'' + ' and ' + '\''
													+ filterData[index].value2 + '\'';
										}
										break;
									case 'st':
										if (!isOrderByApplied) {
											strTemp = strTemp + ' &$orderby=';
											isOrderByApplied = true;
											isFilterApplied = true;
										}
										else {
											strTemp = strTemp + ',';
										}
										strTemp = strTemp + filterData[index].value1 + ' ' + filterData[index].value2;
										break;
									case 'lk':
										isFilterApplied = true;
										if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl + filterData[index].field + ' '
													+ filterData[index].operator + ' ' + '\'' + filterData[index].value1 + '\'';
											blnDtlFilterApplied = true;
										}
										else {
											strTemp = strTemp + filterData[index].field + ' ' + filterData[index].operator + ' '
													+ '\'' + filterData[index].value1 + '\'';
										}
										break;
									case 'eq':
										isInCondition = me.isInCondition(filterData[index]);
										if (isInCondition) {
											var objValue = filterData[index].value1;
											if (objValue != 'All') {
												if (isFilterApplied
														&& !(filterData[index].detailFilter && filterData[index].detailFilter === 'Y')) {
													strTemp = strTemp + ' and ';
												}
												else {
													if (blnDtlFilterApplied) strDetailUrl = strDetailUrl + ' and ';
													isFilterApplied = true;
												}

												if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
													strDetailUrl = strDetailUrl + filterData[index].field + ' '
															+ filterData[index].operator + ' ' + '\'' + objValue + '\'';
													blnDtlFilterApplied = true;
												}
												else
													if (filterData[index].dataType === 1) {
														strTemp = strTemp + filterData[index].field + ' '
																+ filterData[index].operator + ' ' + 'date\''
																+ filterData[index].value1 + '\'';
													}
													else
														if (filterData[index].field === "Reversal") {
															strTemp = strTemp + "(InstrumentType eq '62' and ActionStatus eq '74')"
														}
														else {
															strTemp = strTemp + filterData[index].field + ' '
																	+ filterData[index].operator + ' ' + '\'' + objValue + '\'';
														}
												isFilterApplied = true;
											}
										}
										if (filterData[index].field === 'InstrumentType')
											me.paymentTypeAdvFilterVal = filterData[index].value1;
										break;
									case 'gt':
									case 'lt':
										isFilterApplied = true;
										if (filterData[index].dataType === 1) {
											strTemp = strTemp + filterData[index].field + ' ' + filterData[index].operator + ' '
													+ 'date\'' + filterData[index].value1 + '\'';
										}
										else {
											strTemp = strTemp + filterData[index].field + ' ' + filterData[index].operator + ' '
													+ '\'' + filterData[index].value1 + '\'';
										}
										break;
									case 'statusFilterOp':
										isFilterApplied = true;
										var objValue = (filterData[index].value1).toString();
										var objArray = objValue.split(',');
										if (objArray.length >= 1) {
											strTemp = strTemp + "(";
										}
										for (var i = 0; i < objArray.length; i++) {
											if (objArray[i] == 0) { // draft
												strTemp = strTemp + "((requestState eq '0') and isSubmitted eq 'N')";
											}
											else
												if (objArray[i] == 4) { // approved
													strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
												}
												else
													if (objArray[i] == 3 || objArray[i] == 2) { // pending
																								// approval
																								// or
																								// submitted
														strTemp = strTemp
																+ "((requestState eq '0' or requestState eq '1' )  and isSubmitted eq 'Y')";
													}
													else
														if (objArray[i] == 0 || objArray[i] == 1) { // pending
																									// submit
															strTemp = strTemp + "(requestState eq '" + objArray[i]
																	+ "' and isSubmitted eq 'N')";
														}
														else {
															strTemp = strTemp + "(requestState eq '" + objArray[i] + "')";
														}
											if (i != (objArray.length - 1)) {
												strTemp = strTemp + ' or ';
											}

										}
										if (objArray.length >= 1) {
											strTemp = strTemp + ")";
										}
										break;
									case 'in':
										var objArray = null;
										var objValue = filterData[index].value1;
										if (Array.isArray(objValue)) {
											objArray = filterData[index].value1;
										}
										else {
											if (objValue != undefined) objArray = objValue.split(',');
										}
										// var objArray = objValue.split(',');
										if (objArray.length > 0) {
											if (objArray[0] != 'All') {
												if (isFilterApplied) {
													if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
														strDetailUrl = strDetailUrl + ' and ';
													}
													else {
														strTemp = strTemp + ' and ';
													}
												}
												else {
													isFilterApplied = true;
												}

												if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
													strDetailUrl = strDetailUrl + '(';
												}
												else {
													strTemp = strTemp + '(';
												}
												for (var i = 0; i < objArray.length; i++) {
													if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
														strDetailUrl = strDetailUrl + filterData[index].field + ' eq ';
														strDetailUrl = strDetailUrl + '\'' + objArray[i] + '\'';
														if (i != objArray.length - 1) strDetailUrl = strDetailUrl + ' or ';
													}
													else {
														strTemp = strTemp + filterData[index].field + ' eq ';
														strTemp = strTemp + '\'' + objArray[i] + '\'';
														if (i != objArray.length - 1) strTemp = strTemp + ' or ';

													}
												}
												if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
													strDetailUrl = strDetailUrl + ')';
												}
												else {
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
						}
						else
							if (isOrderByApplied)
								strFilter = strTemp;
							else
								strFilter = '';
						retUrl.batchFilter = strFilter;
						retUrl.detailFilter = strDetailUrl;
						return retUrl;
					},
					removeFromQuickArrJson : function(arr, key) {
						for (var ai, i = arr.length; i--;) {
							if ((ai = arr[i]) && ai.paramName == key) {
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
					setDataForFilter : function(filterData) {
						var me = this;
						var arrQuickJson = {};
						me.advFilterData = {};
						me.filterData = me.getQuickFilterQueryJson();
						var objJson = (!Ext.isEmpty(filterData) ? filterData : getAdvancedFilterQueryJson());
						if(!Ext.isEmpty(objJson.filterBy)){
							objJson = objJson.filterBy;
						}
						var reqJson = me.findInAdvFilterData(objJson, "clientCode");
						if (!Ext.isEmpty(reqJson)) {
							arrQuickJson = me.filterData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "clientCode");
							me.filterData = arrQuickJson;
						}
						reqJson = me.findInAdvFilterData(objJson, "agreementName");
						if (!Ext.isEmpty(reqJson)) {
							arrQuickJson = me.filterData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "agreementName");
							me.filterData = arrQuickJson;
						}
						reqJson = me.findInAdvFilterData(objJson, "structureType");
						if (!Ext.isEmpty(reqJson)) {
							arrQuickJson = me.filterData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "structureType");
							me.filterData = arrQuickJson;
						}

						me.advFilterData = objJson;
					},

					getQuickFilterQueryJson : function() {
						var me = this, statusFilterValArray = [], statusFilterDiscArray = [], statusFilterVal = me.userStatusPrefCode, statusFilterDisc = me.userStatusPrefDesc, jsonArray = [];

						if (!Ext.isEmpty(me.clientFilterDesc) && !Ext.isEmpty(me.clientFilterVal) && 'all' !== me.clientFilterVal) {
							jsonArray.push({
								paramName : 'clientCode',
								paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								paramFieldLable : getLabel('lblcompany', 'Company Name'),
								displayType : 5,
								displayValue1 : me.clientFilterDesc
							});
						}

						if (!Ext.isEmpty(me.agreementCodeFilterDesc) && !Ext.isEmpty(me.agreementCodeFilterVal)
								&& 'all' !== me.agreementCodeFilterVal) {
							jsonArray.push({
								paramName : 'agreementName',
								paramValue1 : me.agreementCodeFilterVal.toUpperCase(),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable : getLabel('lblAgreementName', 'Agreement Name'),
								displayType : 5,
								displayValue1 : me.agreementCodeFilterDesc
							});
						}

						if (me.structureTypeFilterVal != 'all') {
							jsonArray.push({
								paramName : 'structureType',
								paramValue1 : encodeURIComponent(me.structureTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								paramFieldLable : getLabel('lblStructureType', 'Structure Type'),
								displayType : 5,
								displayValue1 : me.structureTypeFilterDesc
							});
						}

						// Status Query
						if (statusFilterVal != null && statusFilterVal != 'All' && statusFilterVal != 'all'
								&& statusFilterVal.length >= 1) {
							statusFilterValArray = statusFilterVal.toString();

							if (statusFilterDisc != null && statusFilterDisc != 'All' && statusFilterDisc != 'all'
									&& statusFilterDisc.length >= 1) statusFilterDiscArray = statusFilterDisc.toString();

							jsonArray.push({
								paramName : 'statusFilter',
								paramValue1 : statusFilterValArray,
								operatorValue : 'statusFilterOp',
								makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('status', 'Status'),
								displayType : 5,
								displayValue1 : statusFilterDiscArray
							});
						}

						/*if (entityType === "0") {
							jsonArray.push({
								paramName : 'sellerCode',
								paramValue1 : encodeURIComponent(strSellerId.replace(new RegExp("'", 'g'), "\''")),
								paramFieldLable : getLabel('financialInstitution', 'Financial Institution'),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								displayValue1 : strSellerDesc
							});
						}*/
						return jsonArray;
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
						var me = this;
						var strModule = '';
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
							strModule = subGroupInfo.groupCode
							strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
							me.preferenceHandler.readModulePreferences(me.strPageName, strModule,
									me.postHandleDoHandleGroupTabChange, null, me, false);

						}
						else
							me.postHandleDoHandleGroupTabChange();
					},

					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = this;
						var objGroupView = me.getGroupView();
						var objPref = null, gridModel = null, showPager = true, heightOption = null;
						var colModel = null, arrCols = null;
						if (data && data.preference) 
							objPref = Ext.decode(data.preference);
							
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
						if (_charCaptureGridColumnSettingAt === 'L' && objPref
							&& objPref.gridCols) {
						arrCols = objPref.gridCols || null;
						colModel = arrCols;
						showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
						heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
							if (colModel) {
								gridModel = {
									columnModel : colModel,
									pageSize : intPageSize,
									pageNo : intPageNo,
									heightOption : heightOption
								};
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

					doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter,
							filterData) {
						var me = this;
						var objGroupView = me.getGroupView();
						var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
						if(allowLocalPreference === 'Y'){
							me.handleSaveLocalStorage();
						}
						var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.pageNo
						? me.objLocalData.d.preferences.tempPref.pageNo
						: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
						
						if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
							intNewPgNo = intPageNo;
							intOldPgNo = intPageNo;
						}
						me.firstLoad = false;
						me.disableActions(true);
						var columns = grid.columns;
						
						Ext.each(columns, function(col) {
							if (col.dataIndex == "requestStateDesc") {
								col.sortable = false;
							}
						});

						var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter) + "&$filter="
								+ me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
						if (!Ext.isEmpty(me.filterData)) {
							if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
								var quickJsonData = (me.filterData).map(function(v) {
									return v;
								});
								//
								reqJsonInQuick = me.findInQuickFilterData(quickJsonData, 'sellerCode');
								if (!Ext.isEmpty(reqJsonInQuick) && (entityType === "0")) quickJsonData.splice('sellerCode', 1);
								//
								arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
							}
						}
						if (!Ext.isEmpty(me.advFilterData)) {
							var advFilterDataObj = 	me.advFilterData;
							var advFilterDataArr = new Array;
							for(var item in advFilterDataObj)
							{
								if(!Ext.isEmpty(advFilterDataObj[item]) && !Ext.isEmpty(advFilterDataObj[item].field)){
									advFilterDataArr.push(advFilterDataObj[item])
								}
							}
							var advJsonData = (advFilterDataArr).map(function(v) {
								return v;
							});

							reqJsonInAdv = me.findInAdvFilterData(advJsonData, 'sellerCode');
							if (!Ext.isEmpty(reqJsonInAdv) && (entityType === "0")) {
								advJsonData.splice('sellerCode', 1);
							}

							if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
								arrOfParseAdvFilter = generateFilterArray(advJsonData, strApplicationDateFormat);
							}
						}

						if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
							arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);

							if (arrOfFilteredApplied) me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
						}
						me.reportGridOrder = strUrl;
						grid.loadGridData(strUrl, null, null, false);
						objGroupView.handleGroupActionsVisibility(me.strDefaultMask);

						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if (Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
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
							if (!Ext.isEmpty(columnAction)) arrAvailableActions = columnAction;
							var store = grid.getStore();
							var jsonData = store.proxy.reader.jsonData;
							if (!Ext.isEmpty(arrAvailableActions)) {
								for (var count = 0; count < arrAvailableActions.length; count++) {
									var btnIsEnabled = false;
									if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
										btnIsEnabled = grid.isRowIconVisible(store, record, jsonData,
												arrAvailableActions[count].itemId, arrAvailableActions[count].maskPosition);
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

					updateConfig : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
					},

					/* Page setting handling starts here */
					savePageSetting : function(arrPref, strInvokedFrom) {
						/*
						 * This will be get invoked from page level setting
						 * always
						 */
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref, me.postHandleSavePageSetting, args,
									me, false);
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
						}
						else {
							me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjAgreementMstSummaryPref, args, me,
									false);
						}
					},
					updateObjAgreementMstSummaryPref : function(data) {
						objAgreementMstPref = Ext.encode(data);
					},
					applyPageSetting : function(arrPref, strInvokedFrom) {
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
								/**
								 * This handling is required for non-us market
								 */
								var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo() || {}, objPref = {}, groupInfo = groupView
										.getGroupInfo()
										|| '{}', strModule = subGroupInfo.groupCode;
								Ext.each(arrPref || [], function(pref) {
									if (pref.module === 'ColumnSetting') {
										objPref = pref.jsonPreferences;
									}
								});
								args['strInvokedFrom'] = strInvokedFrom;
								args['objPref'] = objPref;
								strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
								me.preferenceHandler.saveModulePreferences(me.strPageName, strModule, objPref,
										me.postHandlePageGridSetting, args, me, false);
							}
							else {
								me.handleClearLocalPrefernces();
								me.preferenceHandler.savePagePreferences(me.strPageName, arrPref, me.postHandlePageGridSetting,
										args, me, false);
							}
						}
					},
					restorePageSetting : function(arrPref, strInvokedFrom) {
						var me = this;
						if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
							var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo() || {}, groupInfo = groupView
									.getGroupInfo()
									|| '{}', strModule = subGroupInfo.groupCode, args = {};
							strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
							args['strInvokedFrom'] = strInvokedFrom;
							Ext.each(arrPref || [], function(pref) {
								if (pref.module === 'ColumnSetting') {
									pref.module = strModule;
									return false;
								}
							});
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref, me.postHandleRestorePageSetting,
									args, me, false);
						}
						else{
							me.handleClearLocalPrefernces();
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref, me.postHandleRestorePageSetting,
									null, me, false);
						}
					},

					postHandlePageGridSetting : function(data, args, isSuccess) {
						if (isSuccess === 'Y') {
							var me = this;
							if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
								var objGroupView = me.getGroupView(), gridModel = null;
								if (args.objPref && args.objPref.gridCols) gridModel = {
									columnModel : args.objPref.gridCols
								};
								// TODO : Preferences and existing column model
								// need to be
								// merged
								objGroupView.reconfigureGrid(gridModel);
							}
							else
								window.location.reload();
						}
						else {
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
							if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
								var objGroupView = me.getGroupView();
								if (objGroupView) objGroupView.reconfigureGrid(null);
							}
							else
								window.location.reload();
						}
						else {
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
						var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

						me.pageSettingPopup = null;

						if (!Ext.isEmpty(objAgreementMstPref)) {
							objPrefData = Ext.decode(objAgreementMstPref);
							objGeneralSetting = objPrefData && objPrefData.d.preferences
									&& objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
							objGridSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting
									: null;
							objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: AGREEMENT_MST_COLUMNS || '[]';

							if (!Ext.isEmpty(objGeneralSetting)) {
								objGroupByVal = objGeneralSetting.defaultGroupByCode;
								objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
							}
							if (!Ext.isEmpty(objGridSetting)) {
								objGridSizeVal = objGridSetting.defaultGridSize;
								objRowPerPageVal = objGridSetting.defaultRowPerPage;
							}
						}

						objData["groupByData"] = objGroupView ? objGroupView.cfgGroupByData : [];
						objData["filterUrl"] = 'services/userfilterslist/agreementMst.json';
						;
						objData["rowPerPage"] = _AvailableGridSize;
						objData["groupByVal"] = objGroupByVal;
						objData["filterVal"] = objDefaultFilterVal;
						objData["gridSizeVal"] = objGridSizeVal;
						objData["rowPerPageVal"] = objRowPerPageVal;
						subGroupInfo = objGroupView.getSubGroupInfo() || {};
						strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings", "Column Settings") + ' : '
								+ (subGroupInfo.groupDescription || '') : getLabel("Settings", "Settings"));
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

						strExtension = arrExtension[actionName];
						strUrl = 'services/agreementMst/getDynamicReport.' + strExtension;
						strUrl += '?$skip=1';
						var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo() || {}, groupInfo = groupView
								.getGroupInfo()
								|| '{}';
						strUrl += this.getFilterUrl(subGroupInfo, groupInfo);

						var strOrderBy = me.reportGridOrder;
						if (!Ext.isEmpty(strOrderBy)) {
							var orderIndex = strOrderBy.indexOf('orderby');
							if (orderIndex > 0) {
								strOrderBy = strOrderBy.substring(orderIndex, strOrderBy.length);
								var indexOfamp = strOrderBy.indexOf('&$');
								if (indexOfamp > 0) strOrderBy = strOrderBy.substring(0, indexOfamp);
								strUrl += '&$' + strOrderBy;
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
							if (colArray.length > 0) strSelect = '&$select=[' + colArray.toString() + ']';
						}
						
						var objOfSelectedGridRecord = null, objOfGridSelected = null;
						var objGroupView = me.getGroupView();
						var arrSelectedrecordsId = [];
						if (!Ext.isEmpty(objGroupView)) grid = objGroupView.getGrid();

						if (!Ext.isEmpty(grid)) {
							var objOfRecords = grid.getSelectedRecords();
							if (!Ext.isEmpty(objOfRecords)) {
								objOfGridSelected = grid;
								objOfSelectedGridRecord = objOfRecords;
							}
						}
						if ((!Ext.isEmpty(objOfGridSelected)) && (!Ext.isEmpty(objOfSelectedGridRecord))) {
							for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
								arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
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
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', key, objParam[key]));
						});

						form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent', currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag));
						for (var i = 0; i < arrSelectedrecordsId.length; i++) {
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier', arrSelectedrecordsId[i]));
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
					disableActions : function(canDisable) {
						if (canDisable)
							$('.canDisable').addClass('button-grey-effect');
						else
							$('.canDisable').removeClass('button-grey-effect');
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
							case '1':
								// Today
								fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
								label = 'Today';
								break;
							case '2':
								// Yesterday
								fieldValue1 = Ext.Date.format(objDateHandler.getYesterdayDate(date), strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
								label = 'Yesterday';
								break;
							case '3':
								// This Week
								dtJson = objDateHandler.getThisWeekToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'This Week';
								break;
							case '4':
								// Last Week To Date
								dtJson = objDateHandler.getLastWeekToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'Last Week To Date';
								break;
							case '5':
								// This Month
								dtJson = objDateHandler.getThisMonthToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'This Month';
								break;
							case '6':
								// Last Month To Date
								dtJson = objDateHandler.getLastMonthToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'Last Month To Date';
								break;
							case '7':
								// Widget Date Filter
								if (!isEmpty(me.datePickerSelectedEntryAdvDate)) {
									if (me.datePickerSelectedEntryAdvDate.length == 1) {
										fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
										fieldValue2 = fieldValue1;
										operator = 'eq';
									}
									else
										if (me.datePickerSelectedEntryAdvDate.length == 2) {
											fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
											fieldValue2 = me.datePickerSelectedEntryAdvDate[1];
											if (fieldValue1 == fieldValue2)
												operator = 'eq';
											else
												operator = 'bt';
										}
								}
								break;
							case '8':
								// This Quarter
								dtJson = objDateHandler.getQuarterToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'This Quarter';
								break;
							case '9':
								// Last Quarter To Date
								dtJson = objDateHandler.getLastQuarterToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'Last Quarter To Date';
								break;
							case '10':
								// This Year
								dtJson = objDateHandler.getYearToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'This Year';
								break;
							case '11':
								// Last Year To Date
								dtJson = objDateHandler.getLastYearToDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'Last Year To Date';
								break;
							case '12':
								// Latest
								if (!Ext.isEmpty(filterDays) && filterDays !== '999') {
									fieldValue1 = Ext.Date.format(dtHistoryDate, strSqlDateFormat);
									fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
									operator = 'bt';
									label = 'Last Year To Date';
								}
								else {
									fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
									fieldValue2 = fieldValue1;
									operator = 'le';
									label = 'Latest';
								}
								break;
							case '14':
								// Last Month only
								dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
								fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								label = 'Last Month only';
								break;
							case '13':
								// Date Range
								if ('entryDate' === dateType && !isEmpty(me.datePickerSelectedEntryAdvDate)) {
									if (me.datePickerSelectedEntryAdvDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedEntryAdvDate[0], strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
										label = 'Date Range';
									}
									else
										if (me.datePickerSelectedEntryAdvDate.length == 2) {
											fieldValue1 = Ext.Date.format(me.datePickerSelectedEntryAdvDate[0], strSqlDateFormat);
											fieldValue2 = Ext.Date.format(me.datePickerSelectedEntryAdvDate[1], strSqlDateFormat);
											operator = 'bt';
											label = 'Date Range';
										}
								}
								if ('originalDate' === dateType && !isEmpty(me.datePickerSelectedOriginalAdvDate)) {
									if (me.datePickerSelectedOriginalAdvDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedOriginalAdvDate[0], strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
										label = 'Date Range';
									}
									else
										if (me.datePickerSelectedOriginalAdvDate.length == 2) {
											fieldValue1 = Ext.Date
													.format(me.datePickerSelectedOriginalAdvDate[0], strSqlDateFormat);
											fieldValue2 = Ext.Date
													.format(me.datePickerSelectedOriginalAdvDate[1], strSqlDateFormat);
											operator = 'bt';
											label = 'Date Range';
										}
								}
								if ('startDate' === dateType && !isEmpty(me.datePickerSelectedStartAdvDate)) {
									if (me.datePickerSelectedStartAdvDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedStartAdvDate[0], strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
										label = 'Date Range';
									}
									else
										if (me.datePickerSelectedStartAdvDate.length == 2) {
											fieldValue1 = Ext.Date.format(me.datePickerSelectedStartAdvDate[0], strSqlDateFormat);
											fieldValue2 = Ext.Date.format(me.datePickerSelectedStartAdvDate[1], strSqlDateFormat);
											operator = 'bt';
											label = 'Date Range';
										}
								}
								if ('endDate' === dateType && !isEmpty(me.datePickerSelectedEndAdvDate)) {
									if (me.datePickerSelectedEndAdvDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedEndAdvDate[0], strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
										label = 'Date Range';
									}
									else
										if (me.datePickerSelectedEndAdvDate.length == 2) {
											fieldValue1 = Ext.Date.format(me.datePickerSelectedEndAdvDate[0], strSqlDateFormat);
											fieldValue2 = Ext.Date.format(me.datePickerSelectedEndAdvDate[1], strSqlDateFormat);
											operator = 'bt';
											label = 'Date Range';
										}
								}

						}
						retObj.fieldValue1 = fieldValue1;
						retObj.fieldValue2 = fieldValue2;
						retObj.operator = operator;
						retObj.label = label;
						return retObj;
					},
					/* State handling at local storage starts */
					
					handleSaveLocalStorage : function(){
						var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
						if (objGroupView)
							subGroupInfo = objGroupView.getSubGroupInfo();
						if(!Ext.isEmpty(me.savedFilterVal))
							objSaveState['advFilterCode'] = me.savedFilterVal;
						if(!Ext.isEmpty(me.advFilterData)){
							objAdvJson['filterBy'] = me.advFilterData;
							objSaveState['advFilterJson'] = objAdvJson;
						}
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
					handleClearLocalPrefernces : function(){
						var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
						
						me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
								me.postHandleClearLocalPreference, args, me, false);
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
					}
				});