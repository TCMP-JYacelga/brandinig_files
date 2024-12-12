/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.UserActivityView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userActivityView',
	requires : ['GCP.view.UserActivityFilterView'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [
	/*	{
					xtype : 'panel',
					width : '100%',					
					cls : 'ux_panel-background ux_extralargepadding-bottom',
					width : '100%',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('lbluseractivity',
										'User Activity'),
								cls : 'page-heading'
								/*listeners : {
									'render' : function(lbl) {
										lbl.getEl().on('click', function() {
											GCP.getApplication().fireEvent('switchView','useractivity');
										});
									}
								}* / 
							},{
								xtype : 'label',
								text : ' | ',
								cls : 'page-heading thePointer ',
								margin : '0 10 0 10'
							},{
								xtype : 'label',
								text : getLabel('lbleventlog',
										'Event Log'),
								cls : 'page-heading thePointer page-heading-inactive',
								listeners : {
									'render' : function(lbl) {
										lbl.getEl().on('click', function() {
											GCP.getApplication().fireEvent('switchView','eventlog');
										});
									}
								}
							},
							{
								xtype : 'label',
								flex : 15
						},{
							xtype : 'container',
							layout : 'hbox',
							cls : 'ux_smallpadding-top',
							align : 'rightFloating',
							items : [{
						xtype : 'button',
						textAlign : 'right',
						itemId : 'downloadPdf',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						width : 80,
						text : getLabel('report', 'Report'),
						border : 0
					}, {
								xtype : 'button',
								border : 0,
								text : getLabel('lbl.messageCenter.export',
										'Export'),
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf019@fontawesome',
								margin : '0 0 0 0',
								width : 75,
								menu : Ext.create('Ext.menu.Menu', {
											items : [{
												text : getLabel('csvBtnText', 'CSV'),
												glyph : 'xf0f6@fontawesome',
												itemId : 'downloadCsv',
												parent : this,
												//hidden : isHidden('CSVTSV'),
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'performReportAction',
															btn, opts);
												}
											}, {
												text : getLabel(
														'withHeaderBtnText',
														'With Header'),
												xtype : 'menucheckitem',
												itemId : 'withHeaderId',
												checked : 'true'
											}]
										})
							}]
						}
]
				}, */
			/*	{
					xtype : 'userActivityFilterView',
					width : 'auto',
					collapsible : true,
			        collapsed : filterPanelCollapsed,
					title : getLabel('filterBy', 'Filter By: ')

				}, 
				{
					xtype : 'userActivityInformation',
					margin : '0 0 10 0'
				},
				*/
				/* {
					xtype : 'userActivityGridView',
					width : '100%',
					//margin : '0 0 10 0',
					parent : me
				}*/groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}

		if (objUserActivityFilterPref) {
			var objJsonData = Ext.decode(objUserActivityFilterPref);
			objGroupByPref = objJsonData.d.preferences.gridView || {};
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			itemId : 'userActivity',
			cfgGroupByUrl : 'services/grouptype/userActivity/groupBy.json?$filterscreen=userActivityFilter&$filterGridId=GRD_ADM_USERACTIVITY',
			cfgSummaryLabel : getLabel('lbluseractivity', 'User Activity'),
			cfgGroupByLabel : getLabel('groupedby', 'Grouped By'),
			enableQueryParam:false,
			cls : 't7-grid',
			cfgGroupCode : objGroupByPref.groupCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cfgShowFilter : true,
			 cfgShowAdvancedFilterLink : true,
			 cfgShowRefreshLink : false,
			 cfgSmartGridSetting : true,	
			 cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'userActivityFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},	
			cfgGridModel : {
				pageSize : _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showEmptyRow : false,
				showPager : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true, 
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel:{
					fields : ['userCode', 'userName', 'userCategory',
								'corporationName', 'clientName', 'loginTime',
								'logoutTime', 'loginStatus', 'identifier','requestState','validFlag','channel','userType',
								'__metadata', 'sessionId','companyName','userId','ipAdress','remarks'],
					proxyUrl : 'userActivityGridList.srvc',
					rootNode : 'd.activitylist',
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
				showCheckBoxColumn:me.getChecboxCondition(),
				defaultColumnModel : me
						.getColumnModel(USER_ACTIVITY_GENERIC_COLUMN_MODEL),
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
		return groupView
	},
getChecboxCondition:function(){
			if(entityType==0){
			return true;
			}else{
			   return false;
			}
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Kill']);
		var objActions = {
			'Kill' : {
				actionName : 'Kill',
				isGroupAction : true,
			    itemId : 'killSession',
				itemText : '<span class="button_underline thePointer">'
									+ getLabel('lblkillsession', 'Terminate Session')
									+ '</span>',
				maskPosition : 3
			}
			
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		if(entityType==0){
		return retArray;
		}
		else{
		return;
		}
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		var showIcons = false;
		if(store.dataUrl === 'userActivityGridList.srvc'){
			showIcons = true;
		}
		/**if (colId === 'col_userCode' && showIcons) {
			var usr = "'"+value+"'";
			strRetValue = '<a href="#" onclick="getUserAllLogins('+usr+');">' + value + '</a>'
		}**/
		if (colId === 'col_userName' && showIcons) {
			//var usr = "'" + value + "'";
			 var usr = "'"+record.data.userCode+"'";
				if (record.get('loginStatus') === 'Y')
					strRetValue = '<span class="iconlink online_link">&nbsp;</span>' + ' ' + value;
						else
							strRetValue = '<span class="iconlink offline_link">&nbsp;</span>' + ' ' + value;
						}
		
		if (colId === 'col_status') {
			if(record.data.validFlag=='Y')
				strRetValue="Active";
			else 
				strRetValue="Disabled";
		}
		if(colId === 'col_userType'){
		 if(record.data.userType == 1)
		 strRetValue = "Customer";
		 else if (record.data.userType == 0)
		 strRetValue = "Bank";
		
		}
		/*if(colId === 'col_channel'){
			strRetValue = "Web";
		}*/		

		return strRetValue;
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
	getColumnModel : function(arrCols) {
		var me = this;
		var arrRowActions = [{
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Activity'),
			text : getLabel('viewToolTip', 'View Activity')
			//itemLabel : getLabel('viewToolTip', 'View Record'),
			//maskPosition : 3
			}];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 70,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 2
		};
		return objActionCol;
	}
});