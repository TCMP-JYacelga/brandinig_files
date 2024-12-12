/**
 * @class GCP.view.ReceivableSummaryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.ReceivableSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'receivableSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.ReceivableSummaryFilterView',
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

		if (objPaymentSummaryPref) {
			var objJsonData = Ext.decode(objPaymentSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? getJsonObj(objJsonData.d.preferences.ColumnSetting.gridCols)
					: Ext.decode(getJsonObj(arrGenericColumnModel)  || '[]');
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
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/receivableSummaryT7/RMT.json?$filterGridId=GRD_REC_RECSUM&$columnModel=true',
			cfgSummaryLabel : getLabel('receivables', 'Receivables'),
			cfgGroupByLabel : getLabel('grpBy', 'Grouped By'),
			cfgGroupCode : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,			
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'receivableSummaryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields : ['history', 'client', 'dhdDepSlip','dhdClientDesc',
								'productType', 'dhdProduct', 'entryDate',
								'module', 'txnDate', 'dhdTotalAmnt', 'actionStatus',
								'identifier', '__metadata', 'dhdMode', 'dhdTotalNo',
								'isActionTaken', 'creditCcy', 'isConfidential',
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
								'paymentSource','rejectRemarks','templateName','recieverAccountName','dhdRemark','activationDate','dhdModule'],
					proxyUrl : 'services/receivablesbatch.json',
					rootNode : 'd.batch',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(Ext.Array.difference(availableGroupActionForGrid.group_level_actions,(arrActionsToRemove || []))),
				defaultColumnModel :(getJsonObj(arrGenericColumnModel) || RECEIVABLE_GENERIC_COLUMN_MODEL || []),
				fnColumnRenderer : me.columnRenderer,				
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		if (itmId == "btnQuickPay") {
			var paymentType = record.data.paymentType;
			if (!Ext.isEmpty(paymentType) && paymentType == "QUICKPAY")
				return true;
			else
				return false;
		} else {
			var maskSize = 21;
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
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
				buttonMask = jsonData.d.__metadata.__buttonMask;
			
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
				
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
			return retValue;
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_dhdTotalAmnt') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('creditCcy'))) {
					strRetValue = '<a title="'
							+ getLabel('iconBatchFcy', 'Multiple Currencies')
							+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>' + ' ' + value;
				} else {
					strRetValue = record.get('creditCcy') + ' ' + value;
				}
			}
		} else if (colId === 'col_creditAmount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('creditCcy'))) {
					strRetValue = '<a title="'
							+ getLabel('iconBatchFcy', 'Multiple Currencies')
							+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>' + ' ' + value;
				} else {
					strRetValue = record.get('creditCcy') + ' ' + value;
				}
			}
		} else if (colId === 'col_debitAmount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('creditCcy'))) {
					strRetValue = '<a title="'
							+ getLabel('iconBatchFcy', 'Multiple Currencies')
							+ '" class="iconlink grdlnk-notify-icon icon-gln-fcy"></a>' + ' ' + value;
				} else {
					strRetValue = record.get('creditCcy') + ' ' + value;
				}
			}
		} else if (colId === 'col_productType') {
			strRetValue = value;
			if (record.get('isConfidential') == "N") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchConfidential', 'Confidential')
						+ '" class="grid-row-action-icon icon-confidential xn-icon-16x16 smallmargin_lr"></a> ';
			}
			if (!Ext.isEmpty(record.get('isClone'))
					&& (!Ext.isEmpty(record.get('uploadRef')))
					&& record.get('isClone') != "Y") {
				strRetValue += '<a title="'
						+ getLabel('iconBatchFileUpload', 'Import')
						+ '" class="grid-row-attach-icon xn-icon-16x16 smallmargin_lr"></a>';
			}
		} else if (colId === 'col_dhdTotalNo') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('dhdEnteredNo'))
						&& !Ext.isEmpty(record.get('dhdTotalNo'))
						&& (record.get('dhdEnteredNo') != record
								.get('dhdTotalNo'))) {
					var strEnteredInstruments = record
							.get('dhdEnteredNo');
					var strCount = record.get('dhdTotalNo');
					strRetValue = strEnteredInstruments + ' of ' + strCount;
				} else {
					strRetValue = value;
				}
			}
		} else if (colId === 'col_dhdModule') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('dhdModule'))) {
					if(record.get('dhdModule') == 'A')
					{
						strRetValue = getLabel('Admin', 'Admin');
					}
					else if(record.get('dhdModule') == 'C')
					{
						strRetValue = getLabel('Client', 'Client');
					}
					else
						strRetValue = value;
				} else {
					strRetValue = value;
				}
			}
		}
		else
			strRetValue = value;
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
				'Reject', 'Send', 'Stop']);
		if (achActionsEnabled == 'false') {
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
		var me = this;
		var colItems = [];
		var arrRowActions = [/*
								 * { itemId : 'btnQuickPay', itemCls :
								 * 'grid-row-action-icon icon-quickpay', toolTip :
								 * getLabel('batchQuickPay', 'Quick Pay')
								 * itemLabel : getLabel('historyToolTip', 'View
								 * History'), },
								 */{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Edit'),
			itemLabel : getLabel('editRecordToolTip', 'Edit'),
			maskPosition : 16
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 15
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 14
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		var objActionCol = null;

		colItems = me.getGroupActionColItems(actionsForWidget);
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
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