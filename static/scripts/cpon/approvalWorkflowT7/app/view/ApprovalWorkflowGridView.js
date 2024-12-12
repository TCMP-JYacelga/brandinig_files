Ext.define('GCP.view.ApprovalWorkflowGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.container.Container','GCP.view.ApprovalWorkflowFilterView', 'Ext.ux.gcp.GroupView'],
	xtype : 'approvalWorkflowGridView',
	autoHeight : true,
	width : '100%',
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		this.items = [groupView];
		this.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupByPref = {};
		var objLocalPageSize = '',objLocalSubGroupCode = null;
/*		if (objApprovalWrkPref) {
			var objJsonData = Ext.decode(objApprovalWrkPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}*/
		
		if (objApprovalWrkPref) {
			var objJsonData = Ext.decode(objApprovalWrkPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (APPR_WRKFLOW_GENERIC_COLUMN_MODEL || '[]');
		}
		if(objApprovalWrkLocalPref){
			var objLocalData = Ext.decode(objApprovalWrkLocalPref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			itemId : 'approvalMatrixGroupView',
			// cfgGroupByUrl
			// :'static/scripts/commonmst/userCategory/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/approvalMatrixWorkflow/groupBy.json?$filterGridId=GRD_ADM_APPWORKFLOW',
			cfgSummaryLabel : getLabel('workflowList', 'WorkflowList'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode||null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode||null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cls : 't7-grid',
			padding : '12 0 0 0',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			//cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			enableQueryParam:false,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'approvalWorkflowFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgParentCt : me,
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,			
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,				
				minHeight : 100,
				cfgShowRefreshLink : false,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true
					// filters : [{
					// type : 'list',
					// colId : 'actionStatus',
					// options : arrActionColumnStatus || []
					// }]
				},
				storeModel : {
					fields : ['defaultAxmcode', 'isSubmitted',
							'requestStateDesc', '__metadata', 'history',
							'identifier', 'clientId', 'rClientDesc', 'axmName'],
					proxyUrl : 'services/approvalMatrixWorkflowList.json',
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
						.getColumnModel(APPR_WRKFLOW_GENERIC_COLUMN_MODEL),
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
		var arrActions = (arrAvaliableActions || ['Submit', 'Approve',
				'Reject', 'Enable', 'Disable', 'Discard']);
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('userMstActionSubmit', 'Submit'),
				maskPosition : 5
			},
			'Approve' : {
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
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('userMstActionDiscard', 'Discard'),
				maskPosition : 10
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
		if (colId === 'col_axmName') {
			if ((!Ext.isEmpty(record.get('defaultAxmcode')) && record.get('defaultAxmcode') == 'MAKERCHECKER')
					|| (!Ext.isEmpty(record.get('axmName')) && record.get('axmName') == 'MAKERCHECKER')) {
				strRetValue = getLabel('makerchecker', 'Maker-Checker');
			} else
				{
					if (Ext.isEmpty(record.get('defaultAxmcode')))
						strRetValue = getLabel('none', 'None');
					else
						strRetValue = value;
				}
		} else
			strRetValue = value;
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
			var submitResult = (reqState === 0 );
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
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit', 'Approve', 'Reject', 'Enable',
				'Disable', 'Discard'];
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
				}

			}
		}
		return itemsArray;
	}

});