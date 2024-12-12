Ext.define(
				'GCP.view.SlabGridSignatoryView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'slabGridSignView',
					id : 'slabGridSignView',
					requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],

					initComponent : function() {
						var me = this;
						this.title = me.title;
						var strUrl = 'services/authMatrix/authMatrixDetailList.json';
						var colModel = me.getColumns();
						signatoryGridView = Ext.create('Ext.ux.gcp.SmartGrid', {
							// pageSize : totalSlabs,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							cls: "t7-grid",
							minHeight : 150,
							height : 200,
							enableColumnAutoWidth : _blnGridAutoColumnWidth,
							showPager : false,
							columnModel : colModel,
							enableColumnHeaderMenu : false,
							isRowIconVisible : me.isRowIconVisible,
							isRowMoreMenuVisible : me.isRowMoreMenuVisible,
							handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
									eventObj, record) {
								var dataParams = menu.dataParams;
								me.handleRowIconClick(
										dataParams.view,
										dataParams.rowIndex,
										dataParams.columnIndex,
										menu, null,
										dataParams.record);																
							},							
							storeModel : {
								fields : [ 'axmFrom', 'axmTo', 'axmRule',
										'identifier', 'viewState', 'axsEnabled'],
								proxyUrl : strUrl,
								rootNode : 'd.details',
								totalRowsNode : 'd.__count'
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
						signatoryGridView
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
													"axmRule" : "-"
												});
											}
										});

						signatoryGridView
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
													showSVMDetailEntryPopup('',
															'', '', '',
															matrixId, 'ADD');
												}
												if (!Ext.isEmpty(className)
														&& className
																.indexOf('editLink') !== -1) {
															
													showSVMDetailEntryPopup(
															record.get('axmFrom'),
															record.get('axmTo'),
															record.get('axsUser'),
															record.get('axmRule'),
															record.get('viewState'),
															'EDIT');
												}
											}
										*/});

						this.items = [ signatoryGridView ];
						this.callParent(arguments);
					},

					getColumns : function() {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						var arrColsPref = [{
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
							"colId" : "axmRule",
							"colDesc" : getLabel('matrixRule', 'Matrix Rule'),
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

								if(cfgCol.colId == "axmRule")
								{									
									cfgCol.width = 500;
								}
								else
								{
									cfgCol.width = 120;
								}
								
								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);

							}
						}
						return arrCols;
					},
					createActionColumn : function()
					{
						var me = this;
						var colItems = [];
						var actionsForTiers = ['Enable', 'Disable'];
						var arrRowActions = [{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel('editToolTip', 'Modify Record'),
							itemLabel : getLabel('editToolTip', 'Modify Record'),
							maskPosition : 1
						}];
						colItems = me.getGroupActionColItems(actionsForTiers);
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
									items :	colItems							
								};
						objActionCol.items = arrRowActions.concat(objActionCol.items || []);						
						return objActionCol;
					},					

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {						
						var strRetValue = "";
						var strTitleRetValue = "";
						if (colId == 'col_status') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('axmRule'))
										&& record.get('axmRule') == '-') {
									strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
									strTitleRetValue = getLabel('Incomplete', 'Incomplete');
								} else 
								{
									if(record.get('axsEnabled') === 'N')
									{
										strRetValue =  getLabel('Suspended', 'Suspended');
										strTitleRetValue =getLabel('Suspended', 'Suspended');
									}	
									else
									{
										strRetValue =  getLabel('OK', 'OK');
										strTitleRetValue =getLabel('OK', 'OK');
									}
									
								}
							} else {
								strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
								strTitleRetValue = getLabel('Incomplete', 'Incomplete');
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
						} else if (colId == 'col_axmRule') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('axmRule'))) {
									var rule = record.get('axmRule');
									var splitRule = rule.split(",");
									strRetValue = ShowRuleDesc(splitRule);
									strTitleRetValue = strRetValue;
								}
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
						else {
							strRetValue = value;
							strTitleRetValue = strRetValue;
						}
						meta.tdAttr = 'title="' + strTitleRetValue + '"';
						return strRetValue;
					},
					getGroupActionColItems : function(availableActions) {
						var itemsArray = [];
						if (!Ext.isEmpty(availableActions)) {
							for (var count = 0; count < availableActions.length; count++) {
								switch (availableActions[count]) {									
									case 'Enable' :
										itemsArray.push({
											text : getLabel('userMstActionEnable', 'Enable'),
											itemId : 'enable',
											actionName : 'enable',
											maskPosition : 2											
											});
										break;
									case 'Disable' :
										itemsArray.push({
											text : getLabel('userMstActionDisable', 'Suspend'),
											itemId : 'disable',
											actionName : 'disable',
											maskPosition : 3												
											});
										break;
								}

							}
						}
						return itemsArray;
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
							var me = this;
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
						if (!Ext.isEmpty(record.get('axmFrom')) && record.get('axmFrom') == '-' )
						{
							showSVMDetailEntryPopup('',
									'', '', '',
									matrixId, 'ADD');
						}
						else
						{
							showSVMDetailEntryPopup(
									record.get('axmFrom'),
									record.get('axmTo'),
									record.get('axsUser'),
									record.get('axmRule'),
									record.get('viewState'),
									'EDIT');
						}
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
					},
					isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
					{						
						var retValue = false;				
						var axsEnabledVal = '';
											
						if (!record.get('isEmpty') && !Ext.isEmpty(record.raw.axsEnabled)) 
						{
							axsEnabledVal = record.raw.axsEnabled;							
						}	
						if( ( maskPosition === 2 && !Ext.isEmpty(axsEnabledVal) && axsEnabledVal === 'N' ) || ((maskPosition === 3 || maskPosition === 1 ) && !Ext.isEmpty(axsEnabledVal) && axsEnabledVal === 'Y'))
						{
							retValue = true; 
						}
						if(maskPosition === 1 && Ext.isEmpty(axsEnabledVal))
						{	
							retValue = true;
						}	
						return retValue;
					},

					isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
					{
						var me = this;
						if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
							return false;
						var arrMenuItems = null;
						var isMenuVisible = false;
						var blnRetValue = true;
						if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
							arrMenuItems = menu.items.items;

						if( !Ext.isEmpty( arrMenuItems ) )
						{
							for( var a = 0 ; a < arrMenuItems.length ; a++ )
							{
								blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
									arrMenuItems[ a ].maskPosition );
								isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
							}
						}
						return isMenuVisible;
					},
					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						var me = this;
						var actionName = btn.itemId;
						if( actionName === 'disable' || actionName === 'enable')
						{
							me.handleGroupActions( btn, record );
						}						
						else if( actionName === 'btnEdit' )
						{
							if (!Ext.isEmpty(record.get('axmFrom')) && record.get('axmFrom') == '-' )
							{
								showSVMDetailEntryPopup('',
										'', '', '',
										matrixId, 'ADD');
							}
							else
							{
								showSVMDetailEntryPopup(
										record.get('axmFrom'),
										record.get('axmTo'),
										record.get('axsUser'),
										record.get('axmRule'),
										record.get('viewState'),
										'EDIT');
							}
						}
					},
					handleGroupActions : function( btn, record )
					{						
						var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
						var axsEnablevalue = 'Y';
						if(strAction === "disable")
							 axsEnablevalue = 'N';
						
						var strUrl = Ext.String.format( 'services/authMatrix/authMatrixDetailList/{0}.srvc?', strAction );
						strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;	
						
						this.preHandleGroupActions( strUrl, axsEnablevalue, record );
						
					},
					preHandleGroupActions : function( strUrl, axsEnablevalue, record )
					{
						var me = this;
						var records = [];
						
						if( !Ext.isEmpty( signatoryGridView ) )
						{
							records = [record];
							for( var index = 0 ; index < records.length ; index++ )
							{
								var dtlRecord = 
								{
										axmFrom : me.handleFormattedAmount(records[ index ].data.axmFrom),
										axmTo : me.handleFormattedAmount(records[ index ].data.axmTo),
										axmRule : records[ index ].data.axmRule,
										axsEnabled : axsEnablevalue
								}	
								var jsonData =
								{
									identifier : records[ index ].data.viewState,
									userMessage : dtlRecord
								};
							}
							

							Ext.Ajax.request(
							{
								url : strUrl,
								contentType : "application/json",
								method : 'POST',
								jsonData : jsonData,
								success : function( response )
								{
									var jsonRes = Ext.JSON.decode( response.responseText );
									var errors = '';
									for( var i in jsonRes )
									{
										if( jsonRes[ i ].errors )
										{
											for (var j=0;j<jsonRes[ i ].errors.length; j++)
											{
												errors += jsonRes[ i ].errors[ j ].errorMessage + "<br\>";
											}
										}
									}
									if( errors != '' )
									{
										Ext.MessageBox.show(
										{
											title : getLabel( 'lblerror', 'Error' ),
											msg : errors,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										} );
									}
									//me.enableDisableGroupActions( '00000000000', true );
									signatoryGridView.refreshData();
								},
								failure : function()
								{
									var errMsg = "";
									Ext.MessageBox.show(
									{
										title : getLabel( 'lblerror', 'Error' ),
										msg : getLabel( 'lblerrordata', 'Error while fetching data..!' ),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									} );
								}
							} );
						}
					},
					handleFormattedAmount : function(strAmt)
					{	
						var strAmtValue = strAmt;
						if (!Ext.isEmpty(strAmt))
						{
							var obj = $('<input type="text">');
							obj.autoNumeric('init');
							obj.val(strAmt);
							strAmtValue = obj.autoNumeric('get');
							obj.remove();
						}
						return strAmtValue;
					}
					
				});
