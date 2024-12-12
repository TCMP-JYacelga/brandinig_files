Ext.define('GCP.view.VirtualAccMaintDtlView', {
	extend : 'Ext.container.Container',
	xtype : 'virtualAccMaintenanceDtlView',
	requires : [ 'Ext.container.Container', 'Ext.ux.gcp.GroupView', 'GCP.view.VirtualAccMaintDtlFilterView' ],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [ groupView ];
		me.callParent(arguments);
		$(document).on('OnSaveRestoreGrid', function() {
			me.refreshGridData(me);
		});
	},
	createGroupView : function() {
		var me = this, groupView = null;
		var arrColumnSetting;
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/collections/receivableQueryT7/data/groupBy.json?$filterscreen=groupViewFilter',
			cfgParentCt : me,
			cls : 't7-grid',
			itemId : 'gridEntryGroupView',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : null,
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgSubGroupCode : null,
			cfgGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [ {
					xtype : 'virtualAccMaintenanceDtlFilterView'
				} ],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [ me.createGroupActionColumn() ];
			},
			cfgGridModel : {
				pageSize : 10,
				rowList : _AvailableGridSize,
				stateful : false,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				/* heightOption : objGridSetting.defaultGridSize, */
				showCheckBoxColumn : (mode !== 'VERIFY' && mode !== 'VIEW') ? true : false,
				checkBoxColumnWidth : 39,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				multiSort : false,
				showPagerRefreshLink : false,
				storeModel : {
					fields : [ 'virtualAccNo', 'partyCode', 'partyDesc', 'addInfo1', 'addInfo2', 'addInfo3', 'status', 'addInfo4', 'addInfo5',
							'__metadata', 'identifier', 'history', 'requestStateDesc', 'virtualAccName', 'clientCreditAccNo',
							'reference', 'uniqueId', 'maintainAcctLedger', 'fundVirtualAccount','fundBasedOn',  'fundAmount', 'fundPercentage' ],
					proxyUrl : 'services/virtualAccountDtlGridList.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : VIRTUAL_ACCOUNT_ENTRY_COLUMNS,
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer

			}/*,listeners : {
				'afterrender' : function(ct) {
					var objCt = ct
							.down('container[itemId="navigationContainer"]');
					if (objCt) {
						objCt.insert(0, {
									xtype : 'container',
									id : 'emptyCt',
									padding : '0 0 0 20',
									listeners : {
										'render' : function() {
											if (me.isViewOnly !== true)
												$('#virtualAccActionCt')
														.appendTo($('#emptyCt'));
												
										}
									}
								});
					}
				}
			}*/
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		/*
		 * if (colId == 'col_billPayType') { if (value == 'M') { strRetValue = getLabel('manual', 'Manual'); } else { strRetValue =
		 * getLabel('automatic', 'Automatic'); } }
		 */
		if (colId == 'col_fundAmount')
		{
			if(strRetValue == '' || strRetValue == null )
			{
				strRetValue = 0
			}
			strRetValue = ccySymbol+' '+strRetValue.toFixed(2);
		}		
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = [];
		if (mode !== 'VERIFY' && mode !== 'VIEW'){
			arrActions = (arrAvaliableActions || [ 'Enable', 'Disable' ]);
		
			var objActions = {
				'Enable' : {
					actionName : 'enable',
					isGroupAction : true,
					itemText : getLabel('userMstActionEnable', 'Enable'),
					maskPosition : 3
				},
				'Disable' : {
					actionName : 'disable',
					itemText : getLabel('userMstActionSuspend', 'Suspend'),
					maskPosition : 4
				}
			};
	
			for (var i = 0; i < arrActions.length; i++) {
				if (!Ext.isEmpty(objActions[arrActions[i]])) {
					retArray.push(objActions[arrActions[i]]);
				}
			}
		}
		return retArray;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 4;
		var maskArray = [];
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition)) {
			return retValue;
		}
		retValue = isActionEnabled(actionMask, bitPosition);
		return retValue;
	},
	createGroupActionColumn : function() {
		if (mode === 'VERIFY' || mode === 'VIEW') {
			var arrRowActions = [ {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				itemLabel : getLabel('viewToolTip', 'View Record'),
				maskPosition : 2
			} ];
		}
		else {
			var arrRowActions = [ {
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Modify Record'),
				itemLabel : getLabel('editToolTip', 'Modify Record'),
				maskPosition : 1
			}, {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				itemLabel : getLabel('viewToolTip', 'View Record'),
				maskPosition : 2
			}, {
				itemId : 'enable',
				itemCls : 'grid-row-action-icon icon-enable',
				toolTip : getLabel('enableToolTip', 'Enable Record'),
				itemLabel : getLabel('enableToolTip', 'Enable Record'),
				maskPosition : 3
			}, {
				itemId : 'disable',
				itemCls : 'grid-row-action-icon icon-disable',
				toolTip : getLabel('disableToolTip', 'Suspend Record'),
				itemLabel : getLabel('disableToolTip', 'Suspend Record'),
				maskPosition : 4
			} ];
		}
		var objActionCol = {
			colId : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions || [],
			visibleRowActionCount : 1
		};
		return objActionCol;
	},

	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (mode !== 'VERIFY' || mode !== 'VIEW') {
			if (!Ext.isEmpty(availableActions)) {
				for (var count = 0; count < availableActions.length; count++) {
					switch (availableActions[count]) {
						case 'Enable':
							itemsArray.push({
								text : getLabel('', 'Enable'),
								actionName : 'enable',
								itemId : 'enable',
								maskPosition : 3

							});
							break;
						case 'Disable':
							itemsArray.push({
								text : getLabel('suspend', 'Suspend'),
								actionName : 'disable',
								itemId : 'disable',
								maskPosition : 4

							});
							break;
						default:
							break;

					}
				}
			}
		}
		return itemsArray;
	},
	refreshGridData : function(me) {
		me.down('smartgrid').refreshData();
	},
	getGrid : function() {
		var me = this;
		var groupView = me.down('groupView[itemId="gridEntryGroupView"]');
		var grid = null;
		if (groupView) grid = groupView.getGrid();
		return grid;
	}
});