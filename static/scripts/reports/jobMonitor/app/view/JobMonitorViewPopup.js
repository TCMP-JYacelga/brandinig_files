Ext.define('GCP.view.JobMonitorViewPopup', {
	extend : 'Ext.window.Window',
	xtype : 'jobMonitorViewPopup',
	requires : ['Ext.ux.gcp.SmartGrid'],
	modal : true,
	title : getLabel('viewerror', 'View Error'),
	width : 600,
	height : 'auto',
	layout : 'auto',
	config : {
		modelData : null,
		isErrorPopup : false,
		filterData : []
	},
	refs :[
			{
				ref : 'txtSearchRefKey',
				selector : 'textfield[itemId=txtSearchRefKey]'
			},{
				ref : 'txtErrorReason',
				selector : 'textfield[itemId=txtErrorReason]'
			}
	],
	initComponent : function() {
		var me = this;
		me.height = me.isErrorPopup ? 700 : 360;
		me.title = me.isErrorPopup ? getLabel('viewerror', 'View Error') : getLabel('viewsuccess', 'View Success');
		var recordData = me.modelData;
		var isErrorPopup = me.isErrorPopup;
		me.items = [
				{
					xtype : 'panel',
					itemId : 'topPanel',
					layout : 'hbox',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
							{
								xtype : 'textfield',
								fieldLabel : getLabel('repOrDwnldNameLbl', 'Name'),
								itemId : 'name',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("jobSrcName")
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('lbl.jobMonitoring.jobId', 'Job Id'),
								itemId : 'jobid',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("jobId")
							
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('schref', 'Schedule Ref'),
								itemId : 'schref',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("scheduleRef")
							
							}]
				},
				{
					xtype : 'panel',
					itemId : 'centerPanel',
					layout : 'hbox',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
							{
								xtype : 'textfield',
								fieldLabel : getLabel('lbl.jobMonitoring.medium', 'Medium'),
								itemId : 'medium',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("medium")
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('lbl.jobMonitoring.format', 'Format'),
								itemId : 'format',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("format")
							
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('completeddate', 'Completed Date'),
								itemId : 'completeddate',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("completedDate")
							
							}]
				},
				{
					xtype : 'panel',
					itemId : 'bottomPanel',
					layout : 'hbox',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
							{
								xtype : 'textfield',
								fieldLabel : getLabel('medumdetails', 'Medium Details'),
								itemId : 'medumdetails',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("mediaDetails")
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('status', 'Status'),
								itemId : 'status',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : getLabel('jobStatus.'+recordData.get("jobStatus"), recordData.get("jobStatus"))
							
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel('lbl.scheduleMonitoring.module', 'Module'),
								itemId : 'module',
								labelAlign : 'top',
								labelSeparator : '',
								labelCls : 'frmLabel',
								margin : '5 5 5 5',
								readOnly : true,
								value : recordData.get("jobModuleName")
							
							}]
				},
				/*{
					xtype : 'panel',
					itemId : 'linkPanel',
					padding : '5 5 5 5',
					// width : 200,
					// height : 100
					items : [
					{
						xtype : 'button',
						text : getLabel('verifymessage', 'Verify The Message'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						itemId : 'linkBtn',
						handler : function() {
							me.fireEvent('verifyMessage', recordData);
						}
					}
					]
				},
				*/
				{
					xtype : 'panel',
					itemId : 'searchPanel',
					padding : '5 0 5 0',
					hidden : !me.isErrorPopup,
					// width : 200,
					// height : 100,
					layout : 'hbox',
					items : [
					{
						xtype : 'label',
						text : getLabel('refkey', 'Reference Key'),
						cls : 'frmLabel'
					},
					{
											xtype : 'AutoCompleter',
											margin : '0 0 0 5',
											fieldCls : 'xn-form-text w12 xn-suggestion-box',
											itemId : 'txtSearchRefKey',
											name : 'txtSearchRefKey',
											cfgProxyMethodType : 'post',
											cfgUrl : 'services/jobMonitor/errorReferenceKeyList.json',
											cfgRecordCount : -1,
											cfgDataNode1 : 'value',
											//cfgDataNode2 : 'value',
											cfgKeyNode : 'value',
											cfgQueryParamName : '$autofilter',
											listeners : {
												'select' : function(combo,
														record) {
													me.filterData = me.getFilterQueryJSON();
													var grid = me.down('smartgrid');
													grid.refreshData();
												},
												'change' : function(combo,
														newValue, oldValue,
														eOpts) {
														if (Ext.isEmpty(newValue)) {
															me.filterData = me.getFilterQueryJSON();
															var grid = me.down('smartgrid');
															grid.refreshData();
													}
												},
												'render' : function(combo) {
													
												}
											}
					},
					{
						xtype : 'label',
						text : getLabel('errorreason', 'Error reason'),
						cls : 'frmLabel'						
					},
					{
											xtype : 'AutoCompleter',
											margin : '0 0 0 5',
											fieldCls : 'xn-form-text w12 xn-suggestion-box',
											itemId : 'txtErrorReason',
											name : 'txtErrorReason',
											cfgProxyMethodType : 'post',
											cfgUrl : 'services/jobMonitor/errorRejectReasonList.json',
											cfgRecordCount : -1,
											cfgDataNode1 : 'value',
											//cfgDataNode2 : 'value',
											cfgKeyNode : 'value',
											value : strClient,
											cfgQueryParamName : '$autofilter',
											listeners : {
												'select' : function(combo,
														record) {
													me.filterData = me.getFilterQueryJSON();
													var grid = me.down('smartgrid');
													grid.refreshData();
												},
												'change' : function(combo,
														newValue, oldValue,
														eOpts) {
													if (Ext.isEmpty(newValue)) {
														me.filterData = me.getFilterQueryJSON();
														var grid = me.down('smartgrid');
														grid.refreshData();
													}	
												},
												'render' : function(combo) {
													
												}
											}
					}
					]
				}
				];
		me.buttons = [ {
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			cls : 'xn-button ux_button-background-color ux_cancel-button',
			glyph : 'xf0c7@fontawesome',
			itemId : 'cancelButton',
			handler : function() {
				me.close();
			}
		} ];
		if(me.isErrorPopup){
			me.on('render', me.createSmartGrid);
		}
		this.callParent(arguments);
		me.filterData = this.getFilterQueryJSON();
	},
	createSmartGrid : function() {
		var me = this;
		var pgSize = null;
		var popupSmartGrid = null;
		pgSize = _GridSizeMaster;
		popupSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					pageSize : 5,
					stateful : false,
					padding : '5 0 0 0',
					rowList : 5,
					itemId : 'dtlGrid',
					minHeight : 100,
					columnModel : me.getColumnModel(),
					storeModel : {
							fields : ['serialNo', 'rowNumber',
									'referenceKey', 'errorReason','recordLevel'],
							proxyUrl : 'services/jobMonitor/errorList.json',
							rootNode : 'd.details',
							totalRowsNode : 'd.__count'
					},
					showEmptyRow : false,
					showCheckBoxColumn : false,
					showHeaderCheckbox : false,
					mode : me.userMode,
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : function(grid, url, pgSize, newPgNo,
								oldPgNo, sorter) {
							me.handleLoadGridData(grid, url, pgSize, newPgNo,
									oldPgNo, sorter);
						},
						gridSortChange : function(grid, url, pgSize, newPgNo,
								oldPgNo, sorter) {
								me.handleLoadGridData(grid, url, pgSize, newPgNo,
									oldPgNo, sorter);
						},
						afterrender:function(objGrid){
							if(!Ext.isEmpty(me.isAllAssigned))
							{
								me.updateSelectionForAll(true,objGrid);
							}
						}
					}
				});
		popupSmartGrid.on('resize', function() {
			 me.doLayout();
			});
		me.items.add(popupSmartGrid);
		me.doLayout();
		return popupSmartGrid;
	},
	
	getColumnModel : function(){
		var me = this;
		var columnModel = [/*{
							colId : 'serialNo',
							colDesc : 'Sr No',
							colHeader : 'Sr No',
							width : 60
						}
						, */{
							colId : 'recordLevel',
							colDesc : 'Level',
							colHeader : 'Level',
							width : 46
						},{
							colId : 'rowNumber',
							colDesc : '# Row',
							colHeader : '# Row',
							width : 55
						}, {
							colId : 'referenceKey',
							colDesc : 'Reference Key',
							colHeader : 'Reference Key',
							width : 200,
							fnColumnRenderer : me.tooltipColumnRenderer
						}, {
							colId : 'errorReason',
							colDesc : 'Error Reason',
							colHeader : 'Error Reason',
							width : 200,
							fnColumnRenderer : me.tooltipColumnRenderer
						}];
		return columnModel;
	},
	tooltipColumnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var deviceDetail =  '<div class=reply-text>'+value+'</div>';
		if(record.get("recordLevel"))
		{
			meta.tdAttr = 'title="' + value + '"';
		}
		return value;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, me.handleGridAfterDataLoad, null, false,this);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this.filterData);
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function(filterData) {
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
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
	getFilterQueryJSON : function()
	{
		var me = this;
		var recordData = me.modelData;
		var txtSearchRefKey = me.down('textfield[itemId="txtSearchRefKey"]');
		var txtSearchRejectReason = me.down('textfield[itemId="txtErrorReason"]');
		var jsonArray = [];
		jsonArray.push({
						paramName : 'execution_id',
						paramValue1 : recordData.get("jobId"),
						operatorValue : 'eq',
						dataType : 'S'
					});
		if (!Ext.isEmpty(txtSearchRefKey) && !Ext.isEmpty(txtSearchRefKey.getValue())) {
			jsonArray.push({
						paramName : 'ref_key',
						paramValue1 : txtSearchRefKey.getValue(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(txtSearchRejectReason) && !Ext.isEmpty(txtSearchRejectReason.getValue())) {
			jsonArray.push({
						paramName : 'reject_reason',
						paramValue1 : txtSearchRejectReason.getValue(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		return jsonArray;
	}
});
