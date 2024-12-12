Ext.define('GCP.controller.ReportParameterController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ReportParameterView','GCP.view.ReportParameterGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'reportParameterView',
				selector : 'reportParameterView'
			}, {
				ref : 'createNewToolBar',
				selector : 'reportParameterView reportParameterGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'reportParameterGridView',
				selector : 'reportParameterGridView reportParameterGridView'
			}, {
				ref : 'reportParameterDtlView',
				selector : 'reportParameterView reportParameterGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'gridHeader',
				selector : 'reportParameterView reportParameterGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'reportParameterGrid',
				selector : 'reportParameterView reportParameterGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'grid',
				selector : 'reportParameterGridView smartgrid'
			}],
		config : {
						
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'reportParameterView reportParameterGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateReportParam"]' : {
				click : function() {
	                 me.handleEntryAction(true);
				}
			},			
			'reportParameterGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'reportParameterView reportParameterGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					if("VIEW"!=strMode)
					{
						me.handleGridHeader();
					}
				}
			},			
			'reportParameterGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData
			}
		});
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							text : getLabel('lblAddNewParam', 'Add New Parameter'),
							glyph : 'xf055@fontawesome',
							cls : 'ux_font-size14 xn-content-btn ux-button-s ',
							parent : this,
							itemId : 'btnCreateReportParam'
						}
		);
	},	
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$filter=' + recordKeyNo;
		grid.loadGridData(strUrl, null);
	},

	handleSmartGridConfig : function() {
		var me = this;
		var reportGrid = me.getReportParameterGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(reportGrid))
			reportGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : 10,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					cls:'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var clntSetupDtlView = me.getReportParameterDtlView();
		clntSetupDtlView.add(scmProductGrid);
		clntSetupDtlView.doLayout();
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;		
		arrCols.push(me.createActionColumn())
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

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addReportParamDtl.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtHdrRecordIndex', 1));			
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'hdrViewState',
				strHdrViewState));		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},	
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},	
	createActionColumn : function() {
		var me = this;
		if("VIEW"=== strMode)
		{
			var objActionCol = {
					colType : 'actioncontent',
					colId : 'action',
					width : 80,
					align : 'right',
					locked : true,
					items : [{
								itemId : 'btnView',
								itemCls : 'grid-row-action-icon icon-view',
								toolTip : getLabel('viewToolTip', 'View Record')
								
							}]
					
				};			
		}
		else
		{
			var objActionCol = {
					colType : 'actioncontent',
					colId : 'action',
					width : 87,
					locked : true,
					items : [{
								itemId : 'btnEdit',
								itemCls : 'grid-row-action-icon icon-edit',
								toolTip : getLabel('editToolTip', 'Edit')
								
							},{
								itemId : 'delete',
								itemCls : 'button-icon icon-button-reject middleAlign',
								toolTip : getLabel('deleteToolTip', 'Delete')
							},{
								itemId : 'btnView',
								itemCls : 'grid-row-action-icon icon-view',
								toolTip : getLabel('viewToolTip', 'View Record'),
								itemLabel : getLabel('viewToolTip','View Record')
							}]
					
				};			
		}

		return objActionCol;

	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record)
	{
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnView')
		{
			me.submitExtForm('viewReportParamDtl.form', record, rowIndex);
		}
		else if (actionName === 'btnEdit')
		{
			me.submitExtForm('editReportParamDtl.form', record, rowIndex);
		}
		else if (actionName === 'delete')
		{
			me.deleteDetail(record.get('identifier'), me.getReportParameterGrid());
		}		
	},
	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtHdrRecordIndex', 1));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'hdrViewState',
				strHdrViewState));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'paramViewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				strMode));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/reportParameterMst/{0}',
				strAction);
			this.preHandleGroupActions(strUrl, '',record);
	},

	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
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
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
			if(colId=='col_editableFlag' || colId=='col_sortable')
			{
				if(value=='Y')
				{
					value = getLabel('lblReportYes','Yes');
				}
				else
				{
					value = getLabel('lblReportNo','No');
				}	
			}	
			strRetValue = value;
		return strRetValue;
	},
	deleteDetail : function(identifier, grid) {
		var arrayJson = new Array();
		arrayJson.push({
					serialNo : '1',
					identifier : identifier,
					userMessage : strHdrViewState
				});
		var postData = Ext.encode(arrayJson);
		var strUrl = 'services/reportParamDetails/discard.srvc';
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					method : 'POST',
					jsonData : postData,
					success : function(response) {
						var errorMessage = '';
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									strHdrViewState = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
									document.getElementById('hdrViewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage + error.errorMessage +"<br/>";
								        });
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
						}
						//var responseData = Ext.decode(response.responseText);
						grid.refreshData();
					},
					failure : function(response) {
					}
				});
	},
	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"parameterCode" : 160,
			"parameterDesc" : 180,
			"dataType" : 80,	
			"defaultValue" : 100,
			"listOfValueType" : 80,
			"listOfValues" : 120,	
			"editableFlag" : 70,
			"sortable" : 70,	
			"seqNmbr" : 130			
		};
		arrColsPref =  [{
							"colId" : "parameterCode",
							"colDesc" : getLabel('lblParamCode', 'Parameter Code')
						},{
							"colId" : "parameterDesc",
							"colDesc" : getLabel('lblParamName', 'Parameter Name')
						},{
							"colId" : "dataType",
							"colDesc" : getLabel('lblDataType', 'Data Type')
						},{
							"colId" : "defaultValue",
							"colDesc" : getLabel('lblDefaultValue', 'Default Value')
						}, {
							"colId" : "listOfValueType",
							"colDesc" : getLabel('lblListOfValueType', 'LoV Type')
						},{
							"colId" : "listOfValues",
							"colDesc" : getLabel('lblListOfValue', 'LoV')
						},{
							"colId" : "editableFlag",
							"colDesc" : getLabel('lblEditable', 'Hidden')
						},{
							"colId" : "sortable",
							"colDesc" : getLabel('lblSortable', 'Sortable')
						},{
							"colId" : "seqNmbr",
							"colDesc" : getLabel('lblSequeceNo', 'Sequence Number')
						}];

		storeModel = {
					fields : ['parameterCode','parameterDesc', 'dataType', 'defaultValue',
							 'columnNameLhs', 'primaryKey','history','identifier',
							 'listOfValueType','listOfValues','editableFlag','selectable','sortable','seqNmbr',
							 'version',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : 'services/reportParamDetails.json',
					    rootNode : 'd.details',
					    totalRowsNode : 'd.__count'
				};
		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	}
});
