Ext.define('GCP.view.PositivePayExceptionGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayExceptionGroupView',
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

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;

		if (objPreference) {
			var objJsonData = Ext.decode(objPreference);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');
		}

		if( !Ext.isEmpty( objPreference ) )
		{
			var objJsonData = Ext.decode(objPreference);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}			
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/positivePayException/groupBy.json?$filterGridId=GRD_PP_POSPAYEXC',
			cfgSummaryLabel : getLabel('positivePayList', 'Positive Pay List'),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode :  objGroupByPref.subGroupCode || null,
			cfgParentCt : me,		
			cls : 't7-grid',
			cfgShowRibbon : true,
			cfgRibbonModel : {
				items : [{
							xtype : 'container',
							html : '<div id="summaryCarousal"></div>'
						}],
				itemId : 'summaryCarousal',
				showSetting : false,
				collapsed : false,
				minHeight : 180
			},
			cfgShowFilter : true,
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			padding : '12 0 0 0',
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'positivePayFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				collapsed : true
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showSorterToolbar : _charEnableMultiSort,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableCellEditing : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : [ 'history', 'instDate', 'instNmbr', 'amount','accountNmbr','accountName','decisionNmbr','defaultAction','createDecision','approveDecision','viewCheckImg',
								'beneficiaryName', 'fileImportDate','decisionDateTime','exceptionReason','decisionBydt',
								'status','decisionStatus','beneStatus','__metadata','__subTotal','identifier','__buttonMask',
								'pendingDecisions','actionRaken','viewPayReturn','issueType1','requestState','__count','ccysymbol',
								'checkerId','makerId','recordKeyNo','version','decisionReason','decision','checkImgNmbr','alertFlag',
								'beneAccountNmbr','amountType','fromBeneAmount','toBeneAmount','beneCcy','rejectRemarks','makerStamp','checkerStamp','clientDescription','hasReachedCutOff','secCode','txnType','companyId'
							 ],
					proxyUrl : 'positivePayList.srvc',
					rootNode : 'd.positivePay',
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
		if( !Ext.isEmpty(objPreference ) )		
			data = Ext.decode( objPreference.gridView );
		
		var decisionStore = new Ext.data.SimpleStore({
			  fields: [ "code", "description" ],
			  data: [
			  [ "N", "None" ],
			  [ "P", "Pay" ],
			  [ "R", "Return" ]
			  ]
			});
		if(!Ext.isEmpty(data))
		{	
			var boolean_decide = (strcanDecide=='false') ;
			var boolean_PrefData = null ? false :
								   data[0].gridCols[6].colId == "decisionReason" && data[0].gridCols[6].colHidden ? true : false;
			var isDecision_hide = boolean_decide||boolean_PrefData;
								
			var boolean_decide_res = (strcanDecide=='false') ;
			var boolean_PrefData_res = data[0] == null ? false :
								   data[0].gridCols[6].colId == "decisionReason" && data[0].gridCols[6].colHidden ? true : false;
			var isDecision_res_hide = boolean_decide_res||boolean_PrefData_res;		
		}
		
		var arrCols = [ {
							"colId" : "accountNmbr",
							"colHeader" : getLabel('accountNmbr','Account'),
							"colDesc"	: getLabel('accountNmbr','Account'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":1,
							width : 110
						},{
							"colId" : "accountName",
							"colHeader" : getLabel('accountName','Account Name'),
							"colDesc"	: getLabel('accountName','Account Name'),
							"locked"	: false,
							"hideable"	: true,
							"colSequence":2,
							 width : 110,
							"hidden":false
						},{
							"colId" : "instNmbr",
							"colHeader" :  getLabel('instNmbr','Check No.'),
							"colDesc"	: getLabel('instNmbr','Check No.'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":3,
							width : 130
						},{
							"colId" : "checkImgNmbr",
							"colHeader" :  getLabel('checkImgNmbr','Image'),
							"colDesc"	: getLabel('checkImgNmbr','Image'),
							"locked"	: false,
							"hidden"	: true,
							"sortable" 	: false,
							"hideable"	: true,
							"colSequence":4,
							width : 130
						},{
							"colId" : "instDate",
							"colHeader" :  getLabel('lblIssueDate','Issue Date'),
							"colDesc"	: getLabel('lblIssueDate','Issue Date'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":5,
							width : 90
						},{
							"colId" : "amount",
							"colHeader" :  getLabel('lblAmount','Amount'),
							"colDesc"	:getLabel('lblAmount','Amount'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":6,
							"colType" : "number",
							"align" : 'right',
							width : 120
						},{
							"colId" : "exceptionReason",
							"colHeader" :  getLabel('exceptionReason','Exception Reason'),
							"colDesc"	: getLabel('exceptionReason','Exception Reason'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":7,
							width : 200
						},{
							"colId" : "decision",
							"colHeader" :  getLabel('lblDecision1','Decision &nbsp; &nbsp;'),
							"colDesc"	: getLabel('lblDecision1','Decision &nbsp; &nbsp;'),
							"locked"	: false,
							"hideable"	: true,
							"colSequence":8,
							"hidden" : isDecision_hide,			
							width : 140,
							"editor" : {
								xtype: 'combobox',
								typeAhead: true,					
								selectOnTab: true,
								displayField : 'description',
								valueField : 'code',
								itemId : 'decision',
								//store: decisionStore,
								blankText : 'code',
								name : 'decision',
								listClass: 'x-combo-list-small'
							}			
						},{
							"colId" : "decisionReason",
							"colHeader" :  getLabel('lblDecisionreason','Decision Reason'),
							"colDesc"	: getLabel('lblDecisionreason','Decision Reason'),
							"locked"	: false,
							"hideable"	: true,
							"colSequence":9,
							"hidden" : isDecision_res_hide,
							width : 200,
							"editor" : {
								xtype: 'combobox',
								itemId : 'decisionReason',
								typeAhead: true,					
								selectOnTab: true,
								blankText : 'code',
								displayField : 'description',
								valueField : 'code',
								listClass: 'x-combo-list-small'
							}		
						},{
							"colId" : "decisionStatus",
							"colHeader" : getLabel('lblStatus','Status'),
							"colDesc"	: getLabel('lblStatus','Status'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":10,
							width : 120,
							"sortable" : false
						},{
							"colId" : "defaultAction",
							"colHeader" :  getLabel('defDecision','Default Decision'),
							"colDesc"	: getLabel('defDecision','Default Decision'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":11,
							width : 110
						},{
							"colId" : "beneficiaryName",
							"colHeader" : getLabel('beneficiaryName','Payee'),
							"colDesc"	: getLabel('beneficiaryName','Payee'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":12,
							width : 100
						},{
							"colId" : "decisionBydt",
							"colHeader" :  getLabel('lblDecisionBy','Decision By'),
							"colDesc"	: getLabel('lblDecisionBy','Decision By'),
							"locked"	: false,
							"hidden"	: true,
							"hideable"	: true,
							"colSequence":13,
							width : 90
						}];
		if( achPositivePay == 'true' )
		{
			arrCols.push({
				"colId" : "companyId",
				"colHeader" : getLabel('lblCompanyId','Company ID'),
				"colDesc"	: getLabel('lblCompanyId','Company ID'),
				"locked"	: false,
				"hidden"	: true,
				"hideable"	: true,
				"colSequence":13,
				width : 90
			},{
				"colId" : "secCode",
				"colHeader" : getLabel('lblSecCode','Sec Code'),
				"colDesc"	: getLabel('lblSecCode','Sec Code'),
				"locked"	: false,
				"hidden"	: true,
				"hideable"	: true,
				"colSequence":14,
				width : 90
			},{
				"colId" : "txnType",
				"colHeader" : getLabel('lblTxnType','Transaction Type'),
				"colDesc"	: getLabel('lblTxnType','Transaction Type'),
				"locked"	: false,
				"hidden"	: true,
				"hideable"	: true,
				"colSequence":15,
				width : 90
			});
		}
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 9;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		
		if(itmId === 'viewImage') {
			var CheckImageNumber = record.get("checkImgNmbr");
			var value = record.get("instNmbr");
		  
			   if(value !== '' && record.data.viewCheckImg == "Y" && ((CheckImageNumber != null) && (CheckImageNumber != ""))) {	
					return true;
				} else {
					return false;			
				}
			
		    return false;
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
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
		
		
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strException = "";
		var strRetValue = "";
		var issueType = record.get('issueType1');
		var beneStatus = record.get('beneStatus');
		if (colId === 'col_amount') {
			strRetValue = record.data.ccysymbol + ' ' + value;
			if(issueType === "EXCEPTION")
			{
				strRetValue = '<a style="color:red">' + strRetValue + '</>';
			}
		}else if(colId === 'col_beneficiaryName'){
			strRetValue = value;
			
			if(value !== ''){
				strRetValue = value;
				/*+ ' '
				+ '<a href="#" class="grid-row-action-icon icon-edit" onclick="getPopulateBeneInfoPopUp( \''
				+ record.get('beneficiaryName') + '\' ,\'' + record.get('beneAccountNmbr') +'\', \'' + record.get('fromBeneAmount') +'\',\'' + record.get('beneStatus') +'\' , \''+ record.get('decisionNmbr') + '\' )"></a>';*/
			}
			if(issueType === "EXCEPTION")
			{
				strRetValue = '<a style="color:red">' + strRetValue + '</>';
			}
			if(beneStatus === "WhiteListed")
			{
				strRetValue = '<a style="color:green">' + strRetValue + '</>';
			}
		}
		else if (colId === 'col_decision')
		{
			if('P'==value)
			{
			  value = "Pay";  
			}
			else if('R'==value)
			{
			  value = "Return";  
			}
			else
			{
			  value="None";
			}
		   if(!Ext.isEmpty(record.get('alertFlag')) && record.get('alertFlag') === '1' )
		   {
			   if(!Ext.isEmpty(record.get('hasReachedCutOff')) && record.get('hasReachedCutOff') === '0')
				   strRetValue = '<a style="color:red">' + value + '</>';
			   else
				   strRetValue = value;
		   }
		   else
		   {
			   strRetValue = value;
		   }
		   return strRetValue;		
		}
		else if (colId === 'col_instNmbr')
		{	
		   if(!Ext.isEmpty(record.get('alertFlag')) && record.get('alertFlag') === '1' )
		   {
			   if(!Ext.isEmpty(record.get('hasReachedCutOff')) && record.get('hasReachedCutOff') === '0')
				   strRetValue = '<a style="color:red">' + value + '</>';
			   else
				   strRetValue = value;
		   }
		   else
		   {
			   strRetValue = value;
		   }
		}
		else if(colId ==='col_checkImgNmbr'){
			
			   if(value !== '' && record.data.viewCheckImg == "Y" && ((value != null) && (value != ""))) {
				   strRetValue = 'Yes';
					return strRetValue;
				} else {
					strRetValue = 'No';
					return strRetValue;			
				}
			
		}
		else if (colId === 'col_defaultAction')
		{	
			if('P'==value)
			{
			  value = "Pay";  
			}
			else if('R'==value)
			{
			  value = "Return";  
			}			
			strRetValue = value;
		}
		else {
			strRetValue = value;
		}
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Pay', 'Return', 'Submit', 'Approve', 'Reject', 'Reset'];
		var objActions = {
			'Pay' : {
				actionName : 'pay',
				itemText : getLabel('positivePayActionPay', 'Pay'),
				maskPosition : 3
			},
			'Return' : {
				actionName : 'return',
				itemText : getLabel('positivePayActionReturn', 'Return'),
				maskPosition : 4
			},
			'Submit' : {
				actionName : 'submit',
				itemText : getLabel('positivePayActionSubmit', 'Submit'),
				maskPosition : 9
			},
			'Approve' : {
				actionName : 'accept',
				itemText : getLabel('instrumentsActionAuthorize', 'Approve'),
				maskPosition : 5
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('instrumentsActionReturnToMaker', 'Reject'),
				maskPosition : 6

			},
			'Reset' : {
				actionName : 'reset',
				itemText : getLabel('positivePayActionReset', 'Reset'),
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
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 1
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			toolTip : getLabel('historyToolTip', 'View History'),
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 2
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}, {
			text : getLabel('positivePayActionViewImage', 'View Image'),
			actionName : 'viewImage',
			itemId : 'viewImage'
			}, {
				itemId : 'btnViewIssue',
				actionName : 'btnViewIssue',
				text : getLabel('viewIssueToolTip', 'View Issuance')
			}];			
		
		var actionsForWidget = [ 'Approve', 'Reject'];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
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
					case 'Pay' :
						itemsArray.push({
							text : getLabel('positivePayActionPay', 'Pay'),
							actionName : 'pay',
							itemId : 'pay',
							maskPosition : 3
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Return' :
						itemsArray.push({
							text : getLabel('positivePayActionReturn', 'Return'),
							actionName : 'return',
							itemId : 'return',
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
					case 'Submit' :
						itemsArray.push({
							text : getLabel('positivePayActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 9
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
							text : getLabel('actionAuthorize', 'Approve'),
							actionName : 'accept',
							itemId : 'accept',
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
					case 'Reject' :
						itemsArray.push({
							text : getLabel('actionReturnToMaker', 'Reject'),
							actionName : 'reject',
							itemId : 'reject',
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
					case 'Reset' :
						itemsArray.push({
							text : getLabel('positivePayActionReset', 'Reset'),
							actionName : 'reset',
							itemId : 'reset',
							maskPosition : 9
							});
						break;
				}

			}
		}
		return itemsArray;
	}
});