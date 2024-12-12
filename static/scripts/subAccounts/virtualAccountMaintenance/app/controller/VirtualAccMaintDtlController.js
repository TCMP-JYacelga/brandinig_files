Ext
		.define(
				'GCP.controller.VirtualAccMaintDtlController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'Ext.ux.gcp.PageSettingPopUp' ],
					views : [ 'GCP.view.VirtualAccMaintDtlFilterView', 'GCP.view.VirtualAccMaintDtlView' ],
					refs : [ {
						ref : 'groupView',
						selector : 'virtualAccMaintenanceDtlView groupView'
					}, {
						ref : 'grid',
						selector : 'virtualAccMaintenanceDtlView groupView smartgrid'
					}, {
						ref : 'filterView',
						selector : 'virtualAccMaintenanceDtlView groupView filterView'
					}, {
						ref : 'virtualAccMaintenanceDtlView',
						selector : 'virtualAccMaintenanceDtlView'
					} ],
					config : {
						strPageName : 'virtualAccMaintenanceDtlView',
						preferenceHandler : null,
						strDefaultMask : '000000000000000000',
						userStatusPrefCode : '',
						userStatusPrefDesc : '',
						selectedFilterClient : '',
						isAccountSelected : false,
						firstLoad : false,
						objLocalData : null,
						isPayerCodeSelected : false,
						isVirtualAccountSelected : false
					},
					init : function() {
						var me = this;
						me.firstLoad = true;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');

						$(document).on('performPageSettings', function(event) {
							me.showPageSettingPopup('PAGE');
						});

						me.control({
							'virtualAccMaintenanceDtlView groupView' : {
								'groupTabChange' : me.doHandleGroupTabChange,
								'gridRender' : me.doHandleLoadGridData,
								'gridPageChange' : me.doHandleLoadGridData,
								'gridSortChange' : me.doHandleLoadGridData,
								'gridPageSizeChange' : me.doHandleLoadGridData,
								'gridColumnFilterChange' : me.doHandleLoadGridData,
								'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
								/*'gridSettingClick' : function() {
									me.showPageSettingPopup('GRID');
								},*/
								'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record, event) {
									me.doHandleRowIconClick(actionName, grid, record, rowIndex, columnIndex, event);
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
									me.setDataForFilter();
									me.applyFilter();
								},
								afterrender : function() {

								}
							},

							'filterView button[itemId="clearSettingsButton"]' : {
								click : function() {
									me.resetAllFilters();
								}
							},
							'virtualAccMaintenanceDtlFilterView AutoCompleter[itemId="payerCodeAuto"]' : {
								blur : function(combo, The, eOpts) {
									if (me.isPayerCodeSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.payerCodeName = combo.getValue();
										me.payerCodeDesc = combo.getRawValue();
										isPayerCodeSelected = true;
										me.setDataForFilter();
										me.applyFilter();
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.payerCodeName)) {
										combo.setValue(me.payerCodeDesc);
									}
								}
							},
							'virtualAccMaintenanceDtlFilterView AutoCompleter[itemId="virtualAccountAuto"]' : {
								blur : function(combo, The, eOpts) {
									if (me.isVirtualAccountSelected == false && !Ext.isEmpty(combo.getRawValue())) {
										me.virtualAccountName = combo.getValue();
										me.virtualAccountDesc = combo.getRawValue();
										isVirtualAccountSelected = true;
										me.setDataForFilter();
										me.applyFilter();
									}
								},
								boxready : function(combo, width, height, eOpts) {
									if (!Ext.isEmpty(me.virtualAccountName)) {
										combo.setValue(me.virtualAccountDesc);
									}
								}
							},
							'virtualAccMaintenanceDtlFilterView  combo[itemId="statusCombo"]' : {
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

						var statusFltId = me.getFilterView().down('combo[itemId=statusCombo]');
						statusFltId.reset();
						me.userStatusPrefCode = 'all';
						statusFltId.selectAllValues();

						var payerCodeAuto = me.getFilterView().down("combo[itemId='payerCodeAuto']");
						payerCodeAuto.setValue('');
						me.payerCodeName = '';
						me.payerCodeDesc = '';

						var virtualAccountAuto = me.getFilterView().down("combo[itemId='virtualAccountAuto']");
						virtualAccountAuto.setValue('');
						me.virtualAccountName = '';
						me.virtualAccountAutoDesc = '';

						me.setDataForFilter();
						me.refreshData();
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
									userMessage : $("#viewState").val(),
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
											if(!Ext.isEmpty(jsonData[0].successValue)){
												$('#viewState').val(jsonData[0].successValue);
											}
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

					doHandleRowIconClick : function(actionName, grid, record, rowIndex, columnIndex, event) {
						var me = this;
						if (actionName === 'enable' || actionName === 'disable') {
							me.doHandleGroupActions(actionName, grid, [ record ], 'rowAction');
						}
						else
							if (actionName === 'btnEdit') {
								editVADetail(record, 'EDIT');
								handleBatchDetailGridRowAction(grid, rowIndex, columnIndex, actionName, event, record);
							}
							else
								if (actionName === 'btnView') {
									editVADetail(record, 'VIEW');
									handleBatchDetailGridRowAction(grid, rowIndex, columnIndex, actionName, event, record);
								}
					},
					showHistory : function(url) {
						var historyPopup = Ext.create('GCP.view.HistoryPopup', {
							historyUrl : url
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
						var objSummaryView = me.getVirtualAccMaintenanceDtlView(), objPref = null, gridModel = null, showPager = true, heightOption = null;
						var colModel = null, arrCols = null;

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

						objGroupView.reconfigureGrid(gridModel);
					},

					doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter,
							filterData) {
						var me = this;
						var objGroupView = me.getGroupView();

						me.firstLoad = false;

						var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter) + '&$filter='
								+ me.getFilterUrl(subGroupInfo, groupInfo);
						strUrl = strUrl + '&$parentId=' + encodeURIComponent($('#viewState').val()) + '&$MODE=' + mode;
						var columns = grid.columns;
						Ext.each(columns, function(col) {
							if (col.dataIndex == 'requestStateDesc') {
								col.sortable = false;
							}
						});
						var arrInfo = generateFilterArray(me.filterData);
						me.getFilterView().updateFilterInfo(arrInfo);
						grid.loadGridData(strUrl, null, null, false);
						objGroupView.handleGroupActionsVisibility(me.strDefaultMask);

						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if (Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1);
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							me.handleGridRowClick(record, grid, columnType,rowIndex);
						});
					},

					handleGridRowClick : function(record, grid, columnType,rowIndex) {
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
								me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record,rowIndex);
							}
						}
					},

					updateConfig : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');

					},
					doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
						var me = this;
						var strUrl;
						if ("enable" === strAction) strUrl = 'services/VirtualAccMaintenance/enableVADtl';
						if ("disable" === strAction) strUrl = 'services/VirtualAccMaintenance/disableVADtl';
						me.handleGroupActions(strUrl, '', grid, arrSelectedRecords, strActionType, strAction);
					},

					setDataForFilter : function() {
						var me = this;
						me.filterData = me.getFilterQueryJson();
					},
					getFilterQueryJson : function() {
						var me = this, statusFilterValArray = [], statusFilterDiscArray = [], statusFilterVal = me.userStatusPrefCode, statusFilterDisc = me.userStatusPrefDesc, jsonArray = [];
						if (!Ext.isEmpty(me.virtualAccountName)) {
							jsonArray.push({
								paramName : 'virtualAccNo',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.virtualAccountName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('virtualAccNo', 'Virtaul Account Number'),
								displayType : 5,
								displayValue1 : me.virtualAccountName
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
								paramName : 'status',
								paramValue1 : statusFilterValArray,
								operatorValue : 'statusFilterOp',
								dataType : 'S',
								paramFieldLable : getLabel('status', 'Status'),
								displayType : 5,
								displayValue1 : statusFilterDiscArray
							});
						}
						if (!Ext.isEmpty(me.payerCodeDesc)) {
							jsonArray.push({
								paramName : 'partyDesc',
								operatorValue : 'lk',
								paramValue1 : encodeURIComponent(me.payerCodeDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								dataType : 'S',
								paramFieldLable : getLabel('partyCode', 'Party Code'),
								displayType : 5,
								displayValue1 : me.payerCodeDesc
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
						if (strFieldName === 'partyDesc') {
							var payerCodeAuto = me.getFilterView().down('combo[itemId="payerCodeAuto"]');
							payerCodeAuto.setValue('');
							me.payerCodeName = '';
							me.payerCodeDesc = '';
						}
						else
							if (strFieldName === 'virtualAccNo') {
								var virtualAccount = me.getFilterView().down('combo[itemId="virtualAccountAuto"]');
								virtualAccount.setValue('');
								me.virtualAccountName = '';
								me.virtualAccountDesc = '';
							}
							else
								if (strFieldName === 'status') {
									var statusFltId = me.getFilterView().down('combo[itemId=statusCombo]');
									statusFltId.reset();
									me.userStatusPrefCode = 'all';
									statusFltId.selectAllValues();
									me.setDataForFilter();
								}
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
											strTemp = strTemp + "(status eq '" + objArray[i] + "')";

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
					}

				});