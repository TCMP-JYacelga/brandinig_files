Ext.define('GCP.view.BroadcastMessageGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.panel.Panel','GCP.view.BroadcastMessageFilterView'],
	xtype : 'broadcastMessageGridView',
	initComponent : function() {
		var me = this;
		
	/*	var actionBar = Ext.create('GCP.view.BroadcastMsgGroupActionBarView', {
					itemId : 'broadcastMessageGroupActionBarViewDtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
				xtype : 'container',
				layout : 'hbox',
				cls : 'ux_hide-image',
				flex : 1,
				items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : '',
							flex : 1,
							items : []
						}, {
							xtype : 'container',
							layout : 'hbox',
							cls : 'rightfloating ',
							items : [{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel('searchOnPage',	'Search on Page'),
								cls : 'xn-custom-button cursor_pointer',
								padding : '5 0 0 3',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'menu',
											items : [{
												xtype : 'radiogroup',
												itemId : 'matchCriteria',
												vertical : true,
												columns : 1,
												items : [{
													boxLabel : getLabel(
															'exactMatch',
															'Exact Match'),
													name : 'searchOnPage',
													inputValue : 'exactMatch'
												}, {
													boxLabel : getLabel(
															'anyMatch',
															'Any Match'),
													name : 'searchOnPage',
													inputValue : 'anyMatch',
													checked : true
												}]

											}]
										})
							}, {
								xtype : 'textfield',
								itemId : 'searchTextField',
								cls : 'w10',
								padding : '0 0 0 5'
							}]
						
			}]
		}, {
			xtype : 'panel',
			width : '100%',
			cls : ' xn-ribbon ux_border-bottom ux_panel-transparent-background',
			collapsible : true,
			width : '100%',
			bodyCls : 'x-portlet ux_no-padding',
			autoHeight : true,
			title : getLabel('broadcastMessages', 'Broadcast Messages'),
			itemId : 'broadcastMsgDtlView',
			items : [{
							xtype : 'container',
							layout : 'hbox',
							itemId : 'gridHeader',
							items : []
						},{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold ux-ActionLabel',
									padding : '5 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];*/
		
		var groupView = me.createGroupView();
		me.items = [groupView];
		
		me.on('resize', function()
		{
			me.doLayout();
		});
		this.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/broadcastMessageMst/groupBy.json?',
		//	cfgGroupByUrl : 'static/scripts/cpon/broadcastMessageMst/data/groupBy.json',
			cfgSummaryLabel : 'Broadcast Message',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			enableQueryParam:false,
			cfgParentCt : me,	
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'broadcastMessageFilterView' 
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgGridModel : {
				pageSize : _GridSizeMaster,
				showPagerForced : true,
				rowList : _AvailableGridSize,
				stateful : false,
				checkBoxColumnWidth : _GridCheckBoxWidth,
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
				fields : ['messageName', 'isUrgent', 'displayLevel','textorHtmlDesc',
					'clientSegmentId', 'startDateTime', 'endDateTime',
					'requestStateDesc', 'identifier', 'history', '__metadata'],
					proxyUrl : 'cpon/broadcastMessage.json',
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
				defaultColumnModel : me.getColumnModel(ADMIN_BROADCAST_COLUMN_MODEL),
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
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		if (colId === 'col_isUrgent') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('isUrgent'))
						&& 'Y' == record.get('isUrgent')) {
					strRetValue = getLabel('yes','Yes');
				} else {
					strRetValue =  getLabel('no','No');
				}
			}
		}
		if (colId === 'col_displayLevel') {
			if (!record.get('isEmpty')) {
				strRetValue = getLabel('label.displaylevel.'+record.get('displayLevel'),'Customer Segment');
			}
		}

		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 'Discard', 'Approve','Reject', 'Enable' , 'Disable']);
		var objActions = {
					
					'Submit' : {
						itemText : getLabel('msgActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, 
					'Discard' :
						{
							itemText : getLabel('msgActionDiscard', 'Discard'),
							itemId : 'discard',
							actionName : 'discard',
							maskPosition : 10
						},
					'Approve':
						{
							itemText : getLabel('msgActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 6
						}, 
					'Reject' :
						{
							itemText : getLabel('msgActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 7
						},
					'Enable':
						{
							itemText : getLabel('msgActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 8
						}, 
					'Disable' :
						{
							itemText : getLabel('msgActionDisable', 'Suspend'),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 9
						}
					
			}
			for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
			}
			return retArray;
		},
		getColumnModel : function(arrCols)
		{
		
			var me = this;
			var arrRowActions = [
	
						
						{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						itemLabel : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						itemLabel : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					}
					];
		
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	},		
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader:getLabel('lbl.action','Action'),
			width :70,
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
					case 'Submit' :
						itemsArray.push({
							itemLabel : getLabel('msgActionSubmit', 'Submit'),
							itemId : 'submit',
							//itemCls : 'icon-button icon-submit',
							actionName : 'submit',
							maskPosition : 5
								
						});
						break;
					
					case 'Discard' :
						itemsArray.push({
							itemLabel : getLabel('msgActionDiscard', 'Discard'),
							itemId : 'discard',							
							actionName : 'discard',
							maskPosition : 10
								
						});
						break;
					case 'Approve' :
						itemsArray.push({
							itemLabel : getLabel('msgActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 6
								
						});
						break;
					case 'Reject' :
						itemsArray.push({
							itemLabel : getLabel('msgActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 7
								
						});
						break;
					case 'Enable' :
						itemsArray.push({
							itemLabel : getLabel('msgActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 8
								
						});
						break;
					case 'Disable' :
						itemsArray.push({
							itemLabel : getLabel('msgActionDisable', 'Suspend'),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 9
								
						});
						break;
				}
			}
		}
		return itemsArray;
	}	
});