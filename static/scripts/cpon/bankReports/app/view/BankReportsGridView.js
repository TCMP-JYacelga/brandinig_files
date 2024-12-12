Ext
		.define(
				'GCP.view.BankReportsGridView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'bankReportsGridView',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
					cls: 'x-portlet',
					initComponent : function() {
						var me = this;
						var actionBar = Ext.create('GCP.view.BRActionBarView', {
							itemId : 'gridActionBar',
							height : 21,
							width : '100%',
							margin : '1 0 0 0',
							parent : me
						});
						this.title = me.title;
						var strUrl = 'cpon/clientServiceSetup/bankReports.json';
						var colModel = me.getColumns();
						bankReportsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							xtype : 'bankReportGrid',
							itemId : 'bankReportGrid',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : true,
							rowList : [ 5, 10, 15, 20, 25, 30 ],
							padding : '5 0 0 0',
							minHeight : 0,
							columnModel : colModel,
							isRowIconVisible : me.isRowIconVisible,
							handleRowIconClick : function(tableView, rowIndex,
									columnIndex, btn, event, record) {
								me.handleRowIconClick(tableView, rowIndex,
										columnIndex, btn, event, record);
							},
							storeModel : {
								fields : [ 'bankReportDesc','identifier',
										'distributionMethod', 'statusFlag',
										'recordKeyNo', 'bankReportCode',
										'filterCount' ],
								proxyUrl : strUrl,
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
						 this.items = [ {
							xtype : 'panel',
							width : '100%',
							cls : 'xn-panel',
							autoHeight : true,
							margin : '5 0 0 0',
							itemId : 'payServiceDtlView',
							items : [ {
								xtype : 'container',
								itemId : 'actionBarContainer',
								layout : 'hbox',
								items : [ {
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold',
									padding : '5 0 0 3'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								} ]

							} ]
						}, bankReportsGrid ];
						this.callParent(arguments);
					},
					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						if (maskPosition === 1)
							return (record.data.distributionMethod === 'A' || record.data.distributionMethod === 'F');
						else {
							if (record.data.recordKeyNo) {
								if (itmId === "unassign") {
									return true;
								}
							} else {
								if (itmId === "assign")
									return true;
							}
						}
					},
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'btnEdit'
								&& record.data.distributionMethod === 'F') {
							var fieldBasedAccReportPopup = Ext
									.create(
											'GCP.view.FieldBasedAccReportPopup',
											{
												bankReportCode : record.data.bankReportCode
											});
							var reportName = record.data.bankReportDesc;
							fieldBasedAccReportPopup
									.query('label[itemId=fReportName]')[0]
									.setText(reportName);
							if (viewmode === 'VIEW'
									|| viewmode === 'MODIFIEDVIEW') {
								fieldBasedAccReportPopup
										.query('button[itemId=savebtn]')[0]
										.setDisabled(true);
								fieldBasedAccReportPopup
										.query('button[itemId=addFieldBtn]')[0]
										.setDisabled(true);
							}
							fieldBasedAccReportPopup.show();
						} else if (actionName === 'btnEdit'
								&& record.data.distributionMethod === 'A') {
							var accountBasedAccReportPopup = Ext
									.create(
											'GCP.view.AccountBasedAccReportPopup',
											{
												bankReportCode : record.data.bankReportCode
											});
							var reportName = record.data.bankReportDesc;
							accountBasedAccReportPopup
									.query('label[itemId=aReportName]')[0]
									.setText(reportName);
							accountBasedAccReportPopup.show();
						} else if (actionName == 'assign') {
							var grid = me
									.down('smartgrid[itemId=bankReportGrid]');
							grid.fireEvent('performRowAction', grid, record,
									actionName);
						} else if (actionName == 'unassign') {
							var grid = me
									.down('smartgrid[itemId=bankReportGrid]');
							grid.fireEvent('performRowAction', grid, record,
									actionName);
						}
					},

					getColumns : function() {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						arrCols.push(me.createActionColumn());
						var arrColsPref = [ {
							"colId" : "bankReportDesc",
							"colDesc" : "Report Name",
							"width" : 150
						},  {
							"colId" : "assignmentStatus",
							"colDesc" : "Assigned",
							"width" : 100
						},{
							"colId" : "distributionMethod",
							"colDesc" : "Type",
							"width" : 70
						}, {
							"colId" : "filterCount",
							"colDesc" : "Report Filter",
							"width" : 80
						}, {
							"colId" : "statusFlag",
							"colDesc" : "Status",
							"width" : 120
						} ];
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = objCol.width;
								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);

							}
						}
						return arrCols;
					},
					createActionColumn : function() {
						var me = this;
						if (!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")) {
							var objActionCol = {
								colType : 'actioncontent',
								colDesc : 'Edit Filters',
								colId : 'action',
								width : 30,
								align : 'right',
								locked : true,
								items : [
										
										{
											itemId : 'btnEdit',
											itemCls : 'grid-row-action-icon icon-edit',
											toolTip : getLabel('editToolTip',
													'Edit'),
											maskPosition : 1
										} ]
							};
							return objActionCol;
						} else {
							var objActionCol = {
								colType : 'actioncontent',
								colDesc : 'Edit Filters',
								colId : 'action',
								width : 110,
								align : 'right',
								locked : true,
								items : []
							};
							return objActionCol;
						}
					},

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";
						if (colId === 'col_distributionMethod') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record
										.get('distributionMethod'))
										&& "A" == record
												.get('distributionMethod')) {
									strRetValue = getLabel('account', 'Account');
								} else if (!Ext.isEmpty(record
										.get('distributionMethod'))
										&& "G" == record
												.get('distributionMethod')) {
									strRetValue = getLabel('group', 'Group');
								} else if (!Ext.isEmpty(record
										.get('distributionMethod'))
										&& "F" == record
												.get('distributionMethod')) {
									strRetValue = getLabel('field', 'Field');
								}
							}
						} else if (colId === 'col_statusFlag') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('statusFlag'))
										&& "Y" == record.get('statusFlag')) {
									strRetValue = getLabel('active', 'Active');
								} else if (!Ext.isEmpty(record
										.get('statusFlag'))
										&& "N" == record.get('statusFlag')) {
									strRetValue = getLabel('inactive',
											'Inactive');
								}
							}
						}else if (colId === 'col_assignmentStatus') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('recordKeyNo'))) {
									strRetValue = getLabel('assigned', 'Assigned');
								} else {
									strRetValue = getLabel('unassigned',
											'Unassigned');
								}
							}
						}else if (colId === 'col_filterCount' && value > 0) {
							strRetValue = '<span class="underlined">' + value
									+ '</span>';
						} else {
							strRetValue = value;
						}
						return strRetValue;
					}
				});
