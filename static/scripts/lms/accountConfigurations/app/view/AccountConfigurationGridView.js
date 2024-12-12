Ext.define('GCP.view.AccountConfigurationGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.AccountConfigurationFilterView'],
	xtype : 'clientSetupGridView',
	width : '100%',
	cls:'gradiant_back',
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
		var objGroupByPref = {}, objGridSetting = {};
		if (objAccountConfigurationPref) {
			var objJsonData = Ext.decode(objAccountConfigurationPref);
		    objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		    objGridSetting = objJsonData.d.preferences.GridSetting || {};
		    arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: ACC_CONF_DEFAULT_COLUMN_MODEL || [];
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			// cfgGroupByUrl :
			// 'static/scripts/payments/paymentSummaryNewUX/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/accountConfigurations/groupBy.json?$filterGridId=GRD_ADM_ACCCONFIG',
			cfgSummaryLabel : getLabel('accountConfiguration', 'Account Configuration'),
			cfgGroupByLabel : getLabel('groupedby', 'Grouped By'),
//			cfgGroupingDisabled : true,
			cfgGroupCode : objGroupByPref.groupCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			enableQueryParam:false,
			cfgShowFilter : true,
			//cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'accountConfigurationFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : false,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				cfgShowRefreshLink : false,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : [ 'acmClient', 'acmAccount', 'acmAccountDesc',
							'acmClientName', 'acmPreferredName', 'makerId', 'isSubmitted',
							'history', 'requestStateDesc', 'group', 'lowerWarnLimitAmt', 'higherWarnLimitAmt','acmCcySymbol',
							'identifier', '__metadata' ],
					proxyUrl : 'services/clientAccountList.json',
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
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(me
						.getDefaultColumnModel()),
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
	getGroupActionModel : function() {
		var me = this;
		var retArray = [];
		var actionsForWidget = ['Submit', 'Accept', 'Reject', 'Enable', 'Disable', 'Discard'];
		var objActions = {
					"Submit": {
						itemText : getLabel('submit','Submit'),
						itemId : 'submit',
						isGroupAction : true,
						actionName : 'submit',
						maskPosition : 5
					},
					"Accept": {
						itemText : getLabel('prfMstActionApprove',
								'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					},
					"Reject": {
						itemText : getLabel('prfMstActionReject',
								'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					},
					"Enable": {
						itemText : getLabel('prfMstActionEnable',
								'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					},
					"Disable": {
						itemText : getLabel('prfMstActionDisable',
								'Suspend'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					},
					"Discard" : {
						itemText : getLabel('prfMstActionDiscard',
								'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}
		};
		for (var i = 0; i < actionsForWidget.length; i++) {
			if (!Ext.isEmpty(objActions[actionsForWidget[i]]))
				retArray.push(objActions[actionsForWidget[i]])
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		var me = this;
		var objActionCol = [
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip',
								'Edit'),
						itemLabel : getLabel('editToolTip','Edit'),
						maskPosition : 2
					},
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip',
								'View Record'),
						itemLabel :  getLabel('viewToolTip','View Record'),
						maskPosition : 3
					},
					{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip',
								'View History'),
						maskPosition : 4
					} ];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = objActionCol.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);

	},
	getDefaultColumnModel : function() {
		var me = this;
		var arrCols = null;
		if (entityType == '1' && !me.showClientFlag) {
			/*arrCols = [ {
				"colId" : "acmAccount",
				"colHeader" : getLabel('accountNumber', 'Account Number'),
				"sortable" : true
			}, {
				"colId" : "acmPreferredName",
				"colHeader" : getLabel('accountNickName', 'Account Nick Name'),
				"sortable" : false
			},// { As Discussed with KK this Column to be made hidden
			//	"colId" : "enrichLink",
			//	"colDesc" : "Configure Notes"
			//}, 
			{
				"colId" : "group",
				"colHeader" : getLabel('accountGroup', 'Account Group'),
				"sortable" : true
			},
			{
				"colId" : "lowerWarnLimitAmt",
				"colType" : "number",
				"colHeader" : getLabel('lowerWarnAmtLimit', 'Lower Warn Amount Limit'),
				"sortable" : true
			},
			{
				"colId" : "higherWarnLimitAmt",
				"colType" : "number",
				"colHeader" : getLabel('higherWarnAmtLimit', 'Higher Warn Amount Limit'),
				"sortable" : true
			},
			{
				"colId" : "requestStateDesc",
				"colHeader" :getLabel('status', 'Status'),
				"sortable" : false
			} ];*/
			
			arrCols = ACC_CONF_DEFAULT_COLUMN_MODEL;
			
		} else {
			arrCols = ACC_CONF_DEFAULT_ADMIN_COLUMN_MODEL;
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex,
			colIndex, store, view, colId) {
		var me = this;
		var strRetValue = "";
		var id = "'" + record.data.identifier + "'";
		if (colId === 'col_enrichLink') {
			strRetValue = '<a href="#" class="underlined button_underline thePoniter ux_font-size14-normal centerAlign" onclick="showEnrichments('
					+ id + ')">Notes</a>';
		}
		else if (colId === 'col_higherWarnLimitAmt' && record.get('lowerWarnLimitAmt') != '')
		{
			strRetValue = record.get('acmCcySymbol') + ' ' + value;
		} 
		else if (colId === 'col_lowerWarnLimitAmt' && record.get('higherWarnLimitAmt') != '')
		{
			strRetValue = record.get('acmCcySymbol') + ' ' + value;
		} 
		else 
		{
			strRetValue = value;
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId,
			maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var strEmptyRecKey = false;
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if(record.raw.makerId === null || record.raw.makerId === "" || record.raw.makerId === "undefined"){
			isSameUser = false;
		}
		else{
			if (record.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		strEmptyRecKey = (record.raw.recordKeyNo == undefined);
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser
					&& (!strEmptyRecKey);
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser
					&& (!strEmptyRecKey);
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled)
					&& (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'N' && strEmptyRecKey);
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 5 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'N' && strEmptyRecKey);
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 3 && validFlag == 'N')
					&& (!strEmptyRecKey);
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue
					&& (reqState == 3 && validFlag == 'Y')
					&& (!strEmptyRecKey);
		} else if (maskPosition === 4 && retValue) {
			retValue = retValue && (!strEmptyRecKey);
		}
		return retValue;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit', 'Accept', 'Reject', 'Enable', 'Disable', 'Discard'];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 108,
			colHeader : getLabel("actions", "Actions"),
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
						text : getLabel('submit','Submit'),
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
					case 'Accept' :
						itemsArray.push({
								text : getLabel('prfMstActionApprove',
								'Approve'),
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
								text : getLabel('prfMstActionReject',
								'Reject'),
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
								text : getLabel('prfMstActionEnable',
								'Enable'),
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
								text : getLabel('prfMstActionDisable',
								'Suspend'),
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
								text : getLabel('prfMstActionDiscard',
								'Discard'),
								itemId : 'discard',
								actionName : 'discard',
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