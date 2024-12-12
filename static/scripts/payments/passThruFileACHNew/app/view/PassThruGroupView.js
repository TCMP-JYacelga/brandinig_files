Ext.define('GCP.view.PassThruGroupView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
			'GCP.view.PassThruFileACHFilterView'],
	xtype : 'passThruGroupView',
	autoHeight : true,
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
		var objGroupByPref = {};
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var scrName;
		var groupByGridId;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
			
		if(screenType == 'ACH')
		{
			scrName = 'passThruFileACH';
			groupByGridId = 'GRD_PAY_ACHPASTHR';
		}
		else
		{
			scrName = 'passThruPositivePay';
			groupByGridId = 'GRD_PP_POSPAYPASTHR';
		}
		if (objPassThruPref) {
			var objJsonData = Ext.decode(objPassThruPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel(scrName) || '[]');
		}
		var strUrl = 'getList/{0}.srvc';
		strUrl = Ext.String.format( strUrl, scrName);
		
		/*if( !Ext.isEmpty( objGridViewPref ) )
		{
			var data = Ext.decode( objGridViewPref );
			me.arrSorter = data[0].sortState;
			objGroupCodePref = data[0].groupCode;	
			objSubGroupCodePref = data[0].subGroupCode
		}*/
		if( !Ext.isEmpty( objPassThruPref ) )
		{
			var objJsonData = Ext.decode(objPassThruPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
			/*var data = Ext.decode( objGridViewPref );			
			arrSorters = data[0].sortState;
			objGroupCodePref = data[0].groupCode;	
			objSubGroupCodePref = data[0].subGroupCode*/
		}		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/passThru/groupBy.srvc?' + csrfTokenName + '=' + csrfTokenValue +'&$filterGridId='+groupByGridId,
			cfgSummaryLabel : getLabel( 'transactions', 'File Details' ),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgGroupCode : objGroupByPref.groupCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,			
			cls : 't7-grid',
			cfgShowFilter : true,
			enableQueryParam:false,
			padding : '12 0 0 0',
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'passThruFileACHFilterViewType'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},			
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,				
				// showSummaryRow : true,
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				hideRowNumbererColumn : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				enableColumnHeaderFilter : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
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
								'fileName', 'financialInst', 'importDateTime', 'totalCrAmt', 'totalDrAmt','fileId','clientId',
								'totalCrCount', 'totalDrCount', 'identifier', '__metadata','totalBatchCount','companyCount','status', 'rejectRemark', 'srNo','history','clientName',
								'totalCrAmount','totalDrAmount','noOfCompany','makerId','executionId','uploadDate','filePath','makerStamp','checkerId',
								'checkerStamp','rejectRemarks','requestStateDesc'
							 ],
					proxyUrl : strUrl,
					rootNode : 'd.passThruFileACH',
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
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(me.getDefaultColumnModel(scrName)),
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
	getDefaultColumnModel : function(scrName) {
		var me = this;
		var arrCols;
		if(!Ext.isEmpty( scrName ) && scrName === 'passThruFileACH')
			arrCols = me.getDefaultAchColumnModel();
		else if(!Ext.isEmpty( scrName ) && scrName === 'passThruPositivePay')
			arrCols = me.getDefaultPositivePayColumnModel();
			
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 7;
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
		} /*else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}*/
		return retValue;
		
		
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		var strToolTipValue = value;
		if(colId === 'col_fileName'  && record.raw.recordType=='B' )
			{
			strRetValue ="<i class='fa fa-files-o'></i> "+strRetValue ;
			strToolTipValue = value ;
			}
		else if(colId === 'col_fileName'  && record.raw.recordType=='F' )
			{
			strRetValue ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+strRetValue ;
			strToolTipValue = strRetValue ;
			}
			else if(colId === 'col_totalCrAmount')
			{
			strRetValue =strRetValue.toFixed(2) ;
			strToolTipValue = strRetValue ;
			}
			else if(colId === 'col_totalDrAmount')
			{
			strRetValue =strRetValue.toFixed(2) ;
			strToolTipValue = strRetValue ;
			}
		meta.tdAttr = 'title="' + strToolTipValue + '"';
        return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Approve', 'Reject'];
		var objActions = {			
			'Approve' : {
				actionName : 'accept',
				itemText : getLabel( 'actionApprove', 'Approve' ),
				maskPosition : 4
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel( 'actionReject', 'Reject' ),
				maskPosition : 5

			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [
		         		    /* commented against FTGCPBDB-4148
		         			{
		         			itemId : 'btnView',
		         			itemCls : 'grid-row-action-icon icon-view',
		         			toolTip : getLabel('viewToolTip', 'View Record'),
		         			itemLabel : getLabel('viewToolTip', 'View Record'),
		         			maskPosition : 1				
		         			},*/
		         		    {
		         			itemId : 'btnViewOk',
		         		//	itemCls : 'icon-button-submit',
		         			toolTip : getLabel('processedToolTip', 'View Report'),
		         			itemLabel : getLabel('processedToolTip', 'View Report'),
		         			maskPosition : 7				
		         			}, 
		         			{
		         				itemId : 'btnViewError',
		         				itemCls : 'grid-row-action-icon icon-error',
		         				toolTip : getLabel( 'viewToolTip', 'View Error Report' ),
		         				itemLabel : getLabel( 'viewToolTip', 'View Error Report' ),
		         				maskPosition : 2				
		         			}, 
		         			{
		         				itemId : 'btnHistory',
		         				itemCls : 'grid-row-action-icon icon-history',
		         				toolTip : getLabel('historyToolTip', 'View History'),
		         				itemLabel : getLabel('historyToolTip', 'View History'),
		         				maskPosition : 6				
		         			}];
		var actionsForWidget = ['Approve', 'Reject'];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader: getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 2
		};
		return objActionCol;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Approve' :
						itemsArray.push({
							text : getLabel( 'actionApprove', 'Approve' ),
							actionName : 'accept',
							itemId : 'accept',
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
							text : getLabel( 'actionReject', 'Reject' ),
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
				}

			}
		}
		return itemsArray;
	},
	getDefaultAchColumnModel : function() {
		var arrCols;
		if(entity_type === '0' || client_count > 1)
		{
			arrCols =
			[	{
					"colId" : "clientName",
					"colHeader" : getLabel('lblcompany', 'Company Name'),
					"colDesc"	: getLabel('lblcompany', 'Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					width : 115
				},
				{
					"colId" : "fileName",
					"colHeader" : getLabel('fileName','File Name'),
					"colDesc"	: getLabel('fileName','File Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					width : 300
				},
				{
					"colId" : "financialInst",
					"colHeader" : getLabel('financialInst','Financial Institution'),
					"colDesc"	: getLabel('financialInst','Financial Institution'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					width : 130
				},
				{
					"colId" : "uploadDate",
					"colHeader" : getLabel('uploadDate','Import Date Time'),
					"colDesc"	: getLabel('uploadDate','Import Date Time'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					width : 150
				},
				{
					"colId" : "totalCrAmount",
					"colHeader" :getLabel('totalCrAmount','Total Credit Amt'),
					"colDesc"	:getLabel('totalCrAmount','Total Credit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalCrCount",
					"colHeader" : getLabel('totalCrCount','Total Credit Count'),
					"colDesc"	: getLabel('totalCrCount','Total Credit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "status",
					"colHeader" : getLabel('status','Status'),
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7,
					width : 150,
					"sortable" : false
				},
				{
					"colId" : "totalDrAmount",
					"colHeader" : getLabel('totalDrAmount','Total Debit Amt'),
					"colDesc"	: getLabel('totalDrAmount','Total Debit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":8,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalDrCount",
					"colHeader" : getLabel('totalDrCount','Total Debit Count'),
					"colDesc"	: getLabel('totalDrCount','Total Debit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":9,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "noOfCompany",
					"colHeader" : getLabel('noOfCompany','No of Company'),
					"colDesc"	: getLabel('noOfCompany','No of Company'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":10,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "makerId",
					"colHeader" : getLabel('makerId','Uploaded By'),
					"colDesc"	: getLabel('makerId','Uploaded By'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":11,
					width : 100
				},
				{
					"colId" : "totalBatchCount",
					"colHeader" : getLabel('totalBatchCount','Batch Count'),
					"colDesc"	: getLabel('totalBatchCount','Batch Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":12,
					"colType" : "number",
					"align" : 'right',
					width : 100
				}
				
			];
		}
		else
		{
			arrCols =
			[ 	
				{
					"colId" : "fileName",
					"colHeader" :  getLabel('fileName','File Name'),
					"colDesc"	:getLabel('fileName','File Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					width : 130
				},
				{
					"colId" : "financialInst",
					"colHeader" : getLabel('financialInst','Financial Institution'),
					"colDesc"	: getLabel('financialInst','Financial Institution'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					width : 300
				},
				{
					"colId" : "uploadDate",
					"colHeader" : getLabel('uploadDateTime','Upload Date Time'),
					"colDesc"	: getLabel('uploadDateTime','Upload Date Time'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					width : 150
				},
				{
					"colId" : "totalCrAmount",
					"colHeader" : getLabel('totalCrAmount','Total Credit Amt'),
					"colDesc"	: getLabel('totalCrAmount','Total Credit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalCrCount",
					"colHeader" : getLabel('totalCrCount','Total Credit Count'),
					"colDesc"	: getLabel('totalCrCount','Total Credit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,	
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "status",
					"colHeader" : getLabel('status','Status'),
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					width : 150,
					"sortable" : false
				},
				{
					"colId" : "rejectRemark",
					"colHeader" : getLabel('rejectRemark','Reject Remarks'),
					"colDesc"	: getLabel('rejectRemark','Reject Remarks'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7,
					width : 150,
					"sortable" : false
				},
				{
					"colId" : "totalDrAmount",
					"colHeader" : getLabel('totalDrAmount','Total Debit Amt'),
					"colDesc"	: getLabel('totalDrAmount','Total Debit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":8,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalDrCount",
					"colHeader" : getLabel('totalDrCount','Total Debit Count'),
					"colDesc"	: getLabel('totalDrCount','Total Debit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":9,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "noOfCompany",
					"colHeader" : getLabel('noOfCompany','No. of Company'),
					"colDesc"	: getLabel('noOfCompany','No. of Company'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":10,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "makerId",
					"colHeader" : getLabel('makerId','Uploaded By'),
					"colDesc"	: getLabel('makerId','Uploaded By'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":11,
					width : 100
				},
				{
					"colId" : "totalBatchCount",
					"colHeader" : getLabel('totalBatchCount','Batch Count'),
					"colDesc"	: getLabel('totalBatchCount','Batch Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":12,
					"colType" : "number",
					"align" : 'right',
					width : 100,
					"hidden" : true
				}					
			];
		}
		return arrCols;
	},
	getDefaultPositivePayColumnModel : function() {	
		var arrCols;
		if(entity_type === '0' || client_count > 1)
		{
			arrCols =
			[	{
					"colId" : "clientName",
					"colHeader" : getLabel('lblcompany', 'Company Name'),
					"colDesc"	: getLabel('lblcompany', 'Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					width : 115
				},
				{
					"colId" : "fileName",
					"colHeader" :  getLabel('fileName','File Name'),
					"colDesc"	:getLabel('fileName','File Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					width : 300
				},
				{
					"colId" : "financialInst",
					"colHeader" : getLabel('financialInst','Financial Institution'),
					"colDesc"	: getLabel('financialInst','Financial Institution'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					width : 130
				},
				{
					"colId" : "uploadDate",
					"colHeader" : getLabel('importDate','Import Date'),
					"colDesc"	: getLabel('importDate','Import Date'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					width : 150
				},
				{
					"colId" : "totalCrAmount",
					"colHeader" : getLabel('totalCrAmount','Total Credit Amt'),
					"colDesc"	: getLabel('totalCrAmount','Total Credit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalCrCount",
					"colHeader" : getLabel('totalCrCount','Total Credit Count'),
					"colDesc"	: getLabel('totalCrCount','Total Credit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "status",
					"colHeader" : getLabel('status','Status'),
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7,
					width : 150,
					"sortable" : false
					
				},
				{
					"colId" : "makerId",
					"colHeader" : getLabel('makerId','Uploaded By'),
					"colDesc"	: getLabel('makerId','Uploaded By'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":8,
					width : 150
				}
			];
		}
		else
		{
			arrCols =
			[	{
					"colId" : "fileName",
					"colHeader" :  getLabel('fileName','File Name'),
					"colDesc"	: getLabel('fileName','File Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
					width : 300
				},
				{
					"colId" : "uploadDate",
					"colHeader" : getLabel('uploadDate','Import Date Time'),
					"colDesc"	: getLabel('uploadDate','Import Date Time'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					width : 150
				},
				{
					"colId" : "totalCrAmount",
					"colHeader" : getLabel('totalCrAmount','Total Credit Amt'),
					"colDesc"	: getLabel('totalCrAmount','Total Credit Amt'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					"colType" : "number",
					"align" : 'right',
					width : 120
				},
				{
					"colId" : "totalCrCount",
					"colHeader" : getLabel('totalCrCount','Total Credit Count'),
					"colDesc"	: getLabel('totalCrCount','Total Credit Count'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					"colType" : "number",
					"align" : 'right',
					width : 100
				},
				{
					"colId" : "status",
					"colHeader" : getLabel('status','Status'),
					"colDesc"	: getLabel('status','Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,
					width : 150,
					"sortable" : false
				},
				{
					"colId" : "makerId",
					"colHeader" : getLabel('makerId','Uploaded By'),
					"colDesc"	: getLabel('makerId','Uploaded By'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					width : 150
				}
			];
		}
		return arrCols;
	}
});