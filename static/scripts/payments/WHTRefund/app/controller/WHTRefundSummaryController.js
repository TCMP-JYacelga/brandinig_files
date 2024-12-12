Ext
		.define(
				'GCP.controller.WHTRefundSummaryController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'GCP.view.WHTRefundGridView',
							'Ext.ux.gcp.DateUtil' ],
					views : [ 'GCP.view.WHTRefundFilterView',
							'GCP.view.WHTRefundSummaryView',
							'GCP.view.HistoryPopup',
							'Ext.ux.gcp.PreferencesHandler' ],
					refs : [
							{
								ref : 'WHTRefundFilterView',
								selector : 'WHTRefundSummaryView WHTRefundFilterView'
							},
							{
								ref : 'WHTRefundGridView',
								selector : 'WHTRefundGridView[itemId="WHTRefundBatchGrid"]'
							},
							{
								ref : 'summaryView',
								selector : 'WHTRefundSummaryView'
							},
							{
								ref : 'actionResult',
								selector : 'WHTRefundActionResult'
							},
							{
								ref : 'btnClearPreferences',
								selector : 'WHTRefundSummaryView WHTRefundFilterView button[itemId="btnClearPreferences"]'
							},
							{
								ref : 'btnSavePreferences',
								selector : 'WHTRefundSummaryView WHTRefundFilterView button[itemId="btnSavePreferences"]'
							},
							{
								ref : 'WHTRefundGroupView',
								selector : 'WHTRefundGridView[itemId="WHTRefundBatchGrid"] groupView'
							},
							{
								ref : 'fromDateLabel',
								selector : 'WHTRefundSummaryView WHTRefundFilterView label[itemId="dateFilterFrom"]'
							},
							{
								ref : 'toDateLabel',
								selector : 'WHTRefundSummaryView WHTRefundFilterView label[itemId="dateFilterTo"]'
							},
							{
								ref : 'dateLabel',
								selector : 'WHTRefundSummaryView WHTRefundFilterView label[itemId="dateLabel"]'
							},
							{
								ref : 'chargePostingDate',
								selector : 'WHTRefundSummaryView WHTRefundFilterView button[itemId="chargePostingDate"]'
							},
							{
								ref : 'fromChargePostingDate',
								selector : 'WHTRefundSummaryView WHTRefundFilterView datefield[itemId="fromDate"]'
							},
							{
								ref : 'toChargePostingDate',
								selector : 'WHTRefundSummaryView WHTRefundFilterView datefield[itemId="toDate"]'
							},
							{
								ref : 'dateRangeComponent',
								selector : 'WHTRefundSummaryView WHTRefundFilterView container[itemId="dateRangeComponent"]'
							},
							{
								ref : 'chargeReceiptNumber',
								selector : 'WHTRefundSummaryView WHTRefundFilterView textfield[itemId="chargeReceiptNo"]'
							},
							{
								ref : 'withHeaderCheckbox',
								selector : 'WHTRefundSummaryView WHTRefundTitleView  menuitem[itemId="withHeaderId"]'
							} ],
					config : {
						filterData : [],
						strFilterApplied : 'Q',
						sellerFilterVal : strSellerId,
						clientFilterVal : 'all',
						clientFilterDesc : 'All',
						sendingAccNoFilterVal : 'all',
						sendingAccNoFilterDesc : 'All',
						chargeReceiptNoFilterVal : 'All',
						productCodeFilterVal : 'all',
						productCodeFilterDesc : 'All',
						strExportUrl : 'services/whtRefundGridList/getDynamicReport.{0}',
						strGetModulePrefUrl : 'services/userpreferences/WHTRefund/{0}.json',
						strCommonPrefUrl : 'services/userpreferences/WHTRefund.json',
						strDefaultMask : '0000000000000000',
						intMaskSize : 5,
						preferenceHandler : null,
						strPrefPageKey : 'WHTRefund',
						objPrefJson : null,
						strPageName : 'WHTRefund',
						selectedTabInfo : 'all',
						dateHandler : null,
						reportGridOrder : null,
						dateFilterVal : '1',
						dateFilterLabel : getLabel('today', 'Today')
					},
					init : function() {
						var me = this;
						me.createPrefInstance();
						me.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
						me
								.control({
									'WHTRefundGridView[itemId="WHTRefundBatchGrid"]' : {
										'render' : function(panel) {
											me.handleGridReconfigure();
											me.toggleSavePrefrenceAction(true);
											me.setDataForFilter(me.filterData);
											me.applyQuickFilter();
											if (objWHTRefundPref) {
												var objJsonData = Ext
														.decode(objWHTRefundPref);
												objGroupByPref = objJsonData.d.preferences;
												if (!Ext
														.isEmpty(objGroupByPref)) {
													me
															.toggleSavePrefrenceAction(false);
													me
															.toggleClearPrefrenceAction(true);
												}
											}
										}
									},
									'WHTRefundSummaryView WHTRefundTitleView' : {
										'performReportAction' : function(btn) {
											me.handleReportAction(btn);
										}
									},
									'WHTRefundGridView[itemId="WHTRefundBatchGrid"] groupView' : {

										'groupTabChange' : function(groupInfo,
												subGroupInfo, tabPanel,
												newCard, oldCard) {
											me.doHandleGroupTabChange(
													groupInfo, subGroupInfo,
													tabPanel, newCard, oldCard);
										},
										'gridRender' : function(groupInfo,
												subGroupInfo, objGrid,
												strDataUrl, pageSize,
												intNewPgNo, intOldPgNo,
												jsonSorter) {
											me.handleLoadGridData(objGrid,
													strDataUrl, pageSize, 1, 1,
													null);

										},
										'gridPageChange' : function(groupInfo,
												subGroupInfo, objGrid,
												strDataUrl, pageSize,
												intNewPgNo, intOldPgNo,
												jsonSorter) {
											me.handleLoadGridData(objGrid,
													strDataUrl, pageSize,
													intNewPgNo, intOldPgNo,
													jsonSorter);
										},
										'gridSortChange' : function(groupInfo,
												subGroupInfo, objGrid,
												strDataUrl, pageSize,
												intNewPgNo, intOldPgNo,
												jsonSorter) {
											me.handleLoadGridData(objGrid,
													strDataUrl, pageSize,
													intNewPgNo, intOldPgNo,
													jsonSorter);
										},
										'gridRowSelectionChange' : function(
												groupInfo, subGroupInfo,
												objGrid, objRecord,
												intRecordIndex,
												arrSelectedRecords, jsonData) {
											me.doHandleGridRowSelectionChange(
													objGrid, objRecord,
													intRecordIndex,
													arrSelectedRecords,
													jsonData);
										},
										'gridRowActionClick' : function(grid,
												rowIndex, columnIndex,
												strAction, record, event) {
											me.doHandleRowIconClick(grid,
													rowIndex, columnIndex,
													strAction, event, record)
										},
										'groupActionClick' : function(
												actionName, isGroupAction,
												maskPosition, grid,
												arrSelectedRecords) {
											me.handleGroupActions(actionName,
													null, 'groupAction', null);
										}
									},
									'WHTRefundSummaryView WHTRefundFilterView' : {
										render : function(panel, opts) {
											me.setInfoTooltip();
										},
										expand : function(panel) {
											me.toggleSavePrefrenceAction(true);
										},
										collapse : function(panel) {
											me.toggleSavePrefrenceAction(true);
										},
										'dateChange' : function(btn, opts) {
											me.dateFilterVal = btn.btnValue;
											me.dateFilterLabel = btn.text;
											me.handleDateChange(btn.btnValue);
										}
									},
									'WHTRefundFilterView combo[itemId="entitledSellerIdItemId"]' : {
										select : function(combo, record, index) {
											me.sellerFilterVal = combo
													.getValue();
										}
									},
									'WHTRefundFilterView AutoCompleter[itemId="clientFilter"]' : {
										select : function(combo, record, index) {
											me.clientFilterVal = combo
													.getValue();
											me.clientFilterDesc = combo
													.getRawValue();
										},
										change : function(combo, record, index) {
											me.clientFilterVal = combo
													.getValue();
											me.clientFilterDesc = combo
													.getRawValue();
										}
									},
									'WHTRefundFilterView AutoCompleter[itemId="sendingAccNo"]' : {
										select : function(combo, record, index) {
											me.sendingAccNoFilterVal = combo
													.getValue();
											me.sendingAccNoFilterDesc = combo
													.getRawValue();
										},
										change : function(combo, record, index) {
											me.sendingAccNoFilterVal = combo
													.getValue();
											me.sendingAccNoFilterDesc = combo
													.getRawValue();
										}
									},
									
									'WHTRefundFilterView AutoCompleter[itemId="productCode"]' : {
										select : function(combo, record, index) {
											me.productCodeFilterVal = combo
													.getValue();
											me.productCodeFilterDesc = combo
													.getRawValue();
										},
										change : function(combo, record, index) {
											me.productCodeFilterVal = combo
													.getValue();
											me.productCodeFilterDesc = combo
													.getRawValue();
										}
									},

									'WHTRefundFilterView textfield[itemId="chargeReceiptNo"]' : {
										change : function( textfiel, newValue, oldValue, eOpts ) {
											me.chargeReceiptNoFilterVal = textfiel.getValue();
											
										}
									},
									
									'WHTRefundFilterView toolbar[itemId="dateToolBar"]' : {
										afterrender : function(tbar, opts) {
											me.updateDateFilterView();
										}
									},
									'WHTRefundSummaryView WHTRefundFilterView button[itemId="btnSavePreferences"]' : {
										click : function(btn, opts) {
											//me.toggleSavePrefrenceAction(false);
											me.handleSavePreferences();
										}
									},
									'WHTRefundSummaryView WHTRefundFilterView button[itemId="btnClearPreferences"]' : {
										click : function(btn, opts) {
											me.toggleSavePrefrenceAction(false);
											me.handleClearPreferences();
										}
									},
									'WHTRefundSummaryView WHTRefundFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.handleGridReconfigure();
											me.toggleSavePrefrenceAction(true);

										}
									}
								});
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {
						var me = this;
						var strModule = '', strUrl = null, args = null;
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo) {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							me.selectedTabInfo = subGroupInfo;
							strUrl = Ext.String.format(me.strGetModulePrefUrl,
									strModule);
							me.getSavedPreferences(strUrl,
									me.postHandleDoHandleGroupTabChange, args);
						}
					},
					getSavedPreferences : function(strUrl, fnCallBack, args) {
						var me = this;
						var data = null;
						Ext.Ajax.request({
							url : strUrl,
							method : 'GET',
							success : function(response) {
								var data = null;
								if (response && response.responseText){
									data = Ext.decode(response.responseText);
									me.toggleSavePrefrenceAction(true);
									me.toggleClearPrefrenceAction(true);
								}
								else{
									me.toggleSavePrefrenceAction(true);
									me.toggleClearPrefrenceAction(false);
								}	
								Ext.Function.bind(fnCallBack, me);
								if (fnCallBack)
									fnCallBack(data, args);
							},
							failure : function() {
							}

						});
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args.scope;
						var objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
						var colModel = null, arrCols = null;
						var objGroupView = me.getWHTRefundGroupView();
						var objGridView = me.getWHTRefundGridView();
						if (data && data.preference) {
							objPref = Ext.decode(data.preference);
							arrCols = objPref.gridCols || null;
							intPgSize = objPref.pgSize || _GridSizeMaster;
							showPager = objPref.gridSetting
									&& !Ext
											.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager
									: true;
							heightOption = objPref.gridSetting
									&& !Ext
											.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption
									: null;
							colModel = objGridView.getGroupColumns(arrCols);
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
						objGroupView.reconfigureGrid(gridModel);
					},
					createPrefInstance : function() {
						var me = this;
						me.preferenceHandler = Ext
								.create('Ext.ux.gcp.PreferencesHandler');
					},

					handleGridReconfigure : function() {
						var me = this;
						var gridView = null;
						gridView = me.getWHTRefundGridView();
						gridView.reconfigureGroup();
					},
					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this, summaryView = me.getSummaryView(), groupView = me
								.getWHTRefundGroupView();
						;
						var strUrl = url;
						var columns = grid.columns;
						Ext.each(columns, function(col) {
							if (col.dataIndex == "requestStateDesc") {
								col.sortable = false;
							}
						});
						me.setDataForFilter(me.objPrefJson);
						me.objPrefJson = null;
						// TODO : Service should be same
						strUrl = grid.generateUrl(strUrl, pgSize, newPgNo,
								oldPgNo, sorter);
						strUrl = strUrl + me.getFilterUrl();
						strUrl += "&" + csrfTokenName + "=" + csrfTokenValue;
						if (Ext.isEmpty(summaryView.loadMask))
							summaryView.setLoading(true);
						if (groupView)
							groupView
									.handleGroupActionsVisibility(me.strDefaultMask);
						me.reportGridOrder = strUrl;
						grid.loadGridData(strUrl, me.postHandleLoadGridData,
								null, false, me);
					},
					postHandleLoadGridData : function() {
						var me = this, summaryView = me.getSummaryView();
						if (summaryView) {
							summaryView.setLoading(false);
						}
					},
					doHandleGridRowSelectionChange : function(grid, record,
							recordIndex, selectedRecords, jsonData) {
						var me = this, buttonMask = me.strDefaultMask;
						var maskArray = new Array(), actionMask = '', objData = null;
						var isSameUser = true;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
						}
						maskArray.push(buttonMask);
						for (var index = 0; index < selectedRecords.length; index++) {
							objData = selectedRecords[index];
							maskArray.push(objData.get('__metadata').__rightsMap);
							if (objData.raw.makerId === USER) {
                                isSameUser = false;
                            }
						}
						actionMask = doAndOperation(maskArray, me.intMaskSize);
						me.enableDisableGroupActions(actionMask, isSameUser );
					},
					enableDisableGroupActions : function(actionMask, isSameUser) {
                        var me = this;
                        var objGroupView = me.getWHTRefundGroupView();
                        var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
                        var blnEnabled = false, strBitMapKey = null, arrItems = null;
                        if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
                            arrItems = actionBar.items.items;
                            Ext.each(arrItems, function(item) {
                                strBitMapKey = parseInt(item.maskPosition,10) - 1;
                                if (strBitMapKey) {
                                    blnEnabled = isActionEnabled(actionMask, strBitMapKey);

                                    if ((item.maskPosition === 4 && blnEnabled)) {
                                        blnEnabled = blnEnabled && isSameUser;
                                    }
                                    else if (item.maskPosition === 5 && blnEnabled) {
                                            blnEnabled = blnEnabled && isSameUser;
                                        }
                                    item.setDisabled(!blnEnabled);
                                }
                            });
                        }
                    },
					doHandleRowIconClick : function(tableView, rowIndex,
							columnIndex, actionName, event, record) {
						var me = this;
						if (actionName === 'btnHistory') {
							var recHistory = record.get('history');
							if (!Ext.isEmpty(recHistory)
									&& !Ext.isEmpty(recHistory.__deferred.uri)) {
								me.showHistory(
										record.get('history').__deferred.uri,
										record.get('identifier'),
										record.get('chargeReceiptNo'));
							}
						} else if (actionName === 'btnView') {
							me.viewWHTRefundPopup(record);
						} else {
							me.handleGroupActions(actionName, null,
									'rowAction', record);
						}
					},

					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},
					showHistory : function(url, identifier,chargeReceiptNo) {
						Ext.create(
								'GCP.view.HistoryPopup',
								{
									historyUrl : url + '?' + csrfTokenName
											+ '=' + csrfTokenValue,
									identifier : identifier,
									chargeReceiptNo : chargeReceiptNo
								}).show();
					},
					viewWHTRefundPopup : function(record){
						$('#WHTRefundView').dialog(
								{
									autoOpen : false,
									maxHeight : 620,
									width : 690,
									modal : true,
									dialogClass : 'ft-dialog',
									title : 'View WHT Refund',
									open : function() {
										$('#WHTRefundView').removeClass('hidden');
										
										$('#whtClientCode').val(record.get('clientDescription'));
										$('#whtProductCode').val(record.get('productDesc'));
										$('#whtSendingAccnt').val(record.get('customerAccountNo'));
										$('#whtChargePostingDate').val(record.get('chargePostingDate'));
										$('#whtChargeReceiptNo').val(record.get('chargeReceiptNo'));
										$('#whtChargeAmt').val(record.get('chargeAmount'));
										$('#whtRate').val(record.get('whtRate'));
										$('#whtAmount').val(record.get('whtAmount'));
										$('#whtRefundDate').val(record.get('refundDate'));
										$('#whtStatus').val(record.get('requestStateDesc'));
										
										$('#WHTRefundView').dialog('option', 'position', 'center');
									},
									close : function() {
									}
								});
						$('#WHTRefundView').dialog('open');
						$('#WHTRefundView').dialog('option', 'position', 'center');
					},
					handleGroupActions : function(strAction, opts, strActionType, record) {
						var strUrl = Ext.String.format('services/whtRefund/{0}?',strAction);
						strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
						if (strAction === 'reject') {
							this.showRejectVerifyPopUp(strAction, strUrl, null,record,strActionType);
						} else {
							this.preHandleGroupActions(strUrl, '',record, strActionType, strAction);  
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
                                        me.preHandleGroupActions(strUrl, text,arrSelectedRecords,strActionType,strAction);
                                    }
                                }
                            }
                        });
                        msgbox.textArea.enforceMaxLength = true;
                        msgbox.textArea.inputEl.set({
                            maxLength : 255
                        });
                    },
					preHandleGroupActions : function(strUrl, remark, record,
							strActionType, strAction) {
						var me = this;
						var groupView = me.getWHTRefundGroupView();
						var grid = groupView.down('smartgrid'), objJson = null;
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var records = grid.getSelectedRecords();
							records = (!Ext.isEmpty(records) && Ext
									.isEmpty(record)) ? records : [ record ];
    						
    							for (var index = 0; index < records.length; index++) {
                    				if ('submit' === strAction) {
                    					objJson = records[index].data;
                    				} else {
                    					objJson = {
                    						serialNo : grid.getStore().indexOf(records[index]) + 1,
                    						identifier : records[index].data.identifier,
                    						userMessage : remark
                    					}
                    				}
                    
                    				arrayJson.push(objJson);
                    			}
                    			
    							if (arrayJson && ('submit'!= strAction)) {
    								arrayJson = arrayJson.sort(function(valA, valB) {
    											return valA.serialNo - valB.serialNo
    										});
    							}
							Ext.Ajax
									.request({
										url : strUrl,
										method : 'POST',
										jsonData : Ext.encode(arrayJson),
										success : function(response) {
											var jsonRes = Ext.JSON
													.decode(response.responseText);
											me.postHandleGroupAction(jsonRes,
													strActionType, strAction,
													record);
										},
										failure : function() {
											Ext.MessageBox
													.show({
														title : getLabel(
																'WHTRefund.error.title',
																'Error'),
														msg : getLabel(
																'WHTRefund.error.msg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
						}

					},

					postHandleGroupAction : function(jsonData, strActionType,
							strAction, records) {
						var me = this;
						var msg = '', strIsProductCutOff = 'N', errCode = '', actionMsg = [], actionData = [], record = '';
						var gridView = me.getWHTRefundGridView();
						var grid = gridView.getGrid();
						var strActionSuccess = getLabel(
								'instrumentActionPopUpSuccessMsg',
								'Action Successful');
						var warnLimit = getLabel('warningLimit',
								'Warning limit exceeded!');

						if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
								&& !Ext.isEmpty(jsonData.d.instrumentActions))
							actionData = jsonData.d.instrumentActions;
						Ext
								.each(
										actionData,
										function(result) {
											record = grid.store
													.getAt(parseInt(result.serialNo,10) - 1);
											msg = '';
											strIsProductCutOff = 'N';
											Ext
													.each(
															result.errors,
															function(error) {
																msg = msg
																		+ error.code
																		+ ' : '
																		+ error.errorMessage
																		+ '<br/>';
																errCode = error.code;
																if (!Ext
																		.isEmpty(errCode)
																		&& errCode
																				.substr(
																						0,
																						4) === 'WARN')
																	strIsProductCutOff = 'Y';
															});

											actionMsg
													.push({
														success : result.success,
														actualSerailNo : result.serialNo,
														isProductCutOff : strIsProductCutOff,
														actionTaken : 'N',
														reference : Ext
																.isEmpty(record) ? ''
																: record
																		.get('pirNmbr'),
														actionMessage : result.success === 'Y' ? strActionSuccess
																: (result.success === 'W02' ? warnLimit
																		: msg)
													});

										});
						if (!Ext.isEmpty(actionMsg)) {
							var actionResult = me.getActionResult();
							if (actionResult)
								actionResult.addRecords(actionMsg);
							actionResult.show();
						}

						gridView.refreshGroupView();
					},
					getFilterUrl : function() {
						var me = this;
						var strQuickFilterUrl = '', strUrl = '', isFilterApplied = false;
						strQuickFilterUrl = me
								.generateUrlWithQuickFilterParams(me);
						if (!Ext.isEmpty(strQuickFilterUrl)) {
							strUrl = strQuickFilterUrl;
							isFilterApplied = true;
						}

						var groupFilter = me.selectedTabInfo;
						groupFilter = groupFilter['groupQuery'];
						if (!Ext.isEmpty(groupFilter)) {
							strUrl = strUrl + ' and ' + groupFilter;
						}
						return strUrl;
					},
					generateUrlWithQuickFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '&$filter=';
						var strTemp = '';

						for (var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ filterData[index].paramValue1
											+ '\'' + ' and ' + 'date\''
											+ filterData[index].paramValue2
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ filterData[index].paramValue1
											+ '\'' + ' and ' + '\''
											+ filterData[index].paramValue2
											+ '\'';
								}
								break;
							case 'in':
								var arrId = filterData[index].paramValue1;
								if (0 != arrId.length) {
									strTemp = strTemp + '(';
									for (var count = 0; count < arrId.length; count++) {
										strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ' + '\'' + arrId[count]
												+ '\'';
										if (count != arrId.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;
							case 'eq':
							case 'lk':
								isFilterApplied = true;
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ filterData[index].paramValue1
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ filterData[index].paramValue1
											+ '\'';
								}
								break;
							default:
								// Default opertator is eq
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ filterData[index].paramValue1
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ filterData[index].paramValue1
											+ '\'';
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
					handleReportAction : function(btn, opts) {
						var me = this;
						me.downloadReport(btn.itemId);
					},
					downloadReport : function(actionName) {
						var me = this;
						var withHeaderFlag = me.getWithHeaderCheckbox().checked;
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
						var viscols;
						var col = null;
						var visColsStr = "";
						var colMap = new Object();
						var colArray = new Array();
						var temp = new Array();
						var counter = 0;

						strExtension = arrExtension[actionName];
						strUrl = 'services/generateWHTRefundReport.'
								+ strExtension;
						strUrl += '?$skip=1';
						me.setDataForFilter();
						strUrl = strUrl + me.getFilterUrl() + '&'
								+ csrfTokenName + '=' + csrfTokenValue
								+ '&$seller=' + strSellerId;

						var groupView = me.getWHTRefundGroupView();
						var grid = groupView.getGrid();
						arrColumn = grid.getAllVisibleColumns();

						// cnt counter startes with 2 as 0th and 1st column are
						// action columns. (not GRID columns)
						for (var cnt = 1; cnt < grid.columns.length; cnt++) {
							if (grid.columns[cnt].hidden == false) {
								temp[counter++] = grid.columns[cnt];
							}
						}
						viscols = temp;
						for (var j = 0; j < viscols.length; j++) {
							col = viscols[j];
							if (col.dataIndex
									&& arrReportSortColumn[col.dataIndex]) {
								if (colMap[arrReportSortColumn[col.dataIndex]]) {
								} else {
									colMap[arrReportSortColumn[col.dataIndex]] = 1;
									colArray
											.push(arrReportSortColumn[col.dataIndex]);
								}
							}
						}
						if (colMap != null) {

							visColsStr = visColsStr + colArray.toString();
							strSelect = '&$select=[' + colArray.toString()
									+ ']';
						}

						strUrl = strUrl + strSelect;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, csrfTokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'txtCurrent', currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'txtCSVFlag', withHeaderFlag));
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},
					/** ************* filter ********** */
					setDataForFilter : function() {
						this.filterData = this.getQuickFilterQueryJson();

					},
					getQuickFilterQueryJson : function() {
						var me = this;
						var jsonArray = [];

						
						if (!Ext.isEmpty(me.sellerFilterVal)) {
							jsonArray
									.push({
										paramName : 'sellercode',
										paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.clientFilterVal)
								&& me.clientFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'ClientDescription',
										paramValue1 : encodeURIComponent(me.clientFilterDesc.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.sendingAccNoFilterVal)
								&& me.sendingAccNoFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'sendingAccNo',
										paramValue1 : encodeURIComponent(me.sendingAccNoFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.chargeReceiptNoFilterVal)
								&& me.chargeReceiptNoFilterVal != 'All') {
							jsonArray
									.push({
										paramName : 'chargeReceiptNo',
										paramValue1 : encodeURIComponent(me.chargeReceiptNoFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.productCodeFilterVal)
								&& me.productCodeFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'productCode',
										paramValue1 : encodeURIComponent(me.productCodeFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}

						var frmDate = me.getFromChargePostingDate().getValue();
						var toDate = me.getToChargePostingDate().getValue();

						if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
							var dtParams = me.getDateParam('7');
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
						var index = me.dateFilterVal;
						var objDateParams = me.getDateParam(index);

						jsonArray
								.push({
									paramName : me.getChargePostingDate().filterParamName,
									paramValue1 : objDateParams.fieldValue1,
									paramValue2 : objDateParams.fieldValue2,
									operatorValue : objDateParams.operator,
									dataType : 'D'
								});

						return jsonArray;
					},

					setInfoTooltip : function() {
						var me = this;
						Ext
								.create(
										'Ext.tip.ToolTip',
										{
											target : 'imgFilterInfoStdView',
											listeners : {
												// Change content dynamically
												// depending on which
												// element
												// triggered the show.
												beforeshow : function(tip) {
													var sellerFilter = (strSellerId || getLabel('all', 'All'));
													var clientFilter = ( me.clientFilterDesc || getLabel('all', 'All'));
													var sendingAccNo = (me.sendingAccNoFilterDesc || getLabel('all', 'All'));
													var chargeReceiptNo = (me.chargeReceiptNoFilterVal || getLabel('all', 'All'));
													var productCode = (me.productCodeFilterDesc || getLabel('all', 'All'));
													var chargePostingDate = me.getFromDateLabel().text+me.getToDateLabel().text;
													tip
															.update(getLabel(
																	'lbl.WHT.seller',
																	'Financial Institution')
																	+ ' : '
																	+ sellerFilter
																	+ '<br/>'

																	+ getLabel(
																			'lbl.WHT.CompanyName',
																			'Company Name')
																	+ ':'
																	+ clientFilter
																	+ '<br/>'
																	+ getLabel(
																			'lms.WHT.ChargePostingDate',
																	'Charge Posting Date')
																	+ ':'
																	+ chargePostingDate
																	+ '<br/>'
																	+ getLabel(
																			'lms.WHT.SendingAccountNo',
																			'Sending Account')
																	+ ':'
																	+ sendingAccNo
																	+ '<br/>'
																	+ getLabel(
																			'lms.WHT.ProductCode',
																			'Product Code')
																	+ ':'
																	+ productCode
																	+ '<br/>'
																	+ getLabel(
																			'lms.WHT.ChargeReceipt',
																			'Charge Receipt ')
																	+ ':'
																	+ chargeReceiptNo
																	);
												}
											}
										});
					},
					applyQuickFilter : function() {
						var me = this;
						var gridView = me.getWHTRefundGridView();
						me.strFilterApplied = 'Q';
						gridView.refreshGroupView();
					},

					// ** Preference Handling Save/Clear **

					handleClearPreferences : function() {
						var me = this;
						me.toggleSavePrefrenceAction(false);
						var arrPref = me.getPreferencesToSave(false);
						var strUrl = me.strCommonPrefUrl;

						if (arrPref) {
							Ext.Ajax
									.request({
										url : strUrl + "?$clear=true",
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
												title = getLabel(
														'SaveFilterPopupTitle',
														'Message');
												strMsg = responseData.d.preferences.error.errorMessage;
												imgIcon = Ext.MessageBox.ERROR;
												Ext.MessageBox
														.show({
															title : title,
															msg : strMsg,
															width : 200,
															buttons : Ext.MessageBox.OK,
															cls : 't7-popup',
															icon : imgIcon
														});

											} else {
												// me.toggleSavePrefrenceAction(true);
												Ext.MessageBox
														.show({
															title : title,
															msg : getLabel(
																	'prefClearedMsg',
																	'Preferences Cleared Successfully'),
															buttons : Ext.MessageBox.OK,
															cls : 't7-popup',
															icon : Ext.MessageBox.INFO,
															fn : function(
																	buttonId) {
																if (buttonId === "ok") {
																	window.location
																			.reload();
																}
															}
														});
											}

										},
										failure : function() {
											Ext.MessageBox
													.show({
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
					handleSavePreferences : function() {
						var me = this;
						var groupPref = me.getgroupPref();
						var strUrl = me.strCommonPrefUrl;
						if (groupPref) {
							Ext.Ajax
									.request({
										url : strUrl,
										method : 'POST',
										jsonData : Ext.encode(groupPref),
										success : function(response) {
											var responseData = Ext
													.decode(response.responseText);
											var isSuccess;
											var title, strMsg, imgIcon;
											if (responseData.d.preferences
													&& responseData.d.preferences.success)
												isSuccess = responseData.d.preferences.success;
											if (isSuccess && isSuccess === 'N') {
												title = getLabel(
														'SaveFilterPopupTitle',
														'Message');
												strMsg = responseData.d.preferences.error.errorMessage;
												imgIcon = Ext.MessageBox.ERROR;
												Ext.MessageBox
														.show({
															title : title,
															msg : strMsg,
															width : 200,
															buttons : Ext.MessageBox.OK,
															cls : 't7-popup',
															icon : imgIcon
														});

											} else {
												me
														.toggleClearPrefrenceAction(true);
												Ext.MessageBox
														.show({
															title : title,
															msg : getLabel(
																	'prefSavedMsg',
																	'Preferences Saved Successfully'),
															buttons : Ext.MessageBox.OK,
															cls : 't7-popup',
															icon : Ext.MessageBox.INFO
														});
											}
										},
										failure : function() {
											Ext.MessageBox
													.show({
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
					getgroupPref : function() {
						var me = this;
						var groupPref = [];
						var groupView = me.getWHTRefundGroupView();
						if (groupView) {
							state = groupView.getGroupViewState();
							groupInfo = groupView.getGroupInfo() || '{}';
							subGroupInfo = groupView.getSubGroupInfo() || {};
							if (groupInfo.groupTypeCode
									&& subGroupInfo.groupCode) {
								//if (subGroupInfo.groupCode == 'all') {
									groupPref
											.push({
												"module" : "groupByPref",
												"jsonPreferences" : {
													groupCode : groupInfo.groupTypeCode,
													subGroupCode : subGroupInfo.groupCode
												}
											});
									groupPref.push({
										"module" : subGroupInfo.groupCode,
										"jsonPreferences" : {
											'gridCols' : state.grid.columns,
											'pgSize' : state.grid.pageSize,
											'gridSetting' : state.gridSetting,
											'sortState' : state.grid.sortState
										}
									});
								}
							//}
						}
						return groupPref;
					},
					getPreferencesToSave : function(localSave) {
						var me = this;
						var arrPref = [];
						var arrCols = [];
						var arrColPref = null;
						var data = null;
						var advFilterCode = me.filterCodeValue ? me.filterCodeValue
								: '';
						var WHTRefundGroupView = me.getWHTRefundGroupView();
						var state = WHTRefundGroupView.getGroupViewState();
						var groupInfo = WHTRefundGroupView.getGroupInfo()
								|| '{}';
						var subGroupInfo = WHTRefundGroupView.getSubGroupInfo()
								|| {};
						arrCols = state.grid.columns;
						arrColPref = new Array();
						for (var j = 0; j < arrCols.length; j++) {
							objCol = arrCols[j];
							if (!Ext.isEmpty(objCol)
									&& !Ext.isEmpty(objCol.itemId)
									&& objCol.itemId.startsWith('col_')
									&& !Ext.isEmpty(objCol.xtype)
									&& objCol.colType != 'actioncontent'
									&& !Ext.isEmpty(objCol.dataIndex))
								arrColPref.push({
									colId : objCol.dataIndex,
									colHeader : objCol.text,
									hidden : objCol.hidden,
									colType : objCol.colType,
									width : objCol.width
								});
						}

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
								'sortState' : state.grid.sortState,
								'advFilterCode' : advFilterCode,
								'quickFilter' : data
							}
						});
						return arrPref;
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
						var fromDateLabel = me.getFromDateLabel();
						var toDateLabel = me.getToDateLabel();
						var objDateParams = me.getDateParam(index, null);
						var fromDate = me.getFromChargePostingDate();
						var toDate = me.getToChargePostingDate();

						if (fromDate && objDateParams.fieldValue1)
							fromDate.setValue(objDateParams.fieldValue1);
						if (toDate && objDateParams.fieldValue2)
							toDate.setValue(objDateParams.fieldValue2);

						if (index == '7') {
							var dtEntryDate = new Date(Ext.Date.parse(
									dtApplicationDate,
									strExtApplicationDateFormat));
							me.getDateRangeComponent().show();
							me.getFromDateLabel().hide();
							me.getToDateLabel().hide();
							me.getFromChargePostingDate().setValue(dtEntryDate);
							me.getToChargePostingDate().setValue(dtEntryDate);

						} else {
							me.getDateRangeComponent().hide();
							me.getFromDateLabel().show();
							me.getToDateLabel().show();
						}

						if (!Ext.isEmpty(me.dateFilterLabel)) {
							me.getDateLabel().setText(
									getLabel('lblChargePostingDate',
											'Charge Posting Date')
											+ " (" + me.dateFilterLabel + ")");
						}
						if (index !== '7') {
							vFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
									strExtApplicationDateFormat);
							vToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
									strExtApplicationDateFormat);
							if (index === '1' || index === '2'
									|| index === '12') {
								if (index === '12') {
									// Do nothing for latest
									fromDateLabel.setText('Till' + '  '
											+ vFromDate);
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
						var date = new Date(Ext.Date
								.parse(strAppDate, dtFormat));
						var strSqlDateFormat = 'Y-m-d';
						var fieldValue1 = '', fieldValue2 = '', operator = '';
						var retObj = {};
						var dtJson = {};
						switch (index) {
						case '1':
							// Today
							fieldValue1 = Ext.Date.format(date,
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
							break;
						case '2':
							// Yesterday
							fieldValue1 = Ext.Date.format(objDateHandler
									.getYesterdayDate(date), strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
							break;
						case '3':
							// This Week
							dtJson = objDateHandler.getThisWeekToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '4':
							// Last Week To Date
							dtJson = objDateHandler.getLastWeekToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '5':
							// This Month
							dtJson = objDateHandler.getThisMonthToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '6':
							// Last Month To Date
							dtJson = objDateHandler.getLastMonthToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '7':
							// Date Range
							var frmDate, toDate;
							if (!Ext.isEmpty(dateType)) {
								frmDate = me.getFromChargePostingDate()
										.getValue();
								toDate = me.getToChargePostingDate().getValue();

							} else {
								frmDate = me.getFromChargePostingDate()
										.getValue();
								toDate = me.getToChargePostingDate().getValue();
							}
							frmDate = frmDate || date;
							toDate = toDate || frmDate;

							fieldValue1 = Ext.Date.format(frmDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '8':
							// This Quarter
							dtJson = objDateHandler.getQuarterToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '9':
							// Last Quarter To Date
							dtJson = objDateHandler.getLastQuarterToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '10':
							// This Year
							dtJson = objDateHandler.getYearToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '11':
							// Last Year To Date
							dtJson = objDateHandler.getLastYearToDate(date);
							fieldValue1 = Ext.Date.format(dtJson.fromDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(dtJson.toDate,
									strSqlDateFormat);
							operator = 'bt';
							break;
						case '12':
							// Latest
							fieldValue1 = Ext.Date.format(date,
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'le';
							break;
						}

						retObj.fieldValue1 = fieldValue1;
						retObj.fieldValue2 = fieldValue2;
						retObj.operator = operator;
						return retObj;
					},
					updateDateFilterView : function() {
						var me = this;
						var dtEntryDate = null;
						var defaultToDate = new Date(Ext.Date.parse(
								dtApplicationDate, strExtApplicationDateFormat));
						var defaultFromDate = new Date(Ext.Date.parse(
								dtApplicationDate, strExtApplicationDateFormat));
						if (!Ext.isEmpty(me.dateFilterVal)) {
							me.handleDateChange(me.dateFilterVal);
							if (me.dateFilterVal === '7') {
								if (!Ext.isEmpty(me.dateFilterFromVal)) {
									dtEntryDate = Ext.Date.parse(
											me.dateFilterFromVal, "Y-m-d");
									me.getFromChargePostingDate().setValue(
											dtEntryDate);
								} else {
									me.getFromChargePostingDate().setValue(
											defaultFromDate);
								}
								if (!Ext.isEmpty(me.dateFilterToVal)) {
									dtEntryDate = Ext.Date.parse(
											me.dateFilterToVal, "Y-m-d");
									me.getToChargePostingDate().setValue(
											dtEntryDate);
								} else {
									me.getToChargePostingDate().setValue(
											defaultToDate);
								}
							} else {
								me.getFromChargePostingDate().setValue(
										defaultFromDate);
								me.getToChargePostingDate().setValue(
										defaultToDate);
							}
						}

					}

				// *****End*********

				/*----------Filter functions ends............*/
				});