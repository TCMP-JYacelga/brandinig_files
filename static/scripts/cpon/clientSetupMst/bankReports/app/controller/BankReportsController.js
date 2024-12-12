Ext
		.define(
				'CPON.controller.BankReportsController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'CPON.view.BankReportsGridView',
							'CPON.view.AccountBasedAccReportPopup',
							'CPON.view.FieldBasedAccReportPopup',
							'CPON.view.ReportFilterPopup' ],
					refs : [
							{
								ref : 'bankReportGrid',
								selector : 'bankReportsGridView grid[itemId="bankReportGrid"]'
							},
							{
								ref : 'fieldBasedPopup',
								selector : 'fieldBasedAccReportPopup'
							},
							{
								ref : 'fieldBasedPopupGrid',
								selector : 'fieldBasedAccReportPopup viewFieldDetailsGrid[itemId="viewFieldDetailsGrid"]'
							},
							{
								ref : 'createFieldTab',
								selector : 'fieldBasedAccReportPopup createFieldTab[itemId="createFieldTab"]'
							},
							{
								ref : 'reportTabPanel',
								selector : 'fieldBasedAccReportPopup tabpanel[itemId="reportTabPanel"]'
							},
							{
								ref : 'fieldNameTextField',
								selector : 'fieldBasedAccReportPopup createFieldTab[itemId="createFieldTab"] textfield[itemId="fieldName"]'
							},
							{
								ref : 'fieldDescriptionTextField',
								selector : 'fieldBasedAccReportPopup createFieldTab[itemId="createFieldTab"] textfield[itemId="fieldDescription"]'
							},
							{
								ref : 'assignBtn',
								selector : 'bankReportsGridView toolbar[itemId="gridActionBar"] button[itemId="assign"]'
							},
							{
								ref : 'deLinkBtn',
								selector : 'bankReportsGridView toolbar[itemId="gridActionBar"] button[itemId="unassign"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'bankReportsGridView radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'searchTxnTextInput',
								selector : 'bankReportsGridView textfield[itemId="searchTxnTextField"]'
							},
							{
								ref : 'billingLabel',
								selector : 'bankReportsGridView label[itemId="labelBilling"]'
							},
							{
								ref : 'billingCombo',
								selector : 'bankReportsGridView combobox[itemId="billingProfileId_combo"]'
							},
							{
								ref : 'billingTextField',
								selector : 'bankReportsGridView textfield[itemId="billingProfileId_text"]'
							},
							{
								ref : 'accountBasedAccReportPopup',
								selector : 'accountBasedAccReportPopup'
							},
							{
								ref : 'fieldsLink',
								selector : 'bankReportsGridView component[itemId="fieldsLink"]'
							}
							],
					init : function() {
						var me = this;
						me.control({
									'bankReportsGridView grid[itemId="bankReportGrid"]' : {
										render : function(grid) {
											me.handleLoadGridData(grid,
													grid.store.dataUrl,
													grid.pageSize, 1, 1, null);
										},
										afterrender : function(grid) {
												if (!Ext.isEmpty(grid)) {
													
													grid.store.on('load', function(store, records, options) {
														var fieldCount = 0;
														if (store.data.length == 0) {
															me.getFieldsLink().hide();
														} else {
															for ( var index = 0; index < records.length; index++) {
																if(!Ext.isEmpty(records[index]) && !Ext.isEmpty(records[index].data))
																{
																	var record = records[index].data;
																	var distributionMethod = record.distributionMethod;
																	var recordKeyNo = record.recordKeyNo;
																	
																	if((!Ext.isEmpty(distributionMethod) && distributionMethod == 'F' ) 
																			&& !Ext.isEmpty(recordKeyNo))
																	{
																		fieldCount++;
																		//me.getFieldsLink().show();
																	}
																	/*else
																	{
																		fieldCount--;
																		//me.getFieldsLink().hide();
																	}*/
																}
																
															}
															if(fieldCount > 0)
																me.getFieldsLink().show();
															else
																me.getFieldsLink().hide();
														}
													});
													
													}
										},
										gridPageChange : me.handleLoadGridData,
										gridSortChange : me.handleLoadGridData,
										performRowAction : me.handleRowAction,
										cellclick : me.handleCellClick,
										gridRowSelectionChange : function(grid,
												record, recordIndex, records,
												jsonData) {
											me.enableValidActionsForGrid(grid,
													record, recordIndex,
													records, jsonData);
										}
									},
									'fieldBasedAccReportPopup' : {
										addField : function(btn, opts)
										{
											me.handleAddField(btn)
										}
									},
									'bankReportsGridView toolbar[itemId=gridActionBar]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									},
									'bankReportsGridView radiogroup[itemId="matchCriteria"]' : {
									change : function(btn, opts) {
										me.searchBankReportsGrid();
									}
									},
									'bankReportsGridView textfield[itemId="searchTxnTextField"]' : {
									change : function(btn, opts) {
										me.searchBankReportsGrid();
									}
									},
									'bankReportsGridView' : {
									//render : me.enableDisableFeatures	
									},
									'accountBasedAccReportPopup button[itemId="btnSubmitAcc"]' : {
										assignAccBankRep : function(selection, records, bankReportCode, removeRecords) {
											me.assignAccBankRep(selection, records, bankReportCode, removeRecords);
										}
									}
								});
					},
/*					enableDisableFeatures : function(){
						var me = this;	
						if(billingFlag == '' || null == billingFlag){
							me.getBillingLabel().hide();
							if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW') {
								me.getBillingTextField().hide();
							}else{
								me.getBillingCombo().hide();
							}
						}
					},*/
					searchBankReportsGrid : function() {
					var me = this;
					var searchValue = me.getSearchTxnTextInput().value;
					var anyMatch = me.getMatchCriteria().getValue();
					if ('anyMatch' === anyMatch.searchOnPageOption) {
						anyMatch = false;
					} else {
						anyMatch = true;
					}
			
					var grid = this.getBankReportGrid();
					grid.view.refresh();
			
					// detects html tag
					var tagsRe = /<[^>]*>/gm;
					// DEL ASCII code
					var tagsProtect = '\x0f';
					// detects regexp reserved word
					var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
			
					if (searchValue !== null) {
						searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));
			
						if (!Ext.isEmpty(grid)) {
							var store = grid.store;
			
							store.each(function(record, idx) {
								var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
								while (td) {
									cell = td.down('.x-grid-cell-inner');
									matches = cell.dom.innerHTML.match(tagsRe);
									cellHTML = cell.dom.innerHTML.replace(tagsRe,
											tagsProtect);
			
									if (cellHTML === '&nbsp;') {
										td = td.next();
									} else {
										// populate indexes array, set currentIndex, and
										// replace
										// wrap matched string in a span
										cellHTML = cellHTML.replace(searchRegExp, function(
														m) {
													return '<span class="xn-livesearch-match">'
															+ m + '</span>';
												});
										// restore protected tags
										Ext.each(matches, function(match) {
											cellHTML = cellHTML.replace(tagsProtect, match);
										});
										// update cell html
										cell.dom.innerHTML = cellHTML;
										td = td.next();
									}
								}
							}, me);
						}
						}
					},
					handleGroupActions : function(btn, record) {
						var me = this;
						var grid = this.getBankReportGrid();
						var strUrl;
						var arrayJson = new Array();
						if (btn.actionName === 'assign')
							strUrl = Ext.String
									.format('cpon/clientServiceSetup/assignBankReportClient');
						else
							strUrl = Ext.String
									.format('cpon/clientServiceSetup/unassignBankReport');
						var records = grid.getSelectedRecords();
						records = (!Ext.isEmpty(records) && Ext.isEmpty(record)) ? records
								: [ record ];
						for ( var index = 0; index < records.length; index++) {
							if (!Ext.isEmpty(records[index])) {
								var usrMsgJson = {
									bankReportCode : records[index]
											.get('bankReportCode'),
									recordKeyNo : records[index]
											.get('recordKeyNo'),
									distributionMethod : records[index]
									.get('distributionMethod'),
									relativeId : records[index]
								.get('relativeTypeId')
								};
								arrayJson.push({
									serialNo : grid.getStore().indexOf(
											records[index]) + 1,
									identifier : records[index]
											.get('identifier'),
									userMessage : Ext.encode(usrMsgJson)
								});
							}
						}
						grid.setLoading(true);
						Ext.Ajax.request({
							url : strUrl,
							params : {
								id : parentkey
							},
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(response) {
								// grid.setLoading(false);
								var errorMessage = '';
								if (!Ext.isEmpty(response.responseText)) {
									var data = Ext.decode(response.responseText);
									if (!Ext.isEmpty(data))
									{
										if(!Ext.isEmpty(data.parentIdentifier))
										{
											parentkey = data.parentIdentifier;
											document.getElementById('viewState').value = data.parentIdentifier;
										}
										if(!Ext.isEmpty(data.listActionResult))
										{
									        Ext.each(data.listActionResult[0].errors, function(error, index) {
										         errorMessage = errorMessage + error.errorMessage +"<br/>";
										        });
										}
									}
								}
								if(!Ext.isEmpty(errorMessage))
						        {
						        	Ext.MessageBox.show({
										title : "Error",
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        }
								grid.refreshData();
								grid.getSelectionModel().deselectAll();
							},
							failure : function(response) {
								grid.setLoading(false);
							}
						});
						// this.preHandleGroupActions(strUrl, '',record);

					},
					
					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData)
					{
						var me = this;
						var grid = me.getBankReportGrid();
						var enableActionEnabled = false;
						var disableActionEnabled = false;

						var blnEnabled = false;
						if( ! Ext.isEmpty( grid.getSelectedRecords() ) )
						{
							Ext.each(grid.getSelectedRecords(), function(item)
							{
								if (!item.data.recordKeyNo)
								{
									enableActionEnabled = true;
								}
								else if (item.data.recordKeyNo)
								{
									disableActionEnabled = true;
								}
							});
						}

						var enableBtn = me.getAssignBtn();
						var disableBtn = me.getDeLinkBtn();
						
						enableBtn.setDisabled(true);
						disableBtn.setDisabled(true);
						
						if( disableActionEnabled && enableActionEnabled )
						{
							enableBtn.setDisabled(true);
							disableBtn.setDisabled(true);
						}
						else if( enableActionEnabled )
						{
							enableBtn.setDisabled(false);
						}
						else if( disableActionEnabled )
						{
							disableBtn.setDisabled(blnEnabled);
						}
					},
					
					handleAddField : function(popup) {
						var me = this;
						var strUrl;
						var name = me.getCreateFieldTab().query(
								'textfield[itemId=fieldName]')[0].value;
						var desc = me.getCreateFieldTab().query(
								'textfield[itemId=fieldDescription]')[0].value;
						
						if(popup.getText().indexOf('Save') > -1)
						{
							strUrl = 'cpon/clientServiceSetup/addFieldToBankReports.json';
						}
						else
						{
							strUrl = 'cpon/clientServiceSetup/updateBankReportField.json';
						}
	                	if( !Ext.isEmpty( name ) )
	                	{
	                		
	                		if( name[0] == " " || name[ name.length - 1 ] == " " )
	                		{
								Ext.MessageBox.show(
								{
									title : getLabel( 'filterPopupTitle', 'Error' ),
									msg : getLabel( 'filterPopupMsg', 'Field Name may not contain leading or trailing spaces..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
	                		}
	                		else
	                		{
	    						var title=me.getReportTabPanel().getActiveTab().title;
	    						if(title.localeCompare(getLabel( 'addField', "Add Field" ))==0 ){
	    						if (name && desc) {
	    							var records = {
	    								fieldName : name,
	    								fieldDescription : desc,
	    								bankReportCode : me.getFieldBasedPopup().bankReportCode,
	    								distributionMethod : 'F'
	    							};
	    							var jsonData = {
	    								identifier : parentkey,
	    								userMessage : records
	    							};
	    							Ext.Ajax
	    									.request({
	    										url : strUrl,
	    										method : 'POST',
	    										jsonData : jsonData,
	    										success : function(response) {
	    											var errorMessage = '';
	    											if (!Ext.isEmpty(response.responseText)) {
	    												var data = Ext.decode(response.responseText);
	    												if (!Ext.isEmpty(data))
	    												{
	    													if(!Ext.isEmpty(data.parentIdentifier))
	    													{
	    														parentkey = data.parentIdentifier;
	    														document.getElementById('viewState').value = data.parentIdentifier;
	    													}
	    													if(!Ext.isEmpty(data.listActionResult))
	    													{
	    												        Ext.each(data.listActionResult[0].errors, function(error, index) {
	    													         errorMessage = errorMessage + error.errorMessage +"<br/>";
	    													        });
	    													}
	    												}
	    											}
	    											if(!Ext.isEmpty(errorMessage))
	    									        {
	    									        	Ext.MessageBox.show({
	    													title : "Error",
	    													msg : errorMessage,
	    													buttons : Ext.MessageBox.OK,
	    													cls : 'ux_popup',
	    													icon : Ext.MessageBox.ERROR
	    												});
	    									        }

	    											me.getReportTabPanel()
	    													.setActiveTab(0);
	    											me.getFieldBasedPopupGrid()
	    													.getStore().reload();
	    											me.getFieldDescriptionTextField()
	    													.setValue(null);
	    											me.getFieldNameTextField()
	    													.setValue(null);
	    											me.getBankReportGrid().refreshData();

	    										},
	    										failure : function() {
	    											var errMsg = "";
	    											Ext.MessageBox
	    													.show({
	    														title : getLabel(
	    																'instrumentErrorPopUpTitle',
	    																'Error'),
	    														msg : getLabel(
	    																'instrumentErrorPopUpMsg',
	    																'Error while fetching data..!'),
	    														buttons : Ext.MessageBox.OK,
	    														icon : Ext.MessageBox.ERROR
	    													});
	    										}
	    									});
	    						} else {
	    							Ext.Msg
	    									.alert('Error',
	    											'Field Name and Field Description can not be Empty.');
	    						}
	    						}
	    						else
	    							{
	    							me.getFieldBasedPopup().close();
	    							var grid = me.getBankReportGrid();
	    							grid.refreshData();
	    							}

	                		}
	                	}
	                	else
	                	{
							Ext.Msg
							.alert('Error',
									'Field Name can not be Empty.');
	                	}	
					},
					handleCellClick : function(me, td, cellIndex, record, tr,
							rowIndex, e, eOpts) {
						if (td.className.match('x-grid-cell-col_filterCount')) {
							if (record.data.distributionMethod === 'A') {
								var reportFilterPopup = Ext
										.create(
												'CPON.view.AccountBasedAccReportPopup',
												{
													showCheckBoxColumn : false,
													bankReportCode : record.data.bankReportCode
												});
								var reportName = record.data.bankReportDesc;
								reportFilterPopup
										.query('label[itemId=aReportName]')[0]
										.setText(reportName);
								reportFilterPopup.show();
							} else if (record.data.distributionMethod === 'F') {
								var reportFilterPopup = Ext
										.create(
												'CPON.view.ReportFilterPopup',
												{
													bankReportCode : record.data.bankReportCode
												});
								reportFilterPopup.show();
							}
						}
					},
					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this;
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						strUrl = strUrl + '&id='
								+ encodeURIComponent(parentkey);
						grid.loadGridData(strUrl, me.updateSelection, null,
								false);
					},
					updateSelection : function(grid, responseData, args) {
						var me = this;
						if (!Ext.isEmpty(grid)) {
							var store = grid.getStore();
							var records = store.data;
							if (!Ext.isEmpty(records)) {
								var items = records.items;
								var selectedRecords = new Array();
								// if (!Ext.isEmpty(items)) {
								// for ( var i = 0; i < items.length; i++) {
								// var item = items[i];
								// if (item.data.recordKeyNo) {
								// selectedRecords.push(item);
								// }
								// }
								// }
								if (selectedRecords.length > 0)
									grid.getSelectionModel().select(
											selectedRecords);
							}

							if (viewmode == 'VIEW'
									|| viewmode == "MODIFIEDVIEW") {
								grid.getSelectionModel().setLocked(true);
							}
							clientGridLoaded=true;
							enableDisableGridButtons(false);
						}
					},
					assignAccBankRep : function(selection, records, bankReportCode, removeRecords) {
						var me = this;
						var bankRepGrid = me.getBankReportGrid();
						
						if (selection[0]) {
							var arrayJson = new Array();
							
							for ( var index = 0; index < records.length; index++) {
								var usrMsgJson = {
									bankReportCode : bankReportCode,
									accountNmbr : records[index].data.accountNmbr,
									recordKeyNo : records[index].data.recordKeyNo
								};
								arrayJson.push({
									identifier : records[index].data.identifier,
									userMessage : Ext.encode(usrMsgJson)
								});
							}
							if (arrayJson)
								arrayJson = arrayJson.sort(function(valA, valB) {
									return valA.serialNo - valB.serialNo
								});
							
							bankRepGrid.setLoading(true);
							
							Ext.Ajax.request({
								url : 'cpon/clientServiceSetup/assignBankReportAccount.json',
								params : {id:parentkey, 'removeRecords':removeRecords},
								method : 'POST',
								jsonData : Ext.encode(arrayJson),
								success : function(response) {
									var errorMessage = '';
									if (!Ext.isEmpty(response.responseText)) {
										var data = Ext.decode(response.responseText);
										if (!Ext.isEmpty(data))
										{
											if(!Ext.isEmpty(data.parentIdentifier))
											{
												parentkey = data.parentIdentifier;
												document.getElementById('viewState').value = data.parentIdentifier;
											}
											if(!Ext.isEmpty(data.listActionResult))
											{
										        Ext.each(data.listActionResult[0].errors, function(error, index) {
											         errorMessage = errorMessage + error.errorMessage +"<br/>";
											        });
											}
										}
									}
									if(!Ext.isEmpty(errorMessage))
							        {
							        	Ext.MessageBox.show({
											title : "Error",
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        }
									me.getAccountBasedAccReportPopup().close();
									
									bankRepGrid.refreshData();
									
								},
								failure : function() {
									bankRepGrid.setLoading(false);
									var errMsg = "";
									Ext.MessageBox.show({
										title : getLabel('instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel('instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							});

						} else
							{
								var arrayJson = new Array();
							
								var usrMsgJson = {
									bankReportCode : bankReportCode
								};
								arrayJson.push({
									userMessage : Ext.encode(usrMsgJson)
								});
							
								bankRepGrid.setLoading(true);
							Ext.Ajax.request({
								url : 'cpon/clientServiceSetup/assignBankReportAccount.json',
								params : {id:parentkey, 'removeRecords':removeRecords},
								method : 'POST',
								jsonData : Ext.encode(arrayJson),
								success : function(response) {
									var errorMessage = '';
									if (!Ext.isEmpty(response.responseText)) {
										var data = Ext.decode(response.responseText);
										if (!Ext.isEmpty(data))
										{
											if(!Ext.isEmpty(data.parentIdentifier))
											{
												parentkey = data.parentIdentifier;
												document.getElementById('viewState').value = data.parentIdentifier;
											}
											if(!Ext.isEmpty(data.listActionResult))
											{
										        Ext.each(data.listActionResult[0].errors, function(error, index) {
											         errorMessage = errorMessage + error.errorMessage +"<br/>";
											        });
											}
										}
									}
									if(!Ext.isEmpty(errorMessage))
							        {
							        	Ext.MessageBox.show({
											title : "Error",
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							        }
									me.getAccountBasedAccReportPopup().close();
									bankRepGrid.refreshData();
								},
								failure : function() {
									bankRepGrid.setLoading(false);
									var errMsg = "";
									Ext.MessageBox.show({
										title : getLabel('instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel('instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							});
						}
					}
				});