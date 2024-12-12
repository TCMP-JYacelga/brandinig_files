Ext.define( 'GCP.view.MessageSentGridView',
{
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.MessageSentFilterView'],
	xtype : 'messageSentGridView',
	autoHeight : true,
	parent : null,
	initComponent : function()
	{
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];

		me.on('resize', function()
		{
			me.doLayout();
		});
		this.callParent( arguments );
	},


createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			//objGroupByPref = objJsonData.d.preferences.groupByPref || {};
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:(MSGOUTBOX_GENERIC_COLUMN_MODEL || '[]');

		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/messageOutbox/groupBy.json?$filterGridId=GRD_ADM_MSGOUTBOX',
			//cfgGroupByUrl : 'static/scripts/messageForms/messageSent/data/groupBy.json',
			cfgSummaryLabel : 'Message Outbox',
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'messageSentFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage ||_GridSizeTxn,
				rowList : _AvailableGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				stateful : false,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				heightOption : objGridSetting.defaultGridSize,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				fields :
					[
						'sentDateTxt','subject', 'trackingNo', 'repliedBy', 'messageStatus', 'messageStatusDesc', 'identifier','formGroup','fromUser','formIsReply',
						'__metadata', 'mailSent', 'mailReplied','makerId','formCode','formType','reply','messageRead','recordKeyNo','clientDesc'
					],
					proxyUrl : 'getMessageSentList.srvc',
					rootNode : 'd.sent',
					totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
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
				defaultColumnModel : (MSGOUTBOX_GENERIC_COLUMN_MODEL || []),
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
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 2;
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

				return retValue;

				},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId)
			{
				var strRetValue = "";
				strRetValue = value;
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			},
			getGroupActionModel : function(arrAvaliableActions) {
			var retArray = [];
			var arrActions = (arrAvaliableActions || ['Delete', 'Unread']);
			var objActions = {
				'Delete' : {
					actionName : 'delete',
					// itemCls : 'icon-button icon-authorize',
					itemText : getLabel('actionDelete', 'Delete'),
					maskPosition : 2
				}

			};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]]);
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [ {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 1
				// fnClickHandler : viewRecord
			}];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		var objActionCol = null;

		colItems = me.getGroupActionColItems(actionsForWidget);
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
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

					case 'Delete' :
						itemsArray.push({
							text : getLabel('actionDelete', 'Delete'),
							itemId : 'delete',
							actionName : 'Delete',
							maskPosition : 2

							});

				}
			}
		}
		return itemsArray;
	}
} );  //main

