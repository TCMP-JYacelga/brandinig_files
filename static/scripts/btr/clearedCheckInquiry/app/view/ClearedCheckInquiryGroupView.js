Ext.define('GCP.view.ClearedCheckInquiryGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clearedCheckInquiryGroupView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.ClearedCheckInquiryFilterView','Ext.ux.gcp.GridHeaderFilterView'],
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
		var arrSorters = new Array(), blnShowAdvancedFilter = true;
		var groupView = null;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGroupByPref = {};
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		if (objClearedChkPref) {
			var objJsonData = Ext.decode(objClearedChkPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CLEARED_CHECK_COLUMN_MODEL || '[]');
		}		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/clearedCheckInquiry/groupBy.srvc?$filterscreen=clearedCheckInqFltr&$filterGridId=GRD_DEP_CLECHECK&' + csrfTokenName + '=' + csrfTokenValue,
			cfgSummaryLabel :  getLabel( 'lblclearedCheckinquirydtl', 'Cleared Check Inquiry Summary' ),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'clearedCheckInquiryFilterView'
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
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				hideRowNumbererColumn : true,
				showCheckBoxColumn :  false,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
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
								 'clientDesc','depositTicketNmbr', 'clearedCheckAmount', 'clearedCheckDate', 'depSlipNmbr', 'postingDatePicker',
								'clearedCheckAccount', 'clearedCheckStatus', 'clearedCheckImgNmbr', 'sessionId', 'identifier', '__metadata',
								'__subTotal', 'totalChecksSummaryCountInfo', 'totalChecksSummaryTotalInfo',
								'paidChecksSummaryCountInfo', 'paidChecksSummaryTotalInfo', 'unPaidChecksSummaryCountInfo',
								'unPaidChecksSummaryTotalInfo', 'serialNmbr', 'draweeBankCode','debitAccount','rtn'
							 ],
					proxyUrl : 'clearedCheckInquiryGridList.srvc',
					rootNode : 'd.txnlist',
					sortState : arrSorters,
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
				 *		itemText : getLabel('clearedChecksActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('clearedChecksActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				//groupActionModel : {},
				defaultColumnModel : me.getColumnModel( CLEARED_CHECK_COLUMN_MODEL ),
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
		var strRetValue = value;
		/*var isVisibleInstImg = isHidden( 'ViewClearedCheck' );
		if( value != '' )
		{
			if(colId === 'col_depositTicketNmbr' && !isVisibleInstImg )
			{
				strRetValue = '<a href="#" title="Image" class="grid-row-action-icon grid-row-check-icon ux_extramargin-bottom" onclick="getPopulateClearedCheckImage( \''
				+ record.get( 'clearedCheckImgNmbr' ) + '\',\''
					+ record.get( 'depositTicketNmbr' ) + '\',\''
					+ record.get( 'sessionId' ) + '\' )"></a>';
			}
		}*/
		if(colId === 'col_clearedCheckAmount')
		{
			strRetValue = strRetValue ;
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
			items : [
					{
						itemId : 'btnCheckImg',
						itemCls : 'grid-row-action-icon icon-money',//'grid-row-action-icon grid-row-check-icon 
						toolTip : getLabel('viewImage', 'View Image'),
						itemLabel : getLabel('viewImage', 'View Image'),
						maskPosition : 1
					}]
		};
		return [objActionCol];
		/*if(!isHidden( 'ViewDeposit' ))
		{
			var objActionCol = {
				colId : 'action',
				colType : 'actioncontent',
				colHeader : 'Action',
				width : 70,
				align : 'center',
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				visibleRowActionCount : 1,
				items : [{
							itemId : 'btnCheckImg',
							itemCls : 'grid-row-action-icon icon-money',//'grid-row-action-icon grid-row-check-icon ux_extramargin-bottom',
							toolTip : getLabel('viewticket', 'View Deposit Ticket'),
						},{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewDepItem', 'View Deposit Item'),
							maskPosition : 1
						}]
			};		
		}
		else
		{
			var objActionCol = {
				colId : 'action',
				colType : 'action',
				colHeader : 'Action',
				width : 50,
				align : 'center',
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				visibleRowActionCount : 1,
				items : [{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record'),
							maskPosition : 1
						}]
			};		
		}

		return [objActionCol];*/
	}
});