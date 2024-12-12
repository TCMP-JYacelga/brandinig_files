Ext.define('GCP.controller.ClientAccountController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.util.Point'],
	views : ['GCP.view.ClientAccountView', 'GCP.view.ClientAccountGridView',
			'GCP.view.AddAccountPopupView','GCP.view.ClientAccountActionBarView','GCP.view.PaymentPkgPopupView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientAccountView',
				selector : 'clientAccountView'
			}, {
				ref : 'clientAccountDtlView',
				selector : 'clientAccountView clientAccountGridView panel[itemId="clientAccountDtlView"]'
			}, {
				ref : "bankFilter",
				selector : 'clientAccountView clientAccountFilterView textfield[itemId="bankFilter"]'
			}, {
				ref : "ccyFilter",
				selector : 'clientAccountView clientAccountFilterView textfield[itemId="ccyFilter"]'
			}, {
				ref : "accountFilter",
				selector : 'clientAccountView clientAccountFilterView textfield[itemId="accountFilter"]'
			}, 
			{
				ref : "statusFilter",
				selector : 'clientAccountView clientAccountFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'searchTextInput',
				selector : 'clientAccountGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'clientAccountGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'grid',
				selector : 'clientAccountGridView smartgrid'
			},{
				ref : 'accSubTypeCombo',
				selector : 'addAccountPopupView combo[itemId="accSubType"]'
			},{
				ref : 'ccyCombo',
				selector : 'addAccountPopupView combo[itemId="accCcy"]'
			}, {
				ref : 'accTypeCombo',
				selector : 'addAccountPopupView combo[itemId="accType"]'
			}, {
				ref : 'accNo',
				selector : 'addAccountPopupView textfield[itemId="accNo"]'
			}, {
				ref : 'accName',
				selector : 'addAccountPopupView textfield[itemId="accName"]'
			}, {
				ref : 'accBank',
				selector : 'addAccountPopupView combo[itemId="accBank"]'
			}, {
				ref : 'accIBAN',
				selector : 'addAccountPopupView textfield[itemId="accIBAN"]'
			}, {
				ref : 'accMinBalance',
				selector : 'addAccountPopupView textfield[itemId="accMinBalance"]'
			}, {
				ref : 'accMaxBalance',
				selector : 'addAccountPopupView textfield[itemId="accMaxBalance"]'
			},{
				ref : 'brflag',
				selector : 'addAccountPopupView checkbox[itemId="chkBR"]'
			},{
				ref : 'payflag',
				selector : 'addAccountPopupView checkbox[itemId="chkPay"]'
			},{
				ref : 'chgflag',
				selector : 'addAccountPopupView checkbox[itemId="chkChg"]'
			},{
				ref : 'discardBtn',
				selector : 'clientAccountGridView toolbar[itemId="accountActionBar"] button[itemId="btnDiscard"]'
			}, {
				ref : 'enableBtn',
				selector : 'clientAccountGridView toolbar[itemId="accountActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'clientAccountGridView toolbar[itemId="accountActionBar"] button[itemId="btnDisable"]'
			}, {
				ref : 'actionBar',
				selector : 'clientAccountGridView panel[itemId="clientAccountDtlView"] container[itemId="actionBarContainer"] toolbar[itemId="accountActionBar"]'
			}],
	config : {
		filterData : [],
		strGridViewUrl : 'clientAccountMasterList.form',
		strGridViewChangesUrl : 'viewChangesClientAccountMasterList.form'
	},
	init : function() {
		var me = this;
		
		me.control({
			'clientAccountView' : {
				render : function() {
					me.getClientAccountView().down('toolbar[itemId=btnActionToolBar]').addCls('button-grey-effect');
					me.handleAddAccountLabel();
				
				},
				handleCancelButtonAction : function() {
					
					me.handleCancelButtonAction('clientServiceSetupList.form');
				},
				handleNextButtonAction : function() {
						if(viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW'){
							me.handleNextButtonAction('verifyClientServiceSetup.form');
						}
						else{
							me.handleNextButtonAction('verifyClientServiceSetup.form');
						}
				},				
				addAccountEntry : function() {
					me.addAccountEntry('addClientAccountMaster.form');
			}	
			},
			'clientAccountView button[itemId=btnViewChanges]' : {
				viewChanges : function(){
						me.handleViewChanges( !Ext.isEmpty(viewmode) && viewmode =='VIEW' ? me.strGridViewChangesUrl:me.strGridViewUrl);
					}				
				
			},
			'clientAccountView button[itemId=btnViewChanges1]' : {
				viewChanges : function(){
						me.handleViewChanges( !Ext.isEmpty(viewmode) && viewmode =='VIEW' ? me.strGridViewChangesUrl:me.strGridViewUrl);
					}				
				
			},
			'clientAccountGridView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
				}
				
			},
			'clientAccountGridView smartgrid' : {
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
			'clientAccountView clientAccountFilterView' : {
				render : function() {
					me.setInfoTooltip();
				}
			},			
			'clientAccountView clientAccountFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'clientAccountGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'clientAccountGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'addAccountPopupView combo[itemId="accType"]' : {
				change : me.getAccSubTypeValues
			},
			'clientAccountGridView toolbar[itemId=accountActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'clientAccountGridView panel[itemId="clientAccountDtlView"]' : {
				render : function() {
					me.handleActionBar();
				}
			}

		});
	},
	
	handleAddAccountLabel : function() {		
		if (viewmode === 'VIEW' || viewmode === "MODIFIEDVIEW" /*|| PARTY_ON_BOARDING_FLAG == 'E'*/) {
			// this.getClientAccountView().query('label[text= ]')[0].hide(true);
			this.getClientAccountView().query('button[itemId=btnNewAccount]')[0]
					.hide(true);
			if ('true' === isChecker && showViewChanges === 'true') {
				this.getClientAccountView()
						.query('button[itemId=btnViewChanges]')[0].show(true);
				this.getClientAccountView()
						.query('button[itemId=btnViewChanges1]')[0].show(true);
			}
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
						if('PAYOUT_ACC' === item.data.acctNmbr || 'CL_CHQPC' === item.data.acctName){
							discardActionEnabled = false;
                            enableActionEnabled = false;
                            disableActionEnabled = false;
						}
						if('Y' == item.data.accountUsageTPFA)
						{
							discardActionEnabled = false;
                            enableActionEnabled = false;
                            disableActionEnabled = false;
						}
						if(item.data.systemBankFlag==='Y' && PARTY_ON_BOARDING_FLAG==='E')
						{
							discardActionEnabled = false;
                            enableActionEnabled = false;
                            disableActionEnabled = false;
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
		var grid = me.getGrid();		
		var defaultAcctCount = 0;		
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/clientAccount/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);
		} 
		else if(strAction === 'disable'){
			if (!Ext.isEmpty(grid.getSelectedRecords()))
			{			
				Ext.each(grid.getSelectedRecords(), function(item) {
					if(!Ext.isEmpty(item.data) && !Ext.isEmpty(item.data.defaultDebitAcc) && item.data.defaultDebitAcc === 'Y')
					{
						defaultAcctCount+=1;
						return false;
					}
					
				});
				if(defaultAcctCount > 0)
					me.handleDisableVerifyAction(strUrl);
				else
					this.preHandleGroupActions(strUrl, '',record, strAction);
			}
			
		}
		else {
			this.preHandleGroupActions(strUrl, '',record, strAction);
		}

	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() + '&id='
				+ encodeURIComponent(parentkey);
		if (!Ext.isEmpty(viewmode) && 'MODIFIEDVIEW' == viewmode)
			strUrl += '&$viewmode=' + viewmode;
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false,me);
	},
	enableEntryButtons:function(grid, data, scope){
		var me=this;
		me.getClientAccountView().down('toolbar[itemId=btnActionToolBar]').removeCls('button-grey-effect');
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
		me.getSearchTextInput().setValue('');

		var bankVal = null, statusVal = null, ccyVal = null, jsonArray = [] , accountVal = null;

		if (!Ext.isEmpty(me.getBankFilter())
				&& !Ext.isEmpty(me.getBankFilter().getValue())) {
			bankVal = me.getBankFilter().getValue();
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& "ALL" != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
		}

		if (!Ext.isEmpty(me.getCcyFilter())
				&& !Ext.isEmpty(me.getCcyFilter().getValue())) {
			ccyVal = me.getCcyFilter().getValue();
		}

		if (!Ext.isEmpty(me.getAccountFilter())
				&& !Ext.isEmpty(me.getAccountFilter().getValue())) {
			accountVal = me.getAccountFilter().getValue();
		}

		if (!Ext.isEmpty(bankVal)) {
			jsonArray.push({
						paramName : me.getBankFilter().name,
						paramValue1 : bankVal,
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

		if (ccyVal != null) {
			jsonArray.push({
						paramName : me.getCcyFilter().name,
						paramValue1 : ccyVal,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}

		if (accountVal != null) {
			jsonArray.push({
						paramName : me.getAccountFilter().name,
						paramValue1 : accountVal,
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
			strUrl = strUrl + me.getFilterUrl() + '&id='+encodeURIComponent(parentkey);
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if(viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW'){
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
			"bankDesc" : 130,
			"acctNmbr" : 130,
			"acctName":130,
			"acctDesc" : 120,
			"ccyCode" : 55,
			"acctUsageBr" : 130,
			"acctUsagePay" : 75,
			"acctUsageColl" : 85,
			"acctUsagePooling" : 65,
			"acctUsageSweeping" : 75,
			"acctUsageFSC" : 100,
			"acctUsageTrade" : 65,
			"acctUsageForecast" : 75,
			"activeFlag" : 80,
			"acctUsageSubAccounts" : 80,
			"accountUsageTPFA" : 80,
			"systemBankFlag":80
		};

		var arrColsPref = [{
					"colId" : "bankDesc",
					//"colDesc" : getLabel('lblAcctSysBank', 'System Bank'),
					"colDesc" : me.getAdditionalInfoLabel('systemBank', 'System Bank'),
					"sortable":true
				}, {
					"colId" : "acctNmbr",
					//"colDesc" : getLabel('lblAcctNumber', 'Account'),
					"colDesc" : me.getAdditionalInfoLabel('acctNmbr', 'Account'),
					"sortable":true
				},{
					"colId" : "shortAccountNo",
					//"colDesc" : getLabel('shortActNmbr', 'Short Account Number'),
					"colDesc" : me.getAdditionalInfoLabel('shortActNmbr', 'Short Account Number'),
					"sortable":true
				},{
					"colId" : "transactionCode",
					"colDesc" : me.getAdditionalInfoLabel('transactionCode', 'Transaction Code'),
					"sortable":true
				},{
					"colId" : "acctName",
					//"colDesc" : getLabel('lblAcctName', 'Account Name'),
					"colDesc" : me.getAdditionalInfoLabel('orgAccName', 'Account Name/Nickname'),
					/*hidden : true,*/
					"sortable":true
				},{
					"colId" : "acctDesc",
					//"colDesc" : getLabel('lblAcctType', 'Account Type'),
					"colDesc" : me.getAdditionalInfoLabel('acctType', 'Account Type'),
					"sortable":true
				}, {
					"colId" : "ccyCode",
					//"colDesc" : getLabel('ccy', 'CCY'),
					"colDesc" : me.getAdditionalInfoLabel('ccyCode', 'CCY'),
					"sortable":true
				},
				{
					"colId" : "systemBankFlag",
					//"colDesc" : getLabel('ccy', 'CCY'),
					//"colDesc" : me.getAdditionalInfoLabel('ccyCode', 'CCY'),
					"hidden":true
				}];
		if (isBrEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageBr",
					"colDesc" : getLabel('br', 'Balance Reporting'),
					"sortable":true
				}
			);
		}
		if (isPaymentEnable == 'true')
		{
			arrColsPref.push(  {
					"colId" : "acctUsagePay",
					"colDesc" : getLabel('lblPmt', 'Payments'),
					"sortable":true
				}
			);
			
			arrColsPref.push(  {
				"colId" : "defaultDebitAcc",
				"colDesc" : getLabel('lblDefaultDebitAccount', 'Default Debit Account'),
				"sortable":true
				}
			);
			arrColsPref.push(  {
					"colId" : "plinkedChargeAcct",
					"colDesc" : getLabel('lblPlinkedChargeAcct', 'Payments Linked Charge Account'),
					"sortable":false
				}
			);
		}
		if (isCollEnable == 'true')
		{
			arrColsPref.push(  {
					"colId" : "acctUsageColl",
					"colDesc" : getLabel('lblCollection', 'Receivables'),
					"sortable":true
				}
			);
			arrColsPref.push(  {
					"colId" : "collLinkedChargeAcct",
					"colDesc" : getLabel('lblcollLinkedChargeAcct', 'Receivables Linked Charge Account'),
					"sortable":false
				}
			);
		}
   		if (isLiquidityEnable == 'true')
		{
			if(liquidityPoolingFeature == 'true')
			{
				arrColsPref.push(  {
						"colId" : "acctUsagePooling",
						"colDesc" : getLabel('lblPooling', 'Pooling'),
						"sortable":true
					}
				);
			}
			arrColsPref.push(  {
				"colId" : "acctUsageSweeping",
				"colDesc" : getLabel('lblSweeping', 'Sweeping'),
				"sortable":true
				}
			);
		} 
		if (isFscEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageFSC",
					"colDesc" : getLabel('lblfsc', 'Sweeping'),
					"sortable":true
				}
			);
		}
		
		if (isTradeEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageTrade",
					"colDesc" : getLabel('lbltrade', 'eTrade'),
					"sortable":true
				}
			);
		}
		if (isForecastEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageForecast",
					"colDesc" : getLabel('lblForecast', 'Cashflow Forecast'),
					"sortable":true
				}
			);
		}
		if (isSubAccountEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageSubAccounts",
					"colDesc" : getLabel('lblSubAccount', 'SubAccount'),
					"sortable":true
				}
			);
		}
		arrColsPref.push( {
			"colId" : "othersDefaultChargeAccount",
			"colDesc" : getLabel('lblDefaultChgAcct', 'Default Charge Account'),
			"sortable":false
				}
			);
			arrColsPref.push( {
					"colId" : "activeFlag",
					"colDesc" : getLabel('status', 'Status'),
					"sortable":false
				}
			);
		
		var storeModel = {
			fields : ['identifier', 'bankCode', 'acctNmbr','acctName','acctDesc', 'ccyCode','bankDesc','packageCount','accountId',
					'acctUsageBr', 'acctUsagePay', 'acctUsageColl','acctUsageSweeping','acctUsagePooling','acctUsageFSC',
					'acctUsageTrade', 'acctUsageForecast', 'activeFlag', 'profileFieldType','receivablePackageCount','shortAccountNo','transactionCode',
					'acctUsageSubAccounts','accountUsageTPFA','systemBankFlag','defaultDebitAcc','othersDefaultChargeAccount','plinkedChargeAcct','collLinkedChargeAcct'],
			proxyUrl : 'cpon/clientServiceSetup/accountList.json',
			rootNode : 'd.accounts',
			totalRowsNode : 'd.__count'
		};

		arrCols = me.getColumns(arrColsPref, objWidthMap);
		accountGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,
			showEmptyRow : false,
			padding : '3 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			//isRowIconVisible : me.isRowIconVisible
			isRowIconVisible: me.isGridRowIconVisible,
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
		
		accountGrid.on('cellclick', function(view, td, cellIndex, record,
				tr, rowIndex, e, eOpts) {	
			if (td.className.match('x-grid-cell-col_acctUsagePay') && "Y" == record.get('acctUsagePay'))
			{
				var pkgDetails = null;
				var pkgDetails = Ext.create(
						'GCP.view.PaymentPkgPopupView', {
							itemId : 'paymentPkgPopupView',
							title : getLabel('paymentMethod','Payment Package Name'),
							packageId : record.get('accountId'),
							id : parentkey,
							mode : 'LIST',
							srvcCode : '02'
						});
				pkgDetails.show();
			} 
			else if (td.className.match('x-grid-cell-col_acctUsageColl') && "Y" == record.get('acctUsageColl'))
			{
				var pkgDetails = null;
				var pkgDetails = Ext.create(
						'GCP.view.PaymentPkgPopupView', {
							itemId : 'paymentReceivablePkgPopupView',
							title : getLabel('collectionMethodName','Receivables Method Name'),
							packageId : record.get('accountId'),
							id : parentkey,
							mode : 'LIST',
							srvcCode : '05'
						});
				pkgDetails.show();
			}
		});
		var clntAccountDtlView = me.getClientAccountDtlView();
		clntAccountDtlView.add(accountGrid);
		clntAccountDtlView.doLayout();
	},
	
	
	isGridRowIconVisible: function(store, record, jsonData, itmId, maskPosition) {
		var isVisible = true;
		var acctName = record.get('acctName') || '';
		var acctNmbr = record.get('acctNmbr') || '';
		var systemBankFlag = record.get('systemBankFlag') || '';
		var accountUsageTPFA = record.get('accountUsageTPFA') || '';
		if(itmId === 'btnClone' && (acctName === 'PDCL_CHQPC' || acctName  == 'CL_CHQPC' || 'PAYOUT_ACC' === acctName)) {
			isVisible = false;
		}

		if ((itmId === 'btnEdit') && (!Ext.isEmpty(record.get('activeFlag'))) && "N" == record.get('activeFlag')){
			isVisible = false;
		}
		else if ((itmId === 'btnEdit') && ('PAYOUT_ACC' === acctName && 'Y' === internalClientFlag)) {
			if ('PAYOUT_ACC' !== acctNmbr && '3' == clientRequestState) {
				isVisible = false;
			}
		} else if(itmId === 'btnEdit' && 'PAYOUT_ACC' === acctName){//For Payout Client Always Non editable
			isVisible = false;
		}
		if((itmId === 'btnEdit' || itmId === 'btnClone') && "Y" == accountUsageTPFA)
		{
			isVisible = false;
		}
		if(itmId === 'btnClone' && systemBankFlag === 'Y' && PARTY_ON_BOARDING_FLAG === 'E')
		{
			isVisible = false;
		}
		return isVisible;
	},
	
		// getAdditionalInfoLabel	
	getAdditionalInfoLabel : function(fieldId , label)	{
		
		if( ADDITIONAL_INFO_BASE_GRID == null || ADDITIONAL_INFO_BASE_GRID == '' )
			return getLabel(fieldId, label);
			var labelFound = false;
			
		for( index = 0 ; index < ADDITIONAL_INFO_BASE_GRID.length ; index++ )
		{
			var columnid = ADDITIONAL_INFO_BASE_GRID[ index ].javaName;			
			if(columnid == fieldId )
			{
				console.log( 'Label Found for : ' + fieldId);
				labelFound = true;
				return ADDITIONAL_INFO_BASE_GRID[ index ].displayName;
				break ;
			}
		}
		if(!labelFound)
			return getLabel(fieldId, label);
	},
	
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";'acctUsageBr', 'acctUsagePay', 'activeFlag', 'acctUsageColl','acctUsageLMS','acctUsageFSC','acctUsageForecast','transactionCode','acctUsageSubAccounts'
		if (colId === 'col_acctUsageBr')
			{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageBr')) && "Y" == record.get('acctUsageBr'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageBr')) && "N" == record.get('acctUsageBr'))
				{
					strRetValue = getLabel('no','No');
				}
			}
			}
		else if (colId === 'col_acctUsagePay') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsagePay')) && "Y" == record.get('acctUsagePay'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsagePay')) && "N" == record.get('acctUsagePay'))
				{
					strRetValue = getLabel('no','No');
				}
				if(record.get('packageCount') > 0 && "Y" == record.get('acctUsagePay'))
				{
					strRetValue = strRetValue + '(<span class="underlined cursor_pointer">' +  record.get('packageCount') + '</span>)';
				}
				
			}
			}
		else if (colId === 'col_activeFlag') 
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
		else if (colId === 'col_acctUsageColl') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageColl')) && "Y" == record.get('acctUsageColl'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageColl')) && "N" == record.get('acctUsageColl'))
				{
					strRetValue = getLabel('no','No');
				}
				if(record.get('receivablePackageCount') > 0 && "Y" == record.get('acctUsageColl'))
				{
					strRetValue = strRetValue + '(<span class="underlined cursor_pointer">' +  record.get('receivablePackageCount') + '</span>)';
				}
			}
		}
		else if (colId === 'col_acctUsagePooling') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsagePooling')) && "Y" == record.get('acctUsagePooling'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsagePooling')) && "N" == record.get('acctUsagePooling'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		} 
		else if (colId === 'col_acctUsageSweeping') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageSweeping')) && "Y" == record.get('acctUsageSweeping'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageSweeping')) && "N" == record.get('acctUsageSweeping'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_acctUsageFSC') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageFSC')) && "Y" == record.get('acctUsageFSC'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageFSC')) && "N" == record.get('acctUsageFSC'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}else if (colId === 'col_acctUsageTrade') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageTrade')) && "Y" == record.get('acctUsageTrade'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageTrade')) && "N" == record.get('acctUsageTrade'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_acctUsageForecast') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageForecast')) && "Y" == record.get('acctUsageForecast'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageForecast')) && "N" == record.get('acctUsageForecast'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_transactionCode') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('transactionCode')) && "0" == record.get('transactionCode'))
				{
					strRetValue = "";
				}
				else
				{
					strRetValue = value;
				}
				
			}
		}
		else if (colId === 'col_acctUsageSubAccounts') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageSubAccounts')) && "Y" == record.get('acctUsageSubAccounts'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageSubAccounts')) && "N" == record.get('acctUsageSubAccounts'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_defaultDebitAcc') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('defaultDebitAcc')) && "Y" == record.get('defaultDebitAcc'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('defaultDebitAcc')) && "N" == record.get('defaultDebitAcc'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_othersDefaultChargeAccount') 
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('othersDefaultChargeAccount')) && "Y" == record.get('othersDefaultChargeAccount'))
					{
						strRetValue = getLabel('yes','Yes');
					}
					else if (!Ext.isEmpty(record.get('othersDefaultChargeAccount')) && "N" == record.get('othersDefaultChargeAccount'))
					{
						strRetValue = getLabel('no','No');
					}
				}
			}		
		else
		{
			strRetValue = value;
		}
		if (!Ext.isEmpty(viewmode) && viewmode === 'MODIFIEDVIEW'
				&& !Ext.isEmpty(record) && !Ext.isEmpty(record.raw)
				&& !Ext.isEmpty(record.raw.profileFieldType)) {
			if (record.raw.profileFieldType === "NEW")
				strRetValue = '<span class="newFieldGridValue">' + strRetValue
						+ '</span>';
			else if (record.raw.profileFieldType === "MODIFIED")
				strRetValue = '<span class="modifiedFieldValue">' + strRetValue
						+ '</span>';
			else if (record.raw.profileFieldType === "DELETED")
				strRetValue = '<span class="deletedFieldValue">' + strRetValue
						+ '</span>';
		}
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var columnWidth = 80;
		var btnArray=[ {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record')
		},{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit')
		},{
			itemId : 'btnClone',
			itemCls : 'grid-row-action-icon icon-clone',
			itemLabel : getLabel('lblcopyrecordsToolTip', 'Copy Record')
		}];
		
		
			
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : columnWidth,
			align : 'right',
			locked : true,
			items : btnArray
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
							me
									.preHandleGroupActions(strActionUrl, text,
											record,'');
						}
					}
				});
	},

	preHandleGroupActions : function(strUrl, remark, record, strAction) {
	
		var me = this;
		var grid = this.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : parentkey
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
							//me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							//me.enableValidActionsForGrid();							
							var errorMessage = '';
							if (response.responseText != '[]') {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										parentkey = data.parentIdentifier;
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
								if(strAction === 'discard') 
								{
									var me = this;
									var viewState = parentkey;
									var form, inputField;
									
									form = document.createElement('FORM');
									form.name = 'frmMain';
									form.id = 'frmMain';
									form.method = 'POST';
									form.appendChild(me.createFormField('INPUT', 'HIDDEN',
											csrfTokenName, tokenValue));
									form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
											viewState));

									form.action = 'clientAccountMasterList.form';
									document.body.appendChild(form);
									form.submit();
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
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			me.submitForm('viewClientAccountMaster.form', record, rowIndex);
		} else if (actionName === 'btnEdit'){
			me.submitForm('editClientAccountMaster.form', record, rowIndex);
		} 
		else if (actionName === 'btnClone') 
		{
			me.submitForm('cloneClientAccountMaster.form', record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		//var viewState = record.data.identifier;
		var detailViewState = record.data.identifier;
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
				parentkey));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'calledFrom',
				calledFrom));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				viewmode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'profileFieldType',record.raw.profileFieldType));
		// Please do not delete or modify below Code unless working on Migration Part		
		var isMigratedClient = document.getElementById('isMigratedClient');
		var strCPClientID = document.getElementById('strCPClientID');
		if (null != isMigratedClient && strUrl == 'viewClientAccountMaster.form'){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'isMigratedClient', isMigratedClient.value));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'strCPClientID', strCPClientID.value));
		}
		// End
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var bank = '';
							var ccy = '';
							var accountNumber = '';
							var status = '';

							if (!Ext.isEmpty(me.getBankFilter())
									&& !Ext.isEmpty(me.getBankFilter()
											.getValue())) {
								bank = me.getBankFilter().getValue();
							} else {
								bank = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getCcyFilter())
									&& !Ext.isEmpty(me.getCcyFilter()
											.getValue())) {
								ccy = me.getCcyFilter().getValue();
							} else {
								ccy = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getAccountFilter())
									&& !Ext.isEmpty(me.getAccountFilter()
											.getValue())) {
								accountNumber = me.getAccountFilter().getValue();
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

							tip.update(getLabel('bank', 'Bank') + ' : ' + bank
									+ '<br/>' + getLabel('ccy', 'CCY') + ' : '
									+ ccy + '<br/>'
									+ getLabel('Account', 'Account') + ' : '
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
		var viewState = parentkey;
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
	handleViewChanges : function(strUrl) {
		var me = this;
		var viewState = parentkey;
		var form, inputField;

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				viewmode));	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'calledFrom',
				"VIEW"));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	handleNextButtonAction : function(strUrl) {
		var me = this;
		var viewState = parentkey;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				viewmode));

	// Please do not delete or modify below Code unless working on Migration Part		
		var isMigratedClient = document.getElementById('isMigratedClient');
		var strCPClientID = document.getElementById('strCPClientID');
		if (null != isMigratedClient && strUrl == 'viewClientAdminFeatureProfileMst.form'){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'isMigratedClient', isMigratedClient.value));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'strCPClientID', strCPClientID.value));
		}
	// End	
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
				csrfTokenName, tokenValue));
	// Please do not delete or modify below Code unless working on Migration Part					
		var isMigratedClient = document.getElementById('isMigratedClient');
		if (null != isMigratedClient && isMigratedClient.value == 'Y'){
			strUrl = 'showMigrationSummary.srvc';
		}		
	// End
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
		notesJsonData+="\"viewState\":"+"\""+parentkey+"\"}";
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
		if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
			actionBar.show();
				actionBar.getComponent('btnEnable').show(true);
				actionBar.getComponent('btnDisable').show(true);
				actionBar.getComponent('btnDiscard').show(true);
		}
	},
	handleDisableVerifyAction : function(strUrl) {
		var me = this;
		$('#defaultDebitAcctConfirmMsgPopup').dialog({
            autoOpen : false,
            maxHeight: 550,
            minHeight:'auto',
            width : 400,
            modal : true,
            resizable: false,
            draggable: false        
		});
       	$('#defAcctTextContent').text(defAcctDisableCnfText);
	    $('#defaultDebitAcctConfirmMsgPopup').dialog("open");
	    $('#cancelDefAcctConfirmMsgbutton').bind('click',function(){
	        $('#defaultDebitAcctConfirmMsgPopup').dialog("close");
	    });
	    $('#okDefAcctConfirmMsgbutton').bind('click',function(){
			$('#defaultDebitAcctConfirmMsgPopup').dialog("close");
			me.preHandleGroupActions(strUrl, null,
					null,null);
		});
	    $('#defAcctTextContent').focus();			
	}	
});