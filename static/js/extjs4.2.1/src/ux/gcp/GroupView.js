/**
 * @class Ext.ux.gcp.GroupView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
/**
 * Ext.ux.gcp.GroupView is a container that has specific functionality and
 * structural components that make it the perfect building block for
 * application-oriented user interfaces.
 * 
 * @example
 * 
 * Ext.create('Ext.ux.gcp.GroupView', {
 *	cfgGroupByUrl : 'static/scripts/payments/paymentSummaryNewUX/data/groupBy.json',
 *	cfgSummaryLabel : 'Payments',
 *	cfgGroupByLabel : 'Grouped By',
 *	minHeight : 500,
 *	renderTo : 'summaryDiv',
 *	cfgShowFilter : true,
 *	cfgAutoGroupingDisabled : true,
 *	cfgGridModel : {
 *		pageSize : 10,
 *		pageSize : 1,
 *		rowList : [5, 10, 15, 20, 25, 30],
 *		stateful : false,
 *		hideRowNumbererColumn : false,
 *		showSummaryRow : true,
 *		showEmptyRow : false,
 *		showPager : true,
 *		height : 400,
 *		storeModel : {
 *			fields : ['history', 'client', 'clientReference', 'productType','productTypeDesc', 'entryDate', 'module', 'activationDate',
 *					'amount', 'actionStatus', 'identifier', '__metadata','pirMode', 'count', 'isActionTaken', 'currency',
 *					'isConfidential', 'isClone', 'uploadRef', 'paymentMethod','channel', 'bankProduct', 'file', 'authNmbr',
 *					'paymentType', 'phdnumber', 'valueDate', 'maker','creditAmount', 'debitAmount', 'recieverName',
 *					'receiverCcy', 'templateName', 'hostMessage','sendingAccount'],
 *			proxyUrl : 'services/paymentsbatch.json',
 *			rootNode : 'd.batch',
 *			totalRowsNode : 'd.__count'
 *		},
 *		groupActionModel : [{
 *			//@requires Used while creating the action url.
 *			actionName : 'submit',
 *			//@optional Used to display the icon.
 *			itemCls : 'icon-button icon-submit',
 *			//@optional Defaults to true. If true , then the action will considered in enable/disable on row selection.
 *			isGroupAction : false,
 *			//@optional Text to display
 *			itemText : getLabel('instrumentsActionSubmit', 'Submit'),
 *			//@requires The position of the action in mask.
 *			maskPosition : 5,
 *			//@optional The position of the action in mask.
 *			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
 *					event, record) {
 *			}
 *		}, {
 *			actionName : 'verify',
 *			itemCls : 'icon-button icon-verify',
 *			itemText : getLabel('instrumentsActionVerify', 'Verify'),
 *			maskPosition : 13
 *		}],
 *		defaultColumnModel : [{
 *					colType : 'actioncontent',
 *					colId : 'action',
 *					width : 80,
 *					align : 'right',
 *					sortable : false,
 *					locked : true,
 *					lockable : false,
 *					hideable : false,
 *					items : [{
 *								itemId : 'btnQuickPay',
 *								itemCls : 'grid-row-action-icon icon-quickpay',
 *								toolTip : getLabel('batchQuickPay', 'Quick Pay')
 *							}, {
 *								itemId : 'btnHistory',
 *								itemCls : 'grid-row-action-icon icon-history',
 *								itemLabel : getLabel('historyToolTip',
 *										'View History'),
 *								maskPosition : 14
 *								// fnVisibilityHandler : isIconVisible
 *								// fnClickHandler : showHistory
 *							}]
 *				}, {
 *					"colId" : "recieverName",
 *					"colHeader" : "Receiver Name",
 *					"hidden" : false
 *				}, {
 *					"colId" : "amount",
 *					"colHeader" : "Amount",
 *					"colType" : "amount",
 *					"hidden" : false
 *				}, {
 *					"colId" : "count",
 *					"colHeader" : "Count",
 *					"colType" : "count",
 *					"hidden" : false
 *				}, {
 *					"colId" : "actionStatus",
 *					"colHeader" : "Status",
 *					"hidden" : false
 *				}],
 *		fnColumnRenderer : function(value, meta, record, rowIndex, colIndex,
 *				store, view, colId) {
 *			return value;
 *		},
 *		fnSummaryRenderer : function(value, summaryData, dataIndex, rowIndex,
 *				colIndex, store, view, colId) {
 *			return value;
 *		},
 *		fnRowIconVisibilityHandler : function(store, record, jsonData, itmId,
 *				maskPosition) {
 *			return true;
 *		}
 *  },
 *  listeners : {
 *		'groupByChange' : function(menu, arrGroupData) {
 *  	},
 *		'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel, newCard,
 *				oldCard) {
 *			this.reconfigureGrid(null);
 *		},
 *		'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
 *				newPgNo, oldPgNo, sorter) {
 *			var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
 *			grid.loadGridData(strUrl);
 *		},
 *		'gridPageChange' : function(groupInfo, subGroupInfo, grid, url, pgSize,
 *				newPgNo, oldPgNo, sorter) {
 *			var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
 *			grid.loadGridData(strUrl);
 *		},
 *		'gridSortChange' : function(groupInfo, subGroupInfo, grid, url, pgSize,
 *				newPgNo, oldPgNo, sorter) {
 *			var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
 *			grid.loadGridData(strUrl);
 *		},
 *		'gridPageSizeChange' : function(groupInfo, subGroupInfo, grid, url, pgSize,
 *				newPgNo, oldPgNo, sorter) {
 *			var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
 *			grid.loadGridData(strUrl);
 *		},
 *		'gridRowSelectionChange' : function(groupInfo, subGroupInfo, objGrid,
 *				objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
 *		},
 *		'gridStateChange' : function(grid) {
 *		},
 *		'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName,
 *				event, record) {
 *  	},
 *		'groupActionClick' : function(actionName, isGroupAction, maskPosition,
 *				grid, arrSelectedRecords) {
 *  	}
 * });
 */
Ext.define('Ext.ux.gcp.GroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'groupView',
	requires : ['Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.form.Label',
			'Ext.menu.Menu', 'Ext.layout.container.HBox', 'Ext.tab.Panel',
			'Ext.container.Container', 'Ext.ux.gcp.SmartGrid',
			'Ext.ux.gcp.SmartGridActionBar', 'Ext.ux.gcp.FilterView',
			'Ext.ux.gcp.SmartGridSettingButton', 'Ext.tip.ToolTip',
			'Ext.tip.QuickTipManager'],
	autoHeight : true,
	width : '100%',
	cls : 'xn-group-view ux_header ux_panel-background',
	itemId : 'groupViewPanel',
	/**
	 * @cfg{String} cfgSummaryLabel The text to be displyed in summary label
	 * @default 'Summary Details'
	 */
	cfgSummaryLabel : null,
	/**
	 * @cfg{String} cfgGroupByLabel The text to be displyed in Group By label
	 * @default 'Grouped By'
	 */
	cfgGroupByLabel : null,
	/**
	 * @cfg{String} cfgGroupByUrl The url to be used to fetch the data for
	 *              "Group By" menu and "Sub Group" tabs generation.
	 * @default null
	 */
	cfgGroupByUrl : null,
	/**
	 * @cfg{String} cfgGroupCode The default value to be set in Group By
	 * 
	 * @default null
	 */
	cfgGroupCode : null,
	/**
	 * @cfg{String} cfgSubGroupCode The default value used to set the active tab
	 * 
	 * @default null
	 */
	cfgSubGroupCode : null,
	/**
	 * @cfg{Array} cfgGroupByData The json array to be used for "Group By" menu
	 *             and "Sub Group" tabs generation. This config will igonred if
	 *             cfgGroupByUrl is not empty
	 * @default null
	 */
	cfgGroupByData : null,
	/**
	 * @cfg{JSON} cfgGridModel The json model used for SmartGrid creation
	 * @default {}
	 * 
	 * @example
	 * The cfgGridModel is nothing but the smartgrid configurations, refere below example :
	 * {
	 *			pageSize : 10,
	 *			pageNo : 1,
	 *			rowList : [5, 10, 15, 20, 25, 30],
	 *			stateful : false,
	 *			hideRowNumbererColumn : false,
	 *			showSummaryRow : true,
	 *			showEmptyRow : false,
	 *			showPager : true,
	 *			height : 400,
	 *			storeModel : {
	 *				fields : ['history', 'client'],
	 *				proxyUrl : 'services/paymentsbatch.json',
	 *				rootNode : 'd.batch',
	 *				totalRowsNode : 'd.__count'
	 *			},
	 *			groupActionModel : [],
	 *			defaultColumnModel : [],
	 *			fnColumnRenderer : function(value, meta, record, rowIndex,
	 *					colIndex, store, view, colId) {
	 *				return value
	 *			},
	 *			fnSummaryRenderer : function(value, summaryData, dataIndex,
	 *			 rowIndex, colIndex, store, view, colId) {
	 *			 },
	 *			fnRowIconVisibilityHandler : function(store, record, jsonData, itmId, maskPosition) {
	 *			}
	 *	}
	 */
	cfgGridModel : {},
	/**
	 * @cfg{Boolean} cfgShowRefreshLink controls whether the refresh data link
	 *               should appear on right top below the tab bar
	 * 
	 * @default true
	 */
	cfgShowRefreshLink : false,
	/**
	 * @cfg{Object} cfgParentCt The parent container, used to show/hide loading
	 *              indicator while grid data load
	 * 
	 * @default null
	 */
	cfgParentCt : null,
	/**
	 * @cfg{boolean} cfgCollpasible True to make the panel collapsible and have
	 *               an expand/collapse toggle Tool added into the header tool
	 *               button area. False to keep the panel sized either
	 *               statically, or by an owning layout manager, with no toggle
	 *               Tool.
	 * 
	 * @default true
	 */
	cfgCollpasible : true,
	/**
	 * @cfg{Boolean} cfgShowFilter controls whether the filter panel to be
	 *               displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilter : false,
	/**
	 * @cfg{Boolean} cfgShowFilterInfo controls whether the applied filter panel
	 *               information(text-only) to be displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilterInfo : true,
	/**
	 * cfgFilter Model contains configs like, a. layout b. items c. collapsed
	 * 
	 * @example 
	 * {
	 * 			cfgContentPanelLayout:'fit',
	 * 			cfgContentPanelItems : [],
	 * 			collapsed : true
	 * }
	 * 
	 * 
	 */
	cfgFilterModel : {},
	/**
	 * @cfg{Boolean} cfgShowRibbon controls whether the ribbon panel to be
	 *               displayed or not
	 * 
	 * @default false
	 */
	cfgShowRibbon : false,
	/**
	 * @cfg{Object} cfgRibbonModel contains ribbon model
	 * 
	 * @example { itemId : 'ribbon1', items : [], showSetting : true}
	 * 
	 * @default {}
	 */
	cfgRibbonModel : {},
	/**
	 * @cfg{boolean} cfgShowAdvancedFilterLink True to make the advanced filter
	 *               link visible .False to hide the link. This config will
	 *               ignored when cfgShowFilter is set to false
	 * 
	 * @default true
	 */
	cfgShowAdvancedFilterLink : true,
	/**
	 * @cfg{String} cfgCaptureColumnSettingAt Column model to be capture at. i.e
	 *              G : Group Level, L : Local , i.e at grid level
	 * 
	 * @default G
	 */
	cfgCaptureColumnSettingAt : 'G',
	/**
	 * @cfg{Array} cfgPrefferedColumnModel Prefered column setting . This will
	 *             be applicable if cfgCaptureColumnSettingAt is 'G'
	 * 
	 * @example [{
	 * 				"allowSubTotal": "N",
	 *				"colDesc": "Sending Account#",
	 *				"colHeader": "Sending Account#",
	 *				"colId": "sendingAccount",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": true,
	 *				"isTypeCode": "N",
	 *				"width": 140,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 2
	 *			}, {
	 *				"allowSubTotal": "N",
	 *				"colDesc": "Payment Reference",
	 *				"colHeader": "Payment Reference",
	 *				"colId": "clientReference",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": false,
	 *				"isTypeCode": "N",
	 *				"width": 160,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 1
	 *			}]
	 * @default null
	 */
	cfgPrefferedColumnModel : null,
	isGroupDetailsVisibile : true,
	cfgGroupingDisabled : false,
	/**
	 * @cfg{boolean} cfgAutoGroupingDisabled true to make all group by tabs hide
	 *               if group by JSON service returns none. false, it will show
	 *               group by tabs
	 * 
	 * @default false
	 */
	cfgAutoGroupingDisabled : false,
	/**
	 * @cfg{boolean} cfgShowPageSize true to show the Page size combo box. If cfgShowPageSize is
	 * 				 false then Page size combo box should not display. 
	 * 
	 * @default false
	 */
	cfgShowPageSize : true,
	enableQueryParam : true,
	initComponent : function() {
		var me = this, objNavigationPanel = null, objGridPanel = null, objFilterPanel = null, arrItems = [], objRibbonPanel = null;
		//TODO : This has to be removed once admin screens are converted to BNR
		if(typeof _blnShowAppliedFilter !== 'undefined' && !Ext.isEmpty(_blnShowAppliedFilter) && typeof _blnShowAppliedFilter === 'boolean')
			me.cfgShowFilterInfo = _blnShowAppliedFilter;
		if (me.cfgShowFilter === true || me.cfgShowFilterInfo === true) {
			objFilterPanel = me.createFilterPanel();
			arrItems.push(objFilterPanel);
		}
		if (me.cfgShowRibbon === true) {
			objRibbonPanel = me.createRibbonPanel();
			arrItems.push(objRibbonPanel);
		}
		objNavigationPanel = me.createNavigationPanel();
		objGridPanel = me.createGridPanel();
		me.items = arrItems.concat([objNavigationPanel, objGridPanel]);
		me.on('resize', function() {
					me.doLayout();
				});
		me.on('groupByClicked', function(menu, blnMenuClicked) {
					if (blnMenuClicked === true && menu.autoRefresh === 'Y') {
						me.handleSubGroupAutoRefresh(menu);
					} else {
						me.handleGroupByChange(menu, menu.groupInfo);
						me.fireEvent('groupByChange', menu, menu.groupInfo);
					}
				});
		me.on('refreshGroupView', function() {
					me.refreshData();
				});
		Ext.QuickTips.init();
		me.callParent(arguments);

	},
	/**
	 * The function createFilterPanel creates filter panel.
	 */
	createFilterPanel : function() {
		var me = this, objFilterPanel = null;
		objFilterPanel = Ext.create('Ext.ux.gcp.FilterView', {
					itemId : me.cfgFilterModel.itemId || 'groupViewFilterView',
					cfgShowAdvancedFilterLink : me.cfgShowAdvancedFilterLink,
					cfgFilterModel : me.cfgFilterModel,
					cfgShowFilter : me.cfgShowFilter,
					cfgShowFilterInfo : me.cfgShowFilterInfo,
					parent : me
				});
		return objFilterPanel;
	},
	/**
	 * The function createRibbonPanel creates ribbon panel.
	 */
	createRibbonPanel : function() {
		var me = this, objRibbon = null;
		objRibbon = Ext.create('Ext.ux.gcp.RibbonView', {
					itemId : (me.cfgRibbonModel || {} ).itemId || 'ribbonView',
					parent : me,
					dock : 'top',
					cfgRibbonModel : me.cfgRibbonModel || {}
				});
		return objRibbon;
	},
	/**
	 * @cfg{ARRAY} arrFilterInfoJson The json model used populate filter
	 *             inofrmation
	 * @default {}
	 * 
	 * @example [{
	 * 								"fieldId" : "statusField", 
	 * 								"fieldLabel" : "Status", 
	 * 								"fieldValue" : []
	 * 							}]
	 */
	updateFilterInfo : function(arrFilterInfoJson) {
		var me = this, filterPanel = me
				.down('panel[itemId="groupViewFilterView"]');
		if (filterPanel)
			filterPanel.updateFilterInfo(arrFilterInfoJson);
	},
	/**
	 * The function createNavigationPanel creates navigation panel. Filter
	 * button has been modified so as to display the menu on hover and disappear
	 * as soon as mouse moves out. This has been done by using the mouseover,
	 * mouseout listeners.
	 */
	createNavigationPanel : function() {
		var me = this;
		var objContainer = null, objToolBar = null, objTabPanel = null, objFilterButton = null, objRowListBtn = null,objRefreshBtn=null, objRowList = null;
		var arrItems = [], arrRowListItems = [], objJson = null;
		var gridId, objGridView = null, pgSize;
		var cfgModel = me.cfgGridModel;

		objToolBar = me.createSummaryToolBar();
		objToolBar.hidden = true;
		objTabPanel = me.createSummaryTabPanel();
		arrItems.push(objToolBar);
		arrItems.push(objTabPanel);

		pgSize = cfgModel.pageSize;
		objRowList = cfgModel.rowList;

		if (!Ext.isEmpty(objRowList)) {
			for (var i = 0; i < objRowList.length; i++) {
				objJson = objRowList[i];
				arrRowListItems.push({
							text : objJson,
							value : objJson,
							listeners : {
								'click' : function(item) {
									me.rowListItemClickHandler(item);
								}
							}
						});
			}
			if(false)
			arrRowListItems.push({
						text : "View All",
						value : "All",
						listeners : {
							'click' : function(item) {
								me.rowListItemClickHandler(item);
							}
						}
					});

		}
		
		if(me.cfgShowPageSize === true){
			objRowListBtn = Ext.create('Ext.button.Button', {
						text : getLabel('lblPgView', 'View') + " " + pgSize,
						itemId : 'btnRowList',
						margin : '5 13 0 13',
						menuAlign : 'tr-br',
						cls : 'xn-button ux_button-background-color',
						dock : 'right',
						menu : {
							minWidth: 81,
							maxWidth: 81,
							plain : true,
							cls : 'action-dropdown-menu',
							items : arrRowListItems
						}
					});
	
			arrItems.push(objRowListBtn);
		}
		
		if(me.cfgShowRefreshLink === true){
			objRefreshBtn = Ext.create('Ext.Component', {
				itemId : 'btnRefreshIcon',
				html : '<a class="refresh-icon"><i class="fa fa-refresh"/></a>',
				margin : '0 0 0 4',
				padding: '10 0 10 0',
				listeners: {
        			 click: {
          			  element: 'el',
            		  fn: function(){ me.refreshData();}
        			}		
				 }
			});
			
			arrItems.push(objRefreshBtn);
		}

		objContainer = Ext.create('Ext.container.Container', {
					itemId : 'navigationContainer',
					cls : 'xn-panel-header',
					layout : {
						type : 'hbox'
					},
					items : arrItems
				});
		return objContainer;
	},
	rowListItemClickHandler : function(item) {
		var me = this, strText = null;
		var value = item.value;
		var objRowList = me.down('button[itemId="btnRowList"]');
		strText = getLabel('lblPgView', 'View') + " " + value;
		if (!Ext.isEmpty(objRowList)) {
			objRowList.setText(strText);
		}
		me.handleRowListChange(item.value);

	},
	handleRowListChange : function(value) {
		var me = this, gridId, objGridView = null, objSmartGridPager = null;
		gridId = Ext.String.format('summaryGrid_{0}', me.itemId);
		objGridView = me.down('smartgrid[itemId="' + gridId + '"]');
		if (!Ext.isEmpty(objGridView) && value != 'All') {
			objSmartGridPager = objGridView.down('smartGridPager');
			objGridView.pageSize = value;
			objGridView.store.pageSize = value;
			objGridView.store.currentPage = 1;
			if (!Ext.isEmpty(objSmartGridPager)) {
				objSmartGridPager.minPgSize = value;
				objSmartGridPager.doHandlePageSizeChange(null, value, null);
				objSmartGridPager.doRefresh();
			}
		}

	},
	toggleFilterIcon : function(isFilterApplied) {
		var me = this;
		var btn = me.down('button[itemId="filterButton"]');
		var strIconCls = isFilterApplied === true
				? 'icon-filter-on-T7'
				: 'icon-filter-T7';
		if (btn) {
			btn.setIconCls(strIconCls);
		}
	},
	setFilterToolTip : function(strToolTip) {
		var me = this;
		var btn = me.down('button[itemId="filterButton"]');
		if (btn) {
			btn.setTooltip('' + strToolTip || '');
		}
	},
	/**
	 * The function createGridPanel creates grid container
	 */
	createGridPanel : function() {
		var me = this;
		var objGridContainer = null;
		objGridContainer = Ext.create('Ext.container.Container', {
					itemId : 'gridContainer',
					layout : 'fit',
					height : 'auto',
					width : '100%',
					padding : '5 10 12 10',
					componentCls : 'gradiant_back x-portlet ux_border-top',
					autoHeight : true
				});
		return objGridContainer;

	},
	/**
	 * The function createSummaryToolBar creates the Tool Bar. Groupby button
	 * has also been changes so as to provide the functionality of menu show on
	 * hover.
	 */
	createSummaryToolBar : function() {
		var me = this;
		var strSummaryLabel = me.cfgSummaryLabel || 'Summary Details';
		var strGroupByLabel = me.cfgGroupByLabel || 'Grouped By';
		var isDataAvailable = !Ext.isEmpty(me.cfgGroupByData) ? true : false;
		var arrMenus = [];
		var objToolBar = null
		if (isDataAvailable) {
			arrMenus = me.generateGroupByMenus(me.cfgGroupByData);
		}
		var hideTask;
		var isToggleBtnVisible = me.cfgCollpasible === true ? false : true;
		objToolBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId : 'summaryToolBar',
			minWidth : 300,
			maxWidth : 450,
			items : [{
				xtype : 'button',
				itemId : 'summaryToggleButton',
				width : 25,
				hidden : isToggleBtnVisible,
				iconCls : 'icon-collapse-rounded',
				cls : 'xn-button-transparent summaryToggleButton ux_smallmargin-right',
				collapsed : false,
				handler : function(btn) {
					btn.collapsed = !btn.collapsed;
					var strCls = btn.collapsed === true
							? 'icon-expand-rounded'
							: 'icon-collapse-rounded';
					me.toggleView(btn.collapsed);
					btn.setIconCls(strCls);
				}
			}, {
				xtype : 'label',
				itemId : 'summaryLabel',
				cls : 'ux_texttransform-upper ux_font-size16-normal groupview-header-title',
				text : strSummaryLabel
			}, '->', {
				xtype : 'label',
				text : strGroupByLabel,
				itemId : 'groupedByButtonLabel',
				hidden : me.cfgGroupingDisabled,
				cls : 'groupby-label'
			}, {
				xtype : 'button',
				itemId : 'groupByButton',
				menuAlign : 'tr-br',
				cls : 'groupbyButton ux_icon-dropdown',
				hidden : me.cfgGroupingDisabled,
				width : 20,
				listeners : {
					mouseover : function(button) {
						hideTask.cancel();
						if (!this.hasVisibleMenu()) {
							this.showMenu();
							button.addCls('group-down-hover');
						}
					},
					mouseout : function(button) {
						hideTask.delay();
					},
					render : function(button) {
						hideTask = new Ext.util.DelayedTask(button.hideMenu,
								button);
					}
				},
				menu : Ext.create('Ext.menu.Menu', {
							itemId : 'groupByButtonMenu',
							items : arrMenus,
							plain : true,
							cls : 'ext-dropdown-menu xn-menu-noicon',
							listeners : {
								mouseleave : function(menu, e) {
									if (e.relatedTarget.className
											.indexOf('groupbyButton') != -1) {

									} else {
										hideTask.delay();
										// menu.up('button').removeCls('group-down-hover');
									}
								},
								mouseover : function(menu) {
									hideTask.cancel();
									// menu.up('button').addCls('group-down-hover');
								}
							}
						})
			}, {
				xtype : 'label',
				itemId : 'groupedByLabel',
				textAlign : 'right',
				minWidth : 80,
				maxWidth : 150,
				cls : 'account-type ux_text-elipsis',
				hidden : me.cfgGroupingDisabled,
				listeners : {
					render : function(c) {
						Ext.create('Ext.tip.ToolTip', {
									target : c.getEl(),
									parentEle : c,
									html : c.text,
									listeners : {
										show : function(tip) {
											tip.update(tip.parentEle.text);
										}
									}
								});
					}
				}
			}]
		});
		if (!isDataAvailable) {
			objToolBar.on('render', function(toolBar) {
						me.loadGroupByMenus(me.cfgGroupByUrl);
					});
		}
		return objToolBar;
	},
	/**
	 * The function createSummaryTabPanel creates the Tabs View
	 */
	createSummaryTabPanel : function() {
		var me = this;
		var objTabPanel = null;
		objTabPanel = Ext.create('Ext.tab.Panel', {
					itemId : 'summaryTabPanel',
					padding : '3 2 0 2',
					// margin : '6 0 0 0',
					minTabWidth : 50,
					maxTabWidth : 150,
					flex : 0.8,
					items : [{
								title : 'All',
								hidden : me.cfgGroupingDisabled,
								subGroupInfo : {
									groupDescription : 'All',
									groupCode : 'all',
									groupId : 'all',
									groupQuery : ''
								}
							}]
				});
		objTabPanel.on('tabChange',
				function(tabPanel, newCard, oldCard, eOpts) {
					var objTab = tabPanel.getActiveTab();
					var groupInfo = me.getGroupInfo();
					var subGroupInfo = (objTab.subGroupInfo || {});
					// Updating th column model on "Tab" change
					me.cfgGridModel.columnModel = (subGroupInfo.columns
							|| groupInfo.columns || null);
					me.fireEvent('groupTabChange', groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				});
		return objTabPanel;
	},
	/**
	 * The function loadGroupByMenus loads the data for "Group By" drop down
	 * menu. The response data is passed to generateGroupByMenus to generate
	 * "Group By" button menus.
	 * 
	 * @param{String} strUrl The url to be used for deta fetch
	 * 
	 * @example
	 * The response JSON should be of format
	 * {
	 * 	"d" : {
	 * 			"groupTypes" :[{
	 * 				"groupTypeDesc" : "ProductCategories",
	 * 				"groupTypeCode" : "productCategory",  
	 * 				"columns" : [], 
	 * 				"groups" : [{
	 * 								"groupCode" : "05", 
	 * 								"groupDescription" : "ACH", 
	 * 								"groupId" : "productCategory", 
	 * 								"groupQuery" : "instType eq 05", 
	 * 								"columns" : [] 
	 * 							}] 
	 * 			}]
	 * 		}
	 * }
	 */
	loadGroupByMenus : function(strUrl) {
		var me = this;
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
		}
		strGeneratedUrl = !Ext.isEmpty(strGeneratedUrl)
				? strGeneratedUrl
				: strUrl;
		Ext.Ajax.request({
					url : strGeneratedUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						var arrData = [];
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							arrData = (data.d && data.d.groupTypes)
									? data.d.groupTypes
									: [];
						}
						me.cfgGroupByData = arrData;
						if (!Ext.isEmpty(arrData) && arrData.length == 1) {
							if (!Ext.isEmpty(arrData[0].groupTypeCode)
									&& arrData[0].groupTypeCode === 'none'
									&& me.cfgAutoGroupingDisabled)
								me.cfgGroupingDisabled = true;
						}
						me.generateGroupByMenus(arrData);
					},
					failure : function(response) {
						// TODO: Error handling to be done here
					}
				});
	},
	/**
	 * The function handleSubGroupAutoRefresh refresh the data for Sub Group
	 * 
	 * @param{menu} menu The menu item whose subgroup to be refresh
	 * 
	 * @example
	 * The response JSON should be of format
	 * {
	 * 	"d" : {
	 * 			"groupTypes" :[{
	 * 				"groupTypeDesc" : "ProductCategories",
	 * 				"groupTypeCode" : "productCategory",  
	 * 				"columns" : [], 
	 * 				"groups" : [{
	 * 								"groupCode" : "05", 
	 * 								"groupDescription" : "ACH", 
	 * 								"groupId" : "productCategory", 
	 * 								"groupQuery" : "instType eq 05", 
	 * 								"columns" : [] 
	 * 							}] 
	 * 			}]
	 * 		}
	 * }
	 */
	handleSubGroupAutoRefresh : function(menu) {
		var me = this;
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(me.cfgGroupByUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			strGeneratedUrl = me.cfgGroupByUrl.substring(0, me.cfgGroupByUrl
							.indexOf('?'));
		}
		strGeneratedUrl = !Ext.isEmpty(strGeneratedUrl)
				? strGeneratedUrl
				: me.cfgGroupByUrl;

		Ext.Ajax.request({
			url : strGeneratedUrl,
			method : 'POST',
			params : objParam,
			success : function(response) {
				var arrData = [], objJson = {};
				var objMenu = me.down('menu[itemId="groupByButtonMenu"]'), arrMenuItems = [], objMenuItem = null, objSubGroup = null;
				var strGroupTypeCode = menu.groupInfo.groupTypeCode;
				arrmenuItems = objMenu && objMenu.items && objMenu.items.items
						? objMenu.items.items
						: []
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					arrData = (data.d && data.d.groupTypes)
							? data.d.groupTypes
							: [];
				}
				me.cfgGroupByData = arrData;
				Ext.each(arrmenuItems, function(item) {
					if (item.groupInfo
							&& (item.groupInfo.groupTypeCode === strGroupTypeCode)) {
						objMenuItem = item;
						return false
					}
				});
				if (!Ext.isEmpty(arrData) && arrData.length > 0) {
					Ext.each(arrData, function(item) {
								if (item.groupTypeCode === strGroupTypeCode) {
									objSubGroup = item;
									return false
								}
							});
				}
				if (objMenuItem && objSubGroup) {
					objMenuItem.groupInfo = objSubGroup;
				}
				me.handleGroupByChange(menu, menu.groupInfo);
				me.fireEvent('groupByChange', menu, menu.groupInfo);
			},
			failure : function(response) {
				// TODO: Error handling to be done here
				me.handleGroupByChange(menu, menu.groupInfo);
				me.fireEvent('groupByChange', menu, menu.groupInfo);
			}
		});
	},
	/**
	 * The function generateGroupByMenus generates the "Group By" button menus.
	 * 
	 * @param{Array} The json array data as input
	 * 
	 * @example [{
	 * 		"groupTypeDesc" : "ProductCategories", 
	 * 		"groupTypeCode" : "productCategory", 
	 * 		"columns" : [], 
	 * 		"groups" : [{
	 * 			"groupCode" : "05", 
	 * 			"groupDescription" : "ACH", 
	 * 			"groupId" : "productCategory", 
	 * 			"groupQuery" : "instType eq 05", 
	 * 			"columns" : [] 
	 * 		}] 
	 * }]
	 */
	generateGroupByMenus : function(arrData) {
		var me = this;
		var objMenu = me.down('menu[itemId="groupByButtonMenu"]');
		var objJson = null;
		var arrMenu = [];
		var intIndex = 0;
		if(objMenu)
		{
			objMenu.removeAll(true);
			if (!Ext.isEmpty(arrData) && arrData.length > 0) {
				me.isGroupDetailsVisibile = !(arrData.length == 1);
				me.toggleGroupByDetailsVisibility();
				for (var i = 0; i < arrData.length; i++) {
					objJson = arrData[i];
					arrMenu.push({
								text : objJson.groupTypeDesc,
								groupInfo : objJson,
								autoRefresh : objJson.autoRefresh,
								handler : function(menu) {
									me.fireEvent('groupByClicked', menu, true);
								}
							});
					if (me.cfgGroupCode === objJson.groupTypeCode)
						intIndex = i;
				}
			}
			objMenu.add(arrMenu);
			if (arrMenu.length > 0) {
				me.fireEvent('groupByClicked', arrMenu[intIndex], false);
			}
		}
	},

	toggleGroupByDetailsVisibility : function() {
		var me = this, isVisible = me.isGroupDetailsVisibile, groupByButton = me
				.down('button[itemId="groupByButton"]'), groupedByLabel = me
				.down('label[itemId="groupedByLabel"]'), groupedByBtnLabel = me
				.down('label[itemId="groupedByButtonLabel"]');
		isVisible = me.cfgGroupingDisabled ? false : isVisible;
		if (groupByButton)
			groupByButton.setVisible(isVisible);
		if (groupedByLabel)
			groupedByLabel.setVisible(isVisible);
		if (groupedByBtnLabel)
			groupedByBtnLabel.setVisible(isVisible);
	},
	/**
	 * 
	 */
	handleGroupByChange : function(menu, groupInfo) {
		var me = this;
		var strGroupByText = '';
		var tabPanel = me.down('tabpanel[itemId="summaryTabPanel"]'), tab = null;
		var arrData = (groupInfo.groups || []), objSubGroupInfo = null;
		var intIndex = 0, intCnt = 1;
		var arrTabs = [{
					title : getLabel('all','All'),
					hidden : me.cfgGroupingDisabled,
					subGroupInfo : {
						groupDescription : 'All',
						groupCode : 'all',
						groupId : 'all',
						groupQuery : ''
					}
				}];
		strGroupByText = menu.text;
		me.updateGroupByLabel(strGroupByText);
		if (tabPanel) {
			tabPanel.suspendEvents();
			tabPanel.removeAll(true);
			tabPanel.resumeEvents();
			Ext.each(arrData, function(data) {
						arrTabs.push({
									title : getLabel(data.groupCode) != undefined ? getLabel(data.groupCode) :data.groupDescription,
									hidden : me.cfgGroupingDisabled,
									tooltip : getLabel(data.groupCode) != undefined ? getLabel(data.groupCode) :data.groupDescription,
									subGroupInfo : data
								});
						if (me.cfgSubGroupCode === data.groupCode) {
							objSubGroupInfo = data;
							intIndex = intCnt;
						}
						intCnt++;
					});
			tabPanel.add(arrTabs);
			intIndex = arrTabs.length > 1 ? intIndex : 0;
			// tabPanel.suspendEvents();
			objSubGroupInfo = (objSubGroupInfo || {});
			// Updating th column model on "Group By" change
			me.cfgGridModel.columnModel = (objSubGroupInfo.columns
					|| groupInfo.columns || null);
			tabPanel.setActiveTab(intIndex);
			// tabPanel.resumeEvents();
			// me.reconfigureGrid(null);
		}
	},
	/**
	 * The function updateGroupByLabel updates the Selected Group By label
	 * 
	 * @param{String} strLabel The label to be set
	 * 
	 */
	updateGroupByLabel : function(strLabel) {
		var me = this;
		var label = me.down('label[itemId="groupedByLabel"]');
		if (!Ext.isEmpty(label)) {
			label.setText(strLabel);
		}

	},
	getJsonObj : function(jsonObject) {
        var jsonObj ='';
        if(jsonObject  instanceof Object ==false)
               jsonObj =JSON.parse(jsonObject);
        if(jsonObject  instanceof Array)
               jsonObj =jsonObject;
        for (var i = 0; i < jsonObj.length; i++) {
               jsonObj[i].colDesc =  getLabel(jsonObj[i].colId,jsonObj[i].colDesc);
               jsonObj[i].colHeader =  getLabel(jsonObj[i].colId,jsonObj[i].colHeader);;
        }
        if(jsonObject  instanceof Object ==false)
               jsonObj = JSON.stringify(jsonObj)
        return jsonObj;
  },
	/**
	 * The function reconfigureGrid creates the new Smartgrid. This will applies
	 * the grid configuration from input parameter, if not present then will
	 * check from cfgGridModel else will use detault grid configuration.
	 * 
	 * @param{JSON} gridModel
	 * 
	 */
	reconfigureGrid : function(gridModel) {
		var me = this, objSmartGrid = null, actionToolBar = null, arrTBarItem = null;
		gridModel = (gridModel || {});
		var gridContainer = me.down('container[itemId="gridContainer"]');
		var cfgModel = me.cfgGridModel;
		var pageSize = (gridModel.pageSize || cfgModel.pageSize);
		var pageNo = !Ext.isEmpty(gridModel.pageNo)
				? gridModel.pageNo
				: (!Ext.isEmpty(cfgModel.pageNo) ? cfgModel.pageNo : '')
		var columnModel = (gridModel.columnModel || cfgModel.columnModel
				|| cfgModel.defaultColumnModel || []);
		columnModel = me.getJsonObj(columnModel);
		var innerGridConfig = !Ext.isEmpty(cfgModel.nestedGridConfigs) ? cfgModel.nestedGridConfigs.innerGridConfig : {};
		var rowList = (gridModel.rowList || cfgModel.rowList || []);
		var gridStoreModel = (gridModel.storeModel || {});
		var gridViewConfig = (cfgModel.viewConfig || {});
		var cfgStoreModel = (cfgModel.storeModel || {});
		var storeModel = {
			fields : gridStoreModel.fields || cfgStoreModel.fields,
			proxyUrl : gridStoreModel.proxyUrl || cfgStoreModel.proxyUrl,
			rootNode : gridStoreModel.rootNode || cfgStoreModel.rootNode,
			sortState : gridStoreModel.sortState || cfgStoreModel.sortState,
			totalRowsNode : gridStoreModel.totalRowsNode
					|| cfgStoreModel.totalRowsNode
		};
		var showSorterToolbar = !Ext.isEmpty(gridModel.showSorterToolbar)
				? gridModel.showSorterToolbar
				: (!Ext.isEmpty(cfgModel.showSorterToolbar) ? cfgModel.showSorterToolbar : true);

		var stateful = !Ext.isEmpty(gridModel.stateful)
				? gridModel.stateful
				: (!Ext.isEmpty(cfgModel.stateful) ? cfgModel.stateful : true);
		var enableLocking = !Ext.isEmpty(gridModel.enableLocking)
				? gridModel.enableLocking
				: (!Ext.isEmpty(cfgModel.enableLocking)
						? cfgModel.enableLocking
						: true);
		var hideRowNumbererColumn = !Ext
				.isEmpty(gridModel.hideRowNumbererColumn)
				? gridModel.hideRowNumbererColumn
				: (!Ext.isEmpty(cfgModel.hideRowNumbererColumn)
						? cfgModel.hideRowNumbererColumn
						: false);
		var showCheckBoxColumn = !Ext.isEmpty(gridModel.showCheckBoxColumn)
				? gridModel.showCheckBoxColumn
				: (!Ext.isEmpty(cfgModel.showCheckBoxColumn)
						? cfgModel.showCheckBoxColumn
						: true);
		var showSummaryRow = !Ext.isEmpty(gridModel.showSummaryRow)
				? gridModel.showSummaryRow
				: (!Ext.isEmpty(cfgModel.showSummaryRow)
						? cfgModel.showSummaryRow
						: false);
		var showEmptyRow = !Ext.isEmpty(gridModel.showEmptyRow)
				? gridModel.showEmptyRow
				: (!Ext.isEmpty(cfgModel.showEmptyRow)
						? cfgModel.showEmptyRow
						: true);
		var autoExpandLastColumn = !Ext.isEmpty(gridModel.autoExpandLastColumn)
				? gridModel.autoExpandLastColumn
				: (!Ext.isEmpty(cfgModel.autoExpandLastColumn)
						? cfgModel.autoExpandLastColumn
						: true);
		var autoSortColumnList = !Ext.isEmpty(gridModel.autoSortColumnList)
				? gridModel.autoSortColumnList
				: (!Ext.isEmpty(cfgModel.autoSortColumnList)
						? cfgModel.autoSortColumnList
						: false);

		var showPager = !Ext.isEmpty(gridModel.showPager)
				? gridModel.showPager
				: (!Ext.isEmpty(cfgModel.showPager) ? cfgModel.showPager : true);
		var showPagerForced = !Ext.isEmpty(gridModel.showPagerForced)
				? gridModel.showPagerForced
				: (!Ext.isEmpty(cfgModel.showPagerForced)
						? cfgModel.showPagerForced
						: true);
		var enableRowSizeCombo = !Ext.isEmpty(gridModel.enableRowSizeCombo)
				? gridModel.enableRowSizeCombo
				: (!Ext.isEmpty(cfgModel.enableRowSizeCombo)
						? cfgModel.enableRowSizeCombo
						: false);
		var showAllRecords = !Ext.isEmpty(gridModel.showAllRecords)
				? gridModel.showAllRecords
				: (!Ext.isEmpty(cfgModel.showAllRecords)
						? cfgModel.showAllRecords
						: false);
		var fnColumnRenderer = (gridModel.fnColumnRenderer
				|| cfgModel.fnColumnRenderer || me.columnRenderer);
		var fnRowIconVisibilityHandler = (gridModel.fnRowIconVisibilityHandler
				|| cfgModel.fnRowIconVisibilityHandler || me.isRowIconVisible);
		var fnSummaryRenderer = (gridModel.fnSummaryRenderer
				|| cfgModel.fnSummaryRenderer || me.summaryRenderer);

		var height = (gridModel.height || cfgModel.height || 'auto');
		var minHeight = (gridModel.minHeight || cfgModel.minHeight || 'auto');
		var checkBoxColumnWidth = (gridModel.checkBoxColumnWidth
				|| cfgModel.checkBoxColumnWidth || null);
		var rowNumbererColumnWidth = (gridModel.rowNumbererColumnWidth
				|| cfgModel.rowNumbererColumnWidth || null);

		var enableColumnHeaderFilter = !Ext
				.isEmpty(gridModel.enableColumnHeaderFilter)
				? gridModel.enableColumnHeaderFilter
				: (!Ext.isEmpty(cfgModel.enableColumnHeaderFilter)
						? cfgModel.enableColumnHeaderFilter
						: false);
		var columnHeaderFilterCfg = (gridModel.columnHeaderFilterCfg
				|| cfgModel.columnHeaderFilterCfg || null);
		var showPageSetting = !Ext.isEmpty(gridModel.showPageSetting)
				? gridModel.showPageSetting
				: (!Ext.isEmpty(cfgModel.showPageSetting)
						? cfgModel.showPageSetting
						: false);
		var showPagerRefreshLink = !Ext.isEmpty(gridModel.showPagerRefreshLink)
				? gridModel.showPagerRefreshLink
				: (!Ext.isEmpty(cfgModel.showPagerRefreshLink)
						? cfgModel.showPagerRefreshLink
						: !me.cfgShowRefreshLink);
		var multiSort = !Ext.isEmpty(gridModel.multiSort)
				? gridModel.multiSort
				: (!Ext.isEmpty(cfgModel.multiSort) ? cfgModel.multiSort : true);
		var enableRowEditing = !Ext.isEmpty(gridModel.enableRowEditing)
				? gridModel.enableRowEditing
				: (!Ext.isEmpty(cfgModel.enableRowEditing)
						? cfgModel.enableRowEditing
						: false);
		var enableCellEditing = !Ext.isEmpty(gridModel.enableCellEditing)
				? gridModel.enableCellEditing
				: (!Ext.isEmpty(cfgModel.enableCellEditing)
						? cfgModel.enableCellEditing
						: false);
		var escapeHtml = !Ext.isEmpty(gridModel.escapeHtml)
				? gridModel.escapeHtml
				: (!Ext.isEmpty(cfgModel.escapeHtml)
						? cfgModel.escapeHtml
						: true);
		var enableQueryParam = !Ext.isEmpty(gridModel.enableQueryParam)
				? gridModel.enableQueryParam
				: (!Ext.isEmpty(cfgModel.enableQueryParam)
						? cfgModel.enableQueryParam
						: false);
		var showFilterInfo = !Ext.isEmpty(gridModel.showFilterInfo)
				? gridModel.showFilterInfo
				: (!Ext.isEmpty(cfgModel.showFilterInfo)
						? cfgModel.showFilterInfo
						: true);
		var enableColumnAutoWidth = !Ext
				.isEmpty(gridModel.enableColumnAutoWidth)
				? gridModel.enableColumnAutoWidth
				: (!Ext.isEmpty(cfgModel.enableColumnAutoWidth)
						? cfgModel.enableColumnAutoWidth
						: false);
		
		var enableColumnDrag = !Ext.isEmpty(gridModel.enableColumnDrag)
				? gridModel.enableColumnDrag
				: !Ext.isEmpty(cfgModel.enableColumnDrag)
						? cfgModel.enableColumnDrag
						: false;
		
		var enableColumnHeaderMenu = ((!Ext
		.isEmpty(_EntityType) && _EntityType === '1') || (!Ext.isEmpty(_OnBeHalfMode) && _OnBeHalfMode === 'true'))
		? false
		: true;
		
		var enableGridNesting = !Ext.isEmpty(gridModel.enableGridNesting)
				? gridModel.enableGridNesting
				: (!Ext.isEmpty(cfgModel.nestedGridConfigs)
						? cfgModel.nestedGridConfigs.enableGridNesting
						: false);
		
		var cfgSorterLimit = (gridModel.cfgSorterLimit || cfgModel.cfgSorterLimit || 3);

		var heightOption = gridModel.heightOption || cfgModel.heightOption
				|| _GridSizeVal;
		var arrCols = null, ctGroupActions = null, intMaxHeight = null;
		gridContainer.removeAll(true);

		if ((heightOption === 'S' || heightOption === 'M' || heightOption === 'L')) {
			var intHeight = me.getMappedHeight(heightOption);
			if (!Ext.isEmpty(intHeight))
				intMaxHeight = intHeight;
		}
		// me.enableQueryParam = enableQueryParam;
		if (me.cfgCaptureColumnSettingAt === 'G')
			columnModel = me.applyPreferedColumnSetting(columnModel,
					me.cfgPrefferedColumnModel)
		if (!Ext.isEmpty(columnModel)) {
			arrCols = me.getActionColumns();
			arrCols = arrCols ? arrCols.concat(columnModel) : columnModel;
			ctGroupActions = me.createGroupByActionContainer();
			objSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
				id : Ext.String.format('summaryGrid_{0}', me.itemId),
				itemId : Ext.String.format('summaryGrid_{0}', me.itemId),
				bodyCls : 'single-border',
				columnModel : arrCols,
				storeModel : storeModel,
				pageSize : pageSize,
				pageNo : pageNo,
				rowList : rowList,
				enableLocking : enableLocking,
				stateful : stateful,
				viewConfig: gridViewConfig,
				hideRowNumbererColumn : hideRowNumbererColumn,
				showCheckBoxColumn : showCheckBoxColumn,
				showSummaryRow : showSummaryRow,
				showEmptyRow : showEmptyRow,
				autoExpandLastColumn : autoExpandLastColumn,
				autoSortColumnList : autoSortColumnList,
				showPager : showPager,
				showPagerForced : showPagerForced,
				enableRowSizeCombo : enableRowSizeCombo,
				showAllRecords : showAllRecords,
				showPageSetting : showPageSetting,
				showPagerRefreshLink : showPagerRefreshLink,
				height : height,
				minHeight : minHeight,
				checkBoxColumnWidth : checkBoxColumnWidth,
				rowNumbererColumnWidth : rowNumbererColumnWidth,
				columnRenderer : fnColumnRenderer,
				summaryRenderer : fnSummaryRenderer,
				isRowIconVisible : fnRowIconVisibilityHandler,
				enableColumnHeaderFilter : enableColumnHeaderFilter,
				columnHeaderFilterCfg : columnHeaderFilterCfg,
				multiSort : multiSort,
				showSorterToolbar : false, //showSorterToolbar,
				enableRowEditing : enableRowEditing,
				enableCellEditing : enableCellEditing,
				escapeHtml : escapeHtml,
				enableQueryParam : enableQueryParam,
				showFilterInfo : showFilterInfo,
				enableColumnAutoWidth : enableColumnAutoWidth,
				enableColumnDrag : enableColumnDrag,
				enableColumnHeaderMenu : enableColumnHeaderMenu,
				nestedGridConfigs :	{
					enableGridNesting : enableGridNesting,
					isInnerGrid : false,
					innerGridConfig : innerGridConfig
				},
				headerDockedItems : ctGroupActions ? [ctGroupActions] : [],
				// In GroupView this smartgrid config should always be false
				cfgShowFilter : false,
				//In GroupView this smartgrid config should always be false
				cfgShowRibbon : false,
				// In GroupView this smartgrid config should always be false
				cfgShowFilterInfo : false,
				// In GroupView this smartgrid config should always be empty
				cfgFilterModel : {},
				// In GroupView this smartgrid config should always be false
				cfgShowAdvancedFilterLink : false,
				cfgCaptureColumnSettingAt : me.cfgCaptureColumnSettingAt,
				cfgSorterLimit : cfgSorterLimit,
				handleRowIconClick : function(grid, rowIndex, columnIndex, btn,
						event, record) {
					me.fireEvent('gridRowActionClick', grid, rowIndex,
							columnIndex, btn.itemId, record, event);
				},
				handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
						menu, event, record) {
					var data = null;
					if (!Ext.isEmpty(menu.dataParams))
						data = menu.dataParams;
					if (!Ext.isEmpty(data))
						me.fireEvent('gridRowActionClick', data.view,
								data.rowIndex, data.columnIndex, menu.itemId,
								data.record, event);
				},
				doBeforeRecordEdit : me.doBeforeRecordEdit,
				doRecordEdit : me.doRecordEdit,
				doValidateRecordEdit : me.doValidateRecordEdit,
				doCancelRecordEdit : me.doCancelRecordEdit,
				doRecordEditPrevious : me.doRecordEditPrevious,
				listeners : {
					'render' : function(objGrid) {
						me.toggleLoadingIndicator(true);
						me.fireEvent('gridRender', me.getGroupInfo(), me
										.getSubGroupInfo(), objGrid,
								objGrid.store.dataUrl, objGrid.pageSize, 1, 1,
								objGrid.store.sorters, null);
					},
					'gridPageChange' : function(objGrid, strDataUrl, intPgSize,
							intNewPgNo, intOldPgNo, jsonSorter, filterData) {
						me.toggleLoadingIndicator(true);
						me.fireEvent('gridPageChange', me.getGroupInfo(), me
										.getSubGroupInfo(), objGrid,
								strDataUrl, intPgSize, intNewPgNo, intOldPgNo,
								jsonSorter, filterData);
					},
					'gridPageSizeChange' : function(objGrid, strDataUrl,
							intPgSize, intNewPgNo, intOldPgNo, jsonSorter,
							intOldPgSize, filterData) {
						me.toggleLoadingIndicator(true);
						me.fireEvent('gridPageSizeChange', me.getGroupInfo(),
								me.getSubGroupInfo(), objGrid, strDataUrl,
								intPgSize, intNewPgNo, intOldPgNo, jsonSorter,
								filterData, intOldPgSize);
					},
					'gridSortChange' : function(objGrid, strDataUrl, intPgSize,
							intNewPgNo, intOldPgNo, jsonSorter, filterData) {
						me.toggleLoadingIndicator(true);
						me.fireEvent('gridSortChange', me.getGroupInfo(), me
										.getSubGroupInfo(), objGrid,
								strDataUrl, intPgSize, intNewPgNo, intOldPgNo,
								jsonSorter, filterData);
					},
					'gridColumnFilterChange' : function(objGrid, strDataUrl,
							intPgSize, intNewPgNo, intOldPgNo, jsonSorter,
							filterData) {
						me.toggleLoadingIndicator(true);
						me.fireEvent('gridColumnFilterChange', me
										.getGroupInfo(), me.getSubGroupInfo(),
								objGrid, strDataUrl, intPgSize, intNewPgNo,
								intOldPgNo, jsonSorter, filterData);
					},
					'gridRowSelectionChange' : function(objGrid, objRecord,
							intRecordIndex, arrSelectedRecords, jsonData) {
						me.fireEvent('gridRowSelectionChange', me
										.getGroupInfo(), me.getSubGroupInfo(),
								objGrid, objRecord, intRecordIndex,
								arrSelectedRecords, jsonData);
					},
					'gridStoreLoad' : function(grid, store) {
						me.fireEvent('gridStoreLoad', grid, store);
						me.toggleLoadingIndicator(false);
					},
					'statechange' : function(grid) {
						me.fireEvent('gridStateChange', grid);
					},
					'beforeRecordEdit' : function(record, editor, grid, context) {
						me.fireEvent('beforeRecordEdit', record, editor, grid,
								context);
					},
					'recordEdit' : function(record, editor, grid, context) {
						me.fireEvent('recordEdit', record, editor, grid,
								context);
					},
					'validateRecordEdit' : function(record, editor, grid,
							context) {
						me.fireEvent('validateRecordEdit', record, editor,
								grid, context);
					},
					'beforeRecordEdit' : function(record, editor, grid, context) {
						me.fireEvent('beforeRecordEdit', record, editor, grid,
								context);
					},
					'gridLoadDataFails' : function(grid) {
						me.toggleLoadingIndicator(false);
					},
					'toggleGridPager' : function(grid, pager, blnShowPager) {
						me.fireEvent('toggleGridPager', grid, pager,
								blnShowPager);
					},
					'gridSettingClick' : function(){
						me.fireEvent('gridSettingClick');
					}
				}
			});
		}
		if (!Ext.isEmpty(objSmartGrid)) {
			/*
			 * objSmartGrid.addDocked({ xtype : 'container', layout : 'hbox',
			 * flex : 1, items : arrTBarItem }, 0);
			 */
			if (!Ext.isEmpty(intMaxHeight)) {
				objSmartGrid.maxHeight = intMaxHeight;
			}
			gridContainer.add(objSmartGrid);
		}
		me.refreshPageSizeInfo();
		gridContainer.doComponentLayout();
	},
	getMappedHeight : function(strKey) {
		var mapHeight = {
			'S' : 350,
			'M' : 610,
			'L' : 920
		};
		return mapHeight[strKey];
	},
	createGroupByActionContainer : function(gridModel) {
		var me = this;
		var arrTBarItem = [], actionToolBar = null, ct = null, arrActionBarItems = [];
		var grdModel = (gridModel || {});
		
		actionToolBar = me.createActionBar(grdModel);
		if (actionToolBar) {
			arrActionBarItems.push(actionToolBar);
		}
		ct = Ext.create('Ext.container.Container', {
					xtype : 'container',
					layout : 'hbox',
					flex : 1,
					items : arrActionBarItems
				});

		return ct;
	},
	toggleLoadingIndicator : function(blnShowLoading) {
		var me = this;
		if (me.cfgParentCt)
			me.cfgParentCt.setLoading(blnShowLoading);
		/*
		 * else me.setLoading(blnShowLoading);
		 */
	},
	/**
	 * The function columnRenderer is an 'interceptor' method which can be used
	 * to transform data (value, appearance, etc.) before it is rendered.
	 * Example:
	 * 
	 * @example
	 * function(value, meta, record, rowIndex, colIndex,
	 *		store, view, colId) {
	 *			return value;
	 *	}
	 * 
	 * @param {Object}
	 *            renderer.value The data value for the current cell
	 * @param {Object}
	 *            renderer.metaData A collection of metadata about the current
	 *            cell; can be used or modified by the renderer. Recognized
	 *            properties are: tdCls, tdAttr, and style.
	 * @param {Ext.data.Model}
	 *            renderer.record The record for the current row
	 * @param {Number}
	 *            renderer.rowIndex The index of the current row
	 * @param {Number}
	 *            renderer.colIndex The index of the current column
	 * @param {Ext.data.Store}
	 *            renderer.store The data store
	 * @param {Ext.view.View}
	 *            renderer.view The current view
	 * @param {String}
	 *            renderer.colId The current column itemId e.f col_amount
	 * 
	 * @return {String} renderer.return The HTML string to be rendered.
	 */
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		// meta.tdAttr = 'data-qtip="' + value + '"';
		return value;
	},
	summaryRenderer : function(value, summaryData, dataIndex, rowIndex,
			colIndex, store, view, colId) {
		return '';
	},
	/**
	 * The function isRowIconVisible is an 'interceptor' method which can be
	 * used to transform data (value, appearance, etc.) before it is rendered.
	 * Example:
	 * 
	 * @example
	 * function(value, meta, record, rowIndex, colIndex,
	 *		store, view, colId) {
	 *			return value;
	 *	}
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
	 *            maskPosition The position of the icon action in bit mask
	 * @return{Boolean} Returns true/false
	 */
	isRowIconVisible : function(store, record, jsonData, iconName, maskPosition) {
		return true;
	},
	/**
	 * The function createActionBar creates the Action Toolbar using config
	 * cfgGridModel.groupActionModel
	 */
	createActionBar : function(gridModel) {
		var me = this;
		var button = null;
		var arrActions = new Array();
		gridModel = (gridModel || {});
		var cfgModel = me.cfgGridModel;
		var model = (gridModel.groupActionModel || cfgModel.groupActionModel || null);
		var actionBar = null;
		var objCfg, btnCfg = {}, itemId = '', actionName = '', fnClickHandler = null, maskPosition = '', disabled = true, isGroupAction = true;
		if (!Ext.isEmpty(model) && Ext.isArray(model)) {
			for (var i = 0; i < model.length; i++) {
				objCfg = model[i];
				btnCfg = {};
				itemId = 'btn' + objCfg.actionName;
				maskPosition = !Ext.isEmpty(objCfg.maskPosition)
						? objCfg.maskPosition
						: '';
				fnClickHandler = objCfg.fnClickHandler;
				disabled = !Ext.isEmpty(objCfg.disabled)
						? objCfg.disabled
						: true;
				isGroupAction = !Ext.isEmpty(objCfg.isGroupAction)
						? objCfg.isGroupAction
						: true;

				btnCfg.disabled = disabled;
				btnCfg.isGroupAction = true;
				btnCfg.maskPosition = maskPosition;
				btnCfg.cls = 'action-button' + ' btn' + objCfg.actionName;
				btnCfg.text = (objCfg.itemText || '');
				btnCfg.iconCls = (objCfg.itemCls || '');
				btnCfg.itemId = (itemId || '');
				btnCfg.actionName = (objCfg.actionName || '');
				btnCfg.tooltip = (objCfg.toolTip || '');

				if (!Ext.isEmpty(fnClickHandler)
						&& typeof fnClickHandler == 'function') {
					btnCfg.handler = Ext.Function.bind(fnClickHandler, me,
							[btnCfg.actionName], true);
				} else
					btnCfg.handler = Ext.Function.bind(me.handleGroupAction,
							me, [btnCfg.actionName], true);

				if (!Ext.isEmpty(isGroupAction))
					btnCfg.isGroupAction = isGroupAction;

				button = Ext.create('Ext.button.Button', btnCfg);
				arrActions.push(button);
			}
			if (arrActions.length > 0) {
				actionBar = Ext.create('Ext.ux.gcp.SmartGridActionBar', {
					itemId : 'groupActionToolBar',
					flex : 0.8,
					// componentCls : 'xn-custom xn-btn-default-toolbar-small',
					componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
					items : arrActions,
					enableOverflow : true
				});
			}
		}

		return actionBar;
	},
	/**
	 * Helper function for called on click of action bar's action button. This
	 * is default hanlder if fnClickHandler is not avilable for that action
	 * 
	 * @param {Ext.button.Button}
	 *            btn The button object
	 * @param {Object/String}
	 *            eOpts Optional
	 * @param {String}
	 *            actionName The name of the clicked button
	 * @throws {Event}
	 *             groupActionClick The group action click event
	 */
	handleGroupAction : function(btn, eOpts, actionName) {
		var me = this;
		var grid = me.down('smartgrid');
		var arrSelectedRecords = (grid.getSelectedRecords() || []);
		me.fireEvent('groupActionClick', actionName, btn.isGroupAction,
				btn.maskPosition, grid, arrSelectedRecords);
	},
	/**
	 * Handles enable/disable of the actions in action toolbar
	 * 
	 * @param {String}
	 *            actionMask used to enable/disable the action bar's actions
	 * 
	 * @example
	 * Action Bar Actions :  [Submit,Discard,Auth,Reject,Send] and respective maskPosition 1,2,3,4,5
	 * actionMask : 00101
	 * Enabled Actions : Auth and Send
	 * Disabled Actions : Submit,Discard,Reject
	 * 
	 */
	handleGroupActionsVisibility : function(actionMask) {
		var me = this;
		var actionBar = me.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items)
				&& !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition) - 1;
						if (!Ext.isEmpty(strBitMapKey)) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	/**
	 * Handles hide/show of the "Group By" list, "Group By" label,"Group Tabs"
	 * and "Grid"
	 * 
	 * @param {Boolean}
	 *            isHidden flag used to hide/show
	 */
	refreshData : function() {
		var me = this;
		var grid = me.down('grid[xtype="smartgrid"]');
		if (!Ext.isEmpty(grid)) {
			grid.refreshData();
		}
	},
	
	/**
	 * Handle hide/show of the "Group By" list, "Group By" label,"Group Tabs"
	 * and "Grid"
	 * 
	 * @param {Boolean}
	 *            isHidden flag used to hide/show
	 */
	toggleView : function(isHidden) {
		var me = this;
		var gridContainer = me.down('container[itemId="gridContainer"]');
		var tabPanel = me.down('tabpanel[itemId="summaryTabPanel"]');
		var filterButton = me.down('button[itemId="filterButton"]');
		var groupByButton = me.down('button[itemId="groupByButton"]');
		var groupedByLabel = me.down('label[itemId="groupedByLabel"]');
		var navigationContainer = me
				.down('container[itemId="navigationContainer"]');
		var groupedByBtnLabel = me.down('label[itemId="groupedByButtonLabel"]');
		var gridSettingButton = me.down('smartGridSettingButton');

		if (gridContainer)
			gridContainer.setVisible(!isHidden);
		if (tabPanel)
			tabPanel.setVisible(!isHidden);

		if (filterButton) {
			filterButton.setVisible(!isHidden);
			if (filterButton.filterVisible) {
				filterButton.panel.hide();
				filterButton.removeCls('filter-icon-hover');
			}
		}

		if (groupByButton && me.isGroupDetailsVisibile
				&& !me.cfgGroupingDisabled)
			groupByButton.setVisible(!isHidden);
		if (groupedByLabel && me.isGroupDetailsVisibile
				&& !me.cfgGroupingDisabled)
			groupedByLabel.setVisible(!isHidden);
		if (groupedByBtnLabel && me.isGroupDetailsVisibile
				&& !me.cfgGroupingDisabled)
			groupedByBtnLabel.setVisible(!isHidden);
		if (gridSettingButton && me.cfgSmartGridSetting != false)
			gridSettingButton.setVisible(!isHidden);
		if (navigationContainer) {
			if (isHidden)
				navigationContainer.removeCls('smallborder_b');
			else
				navigationContainer.addCls('smallborder_b');
		}
	},
	/**
	 * Returns the Sub Group Info.
	 * 
	 * @return {JSON} JSON of Sub Group Info.
	 * 
	 * The "Sub Group Info" json structure is mentioned below
	 * @example {
	 * 			"groupCode" : "05", 
	 * 			"groupDescription" : "ACH", 
	 * 			"groupId" : "productCategory", 
	 * 			"groupQuery" : "instType eq 05", 
	 * 			"columns" : [] 
	 * 		}
	 * }
	 */
	getSubGroupInfo : function() {
		var me = this;
		var objSubGroupInfo = {};
		var objTabPanel = me.down('tabpanel[itemId="summaryTabPanel"]');
		var objTab = null;
		if (objTabPanel) {
			objTab = objTabPanel.getActiveTab();
			objSubGroupInfo = objTab.subGroupInfo ? objTab.subGroupInfo : {};
		}
		return objSubGroupInfo;
	},
	/**
	 * Returns the Group Info.
	 * 
	 * @return {JSON} JSON of Group Info.
	 * 
	 * The "Group Info" json structure is mentioned below
	 * @example {
	 * 		"groupTypeDesc" : "ProductCategories", 
	 * 		"columns" : [], 
	 * 		"groups" : [{
	 * 			"groupCode" : "05", 
	 * 			"groupDescription" : "ACH", 
	 * 			"groupId" : "productCategory", 
	 * 			"groupQuery" : "instType eq 05", 
	 * 			"columns" : [] 
	 * 		}] 
	 * }
	 * 
	 */
	getGroupInfo : function() {
		var me = this;
		var objMenu = me.down('menu[itemId="groupByButtonMenu"]');
		var objGroupInfo = {};
		var objMenuItem = null;
		var groupedByLabel = null;

		groupedByLabel = me.down('label[itemId="groupedByLabel"]');
		if (objMenu && groupedByLabel) {
			var strSelecter = Ext.String.format('menuitem[text="{0}"]',
					groupedByLabel.text);
			objMenuItem = objMenu.child(strSelecter);
			objGroupInfo = (objMenuItem && objMenuItem.groupInfo)
					? objMenuItem.groupInfo
					: {};
		}
		return objGroupInfo;
	},
	/**
	 * Returns the Group Info.
	 * 
	 * @return {Ext.grid.Panel} Grid Instance.
	 * 
	 */
	getGrid : function() {
		var me = this;
		return me.down('smartgrid');
	},
	/**
	 * Sets the active tab using strGroupCode
	 * 
	 * @param {String}
	 *            strGroupCode The sub group code
	 * 
	 */
	setActiveTab : function(strGroupCode) {
		var me = this;
		var tabPanel = me.down('tabpanel[itemId="summaryTabPanel"]');
		var intCnt = 0, intActiveTab = 0, intOldActiveTab = 0, activeTab = null;
		if (tabPanel) {
			activeTab = tabPanel.getActiveTab();
			intOldActiveTab = tabPanel.items.findIndex('id', activeTab.id);

			Ext.each(tabPanel.items.items, function(tab) {
						if (tab.subGroupInfo
								&& tab.subGroupInfo.groupCode === strGroupCode)
							intActiveTab = intCnt;
						intCnt++;
					});
			if (intOldActiveTab !== intActiveTab)
				tabPanel.setActiveTab(intActiveTab);
			else
				me.refreshData();
		}

	},
	/**
	 * Returns the Group View State.
	 * 
	 * @return {JSON} JSON object
	 * 
	 * @example {
	 *  	groupCode : '',
	 *  	subGroupCode : '',
	 *  	grid : {
	 *  		columns : [
	 *  			{
	 *					colId : 'effectiveDate',
	 *					colHeader : 'Effective Date',
	 *					hidden : false,
	 *					colType : 'string',
	 *					width : 'auto',
	 *					allowSubTotal : 'N',
	 *					metaInfo : {}
	 *				}
	 *  		],
	 *  		pageSize : 20,
	 *  		width : 'auto',
	 *  		height : 500
	 *  	}
	 *  }
	 * 
	 */
	getGroupViewState : function() {
		var me = this;
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, objState = {}, objFilterPref = null, btnSetting = null;
		var groupInfo = null, subGroupInfo = null, intPageSize, intWidth = '', intHeight = '';
		grid = me.getGrid();
		groupInfo = me.getGroupInfo() || '{}';
		subGroupInfo = me.getSubGroupInfo() || {};
		btnSetting = me
				.down('smartGridSettingButton[itemId="gridSettingButton"]');

		objState['groupCode'] = groupInfo.groupTypeCode;
		objState['subGroupCode'] = subGroupInfo.groupCode;
		objState['grid'] = grid.getGridState();
		if (btnSetting)
			objState['gridSetting'] = btnSetting.getGridSettings();
		return objState;
	},
	doValidateRecordEdit : function(record, editor, grid, context) {

	},
	doBeforeRecordEdit : function(record, editor, grid, context) {
		return true;
	},
	doRecordEdit : function(record, editor, grid, context) {

	},
	doRecordEditPrevious : function(prevRecord, currentRecord, editor, grid,
			preContext) {

	},
	doCancelRecordEdit : function(record, editor, grid, context) {

	},
	getActionColumns : function() {
		return [];
	},
	applyPreferedColumnSetting : function(arrColumns, arrPrefferedColumns) {
		var arrRet = [], objPrefferedColumns = {}, objCol = null;
		if (Ext.isEmpty(arrPrefferedColumns))
			return arrColumns;
		Ext.each(arrPrefferedColumns || [], function(col) {
					objPrefferedColumns[col.colId] = col;
				});
		Ext.each(arrColumns || [], function(col) {
					objCol = objPrefferedColumns[col.colId];
					if (objCol) {
						col.colSequence = !Ext.isEmpty(objCol.colSequence)
								? objCol.colSequence
								: col.colSequence;
						col.hidden = !Ext.isEmpty(objCol.hidden)
								? objCol.hidden
								: col.hidden;
						col.hideable = !Ext.isEmpty(objCol.hideable)
								? objCol.hideable
								: col.hideable;
						col.locked = !Ext.isEmpty(objCol.locked)
								? objCol.locked
								: col.locked;
					}
				});
		arrRet = (arrColumns || []).sort(function(valA, valB) {
					return valA.colSequence - valB.colSequence
				});
		return arrRet;
	},
	refreshPageSizeInfo : function() {
		var me = this, strText = null, objBtn = me
				.down('button[itemId="btnRowList"]'), grid = me.getGrid(), intPgSize = grid.store.pageSize;
		if (!Ext.isEmpty(objBtn)) {
			objBtn.setText(Ext.String.format(getLabel('lblPgView', 'View') + ' {0}', intPgSize));
		}
	}

});