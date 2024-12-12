Ext.define( 'GCP.view.MessageBoxGridView',
{
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView'],
	xtype : 'messageBoxGridView',
	componentCls : 'gradiant_back',
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

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/messageInbox/groupBy.json?',
			//cfgGroupByUrl : 'static/scripts/messageForms/messageBox/data/groupBy.json',
			cfgSummaryLabel : 'MESSAGE BOX',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			cfgParentCt : me,			
			cfgGridModel : {
				pageSize : _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				fields :
					[
						'sentDateTxt','makerStamp', 'subject', 'trackingNo', 'repliedBy', 'messageStatus', 'identifier',
						'__metadata', 'totalMsgSum', 'unreadMsgSum','fromUser','formCode','formType','reply','messageRead',
						'recordKeyNo','clientDesc'
					],
					proxyUrl : 'getMessageInBoxList.srvc',
					rootNode : 'd.inbox',
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
				defaultColumnModel : me.getColumnModel(MSGINBOX_GENERIC_COLUMN_MODEL),
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
				var maskSize = 11;
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

				if( ( maskPosition === 6 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 7 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if(record.get('messageRead') == 'N')
				{
					strRetValue = '<a style="font-weight:bold">' + value + '</a>';
				}
				else
				{
					strRetValue = value;
				}
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
				maskPosition : 3
			},
			'Unread' : {
				actionName : 'markUnRead',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('actionMarkUnread', 'Unread'),
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
		var arrRowActions = [
	
						
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 2
						},
						{
							itemId : 'btnReply',
							text : 	'Reply',
							toolTip : getLabel( 'actionReply', 'Reply' ),
							maskPosition : 1
						}
					];
		
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	}
	,
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader:'Action',
			width : 100,
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
					case 'Unread' :
						itemsArray.push({
							text : getLabel('actionMarkUnread', 'Unread'),
							itemId : 'markUnRead',
							actionName : 'markUnRead',
							maskPosition : 4
								
						});
						break;
					case 'Delete' :
						itemsArray.push({
							//text : getLabel('actionDelete', 'Delete'),
							itemId : 'delete',
							actionName : 'Delete',
							itemCls : 'grid-row-action-icon icon-deleted',
							toolTip : getLabel('actionDelete', 'Delete'),
							maskPosition : 3
								
							});
					
				}
			}
		}
		return itemsArray;
	}	
} );  //main
