Ext.define('GCP.view.DepositInquiryGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'depositInquiryGroupView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.DepositInquiryFilterView','Ext.ux.gcp.GridHeaderFilterView'],
	autoHeight : true,
	//cls : 'ux_panel-background',
	width : '100%',	
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
		var groupView = null;
		var arrSorters = new Array(), blnShowAdvancedFilter = true;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupByPref = {}
		if( !Ext.isEmpty( objDepTicketPref ) && 'Y' == isMenuClicked )
		{
			var objJsonData = Ext.decode(objDepTicketPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (DEPOSIT_GENERIC_COLUMN_MODEL || '[]');
		}		
			
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/depositInq/groupBy.srvc?$filterscreen=depositInqFilter&$filterGridId=GRD_DEP_DEPINQ&' + csrfTokenName + '=' + csrfTokenValue,
			cfgSummaryLabel :  getLabel('lbldeposit', 'Deposit Ticket'),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,	
			cls : 't7-grid',
			cfgShowFilter : true,
			//padding : '12 0 0 0',
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'depositInquiryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},	
			//cfgCaptureColumnSettingAt : 'G',
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,			
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage ||_GridSizeTxn,
				rowList : _AvailableGridSize,
				showSorterToolbar : _charEnableMultiSort,
				stateful : false,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				hideRowNumbererColumn : true,
				showCheckBoxColumn :  false,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : [ 
								'depositTicketNmbr', 'depImgNmbr', 'depositAmount', 'itemCount', 'depositAccount', 'postingDate',
								'lockBoxId',/*'storeId',*/'depSerialNmbr', 'identifier', '__metadata', '__subTotal', '__subInstCount',
								'instrumentSummaryCountInfo', 'instrumentSummaryTotalInfo', 'depositSummaryCountInfo',
								'depositSummaryTotalInfo', 'depSeqNmbr','clientDesc','sessionId', 'getItems'
							 ],
					proxyUrl : 'depositTicketGridList.srvc',
					rootNode : 'd.txnlist',
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
				//groupActionModel : {},
				defaultColumnModel : me.getColumnModel(me.getDefaultColumnModel()),
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
		return groupView;
	},	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
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

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
		
		
	},		
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var isVisibleDepImg = isHidden( 'ViewDeposit' );
		var strRetValue = value;
		if( value != '' )
		{
			
		}
		return strRetValue;
	},
	getColumnModel : function(arrCols) {
		var me = this;		
		var arrColumns = me.getActionColumns() || [];
		//var arrColumns = [];
		arrColumns = arrColumns.concat(arrCols);
		return (arrColumns || []);
	},	
	getActionColumns : function() {
		var actionColItem = [];
		actionColItem.push({
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewDepItems', 'View Deposit Items'),
			itemLabel : getLabel('viewDepItems', 'View Deposit Items'),
			maskPosition : 2
		});
		
		if(!isHidden( 'ViewDeposit' )){
		actionColItem.push({
			itemId : 'btnCheckImg',
			itemCls : 'grid-row-action-icon icon-money',//'grid-row-action-icon grid-row-check-icon 
			toolTip : getLabel('viewticketimage', 'View Ticket Image'),
			itemLabel : getLabel('viewticketimage', 'View Ticket Image')
		});
		}
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : 'Actions',
			width : 108,
			align : 'center',
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : actionColItem 
		};
		return [objActionCol];
	},
	getDefaultColumnModel : function() {
		var arrCols;
		if(entity_type === '0')
		{
			arrCols =
			[	
				{
					"colId" : "clientDesc",
					"colHeader" : "Company Name",
					width : 120
				},
				{
					"colId" : "depositTicketNmbr",
					"colHeader" : "Deposit Ticket No.",
					"hidden" : filterFields.indexOf('depositTicket') !== -1 ? false : true ,
					width : 160
				},
				{
					"colId" : "depositAccount",
					"colHeader" : "Deposit Account",
					width : 130
				},				
				{
					"colId" : "depositAmount",
					"colHeader" : "Deposit Amount",
					"colType" : "number",
					"align" : 'right',
					"hidden" : filterFields.indexOf('depositAmount') !== -1 ? false : true ,
					width : 140
				},
				/*{
					"colId" : "itemCount",
					"colHeader" : "No of Items",
					"colType" : "number",
					"align" : 'right',
					width : 100
				},*/
				/*{
					"colId" : "itemCount",
					"colHeader" : "Number of Items",
					width : 150
				},*/
				{
					"colId" : "postingDate",
					"colHeader" : "Posting Date",
					width : 100
				},
				/*{
					"colId" : "depSerialNmbr",
					"colHeader" : "Serial Number",
					width : 100
				},*/
				/*{
					"colId" : "storeId",
					"colHeader" : "Store Id",
					width : 100
				},	*/		
				{
					"colId" : "lockBoxId",
					"colHeader" : "Store Id/Lockbox",			
					"hidden" : filterFields.indexOf('lockBoxNmbr') !== -1 ? false : true ,
					width : 150
				}	
				/*{
					"colId" : "depSeqNmbr",
					"colHeader" : "Sequence Number",
					width : 120
				}*/
			];
		}
		else
		{
			arrCols =
			[ 	
				{
					"colId" : "depositTicketNmbr",
					"colHeader" : "Deposit Ticket No.",
					"hidden" : filterFields.indexOf('depositTicket') !== -1 ? false : true ,
					width : 160
				},
				{
					"colId" : "depositAccount",
					"colHeader" : "Deposit Account",
					width : 130
				},				
				{
					"colId" : "depositAmount",
					"colHeader" : "Deposit Amount",
					"colType" : "number",
					"align" : 'right',
					"hidden" : filterFields.indexOf('depositAmount') !== -1  ? false : true ,
					width : 140
				},
				/*{
					"colId" : "itemCount",
					"colHeader" : "No of Items",
					"colType" : "number",
					"align" : 'right',
					width : 100
				},*/
				/*{
					"colId" : "itemCount",
					"colHeader" : "Number of Items",
					width : 150
				},*/
				{
					"colId" : "postingDate",
					"colHeader" : "Posting Date",
					width : 100
				},
				/*{
					"colId" : "depSerialNmbr",
					"colHeader" : "Serial Number",
					width : 100
				},*/
				/*{
					"colId" : "storeId",
					"colHeader" : "Store Id",
					width : 100
				},*/			
				{
					"colId" : "lockBoxId",
					"colHeader" : "Store Id/Lockbox",		
					"hidden" : filterFields.indexOf('lockBoxNmbr') !== -1 == true ? false : true ,
					width : 150
				}
				/*{
					"colId" : "depSeqNmbr",
					"colHeader" : "Sequence Number",
					width : 120
				}*/				
			];
		}
		return arrCols;
	}
});