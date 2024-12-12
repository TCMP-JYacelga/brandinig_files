Ext.define('GCP.controller.IncomingPayServiceController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.IncomingPayServiceView', 'GCP.view.IncomingPayActionBarView','GCP.view.AddEditViewRulePopup'],
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
				ref : 'debitfield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] container[itemId="crDrPanel"] checkboxfield[itemId="debit"]'
			},{
				ref : 'creditfield',
				selector : 'addEditViewRulePopup panel[itemId="leftPanel"] container[itemId="crDrPanel"] checkboxfield[itemId="credit"]'
			},
			{
				ref : 'recordKeyNofield',
				selector : 'addEditViewRulePopup panel[itemId="rightPanel"] hiddenfield[itemId="recordKeyNo"]'
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
	setFieldValue : function(value)
	{
	  var elmValue = '';
	  if(value != null && value != 'null')
	  {
	   elmValue = value;
	  }
	  return elmValue;
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
		var isDebit = this.getDebitfield().getValue();
		var isCredit = this.getCreditfield().getValue();
		var recordKeyNo = this.getRecordKeyNofield().getValue();
				
		var record =  {
							priority : this.setFieldValue(priority),
							ruleName : this.setFieldValue(ruleName),
							amount : this.setFieldValue(amount),
							operator : this.setFieldValue(operator),
							ruleType : this.setFieldValue(ruleType),
							requestTypeOf : this.setFieldValue(reqType),
							actionTaken : this.setFieldValue(action),
							partyIs: this.setFieldValue(party),
							underSecCode: this.setFieldValue(usCode),
							profileId: incomingPayProfileId,
							credit : this.setFieldValue(isCredit),
							debit : this.setFieldValue(isDebit),
							recordKeyNo : recordKeyNo
						}; 
			var jsonData = { identifier : parentkey,
							 userMessage : record	
							}; 
			if(ruleName){
				Ext.Ajax.request({
					url: 'cpon/incomingPaymentProfileMst/addIncomingPayRule.json',
					method: 'POST',
					jsonData: jsonData,
					success: function(response) {
						var errorMessage = '';
						if(response.responseText != '[]')
						{
							var jsonData = Ext.decode(response.responseText);
							Ext.each(jsonData[0].errors, function(error, index) {
								errorMessage = errorMessage + error.errorMessage +"<br/>";
							});
							if('' != errorMessage && null != errorMessage)
							Ext.Msg.alert("Error",errorMessage);
						}
						
						 var grid = me.getGrid();
							grid.refreshData();
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
		grid.loadGridData(strUrl, null);
	},
	
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createGroupActionColumn());
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
			"action" : 80,
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
				}	, {
					"colId" : "activeFlag",
					"colDesc" : "Status"
				}];

		var storeModel = {
			fields : ['identifier', 'ruleName', 'priority',
					'activeFlag','ruleType','requestTypeOf','partyIs','underSecCode','amount','actionTaken','operator','recordKeyNo','isDebit','isCredit'],
			proxyUrl : 'cpon/incomingPaymentProfileMst/incomingPayRulesList.json',
			rootNode : 'd.profileDetails',
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
			isRowIconVisible : me.isRowIconVisible,
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
		
		if(colId == 'col_ruleName' && viewMode == 'VIEW_CHANGES')
		{
			if(null !=record.raw.ruleNameFieldType)
			strRetValue='<span class='+record.raw.ruleNameFieldType+'>'+strRetValue+'</span>';
		}
		if(colId == 'col_priority' && viewMode == 'VIEW_CHANGES')
		{
			if(null !=record.raw.priorityFieldType)
			strRetValue='<span class='+record.raw.priorityFieldType+'>'+strRetValue+'</span>';
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
		if(submitPageMode == true)
		{
			objActionCol.items=[{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
						
					}];
		}
		return objActionCol;

	},
	
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'groupaction',
			width : 120,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'submit',
						itemCls : 'grid-row-text-icon icon-submit-text',
						toolTip : getLabel('prfMstActionSubmit', 'Submit'),
						itemLabel : getLabel('prfMstActionSubmit', 'Submit'),
						maskPosition : 5
					}, {
						itemId : 'discard',
						itemCls : 'grid-row-text-icon icon-discard-text',
						toolTip : getLabel('prfMstActionDiscard', 'Discard'),
						itemLabel : getLabel('prfMstActionDiscard', 'Discard'),
						maskPosition : 10
					}],
			moreMenu : {
				fnMoreMenuVisibilityHandler : function(store, record, jsonData,
						itmId, menu) {
					return me.isRowMoreMenuVisible(store, record, jsonData,
							itmId, menu);
				},
				fnMoreMenuClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					me.handleRowMoreMenuClick(tableView, rowIndex, columnIndex,
							btn, event, record);
				},
				items : [{
							itemId : 'accept',
							itemCls : 'grid-row-text-icon icon-approve-text',
							toolTip : getLabel('prfMstActionApprove', 'Approve'),
							itemLabel : getLabel('prfMstActionApprove', 'Approve'),
							maskPosition : 6
						}, {
							itemId : 'reject',
							toolTip : getLabel('prfMstActionReject', 'Reject'),
							itemLabel : getLabel('prfMstActionReject', 'Reject'),
							maskPosition : 7
						}, {
							itemId : 'enable',
							toolTip : getLabel('prfMstActionEnable', 'Enable'),
							itemLabel : getLabel('prfMstActionEnable', 'Enable'),
							maskPosition : 8
						}, {
							itemId : 'disable',
							toolTip : getLabel('prfMstActionDisable',	'Disable'),
							itemLabel : getLabel('prfMstActionDisable',	'Disable'),
							maskPosition : 9
						}]
			}
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

	


	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/incomingPaymentPrfRule/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);

		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}

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
											record);
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
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
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
			me.showRulePopup('VIEW', record);
		} else if (actionName === 'btnEdit'){
			me.showRulePopup('EDIT', record);
		}
	},
	showRulePopup : function(popupViewMode,record){
	    var popupData = record.data;
		var rulepopup= Ext.create('GCP.view.AddEditViewRulePopup');
		var ruleName = this.getRulenamefield();
		var reqType = this.getReqtypefield();
		var operator = this.getOperatorfield();
		var amount = this.getAmountfield();
		var action = this.getActionfield();
		var ruleType = this.getRuletypefield();
		var party = this.getPartyfield();
		var usCode = this.getUscodefield();
		var priority = this.getPriorityfield();
		var isDebit = this.getDebitfield();
		var isCredit = this.getCreditfield();
		
		ruleName.setValue(popupData.ruleName);
		reqType.setValue(popupData.requestTypeOf);
		var operatorValue = null;
		if(popupData.opeartor === 'LT')
			operatorValue = '<';
		else if(popupData.opeartor === 'GT')	
			operatorValue = '>';
		else
			operatorValue = '=';
		
		if(popupData.operator != null && popupData.operator != 'null')
		operator.setValue(operatorValue);
		if(popupData.amount != null && popupData.amount != 'null')
		amount.setValue(popupData.amount);
		if(popupData.actionTaken != null && popupData.actionTaken != 'null')
		action.setValue(popupData.actionTaken);
		if(popupData.ruleType != null && popupData.ruleType != 'null')
		ruleType.setValue(popupData.ruleType);
		if(popupData.partyIs != null && popupData.partyIs != 'null')
		party.setValue(popupData.partyIs);
		if(popupData.underSecCode != null && popupData.underSecCode != 'null')
		usCode.setValue(popupData.underSecCode);
		
		if(popupData.isCredit != null && popupData.isCredit != 'null')
		isCredit.setValue(popupData.isCredit);
		
		if(popupData.isDebit != null)
		{
			isDebit.setValue(popupData.isDebit);// = popupData.isDebit;
		}
		
		
		
		priority.setValue(popupData.priority);
		
		var recordKeyNo = this.getRecordKeyNofield();
		recordKeyNo.setValue(popupData.recordKeyNo);
		
		if(popupViewMode == 'EDIT')
		{
			ruleName.setDisabled(true);
		}
		else if(popupViewMode == 'VIEW')
		{
			ruleName.setDisabled(true);
			reqType.setDisabled(true);
			operator.setDisabled(true);
			amount.setDisabled(true);
			action.setDisabled(true);
			ruleType.setDisabled(true);
			party.setDisabled(true);
			usCode.setDisabled(true);
			priority.setDisabled(true);
			isDebit.setDisabled(true);
			isCredit.setDisabled(true);
		}

		rulepopup.show();
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		//var viewState = record.data.identifier;
		var detailViewState = record.data.identifier;
		var updateIndex = rowIndex;
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
	}
});