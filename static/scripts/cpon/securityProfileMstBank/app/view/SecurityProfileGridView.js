Ext.define('GCP.view.SecurityProfileGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView'],
	xtype : 'securityProfileGridView',
	width : '100%',
	//cls : 'xn-ribbon',
	cls: 'ux_extralargemargin-top',
	initComponent : function() {
		var me = this;
		/*var actionBar = Ext.create('GCP.view.SecurityProfileActionBarView', {
					itemId : 'securityProfileActionBarView_clientDtl',
					height : 21,
					cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
					width : '100%',
					parent : me
				});*/
				
				var groupView = me.createGroupView();
				me.items = [{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_panel-background ux_extralargepadding-bottom',
						flex : 1,
						items : [{
							xtype : 'toolbar',
							itemId : 'btnCreateNewToolBar',
							cls : ' ux_panel-background',
							flex : 1,
							items : [{
								xtype : 'button',
								border : 0,
								text : getLabel('createSecurityProfile', 'Create New Security Profile'),
								glyph : 'xf055@fontawesome',
								cls : 'ux_font-size14 xn-content-btn ux-button-s ',
								parent : this,
								// padding : '4 0 2 0',
								itemId : 'btnCreateClient',
								hidden: canEditFlag === 'Y' ? false : true
								}]
							}]
						},
					   {
						   xtype : 'panel',
						   width : '100%',
						   cls : 'xn-ribbon ux_panel-transparent-background',
						   collapsible: true,
						   title: getLabel('securityProfileList','Security Setup List'),
						   autoHeight : true,
						   itemId : 'securityProdileDtlView',
						   items : [{
							   xtype : 'container',
							   cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
							   items : [groupView]
						   }]
						   }
					   ];
				me.on('resize', function() {
							me.doLayout();
					});
	/*	this.items = [{
			xtype : 'container',
			layout : 'hbox',
			
			flex : 1,
			items : [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',		
						cls : 'ux_panel-background',
						flex : 1,
						items : []
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						items : [{
							xtype : 'button',
							border : 0,
							itemId : 'btnSearchOnPage',
							text : getLabel('searchOnPage', 'Search on Page'),
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
												boxLabel : getLabel('anyMatch',
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
							padding : '0 0 0 5',
							margin : '0 10 0 0'
						}]

					}]
		}, {
			xtype : 'panel',
			width : '100%',
			autoHeight : true,
			cls : 'ux_extralargemargin-top',
			collapsible : true,
			itemId : 'clientSetupDtlView',
			items : [/*
						 * { xtype : 'panel', layout : 'hbox', itemId :
						 * 'gridHeader', items : [] },
						 * /{
				xtype : 'panel',
				layout : 'hbox',
				cls : 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
				items : [{
							xtype : 'label',
							text : getLabel('actions', 'Actions') + ':',
							cls : 'font_bold ux-ActionLabel',
							padding : '5 0 0 3'
						}, actionBar, {
							xtype : 'label',
							text : '',
							flex : 1
						}]

			}]
		}];*/
		this.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/securityProfileMst/groupBy.json?$filterscreen=securityProfileMst',
			//cfgGroupByUrl : 'static/scripts/cpon/securityProfileMst/data/groupBy.json',
			cfgSummaryLabel : getLabel('securityProfiles','Security Profiles'), 
			cfgGroupByLabel : getLabel('groupedBy','Grouped By'), 
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			cfgParentCt : me,
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			cfgGridModel : {
				pageSize : _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : false,
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : false,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
				fields : ['clientName', 'profileName', 'clientId', 'clientDesc',
					'integrityCheckFlag', 'encryptionFlag', 'singingFlag',
					'requestStateDesc', 'identifier', 'history', '__metadata','globalLocalFlag'],
						proxyUrl : 'cpon/bankSecurityProfileMst.json',
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
				defaultColumnModel : me.getColumnModel(SECURITY_GENERIC_COLUMN_MODEL),
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
			if(Ext.isEmpty(value) || (typeof(value)=="string" && value.indexOf("null")!=-1)){
				strRetValue = "";
			}
			else{
				if(colId == 'col_globalLocalFlag')
				{
					if(record.raw.sellerId === 'OWNER'){
						strRetValue = getLabel("securityProfile.type.G");
					}else{
						strRetValue = getLabel("securityProfile.type."+value);
					}
				}
				else
				{
					strRetValue = value;
				}
			}
		return strRetValue;
	},
		getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 'Discard',
		 'Approve','Reject', 'Enable','Disable']);
		var objActions = {
			'Submit' : {
				/**
				 * @requires Used while creating the action url.
				 */
				actionName : 'submit',
				/**
				 * @optional Used to display the icon.
				 */
				// itemCls : 'icon-button icon-submit',
				/**
				 * @optional Defaults to true. If true , then the action will
				 *           considered in enable/disable on row selection.
				 */
				isGroupAction : true,
				/**
				 * @optional Text to display
				 */
				itemText : getLabel('prfMstActionSubmit', 'Submit'),
				/**
				 * @requires The position of the action in mask.
				 */
				maskPosition : 5
				/**
				 * @optional The position of the action in mask.
				 */
				// fnClickHandler : handleRejectAction
			},
			'Discard' : {
				actionName : 'discard',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('prfMstActionDiscard', 'Discard'),
				maskPosition : 10
			},
			'Approve' : {
				actionName : 'accept',
				// itemCls : 'icon-button icon-authorize',
				itemText : getLabel('prfMstActionApprove', 'Approve'),
				maskPosition : 6
			},
			'Reject' : {
				actionName : 'reject',
				// itemCls : 'icon-button icon-send',
				itemText : getLabel('prfMstActionReject', 'Reject'),
				maskPosition : 7
			},
			'Enable' : {
				actionName : 'enable',
				itemText : getLabel('prfMstActionEnable', 'Enable'),
				maskPosition : 8
			},
			'Disable' : {
				actionName : 'disable',
				itemText : getLabel('prfMstActionDisable', 'Disable'),
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
		var objActionCol = {
			colType : 'actioncontent',
			width : 85,
			locked : true,
			items : [{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Edit Record'),
				maskPosition : 2
			}, {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				maskPosition : 3
			}, {
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				itemLabel : getLabel('historyToolTip', 'View History'),
				toolTip : getLabel('historyToolTip', 'View History'),
				maskPosition : 4
			}]
		};
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(objActionCol);
		return arrCols;
	}
	,
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'groupaction',
			colType : 'actioncontent',
			width : 120,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : colItems,
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
							itemId : 'submit',
							actionName : 'submit',
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
							text : getLabel('prfMstActionDiscard', 'Discard'),
							itemId : 'discard',
							actionName : 'discard',
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
					case 'Approve' :
						itemsArray.push({
							text : getLabel('prfMstActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
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
							text : getLabel('prfMstActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
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
					case 'Enable' :
						itemsArray.push({
							text : getLabel('prfMstActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 8
						});
						break;
					case 'Disable' :
						itemsArray.push({
							text : getLabel('prfMstActionDisable', 'Disable'),
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