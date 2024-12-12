Ext
		.define(
				'GCP.view.SlabGridReadOnlyView',
				{
					extend : 'Ext.panel.Panel',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

					initComponent : function() {
						var me = this;
						this.title = me.title;
						var strUrl = 'services/authMatrix/slabList.json';
						var colModel = me.getColumns();
						adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							padding : '12 0 0 0',
							cls:'t7-grid',
							minHeight : 150,
							height : 200,
							showPager : false,
							columnModel : colModel,
							enableColumnAutoWidth : _blnGridAutoColumnWidth,
							enableColumnHeaderMenu : false,
							handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
									eventObj, record) {
								
								if ( menu.itemId =='btnView' ) {
									showAVMDetailViewPopup(
											record
													.get('axmFrom'),
											record.get('axmTo'),
											record
													.get('totalLevel'),
											record
													.get('viewState'),
											'EDIT');
								}
							},
							storeModel : {
								fields : [ 'axmFrom', 'axmTo', 'totalLevel','status'  ],
								proxyUrl : strUrl,
								rootNode : 'd'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}

						});

						adminListView
								.on(
										'cellclick',
										function(view, td, cellIndex, record,
												tr, rowIndex, e, eOpts) {/*
											var linkClicked = (e.target.tagName == 'SPAN');
											if (linkClicked) {
												var className = e.target.className;
												if (!Ext.isEmpty(className)
														&& className
																.indexOf('viewLink') !== -1) {
													showAVMDetailViewPopup(
															record
																	.get('axmFrom'),
															record.get('axmTo'),
															record
																	.get('totalLevel'),
															record
																	.get('viewState'),
															'EDIT');
												}
											}
										*/});

						this.items = [ adminListView ];
						this.callParent(arguments);
					},

					getColumns : function() {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						var arrColsPref = [ 
						{
							"colId" : "axmFrom",
							"colDesc" :  getLabel('limitFrom', 'Limit From'),
							"colType" : "number",
							"sortable" : false,
							"menuDisabled": false
						}, {
							"colId" : "axmTo",
							"colDesc" : getLabel('limitTo', 'Limit To'),
							"colType" : "number",
							"sortable" : false,
							"menuDisabled": false
						}, {
							"colId" : "totalLevel",
							"colDesc" : getLabel('numOfLevel', 'Number of Level'),
							"colType" : "number",
							"sortable" : false,
							"menuDisabled": false
						}, {
							"colId" : "status",
							"colDesc" : getLabel('status', 'Status'),
							"sortable" : false,
							"menuDisabled": false
						} ];
						arrCols.push(me.createActionColumn())						
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								cfgCol.sortable = objCol.sortable;
								cfgCol.menuDisabled = objCol.menuDisabled;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = 120;
								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);

							}
						}
						return arrCols;
					},
					createActionColumn : function()
					{
						var me = this;
							var objActionCol =
							{
								colType : 'actioncontent',
								colId : 'actioncontent',
								colHeader : getLabel('action', 'Actions'),
								visibleRowActionCount : 1,
								width : 108,
								locked : true,
								lockable : false,
								sortable : false,
								hideable : false,
								resizable : false,
								draggable : false,
								items :
								[
								 	{
										itemId : 'btnView',
										itemCls : 'grid-row-action-icon icon-view',
										toolTip : getLabel('viewToolTip', 'View Record'),
										text : getLabel('viewToolTip', 'View Record'),
										maskPosition : 1
								 	}
								 ]
							};
						return objActionCol;
					},
					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";
						if (colId == 'col_status') {
							if (!record.get('isEmpty')) {
								if (Ext.isEmpty(record.get('status'))
										|| false == record.get('status')) {
									strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
								} else {
									strRetValue = getLabel('OK', 'OK');
								}
							} else {
								strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
							}
						} else if (colId == 'col_actions') {
							if (!record.get('isEmpty')) {
								strRetValue = '<span class="grey viewLink cursor_pointer t7-anchor">View Tier</span>';
							}
						} 
						else if (colId == 'col_axmFrom' && record.get('axmFrom') != '' && record.get('axmFrom') != '-')
						{
							strRetValue =  $('#axmCcySymbol').val() + ' ' + setDigitAmtGroupFormat(value);
						} 
						else if (colId == 'col_axmTo' && record.get('col_axmTo') != '' && record.get('axmFrom') != '-')
						{
							strRetValue =  $('#axmCcySymbol').val() + ' ' + setDigitAmtGroupFormat(value);
						}
						else 
						{
							strRetValue = value;
						}
						meta.tdAttr = 'title="' + strRetValue + '"';
						return strRetValue;
					},

					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this;
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						strUrl = strUrl + "&$filter="
								+ encodeURIComponent(matrixId);
						grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
						
						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if(Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							me.handleGridRowClick(record, grid, columnType);
						});						
					},
					handleGridRowClick : function(record, grid, columnType) {
						if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
							var me = this;
							var columnModel = null;
							var columnAction = null;
							if (!Ext.isEmpty(grid.columnModel)) {
								columnModel = grid.columnModel;
								for (var index = 0; index < columnModel.length; index++) {
									if (columnModel[index].colId == 'actioncontent') {
										columnAction = columnModel[index].items;
										break;
									}
								}
							}
							var arrVisibleActions = [];
							var arrAvailableActions = [];
							if (!Ext.isEmpty(columnAction))
								arrAvailableActions = columnAction;
							var store = grid.getStore();
							var jsonData = store.proxy.reader.jsonData;
							if (!Ext.isEmpty(arrAvailableActions)) {
								for (var count = 0; count < arrAvailableActions.length; count++) {
									var btnIsEnabled = false;
									if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
										btnIsEnabled = grid.isRowIconVisible(store, record,
												jsonData, arrAvailableActions[count].itemId,
												arrAvailableActions[count].maskPosition);
										if (btnIsEnabled == true) {
											arrVisibleActions.push(arrAvailableActions[count]);
											btnIsEnabled = false;
										}
									}
								}
							}
							if (!Ext.isEmpty(arrVisibleActions)) {
								me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
							}
						} else {
						}
					},
					
					doHandleRowActions : function(actionName, objGrid, record,rowIndex) {					
						showAVMDetailViewPopup(
								record
										.get('axmFrom'),
								record.get('axmTo'),
								record
										.get('totalLevel'),
								record
										.get('viewState'),
								'EDIT');						
					},
					
					enableEntryButtons : function() {
						slabGridLoaded = true;
						disableGridButtons(false);
					},
					
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					}
				});
