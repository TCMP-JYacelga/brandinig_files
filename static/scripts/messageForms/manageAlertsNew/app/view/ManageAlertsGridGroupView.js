Ext.define('GCP.view.ManageAlertsGridGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'manageAlertsGridGroupView',
	requires : ['GCP.view.ManageAlertsFilterView'],	
	autoHeight : true,
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

		/*if( !Ext.isEmpty( objGridViewPref ) )
		{
			var data = Ext.decode( objGridViewPref );
			me.arrSorter = data[0].sortState;
			objGroupCodePref = data[0].groupCode;	
			objSubGroupCodePref = data[0].subGroupCode
		}	*/		
		
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objManagePref) {
			var objJsonData = Ext.decode(objManagePref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');
		}
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/manageAlerts/groupBy.json?$filterGridId=GRD_ADM_MANGALERTS',
			cfgSummaryLabel : getLabel("manageAlerts", "Manage Alerts"),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objSubGroupCodePref || null,
			cfgParentCt : me,
			cls : 't7-grid',
			padding : '12 0 0 0',
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgShowAdvancedFilterLink:false,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'manageAlertsFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},	
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				//pageSize : _GridSizeTxn,
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				heightOption : objGridSetting.defaultGridSize,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showSummaryRow : false,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				
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
						fields : ['_strGroup', 'eventDesc', 'moduleName','clientDesc','subscriptionDesc', 'version','validFlag','identifier',
						          'customAlertName', 'subscriptionName', 'subscriptionType','recViewState', '__rightsMap','group','__metadata'],
						proxyUrl : 'services/manageAlertsList.json',
						rootNode : 'd.manageAlerts',
						sortState:me.arrSorter,
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
	    var me = this;
		var data = null;
		var arrCols = [];
		if( !Ext.isEmpty( objGridViewPref ) )
		{
			data = Ext.decode( objGridViewPref );
		}
		if(strEntity=='0')
		{
				arrCols = [{
					"colId" : "eventDesc",
					"colHeader" : getLabel('event','Event'),
					width 		: '30%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1
				   },{
					"colId" : "subscriptionDesc",
					"colHeader" : getLabel('subscription','Subscription'),
					width 		: '25%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				   },{
					"colId" : "clientDesc",
					"colHeader" : getLabel('client','Client'),
					width : '17%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				   },{
					"colId" : "moduleName",
					"colHeader" : getLabel('module','Module'),
					width 		: '17%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				   },{
					"colId" : "group",
					"colHeader" : getLabel('group','Group'),
					width 		: '17%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5
				   },{
					"colId" : "validFlag",
					"colHeader" : getLabel('status','Status'),
					width 		: '9%',
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"sortable"	: false,
					"colSequence":6
				   }];
		}
		else
		{
			arrCols = [{
				"colId" : "eventDesc",
				"colHeader" : getLabel('event','Event'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"colSequence":1
			   },{
				"colId" : "subscriptionDesc",
				"colHeader" : getLabel('alertName','Alert Name'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"colSequence":2
			   },{
				"colId" : "customAlertName",
				"colHeader" : getLabel('subscription','Subscription'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"colSequence":3
			   },{
				"colId" : "moduleName",
				"colHeader" : getLabel('module','Module'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"colSequence":4
			   },{
				"colId" : "group",
				"colHeader" : getLabel('group','Group'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"colSequence":5
			   },{
				"colId" : "validFlag",
				"colHeader" : getLabel('status','Status'),
				width 		: 150,
				"locked"	: false,
				"hidden"	: false,
				"hideable"	: true,
				"sortable"	: false,
				"colSequence":6
			   }];
		}
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
		if (!Ext.isEmpty(record.get('subscriptionType'))
				&& record.get('subscriptionType') == 'S' )
		{		if(maskPosition == 7)
				{
				return true;
				}
				else
				{
					return false;
				}
		}else {
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
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__buttonMask))
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

			if (maskPosition === 2 && retValue) {
				var validFlag = record.data.validFlag;
				var isDisabled = (validFlag == 'N');
				retValue = retValue && (!isDisabled);
			}
			return retValue;
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_validFlag') {
			if (!Ext.isEmpty(record.get('validFlag'))
					&& record.get('validFlag') == 'Y') {
				strRetValue = getLabel('active', 'Active');
			} else
				strRetValue = getLabel('inactive', 'Inactive');
		} else
			strRetValue = value;
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Enable', 'Disable', 'Discard'];
		var objActions = {
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('actionEnable', 'Enable'),
				maskPosition : 4
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('actionDisable', 'Disable'),
				maskPosition : 5

			},
			'Discard' : {
				actionName : 'delete',
				itemText : getLabel('actionDiscard', 'Discard'),
				maskPosition : 6
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
			maskPosition : 7
			},{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Modify Record'),
			itemLabel : getLabel('editToolTip', 'Modify Record'),
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
		var actionsForWidget = ['Enable', 'Disable', 'Discard'];
		//colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :getLabel('actions', 'Actions'),
			width :108,
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
					case 'Enable' :
						itemsArray.push({
							text : getLabel('actionEnable', 'Enable'),
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
							text : getLabel('actionDisable', 'Disable'),
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
							text : getLabel('actionDiscard', 'Discard'),
							actionName : 'delete',
							itemId : 'delete',
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