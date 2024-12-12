Ext.define('GCP.view.PaymentInstQueryGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'paymentInstQueryGridView',
	requires : ['GCP.view.PaymentInstQueryActionBarView', 'Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView','Ext.panel.Panel',
		'Ext.form.Label', 'Ext.layout.container.VBox', 'Ext.layout.container.HBox'],
	autoHeight : true,
	componentCls: 'gradiant_back',
	cls : 'gradiant_back xn-ribbon ux_border-bottom',
	intMaskSize : 13,
	strDefaultMask : '000000000000',
	initComponent : function() {
		var me = this;
		me.items = [ {
			xtype : 'panel',
			itemId : 'queueGridPanel'
		} ];
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	},
	createActionBarViewforGrooup : function(strQueueType) {
		var me = this;
		var arrAvailableActions = null, actionBar = null;
		arrAvailableActions = me.getAvailableGroupActions('G', strQueueType);
		if (!Ext.isEmpty(arrAvailableActions) && arrAvailableActions.length > 0) {
			actionBar = Ext.create('GCP.view.PaymentInstQueryActionBarView', {
						itemId : 'groupActionBar',
						height : 21,
						availableActions : arrAvailableActions,
						queueType : strQueueType,
						margin : '1 0 0 0',
						parent : me
					});
			return actionBar.getAvailableActions();
		}
		else
			return [];
	},
	createActionBarView : function(strQueueType) {
		var me = this;
		var arrAvailableActions = null, actionBar = null;
		arrAvailableActions = me.getAvailableGroupActions('G', strQueueType);
		if (!Ext.isEmpty(arrAvailableActions) && arrAvailableActions.length > 0) {
			actionBar = Ext.create('GCP.view.PaymentInstQueryActionBarView', {
						itemId : 'groupActionBar',
						height : 21,
						availableActions : arrAvailableActions,
						queueType : strQueueType,
						margin : '1 0 0 0',
						parent : me
					});
		}
		return actionBar;
	},
	getAvailableGroupActions : function(charActionType, strQueueType) {
		var me = this;
		var retValue = null;
		if (charActionType === 'G')
			retValue = mapActions[strQueueType].groupActions;
		else
			retValue = mapActions[strQueueType].rowActions;
		return retValue;
	},
	reconfigureGroup : function(strQueueType) {
		var me = this, group = null, grid = null, gridConfig = null, arrCols = null, actionBar = null, showCheckBoxColumnFlg = true;
		var queueGridPanel = me.down('panel[itemId="queueGridPanel"]');
		queueGridPanel.removeAll();
		gridConfig = me.getGridModel(strQueueType);
		arrCols = me.getGroupColumns(gridConfig.arrColsPref, strQueueType);
		showCheckBoxColumnFlg = me.getShowCheckBoxColumn(strQueueType)
		group = me.createGroupView(showCheckBoxColumnFlg, arrCols, gridConfig.storeModel, strQueueType);
		queueGridPanel.add(group);
	},
	createGroupView : function(showCheckBoxColumnFlg, arrCols, storeModel, strQueueType) {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		var pgSize = _GridSizeTxn || 10;
		var gridId = "GRD_PMTPROC_QUEUE" + strQueueType;
		var service = "PQ" + strQueueType;
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/paymentProcQueue/'+service+'.json?$filterGridId=' + gridId+'&$columnModel=true',
			cfgSummaryLabel : arrPmtQueueType[strQueueType],
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGroupByPref.groupCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			getActionColumns : function() {
				if(!Ext.Object.isEmpty(me.createGroupActionColumn(strQueueType)))
					return [me.createGroupActionColumn(strQueueType), me.createActionColumn(strQueueType)];
				else
					return [me.createActionColumn(strQueueType)];
			},
			padding : '12 0 0 0',
			cfgShowFilterInfo : false,
			cfgGridModel : {
				pageSize : pgSize,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : true,
				showCheckBoxColumn : showCheckBoxColumnFlg,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showEmptyRow : false,
				showPager : true,
				showPagerRefreshLink : false,
				minHeight : 100,
				enableColumnHeaderFilter : true,
				enableColumnDrag : true,
				columnHeaderFilterCfg : {
				},
				storeModel : storeModel,
				defaultColumnModel : arrCols,
				fnColumnRenderer : me.columnRenderer,
				groupActionModel : me.createActionBarViewforGrooup(strQueueType),
				fnRowIconVisibilityHandler : function(store, record, jsonData, itmId, maskPosition) {
						return me.isRowIconVisible(store, record, jsonData, itmId, maskPosition)
					},
				handleRowIconClick : function(tableview, rowIndex, columnIndex, btn, event, record) {
					grid.fireEvent('handleRowIconClick', grid, rowIndex, columnIndex, btn.itemId, event, record);
				},
				handleMoreMenuItemClick : function(objGrid, rowIndex, cellIndex, menu, event, record) {
					var data = null;
					if (!Ext.isEmpty(menu.dataParams)) {
						data = menu.dataParams;
					}
					if (!Ext.isEmpty(data)) {
						grid.fireEvent('handleRowIconClick', data.view, data.rowIndex, data.columnIndex,menu.itemId, event, record);
					}
				}
			}
		});
		return groupView
	},
	setGridTitle : function(strQueueType) {
		var me = this, strTitle = null;
		strTitle = arrPmtQueueType[strQueueType];
		if (!Ext.isEmpty(me) && !Ext.isEmpty(strTitle)) {
			me.setTitle(strTitle);			
		}
	},
	reconfigureBatchGrid : function(strQueueType) {
		var me = this, grid = null, gridConfig = null, arrCols = null, actionBar = null, showCheckBoxColumnFlg = true ;
		var queueGridPanel = me.down('panel[itemId="queueGridPanel"]');
		queueGridPanel.removeAll();
		me.setGridTitle(strQueueType);
		gridConfig = me.getGridModel(strQueueType);
		arrCols = me.getColumns(gridConfig.arrColsPref, strQueueType);
		showCheckBoxColumnFlg = me.getShowCheckBoxColumn(strQueueType)
		grid = me.createGrid(showCheckBoxColumnFlg, arrCols, gridConfig.storeModel);
		actionBar = me.createActionBarView(strQueueType);
		if (!Ext.isEmpty(actionBar)) {
			actionBar.parent = grid;
			grid.addDocked({
				xtype : 'panel',
				layout : 'hbox',
				items : [ {
					xtype : 'label',
					text : getLabel('actions', 'Actions') + ':',
					cls : 'font_bold ux-ActionLabel',
					padding : '5 0 0 3'
				}, actionBar ]
			}, 0);
		}
		queueGridPanel.add(grid);
	},
	createGrid : function(showCheckBoxColumnFlg, arrCols, storeModel) {
		var me = this;
		var pgSize = _GridSizeTxn || 10;
		var grid = Ext.create('Ext.ux.gcp.SmartGrid', {
			itemId : 'queueGrid',
			cls : 'ux_panel-transparent-background',
			pageSize : pgSize,
			stateful : false,
			hideRowNumbererColumn : true,
			showCheckBoxColumn : showCheckBoxColumnFlg,
			showEmptyRow : false,
			padding : '0 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 80,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
				return me.isRowIconVisible(store, record, jsonData, itmId, maskPosition)
			},
			handleRowIconClick : function(tableview, rowIndex, columnIndex, btn, event, record) {
				grid.fireEvent('handleRowIconClick', grid, rowIndex, columnIndex, btn.itemId, event, record);
			},
			handleMoreMenuItemClick : function(objGrid, rowIndex, cellIndex, menu, event, record) {
				var data = null;
				if (!Ext.isEmpty(menu.dataParams)) {
					data = menu.dataParams;
				}
				if (!Ext.isEmpty(data)) {
					grid.fireEvent('handleRowIconClick', data.view, data.rowIndex, data.columnIndex, menu.itemId,
							event, record);
				}
			}
		});
		return grid;
	},
	getGroupColumns : function(arrColsPref, strQueueType) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null, objCol1 = null, objCol2 = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.isTypeCode) cfgCol.metaInfo = {
					isTypeCode : cfgCol.isTypeCode
				};
				cfgCol.fnColumnRenderer = function(value, meta, record, rowIndex, colIndex, store, view, colId) {
					return me.columnRenderer(value, meta, record, rowIndex, colIndex, store, view, colId);
				}
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},	

	getColumns : function(arrColsPref, strQueueType) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null, objCol1 = null, objCol2 = null;
		objCol1 = me.createGroupActionColumn(strQueueType);
		if (!Ext.isEmpty(objCol1)) arrCols.push(objCol1);
		objCol2 = me.createActionColumn(strQueueType);
		if (!Ext.isEmpty(objCol2)) arrCols.push(objCol2);
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.isTypeCode) cfgCol.metaInfo = {
					isTypeCode : cfgCol.isTypeCode
				};
				cfgCol.fnColumnRenderer = function(value, meta, record, rowIndex, colIndex, store, view, colId) {
					return me.columnRenderer(value, meta, record, rowIndex, colIndex, store, view, colId);
				}
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createActionColumn : function(strQueueType) {
		var me = this, arrTemp = null, arrActions = null, objActionCol = null, columnWidth = 40;
		if (!Ext.isEmpty(strQueueType))
			arrTemp = mapRowActions[strQueueType];
		if (!Ext.isEmpty(arrTemp) && arrTemp.length > 0) {
			arrActions = new Array();
			for (var i = 0; i < arrTemp.length; i++) {
				if (mapRowActionModel[arrTemp[i]]) {
					arrActions.push(mapRowActionModel[arrTemp[i]]);
				}
			}
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : columnWidth,
				align : 'right',
				locked : true,
				sortable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				items : arrActions,
				visibleRowActionCount : 1
			};
		}
		return objActionCol;
	},
	createGroupActionColumn : function(strQueueType) {
		var me = this, arrTemp = null, arrActions = null, cfgAction = null, objActionCol ={};
		var arrGroupAction = me.getAvailableGroupActions('R', strQueueType);
		if (!Ext.isEmpty(arrGroupAction) && arrGroupAction.length > 0) {
			arrActions = new Array();
			for (var i = 0; i < arrGroupAction.length; i++) {
				cfgAction = mapQueueActionModel[strQueueType]
						? mapQueueActionModel[strQueueType][arrGroupAction[i]]
						: null;
				if (cfgAction) {
					cfgAction = me.cloneObject(cfgAction);
					arrActions.push(cfgAction);
				}
			}
			objActionCol = {
				colType : 'actioncontent',
				colId : 'groupAction',
				width : 120,
				align : 'right',
				locked : true,
				sortable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				items : arrActions,
				visibleRowActionCount : 1
			};
		}
		return objActionCol;
	},
	getGridModel : function(strQueueType) {
		var me = this;
		var objConfigMap = null;
		var arrColsPref = null;
		if(!Ext.isEmpty(paymentPref))
			arrColsPref = paymentPref;
		else
			arrColsPref = mapQueueGridColumn[strQueueType] || [];
		objConfigMap = {
			"arrColsPref" : arrColsPref,
			"storeModel" : gridStoreModel
		};
		objConfigMap["storeModel"]["proxyUrl"] = 'getPaymentInstQueryData.srvc';
		return objConfigMap;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = "";
		if (colId === "col_instAmount" && Ext.isEmpty(value) && !Ext.isEmpty(record.data.totalInstAmount)) {
			strRetValue = !Ext.isEmpty(record.raw.ccySymbol)? record.raw.ccySymbol.concat(setDigitAmtGroupFormat(record.data.totalInstAmount)): setDigitAmtGroupFormat(record.data.totalInstAmount);	
		}
		else if(colId === "col_instAmount" && !Ext.isEmpty(value))
		{
			strRetValue = !Ext.isEmpty(record.raw.ccySymbol)? record.raw.ccySymbol.concat(setDigitAmtGroupFormat(value)): setDigitAmtGroupFormat(value);
		}	
		else {
			strRetValue = value;
		}
		return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var me = this;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = me.strDefaultMask;
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = me.intMaskSize;
			if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)){
				buttonMask = jsonData.d.__buttonMask;
			}
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition)) return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
		}
		return retValue;
	},
	refreshData : function() {
		var me = this, grid = me.down('smartgrid[itemId="queueGrid"]');
		if (grid) grid.refreshData();
	},
	refreshGroupView : function() {
		var me = this, group = me.down('groupView');
		if (group) group.refreshData();
	},
	enableDisableGroupActions : function(actionMask) {
		var me = this;
		var actionBar = me.down('toolbar[itemId="groupActionBar"]')
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
				strBitMapKey = parseInt(item.maskPosition, 10) - 1;
				if (!Ext.isEmpty(strBitMapKey)) {
					blnEnabled = isActionEnabled(actionMask, strBitMapKey);
					item.setDisabled(!blnEnabled);
				}
			});
		}
	},
	getGrid : function() {
		var me = this;
		return me.down('smartgrid');
	},
	getShowCheckBoxColumn : function(strQueueType) {
		return arrShowCheckBoxColumn[strQueueType];
	}
});