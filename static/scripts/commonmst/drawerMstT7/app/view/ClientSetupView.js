Ext.define('GCP.view.ClientSetupView', {
	extend : 'Ext.container.Container',
	xtype : 'clientSetupView',
	requires : ['Ext.container.Container','GCP.view.ClientSetupFilterView', 'Ext.ux.gcp.GroupView'],
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
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		
		if (objMandateMstPref) {
			var objJsonData = Ext.decode(objMandateMstPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (USER_CATEGORY_GENERIC_COLUMN_MODEL || '[]');
		}
		
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			itemId : 'roleGroupView',
			// cfgGroupByUrl :'static/scripts/commonmst/userCategory/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/userCategory/groupBy.json?$filterscreen=groupViewFilter&$filterGridId=GRD_REC_PAYRPAR',
			cfgSummaryLabel : 'Payer List',
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cls:'t7-grid',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'clientSetupFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,  
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				enableQueryParam:false,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
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
					fields : ['clientId','drawerName', 'drawerLocalName', 'clientDesc', 'drawerId','payerAcctNmbr',
							 'beanName', 'primaryKey','history','identifier','payerAccountCcy',
							'requestStateDesc', 'parentRecordKey', 'version',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : 'cpon/drawerMaster.json',
					    rootNode : 'd.profile',
					    totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example
				 * The example for groupActionModel as below : 
				 * 	[{
				 *	  //@requires Used while creating the action url.
				 *		actionName : 'submit',
				 *	  //@optional Used to display the icon.
				 *		itemCls : 'icon-button icon-submit',
				 *	  //@optional Defaults to true. If true , then the action will considered
				 *	            in enable/disable on row selection.
				 *		isGroupAction : false,
				 *	  //@optional Text to display
				 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me
						.getColumnModel(USER_CATEGORY_GENERIC_COLUMN_MODEL),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				fnColumnRenderer : me.columnRenderer,
				/**
				 * @cfg{Function} fnSummaryRenderer Used as default column
				 *                summary renderer for all columns if
				 *                fnSummaryRenderer is not passed to the grids
				 *                column model
				 */
				// fnSummaryRenderer : function(value, summaryData, dataIndex,
				// rowIndex, colIndex, store, view, colId) {
				// },
				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * 
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) { 
				 * 	return true;
				 *}
				 * 
				 * @param {Ext.data.Store}
				 *            store The grid data store
				 * @param {Ext.data.Model}
				 *            record The record for current row
				 * @param {JSON}
				 *            jsonData The response json data
				 * @param {String}
				 *            iconName The name of the icon
				 * @param {Number}
				 *            maskPosition The position of the icon action in
				 *            bit mask
				 * @return{Boolean} Returns true/false
				 */
				fnRowIconVisibilityHandler : me.isRowIconVisible

			}
		});
		return groupView
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
				itemText : getLabel('userMstActionDisable', 'Disable'),
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
		if (colId === 'col_clientType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = getLabel('corporation', 'Corporation');
				} else {
					strRetValue = getLabel('subsidiary', 'Subsidiary');
				}
			}
		} else if (colId === 'col_variance') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('brandingPkgName'))) {
					strRetValue = Math.floor((Math.random() * 100) + 1);
				}
			}
		} else if (colId === 'col_corporationName') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue = record.get('clientName');
				} else {
					strRetValue = value;
				}
			}
		} else if (colId === 'col_bankPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_clientPercent') {
			strRetValue = Math.floor((Math.random() * 100) + 1);
		} else if (colId === 'col_copyBy') {
			strRetValue = '<a class="underlined" onclick="showClientPopup(\''
					+ record.get('brandingPkgName') + '\')">' + value + '</a>';
		} else {
			strRetValue = value;
		}

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
		var isActionAppl = '';
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
			retValue = retValue && (reqState == 3 && validFlag == 'N');
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
		var me = this;
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
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
			colHeader : getLabel('actions','Actions'),
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
							text : getLabel('userMstActionDisable', 'Disable'),
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
