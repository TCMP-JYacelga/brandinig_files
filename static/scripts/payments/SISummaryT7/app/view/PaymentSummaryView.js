/**
 * @class GCP.view.PaymentSummaryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.PaymentSummaryFilterView'],
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
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		var objLocalGroupCode = null;
		
		if (objPaymentSummaryPref) {
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
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/SISummaryT7/SI.json?$filterGridId=GRD_PAY_SISUM&$columnModel=true',
			cfgSummaryLabel : 'Recurring Transactions',
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgGroupCode : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : false,			
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'paymentSummaryFilterView'
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
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				// showSummaryRow : true,
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : false,
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
					fields : ['history', 'client', 'clientReference',
							'productType', 'productTypeDesc', 'entryDate',
							'module', 'txnDate', 'amount', 'actionStatus',
							'identifier', '__metadata', 'pirMode', 'count',
							'isActionTaken', 'currency', 'isConfidential',
							'isClone', 'uploadRef', 'paymentMethod', 'channel',
							'bankProduct', 'file', 'authNmbr', 'paymentType',
							'payType', 'phdnumber', 'valueDate', 'maker',
							'creditAmount', 'debitAmount', 'recieverName',
							'receiverCcy', 'templateName', 'hostMessage',
							'siTerminationDate', 'siEffectiveDate',
							'siNextExecutionDate', 'productCategoryDesc',
							'sendingAccountDescription', 'recieverAccount',
							'enteredInstruments', 'companyId', 'referenceNo',
							'sendingAccount', 'recieverAccountName',
							'siFrequency', 'siType', 'refDay','txnType','remarks','anyIdType','anyIdTypeDesc','anyIdValue','receiverCode','receiverShortCode','beneBankDescription','beneBranchDescription','defaultAccount' ],
					proxyUrl : 'services/standingInstructions.json',
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
				groupActionModel : me.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : (arrGenericColumnModel || SI_GENERIC_COLUMN_MODEL || []),
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
			if (itmId === "btnClone" && maskPosition === 17 && isSICloneApplicable === 'N') {
				retValue = false;
			}
			return retValue;
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		var multipleCcy = "<a title='"+ getLabel("iconBatchFcy", "Multiple Currencies")+ "' class='iconlink grdlnk-notify-icon icon-gln-fcy'></a>";
		if (colId === 'col_amount' || colId === 'col_creditAmount' || colId === 'col_debitAmount') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('currency'))) {
					if(value === "--CONFIDENTIAL--")
					{
						strRetValue = value;
	        			meta['tdAttr'] = 'title="' + (strRetValue) + '"';						
					}
					else
					{
					strRetValue = multipleCcy + ' ' + setDigitAmtGroupFormat(value);
        			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
					}

				} else {
					if(value === "--CONFIDENTIAL--")
					{
						strRetValue = value;
	         			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
					}
					else
					{
					strRetValue = record.get('currency') + ' ' + setDigitAmtGroupFormat(value);
         			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
				}
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
		} else if (colId === 'col_count') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('enteredInstruments'))
						&& !Ext.isEmpty(record.get('count'))
						&& (record.get('enteredInstruments') != record
								.get('count'))) {
					var strEnteredInstruments = record
							.get('enteredInstruments');
					var strCount = record.get('count');
					strRetValue = strEnteredInstruments + ' of ' + strCount;
				} else {
					strRetValue = value;
				}
			}
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		} else if (colId === 'col_siFrequencyCode' || colId === 'col_siFrequency') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('siFrequency'))) {
					var siFrequency = record.get('siFrequency');					
					strRetValue = siFrequency;
				}
			}
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		}
		else if (colId === 'col_defaultAccount') {
			if(value === "Y")
				strRetValue = getLabel('yes', 'Yes');
			else if(value === "N")
				strRetValue = getLabel('no', 'No');
			
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		}
		else {
			if (Ext.isEmpty(value)
					|| (typeof(value) == "string" && value.indexOf("null") != -1)) {
				strRetValue = "";
			} else {
				strRetValue = value;
			}
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		}
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Disable', 'Discard',
				'Authorize', 'Reject', 'Enable']);
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
			'Hold' : {
				actionName : 'hold',
				// itemCls : 'icon-button icon-hold',
				itemText : getLabel('instrumentsActionHold', 'Hold'),
				maskPosition : 10
			},
			'Release' : {
				actionName : 'release',
				// itemCls : 'icon-button icon-release',
				itemText : getLabel('instrumentsActionRelease', 'Release'),
				maskPosition : 11
			},
			'Stop' : {
				actionName : 'stop',
				// itemCls : 'icon-button icon-stop',
				itemText : getLabel('instrumentsActionStop', 'Stop'),
				maskPosition : 12
				// actionUrl : 'services/paymentsbatch/stop'
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				maskPosition : 9
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('instrumentsActionDisable', 'Suspend'),
				maskPosition : 20
			},
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('instrumentsActionEnable', 'Enable'),
				maskPosition : 19
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
		var objActionCol = null;
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			maskPosition : 16
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 15
				// fnClickHandler : viewRecord
			},{
			itemId : 'btnCloneTemplate',
			itemCls : 'grid-row-action-icon icon-template',
			itemLabel : getLabel('cloneTemplateToolTip', 'Copy To Template'),
			maskPosition : 18
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : cloneToTemplate
			}, {
			itemId : 'btnClone',
			itemCls : 'grid-row-action-icon icon-clone',
			itemLabel : getLabel('lblcopyrecordsToolTip', 'Copy Record'),
			maskPosition : 17
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : cloneToNew
			}];
		if(!Ext.isEmpty(allowHistory) && (allowHistory === 'Y')){
			var objAction =  {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 14
					};
			arrRowActions.splice(2, 0,objAction);
		}
		colItems = me.getGroupActionColItems(actionsForWidget);
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :  getLabel('actions','Actions'),
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
							text : getLabel('instrumentsActionApprove',
									'Approve'),
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
					case 'Hold' :
						itemsArray.push({
							text : getLabel('instrumentsActionHold', 'Hold'),
							actionName : 'hold',
							itemId : 'hold',
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
					case 'Release' :
						itemsArray.push({
							text : getLabel('instrumentsActionRelease',
									'Release'),
							actionName : 'release',
							itemId : 'release',
							maskPosition : 11
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
							text : getLabel('instrumentsActionStop', 'Stop'),
							actionName : 'stop',
							itemId : 'stop',
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
					case 'Enable' :
						itemsArray.push({
							text : getLabel('instrumentsActionEnable', 'Enable'),
							actionName : 'enable',
							itemId : 'enable',
							maskPosition : 19
						});
						break;
					case 'Disable' :
						itemsArray.push({
									text : getLabel('instrumentsActionDisable',
											'Suspend'),
									actionName : 'disable',
									itemId : 'disable',
									maskPosition : 20
								});
						break;
				}
			}
		}
		return itemsArray;
	}

});