Ext.define('GCP.view.VirtualAccMaintSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'virtualAccMaintenanceSummaryView',
	requires : [ 'Ext.container.Container', 'Ext.ux.gcp.GroupView', 'GCP.view.VirtualAccMaintFilterView' ],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [ groupView ];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this, groupView = null;
		var objGroupByPref = {};
		var objLocalPageSize = null;
		var objLocalSubGroupCode = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objVirtualAccountPref) {
			var objJsonData = Ext.decode(objVirtualAccountPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences && objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols ? objJsonData.d.preferences.ColumnSetting.gridCols
					: (VIRTUAL_ACCOUNT_COLUMNS || '[]');
		}

		if (objSaveLocalStoragePref) {
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			// cfgGroupByUrl : 'services/grouptype/billerRegistrationSummary/groupBy.json?$filterGridId=GRD_PAY_BILLERREG',
			cfgGroupByUrl : 'services/grouptype/virtualAccountSummary/groupBy.json?$filterGridId=GRD_VIRTUAL_ACNT',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgFilterModel : {
				cfgContentPanelItems : [ {
					xtype : 'virtualAccMaintenanceFilterView'
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
				pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				/* heightOption : objGridSetting.defaultGridSize, */
				checkBoxColumnWidth : 39,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : [ 'clientId', 'vacategory', 'clientCreditAccountNo', 'clientConstantValue', 'totalAccounts',
							'startNumber', 'endNumber', 'requestStateDesc', '__metadata', 'identifier', 'history','issuanceNumber' ],
					proxyUrl : 'services/virtualAccountGridList.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : VIRTUAL_ACCOUNT_COLUMNS,
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer

			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		if (colId == 'col_fundAmount')
			{
				if(strRetValue == '' || strRetValue == null )
				{
					strRetValue = 0
				}
				strRetValue = ccySymbol+' '+strRetValue.toFixed(2);
			}
		/*
		 * if (colId == 'col_billPayType') { if (value == 'M') { strRetValue = getLabel('manual', 'Manual'); } else { strRetValue =
		 * getLabel('automatic', 'Automatic'); } }
		 */
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || [ 'Submit', 'Discard', 'Accept', 'Reject', 'Enable', 'Disable' ]);
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('userMstActionSubmit', 'Submit'),
				maskPosition : 5
			},
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('userMstActionDiscard', 'Discard'),
				maskPosition : 10
			},
			'Accept' : {
				actionName : 'accept',
				itemText : getLabel('userMstActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('userMstActionReject', 'Reject'),
				maskPosition : 7

			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]])) {
				retArray.push(objActions[arrActions[i]]);
			}
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		}
		else
			if (maskPosition === 7 && retValue) {
				retValue = retValue && isSameUser;
			}
			else
				if (maskPosition === 2 && retValue) {
					var reqState = record.raw.requestState;
					var submitFlag = record.raw.isSubmitted;
					var validFlag = record.raw.validFlag;
					var isDisabled = (reqState === 3 && validFlag == 'N');
					var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
					retValue = retValue && (!isDisabled) && (!isSubmitModified);
				}
				else
					if (maskPosition === 10 && retValue) {
						var reqState = record.raw.requestState;
						var submitFlag = record.raw.isSubmitted;
						var submitResult = (reqState === 0 && submitFlag == 'Y');
						retValue = retValue && (!submitResult);
					}
					else
						if (maskPosition === 8 && retValue) {
							var validFlag = record.raw.validFlag;
							var reqState = record.raw.requestState;
							retValue = retValue && (reqState == 3 && validFlag == 'N');
						}
						else
							if (maskPosition === 9 && retValue) {
								var validFlag = record.raw.validFlag;
								var reqState = record.raw.requestState;
								retValue = retValue && (reqState == 3 && validFlag == 'Y');
							}
		return retValue;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = [ 'Submit', 'Discard', 'Approve', 'Reject' ];
		var arrRowActions = [ {
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Modify Record'),
			itemLabel : getLabel('editToolTip', 'Modify Record'),
			maskPosition : 2
		}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 3
		}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			toolTip : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
		} ];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},

	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Submit':
						itemsArray.push({
							text : getLabel('userMstActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 5

						});
						break;
					case 'Discard':
						itemsArray.push({
							text : getLabel('userMstActionDiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 10

						});
						break;
					case 'Approve':
						itemsArray.push({
							text : getLabel('userMstActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 6

						});
						break;
					case 'Reject':
						itemsArray.push({
							text : getLabel('userMstActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 7

						});
						break;
					default:
						break;

				}

			}
		}
		return itemsArray;
	}
});