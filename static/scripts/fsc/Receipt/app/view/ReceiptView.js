Ext.define('GCP.view.ReceiptView', {
	extend : 'Ext.container.Container',
	xtype : 'receiptView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView', 'GCP.view.ReceiptFilterView'],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this,
			groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objReceiptSummaryPref = objReceiptBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
			$.grep(RECEIPT_COLUMNS, function(item, index) {
				if(item.colId === 'buyerSellerDesc') {
					item.colHeader = getLabel('buyerSeller', 'Seller');
					item.colDesc = getLabel('buyerSeller', 'Seller');
				}
			});
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objReceiptSummaryPref = objReceiptSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
			$.grep(RECEIPT_COLUMNS, function(item, index) {
				if(item.colId === 'buyerSellerDesc') {
					item.colHeader = getLabel('buyerSeller', 'Buyer');
					item.colDesc = getLabel('buyerSeller', 'Buyer');
				}
			});
		}
		
		if (objReceiptSummaryPref) {
			var objJsonData = Ext.decode(objReceiptSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericColumnModel || '[]');
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/invoiceReconCenter/InvReceipt.json?$filterscreen=groupViewFilter'+selectedFilterLoggerDesc+'&$filterGridId=GRD_FSC_RECON_RECP',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'receiptFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()];
			},
			cfgGridModel : {
				nestedGridConfigs : {
					enableGridNesting : true,
					isInnerGrid : false,
					innerGridConfig : me.innerGridConfig
				},
				showCheckBoxColumn : false,
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {
					remoteFilter : true
//					filters : [{
//						type : 'list',
//						colId : 'actionStatus',
//						options : arrActionColumnStatus || []
//					}]
				},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['receiptReferenceNumber','receiptDate', 'receiptAmount', 'endDate', 'reconciliationInvoiceHeaderBean', 'reconReceiptState',
							  'validity','clientDescription', 'isSubmitted', 'requestStateDesc', 'validFlag', 'requestState', 'buyerSellerDesc', 'receiptCurrencyCode',
							  'makerId', '__metadata', 'history', 'identifier','reconcilableAmount','reconciledAmount','liquidationState','owner','canReconInitiate'],
					proxyUrl : 'services/invoiceReceiptList/'+selectedFilterLoggerDesc+'.json',
					rootNode : 'd.invoiceReceiptList',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(RECEIPT_COLUMNS),
				fnRowIconVisibilityHandler : me.isParentRowIconVisible,
				fnColumnRenderer : me.columnRenderer
			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		if(colId === 'col_liquidationState'){
			if(value === 'P')
				strRetValue = getLabel("paid1","Paid"); 	
			if(value === 'O')
				strRetValue = getLabel("open1","Open");
			if(value === 'R')
				strRetValue = getLabel("return1","Return");
		}
		if((colId === 'col_receiptAmount' || colId === 'col_reconcilableAmount') && !Ext.isEmpty(record.data.receiptCurrencyCode)){
			strRetValue = strRetValue + " " + record.data.receiptCurrencyCode;
		}
		else if(colId === 'col_reconReceiptState')
		{
			
				switch(value)
				{
					case 'OPEN' : strRetValue=getLabel("open2","OPEN");break;
					case 'RECONCILED' : strRetValue=getLabel("Reconciled","RECONCILED");break;
			}
		}
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Confirm', 
				'UnMatch', 'Discard','Approve','Reject']);
		var objActions = {
			'Confirm' : {
				actionName : 'confirm',
				isGroupAction : true,
				itemText : getLabel('userMstActionConfirm', 'Confirm'),
				maskPosition : 1
			},
			'UnMatch' : {
				actionName : 'unMatch',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('userMstActionUnMatch', 'UnMatch'),
				maskPosition : 5
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('userMstActionDiscard', 'Discard'),
				maskPosition : 3
			},
			'Approve' : {
				actionName : 'approve',
				// itemCls : 'icon-button icon-reject',
				itemText : getLabel('userMstActionApprove', 'Approve'),
				maskPosition : 2

			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-revarsal',
				itemText : getLabel('userMstActionReject', 'Reject'),
				maskPosition : 4
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	isParentRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = '11111111';
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			{
			BUTTONMASK = jsonData.d.__buttonMask;
			buttonMask = jsonData.d.__buttonMask;
			}
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = '11111111';//doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if (maskPosition === 2 && retValue) {
			retValue = retValue && isSameUser && (record.data.reconcilableAmount === record.data.reconciledAmount) && (record.data.owner === 'TRUE') && (record.data.canReconInitiate === true);
		}
		else if (maskPosition === 3 && retValue) {
			retValue = retValue && isSameUser && (record.data.reconcilableAmount !== record.data.reconciledAmount) && (record.data.owner === 'TRUE') && (record.data.canReconInitiate === true);
		}
		return retValue;
	},

	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [ {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 8
			},{
			itemId : 'btnClose',
			toolTip : getLabel('closeToolTip', 'Close'),
			itemLabel : getLabel('closeToolTip', 'Close'),
			maskPosition : 2
				// fnClickHandler : editRecord
			},{
			itemId : 'btnManualMatch',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('manualMatchToolTip', 'Manual Match'),
			maskPosition : 3,
			itemLabel : getLabel('manualMatchToolTip', 'Manual Match')
				// fnClickHandler : viewRecord
			}];
		//colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colHeader: getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},

	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Confirm' :
						itemsArray.push({
							text : getLabel('userMstActionConfirm', 'Confirm'),
							actionName : 'confirm',
							itemId : 'confirm',
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

				}

			}
		}
		return itemsArray;
	},
	innerGridConfig : {
		height : 190,
		enableLocking : false,
		checkBoxColumnWidth : _GridCheckBoxWidth,
		enableColumnHeaderMenu:false,
		nestedGridConfigs : {
			enableGridNesting : false,
			isInnerGrid : true
		},
		stateful : true,
		multiSort : false,
		storeModel : {
			fields : ['invoiceAmount', 'invoiceNumber', 'invoiceDate', 'matchAmount', 'reconType', 'currencyCode',
			          'systemRule', 'invoiceReconStatus', '__invoicemetadatanode','identifier','parentIdentifier'],
			dataNode : 'reconciliationInvoiceHeaderBean'
		},
		columnModel : [{
					colId : 'actioncontent',
					colHeader: getLabel('actions', 'Actions'),
					colType : 'actioncontent',
					width : 108,
					//locked : true,
					//lockable : false,
					sortable : false,
					hideable : false,
					items :  [ {
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record'),
							itemLabel : getLabel('viewToolTip', 'View Record'),
							maskPosition : 8,
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = 'invoiceReconView.form';
								$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
											'rowAction', 'view']);
								
							}
						}, {
							itemId : 'btnConfirm',
							toolTip : getLabel('userMstActionConfirm', 'Confirm'),
							itemLabel : getLabel('userMstActionConfirm', 'Confirm'),
							maskPosition : 1,
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = Ext.String.format('services/invoiceReceiptList/{0}.srvc', 'confirm');
								$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
											'rowAction', 'confirm']);
								
							}
						}, {
							itemId : 'btnUnmatch',
							toolTip : getLabel('unMatchToolTip', 'UnMatch'),
							itemLabel : getLabel('unMatchToolTip', 'UnMatch'),
							maskPosition : 5,
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = Ext.String.format('services/invoiceReceiptList/{0}.srvc', 'unMatch');
								$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
											'rowAction', 'unMatch']);
								
							}
						}, {
							itemId : 'btnDiscard',
							itemCls : getLabel('userMstActionDiscard', 'Discard'),
							itemLabel : getLabel('userMstActionDiscard', 'Discard'),
							maskPosition : 3,
								// fnVisibilityHandler : isIconVisible
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = Ext.String.format('services/invoiceReceiptList/{0}.srvc', 'discard');
								$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
											'rowAction', 'discard']);
								
							}
						}, {
							itemId : 'btnApprove',
							itemCls : getLabel('userMstActionApprove', 'Approve'),
							itemLabel : getLabel('userMstActionApprove', 'Approve'),
							maskPosition : 2,
								// fnVisibilityHandler : isIconVisible
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = Ext.String.format('services/invoiceReceiptList/{0}.srvc', 'accept');
								$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
											'rowAction', 'approve']);
								
							}
						}, {
							itemId : 'btnReject',
							itemCls : getLabel('userMstActionReject', 'Reject'),
							itemLabel : getLabel('userMstActionReject', 'Reject'),
							maskPosition : 4,
								// fnVisibilityHandler : isIconVisible
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
								var me = this;
								var strUrl = Ext.String.format('services/invoiceReceiptList/{0}.srvc', 'reject');
								var titleMsg = '', fieldLbl = '';
								titleMsg = getLabel('userRejectRemarkPopUpTitle',
								'Please Enter Reject Remark');
								fieldLbl = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
							
								Ext.Msg.show({
										title : titleMsg,
										msg : fieldLbl,
										buttons : Ext.Msg.OKCANCEL,
										multiline : 4,
										cls:'t7-popup',
										style : {
											height : 400
										},
										bodyPadding : 0,
										fn : function(btn, text) {
											if (btn == 'ok') {
												if(Ext.isEmpty(text))
												{
													Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
												}
												else
												{
													$(document).trigger("handleGroupActions",[strUrl, '', gridView, record,
																								'rowAction', 'view']);
												}
											}
										}
									});
							}
						}, {
							itemId : 'btnViewHistory',
							itemCls : getLabel('historyToolTip', 'View History'),
							itemLabel : getLabel('historyToolTip', 'View History'),
							maskPosition : 7,
								// fnVisibilityHandler : isIconVisible
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
										var historyPopup =	Ext.create('GCP.view.HistoryPopup', {
											historyUrl : 'services/invoiceReceiptList/history.json',
											identifier : record.data.parentIdentifier,
											childIdentifier :record.data.identifier
										}).show();
										historyPopup.center();
									}
						}, {
							itemId : 'btnEditMatch',
							itemCls : getLabel('editToolTip', 'Edit'),
							itemLabel : getLabel('editToolTip', 'Edit'),
							maskPosition : 6,
							// fnVisibilityHandler : isIconVisible
							fnClickHandler : function(gridView, rowindex, c, menu, e, record) {
											var me = this;
											var viewState = '['+record.data.identifier+']';
											var updateIndex = rowIndex;
											var form, inputField;
											form = document.createElement('FORM');
											form.name = 'frmMain';
											form.id = 'frmMain';
											form.method = 'POST';
											form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
											form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',viewState));		
											form.action = "showEditManualMatchReceiptRecon.form";
											document.body.appendChild(form);
											form.submit();
											document.body.removeChild(form);									
									}
								}]
					//visibleRowActionCount : 1
				}, {
					"colId" : "invoiceNumber",
					"colHeader" : getLabel("invoiceNumber","Invoice Number"),
					"colDesc"	: getLabel("invoiceNumber","Invoice Number"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 175,
					"sortable" : false
				}, {
					"colId" : "invoiceDate",
					"colHeader" : getLabel("invoiceDate","Date"),
					"colDesc"	: getLabel("invoiceDate","Date"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 130,
					"sortable" : false
				}, {
					"colId" : "invoiceAmount",
					"colHeader" : getLabel("invoiceAmount","Amount"),
					"colDesc"	: getLabel("invoiceAmount","Amount"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 155,
					"sortable" : false,
					"fnColumnRenderer" : function(value, meta, record, rowIndex, colIndex, store,
							view, colId){
						value = value + " " + record.data.currencyCode;
						return value;
					}
				}, {
					"colHeader" : getLabel("matchAmount","Match Amount"),
					"colDesc"	: getLabel("matchAmount","Match Amount"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 155,
					"sortable" : false,
					"fnColumnRenderer" : function(value, meta, record, rowIndex, colIndex, store,
							view, colId){
						if(value!=undefined)
						{
				value = value + " " + record.data.currencyCode;
						}
						return value;
					}
				}, {
					"colId" : "reconType",
					"colHeader" : getLabel("reconType","Match Type"),
					"colDesc"	: getLabel("reconType","Match Type"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 170,
					"sortable" : false
				}, {
					"colId" : "systemRule",
					"colHeader" : getLabel("systemRule","Rule"),
					"colDesc"	: getLabel("systemRule","Rule"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 130,
					"sortable" : false
				}, {
					"colId" : "invoiceReconStatus",
					"colHeader" : getLabel("invoiceReconStatus","Status"),
					"colDesc"	: getLabel("invoiceReconStatus","Status"),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"width" : 145,
					"sortable" : false,
					"fnColumnRenderer" : function(value, meta, record, rowIndex, colIndex, store,view, colId)
					{
						value = value.replace(/\s/g,'');
						value=getLabel(value,value);
						return value;
					}
				}],
		hideRowNumbererColumn :true,
		showCheckBoxColumn : true,
		showEmptyRow : false,
		showPager : false,
		showSummaryRow : false,
        showSorterToolbar : false,
        cfgShowFilter : false,
        headerDockedItems : null,
        isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
				if(record.data.reconType == "M" || record.data.reconType == "Match")
				record.data.reconType = getLabel('Match','Match');
				else 
	     			record.data.reconType = getLabel('nearmatch','Near Match');
				
				var maskSize = 8;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__invoicemetadatanode.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if (!Ext.isEmpty(maskPosition)) {
					bitPosition = parseInt(maskPosition,10) - 1;
					maskSize = maskSize;
				}
				if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(BUTTONMASK))
					buttonMask = BUTTONMASK;
				buttonMask = buttonMask;
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
				if ((maskPosition === 1 && retValue)) {
					retValue = retValue && isSameUser;
				}else if ((maskPosition === 2 && retValue)) {
					retValue = retValue && isSameUser;
				}else if ((maskPosition === 3 && retValue)) {
					retValue = retValue && isSameUser;
				}else if ((maskPosition === 4 && retValue)) {
					retValue = retValue && isSameUser;
				}else if ((maskPosition === 5 && retValue)) {
					retValue = retValue && isSameUser;
				}else if ((maskPosition === 6 && retValue)) {
					retValue = retValue && isSameUser;
				}
				return retValue;
				
		},

        listeners : {
        	'innergridRowSelectionChange' : function( grid, record, index,
				arrSelectedRecords, jsonData, action){
        		if(action === 'select'){
						arrInnerSelectedRecords.push(record);
						var me = this;
						var buttonMask = me.strDefaultMask;
						var blnAuthInstLevel = false;
						var maskArray = new Array(), actionMask = '', objData = null;;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(BUTTONMASK))
							buttonMask = BUTTONMASK;
						
						maskArray.push(buttonMask);
						var isCrossCcy = false;
						for (var index = 0; index < arrSelectedRecords.length; index++) {
							objData = arrSelectedRecords[index];
							maskArray.push(objData.get('__invoicemetadatanode').__rightsMap);
						}
						actionMask = doAndOperation(maskArray, 8); 
						$(document).trigger("handleGroupActionsVisibility",[actionMask]);
					}	
				else if(action === 'deselect') {
								arrInnerSelectedRecords.splice(arrInnerSelectedRecords.indexOf(record), 1);
							if(!Ext.isEmpty(arrSelectedRecords)	&& arrSelectedRecords.length > 0){
								var me = this;
								var buttonMask = me.strDefaultMask;
								var blnAuthInstLevel = false;
								var maskArray = new Array(), actionMask = '', objData = null;;

								if (!Ext.isEmpty(jsonData)
										&& !Ext.isEmpty(BUTTONMASK))
									buttonMask = BUTTONMASK;
								
								maskArray.push(buttonMask);
								var isCrossCcy = false;
								for (var index = 0; index < arrSelectedRecords.length; index++) {
									objData = arrSelectedRecords[index];
									maskArray.push(objData.get('__invoicemetadatanode').__rightsMap);
								}
								actionMask = doAndOperation(maskArray, 8);
							}
							else
								actionMask = '00000000';
							$(document).trigger("handleGroupActionsVisibility",[actionMask]);
							}
					},
					'cellclick' : function(tableView, td, cellIndex, record, tr, rowIndex, e) {
						var clickedColumn = tableView.getGridColumns()[cellIndex];
						var columnType = clickedColumn.colType;
						if (Ext.isEmpty(columnType)) {
							if(clickedColumn.cls){
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							else{
								columnType='rowexpand';
							}
						}
						if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn'  && columnType !== 'rowexpand') {
							if (columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
								var strUrl = 'invoiceReconView.form';
								$(document).trigger("handleGroupActions",[strUrl, '', tableView, record,
											'rowAction', 'view']);
							}
						}
					}
        }
	}
});