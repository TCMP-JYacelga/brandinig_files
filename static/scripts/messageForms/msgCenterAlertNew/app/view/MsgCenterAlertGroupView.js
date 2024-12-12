Ext.define('GCP.view.MsgCenterAlertGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertGroupView',
	requires : ['GCP.view.MsgCenterAlertFilterView'],	
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
		var objGroupCodePref = null, objSubGroupCodePref = 'STATUS_UNREAD';
				var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;

		if (objAlertPref) {
			/*var data = Ext.decode( objGridViewPref );
			me.arrSorter = data.sortState;
			objGroupCodePref = data.groupCode;	
			objSubGroupCodePref = data.subGroupCode*/
			
			var objJsonData = Ext.decode(objAlertPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/msgAlerts/groupBy.json?$filterGridId=GRD_ADM_MSGALERTS',
			cfgSummaryLabel : getLabel("alerts", "Alerts"),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGroupCodePref || null,
			cfgSubGroupCode : objSubGroupCodePref || null,
			cfgParentCt : me,
			cls : 't7-grid',
			padding : '12 0 0 0',
			cfgShowFilter : true,
			//cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgShowAdvancedFilterLink:false,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'msgCenterAlertFilterView'
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
				//hideRowNumbererColumn : false,				  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,				
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				enableColumnHeaderFilter : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'status',
								options : []
							}]
				},
				storeModel : {
					fields : ['eventDt', 'subject', 'eventDesc','clientDesc','__metadata','identifier','status',
							'AllCount','AllRead','AllUnread','notificationId','messageText','jornalNmbr'],
					proxyUrl : 'msgCenterAlertList.srvc',
					rootNode : 'd.msgCenterAlert',
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
				defaultColumnModel : me.getColumnModel(me
						.getDefaultColumnModel()),
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
					"colId" : "eventDt",
					"colHeader" : "Alert Date Time",
					width : 150,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1
				}, {
					"colId" : "subject",
					"colHeader" : "Subject",
					width : 350,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				}, {
					"colId" : "eventDesc",
					"colHeader" : "Alert Event",
					width : 300,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				}, {
					"colId" : "clientDesc",
					"colHeader" : "Company Name",
					width : 150,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				}];
		return arrCols;
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		if(record.get('status') == "U" || record.get('status') == "N"){
		   meta.style = 'font-weight: bold !important;'
		}
		strRetValue = value;
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Delete', 'Unread', 'Read'];
		var objActions = {
			'Delete' : {
				actionName : 'delete',
				itemText : getLabel('lbldelete', 'Delete'),
				maskPosition : 2
			},
			'Unread' : {
				actionName : 'unread',
				itemText : getLabel('lblmarkunread', 'Unread'),
				maskPosition : 3

			},
			'Read' : {
				actionName : 'read',
				itemText : getLabel('lblmarkread', 'Read'),
				maskPosition : 4
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
			maskPosition : 1				
			}];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Delete', 'Unread', 'Read'];
		
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : colItems,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Delete' :
						itemsArray.push({
							text : getLabel('lbldelete', 'Delete'),
							actionName : 'delete',
							itemId : 'delete',
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
					case 'Unread' :
						itemsArray.push({
							text : getLabel('lblmarkunread', 'Unread'),
							actionName : 'unread',
							itemId : 'unread',
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
					case 'Read' :
						itemsArray.push({
							text : getLabel('lblmarkread', 'Read'),
							actionName : 'read',
							itemId : 'read',
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
				}

			}
		}
		return itemsArray;
	}
});