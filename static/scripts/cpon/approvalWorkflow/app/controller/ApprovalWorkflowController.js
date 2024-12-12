Ext.define('GCP.controller.ApprovalWorkflowController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ApprovalWorkflowView',
			'GCP.view.ApprovalWorkflowFilterView',
			'GCP.view.ApprovalWorkflowGridView', 'GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'approvalWorkflowView',
				selector : 'approvalWorkflowView'
			}, {
				ref : 'approvalWorkflowTitleView',
				selector : 'approvalWorkflowView approvalWorkflowTitleView'
			}, {
				ref : 'approvalWorkflowFilterView',
				selector : 'approvalWorkflowView approvalWorkflowFilterView'
			}, {
				ref : 'approvalWorkflowGridView',
				selector : 'approvalWorkflowView approvalWorkflowGridView'
			}, {
				ref : 'groupView',
				selector : 'approvalWorkflowGridView groupView'
			}, {
				ref : 'approvalWorkflowGrid',
				selector : 'approvalWorkflowView approvalWorkflowGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'approvalWorkflowDtlView',
				selector : 'approvalWorkflowView approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'approvalWorkflowView approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'approvalWorkflowView approvalWorkflowGridView toolbar[itemId="btnCreateNewToolBar"]'
			}, {
				ref : 'groupActionBar',
				selector : 'approvalWorkflowView approvalWorkflowGridView approvalWorkflowGroupActionBar'
			}, {
				ref : 'searchTextInput',
				selector : 'approvalWorkflowGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'approvalWorkflowGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'approvalWorkflowGridView smartgrid'
			}, {
				ref : 'clientCodesFltCombo',
				selector : 'approvalWorkflowView approvalWorkflowFilterView combo[itemId=clientCodesFltId]'
			}, {
				ref : 'clientInlineBtn',
				selector : 'approvalWorkflowView approvalWorkflowFilterView button[itemId="clientBtn"]'
			}],
	config : {
		filterData : [],
		strDefaultMask : '000000000000000000'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		$(document).on('addApprWorkflow', function() {
					me.handleMatrixEntryAction();
				});
		me.control({
			'approvalWorkflowView approvalWorkflowGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateNewMatrix"]' : {
				click : function() {
					me.handleMatrixEntryAction();
				}
			},
			'approvalWorkflowGridView' : {
				render : function(panel) {
					// me.handleSmartGridConfig();
					// me.setFilterRetainedValues();
//					me.handleGridHeader();
				}
			},
			'approvalWorkflowGridView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					// me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				afterrender : function(panel, opts) {
					me.setFilterRetainedValues();
				}
			},
			'approvalWorkflowGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'approvalWorkflowGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'approvalWorkflowGridView toolbar[itemId=approvalWorkflowGroupActionBar_Dtl]' : {
				performGroupAction : function(btn, opts) {
					me.doHandleGroupActions(btn);
				}
			},
			'approvalWorkflowView approvalWorkflowGridView panel[itemId="approvalWorkflowDtlView"]' : {
				render : function() {
					me.setInfoTooltip();
//					me.handleGridHeader();
				}
			},
			'approvalWorkflowView approvalWorkflowFilterView combobox[itemId=sellerFltId]' : {
				select : function(btn, opts) {
					me.resetAllFilters();
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'approvalWorkflowView approvalWorkflowFilterView' : {
				handleClientChange : function(code, desc) {
					me.clientCode = code;
					me.clientDesc = desc;
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'approvalWorkflowView approvalWorkflowFilterView combobox[itemId=statusFltId]' : {
				select : function(btn, opts) {
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			},
			'approvalWorkflowView approvalWorkflowFilterView combobox[itemId=defaultMatrixFltId]' : {
				select : function(btn, opts) {
					me.changeFilterParams();
					me.setDataForFilter();
					me.applyFilter();
				},
				change : function(combo, newValue, oldValue, eOpts) {
					if (newValue == '' || null == newValue) {
						me.changeFilterParams();
						me.setDataForFilter();
						me.applyFilter();
					}
				}
			}
		});
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		grid.loadGridData(strUrl, null, null, false);
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		objGroupView.reconfigureGrid(null);
	},
	resetAllFilters : function() {
		var me = this;
		var filterView = me.getApprovalWorkflowFilterView();
		var defaultMatrixName = filterView
				.down('combobox[itemId=defaultMatrixFltId]');
		var statusName = filterView.down('combobox[itemId=statusFltId]');
		if (isClientUser())
			if (!Ext.isEmpty(me.getClientInlineBtn())) {
				me.getClientInlineBtn().setText(getLabel('all', 'All'));
			} else if (!Ext.isEmpty(me.getClientCodesFltCombo())) {
				me.getClientCodesFltCombo().setValue('');
			}
		if (!Ext.isEmpty(defaultMatrixName)) {
			defaultMatrixName.setValue('');
		}
		if (!Ext.isEmpty(statusName)) {
			statusName.setValue('');
		}
		return;
	},
	setFilterRetainedValues : function() {
		var me = this;
		var arrJson = [];
		var form = document.createElement('FORM');
		var filterView = me.getApprovalWorkflowFilterView();

		// Set Client Name Filter Value
		var clientCodesFltId = filterView
				.down('combobox[itemId=clientCodesFltId]');

		if (userType == '0') {
			clientCodesFltId.store.loadRawData({
						d : {
							"preferences" : [{
										"CODE" : strClientId,
										"DESCR" : filterClientDescr
									}]
						}
					});
			clientCodesFltId.suspendEvents();
			clientCodesFltId.setValue(strClientId);
			clientCodesFltId.resumeEvents();
			me.clientCode = strClientId;
			me.clientDesc = filterClientDescr;

		} else {
			clientCodesFltId.setValue(strClientId);
			me.clientDesc = filterClientDescr;
		}

		var defaultMatrixName = filterView
				.down('combobox[itemId=defaultMatrixFltId]');
		var statusName = filterView.down('combobox[itemId=statusFltId]');

		defaultMatrixName.store.loadRawData({
					"filterList" : [{
								"name" : filterDefaultMatrix,
								"value" : filterDefaultMatrixDesc
							}]

				});

		defaultMatrixName.suspendEvents();
		defaultMatrixName.setValue(filterDefaultMatrix);
		defaultMatrixName.resumeEvents();

		statusName.store.loadRawData([{
					"name" : filterStatus,
					"value" : filterStatusDesc
				}]

		);

		statusName.suspendEvents();
		statusName.setValue(filterStatus);
		statusName.resumeEvents();

	},

	changeFilterParams : function() {
		var me = this;
		var approvalFilterView = me.getApprovalWorkflowFilterView();
		var clientCodesFltId = approvalFilterView
				.down('combobox[itemId=clientCodesFltId]');
		// var sellerCombo = approvalFilterView
		// .down('combobox[itemId=sellerFltId]');

		var defaultMatrixName = approvalFilterView
				.down('combobox[itemId=defaultMatrixFltId]');

		if (!Ext.isEmpty(clientCodesFltId)) {
			clientCodesFltId.cfgExtraParams = new Array();
		}

		if (!Ext.isEmpty(defaultMatrixName)) {
			defaultMatrixName.cfgExtraParams = [{
						key : '$clientId',
						value : clientCodesFltId.getValue()
					}];
		}
	},
	handleGridHeader : function() {
		var me = this;
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		createNewPanel.add({
					xtype : 'button',
					border : 0,
					glyph : 'xf055@fontawesome',
					cls : 'ux_font-size14 xn-content-btn ux-button-s',
					text : getLabel('createNewMatrix',
							'Create New Approval Matrix		  Workflow'),
					parent : this,
					itemId : 'btnCreateNewMatrix'
				});

	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		return strQuickFilterUrl;
	},
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
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
	setDataForFilter : function() {
		var me = this;
		// me.getSearchTextInput().setValue('');
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this;
		var sellerVal = null, clientVal = null, matrixNameVal = null, matrixTypeVal = null, clientCodeVal = null, statusVal = null, subCategoryVal = null, jsonArray = [];
		var clientParamName = null, clientNameOperator = null;

		var approvalWorkflowFilterView = me.getApprovalWorkflowFilterView();

		var clientCodesFltId = approvalWorkflowFilterView
				.down('combobox[itemId=clientCodesFltId]');

		if (!Ext.isEmpty(clientCodesFltId)
				&& !Ext.isEmpty(clientCodesFltId.getValue())) {
			clientCodeVal = clientCodesFltId.getValue();
		}

		if (userType == '0') {
			clientParamName = 'clientCode';
			clientNameOperator = 'lk';
			clientCodeVal = clientCodesFltId.getRawValue();
			clientVal = me.clientDesc;
		} else {
			clientParamName = 'approvalClientId';
			clientNameOperator = 'eq';
			clientVal = me.clientCode;
		}

		if (!Ext.isEmpty(me.clientCode) && me.clientCode != 'all') {
			jsonArray.push({
						paramName : clientParamName,
						paramValue1 : clientVal,
						operatorValue : clientNameOperator,
						dataType : 'S'
					});
		}

		var defaultMatrixName = approvalWorkflowFilterView
				.down('combobox[itemId=defaultMatrixFltId]');

		var statusName = approvalWorkflowFilterView
				.down('combobox[itemId=statusFltId]');

		if (!Ext.isEmpty(defaultMatrixName)
				&& !Ext.isEmpty(defaultMatrixName.getValue())) {
			jsonArray.push({
						paramName : 'defaultMatrix',
						paramValue1 : defaultMatrixName.getValue(),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(statusName)) {
			statusVal = statusName.getValue();
		}

		if (!Ext.isEmpty(statusVal) && 'ALL' != statusVal) {
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'workflowIsSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'workflowValidFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'workflowValidFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			} else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'workflowIsSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (strInFlag) // Used for Submitted & Rejected status
			{
				jsonArray.push({
							paramName : 'workflowRequestState',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						});
			} else {
				jsonArray.push({
							paramName : 'workflowRequestState',
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}

		return jsonArray;
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
	handleSmartGridConfig : function() {
		var me = this;
		var approvalWorkflowGrid = me.getApprovalWorkflowGrid();
		var objConfigMap = me.getApprovalWorkflowConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(approvalWorkflowGrid))
			approvalWorkflowGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = _GridSizeMaster;
		approvalWorkflowGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_panel-transparent-background  ux_largepaddinglr ux_largepadding-bottom ux_largemargin-bottom',
			// padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
		});

		var approvalWorkflowDtlView = me.getApprovalWorkflowDtlView();
		approvalWorkflowDtlView.add(approvalWorkflowGrid);
		approvalWorkflowDtlView.doLayout();
	},

	doHandleRowIconClick : function(actionName, objGrid, record, rowIndex) {
		var me = this;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.doHandleGroupActions(actionName, objGrid, [record],
					'groupAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('axmName'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewTcwAuthMatrixWorkflowMst.form', record,
					rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editTcwAuthMatrixWorkflowMst.form', record,
					rowIndex);
		}
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
	showHistory : function(matrixName, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					identifier : id,
					matrixName : matrixName
				}).show();
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;

				if ((cfgCol.colId == 'rClientDesc' && userType == '0')
						|| isMultipleClientAvailable
						|| (cfgCol.colId != 'rClientDesc')) {
					arrCols.push(cfgCol);
				}
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
				/*
				 * blnRetValue = me.isRowIconVisible(store, record, jsonData,
				 * null, arrMenuItems[a].maskPosition);
				 */
				// arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,
			locked : true,
			items : [{
						text : getLabel('actionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('actionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('actionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('actionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('actionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('actionDisable', 'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmit);
	},
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmit) {
		var me = this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView
				.down('toolbar[itemId="groupActionToolBar"]');
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
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format(
				'services/approvalMatrixWorkflowList/{0}', strAction);
		strUrl = strUrl + ".srvc?";
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords);
		} else {
			this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords);
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('rejectPopupTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('RejectRemark', 'Reject Remark');
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
							me.preHandleGroupActions(strActionUrl, text, grid,
									record);
						}
					}
				});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords) {
		var me = this;
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			for (var index = 0; index < arrSelectedRecords.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore()
									.indexOf(arrSelectedRecords[index])
									+ 1,
							identifier : arrSelectedRecords[index].data.identifier,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions('0000000000', true);
							//grid.refreshData();
							me.applyFilter();
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								Ext.each(jsonData[0].errors, function(error,
												index) {
											errorMessage = errorMessage
													+ error.errorMessage
													+ "<br/>";
										});
								if ('' != errorMessage && null != errorMessage) {
									Ext.Msg.alert("Error", errorMessage);
								}
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
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_axmName') {
			if (!Ext.isEmpty(record.get('defaultAxmcode'))
					&& record.get('defaultAxmcode') == 'MAKERCHECKER') {
				strRetValue = getLabel('makerchecker', 'Maker-Checker');
			} else
				strRetValue = value;
		} else
			strRetValue = value;

		return strRetValue;
	},

	getApprovalWorkflowConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"clientDesc" : '25%',
			"axmType" : '30%',
			"axmName" : '25%',
			"axmCurrency" : '20%',
			"noOfSlabs" : '20%',
			"requestStateDesc" : '20%'
		};

		arrColsPref = [{
					"colId" : "rClientDesc",
					"colDesc" : "Client"
				}, {
					"colId" : "axmName",
					"colDesc" : "Default Matrix"
				}, {
					"colId" : "requestStateDesc",
					"colDesc" : "Status"
				}];

		storeModel = {
			fields : ['defaultAxmcode', 'isSubmitted', 'requestStateDesc',
					'__metadata', 'history', 'identifier', 'clientId',
					'rClientDesc', 'axmName'],
			proxyUrl : 'services/approvalMatrixWorkflowList.json',
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
	handleMatrixEntryAction : function() {
		var me = this;
//		var sellerCombo = me.getApprovalWorkflowView()
//				.down('combobox[itemId=sellerFltId]');
//		var selectedSeller = sellerCombo.getValue();
		var selectedClient = null;
		var clientCodesFltId = me.getApprovalWorkflowView()
				.down('combobox[itemId=clientCodesFltId]');
		selectedClient = clientCodesFltId.getValue();

		var form;
		var strUrl = 'addTcwAuthMatrixWorkflowMst.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
				strSellerId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId',
				selectedClient));
		form.action = strUrl;
		me.setFilterParameters(form);
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

	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		var clientCodesFltId;
		var selectedClient;
		var workflowFilterView = me.getApprovalWorkflowView();
		// var sellerCombo = workflowFilterView
		// .down('combobox[itemId=sellerFltId]');
		if (!isClientUser()) {
			clientCodesFltId = workflowFilterView
					.down('combobox[itemId=clientCodesFltId]');
			selectedClient = clientCodesFltId.getValue();
		} else {
			clientCodesFltId = workflowFilterView
					.down('button[itemId="clientBtn"]');
			selectedClient = clientCodesFltId.code;
		}
		// var selectedSeller = sellerCombo.getValue();

		var defaultMatrixName = workflowFilterView
				.down('combobox[itemId=defaultMatrixFltId]');

		var statusName = workflowFilterView
				.down('combobox[itemId=statusFltId]');

		// arrJsn['sellerId'] = selectedSeller;
		arrJsn['clientId'] = selectedClient;
		if (clientCodesFltId.rawValue) {
			arrJsn['clientDesc'] = clientCodesFltId.getRawValue();
		}
		arrJsn['defaultMatrix'] = defaultMatrixName.getValue();
		arrJsn['defaultMatrixDesc'] = defaultMatrixName.getRawValue();
		arrJsn['status'] = statusName.getValue();
		arrJsn['statusDesc'] = statusName.getRawValue();

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'approvalWorkflowFilterView-1016_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var seller = '';
							var client = '';
							var defaultMatrix = '';
							var matrixname = '';
							var status = '';
							var approvalWorkflowFilterView = me
									.getApprovalWorkflowFilterView();
							// var sellerFltId = approvalWorkflowFilterView
							// .down('combobox[itemId=sellerFltId]');
							var clientCodesFltId = approvalWorkflowFilterView
									.down('combobox[itemId=clientCodesFltId]');

							// if (!Ext.isEmpty(sellerFltId)
							// && !Ext.isEmpty(sellerFltId.getValue())) {
							// seller = sellerFltId.getValue();
							// } else {
							// seller = getLabel('allcompanies', 'All
							// Companies');
							// }

							if (!Ext.isEmpty(me.clientDesc)
									&& me.clientCode != 'all') {
								client = me.clientDesc;
							} else {
								client = getLabel('allCompanies',
										'All Companies');
							}
							var filterView = me.getApprovalWorkflowFilterView();
							var defaultMatrixName = filterView
									.down('combobox[itemId=defaultMatrixFltId]');
							var statusName = filterView
									.down('combobox[itemId=statusFltId]');

							if (!Ext.isEmpty(defaultMatrixName)
									&& !Ext.isEmpty(defaultMatrixName
											.getValue())) {
								defaultMatrix = defaultMatrixName.getValue();
							} else {
								defaultMatrix = getLabel('none', 'None');
							}

							if (!Ext.isEmpty(statusName)
									&& !Ext.isEmpty(statusName.getValue())) {
								status = statusName.getRawValue();
							} else {
								status = getLabel('all', 'ALL');
							}

							tip.update(getLabel("grid.column.company", "Company Name")
									+ ' : ' + client + '<br/>'
									+ getLabel("matrixType", "Matrix Type")
									+ ' : ' + defaultMatrix + '<br/>'
									+ getLabel("Status", "Status") + ' : '
									+ status);

						}
					}
				});
	}

});