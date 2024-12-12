Ext.define( 'GCP.view.MessageBoxGridView',
{
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.GroupView' , 'GCP.view.MessageBoxFilterView' ],
	xtype : 'messageBoxGridView',
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
		var objGroupByPref = {}
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
					:(MSGINBOX_GENERIC_COLUMN_MODEL || '[]');

		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/messageInbox/groupBy.json?$filterGridId=GRD_ADM_MSGINBOX',
			//cfgGroupByUrl : 'static/scripts/messageForms/messageBox/data/groupBy.json',
			cfgSummaryLabel : getLabel('messageInbox','Message Inbox'),
			cfgGroupByLabel : getLabel('groupBy','Grouped By'),
			cfgGroupCode :  objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			enableQueryParam:false,
			cfgAutoGroupingDisabled : true,
			cfgShowFilter : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'messageBoxFilterView'
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
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage ||_GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				fields :
					[
						'sentDateTxt','makerStamp', 'subject', 'trackingNo', 'repliedBy', 'formIsReply','messageStatus','messageStatusDesc', 'identifier','msgFormGroupDesc',
						'__metadata', 'totalMsgSum', 'unreadMsgSum','fromUser','formCode','formType','reply','messageRead',
						'recordKeyNo','clientDesc','lastRepliedEntityType','reassignment'
					],
					proxyUrl : 'getMessageInBoxList.srvc',
					rootNode : 'd.inbox',
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
				defaultColumnModel : (MSGINBOX_GENERIC_COLUMN_MODEL || []),
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

				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) {
				 * 	return true;
				 *}
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
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition)
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
				var strFormIsReply = record.data.formIsReply;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
				{
					return retValue;
				}
				retValue = isActionEnabled( actionMask, bitPosition);
				if(maskPosition === 1 && retValue)
				{
					// 2 is for Correspondence Type " Two way communication" in message form master  
					if(strFormIsReply==2)
					{
						retValue = retValue;
						if(record.data.lastRepliedEntityType==='C')
							retValue = retValue && false;
						if(record.data.messageStatus == '5')
						{
							if('1'==entity_type)
							{
								retValue = retValue && true;
							}
							else if ('0'==entity_type)
							{
								retValue = retValue && false;
							}
						}
					}
					else
					{
						retValue = retValue && false;
					}
				}
				else if( maskPosition === 5 && retValue)
				{
					// 0 is for Correspondence Type "No Reply" in message form master  
					if('1'==entity_type)
					{
						if(strFormIsReply==2)
						{
							retValue = retValue;
						}
						else
						{
							retValue = retValue && false;
						}
					}
					else
					{
						if(strFormIsReply==0 || strFormIsReply==2)
						{
							retValue = retValue;
							if(record.data.messageStatus == '5')
							{
								retValue = retValue && false;
							}
						}
						else
						{
							retValue = retValue && false;
						}

					}
				}
				if(maskPosition === 6 && retValue)
				{
					// 1 is for Correspondence Type "Reply by Bank Operator" in message form master  
					if(strFormIsReply==1)
					{
						retValue = retValue && '0'==entity_type;
					}
					else
					{
						retValue = retValue && false && '0'==entity_type;
					}
				}
				else if( maskPosition === 7 && retValue)
				{
						retValue = retValue && '0'==entity_type;
				}
				if(maskPosition === 4 && retValue)
				{
					if ('1'==entity_type && record.get('messageRead') == 'N' &&
					 (record.data.messageStatus == '6' || record.data.messageStatus == '5' ))
					{
						retValue = retValue && false;
					}
					else
					{
						retValue = retValue;
					}	
				}
				return retValue;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId)
			{
				var strRetValue = "";
				if(record.get('messageRead') == 'N')
				{
					strRetValue = '<span title="' + value + '"><a style="font-weight:bold">' + value + '</a></span>';
				}
				else
				{
					strRetValue = '<span title="' + value + '">' + value + '</span>';
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
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [

								{
									itemId : 'btnView',
									itemCls : 'grid-row-action-icon icon-view',
									toolTip : getLabel( 'viewToolTip', 'View Record' ),
									itemLabel : getLabel( 'viewToolTip', 'View Record' ),
									maskPosition : 2
								},
								{
									itemId : 'btnReply',
									text : 	getLabel('reply', 'Reply'),
									toolTip : getLabel( 'actionReply', 'Reply' ),
									itemLabel : getLabel( 'actionReply', 'Reply' ),
									maskPosition : 1
								},
								{
									itemId : 'btnResolve',
									text : 	getLabel('actionResolve', 'Resolve'),
									toolTip : getLabel( 'actionResolve', 'Resolve' ),
									itemLabel : getLabel( 'actionResolve', 'Resolve' ),
									maskPosition : 5
								},
								{
									itemId : 'btnReplyResolve',
									text : 	getLabel('actionReplyResolve', 'Reply And Resolve'),
									toolTip : getLabel( 'actionReplyResolve', 'Reply And Resolve' ),
									itemLabel : getLabel( 'actionReplyResolve', 'Reply And Resolve' ),
									maskPosition : 6
								},
								{
									itemId : 'btnReassign',
									text : 	getLabel('actionReassign', 'Reassign'),
									toolTip : getLabel('actionReassign', 'Reassign'),
									itemLabel : getLabel('actionReassign', 'Reassign'),
									maskPosition : 7
								/*},
								{
									itemId : 'btnDelete',
									text : getLabel('actionDelete', 'Delete'),
									toolTip : getLabel('actionDelete', 'Delete'),
									itemLabel : getLabel('actionDelete', 'Delete'),
									maskPosition : 2
								},
								
								{
									itemId : 'btnUnread',
									text : getLabel('actionMarkUnread', 'Unread'),
									toolTip : getLabel('actionMarkUnread', 'Unread'),
									itemLabel : getLabel('actionMarkUnread', 'Unread'),
									maskPosition : 1*/
								}];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
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
			visibleRowActionCount : 1
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
							text : getLabel('actionDelete', 'Delete'),
							itemId : 'delete',
							actionName : 'Delete',
							maskPosition : 3

							});

				}
			}
		}
		return itemsArray;
	}
} );  //main
