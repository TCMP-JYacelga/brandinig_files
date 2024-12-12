Ext.define('GCP.controller.ProcessFinanceRequestController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.SmartGrid'],
	views : ['GCP.view.ProcessFinanceRequestView','GCP.view.ProcessFinanceRequestGridView','GCP.view.ProcessFinanceRequestFilterView', 'GCP.view.ProcessFinanceRequestActionBarView', 'Ext.util.Point'],
	refs : [{
		ref : 'processFinanceRequestView',
		selector : 'processFinanceRequestView'
	}, {
		ref : 'processFinanceRequestGridView',
		selector : 'processFinanceRequestView processFinanceRequestGridView'
	}, {
		ref : 'processFinanceRequestDtlView',
		selector : 'processFinanceRequestView processFinanceRequestGridView panel[itemId="transactionsDtlView"]'
	},{
		ref : 'processFinanceRequestGrid',
		selector : 'processFinanceRequestView processFinanceRequestGridView grid[itemId="gridViewMstId"]'
	},{
		ref : 'gridHeader',
		selector : 'processFinanceRequestView processFinanceRequestGridView panel[itemId="transactionsDtlView"] container[itemId="gridHeader"]'
	},{
		ref : 'processFinanceRequestFilterView',
		selector : 'processFinanceRequestView processFinanceRequestFilterView'
	},{
		ref : 'actionBar',
		selector : 'processFinanceRequestView processFinanceRequestGridView processFinanceRequestActionBarView'
	},{
		ref : 'fromDateLabel',
		selector : 'processFinanceRequestView processFinanceRequestFilterView label[itemId="dateFilterFrom"]'
	},{
		ref : 'toDateLabel',
		selector : 'processFinanceRequestView processFinanceRequestFilterView label[itemId="dateFilterTo"]'
	},{
		ref : 'dateLabel',
		selector : 'processFinanceRequestView processFinanceRequestFilterView label[itemId="dateLabel"]'
	}, {
		ref : 'finReqDate',
		selector : 'processFinanceRequestView processFinanceRequestFilterView button[itemId="finReqDate"]'
	},{
		ref : 'fromFinReqDate',
		selector : 'processFinanceRequestView processFinanceRequestFilterView datefield[itemId="fromDate"]'
	},{
		ref : 'toFinReqDate',
		selector : 'processFinanceRequestView processFinanceRequestFilterView datefield[itemId="toDate"]'
	},{
		ref : 'dateRangeComponent',
		selector : 'processFinanceRequestView processFinanceRequestFilterView container[itemId="dateRangeComponent"]'
	}],
	
	config :{
		filterData : [],
		statusFilter : '',
		dateHandler : null,
		dateFilterVal : '12',
		dateFilterLabel : getLabel( 'latest', 'Latest' )
	},
	
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');		
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		me.control({
			'processFinanceRequestGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'processFinanceRequestGridView smartgrid' : {
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
			'processFinanceRequestView processFinanceRequestGridView panel[itemId="transactionsDtlView"]' : {
				render : function() {
					//me.handleGridHeader();
				}
			},
			
			'processFinanceRequestView processFinanceRequestFilterView' : {
				render : function( panel, opts )
				{
					me.setInfoTooltip();
				},
				'dateChange' : function(btn, opts) 
				{
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					/*if (btn.btnValue !== '7') {
						me.setDataForQuickFilter();
						me.applyQuickFilter();
					}*/
				}
			},
			'processFinanceRequestView processFinanceRequestFilterView toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'processFinanceRequestView combobox[itemId=sellerFltId]': {
				'select' : function( combo, record, index )
				{
					var objFilterPanel = me.getProcessFinanceRequestFilterView();
					var objAutocompleterClient = objFilterPanel.down('AutoCompleter[itemId="anchorClient"]');
					objAutocompleterClient.cfgUrl = 'services/userseek/anchorClientSeek.json';
					objAutocompleterClient.cfgSeekId = 'anchorClientSeek';
					objAutocompleterClient.setValue( '' );
					objAutocompleterClient.cfgExtraParams =
					[
						{
							key : '$filtercode4',
							value : record[ 0 ].data.CODE
						}
					];
				}
			},
			'processFinanceRequestView AutoCompleter[itemId="anchorClient"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getProcessFinanceRequestFilterView();
							var objAutocompleterClient = objFilterPanel.down('AutoCompleter[itemId="counterParty"]');
							objAutocompleterClient.cfgUrl = 'services/userseek/counterPartySeek.json';
							objAutocompleterClient.cfgSeekId = 'counterPartySeek';
							objAutocompleterClient.setValue( '' );
							strClient = record[ 0 ].data.CODE;
							objAutocompleterClient.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								}
							];
							
							var objAutocompleterFSCProd = objFilterPanel.down('AutoCompleter[itemId="fscProduct"]');
							objAutocompleterFSCProd.cfgUrl = 'services/userseek/fscProductSeek.json';
							objAutocompleterFSCProd.cfgSeekId = 'fscProductSeek';
							objAutocompleterFSCProd.setValue( '' );
							strClient = record[ 0 ].data.CODE;
							objAutocompleterFSCProd.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								}
							];
							
							var objAutocompleterFinReqRefNo = objFilterPanel.down('AutoCompleter[itemId="finReqRefNo"]');
							objAutocompleterFinReqRefNo.cfgUrl = 'services/userseek/finReqRefNoSeek.json';
							objAutocompleterFinReqRefNo.cfgSeekId = 'finReqRefNoSeek';
							objAutocompleterFinReqRefNo.setValue( '' );
							strClient = record[ 0 ].data.CODE;
							objAutocompleterFinReqRefNo.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								}
							];
						},
						change : function( combo, newValue, record, index )
						{
							var objAutocompleter = me.getProcessFinanceRequestFilterView().down( 'AutoCompleter[itemId="counterParty"]' );
							objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : '%'
									}
								];
							var objAutocompleter = me.getProcessFinanceRequestFilterView().down( 'AutoCompleter[itemId="fscProduct"]' );
							objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : '%'
									}
								];
							var objAutocompleter = me.getProcessFinanceRequestFilterView().down( 'AutoCompleter[itemId="finReqRefNo"]' );
							objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : '%'
									}
								];
						}
					},
				'processFinanceRequestView AutoCompleter[itemId="fscProduct"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getProcessFinanceRequestFilterView();
							var objAutocompleterClient = objFilterPanel.down('AutoCompleter[itemId="counterParty"]');
							objAutocompleterClient.cfgUrl = 'services/userseek/counterPartySeek.json';
							objAutocompleterClient.cfgSeekId = 'counterPartySeek';
							objAutocompleterClient.setValue( '' );
							strProduct = record[ 0 ].data.CODE;
							objAutocompleterClient.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : strClient
								},
								{
									key : '$filtercode2',
									value : record[ 0 ].data.CODE
								}
							];
							
							var objAutocompleterFinReqRefNo = objFilterPanel.down('AutoCompleter[itemId="finReqRefNo"]');
							objAutocompleterFinReqRefNo.cfgUrl = 'services/userseek/finReqRefNoSeek.json';
							objAutocompleterFinReqRefNo.cfgSeekId = 'finReqRefNoSeek';
							objAutocompleterFinReqRefNo.setValue( '' );
							objAutocompleterFinReqRefNo.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : strClient
								},
								{
									key : '$filtercode2',
									value : record[ 0 ].data.CODE
								}
							];
						},
						change : function( combo, newValue, record, index )
						{
							var objAutocompleter = me.getProcessFinanceRequestFilterView().down( 'AutoCompleter[itemId="counterParty"]' );
							objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode2',
										value : '%'
									}
								];
						}
					},
			'processFinanceRequestView AutoCompleter[itemId="counterParty"]' :
			{
				select : function( combo, record, index )
				{
					var objFilterPanel = me.getProcessFinanceRequestFilterView();
					var objAutocompleterFinReqRefNo = objFilterPanel.down('AutoCompleter[itemId="finReqRefNo"]');
					objAutocompleterFinReqRefNo.cfgUrl = 'services/userseek/finReqRefNoSeek.json';
					objAutocompleterFinReqRefNo.cfgSeekId = 'finReqRefNoSeek';
					objAutocompleterFinReqRefNo.setValue( '' );
					objAutocompleterFinReqRefNo.cfgExtraParams =
					[
						{
							key : '$filtercode1',
							value : strClient
						},
						{
							key : '$filtercode2',
							value : strProduct
						},
						{
							key : '$filtercode3',
							value : record[ 0 ].data.CODE
						}
					];
				}
				
			},	
			
			'processFinanceRequestView processFinanceRequestFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
				
			'processFinanceRequestView processFinanceRequestGridView toolbar[itemId=processFinanceReqActionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getProcessFinanceRequestGrid();
		grid.refreshData();
	},
	applySeekFilter : function() {
		var me = this;
		me.setDataForFilter();
		me.applyFilter();
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	handleSmartGridConfig : function() {
		var me = this;
		var processFinanceRequestGrid = me.getProcessFinanceRequestGrid();
		var objConfigMap = me.getProcessFinanceReqGridConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap, true);
		if (!Ext.isEmpty(processFinanceRequestGrid))
			processFinanceRequestGrid.destroy(true);

		 arrCols = me.getColumns(objConfigMap.arrColsPref,
		 objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	getProcessFinanceReqGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"requestRefNmbr" : 150,
			"finReqRefNmbr" : 200,
			"invoicePoFlag" : 70,
			"clientDesc" : 150,
			"productDesc" : 150,
			"counterPartyDesc" : 150,
			"invNmbr" : 150,
			"invAmnt" : 100,
			"requestedAmnt" : 150,
			"requestDate" : 150,
			"requestStateDesc" : 100,
			"rejectReason" : 250
		};

			arrColsPref = [{
					"colId" : "requestRefNmbr",
					"colDesc" : getLabel('finReqIntNmbr','Finance Req. Internal No.'),
					"sort":true
				},{
					"colId" : "finReqRefNmbr",
					"colDesc" : getLabel('finReqRefNmbr','Finance Request Ref.No.'),
					"sort":true
				},{
					"colId" : "invoicePoFlag",
					"colDesc" : getLabel('invoicePoFlag','Doc Type'),
					"sort":true
				},{
					"colId" : "clientDesc",
					"colDesc" :  getLabel('anchorClientCode','Anchor Client'),
					"sort":true
				},{
					"colId" : "productDesc",
					"colDesc" : getLabel('productCode','Package'),
					"sort":true
				},{
					"colId" : "counterPartyDesc",
					"colDesc" : getLabel('dealerVendorCode','Counterparty'),
					"sort":true
				},{
					"colId" : "invNmbr",
					"colDesc" : getLabel('invNmbr','Document Reference'),
					"sort":true
				},{
					"colId" : "invAmnt",
					"colDesc" : getLabel('invAmnt','Amount'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "requestedAmnt",
					"colDesc" : getLabel('requestedAmnt','Finance Req. Amount'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "requestDate",
					"colDesc" : getLabel('requestDate','Finance Req. Date'),
					"sort":true
				},{
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('requestStateDesc','Status'),
					"sort":false
				},{
					"colId" : "rejectReason",
					"colDesc" : getLabel('rejectReason','Reject Reason'),
					"sort":true
				}];

		storeModel = {
			fields : ['requestRefNmbr', 'finReqRefNmbr', 'anchorClientCode', 'productCode','requestStateDesc','dealerVendorCode','counterPartyDesc','productDesc','clientDesc','invoicePoFlag',
					'__metadata', 'invNmbr','invAmnt','identifier','requestedAmnt','requestDate','actionState','history', 'makerId', 'checkerId', 'rejectReason','cashwebStatus'],
			proxyUrl : 'processFinanceRequestGridList.srvc',
			rootNode : 'd.processFinanceReq',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		bankProductGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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
			//enableColumnAutoWidth : true,
			//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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
		var processFinanceRequestDtlView = me.getProcessFinanceRequestDtlView();
		processFinanceRequestDtlView.add(bankProductGrid);
		processFinanceRequestDtlView.doLayout();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		me.setDataForFilter();
		
		var buttonMask = '0000000';
		me.enableDisableGroupActions(buttonMask,'N');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl() +'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	getColumns : function(arrColsPref, objWidthMap, showGroupActionColumn) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.draggable = true;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		strRetValue = value;
		if(colId === 'col_invoicePoFlag'){
			strRetValue = getLabel('invoicePoFlag.'+record.data.invoicePoFlag, 'Invoice/PO');	
		}
		else{
			strRetValue = value;
		}
		return strRetValue;
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(me.filterData);
		return strQuickFilterUrl;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'process' || actionName === 'enforceDebit' || actionName === 'return' || actionName === 'accept'
				|| actionName === 'reject' )
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('productDesc'),
						record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		}
		else if (actionName === 'btnView') {
			me.submitForm('viewProcessFinanceRequest.srvc', record, rowIndex);
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
		 var isSameUser = true;
		 if (record.raw.makerId === USER) {
			 isSameUser = false;
		 }
		 if (Ext.isEmpty(bitPosition))
			return retValue;
		 retValue = isActionEnabled(actionMask, bitPosition);
		return retValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 50,
			locked : true,
			sortable: false,
			lockable: false,
			draggable : true,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip :  getLabel('viewToolTip','View Record'),
						maskPosition : 7
					}]
		};
		return objActionCol;

	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000';
		var maskArray = new Array(), actionMask = '', objData = null;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 7);
		me.enableDisableGroupActions(actionMask, isSameUser);
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 150,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text : getLabel('process', 'Process'),
						itemId : 'process',
						actionName : 'process',
						maskPosition : 2
					},{
						text : getLabel('enforceDebit', 'Enforce Debit'),
						itemId : 'enforceDebit',
						actionName : 'enforceDebit',
						maskPosition : 3
					},{
						text : getLabel('return', 'Return'),
						itemId : 'return',
						actionName : 'return',
						maskPosition : 4
					},{
						text : getLabel('authorize', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 5
					},{
						text : getLabel('reject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 6
					}]
		};
		return objActionCol;
	},
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled(!blnEnabled);
						}
					});
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
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	getFilterQueryJson : function() {
		var me = this;
		var productVal = null, statusVal = null, counterPartyVal = null, finReqVal = null, jsonArray = [], clientCodeVal = null, sellerCodeVal = null;

		var processFinanceRequestFilterView = me.getProcessFinanceRequestFilterView();
		var clientFltId = processFinanceRequestFilterView.down('combobox[itemId=anchorClient]');
		var productFltId = processFinanceRequestFilterView.down('combobox[itemId=fscProduct]');
		var counterPartyFltId = processFinanceRequestFilterView.down('combobox[itemId=counterParty]');
		var finReqRefFltId = processFinanceRequestFilterView.down('combobox[itemId=finReqRefNo]');
		var statusFltId = processFinanceRequestFilterView.down('combobox[itemId=statusCombo]');
		var seller = processFinanceRequestFilterView.down('combobox[itemId=sellerFltId]');

		if (!Ext.isEmpty(clientFltId)
				&& !Ext.isEmpty(clientFltId.getValue())) {
			clientCodeVal = clientFltId.getValue().toUpperCase();
			
			if(!Ext.isEmpty(clientFltId.value))
			{
				jsonArray.push({
					paramName : 'anchorClientCode',
					operatorValue : 'eq',
					paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			else
			{
				jsonArray.push({
					paramName : 'anchorClientDesc',
					operatorValue : 'lk',
					paramValue1 : encodeURIComponent(clientCodeVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			
			
			
		}
		if (!Ext.isEmpty(productFltId)
				&& !Ext.isEmpty(productFltId.getValue())) {
			productVal = productFltId.getValue().toUpperCase();
			if(!Ext.isEmpty(productFltId.value))
			{
				jsonArray.push({
					paramName : 'productCode',
					operatorValue : 'eq',
					paramValue1 : encodeURIComponent(productVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			else
			{
				jsonArray.push({
					paramName : 'productDesc',
					operatorValue : 'lk',
					paramValue1 : encodeURIComponent(productVal.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S'
				});
			}
			
		}
		if (!Ext.isEmpty(counterPartyFltId)
				&& !Ext.isEmpty(counterPartyFltId.getValue())) {
			counterPartyVal = counterPartyFltId.getValue().toUpperCase();
			jsonArray.push({
				paramName : 'dealerVendorCode',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(counterPartyVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S'
			});
		}
		if (!Ext.isEmpty(finReqRefFltId)
				&& !Ext.isEmpty(finReqRefFltId.getValue())) {
			finReqVal = finReqRefFltId.getValue();
			jsonArray.push({
				paramName : 'invFinIntRefNmbr',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(finReqVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S'
			});
		}

		if (!Ext.isEmpty(statusFltId)
				&& !Ext.isEmpty(statusFltId.getValue())
				&& "ALL" != statusFltId.getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= statusFltId.getValue().toUpperCase()) {
			statusVal = statusFltId.getValue();
			jsonArray.push({
				paramName : 'cashwebState',
				paramValue1 : statusVal,
				operatorValue : 'eq',
				dataType : 'S'
			});
		}
		var frmDate = me.getFromFinReqDate().getValue();
		var toDate = me.getToFinReqDate().getValue();

		if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
			var dtParams = me.getDateParam('7');
			me.dateFilterFromVal = dtParams.fieldValue1;
			me.dateFilterToVal = dtParams.fieldValue2;
		}
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(index != '12')
		{
			jsonArray.push({
					paramName : me.getFinReqDate().filterParamName,
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D'
				});
		}
		
		if (!Ext.isEmpty(seller)
				&& !Ext.isEmpty(seller.getValue())) {
			sellerCodeVal = seller.getValue().toUpperCase();
			jsonArray.push({
				paramName : 'sellerCode',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(sellerCodeVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S'
			});
		}

		return jsonArray;
	},
	generateUrlWithFilterParams : function( urlFilterData )
	{
		var me = this;
		var filterData = urlFilterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for( var index = 0 ; index < filterData.length ; index++ )
		{
			if( isFilterApplied )
				strTemp = strTemp + ' and ';
			switch( filterData[ index ].operatorValue )
			{
				case 'bt' :
						if (filterData[index].dataType === 'D') {

							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' '
									+ 'date\'' + filterData[index].paramValue1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].paramValue2 + '\'';
						} 
						else 
						{
							strTemp = strTemp + filterData[index].paramName + ' '
									+ filterData[index].operatorValue + ' ' + '\''
									+ filterData[index].paramValue1 + '\''
									+ ' and ' + '\''
									+ filterData[index].paramValue2 + '\'';
						}
						break;
				case 'eq':
				case 'lk':
						isFilterApplied = true;
						if (filterData[index].dataType === 'D') {
								strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
								}
						else
						{
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
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
		if( isFilterApplied )
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
		? btn.actionName
		: btn.itemId;
		var strUrl = Ext.String.format('services/processFinReqList/{0}.srvc', strAction);
		if (strAction === 'reject' || strAction === 'return') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'return') {
			fieldLbl = getLabel('bankReturnRemarkPopUpTitle', 'Please enter return remark');
			titleMsg = getLabel('bankReturnRemarkPopUpFldLbl', 'Return Remark');
		}
		else{
			fieldLbl = getLabel('bankRejectRemarkPopUpTitle', 'Please Enter Reject Remark');
			titleMsg = getLabel('bankRejectRemarkPopUpFldLbl', 'Reject Remark');
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
					if(Ext.isEmpty(text))
					{
						Ext.Msg.alert(getLabel( 'errorTitle', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
					}
					else
					{
						me.preHandleGroupActions(strActionUrl, text, record);
					}
				}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var gridView = me.getProcessFinanceRequestGrid();
		if (!Ext.isEmpty(gridView)) {
			var arrayJson = new Array();
			var records = gridView.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
			? records
			: [record];
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : gridView.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark
								//recordDesc : records[index].data.productDesc
							});
				}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			gridView.setLoading(true);
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				timeout : 60000,
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					// TODO : Action Result handling to be done here
					gridView.setLoading(false);
					gridView.refreshData();
//							me.applyFilter();
					var errorMessage = '';
					if(!Ext.isEmpty(response.responseText))
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
						        	Ext.MessageBox.show({
										title : getLabel('errorTitle','Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										buttonText: {
								            ok: getLabel('btnOk', 'OK')
											},
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        } 
					        }
				       }
				},
				failure : function() {
				gridView.setLoading(false);
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('errorTitle', 'Error'),
								msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									},
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(productDesc, url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					productDesc : productDesc,
					identifier : id
				}).show();
	},
	setFilterParameters : function(form, record){
		var me = this;
		var selectedSeller = null, productName = null, statusVal = null;
		var arrJsn = {};
		var specificFilterView = me.getBankProductFilterView();
		var sellerCombo = specificFilterView.down('combobox[itemId=sellerFltId]');
		var product = record.data["identifier"];
		var status = specificFilterView.down('combobox[itemId=statusFilter]');
		if (!Ext.isEmpty(product)) {
			productName = product;
		}
		if(sellerCombo){
			selectedSeller = sellerCombo.getValue();
		}
		if (!Ext.isEmpty(status)
				&& !Ext.isEmpty(status.getValue())
				&& "ALL" != status.getValue()) {
			statusVal = status.getValue();
		}
		arrJsn['sellerId'] = selectedSeller;
		arrJsn['productDesc'] = productName;
		arrJsn['status']= statusVal;
		arrJsn['statusDesc']= status.getRawValue();
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'filterData', Ext.encode(arrJsn)));
	},
	setInfoTooltip : function()
		{
			var me = this;
			var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
						{
							beforeshow : function( tip )
								{
									
									var productVal = null,anchorClient = null,
									status = null, counterPartyVal = null, 
									finReqVal = null,frmDate = null,toDate = null,	date = null;
									var strSqlDateFormat = 'Y-m-d';
									var processFinanceRequestFilterView = me.getProcessFinanceRequestFilterView();
									var clientFltId = processFinanceRequestFilterView.down('combobox[itemId=anchorClient]');
									var productFltId = processFinanceRequestFilterView.down('combobox[itemId=fscProduct]');
									var counterPartyFltId = processFinanceRequestFilterView.down('combobox[itemId=counterParty]');
									var finReqRefFltId = processFinanceRequestFilterView.down('combobox[itemId=finReqRefNo]');
									var statusFltId = processFinanceRequestFilterView.down('combobox[itemId=statusCombo]');
									var seller = processFinanceRequestFilterView.down('combobox[itemId=sellerFltId]');
									var frmDat = me.getFromFinReqDate().getValue();
									var toDat = me.getToFinReqDate().getValue();
									
								
									if (!Ext.isEmpty(processFinanceRequestFilterView.down('combobox[itemId=sellerFltId]')) 
										&& processFinanceRequestFilterView.down('combobox[itemId=sellerFltId]') != null) {
										seller=processFinanceRequestFilterView.down('combobox[itemId=sellerFltId]').getRawValue();
									}
									else {
										seller = seller;
									}
									if (!Ext.isEmpty(clientFltId)
										&& !Ext.isEmpty(clientFltId.getValue())) {
										anchorClient =clientFltId.getRawValue();
									}else
										anchorClient = getLabel('none','None');
									if (!Ext.isEmpty(productFltId)
										&& !Ext.isEmpty(productFltId.getValue())) {
										productVal =productFltId.getRawValue();
									}else
										productVal = getLabel('none','None');	
										
									if (!Ext.isEmpty(counterPartyFltId)
										&& !Ext.isEmpty(counterPartyFltId.getValue())) {
										counterPartyVal =counterPartyFltId.getRawValue();
									}else
										counterPartyVal = getLabel('none','None');	
									if (!Ext.isEmpty(finReqRefFltId)
										&& !Ext.isEmpty(finReqRefFltId.getValue())) {
										finReqVal =finReqRefFltId.getRawValue();
									}else
										finReqVal = getLabel('none','None');
				
								    if (!Ext.isEmpty(frmDat) && !Ext.isEmpty(toDat)) {
											var dtParams = me.getDateParam('7');
													frmDate = dtParams.fieldValue1;
													toDate = dtParams.fieldValue2;																						
													if(frmDate == toDate)
													{
														date = frmDate;
													}
													else
													{
														date = frmDate +' To '+toDate;
													}
									}
									if (!Ext.isEmpty(statusFltId)
										&& !Ext.isEmpty(statusFltId.getValue())) {
										status =statusFltId.getRawValue();
									}else
										status = getLabel('all','ALL');															
							
									tip.update( getLabel( 'financialInsttitution', 'Financial Institution' ) + ':' + seller + '<br/>' 
                                    + getLabel('anchorClient', 'Anchor Client') + ' : '
									+ anchorClient+ '<br/>'
									+ getLabel('fscProduct', 'Package') + ':'
									+ productVal + '<br/>'
									+ getLabel('counterParty', 'Counterparty') + ':'
									+ counterPartyVal + '<br/>'
									+ getLabel('finReqDate', 'Finance Request Date') + ':'
									+ date+'<br/>'
									+ getLabel('finReqRefNo', 'Finance Request Ref. No.') + ':'
								    + finReqVal + '<br/>'
								    + getLabel( 'status', 'Status' ) + ':'
								    + status + '<br/>'
								 );
                            }
						}
					})
				},	
					
	handleDateChange : function(index) {
		var me = this;
		var filterView = me.getProcessFinanceRequestFilterView();
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index, null);
		var fromDate = me.getFromFinReqDate();
		var toDate = me.getToFinReqDate();

		if (fromDate && objDateParams.fieldValue1)
			fromDate.setValue(objDateParams.fieldValue1);
		if (toDate && objDateParams.fieldValue2)
			toDate.setValue(objDateParams.fieldValue2);

		if (index == '7') {
		var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
					strExtApplicationDateFormat ));
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();				
			me.getFromFinReqDate().setValue( dtEntryDate );
			me.getToFinReqDate().setValue( dtEntryDate );
			me.getFromFinReqDate().setMinValue(clientFromDate);
			me.getToFinReqDate().setMinValue(clientFromDate);
			
		} else {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('finReqDate', 'Finance Request Date') + " ("
					+ me.dateFilterLabel + ")");
		}
		if (index !== '7') { 
			 vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			 vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					// Do nothing for latest
					fromDateLabel.setText('Till' + '  ' + vFromDate);
				} else
					fromDateLabel.setText(vFromDate);

				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
				me.vFromDate1 = vFromDate;
				me.vToDate1 = vToDate;
			}
		}
	},
	getDateParam : function(index, dateType) {
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
				dtJson = objDateHandler.getThisWeekToDate(date);
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
				var frmDate, toDate;
				if (!Ext.isEmpty(dateType)) {
					var objCreateNewFilterPanel = me.getCreateNewFilter();
					frmDate = me.getFromFinReqDate().getValue();
					toDate = me.getToFinReqDate().getValue();

				} else {
					frmDate = me.getFromFinReqDate().getValue();
					toDate = me.getToFinReqDate().getValue();
				}
				frmDate = frmDate || date;
				toDate = toDate || frmDate;

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
				 fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				 fieldValue2 = fieldValue1;
				 operator = 'le';
				break;
		}
		// comparing with client filter condition
		if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
		
	updateDateFilterView : function() {
		var me = this;
		var dtEntryDate = null;
		var defaultToDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		var defaultFromDate = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromFinReqDate().setValue(dtEntryDate);
				} else {
					me.getFromFinReqDate().setValue(defaultFromDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToFinReqDate().setValue(dtEntryDate);
				} else {
					me.getToFinReqDate().setValue(defaultToDate);
				}
			} else {
				me.getFromFinReqDate().setValue(defaultFromDate);
				me.getToFinReqDate().setValue(defaultToDate);
			}
		}

	}
});
