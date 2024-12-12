Ext.define( 'GCP.view.LoanCenterGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.LoanCenterGroupActionBarView', 'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'loanCenterGridViewType',
	cls : 'xn-ribbon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.LoanCenterGroupActionBarView',
		{
			itemId : 'loanCenterGroupActionBarView_summDtlItemId',
			height : 21,
			width : '100%',
			margin : '3 0 0 0',
			parent : me
		} );
		
		var groupView = me.createGroupView();
		//me.items = [groupView,
		
		this.items =
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
															boxLabel : getLabel( 'exactMatch', 'Exact Match' ),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														},
														{
															boxLabel : getLabel( 'anyMatch', 'Any Match' ),
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

			/*{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon',
				bodyCls : 'x-portlet',
				title : isSiTabSelected == 'Y' ? getLabel( 'siTemplate', 'Recurring Template' ) : getLabel( 'transactions',
					'Transactions' ),
				itemId : 'loanCenterDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'font_bold ux-ActionLabel',
								padding : '6 0 0 10'
							}, actionBar,
							{
								xtype : 'label',
								text : '',
								flex : 1
							}
						]

					}
				]
			},*/ groupView
		];
		this.callParent( arguments );
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			//cfgGroupByUrl : 'services/grouptype/loanCenterTxnSummary/groupBy.json?$filterscreen=loanCenterTxnAdvFltr',
			cfgGroupByUrl : isSiTabSelected == 'Y' ? 'services/grouptype/loanCenterSiSummary/groupBy.json?$filterscreen=loanCenterSiAdvFltr' : 'services/grouptype/loanCenterTxnSummary/groupBy.json?$filterscreen=loanCenterTxnAdvFltr',
			//cfgGroupByUrl : 'static/scripts/btr/loanCenter/data/groupBy.json',
			cfgSummaryLabel : isSiTabSelected == 'Y' ? getLabel( 'siTemplate', 'Recurring Template' ) : getLabel( 'transactions',
					'Transactions' ),//'TRANSACTIONS',  
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
				showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				/*fields : ['clientName', 'profileName', 'clientId', 'clientDesc',
					'integrityCheckFlag', 'encryptionFlag', 'singingFlag',
					'requestStateDesc', 'identifier', 'history', '__metadata'],
						proxyUrl : 'cpon/securityProfileMst.json',
						rootNode : 'd.profile',
					totalRowsNode : 'd.__count'*/
					fields :
					[
						'requestReference', 'obligorID', 'obligationID', 'accountName', 'requestedAmnt', 'requestDate',
						'effectiveDate', 'paymentTypeDesc', 'requestStatusDesc', 'siRequestStatusDesc',
						'hostResponseMsg', 'paymentType', 'recordKeyNo', 'version', 'history', 'identifier',
						'countPaydown','countAdvance','countInvoice','bdAmountPaydown','bdAmountAdvance','bdAmountInvoice',
						'__metadata', '__subTotal'
					],
					proxyUrl : 'getLoanCenterList.srvc',
					rootNode : 'd.loanCenterTxn',
					sortState : me.arrSorter,
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
				defaultColumnModel : me.getColumnModel(LOANCENTER_GENERIC_COLUMN_MODEL),
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
				 //rowIndex, colIndex, store, view, colId) {
					
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
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Accept',
		'Reject', 'Discard', 'Enable','Disable']);
		if( isSiTabSelected == 'Y' )
		{
			var objActions = {
				'Accept' : {
					actionName : 'accept',
					isGroupAction : true,
					itemText : getLabel( 'auth', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				'Discard' : {
					actionName : 'discard',
					itemText : getLabel( 'discard', 'Discard' ),
					maskPosition : 3
				},
				'Reject' : {
					actionName : 'reject',
					itemText : getLabel( 'reject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				},
				'Enable' : {
					actionName : 'enable',
					itemText : getLabel( 'enable', 'Enable' ),
					maskPosition : 6
				},
				'Disable' : {
					actionName : 'disable',
					itemText : getLabel( 'disable', 'Disable' ),
					maskPosition : 7
				}
			};
		}
		else
		{
			var objActions = {
				'Accept' : {
					actionName : 'accept',
					isGroupAction : true,
					itemText : getLabel( 'auth', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				'Discard' : {
					actionName : 'discard',
					itemText : getLabel( 'discard', 'Discard' ),
					maskPosition : 3
				},
				'Reject' : {
					actionName : 'reject',
					itemText : getLabel( 'reject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				}
			};
		}
		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if( colId === 'col_copyTo' )
		{
			if( value > 0 )
			{
				strRetValue = '<a class="underlined cursor_pointer" onclick="showClientPopup(\''
					+ record.get( 'profileId' ) + '\')">' + value + '</a>';
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
	createObjWidthMap : function() 
	{
		if( isSiTabSelected == 'Y' )
		{
			var objWidthMap =
			{
				"requestReference" : 90,
				"obligorID" : 100,
				"obligationID" : 120,
				"accountName" : 120,
				"requestedAmnt" : 100,
				"effectiveDate" : 90,
				"paymentTypeDesc" : 90,
				"siRequestStatusDesc" : 90
			};
		}
		else
		{
			var objWidthMap =
			{
				"requestReference" : 90,
				"obligorID" : 90,
				"obligationID" : 120,
				"accountName" : 120,
				"requestedAmnt" : 90,
				"requestDate" : 100,
				"paymentTypeDesc" : 90,
				"requestStatusDesc" : 90,
				"hostResponseMessage" : 120
			};
		}
		return (objWidthMap);
	},
	getColumnModel : function(arrColsPref) {
		var me = this;
		var arrCols = new Array();
		var objCol = null, cfgCol = null;
		var objWidthMap = me.createObjWidthMap();
		/*if( isSiTabSelected == 'Y' )
		{
			arrCols.push( me.createSiGroupActionColumn() );
		}
		else
		{
			arrCols.push( me.createGroupActionColumn() );
		}*/
		arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				cfgCol.locked = objCol.locked;
				cfgCol.width = objCol.width;
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}
				else if( objCol.colId === 'requestedAmnt' )
				{
					cfgCol.align = 'right';
				}

				if( objCol.colId === 'requestReference' ) 
				{	// to show the summary row description
					cfgCol.fnSummaryRenderer = function(value, summaryData, dataIndex, rowIndex,
			colIndex, store, view, colId)
					{	
						var strRet = '';
						var strSubTotal;


							var data = store.proxy.reader.jsonData;
							if( data && data.d && data.d.__subTotal )
							{
								strSubTotal = data.d.__subTotal;
							}
						//}
						if( null != strSubTotal && strSubTotal != '$0.00' )
						{
							strRet = getLabel( 'subTotal', 'Sub Total' );
						}
						return strRet;
					}
				}

				if( objCol.colId === 'requestedAmnt' ) // to show
				// subtotal
				// value
				{
					cfgCol.fnSummaryRenderer = function(value, summaryData, dataIndex, rowIndex,
			colIndex, store, view, colId )
					{
						var strRet = '';
							var data = store.proxy.reader.jsonData;
							if( data && data.d && data.d.__subTotal )
							{
								if( data.d.__subTotal != '$0.00' )
									strRet = data.d.__subTotal;
							}
						return strRet;
					}
				}
				cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
				if(cfgCol.width === 120)
					cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push( cfgCol );
			}
		}
		return (arrCols || []);
	},
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		var maskSize = 6;
		if( isSiTabSelected == 'Y' )
			maskSize = 8;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if( !Ext.isEmpty( maskPosition ) )
		{
			bitPosition = parseInt( maskPosition,10 ) - 1;
			// maskSize = maskSize;
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
		if( ( maskPosition === 1 && retValue ) )
		{
			retValue = retValue && isSameUser;
		}
		else if( maskPosition === 2 && retValue )
		{
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	createActionColumn : function()
	{
		var me = this;
		
		if( isSiTabSelected == 'Y' )
		{
			var objActionCol =
			{
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'center',
			locked : true,
			items :
			[		
			 	// commented due to issue for approved records
				/*{
					itemId : 'btnEdit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel('editToolTip', 'Edit'),					
					maskPosition : 8
				},*/
				{
					itemId : 'btnView',
					itemCls : 'grid-row-action-icon icon-view',
					toolTip : getLabel( 'viewToolTip', 'View Record' ),
					maskPosition : 5
				},
				{
					itemId : 'accept',
					itemCls : 'grid-row-text-icon icon-auth-text',
					itemLabel : getLabel( 'auth', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				{
					itemId : 'reject',
					itemCls : 'grid-row-text-icon icon-reject-text',
					itemLabel : getLabel( 'reject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				},
				{
					itemId : 'discard',
					// icon-discard-text',
					itemLabel : getLabel( 'discard', 'Discard' ),
					maskPosition : 3
				},
				{
					itemId : 'enable',
					// itemCls : 'grid-row-text-icon
					// icon-enable-text',
					itemLabel : getLabel( 'enable', 'Enable' ),
					maskPosition : 6
				},
				{
					itemId : 'disable',
					// itemCls : 'grid-row-text-icon
					// icon-disable-text',
					itemLabel : getLabel( 'disable', 'Disable' ),
					maskPosition : 7
				},
				{
					itemId : 'btnHistory',
					itemCls : 'grid-row-action-icon icon-history',
					toolTip : getLabel( 'historyToolTip', 'View History' ),
					itemLabel : getLabel( 'historyToolTip', 'View History' ),
					maskPosition : 4
				}
			]
		};
		}
		else
		{
			//arrCols.push( me.createGroupActionColumn() );
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				align : 'center',
				locked : true,
				items :
				[
					{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						toolTip : getLabel( 'historyToolTip', 'View History' ),
						maskPosition : 4
					},
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel( 'viewToolTip', 'View Record' ),
						maskPosition : 5
					},
					{
						itemId : 'accept',
						//itemCls : 'grid-row-text-icon icon-auth-text',
						text : getLabel( 'auth', 'Approve' ),
						hidden : isHidden( 'approvalRequired' ),
						maskPosition : 1
					},
					{
						itemId : 'reject',
						//itemCls : 'grid-row-text-icon icon-reject-text',
						text : getLabel( 'reject', 'Reject' ),
						hidden : isHidden( 'approvalRequired' ),
						maskPosition : 2
					},
					{
						itemId : 'discard',
						// itemCls : 'grid-row-text-icon
						// icon-discard-text',
						itemLabel : getLabel( 'discard', 'Discard' ),
						maskPosition : 3
					}, {
						itemId : 'btnClone',
						itemCls : 'grid-row-action-icon icon-clone',
						itemLabel : getLabel('lblclone',
								'Copy Record'),
						maskPosition : 6
					}
				]
			};
		}
		return objActionCol;		
	},
	createGroupActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,
			align : 'right',
			locked : true,
			items :
			[
				{
					itemId : 'accept',
					//itemCls : 'grid-row-text-icon icon-auth-text',
					text : getLabel( 'auth', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				{
					itemId : 'reject',
					//itemCls : 'grid-row-text-icon icon-reject-text',
					text : getLabel( 'reject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				},
				{
					itemId : 'discard',
					// itemCls : 'grid-row-text-icon
					// icon-discard-text',
					itemLabel : getLabel( 'discard', 'Discard' ),
					maskPosition : 3
				}
			]}
		return objActionCol;
	},

	createSiGroupActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			align : 'right',
			locked : true,
			items :
			[
				{
					itemId : 'accept',
					itemCls : 'grid-row-text-icon icon-auth-text',
					itemLabel : getLabel( 'auth', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				{
					itemId : 'reject',
					itemCls : 'grid-row-text-icon icon-reject-text',
					itemLabel : getLabel( 'reject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				},
				{
					itemId : 'discard',
					// itemCls : 'grid-row-text-icon
					// icon-discard-text',
					itemLabel : getLabel( 'discard', 'Discard' ),
					maskPosition : 3
				},
				{
					itemId : 'enable',
					// itemCls : 'grid-row-text-icon
					// icon-enable-text',
					itemLabel : getLabel( 'enable', 'Enable' ),
					maskPosition : 6
				},
				{
					itemId : 'disable',
					// itemCls : 'grid-row-text-icon
					// icon-disable-text',
					itemLabel : getLabel( 'disable', 'Disable' ),
					maskPosition : 7
				}
				// commented due to issue for approved records
				/*{
					itemId : 'btnEdit',
					// itemCls : 'grid-row-text-icon
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel('editToolTip', 'Edit'),
					maskPosition : 8
				}*/
			]}
		return objActionCol;
	}
} );
