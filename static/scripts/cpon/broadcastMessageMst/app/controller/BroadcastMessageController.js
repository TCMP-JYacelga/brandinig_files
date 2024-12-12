Ext.define('GCP.controller.BroadcastMessageController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.BroadcastMessageView',
			'GCP.view.BroadcastMessageGridView', 'GCP.view.HistoryPopup'],
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
				selector : 'broadcastMessageView broadcastMessageFilterView panel[itemId="specificFilter"]'
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
				selector : 'broadcastMessageView broadcastMessageFilterView'
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
				selector : 'broadcastMessageView broadcastMessageFilterView AutoCompleter[itemId="messageNameFilter"]'
			}, {
				ref : "messageDateFilter",
				selector : 'broadcastMessageView broadcastMessageFilterView textfield[itemId="messageDateFilter"]'
			}, {
				ref : 'fromDateLabel',
				selector : 'broadcastMessageView broadcastMessageFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : 'broadcastMessageView broadcastMessageFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateLabel',
				selector : 'broadcastMessageView broadcastMessageFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'fromEntryDate',
				selector : 'broadcastMessageView broadcastMessageFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'broadcastMessageView broadcastMessageFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'broadcastMessageView broadcastMessageFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'entryDate',
				selector : 'broadcastMessageView broadcastMessageFilterView button[itemId="entryDate"]'
			}, {
				ref : "statusFilter",
				selector : 'broadcastMessageView broadcastMessageFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'broadcastMessageView broadcastMessageGridView broadcastMsgGroupActionBarView'
			}, {
				ref : 'withHeaderCheckboxRef',
				selector : 'broadcastMessageView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'sellerfilter',
				selector : 'broadcastMessageView broadcastMessageFilterView panel[itemId="sellerFilter"]'
			}, {
				ref : 'sellerClientFilterPanel',
				selector : 'broadcastMessageView broadcastMessageFilterView container[itemId="sellerClientFilter"]'
			}, {
				ref : 'sellerField',
				selector : 'broadcastMessageView broadcastMessageFilterView panel combobox[itemId="broadcastMsgSellerCode"]'
			},
			{
					ref : 'groupView',
					selector : 'broadcastMessageGridView groupView'
				}
			],
	config : {
		filterData : [],
		dateFilterVal : '12',
		dateFilterLabel : getLabel('latest', 'Latest'),
		dateHandler : null,
		strDefaultMask : '0000000000'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		this.dateHandler = me.getController('GCP.controller.DateHandler');
		me.control({
			'broadcastMessageView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'broadcastMessageView button[itemId="btnCreateBroadcastMessage"]' : {
				click : function() {
					me.handleBroadcastMsgEntryAction();
				}
			},
			'broadcastMessageView broadcastMessageFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.renderSellerClientFilter();

				},
				afterrender : function() {
					me.setFilterRetainedValues();
				},
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					if (btn.btnValue !== '7' && btn.btnValue !== '12') {
						me.setDataForFilter();											
					}

				}
			},
			'broadcastMessageView broadcastMessageFilterView panel combobox[itemId="broadcastMsgSellerCode"]' : {
				select : function(combo, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
				}
			},
			'broadcastMessageView broadcastMessageFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
					me.broadcastMsgSummaryViewRender();
				}
			},
			'broadcastMessageView broadcastMessageGridView panel[itemId="broadcastMsgDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
			'broadcastMessageGridView' : {
				render : function(panel) {
					me.broadcastMsgSummaryViewRender();
					//me.handleSmartGridConfig();
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
								//me.toggleSavePrefrenceAction(true);
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
	resetAllFilters : function() {
		var me = this;
		if (!Ext.isEmpty(me.getMessageNameFilter())) {
			me.getMessageNameFilter().setValue('');
		}
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
		} else {
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
					itemId : 'messageNameFilter',
					cfgUrl : 'cpon/cponseek/messageNameSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'messageNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgKeyNode : 'name'
				});

		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}

		filterPanel.add({
					xtype : 'panel',
					cls : 'xn-filter-toolbar ',
					flex : 0.4,
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
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
		grid.loadGridData(strUrl, null);
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
			strUrl += '?$filter=' + strQuickFilterUrl;
		}

		return strUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var strFilter = '';
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
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
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
		} else {
			sellerVal = strSellerId;
		}

		if (!Ext.isEmpty(me.getMessageNameFilter())
				&& !Ext.isEmpty(me.getMessageNameFilter().getValue())) {
			messageNameVal = me.getMessageNameFilter().getValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().originalValue;

			if (statusVal == 0 || statusVal == 1)  //New and modifiedDraft
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (statusVal == 12 )  //Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'Y',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (statusVal == 3 )  //Authorized
			{
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'Y',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (statusVal == 6 )  //Disabled
			{
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}

		if (!Ext.isEmpty(me.getMessageDateFilter())
				&& !Ext.isEmpty(me.getMessageDateFilter().getValue())) {
			messageDate = me.getMessageDateFilter().getValue();
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : 'sellerCode',
						paramValue1 : sellerVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(messageNameVal)) {
			jsonArray.push({
						paramName : 'messageName',
						paramValue1 : messageNameVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(statusVal)) {
			jsonArray.push({
						paramName : me.getStatusFilter().filterParamName,
						paramValue1 : statusVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(me.getDateParam(index))) {
			var index = me.dateFilterVal;
			var objDateParams = me.getDateParam(index);
			if (index !== '7' && index !== '12') {
				jsonArray.push({
							paramName : 'startDate',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D'
						});
				/*
				 * jsonArray.push({ paramName : 'endDate', paramValue1 :
				 * objDateParams.fieldValue1, paramValue2 :
				 * objDateParams.fieldValue2, operatorValue :
				 * objDateParams.operator, dataType : 'D' });
				 */
			}
		}

		me.filterData = jsonArray;
	},

	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
		
	doHandleRowActions : function (actionName, grid, record,rowIndex)
	{
		var me = this;		
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
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
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					messageName : messageName,
					identifier : id
				}).show();
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

		
	handleGroupActions : function(actionName, grid, arrSelectedRecords,strActionType, fxType) {
		var me = this;
		/*var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;*/
		var strUrl = Ext.String.format('cpon/broadcastMessage/{0}.srvc', actionName);
		if (actionName === 'reject') {
			this.showRejectVerifyPopUp(actionName, strUrl, grid,
			arrSelectedRecords, strActionType);

		} else {
			this.preHandleGroupActions(strUrl, '',  grid, arrSelectedRecords,
								strActionType, actionName);
		}

	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('msgRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('msgRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, grid,arrSelectedRecords, strActionType,strAction);
						}
					}
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
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
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
					"colDesc" : "Message Name"
				}, {
					"colId" : "isUrgent",
					"colDesc" : "Urgent"
				}, {
					"colId" : "displayLevel",
					"colDesc" : "Display Level"
				},  {
					"colId" : "textorHtmlDesc",
					"colDesc" : "Message Body"
				},{
					"colId" : "startDateTime",
					"colDesc" : "Start Date"
				}, {
					"colId" : "endDateTime",
					"colDesc" : "End Date"
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : "Status"
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

		var strInfoUrl = me.generateInformationUrl();
		var broadcastMsgSummaryViewRef = me.getBroadcastMessageSummaryView();
		strInfoUrl = 'cpon/broadcastMessageCount.json'
				+ me.getSummaryFilterUrl();
		Ext.Ajax.request({
					url : strInfoUrl,
					method : "POST",
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							broadcastMsgSummaryViewRef
									.createSummaryPanelView(data.d.profile);
						}
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
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
		} else {
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
		var dtParams = me.getDateParam(me.dateFilterVal);
		var operator = dtParams.operator;
		var fieldValue1 = dtParams.fieldValue1;
		var fieldValue2 = dtParams.fieldValue2;

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

	applyQuickFilter : function() {
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
		var sellerFilterPanel = me.getSellerfilter();
		var multipleSellersAvailable = false;
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
		if (objStoreSeller.getCount() > 1) {
			multipleSellersAvailable = true;
		}
		if (!Ext.isEmpty(sellerFilterPanel)) {
			sellerFilterPanel.removeAll();
		}

		if (userType == "0" && multipleSellersAvailable) {
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
				store : objStoreSeller

			}]);
			sellerFilterPanel.show();
		} else {
			sellerFilterPanel.hide();
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
		} else {
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

		// Set Seller Id Filter Value
		var selectedSellerId = me.getSellerField();
		if (!Ext.isEmpty(selectedSellerId)) {
			selectedSellerId.setValue(strSellerId);
		}

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
