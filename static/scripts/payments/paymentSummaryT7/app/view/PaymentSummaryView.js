/**
 * @class GCP.view.PaymentSummaryView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.PaymentSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.PaymentSummaryFilterView',
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
		var objLocalPageSize = '',objLocalGroupCode = null,objLocalSubGroupCode = null;

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
		
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			// cfgGroupByUrl :
			// 'services/grouptype/paymentSummaryT7/PMT.json?$filterscreen=groupViewFilter&$filterGridId=GRD_PAY_PAYSUM',
			// Removed advancedfilter url parameter as not supporting in groupby
			cfgGroupByUrl : 'services/grouptype/paymentSummaryT7/PMT.json?$filterGridId=GRD_PAY_PAYSUM&$columnModel=true',
			cfgSummaryLabel : 'Payments',
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : (allowLocalPreference === 'Y' && Ext.isEmpty(widgetFilterUrl) && !Ext.isEmpty(objLocalGroupCode)) ? objLocalGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y' && Ext.isEmpty(widgetFilterUrl)) ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			/* padding : '12 0 0 0', */
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
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
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
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
			    viewConfig : {
    			  getRowClass: function(record, rowIndex, rowParams, store) {
                    return (record.data.rejectRemarks.startsWith('I23'))?'fcm-error-row':'';
                  },
                  stripeRows : true
                },
				storeModel : {
					fields : ['history', 'client', 'clientReference',
							'productType', 'productTypeDesc', 'entryDate',
							'module', 'txnDate', 'amount', 'actionStatus',
							'identifier', '__metadata', 'pirMode', 'count',
							'isActionTaken', 'currency', 'isConfidential',
							'isClone', 'uploadRef', 'paymentMethod', 'channel',
							'bankProduct', 'file', 'authNmbr', 'paymentType',
							'phdnumber', 'valueDate', 'maker', 'creditAmount',
							'debitAmount', 'recieverName', 'drawerLocalName', 'receiverCcy',
							'templateName', 'hostMessage', 'sendingAccount',
							'recieverAccount', 'authLevel', 'lcyAmount',
							'txnType', 'productCategoryDesc','recKeyCheck',
							'sendingAccountDescription', 'enteredInstruments',
							'companyId', 'referenceNo', 'templateDescription',
							'templateType', 'pendingApprovalCount','recKeyIdentifier',
							'hostConfirmationNo', 'confirmationNo', 'fxRate',
							'paymentCcy', 'paymentSource', 'rejectRemarks','remarks',
							'templateName', 'recieverAccountName', 'debitAccountCcy','channelDesc','systemBenefCode','anyIdType','anyIdTypeDesc','anyIdValue'
							,'receiverCode','beneBankDescription','beneBranchDescription','defaultAccount','receiverShortCode',
							'checker1','checker2','pullToBank','pullToBankRemarks','myAuthAmount','myAuthCount','mySendAmount','mySendCount','actionState','parentBacthRefId'],
					proxyUrl : 'services/paymentsbatch.json',
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
				groupActionModel : me.getGroupActionModel(Ext.Array.difference(availableGroupActionForGrid.group_level_actions,(arrActionsToRemove || []))),
				defaultColumnModel : (arrGenericColumnModel || PAYMENT_GENERIC_COLUMN_MODEL || []),
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
		if (itmId == "btnQuickPay") {
			var paymentType = record.data.paymentType;
			if (!Ext.isEmpty(paymentType) && paymentType == "QUICKPAY")
				return true;
			else
				return false;
		} else {
			var maskSize = 24;
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
			
			var actionState =  record.data.actionState ;
			
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
			if(actionState == "30" &&  bitPosition == 6)
			{
				retValue = true ;
			}
			if($('#batchSelectedAmnt').show())
				$('#batchSelectedAmnt').hide();
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
						 strRetValue = record.get('currency') + '\u2066 ' + setDigitAmtGroupFormat(value);
						 meta['tdAttr'] = 'title="' + strRetValue + '"';
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
		} else if (colId === 'col_defaultAccount') {
			if(value === "Y")
				strRetValue = "Yes";
			else if(value === "N")
				strRetValue = "No";
			
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		} else {
			strRetValue = value;
			meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		}
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
				'Reject', 'Send', 'Reversal', 'Stop','Verify']);
		if (achActionsEnabled == 'false') {
			arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
					'Reject', 'Send', 'Stop']);
		}
		if((pullToBankAuth == 'Y' && pullToBankEdit == 'Y')){
			arrAvaliableActions.push('pullToBank','pullToBankApprove','pullToBankReject');
		}
		else if(pullToBankEdit == 'Y'){
			arrAvaliableActions.push('pullToBank');
		}
		else if(pullToBankAuth == 'Y'){
			arrAvaliableActions.push('pullToBankApprove','pullToBankReject');
		}
		arrActions=arrAvaliableActions;	
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
				actionName : 'stop',
				// itemCls : 'icon-button icon-release',
				itemText : getLabel('instrumentsActionStop', 'Stop'),
				maskPosition : 12
			},
			'Reversal' : {
				actionName : 'reversal',
				// itemCls : 'icon-button icon-revarsal',
				itemText : getLabel('instrumentsActionReversal', 'Reverse'),
				maskPosition : 21
			},
			'pullToBank' : {
				actionName : 'pullToBank',
				itemText : getLabel('instrumentsActionPullToBank', 'Pull To Bank'),
				hidden : strEntityType === '1' ? false : true,
				maskPosition : 3
			},
			'pullToBankApprove' : {
				actionName : 'pullToBankApprove',
				itemText : getLabel('instrumentsActionPullToBankApprove', 'Pull To Bank Approve'),
				hidden : strEntityType === '1' ? false : true,
				maskPosition : 4
			},
			'pullToBankReject' : {
				actionName : 'pullToBankReject',
				itemText : getLabel('instrumentsActionPullToBankReject', 'Pull To Bank Reject'),
				hidden : strEntityType === '1' ? false : true,
				maskPosition : 2
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
			},{
			itemId : 'btnCloneTemplate',
			itemCls : 'grid-row-action-icon icon-template',
			itemLabel : getLabel('cloneTemplateToolTip', 'Copy To Template'),
			maskPosition : 18
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : cloneToTemplate
			},{
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
		
		if(!Ext.isEmpty(allowInstLvlSend) && (allowInstLvlSend === 'true')){
			var objAction1 =  {
			itemId : 'btnViewMyAuth',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewMyAuthRecordToolTip', 'View My Auth Record'),
			itemLabel : getLabel('viewMyAuthRecordToolTip', 'View My Auth Record'),
			maskPosition : 22
				// fnClickHandler : btnViewMyAuth
			};
		var objAction2  =	{
			itemId : 'btnViewMySend',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewMySendRecordToolTip', 'View My Send Record'),
			itemLabel : getLabel('viewMySendRecordToolTip', 'View My Send Record'),
			maskPosition : 23
				// fnClickHandler : btnViewMySend
			};
			arrRowActions.splice(2, 0,objAction1);
			arrRowActions.splice(3, 0,objAction2);
		}
		
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
							itemCls : 'btnsubmit',
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
					case 'Stop' :
						itemsArray.push({
							text : getLabel('instrumentsActionStop', 'Stop'),
							actionName : 'stop',
							itemId : 'stop',
							maskPosition : 12
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
					case 'Revarsal' :
						itemsArray.push({
							text : getLabel('instrumentsActionRevarsal',
									'Reverse'),
							actionName : 'reversal',
							itemId : 'reversal',
							maskPosition : 21
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'VerifySubmit' :
						itemsArray.push({
							text : getLabel('instrumentsActionVerifySubmit',
									'Submit'),
							actionName : 'verifySubmit',
							itemId : 'verifySubmit',
							maskPosition : 24
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