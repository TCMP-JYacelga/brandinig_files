Ext.define('GCP.controller.BroadcastMessageController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.BroadcastMessageView',
			'GCP.view.BroadcastMessageGridView', 'GCP.view.HistoryPopup','GCP.view.BroadcastMessageSummaryView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'broadcastMessageView',
				selector : 'broadcastMessageView'
			}, {
				ref : 'createNewToolBar',
				selector : 'broadcastMessageView broadcastMessageGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'specificFilterPanel',
				selector : ' broadcastMessageFilterView panel[itemId="specificFilter"]'
			}, {
				ref : 'broadcastMessageSummaryView',
				selector : 'broadcastMessageSummaryView'
			}, {
				ref : 'broadcastMsgSummaryPanel',
				selector : 'broadcastMessageSummaryView panel[itemId="broadcastMsgSummaryPanel"]'
			}, {
				ref : 'broadcastMessageGridView',
				selector : 'broadcastMessageView broadcastMessageGridView'
			}, {
				ref : 'broadcastMessageFilterView',
				selector : ' broadcastMessageFilterView'
			}, {
				ref : 'broadcastMsgDtlView',
				selector : 'broadcastMessageView broadcastMessageGridView panel[itemId="broadcastMsgDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'broadcastMessageView broadcastMessageGridView panel[itemId="broadcastMsgDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'broadcastMessageGrid',
				selector : 'broadcastMessageView broadcastMessageGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'searchTextInput',
				selector : 'broadcastMessageGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'broadcastMessageGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'broadcastMessageGridView smartgrid'
			}, {
				ref : "messageNameFilter",
				selector : ' broadcastMessageFilterView AutoCompleter[itemId="messageNameFilter"]'
			}, {
				ref : "messageDateFilter",
				selector : ' broadcastMessageFilterView textfield[itemId="messageDateFilter"]'
			}, {
				ref : 'fromDateLabel',
				selector : ' broadcastMessageFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : ' broadcastMessageFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateLabel',
				selector : ' broadcastMessageFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'fromEntryDate',
				selector : ' broadcastMessageFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : ' broadcastMessageFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'dateRangeComponent',
				selector : ' broadcastMessageFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'entryDate',
				selector : ' broadcastMessageFilterView button[itemId="entryDate"]'
			}, {
				ref : "statusFilter",
				selector : ' broadcastMessageFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'broadcastMessageView broadcastMessageGridView broadcastMsgGroupActionBarView'
			}, {
				ref : 'withHeaderCheckboxRef',
				selector : 'broadcastMessageView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'sellerfilter',
				selector : ' broadcastMessageFilterView panel[itemId="sellerFilter"]'
			}, {
				ref : 'sellerClientFilterPanel',
				selector : ' broadcastMessageFilterView container[itemId="sellerClientFilter"]'
			}, {
				ref : 'sellerField',
				selector : ' broadcastMessageFilterView panel combobox[itemId="broadcastMsgSellerCode"]'
			},
				{
					ref : 'groupView',
					selector : 'broadcastMessageGridView groupView'
				},
				{
					ref:'filterView',
					selector:'filterView'	
				}
			],
	config : {
		filterData : [],
		dateFilterVal : '12',
		dateFilterLabel : getLabel('latest', 'Latest'),
		dateHandler : null,
		strDefaultMask : '0000000000',
		dateRangeFilterVal : '13',
		datePickerSelectedDate : [],
		dateFilterFromVal : '',
		strStatusVal : 'all',
	    strStatusDesc : 'ALL'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		this.dateHandler = me.getController('GCP.controller.DateHandler');
		
		
		$(document).on("handleCreateBroadcastMessage",function(){
					me.handleBroadcastMsgEntryAction();
					});
		me.control({
			'broadcastMessageView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			/*'broadcastMessageView button[itemId="btnCreateBroadcastMessage"]' : {
				click : function() {
					me.handleBroadcastMsgEntryAction();
				}
			},*/
			' broadcastMessageFilterView' : {
				render : function() {
										
										var useSettingsButton = me.getFilterView()
										.down('button[itemId="useSettingsbutton"]');
										if (!Ext.isEmpty(useSettingsButton)) {
											useSettingsButton.hide();
										}
									var advFilter= me.getFilterView().down('label[itemId="createAdvanceFilterLabel"]');
									if (!Ext.isEmpty(advFilter)) {
										advFilter.hide();
									}
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.renderSellerClientFilter();

				},
				afterrender : function() {
					me.setFilterRetainedValues();
					me.updateFilterFields();
				},
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					if (btn.btnValue !== '7' ) {
						me.setDataForFilter();	
						me.applyQuickFilter();						
					}

				}

			},
			'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleClearSettings();
							}
						},	
			' broadcastMessageFilterView panel combobox[itemId="broadcastMsgSellerCode"]' : {
				select : function(combo, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			/*' broadcastMessageFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.broadcastMsgSummaryViewRender();
				}
			},*/
			'broadcastMessageView broadcastMessageGridView panel[itemId="broadcastMsgDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
				'broadcastMessageFilterView component[itemId="messageDatePicker"]' : {
							render : function() {
								$('#entryDataPicker').datepick({
											monthsToShow : 1,
											changeMonth : false,
											dateFormat : strApplicationDefaultFormat,
											rangeSeparator : '  to  ',
											onClose : function(dates) {
												if (!Ext.isEmpty(dates)) {
													me.datePickerSelectedDate = dates;
													me.dateFilterVal = me.dateRangeFilterVal;
													me.dateFilterLabel = getLabel('daterange', 'Date Range');
													me.handleDateChange(me.dateRangeFilterVal);
													me.setDataForFilter();
													me.applyQuickFilter();									
												}
											}
								}).attr('readOnly',true);;
							}
						},
			'broadcastMessageGridView' : {
				render : function(panel) {
				//	me.broadcastMsgSummaryViewRender();       
					//me.handleSmartGridConfig();
				}
			},
			'broadcastMessageView broadcastMessageFilterView combobox[itemId=statusFilter]' : {
				select : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.updateAppliedFilterSection();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.setDataForFilter();
						me.applyFilter();
						
					}
					
				}
			},
			'broadcastMessageFilterView AutoCompleter[itemId="messageNameFilter"]':
			{
				change : function(btn, opts)
				{
					me.setDataForFilter();
					me.applyFilter();
					me.broadcastMsgSummaryViewRender();
					me.updateAppliedFilterSection();
				}
			},
			'broadcastMessageTitleView' :
			{
				performReportAction : function( btn, opts )
				{
					me.handleReportAction( btn, opts );
				}
			},
			'broadcastMessageGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'broadcastMessageGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'broadcastMessageGridView groupView' :
			{
				
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
							'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
							'gridStateChange' : function(grid) {
								
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
			/*'broadcastMessageGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},*/
			'broadcastMessageGridView toolbar[itemId=broadcastMessageGroupActionBarViewDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
			handleClearSettings:function(){
					var me=this;
					var messageBoxFilterView = me.getBroadcastMessageFilterView();
					var objGroupView = me.getGroupView();
					var clientFilterId;
					/*if(entity_type != '1')					
					{
							clientFilterId=messageBoxFilterView.down('AutoCompleter[itemId="clientCodeId1"]');			
							me.clientFilterVal  = '';
							me.clientFilterDesc = '';
							clientFilterId.setValue(me.clientFilterDesc);
							clientFilterId.suspendEvents();
							clientFilterId.reset();
							clientFilterId.resumeEvents();
					}else{
						clientFilterId=messageBoxFilterView.down('combo[itemId="clientBtn"]');
						me.clientFilterDesc=getLabel('allCompanies', 'All companies');
						me.clientFilterVal='all';
						clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));	
					}*/
					me.dateFilterVal = '12';
					
					me.dateFilterLabel = getLabel('latest', 'Latest');
					me.handleDateChange(me.dateFilterVal);
					
					//var mesgname = me.getSpecificFilterPanel();
					var fldMessageName = me.getMessageNameFilter();							
							fldMessageName.suspendEvents();
							fldMessageName.reset();
							fldMessageName.resumeEvents();
					
					 var seller = me.getSellerField();
							//seller.setRawValue(getLabel('USCASH: United States Of America', 'USCASH'));
					
					 var statusFilter = me.getStatusFilter();
					 statusFilter.suspendEvents();
					 statusFilter.reset();
					 statusFilter.resumeEvents();

					me.filterApplied = 'Q';
					me.filterData=[];
					me.setDataForFilter();
					objGroupView.refreshData();
			   },
			handleClientChange : function(client, clientDesc) {
				var me = this;
			},
		
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getMessageNameFilter())) {
			me.getMessageNameFilter().setValue('');
		}
	},
		    updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var broadcastMessageFilterView = me.getBroadcastMessageFilterView();
				/*if (entity_type !='1') {
					clientCodesFltId = broadcastMessageFilterView.down('combobox[itemId=clientAutoCompleter]');
					if(undefined != me.clientCode && me.clientCode != ''){		
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientCode);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientCode = 'all';			
					}
					
				} else {
					clientCodesFltId = broadcastMessageFilterView.down('combo[itemId="clientBtn"]');
					if(undefined != me.clientCode && me.clientCode != ''){	
						clientCodesFltId.setRawValue(me.clientCode);			
					}	
					else{	
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientCode = 'all';
					}
				}*/
								
				me.handleDateChange(me.dateFilterVal);
			},
	changeFilterParams : function() {
		var me = this;
		var broadcastMessageFilterView = me.getBroadcastMessageFilterView();
		var messageNameFilterAuto = broadcastMessageFilterView
				.down('AutoCompleter[itemId=messageNameFilter]');

		if (!Ext.isEmpty(messageNameFilterAuto)) {
			messageNameFilterAuto.cfgExtraParams = new Array();
		}
		var sellerCombo = broadcastMessageFilterView
				.down('combobox[itemId=broadcastMsgSellerCode]');

		if (!Ext.isEmpty(sellerCombo)) {
			messageNameFilterAuto.cfgExtraParams.push({
						key : '$sellerCode',
						value : sellerCombo.getValue()
					});
		} else if (userType == "1" ) {
			messageNameFilterAuto.cfgExtraParams.push({
						key : '$sellerCode',
						value : strSellerId
					});
		}
	},
			doHandleGroupByChange : function(menu, groupInfo) {
					var me = this;
					if (me.previouGrouByCode === 'ADVFILTER') {
						me.savePrefAdvFilterCode = null;
						me.showAdvFilterCode = null;
						me.filterApplied = 'ALL';
					}
					if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
						me.previouGrouByCode = groupInfo.groupTypeCode;
					} else
						me.previouGrouByCode = null;
				},
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
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
			/*	var objSummaryView = me.getBroadcastMessageGridView(), arrSortState = new Array(), 
				objPref = null, 	gridModel = null, intPgSize = null, showPager = true;
				var colModel = null, arrCols = null;

				if (objGridViewPref ) {
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
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
				}*/
				objGroupView.reconfigureGrid(null);
	},
	handleSpecificFilter : function() {
		var me = this;
		//me.getSearchTextInput().setValue('');
		//me.getStatusFilter().setValue('');
		var msgNameTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'messageName',
					width : '165px',
					cfgTplCls : 'xn-autocompleter-t7',
					itemId : 'messageNameFilter',
					cfgUrl : 'cpon/cponseek/messageNameSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'messageNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgKeyNode : 'name',
					minChars : 1
				});

		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}

		filterPanel.add({
					xtype : 'panel',
					cls : 'xn-filter-toolbar ',
					flex : 1,
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel('messageName', 'Message Name'),
								cls : 'frmLabel'
							}, msgNameTextfield]
				});
	},

	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		if (!Ext.isEmpty(gridHeaderPanel)) {
			gridHeaderPanel.removeAll();
		}
		gridHeaderPanel.add({
					xtype : 'label',
					bodyCls : 'x-portlet',
					//text : getLabel('broadcastMessages', 'Broadcast Messages'),
					padding : '5 0 0 0'
				});
	},

	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		me.setDataForFilter();
		var arrOfParseQuickFilter = [];
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
		grid.loadGridData(strUrl, null);
		me.updateAppliedFilterSection();
		me.broadcastMsgSummaryViewRender();
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
								eventObj) {
							me.handleGridRowDoubleClick(record, grid);
						});
	},
		handleGridRowDoubleClick : function(record, grid) {
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
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);
		if (!Ext.isEmpty(strGroupQuery))
		{
			if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl + ' and ' + strGroupQuery;
			}
		}
		else
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			}

		return strUrl;
	},

	getSummaryFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);

		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '$filter=' + strQuickFilterUrl;
		}

		return strUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {
		var strFilter = '';
		var me = this;
		var filterData = me.filterData;
		var strSqlDateFormat = 'Y-m-d';
		var dtParams = me.getDateParam(me.dateFilterVal);
		var fieldValue1 = Ext.util.Format.date( Ext.Date.parse( dtParams.fieldValue1, 'm-d-Y' ),strSqlDateFormat );
		var fieldValue2 = Ext.util.Format.date( Ext.Date.parse( dtParams.fieldValue2, 'm-d-Y' ),strSqlDateFormat );
		var strTemp = '';
		var strFilterParam = '';
		var isFilterApplied = false;
		for (var index = 0; index < filterData.length; index++) {

			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + fieldValue1
								+ '\'' + ' and ' + 'date\''
								+ fieldValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ fieldValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
				case 'statusFilterOp' :
					var objValue = filterData[index].paramValue1;
					var objUser = filterData[index].makerUser;
					var objArray = objValue.split(',');
					for (var i = 0; i < objArray.length; i++) {
							if( i== 0)
							strTemp = strTemp + '(';
							if(objArray[i] == 12){
								strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 14){
								strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
							}
							else if(objArray[i] == 3){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
							}
							else if(objArray[i] == 11){
								strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
							}
							else if(objArray[i] == 13){
								strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5')) and makerId ne '"+objUser+"' )";
							}
							else if(objArray[i] == 0 || objArray[i] == 1){
								strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'N')";
							}
							else{
								strTemp = strTemp + "(requestState eq "+objArray[i]+")";
							}
							if(i != (objArray.length -1)){
								strTemp = strTemp + ' or ';
							}
							if(i == (objArray.length -1))
							strTemp = strTemp + ')';
					}
				break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + fieldValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+  filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		return strTemp;
	},

	setDataForFilter : function() {
		var me = this;
//		me.getSearchTextInput().setValue('');

		var sellerVal = null;
		var messageNameVal = null, statusVal = null, messageDate = null, jsonArray = [];
		if (!Ext.isEmpty(me.getSellerField())
				&& !Ext.isEmpty(me.getSellerField().getValue())) {
			sellerVal = me.getSellerField().getValue();
		} else if (userType == "1" ) {
			sellerVal = strSellerId;
		}

		if (!Ext.isEmpty(me.getMessageNameFilter())
				&& !Ext.isEmpty(me.getMessageNameFilter().getValue())) {
			messageNameVal = me.getMessageNameFilter().getValue();
		}


		if (!Ext.isEmpty(me.getMessageDateFilter())
				&& !Ext.isEmpty(me.getMessageDateFilter().getValue())) {
			messageDate = me.getMessageDateFilter().getValue();
		}
		if ((!Ext.isEmpty(sellerVal) || userType == "0") && ('false'!=multipleSellersAvailable) ) {
			jsonArray.push({
						paramName : 'sellerCode',
						paramValue1 : encodeURIComponent(sellerVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						fieldLabel : getLabel("lblfinancialinstitution","Financial Institution"),
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(messageNameVal)) {
			jsonArray.push({
						paramName : 'messageName',
						paramValue1 : encodeURIComponent(messageNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						value1 : messageNameVal,
						operatorValue : 'lk',
						fieldLabel : getLabel('messageName','Message Name'),
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(me.getDateParam(index))) {
			var index = me.dateFilterVal;
			var objDateParams = me.getDateParam(index);
			if (index !== '7') {
				jsonArray.push({
							paramName : 'startDate',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							fieldLabel : getLabel("messageDate","Date"),
							dataType : 'D'
						});
				/*
				 * jsonArray.push({ paramName : 'endDate', paramValue1 :
				 * objDateParams.fieldValue1, paramValue2 :
				 * objDateParams.fieldValue2, operatorValue :
				 * objDateParams.operator, dataType : 'D' });
				 */
			}
		}if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())) {
			statusVal = me.getStatusFilter().getValue();
		}
		if (!Ext.isEmpty(statusVal) && "ALL" != statusVal) {
			jsonArray.push({
						paramName : me.getStatusFilter().filterParamName,
						makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
						paramValue1 : encodeURIComponent(statusVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'statusFilterOp',
						fieldLabel : getLabel("status","Status"),
						value1 : me.getStatusFilter().getRawValue(),
						dataType : 'S'
					});
		}

		me.filterData = jsonArray;
	},

	applyFilter : function() {
		var me = this;
		var subGroupInfo = null,groupInfo = null;
		var objGroupView = me.getGroupView();
		if(objGroupView)
		{
			groupInfo = objGroupView.getGroupInfo();
			subGroupInfo = objGroupView.getSubGroupInfo();
		}
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
		
	/*handleSmartGridConfig : function() {
		var me = this;
		var broadcastMsgeGrid = me.getBroadcastMessageGrid();
		var objConfigMap = me.getBroadcastMsgConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(broadcastMsgeGrid))
			broadcastMsgeGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},*/

	/*handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = _GridSizeMaster;
		broadcastMsgeGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : 10,
					stateful : false,
					showEmptyRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex,
								btn, event, record);
					},

					handleMoreMenuItemClick : function(grid, rowIndex,
							cellIndex, menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,
								dataParams.rowIndex, dataParams.columnIndex,
								menu, null, dataParams.record);
					}
				});

		var broadcastMsgDtlView = me.getBroadcastMsgDtlView();
		broadcastMsgDtlView.add(broadcastMsgeGrid);
		broadcastMsgDtlView.doLayout();
	},*/

	/*handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('messageName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitForm('viewBroadcastMessageMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitForm('editBroadcastMessage.form', record, rowIndex);
		}
	},*/
	doHandleRowActions : function (actionName, grid, record,rowIndex)
	{
		var me = this;		
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			var messageName = getDecodedValue(record.get('messageName')).replace(/\\/g, "");
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(messageName,
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitForm('viewBroadcastMessageMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitForm('editBroadcastMessage.form', record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},

	showHistory : function(messageName, url, id) {
	var popup =	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					messageName : messageName,
					identifier : id
				});
	popup.show();
	popup.center();
	},

/*	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		} else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		} else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				cfgCol.locked = objCol.locked;
				cfgCol.width = objCol.width;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
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
			width : 80,
			locked : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						maskPosition : 4
					}]
		};
		return objActionCol;

	},

	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
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
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
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
						text : getLabel('msgActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('msgActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('msgActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('msgActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('msgActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('msgActionDisable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},*/

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isEnabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.requestState == 3 && objData.raw.validFlag != 'Y') {
				isDisabled = true;
			} else if (objData.raw.requestState == 3
					&& objData.raw.validFlag == 'Y') {
				isEnabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		if (isDisabled && isEnabled) {
			isDisabled = isEnabled = false;
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, selectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isEnabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.requestState == 3 && objData.raw.validFlag != 'Y') {
				isDisabled = true;
			} else if (objData.raw.requestState == 3
					&& objData.raw.validFlag == 'Y') {
				isEnabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		if (isDisabled && isEnabled) {
			isDisabled = isEnabled = false;
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit, isEnabled);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit, isEnabled) {
			var me=this;
			var objGroupView = me.getGroupView();
			var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);

							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && isEnabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(strAction, grid, arrSelectedRecords,strActionType, fxType) {
		var me = this;
		/*var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;*/
		var strUrl = Ext.String.format('cpon/broadcastMessage/{0}.srvc?', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,grid, arrSelectedRecords,strActionType);

		} else {
			this.preHandleGroupActions(strUrl, '',  grid, arrSelectedRecords,
								strActionType, strAction);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('msgRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('msgRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, grid,arrSelectedRecords, strActionType,strAction);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		//var grid = this.getGrid();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			//var records = grid.getSelectedRecords();
			/*records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];*/
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.messageName
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
							if(response.responseText != '[]')
						       {
							        var jsonData = Ext.decode(response.responseText);
							        if(!Ext.isEmpty(jsonData))
							        {
							        	for(var i =0 ; i<jsonData.length;i++ )
							        	{
							        		var arrError = jsonData[i].errors;
							        		if(!Ext.isEmpty(arrError))
							        		{
							        			for(var j =0 ; j< arrError.length; j++)
									        	{
								        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									        	}
							        		}
							        		
							        	}
								        if('' != errorMessage && null != errorMessage)
								        {
								         //Ext.Msg.alert("Error",errorMessage);
								        	Ext.MessageBox.show({
												title : getLabel('instrumentErrorPopUpTitle','Error'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
								        } 
							        }
						       }
							me.enableDisableGroupActions('0000000000', true);
							groupView.refreshData();
							if (strAction === 'discard')
								me.broadcastMsgSummaryViewRender();
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
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	/*columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		if (colId === 'col_isUrgent') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('isUrgent'))
						&& 'Y' == record.get('isUrgent')) {
					strRetValue = 'Yes';
				} else {
					strRetValue = 'No';
				}
			}
		}
		if (colId === 'col_displayLevel') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('displayLevel'))
						&& 'C' == record.get('displayLevel')) {
					strRetValue = 'Customer';
				} else if (!Ext.isEmpty(record.get('displayLevel'))
						&& 'B' == record.get('displayLevel')) {
					strRetValue = 'Bank';
				} else {
					strRetValue = 'Both';
				}
			}
		}

		return strRetValue;
	},
*/
	getBroadcastMsgConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"messageName" : 180,
			"isUrgent" : 70,
			"displayLevel" : 100,
			"Message Type ":100,
			"startDate" : 100,
			"endDate" : 100,
			"requestStateDesc" : 100
		};

		arrColsPref = [{
					"colId" : "messageName",
					"colDesc" : getLabel('messageName', 'Message Name')
				}, {
					"colId" : "isUrgent",
					"colDesc" :  getLabel('urgent', 'Urgent')
				}, {
					"colId" : "displayLevel",
					"colDesc" : getLabel("dispLevel", "Display Level")
				},  {
					"colId" : "textorHtmlDesc",
					"colDesc" : getLabel("msgBody", "Message Body")
				},{
					"colId" : "startDateTime",
					"colDesc" : getLabel("startDt", "Start Date")
				}, {
					"colId" : "endDateTime",
					"colDesc" : getLabel("endDt", "End Date")
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : getLabel("status", "Status")
				}];

		storeModel = {
			fields : ['messageName', 'isUrgent', 'displayLevel','textorHtmlDesc',
					'clientSegmentId', 'startDateTime', 'endDateTime',
					'requestStateDesc', 'identifier', 'history', '__metadata'],
			proxyUrl : 'cpon/broadcastMessage.json',
			rootNode : 'd.profile',
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
	 * Finds all strings that matches the searched value in each grid cells.
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
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
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

	broadcastMsgSummaryViewRender : function() {
		var me = this;
		var broadcastMsgSummaryPanel = me.getBroadcastMsgSummaryPanel();
		var broadcastMsgSummViewRef1 = me.getBroadcastMessageSummaryView();
		if (!Ext.isEmpty(broadcastMsgSummViewRef1)
				&& !Ext.isEmpty(broadcastMsgSummaryPanel)) {
			broadcastMsgSummViewRef1.remove(broadcastMsgSummaryPanel);
		}
	
	var broadcastMessageSummaryView = me.getBroadcastMessageSummaryView();
		var strInfoUrl = me.generateInformationUrl();
		var broadcastMsgSummaryViewRef = me.getBroadcastMessageSummaryView();
		strInfoUrl = 'cpon/broadcastMessageCount.json';
		Ext.Ajax.request({
					url : strInfoUrl,
					method : "POST",
					params:me.getSummaryFilterUrl(),
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
						var jsonData = data.d.profile;
						
						summaryData=[{
							title:getLabel('urgentCount'," Urgent"),
							amount:"# " + jsonData[0].urgentCount
							},
							{
							title:getLabel('customercount'," Customer Broadcast"),
							amount:"# " +jsonData[0].customerCount
							},
							{
							title:getLabel('bankBroadcast'," Bank Broadcast"),
							amount:"# " + jsonData[0].bankCount
							}
							]
							
						
						}
						else
						{
							summaryData=[{
							title:getLabel('urgentCount'," Urgent"),
							amount:"#0.00"
							},
							{
							title:getLabel('customercount'," Customer Broadcast"),
							amount:"#0.00"
							},
							{
							title:getLabel('bankBroadcast'," Bank Broadcast"),
							amount:"#0.00"
							}
							]
						}
						$('#summaryCarousal').carousel({
							data : summaryData,
							titleNode : "title",
							contentNode :"amount"
							});
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
	},    
	updateAppliedFilterSection : function()
	{
		var me = this;
		var arrOfParseQuickFilter = [];
		var filterDataTemp = [];
		filterDataTemp = me.filterData;
		
		for(var i =0 ; i<filterDataTemp.length;i++ )
		{
			var arrFilter = filterDataTemp[i];
			if(arrFilter.paramName == 'statusFilter')
			{
				filterDataTemp[i].operatorValue = 'eq'
			}
			
		}
		       
	    if(!Ext.isEmpty(filterDataTemp) && filterDataTemp.length >= 1)
		{
		    arrOfParseQuickFilter = generateUserFilterArray(filterDataTemp);			     
	    }
	    if(arrOfParseQuickFilter) 
	    {
	    	me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
	    }

	},
	handleBroadcastMsgEntryAction : function() {
		var me = this;
		var form;
		var sellerFilterField = null;
		var selectedSellerId = null;
		sellerFilterField = me.getSellerField();
		if (!Ext.isEmpty(sellerFilterField)
				&& !Ext.isEmpty(sellerFilterField.getValue())) {
			selectedSellerId = sellerFilterField.getValue();
		} else if (userType == "1" ) {
			selectedSellerId = strSellerId;
		}
		var strUrl = 'addBroadcastMessageMst.form';
		form = document.createElement('FORM');
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerID',
				selectedSellerId));
		me.setFilterParameters(form);
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'messageName',
				''));

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

	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var messageName = '';
							var messageDate = '';
							var status = '';

							if (!Ext.isEmpty(me.getMessageNameFilter())
									&& !Ext.isEmpty(me.getMessageNameFilter()
											.getValue())) {
								messageName = me.getMessageNameFilter()
										.getValue();
							} else {
								messageName = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getStatusFilter())
									&& !Ext.isEmpty(me.getStatusFilter()
											.getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}

							if (!Ext.isEmpty(me.getMessageDateFilter())
									&& !Ext.isEmpty(me.getMessageDateFilter()
											.getValue())) {
								messageDate = me.getMessageDateFilter()
										.getValue();
							} else {
								messageDate = getLabel('none', 'None');;
							}

							tip.update(getLabel('messageName', 'Message Name')
									+ ' : ' + messageName + '<br/>'
									+ getLabel('messageDate', 'Date') + ' : '
									+ messageDate + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
						}
					}
				});
	},

	generateInformationUrl : function() {
		var me = this;
		var strUrl = 'cpon/broadcastMessageCount.json';
		var strSqlDateFormat = 'Y-m-d';
		var dtParams = me.getDateParam(me.dateFilterVal);
		var operator = dtParams.operator;
		var fieldValue1 = Ext.util.Format.date( Ext.Date.parse( dtParams.fieldValue1, 'm-d-Y' ),strSqlDateFormat );
		var fieldValue2 = Ext.util.Format.date( Ext.Date.parse( dtParams.fieldValue2, 'm-d-Y' ),strSqlDateFormat );

		if (!Ext.isEmpty(me.dateFilterVal)) {
			if (Ext.isEmpty(dtParams.fieldValue1)) {
				fieldValue1 = me.dateFilterFromVal;
				fieldValue2 = me.dateFilterToVal;
			}
			if (!Ext.isEmpty(fieldValue1) || !Ext.isEmpty(fieldValue2)) {
				if ("eq" === dtParams.operator) {
					strUrl = strUrl + '?&$filter=' + 'startDate' + ' '
							+ operator + ' ' + 'date\'' + fieldValue1 + '\'';
				} else {
					strUrl = strUrl + '?&$filter=' + 'startDate' + ' '
							+ operator + ' ' + 'date\'' + fieldValue1 + '\''
							+ ' and ' + 'date\'' + fieldValue2 + '\'';
				}
			}
		}
		return strUrl;
	},

/*	applyQuickFilter : function() {
		var me = this;
		var grid = me.getNonCMSGrid();
		me.filterApplied = 'Q';
		// TODO : Currently both filters are in sync
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '='
					+ csrfTokenValue;
			me.getNonCMSGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},*/
		applyQuickFilter : function()
			{
				var me = this;
				 var objGroupView = me.getGroupView();
				 objGroupView.refreshData();				
			},
/*	handleDateChange : function(index) {
		var me = this;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index);

		if (index == '7') {
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
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
			me.getDateLabel().setText(getLabel('date', 'Date') + "("
					+ me.dateFilterLabel + ")");
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
*/
			handleDateChange : function( index )
			{
				var me = this;	
				var objDateParams = me.getDateParam( index );
				var datePickerRef=$('#entryDataPicker');

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText( getLabel( 'messageDate', 'Start Date' ) + "(" + me.dateFilterLabel + ")" );
				}
				
				var vFromDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue1, 'm-d-Y' ),strExtApplicationDateFormat );
				var vToDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue2, 'm-d-Y' ),strExtApplicationDateFormat );
				
				
				if (index == '13')
				{
					if (objDateParams.operator == 'eq')
						datePickerRef.val(vFromDate);
					else
						datePickerRef.val([vFromDate+' to '+vToDate]);
				} 
				else 
				{
					if (index === '1' || index === '2' || index === '12') 
					{
						if (index === '12') 
							datePickerRef.val([vFromDate+' to '+vToDate]);
						else
							datePickerRef.val(vFromDate);
				} 
				else
					datePickerRef.val([vFromDate+' to '+vToDate]);		
		}
	},
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'm-d-Y';
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
					// Latest
						var fromDate = new Date(Ext.Date.parse(latestFromDate, strExtApplicationDateFormat));
						var toDate = new Date(Ext.Date.parse(latestToDate, strExtApplicationDateFormat));		
						fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
						operator = 'bt';
						break;
			case '13' :
						// Date Range
							if (me.datePickerSelectedDate.length == 1) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
							}else if (me.datePickerSelectedDate.length == 2) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
									operator = 'bt';
							}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
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
			loanCenterDownloadPdf : 'pdf',
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
		var grid = me.getGrid();
		viscols = grid.getAllVisibleColumns();
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrSortColumn[col.dataIndex]) {
				if (colMap[arrSortColumn[col.dataIndex]]) {
					// ; do nothing
				} else {
					colMap[arrSortColumn[col.dataIndex]] = 1;
					colArray.push(arrSortColumn[col.dataIndex]);

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
	renderSellerClientFilter : function() {
		var me = this;
		var sellerFilterPanel ;
		var isMultipleClientAvailable = false;
		var storeDataSeller = null;
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});
		var objStoreSeller = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		
		sellerFilterPanel = me.getSellerfilter();
		if (objStoreSeller.getCount() > 1) {
	        multipleSellersAvailable = true;
	    }
		if(Ext.isEmpty(sellerFilterPanel))
		{
			sellerFilterPanel = null;
		}
		else
	{
	if (!Ext.isEmpty(sellerFilterPanel)) {
			sellerFilterPanel.removeAll();
		}

		if (userType == "0" ) {
			sellerFilterPanel.add([{
				xtype : 'label',
				text : getLabel('lblfinancialinstitution',
						'Financial Institution'),
				 cls: 'frmLabel',
				style: {
					padding: '0px 0px 0px 10px !important'
				}
			}, {
				xtype : 'combobox',
				padding : '0 0 0 10',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger ux_width17 ',
				itemId : 'broadcastMsgSellerCode',
				valueField : 'CODE',
				displayField : 'DESCR',
				width : 165,
				name : 'comboSeller',
				editable : false,
				value : strSellerId,
				store : objStoreSeller,
				listeners : {
					'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
					        }
					  } 

			}]);
			sellerFilterPanel.up("container[itemId='sellerClientFilter']").flex = 1;
			if(objStoreSeller.getCount() > 1)
			{
				sellerFilterPanel.show();
			}
			else
			{
				sellerFilterPanel.hide();
			}
		} else {
			if(objStoreSeller.getCount() > 1)
			{
				sellerFilterPanel.show();
			}
			else
			{
				sellerFilterPanel.hide();
			}
		}
   }
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var jsonArray = [];
		var fldMessageName = null;
		var strMessageName = null;
		var strMessageDesc = null;
		var strStatusVal = null;
		var strStatusDesc = null;
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index) && !Ext.isEmpty(objDateParams)) {
			jsonArray.push({
						'index' : index,
						'dateParams' : objDateParams
					});
		}

		var sellerFilterField = null;
		var selectedSellerId = null;
		sellerFilterField = me.getSellerField();
		if (!Ext.isEmpty(sellerFilterField)
				&& !Ext.isEmpty(sellerFilterField.getValue())) {
			selectedSellerId = sellerFilterField.getValue();
		} else if (userType == "1" ){
			selectedSellerId = strSellerId;
		}

		if (!Ext.isEmpty(me.getMessageNameFilter())
				&& !Ext.isEmpty(me.getMessageNameFilter().getValue())) {
			strMessageName = me.getMessageNameFilter().getValue();
			strMessageDesc = me.getMessageNameFilter().getRawValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			strStatusVal = me.getStatusFilter().getValue();
			strStatusDesc = me.getStatusFilter().getRawValue();
		}

		arrJsn['sellerId'] = selectedSellerId;
		arrJsn['messageName'] = strMessageName;
		arrJsn['messageDesc'] = strMessageDesc;
		arrJsn['status'] = strStatusVal;
		arrJsn['statusDesc'] = strStatusDesc;
		arrJsn['dateFilter'] = jsonArray;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setFilterRetainedValues : function() {
		var me = this;
		var clinetFilterField = null;
		var fldMessageName = null;
		var selectedSellerId = null;
		var fldStatus = null;

		/* Set Seller Id Filter Value
		var selectedSellerId = me.getSellerField();
		if (!Ext.isEmpty(selectedSellerId)) {
			selectedSellerId.setValue(strSellerId);
		}*/

		fldStatus = me.getStatusFilter();
		if (!Ext.isEmpty(fldStatus)) {
			fldStatus.setValue(filterStatus);
		}

		fldMessageName = me.getMessageNameFilter();
		if (!Ext.isEmpty(filterMessageName) && !Ext.isEmpty(fldMessageName)) {
			fldMessageName.store.loadRawData({
						d : {
							"filter" : [{
										"name" : filterMessageName,
										"value" : filterMessageDesc
									}]

						}
					});
			fldMessageName.suspendEvents();
			fldMessageName.setValue(filterMessageName);
			fldMessageName.resumeEvents();
		}
		me.changeFilterParams();
	}
});
function getDecodedValue(str)
{
	var parser = new DOMParser;
	var dom = parser.parseFromString(
	    '<!doctype html><body>' + str,
	    'text/html');
	var decodedString = dom.body.textContent;
	return decodedString ;
}