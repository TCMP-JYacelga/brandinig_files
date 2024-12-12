Ext.define('GCP.controller.CounterPartyController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.CounterPartyView','GCP.view.CounterPartyTitleView','GCP.view.CounterPartyGridView','GCP.view.HistoryPopup'],
	refs : [{
				ref : 'counterPartyView',
				selector : 'counterPartyView'
			}, {
				ref : 'createNewToolBar',
				selector : 'counterPartyView counterPartyFilterView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'counterPartyFilterView',
				selector : 'counterPartyView counterPartyFilterView'
			}, {
				ref : 'counterPartySetupDtlView',
				selector : 'counterPartyView counterPartyGridView panel[itemId="counterPartySetupDtlView"]'
			},{
				ref : 'counterPartyGrid',
				selector : 'counterPartyView counterPartyGridView grid[itemId="counterPartyMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'counterPartyGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'counterPartyGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'counterPartyGridView smartgrid'
			},{
				ref : "statusFilter",
				selector : 'counterPartyView counterPartyFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'counterPartyView counterPartyGridView counterPartyActionBarView'
			},
			{
				ref : 'sellerCombo',
				selector : 'counterPartyView counterPartyFilterView combobox[itemId=sellerFltId]'
			},
			{
				ref : 'counterPartyName',
				selector : 'counterPartyView counterPartyFilterView AutoCompleter[itemId=counterpartyName]'
			},
			{
				ref : 'scmProductName',
				selector : 'counterPartyView counterPartyFilterView AutoCompleter[itemId=scmProductName]'
			},
			{
				ref : 'anchorClient',
				selector : 'counterPartyView counterPartyFilterView AutoCompleter[itemId=anchorClient]'
			},
			{
				ref : 'counterpartyClientName',
				selector : 'counterPartyView counterPartyFilterView textfield[itemId=counterpartyClientName]'
			},{
				ref : "freezeCombo",
				selector : 'counterPartyView counterPartyFilterView combobox[itemId="freezeFltId"]'
			}
			],
	config : {
		filterData : []
	},
	init : function() {
		var me = this;
		me.control({
			'counterPartyView counterPartyGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateCounterParty"]' : {
				click : function() {
					me.handleCounterPartyEntryAction(true);
				}
			},
			'counterPartyView counterPartyFilterView' : {
				render : function() {
					me.setInfoTooltip();
				}
			},
			'counterPartyView counterPartyFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'counterPartyGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'counterPartyGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'counterPartyGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'counterPartyGridView smartgrid' : {
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
			'counterPartyGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
			performGroupAction : function(btn, opts) {
				me.handleGroupActions(btn);
			}
			}
		});
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		grid.loadGridData(strUrl, null);
	},
	
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
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
		me.getSearchTextInput().setValue('');
		
		var statusVal = null, scmProductName = null,counterPartyName = null,anchorClientName=null,counterPartyClientName=null, jsonArray = [];
		var sellerVal = null, freezeVal = null;
		var sellerFltId = me.getSellerCombo();
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
				&& "ALL" != sellerFltId.getValue()) {
			sellerVal = sellerFltId.getValue();
		}
		
		var freezeFltId = me.getFreezeCombo();
		if (!Ext.isEmpty(freezeFltId) && !Ext.isEmpty(freezeFltId.getValue())
				&& "ALL" != freezeFltId.getValue()) {
			freezeVal = freezeFltId.getValue();
			if("Yes" == freezeVal)
				freezeVal = 'Y';
			else if("No" == freezeVal)
				freezeVal = 'N';
		}

		var counterPartyNameRef=me.getCounterPartyName();
		if (!Ext.isEmpty(counterPartyNameRef)){
			if(!Ext.isEmpty(counterPartyNameRef.getValue())){
			counterPartyName = counterPartyNameRef.getValue();
			}
		}
		
		var scmProductNameRef=me.getScmProductName();
		if (!Ext.isEmpty(scmProductNameRef)){
			if(!Ext.isEmpty(scmProductNameRef.getValue())){
			scmProductName = scmProductNameRef.getValue();
			}
		}
		var anchorClientRef=me.getAnchorClient();
		if(!Ext.isEmpty(anchorClientRef)){
		if (!Ext.isEmpty(anchorClientRef.getValue())){
			anchorClientName = anchorClientRef.getValue();
		}
		}
		
		
		var counterPartyCodeRef=me.getCounterpartyClientName();
		if (!Ext.isEmpty(counterPartyCodeRef)){
				if(!Ext.isEmpty(counterPartyCodeRef.getValue())){
			counterPartyClientName = counterPartyCodeRef.getValue();
				}
		}
		
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& getLabel('all', 'All') != me.getStatusFilter().getValue()) {
			statusVal = me.getStatusFilter().getValue();
	var isPending = true;
			 if(statusVal  == 13)//13:Pending My Approval
			 {
				 statusVal  = new Array('5YN','4NN','0NY','1YY');
				 isPending = false;
		         jsonArray.push({
		             paramName : 'statusFilter',
				     paramValue1 : statusVal,
				     operatorValue : 'in',
					  dataType : 'S'
					});
				jsonArray.push({
				     paramName : 'user',
					 paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
					 operatorValue : 'ne',
					 dataType : 'S'
					});
			}
			if(isPending)
			{
			if (statusVal == 12 || statusVal == 3 || statusVal == 14) 
			{
				if (statusVal == 12 || statusVal == 14) //12:New Submitted //13:Modified Submitted
				{
					statusVal = (statusVal == 12)?0:1;
					jsonArray.push({
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
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
			
				jsonArray.push({
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						});
			}			
		}


		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : encodeURIComponent(sellerVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(freezeVal)) {
			jsonArray.push({
						paramName : freezeFltId.filterParamName,
						paramValue1 : encodeURIComponent(freezeVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(anchorClientName)) {
			jsonArray.push({
						paramName : 'clientName',
						paramValue1 : encodeURIComponent(anchorClientName.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(counterPartyClientName)) {
			jsonArray.push({
						paramName : 'counterpartyClientName',
						paramValue1 : encodeURIComponent(counterPartyClientName.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(counterPartyName)) {
			jsonArray.push({
						paramName : 'counterpartyName',
						paramValue1 : encodeURIComponent(counterPartyName.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(scmProductName)) {
			jsonArray.push({
						paramName : 'scmProductName',
						paramValue1 : encodeURIComponent(scmProductName.replace(new RegExp("'", 'g'), "\''")),
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
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartGridConfig : function() {
		var me = this;
		var counterPartyGrid = me.getCounterPartyGrid();
		var objConfigMap = me.getCounterPartyGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(counterPartyGrid))
			counterPartyGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var counterPartyGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'counterPartyMstId',
					itemId : 'counterPartyMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '5 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
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

		var clntSetupDtlView = me.getCounterPartySetupDtlView();
		clntSetupDtlView.add(counterPartyGrid);
		clntSetupDtlView.doLayout();
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard'
				|| (actionName === 'btnUnFreeze' && record.get('isFreeze') === 'Y'))
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('counterPartyName'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewCounterPartyMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editCounterPartyMst.form', record, rowIndex);
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
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(product ,url, id) {
		var historyPopup = Ext.create('GCP.view.HistoryPopup', {
					productName : product,
					historyUrl : url,
					identifier : id
				}).show();
		historyPopup.center();
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
			if(record.raw.isFreeze === 'Y'){
				var validFlag = record.raw.validFlag;
				var reqState = record.raw.requestState;
				retValue = retValue && (reqState == 3 && validFlag == 'Y');
			}
			else
				retValue = false;
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
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.resizable = false;
					cfgCol.draggable = false;
					cfgCol.hidden = false;
				}
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
					}, {
						itemId : 'btnUnFreeze',
						itemCls : 'grid-row-action-icon icon-clone',
						itemLabel : getLabel('unFreezeToolTip',
								'Unfreeze Relationship'),
						maskPosition : 9
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
		if (strAction === 'btnUnFreeze') strAction = 'unFreeze';
		var strUrl = Ext.String.format('cpon/counterPartyMst/{0}.srvc?',
				strAction);
		if (strAction === 'reject' || strAction === 'unFreeze') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}else if (strAction === 'unFreeze') {
			fieldLbl = getLabel('prfUnFreezePopUpTitle',
					'Please enter unfreeze remark');
			titleMsg = getLabel('prfUnFreezeRemarkPopUpFldLbl', 'UnFreeze Remark');
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
							me.preHandleGroupActions(strActionUrl, text, record);
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
							userMessage : remark,
							recordDesc : records[index].data.counterPartyDescription
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
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId) {
		var strRetValue = "";
		
		if (colId == "col_clientType") {
			if(value=='D')
			strRetValue = "Dealer";
			
			if(value=='V')
			strRetValue = "Vendor";
		}else{
		strRetValue = value;
		}
			
		return strRetValue;
	},
	getCounterPartyGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"counterPartyName" : 150,
			"counterPartyId" : 150,
			"clientType":150,
			"toAnchorDescription:":150,
			"scmProductDescription":150,
			"requestStateDesc":150
		};

		arrColsPref = [{
					"colId" : "clientDescription",
					"colDesc" : getLabel("lblClientDesc","Company Name"),
					"sort": true
				},{
					"colId" : "counterPartyDescription",
					"colDesc" : getLabel("counterPartyNm","Counterparty Name"),
					"sort": true
				},{
					"colId" : "clientType",
					"colDesc" : getLabel("counterPartyType","Counterparty Type"),
					"sort": true
				},{
					"colId" : "toAnchorDescription",
					"colDesc" : getLabel("counterPartyAncClient","Anchor Client"),
					"sort": true
				},{
					"colId" : "scmProductDescription",
					"colDesc" : getLabel("counterPartyscmpro","SCM Product"),
					"sort": true
				},{
					"colId" : "requestStateDesc",
					"colDesc" : getLabel('status', 'Status'),
					"sort": false
				}
				];

		storeModel = {
			fields : ['counterPartyName','counterPartyId','clientType','scmProductDescription','toAnchorDescription','requestStateDesc', 
					'identifier','history','__metadata','clientDescription','counterPartyDescription','isFreeze'],
			proxyUrl : 'cpon/counterPartyMst.json',
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
	handleCounterPartyEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addCounterPartyMst.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

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
						beforeshow : function(tip) {
						var seller = '';
							var anchorClient = '';
							var counterPartName = '';
							var counterPartyClientName = '';
							var status='';
							var freeze = '';
							var scmProductName ='';
							
							var sellerFltId = me.getSellerCombo();
							if (!Ext.isEmpty(sellerFltId)
									&& !Ext.isEmpty(sellerFltId
											.getValue())) {
								seller = sellerFltId.getRawValue();
							} else {
								seller = getLabel('all', 'ALL');
							}
							
							var freezeFltId = me.getFreezeCombo();
							if (!Ext.isEmpty(freezeFltId)
									&& !Ext.isEmpty(freezeFltId
											.getValue())) {
								freeze = freezeFltId.getValue();
							} else {
								freeze = getLabel('all', 'ALL');
							}

							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							
							var anchorClientRef =me.getAnchorClient();
							if (!Ext.isEmpty(anchorClientRef) && !Ext.isEmpty(anchorClientRef.getValue())) {
								anchorClient = anchorClientRef.getValue();
							} else {
								anchorClient = getLabel('none', 'None');
							}
						    var scmProductNameRef=me.getScmProductName();
							if (!Ext.isEmpty(scmProductNameRef)){
								if(!Ext.isEmpty(scmProductNameRef.getValue())){
								scmProductName = scmProductNameRef.getValue();
								}
								else {
								scmProductName = getLabel('none', 'None');
							}
							}
							var counterPartyNameRef=me.getCounterPartyName();
							if (!Ext.isEmpty(counterPartyNameRef) && !Ext.isEmpty(counterPartyNameRef.getValue())) {
								counterPartyName = counterPartyNameRef.getValue();
							} else {
								counterPartyName = getLabel('none', 'None');
							}
							
							var counterPartyClientNameRef=me.getCounterpartyClientName();
							if (!Ext.isEmpty(counterPartyClientNameRef) && !Ext.isEmpty(counterPartyClientNameRef.getValue())) {
								counterPartyClientName = counterPartyClientNameRef.getValue();
							} else {
								counterPartyClientName = getLabel('none', 'None');
							}
							
							tip.update(getLabel("seller","Seller")
									+ ' : '
									+ seller
									+ '<br/>'
									+ getLabel('anchorCient','Anchor Client')
									+ ' : '
									+ anchorClient
									+ '<br/>'
									+ getLabel('scmProduct','SCF Package')
									+ ' : '
									+ scmProductName
									+ '<br/>'
									+ getLabel('counterpartyName','Counterparty Name')
									+ ' : '
									+ counterPartyName
									+ '<br/>'
									+ getLabel('counterpartyClientName','Counterparty\'s Client Name')
									+ ' : '
									+ counterPartyClientName
									+ '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status
									+ '<br/>'
									+ getLabel('freeze','Relationship Freeze')
									+ ' : '
									+ freeze
									);
							
							
						}
					}
				});
	}

});