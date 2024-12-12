Ext.define('GCP.view.InstrumentInquiryGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryGroupView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.InstrumentInquiryFilterView'],
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
		var arrSorters = new Array();
		var groupView = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGroupByPref = {};
		
		if (objDepItemPref) {
			var objJsonData = Ext.decode(objDepItemPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (INQUIRY_GENERIC_COLUMN_MODEL || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/instInquiry/groupBy.srvc?$filterscreen=instrumentInqFilter&$filterGridId=GRD_DEP_DEPITEM&' + csrfTokenName + '=' + csrfTokenValue,
			cfgSummaryLabel :  getLabel( 'lblinstrumentinquirydtl', 'Item Details' ),
			cfgGroupByLabel : 'Grouped By',
			cfgShowRefreshLink : false,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,			
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'instrumentInquiryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},			
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
								 'clientDesc','itemNmbr', 'itemAmount', 'instrumentDate', 'depSlipNmbr', 'postingDate', 'lockBoxId',
								'depositAccount', 'itemType', 'instrumentImgNmbr', 'identifier', '__metadata',
								'__subTotal', 'totalChecksSummaryCountInfo', 'totalChecksSummaryTotalInfo',
								'paidChecksSummaryCountInfo', 'paidChecksSummaryTotalInfo', 'unPaidChecksSummaryCountInfo',
								'unPaidChecksSummaryTotalInfo', 'itemSeqNmbr', 'draweeBankCode','debitAccount','rtn','depositTicketNmbr','serviceId','sessionId'
							 ],
					proxyUrl : ' depositInquiryGridList.srvc',
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
				defaultColumnModel : me.getColumnModel(INQUIRY_GENERIC_COLUMN_MODEL),
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
		var isVisibleInstImg = isHidden( 'ViewInstrument' );
		if( value != '' )
		{
			if( colId === 'col_itemNmbr' && !isVisibleInstImg )
			{/*
				var checkSeqNmbr = record.get( 'itemNmbr' ) +'|' + record.get( 'itemSeqNmbr' );
				strRetValue = value
					+ ' '
					+ '<a href="#" title="Image" class="grid-row-action-icon grid-row-check-icon ux_extramargin-bottom" onclick="getPopulateInstrumentImage( \''
					+ record.get( 'instrumentImgNmbr' ) + '\',\''
					+ record.get( 'depositTicketNmbr' ) + '\',\''
					+ record.get( 'serviceId' ) + '\',\''
					+ checkSeqNmbr + '\' )"></a>';*/
			}
			else if( colId === 'col_itemType' )
			{
				if( value == 'P' )
				{
					//strRetValue = getLabel( 'lbl.paid', 'Paid' );
				}
				else
				{
					//strRetValue = getLabel( 'lbl.unpaid', 'Unpaid' );
				}
			}
			/*else if( colId === 'col_depSlipNmbr' )
			{
				strRetValue = '<a href="#" button_underline thePointer onclick="callToDepositPage( \'' + value
					+ '\' )"><u>' + value + '</u></a>';
			}*/
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
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
		if(isHidden( 'ViewInstrument' )){
			actionColItem.push({
				itemId : 'btnCheckImg',
				itemCls : 'grid-row-action-icon icon-money', 
				toolTip : getLabel('viewItem', 'View Image'),
				itemLabel : getLabel('viewItem', 'View Image')
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
			items : actionColItem /*[
					{
						itemId : 'btnCheckImg',
						itemCls : 'grid-row-action-icon icon-money', 
						toolTip : getLabel('viewItem', 'View Image'),
						itemLabel : getLabel('viewItem', 'View Image')
					}]*/
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
						"colId" : "itemNmbr",
						"colHeader" : "Item Serial No.",
						"hidden" :  filterFields.indexOf('serialNmbr') !== -1  ? false : true ,
						width : 120
					},
					{
						"colId" : "depositTicketNmbr",
						"colHeader" : "Deposit Ticket",		
						"hidden" : filterFields.indexOf('depositTicket') !== -1  ? false : true ,
						width : 140
					},
					{
						"colId" : "depositAccount",
						"colHeader" : "Deposit Account",					
						width : 140
					},					
					{
						"colId" : "itemAmount",
						"colHeader" : "Item Amount",
						"colType" : "number",
						"hidden" : filterFields.indexOf('itemAmount') !== -1 ?  false : true ,
						"align" : 'right',
						width : 120
					},
					{
						"colId" : "debitAccount",
						"colHeader" : "Debit Account",					
						width : 120
					},
					{
						"colId" : "postingDate",
						"colHeader" : "Posting Date",
						width : 100
					},
					{
						"colId" : "lockBoxId",
						"colHeader" : "Lockbox Number",			
						"hidden" : filterFields.indexOf('lockBoxNmbr') !== -1 ?   false : true ,
						width : 120
					},
					/*{
						"colId" : "depSeqNmbr",
						"colHeader" : "Deposit Ticket Sequence Number",					
						width :  210
					},*/					
					{
						"colId" : "rtn",
						"colHeader" : "Routing No. of Deposit Check",					
						width : 100
					},	
					{
						"colId" : "itemType",
						"colHeader" : "Item Type",					
						width : 100
					},				
					{
						"colId" : "itemSeqNmbr",
						"colHeader" : "Item Sequence Number",		
						"hidden" : filterFields.indexOf('itemSeqNmbr') !== -1 ?   false : true ,
						width : 150
					}												
				];			
		}
		else
		{
			
			arrCols =
				[
					{
						"colId" : "itemNmbr",
						"colHeader" : "Item Serial No.",
						"hidden" : filterFields.indexOf('serialNmbr') !== -1  ? false : true ,
						width : 120
					},
					{
						"colId" : "depositTicketNmbr",
						"colHeader" : "Deposit Ticket",				
						"hidden" : filterFields.indexOf('depositTicket') !== -1 ? false : true ,
						width : 140
					},
					{
						"colId" : "depositAccount",
						"colHeader" : "Deposit Account",					
						width : 140
					},					
					{
						"colId" : "itemAmount",
						"colHeader" : "Item Amount",
						"hidden" : filterFields.indexOf('itemAmount') !== -1  ? false : true ,
						"colType" : "number",
						"align" : 'right',
						width : 120
					},
						{
						"colId" : "debitAccount",
						"colHeader" : "Debit Account",					
						width : 120
					},
					{
						"colId" : "postingDate",
						"colHeader" : "Posting Date",
						width : 100
					},
					{
						"colId" : "lockBoxId",
						"colHeader" : "Lockbox Number",		
						"hidden" : filterFields.indexOf('lockBoxNmbr') !== -1  ? false : true ,
						width : 120
					},
					/*{
						"colId" : "depSeqNmbr",
						"colHeader" : "Deposit Ticket Sequence Number",					
						width : 210
					},*/
					{
						"colId" : "rtn",
						"colHeader" : "Routing No. of Deposit Check",					
						width : 100
					},	
					{
						"colId" : "itemType",
						"colHeader" : "Item Type",					
						width : 100
					},				
					{
						"colId" : "itemSeqNmbr",
						"colHeader" : "Item Sequence Number",					
						"hidden" : filterFields.indexOf('itemSeqNmbr') !== -1  ? false : true ,
						width : 150
					}												
				];			
		}

		
		return arrCols;
	}
});