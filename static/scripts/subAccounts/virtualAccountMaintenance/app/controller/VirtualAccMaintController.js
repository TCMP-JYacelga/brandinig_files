Ext
		.define(
				'GCP.controller.VirtualAccMaintController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'Ext.ux.gcp.PageSettingPopUp' ],
					views : [ 'GCP.view.VirtualAccMaintFilterView', 'GCP.view.VirtualAccMaintSummaryView' ],
					refs : [ {
						ref : 'groupView',
						selector : 'virtualAccMaintenanceSummaryView groupView'
					}, {
						ref : 'grid',
						selector : 'virtualAccMaintenanceSummaryView groupView smartgrid'
					}, {
						ref : 'filterView',
						selector : 'virtualAccMaintenanceSummaryView groupView filterView'
					}, {
						ref : 'vaCategoryAuto',
						selector : 'virtualAccMaintenanceFilterView combo[itemId="vaCategoryAuto"]'

					}, {
						ref : 'virtualAccMaintenanceSummaryView',
						selector : 'virtualAccMaintenanceSummaryView'
					} ],
					config : {
						strPageName : 'virtualAccountSummary',
						pageSettingPopup : null,
						isCompanySelected : false,
						preferenceHandler : null,
						strDefaultMask : '000000000000000000',
						dateHandler : null,
						selectedFilterClient : '',
						filterClientAccountNo : null,
						filterClientAccountNoDesc : null,
						filterIssuanceNoFrom : null,
						filterIssuanceNoFromDesc : null,
						filterIssuanceNoTo : null,
						filterIssuanceNoToDesc : null,
						filterVACategory : null,
						filterVACategoryDesc : null,
						filterVirtualAccountNo : null,
						filterVirtualAccountNoDesc : null,
						userStatusPrefCode : '',
						userStatusPrefDesc : '',
						firstLoad : false,
						objLocalData : null,
						reportGridOrder : null
					},
					init : function() {
						var me = this;
						me.firstLoad = true;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						if (objSaveLocalStoragePref) {
							me.objLocalData = Ext.decode(objSaveLocalStoragePref);
							objQuickPref = me.objLocalData && me.objLocalData.d.preferences
									&& me.objLocalData.d.preferences.tempPref
									&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson
									: {};

							me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];

						}
						$(document).on('performPageSettings', function(event) {
							me.showPageSettingPopup('PAGE');
						});
						$(document).on('performReportAction', function(event, actionName) {
							me.downloadReport(actionName);
						});

						me.control({
							'virtualAccMaintenanceSummaryView groupView' : {
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
									if (objVirtualAccountPref || objSaveLocalStoragePref) {
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
							'virtualAccMaintenanceFilterView combo[itemId="clientCombo"]' : {
								select : function(combo, record) {
									me.selectedFilterClient = combo.getValue();
									me.selectedFilterClientDesc = combo.getDisplayValue();
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
										if (strEntityType == 0 || clientCount > 1) {
											combo.setValue(combo.getStore().getAt(0));
										}

									}

								}
							},
							'virtualAccMaintenanceFilterView AutoCompleter[itemId="clientAuto"]' : {
								select : function(combo, record) {
									me.selectedFilterClient = combo.getValue();
									me.selectedFilterClientDesc = combo.getDisplayValue();
									me.handleClientChangeInQuickFilter();
									me.isCompanySelected = true;
									strClient = me.selectedFilterClient;
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

							'virtualAccMaintenanceFilterView AutoCompleter[itemId="clientAccountAuto"]' : {
								select : function(combo, record) {
									me.filterClientAccountNo = combo.getValue();
									me.filterClientAccountNoDesc = combo.getRawValue();
									me.isClientAccountNoSelected = true;
									me.updateFilterparams();
									me.setDataForFilter();
									me.applyFilter();
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
											me.filterClientAccountNo = "";
											me.filterClientAccountNoDesc = "";
											me.updateFilterparams();
											me.setDataForFilter();
											me.applyFilter();
											me.isClientAccountNoSelected = true;
										}
									}
									else {
										me.isCFFPackageSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isClientAccountNoSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isClientAccountNoSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.filterClientAccountNo = combo.getRawValue();
										me.filterClientAccountNoDesc = combo.getRawValue();
										me.updateFilterparams();
										me.setDataForFilter();
										me.applyFilter();
										me.isClientAccountNoSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterClientAccountNo)) {
										combo.setValue(me.filterClientAccountNoDesc);
									}
								}
							},

							'virtualAccMaintenanceFilterView AutoCompleter[itemId="issuanceNoFromAuto"]' : {
								select : function(combo, record) {
									me.filterIssuanceNoFrom = combo.getValue();
									me.filterIssuanceNoFromDesc = combo.getRawValue();
									me.isIssuanceNoFromSelected = true;
									me.updateFilterparams();
									me.setDataForFilter();
									me.applyFilter();
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
											me.filterIssuanceNoFrom = "";
											me.filterIssuanceNoFromDesc = "";
											me.updateFilterparams();
											me.setDataForFilter();
											me.applyFilter();
											me.isIssuanceNoFromSelected = true;
										}
									}
									else {
										me.isIssuanceNoFromSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isIssuanceNoFromSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isIssuanceNoFromSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.filterIssuanceNoFrom = combo.getRawValue();
										me.filterIssuanceNoFromDesc = combo.getRawValue();
										me.updateFilterparams();
										me.setDataForFilter();
										me.applyFilter();
										me.isIssuanceNoFromSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterIssuanceNoFrom)) {
										combo.setValue(me.filterIssuanceNoFromDesc);
									}
								}
							},

							'virtualAccMaintenanceFilterView AutoCompleter[itemId="issuanceNoToAuto"]' : {
								select : function(combo, record) {
									me.filterIssuanceNoTo = combo.getValue();
									me.filterIssuanceNoToDesc = combo.getRawValue();
									me.isIssuanceNoToSelected = true;
									me.updateFilterparams();
									me.setDataForFilter();
									me.applyFilter();
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
											me.filterIssuanceNoTo = "";
											me.filterIssuanceNoToDesc = "";
											me.updateFilterparams();
											me.setDataForFilter();
											me.applyFilter();
											me.isIssuanceNoToSelected = true;
										}
									}
									else {
										me.isIssuanceNoToSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isIssuanceNoToSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isIssuanceNoToSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.filterIssuanceNoTo = combo.getRawValue();
										me.filterIssuanceNoToDesc = combo.getRawValue();
										me.updateFilterparams();
										me.setDataForFilter();
										me.applyFilter();
										me.isIssuanceNoToSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterIssuanceNoTo)) {
										combo.setValue(me.filterIssuanceNoToDesc);
									}
								}
							},

							'virtualAccMaintenanceFilterView combo[itemId="vaCategoryAuto"]' : {
								select : function(combo, record) {
									me.filterVACategory = combo.getValue();
									me.filterVACategoryDesc = combo.getRawValue();
									me.isVACategorySelected = true;
									me.setDataForFilter();
									me.applyFilter();
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
											me.filterVACategory = "";
											me.filterVACategoryDesc = "";
											me.setDataForFilter();
											me.applyFilter();
											me.isVACategorySelected = true;
										}
									}
									else {
										me.isVACategorySelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isVACategorySelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isVACategorySelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.filterVACategory = combo.getRawValue();
										me.filterVACategoryDesc = combo.getRawValue();
										me.setDataForFilter();
										me.applyFilter();
										me.isVACategorySelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterVACategory)) {
										combo.setValue(me.filterVACategoryDesc);
									}
								}
							},

							'virtualAccMaintenanceFilterView AutoCompleter[itemId="virtualAccountNoAuto"]' : {
								select : function(combo, record) {
									me.filterVirtualAccountNo = combo.getValue();
									me.filterVirtualAccountNoDesc = combo.getRawValue();
									me.isVirtualAccNoSelected = true;
									me.setDataForFilter();
									me.applyFilter();
								},
								change : function(combo, record, oldVal) {
									if (Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
										if (!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g, "") !== "") {
											me.filterVirtualAccountNo = "";
											me.filterVirtualAccountNoDesc = "";
											me.setDataForFilter();
											me.applyFilter();
											me.isVirtualAccNoSelected = true;
										}
									}
									else {
										me.isVirtualAccNoSelected = false;
									}
								},
								keyup : function(combo, e, eOpts) {
									me.isVirtualAccNoSelected = false;
								},
								blur : function(combo, The, eOpts) {
									if (me.isVirtualAccNoSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.filterVirtualAccountNo = combo.getRawValue();
										me.filterVirtualAccountNoDesc = combo.getRawValue();
										// me.setDataForFilter();
										// me.applyFilter();
										me.isVirtualAccNoSelected = true;
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.filterVirtualAccountNo)) {
										combo.setValue(me.filterVirtualAccountNoDesc);
									}
								}
							},

							'virtualAccMaintenanceFilterView  combo[itemId="statusCombo"]' : {
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
							}
						});
						$(document).on('handleClientChangeInQuickFilter', function(event) {
							me.handleClientChangeInQuickFilter();
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
						var clientAccountNoAuto = me.getFilterView().down('AutoCompleter[itemId="clientAccountAuto"]');
						clientAccountNoAuto.setValue("");
						var issuanceNoFromAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoFromAuto"]');
						issuanceNoFromAuto.setValue("");
						issuanceNoFromAuto.cfgExtraParams = [];
						var issuanceNoToAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoToAuto"]');
						issuanceNoToAuto.setValue("");
						issuanceNoToAuto.cfgExtraParams = [];
						var vaCategoryAuto = me.getFilterView().down('combo[itemId="vaCategoryAuto"]');
						vaCategoryAuto.setValue("");
						var virtualAccountNoAuto = me.getFilterView().down('AutoCompleter[itemId="virtualAccountNoAuto"]');
						virtualAccountNoAuto.setValue("");
						var statusFltId = me.getFilterView().down('combo[itemId=statusCombo]');
						statusFltId.reset();
						me.userStatusPrefCode = 'all';
						statusFltId.selectAllValues();
						me.setDataForFilter();
						me.refreshData();
					},
					handleClientChangeInQuickFilter : function() {
						var me = this;
						if(clientCount > 1 || strEntityType === 0)
						{
							me.clientCode = me.selectedFilterClient;
							if ('all' !== me.selectedFilterClient) {
							me.clientDesc = me.selectedFilterClientDesc;
							}
						}
						var vaCategoryURL = "";
						if (!isEmpty(me.selectedFilterClient) && me.selectedFilterClient != 'all')
						{
							vaCategoryURL = 'services/userseek/vaCategory.json?$filtercode1=' + me.selectedFilterClient;
						}
						else
						{
							vaCategoryURL = 'services/userseek/vaCategory.json?$filtercode1=' + strClient;
						}
						var vaCategoryStore = Ext.create('Ext.data.Store', {
							autoLoad : true,
							fields : [ 'CODE', 'DESCR' ],
							proxy : {
								type : 'ajax',
								url : vaCategoryURL,

								reader : {
									type : 'json',
									root : 'd.preferences'
								},
								listeners : {
									load : function(store, records, successful, eOpts) {

									}
								}
							}
						});

						me.getVaCategoryAuto().bindStore(vaCategoryStore);

						me.updateFilterparams();
						me.setDataForFilter();
						me.applyFilter();
					},
					updateFilterparams : function() {
						var me = this;
						var clientAccountNoAuto = me.getFilterView().down('AutoCompleter[itemId="clientAccountAuto"]');
						clientAccountNoAuto.cfgExtraParams = [];
						var issuanceNoFromAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoFromAuto"]');
						issuanceNoFromAuto.cfgExtraParams = [];
						var issuanceNoToAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoToAuto"]');
						issuanceNoToAuto.cfgExtraParams = [];
						var virtualAccountNoAuto = me.getFilterView().down('AutoCompleter[itemId="virtualAccountNoAuto"]');
						virtualAccountNoAuto.cfgExtraParams = [];
						if (me.clientCode && 'ALL' !== me.clientCode && 'all' !== me.clientCode) {
							var clientFilter = {
								key : '$filtercode1',
								value : me.clientCode
							};
							clientAccountNoAuto.cfgExtraParams.push(clientFilter);
							issuanceNoFromAuto.cfgExtraParams.push(clientFilter);
							issuanceNoToAuto.cfgExtraParams.push(clientFilter);
							virtualAccountNoAuto.cfgExtraParams.push(clientFilter);
						}
						else
							if ('1' === strEntityType && Ext.isEmpty(me.clientCode) && !Ext.isEmpty(strClient)) {
								var clientFilter1 = {
									key : '$filtercode1',
									value : strClient
								};
								clientAccountNoAuto.cfgExtraParams.push(clientFilter1);
								issuanceNoFromAuto.cfgExtraParams.push(clientFilter1);
								issuanceNoToAuto.cfgExtraParams.push(clientFilter1);
								virtualAccountNoAuto.cfgExtraParams.push(clientFilter1);
							}

						if (!Ext.isEmpty(me.filterClientAccountNo)) {
							var clientAccountNoFilter = {
								key : '$filtercode2',
								value : me.filterClientAccountNo
							};
							virtualAccountNoAuto.cfgExtraParams.push(clientAccountNoFilter);
							issuanceNoFromAuto.cfgExtraParams.push(clientAccountNoFilter);
							issuanceNoToAuto.cfgExtraParams.push(clientAccountNoFilter);
						}
						
						if (!Ext.isEmpty(me.filterIssuanceNoFrom)) {
							var issuanceNoFromFilter = {
								key : '$filtercode3',
								value : me.filterIssuanceNoFrom
							};
							issuanceNoToAuto.cfgExtraParams.push(issuanceNoFromFilter);
						}
						
						if (!Ext.isEmpty(me.filterIssuanceNoTo)) {
							var issuanceNoToFilter = {
								key : '$filtercode3',
								value : me.filterIssuanceNoTo
							};
							issuanceNoFromAuto.cfgExtraParams.push(issuanceNoToFilter);
						}

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

								if (!Ext.isEmpty(recHistory) && !Ext.isEmpty(recHistory.__deferred.uri)) {
									me.showHistory(true, Ext.htmlDecode(record.get('clientId')),
											record.get('history').__deferred.uri, record.get('identifier'));
								}
							}
							else
								if (actionName === 'btnEdit') {
									strUrl = 'editVirtualAccMaintenance.srvc';
									me.submitForm(strUrl, record, rowIndex);
								}
								else
									if (actionName === 'btnView') {
										strUrl = 'viewVirtualAccMaintenance.srvc';
										me.submitForm(strUrl, record, rowIndex);
									}
					},
					showHistory : function(isClient, clientName, url, id) {
						var historyPopup = Ext.create('GCP.view.HistoryPopup', {
							isClient : isClient,
							historyUrl : url,
							identifier : id,
							clientName : clientName
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
						var objSummaryView = me.getVirtualAccMaintenanceSummaryView(), objPref = null, gridModel = null, showPager = true, heightOption = null;
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
							if (col.dataIndex == 'requestStateDesc') {
								col.sortable = false;
							}
						});
						me.reportGridOrder = strUrl;
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

									if (data[i].paramName === 'clientCode') {
										me.clientCode = data[i].paramValue1;
										me.clientDesc = data[i].displayValue1;
										selectedFilterClient = me.clientCode;
										selectedFilterClientDesc = me.clientDesc;
									}
									else
										if (data[i].paramName === 'clientAccountNo') {
											me.filterClientAccountNoDesc = data[i].displayValue1;
											me.filterClientAccountNo = data[i].paramValue1;
										}
										else
											if (data[i].paramName === 'issuanceNoFrom') {
												me.filterIssuanceNoFromDesc = data[i].displayValue1;
												me.filterIssuanceNoFrom = data[i].paramValue1;
											}
											else
												if (data[i].paramName === 'issuanceNoTo') {
													me.filterIssuanceNoToDesc = data[i].displayValue1;
													me.filterIssuanceNoTo = data[i].paramValue1;
												}
												else
													if (data[i].paramName === 'vaCategory') {
														me.filterVACategoryDesc = data[i].displayValue1;
														me.filterVACategory = data[i].paramValue1;
													}
													else
														if (data[i].paramName === 'virtualAccountNo') {
															me.filterVirtualAccountNoDesc = data[i].displayValue1;
															me.filterVirtualAccountNo = data[i].paramValue1;
														}
														else
															if (data[i].paramName === 'requestState') {
																me.userStatusPrefCode = data[i].paramValue1;
																me.userStatusPrefDesc = data[i].displayValue1;
															}
								}
							}
						}
					},
					doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
						var me = this;
						var strUrl = Ext.String.format('services/VirtualAccMaintenance/{0}', strAction);
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
						var me = this, clientParamName = null, clientNameOperator = null, clientCodeVal = null, jsonArray = [], statusFilterValArray = [], statusFilterDiscArray = [], statusFilterVal = me.userStatusPrefCode, statusFilterDisc = me.userStatusPrefDesc;
						if (!Ext.isEmpty(me.clientDesc) && !Ext.isEmpty(me.clientCode) && 'all' !== me.clientCode) {
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
									&& (!Ext.isEmpty(me.clientCode) && null !== me.clientCode && 'ALL' !== me.clientCode && 'all' !== me.clientCode)) {
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
						if (!Ext.isEmpty(me.filterClientAccountNo)) {
							jsonArray.push({
								paramName : 'clientAccountNo',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.filterClientAccountNo.toUpperCase().replace(
										new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('clientAccountNo', 'Client Credit Account Number'),
								displayType : 5,
								displayValue1 : me.filterClientAccountNoDesc
							});
						}
						

						if (!Ext.isEmpty(me.filterIssuanceNoFrom)) {
							jsonArray.push({
								paramName : 'issuanceNoFrom',
								operatorValue : 'ge',
								paramValue1 : encodeURIComponent(me.filterIssuanceNoFrom.toUpperCase().replace(
										new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('issuanceNoFrom', 'Issuance Number From'),
								displayType : 5,
								displayValue1 : me.filterIssuanceNoFromDesc
							});
						}
						if (!Ext.isEmpty(me.filterIssuanceNoTo)) {
							jsonArray.push({
								paramName : 'issuanceNoTo',
								operatorValue : 'le',
								paramValue1 : encodeURIComponent(me.filterIssuanceNoTo.toUpperCase().replace(new RegExp("'", 'g'),
										"\''")),
								dataType : 'S',
								paramFieldLable : getLabel('issuanceNoTo', 'Issuance Number To'),
								displayType : 5,
								displayValue1 : me.filterIssuanceNoToDesc
							});
						}
						 
						if (!Ext.isEmpty(me.filterVACategory)) {
							jsonArray.push({
								paramName : 'vaCategory',
								operatorValue : 'eq',
								paramValue1 : me.filterVACategory,
								dataType : 'S',
								paramFieldLable : getLabel('vaCategory', 'Virtual Account Category'),
								displayType : 5,
								displayValue1 : me.filterVACategoryDesc
							});
						}
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
						if (!Ext.isEmpty(me.filterVirtualAccountNo)) {
							jsonArray.push({
								paramName : 'virtualAccountNo',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.filterVirtualAccountNo.toUpperCase().replace(
										new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('virtualAccountNo', 'Virtual Account Number'),
								displayType : 5,
								displayValue1 : me.filterVirtualAccountNoDesc
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
						if (!Ext.isEmpty(me.filterVirtualAccountNo)) {
							strQuickFilterUrl += '&$reference=' + me.filterVirtualAccountNo;
						}

						return strQuickFilterUrl;
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
						if (strFieldName === 'clientCode') {
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
							if (strFieldName === "clientAccountNo") {
								var clientAccountNoAuto = me.getFilterView().down('AutoCompleter[itemId="clientAccountAuto"]');
								clientAccountNoAuto.setValue("");
								me.filterClientAccountNo = '';
								me.filterClientAccountNoDesc = '';
							}
							else
								if (strFieldName === "issuanceNoFrom") {
									var issuanceNoFromAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoFromAuto"]');
									issuanceNoFromAuto.setValue("");
									me.filterIssuanceNoFrom = '';
									me.filterIssuanceNoFromDesc = '';
									me.getFilterView().down('AutoCompleter[itemId="issuanceNoToAuto"]').cfgExtraParams = [];
								}
								else
									if (strFieldName === "issuanceNoTo") {
										var issuanceNoToAuto = me.getFilterView().down('AutoCompleter[itemId="issuanceNoToAuto"]');
										issuanceNoToAuto.setValue("");
										me.filterIssuanceNoTo = '';
										me.filterIssuanceNoToDesc = '';
										me.getFilterView().down('AutoCompleter[itemId="issuanceNoFromAuto"]').cfgExtraParams = [];
									}
									else
										if (strFieldName === "vaCategory") {
											var vaCategoryAuto = me.getFilterView().down('combo[itemId="vaCategoryAuto"]');
											vaCategoryAuto.setValue("");
											me.filterVACategory = '';
											me.filterVACategoryDesc = '';
										}
										else
											if (strFieldName === "virtualAccountNo") {
												var virtualAccountNoAuto = me.getFilterView().down(
														'AutoCompleter[itemId="virtualAccountNoAuto"]');
												virtualAccountNoAuto.setValue("");
												me.filterVirtualAccountNo = '';
												me.filterVirtualAccountNoDesc = '';
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
						objVirtualAccountPref = Ext.encode(data);
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

						if (!Ext.isEmpty(objVirtualAccountPref)) {
							objPrefData = Ext.decode(objVirtualAccountPref);
							objGeneralSetting = objPrefData && objPrefData.d.preferences
									&& objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
							objGridSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting
									: null;
							/**
							 * This default column setting can be taken from preferences/gridsets/user defined( js file)
							 */
							objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: (VIRTUAL_ACCOUNT_COLUMNS || '[]');

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
							if (Ext.isEmpty(objVirtualAccountPref)) {
								objColumnSetting = VIRTUAL_ACCOUNT_COLUMNS;
							}

						objData['groupByData'] = objGroupView ? objGroupView.cfgGroupByData : [];
						objData['filterUrl'] = 'services/userfilterslist/virtualAccount.json';
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
								.getGrid(), subGroupInfo = null;
						if (objGroupView) {
							subGroupInfo = objGroupView.getSubGroupInfo();
						}
						if (!Ext.isEmpty(me.filterData)) {
							objAdvJson['filterBy'] = me.filterData;
							objSaveState['quickFilterJson'] = objAdvJson;
						}
						objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
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

						strExtension = arrExtension[actionName];
						strUrl = 'services/generateVirtualAccMaintenanceCenterListReport.' + strExtension;
						strUrl += '?$skip=1';
						var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo() || {}, groupInfo = groupView
								.getGroupInfo()
								|| '{}';
						var filterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
						var filterData = me.filterData;
						var columnFilterUrl = me.getFilterUrl(filterData);

						if (!Ext.isEmpty(filterUrl)) {
							strUrl += filterUrl;
							if (!Ext.isEmpty(columnFilterUrl)) {
								strUrl += ' and ' + columnFilterUrl;
							}
						}
						else {
							if (!Ext.isEmpty(columnFilterUrl)) {
								strUrl += "&$filter=" + columnFilterUrl;
							}
						}

						// strUrl += this.generateFilterUrl();
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
							if (colArray.length > 0) {
								strSelect = '&$select=[' + colArray.toString() + ']';
							}
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

						form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent', currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag));
						for (var i = 0; i < arrSelectedrecordsId.length; i++) {
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier', arrSelectedrecordsId[i]));
						}
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					}

				});