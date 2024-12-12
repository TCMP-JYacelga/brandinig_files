Ext
		.define(
				'GCP.controller.BillerRegistrationController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'Ext.ux.gcp.PageSettingPopUp' ],
					views : [ 'GCP.view.BillerRegistrationFilterView', 'GCP.view.BillerRegistrationSummaryView' ],
					refs : [ {
						ref : 'groupView',
						selector : 'billerRegistrationSummaryView groupView'
					}, {
						ref : 'grid',
						selector : 'billerRegistrationSummaryView groupView smartgrid'
					}, {
						ref : 'filterView',
						selector : 'billerRegistrationSummaryView groupView filterView'
					}, {
						ref : 'billerRegistrationSummaryView',
						selector : 'billerRegistrationSummaryView'
					}, {
						ref : 'registrationDateLabel',
						selector : 'billerRegistrationFilterView label[itemId="registrationDateLabel"]'

					}, {
						ref : 'billerCombo',
						selector : 'billerRegistrationFilterView combo[itemId="billerCombo"]'

					}, {
						ref : 'accountCombo',
						selector : 'billerRegistrationFilterView combo[itemId="accountCombo"]'

					} ],
					config : {
						strPageName : 'billerRegistrationSummary',
						pageSettingPopup : null,
						registrationDateQuickFilterVal : '',
						registrationDateQuickFilterLabel : '',
						isBillerSelected : false,
						isCompanySelected : false,
						preferenceHandler : null,
						strDefaultMask : '000000000000000000',
						dateHandler : null,
						userStatusPrefCode : '',
						userStatusPrefDesc : '',
						selectedFilterClient : '',
						isAccountSelected : false,
						firstLoad : false,
						objLocalData : null
					},
					init : function() {
						var me = this;
						me.firstLoad = true;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						if (objSaveLocalStoragePref) {
							me.objLocalData = Ext.decode(objSaveLocalStoragePref);
							objQuickPref = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref
									&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson
									: {};

							me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];

						}
						me.updateConfig();
						$(document).on('performPageSettings', function(event) {
							me.showPageSettingPopup('PAGE');
						});

						me.control({
							'billerRegistrationSummaryView groupView' : {
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
								'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
									if (isGroupAction === true) {
										me.doHandleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
									}
								},
								'gridStoreLoad' : function(grid, store) {
									me.disableActions(false);
								},
								'render' : function() {
									var me = this, objLocalJsonData = '';
									if (objBillerRegistrationPref || objSaveLocalStoragePref) {
										objLocalJsonData = Ext.decode(objSaveLocalStoragePref);

										if (!Ext.isEmpty(objLocalJsonData.d.preferences)
												&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref))
												&& allowLocalPreference === 'Y'
												&& !Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)) {
											me.updateConfig();
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
									me.selectedFilterClient = me.clientCode;
									me.selectedFilterClientDesc = me.clientDesc;
									me.handleClientChangeInQuickFilter();
								}
							},

							'filterView button[itemId="clearSettingsButton"]' : {
								click : function() {
									me.resetAllFilters();
								}
							},
							'billerRegistrationFilterView radio[name="payType"]' : {
								change : function(radio, newValue, oldValue, eOpts) {
									if (radio.getValue()) {
										me.selectedPayType = radio.inputValue;
										me.selectedPayTypeDesc = radio.boxLabel;
										me.setDataForFilter();
										me.applyFilter();
									}

								},
								afterrender : function(radio, width, height, eOpts) {
									var me = this;
									if (!Ext.isEmpty(me.selectedPayType) && 'ALL' !== me.selectedPayType
											&& 'all' !== me.selectedPayType) {
										radio.setValue(me.selectedPayType);
									}
									else {
										radio.setValue('All');
									}
								}
							},
							'billerRegistrationFilterView combo[itemId="clientCombo"]' : {
								select : function(combo, record) {
									me.selectedFilterClient = combo.getValue();
									me.selectedFilterClientDesc = combo.getDisplayValue();
									me.filterBillerName = '';
									me.filterBillerDesc = '';
									var billerCombo = me.getFilterView().down("combo[itemId='billerCombo']");
									billerCombo.setValue('');
									me.filterAccountName = '';
									me.filterAccountDesc = '';
									var acctCombo = me.getFilterView().down("combo[itemId='accountCombo']");
									acctCombo.setValue('');
									me.handleClientChangeInQuickFilter();
									me.isCompanySelected = true;
									
								},
								change : function(combo, record, oldVal) {
									me.selectedFilterClient = combo.getValue();
									me.selectedFilterClientDesc = combo.getDisplayValue();
									me.handleClientChangeInQuickFilter();
									me.isCompanySelected = true;
								},
								afterrender : function(combo, width, height, eOpts) {
									var me = this;
									if (!Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode && 'all' !== me.clientCode) {
										combo.setValue(me.clientCode);
										me.selectedFilterClient = me.clientCode;
									}
									else {
										if(strEntityType == 0 || clientCount > 1){
										combo.setValue(combo.getStore().getAt(0));
									}
										
									}

								}
							},
							'billerRegistrationFilterView AutoCompleter[itemId="clientAuto"]' : {
								select : function(combo, record) {
									me.selectedFilterClient = combo.getValue();
									me.selectedFilterClientDesc = combo.getDisplayValue();
									me.handleClientChangeInQuickFilter();
									me.isCompanySelected = true;
									strClient = me.selectedFilterClient;
									me.filterBillerName = '';
									me.filterBillerDesc = '';
									var billerCombo = me.getFilterView().down("combo[itemId='billerCombo']");
									billerCombo.setValue('');
									me.filterAccountName = '';
									me.filterAccountDesc = '';
									var acctCombo = me.getFilterView().down("combo[itemId='accountCombo']");
									acctCombo.setValue('');
									$(document).trigger('handleClientChangeInQuickFilter', false);
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue())) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, '') !== '') {

											me.selectedFilterClient = combo.getValue();
											me.selectedFilterClientDesc = combo.getDisplayValue();
											me.handleClientChangeInQuickFilter();
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
										selectedFilterClient = combo.getValue();
										selectedFilterClientDesc = combo.getValue();
										me.selectedFilterClient = combo.getValue();
										me.selectedFilterClientDesc = combo.getValue();
										me.handleClientChangeInQuickFilter();
										me.isCompanySelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.selectedFilterClient)) {
										combo.setValue(me.selectedFilterClientDesc);
									}
								}
							},
							'billerRegistrationFilterView combo[itemId="billerCombo"]' : {
								select : function(combo, record) {
									me.filterBillerName = combo.getValue();
									me.filterBillerDesc = combo.getRawValue();
									me.isBillerSelected = true;
									me.setDataForFilter();
									me.applyFilter();
								},

								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || 'ALL' === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, '') !== '') {
											me.filterBillerName = '';
											me.filterBillerDesc = '';
											me.setDataForFilter();
											me.applyFilter();
											me.isBillerSelected = true;
										}
									}
									else {
										me.isBillerSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isBillerSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isBillerSelected == false && !Ext.isEmpty(combo.getRawValue())) {

										me.filterBillerName = combo.getRawValue();
										me.filterBillerDesc = combo.getRawValue();
										me.setDataForFilter();
										me.applyFilter();
										me.isBillerSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterBillerDesc && me.filterBillerDesc != 'ALL')) {
										combo.setValue(me.filterBillerName);
										combo.setRawValue(me.filterBillerDesc);
									}
								}
							},
							'billerRegistrationFilterView  combo[itemId="statusCombo"]' : {
								'select' : function(combo, selectedRecords) {
									combo.isQuickStatusFieldChange = true;
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || 'ALL' === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, '') !== '') {
											var me = this;
											combo.isQuickStatusFieldChange = false;
											me.userStatusPrefCode = '';
											me.userStatusPrefDesc = '';
											me.setDataForFilter();
											me.applyFilter();
										}
									}
									else {
										combo.isQuickStatusFieldChange = false;
									}
								},
								'blur' : function(combo, record) {
									if (combo.isQuickStatusFieldChange) {
										me.handleStatusFilterClick(combo);
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.userStatusPrefDesc) && me.userStatusPrefDesc != 'All'
											&& me.userStatusPrefDesc != 'all' && !Ext.isEmpty(me.userStatusPrefCode)
											&& me.userStatusPrefCode != 'All' && me.userStatusPrefCode != 'all') {
										var tempArr = [];
										tempArr = me.userStatusPrefCode.split(',');
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
							'billerRegistrationFilterView component[itemId="registrationDatePicker"]' : {
								render : function() {
									$('#registrationDatePicker').datepick({
										monthsToShow : 1,
										changeMonth : true,
										// minDate : dtHistoryDate,
										// maxDate : forecastRestrictionDate,
										changeYear : true,
										dateFormat : strApplicationDateFormat,
										rangeSeparator : ' to ',
										onClose : function(dates) {
											if (!Ext.isEmpty(dates)) {
												me.dateRangeFilterVal = '13';
												me.datePickerSelectedDate = dates;
												me.datePickerSelectedRegistrationDate = dates;
												me.registrationDateQuickFilterVal = me.dateRangeFilterVal;
												me.registrationDateQuickFilterLabel = getLabel('daterange', 'Date Range');
												me.handleDateChange(me.dateRangeFilterVal);
												me.setDataForFilter();
												me.applyFilter();
											}
										}
									});
									if (!Ext.isEmpty(me.registrationDateQuickFilterVal)
											&& !Ext.isEmpty(me.registrationDateQuickFilterLabel)) {
										me.handleDateChange(me.registrationDateQuickFilterVal);
									}
								}
							},
							'billerRegistrationFilterView combo[itemId="accountCombo"]' : {
								select : function(combo, record) {
									me.filterAccountName = combo.getValue();
									me.filterAccountDesc = combo.getRawValue();
									me.isAccountSelected = true;
									me.setDataForFilter();
									me.applyFilter();
								},

								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || 'ALL' === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, '') !== '') {
											me.filterAccountName = '';
											me.filterAccountDesc = '';
											me.setDataForFilter();
											me.applyFilter();
											me.isAccountSelected = true;
										}
									}
									else {
										me.isAccountSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isAccountSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isBillerSelected == false && !Ext.isEmpty(combo.getRawValue())) {

										me.filterAccountName = combo.getRawValue();
										me.filterAccountDesc = combo.getRawValue();
										me.setDataForFilter();
										me.applyFilter();
										me.isAccountSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterAccountDesc && me.filterAccountDesc != 'ALL')) {
										combo.setValue(me.filterAccountName);
										combo.setRawValue(me.filterAccountDesc);
									}
								}
							},
							'billerRegistrationFilterView textfield[itemId="referenceText"]' : {
								change : function(textfield, newVal, oldVal) {
									/*
									 * me.filterReferenceName = textfield.getValue(); me.filterReferenceDesc =
									 * textfield.getRawValue(); me.isReferenceSelected = true; me.setDataForFilter();
									 * me.applyFilter();
									 */
								},
								keyup : function(combo, e, eOpts) {
									me.isReferenceSelected = false;
								},
								blur : function(textfield, The, eOpts) {
									me.filterReferenceName = textfield.getRawValue();
									me.filterReferenceDesc = textfield.getRawValue();
									me.setDataForFilter();
									me.applyFilter();
									me.isReferenceSelected = true;

								},
								boxready : function(text, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterReferenceName)) {
										text.setValue(me.filterReferenceName);
										text.setRawValue(me.filterReferenceDesc);
									}
								}
							}

						});
						$(document).on('handleClientChangeInQuickFilter', function(event) {
							me.handleClientChangeInQuickFilter();
						});
						$(document).on('performReportAction', function(event, actionName) {
							me.downloadReport(actionName);
						});
					},
					handleStatusFilterClick : function(combo) {
						var me = this;
						combo.isQuickStatusFieldChange = false;
						me.userStatusPrefCode = combo.getSelectedValues();
						me.userStatusPrefDesc = combo.getRawValue();
						me.setDataForFilter();
						me.applyFilter();
					},
					resetAllFilters : function() {
						var me = this;
						if (entityType === '1') {
							var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
							if (clientCombo.getStore().getCount()) {
								var record = clientCombo.getStore().getAt(0);
								clientCombo.setValue(record);
								$(document).trigger('handleClientChangeInQuickFilter');

							}
							else {
								$(document).trigger('handleClientChangeInQuickFilter');
							}
						}
						else {
							me.resetClientAutocompleter();
						}

						var datePickerRef = $('#registrationDatePicker');
						me.registrationDateFilterVal = '';
						datePickerRef.val('');
						me.registrationDateQuickFilterVal = '';

						var statusFltId = me.getFilterView().down('combo[itemId=statusCombo]');
						statusFltId.reset();
						me.userStatusPrefCode = 'all';
						statusFltId.selectAllValues();
						var billerCombo = me.getFilterView().down("combo[itemId='billerCombo']");
						billerCombo.setValue('');
						me.filterBillerName = '';
						me.filterBillerDesc = '';

						var accountCombo = me.getFilterView().down("combo[itemId='accountCombo']");
						accountCombo.setValue('');
						me.filterAccountName = '';
						me.filterAccountDesc = '';

						var reference = me.getFilterView().down("textfield[itemId='referenceText']");
						reference.setValue('');
						me.filterReferenceName = '';
						me.filterReferenceDesc = '';

						var payType = me.getFilterView().down('radio[name="payType"]');
						payType.setValue('All');
						me.selectedPayType = '';
						me.selectedPayTypeDesc = '';

						me.setDataForFilter();
						me.refreshData();
					},
					handleClientChangeInQuickFilter : function() {
						var me = this;
						me.clientCode = me.selectedFilterClient;
						if('all' !== me.selectedFilterClient){
						me.clientDesc = me.selectedFilterClientDesc;
						}
						//
						var billerURL ="";
						if(!isEmpty(me.selectedFilterClient) && me.selectedFilterClient !='all')
							billerURL =  'services/userseek/billerList.json?$filtercode1='+me.selectedFilterClient;
						else
							billerURL =  'services/userseek/billerList.json?$filtercode1='+strClient;
						var billerStore = Ext.create('Ext.data.Store', {
															autoLoad: true,
															fields : ['SYS_BENE_CODE','SYS_BENE_DESC'],
																proxy : { type : 'ajax',
																url : billerURL,
																
															 
															reader : {
																	type : 'json',
																	root : 'd.preferences'
																},
																listeners: {
														            load: function( store, records, successful, eOpts ) {
														              
														                } 
																	}	
																}			        
														});	
								
						me.getBillerCombo().bindStore(billerStore);
						
						var accURL ="";
						if(!isEmpty(me.selectedFilterClient) && me.selectedFilterClient !='all')
							accURL =  'services/userseek/acctList.json?$filtercode1='+me.selectedFilterClient;
						else
							accURL =  'services/userseek/acctList.json?$filtercode1='+strClient;
						var accountStore = Ext.create('Ext.data.Store', {
															autoLoad: true,
															fields : ['CODE'],
																proxy : { type : 'ajax',
																url : accURL,
																
															 
															reader : {
																	type : 'json',
																	root : 'd.preferences'
																},
																listeners: {
														            load: function( store, records, successful, eOpts ) {
														               
														                } 
																	}	
																}			        
														});	
								
						me.getAccountCombo().bindStore(accountStore);
						//
						
						
						
					
						me.setDataForFilter();
						me.applyFilter();
					},
					handleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
						var me = this;
						var groupView = me.getGroupView();
						if (!Ext.isEmpty(groupView)) {
							var arrayJson = [];
							var records = (arrSelectedRecords || []);
							for (var index = 0; index < records.length; index++) {
								arrayJson.push({
									serialNo : grid.getStore().indexOf(records[index]) + 1,
									identifier : records[index].data.identifier,
									userMessage : remark,
									recordDesc : records[index].data.scmProductName
								});
							}
							if (arrayJson) {
								arrayJson = arrayJson.sort(function(valA, valB) {
									return valA.serialNo - valB.serialNo;
								});
							}

							Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrayJson),
								success : function(response) {
									groupView.refreshData();
									var errorMessage = '';
									if (response.responseText != '[]') {
										var jsonData = Ext.decode(response.responseText);
										jsonData = jsonData.d ? jsonData.d : jsonData;
										if (!Ext.isEmpty(jsonData)) {
											for (var i = 0; i < jsonData.length; i++) {
												var arrError = jsonData[i].errors;
												if (!Ext.isEmpty(arrError)) {
													for (var j = 0; j < arrError.length; j++) {
														for (var j = 0; j < arrError.length; j++) {
															errorMessage = errorMessage + arrError[j].code + ' : '
																	+ arrError[j].errorMessage + '<br/>';
														}
													}
												}

											}
											if ('' != errorMessage && null != errorMessage) {
												Ext.MessageBox.show({
													title : getLabel('errorTitle', 'Error'),
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
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
						var me = this, strUrl = '';
						if (actionName === 'submit' || actionName === 'accept' || actionName === 'reject'
								|| actionName === 'discard') {
							me.doHandleGroupActions(actionName, grid, [ record ], 'rowAction');
						}
						else
							if (actionName === 'btnHistory') {
								var recHistory = record.get('history');

								if (!Ext.isEmpty(recHistory) && !Ext.isEmpty(recHistory.__deferred.uri) && !Ext.isEmpty(record.get('identifier'))) {
									me.showHistory(record);
								}
							}
							else
								if (actionName === 'btnEdit') {
									strUrl = 'editBillerRegistration.srvc';
									me.submitForm(strUrl, record, rowIndex);
								}
								else
									if (actionName === 'btnView') {
										strUrl = 'viewBillerRegistration.srvc';
										me.submitForm(strUrl, record, rowIndex);
									}
					},
					showHistory : function(record) {
						var historyPopup = Ext.create('GCP.view.HistoryPopup', {
							historyUrl : record.get('history').__deferred.uri, identifier: record.get('identifier')
						}).show();
						historyPopup.center();
					},
					doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex,
							arrSelectedRecords, jsonData) {
						var me = this;
						var buttonMask = me.strDefaultMask;
						var maskArray = [], actionMask = '', objData = null;
						if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
						}

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
							if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
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
						var blnEnabled = false, strBitMapKey = null, arrItems = null;
						if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext.each(arrItems, function(item) {
								strBitMapKey = parseInt(item.maskPosition,10) - 1;
								if (strBitMapKey) {
									blnEnabled = isActionEnabled(actionMask, strBitMapKey);

									if ((item.maskPosition === 6 && blnEnabled)) {
										blnEnabled = blnEnabled && isSameUser;
									}
									else
										if (item.maskPosition === 7 && blnEnabled) {
											blnEnabled = blnEnabled && isSameUser;
										}
										else
											if (item.maskPosition === 8 && blnEnabled) {
												blnEnabled = blnEnabled && isDisabled;
											}
											else
												if (item.maskPosition === 9 && blnEnabled) {
													blnEnabled = blnEnabled && !isDisabled;
												}
												else
													if (item.maskPosition === 10 && blnEnabled) {
														blnEnabled = blnEnabled && !isSubmit;
													}
									item.setDisabled(!blnEnabled);
								}
							});
						}
					},
					submitForm : function(strUrl, record, rowIndex) {
						var me = this;
						var viewState = record.data.identifier;
						var form;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState', viewState));
						form.action = strUrl;

						document.body.appendChild(form);
						form.submit();
					},
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},
					refreshData : function() {
						var me = this;
						var objGroupView = me.getGroupView();
						objGroupView.refreshData();
						
					},
					updateFilterInfo : function() {
						var me = this;
						var arrInfo = generateFilterArray(me.filterData);
						
						me.getFilterView().updateFilterInfo(arrInfo);
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
						var me = this;
						var strModule = '';
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
							strModule = subGroupInfo.groupCode;
							strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
							me.preferenceHandler.readModulePreferences(me.strPageName, strModule,
									me.postHandleDoHandleGroupTabChange, null, me, false);

						}
						else {
							me.postHandleDoHandleGroupTabChange();
						}
					},

					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = this;
						var objGroupView = me.getGroupView();
						var objSummaryView = me.getBillerRegistrationSummaryView(), objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
						var colModel = null, arrCols = null;

						var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref && me.objLocalData.d.preferences.tempPref.pageSize ? me.objLocalData.d.preferences.tempPref.pageSize
								: '';
						var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref && me.objLocalData.d.preferences.tempPref.pageNo ? me.objLocalData.d.preferences.tempPref.pageNo
								: 1;
						var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref && me.objLocalData.d.preferences.tempPref.sorter ? me.objLocalData.d.preferences.tempPref.sorter
								: [];

						if (data && data.preference) {
							objPref = Ext.decode(data.preference);
							arrCols = objPref.gridCols || null;
							colModel = objSummaryView.getColumnModel(arrCols);
							showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager
									: true;
							heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption
									: null;
							if (colModel) {
								gridModel = {
									columnModel : colModel,
									showPagerForced : showPager,
									heightOption : heightOption,
									storeModel : {
										sortState : objPref.sortState
									}
								};
							}
						}
						if (!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
							gridModel = gridModel ? gridModel : {};
							gridModel.pageSize = intPageSize;
							gridModel.pageNo = intPageNo;
							gridModel.storeModel = {
								sortState : sortState
							};
						}
						objGroupView.reconfigureGrid(gridModel);
					},

					doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter,
							filterData) {
						var me = this;
						var objGroupView = me.getGroupView();

						if (allowLocalPreference === 'Y') {
							me.handleSaveLocalStorage();
						}
						var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref && me.objLocalData.d.preferences.tempPref.pageNo ? me.objLocalData.d.preferences.tempPref.pageNo
								: null, intOldPgNo = oldPgNo, intNewPgNo = newPgNo;

						if (!Ext.isEmpty(intPageNo) && me.firstLoad) {
							intNewPgNo = intPageNo;
							intOldPgNo = intPageNo;
						}
						me.firstLoad = false;

						var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter) + '&$filter='
								+ me.getFilterUrl(subGroupInfo, groupInfo);
						var columns = grid.columns;
						Ext.each(columns, function(col) {
							if (col.dataIndex == 'requestStateDesc' || col.dataIndex == 'validity') {
								col.sortable = false;
							}
						});
						me.updateFilterInfo();
						grid.loadGridData(strUrl, null, null, false);
						objGroupView.handleGroupActionsVisibility(me.strDefaultMask);

						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if (Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1);
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
							if (!Ext.isEmpty(columnAction)) {
								arrAvailableActions = columnAction;
							}
							var store = grid.getStore();
							var jsonData = store.proxy.reader.jsonData;
							var btnIsEnabled = false;
							if (!Ext.isEmpty(arrAvailableActions)) {
								for (var count = 0; count < arrAvailableActions.length; count++) {
									if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
										btnIsEnabled = grid.isRowIconVisible(store, record, jsonData,
												arrAvailableActions[count].itemId, arrAvailableActions[count].maskPosition);
										if (btnIsEnabled == true) {
											arrVisibleActions.push(arrAvailableActions[count]);
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
						if (!Ext.isEmpty(objSaveLocalStoragePref)) {
							var objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
							if (!Ext.isEmpty(objLocalJsonData) && (!Ext.isEmpty(objLocalJsonData.d.preferences))
									&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref))
									&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))) {
								var data = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
								for (var i = 0; i < data.length; i++) {
									if (data[i].paramName === 'benefCode') {
										me.filterBillerName = data[i].paramValue1;
										me.filterBillerDesc = data[i].displayValue1;
									}
									if (data[i].paramName === 'acctNmbr') {
										me.filterAccountDesc = decodeURIComponent(data[i].displayValue1);
										me.filterAccountName = decodeURIComponent(data[i].paramValue1);
									}
									else
										if (data[i].paramName === 'reference') {
											me.filterReferenceDesc = data[i].displayValue1;
											me.filterReferenceName = data[i].paramValue1;
										}
										else
											if (data[i].paramName === 'requestState') {
												me.userStatusPrefCode = data[i].paramValue1;
												me.userStatusPrefDesc = data[i].displayValue1;
											}
											else
												if (data[i].paramName === 'clientCode') {
													me.clientCode = data[i].paramValue1;
													me.clientDesc = data[i].displayValue1;
													selectedFilterClient = me.clientCode;
													selectedFilterClientDesc = decodeURIComponent(me.clientDesc);
												}
												else
													if (data[i].paramName === 'billPayType') {
														me.selectedPayType = data[i].paramValue1;
														me.selectedPayTypeDesc = data[i].displayValue1;
													}
													else
														if (data[i].paramName === 'registrationDate') {
															me.registrationDateQuickFilterVal = '13';
															me.registrationDateQuickFilterLabel = data[i].dateLabel;
															var yy = null, mm = null, dd = null, yyTo = null, mmTo = null, ddTo = null;
															me.datePickerSelectedDate = [];
															if (data[i].paramValue1 === data[i].paramValue2) {
																yy = data[i].paramValue1.substring(0, 4);
																mm = data[i].paramValue1.substring(5, 7);
																dd = data[i].paramValue1.substring(8, 10);
																me.datePickerSelectedDate.push(new Date(yy, mm-1, dd));
															}
															else {
																yy = data[i].paramValue1.substring(0, 4);
																mm = data[i].paramValue1.substring(5, 7);
																dd = data[i].paramValue1.substring(8, 10);
																me.datePickerSelectedDate.push(new Date(yy, mm-1, dd));

																yyTo = data[i].paramValue2.substring(0, 4);
																mmTo = data[i].paramValue2.substring(5, 7);
																ddTo = data[i].paramValue2.substring(8, 10);
																me.datePickerSelectedDate.push(new Date(yyTo, mmTo-1, ddTo));
															}
														}
								}
							}
						}
					},
					doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
						var me = this;
						var strUrl = Ext.String.format('services/billerRegistration/{0}', strAction);
						if (strAction === 'reject') {
							me.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords, strActionType);

						}
						else {
							me.handleGroupActions(strUrl, '', grid, arrSelectedRecords, strActionType, strAction);
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
							buttonText: {
								ok: getLabel('btnOk', 'OK'),
								cancel: getLabel('btncancel', 'Cancel')
							},
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
					setDataForFilter : function() {
						var me = this;
						me.filterData = me.getFilterQueryJson();
					},
					getFilterQueryJson : function() {
						var me = this, clientParamName = null, clientNameOperator = null, clientCodeVal = null, statusFilterValArray = [], statusFilterDiscArray = [], statusFilterVal = me.userStatusPrefCode, statusFilterDisc = me.userStatusPrefDesc, jsonArray = [];
						if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'all' !== me.clientCode &&  (strEntityType === '1' && 1 < clientCount )) {
							clientParamName = 'clientCode';
							clientNameOperator = 'eq';
							clientCodeVal = me.clientCode;
							jsonArray.push({
								paramName : clientParamName,
								paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : clientNameOperator,
								dataType : 'S',
								paramFieldLable : getLabel('lblcompany', 'Company Name'),
								displayType : 5,
								displayValue1 : me.clientDesc
							});
						}
						else
							if ((strEntityType === '0')
									&& (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'ALL' !== me.clientCode && 'all' !== me.clientCode)) {
								clientParamName = 'clientDesc';
								clientNameOperator = 'lk';
								clientCodeVal = me.clientDesc.toUpperCase();
								jsonArray.push({
									paramName : clientParamName,
									paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : clientNameOperator,
									dataType : 'S',
									paramFieldLable : getLabel('lblcompany', 'Company Name'),
									displayType : 5,
									displayValue1 : me.clientDesc
								});
							}
						if (!Ext.isEmpty(me.filterBillerName)) {
							jsonArray.push({
								paramName : 'benefCode',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.filterBillerName.replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('biller', 'Biller'),
								displayType : 5,
								displayValue1 : me.filterBillerDesc
							});
						}
						// Status Query
						if (statusFilterVal != null && statusFilterVal != 'All' && statusFilterVal != 'all'
								&& statusFilterVal.length >= 1) {
							statusFilterValArray = statusFilterVal.toString();

							if (statusFilterDisc != null && statusFilterDisc != 'All' && statusFilterDisc != 'all'
									&& statusFilterDisc.length >= 1) {
								statusFilterDiscArray = statusFilterDisc.toString();
							}

							jsonArray.push({
								paramName : 'requestState',
								paramValue1 : statusFilterValArray,
								operatorValue : 'statusFilterOp',
								dataType : 'S',
								paramFieldLable : getLabel('status', 'Status'),
								displayType : 5,
								displayValue1 : statusFilterDiscArray
							});
						}
						var index = me.registrationDateQuickFilterVal;
						var objDateParams = me.getDateParam(index);
						if (!Ext.isEmpty(index)) {
							jsonArray.push({
								paramName : 'registrationDate',
								paramValue1 : objDateParams.fieldValue1,
								paramValue2 : objDateParams.fieldValue2,
								operatorValue : objDateParams.operator,
								dataType : 'D',
								paramFieldLable : getLabel('regDate', 'Registration Date'),
								dateLabel : objDateParams.label
							});
						}
						if (!Ext.isEmpty(me.filterAccountName)) {
							jsonArray.push({
								paramName : 'acctNmbr',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.filterAccountName.replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('account', 'Account'),
								displayType : 5,
								displayValue1 : me.filterAccountDesc
							});
						}
						if (!Ext.isEmpty(me.selectedPayType) && (me.selectedPayType !== 'All')) {
							jsonArray.push({
								paramName : 'billPayType',
								operatorValue : 'eq',
								paramValue1 : me.selectedPayType,
								dataType : 'S',
								paramFieldLable : getLabel('billPayType', 'Bill Pay Type'),
								displayType : 5,
								displayValue1 : me.selectedPayTypeDesc
							});
						}
						// reference should be the last field in the query json  
						if (!Ext.isEmpty(me.filterReferenceName)) {
							me.filterReferenceName = me.filterReferenceName.toUpperCase();
							jsonArray.push({
								paramName : 'reference',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.filterReferenceName.replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('reference', 'Any Reference'),
								displayType : 5,
								displayValue1 : me.filterReferenceDesc
							});
						}
						return jsonArray;
					},
					getFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this;
						var strQuickFilterUrl = '';
						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery) ? subGroupInfo.groupQuery : '';
						strQuickFilterUrl = me.generateUrlWithFilterParams();
						if (!Ext.isEmpty(strGroupQuery)) {
							if (!Ext.isEmpty(strQuickFilterUrl)) {
								strQuickFilterUrl += ' and ' + strGroupQuery;
							}
							else {
								strQuickFilterUrl += '&$filter=' + strGroupQuery;
							}
						}
						if (!Ext.isEmpty(me.filterReferenceName)) {
							strQuickFilterUrl += '&$reference=' + me.filterReferenceName;
						}
						return strQuickFilterUrl;
					},
					handleDateChange : function(index) {
						var me = this;
						var objDateParams = me.getDateParam(index);
						var datePickerRef = $('#registrationDatePicker');
						if (!Ext.isEmpty(me.registrationDateQuickFilterLabel)) {
							me.getRegistrationDateLabel().setText(
									getLabel('regDate', 'Registration Date') + ' (' + me.registrationDateQuickFilterLabel + ')');
						}

						var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue1));
						var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd',
								objDateParams.fieldValue2));

						if (index == '13') {
							if (objDateParams.operator == 'eq') {
								datePickerRef.datepick('setDate', vFromDate);
							}
							else {
								datePickerRef.datepick('setDate', [ vFromDate, vToDate ]);
							}
						}
						else {
							if (index === '1' || index === '2' || index === '12') {
								if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
									datePickerRef.datepick('setDate', vToDate);
								}
								else
									if (index === '12') {
										datePickerRef.datepick('setDate', vFromDate);
									}
									else {
										datePickerRef.datepick('setDate', vFromDate);
									}
							}
							else {
								datePickerRef.datepick('setDate', [ vFromDate, vToDate ]);
							}
						}
						if (!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate)) {
							selectedRegistrationDate = {
								operator : objDateParams.operator,
								fromDate : vFromDate,
								toDate : vToDate,
								dateLabel : objDateParams.label
							};
						}
						else {
							selectedRegistrationDate = {};
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
											if (fieldValue1 == fieldValue2) {
												operator = 'eq';
											}
											else {
												operator = 'bt';
											}
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
									label = 'Latest';
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
								if (!isEmpty(me.datePickerSelectedDate)) {
									if (me.datePickerSelectedDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
										label = 'Date Range';
									}
									else
										if (me.datePickerSelectedDate.length == 2) {
											fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
											fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
											operator = 'bt';
											label = 'Date Range';
										}
								}
								break;
							default:
								break;

						}
						retObj.fieldValue1 = fieldValue1;
						retObj.fieldValue2 = fieldValue2;
						retObj.operator = operator;
						retObj.label = label;

						return retObj;
					},
					applyFilter : function() {
						var me = this;
						me.filterApplied = 'Q';
						me.refreshData();

					},
					disableActions : function(canDisable) {
						if (canDisable) {
							$('.canDisable').addClass('button-grey-effect');
						}
						else {
							$('.canDisable').removeClass('button-grey-effect');
						}
					},
					handleAppliedFilterDelete : function(btn) {
						var me = this;
						var objData = btn.data;
						if (!Ext.isEmpty(objData)) {
							me.resetFieldOnDelete(objData);
						}
					},
					resetFieldOnDelete : function(objData) {
						var me = this, strFieldName;
						if (!Ext.isEmpty(objData)) {
							strFieldName = objData.paramName || objData.field;
						}
						if ('clientCode' === strFieldName || 'clientDesc' === strFieldName) {
							if (entityType === '1') {
								var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
								if (clientCombo.getStore().getCount()) {
									var record = clientCombo.getStore().getAt(0);
									clientCombo.setValue(record);
									$(document).trigger('handleClientChangeInQuickFilter');
								}
								else {
									$(document).trigger('handleClientChangeInQuickFilter');
								}
							}
							else {
								me.resetClientAutocompleter();
							}
						}
						else
							if (strFieldName === 'benefCode') {
								var billerCombo = me.getFilterView().down('combo[itemId="billerCombo"]');
								billerCombo.setValue('');
							}
							else
								if (strFieldName === 'acctNmbr') {
									var accountCombo = me.getFilterView().down('combo[itemId="accountCombo"]');
									accountCombo.setValue('');
								}
								else
									if (strFieldName === 'billPayType') {
										var payType = me.getFilterView().down('radio[name="payType"]');
										payType.setValue('All');
									}
									else
										if (strFieldName === 'registrationDate') {

											var datePickerRef = $('#registrationDatePicker');
											me.registrationDateFilterVal = '';
											me.getRegistrationDateLabel().setText(getLabel('date', 'Registration Date'));
											datePickerRef.val('');
											me.registrationDateQuickFilterVal = '';
											me.registrationDateQuickFilterLabel = '';
											me.handleDateChange(me.registrationDateQuickFilterVal);
											me.setDataForFilter();
											me.applyFilter();
										}
										else
											if (strFieldName === 'reference') {
												var reference = me.getFilterView().down('textfield[itemId="referenceText"]');
												reference.setValue('');
												me.filterReferenceName = '';
												me.setDataForFilter();
												me.applyFilter();
											}
											else
												if (strFieldName === 'requestState') {
													var statusFltId = me.getFilterView().down('combo[itemId=statusCombo]');
													statusFltId.reset();
													me.userStatusPrefCode = 'all';
													statusFltId.selectAllValues();
													me.setDataForFilter();
												}
					},
					resetClientAutocompleter : function() {
						var me = this;
						var clientAuto = me.getFilterView().down("combo[itemId='clientAuto']");
						clientAuto.setRawValue('');
						me.selectedFilterClient = '';
						me.selectedFilterClientDesc = '';
						$(document).trigger('handleClientChangeInQuickFilter');
					},

					generateUrlWithFilterParams : function() {
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
								if (Ext.isEmpty(filterData[index].operatorValue)) {
									isFilterApplied = false;
									continue;
								}
								switch (filterData[index].operatorValue) {
									case 'bt':

										if (filterData[index].dataType === 'D') {

											strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue
													+ ' ' + 'date\'' + filterData[index].paramValue1 + '\'' + ' and ' + 'date\''
													+ filterData[index].paramValue2 + '\'';
										}
										else {
											strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue
													+ ' ' + '\'' + filterData[index].paramValue1 + '\'' + ' and ' + '\''
													+ filterData[index].paramValue2 + '\'';
										}
										break;

									case 'in':
										var objValue = filterData[index].paramValue1;
										var objArray = objValue.split(',');
										if (objArray.length > 0 && objArray[0] != 'All') {
											if (isFilterApplied) {
												if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
													strDetailUrl = strDetailUrl + ' and ';
												}
												else {
													strTemp = strTemp;
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
													strDetailUrl = strDetailUrl + filterData[index].paramName + ' eq ';
													strDetailUrl = strDetailUrl + '\'' + objArray[i] + '\'';
													if (i != objArray.length - 1) {
														strDetailUrl = strDetailUrl + ' or ';
													}
												}
												else {
													strTemp = strTemp + filterData[index].paramName + ' eq ';
													strTemp = strTemp + '\'' + objArray[i] + '\'';
													if (i != objArray.length - 1) {
														strTemp = strTemp + ' or ';
													}

												}
											}
											if (filterData[index].detailFilter && filterData[index].detailFilter === 'Y') {
												strDetailUrl = strDetailUrl + ')';
											}
											else {
												strTemp = strTemp + ')';
											}
										}
										break;
									case 'statusFilterOp':
										var objValue = filterData[index].paramValue1;
										var objArray = objValue.split(',');
										if (objArray.length >= 1) {
											strTemp = strTemp + '(';
										}
										for (var i = 0; i < objArray.length; i++) {
											if (objArray[i] == 12) {
												strTemp = strTemp
														+ "((requestState eq '0' or requestState eq '1') and isSubmitted eq 'Y')";
											}
											else
												if (objArray[i] == 3) {
													strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
												}
												else
													if (objArray[i] == 11) {
														strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N')";
													}
													else
														if (objArray[i] == 0 || objArray[i] == 1) {
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
											strTemp = strTemp + ')';
											isFilterApplied = true;
										}
										break;
									default:
										// Default opertator is eq
										if (filterData[index].dataType === 'D') {

											strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue
													+ ' ' + 'date\'' + filterData[index].paramValue1 + '\'';
										}
										else {

											strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue
													+ ' ' + '\'' + filterData[index].paramValue1 + '\'';
										}
										break;
								}
								isFilterApplied = true;
							}
						}
						if (isFilterApplied) {
							strFilter = strFilter + strTemp;
						}
						else {
							strFilter = '';
						}
						return strFilter;
					},
					/* Page setting handling starts here */
					savePageSetting : function(arrPref, strInvokedFrom) {
						/* This will be get invoked from page level setting always */
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
							me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjSummaryPref, args, me, false);
						}
					},
					updateObjSummaryPref : function(data) {
						objBillerRegistrationPref = Ext.encode(data);
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
						else {
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
								if (args.objPref && args.objPref.gridCols) {
									gridModel = {
										columnModel : args.objPref.gridCols
									};
								}
								objGroupView.reconfigureGrid(gridModel);
							}
							else {
								window.location.reload();
							}
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
								if (objGroupView) {
									objGroupView.reconfigureGrid(null);
								}
							}
							else {
								window.location.reload();
							}
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

						if (!Ext.isEmpty(objBillerRegistrationPref)) {
							objPrefData = Ext.decode(objBillerRegistrationPref);
							objGeneralSetting = objPrefData && objPrefData.d.preferences
									&& objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
							objGridSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting
									: null;
							/**
							 * This default column setting can be taken from preferences/gridsets/user defined( js file)
							 */
							objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: (BILLER_REGISTRATION_COLUMNS || '[]');

							if (!Ext.isEmpty(objGeneralSetting)) {
								objGroupByVal = objGeneralSetting.defaultGroupByCode;
								objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
							}
							if (!Ext.isEmpty(objGridSetting)) {
								objGridSizeVal = objGridSetting.defaultGridSize;
								objRowPerPageVal = objGridSetting.defaultRowPerPage;
							}
						}
						else
							if (Ext.isEmpty(objBillerRegistrationPref)) {
								objColumnSetting = BILLER_REGISTRATION_COLUMNS;
							}

						objData['groupByData'] = objGroupView ? objGroupView.cfgGroupByData : [];
						objData['filterUrl'] = 'services/userfilterslist/billerRegistration.json';
						objData['rowPerPage'] = _AvailableGridSize;
						objData['groupByVal'] = objGroupByVal;
						objData['filterVal'] = objDefaultFilterVal;
						objData['gridSizeVal'] = objGridSizeVal;
						objData['rowPerPageVal'] = objRowPerPageVal;
						subGroupInfo = objGroupView.getSubGroupInfo() || {};
						strTitle = (strInvokedFrom === 'GRID' ? getLabel('columnSettings', 'Column Settings') + ' : '
								+ (subGroupInfo.groupDescription || '') : getLabel('Settings', 'Settings'));
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
					handleClearLocalPrefernces : function() {
						var me = this, args = {}, strLocalPrefPageName = me.strPageName + '_TempPref';
						;

						me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null, me.postHandleClearLocalPreference,
								args, me, false);
					},
					postHandleClearLocalPreference : function(data, args, isSuccess) {
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
						else
							if (isSuccess === 'Y') {
								objSaveLocalStoragePref = '';
								me.objLocalData = '';
							}
					},
					handleSaveLocalStorage : function() {
						var me = this, arrSaveData = [], objSaveState = {}, objAdvJson = {}, objGroupView = me.getGroupView(), grid = objGroupView
								.getGrid(), subGroupInfo = null,groupInfo= null;
						if (objGroupView) {
							groupInfo = objGroupView.getGroupInfo();
							subGroupInfo = objGroupView.getSubGroupInfo();
						}
						if (!Ext.isEmpty(me.filterData)) {
							objAdvJson['filterBy'] = me.filterData;
							objSaveState['quickFilterJson'] = objAdvJson;
						}
						objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
						objSaveState['groupTypeCode'] = (groupInfo || {}).groupTypeCode;
						objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
						objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
						objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() : 1;
						objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() : [];

						arrSaveData.push({
							'module' : 'tempPref',
							'jsonPreferences' : objSaveState
						});

						me.saveLocalPref(arrSaveData);
					},
					saveLocalPref : function(objSaveState) {
						var me = this, args = {}, strLocalPrefPageName = me.strPageName + '_TempPref';
						if (!Ext.isEmpty(objSaveState)) {
							args['tempPref'] = objSaveState;
							me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
									me.postHandleSaveLocalPref, args, me, false);
						}
					},
					postHandleSaveLocalPref : function(data, args, isSuccess) {
						var me = this;
						var objLocalPref = {}, objTemp = {}, objTempPref = {}, jsonSaved = {};
						if (isSuccess === 'N') {
							Ext.MessageBox.show({
								title : getLabel('', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
						else {
							if (!Ext.isEmpty(args)) {
								jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences
										: {};
								objTemp['tempPref'] = jsonSaved;
								objTempPref['preferences'] = objTemp;
								objLocalPref['d'] = objTempPref;

								me.updateObjLocalPref(objLocalPref);
							}
						}
					},
					updateObjLocalPref : function(data) {
						var me = this;
						objSaveLocalStoragePref = Ext.encode(data);
						me.objLocalData = Ext.decode(objSaveLocalStoragePref);
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
						strUrl = 'services/generateBillerRegistrationCenterListReport.'+strExtension;
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
					}
				});