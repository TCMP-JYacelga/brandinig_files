Ext.define('GCP.view.ChargePrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	cls : 'xn-panel xn-no-rounded-border',
	xtype : 'chargePrfEntryGridView',
	initComponent : function() {

		var me = this;

		var comboStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/moduleServices.json',
						noCache: false,
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json'
						}
					}
				});
		var servicesComboField = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'value',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'serviceCode',
					itemId : 'serviceCode_id',
					valueField : 'name',
					name : 'serviceCode',
					editable : false,
					store : comboStore,
					padding : '1 3 0 10',
					margin : '0 5 0 0',
					width : 100,
					listeners : {
						'afterrender' : function(combo, record) {
							combo.setValue("");
							comboStore.load();
						},
						'select' : function(combo, record) {
							var newValue = combo.getValue();
							me.handleServiceChange(newValue, adminListView);
						}
					}
				});

		this.title = me.title;
		var strUrl = '/chargeProfile/availableDetails';
		var colModel = me.getColumns();
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					itemId : 'chargeProfileGrid',
					showCheckBoxColumn : false,
					padding : '5 0 0 0',
					minHeight : 200,
					height : 200,
					showPager : false,
					columnModel : colModel,
					storeModel : {
						fields : ['chargeProfileId', 'eventCode', 'eventDesc',
								'eventTypeDesc', 'moduleDesc', 'eventType',
								'moduleCode', 'identifier', 'unitsCount','validFlag','isUpdated'],
						proxyUrl : strUrl,
						rootNode : 'd.accounts',
						totalRowsNode : 'd.__count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					},
					isRowIconVisible : me.isRowIconVisible,
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var actionName = btn.itemId;
						if (actionName === 'edit') {
							var frm = document.forms["frmMain"];
							frm.action = "addChargeUnitsMst.form";
							frm.method = "POST";
							frm.target = "";
							frm
									.appendChild(me
											.createFormField(
													'INPUT',
													'HIDDEN',
													'viewState',
													document
															.getElementById('viewState').value));
							frm.appendChild(me.createFormField('INPUT',
									'HIDDEN', 'eventViewState', record
											.get('identifier')));
							frm.submit();
						} else if (actionName === 'delete') {
							// handle delete action
							me.handleDeleteAction(record, rowIndex);
						}
						else if (actionName === 'view')
						{
							var frm = document.forms["frmMain"];
							frm.action = "viewChargeUnitsMst.form";
							frm.method = "POST";
							frm.target = "";
							frm
									.appendChild(me
											.createFormField(
													'INPUT',
													'HIDDEN',
													'viewState',
													document
															.getElementById('viewState').value));
							frm.appendChild(me.createFormField('INPUT',
									'HIDDEN', 'eventViewState', record
											.get('identifier')));
							frm.submit();
						}
					}
				});

		if (modeVal != 'VIEW') {
			this.items = [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : '',
						items : ['->', servicesComboField]
					}, adminListView];
		} else {
			this.items = [adminListView];
		}

		this.callParent(arguments);
	},
	handleServiceChange : function(selectedService, grid) {
		var qParam = "Y";
		if (!Ext.isEmpty(grid)) {
			grid.setLoading(true);
			var strUrl = "services/chargeProfile/availableDetails.json?$filter="
					+ selectedService;
			var objParam = {'$id' : encodeURIComponent(document.getElementById('viewState').value)};
			strUrl = strUrl + "&$qParam=" + qParam;
			if (null != blnViewOld || !('' == blnViewOld)) {
				strUrl = strUrl + '&$old=' + blnViewOld;
			}
			grid.loadGridData(strUrl, null, null, false,null,objParam);
		}

	},
	handleDeleteAction : function(record, index) {

		var me = this;
		var grid = me.down('smartgrid[itemId="chargeProfileGrid"]');

		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo : index + 1,
						identifier : record.data.identifier,
						userMessage : document.getElementById('viewState').value
					});

			Ext.Ajax.request({
						url : 'services/chargeProfileDetailMst/discard',
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// update the count on UI
						var data = Ext.decode(response.responseText);
						if (null != data['subCount'])
							document.getElementById('subcount_' + record.data.moduleCode).innerHTML = data['subCount'];
						if (null != data['eventCount'])
							document.getElementById('eventcount_' + record.data.moduleCode).innerHTML = data['eventCount'];
						resetEventSelectionPopup();
						// refresh the events smartgrid
						grid.refreshData();
							if(data.error) {
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : data.error,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							}
							if(data.identifier)
								document.getElementById('viewState').value = data.identifier;
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
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "moduleDesc",
					"colDesc" : getLabel("lblBillingModule","Module"),
					"sortable":true,
					"width" : 120
				}, {
					"colId" : "eventDesc",
					"colDesc" : getLabel("lblBillingEventName","Event Name"),
					"sortable":true,
					"width" : 280
				}, {
					"colId" : "eventTypeDesc",
					"colDesc" : getLabel("lblBillingEventTypeDesc","Event Type"),
					"sortable":true,
					"width" : 120
				}, {
					"colId" : "unitsCount",
					"colDesc" : getLabel("lblBillingUnitCount","#Units"),
					"colType" : "number",
					"sortable":true,
					"width" : 80
				}];
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
				cfgCol.sortable=objCol.sortable;
				cfgCol.width = objCol.width;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var module = '';
		var qParam = 'Y';
		var objParam = {};
		var strUrl = "services/chargeProfile/availableDetails.json?&$filter="
				+ module;
		strUrl = strUrl + "&$qParam=" + qParam;
		var strSort = '&$orderby=';
		var sortColumn = '';
		var strTemp = '';
		if (!Ext.isEmpty(sorter)) {
			sorter.each(function(item) {
				if (!Ext.isEmpty(item.property) && !Ext.isEmpty(item.direction)) {
					sortColumn = (typeof arrSortColumn != 'undefined')
							? arrSortColumn[item.property]
							: item.property;
					if (!Ext.isEmpty(sortColumn)) {
						strTemp = strTemp + sortColumn;
						strTemp = strTemp + ' '
								+ (item.direction).toLowerCase() + ',';
					}
				}
			});

			strTemp = strTemp.replace(/\,$/, '');
		}
		if (!Ext.isEmpty(strTemp))
			strTemp=strSort + strTemp;
		if (null != blnViewOld || !('' == blnViewOld)) {
			strUrl = strUrl + '&$old=' + blnViewOld;
		}
		objParam = {'$id' : encodeURIComponent(document.getElementById('viewState').value)};
		strUrl = strUrl + strTemp;
		//grid.loadGridData(strUrl, null, null, false);
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false,null,objParam);
	},
	enableEntryButtons:function(){
		  gridRender=true;
		  enableDisableGridButtons(false);
	 },
	createActionColumn : function() {
	var objActionCol = null;
		if (modeVal != 'VIEW' )
		{
			if(chargeHandoff != "Y")
				{
				
				objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				locked : true,
				sortable : false,
				items : [{
							itemId : 'delete',
							itemCls : 'x-action-col-icon grid-row-delete-icon middleAlign',
							toolTip : getLabel('deleteToolTip', 'Delete')
						}, {
							itemId : 'edit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel('configureChargeUnits',
									'Configure Charge Units')
						}]
			};
				}
			else
				{
				objActionCol = {
						colType : 'actioncontent',
						colId : 'action',
						width : 80,
						locked : true,
						sortable : false,
						items : [{
									itemId : 'delete',
									itemCls : 'x-action-col-icon grid-row-delete-icon middleAlign',
									toolTip : getLabel('deleteToolTip', 'Delete')
								}]
					};
				}
		}
		else
		{
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 30,
				locked : true,
				sortable : false,
				items : [{
							itemId : 'view',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewUnitToolTip', 'View Charge Units')
						}]
			};
		}
		return objActionCol;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (null != blnViewOld && blnViewOld == 'TRUE')
		{
			if (record.raw.changeState === 1) {
				strRetValue = '<span class="modifiedFieldValue">'+ value+ '</span>';
			}
			else if (record.raw.changeState === 3) {
				strRetValue = '<span class="newFieldGridValue">' + value + '</span>';
			}
			else if (record.raw.isUpdated === 'D' || record.raw.changeState === 2) {
				strRetValue = '<span class="deletedFieldValue">' + value + '</span>';
			}
			else if (record.raw.isUpdated === 'N') {
				strRetValue = '<span class="newFieldGridValue">' + value + '</span>';
				if(record.raw.validFlag == 'N')
					strRetValue = '<span class="deletedFieldValue">' + value + '</span>';
			}
			else
				strRetValue = value;
		}		
		else
			strRetValue = value;

		return strRetValue;
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var count = record.get('unitsCount');

		if (itmId === 'view') {
			if (count > 0)
				return true;
			else
				return false;
		}
		if (itmId === 'delete') {
			if ('N' === record.get('validFlag')) {
				return false;
			}
		}
		if (itmId === 'edit') {
			if ('N' === record.get('validFlag')) {
				return false;
			}
		}
		return true;

	}

});