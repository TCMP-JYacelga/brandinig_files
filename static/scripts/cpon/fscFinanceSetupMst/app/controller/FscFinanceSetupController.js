Ext.define('GCP.controller.FscFinanceSetupController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.FinanceSetupView', 'GCP.view.FinanceSetupGridView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'financeSetupView',
				selector : 'financeSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'financeSetupView financeSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'financeSetupView financeSetupFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'financeSetupFilterView',
				selector : 'financeSetupView financeSetupFilterView'
			},
			{
				ref : 'clientSetupGridView',
				selector : 'financeSetupView financeSetupGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'financeSetupView financeSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'financeSetupView financeSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'clientSetupGrid',
				selector : 'financeSetupView financeSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'financeSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'financeSetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'financeSetupGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'financeSetupView financeSetupFilterView textfield[itemId="corporationFilter"]'
			},{
				ref : "clientFilter",
				selector : 'financeSetupView financeSetupFilterView textfield[itemId="clientFilter"]'
			},{
				ref : "statusFilter",
				selector : 'financeSetupView financeSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'financeSetupView financeSetupGridView financeSetupActionBarView'
			},{
				ref : 'brandingPkgListLink',
				selector : 'financeSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			},{
				ref : 'clientListLink',
				selector : 'financeSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			}  ],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : [],
		copyByClicked : ''
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		GCP.getApplication().on({
			showClientPopup : function(brandingpkg) {
				me.copyByClicked = brandingpkg;
				copybypopup = Ext.create('GCP.view.CopyByClientPopupView',
													{
												itemId:'copybypopup'
												});
											(copybypopup).show();
										}
		
		});
			
		me.control({
			'financeSetupView financeSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'financeSetupView financeSetupFilterView' : {
				render : function() {
					if(!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					//me.setInfoTooltip();
					//me.handleSpecificFilter();
				}
			},
			'financeSetupView financeSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'financeSetupView financeSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					if(!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.handleGridHeader();
					/*Ext.Ajax.request({
						url : 'cpon/financingProfileMst/totalListCount.json',
						method : 'POST',
						success : function(response) {
							var data = Ext.decode(response.responseText);
							me.clientListCount = data.ClientListCount;
							me.brandingPkgListCount = data.BrandingPackageListCount;
							me.handleGridHeader();
						},
						failure : function(response) {
							//console.log("Ajax Get data Call Failed");
						}

					}); */
					
				}
			},
			'financeSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'financeSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'financeSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'financeSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'financeSetupGridView smartgrid' : {
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
			},
			'copyByClientPopupView smartgrid' : {
				render : function(grid) {
					me.handleCopuByClientLoadGrid(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleCopuByClientLoadGrid,
				gridSortChange : me.handleCopuByClientLoadGrid
			},
			'financeSetupGridView toolbar[itemId=financeSetupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}

		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		//me.getStatusFilter().setValue('');
		
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		filterPanel.columnWidth = 0.56;
		
	},
	//method to handle client list and branding pkg list link  click
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(gridHeaderPanel))
		{
			gridHeaderPanel.removeAll();
		}
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		
	
		{
			gridHeaderPanel.add({
					xtype : 'label',
					text : getLabel('financeSetUp', 'Finance Set Up'),
					cls : 'font_bold',
					padding : '5 0 0 3'
				});
			
			createNewPanel.add(
				{
								xtype : 'button',
								border : 0,
								text : getLabel('createFinanceSetup', 'Create Finance Set Up'),
								cls : 'cursor_pointer',
								parent : this,
								padding : '4 0 2 0',
								itemId : 'btnCreateClient'
							}
			);
		}
		

	},

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	//loading coied by popup grid data
	handleCopuByClientLoadGrid : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(!Ext.isEmpty(me.copyByClicked))
		{
				strUrl = strUrl + '&qfilter=' + me.copyByClicked;
		}
		grid.loadGridData(strUrl, null);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);
		
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
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
		me.getSearchTextInput().setValue('');
		
		me.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		
		var me = this;
		var statusVal = null, jsonArray = [];
		
		var sellerVal = null, receiverNameVal = null,  clientCodeVal = null,  jsonArray = [];

		var clientSetupFilterView = me.getFinanceSetupView();
		var sellerFltId = clientSetupFilterView
				.down('combobox[itemId=sellerFltId]');

		var receiverNameFltId = clientSetupFilterView
				.down('combobox[itemId=profileNameFltId]');

		var clientNamesFltId = clientSetupFilterView
				.down('combobox[itemId=categoryFltId]');

		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue();
		}

		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : sellerVal.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(receiverNameFltId)
				&& !Ext.isEmpty(receiverNameFltId.getValue())) {
			receiverNameVal = receiverNameFltId.getValue();
		}

		if (!Ext.isEmpty(receiverNameVal)) {
			jsonArray.push({
						paramName : receiverNameFltId.name,
						paramValue1 : receiverNameVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(clientNamesFltId)
				&& !Ext.isEmpty(clientNamesFltId.getValue())) {
			clientCodeVal = clientNamesFltId.getValue();
		}

		if (!Ext.isEmpty(clientCodeVal)) {
			jsonArray.push({
						paramName : clientNamesFltId.name,
						paramValue1 : clientCodeVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
		}
			
			var strInFlag = false;
			if (statusVal == 12 || statusVal == 3) {
				if (statusVal == 12) // Submitted
				{
					statusVal = new Array(0, 1);
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
					strInFlag = true;
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (strInFlag) // Used for Submitted & Rejected status
			{
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						});
			} else {
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
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
		var clientGrid = me.getClientSetupGrid();
		var objConfigMap = me.getClientSetupConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(clientGrid))
			clientGrid.destroy(true);
			
		arrCols = me.getColumns(objConfigMap.arrColsPref,
			objConfigMap.objWidthMap);
			me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
		
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		clientGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '5 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var clntSetupDtlView = me.getClientSetupDtlView();
		clntSetupDtlView.add(clientGrid);
		clntSetupDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept' || actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
				&& !Ext.isEmpty(recHistory.__deferred.uri)) {
					me.showHistory(true,record.get('profileName'),record.get('history').__deferred.uri,record.get('identifier'));
				}
			
		} else if (actionName === 'btnView') {
			me.submitForm('financingViewProfileMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit'){
			me.submitForm('editFinancingProfileMst.form', record, rowIndex);
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
	
	showHistory : function(isClient,clientName,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
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
		}else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
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
						itemLabel : getLabel('historyToolTip',
								'View History'),
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
			items: [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	
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
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
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
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		
		var actionBar = this.getGroupActionBar();
		
		
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
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

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/financingProfileMst/{0}.srvc?',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}
		

	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
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
							me.preHandleGroupActions(strActionUrl, text, record);
						}
					}
				});
	},

	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
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
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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
										cls: 'ux_popup',
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
	 
			strRetValue = value;


		return strRetValue;
	},

	getClientSetupConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

				objWidthMap = {
					"clientDesc" : 190,
					"profileName" : 190,
					"requestStateDesc" : 160
				};

				arrColsPref = [{
							"colId" : "profileName",
							"colDesc" : "Finance Setup Name"
						}, {
							"colId" : "categoryCode",
							"colDesc" : "Category"
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : "Status"
						}];

				storeModel = {
					fields : [ 'profileName','categoryCode',
							'requestStateDesc','identifier','history','__metadata'],
					proxyUrl : 'cpon/financingProfileMst.json',
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
	handleClientEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addFinancingProfileMst.form';
		var brandingPkgType = null;
		
		var errorMsg = null;
		
		if (entryType)
			brandingPkgType = 'N';
		else
			brandingPkgType = 'Y';

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtBrandingPkgType',
				brandingPkgType));
		
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

	}

});
function showClientPopup(brandingPkg){
	GCP.getApplication().fireEvent('showClientPopup',brandingPkg);
}