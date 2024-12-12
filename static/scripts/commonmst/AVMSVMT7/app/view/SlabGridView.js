Ext
		.define(
				'GCP.view.SlabGridView',
				{
					extend : 'Ext.panel.Panel',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

					initComponent : function() {

						var me = this;
						this.title = me.title;
						var strUrl = 'services/authMatrix/slabList.json';
						var colModel = me.getColumns();
						slabGridListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : totalSlabs,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							cls: "t7-grid",
							minHeight : 150,
							height : 200,
							showPager : false,
							columnModel : colModel,
							enableColumnAutoWidth : _blnGridAutoColumnWidth,
							enableColumnHeaderMenu : false,
							handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
									eventObj, record) {
								
								if (record && record.get('axmFrom') == '-' )
								{
									var nextFromAmt = (rowIndex != 0 ? view.store.data.items[rowIndex-1].data.axmTo : 0);
									nextFromAmt = me.processNextFromAmount(nextFromAmt);
									showAVMDetailEntryPopup(nextFromAmt,
				                              '', '', '',
				                              matrixId, 'ADD');
								}
								else  if ( record && !Ext.isEmpty(record.get('axmFrom')) &&  record.get('axmFrom') != '-' )
								{
									showAVMDetailEntryPopup(
											record
													.get('axmFrom'),
											record.get('axmTo'),
											record
													.get('totalLevel'),
											record
													.get('axsSequence'),
											record
													.get('viewState'),
											'EDIT');
								}								
							},
							storeModel : {
								fields : [ 'axmFrom', 'axmTo', 'totalLevel',
										'axsSequence', 'status', 'viewState','axmCcySymbol'],
								proxyUrl : strUrl,
								rootNode : 'd',
								totalRowsNode : totalSlabs
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
						slabGridListView
								.getStore()
								.on(
										'load',
										function(store, records, successful,
												eOpts) {

											var actualCount = store.getCount();
											for ( var i = actualCount; i < totalSlabs; i++) {
												store.insert(i, {
													"axmFrom" : "-",
													"axmTo" : "-",
													"totalLevel" : "-"
												});
											}
										});

						slabGridListView
								.on(
										'cellclick',
										function(view, td, cellIndex, record,
												tr, rowIndex, e, eOpts) {/*
											var linkClicked = (e.target.tagName == 'SPAN');
											if (linkClicked) {
												var className = e.target.className;
												if (!Ext.isEmpty(className)
														&& className
																.indexOf('defineLink') !== -1) {
													var nextFromAmt = (rowIndex != 0 ? view.store.data.items[rowIndex-1].data.axmTo : 0);
													showAVMDetailEntryPopup(nextFromAmt,
								                              '', '', '',
								                              matrixId, 'ADD');
												}
												if (!Ext.isEmpty(className)
														&& className
																.indexOf('editLink') !== -1) {
													showAVMDetailEntryPopup(
															record
																	.get('axmFrom'),
															record.get('axmTo'),
															record
																	.get('totalLevel'),
															record
																	.get('axsSequence'),
															record
																	.get('viewState'),
															'EDIT');
												}
											}
										*/});

						this.items = [ slabGridListView ];
						this.callParent(arguments);
					},

					getColumns : function() {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						var arrColsPref = [
						   {
							"colId" : "axmFrom",
							"colDesc" : getLabel('limitFrom', 'Limit From'),
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
							"colDesc" : getLabel('numOfLevels', 'Number of Levels'),
							"colType" : "number",
							"sortable" : false,
							"menuDisabled": false
						}, {
							"colId" : "status",
							"colDesc" :getLabel('status', 'Status'),
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
										itemId : 'btnEdit',
										itemCls : 'grid-row-action-icon icon-edit',
										toolTip : getLabel('editToolTip', 'Edit Tier'),
										text : getLabel('editToolTip', 'Edit Tier'),
										maskPosition : 1
								 	}
								 ]
							};
						return objActionCol;
					},
				 columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {					 
						var strRetValue = "";
						var strTitleRetValue = "";
						if (colId == 'col_status') {
							if (!record.get('isEmpty')) {
								if (Ext.isEmpty(record.get('status'))
										|| false == record.get('status')) {
									strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
									strTitleRetValue = getLabel('Incomplete', 'Incomplete');
								} else {
									strRetValue = getLabel('OK', 'OK');
									strTitleRetValue = getLabel('OK', 'OK');
								}
							} else {
								strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
								strTitleRetValue = getLabel('Incomplete', 'Incomplete')
							}
						} else if (colId == 'col_actions') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('axmFrom'))
										&& record.get('axmFrom') == '-') {
									strRetValue = '<span tabindex="1" class="grey field-control defineLink cursor_pointer t7-anchor">Define Tier</span>';
									strTitleRetValue = 'Define Tier';
								} else {
									strRetValue = '<span tabindex="1" class="grey field-control editLink cursor_pointer t7-anchor">Edit Tier</span>';
									strTitleRetValue = 'Edit Tier';
								}
							} else {
								strRetValue = '<span tabindex="1" class="grey field-control defineLink cursor_pointer t7-anchor">Define Tier</span>';
								strTitleRetValue = 'Define Tier';
							}
						}else if (colId == 'col_axmFrom' && record.get('axmFrom') != '' && record.get('axmFrom') != '-')
						{
							strRetValue =  $('#axmCcySymbol').val() + ' ' + setDigitAmtGroupFormat(value);
							strTitleRetValue = strRetValue;
						} 
						else if (colId == 'col_axmTo' && record.get('col_axmTo') != '' && record.get('axmFrom') != '-')
						{
							strRetValue =  $('#axmCcySymbol').val() + ' ' + setDigitAmtGroupFormat(value);
							strTitleRetValue = strRetValue;
						}
						
						else {
							strRetValue = value;
							strTitleRetValue = strRetValue;
						}

						meta.tdAttr = 'title="' + strTitleRetValue + '"';
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
						var me = this;
						/*var groupView = me.getGroupView();
						var grid = groupView.getGrid();*/
						if (record && record.get('axmFrom') == '-' )
						{
							var nextFromAmt = (rowIndex != 0 ? view.store.data.items[rowIndex-1].data.axmTo : 0);
							nextFromAmt = me.processNextFromAmount(nextFromAmt);
							showAVMDetailEntryPopup(nextFromAmt,
		                              '', '', '',
		                              matrixId, 'ADD');
						}
						else  if ( record && !Ext.isEmpty(record.get('axmFrom')) &&  record.get('axmFrom') != '-' )
						{
							showAVMDetailEntryPopup(
									record
											.get('axmFrom'),
									record.get('axmTo'),
									record
											.get('totalLevel'),
									record
											.get('axsSequence'),
									record
											.get('viewState'),
									'EDIT');
						}
					},
					enableEntryButtons : function() {
						slabGridLoaded = true;
						disableGridButtons(false);
					},
					processNextFromAmount : function(nextFromAmt) {
						var me = this;
						var decimalString = '';
						// skipt first tier
						if(nextFromAmt != 0)
						{
							decimalString = createDecimalString();
							//converting amount into numeric format with help of autonumeric function.
							// below code first set value to autonumeric field and then get value of it.						
							var amount = $("<input>").attr('type','hidden').autoNumeric("init", { aSep: strGroupSeparator, dGroup: strAmountDigitGroup, aDec: strDecimalSeparator, mDec: strAmountMinFraction })
							.val(nextFromAmt).autoNumeric('get')
							
							// parseFloat() give data upto 12 decimals when we are adding numbers like 30.98 + 0.01 etc
							// to fix these issues we need to use toFixed() function
							nextFromAmt = (parseFloat(amount) + parseFloat(decimalString)).toFixed(strAmountMinFraction);
							
						
							// now next step is to again format the newly sum amount with local specific format
							nextFromAmt = $("<input>").attr('type','hidden').autoNumeric("init",
									{
										aSep: strGroupSeparator,
										dGroup: strAmountDigitGroup,
										aDec: strDecimalSeparator,
										mDec: strAmountMinFraction
									}).autoNumeric('set', nextFromAmt).val();
						}
						
						return nextFromAmt;
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
