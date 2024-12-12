Ext.define('GCP.view.LMSInterAccountParameterListGroupGridView', {
	extend : 'Ext.panel.Panel',
	xtype : 'lMSInterAccountParameterListGroupGridView',
	autoHeight : true,
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.LMSInterAccountParameterListFilterView'],
	//width : '100%',
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
		var objGroupByPref = {};
		var objLocalPageSize = '',objLocalSubGroupCode = null;

		if( !Ext.isEmpty( objLMSInterAccParamtPref ) )
		{
			var objJsonData = Ext.decode(objLMSInterAccParamtPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (LMS_GENERIC_COLUMN_MODEL || '[]');
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
			cfgGroupByUrl : 'static/scripts/lms/LMSInterAccountParameterListNewUx/data/interAccountGroupBy.json?',
			cfgSummaryLabel : getLabel( 'interAccountSummary', 'Inter Account Summary ' ),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgParentCt : me,
			cfgShowFilter : true,										
			cfgShowRefreshLink : false,
			cfgShowAdvancedFilterLink : false,
			cfgSmartGridSetting : true,
			enableQueryParam:false,
			cls : 't7-grid',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'lmsInterAccountParameterListFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSummaryRow : false,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				showPagerRefreshLink : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : ['agreementName', 'agreementCode','fromAccount', 'fromAccountDesc', 'toAccount', 'toAccountDesc',
						'requestStateDesc', 'identifier', 'history', '__metadata', 'viewState'],
					proxyUrl : 'lmsLMSInterAccountParameterListMst.srvc',
					rootNode : 'd.profile',
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
				defaultColumnModel : LMS_GENERIC_COLUMN_MODEL,
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
		var arrCols = [{
						"colId" : "agreementName",
						"colHeader" : getLabel('agreementName', 'Agreement Name')
						//width : 255
					},
					{
						"colId" : "agreementCode",
						"colHeader" : getLabel( 'agreementCode', 'Agreement Code' )
						//width : 130
					},
					{
						"colId" : "fromAccount",
						"colHeader" : getLabel('fromAccount', 'Participating Account')
						//width : 130
					},
					{
						"colId" : "fromAccountDesc",
						"colHeader" : getLabel('fromDescription', 'Participating Description')
						//width : 150
					},
					{
						"colId" : "toAccount",
						"colHeader" : getLabel('toAcc', 'Contra Account')
						//width : 130
					},
					{
						"colId" : "toAccountDesc",
						"colHeader" : getLabel('toAccDesc', 'Contra Account Description')
						//width : 200
					},
					{
						"colId" : "requestStateDesc",
						"colHeader" : getLabel('status', 'Status')
						//width : 200
					}];
		return arrCols;				
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 9;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var specialEditStatus = record.data.specialEditStatus;
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
		var reqState = record.raw.requestState;
		var submitFlag = record.raw.isSubmitted;
		var validFlag = record.raw.validFlag;

		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		if( ( maskPosition === 2 && retValue ) )
		{
			retValue = retValue && isSameUser;
		}
		else if( maskPosition === 3 && retValue )
		{
			retValue = retValue && isSameUser;
		}
		else if( maskPosition === 8 && retValue ) 
		{
			retValue = true;
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Submit', 'Approve', 'Reject', 'Enable','Disable','Discard'];
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				itemText : getLabel('prfMstActionSubmit', 'Submit'),
				maskPosition : 1
			},
			'Approve' : {
				actionName : 'accept',
				itemText : getLabel('prfMstActionApprove', 'Approve'),
				maskPosition : 2
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('prfMstActionReject', 'Reject'),
				maskPosition : 3
			},
			'Enable' : {
				actionName : 'enable',
				itemText :  getLabel('prfMstActionEnable', 'Enable'),
				maskPosition : 4
			},
			'Disable' : {
				actionName : 'disable',
				itemText :  getLabel('prfMstActionDisable', 'Disable'),
				maskPosition : 5
			},
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('prfMstActionDiscard', 'Discard'),
				maskPosition : 6
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},

	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit', 'Approve', 'Reject', 'Enable','Disable','Discard'];
		var arrRowActions = [{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel( 'editToolTip', 'Edit' ),
				itemLabel : getLabel('editToolTip', 'Edit Record'),
				maskPosition : 8
			},
			{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel( 'viewToolTip', 'View Record' ),
				itemLabel : getLabel('viewToolTip', 'View Record'),
				maskPosition : 7
			},
			{
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				toolTip : getLabel( 'historyToolTip', 'View History' ),
				itemLabel : getLabel( 'historyToolTip', 'View History' ),
				maskPosition : 9
			}];
		var objActionCol = null;
		colItems = me.getGroupActionColItems(actionsForWidget);
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader:getLabel( 'lms.grid.actions', 'Actions' ),
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
					case 'Submit' :
						itemsArray.push({
							text : getLabel('prfMstActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 1
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
							text :  getLabel('prfMstActionApprove', 'Approve'),
							actionName : 'accept',
							itemId : 'accept',
							maskPosition : 2
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
							text : getLabel('prfMstActionReject', 'Reject'),
							actionName : 'reject',
							itemId : 'reject',
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
					case 'Enable' :
						itemsArray.push({
							text :  getLabel('prfMstActionEnable', 'Enable'),
							actionName : 'enable',
							itemId : 'enable',
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
					case 'Disable' :
						itemsArray.push({
							text :  getLabel('prfMstActionDisable', 'Disable'),
							actionName : 'disable',
							itemId : 'disable',
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
					case 'Discard' :
						itemsArray.push({
							text :  getLabel('prfMstActionDiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
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
				}

			}
		}
		return itemsArray;
	}
});