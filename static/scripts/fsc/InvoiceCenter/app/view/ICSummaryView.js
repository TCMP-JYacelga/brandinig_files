Ext.define('GCP.view.ICSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'iCSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.ICSummaryFilterView'
			],
	autoHeight : true,
	// width : '100%',
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView(selectedFilterLoggerDesc);
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function(selectedFilterLoggerDesc) {
		var me = this;
		var groupView = null, blnShowAdvancedFilter = true;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objPOSummaryPref = objPOBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
			objSaveLocalStoragePref = objSaveLocalStoragePrefBuyer;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objPOSummaryPref = objPOSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
			objSaveLocalStoragePref = objSaveLocalStoragePrefSeller;
		}
		
		if (objPOSummaryPref) {
			var objJsonData = Ext.decode(objPOSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');
		}
		
		//local preferences
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = 	objLocalData && objLocalData.d.preferences 
								&& objLocalData.d.preferences.tempPref
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			
			objLocalSubGroupCode = 	objLocalData && objLocalData.d.preferences 
									&& objLocalData.d.preferences.tempPref
									&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : '';
		}
		
		blnShowAdvancedFilter = true; //!isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl :'services/grouptype/invoiceCenter/INVCEN.json?$filterGridId=GRD_FSC_INVCEN&$filterscreen='+selectedFilterLoggerDesc, 
			cfgSummaryLabel : getLabel('invoiceCenter', 'Invoice Center'),
			cfgGroupByLabel : getLabel('grpBy', 'Grouped By'),
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			selectedFilterLoggerDesc : selectedFilterLoggerDesc,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'iCSummaryFilterView'
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
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus'
								//options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields :['invoiceNumber','poreferenceNumber','invoiceBatchNumber','invoiceDate',
					         'invoiceAmount','invoiceDueDate','subsidiaryDesc','buyerSellerDesc', 'invoiceCurrencyCode','currencySymbol',
					         'scmMyProductName','invoiceStatus','invoiceVerifyStatus','invoiceFinanceStatus', 'invoiceInternalReferenceNumber',
					         'invoicePaymentStatus','__metadata','identifier','dealerVendorCode','company'],
					proxyUrl : 'services/invoiceCenterList/'+selectedFilterLoggerDesc+'.json',
					rootNode : 'd.invoice',
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
				 *		itemText : getLabel('purchaseOrderActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('purchaseOrderActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				groupActionModel : me.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : (arrGenericColumnModel || PO_GENERIC_COLUMN_MODEL || []),
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
			var maskSize = 13;
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
					&& !Ext.isEmpty(jsonData.d.__buttonMask))
				buttonMask = jsonData.d.__buttonMask;
			
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
				
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
			if(itmId == 'addInvoice')
			{
				retValue = (record.data.invoiceStatus == 'Presented' && record.data.invoiceApplicable == true);
			}
			else if(itmId == 'btnView')
			{
				retValue = true; // View Button Has Always Permission
			}
			else if(itmId == 'requestFinance' && record.raw.financePartiallyAccDoc === false
					&& record.raw.documentFullyAccepted === false)//poAmount > totalAcceptedAmount + totalDeductionAmount
			{
				return false;
			}
			else
			{
				retValue = isActionEnabled(actionMask, bitPosition);
			}
			return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId == 'col_invoiceStatus')
		{
			value = value.replace(/\s/g,'');
			switch(value)
			{
			case 'Presented':strRetValue = getLabel('icStatus.5', 'Presented');break;
			case 'Draft':strRetValue = getLabel('icStatus.0', 'Draft');break;
			case 'PendingApproval':strRetValue = getLabel('icStatus.2', 'Pending Approval');break;
			case 'PendingMyApproval':strRetValue = getLabel('icStatus.3', 'Pending My Approval');break;
			case 'PendingPresentment':strRetValue = getLabel('icStatus.10', 'Pending Presentment');break;
			case 'Rejected':strRetValue = getLabel('icStatus.4','Rejected');break;
			case 'ForRepair':strRetValue = getLabel('icStatus.9','For Repair');break;
			}
		}
		else if(colId == 'col_invoiceVerifyStatus' && value != '')
		{
			if(record.data.invoiceVerifyStatus === 'COMPLETE_ACCEPTED'){
				strRetValue = getLabel('completely_accepted', 'Completely Accepted')
			}else if(record.data.invoiceVerifyStatus === 'PARTIAL_ACCEPTED'){
				strRetValue = getLabel('partially_accepted','Partially Accepted');
			}else if(record.data.invoiceVerifyStatus === 'PENDING_ACCEPTED'){
				strRetValue = getLabel('pending_acceptance','Pending Acceptance');
			}else if(record.data.invoiceVerifyStatus === 'REJECTED'){
				strRetValue = getLabel('rejected','Rejected');
			}
		}
		else if(colId == 'col_invoiceFinanceStatus' && value != '')
		{
			if(record.data.invoiceFinanceStatus === 'COMPLETE_FINANCE'){
				strRetValue = getLabel('financed','Financed');
			}else if(record.data.invoiceFinanceStatus === 'PENDING_FINANCE'){
				strRetValue = getLabel('pending_finance','Pending Finance');
			}else if(record.data.invoiceFinanceStatus === 'REJECTED'){
				strRetValue = getLabel('rejected','Rejected');
			}
		}
		else if(colId == 'col_invoicePaymentStatus' && value != '')
		{
			if(record.data.invoicePaymentStatus === 'COMPLETELY_PAID'){
				strRetValue = getLabel('completely_paid','Completely Paid');
			}else if(record.data.invoicePaymentStatus === 'PARTAIL_PAID'){
				strRetValue = getLabel('partially_paid','Partially Paid');
			}else if(record.data.invoicePaymentStatus === 'PENDING_PAYMENT'){
				strRetValue = getLabel('pending_payment','Pending Payment');
			}else if(record.data.invoicePaymentStatus === 'REJECTED'){
				strRetValue = getLabel('rejected','Rejected');
			}
		}
		else if (colId === 'col_invoiceAmount') {
			if (!record.get('isEmpty')) {
				strRetValue = record.get('currencySymbol') + ' ' + value;
			}
		}
		else if(colId === 'col_buyerSellerDesc')
		{
			if (!record.get('isEmpty') && 'FALSE' == record.get('anchorClient')) {
				strRetValue = '<span><a class="iconlink grid-link-icon anchorclient_link" href="#"></a>'+value+'</span>';
			}
			else
			{
				strRetValue = value;
			}
		}
		else
		{
			strRetValue = value;
		}
		return strRetValue;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		/*var arrActions = (arrAvaliableActions || ['Discard', 'Authorize',
				'Reject', 'Send', 'Stop']);*/
		var arrActions = (arrAvaliableActions || ['Submit', 'Authorize',
				'Accept', 'Delete', 'Upload', 'Send', 'Verify','PayNow', 'RequestFinance', 'PaymentBond']);
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
				itemText : getLabel('invoiceCenterActionSubmit', 'Submit'),
				/**
				 * @requires The position of the action in mask.
				 */
				maskPosition : 6
				/**
				 * @optional The position of the action in mask.
				 */
				// fnClickHandler : handleRejectAction
			},
			'Accept' : {
				actionName : 'accept',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('invoiceCenterActionVerify', 'Accept'),
				maskPosition : 8 //PO Accept
			},
			'Authorize' : {
				actionName : 'authourize',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('invoiceCenterActionApprove', 'Approve'),
				maskPosition : 3
			},
			'Upload' : {
				actionName : 'uploadToOtherSystem',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('invoiceCenterActionUpload', 'Upload to Other System'),
				maskPosition : 7
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('invoiceCenterActionReturnToMaker', 'Reject'),
				maskPosition : 4

			},
			'Delete' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('invoiceCenterActionDiscard', 'Discard'),
				maskPosition : 2
			},
			'Send' : {
				actionName : 'send',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('invoiceCenterActionVerify', 'Send'),
				maskPosition : 5 //PO Accept
			},
			'Verify' : {
				actionName : 'verify',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('invoiceCenterActionVerify', 'Accept'), // disscussed with BA changed labe as Accept
				maskPosition : 9 //PO Accept
			},
			'PayNow' : {
				actionName : 'payNow',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('invoiceCenterActionVerify', 'Pay Now'),
				maskPosition : 11 //PO Accept
			},
			'RequestFinance' : {
				actionName : 'requestFinance',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('invoiceCenterActionVerify', 'Request Finance'),
				maskPosition : 10 //PO Accept
			},
			'PaymentBond' : {
				actionName : 'paymentBond',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('purchaseOrderActionPaymentBond', 'Payment Bond'),
				maskPosition : 13 //Payment Bond
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
			{
				if("PayNow" == arrActions[i] || "Accept" == arrActions[i])
				{
					if(selectedFilterLoggerDesc == 'BUYER')
						retArray.push(objActions[arrActions[i]])
				}
				else if("Verify" == arrActions[i])
				{
					if(selectedFilterLoggerDesc == 'SELLER' /**|| selectedFilterLoggerDesc == 'BUYER'**/)
						retArray.push(objActions[arrActions[i]])
				}
				else
				{
					retArray.push(objActions[arrActions[i]])
				}
			}
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
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			maskPosition : 1
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 7
				// fnClickHandler : viewRecord
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
							text : getLabel('invoiceCenterActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
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
					case 'Delete' :
						itemsArray.push({
							text : getLabel('invoiceCenterActionDiscard',
									'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 2
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
							text : getLabel('invoiceCenterActionApprove',
									'Approve'),
							actionName : 'authourize',
							itemId : 'authourize',
							maskPosition : 3
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
							text : getLabel('invoiceCenterActionReturnToMaker',
									'Reject'),
							actionName : 'reject',
							itemId : 'reject',
							maskPosition : 4
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
							text : getLabel('invoiceCenterActionSend', 'Send'),
							actionName : 'send',
							itemId : 'send',
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
					case 'Verify' :
						itemsArray.push({
							text : getLabel('invoiceCenterActionVerify', 'Accept'), // disscussed with BA changed labe as Accept
							actionName : 'verify',
							itemId : 'verify',
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
					case 'Accept' :
						itemsArray.push({
							text : getLabel('invoiceCenterActionAccept', 'Accept'),
							actionName : 'accept',
							itemId : 'accept',
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
					case 'PayNow' :
						itemsArray.push({
							text : getLabel('invoiceCenterActionVerify', 'Pay Now'),
							actionName : 'payNow',
							itemId : 'payNow',
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
					case 'RequestFinance' :
						itemsArray.push({
							text : getLabel('invoiceCenterActionRequestFinance', 'Request Finance'),
							actionName : 'requestFinance',
							itemId : 'requestFinance',
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
					case 'PaymentBond':	
						itemsArray.push({
							text : getLabel('purchaseOrderActionPaymentBond', 'Payment Bond'),
							actionName : 'paymentBond',
							itemId : 'paymentBond',
							maskPosition : 13
							});
						break;
				}

			}
		}
		return itemsArray;
	}

});