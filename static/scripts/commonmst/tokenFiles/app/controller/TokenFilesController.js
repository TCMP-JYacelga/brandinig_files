Ext
		.define(
				'GCP.controller.TokenFilesController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.TokenFilesView','GCP.view.TokenFilesGridView','GCP.view.ImportTokenFile'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'tokenFilesView',
								selector : 'tokenFilesView'
							},
							{
								ref : 'filterView',
								selector : 'tokenFilesView tokenFilesFilterView'
							},							
							{
								ref : 'specificFilterPanel',
								selector : 'tokenFilesView tokenFilesFilterView panel[itemId="specificFilter"]'
							},							
							{
								ref : 'tokenFilesGridView',
								selector : 'tokenFilesView tokenFilesGridView'
							},							
							{
								ref : 'clientSetupDtlView',
								selector : 'tokenFilesView tokenFilesGridView panel[itemId="clientSetupDtlView"]'
							},							
							{
								ref : 'tokenFilesGrid',
								selector : 'tokenFilesView tokenFilesGridView grid[itemId="gridViewMstId"]'
							},							
							{
								ref : 'grid',
								selector : 'tokenFilesGridView smartgrid'
							},
							{
								ref : "fileStatusFilter",
								selector : 'tokenFilesView tokenFilesFilterView combo[itemId="fileStatus"]'
							},
							{
								ref : "fileNameFilter",
								selector : 'tokenFilesView tokenFilesFilterView textfield[itemId="fileName"]'
							},
							{
							ref : "userIdFilter",
								selector : 'tokenFilesView tokenFilesFilterView textfield[itemId="userId"]'
							},{
								ref : 'btnSavePreferences',
								selector : 'tokenFilesView tokenFilesFilterView button[itemId="btnSavePreferences"]'
							}, {
								ref : 'btnClearPreferences',
								selector : 'tokenFilesView tokenFilesFilterView button[itemId="btnClearPreferences"]'
							}],
					config : {
						tokenTypeFilterDesc : null,
						statusFilterVal : null,
						strCommonPrefUrl : 'services/userpreferences/tokenFile.json',
						filterData : [],
                        arrSorter : [],
                        pgSize : null,
						clearFlag : false
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
									'tokenFilesView' : {
										'render' : function(panel) {
										if(!Ext.isEmpty(((Ext.decode(objTokenFilePref)).d.preferences.gridView)))
											{
												me.toggleSavePrefrenceAction(false);
												me.toggleClearPrefrenceAction(true);
											}
										}
									},
									'tokenFilesView tokenFilesFilterView' : {
										render : function() {
											me.setInfoTooltip();
											me.handleSpecificFilter();
										}
									},
									'tokenFilesView tokenFilesFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);
										}
									},
									'tokenFilesView button[itemId="btnImportToken"]' : {
										click : function(btn, opts) {
											me.showImportTokenFilePopup();
										}
									},
									'tokenFilesView tokenFilesFilterView button[itemId="btnSavePreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleSavePrefrenceAction(true);
											me.handleSavePreferences();
											me.toggleClearPrefrenceAction(true);
										}
									},
									'tokenFilesView tokenFilesFilterView button[itemId="btnClearPreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleClearPrefrenceAction(false);
											me.handleClearPreferences();
											me.toggleSavePrefrenceAction(true);
										}
									},
									'tokenFilesView tokenFilesGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();

										}
									},
									'tokenFilesGridView' : {
										render : function(panel) {
											me.handleSmartGridConfig();
											me.setFilterRetainedValues();
										}
									},
									'tokenFilesGridView smartgrid' : {
										render : function(grid) {
											me.handleLoadGridData(grid,
													grid.store.dataUrl,
													grid.pageSize, 1, 1, grid.store.sorters );


										},
										gridPageChange : me.handleLoadGridData,
										gridSortChange : me.handleLoadGridData,
										//gridRender  : me.handleLoadGridData,
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
									}
								});
					},

					setFilterRetainedValues : function() {
						var me = this;
						var filterView = me.getFilterView();
						if( objTokenFilePref != null )
						{
							var data = Ext.decode( objTokenFilePref );
							if( data && data.d && data.d.preferences && data.d.preferences.tokenFileFilterPref )
							{
								me.getFileNameFilter().setValue(data.d.preferences.tokenFileFilterPref.fileName);
								me.getUserIdFilter().setValue(data.d.preferences.tokenFileFilterPref.userId);
								me.getFileStatusFilter().setValue(data.d.preferences.tokenFileFilterPref.fileStatus);
							}
							if( data && data.d && data.d.preferences && data.d.preferences.panels && data.d.preferences.panels.filterPanel )
							{
								filterView.collapsed = true;
							}
						}
					},
					handleSpecificFilter : function() {
						var me = this;
					},
					showImportTokenFilePopup : function() {
						var me = this;
						var popup = Ext.create('GCP.view.ImportTokenFile', {
						});
						popup.show();
						var objSellerCombo = popup.down('combo[itemId="sellerCodeID"]');
						var store = objSellerCombo.store;
						store.load();
						store.on('load',function(store){
						var me=this;
						if(me.getCount()==1)
						{
							objSellerCombo.setDisabled(true);
						}
						});
					popup.on('addFile', function() {
						me.savePositivePayImportAction(popup);
					});
					},
					handleGridHeader : function() {
						var me = this;
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
					savePositivePayImportAction : function(popup) {
						var me = this;
						var formdata= me.prepareDataForImport(popup);

						$.ajax({
							url : 'cpon/tokenFileupload.srvc?'+csrfTokenName+'='+tokenValue,
							type : 'POST',
							contentType: false,
							processData: false,
							data : formdata,
							complete : function(XMLHttpRequest, textStatus) {

							},
							success : function(response) {
								if (response && response[0].success == 'Y') {

									Ext.MessageBox.show({
										title : getLabel('saveActivityNotesSuccessPopUpTitle',
												'Message'),
										msg : getLabel('saveActivityNotesSuccessPopUpMsg',
												'File saved successfully !'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.INFO
									});
									popup.close();
								}
								else {
										if(response['errorMessage'] != '[]')
										{
											var errorMessage = '';
											Ext.each(response, function(error, index) {
												if(error.errorMessage!=undefined)
												{
													errorMessage = errorMessage + "<font color='red'>"+error.errorMessage +"</font><br/>";
												}
											});
											errorMessage=errorMessage+"</br>";
											if('' != errorMessage && null != errorMessage)
											{
												var errorDiv = popup.down('panel[itemId="errorText"]');
												errorDiv.show();
												errorDiv.setWidth(700);
												var splitStr=errorMessage.split('<br/>');
												errorDiv.setHeight((splitStr.length-1)*17+12);
												errorDiv.body.update(errorMessage);
											}
										}
										else
										{
											popup.close();
											Ext.MessageBox.show({
												title : getLabel('saveActivityNotesErrorPopUpTitle', 'Message'),
												msg : getLabel('saveActivityNotesErrorPopUpMsg',
														'Error while Uploading file..!'),
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
										}
								}
								
								var grid = me.getTokenFilesGrid();
								if (!Ext.isEmpty(grid)) {
									grid.refreshData();
								}
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel('positivePayIssuance', 'Error'),
											msg : getLabel('', 'Error while Uploading file..!'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});

							}
						});

					},
					prepareDataForImport : function(popup) {
						var me = this;
						var data = new FormData();
						var objJson = {};

						if (null!=document.getElementsByName('tokenFile')[0] && null!=document.getElementsByName('tokenFile')[0].files[0])
						{
							data.append("file",	document.getElementsByName('tokenFile')[0].files[0]);
							data.append("fileName",	document.getElementsByName('tokenFile')[0].files[0].name);
						}
						var objSeller= popup.down('combobox[itemId="sellerCodeID"]');
						if(null!=objSeller.getValue())
						{
							data.append("sellerId",objSeller.getValue());
						}
						else
						{
							data.append("sellerId",'');
						}
						var objTokenType= popup.down('combobox[itemId="tokenType"]');
						if(null!=objTokenType.getValue())
						{
							data.append("tokenType",objTokenType.getValue());
						}
						else
						{
							data.append("tokenType",'');
						}
						var objFileType= popup.down('combobox[itemId="FILETYPE"]');
						if(null!=objFileType.getValue())
						{
								data.append("fileFormatType",objFileType.getValue());
						}
						else
						{
							data.append("fileFormatType",'');
						}
						var objEncKey= popup.down('textfield[itemId="encKey"]');
						if(null!=objEncKey.getValue())
						{
								data.append("encKey",objEncKey.getValue());
						}
						else
						{
							data.append("encKey",'');
						}
						return data;
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
						var objPref = null,objLocalPref,filterPref;
						var arrColsPref = null, pgSize = null;
						var bankReportGrid = me.getTokenFilesGrid();
						var objConfigMap = me.getTokenFilesGridConfiguration();
						var arrCols = new Array();
						var gridFlag=true;
						if (!Ext.isEmpty(bankReportGrid))
							bankReportGrid.destroy(true);

						if( !Ext.isEmpty(objTokenFilePref) )
						{

							var data = Ext.decode( objTokenFilePref );
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
                                objPref = Ext.decode(objTokenFilePref);
                                if(!Ext.isEmpty(objPref.d.preferences))

                                if(!Ext.isEmpty(objPref.d.preferences.gridView) && !me.clearFlag)
                                    arrCols = objPref.d.preferences.gridView.gridCols;

                                if(Ext.isEmpty(arrCols))
                                {
                                    arrCols = me.getColumns(objConfigMap.arrColsPref,
                                            objConfigMap.objWidthMap);
                                }
                                gridFlag=false;
							}
						}
						else
                        {
                            arrCols = me.getColumns(objConfigMap.arrColsPref,
                                    objConfigMap.objWidthMap);
                            me.handleSmartGridLoading(arrCols,
                                    objConfigMap.storeModel);
                        }
                        if(!gridFlag)
                        {
						     me.handleSmartGridLoading(arrCols,
								    objConfigMap.storeModel);
						}
						if(data.d.preferences.tokenFileFilterPref && !me.clearFlag)
                        {
                            filterPref = data.d.preferences.tokenFileFilterPref;
                             me.getFileNameFilter().setValue(filterPref.fileName);
                             me.getFileStatusFilter().setValue(filterPref.fileStatus);
                             me.getUserIdFilter().setValue(filterPref.userId);
                             me.applyFilter();
                        }

					},

					handleSmartGridLoading : function(arrCols, storeModel) {
						var me = this;
						var pgSize = null;

						if(!Ext.isEmpty((Ext.decode(objTokenFilePref)).d.preferences.gridView) && !me.clearFlag)
						{
						pgSize = (Ext.decode(objTokenFilePref)).d.preferences.gridView.pgSize ;
						}
						else
						pgSize = 10;
						uokenFilesGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : me.pgSize || pgSize,
							stateful : false,
							showCheckBoxColumn : false,
							showEmptyRow : false,
							padding : '5 10 10 10',
							rowList : _AvailableGridSize,
							minHeight : 0,
							hideRowNumbererColumn : true,
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
						clntSetupDtlView.add(uokenFilesGrid);
						clntSetupDtlView.doLayout();
					},
					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var actionName = btn.itemId;
						if (actionName === 'btnViewError') {    
							me.showErrorReport(record);
						}
					},
					showErrorReport : function(record) {
						var me = this;
						var strUrl = 'services/getTokenFileList/getTokenErrorReport.pdf';
						form = document.createElement( 'FORM' );
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.get("uploadId") ) );
						//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'seller', record.get("sellerId") ) );
						form.action = strUrl;
						document.body.appendChild( form );
						form.submit();
						document.body.removeChild( form );
					},
					createFormField : function( element, type, name, value )
					{
						var inputField;
						inputField = document.createElement( element );
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},
					isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
						var maskSize = 3;
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

					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						 arrCols.push(me.getActionColumns())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colDesc || objCol.colHeader;
								cfgCol.colId = objCol.colId;
								cfgCol.hidden = objCol.hidden;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}

								cfgCol.width = !Ext.isEmpty(objCol.width) ? objCol.width : objWidthMap[objCol.colId];

								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},

					getActionColumns : function() {
						var objActionCol = {
							colId : 'actioncontent',
							colType : 'actioncontent',
							colHeader : 'Action',
							width : 50,
							align : 'center',
							locked : true,
							lockable : false,
							sortable : false,
							hideable : false,
							visibleRowActionCount : 1,
							items : [{
										itemId : 'btnViewError',
										itemCls : 'grid-row-action-icon icon-error',
										toolTip : getLabel('ViewErrorToolTip', 'View Error Report'),
										maskPosition : 1
									},{
										itemId : 'btnViewOk',
										itemCls : 'grid-row-action-icon icon-completed',
										toolTip : getLabel('ViewCompletedToolTip', 'Completed'),
										maskPosition : 2
									}]
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

					getTokenFilesGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						var sortState = null;
						if( null != objTokenFilePref )
						{
							var data = Ext.decode( objTokenFilePref );
							if( data && data.d && data.d.preferences && data.d.preferences.gridView)
							{
								objPref = data.d.preferences.gridView;
								me.arrSorter = data.d.preferences.gridView.sortState;
							}
						}
						objWidthMap = {
						};

						arrColsPref = [ {
							"colId" : "uploadDate",
							"colDesc" : getLabel('lblgridUploadDate','Upload Date')
						},{
							"colId" : "fileName",
							"colDesc" :  getLabel('lblgridFileName','File Name')
						},{
							"colId" : "fileFormatType",
							"colDesc" :  getLabel('lblgridFileFormatType','File Format Type')
						},{
							"colId" : "uploadBy",
							"colDesc" :  getLabel('lblgridUploadBye','Upload By')
						},{
							"colId" : "totalCount",
							"colDesc" :  getLabel('lblgridTotalCount','Total Count')
						},{
							"colId" : "uploadStatusDesc",
							"colDesc" : getLabel('lblgridStatus','Status')
						},{
							"colId" : "uploadRemarks",
							"colDesc" : getLabel('lblgridFailReason','Failure Reason')
						}];
						if(!Ext.isEmpty((Ext.decode(objTokenFilePref)).d.preferences.gridView) && !me.clearFlag)
						{
						sortState = (Ext.decode(objTokenFilePref)).d.preferences.gridView.sortState;
						}
						storeModel = {
							fields : [ 'identifier','uploadDate', 'fileName','fileFormatType','uploadBy','uploadId',
									'totalCount', 'primaryKey', 'uploadStatusDesc','uploadRemarks',
									'version', 'recordKeyNo','__metadata'
									],
							proxyUrl : 'cpon/tokenFile.json',
						 rootNode : 'd.profile',
						 sortState:me.arrSorter,
						 totalRowsNode : 'd.__count',
						 sortState : sortState
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
						var fileNameFilter = me.getFileNameFilter().getValue();
						var fileStatusFilterVal = me.getFileStatusFilter().getValue();
						var userIDFilter = me.getUserIdFilter().getValue();
						var jsonArray = [];
						if (fileStatusFilterVal != null && fileStatusFilterVal != 'ALL') {
							jsonArray.push({
										paramName : 'fileStatus',
										paramValue1 : encodeURIComponent(fileStatusFilterVal.replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
						if (userIDFilter != null && userIDFilter != '' && userIDFilter!='All') {
							jsonArray.push({
										paramName : 'uploadBy',
										paramValue1 : encodeURIComponent(userIDFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						if (fileNameFilter != null && fileNameFilter != '' && fileNameFilter!='All') {
							jsonArray.push({
										paramName : 'fileName',
										paramValue1 : encodeURIComponent(fileNameFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}
						return jsonArray;
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
													var strFileName = '';
													var status = '';

													var fileFilterView = me
															.getSpecificFilterPanel();
													var fileName = fileFilterView
															.down('textfield[itemId="fileName"]');
													var objUserId = fileFilterView
															.down('textfield[itemId="userId"]');
													if (!Ext.isEmpty(me.getFileStatusFilter())
															&& !Ext.isEmpty(me.getFileStatusFilter().getValue())) {
														var combo = me.getFileStatusFilter();
														status = combo.getRawValue();
													} else {
														status = getLabel(
																'all', 'ALL');
													}

													if (!Ext
															.isEmpty(fileName)
															&& !Ext
																	.isEmpty(fileName
																			.getValue())) {
														strFileName = fileName
																.getValue();
													} else {
														strFileName = getLabel(
																'none', 'None');
													}

													if (!Ext
															.isEmpty(objUserId)
															&& !Ext
																	.isEmpty(objUserId
																			.getValue())) {
														strUserId = objUserId
																.getValue();
													} else {
														strUserId = getLabel(
																'none', 'None');
													}
													tip
															.update(getLabel('lblFileName', 'File Name')
																	+ ' : '
																	+ strFileName
																	+ '<br/>'
																	+getLabel('lblUserID', 'User ID')
																	+ ' : '
																	+ strUserId
																	+ '<br/>'
																	+ getLabel('tokenstatus', 'Status')
																	+ ' : '
																	+ status);

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
						me.applyFilter();
						var grid = me.getTokenFilesGrid();
						if (!Ext.isEmpty(grid)) {
							grid.refreshData();
						}
						//me.handleSmartGridConfig();
					},
					handleClearPreferences : function() {
						var me = this;
						me.doClearPreferences();

						 me.getFileNameFilter().setValue('');
						 me.getFileStatusFilter().setValue('ALL');
						 me.getUserIdFilter().setValue('');
						 me.applyFilter();

						 me.clearFlag = true;
						me.handleSmartGridConfig();
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
								async : false,
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
                                            icon : Ext.MessageBox.INFO,
                                            fn: function(buttonId) {
                                                if (buttonId === "ok") {
                                                   window.location.reload();
                                                }
                                            }
                                        });
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
					getPreferencesToSave : function(localSave) {
						var me = this;
						var arrPref = [], objFilterPref = null, grid = null, gridState = null;
						var filterPanelCollapsed = true;
						filterPanelCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
						objFilterPref = me.getFilterPreferences();
						grid = me.getGrid();
						gridState = grid.getGridState();
						arrPref.push({
									"module" : "tokenFileFilterPref",
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
						objFilterPref.fileName = me.getFileNameFilter().getValue();
						objFilterPref.fileStatus = me.getFileStatusFilter().getValue();
						objFilterPref.userId = me.getUserIdFilter().getValue();
						return objFilterPref;
					}

					/*----------------------------Preferences Handling Ends----------------------------*/					

				});