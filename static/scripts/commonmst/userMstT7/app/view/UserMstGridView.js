Ext.define('GCP.view.UserMstGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.UserMstFilterView'],
	xtype : 'userMstGridView',
	// cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	autoHeight : true,
	//width : '100%',
	parent : null,

	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		
		/*if (objPreference) {
			var objJsonData = Ext.decode(objPreference);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}*/
		
		if (objPreference) {
			var objJsonData = Ext.decode(objPreference);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (USER_GENERIC_COLUMN_MODEL || '[]');
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
			cfgGroupByUrl : 'services/grouptype/userMaster/groupBy.json?$filterscreen=userMaster&$filterGridId=GRD_ADM_USERMST',
			cfgSummaryLabel : getLabel('headUser','USER'),
			cfgGroupByLabel : getLabel('groupedBy','Grouped By'),
			cfgGroupCode : objGeneralSetting.defaultGroupByCode||null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,			
			cls : 't7-grid',
			cfgShowFilter : true,
			//cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			//checkBoxColumnWidth : 36,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'userMstFilterView'
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
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				heightOption : objGridSetting.defaultGridSize,				
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				cfgShowRefreshLink : false,
				checkBoxColumnWidth : 40,
				hideRowNumbererColumn : true,
				enableQueryParam:false,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,	
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true
//					filters : [{
//								type : 'list',
//								colId : 'actionStatus',
//								options : arrActionColumnStatus || []
//							}]
				},
				storeModel : {
					fields : ['history', 'usrCode', 'usrDescription',
								'assignedClients', 'requestStateDesc', 'usrCategory','makerId','checkerId',
								'isSubmitted', 'usrAcross', 'usrEmailAddr',
								'identifier', '__metadata', 'corporationDesc','checkLoginStatus','makerStamp','userDisableFlag',
								'usrFirstName','usrLastName','department','usrLastLogon','isSelfAdmin','usrLoggedOn','ssoLoginId',
								'usrCategory','usrCode','recordKeyNo','clientCode','corporationId','authSyncStatus'],
					proxyUrl : 'services/userMasterList.json',
					rootNode : 'd.userAdminList',
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
				groupActionModel : me.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : me.getColumnModel(USER_GENERIC_COLUMN_MODEL),
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
		return groupView;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 18;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true , blnUnlock = false, isUserLoggedOn = false , isDisabled = false, isUserDisabled = false;
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

		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if (record.raw.usrLoggedOn == 'Y') {
				isUserLoggedOn = true;
		}	
			if (record.raw.validFlag != 'Y') {
						isDisabled = true;
					}
		if(record.raw.userDisableFlag != 'N')	
			isUserDisabled  = true;
		
		if(( CLIENTSSO == 'N' || autousrcode != 'PRODUCT') && (isUserLoggedOn && !isUserDisabled) && !isDisabled)
			blnUnlock = true;
		
		if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var submitFlag = record.raw.isSubmitted;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 8 || submitFlag != 'Y' || reqState == 4 || reqState == 5);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		
		 else if( maskPosition === 11 && retValue )  //clear
			{
				retValue = retValue && ( CLIENTSSO == 'N' || autousrcode != 'PRODUCT') && (isUserLoggedOn && !isUserDisabled)  &&  !isDisabled ;
			}
		else if( maskPosition === 12 && retValue )  // reset
			{	
				retValue = retValue && ( CLIENTSSO == 'N') && !isDisabled && !blnUnlock;
			}
		
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
			if(Ext.isEmpty(value) || (typeof(value)=="string" && value.indexOf("null")!=-1)){
				strRetValue = "";
			}else if(colId === 'col_makerStamp'){
				if(!Ext.isEmpty(value)){
					var arrDateString = value.split(" ");
					strRetValue = arrDateString[0];
				}
			}else if(colId === 'col_authSyncStatus')
	        {
	            strRetValue = getLabel('authSyncStatus.'+value, '');
	        }
			else{
				strRetValue = value;
			}

			if(colId === 'col_usrLoggedOn')
			{
				if(record.data.usrLoggedOn === 'Y')
				{
					strRetValue = getLabel('Y', 'Yes');
				}
				else if(record.data.usrLoggedOn === 'N')
				{
					strRetValue = getLabel('N', 'No');
				}
			}
			
			if(colId === 'col_isSelfAdmin')
			{
				if(record.data.isSelfAdmin === 'Yes')
				{
					strRetValue = getLabel('Y', 'Yes');
				}
				else if(record.data.isSelfAdmin === 'No')
				{
					strRetValue = getLabel('N', 'No');
				}
			}

			if(colId === 'col_userDisableFlag')
			{
				if(record.data.userDisableFlag === 'Y')
				{
					strRetValue = getLabel('lblDisabledStatus', 'Disabled');
				}
				else if(record.data.userDisableFlag === 'N')
				{
					strRetValue = getLabel('lblActiveStatus', 'Active');
				}
				else if(record.data.userDisableFlag === 'D')
				{
					strRetValue = getLabel('lblDormantStatus', 'Dormant');
				}
				else if(record.data.userDisableFlag === 'M')
				{
					strRetValue = getLabel('lblMFADisabledStatus', 'MFA Disabled');
				}
			}
		stylizeCell(value, meta, record.data, rowIndex, colIndex);
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 'Discard',
		 'Approve','Reject', 'Enable','Disable','clearUser','resetUser']);
		var objActions = {
			'Submit' : {
				/**
				 * @requires Used while creating the action url.
				 */
				actionName : 'submit',
				/**
				 * @optional Used to display the icon.
				 */
				// itemCls : 'icon-button icon-submit',
				/**
				 * @optional Defaults to true. If true , then the action will
				 *           considered in enable/disable on row selection.
				 */
				isGroupAction : true,
				/**
				 * @optional Text to display
				 */
				itemText : getLabel('userMstActionSubmit', 'Submit'),
				/**
				 * @requires The position of the action in mask.
				 */
				maskPosition : 5
				/**
				 * @optional The position of the action in mask.
				 */
				// fnClickHandler : handleRejectAction
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('userMstActionDiscard', 'Discard'),
				maskPosition : 10
			},
			'Approve' : {
				actionName : 'accept',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('userMstActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('userMstActionReject', 'Reject'),
				maskPosition : 7
			},
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('userMstActionEnable', 'Enable'),
				maskPosition : 8
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('userMstActionDisable', 'Suspend'),
				maskPosition : 9
			},
			'clearUser' :
				{
					actionName : 'clearUser',
					itemText : getLabel('userMstActionClear', 'Unlock'),
					maskPosition : 11
				},
			'resetUser' :
				{
					actionName : 'resetUser',
					itemText : getLabel('userMstActionReset', 'Reset User'),
					maskPosition : 12
				}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit'),
			itemLabel : getLabel('editToolTip', 'Edit'),
			maskPosition : 2
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 3
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader: getLabel('action', 'Action'),
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
							text : getLabel('userMstActionDiscard',
									'Discard'),
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
							actionName : 'accept',
							itemId : 'accept',
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
							text : getLabel('userMstActionReject',
									'Reject'),
							actionName : 'reject',
							itemId : 'reject',
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
							actionName : 'enable',
							itemId : 'enable',
							maskPosition : 8
						});
						break;
					case 'Disable' :
						itemsArray.push({
								text : getLabel('userMstActionDisable','Suspend'),
								actionName : 'disable',
								itemId : 'disable',
								maskPosition : 9
							});
						break;
					case 'Clear User' :
							itemsArray.push({
								text : getLabel('userMstActionClear', 'Unlock'),
								actionName : 'clearUser',
								itemId : 'clearUser',
								maskPosition : 11								
							});
						break;
					case 'Reset User' :
							itemsArray.push({
								text : getLabel('userMstActionReset', 'Reset User'),
								actionName : 'resetUser',
								itemId : 'resetUser',
								maskPosition : 12																
							});
						break;	
				}
			}
		}
		return itemsArray;
	}
});