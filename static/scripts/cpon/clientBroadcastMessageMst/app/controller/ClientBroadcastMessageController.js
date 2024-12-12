Ext
		.define(
				'GCP.controller.ClientBroadcastMessageController',
				{
					extend : 'Ext.app.Controller',
					requires : [],
					views : [ 'GCP.view.ClientBroadcastMessageView','GCP.view.ClientBroadcastMessageGridView','Ext.ux.gcp.PreferencesHandler'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'clientBroadcastMessageView',
								selector : 'clientBroadcastMessageView'
							},
							{
								ref : 'filterView',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView'
							},							
							{
								ref : 'specificFilterPanel',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView panel[itemId="specificFilter"]'
							},							
							{
								ref : 'clientBroadcastMessageGridView',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView'
							},							
							{
								ref : 'clientSetupDtlView',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView panel[itemId="clientSetupDtlView"]'
							},
							{
								ref : 'withHeaderCheckboxRef',
								selector : 'clientBroadcastMessageTitleView menuitem[itemId="withHeaderId"]'
							},							
							{
								ref : 'fromDateLabel',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView label[itemId="dateFilterFrom"]'
							}, {
								ref : 'toDateLabel',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView label[itemId="dateFilterTo"]'
							}, {
								ref : 'dateLabel',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView label[itemId="dateLabel"]'
							}, {
								ref : 'fromEntryDate',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView datefield[itemId="fromDate"]'
							}, {
								ref : 'toEntryDate',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView datefield[itemId="toDate"]'
							}, {
								ref : 'dateRangeComponent',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView container[itemId="dateRangeComponent"]'
							}, {
								ref : 'entryDate',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="entryDate"]'
							}, 							
							{
								ref : 'clientBroadcastMessageGrid',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView grid[itemId="gridViewMstId"]'
							},							
							{
								ref : 'grid',
								selector : 'clientBroadcastMessageGridView smartgrid'
							},
							{
								ref : "fileStatusFilter",
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView combo[itemId="fileStatus"]'
							},
							{
								ref : "clientAutoCompleter",
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView textfield[itemId="clientAutoCompleter"]'
							},
							{
								ref : "messageCompleter",
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView textfield[itemId="messageCompleter"]'
							},
							{
								ref : 'brodDate',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="brodDate"]'
							},							
							{
								ref : 'btnSavePreferences',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="btnSavePreferences"]'
							}, {
								ref : 'btnClearPreferences',
								selector : 'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="btnClearPreferences"]'
							},
							{
							ref : 'groupView',
							selector : 'clientBroadcastMessageGridView groupView'
							}
					],
					config : {
						tokenTypeFilterDesc : null,
						statusFilterVal : null,
						dateFilterVal : '12',
						dateFilterFromVal : '',
						dateFilterToVal : '',	
						dateFilterLabel : getLabel('Latest','Latest'),	
						dateHandler : null,						
						strCommonPrefUrl : 'services/userpreferences/clientBroadcastMsg.json',
						filterData : [],
						arrSorter:[],
						reportOrderByURL : null,
						subjectfilterDesc : '',
						subjectfilter : '',
						clientCode : '',
						clientDesc : '',
						datePickerSelectedDate : [],
						dateRangeFilterVal : '13',
						dateLabelVar : ''
					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;									
						this.dateHandler = me.getController('GCP.controller.DateHandler');
						me
								.control({
									'clientBroadcastMessageView' : {
										'render' : function(panel) {		
										if(!Ext.isEmpty(objGridViewPref) || !Ext.isEmpty(objGridViewFilter) || !Ext.isEmpty(objPanelsPref))
											me.toggleClearPrefrenceAction(true);
										me.toggleSavePrefrenceAction(true);												
										}									
									},
									'clientBroadcastMessageTitleView' : {
										performReportAction : function( btn, opts )
										{
											me.handleReportAction( btn, opts );
										}										
									},           
									'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											filterUrl = '';
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);
										}
									},		
									'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="btnSavePreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleSavePrefrenceAction(false);
											me.handleSavePreferences();
											me.toggleClearPrefrenceAction(true);
										}
									},
									'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="btnClearPreferences"]' : {
										'click' : function(btn, opts) {
											me.toggleClearPrefrenceAction(false);
											me.handleClearPreferences();
											me.toggleSavePrefrenceAction(false);
										}
									},									
									'clientBroadcastMessageView clientBroadcastMessageGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();
											me.updateFilterConfig();		
										}
									},	
									'clientBroadcastMessageView clientBroadcastMessageFilterView' : {
										render : function() {
											me.setInfoTooltip();
											me.setFilterRetainedValues();
											me.handleSpecificFilter();
										},									
										dateChange : function(btn, opts) {
											filterUrl = '';
											me.dateFilterVal = btn.btnValue;
											me.dateFilterLabel = btn.text;
											me.handleDateChange(btn.btnValue);
											if (btn.btnValue !== '7') {
												me.setDataForFilter();
												me.applyFilter();
											}
											me.toggleSavePrefrenceAction(true);
										}
									},	
									'clientBroadcastMessageView clientBroadcastMessageFilterView button[itemId="goBtn"]' :
									{
										click : function( btn, opts )
										{
											filterUrl = '';
											var frmDate = me.getFromEntryDate().getValue();
											var toDate = me.getToEntryDate().getValue();

											if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
											{
												var dtParams = me.getDateParam( '7' );
												me.dateFilterFromVal = dtParams.fieldValue1;
												me.dateFilterToVal = dtParams.fieldValue2;
												me.setDataForFilter();
												me.applyFilter();
												me.toggleSavePrefrenceAction( true );
											}
										}
									},									
									/*'clientBroadcastMessageGridView' : {
										render : function(panel) {
									//		me.handleSmartGridConfig();
											me.setFilterRetainedValues();
										}
									},*/
								'clientBroadcastMessageGridView groupView' : {
								/**
								 * This is to be handled if grid model changes as per group by
								 * category. Otherewise no need to catch this event. If captured
								 * then GroupView.reconfigureGrid(gridModel) should be called
								 * with gridModel as a parameter
								 */
								'groupByChange' : function(menu, groupInfo) {
									me.doHandleGroupByChange(menu, groupInfo);
								},
								'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
										newCard, oldCard) {
									me.doHandleGroupTabChange(groupInfo, subGroupInfo,
											tabPanel, newCard, oldCard);
								},
								'gridRender' : me.handleLoadGridData,
								'gridPageChange' : me.handleLoadGridData,
								'gridSortChange' : me.handleLoadGridData,
								'gridPageSizeChange' : me.handleLoadGridData,
								'gridColumnFilterChange' : me.handleLoadGridData,
								//'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
								'gridStateChange' : function(grid) {
									me.toggleSavePrefrenceAction( true );
								},
								'gridRowActionClick' : function(grid, rowIndex, columnIndex,
										actionName, record) {
									me.doHandleRowActions(actionName, grid, record,rowIndex);
								},
								'groupActionClick' : function(actionName, isGroupAction,
										maskPosition, grid, arrSelectedRecords) {
									if (isGroupAction === true)
										me.handleGroupActions(actionName, grid,
												arrSelectedRecords, 'groupAction');
						}
					},
									'clientBroadcastMessageFilterView' : {
										handleClientChange : function(btn, eopts) {
											filterUrl = '';
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);
										},
										handleSubjectChange : function(btn, eopts) {
											filterUrl = '';
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);
										}										
									},									
								'clientBroadcastMessageView clientBroadcastMessageFilterView datefield[itemId="fromDate"]' :
								{		
									select : function()
									{
										filterUrl = '';
										if(!Ext.isEmpty(me.getToEntryDate().getValue()))
										me.getToEntryDate().setMinValue(me.getFromEntryDate().getValue());
									}
								},
								'clientBroadcastMessageView clientBroadcastMessageFilterView toolbar[itemId="dateToolBar"]' :
								{
									afterrender : function( tbar, opts )
									{
										me.updateDateFilterView();
									}
								}
									/*'clientBroadcastMessageGridView smartgrid' : {
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
									}	*/									
								});
					},
					
					setFilterRetainedValues : function() {
						var me = this;
						var filterView = me.getSpecificFilterPanel();
					},
					handleSpecificFilter : function() {
						var me = this;
					},
					doHandleGroupByChange : function(menu, groupInfo) {
						var me = this;
						if (me.previouGrouByCode === 'ADVFILTER') {
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
						}
						if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
				//			me.previouGrouByCode = groupInfo.groupTypeCode;
						} 
				//			me.previouGrouByCode = null;
					},
				doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,newCard, oldCard)
				{
					var me = this;
					var objGroupView = me.getGroupView();
					var strModule = '', strUrl = null, args = null, strFilterCode = null;
					groupInfo = groupInfo || {};
					subGroupInfo = subGroupInfo || {};
					if (groupInfo) {
						if (groupInfo.groupTypeCode === 'ADVFILTER') {

						} else {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							me.postHandleDoHandleGroupTabChange(null,args);
						}
					}

				},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getClientBroadcastMessageGridView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
				var colModel = null, arrCols = null;

				if (objGridViewPref ) {
					data = Ext.decode( objGridViewPref );
					//objPref = data[ 0 ];
					objPref = data;
					
					arrCols = objPref.gridCols || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					showPager = objPref.gridSetting
							&& !Ext.isEmpty(objPref.gridSetting.showPager)
							? objPref.gridSetting.showPager
							: true;
					colModel = objSummaryView.getColumnModel(arrCols);
					arrSortState = objPref.sortState;
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPgSize,
							showPagerForced : showPager,
							showCheckBoxColumn : true,
							storeModel : {
								sortState : arrSortState
							}
						};
					}
				} else {
					gridModel = {
						showCheckBoxColumn : true
					};
				}
				objGroupView.reconfigureGrid(gridModel);
	
			},
			
					handleGridHeader : function() {
						var me = this;
					},

					handleLoadGridData : function(groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter,filterData) 
						{
						var me = this; 
						me.setDataForFilter();
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,oldPgNo, sorter);		
						if(!Ext.isEmpty(filterUrl)){	
							filterUrl = filterUrl.replace(/date/g,'');
							strUrl = strUrl + '&$filter=' + filterUrl;
						}	
						else	
							strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
						me.reportOrderByURL = strUrl;
						grid.loadGridData(strUrl, null, null, false);
					},

					getFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this; 
						var strQuickFilterUrl = '',strUrl = '';
						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
									? subGroupInfo.groupQuery
									: '';
						strQuickFilterUrl = me.generateUrlWithFilterParams(this);
						if (!Ext.isEmpty(strGroupQuery))
						{
							if( Ext.isEmpty( strQuickFilterUrl ) )
							{
								strUrl += '&$filter=' + strGroupQuery;								
								isFilterApplied = true;
							}
							else{
							if (!Ext.isEmpty(strQuickFilterUrl))
							 {								
								strUrl += strQuickFilterUrl + ' and '+strGroupQuery ;
								
							 }
							}
						}
					else{
						if (!Ext.isEmpty(strQuickFilterUrl))
							strUrl += strQuickFilterUrl;
						}
						
						
						return strUrl;
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
					/*handleSmartGridConfig : function() {
						var me = this;
						var data;
						var objConfigMap = me.getClientBroadcastMessageGridConfiguration();
						var bankReportGrid = me.getClientBroadcastMessageGrid();
						if( Ext.isEmpty( bankReportGrid ) )
						{
							if( !Ext.isEmpty( objGridViewPref ) )
							{
								data = Ext.decode( objGridViewPref );
								arrColsPref = data.gridCols;
								arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
								pgSize = !Ext.isEmpty( data.pgSize ) ? parseInt( data.pgSize ) :10;
								me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
							}
							else if( objConfigMap.arrColsPref )
							{
								arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
								pgSize = 10;
								me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
							}
						}
						else
						{
							var arrCols = new Array();
							if (!Ext.isEmpty(bankReportGrid))
								bankReportGrid.destroy(true);

							arrCols = me.getColumns(objConfigMap.arrColsPref,
									objConfigMap.objWidthMap);
							me.handleSmartGridLoading(arrCols,
									objConfigMap.storeModel);
						}
					},
*/
				/*	handleSmartGridLoading : function(arrCols, storeModel,pSize) {
						var me = this;
						var pgSize;
						pgSize = pSize || 10;
						uokenFilesGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : pgSize,
							stateful : false,
							showCheckBoxColumn : false,
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
						clntSetupDtlView.add(uokenFilesGrid);
						clntSetupDtlView.doLayout();
					},

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;					
					},*/
					
					doHandleRowActions : function(actionName, grid, record,rowIndex)
					{
						var me = this;	
					},
					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						return retValue;
					},

			/*		getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						// arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colHeader;
								cfgCol.colId = objCol.colId;
								cfgCol.hidden = objCol.hidden;
								cfgCol.locked = objCol.locked;
								cfgCol.width = objCol.width;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}
								if(cfgCol.colId=='uploadFileName')
								{
									cfgCol.align = 'center';
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
						if (colId == 'col_displayLevel') {						
							strRetValue = '<font color="red">'+ value +'</font>';
						}
						else if (colId == 'col_messageName') {
								if (!Ext.isEmpty(record.data.textorHtmlDesc))
								{
									var htmlPathVal = record.data.textorHtmlDesc;									
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''+htmlPathVal+'\')">view</a>';
								}
						        else if(!Ext.isEmpty(record.data.messageBody))
								{
									var details = record.data.messageBody;
									details = details.replace(/([']|\\)/g, "\\$1");
									var popupTitle = record.data.messageName+' , '+record.data.startDateTime;
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\'' + popupTitle + '\', \'' + details + '\')";>view</a>';
								}
								else {
									strRetValue = value;
								}								
						}
						else if (colId == 'col_uploadFileName')
						{
								if (!Ext.isEmpty(record.data.uploadFileName))
								{
									strRetValue = '<a href="#" onclick="javascript:downloadPDFFile(\''+record.data.uploadFileName+'\');" ><i class="fa fa-paperclip fa-rotate-90 fa-lg"/></a>';
								}
						}
						else {
							strRetValue = value;
						}						
						return strRetValue;
					},*/
					postReadPanelPrefrences : function (data, args, isSuccess) {
						var me = this;
						if(!Ext.isEmpty(data))
						objGridViewPref=data.preference;
					},					
					postReadfilterPrefrences : function (data, args, isSuccess) {
						var me = this;
						if (data && data.preference) {
							objGridViewFilter=data.preference;
						}	
					},
					updateFilterConfig : function() {
						var me = this;
						var arrJsn = new Array();
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						var	args = {
								'module' : 'panels'
							};
						// TODO : Localization to be handled..
						var objDateLbl = {
							
							'12' : getLabel( 'latest', 'Latest' ),
							'1' : getLabel( 'today', 'Today' ),
				            '2' : getLabel( 'yesterday', 'Yesterday' ),
				            '3' : getLabel( 'thisweek', 'This Week' ),
				            '4' : getLabel( 'lastweek', 'Last Week To Date' ),
				            '5' : getLabel( 'thismonth', 'This Month' ),
				            '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
				            '7' : getLabel( 'daterange', 'Date Range' ),
				            '8' : getLabel( 'thisquarter', 'This Quarter' ),
				            '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
				            '10' : getLabel( 'thisyear', 'This Year' ),
				            '11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
						};
						if (Ext.isEmpty(objGridViewFilter)){
							me.preferenceHandler.readModulePreferences('clientBroadcastMsg',
									'gridViewFilter', me.postReadfilterPrefrences, args, me, true);
						}								
						if (!Ext.isEmpty(objGridViewFilter)) {
								var data = Ext.decode(objGridViewFilter);	
								if(!Ext.isEmpty(data))
								{
									var strDtValue = data.dateIndex;
									var strDtFrmValue = data.fromDate;
									var strDtToValue = data.toDate;
									if (!Ext.isEmpty(strDtValue)) {
										me.dateFilterLabel = objDateLbl[strDtValue];
										me.dateFilterVal = strDtValue;
										if (strDtValue === '7') {
											if (!Ext.isEmpty(strDtFrmValue))
											{
												me.dateFilterFromVal = strDtFrmValue;
												me.getFromEntryDate().setValue(strDtFrmValue);
											}
											if (!Ext.isEmpty(strDtToValue))
											{
												me.dateFilterToVal = strDtToValue;
												me.getToEntryDate().setValue(strDtToValue);
											}
											me.getDateRangeComponent().show();
										}	
									var dateLabel = me.getDateLabel();
										if(Ext.isEmpty(dateLabel))
										{
											dateLabel = me.dateLabelVar;
										}
										else
										dateLabel.setText(getLabel('lblMessageDate', 'Message Date') + " ("
									+ me.dateFilterLabel+ ")");			
									}								
								}
								if(!Ext.isEmpty(data.clientName))
								{
									me.getClientAutoCompleter().setValue(data.clientName);
								}
								if(!Ext.isEmpty(data.msgFilter))
								{								
									me.getMessageCompleter().setValue(data.msgFilter);
								}
							}
						if (!Ext.isEmpty(me.dateFilterVal)) {
							var strVal1 = '', strVal2 = '', strOpt = 'eq';
							if (me.dateFilterVal !== '7') {
								var dtParams = me.getDateParam(me.dateFilterVal);
								if (!Ext.isEmpty(dtParams)
										&& !Ext.isEmpty(dtParams.fieldValue1)) {
									strOpt = dtParams.operator;
									strVal1 = dtParams.fieldValue1;
									strVal2 = dtParams.fieldValue2;
								}
							} else {
								if (!Ext.isEmpty(me.dateFilterVal)
										&& !Ext.isEmpty(me.dateFilterFromVal)) {
									strVal1 = me.dateFilterFromVal;

									if (!Ext.isEmpty(me.dateFilterToVal)) {
										strOpt = 'bt';
										strVal2 = me.dateFilterToVal;
									}
								}
							}
							if(me.dateFilterVal != '12')
							{
								arrJsn.push({
											paramName : 'EntryDate',
											paramValue1 : strVal1,
											paramValue2 : strVal2,
											operatorValue : strOpt,
											dataType : 'D'
										});
							}
						}
						me.handleDateChange(me.dateFilterVal);
						me.filterData = arrJsn;
					},					
					
					getClientBroadcastMessageGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						if( !Ext.isEmpty( objGridViewPref ) )
						{
							var data = Ext.decode( objGridViewPref );
							me.arrSorter = data.sortState;
						}						
						objWidthMap = {
								"displayLevel" : 110,
								"startDateTime" : 100,
								"messageName" : 180,
								"messageBody" : 240,
								"uploadFileName" : 100,
								"htmlFileDesc" : 120
						};

						arrColsPref = [ {
							"colId" : "displayLevel",
							"colHeader" : getLabel('lblmessageType','Message Type')
						},{
							"colId" : "startDateTime",
							"colHeader" :  getLabel('lblDate','Date')
						},{
							"colId" : "messageName",
							"colHeader" :  getLabel('lblSubject','Subject')
						},{
							"colId" : "messageBody",
							"colHeader" :  getLabel('lblMessage','Message')
						},{
							"colId" : "uploadFileName",
							"colHeader" :  getLabel('lblAttachment','Attachment')
						},{
							"colId" : "htmlFileDesc",
							"colHeader" : getLabel('lblClient','Client')
						}];

						storeModel = {
							fields : [ 'identifier','htmlFileDesc', 'messageBody','messageName','startDateTime',
									'displayLevel', 'primaryKey', 'textorHtmlDesc', 'uploadFileName',
									'version', 'recordKeyNo','__metadata'
									],
							proxyUrl : 'cpon/clientBroadcastMessage.json',
						 rootNode : 'd.profile',
						 sortState : me.arrSorter,
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
						var clientFilter = me.getClientAutoCompleter().getValue();
						var subjectFilter = me.getMessageCompleter().getValue();
						var jsonArray = [];
						var index = me.dateFilterVal;
						var objDateParams = me.getDateParam( index );
						if(index != '12')
						{
							jsonArray.push(
									{
										paramName : me.getBrodDate().filterParamName,
										paramValue1 : objDateParams.fieldValue1,
										paramValue2 : objDateParams.fieldValue2,
										operatorValue : objDateParams.operator,
										dataType : 'D'
									} );
						}
						if (clientFilter != null && clientFilter != '' && clientFilter!='All') {
							jsonArray.push({
										paramName : 'htmlFileDesc',
										paramValue1 : clientFilter.toLowerCase(),
										operatorValue : 'lk',
										dataType : 'S'
									});
						}	
						if (subjectFilter != null && subjectFilter != '' && subjectFilter!='All') {
							jsonArray.push({
										paramName : 'brodSubject',
										paramValue1 : subjectFilter.toLowerCase(),
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
											target : 'imgFilterInfoGridView',
											listeners : {
												// Change content dynamically
												// depending on which element
												// triggered the show.
												beforeshow : function(tip) {
													var strUserId = '';
													var strFileName = '';
													
													var fileFilterView = me
															.getSpecificFilterPanel();
													var fileName = fileFilterView
															.down('textfield[itemId="messageCompleter"]');	
													var clContainer = me.getFilterView()
															.down('container[itemId="filterCorporationContainer"]');	
													var objUserId = me.getClientAutoCompleter();
												var dateFilter = me.dateFilterLabel;
													if (!Ext.isEmpty(fileName)
															&& !Ext.isEmpty(fileName.getValue())) {
														strFileName = fileName.getValue();
													} else {
														strFileName = getLabel('none', 'None');
													}
													if (!Ext.isEmpty(objUserId)
															&& !Ext.isEmpty(objUserId.getValue())) {
														strUserId = objUserId.getValue();
													}
													else
													{
														if(clContainer.isVisible())
														{
															strUserId = getLabel(
																'none', 'None');
														}	
														else
														{
															strUserId = strClientDesc;
														}		
													}	

													tip.update(getLabel('client', 'Company Name')
																	+ ' : '
																	+ strUserId
																	+ '<br/>'
																	+getLabel('lblSubject', 'Subject')
																	+ ' : '
																	+ strFileName
																	+ '<br/>'
																	+getLabel( 'lblMessageDate', 'Message Date' )
																	+ ' : ' + dateFilter);
												}
											}
										});
					},	
					updateDateFilterView : function()
					{
						var me = this;
						var dtEntryDate = null;
						if( !Ext.isEmpty( me.dateFilterVal ) )
						{
							me.handleDateChange( me.dateFilterVal );
							if( me.dateFilterVal === '7' )
							{
								if( !Ext.isEmpty( me.dateFilterFromVal ) )
								{
									dtEntryDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
									me.getFromEntryDate().setValue( dtEntryDate );
								}
								if( !Ext.isEmpty( me.dateFilterToVal ) )
								{
									dtEntryDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
									me.getToEntryDate().setValue( dtEntryDate );
								}
							}
						}
					},					
					handleDateChange : function(index) {
						var me = this;
						var fromDateLabel = me.getFromDateLabel();
						var toDateLabel = me.getToDateLabel();
						var objDateParams = me.getDateParam(index);

						if (index == '7') {
							me.getDateRangeComponent().show();
							me.getFromDateLabel().hide();
							me.getToDateLabel().hide();
							if(!Ext.isEmpty(me.getToEntryDate().getValue()))
								me.getToEntryDate().setMinValue(me.getFromEntryDate().getValue());							
						} else if (index == '12') {
							me.getDateRangeComponent().hide();
							me.getFromDateLabel().hide();
							me.getToDateLabel().hide();
						} else {
							me.getDateRangeComponent().hide();
							me.getFromDateLabel().show();
							me.getToDateLabel().show();
						}

						if (!Ext.isEmpty(me.dateFilterLabel)) {
						
							var dateLabel = me.getDateLabel();
								dateLabel.setText(getLabel('lblMessageDate', 'Message Date') + " ("
									+ me.dateFilterLabel+ ")");		
						}
						if (index !== '7' && index !== '12') {
							var vFromDate = Ext.util.Format.date(Ext.Date.parse(
											objDateParams.fieldValue1, 'Y-m-d'),
									strExtApplicationDateFormat);
							var vToDate = Ext.util.Format.date(Ext.Date.parse(
											objDateParams.fieldValue2, 'Y-m-d'),
									strExtApplicationDateFormat);
							if (index === '1' || index === '2') {
								fromDateLabel.setText(vFromDate);
								toDateLabel.setText("");
							} else {
								fromDateLabel.setText(vFromDate + " - ");
								toDateLabel.setText(vToDate);
							}
						}						
					},

					getDateParam : function(index) {
						var me = this;
						var objDateHandler = me.getDateHandler();
						var strAppDate = dtApplicationDate;
						var dtFormat = strExtApplicationDateFormat;
						var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
						var strSqlDateFormat = 'Y-m-d';
						var fieldValue1 = '', fieldValue2 = '', operator = '';
						var retObj = {};
						var dtJson = {};
						switch (index) {
							case '1' :
								// Today
								fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
								break;
							case '2' :
								// Yesterday
								fieldValue1 = Ext.Date.format(objDateHandler
												.getYesterdayDate(date), strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
								break;
							case '3' :
								// This Week
								dtJson = objDateHandler.getThisWeekStartAndEndDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '4' :
								// Last Week To Date
								dtJson = objDateHandler.getLastWeekToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '5' :
								// This Month
								dtJson = objDateHandler.getThisMonthToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '6' :
								// Last Month To Date
								dtJson = objDateHandler.getLastMonthToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '7' :
								// Date Range
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();
								fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '8' :
								// This Quarter
								dtJson = objDateHandler.getQuarterToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '9' :
								// Last Quarter To Date
								dtJson = objDateHandler.getLastQuarterToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '10' :
								// This Year
								dtJson = objDateHandler.getYearToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '11' :
								// Last Year To Date
								dtJson = objDateHandler.getLastYearToDate(date);
								fieldValue1 = Ext.Date
										.format(dtJson.fromDate, strSqlDateFormat);
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
							case '12' :
								break;
						}
						retObj.fieldValue1 = fieldValue1;
						retObj.fieldValue2 = fieldValue2;
						retObj.operator = operator;
						return retObj;
					},	
	/*----------------------------Reports Handling----------------------------*/					
					handleReportAction : function(btn, opts) {
						var me = this;
						me.downloadReport(btn.itemId);
					},
					downloadReport : function(actionName) {
						var me = this;
						var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
						var arrExtension = {
							downloadXls : 'xls',
							downloadCsv : 'csv',
							loanDownloadPdf : 'pdf',
							downloadTsv : 'tsv',
							downloadBAl2 : 'bai2'
						};
						var currentPage = 1;
						var strExtension = '';
						var strUrl = '';
						var strSelect = '';
						var activeCard = '';
						var viscols;
						var col = null;
						var visColsStr = "";
						var colMap = new Object();
						var colArray = new Array();

						strExtension = arrExtension[actionName];
						strUrl = 'services/getBroadCastMessageList/getBroadCastMessageDynamicReport.'
								+ strExtension;
						strUrl += '?$skip=1';
						var strQuickFilterUrl = me.getFilterUrl();
						strUrl += strQuickFilterUrl;
						var strOrderBy = me.reportOrderByURL;
						if(!Ext.isEmpty(strOrderBy)){
							var orderIndex = strOrderBy.indexOf('orderby');
							if(orderIndex > 0){
								strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
								var indexOfamp = strOrderBy.indexOf('&$');
								if(indexOfamp > 0)
									strOrderBy = strOrderBy.substring(0,indexOfamp);
								strUrl += '&$'+strOrderBy;
							}
						}						
						var grid = me.getGrid();
						viscols = grid.getAllVisibleColumns();
						for (var j = 0; j < viscols.length; j++) {
							col = viscols[j];
							if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
								if (colMap[arrSortColumnReport[col.dataIndex]]) {
									// ; do nothing
								} else {
									colMap[arrSortColumnReport[col.dataIndex]] = 1;
									colArray.push(arrSortColumnReport[col.dataIndex]);

								}
							}

						}
						if (colMap != null) {

							visColsStr = visColsStr + colArray.toString();
							strSelect = '&$select=[' + colArray.toString() + ']';
						}

						strUrl = strUrl + strSelect;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
								currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
								withHeaderFlag));
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},	
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
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
									"module" : "brodcastMsgFilterPref",
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
						objFilterPref.clientName = me.getClientAutoCompleter().getValue();
						objFilterPref.msgFilter = me.getMessageCompleter().getValue();
						if( me.dateFilterVal === '7' )
						{

							if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
							{
								objFilterPref.fromDate = me.dateFilterFromVal;
								objFilterPref.toDate = me.dateFilterToVal;	
							}
							else
							{
								var strSqlDateFormat = 'Y-m-d';
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();
								fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
								fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
								objFilterPref.fromDate = fieldValue1;
								objFilterPref.toDate = fieldValue2;												
							}							
						}
						if(!Ext.isEmpty(me.dateFilterVal))	
						{
							objFilterPref.dateIndex = me.dateFilterVal;	
						}	
						return objFilterPref;
					}

					/*----------------------------Preferences Handling Ends----------------------------*/					

				});
/*function showMsgPopup(popupTitle, details) {
	var msgPopup = Ext.create('GCP.view.ClientBroadcastDetailsPopup', {
		title: popupTitle,
		minHeight: 200,
		autoHeight: true,
		width: 500,
		resizable: false,
		recordDtl: details
	});
	msgPopup.show();		
}

function downloadView(htmlUrl)
{
	if(!Ext.isEmpty(htmlUrl))
		 window.open(htmlUrl,"Ratting","left=250,top=180,width=600,height=400,0,status=0,");
}

function downloadPDFFile(strFileName)
{
		var frm = document.getElementById('clientDownloadNewsForm');
		frm.target = "downloadWin";
		frm.action = "clientDownloadNewsAttachment.form";
		document.getElementById('downloadFileName').value = strFileName;
		frm.submit();
}*/