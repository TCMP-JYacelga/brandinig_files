Ext.define( 'GCP.controller.AgentAccountMasterController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.AgentSubAccountView', 'GCP.view.AgentSubAccountGridView','GCP.view.AgentSubAccountActionBarView',
	         'GCP.view.AgentAccountView', 'GCP.view.AgentAccountGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'agentSubAccountView',
				selector : 'agentSubAccountView'
			}, {
				ref : 'agentSubAccountDtlView',
				selector : 'agentSubAccountView agentSubAccountGridView panel[itemId="agentSubAccountDtlView"]'
			}, {
				ref : "accountStyleFilter",
				selector : 'agentSubAccountView agentSubAccountFilterView textfield[itemId="accountStyleFilter"]'
			}, {
				ref : "accountNumberFilter",
				selector : 'agentSubAccountView agentSubAccountFilterView textfield[itemId="accountNumberFilter"]'
			}, {
				ref : "statusFilter",
				selector : 'agentSubAccountView agentSubAccountFilterView combobox[itemId="statusFilter"]'
			},{
				ref : 'agentSubAccountGridView',
				selector : 'agentSubAccountGridView'
			},{
				ref : 'grid',
				selector : 'agentSubAccountGridView smartgrid'
			},{
				ref : 'discardBtn',
				selector : 'agentSubAccountGridView toolbar[itemId="subAccountActionBar"] button[itemId="btnDiscard"]'
			}, {
				ref : 'enableBtn',
				selector : 'agentSubAccountGridView toolbar[itemId="subAccountActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'agentSubAccountGridView toolbar[itemId="subAccountActionBar"] button[itemId="btnDisable"]'
			}, {
				ref : 'actionBar',
				selector : 'agentSubAccountGridView panel[itemId="agentSubAccountDtlView"] container[itemId="actionBarContainer"] toolbar[itemId="subAccountActionBar"]'
			},{
				ref : 'agentAccountView',
				selector : 'agentAccountView'
			}, {
				ref : 'agentAccountDtlView',
				selector : 'agentAccountView agentAccountGridView panel[itemId="agentAccountDtlView"]'
			},{
				ref : 'accountGrid',
				selector : 'agentAccountGridView smartgrid'
			}
			
			],
	config : {
		filterData : [],
		strGridViewUrl : 'agentAccountMasterList.srvc'
	},
	init : function() {
		var me = this;
		
		me.control({
			
			'agentAccountGridView' : {
				render : function(panel) {
					me.handleAccountSmartGridLoading();
				}				
			},
			'agentAccountGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {					
				}
			},			
			'agentSubAccountView' : {
				render : function() {
					me.getAgentSubAccountGridView().down('panel[itemId=btnActionToolBar]').addCls('button-grey-effect');
					me.handleAddAccountLabel();
				
				},
				handleCancelButtonAction : function() {
					
					me.handleCancelButtonAction('agentSetupList.srvc');
				},
				handleNextButtonAction : function() {						
							me.handleNextButtonAction('docUploadAndSubmitPage.srvc');					
				}
				
			},				
			'agentSubAccountGridView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
				},
				
			addSubAccountEntry : function () {
				me.addAccountEntry('showAgentAccountEntryForm.srvc');		
			}
			},
			'agentSubAccountGridView smartgrid' : {
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
			'agentSubAccountView agentSubAccountFilterView' : {
				render : function() {
					me.setInfoTooltip();
				}
			},			
			'agentSubAccountView agentSubAccountFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'agentSubAccountGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'agentSubAccountGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'agentSubAccountGridView toolbar[itemId=subAccountActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'agentSubAccountGridView panel[itemId="agentSubAccountDtlView"]' : {
				render : function() {
					me.handleActionBar();
				}
			}
			
	});
	
	},//end of init()
	
	handleAddAccountLabel : function() {		
		if (pageMode === 'VIEW') {
			// this.getClientAccountView().query('label[text= ]')[0].hide(true);
			this.getAgentSubAccountGridView().query('panel[itemId=btnActionToolBar]')[0]
					.hide(true);
		}
	},
	
	enableValidActionsForGrid : function() {
		var me = this;
		var grid = me.getGrid();
		var discardActionEnabled = false;
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		var blnEnabled = false;

		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;
			enableActionEnabled = false;
			disableActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.activeFlag == "N") {
							enableActionEnabled = true;
						} else if (item.data.activeFlag == "Y") {
							disableActionEnabled = true;
						}
						var strProfileFieldType = item.data.profileFieldType;
						if(disableDiscardActionFlag == 'true' && strProfileFieldType != 'NEW')
						{
							discardActionEnabled = false;
						}
						else
						{
							discardActionEnabled = true;
						}
					});
		}

		var enableBtn = me.getEnableBtn();
		var disableBtn = me.getDisableBtn();
		var discardBtn = me.getDiscardBtn();

		if (!disableActionEnabled && !enableActionEnabled) {
			disableBtn.setDisabled(!blnEnabled);
			enableBtn.setDisabled(!blnEnabled);
		} 
		else if (disableActionEnabled && enableActionEnabled) {
			enableBtn.setDisabled(!blnEnabled);
			disableBtn.setDisabled(!blnEnabled);
		}
		else if (enableActionEnabled) {
			enableBtn.setDisabled(blnEnabled);
		} 
		else if (disableActionEnabled) {
			disableBtn.setDisabled(blnEnabled);
		}
		
		if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}
		else
		{
			discardBtn.setDisabled(!blnEnabled);
		}
		
		

	},
	
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/agentAccount/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() + '&viewState='	+ encodeURIComponent(viewState);
	/*	if (!Ext.isEmpty(viewmode) && 'MODIFIEDVIEW' == viewmode)
			strUrl += '&$viewmode=' + viewmode;*/
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false,me);
	},
	enableEntryButtons:function(grid, data, scope){
		var me=this;
		me.getAgentSubAccountView().down('panel[itemId=btnActionToolBar]').removeCls('button-grey-effect');
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strMasterFilterUrl = '';
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

		var accountStyleVal = null, statusVal = null, accountNumberVal = null, jsonArray = [];

		if (!Ext.isEmpty(me.getAccountStyleFilter())
				&& !Ext.isEmpty(me.getAccountStyleFilter().getValue())) {
			accountStyleVal = me.getAccountStyleFilter().getValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
		}

		if (!Ext.isEmpty(me.getAccountNumberFilter())
				&& !Ext.isEmpty(me.getAccountNumberFilter().getValue())) {
			accountNumberVal = me.getAccountNumberFilter().getValue();
		}

		if (!Ext.isEmpty(accountStyleVal)) {
			jsonArray.push({
						paramName : me.getAccountStyleFilter().name,
						paramValue1 : accountStyleVal,
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

		if (accountNumberVal != null) {
			jsonArray.push({
						paramName : me.getAccountNumberFilter().name,
						paramValue1 : accountNumberVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
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
			strUrl = strUrl + me.getFilterUrl() + '&viewState='+encodeURIComponent(viewState);
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if(pageMode === 'VIEW' ){
			arrCols.push(me.createViewActionColumn());
		}
		else{
			arrCols.push(me.createActionColumn());
		}
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable=objCol.sortable;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleSmartGridLoading : function() {

		var me = this;
		var pgSize = null;
		pgSize = 10;

		var objWidthMap = {
			"accountBankDesc" : '24%',
			"accountNumber" : '16%',
			"accountStyleDesc":'16%',
			"accountTypeDesc" : '16%',
			"accountCcyCode" : '12%',	
			"activeFlag" : '12%'
		};

		var arrColsPref = [{
					"colId" : "accountBankDesc",
					"colDesc" : getLabel('lblAcctSysBank', 'Bank'),					
					"sortable":false
				}, {
					"colId" : "accountNumber",
					"colDesc" : getLabel('lblAcctNumber', 'Account Number'),					
					"sortable":true
				},{
					"colId" : "accountStyleDesc",
					"colDesc" : getLabel('accountStyle', 'Account Style'),				
					"sortable":true
				},{
					"colId" : "accountTypeDesc",
					"colDesc" : getLabel('lblAcctType', 'Account Type'),				
					"sortable":true
				}, {
					"colId" : "accountCcyCode",
					"colDesc" : getLabel('ccy', 'CCY'),					
					"sortable":true
				}];
	/*	if (isBrEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageBr",
					"colDesc" : getLabel('br', 'Balance Reporting'),
					"sortable":true
				}
			);
		}*/	
			arrColsPref.push( {
					"colId" : "activeFlag",
					"colDesc" : getLabel('status', 'Status'),
					"sortable":false
				}
			);			
			
		
		var storeModel = {
			fields : ['identifier','agentCode','accountId','accountNumber','accountCcyCode','accountName','accountTypeCode','accountTypeDesc','accountStyleCode','accountStyleDesc', 'activeFlag', 
			          			'accountBankCode','accountBankDesc','accountBankDesc','accountBranchCode','accountBranchDesc','accountUsageCode','accountUsageCodeDesc','profileFieldType','viewState',
			          			'accountAssignedFlag'],
			proxyUrl : 'cpon/agentSetup/subAccountList.json',
			rootNode : 'd.accounts',
			totalRowsNode : 'd.__count'
		};

		arrCols = me.getColumns(arrColsPref, objWidthMap);
		subAccountGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,			
			hideRowNumbererColumn : true,
			padding : '3 10 10 10',
			showEmptyRow : false,	
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			//isRowIconVisible : me.isRowIconVisible,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) 
			{
				me.handleRowIconClick(grid, rowIndex, cellIndex, menu, event, record);
			}

		});

	
		var agentSubAccountDtlView = me.getAgentSubAccountDtlView();
		agentSubAccountDtlView.add(subAccountGrid);
		agentSubAccountDtlView.doLayout();
	},
	
	handleAccountSmartGridLoading : function() {

		var me = this;
		var pgSize = null;
		pgSize = 10;

		var objWidthMap = {
			"accountBankDesc" : '24%',
			"accountNumber" : '16%',
			"accountStyleDesc":'16%',
			"accountTypeDesc" : '16%',
			"accountCcyCode" : '12%',	
			"accountUsageCodeDesc" : '12%'
		};

		var arrColsPref = [{
					"colId" : "accountBankDesc",
					"colDesc" : getLabel('lblAcctSysBank', 'Bank'),					
					"sortable":false
				}, {
					"colId" : "accountNumber",
					"colDesc" : getLabel('lblAcctNumber', 'Account Number'),					
					"sortable":false
				},{
					"colId" : "accountStyleDesc",
					"colDesc" : getLabel('accountStyle', 'Account Style'),				
					"sortable":false
				},{
					"colId" : "accountTypeDesc",
					"colDesc" : getLabel('lblAcctType', 'Account Type'),				
					"sortable":false
				}, {
					"colId" : "accountCcyCode",
					"colDesc" : getLabel('ccy', 'CCY'),					
					"sortable":false
				},{
					"colId" : "accountUsageCodeDesc",
					"colDesc" : getLabel('usage', 'Usage'),					
					"sortable":false
				}];
	/*	if (isBrEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageBr",
					"colDesc" : getLabel('br', 'Balance Reporting'),
					"sortable":true
				}
			);
		}*/	
			/*arrColsPref.push( {
					"colId" : "activeFlag",
					"colDesc" : getLabel('status', 'Status'),
					"sortable":false
				}
			);	*/		
			
		
		var storeModel = {
			fields : ['identifier','agentCode','accountId','accountNumber','accountCcyCode','accountName','accountTypeCode','accountTypeDesc','accountStyleCode','accountStyleDesc', 'activeFlag', 
			          			'accountBankCode','accountBankDesc','accountBankDesc','accountBranchCode','accountBranchDesc','accountUsageCode','accountUsageCodeDesc','profileFieldType','viewState'],
			proxyUrl : 'cpon/agentSetup/accountList.json',
			rootNode : 'd.accounts',
			totalRowsNode : 'd.__count'
		};

		arrCols = me.getColumns(arrColsPref, objWidthMap);
		accountGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridAccountViewMstId',
			itemId : 'gridAccountViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,
			showCheckBoxColumn : false,
			hideRowNumbererColumn : true,
			showEmptyRow : false,
			padding : '3 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			//isRowIconVisible : me.isRowIconVisible
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) 
			{
				me.handleRowIconClick(grid, rowIndex, cellIndex, menu, event, record);
			}

		});

	
		var agentAccountDtlView = me.getAgentAccountDtlView();
		agentAccountDtlView.add(accountGrid);
		agentAccountDtlView.doLayout();
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {		
		var strRetValue = "";
		if (record.get('isEmpty')) {
			if (rowIndex === 0 && colIndex === 0) {
				meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
				return getLabel('gridNoDataMsg',
						'No records found !!!');											
			}
		} else{
			 if (colId === 'col_activeFlag') 
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
					{
						strRetValue = getLabel('active','Active');
					}
					else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
					{
						strRetValue = getLabel('inactive','Inactive');
					}
				}
				}
			 else {
				 strRetValue = value;
			 }
			return strRetValue;
		}
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			visibleRowActionCount : 1,
			width : 50,			
			align : 'right',
			locked : true,
			items : [ {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				itemLabel : getLabel('viewToolTip','View Record')
			},
			{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Modify Record'),
				itemLabel : getLabel('editToolTip','Modify Record')
			}]
		};
		return objActionCol;

	},
	
	createViewActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
						
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

	showRejectVerifyPopUp : function(strAction, strActionUrl) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('prfRejectRemarkPopUpTitle',
					'Please enter reject remark');
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
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
						}
					}
				});
	},

	preHandleGroupActions : function(strUrl, remark, record) {
	
		var me = this;
		var checkBeforeAction = true;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {
				if(strUrl === 'cpon/agentAccount/disable') {
					checkBeforeAction = me.checkIfAccountNotAssigned(records[index],"DISABLE");									
				}
				if(checkBeforeAction){
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : viewState
						});
			}
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			if(arrayJson.length > 0 ) {
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							//me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							me.enableValidActionsForGrid();							
							var errorMessage = '';
							if (response.responseText != '[]') {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										viewState = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
									        });
									}
								}
								if ('' != errorMessage
										&& null != errorMessage) {
									Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
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
		}

	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
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
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);		
		return retValue;
	},

	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var checkBeforeAction = true;
		
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			checkBeforeAction = me.checkIfAccountSaved(record);
			if(checkBeforeAction)
			me.submitForm('viewAgentAccountMaster.srvc', record, rowIndex);
		} else if (actionName === 'btnEdit'){			
			checkBeforeAction = me.checkIfAccountNotAssigned(record,"EDIT");		
			if(checkBeforeAction)
			me.submitForm('editAgentAccountMaster.srvc', record, rowIndex);
		} 
	},
	checkIfAccountNotAssigned : function (record, strAction) {
		var me = this;
		var accountAssignedFlag = record.data.accountAssignedFlag;
		var accountUsage = record.data.accountUsageCode;
		var errorMessageKey =null;
		if("DISABLE" == strAction){
			errorMessageKey = "checkIfAccountAssignedDisable";
		}
		else if("EDIT" == strAction){
			errorMessageKey = "checkIfAccountAssignedEdit";
		}
		if("SUBAC" == accountUsage) {
		if(!Ext.isEmpty(accountAssignedFlag) && "Y" == accountAssignedFlag ){
			Ext.MessageBox.show({
				title : getLabel('rowIconError','Error'),
				msg : getLabel(errorMessageKey, 'Sub Account is already assigned to End Client. Record cannot be modified.'),
				buttons : Ext.MessageBox.OK,
				cls:'t7-popup',
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
		else {
			return true;
		}
		
		}
		else {
			return true;
		}
	
	},
	checkIfAccountSaved : function (record) {
		var me = this;
		var dataAccountNumber = record.data.accountNumber;
		if(Ext.isEmpty(dataAccountNumber)){
			Ext.MessageBox.show({
				title : getLabel(
						'rowIconError',
						'Error'),
				msg : getLabel(
						'checkIfAccountSaved',
						'Account Number is not saved to system. Record cannot be viewed.'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
			return false;
		}
		else {
			return true;
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		//var viewState = record.data.identifier;
		var detailViewState = record.data.identifier;
		var accountUsageCode = record.data.accountUsageCode;
		var updateIndex = rowIndex;
		//var viewMode = viewMode;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'detailViewState',
				detailViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'calledFrom',
				pageMode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'pageMode',
				pageMode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'accountUsageCode',
				accountUsageCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'profileFieldType',record.raw.profileFieldType));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'agentSubAccountFilterView-1046_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var accountStyle = '';
							var accountNumber = '';
							var status = '';

							if (!Ext.isEmpty(me.getAccountStyleFilter())
									&& !Ext.isEmpty(me.getAccountStyleFilter()
											.getValue())) {
								accountStyle = me.getAccountStyleFilter().getValue();
							} else {
								accountStyle = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getAccountNumberFilter())
									&& !Ext.isEmpty(me.getAccountNumberFilter()
											.getValue())) {
								accountNumber = me.getAccountNumberFilter().getValue();
							} else {
								accountNumber = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getStatusFilter())
									&& !Ext.isEmpty(me.getStatusFilter()
											.getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}

							tip.update(getLabel('accountStyle', 'Account Style') + ' : ' + accountStyle
									+ '<br/>' + getLabel('accountNumber', 'Account Number') + ' : '
									+ accountNumber + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
						}
					}
				});
	},
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
	addAccountEntry : function(strUrl) {
		var me = this;
		var viewState = document.getElementById('viewState').value;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	handleNextButtonAction : function(strUrl) {
		var me = this;
		var viewState = document.getElementById('viewState').value;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				document.getElementById('pageMode').value));	
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	handleCancelButtonAction : function(strUrl) {
		var me = this;
		var form, inputField;
		
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
	getAccSubTypeValues : function(combo, newValue, oldValue, eOpts) {
		var me = this;
		var accSubTypeCombo = me.getAccSubTypeCombo();
		if (!Ext.isEmpty(accSubTypeCombo)) {
			var accSubTypeComboStore = accSubTypeCombo.getStore();
			accSubTypeComboStore.proxy.extraParams = {
				$qfilter : combo.getValue()
			};
			accSubTypeComboStore.load();
		}

	},
	saveAccountEntry : function() {
		var me = this;
		var jsonData = me.getAccountEntryJSON();
		
		Ext.Ajax.request({
					url : 'cpon/clientAccount/add',
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						var reponseData = Ext.decode(response.responseText);
						me.getAddAccountPopupView().close();
						me.getGrid().refreshData();
					},
					failure : function(response) {
						// console.log("Error Occured - while posting data for
						// activity notes");
					}

				});
	},
	getAccountEntryJSON : function(){
		var me=this;
		var notesJsonData="{\"accountNumber\":"+"\""+me.getAccNo().getValue()+"\",";
		notesJsonData+="\"accountName\":"+"\""+me.getAccName().getValue()+"\",";
		notesJsonData+="\"ccy\":"+"\""+me.getCcyCombo().getValue()+"\",";
		notesJsonData+="\"bank\":"+"\""+me.getAccBank().getValue()+"\",";
		notesJsonData+="\"iban\":"+"\""+me.getAccIBAN().getValue()+"\",";
		notesJsonData+="\"accountType\":"+"\""+me.getAccTypeCombo().getValue()+"\",";
		notesJsonData+="\"accountSubType\":"+"\""+me.getAccSubTypeCombo().getValue()+"\",";
		notesJsonData+="\"minBalance\":"+"\""+me.getAccMinBalance().getValue()+"\",";
		notesJsonData+="\"maxBalance\":"+"\""+me.getAccMaxBalance().getValue()+"\",";
		notesJsonData+="\"brflag\":"+"\""+me.getBrflag().getValue()+"\",";
		notesJsonData+="\"payflag\":"+"\""+me.getPayflag().getValue()+"\",";
		notesJsonData+="\"chgflag\":"+"\""+me.getChgflag().getValue()+"\",";
		notesJsonData+="\"viewState\":"+"\""+viewState+"\"}";
		return notesJsonData;
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	handleActionBar : function(){
		var me = this;
		var actionBar = me.getActionBar();
		actionBar.hide();
		if(!(pageMode === "VIEW" || pageMode === "MODIFIEDVIEW")){
			actionBar.show();
			actionBar.getComponent('btnEnable').show(true);
			actionBar.getComponent('btnDisable').show(true);
			actionBar.getComponent('btnDiscard').show(true);
		}
	}
	
});