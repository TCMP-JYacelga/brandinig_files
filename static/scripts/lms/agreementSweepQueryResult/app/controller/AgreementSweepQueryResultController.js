Ext
		.define(
				'GCP.controller.AgreementSweepQueryResultController',
				{
					extend : 'Ext.app.Controller',
					requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.PageSettingPopUp'],
					views : [ 'GCP.view.AgreementSweepQueryResult',
							'GCP.view.AgreementSweepQueryResultGridView','GCP.view.AgreementSweepResultMovementPopupGrid' ],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [ {
								ref : 'agreementSweepQueryResultGridView',
								selector : 'agreementSweepQueryResultGridView'
							},
							{
								ref : 'agreementSweepQueryResult',
								selector : 'agreementSweepQueryResult'
							},
							{
								ref : 'agreementSweepQueryResultGridListView',
								selector : 'agreementSweepQueryResult agreementSweepQueryResultGridView panel[itemId="agreementSweepQueryResultGridListView"]'
							},
							{
								ref : 'agreementSweepQueryResultGrid',
								selector : 'agreementSweepQueryResult agreementSweepQueryResultGridView  grid[itemId="agreementSweepQueryResultListGridId"]'
							},
							{
								ref : 'searchTextInput',
								selector : 'agreementSweepQueryResultGridView textfield[itemId="searchTextField"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'agreementSweepQueryResult radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'grid',
								selector : 'agreementSweepQueryResultGridView smartgrid'
							},{
								ref : 'agreementSweepResultMovementPopupGrid',
								selector :'agreementSweepResultMovementPopupGrid'
							},
							{
								ref : 'movementDetailGrid',
								selector : 'agreementSweepResultMovementPopupGrid grid[itemId="moventDetailGrid"]'
							},
							{
								ref : 'groupView',
								selector : 'agreementSweepQueryResultGridView groupView'
							}],
					config : {
						filterApplied : 'ALL'
					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.strPageName = "sweepQueryResult";
						me
								.control({
									'pageSettingPopUp' : {
										'applyPageSetting' : function(popup, data,strInvokedFrom) {
											me.applyPageSetting(data,strInvokedFrom);
										},
										'savePageSetting' : function(popup, data,strInvokedFrom) {
											me.savePageSetting(data,strInvokedFrom);
										},
										'restorePageSetting' : function(popup,data,strInvokedFrom) {
											me.restorePageSetting(data,strInvokedFrom);
										}
									},
									'agreementSweepQueryResultGridView groupView' : {
										'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
											me.doHandleGroupTabChange(groupInfo, subGroupInfo, tabPanel, newCard, oldCard);
										},
										'gridPageChange' : me.handleLoadGridData,
										'gridSortChange' : me.handleLoadGridData,
										'gridRender' : me.handleLoadGridData,
										'gridStateChange' : function(grid) {
										},
										'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
											me.doHandleRowIconClick(actionName, grid, record);
										},
										'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
											if (isGroupAction === true) {
												me.handleGroupActions(actionName, grid, arrSelectedRecords, 'groupAction');
											}
										},
										'gridPageSizeChange': me.handleLoadGridData,
										'gridSettingClick' : function(){
											me.showPageSettingPopup('GRID');
										}
									},
									'agreementSweepQueryResultGridView' : {
										render : function(panel) {
											/*me.handleSmartGridConfig();*/
										}
									},
									'agreementSweepQueryResultGridView textfield[itemId="searchTextField"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'agreementSweepQueryResultGridView radiogroup[itemId="matchCriteria"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'agreementSweepQueryResultGridView smartgrid' : {
										/*render : function(grid) {
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
										}*/
										'cellclick' : function(tableView, td, cellIndex, record, tr, rowIndex, e){
											var me = this;
											var clickedColumn = tableView.getGridColumns()[cellIndex];
											var columnType = clickedColumn.colType;
											if(Ext.isEmpty(columnType)) {
												var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
												columnType = containsCheckboxCss ? 'checkboxColumn' : '';
											}
											me.handleGridRowClick(record, me.getGrid(), columnType);
										}
									}
								});
								$(document).on('performPageSettings', function(event) {
									me.showPageSettingPopup('PAGE');
								});
					},
					handleGridRowClick : function(record, grid, columnType){
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
							if(!Ext.isEmpty(columnAction)) {
								me.doHandleRowIconClick(columnAction[0].itemId, grid, record);
							}
						} else {
						}
					},
					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
						var me=this;
						var objGroupView = me.getGroupView();
						if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
							strModule = subGroupInfo.groupCode
							strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
							me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);
						} else {
							me.postHandleDoHandleGroupTabChange();
						}						
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args ? args.scope : this;
						me.handleReconfigureGrid(data);
					},
					handleReconfigureGrid : function(data){
						var me = this;
						var objGroupView = me.getGroupView();
						var gridModel = null, objData = null;
						var colModel = null, arrCols = null;
						if (data && data.preference)
							objData = Ext.JSON.decode(data.preference)
						if (_charCaptureGridColumnSettingAt === 'L' && objData
								&& objData.gridCols) {
							arrCols = objData.gridCols;
							colModel = me.getAgreementSweepQueryResultGridView().getColumnModel(arrCols);
							if (colModel) {
								gridModel = {
								columnModel : colModel
								}
							}
						}
						objGroupView.reconfigureGrid(gridModel);
					},
					/*callHandleLoadGridData : function() {
						var me = this;
						var gridObj = me.getAgreementSweepQueryResultGrid();
						me.handleLoadGridData(gridObj, gridObj.store.dataUrl,
								gridObj.pageSize, 1, 1, null);
					},*/
					handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter) {
						var me = this;
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						var execId = document.getElementById("agerExecId").value;
						var instStatus = document.getElementById("instStatus").value;
						// me.setDataForFilter();
						strUrl = strUrl + "&$agerExecId=" + execId
								+ "&$instStatus="
								+ instStatus + "&" + csrfTokenName + "="
								+ csrfTokenValue;
						grid.loadGridData(strUrl, null, null, false);
					},
					doHandleRowIconClick : function(actionName, grid, record) {
						var me = this;
						if (actionName === 'btnView') {
							var movId =record.get('MOVEMENT_ID');
							var exceId = document.getElementById("agerExecId").value;
							if(!(Ext.isEmpty(movId) || Ext.isEmpty(exceId))) {
								me.handleMovementDetailPopup( movId, exceId);
							}
						}
					},
					/*handleSmartGridConfig : function() {
						var me = this;
						var agreementSweepQueryResultGrid = me
								.getAgreementSweepQueryResultGrid();
						var objConfigMap = me
								.getAgreementSweepQueryResultGridConfiguration();
						var arrCols = new Array();
						if (!Ext.isEmpty(agreementSweepQueryResultGrid))
							agreementSweepQueryResultGrid.destroy(true);

						arrCols = me.getColumns(objConfigMap.arrColsPref,
								objConfigMap.objWidthMap);
						me.handleSmartGridLoading(arrCols,
								objConfigMap.storeModel);

					},*/
					/*handleSmartGridLoading : function(arrCols, storeModel) {
						var me = this;
						var pgSize = null;
						pgSize = 10;
						var agreementSweepQueryResultGrid = Ext
								.create(
										'Ext.ux.gcp.SmartGrid',
										{
											id : 'agreementSweepQueryResultListGridId',
											itemId : 'agreementSweepQueryResultListGridId',
											pageSize : pgSize,
											stateful : false,
											showEmptyRow : true,
											padding : '10 0 0 0',
											cls:'t7-grid',
											hideRowNumbererColumn : true,
											rowList : _AvailableGridSize,
											enableColumnAutoWidth : true,
											minHeight : 0,
											showCheckBoxColumn : false,
											columnModel : arrCols,
											storeModel : storeModel,
											isRowIconVisible : me.isRowIconVisible,
											handleRowMoreMenuClick : me.handleRowMoreMenuClick,

											handleRowIconClick : function(
													tableView, rowIndex,
													columnIndex, btn, event,
													record) {
												me.handleRowIconClick(
														tableView, rowIndex,
														columnIndex, btn,
														event, record);
											},

											handleMoreMenuItemClick : function(
													grid, rowIndex, cellIndex,
													menu, event, record) {
												var dataParams = menu.dataParams;
												me.handleRowIconClick(
														dataParams.view,
														dataParams.rowIndex,
														dataParams.columnIndex,
														menu, null,
														dataParams.record);
											}
										});

						var agreementSweepQueryResultGridView = me
								.getAgreementSweepQueryResultGridListView();
						agreementSweepQueryResultGridView
								.add(agreementSweepQueryResultGrid);
						agreementSweepQueryResultGridView.doLayout();
					},*/
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						var movId =record.get('MOVEMENT_ID');
						var exceId = document.getElementById("agerExecId").value;
						if (actionName === 'btnView') {
							me.handleMovementDetailPopup( movId, exceId);
							// me.submitExtForm('agreementSweepQueryResult.srvc',record,
							// rowIndex);
							// function showMovementDtlReq(
							// movId,fltrType,document.getElementById("agerExecId").value
							// )
							/*me.showMovementDtlReq( movId, document
									.getElementById("agerExecId").value);*/
						}
					},
					savePageSetting : function(arrPref, strInvokedFrom) {
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
									me.postHandleSavePageSetting, args, me, false);
						}
					},
					postHandleSavePageSetting : function(data, args, isSuccess) {
						var me = this, args = {};
						if (isSuccess === 'N')  {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
						else{
							me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjSweepQueryResultPref,args, me,false);
						}
					},
					updateObjSweepQueryResultPref : function(data) {
						objSweepQueryResultPref = Ext.encode(data);
					},
					applyPageSetting : function(arrPref, strInvokedFrom) {
						var me = this; args = {};
						if (!Ext.isEmpty(arrPref)) {
							if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
								var groupView = me.getGroupView(),
									subGroupInfo = groupView.getSubGroupInfo() || {},
									objPref = {},
									groupInfo = groupView.getGroupInfo() || '{}',
									strModule = subGroupInfo.groupCode;
								Ext.each(arrPref || [], function(pref) {
									if (pref.module === 'ColumnSetting') {
										objPref = pref.jsonPreferences;
									}
								});
								args['strInvokedFrom'] = strInvokedFrom;
								args['objPref'] = objPref;
								strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
								me.preferenceHandler.saveModulePreferences(me.strPageName, strModule, objPref, me.postHandlePageGridSetting, args, me, false);
							} else {
								me.preferenceHandler.savePagePreferences(me.strPageName, arrPref, me.postHandlePageGridSetting, null, me, false);
							}
						}
					},
					postHandlePageGridSetting : function(data, args, isSuccess) {
						if (isSuccess === 'Y') {
							window.location.reload();
						} else {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
					},
					restorePageSetting : function(arrPref, strInvokedFrom) {
						var me = this;
						if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
							var groupView = me.getGroupView(),
								subGroupInfo = groupView.getSubGroupInfo() || {},
								objPref = {},
								groupInfo = groupView.getGroupInfo() || '{}',
								strModule = subGroupInfo.groupCode, args = {};
							strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
							args['strInvokedFrom'] = strInvokedFrom;
							Ext.each(arrPref || [], function(pref) {
								if (pref.module === 'ColumnSetting') {
									pref.module = strModule;
									return false;
								}
							});
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref, me.postHandleRestorePageSetting, args, me, false);
						} else {
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref, me.postHandleRestorePageSetting, null, me, false);
						}
					},
					postHandleRestorePageSetting : function(data, args, isSuccess) {
						if (isSuccess === 'Y') {
							var me = this;
							if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') {
								var objGroupView = me.getGroupView();
								if (objGroupView) {
									objGroupView.reconfigureGrid(null);
								}
							} else
								window.location.reload();
						} else {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
					},
					showPageSettingPopup : function(strInvokedFrom) {
						var me = this,
							objData = {},
							objGroupView = me.getGroupView(),
							objPrefData,
							objGeneralSetting,
							objGridSetting,
							objColumnSetting;
						var objGroupByVal = '',
							objDefaultFilterVal = '',
							objGridSizeVal = '',
							objRowPerPageVal = _GridSizeTxn,
							strTitle = null,
							subGroupInfo;
							
							
							if (!Ext.isEmpty(objSweepQueryResultPref)) {
								objPrefData = Ext.decode(objSweepQueryResultPref);
								objGeneralSetting = objPrefData && objPrefData.d.preferences
										&& objPrefData.d.preferences.GeneralSetting
										? objPrefData.d.preferences.GeneralSetting
										: null;
								objGridSetting = objPrefData && objPrefData.d.preferences
										&& objPrefData.d.preferences.GridSetting
										? objPrefData.d.preferences.GridSetting
										: null;
								objColumnSetting = objPrefData && objPrefData.d.preferences
										&& objPrefData.d.preferences.ColumnSetting
										&& objPrefData.d.preferences.ColumnSetting.gridCols
										? objPrefData.d.preferences.ColumnSetting.gridCols
										: SWEEP_QRY_RESULT_DEFAULT_COL_MODEL || '[]';
					
								if (!Ext.isEmpty(objGeneralSetting)) {
									objGroupByVal = objGeneralSetting.defaultGroupByCode;
									objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
								}
								if (!Ext.isEmpty(objGridSetting)) {
									objGridSizeVal = objGridSetting.defaultGridSize;
									objRowPerPageVal = objGridSetting.defaultRowPerPage;
								}
							}
							
							objData["rowPerPage"] = _AvailableGridSize;
							objData["gridSizeVal"] = objGridSizeVal;
							objData["rowPerPageVal"] = objRowPerPageVal;
							objData["groupByVal"] = objGroupByVal;
							objData["filterUrl"] = '';
							subGroupInfo = objGroupView.getSubGroupInfo() || {};
							strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
									"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
							
							me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
								cfgPopUpData : objData,
								showAdvanceFilter : false,
								cfgGroupView : objGroupView,
								cfgDefaultColumnModel : objColumnSetting,
								cfgViewOnly : _IsEmulationMode,
								cfgInvokedFrom : strInvokedFrom,
								title : strTitle
							});
							me.pageSettingPopup.show();
							me.pageSettingPopup.center();
							
					},
					handleMovementDetailPopup : function(movId, exeId) {
						var me = this;
						var strData = {};
						strData['MOVID'] = movId;
						strData['EXEID'] = exeId;
						strData[csrfTokenName] = csrfTokenValue;
						$
								.ajax({
									type : 'POST',
									data : strData,
									url : 'agreementSweepQueryAccountDtl.srvc',
									dataType : 'html',
									success : function(data) {
										if(data != null)
											data = $.trim(data);
											
										var $response = $(data);
										$('#movementDetails')
												.html(
														$response
																.find('#movementDetailsView'));
										$('#movementDetails').dialog({
											maxHeight : 550,
											minHeight:156,
											width :  1000,
											modal : true,
											resizable: false,
											draggable: false,
											title : getLabel('movementDetail', 'Movement Detail'),
											open: function() {
												me.loadMovementDetailPopupSmartGrid(movId, exeId);
											}
										});
										$('#dialogMode').val('1');
										$('#movementDetails').dialog('open');
									}
								});
					},
					loadMovementDetailPopupSmartGrid : function(movId, exeId){
						var me = this;
						var objGridPanel = me.getAgreementSweepResultMovementPopupGrid();
						if(!Ext.isEmpty(objGridPanel)){
							objGridPanel.destroy();
						}
                      if($('#movementDetailGridDiv').length>0){
						var smartGridPanel = Ext.create('GCP.view.AgreementSweepResultMovementPopupGrid',{
									renderTo : 'movementDetailGridDiv'
								});
						me.handleMovementDetailGridConfig(movId, exeId);
					}
					},
					handleMovementDetailGridConfig : function(movId, exeId)
					{
						var me = this;
						var objMovementGrid = me.getMovementDetailGrid();
						var objConfigMap = me.getAgreementSweepResultMovementPopupGrid().getMovementGridConfig();
						var arrCols = new Array();
						arrCols = me.getAgreementSweepResultMovementPopupGrid().getMovementColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap);
						if(!Ext.isEmpty(objMovementGrid)){
							objMovementGrid.destroy( true );
						}
						me.getAgreementSweepResultMovementPopupGrid().handleMovementGridLoading(arrCols, objConfigMap.storeModel,movId, exeId);
					},
					/*showMovementDtlReq : function(movId, exeId) {
						var csrf_name = csrfTokenName;
						var csrf_token = csrfTokenValue;
						var strData = {};
						strData['MOVID'] = movId;
						strData['EXEID'] = exeId;
						strData[csrfTokenName] = csrfTokenValue;
						$
								.ajax({
									type : 'POST',
									data : strData,
									url : 'agreementSweepQueryAccountDtl.srvc',
									dataType : 'html',
									success : function(data) {
										var $response = $(data);
										$('#movementDetails')
												.html(
														$response
																.find('#movementDetailsView'));
										$('#movementDetails').dialog({
											bgiframe : true,
											autoOpen : false,
											width : 1021,
											autoHeight : 642,
											resizable : true,
											title : 'Movement Detail',
											modal : true,
											buttons : {
												"OK" : function() {
													$(this).dialog("close");
												}
											}
										});
										$('#dialogMode').val('1');
										$('#movementDetails').dialog('open');
									}
								});
					},*/
					submitExtForm : function(strUrl, record, rowIndex) {
						var me = this;
						var agrExeId = record.get('AGEREXECID');
						var form;
						strUrl = strUrl
								+ "?$agrExeId="
								+ encodeURIComponent(agrExeId)
								+ "&"
								+ csrfTokenName
								+ "="
								+ csrfTokenValue
								+ '&$viewState='
								+ encodeURIComponent(document
										.getElementById('viewState').value);

						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, csrfTokenValue));
						
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
					},

					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						if (record.get('isEmpty'))
							{
								return false;
							}
						else{
								return true;}
					},

					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						/* arrCols.push(me.createGroupActionColumn()); */
						arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for (var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc;
								cfgCol.colId = objCol.colId;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = !Ext
										.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
										: 120;

								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},
					createActionColumn : function() {
						var me = this;
						var objActionCol = {
							colType : 'actioncontent',
							colId : 'action',
							colHeader : getLabel("actions", "Actions"),
							locked : true,
							items : [ {
								itemId : 'btnView',
								text : getLabel('viewRecord', 'View Record'),
								itemCls : 'grid-row-action-icon icon-view',
								toolTip : getLabel('viewToolTip', 'View Record'),
								maskPosition : 3
							} ]
						};
						return objActionCol;

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
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						if (record.get('isEmpty')) {
							if (rowIndex === 0 && colIndex === 0) {
								meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
								return getLabel('gridNoDataMsg',
										'No records found !!!');											
							}
						} else
							return value;
					},
					getAgreementSweepQueryResultGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						objWidthMap = {
							"REF_CODE" : 135,
							"MOVEMENT_REF_NMBR" : 150,
							"DEBIT_ACCOUNT" : 200,
							"DEBIT_BANK" : 200,
							"CREDIT_ACCOUNT" : 200,
							"CREDIT_BANK" : 200,
							"AMNT_TRANSF" : 160,
							"MOVEMENT_STATUS" : 100,
							"CLEARING_STATUS" : 100,
							"REASON_FOR_NON_EXEC" : 250
						};

						arrColsPref = [ {
							"colId" : "MOVEMENT_REF_NMBR",
							"colDesc" : getLabel("movementref","Movement Reference #")
						}, {
							"colId" : "DEBIT_ACCOUNT",
							"colDesc" :  getLabel("participatingAcc","Participating A/c (CCY)")
						}, 
						{
							"colId" : "DEBIT_BANK",
							"colDesc" :  getLabel("participatingAccBank","Participating A/c Bank")
						}, 
						{
							"colId" : "CREDIT_ACCOUNT",
							"colDesc" : getLabel("contraAccCcy","Contra A/c (CCY)")
						}, 
						{
							"colId" : "CREDIT_BANK",
							"colDesc" : getLabel("contraAccBank","Contra A/c Bank")
						}, 
						{
							"colId" : "AMNT_TRANSF",
							"colDesc" : getLabel("movementAmount","Movement Amount"),
							"colType":"number"
						}, {
							"colId" : "MOVEMENT_STATUS",
							"colDesc" : getLabel("movementStatus","Movement Status")
						}, {
							"colId" : "CLEARING_STATUS",
							"colDesc" :  getLabel("clearingStatus","Clearing Status")
						}, {
							"colId" : "REASON_FOR_NON_EXEC",
							"colDesc" :getLabel("remarks","Remarks") 
						}, {
							"colId" : "AGREEMENT_CODE",
							"colDesc" : getLabel("agreementCode","Agreement Code") 
						} ];
						storeModel = {
							fields : [ 'REF_CODE', 'MOVEMENT_REF_NMBR',
									'DEBIT_ACCOUNT', 'CREDIT_ACCOUNT','DEBIT_BANK','CREDIT_BANK',
									'AMNT_TRANSF', 'MOVEMENT_STATUS',
									'CLEARING_STATUS', 'REASON_FOR_NON_EXEC' ,'MOVEMENT_ID','AGREEMENT_CODE'],
							proxyUrl : 'agreementSweepQueryResult.srvc',
							rootNode : 'd.commonDataTable',
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
					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext.create('Ext.tip.ToolTip', {
							target : 'imgFilterInfo',
							listeners : {
								// Change content dynamically depending on which
								// element
								// triggered the show.
								beforeshow : function(tip) {
									var seller = '';
									var profileName = '';
									var status = '';

									var sellerFltId = me.getSellerCombo();
									if (!Ext.isEmpty(sellerFltId)
											&& !Ext.isEmpty(sellerFltId
													.getValue())) {
										seller = sellerFltId.getValue();
									} else {
										seller = getLabel('all', 'ALL');
									}

									tip.update(getLabel("seller", "Seller")
											+ ' : ' + seller + '<br/>');

								}
							}
						});
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