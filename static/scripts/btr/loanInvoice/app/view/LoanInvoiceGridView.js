Ext.define( 'GCP.view.LoanInvoiceGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.LoanInvoiceGroupActionBarView', 'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'loanInvoiceNewGridViewType',
	componentCls : 'gradiant_back',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		
	/*	this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_hide-image',
						flex : 1,
						items :
						[
							{
								xtype : 'label',
								text : '',
								flex : 1
							},
							{
								xtype : 'container',
								layout : 'hbox',
								cls : 'rightfloating',
								items :
								[
									{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : getLabel( 'searchOnPage', 'Search on Page' ),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											itemId : 'menu',
											items :
											[
												{
													xtype : 'radiogroup',
													itemId : 'matchCriteria',
													vertical : true,
													columns : 1,
													items :
													[
														{
															boxLabel : getLabel( 'exactMatch',
																'Exact Match' ),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														},
														{
															boxLabel : getLabel( 'anyMatch',
																'Any Match' ),
															name : 'searchOnPage',
															inputValue : 'anyMatch',
															checked : true
														}
													]
												}
											]
										} )
									},
									{
										xtype : 'textfield',
										itemId : 'searchTxnTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}
								]
							}
						]
					}
				]
			},
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon ux_border-bottom',
				title : getLabel( 'invoiceDetails', 'Invoice Details' ),
				itemId : 'loanInvoiceNewDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								text : '',
								flex : 1
							}
						]

					}
				]
			}
		];*/
		
		var me = this;
		
		var groupView = me.createGroupView();
				me.items = [groupView];
				me.on('resize', function() {
							me.doLayout();
					});
		
		this.callParent( arguments );
	},
	
		createGroupView : function() {
		var me = this;
		var groupView = null;

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/invoiceGridFilter/groupBy.json?$filterscreen=invoiceGridFilter',
			//cfgGroupByUrl : 'static/scripts/btr/loanInvoice/data/groupBy.json?$filterscreen=groupViewFilter',?
			cfgSummaryLabel : 'TRANSACTIONS',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			cfgParentCt : me,
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			cfgGridModel : {
				pageSize : _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showSummaryRow : true,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				fields :
					[
						'invoiceNumber', 'accountNumber','accountName', 'totalAmtDue', 'paidAmount', 'noteType', 'dateOfNote',
						'paymentDate', 'loanStatus', 'identifier', '__metadata', 'dueDate', 'amountDue', 'amtPastDue',
						'history', 'routingNumber', 'outStandingSum', 'overDueSum', 'pendingSum', 'totalAmtDueDesc',
						'clientId', 'outStandingCount', 'overDueCount', 'pendingCount', 'obligorNumber', 'interestDue','accountId',
						'feeDue','clientDesc','sellerId','amountDueDesc','interestDueDesc','feeDueDesc','closestDueDateAfter','closestDueDateBefore'
					],
						proxyUrl : 'getLoanInvoiceNewList.srvc',
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
			//	groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(LOAN_INVOICE_GENERIC_COLUMN_MODEL),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
			//	fnColumnRenderer : me.columnRenderer,
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
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 11;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition,10 ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );

				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );

				if( ( maskPosition === 6 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 7 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;
			},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId) 
			{
					var strRetValue = "";
					if(Ext.isEmpty(value) || (typeof(value)=="string" && value.indexOf("null")!=-1)){
						strRetValue = "";
					}
					else{
						strRetValue = value;
						}
				return strRetValue;
			},
		getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 'Discard',
		 'Approve','Reject', 'Enable','Disable']);
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
				itemText : getLabel('prfMstActionSubmit', 'Submit'),
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
				itemText : getLabel('prfMstActionDiscard', 'Discard'),
				maskPosition : 10
			},
			'Approve' : {
				actionName : 'accept',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('prfMstActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('prfMstActionReject', 'Reject'),
				maskPosition : 7
			},
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('prfMstActionEnable', 'Enable'),
				maskPosition : 8
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('prfMstActionDisable', 'Disable'),
				maskPosition : 9
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
		getColumnModel : function(arrCols) {
		var me = this;
		var arrRowActions = [
			/*{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit'),
			itemLabel : getLabel('editToolTip', 'Edit'),
			maskPosition : 2
				// fnClickHandler : editRecord
			},*/ 
			{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewRecordToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 2
				// fnClickHandler : viewRecord
			},
			{
				itemId : 'btnViewPayment',
				itemCls : 'grid-row-action-icon icon-clone',
				itemLabel : getLabel( 'actionViewPayment', 'View Payment' ),
				toolTip : getLabel( 'viewPaymentToolTip', 'View Payment' ),
				maskPosition : 2
						}			
			/*{
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}*/];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns=new Array();
		arrColumns.push(colGroupAction);
		for( var i = 0 ; i < arrCols.length ; i++ )
					{
						objCol = arrCols[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.hidden;
						cfgCol.locked = objCol.locked;
						if( !Ext.isEmpty( objCol.hidden ) )
						{
							cfgCol.hidden = objCol.hidden;
						}

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						if( objCol.colId === 'invoiceNumber' )
						{
							cfgCol.fnSummaryRenderer = function(value, summaryData,dataIndex, rowIndex, colIndex, store, view, colId) {
								var strRet = '';
				
								var data = store.proxy.reader.jsonData;
								if( data && data.d && data.d.__subTotal )
								{
									strSubTotal = data.d.__subTotal;
								}
								if( null != strSubTotal && strSubTotal != ' ' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}
						if( objCol.colId === 'paidAmount' )
						{
							cfgCol.align = 'right';
							cfgCol.width = 100;
							cfgCol.fnSummaryRenderer = function(value, summaryData,dataIndex, rowIndex, colIndex, store, view, colId) {
									var data = store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != ' ' )
											strRet = data.d.__subTotal;
									}
								return strRet;
							}
						}
						if( objCol.colId === 'amountDue' )
						{
							cfgCol.align = 'right';
						}
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
						//if(cfgCol.width === 120)
						//	cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrColumns.push( cfgCol );
					}
		return arrColumns;
	},
		createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
	//	var actionsForWidget = availableGroupActionForGrid.row_level_actions;
	//	colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader:'Action',
			width : 90,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items :
					[
						{
							itemId : 'pay',
							text : 'Pay Invoice',
							toolTip : getLabel( 'actionPay', 'Pay Invoice' ),
							maskPosition : 1
						}
					]
		};
		return objActionCol;
	}
} );
