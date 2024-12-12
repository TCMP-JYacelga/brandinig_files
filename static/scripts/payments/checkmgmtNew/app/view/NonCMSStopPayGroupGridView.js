Ext.define('GCP.view.NonCMSStopPayGroupGridView', {
	extend : 'Ext.panel.Panel',
	xtype : 'nonCMSGridGroupView',
	autoHeight : true,
	//cls : 'ux_panel-background',
	width : '100%',
	arrSorter:[],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];

		me.on('resize', function() {
			me.doLayout();
		});
		me.on('boxready', function() {
			me.doLayout();
		});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupByPref = {}

		if( !Ext.isEmpty( objCheckManagementPref ) )
		{
			var objJsonData = Ext.decode(objCheckManagementPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CHECKS_GENERIC_COLUMN_MODEL || '[]');
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
			cfgGroupByUrl : 'services/grouptype/checkMgmt/groupBy.json?$filterGridId=GRD_CHK_CHKMGMT',
			cfgSummaryLabel : getLabel('lbltransactions', 'Check Details'),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cfgShowFilter : true,										
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			enableQueryParam:false,
			cls : 't7-grid',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'nonCMSStopFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showSummaryRow : false,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : ['hostMessage','reference', 'description', 'checkNo','checkNmbrFrom','checkNmbrTo','makerId','actionState','reason','viewChkImageFlag','approveStopPayFlag', 'createCancelStopPayFlag' ,'cancelApproveStopPayFlag','createStopPayFlag',
					          'amount', 'account','accountName', 'entryDate','recordKeyNo','version','sellerId','checkDate','entryDate','singleChk','payee','requestSubType','requestType',
								'requestNmbr', 'requestStateDesc','identifier','__metadata','history','view','viewState','entryUser','requestState','clientDescription','checkInquiryReqCount','checkInquiryReqAmt',
								'stopPayCount','stopPayAmt','cancelStopReqCount','cancelStopReqAmt','contactPerson','phoneNmbr', 'hostImageKey', 'availableAction','replacementCheck','ccySymbol','replacementChk'],
						proxyUrl : 'checkManagementGridList.srvc',
						rootNode : 'd.chkmgmtlist',
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
	getDefaultColumnModel : function() {
		var data = null;
		if( !Ext.isEmpty( objGridViewPref ) )		
			data = Ext.decode( objGridViewPref );
				
		var arrCols = [ {
							"colId" : "account",
							"colHeader" : getLabel('accountNumber','Account'),
							"width" : 130
						},{
							"colId" : "accountName",
							"colHeader" : getLabel('accountName','Account Name'),
							"width" : 130
							//hidden:true
						},{
							"colId" : "checkNo",
							"colHeader" : NonUSUser === "Y" ? 
									      getLabel('chequeNo','Cheque No.')
									      :getLabel('instNmbr','Check No.'),
							"width" : 110
						},{
							"colId" : "description",
							"colHeader" :  getLabel('lblDescription','Request Type'),
							"width" : 100
						},{
							"colId" : "reason",
							"colHeader" :  getLabel('lblReason','Reason'),
							"width" : 100
						},{
							"colId" : "requestStateDesc",
							"colHeader" :  getLabel('lblStatus','Status'),
							"width" : 150,
							"sortable" : false
						},{
							"colId" : "entryDate",
							"colHeader" : getLabel('lblEntryDate','Request Date'),
							"width" : 100
						},{
							"colId" : "amount",
							"colHeader" :  getLabel('lblAmount','Amount'),
							"colType" : "number",
							"align" : 'right',
							"width" : 100
						},{
							"colId" : "requestNmbr",
							"colHeader" :  getLabel('lblTracking','Tracking No.'),
							"width" : 150
						},
						{
							"colId" : "hostMessage",
							"colHeader" : getLabel('hostMessage','Host Message'),
							"width" : 200
						},
						{
							"colId" : "reference",
							"colHeader" : getLabel('lblReference','Reference'),
							"width" : 120
						},{
							"colId" : "clientDescription",
							"colHeader" : getLabel('clientDescription','Company Name'),
							"width" : 200
						},{
							"colId" : "checkDate",
							"colHeader" : getLabel('lblIssueDate','Issue Date'),
							"width" : 100
						}];
		return arrCols;
	//	return null;				
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var applicable = false;
		if(record.data.description === 'Stop Pay' && !isHidden('AuthReqStopPay')){
			applicable = true;
		}
		else if(record.data.description === 'Cancel Stop Pay' && !isHidden('AuthReqCancelStop')){
			applicable = true;
		}
		else if(record.data.description === 'Check Inquiry'){
			applicable = true;
		}
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
			retValue = retValue && isSameUser && applicable;;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser && applicable;
		} 
		else if (maskPosition === 8)
		  {
			if( GranularPermissionFlag == 'Y')
			{				
					if( record.data.viewChkImageFlag == 'Y'  && record.data.singleChk == 'Y')
						{
							// either host image key is available or image keyword is there in available action
						}
					else
						{
							retValue = false;
						}
			}
			else
			{
					if(isHidden('CHKPAIDIMG'))
						retValue = false;
					else
					{
				   
					}
					if(onBehalf  &&  record.data.singleChk == 'Y')
					{
						retValue = true;
					}
			}
		  }
		
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		
		/*else if(colId === "col_account" && value != '')
		{
				strRetValue =  value + '-' + record.get('accountName');
		}*/
		if(colId === "col_checkNo")
		{
			var isSingle = record.get('singleChk');
			if('Y' == isSingle)
			{
				strRetValue =  value;
			}
			else if('N' == isSingle)
			{
				strRetValue =  value + '&nbsp;' +
				'<span> <i class="fa fa-files-o" title="Multiple"> </i>'+ '</span>';
			}
		}
		if (colId === "col_description"){
			if(NonUSUser === "Y"){
				strRetValue = getLabel('lblCheckRequestType.'+record.data.requestType ,'Cheque Inquiry' );
			}
			else{
				strRetValue = value;
			}
		}
		else
		{
			strRetValue = value;
		}
		meta.tdAttr = 'title="' + value + '"';
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		//var arrActions = ['Approve', 'Reject', 'Discard', 'Cancel'];
		var arrActions = ['Discard', 'Cancel'];
		var objActions = {
			/*'Approve' : {
				actionName : 'accept',
				itemText : getLabel('chkmgmtactionapprove', 'Approve'),
				maskPosition : 6
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('chkmgmtactionreject', 'Reject'),
				maskPosition : 7
			},*/
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('chkmgmtactiondiscard', 'Discard'),
				maskPosition : 5
			},
			'Cancel' : {
				actionName : 'cancel',
				itemText :  getLabel('chkmgmtactioncancel', 'Cancel'),
				maskPosition : 10

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

		var arrRowActions = [{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 3
				// fnClickHandler : viewRecord
			},{
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			toolTip : getLabel('historyToolTip', 'View History'),
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 4
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			},{
				itemId : 'btnChkImg',
				itemCls : 'grid-row-action-icon grid-row-check-icon',
				toolTip : getLabel('viewImageToolTip', 'View Image'),
				itemLabel : getLabel('viewImageToolTip', 'View Image'),
				maskPosition : 8
			}];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
        var actionsForWidget = ['Approve', 'Reject', 'Discard', 'Cancel','Inquiry'];
        colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader:'Actions',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : colItems,
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
							text : getLabel('chkmgmtactionapprove', 'Approve'),
							actionName : 'accept',
							itemId : 'accept',
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
							text : getLabel('chkmgmtactionreject', 'Reject'),
							actionName : 'reject',
							itemId : 'reject',
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
					case 'Discard' :
						itemsArray.push({
							text : getLabel('chkmgmtactiondiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
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
					case 'Cancel' :
						itemsArray.push({
							text : getLabel('chkmgmtactioncancel', 'Cancel'),
							actionName : 'cancel',
							itemId : 'cancel',
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
                    case 'Inquiry' :
                        itemsArray.push({
                            text : getLabel('chkmgmtactioninquiry', 'Inquiry'),
                            actionName : 'inquiry',
                            itemId : 'inquiry',
                            maskPosition : 11
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