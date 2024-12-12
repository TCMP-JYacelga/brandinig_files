Ext.define('GCPA.view.EndClientView', {
	extend : 'Ext.container.Container',
	xtype : 'endClientView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCPA.view.EndClientFilterView'],
	initComponent: function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this,
			groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objEndClientPref) {
			var objJsonData = Ext.decode(objEndClientPref);
			//objGroupByPref = objJsonData.d.preferences.gridView || {};
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:(END_CLIENT_COLUMNS|| '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/endClientProfile/groupBy.json?$filterGridId=GRD_TPFA_ENDCLIENT',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'endClientFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : true,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				/*heightOption : objGridSetting.defaultGridSize,*/
				checkBoxColumnWidth : 40,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : [ 'closureRequestStateDesc','personTitle','firstName','lastName','trustName','tradeName','registeredCompanyName','accountId','requestStateDesc', '__metadata','identifier','agentCode','history','clientCategory','beanName','endClientDesc','recordKeyNo','viewState'],
					proxyUrl : 'services/endClientMst.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(END_CLIENT_COLUMNS),
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {

		var strRetValue = value;

			if(colId === 'col_clientCategory')
			{
				if(record.data.clientCategory === 'INDIVIDUAL')
				{
					strRetValue = record.data.personTitle + " " + record.data.firstName+" "+ record.data.lastName;
				}
				else if(record.data.clientCategory === 'TRUST' )
				{
					strRetValue = record.data.trustName;
				}
				else if(record.data.clientCategory === 'COMPANY' )
				{
					strRetValue = record.data.registeredCompanyName;
				}
				else if(record.data.clientCategory === 'PARTNERSHP' )
				{
					strRetValue = record.data.tradeName;
				}
				else strRetValue="";
				
			}
			
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 
				'Discard', 'Accept','Reject','Close']);
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('userMstActionSubmit', 'Submit'),
				maskPosition : 5
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
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('userMstActionReject', 'Reject'),
				maskPosition : 7

			},
			'Close' : {
				actionName : 'close',
				// itemCls : 'icon-button icon-revarsal',
				itemText : getLabel('userMstActionClose', 'Close'),
				maskPosition : 8
			}
			
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
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
		var editMode = record.raw.editMode;
		if ((maskPosition === 6 && retValue)) 
		{	
			isActionAppl = validateActionButtons(editMode);			
			retValue = retValue && isSameUser && isActionAppl;
		} 
		else if (maskPosition === 7 && retValue) 
		{
			isActionAppl = validateActionButtons(editMode);	
			retValue = retValue && isSameUser && isActionAppl;
		} 
		else if (maskPosition === 2 && retValue) 
		{
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			isActionAppl = validateActionButtons(editMode);
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified) && (isActionAppl);
		} 
		else if (maskPosition === 10 && retValue) 
		{

			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			isActionAppl = validateActionButtons(editMode);
			retValue = retValue && (!submitResult) && (isActionAppl);
		}
		else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		if ((maskPosition === 5 && retValue)) 
		{	
			isActionAppl = validateActionButtons(editMode);			
			retValue = retValue  && isActionAppl;
		}
		return retValue;
	},
	getColumnModel : function(arrCols) {
	if(isClientUser())
		{
		for(var i = 0; i < arrCols.length; i++) {
			if(arrCols[i].colId === "agentCode") {
				arrCols.splice(i, 1);
				break;
			}
		}
		}
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit', 'Discard', 'Approve', 'Reject',
				'Close'];
		var arrRowActions = [{
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
			// fnVisibilityHandler : isIconVisible
		// fnClickHandler : showHistory
		}];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colHeader: getLabel('actions', 'Actions'),
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
					case 'Close' :
						itemsArray.push({
							text : getLabel('userMstActionClose', 'Close'),
							itemId : 'close',
							actionName : 'close',
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
											
				}

			}
		}
		return itemsArray;
	}
});

function validateActionButtons(editMode)
{
	var isActionAppl;
	if(editMode == '' || editMode == 'undefined')
	{
		isActionAppl = true;
	}
	else if(editMode == 'B' && strEntityTYpe == '1')
	{
		isActionAppl = false;
	}
	else if(editMode == 'C' && strEntityTYpe == '0')
	{
		isActionAppl = false;
	}
	else if(editMode == 'X')
	{
		isActionAppl = false;
	}
	else
	{
		isActionAppl = true;
	}
	return true;
}

