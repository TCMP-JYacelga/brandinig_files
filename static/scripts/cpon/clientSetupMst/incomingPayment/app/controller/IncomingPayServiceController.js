Ext.define('CPON.controller.IncomingPayServiceController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['CPON.view.IncomingPayServiceView', 'CPON.view.IncomingPayActionBarView','CPON.view.AddEditViewRulePopup'],
	refs : [{
				ref : 'clientAccountDtlView',
				selector : 'incomingPayServiceView panel[itemId="clientAccountDtlView"]'
			},{
				ref : 'grid',
				selector : 'incomingPayServiceView smartgrid'
			}, {
				ref : 'discardBtn',
				selector : 'incomingPayServiceView toolbar[itemId="accountActionBar"] button[itemId="btnDiscard"]'
			}, {
				ref : 'enableBtn',
				selector : 'incomingPayServiceView toolbar[itemId="accountActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'incomingPayServiceView toolbar[itemId="accountActionBar"] button[itemId="btnDisable"]'
			},{
				ref : 'savebutton',
				selector : 'addEditViewRulePopup button[itemId="saveButton"]'
			},{
				ref : 'rulenamefield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] textfield[itemId="ruleName"]'
			},{
				ref : 'reqtypefield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] combo[itemId="reqType"]'
			},{
				ref : 'operatorfield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] container combo[itemId="operator"]'
			},{
				ref : 'amountfield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] container textfield[itemId="amount"]'
			},{
				ref : 'actionfield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] combo[itemId="action"]'
			},{
				ref : 'ruletypefield',
				selector : 'addEditViewRulePopup panel[itemId="rightPanel"] combo[itemId="ruleType"]'
			},{
				ref : 'partyfield',
				selector : 'addEditViewRulePopup panel[itemId="rightPanel"] combo[itemId="whereParty"]'
			},{
				ref : 'uscodefield',
				selector : 'addEditViewRulePopup panel[itemId="rightPanel"] combo[itemId="usCode"]'
			},{
				ref : 'priorityfield',
				selector : 'addEditViewRulePopup panel[itemId="rightPanel"] textfield[itemId="priority"]'
			},{
				ref : 'debitcheckbox',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] panel[itemId="checkPanel"] checkbox[itemId="debitcbox"]'
			},{
				ref : 'creditcheckbox',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] panel[itemId="checkPanel"] checkbox[itemId="creditcbox"]'
			},
			{
				ref : 'createNewRuleBtn',
				selector : 'incomingPayServiceView panel[itemId="clientAccountDtlView"] button[itemId="btnAccountGrid"]'
			}	
			
			],
	config : {
		
	},
	init : function() {
		var me = this;
		me.control({
			'addEditViewRulePopup' : {
				submitRule : function() {
					me.submitRule();
				}
			},
			'incomingPayServiceView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
					me.handleCreateNewRuleLabel();
				}
			},
			'incomingPayServiceView smartgrid' : {
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
			'incomingPayServiceView toolbar[itemId=accountActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'addEditViewRulePopup button[itemId=saverule]' : {
				click : function(){
					
				}
			}
 
		});
	},
	handleCreateNewRuleLabel : function() {
		var me=this;
		var createNewRuleBtnRef=me.getCreateNewRuleBtn();
		if(!Ext.isEmpty(createNewRuleBtnRef)){
		if(viewmode === 'VIEW' || viewmode === "MODIFIEDVIEW"){
			createNewRuleBtnRef.hide();
		}else{
			createNewRuleBtnRef.show();
		}
		}
	},
	submitRule : function(){
		var me = this;
		var ruleName = this.getRulenamefield().getValue();
		var reqType = this.getReqtypefield().getValue();
		var operator = this.getOperatorfield().getValue();
		if(operator === '<')
			operator = 'LT';
		else if(operator === '>')	
			operator = 'GT';
		else
			operator = 'EQ';
		var amount = this.getAmountfield().getValue();
		var action = this.getActionfield().getValue();
		var ruleType = this.getRuletypefield().getValue();
		var party = this.getPartyfield().getValue();
		var usCode = this.getUscodefield().getValue();
		var priority = this.getPriorityfield().getValue();
		var credit = this.getCreditcheckbox().getValue();
		var debit = this.getDebitcheckbox().getValue();
		var incomingCrDrFlag = null;
		if(credit && debit){
			incomingCrDrFlag = 'B';
		}else if(credit){
			incomingCrDrFlag = 'C';
		}else if(debit){
			incomingCrDrFlag = 'D';
		}
		var record =  {
							priority : priority,
							ruleName : ruleName,
							amount : amount,
							operator : operator,
							ruleType : ruleType,
							requestTypeOf : reqType,
							actionTaken : action,
							partyIs: party,
							underSecCode: usCode,
							profileId: incomingPayProfileId,
							incomingCrDrFlag : incomingCrDrFlag	
						}; 
			var jsonData = { identifier : parentkey,
							 userMessage : record	
							}; 
			if(ruleName){
				Ext.Ajax.request({
					url: 'cpon/clientPayment/addIncomingPayRule.json',
					method: 'POST',
					jsonData: jsonData,
					success: function() {
						me.getGrid().refreshData();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});						
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
						discardActionEnabled = true;
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
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
		strUrl = strUrl+'&$select=' + incomingPayProfileId;
		grid.loadGridData(strUrl,me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		clientGridLoaded=true;
		enableDisableGridButtons(false);
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
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

	handleSmartGridLoading : function() {
		var me = this;
		var pgSize = null;
		pgSize = 10;

		var objWidthMap = {
			"ruleName" : 130,
			"priority" : 130,
			"activeFlag" : 80
		};

		var arrColsPref = [{
					"colId" : "ruleName",
					"colDesc" : "Rule Name"
				}, {
					"colId" : "priority",
					"colDesc" : "Priority"
				}, {
					"colId" : "activeFlag",
					"colDesc" : "Status"
				}];

		var storeModel = {
			fields : ['identifier', 'ruleName', 'priority',
					'activeFlag'],
			proxyUrl : 'cpon/clientServiceSetup/incomingPayRulesList.json',
			rootNode : 'd.accounts',
			totalRowsNode : 'd.__count'
		};
		
		arrCols = me.getColumns(arrColsPref, objWidthMap);
		accountGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			}

		});

		var clntAccountDtlView = me.getClientAccountDtlView();
		clntAccountDtlView.add(accountGrid);
		clntAccountDtlView.doLayout();
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";'activeFlag';
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
		else
		{
			strRetValue = value;
		}
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit')
						
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
						
					}]
			
		};
		return objActionCol;

	},
	
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/incomingPayRule/{0}',
				strAction);
		
			this.preHandleGroupActions(strUrl, '', record);
		
	},
	preHandleGroupActions : function(strUrl, remark, record) {
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
							me.enableValidActionsForGrid();
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
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			var viewRuelpopup = Ext.create('CPON.view.AddEditViewRulePopup');
			this.getSavebutton().setText("Close");
			viewRuelpopup.show();
		} else if (actionName === 'btnEdit'){
			var editRuelpopup = Ext.create('CPON.view.AddEditViewRulePopup');
			editRuelpopup.show();
		}
	}
});