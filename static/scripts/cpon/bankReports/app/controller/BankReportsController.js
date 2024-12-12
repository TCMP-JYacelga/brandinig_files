Ext
		.define(
				'GCP.controller.BankReportsController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.BankReportsGridView',
							'GCP.view.AccountBasedAccReportPopup',
							'GCP.view.FieldBasedAccReportPopup',
							'GCP.view.ReportFilterPopup' ],
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
							} ],
					init : function() {
						var me = this;
						me
								.control({
									'bankReportsGridView grid[itemId="bankReportGrid"]' : {
										render : function(grid) {
											me.handleLoadGridData(grid,
													grid.store.dataUrl,
													grid.pageSize, 1, 1, null);
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
										addField : me.handleAddField
									},
									'bankReportsGridView toolbar[itemId=gridActionBar]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									}
								});
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
											.get('recordKeyNo')
								};
								arrayJson.push({
									serialNo : grid.getStore().indexOf(
											records[index]) + 1,
									identifier : records[index]
											.get('identifier'),
									userMessage : Ext.encode(usrMsgJson)
								});
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
										grid.refreshData();
										grid.getSelectionModel().deselectAll();
									},
									failure : function(response) {
										grid.setLoading(false);
									}
								});
							}
						}
						// this.preHandleGroupActions(strUrl, '',record);

					},
					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData) {
						var me = this;
						var grid = me.getBankReportGrid();
						var enableActionEnabled = false;
						var disableActionEnabled = false;

						var blnEnabled = false;
						if (Ext.isEmpty(grid.getSelectedRecords())) {
							enableActionEnabled = false;
							disableActionEnabled = false;
						} else {
							Ext.each(grid.getSelectedRecords(), function(item) {
								if (!item.data.recordKeyNo) {
									enableActionEnabled = true;
								} else if (item.data.recordKeyNo) {
									disableActionEnabled = true;
								}
							});
						}

						var enableBtn = me.getAssignBtn();
						var disableBtn = me.getDeLinkBtn();

						if (!disableActionEnabled && !enableActionEnabled) {
							disableBtn.setDisabled(!blnEnabled);
							enableBtn.setDisabled(!blnEnabled);
						} else if (disableActionEnabled && enableActionEnabled) {
							enableBtn.setDisabled(!blnEnabled);
							disableBtn.setDisabled(!blnEnabled);
						} else if (enableActionEnabled) {
							enableBtn.setDisabled(blnEnabled);
						} else if (disableActionEnabled) {
							disableBtn.setDisabled(blnEnabled);
						}

					},
					handleAddField : function(popup) {
						var me = this;
						var name = me.getCreateFieldTab().query(
								'textfield[itemId=fieldName]')[0].value;
						var desc = me.getCreateFieldTab().query(
								'textfield[itemId=fieldDescription]')[0].value;
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
										url : 'cpon/clientServiceSetup/addBankReportField.json',
										method : 'POST',
										jsonData : jsonData,
										success : function() {
											me.getReportTabPanel()
													.setActiveTab(0);
											me.getFieldBasedPopupGrid()
													.getStore().reload();
											me.getFieldDescriptionTextField()
													.setValue(null);
											me.getFieldNameTextField()
													.setValue(null);
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
											'Account ID and Company Name can not be Empty.');
						}

					},
					handleCellClick : function(me, td, cellIndex, record, tr,
							rowIndex, e, eOpts) {
						if (td.className.match('x-grid-cell-col_filterCount')) {
							if (record.data.distributionMethod === 'A') {
								var reportFilterPopup = Ext
										.create(
												'GCP.view.AccountBasedAccReportPopup',
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
												'GCP.view.ReportFilterPopup',
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
					}
				});