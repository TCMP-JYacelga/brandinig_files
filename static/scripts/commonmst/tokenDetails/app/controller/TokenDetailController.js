Ext
		.define(
				'GCP.controller.TokenDetailController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.TokenDetailView',
							'GCP.view.TokenDetailGridView',
							'GCP.view.HistoryPopup'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'scmProductView',
								selector : 'tokenDetailView'
							},
							{
								ref : 'filterView',
								selector : 'tokenDetailView tokenDetailFilterView'
							},							
							{
								ref : 'createNewToolBar',
								selector : 'tokenDetailView tokenDetailGridView toolbar[itemId="btnCreateNewToolBar"]'
							},
							{
								ref : 'specificFilterPanel',
								selector : 'tokenDetailView tokenDetailFilterView panel[itemId="specificFilter"]'
							},
							{
								ref : 'sellerPanel',
								selector : 'tokenDetailView tokenDetailFilterView panel[itemId="specificFilter"] panel[itemId="sellerPanel"]'
							},
							{
								ref : 'benePanel',
								selector : 'tokenDetailView tokenDetailFilterView panel[itemId="benePanel"]'
							},
							{
								ref : 'scmProductGridView',
								selector : 'tokenDetailView tokenDetailGridView'
							},
							{
								ref : 'clientSetupDtlView',
								selector : 'tokenDetailView tokenDetailGridView panel[itemId="clientSetupDtlView"]'
							},
							{
								ref : 'gridHeader',
								selector : 'tokenDetailView tokenDetailGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
							},
							{
								ref : 'scmProductGrid',
								selector : 'tokenDetailView tokenDetailGridView grid[itemId="gridViewMstId"]'
							},
							{
								ref : 'searchTextInput',
								selector : 'tokenDetailGridView textfield[itemId="searchTextField"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'tokenDetailGridView radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'grid',
								selector : 'tokenDetailGridView smartgrid'
							},
							{
								ref : "tokenStatusFilter",
								selector : 'tokenDetailView tokenDetailFilterView combo[itemId="tokenStatus"]'
							},
							{
							ref : "userIdFilter",
								selector : 'tokenDetailView tokenDetailFilterView textfield[itemId="userId"]'
							},							
							{
								ref : 'groupActionBar',
								selector : 'tokenDetailView tokenDetailGridView tokenDetailActionBarView'
							},
							{
								ref : 'clientListLink',
								selector : 'tokenDetailView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
							},{
								ref : 'btnSavePreferences',
								selector : 'tokenDetailView tokenDetailFilterView button[itemId="btnSavePreferences"]'
							}, {
								ref : 'btnClearPreferences',
								selector : 'tokenDetailView tokenDetailFilterView button[itemId="btnClearPreferences"]'
							} ],
					config : {
						selectedMst : 'client',
						clientListCount : 0,
						brandingPkgListCount : 0,
						tokenTypeFilterDesc : null,
						statusFilterVal : null,
						strCommonPrefUrl : 'services/userpreferences/tokenDetails.json',
						filterData : [],
						arrSorter : [],
						pgSize : null
					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;
						me
								.control({
									'tokenDetailView' : {
										'render' : function(panel) {
											if (!Ext.isEmpty(objTokenDetailsPref)
													|| !Ext.isEmpty(objTokenDetailsPref)) {
												me.toggleSavePrefrenceAction(false);
												me.toggleClearPrefrenceAction(true);
											}
										}
									},									
									'tokenDetailView tokenDetailGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateToken"]' : {
										click : function() {
											me
													.handleCreateTokenDetailAction(true);
										}
									},
									'tokenDetailView tokenDetailFilterView' : {
										render : function() {
											me.setInfoTooltip();
											me.handleSpecificFilter();
										}
									},
									'tokenDetailView tokenDetailFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);											
										}
									},									
									'tokenDetailView tokenDetailGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();

										}
									},
									'tokenDetailView tokenDetailFilterView button[itemId="btnSavePreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleSavePrefrenceAction(false);
											me.handleSavePreferences();
											me.toggleClearPrefrenceAction(true);
										}
									},
									'tokenDetailView tokenDetailFilterView button[itemId="btnClearPreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleClearPrefrenceAction(false);
											me.handleClearPreferences();
											me.toggleSavePrefrenceAction(false);
										}
									},									
									'tokenDetailView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
										click : function() {
											me.filterData = [];
											me.handleSpecificFilter();
											me.handleGridHeader();
										}
									},

									'tokenDetailGridView' : {
										render : function(panel) {
											me.handleSmartGridConfig();
											me.setFilterRetainedValues();
										}
									},
									'tokenDetailGridView textfield[itemId="searchTextField"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'tokenDetailGridView radiogroup[itemId="matchCriteria"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'tokenDetailGridView smartgrid' : {
										render : function(grid) {
											me.handleLoadGridData(grid,
													grid.store.dataUrl,
													grid.pageSize, 1, 1, null);
										},
										gridPageChange : me.handleLoadGridData,
										gridSortChange : me.handleLoadGridData,
										gridRowSelectionChange : function(grid,
												record, recordIndex, records,
												jsonData) {
											me.enableValidActionsForGrid(grid,
													record, recordIndex,
													records, jsonData);
										},
										'statechange' : function(grid) {
											me.toggleSavePrefrenceAction(true);
										}										
									},
									'tokenDetailGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									},
									'tokenDetailView tokenDetailFilterView combobox[itemId="sellerFltId"]' : {
										select : function(btn, opts) {
											me.resetAllFilters();
										},
										change : function(combo, newValue,
												oldValue, eOpts) {
											me.getClientFilter().cfgExtraParams = [ {
												key : '$sellerCode',
												value : newValue
											} ];
										}
									},
									'tokenDetailFilterView' : {
										handleTypeClick : function(btn, eopts) {
											me.handleTokenType(btn);
										},
										userStatusChange : function(btn, eopts) {
											me.handleUserStatusChange();
										}
									}
								});
					},						
					
					setFilterRetainedValues : function() {
						var me = this;
						var filterView = me.getSpecificFilterPanel();
						me.setFilterPreferences();
					},
					setFilterPreferences : function()
					{
						var me = this;
						var toolbar = me.getSellerPanel().down('toolbar[itemId=paymentTypeToolBar]')
						if( objTokenDetailsPref != null )
						{
							var data = Ext.decode( objTokenDetailsPref );
							if( data && data.d && data.d.preferences && data.d.preferences.tokenDetailsFilterPref )
							{
								me.getTokenStatusFilter().setValue(data.d.preferences.tokenDetailsFilterPref.tokenStatus);
								me.getUserIdFilter().setValue(data.d.preferences.tokenDetailsFilterPref.userId);
								if(toolbar)
								{
									var tokenType = data.d.preferences.tokenDetailsFilterPref.tokenType;
									var button;
									if( tokenType == 'All' || Ext.isEmpty(tokenType) )
										button = toolbar.down('button[btnId=allTokens]');
									if( tokenType == 'S' )
										button = toolbar.down('button[btnId=softTokens]');
									if( tokenType == 'H' )
										button = toolbar.down('button[btnId=hardTokens]');
									if (toolbar)
									{
										toolbar.items.each(function(item) {
													item.removeCls('xn-custom-heighlight');
										});
									}
									button.addCls('xn-custom-heighlight');
									me.tokenTypeFilterDesc = tokenType;
								}
							}
							if( data && data.d && data.d.preferences && data.d.preferences.panels && data.d.preferences.panels.filterPanel )
							{
								me.getFilterView().collapsed = true;
							}
						}
					},
					handleSpecificFilter : function() {
						var me = this;

						var clientTextfield = Ext
								.create(
										'Ext.ux.gcp.AutoCompleter',
										{
											padding : '1 0 0 0',
											fieldCls : 'xn-form-text xn-suggestion-box',
											width : 165,
											name : 'userDesc',
											itemId : 'userId',
											cfgUrl : 'cpon/{0}.json',
											cfgProxyMethodType : 'POST',
											cfgQueryParamName : 'userIdFilter',
											cfgRecordCount : -1,
											cfgSeekId : 'userIdSeek',
											cfgDataNode1 : 'CODE',
											cfgKeyNode : 'CODE'
										});
						var benePanel = me.getBenePanel();

						if (!Ext.isEmpty(benePanel)) {
							benePanel.removeAll();
						}
						benePanel.add({
							xtype : 'label',
							text : getLabel('userId', 'User Id'),
							cls : 'frmLabel',
							padding : '4 0 0 6'
						}, clientTextfield);

					},
					resetAllFilters : function() {
						var me = this;
						if (!Ext.isEmpty(me.getClientFilter())) {
							me.getClientFilter().setValue('');
						}
						return;
					},
					handleGridHeader : function() {
						var me = this;
						var gridHeaderPanel = me.getGridHeader();
					},

					handleLoadGridData : function(grid, url, pgSize, newPgNo,
							oldPgNo, sorter) {
						var me = this;
						me.setDataForFilter();
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						strUrl = strUrl + me.getFilterUrl();
						grid.loadGridData(strUrl, null);
					},

					getFilterUrl : function() {
						var me = this;
						var strQuickFilterUrl = '';
						strQuickFilterUrl = me
								.generateUrlWithFilterParams(this);
						return strQuickFilterUrl;
					},

					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '&$filter=';
						var strTemp = '';
						var strFilterParam = '';
						for ( var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\''
										+ ' and ' + '\''
										+ filterData[index].paramValue2 + '\'';
								break;
							case 'in':
								var arrId = filterData[index].paramValue1;
								if (0 != arrId.length) {
									strTemp = strTemp + '(';
									for ( var count = 0; count < arrId.length; count++) {
										strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ' + '\'' + arrId[count]
												+ '\'';
										if (count != arrId.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;
							default:
								// Default opertator is eq
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\'';
								break;
							}
							isFilterApplied = true;
						}
						if (isFilterApplied)
							strFilter = strFilter + strTemp;
						else
							strFilter = '';
						return strFilter;
					},

					applyFilter : function() {
						var me = this;
						var grid = me.getGrid();
						if (!Ext.isEmpty(grid)) {
							var strDataUrl = grid.store.dataUrl;
							var store = grid.store;
							var strUrl = grid.generateUrl(strDataUrl,
									grid.pageSize, 1, 1, store.sorters);
							strUrl = strUrl + me.getFilterUrl();
							me.getGrid().setLoading(true);
							grid.loadGridData(strUrl,
									me.handleAfterGridDataLoad, null);
						}
					},
					handleSmartGridConfig : function() {
						var me = this;
						var objPref = null,arrColsPref = null, pgSize = null;
						var bankReportGrid = me.getScmProductGrid();
						var objConfigMap = me.getScmProductGridConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(bankReportGrid))
							bankReportGrid.destroy(true);
						if( null != objTokenDetailsPref )
						{
							var data = Ext.decode( objTokenDetailsPref );
							if( data && data.d && data.d.preferences && data.d.preferences.gridView)
							{
								objPref = data.d.preferences.gridView;
								arrColsPref = objPref.gridCols;
								arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
								me.pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : parseInt(_GridSizeTxn,10);
								me.arrSorter = data.d.preferences.gridView.sortState;
								me.handleSmartGridLoading(arrCols,objConfigMap.storeModel);
							}
							else
							{
								arrCols = me.getColumns(objConfigMap.arrColsPref,
										objConfigMap.objWidthMap);
								me.handleSmartGridLoading(arrCols,
										objConfigMap.storeModel);
							}
						}
						else
						{
							arrCols = me.getColumns(objConfigMap.arrColsPref,
									objConfigMap.objWidthMap);
							me.handleSmartGridLoading(arrCols,
									objConfigMap.storeModel);
						}
					},

					handleSmartGridLoading : function(arrCols, storeModel) {
						var me = this;
						var pgSize = null;
						pgSize = 10;
						
						scmProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : me.pgSize || pgSize,
							stateful : false,
							showEmptyRow : false,
							padding : '5 10 10 10',
							rowList : _AvailableGridSize,
							minHeight : 0,
							columnModel : arrCols,
							storeModel : storeModel,
							isRowIconVisible : me.isRowIconVisible,
							// isRowMoreMenuVisible : me.isRowMoreMenuVisible,
							handleRowMoreMenuClick : me.handleRowMoreMenuClick,

							handleRowIconClick : function(tableView, rowIndex,
									columnIndex, btn, event, record) {
								me.handleRowIconClick(tableView, rowIndex,
										columnIndex, btn, event, record);
							},

							handleMoreMenuItemClick : function(grid, rowIndex,
									cellIndex, menu, event, record) {
								var dataParams = menu.dataParams;
								me.handleRowIconClick(dataParams.view,
										dataParams.rowIndex,
										dataParams.columnIndex, menu, null,
										dataParams.record);
							}
						});

						var clntSetupDtlView = me.getClientSetupDtlView();
						clntSetupDtlView.add(scmProductGrid);
						clntSetupDtlView.doLayout();
					},

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'reset')
							me.handleGroupActions(btn, record);
					},
					submitExtForm : function(strUrl, record, rowIndex) {
						var me = this;
						var viewState = record.data.identifier;
						var updateIndex = rowIndex;
						var form, inputField;

						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'txtRecordIndex', rowIndex));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'viewState', viewState));

						form.action = strUrl;
						me.setFilterParameters(form);
						document.body.appendChild(form);
						form.submit();
					},

					showHistory : function(product, url, id) {
						Ext.create('GCP.view.HistoryPopup', {
							productName : product,
							historyUrl : url,
							identifier : id
						}).show();
					},

					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						var maskSize = 1;
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
						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask))
							buttonMask = jsonData.d.__buttonMask;
						maskArray.push(buttonMask);
						maskArray.push(rightsMap);
						actionMask = doAndOperation(maskArray, maskSize);
						if (Ext.isEmpty(bitPosition))
							return retValue;
						retValue = isActionEnabled(actionMask, bitPosition);
						if ((maskPosition === 1 && retValue)) {
							retValue = retValue;
						} 
						return retValue;
					},

					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						arrCols.push(me.createGroupActionColumn());
						// arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc || objCol.colHeader;
								cfgCol.colId = objCol.colId;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = !Ext.isEmpty(objCol.width)
								? objCol.width
								: objWidthMap[objCol.colId];
								cfgCol.fnColumnRenderer = me.columnRenderer;
								cfgCol.hidden = objCol.hidden;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},

					handleRowMoreMenuClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var menu = btn.menu;
						var arrMenuItems = null;
						var blnRetValue = true;
						var store = tableView.store;
						var jsonData = store.proxy.reader.jsonData;

						btn.menu.dataParams = {
							'record' : record,
							'rowIndex' : rowIndex,
							'columnIndex' : columnIndex,
							'view' : tableView
						};
						if (!Ext.isEmpty(menu.items)
								&& !Ext.isEmpty(menu.items.items))
							arrMenuItems = menu.items.items;
						if (!Ext.isEmpty(arrMenuItems)) {
							for ( var a = 0; a < arrMenuItems.length; a++) {
								blnRetValue = me.isRowIconVisible(store,
										record, jsonData, null,
										arrMenuItems[a].maskPosition);
								arrMenuItems[a].setVisible(blnRetValue);
							}
						}
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},

					createGroupActionColumn : function() {
						var me = this;
						var objActionCol = {
							colType : 'actioncontent',
							colId : 'groupaction',
							width : 120,
							locked : true,
							items : [{
										text : getLabel('prfMstActionReset',
												'Reset'),
										itemId : 'reset',
										actionName : 'reset',
										maskPosition : 1
									}]
						};
						return objActionCol;
					},

					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData) {
						var me = this;
						var buttonMask = '0';
						var maskArray = new Array(), actionMask = '', objData = null;
						
						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
							buttonMask = jsonData.d.__buttonMask;
							
						}
						
						for (var index = 0; index < selectedRecords.length; index++) {
							objData = selectedRecords[index];
								maskArray.push(objData.get('__metadata').__rightsMap);
			
							}
						
						maskArray.push(buttonMask);
					
						actionMask = doAndOperation(maskArray, 2);
						me.enableDisableGroupActions(actionMask);
					},

					enableDisableGroupActions : function(actionMask) {
						var actionBar = this.getGroupActionBar();
						var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
						if (!Ext.isEmpty(actionBar)
								&& !Ext.isEmpty(actionBar.items.items)) {
							arrItems = actionBar.items.items;
							Ext
									.each(
											arrItems,
											function(item) {
												strBitMapKey = parseInt(item.maskPosition,10) - 1;
												if (strBitMapKey>=0) {
													blnEnabled = isActionEnabled(
															actionMask,
															strBitMapKey);
													if ((item.maskPosition === 1 && blnEnabled)) {
														blnEnabled = blnEnabled;
													} 
													item.setDisabled(!blnEnabled);
												}
											});
						}
					},

					handleGroupActions : function(btn, record) {
						var me = this;
						var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName
								: btn.itemId;
						var strUrl = Ext.String.format(
								'cpon/tokenDetails/{0}.srvc?', strAction);
							this.preHandleGroupActions(strUrl, '', record);
					},

					preHandleGroupActions : function(strUrl, remark, record) {
						var me = this;
						var grid = this.getGrid();
						if (!Ext.isEmpty(grid)) {
							var arrayJson = new Array();
							var records = grid.getSelectedRecords();
							records = (!Ext.isEmpty(records) && Ext
									.isEmpty(record)) ? records : [ record ];
							for ( var index = 0; index < records.length; index++) {
								arrayJson
										.push({
											serialNo : grid.getStore().indexOf(
													records[index]) + 1,
											identifier : records[index].data.identifier,
											userMessage : remark
										});
							}
							if (arrayJson)
								arrayJson = arrayJson
										.sort(function(valA, valB) {
											return valA.serialNo
													- valB.serialNo
										});

							Ext.Ajax
									.request({
										url : strUrl + csrfTokenName + "=" + csrfTokenValue,
										method : 'POST',
										jsonData : Ext.encode(arrayJson),
										success : function(response) {
											// TODO : Action Result handling to
											// be done here
											me.enableDisableGroupActions(
													'0', true);
											grid.refreshData();
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox
													.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
						}

					},

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";
						if (colId = 'fileFormat') {
							if (!record.get('isEmpty')) {
								if (!Ext.isEmpty(record.get('fileFormat'))
										&& 'A' == value) {
									strRetValue = getLabel('assci', 'ASCII');
								} else if (!Ext.isEmpty(record
										.get('fileFormat'))
										&& 'B' == value) {
									strRetValue = getLabel('binary', 'Binary');
								} else if (!Ext.isEmpty(record
										.get('fileFormat'))
										&& 'N' == value) {
									strRetValue = getLabel('asciilinefeed',
											'ASCII No Line Feed');
								} else {
									strRetValue = value;
								}
							}

						}
						return strRetValue;
					},

					getScmProductGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						if( null != objTokenDetailsPref )
						{
							var data = Ext.decode( objTokenDetailsPref );
							if( data && data.d && data.d.preferences && data.d.preferences.gridView)
							{
								objPref = data.d.preferences.gridView;
								me.arrSorter = data.d.preferences.gridView.sortState;
							}
						}
						objWidthMap = {
						/*
						 * "bankReportCode" : 150, "bankReportDesc" : 200,
						 * "serialNumber":130, "requestStateDesc":100
						 */
						};

						arrColsPref = [ {
							"colId" : "batchNumber",
							"colDesc" : getLabel('batchNo','Batch No.')
						}, {
							"colId" : "algorithmType",
							"colDesc" : getLabel('algoType','Algorithm Type')
						}, {
							"colId" : "serialNumber",
							"colDesc" : getLabel('serNo','Serial No.')
						},{
							"colId" : "tokenTypeDesc",
							"colDesc" :  getLabel('lblTokenType','Token Type'),
							"hidden" : true
						}, {
							"colId" : "fileName",
							"colDesc" :  getLabel('lblgridFileName','File Name'),
							"hidden" : true
						},{
							"colId" : "fileFormatType",
							"colDesc" :  getLabel('lblgridFileFormatType','File Format Type'),
							"hidden" : true
						},{
							"colId" : "createDate",
							"colDesc" : getLabel('createDate','Create Date')
						}, {
							"colId" : "userCode",
							"colDesc" :  getLabel('userId','User Id')
						}, {
							"colId" : "userTokenAssignmentDate",
							"colDesc" : getLabel('assignDate','Assigned Date')
						}, {
							"colId" : "tokenStatusDesc",
							"colDesc" : getLabel('tokenstatus','Status')
						} ];

						storeModel = {
							fields : [ 'identifier', 'profileId', 'batchNumber','fileName','fileFormatType',
									'serialNumber', 'algorithmType','tokenTypeDesc',
									'distributionMethod', 'createDate',
									'beneName', 'primaryKey', 'userCode',
									'tokenStatusDesc', 'parentRecordKey',
									'version', 'recordKeyNo',
									'userTokenAssignmentDate', '__metadata' ],
							proxyUrl : 'cpon/tokenDetails.json',
						 rootNode : 'd.profile',
						 sortState:me.arrSorter,
						 totalRowsNode : 'd.__count'
						};

						objConfigMap = {
							"objWidthMap" : objWidthMap,
							"arrColsPref" : arrColsPref,
							"storeModel" : storeModel
						};
						return objConfigMap;
					},
					/**
					 * Finds all strings that matches the searched value in each
					 * grid cells.
					 * 
					 * @private
					 */
					searchOnPage : function() {
						var me = this;
						var searchValue = me.getSearchTextInput().value;
						var anyMatch = me.getMatchCriteria().getValue();
						if ('anyMatch' === anyMatch.searchOnPage) {
							anyMatch = false;
						} else {
							anyMatch = true;
						}

						var grid = me.getGrid();
						grid.view.refresh();

						// detects html tag
						var tagsRe = /<[^>]*>/gm;
						// DEL ASCII code
						var tagsProtect = '\x0f';
						// detects regexp reserved word
						var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

						if (searchValue !== null) {
							searchRegExp = new RegExp(searchValue, 'g'
									+ (anyMatch ? '' : 'i'));

							if (!Ext.isEmpty(grid)) {
								var store = grid.store;

								store
										.each(
												function(record, idx) {
													var td = Ext
															.fly(
																	grid.view
																			.getNode(idx))
															.down('td'), cell, matches, cellHTML;
													while (td) {
														cell = td
																.down('.x-grid-cell-inner');
														matches = cell.dom.innerHTML
																.match(tagsRe);
														cellHTML = cell.dom.innerHTML
																.replace(
																		tagsRe,
																		tagsProtect);

														if (cellHTML === '&nbsp;') {
															td = td.next();
														} else {
															// populate indexes
															// array, set
															// currentIndex, and
															// replace
															// wrap matched
															// string in a span
															cellHTML = cellHTML
																	.replace(
																			searchRegExp,
																			function(
																					m) {
																				return '<span class="xn-livesearch-match">'
																						+ m
																						+ '</span>';
																			});
															// restore protected
															// tags
															Ext
																	.each(
																			matches,
																			function(
																					match) {
																				cellHTML = cellHTML
																						.replace(
																								tagsProtect,
																								match);
																			});
															// update cell html
															cell.dom.innerHTML = cellHTML;
															td = td.next();
														}
													}
												}, me);
							}
						}
					},
					setDataForFilter : function() {
						var me = this;
							me.filterData = me.getQuickFilterQueryJson();
					},
					getQuickFilterQueryJson : function() {
						var me = this;
						var tokenTypeFilterVal = me.tokenTypeFilterDesc;
						var statusFilterVal = me.getTokenStatusFilter().getValue();
						var userIDFilter = me.getUserIdFilter().getValue();
						var jsonArray = [];
						if (tokenTypeFilterVal != null && tokenTypeFilterVal != 'All' && tokenTypeFilterVal != getLabel('all','All')) {
							jsonArray.push({
										paramName : 'tokenType',
										paramValue1 : encodeURIComponent(tokenTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
						if (statusFilterVal != null && statusFilterVal != 'All' && statusFilterVal != getLabel('all','All')) {
							jsonArray.push({
										paramName : 'tokenStatus',
										paramValue1 : statusFilterVal,
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
						if (userIDFilter != null && userIDFilter != '') {
							jsonArray.push({
										paramName : 'tokenUserId',
										paramValue1 : encodeURIComponent(userIDFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}						
						return jsonArray;
					},					
					handleCreateTokenDetailAction : function(entryType) {
						var me = this;
						var form;
						/*
						 * var sellerCombo = me.getCorporationFilter();
						 * if(sellerCombo){ var selectedSeller =
						 * sellerCombo.getValue(); }
						 */
						var strUrl = 'addTokenDetails.form';
						var errorMsg = null;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'sellerId', ''));

						form.action = strUrl;
						me.setFilterParameters(form);
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},

					/* Function sets the filter Panel element values in JSON */
					setFilterParameters : function(form) {
						var me = this;
						var selectedSeller = null, beneName = null, statusVal = null;
						var arrJsn = {};
						var specificFilterView = me.getSpecificFilterPanel();
						var sellerCombo = specificFilterView
								.down('combobox[itemId=sellerFltId]');
						if (!Ext.isEmpty(me.getClientFilter())
								&& !Ext
										.isEmpty(me.getClientFilter()
												.getValue())) {
							beneName = me.getClientFilter().getValue();
						}
						if (sellerCombo) {
							selectedSeller = sellerCombo.getValue();
						}
						if (!Ext.isEmpty(me.getStatusFilter())
								&& !Ext
										.isEmpty(me.getStatusFilter()
												.getValue())
								&& "All" != me.getStatusFilter().getValue()) {
							statusVal = me.getStatusFilter().getValue();
						}
						arrJsn['sellerId'] = selectedSeller;
						arrJsn['beneName'] = beneName;
						arrJsn['status'] = statusVal;
						arrJsn['statusDesc'] = me.getStatusFilter()
								.getRawValue();

						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'filterData', Ext.encode(arrJsn)));
					},				
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},
					handleTokenType : function(btn) {
						var me = this;
						var grid = this.getScmProductGrid();
						me.tokenTypeFilterDesc = btn.btnDesc;
						me.setDataForFilter();
						grid.refreshData();
					},
					handleUserStatusChange : function(btn, e) {
						var me = this;
						var grid = this.getScmProductGrid();
						me.statusFilterVal =btn.btnValue;
						me.setDataForFilter();
						grid.refreshData();
					},
					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext
								.create(
										'Ext.tip.ToolTip',
										{
											target : 'imgFilterInfo',
											listeners : {
												// Change content dynamically
												// depending on which element
												// triggered the show.
												beforeshow : function(tip) {
													var strUserId = '';
													var strTokenType = getLabel(
															'none', 'None');
													var status = '';
													
													var fileFilterView = me
															.getSpecificFilterPanel();
													if(me.tokenTypeFilterDesc==null)
													{
														strTokenType = getLabel('tokenall', 'All');
													}
													else
													{
														if(me.tokenTypeFilterDesc=='H')
															var strTokenType = getLabel('importHardToken', 'Soft');
														else
															var strTokenType = getLabel('importSoftToken', 'Soft');
													}
													var objUserId = me.getUserIdFilter();
													if (!Ext.isEmpty(me.getTokenStatusFilter())
															&& !Ext.isEmpty(me.getTokenStatusFilter().getValue())) {
														var combo = me.getTokenStatusFilter();
														status = combo.getRawValue();
													} else {
														status = getLabel('tokenall', 'All');
													}

													if (!Ext
															.isEmpty(objUserId)
															&& !Ext
																	.isEmpty(objUserId
																			.getValue())) {
														strUserId = objUserId
																.getRawValue();
													} else {
														strUserId = getLabel(
																'none', 'None');
													}
													tip
															.update(getLabel('lblTokenType', 'Token Type')
																	+ ' : '
																	+ strTokenType
																	+ '<br/>'
																	+getLabel('tokenstatus', 'Status')
																	+ ' : '
																	+ status
																	+ '<br/>'
																	+ getLabel('userId', 'User Id')
																	+ ' : '
																	+ strUserId);

												}
											}
										});
					},
					
					/*----------------------------Preferences Handling Starts----------------------------*/
					toggleSavePrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnSavePreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},
					toggleClearPrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnClearPreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},					
					handleSavePreferences : function() {
						var me = this;
						me.doSavePreferences();
					},
					handleClearPreferences : function() {
						var me = this;
						me.doClearPreferences();
					},
					doSavePreferences : function() {
						var me = this;
						var strUrl = me.strCommonPrefUrl;
						var arrPref = me.getPreferencesToSave(false);
						if (arrPref) {
							Ext.Ajax.request({
										url : strUrl,
										method : 'POST',
										jsonData : Ext.encode(arrPref),
										success : function(response) {
											var responseData = Ext
													.decode(response.responseText);
											var isSuccess;
											var title, strMsg, imgIcon;
											if (responseData.d.preferences
													&& responseData.d.preferences.success)
												isSuccess = responseData.d.preferences.success;
											if (isSuccess && isSuccess === 'N') {
												if (!Ext.isEmpty(me.getBtnSavePreferences()))
													me.toggleSavePrefrenceAction(true);
												title = getLabel('SaveFilterPopupTitle',
														'Message');
												strMsg = responseData.d.preferences.error.errorMessage;
												imgIcon = Ext.MessageBox.ERROR;
												Ext.MessageBox.show({
															title : title,
															msg : strMsg,
															width : 200,
															buttons : Ext.MessageBox.OK,
															cls : 'ux_popup',
															icon : imgIcon
														});

											} else {
												me.toggleClearPrefrenceAction(true);
												Ext.MessageBox.show({
															title : title,
															msg : getLabel('prefSavedMsg',
																	'Preferences Saved Successfully'),
															buttons : Ext.MessageBox.OK,
															cls : 'ux_popup',
															icon : Ext.MessageBox.INFO
														});
											}

										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														cls : 'ux_popup',
														icon : Ext.MessageBox.ERROR
													});
										}
									});
						}
					},
					doClearPreferences : function() {
						var me = this;
						me.toggleSavePrefrenceAction(false);
						var me = this;
						var strUrl = me.strCommonPrefUrl + "?$clear=true";
						var arrPref = me.getPreferencesToSave(false);
						if (arrPref) {
							Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrPref),
								success : function(response) {
									var responseData = Ext.decode(response.responseText);
									var isSuccess;
									var title, strMsg, imgIcon;
									if (responseData.d.preferences
											&& responseData.d.preferences.success)
										isSuccess = responseData.d.preferences.success;
									if (isSuccess && isSuccess === 'N') {
										title = getLabel('SaveFilterPopupTitle', 'Message');
										strMsg = responseData.d.preferences.error.errorMessage;
										imgIcon = Ext.MessageBox.ERROR;
										Ext.MessageBox.show({
													title : title,
													msg : strMsg,
													width : 200,
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : imgIcon
												});

									} else {
										me.toggleSavePrefrenceAction(true);
										Ext.MessageBox.show({
													title : title,
													msg : getLabel('prefClearedMsg',
															'Preferences Cleared Successfully'),
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.INFO
												});
										me.resetAllFilter();
										me.setDataForFilter();
										me.applyFilter();
									}

								},
								failure : function() {
									var errMsg = "";
									Ext.MessageBox.show({
												title : getLabel('instrumentErrorPopUpTitle',
														'Error'),
												msg : getLabel('instrumentErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
								}
							});
						}

					},
					resetAllFilter : function() {
						var me = this;
						var button;
						
						var toolbar = me.getSellerPanel().down('toolbar[itemId=paymentTypeToolBar]');
						button = toolbar.down('button[btnId=allTokens]');
						if (toolbar)
						{
							toolbar.items.each(function(item) {
										item.removeCls('xn-custom-heighlight');
							});
						}
						button.addCls('xn-custom-heighlight');
						
						me.getTokenStatusFilter().setValue('All');
						me.getUserIdFilter().setValue('');
						
						me.tokenTypeFilterDesc = 'All';
						me.statusFilterVal = 'All';
						
					},
					getPreferencesToSave : function(localSave) {
						var me = this;
						var arrPref = [], objFilterPref = null, grid = null, gridState = null;
						var filterPanelCollapsed = true;
						filterPanelCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
						objFilterPref = me.getFilterPreferences();
						grid = me.getGrid();
						gridState = grid.getGridState();
						arrPref.push({
									"module" : "tokenDetailsFilterPref",
									"jsonPreferences" : objFilterPref
								});
						arrPref.push({
									"module" : "gridView",
									"jsonPreferences" : {
										'gridCols' : gridState.columns,
										'pgSize' : gridState.pageSize,
										'sortState':gridState.sortState
									}
								});		
						arrPref.push({
									"module" : "panels",
									"jsonPreferences" : {
										'filterPanel' : filterPanelCollapsed
									}
								});	
						return arrPref;
					},
					getFilterPreferences : function() {
						var me = this;
						var objFilterPref = {};
						objFilterPref.tokenType = me.tokenTypeFilterDesc;
						objFilterPref.tokenStatus = me.getTokenStatusFilter().getValue();
						objFilterPref.userId = me.getUserIdFilter().getValue();
						return objFilterPref;
					}

					/*----------------------------Preferences Handling Ends----------------------------*/					
					

				});