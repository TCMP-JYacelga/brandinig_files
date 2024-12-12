Ext.define( 'GCP.view.CurrencyRateDtlView',
{
	extend : 'Ext.container.Container',
	xtype : 'currencyRateDtlViewType',
	requires :
	[
		'Ext.container.Container', 'Ext.ux.gcp.GroupView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		var groupView = me.createGroupView();
		me.items =
		[
			groupView
		];

		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	},

	createGroupView : function()
	{
		var me = this;
		var groupView = null;
		var objGroupByPref = {};

		groupView = Ext.create( 'Ext.ux.gcp.GroupView',
		{
			itemId : 'currencyRateDtlGroupViewItemId',
			cfgGroupByUrl : 'services/grouptype/currencyRateMst/groupBy.json?$filterscreen=groupViewFilter',
			cfgSummaryLabel : getLabel('lbl.currencyRates','FX Rates'),
			cfgGroupByLabel : getLabel('groupedBy','Grouped By'),
			cfgShowRefreshLink : false,
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			cfgParentCt : me,
			cfgGridModel :
			{
				pageSize : _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : false,
				minHeight : 100,
				height : 400,
				hideRowNumbererColumn : true,
				enableCellEditing : pageMode == 'VIEW' ? false : true,
				enableColumnHeaderFilter : false,
				showCheckBoxColumn : false,
				columnHeaderFilterCfg :
				{
					remoteFilter : true,
					filters :
					[
						{
							type : 'list',
							colId : 'actionStatus',
							options : []
						}
					]
				},
				storeModel :
				{
					fields :
					[
						'uploadNmbr', 'uploadDateTime', 'ccyPairCode', 'ccyCode', 'derivedCcyCode', 'buyFxRate',
						'recordKeyNo', 'version', 'sellFxRate', 'fxRate', '__metadata', 'history', 'identifier'
					],
					proxyUrl : 'services/currencyRateDtlList.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example The example for groupActionModel as below : [{
				 *          //@requires Used while creating the action url.
				 *          actionName : 'submit', //@optional Used to display
				 *          the icon. itemCls : 'icon-button icon-submit',
				 *          //@optional Defaults to true. If true , then the
				 *          action will considered in enable/disable on row
				 *          selection. isGroupAction : false, //@optional Text
				 *          to display itemText :
				 *          getLabel('instrumentsActionSubmit', 'Submit'),
				 *          //@requires The position of the action in mask.
				 *          maskPosition : 5 //@optional The position of the
				 *          action in mask. fnClickHandler : function(tableView,
				 *          rowIndex, columnIndex, btn, event, record) { }, }, {
				 *          actionName : 'verify', itemCls : 'icon-button
				 *          icon-verify', itemText :
				 *          getLabel('instrumentsActionVerify', 'Verify'),
				 *          maskPosition : 13 }]
				 */
				//groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel( CURRENCY_RATE_DTL_GENERIC_COLUMN_MODEL ),
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
				 * @example fnRowIconVisibilityHandler : function(store, record,
				 *          jsonData, iconName, maskPosition) { return true; }
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
		} );
		return groupView
	},

	getColumnModel : function( arrCols )
	{
		var me = this;
		var arrColumns = [];
		return arrColumns.concat( arrCols || [] );
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
		else if( maskPosition === 2 && retValue )
		{
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = ( reqState === 3 && validFlag == 'N' );
			var isSubmitModified = ( reqState === 1 && submitFlag == 'Y' );
			retValue = retValue && ( !isDisabled ) && ( !isSubmitModified );
		}
		else if( maskPosition === 10 && retValue )
		{
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = ( reqState === 0 && submitFlag == 'Y' );
			retValue = retValue && ( !submitResult );
		}
		else if( maskPosition === 8 && retValue )
		{
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && ( reqState == 3 && validFlag == 'N' );
		}
		else if( maskPosition === 9 && retValue )
		{
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && ( reqState == 3 && validFlag == 'Y' );
		}
		return retValue;
	},

	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	}

} );
