Ext.define( 'GCP.view.LoanCenterGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.LoanCenterGroupActionBarView', 'GCP.view.LoanCenterFilterView'
	],
	xtype : 'loanCenterGridViewType',	
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.LoanCenterGroupActionBarView',
		{
			itemId : 'loanCenterGroupActionBarView_summDtlItemId',			
			parent : me
		} );
		
		var groupView = me.createGroupView();
		
		this.items =
			[groupView];
					me.on('resize', function() {
							me.doLayout();
					});
		this.callParent( arguments );
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}, objGridSetting = {}, arrColumnSetting;
		if (objLoanCenterPref) {
			var objJsonData = Ext.decode(objLoanCenterPref);
		    objGroupByPref = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: LOANCENTER_GENERIC_COLUMN_MODEL || [];		    
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
		
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			//cfgGroupByUrl : 'services/grouptype/loanCenterTxnSummary/groupBy.json?$filterscreen=loanCenterTxnAdvFltr',
			cfgGroupByUrl : isSiTabSelected == 'Y' ? 'services/grouptype/loanCenterSiSummary/groupBy.json?$filterscreen=loanCenterSiAdvFltr&$filterGridId=GRD_LOAN_LONSISUMM' : 'services/grouptype/loanCenterTxnSummary/groupBy.json?$filterscreen=loanCenterTxnAdvFltr&$filterGridId=GRD_LOAN_LONTXNSUMM',
			cfgSummaryLabel : isSiTabSelected == 'Y' ? getLabel( 'siTemplate', 'Recurring Template' ) : getLabel( 'transactions',
					'Transactions' ),//'TRANSACTIONS',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGroupByPref.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			cfgShowFilter : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'loanCenterFilterViewType'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				cfgShowRefreshLink : false,
				showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : false,
				showSorterToolbar : _charEnableMultiSort,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {				
					fields :
					[
						'requestReference', 'obligorID', 'obligationID', 'accountName', 'requestedAmnt','trackingNo','requestDate',
						'effectiveDate', 'siNextExecDate', 'paymentTypeDesc', 'requestStatusDesc', 'siRequestStatusDesc',
						'hostResponseMsg', 'paymentType', 'recordKeyNo', 'version', 'history', 'identifier',
						'countPaydown','countAdvance','countInvoice','bdAmountPaydown','bdAmountAdvance','bdAmountInvoice',
						'__metadata', '__subTotal'
					],
					proxyUrl : 'getLoanCenterList.srvc',
					rootNode : 'd.loanCenterTxn',
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
					itemText : getLabel( 'prfMstActionApprove', 'Approve' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 1
				},
				'Discard' : {
					actionName : 'discard',
					itemText : getLabel( 'prfMstActionDiscard', 'Discard' ),
					maskPosition : 3
				},
				'Reject' : {
					actionName : 'reject',
					itemText : getLabel( 'prfMstActionReject', 'Reject' ),
					hidden : isHidden( 'approvalRequired' ),
					maskPosition : 2
				},
				'Enable' : {
					actionName : 'enable',
					itemText : getLabel( 'prfMstActionEnable', 'Enable' ),
					maskPosition : 6
				},
				'Disable' : {
					actionName : 'disable',
					itemText : getLabel( 'prfMstActionDisable', 'Suspend' ),
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
					itemText : getLabel( 'prfMstActionApprove', 'Approve' ),
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
		 meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	createObjWidthMap : function() 
	{
		if( isSiTabSelected == 'Y' )
		{
			var objWidthMap =
			{
				"requestReference" : 200,
				"obligorID" : 160,
				"obligationID" : 160,
				"accountName" : 160,
				"requestedAmnt" : 160,
				"effectiveDate" : 160,
				"paymentTypeDesc" : 160,
				"siRequestStatusDesc" : 160
			};
		}
		else
		{
			var objWidthMap =
			{
				"requestReference" : 200,
				"obligorID" : 160,
				"obligationID" : 160,
				"accountName" : 160,
				"requestedAmnt" : 160,
				"trackingNo" : 160,
				"requestDate" : 140,
				"paymentTypeDesc" : 160,
				"requestStatusDesc" : 200,
				"hostResponseMsg" : 200
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
				cfgCol.sortable = objCol.sortable;
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
			maskSize = 7;
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
			//arrCols.push( me.createSiGroupActionColumn() );
			var objActionCol =
			{
			colType : 'actioncontent',
			colId : 'actioncontent',
			flex : 1,
			sortable : false,
			colHeader:'Actions',
			visibleRowActionCount : 1,
			hideable : false,
			locked : true,
			items :
			[
				{
					itemId : 'btnView',
				//	itemCls : 'grid-row-action-icon icon-view',
					itemLabel : getLabel('viewToolTip', 'View Record'),
					toolTip : getLabel( 'viewToolTip', 'View Record' ),
					maskPosition : 5
				},
				{
					itemId : 'btnHistory',
					itemCls : 'grid-row-action-icon icon-history',
					itemLabel : getLabel('historyToolTip', 'View History'),
					toolTip : getLabel( 'historyToolTip', 'View History' ),
					maskPosition : 4
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
					itemLabel : getLabel( 'disable', 'Suspend' ),
					maskPosition : 7
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
				colId : 'actioncontent',
				flex : 1,
				colHeader:'Actions',
				sortable : false,
				visibleRowActionCount : 1,
				locked : true,
				items :
				[
					{
						itemId : 'btnView',
					//	itemCls : 'grid-row-action-icon icon-view',
						itemLabel : getLabel('viewToolTip', 'View Record'),
						toolTip : getLabel( 'viewToolTip', 'View Record' ),
						maskPosition : 5
					},
					{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel( 'historyToolTip', 'View History' ),
						toolTip : getLabel( 'historyToolTip', 'View History' ),
						maskPosition : 4
					},
					{
						itemId : 'accept',
						//itemCls : 'grid-row-text-icon icon-auth-text',
						itemLabel : getLabel( 'auth', 'Approve' ),
						hidden : isHidden( 'approvalRequired' ),
						maskPosition : 1
					},
					{
						itemId : 'reject',
						//itemCls : 'grid-row-text-icon icon-reject-text',
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
						itemId : 'btnClone',
						//itemCls : 'grid-row-action-icon icon-clone',
						itemLabel : getLabel('lblclone','Copy Record'),
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
					itemLabel : getLabel( 'auth', 'Auth' ),
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
					itemLabel : getLabel( 'disable', 'Suspend' ),
					maskPosition : 7
				}
			]}
		return objActionCol;
	}
} );
