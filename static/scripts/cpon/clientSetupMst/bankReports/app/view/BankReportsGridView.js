Ext.define('CPON.view.BankReportsGridView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankReportsGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.form.field.ComboBox','Ext.form.Label',
	'Ext.layout.container.HBox','Ext.container.Container','CPON.view.BRActionBarView','Ext.panel.Panel',
	'Ext.form.RadioGroup','Ext.form.field.Text','Ext.menu.Menu'],
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('CPON.view.BRActionBarView', {
					itemId : 'gridActionBar',
					height : 21,
					//width : '50%',
					margin : '1 0 0 0',
					parent : me
				});
		var fieldsLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'fieldsLink',
					padding : '0 900 0 0',
					hidden : true,
					cls : 'clearlink-a cursor_pointer ux_font-size14 ft-padding-l ux_verysmallmargin-top',
					html: '<a>Fields</a>',
					listeners: {
						'click': function() {
							var fieldBasedAccReportPopup = Ext.create(
									'CPON.view.FieldBasedAccReportPopup', {
										//bankReportCode : null
									});
							if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW') {
								fieldBasedAccReportPopup.query('button[itemId=savebtn]')[0]
										.setDisabled(true);
								fieldBasedAccReportPopup.query('button[itemId=addFieldBtn]')[0]
										.setDisabled(true);
							}
							fieldBasedAccReportPopup.show();
						},
						element: 'el',
						delegate: 'a'
					}
				});

		this.title = me.title;
		var strUrl = 'cpon/clientServiceSetup/bankReports.json';
		var colModel = me.getColumns();
		var billingProfileField = null;
		var pgSize = null;
		pgSize = 10;
		bankReportsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					pageSize : pgSize,
					xtype : 'bankReportGrid',
					itemId : 'bankReportGrid',
					stateful : false,
					cls: 'x-portlet',
					showEmptyRow : false,
					showCheckBoxColumn : true,
                    rowList : _AvailableGridSize,
					padding : '5 10 10 10',
					minHeight : 0,
					columnModel : colModel,
					isRowIconVisible : me.isRowIconVisible,
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					},
					storeModel : {
						fields : ['bankReportDesc', 'identifier','relativeTypeId',
								'distributionMethod', 'statusFlag',
								'recordKeyNo', 'bankReportCode', 'filterCount'],
						proxyUrl : strUrl,
						rootNode : 'd.accounts',
						totalRowsNode : 'd.__count'
					},
					checkBoxColumnRenderer : function(value, metaData, record,
							rowIndex, colIndex, store, view) {

					}

				});

		var textValue = '';
		var comboStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/cponseek/billingProfilesList',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});

		/*if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW') {
			billingProfileField = Ext.create('Ext.form.field.Text', {
						value : selectedBillingProfileDesc,
						disabled : true,
						cls : 'w10 greyback',
						margin : '0 0 0 0',
						itemId : 'billingProfileId_text'
					});
		} else {
			billingProfileField = Ext.create('Ext.form.field.ComboBox', {
						displayField : 'value',
						fieldCls : 'xn-form-field inline_block',
						triggerBaseCls : 'xn-form-trigger',
						filterParamName : 'billingProfileId',
						itemId : 'billingProfileId_combo',
						valueField : 'name',
						value : 'Select',
						name : 'billingProfileId',
						editable : false,
						store : comboStore,						
						padding : '1 3 0 10',
						margin : '0 5 0 10',
						width : 150,
						listeners : {
							'afterrender' : function(combo, record) {
								if (!Ext.isEmpty(selectedBillingProfileId)) {
									combo.setValue(selectedBillingProfileId);
									comboStore.load();
								}
							},
							'select' : function(combo, record) {
								var newValue = combo.getValue();
								me.handleBillingIdChange(newValue);
							}
						}
					});
		}*/

		this.items = [{
					xtype : 'panel',
					width:'100%',
					layout : 'hbox',
					items:[/*{
					xtype : 'container',
					margin : '10 0 0 10',
					flex:1,
					layout : {
						type : 'hbox',
						pack : 'start'
					},
					items : [{
								xtype : 'label',
								border : 0,
								itemId : 'labelBilling',
								text : getLabel('billingProfile',
										'Billing Profile'),
								 cls : 'xn-custom-button ux_font-size14 ux_normalpadding-right'
								// cursor_pointer',
								//padding : '4 6 0 3'
					}, billingProfileField]
					},*/{
								xtype : 'container',
								margin : '4 0 5 0',
								cls : 'ux_hide-image',
								flex:1,
								layout : {
									type : 'hbox',
									pack : 'end'
								},
								items : [{
									xtype : 'button',
									border : 0,
									itemId : 'widgetSearchTxnId',
									text : getLabel('searchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									margin : '3 0 0 10',
									menu : Ext.create('Ext.menu.Menu', {
												items : [{
													xtype : 'radiogroup',
													itemId : 'matchCriteria',
													vertical : true,
													columns : 1,
													items : [{
														boxLabel : getLabel(
																'exactMatch',
																'Exact Match'),
														name : 'searchOnPageOption',
														inputValue : 'exactMatch'
													}, {
														boxLabel : getLabel(
																'anyMatch',
																'Any Match'),
														name : 'searchOnPageOption',
														inputValue : 'anyMatch',
														checked : true
													}]

												}]
											})

								}, {
									xtype : 'textfield',
									itemId : 'searchTxnTextField',
									cls : 'w10',
									padding : '2 0 0 5'

								}]
							}]
							},{
					xtype : 'panel',
					width : '100%',
					//cls : 'xn-panel',
					autoHeight : true,
					margin : '5 0 0 0',
					itemId : 'payServiceDtlView',
					items : [{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								},fieldsLink]

					}]
				}, bankReportsGrid];
		this.callParent(arguments);
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		if (maskPosition === 1)
		{
			//return (record.data.distributionMethod === 'F');
		}
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
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		setDirtyBit();
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnEdit' && record.data.distributionMethod === 'F') {
			var fieldBasedAccReportPopup = Ext.create(
					'CPON.view.FieldBasedAccReportPopup', {
						//bankReportCode : record.data.bankReportCode
					});
			var reportName = record.data.bankReportDesc;
			//fieldBasedAccReportPopup.query('label[itemId=fReportName]')[0]
				//	.setText(reportName);
			//fieldBasedAccReportPopup.query('label[itemId=fReportName]')[0].autoEl['title']=reportName;		
			if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW') {
				fieldBasedAccReportPopup.query('button[itemId=savebtn]')[0]
						.setDisabled(true);
				fieldBasedAccReportPopup.query('button[itemId=addFieldBtn]')[0]
						.setDisabled(true);
			}
			fieldBasedAccReportPopup.show();
		} else if (actionName === 'btnEdit'
				&& record.data.distributionMethod === 'A') {
			var accountBasedAccReportPopup = Ext.create(
					'CPON.view.AccountBasedAccReportPopup', {
						bankReportCode : record.data.bankReportCode
					});
			var reportName = record.data.bankReportDesc;
			accountBasedAccReportPopup.query('label[itemId=aReportName]')[0]
					.setText(reportName);
			accountBasedAccReportPopup.query('label[itemId=aReportName]')[0].autoEl['title']=reportName;		
			accountBasedAccReportPopup.show();
		} else if (actionName == 'assign') {
			var grid = me.down('smartgrid[itemId=bankReportGrid]');
			grid.fireEvent('performRowAction', grid, record, actionName);
		} else if (actionName == 'unassign') {
			var grid = me.down('smartgrid[itemId=bankReportGrid]');
			grid.fireEvent('performRowAction', grid, record, actionName);
		}
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
		var arrColsPref = [{
					"colId" : "bankReportDesc",
					"colDesc" : getLabel('bankRptReportNm', 'Report Name'),
					"width" : 150
				}, {
					"colId" : "assignmentStatus",
					"colDesc" : getLabel('assigned', 'Assigned'),
					"width" : 100
				}, {
					"colId" : "distributionMethod",
					"colDesc" : getLabel('lblType', 'Type'),
					"width" : 70
				}, {
					"colId" : "statusFlag",
					"colDesc" : getLabel('colStatus', 'Status'),
					"width" : 120
				}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				if(cfgCol.colId === 'assignmentStatus') cfgCol.sortable = false;
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
							toolTip : getLabel('editToolTip', 'Edit'),
							maskPosition : 1
						}]
			};
			return objActionCol;
		} else {
			var objActionCol = {
				colType : 'actioncontent',
				colDesc : getLabel('lblEditFilter', 'Edit Filters'),
				colId : 'action',
				width : 110,
				align : 'right',
				locked : true,
				items : []
			};
			return objActionCol;
		}
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_distributionMethod') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "A" == record.get('distributionMethod')) {
					strRetValue = getLabel('bankRptReportAccount', 'Account');
				} else if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "G" == record.get('distributionMethod')) {
					strRetValue = getLabel('group', 'Group');
				} else if (!Ext.isEmpty(record.get('distributionMethod'))
						&& "F" == record.get('distributionMethod')) {
					strRetValue = getLabel('field', 'Field');
				}
			}
		} else if (colId === 'col_statusFlag') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('statusFlag'))
						&& "Y" == record.get('statusFlag')) {
					strRetValue = getLabel('active', 'Active');
				} else if (!Ext.isEmpty(record.get('statusFlag'))
						&& "N" == record.get('statusFlag')) {
					strRetValue = getLabel('inactive', 'Inactive');
				}
			}
		} else if (colId === 'col_assignmentStatus') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('recordKeyNo'))) {
					strRetValue = getLabel('assigned', 'Assigned');
				} else {
					strRetValue = getLabel('unassigned', 'Unassigned');
				}
			}
		} else {
			strRetValue = value;
		}
		return strRetValue;
	},

	handleBillingIdChange : function(newValue) {
		$('#billingProfileId').val(newValue);
	}
});
