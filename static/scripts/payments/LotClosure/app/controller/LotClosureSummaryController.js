Ext
		.define(
				'GCP.controller.LotClosureSummaryController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'GCP.view.LotClosureGridView',
							'Ext.ux.gcp.DateUtil' ],
					views : [ 'GCP.view.LotClosureFilterView',
							'GCP.view.LotClosureSummaryView',
							'GCP.view.HistoryPopup'],
					refs : [
							{
								ref : 'LotClosureFilterView',
								selector : 'LotClosureSummaryView LotClosureFilterView'
							},
							{
								ref : 'LotClosureGridView',
								selector : 'LotClosureGridView[itemId="LotClosureBatchGrid"]'
							},
							{
								ref : 'summaryView',
								selector : 'LotClosureSummaryView'
							},
							{
								ref : 'actionResult',
								selector : 'LotClosureActionResult'
							},
							{
								ref : 'LotClosureGroupView',
								selector : 'LotClosureGridView[itemId="LotClosureBatchGrid"] groupView'
							},							
							{
								ref : 'withHeaderCheckbox',
								selector : 'LotClosureSummaryView LotClosureTitleView  menuitem[itemId="withHeaderId"]'
							} ],
					config : {
						filterData : [],
						strFilterApplied : 'Q',
						sellerFilterVal : strSellerId,
						clientFilterVal : 'all',
						clientFilterDesc : 'All',
						dispBankCodeFilterVal : 'all',
						dispBankCodeFilterDesc : 'All',
						productCodeFilterVal : 'all',
						productCodeFilterDesc : 'All',
						sysBranchCodeFilterVal : 'all',
						sysBranchCodeFilterDesc : 'All',
						clientBranchCodeFilterVal : 'all',
						clientBranchCodeFilterDesc : 'All',
						strExportUrl : 'services/lotClosureGridList/getDynamicReport.{0}',
						strDefaultMask : '0000000000000000',
						intMaskSize : 5,
						preferenceHandler : null,
						strPrefPageKey : 'LotClosure',
						objPrefJson : null,
						strPageName : 'LotClosure',
						selectedTabInfo : 'all',
						dateHandler : null,
						reportGridOrder : null,
						dateFilterVal : '1',
						dateFilterLabel : getLabel('today', 'Today')
					},
					init : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
						me
								.control({
									'LotClosureGridView[itemId="LotClosureBatchGrid"]' : {
										'render' : function(panel) {
											me.handleGridReconfigure();
											//me.toggleSavePrefrenceAction(true);
											me.setDataForFilter(me.filterData);
											me.applyQuickFilter();
										}
									},
									'LotClosureSummaryView LotClosureTitleView' : {
										'performReportAction' : function(btn) {
											me.handleReportAction(btn);
										}
									},
									'LotClosureGridView[itemId="LotClosureBatchGrid"] groupView' : {

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
									'LotClosureSummaryView LotClosureFilterView' : {
										render : function(panel, opts) {
											me.setInfoTooltip();
										}
									},
									'LotClosureFilterView combo[itemId="entitledSellerIdItemId"]' : {
										select : function(combo, record, index) {
											me.sellerFilterVal = combo
													.getValue();
										}
									},
									'LotClosureFilterView AutoCompleter[itemId="clientCode"]' : {
										select : function(combo, record, index) {
											me.clientCodeFilterVal = combo
													.getValue();
											me.clientCodeFilterDesc = combo
													.getRawValue();
										},
										change : function(combo, record, index) {
											me.clientCodeFilterVal = combo
													.getValue();
											me.clientCodeFilterDesc = combo
													.getRawValue();
										}
									},
									'LotClosureFilterView AutoCompleter[itemId="dispBankCode"]' : {
										select : function(combo, record, index) {
											me.dispBankCodeFilterVal = combo.getValue();
											me.dispBankCodeFilterDesc = combo.getRawValue();
										},
										change : function(combo, record, index) {
											me.dispBankCodeFilterVal = combo
													.getValue();
											me.dispBankCodeFilterDesc = combo
													.getRawValue();
										}
									},
									'LotClosureFilterView AutoCompleter[itemId="sysBranchCode"]' : {
										select : function(combo, record, index) {
											me.sysBranchCodeFilterVal = combo.getValue();
											me.sysBranchCodeFilterDesc = combo.getRawValue();
										},
										change : function(combo, record, index) {
											me.sysBranchCodeFilterVal = combo.getValue();
											me.sysBranchCodeFilterDesc = combo.getRawValue();
										}
									},
									
									'LotClosureFilterView AutoCompleter[itemId="clientBranchCode"]' : {
										select : function(combo, record, index) {
											me.clientBranchCodeFilterVal = combo.getValue();
											me.clientBranchCodeFilterDesc = combo.getRawValue();
										},
										change : function(combo, record, index) {
											me.clientBranchCodeFilterVal = combo.getValue();
											me.clientBranchCodeFilterDesc = combo.getRawValue();
										}
									},
									
									'LotClosureFilterView AutoCompleter[itemId="productCode"]' : {
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
									'LotClosureSummaryView LotClosureFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.handleGridReconfigure();
										}
									}
								});
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {
						var me = this;
						args = null;
						var data = null;
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo) {
							args = {
								scope : me
							};
							
							 me.selectedTabInfo = subGroupInfo;									
							 me.postHandleDoHandleGroupTabChange( data,args);
						}
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args.scope;
						var objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
						var colModel = null, arrCols = null;
						var objGroupView = me.getLotClosureGroupView();
						var objGridView = me.getLotClosureGridView();
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

					handleGridReconfigure : function() {
						var me = this;
						var gridView = null;
						gridView = me.getLotClosureGridView();
						gridView.reconfigureGroup();
					},
					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this, summaryView = me.getSummaryView(), groupView = me
								.getLotClosureGroupView();
						;
						var strUrl = url;
						var columns = grid.columns;
						Ext.each(columns, function(col) {
							if (col.dataIndex == "status") {
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
                        var objGroupView = me.getLotClosureGroupView();
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
				    else if (item.maskPosition === 1 && blnEnabled) {
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
										record.get('lotNmbr'));
							}
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
					showHistory : function(url, identifier,lotNmbr) {
						Ext.create(
								'GCP.view.HistoryPopup',
								{
									historyUrl : url + '?' + csrfTokenName
											+ '=' + csrfTokenValue,
									identifier : identifier,
									lotNmbr : lotNmbr
								}).show();
										
					},
					handleGroupActions : function(strAction, opts, strActionType, record) {
						var strUrl = Ext.String.format('services/lotClosure/{0}?',strAction);
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
						var groupView = me.getLotClosureGroupView();
						var grid = groupView.down('smartgrid'), objJson = null;
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var records = grid.getSelectedRecords();
							records = (!Ext.isEmpty(records) && Ext
									.isEmpty(record)) ? records : [ record ];
							for (var index = 0; index < records.length; index++) {
				                if ('submit' === strAction || 'accept' === strAction || 'reject' === strAction
				                		|| 'discard' === strAction) {
									objJson = {
										serialNo : grid.getStore().indexOf(records[index]) + 1,
										identifier : records[index].data.identifier,
										recordDesc : " with Lot Number: " + records[index].data.lotNmbr,
										userMessage : remark
									}
									arrayJson.push(objJson);
								}
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
																'LotClosure.error.title',
																'Error'),
														msg : getLabel(
																'LotClosure.error.msg',
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
						var gridView = me.getLotClosureGridView();
						var errorMessage = '';
						if(!Ext.isEmpty(jsonData))
				        {
							var arrErrors = [];
				        	for(var i =0 ; i<jsonData.length;i++ )
				        	{
				        		var arrError = jsonData[i].errors;
				        		if(!Ext.isEmpty(arrError))
				        		{
				        			for(var j = 0 ; j< arrError.length; j++)
						        	{
				        				if(!arrErrors.includes(arrError[j].errorMessage))
				        				{
					        				arrErrors.push(arrError[j].errorMessage);
					        				errorMessage = errorMessage + arrError[j].errorMessage+"<br/>";
							        	}
				        			}
				        		}
				        	}
				        }
						if ('' != errorMessage
								&& null != errorMessage) {
							Ext.Msg.alert({
									title: getLabel('errorTitle', 'Error'),
									cls:'t7-popup',
									bodyPadding : 0,
									width: 300,
									buttons : Ext.MessageBox.OK,
									msg : errorMessage});
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
						//var withHeaderFlag = me.getWithHeaderCheckbox().checked;
						var arrExtension = {
							downloadXls : 'xls'
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
						strUrl = 'services/generateLotClosureReport';
								//+ strExtension;
						strUrl += '?$skip=1';
						me.setDataForFilter();
						strUrl = strUrl + me.getFilterUrl() + '&'
								+ csrfTokenName + '=' + csrfTokenValue
								+ '&$seller=' + strSellerId;

						var groupView = me.getLotClosureGroupView();
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
							strSelect = '&$select=' + colArray.toString();
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
						//form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						//		'txtCSVFlag', withHeaderFlag));
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
						var lotClosureFilterView = me.getLotClosureFilterView();
						var statusFltId = lotClosureFilterView.down('combobox[itemId=status]');
						var statusVal;
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
						if (!Ext.isEmpty(me.clientCodeFilterVal)
								&& me.clientCodeFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'clientCode',
										paramValue1 : encodeURIComponent(me.clientCodeFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.dispBankCodeFilterVal)
								&& me.dispBankCodeFilterVal != 'all')
							{
							jsonArray
									.push({
										paramName : 'dispBankCode',
										paramValue1 : encodeURIComponent(me.dispBankCodeFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						
						if (!Ext.isEmpty(me.sysBranchCodeFilterVal)
								&& me.sysBranchCodeFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'sysBranchCode',
										paramValue1 : encodeURIComponent(me.sysBranchCodeFilterVal.toUpperCase()
												.replace(new RegExp("'", 'g'),
														"\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (!Ext.isEmpty(me.clientBranchCodeFilterVal)
								&& me.clientBranchCodeFilterVal != 'all') {
							jsonArray
									.push({
										paramName : 'accountBranch',
										paramValue1 : encodeURIComponent(me.clientBranchCodeFilterVal.toUpperCase()
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
						if (!Ext.isEmpty(statusFltId)) {
							statusVal = statusFltId.getValue();
							if(statusVal == 'Open'|| statusVal == '0'){
							jsonArray
									.push({
										paramName : 'isAssignmentClosed',
										paramValue1 : 'O',
										operatorValue : 'eq',
										dataType : 'S'
									},
									{
										paramName : 'status',
										paramValue1 : '0',
										operatorValue : 'eq',
										dataType : 'S'
									},
									{
										paramName : 'isSubmitted',
										paramValue1 : 'N',
										operatorValue : 'eq',
										dataType : 'S'
									});
							}
							else if (statusVal == 1 || statusVal == 3) {
								if (statusVal == 1) // Submitted
								{
									statusVal = new Array(0, 1);
									jsonArray.push({
												paramName : 'isSubmitted',
												paramValue1 : 'Y',
												operatorValue : 'eq',
												dataType : 'S'
											});
									strInFlag = true;
								} else // Valid/Authorized
								{
									jsonArray.push({
												paramName : 'validFlag',
												paramValue1 : 'Y',
												operatorValue : 'eq',
												dataType : 'S'
											});
								}
							} 
							else if(statusVal =='7' ){
							jsonArray
									.push(
									{
										paramName : 'status',
										paramValue1 : '7',
										operatorValue : 'eq',
										dataType : 'S'
									},
									{
										paramName : 'isSubmitted',
										paramValue1 : 'N',
										operatorValue : 'eq',
										dataType : 'S'
									});
							}
						}
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
													var clientFilter = ( me.clientCodeFilterDesc || getLabel('all', 'All'));
													var bankName = (me.dispBankCodeFilterDesc || getLabel('all', 'All'));
													var branchName = (me.sysBranchCodeFilterDesc || getLabel('all', 'All'));
													var clientbranchName = (me.clientBranchCodeFilterDesc || getLabel('all', 'All'));
													var productCode = (me.productCodeFilterDesc || getLabel('all', 'All'));
													var	status='';
													var lotClosureFilterView = me.getLotClosureFilterView();
													var lotClosureStatus =lotClosureFilterView.down('combobox[itemId=status]');
													if(!Ext.isEmpty(lotClosureStatus) && !Ext.isEmpty(lotClosureStatus.getValue())) {
														status = lotClosureStatus.getRawValue();
													} else {
														status = getLabel('open', 'Open');								
													}
													tip
															.update(getLabel(
																	'lbl.lotClosure.seller',
																	'Financial Institution')
																	+ ' : '
																	+ sellerFilter
																	+ '<br/>'

																	+ getLabel(
																			'lbl.lotClosure.CompanyName',
																			'Company Name')
																	+ ' : '
																	+ clientFilter
																	+ '<br/>'
																	+ getLabel('lbl.lotClosure.bankName',
																			'Bank Name')
																	+ ' : '
																	+ bankName
																	+ '<br/>'
																	+ getLabel(
																			'lbl.lotClosure.sysBranchCode',
																	'System Branch')
																	+ ' : '
																	+ branchName
																	+ '<br/>'
																	+ getLabel(
																			'lbl.lotClosure.clientBranchCode',
																	'Client Linked Branch')
																	+ ' : '
																	+ clientbranchName
																	+ '<br/>'
																	+ getLabel(
																			'lbl.lotClosure.productCode',
																			'Product')
																	+ ' : '
																	+ productCode
																	+ '<br/>'
																	+ getLabel(
																			'lbl.lotClosure.status',
																			'Status')
																	+ ' : '
																	+ status
																	);
												}
											}
										});
					},
					applyQuickFilter : function() {
						var me = this;
						var gridView = me.getLotClosureGridView();
						me.strFilterApplied = 'Q';
						gridView.refreshGroupView();
					}				

				/*----------Filter functions ends............*/
				});
