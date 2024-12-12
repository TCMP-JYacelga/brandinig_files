Ext
		.define(
				'GCP.controller.UserTokenAssignmentController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.UserTokenAssignmentView','GCP.view.UserTokenAssignmentGridView','GCP.view.UserTokenAssignmentPopup'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'userTokenAssignView',
								selector : 'userTokenAssignmentView'
							},
							{
								ref : 'filterView',
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView'
							},							
							{
								ref : 'specificFilterPanel',
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView panel[itemId="specificFilter"]'
							},
							{
								ref : 'tokenTypePanel',
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView panel[itemId="specificFilter"] panel[itemId="tokenTypePanel"]'
							},
							{
								ref : 'userTokenAssignmentPopup',
								selector : 'userTokenAssignmentPopup'
							},							
							{
								ref : 'clientSetupDtlView',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView panel[itemId="clientSetupDtlView"]'
							},							
							{
								ref : 'userTokenAssignGridView',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView'
							},
							{
								ref : 'userTokenDtlView',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView panel[itemId="userTokenDtlView"]'
							},
							{
								ref : 'errorContainer',
								selector : 'userTokenAssignmentPopup container[itemId="errorContainer"]'
							},
							{
								ref : 'gridHeader',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView panel[itemId="userTokenDtlView"] container[itemId="gridHeader"]'
							},
							{
								ref : 'userTokenGrid',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView grid[itemId="gridViewMstId"]'
							},
							{
								ref : 'grid',
								selector : 'userTokenAssignmentGridView smartgrid'
							},
							{
								ref : "tokenStatusFilter",
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView combo[itemId="tokenStatus"]'
							},
							{
								ref : "userStatusFilter",
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView combo[itemId="userStatus"]'
							},
							{
								ref : "corporationFilter",
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView combo[itemId="corporation"]'
							},
							{
							ref : "userIdFilter",
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView textfield[itemId="userId"]'
							},							
							{
								ref : 'groupActionBar',
								selector : 'userTokenAssignmentView userTokenAssignmentGridView userTokenActionBarView'
							},{
								ref : 'btnSavePreferences',
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView button[itemId="btnSavePreferences"]'
							}, {
								ref : 'btnClearPreferences',
								selector : 'userTokenAssignmentView userTokenAssignmentFilterView button[itemId="btnClearPreferences"]'
							}],
					config : {
						tokenTypeFilterDesc : null,
						statusFilterVal : null,
						strCommonPrefUrl : 'services/userpreferences/userTokenAssignment.json',
						filterData : [],
						strUnAssignedFilterFlag : 'N',
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
									'userTokenAssignmentView' : {
										'render' : function(panel) {
											if (!Ext.isEmpty(objUserTokenAssimentPref)
													|| !Ext.isEmpty(objUserTokenAssimentPref)) {
												me.toggleSavePrefrenceAction(false);
												me.toggleClearPrefrenceAction(true);
											}
										}
									},										
									'userTokenAssignmentView userTokenAssignmentFilterView' : {
										render : function() {
											me.setInfoTooltip();
											me.handleSpecificFilter();
										}
									},
									'userTokenAssignmentView userTokenAssignmentFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);											
										}
									},									
									'userTokenAssignmentView userTokenAssignmentGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();

										}
									},
									'userTokenAssignmentView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
										click : function() {
											me.filterData = [];
											me.handleSpecificFilter();
											me.handleGridHeader();
										}
									},
									'userTokenAssignmentView userTokenAssignmentFilterView button[itemId="btnSavePreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleSavePrefrenceAction(false);
											me.handleSavePreferences();
											me.toggleClearPrefrenceAction(true);
										}
									},
									'userTokenAssignmentView userTokenAssignmentFilterView button[itemId="btnClearPreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleClearPrefrenceAction(false);
											me.handleClearPreferences();
											me.toggleSavePrefrenceAction(false);
										}
									},
									'userTokenAssignmentGridView' : {
										render : function(panel) {
											me.handleSmartGridConfig();
											me.setFilterRetainedValues();
										}
									},
									'userTokenAssignmentGridView textfield[itemId="searchTextField"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'userTokenAssignmentGridView smartgrid' : {
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
									'userTokenAssignmentGridView toolbar[itemId=userTokenGroupActionBarView]' : {
										performGroupAction : function(btn, opts) {
											me.handleGroupActions(btn);
										}
									},
									'userTokenAssignmentFilterView' : {
										handleTypeClick : function(btn, eopts) {
											me.handleTokenType(btn);
										},
										userStatusChange : function(btn, eopts) {
											me.handleUserStatusChange();
										},
										handleCorportationChange : function(btn, eopts) {
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);	
										}
									},																
									'userTokenAssignmentPopup' : {
										assignUserToken : function(btn,userId,userClient,corp,strSecondAuthReq,rbTokenType,strTokenSerial,oldSerialNo,oldRecordKey) {
											me.saveUserTokenAssignment(btn,userId,userClient,corp,strSecondAuthReq,rbTokenType,strTokenSerial,oldSerialNo,oldRecordKey);
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
						var toolbar = me.getTokenTypePanel().down('toolbar[itemId=paymentTypeToolBar]')
						if( objUserTokenAssimentPref != null )
						{
							var data = Ext.decode( objUserTokenAssimentPref );
							if( data && data.d && data.d.preferences && data.d.preferences.userTokenAssignmentFilterPref )
							{
								me.getTokenStatusFilter().setValue(data.d.preferences.userTokenAssignmentFilterPref.tokenStatus);
								me.getUserIdFilter().setValue(data.d.preferences.userTokenAssignmentFilterPref.userId);
								me.getUserStatusFilter().setValue(data.d.preferences.userTokenAssignmentFilterPref.userStatus);
								
								if(toolbar)
								{
									var tokenType = data.d.preferences.userTokenAssignmentFilterPref.tokenType;
									var button;
									if( tokenType == 'All' || Ext.isEmpty() )
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
							if(me.strUnAssignedFilterFlag=='Y')
							{
								strUrl = strUrl + '&unassignedTokenFlag=Y';						
							}	
							else
							{
								strUrl = strUrl + '&unassignedTokenFlag=N';
							}								
							me.getGrid().setLoading(true);
							grid.loadGridData(strUrl,
									me.handleAfterGridDataLoad, null);
						}
					},
					handleSmartGridConfig : function() {
						var me = this;
						var objPref = null,arrColsPref = null, pgSize = null;
						var bankReportGrid = me.getUserTokenGrid();
						var objConfigMap = me.getUserTokenGridConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(bankReportGrid))
							bankReportGrid.destroy(true);

						if( null != objUserTokenAssimentPref )
						{
							var data = Ext.decode( objUserTokenAssimentPref );
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
						userTokenGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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
						clntSetupDtlView.add(userTokenGrid);
						clntSetupDtlView.doLayout();
					},

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'reset')
							me.handleGroupActions(btn, record);
						if(actionName ==='assign')
						{
							me.showTokenAssignmentPopup(record);
						}
						if(actionName ==='modify')
						{
							me.showModificationPopup(record);
						}						
					},

					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						var maskSize = 3;
						var maskArray = new Array();
						var actionMask = '';
						var rightsMap = record.data.__metadata.__rightsMap;
						var buttonMask = '';
						var retValue = true;
						var isValidRecord = false;
						if(record.data.usrValidFlag=='Y' && record.data.usrRequestState==3)
						{
							isValidRecord = true;
						}
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
						if ((maskPosition === 2 && retValue)) {
							retValue = retValue && isValidRecord;
						} 
						if ((maskPosition === 3 && retValue)) {
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
										text : getLabel('prfMstActionReset','Reset'),
										itemId : 'reset',
										actionName : 'reset',
										maskPosition : 1
									},{
										text : getLabel('actionAssign', 'Assign Token'),
										itemId : 'assign',
										actionName : 'assign',
										maskPosition : 2
									},{
										text : getLabel('lblmodify', 'Modify'),
										itemId : 'modify',
										actionName : 'assign',
										maskPosition : 3
									}]
						};
						return objActionCol;
					},

					enableValidActionsForGrid : function(grid, record,
							recordIndex, selectedRecords, jsonData) {
						var me = this;
						var buttonMask = '000';
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
						actionMask = doAndOperation(maskArray, 3);
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
													else if ((item.maskPosition === 2 && blnEnabled)) {
														blnEnabled = blnEnabled;
													}
													else if ((item.maskPosition === 3 && blnEnabled)) {
														blnEnabled = blnEnabled;
													}													
													item.setDisabled(!blnEnabled);
												}
											});
						}
					},
					showTokenAssignmentPopup : function(record) {
						Ext.create('GCP.view.UserTokenAssignmentPopup', {
							itemId : 'userTokenAssignmentPopup',
							  userNm : record.data.usrDescription,
							  userEmail : record.data.usrEmailAddress,
							  usrRequestStateDesc : record.data.usrRequestStateDesc,
							  tokenStatusDesc : record.data.tokenStatusDesc,
							  userId : record.data.userCode,
							  userClient : record.data.usrClient,
							  corp :record.data.corporationId
						}).show();
					},
					showModificationPopup : function(record) {
						var editpopup = Ext.create('GCP.view.UserTokenAssignmentPopup', {
							itemId : 'userTokenAssignmentPopup',
							  userNm : record.data.usrDescription,
							  userEmail : record.data.usrEmailAddress,
							  usrRequestStateDesc : record.data.usrRequestStateDesc,
							  tokenStatusDesc : record.data.tokenStatusDesc,
							  userId : record.data.userCode,
							  userClient : record.data.usrClient,
							  corp :record.data.corporationId
						});											
						var objTokenSerial= editpopup.down('textfield[itemId="serialNumber"]');
						var objTokenType = editpopup.down('radiogroup[itemId="tokenTypeRadio"]');
						var objSecondAuth = editpopup.down('checkbox[itemId="secondaryAuthReqFlag"]');	
						oldSerialNo=record.data.serialNumber;
						oldRecordKey=record.data.recordKeyNo
						objTokenSerial.setValue(record.data.serialNumber);
						if(record.data.tokenType !== undefined)
							{
							if(record.data.tokenType == 'S')
								objTokenType.items.items[0].setValue(true);	
							else
							objTokenType.items.items[1].setValue(true);	
							}
						if(record.data.secondaryAuthReqFlag=='Y')
						{
							objSecondAuth.setValue(true);
						}
						else
						{							
							objSecondAuth.setValue(false);
						}							
						objTokenType.setDisabled(true);
						editpopup.show();						
					},					
					handleGroupActions : function(btn, record) {
						var me = this;
						var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName
								: btn.itemId;
						var strUrl = Ext.String.format(
								'cpon/userTokenAssignment/{0}', strAction);
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
										url : strUrl,
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

					getUserTokenGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						if( null != objUserTokenAssimentPref )
						{
							var data = Ext.decode( objUserTokenAssimentPref );
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
							"colId" : "corporationDesc",
							"colDesc" : getLabel('lblCorpDesc','Corporation'),
							"hidden" : true
						}, {
							"colId" : "clientDesc",
							"colDesc" : getLabel('lblClientDesc','Client')
						},{
							"colId" : "userCode",
							"colDesc" :  getLabel('userLoginId','User Id')
						},{
							"colId" : "usrDescription",
							"colDesc" :  getLabel('lblUserName','User Name')
						},{
							"colId" : "usrRequestStateDesc",
							"colDesc" :  getLabel('lblUserStatus','User Status')
						},{
							"colId" : "tokenTypeDesc",
							"colDesc" :  getLabel('lblTokenType','Token Type')
						},{
							"colId" : "tokenStatusDesc",
							"colDesc" : getLabel('lbltokenstatus','Token Status')
						},{
							"colId" : "serialNumber",
							"colDesc" : getLabel('tokenSerNo','Serial No.')
						},{
							"colId" : "userTokenAssignmentDate",
							"colDesc" : getLabel('assignDate','Assigned Date')
						},{
							"colId" : "tokenResetDate",
							"colDesc" : getLabel('lblResetDate','Reset Date')
						}];

						storeModel = {
							fields : [ 'identifier','serialNumber', 'userTokenAssignmentDate','tokenResetDate','secondaryAuthReqFlag','tokenTypeDesc','corporationDesc',
									'beneName', 'primaryKey', 'userCode','tokenStatusDesc', 'usrEmailAddress','usrRequestState','corporationId',
									 'parentRecordKey','usrRequestStateDesc','clientDesc','usrDescription','usrValidFlag','usrClient',
									'version', 'recordKeyNo','tokenType', '__metadata'
									],
							proxyUrl : 'cpon/userTokenAssignment.json',
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
					setDataForFilter : function() {
						var me = this;
							me.filterData = me.getQuickFilterQueryJson();
					},
					getQuickFilterQueryJson : function() {
						var me = this;
						var tokenTypeFilterVal = me.tokenTypeFilterDesc;
						var statusFilterVal = me.getTokenStatusFilter().getValue();
						var userStatusFilterVal = me.getUserStatusFilter().getValue();
						var userIDFilter = me.getUserIdFilter().getValue();
						var corporationFilterVal = me.getCorporationFilter().getValue();
						var jsonArray = [];
						if (tokenTypeFilterVal != null && tokenTypeFilterVal != 'All' && tokenTypeFilterVal != getLabel('all','All')) {
							jsonArray.push({
										paramName : 'tokenType',
										paramValue1 : tokenTypeFilterVal,
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
						if (statusFilterVal != null && statusFilterVal != 'All' && statusFilterVal != getLabel('all','All')) {
							if (statusFilterVal == 'U') {
								me.strUnAssignedFilterFlag = 'Y';
							}
							else {
								me.strUnAssignedFilterFlag = 'N';
								jsonArray.push({
									paramName : 'tokenStatus',
									paramValue1 : statusFilterVal,
									operatorValue : 'eq',
									dataType : 'S'
								});
							}
						}
						else
						{
							me.strUnAssignedFilterFlag = 'N';
						}
						if (userStatusFilterVal != null && userStatusFilterVal != 'All' && userStatusFilterVal != getLabel('all','All')) {
							if(userStatusFilterVal=='11')
							{
								jsonArray.push({
									paramName : 'userStatus',
									paramValue1 : '3',
									operatorValue : 'eq',
									dataType : 'S'
								});									
								jsonArray.push({
											paramName : 'validFlag',
											paramValue1 : 'N',
											operatorValue : 'eq',
											dataType : 'S'
								});								
							}
							else if(userStatusFilterVal=='3')
							{
								jsonArray.push({
									paramName : 'userStatus',
									paramValue1 : '3',
									operatorValue : 'eq',
									dataType : 'S'
								});									
								jsonArray.push({
											paramName : 'validFlag',
											paramValue1 : 'Y',
											operatorValue : 'eq',
											dataType : 'S'
								});								
							}							
							else if(userStatusFilterVal=='1')
							{
								jsonArray.push({
									paramName : 'userStatus',
									paramValue1 : '1',
									operatorValue : 'eq',
									dataType : 'S'
								});									
								jsonArray.push({
											paramName : 'usrIsSubmitted',
											paramValue1 : 'N',
											operatorValue : 'eq',
											dataType : 'S'
								});								
							}
							else if(userStatusFilterVal=='2')
							{	
								jsonArray.push({
									paramName : 'userStatus',
									paramValue1 : '1',
									operatorValue : 'eq',
									dataType : 'S'
								});									
								jsonArray.push({
											paramName : 'usrIsSubmitted',
											paramValue1 : 'Y',
											operatorValue : 'eq',
											dataType : 'S'
								});								
							}							
							else
							{
								jsonArray.push({
									paramName : 'userStatus',
									paramValue1 : userStatusFilterVal,
									operatorValue : 'eq',
									dataType : 'S'
								});
							}
						}
						if (corporationFilterVal != null && corporationFilterVal != '' && corporationFilterVal != 'All') {
							jsonArray.push({
										paramName : 'corporation',
										paramValue1 : encodeURIComponent(corporationFilterVal.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}						
						if (userIDFilter != null && userIDFilter != '' && userIDFilter!='All') {
							jsonArray.push({
										paramName : 'userId',
										paramValue1 : encodeURIComponent(userIDFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}						
						return jsonArray;
					},
					handleTokenType : function(btn) {
						var me = this;
						var grid = this.getUserTokenGrid();
						me.tokenTypeFilterDesc = btn.btnDesc;
						me.setDataForFilter();
						grid.refreshData();
					},
					handleUserStatusChange : function(btn, e) {
						var me = this;
						var grid = this.getUserTokenGrid();
						me.statusFilterVal =btn.btnValue;
						me.setDataForFilter();
						grid.refreshData();
					},
					saveUserTokenAssignment : function(btn,userId,strUserClient,corp,strSecondAuthReq,rbTokenType,strTokenSerial,oldSerialNo,oldRecordKey) {
						var me = this;
						var arrayJson = new Array();
						arrayJson.push({
										userCode : userId,
										tokenType : rbTokenType,
										corporationId : corp,
										usrClient : strUserClient,
										serialNumber : strTokenSerial,
										secondaryAuthReqFlag :strSecondAuthReq,
										oldSerialNo :oldSerialNo,
										oldRecordKey :oldRecordKey
									});
						Ext.Ajax.request({
									url : 'cpon/assignUserToken.json',
									method : 'POST',
									jsonData : Ext.encode(arrayJson),
									success : function(responseData) {
										var isSuccess;
										var data = Ext.decode(responseData.responseText);
										if (data[0].success)
										isSuccess = data[0].success;
										if (isSuccess && isSuccess == 'N') {
											var errorMessage = '';
											var errorsList = data[0].errors;
											me.showErrors(errorsList);
										}
										else{
											me.getUserTokenAssignmentPopup().close();
											var grid = me.getUserTokenGrid();
											grid.refreshData();
										}
									},
									failure : function() {
										var errMsg = "";
										Ext.MessageBox.show({
													title : getLabel(
															'instrumentErrorPopUpTitle',
															'Error'),
													msg : getLabel('instrumentErrorPopUpMsg',
															'Error while fetching data..!'),
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
									}
								});						
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
												var strTokenType = getLabel('none', 'None');
												var status = '';
												var userStatus = '';
												var corpName  = '';
												var fileFilterView = me.getSpecificFilterPanel();
												if(me.tokenTypeFilterDesc==null)
												{
													strTokenType = getLabel('all', 'ALL');
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
													status = getLabel(
															'all', 'ALL');
												}
												if (!Ext.isEmpty(me.getUserStatusFilter())
														&& !Ext.isEmpty(me.getUserStatusFilter().getValue())) {
													var usercombo = me.getUserStatusFilter();
													userStatus = usercombo.getRawValue();
												} else {
													userStatus = getLabel(
															'all', 'ALL');
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
												if (!Ext
														.isEmpty(me.getCorporationFilter())
														&& !Ext
																.isEmpty(me.getCorporationFilter()
																		.getValue())) {
														var corpCombo = me.getCorporationFilter();
														var corpName = corpCombo.getRawValue();
												} else {
													strUserId = getLabel(
															'none', 'None');
												}												
												tip
														.update(getLabel('tokenType', 'Token Type')
																+ ' : '
																+ strTokenType
																+ '<br/>'
																+getLabel('lblcorporation', 'Corporation')
																+ ' : '
																+ corpName
																+ '<br/>'																
																+ getLabel('userId', 'User Id')
																+ ' : '
																+ strUserId																
																+ '<br/>'
																+getLabel('lblTokenStatus', 'Token Status')
																+ ' : '
																+ status
																+ '<br/>'
																+getLabel('lblUserStatus', 'User Status')
																+ ' : '
																+ userStatus																
																);
												}
											}
										});
					},
					showErrors : function(errorList) {
						var me = this;
						var errorContainer = me.getErrorContainer();
						//errorContainer.items.each(function(item, index, len){item.destroy();});
						errorContainer.removeAll();
						Ext.each(errorList, function(error, index) {
									if (!Ext.isEmpty(errorContainer)) {
										var errLabel = Ext.create('Ext.form.Label', {
													cls : 'red',
													width : '100%',	
													padding : '0 0 0 10',
													text : error.errorMessage
												});
										errorContainer.add(errLabel);
										errorContainer.show();
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
						
						var toolbar = me.getTokenTypePanel().down('toolbar[itemId=paymentTypeToolBar]');
						if (toolbar)
						{
							toolbar.items.each(function(item) {
										item.removeCls('xn-custom-heighlight');
							});
						}
						button = toolbar.down('button[btnId=allTokens]');
						button.addCls('xn-custom-heighlight');
						
						me.getUserIdFilter().setValue('');
						me.getTokenStatusFilter().setValue('All');
						me.getUserStatusFilter().setValue('All');
						
						
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
									"module" : "userTokenAssignmentFilterPref",
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
						objFilterPref.userStatus = me.getUserStatusFilter().getValue();
						objFilterPref.userId = me.getUserIdFilter().getValue();
						objFilterPref.corporation = me.getCorporationFilter().getValue();
						return objFilterPref;
					}

					/*----------------------------Preferences Handling Ends----------------------------*/					


				});