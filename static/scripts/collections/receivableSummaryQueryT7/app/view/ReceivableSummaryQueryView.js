/**
 * @class GCP.view.ReceivableSummaryQueryView
 * @extends Ext.panel.Panel
 * @author Vikas Tiwari
 */
Ext.define('GCP.view.ReceivableSummaryQueryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'receivableSummaryQueryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.ReceivableSummaryQueryFilterView',
			'GCP.view.PipeLineView'],
	autoHeight : true,
	// width : '100%',
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
		var groupView = null, blnShowAdvancedFilter = true;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		var objLocalGroupCode = null;
		if (objPaymentSummaryPref && Ext.isEmpty(widgetFilterUrl)) {
			var objJsonData = Ext.decode(objPaymentSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');
		}
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
            objLocalGroupCode = objLocalData && objLocalData.d.preferences
                                && objLocalData.d.preferences.tempPref 
                                && objLocalData.d.preferences.tempPref.groupTypeCode ? objLocalData.d.preferences.tempPref.groupTypeCode : null;                                    

		}
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		/*var actionFilters;
		if (strEntityType == 0) {
			actionFilters=	[{
								type : 'list',
								colId : 'actionStatus',
								options : arrAdminActionColumnStatus || []
							}]
		}
		else{
			actionFilters = [{
			type : 'list',
			colId : 'actionStatus',
			options : arrActionColumnStatus || []
							}]
		};*/
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			// cfgGroupByUrl :
			// 'static/scripts/payments/paymentSummaryNewUX/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/receivableSummaryQueryT7/RCQ.json?$filterscreen=groupRecViewFilter&$filterGridId=GRD_REC_QUERY&$columnModel=true',
			cfgSummaryLabel : getLabel('recTxns', 'Receivables Transactions'),
			cfgGroupByLabel : getLabel('grpBy', 'Grouped By'),
			//cfgCollpasible : true,
			cfgGroupCode : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGeneralSetting.subGroupCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			//cfgGroupingDisabled : true,
			cfgParentCt : me,
			cls : 't7-grid',
			padding : '12 0 0 0',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'receivableSummaryQueryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				showCheckBoxColumn : false,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				columnHeaderFilterCfg : {
					//remoteFilter : true,
					//filters : actionFilters
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields : ['history', 'client', 'clientReference',
								'productType', 'dhdProduct', 'entryDate',
								'module', 'txnDate', 'batchAmount', 'actionStatus',
								'identifier', '__metadata', 'dhdMode', 'totalInst',
								'isActionTaken', 'ccy', 'isConfidential',
								'isClone', 'uploadRef', 'paymentMethod', 'channel',
								'bankProduct', 'file', 'authNmbr', 'paymentType',
								'dhdDepNmbr', 'valueDate', 'maker', 'creditAmount',
								'debitAmount', 'recieverName', 'receiverCcy',
								'templateName', 'hostMessage', 'creditAccount',
								'recieverAccount', 'authLevel','lcyAmount','txnType',
								'productCategoryDesc', 'sendingAccountDescription',
								'dhdEnteredNo', 'companyId', 'referenceNo',
								'templateDescription','templateType','pendingApprovalCount',
								'hostConfirmationNo','confirmationNo','fxRate','paymentCcy','dhdProductDesc',
								'paymentSource','remarks','templateName','recieverAccountName','dhdRemark','processingDate','ccy','productCategory','creationDate','recProductDesc','strUdeProductCode','bankProduct',
								'ccySymbol'],
					proxyUrl : 'services/receivablesquery.json',
					rootNode : 'd.batch',
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
				//groupActionModel : me.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : (arrGenericColumnModel || RECEIVABLE_GENERIC_COLUMN_MODEL || []),
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
	getColumnModel : function(arrCols) {
		return arrCols;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_batchAmount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('ccy'))) {
					strRetValue = '<a title="'
							+ getLabel('iconBatchFcy', 'Multiple Currencies')
							+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>' + ' ' + value;
				} else {
					strRetValue = record.get('ccySymbol') + ' ' + value;
				}
			}
		} else
			strRetValue = value;
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
				'Reject', 'Send', 'Stop']);
		if (achActionsEnabled === 'false') {
			arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
					'Reject', 'Send', 'Stop']);
		}
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
				itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				/**
				 * @requires The position of the action in mask.
				 */
				maskPosition : 5
				/**
				 * @optional The position of the action in mask.
				 */
				// fnClickHandler : handleRejectAction
			},
			'Verify' : {
				actionName : 'verify',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('instrumentsActionVerify', 'Verify'),
				maskPosition : 13
			},
			'Authorize' : {
				actionName : 'auth',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('instrumentsActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Send' : {
				actionName : 'send',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('instrumentsActionSend', 'Send'),
				maskPosition : 8
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('instrumentsActionReturnToMaker', 'Reject'),
				maskPosition : 7

			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				maskPosition : 9
			},
			'Stop' : {
				actionName : 'cancel',
				// itemCls : 'icon-button icon-release',
				itemText : getLabel('instrumentsActionStop', 'Stop'),
				maskPosition : 12
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	createGroupActionColumn : function() {
		var colItems = [];
		var arrRowActions = [{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 15
				// fnClickHandler : viewRecord
			}];
		var objActionCol = null;

		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actionColText', 'Action'),
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
							text : getLabel('instrumentsActionSubmit', 'Submit'),
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
							text : getLabel('instrumentsActionDiscard',
									'Discard'),
							actionName : 'discard',
							itemId : 'discard',
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
					case 'Verify' :
						itemsArray.push({
							text : getLabel('instrumentsActionVerify', 'Verify'),
							actionName : 'verify',
							itemId : 'verify',
							maskPosition : 13
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
						});
						break;
					case 'Authorize' :
						itemsArray.push({
							text : getLabel('instrumentsActionAuthorize',
									'Authorize'),
							actionName : 'auth',
							itemId : 'auth',
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
					case 'Send' :
						itemsArray.push({
							text : getLabel('instrumentsActionSend', 'Send'),
							actionName : 'send',
							itemId : 'send',
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
					case 'Reject' :
						itemsArray.push({
							text : getLabel('instrumentsActionReturnToMaker',
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
					case 'Stop' :
						itemsArray.push({
							text : getLabel('instrumentsActionStop',
									'Cancel'),
							actionName : 'cancel',
							itemId : 'cancel',
							maskPosition : 12
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