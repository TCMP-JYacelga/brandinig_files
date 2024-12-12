Ext.define('GCP.view.UserLimitView', {
	extend : 'Ext.container.Container',
	xtype : 'userLimitView',
	requires : ['Ext.container.Container', 'GCP.view.UserLimitTitleView',
			'GCP.view.UserLimitFilterView', 'GCP.view.UserLimitGridView','Ext.ux.gcp.GroupView'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		this.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objReceiverMstPref) {
			var objJsonData = Ext.decode(objReceiverMstPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (USER_LIMIT_GENERIC_COLUMN_MODEL || '[]');
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			itemId : 'roleGroupView',
			cfgGroupByUrl : 'services/grouptype/userCategory/groupBy.json?$filterscreen=groupViewFilter&$filterGridId=GRD_PAY_RECPAR',
			cfgSummaryLabel : getLabel ('limitProfile', 'Limit Profile'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgParentCt : me,
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cls:'t7-grid',
			cfgShowAdvancedFilterLink : false,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'userLimitFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || 10,
				rowList : _AvailableGridSize,
				stateful : false,
				enableQueryParam:false,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
						fields : ['history', 'clientDescription','profileName', 'ccyCode','clMaxNoTrfAmt','periodType',
							'dlyTrfDebitLimitAmt', 'dlyTrfCreditLimitAmt','clTrfCreditLimitAmt','clTrfDebitLimitAmt',
							'moduleDesc', 'requestStateDesc', 'identifier','warningCreditLimitAmt','warningDebitLimitAmt',
							'__metadata', 'profileId','profileType'],
					proxyUrl : 'cpon/userLimitProfileMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(USER_LIMIT_GENERIC_COLUMN_MODEL),
				fnColumnRenderer : me.columnRenderer,
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 
				'Discard', 'Accept','Reject', 'Enable', 'Disable']);
		var objActions = {
				'Submit' : {
					actionName : 'submit',
					isGroupAction : true,
					itemText : getLabel('userMstActionSubmit', 'Submit'),
					maskPosition : 5
				},
				'Reject' : {
					actionName : 'reject',
					// itemCls : 'icon-button icon-reject',
					itemText : getLabel('userMstActionReject', 'Reject'),
					maskPosition : 7

				},
				'Discard' : {
					actionName : 'discard',
					// itemCls : 'icon-button icon-discard',
					itemText : getLabel('userMstActionDiscard', 'Discard'),
					maskPosition : 10
				},
				'Accept' : {
					actionName : 'accept',
					// itemCls : 'icon-button icon-discard',
					itemText : getLabel('userMstActionApprove', 'Approve'),
					maskPosition : 6
				},
				'Enable' : {
					actionName : 'enable',
					// itemCls : 'icon-button icon-revarsal',
					itemText : getLabel('userMstActionEnable', 'Enable'),
					maskPosition : 8
				},
				'Disable' : {
					actionName : 'disable',
					// itemCls : 'icon-button icon-revarsal',
					itemText : getLabel('userMstActionDisable', 'Suspend'),
					maskPosition : 9
				}
		};
		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_dtlCount')
		{
			strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
		}
		else if(colId === 'col_dlyTrfDebitLimitAmt' || colId === 'col_dlyTrfCreditLimitAmt')
		{
			 if(typeof value != 'undefined' && value)
				 strRetValue = setDigitAmtGroupFormat(value);
		}
		else 
		{
			strRetValue = value;
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},
	getColumnModel : function(arrCols) {
		var me = this;
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit'),
			itemLabel : getLabel('editToolTip', 'Edit'),
			maskPosition : 2
			},{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 3
			},{
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			toolTip : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit','Discard','Approve','Reject','Enable','Disable'];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : colItems,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
				case 'Submit' :
					itemsArray.push({
						text : getLabel('userMstActionSubmit', 'Submit'),
						actionName : 'submit',
						itemId : 'submit',
						maskPosition : 5
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
					});
					break;
				case 'Discard' :
					itemsArray.push({
						text : getLabel('userMstActionDiscard', 'Discard'),
						actionName : 'discard',
						itemId : 'discard',
						maskPosition : 10
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
					break;
				case 'Approve' :
					itemsArray.push({
						text : getLabel('userMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
					});
					break;
				case 'Reject' :
					itemsArray.push({
						text : getLabel('userMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
					break;
				case 'Enable' :
					itemsArray.push({
						text : getLabel('userMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
					break;
				case 'Disable' :
					itemsArray.push({
						text : getLabel('userMstActionDisable', 'Suspend'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
							/**
							 * fnVisibilityHandler : me.isRowIconVisible,
							 * fnClickHandler : function(grid, rowIndex,
							 * columnIndex, btn, event, record) {
							 * me.handleRowActionClick(me, grid, rowIndex,
							 * columnIndex, btn, event, record); }
							 */
						});
					break;
				}
			}
		}
		return itemsArray;
	}
});