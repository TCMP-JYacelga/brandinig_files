Ext.define('GCP.view.POAcceptanceSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'pOAcceptanceSummaryView',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.POAcceptanceSummaryFilterView'
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
		var groupView = null, blnShowAdvancedFilter = false;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objPOSummaryPref = objPOBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objPOSummaryPref = objPOSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
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
		
		if(objSaveLocalStoragePref){
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		blnShowAdvancedFilter = false; //!isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl :'services/grouptype/purchaseOrderAcceptanceCenter/POACC.json?$filterGridId=GRD_FSC_PO_ACC&$filterscreen='+selectedFilterLoggerDesc, 
			cfgSummaryLabel : getLabel('PO', 'PO'),
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
							xtype : 'pOAcceptanceSummaryFilterView'
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
					fields :['poDate','poBatchReference','poReference','poAcceptRefNumber','deductedAmount','poReference','companyName','poBatchNumber','poAmount','buyerSeller','__metadata','identifier','buyerSellerDesc','poRefNumber','poFinanceAmount','acceptedAmount','requestDate','scmMyProductName','acceptanceRef','purchaseOrderAcceptanceStatus','poCurrencyCode','currencySymbol','poAcceptIntRefNumber','poInternalReference','subsidiaryDesc','company','dealerVendorCode','clientId'],
					proxyUrl : 'services/purchaseOrderAcceptanceList/'+selectedFilterLoggerDesc+'.json',
					rootNode : 'd.purchaseOrder',
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
				retValue = (record.data.purchaseOrderStatus == 'Presented' && record.data.invoiceApplicable == true);
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
		var REJECTED = '<a class="linkbox grid-link-icon full_filled_red_link" href="#"></a>';
		var PENDING_ACCEPTED, PENDING_ACCEPTANCE = '<a class="linkbox grid-link-icon empty_link" href="#"></a>';
		var PARTIAL_ACCEPTED = '<a class="linkbox grid-link-icon half_filledlink" href="#"></a>';
		var COMPLETE_ACCEPTED, COMPLETE_ACCEPTANCE = '<a class="linkbox grid-link-icon full_filledlink" href="#"></a>';
		var statusIcons = {};
		if (colId === 'col_poAmount' || colId === 'col_deductedAmount' || colId == 'col_acceptedAmount') {
			if (!record.get('isEmpty')) {
				strRetValue = record.get('currencySymbol') + ' ' + value;
			}
		}
		else if(colId === 'col_buyerSellerDesc')
		{
			/*if (!record.get('isEmpty') && 'FALSE' == record.get('anchorClient')) {
				strRetValue = '<span><a class="iconlink grid-link-icon anchorclient_link" href="#"></a>'+value+'</span>';
			}
			else
			{
				strRetValue = value;
			}
			*/
			strRetValue = value;
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
				'Accept', 'Delete', 'Upload', 'Send', 'Verify','PayNow', 'RequestAcceptance']);
		var objActions = {
				
			'Submit' : {
					actionName : 'submit',
					// itemCls : 'icon-button icon-authorize',
					itemText : getLabel('purchaseOrderActionSubmit', 'Submit'),
					maskPosition : 8
				},
			'Authorize' : {
				actionName : 'authourize',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('purchaseOrderActionApprove', 'Approve'),
				maskPosition : 4
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('purchaseOrderActionReturnToMaker', 'Reject'),
				maskPosition : 5

			},
			'Delete' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('purchaseOrderActionDiscard', 'Discard'),
				maskPosition : 3
			},
			'Send' : {
				actionName : 'send',
				// itemCls : 'icon-button icon-verify',
				itemText : getLabel('purchaseOrderActionVerify', 'Send'),
				maskPosition : 6 //PO Accept
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
			{
				if("PayNow" == arrActions[i] || "Verify" == arrActions[i])
				{
					if(selectedFilterLoggerDesc == 'BUYER')
						retArray.push(objActions[arrActions[i]])
				}
				else if("Accept" == arrActions[i])
				{
					if(selectedFilterLoggerDesc == 'SELLER')
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
			maskPosition : 2
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewRecordToolTip', 'View Record'),
			maskPosition : 1
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
							text : getLabel('purchaseOrderActionSubmit',
									'Submit'),
							actionName : 'submit',
							itemId : 'submit',
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
					case 'Discard' :
						itemsArray.push({
							text : getLabel('purchaseOrderActionDiscard',
									'Discard'),
							actionName : 'discard',
							itemId : 'discard',
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
					case 'Authorize' :
						itemsArray.push({
							text : getLabel('purchaseOrderActionAuthorize',
									'Authorize'),
							actionName : 'authourize',
							itemId : 'authourize',
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
					case 'Reject' :
						itemsArray.push({
							text : getLabel('purchaseOrderActionReturnToMaker',
									'Reject'),
							actionName : 'reject',
							itemId : 'reject',
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
					case 'Send' :
						itemsArray.push({
							text : getLabel('purchaseOrderActionSend', 'Send'),
							actionName : 'send',
							itemId : 'send',
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
					
				}

			}
		}
		return itemsArray;
	}

});