Ext
		.define(
				'GCP.view.LotClosureGridView',
				{
					extend : 'Ext.panel.Panel',
					border : false,
					xtype : 'LotClosureGridView',
					requires : [ 'GCP.view.LotClosureActionBarView',
							'Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
							'Ext.panel.Panel', 'Ext.form.Label',
							'Ext.layout.container.VBox',
							'Ext.layout.container.HBox' ],
					autoHeight : true,
					componentCls : 'gradiant_back',
					cls : 'gradiant_back xn-ribbon ux_border-bottom',
					intMaskSize : 5,
					strDefaultMask : '00000',
					initComponent : function() {
						var me = this;
						me.items = [ {
							xtype : 'panel',
							itemId : 'LotClosureGridPanel'
						} ];
						me.on('resize', function() {
							me.doLayout();
						});
						me.callParent(arguments);
					},
					createActionBarViewforGrooup : function() {
						var me = this;
						var arrAvailableActions = null, actionBar = null;
						arrAvailableActions = me.getAvailableGroupActions('G');
						if (!Ext.isEmpty(arrAvailableActions)
								&& arrAvailableActions.length > 0) {
							actionBar = Ext.create(
									'GCP.view.LotClosureActionBarView', {
										itemId : 'groupActionBar',
										height : 21,
										availableActions : arrAvailableActions,
										margin : '1 0 0 0',
										parent : me
									});
							return actionBar.getAvailableActions();
						} else
							return [];
					},

					createActionBarView : function() {
						var me = this;
						var arrAvailableActions = null, actionBar = null;
						arrAvailableActions = me.getAvailableGroupActions('G');
						if (!Ext.isEmpty(arrAvailableActions)
								&& arrAvailableActions.length > 0) {
							actionBar = Ext.create(
									'GCP.view.LotClosureActionBarView', {
										itemId : 'groupActionBar',
										height : 21,
										availableActions : arrAvailableActions,
										margin : '1 0 0 0',
										parent : me
									});
						}
						return actionBar;
					},
					getAvailableGroupActions : function(charActionType) {
						var retValue = null;
						if (charActionType === 'G')
							retValue = mapActions.groupActions;
						else
							retValue = mapActions.rowActions;
						return retValue;
					},
					reconfigureGroup : function() {
						var me = this, group = null, gridConfig = null, arrCols = null, showCheckBoxColumnFlg = true;
						var LotClosureGridPanel = me
								.down('panel[itemId="LotClosureGridPanel"]');
						LotClosureGridPanel.removeAll();

						gridConfig = me.getGridModel();
						arrCols = me.getGroupColumns(gridConfig.arrColsPref);
						showCheckBoxColumnFlg = true;
						group = me.createGroupView(showCheckBoxColumnFlg,
								arrCols, gridConfig.storeModel);
						LotClosureGridPanel.add(group);
					},
					createGroupView : function(showCheckBoxColumnFlg, arrCols,
							storeModel) {
						var me = this;
						var groupView = null;
						var objGroupByPref = {};
						var pgSize = _GridSizeMaster || 10;
						var gridId = "GRD_LOT_CLOSURE";
						var service = "LOTCL";
						groupView = Ext.create('Ext.ux.gcp.GroupView', {
							cfgGroupByUrl : 'services/grouptype/LotClosure/'
									+ service + '.json?$filterGridId=' + gridId
									+ '&$columnModel=true',
							cfgSummaryLabel : "Lot Closure",
							cfgGroupByLabel : 'Grouped By',
							cfgGroupCode : objGroupByPref.groupCode || null,
							cfgSubGroupCode : objGroupByPref.subGroupCode
									|| null,
							getActionColumns : function() {
								if (!Ext.Object.isEmpty(me
										.createGroupActionColumn()))
									return [ me.createGroupActionColumn(),
											me.createActionColumn() ];
								else
									return [ me.createActionColumn() ];
							},
							padding : '12 0 0 0',
							cfgShowFilterInfo : false,
							cfgGridModel : {
								pageSize : pgSize,
								rowList : _AvailableGridSize,
								stateful : false,
								hideRowNumbererColumn : true,
								showCheckBoxColumn : showCheckBoxColumnFlg,
								checkBoxColumnWidth : 36,
								showEmptyRow : false,
								//showPager : true,
								showPagerRefreshLink : false,
								minHeight : 100,
								enableColumnHeaderFilter : true,
								enableColumnDrag : true,
								columnHeaderFilterCfg : {},
								storeModel : storeModel,
								defaultColumnModel : arrCols,
								fnColumnRenderer : me.columnRenderer,
								groupActionModel : me.createActionBarViewforGrooup(),
								fnRowIconVisibilityHandler : function(store,
										record, jsonData, itmId, maskPosition) {
									return me.isRowIconVisible(store, record,
											jsonData, itmId, maskPosition)
								},
								handleRowIconClick : function(tableview,
										rowIndex, columnIndex, btn, event,
										record) {
									grid.fireEvent('handleRowIconClick', grid,
											rowIndex, columnIndex, btn.itemId,
											event, record);
								},
								handleMoreMenuItemClick : function(objGrid,
										rowIndex, cellIndex, menu, event,
										record) {
									var data = null;
									if (!Ext.isEmpty(menu.dataParams))
										data = menu.dataParams;
									if (!Ext.isEmpty(data))
										grid.fireEvent('handleRowIconClick',
												data.view, data.rowIndex,
												data.columnIndex, menu.itemId,
												event, record);
								}
							}
						});
						return groupView
					},

					setGridTitle : function() {
						var me = this, strTitle = null;
						strTitle = "Lot Closure";
						if (!Ext.isEmpty(me) && !Ext.isEmpty(strTitle))
							me.setTitle(strTitle);
					},
					reconfigureBatchGrid : function() {
						var me = this, grid = null, gridConfig = null, arrCols = null, actionBar = null, showCheckBoxColumnFlg = true;
						var LotClosureGridPanel = me
								.down('panel[itemId="LotClosureGridPanel"]');
						LotClosureGridPanel.removeAll();

						me.setGridTitle();
						gridConfig = me.getGridModel();
						arrCols = me.getColumns(gridConfig.arrColsPref);
						showCheckBoxColumnFlg = true;
						grid = me.createGrid(showCheckBoxColumnFlg, arrCols,
								gridConfig.storeModel);

						actionBar = me.createActionBarView();
						if (!Ext.isEmpty(actionBar)) {
							actionBar.parent = grid;
							grid.addDocked({
								xtype : 'panel',
								layout : 'hbox',
								items : [
										{
											xtype : 'label',
											text : getLabel('actions',
													'Actions')
													+ ':',
											cls : 'font_bold ux-ActionLabel',
											padding : '5 0 0 3'
										}, actionBar ]
							}, 0);
						}
						LotClosureGridPanel.add(grid);
					},
					createGrid : function(showCheckBoxColumnFlg, arrCols,
							storeModel) {
						var me = this;
						var pgSize = _GridSizeMaster || 10;
						var grid = Ext.create('Ext.ux.gcp.SmartGrid', {
							itemId : 'LotClosureGrid',
							cls : 'ux_panel-transparent-background',
							pageSize : pgSize,
							stateful : false,
							hideRowNumbererColumn : true,
							showCheckBoxColumn : showCheckBoxColumnFlg,
							showEmptyRow : false,
							padding : '0 10 10 10',
							rowList : _AvailableGridSize,
							minHeight : 80,
							columnModel : arrCols,
							storeModel : storeModel,
							isRowIconVisible : function(store, record,
									jsonData, itmId, maskPosition) {
								return me.isRowIconVisible(store, record,
										jsonData, itmId, maskPosition)
							},
							handleRowIconClick : function(tableview, rowIndex,
									columnIndex, btn, event, record) {
								grid.fireEvent('handleRowIconClick', grid,
										rowIndex, columnIndex, btn.itemId,
										event, record);
							},
							handleMoreMenuItemClick : function(objGrid,
									rowIndex, cellIndex, menu, event, record) {
								var data = null;
								if (!Ext.isEmpty(menu.dataParams))
									data = menu.dataParams;
								if (!Ext.isEmpty(data))
									grid.fireEvent('handleRowIconClick',
											data.view, data.rowIndex,
											data.columnIndex, menu.itemId,
											event, record);
							}
						});
						return grid;
					},
					getGroupColumns : function(arrColsPref) {
						var me = this;
						var arrCols = new Array(), cfgCol = null;
						if (!Ext.isEmpty(arrColsPref)) {
							for (var i = 0; i < arrColsPref.length; i++) {
								cfgCol = me.cloneObject(arrColsPref[i]);
								if (cfgCol.isTypeCode)
									cfgCol.metaInfo = {
										isTypeCode : cfgCol.isTypeCode
									};
								cfgCol.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									return me.columnRenderer(value, meta,
											record, rowIndex, colIndex, store,
											view, colId);
								}
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},
					getColumns : function(arrColsPref) {
						var me = this;
						var arrCols = new Array(), cfgCol = null, objCol1 = null, objCol2 = null;
						objCol1 = me.createGroupActionColumn();
						if (!Ext.isEmpty(objCol1))
							arrCols.push(objCol1);
						objCol2 = me.createActionColumn();
						if (!Ext.isEmpty(objCol2))
							arrCols.push(objCol2);
						if (!Ext.isEmpty(arrColsPref)) {
							for (var i = 0; i < arrColsPref.length; i++) {
								cfgCol = me.cloneObject(arrColsPref[i]);
								if (cfgCol.isTypeCode)
									cfgCol.metaInfo = {
										isTypeCode : cfgCol.isTypeCode
									};
								cfgCol.fnColumnRenderer = function(value, meta,
										record, rowIndex, colIndex, store,
										view, colId) {
									return me.columnRenderer(value, meta,
											record, rowIndex, colIndex, store,
											view, colId);
								}
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},
					createActionColumn : function() {
						var arrTemp = null, arrActions = null, objActionCol = null, columnWidth = 80;
						arrTemp = mapRowActions;
						if (!Ext.isEmpty(arrTemp) && arrTemp.length > 0) {
							arrActions = new Array();
							for (var i = 0; i < arrTemp.length; i++) {
								if (mapRowActionModel[arrTemp[i]])
									arrActions
											.push(mapRowActionModel[arrTemp[i]]);
							}
							objActionCol = {
								colType : 'actioncontent',
								colId : 'action',
								width : columnWidth,
								align : 'right',
								locked : true,
								sortable : false,
								hideable : false,
								resizable : false,
								draggable : false,
								items : arrActions,
								visibleRowActionCount : 1
							};
						}
						return objActionCol;
					},
					createGroupActionColumn : function() {
						var me = this, arrActions = null, cfgAction = null, objActionCol = {};
						var arrGroupAction = me.getAvailableGroupActions('R');
						if (!Ext.isEmpty(arrGroupAction)
								&& arrGroupAction.length > 0) {
							arrActions = new Array();
							for (var i = 0; i < arrGroupAction.length; i++) {
								cfgAction = mapLotClosureActionModel[arrGroupAction[i]];

								if (cfgAction) {
									cfgAction = me.cloneObject(cfgAction);
									arrActions.push(cfgAction);
								}
							}
							objActionCol = {
								colType : 'actioncontent',
								colId : 'groupaction',
								width : 120,
								align : 'right',
								locked : true,
								sortable : false,
								hideable : false,
								resizable : false,
								draggable : false,
								items : arrActions,
								visibleRowActionCount : 2
							};
						}
						return objActionCol;
					},
					getGridModel : function() {
						var objConfigMap = null;
						var arrColsPref = null;
						if (!Ext.isEmpty(LotClosurePref))
							arrColsPref = LotClosurePref;
						else
							arrColsPref = LotClosureGridColumn || [];
						objConfigMap = {
							"arrColsPref" : arrColsPref,
							"storeModel" : gridStoreModel
						};
						return objConfigMap;
					},
					cloneObject : function(obj) {
						return JSON.parse(JSON.stringify(obj));
					},
					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";
						
							strRetValue = value;
						
						return strRetValue;
					},
					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						var me = this;
						var maskArray = new Array();
						var actionMask = '';
						var rightsMap = record.data.__metadata.__rightsMap;
						var buttonMask = me.strDefaultMask;
						var retValue = true;
						var bitPosition = '';
						var isSameUser = true;
                        if (record.raw.makerId === USER) {
                            isSameUser = false;
                        }
						if (!Ext.isEmpty(maskPosition)) {
							bitPosition = parseInt(maskPosition,10) - 1;
							maskSize = me.intMaskSize;

							if (!Ext.isEmpty(jsonData)
									&& !Ext.isEmpty(jsonData.d.__buttonMask))
								buttonMask = jsonData.d.__buttonMask;
							maskArray.push(buttonMask);
							maskArray.push(rightsMap);
							actionMask = doAndOperation(maskArray, maskSize);
							if (Ext.isEmpty(bitPosition))
								return retValue;
							retValue = isActionEnabled(actionMask, bitPosition);
							if ((maskPosition === 4 && retValue)) {
                                retValue = retValue && isSameUser;
                            }
                            else if (maskPosition === 5 && retValue) {
                                    retValue = retValue && isSameUser;
                            }
						}
						return retValue;
					},
					refreshData : function() {
						var me = this, grid = me
								.down('smartgrid[itemId="LotClosureGrid"]');
						if (grid)
							grid.refreshData();
					},
					refreshGroupView : function() {
						var me = this, group = me.down('groupView');
						if (group)
							group.refreshData();
					},
					enableDisableGroupActions : function(actionMask) {
						var me = this;
						var actionBar = me
								.down('toolbar[itemId="groupActionBar"]')
						var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
						if (!Ext.isEmpty(actionBar)
								&& !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext.each(arrItems, function(item) {
								strBitMapKey = parseInt(item.maskPosition,10) - 1;
								if (!Ext.isEmpty(strBitMapKey)) {
									blnEnabled = isActionEnabled(actionMask,
											strBitMapKey);
									item.setDisabled(!blnEnabled);
								}
							});
						}
					},
					getGrid : function() {
						var me = this;
						return me.down('smartgrid');
					}
				});