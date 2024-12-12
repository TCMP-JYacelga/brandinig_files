Ext.define('CPON.controller.CounterPartyAccMstController', {
	extend : 'Ext.app.Controller',
	views : ['CPON.view.CounterPartyAccMstView','CPON.view.CounterPartyAccMstFilterView','CPON.view.CounterPartyAccMstGridView','CPON.view.EditCounterPartyAccPopup'],
	requires : ['CPON.view.CounterPartyAccMstView','CPON.view.CounterPartyAccMstFilterView','CPON.view.CounterPartyAccMstGridView'],
	refs : [{
				ref : 'counterPartyAccMstView',
				selector : 'counterPartyAccMstView'
			},
			{
				ref : 'createNewToolBar',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'counterPartyAccMstView counterPartyAccMstFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'counterPartyAccMstGridView',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView'
			}, {
				ref : 'accountDtlView',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView panel[itemId="accountDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView panel[itemId="accountDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'counterPartyAccMstGrid',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'counterPartyAccMstGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'counterPartyAccMstGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'counterPartyAccMstGridView smartgrid'
			},{
				ref : 'groupActionBar',
				selector : 'counterPartyAccMstView counterPartyAccMstGridView accountActionBar'
			},{
				ref : 'editCounterPartyAccPopup',
				selector : 'editCounterPartyAccPopup'
			},{
				ref : 'defaultAccountCombo',
				selector : 'editCounterPartyAccPopup combo[itemId="defaultAccountCombo"]'
			},{
				ref : 'defaultCcyCombo',
				selector : 'editCounterPartyAccPopup combo[itemId="defaultCcyCombo"]'
			},{
				ref : 'accDescField',
				selector : 'editCounterPartyAccPopup textfield[itemId="accDescField"]'
			},{
				ref : 'defaultBranchTypeCombo',
				selector : 'editCounterPartyAccPopup combo[itemId="defaultBranchTypeCombo"]'
			}, {
				ref : 'enableBtn',
				selector : 'counterPartyAccMstGridView toolbar[itemId="accountActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'counterPartyAccMstGridView toolbar[itemId="accountActionBar"] button[itemId="btnDisable"]'
			},{
				ref : 'accountNameCombo',
				selector : 'counterPartyAccMstView counterPartyAccMstFilterView AutoCompleter[itemId="accountNameCombo"]'
			},{
				ref : 'bankCombo',
				selector : 'counterPartyAccMstView counterPartyAccMstFilterView AutoCompleter[itemId="bankCombo"]'
			},{
				ref : 'branchCombo',
				selector : 'counterPartyAccMstView counterPartyAccMstFilterView AutoCompleter[itemId="branchCombo"]'
			},
			{
				ref : 'groupActionContainer',
				selector : 'counterPartyAccMstGridView container[itemId="groupActionContainer"]'
			}
			],
			
	config : {
		filterData : [],
		statusStore:null
	},
	init : function() {
		var me = this;
		 statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
				
		me.control({
			/*'counterPartyAccMstView counterPartyAccMstGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateSCMProduct"]' : {
				click : function() {
					//me.handleSCMProductEntryAction(true);
				}
			},*/
			'counterPartyAccMstView counterPartyAccMstFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'counterPartyAccMstView counterPartyAccMstFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'counterPartyAccMstView counterPartyAccMstGridView panel[itemId="accountDtlView"]' : {
				render : function() {
					//me.handleGridHeader();
					
				}
			},
			'counterPartyAccMstView counterPartyAccMstGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.handleGroupActionBarLoading();
				}
			},
			'counterPartyAccMstGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'counterPartyAccMstGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'counterPartyAccMstGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,records, jsonData) {
					me.enableDisableGroupActions();
				}
			},
			'counterPartyAccMstGridView toolbar[itemId=accountActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'editCounterPartyAccPopup button[itemId="btnSubmitCFAccount"]' : {
				submitUpdateCFAccount : function(identifier) {
					me.submitUpdateCFAccount(identifier);
				}
			},
			'editCounterPartyAccPopup combo[itemId="defaultAccountCombo"]' : {
				change : me.getAccountValues
			}

		});
	},
	handleGroupActionBarLoading:function(){
		var me=this;
		var groupActionContainerRef=me.getGroupActionContainer();
		if(!Ext.isEmpty(groupActionContainerRef)){
		if('EDIT' === docmode){
			groupActionContainerRef.show();
		}else{
			groupActionContainerRef.hide();
		}
		}
	},
	getAccSubTypeValues : function(combo, newValue, oldValue, eOpts) {
		var me = this;
		var accSubTypeCombo = me.getDefaultAccountSubTypeCombo();
		if (!Ext.isEmpty(accSubTypeCombo) && !Ext.isEmpty(combo.getValue())) {
			var accSubTypeComboStore = accSubTypeCombo.getStore();
			accSubTypeComboStore.proxy.extraParams = {
				qfilter : combo.getValue()
			};
			accSubTypeComboStore.load();
		}

	},
	getAccountValues : function(combo, newValue, oldValue, eOpts) {
		var me = this;
		var accCombo = me.getDefaultAccountCombo();
		if (!Ext.isEmpty(accCombo) && !Ext.isEmpty(combo.getValue())) {
			var accComboStore = accCombo.getStore();
			accComboStore.proxy.extraParams = {
				qfilter : combo.getValue()
			};
			accComboStore.load();
		}

	},
	handleSpecificFilter : function() {
		var me = this;
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
			filterPanel.add({
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						columnWidth : 0.5,
						layout : 'vbox',
						items : [{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel : getLabel('accountName','Account Name'),
								labelPad: 2,
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'accountNameCombo',
								name : 'accountNameAutoCompleter',
								cfgUrl : 'services/counterPartyMstSeek/counterPartyAccNameSeek.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgDataNode1 : 'name',
								cfgKeyNode : 'name'
							}]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						columnWidth : 0.5,
						layout : 'vbox',  
						items : [{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel : getLabel('bank','Bank'),
								labelPad: 2,
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'bankCombo',
								name : 'bankAutoCompleter',
								cfgUrl : 'services/counterPartyMstSeek/counterPartyBankNameSeek.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgDataNode1 : 'name',
								cfgKeyNode : 'name'
							}]
					});
						filterPanel.columnWidth = 0.56;
		
		
		
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl= strUrl + '&id='+encodeURIComponent(parentkey);
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
		
		var accName = null, bankName = null, branchName = null, jsonArray = [];
		var sellerVal = null;
		
		var accNameComboRef=me.getAccountNameCombo();
		if (!Ext.isEmpty(accNameComboRef)){
			if(!Ext.isEmpty(accNameComboRef.getValue())){
			accName = accNameComboRef.getValue();
			}
		}
		
		var bankComboRef=me.getBankCombo();
		if(!Ext.isEmpty(bankComboRef)){
		if (!Ext.isEmpty(bankComboRef.getValue())){
			bankName = bankComboRef.getValue();
		}
		}
		
		
		var branchComboRef=me.getBranchCombo();
		if (!Ext.isEmpty(branchComboRef)){
				if(!Ext.isEmpty(branchComboRef.getValue())){
			branchName = branchComboRef.getValue();
				}
		}
		
		var accountComboRef=me.getBranchCombo();
		if (!Ext.isEmpty(branchComboRef)){
				if(!Ext.isEmpty(branchComboRef.getValue())){
			branchName = branchComboRef.getValue();
				}
		}
	
		if (!Ext.isEmpty(accName)) {
			jsonArray.push({
						paramName : 'accountName',
						paramValue1 : accName,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(bankName)) {
			jsonArray.push({
						paramName : 'bankName',
						paramValue1 : bankName,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(branchName)) {
			jsonArray.push({
						paramName : 'branchName',
						paramValue1 : branchName,
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
		var counterPartyAccGridRef = me.getCounterPartyAccMstGrid();
		var objConfigMap = me.getCounterPartyGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(counterPartyAccGridRef))
			counterPartyAccGridRef.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		if(docmode==="VIEW")
		var checkBoxColFlag=false;
		else
		var checkBoxColFlag=true;
		var pgSize = null;
		pgSize = 10;
		counterPartyAccGridRef = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showCheckBoxColumn : checkBoxColFlag,
					showEmptyRow : false,
					padding : '5 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
//					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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

		var accDtlView = me.getAccountDtlView();
		if(!Ext.isEmpty(accDtlView)){
		accDtlView.add(counterPartyAccGridRef);
		accDtlView.doLayout();
		}
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'enable' || actionName === 'disable'|| actionName === 'discard')
			me.handleGroupActions(btn, record);
		 if (actionName === 'btnView') {
			 me.showEditCFAccountPopup('VIEW',record);
		 } else if (actionName === 'btnEdit') {
		 	me.showEditCFAccountPopup('EDIT',record);
		 }
    },
	
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
    	if(itmId=="btnEdit" && 'VIEW' === docmode){
    		return false;
    	}
    	
    	if((itmId=="btnEdit") && (!Ext.isEmpty(record.data.accountNmbr))){
    		if(("WASH" !== record.data.accountNmbr) && recordRequestStatus==1)
    		return false;
    	}
    	
    	return true;
    },
	
	showEditCFAccountPopup : function(docmode,record) {
		var me = this;
		var id = null;
		var editCounterPartyAccPopup=null;
		
		 if('EDIT'===docmode)
			{
			id = record.data.identifier;
			editCounterPartyAccPopup = Ext.create('CPON.view.EditCounterPartyAccPopup', {
											itemId : 'editCounterPartyAccPopup',
											mode : docmode,
											identifier : id,
											accName: record.data.accountName,
											accNumber:record.data.accountNmbr,
											bankName:record.data.bankCode,
											scmProduct :productDescription,
											accDesc:record.data.entityAccountDesc
										});
				
		  me.getDefaultCcyCombo().setValue(record.data.ccyCode);
		  me.getDefaultBranchTypeCombo().setValue(record.data.branchCode);
		  me.getDefaultAccountCombo().setValue(record.data.accountNmbr);
			}
		else if('VIEW'===docmode)
		{
			editCounterPartyAccPopup = Ext.create('CPON.view.EditCounterPartyAccPopup', {
				itemId : 'editCounterPartyAccPopup',
				mode : docmode,
				identifier : id,
				accName: record.data.accountName,				
				bankName:record.data.bankCode,
				scmProduct :productDescription,
				accDesc:record.data.entityAccountDesc
			});
			
		  // me.getAccNmbrField().setDisabled(true);
		   me.getDefaultCcyCombo().setValue(record.data.ccyCode);
		   me.getDefaultCcyCombo().setDisabled(true);
		   me.getAccDescField().setDisabled(true);
		   me.getDefaultBranchTypeCombo().setValue(record.data.branchCode);
		   me.getDefaultBranchTypeCombo().setDisabled(true);
		   me.getDefaultAccountCombo().setValue(record.data.accountNmbr);
		   me.getDefaultAccountCombo().setDisabled(true);
		}
		
		(editCounterPartyAccPopup).show();
	},
	submitUpdateCFAccount : function(identifier) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getCounterPartyAccMstGrid();
			
		arrayJson.push({
						serialNo : 0,
						identifier : identifier,
						userMessage : null,
						acctNmbr: me.getDefaultAccountCombo().getValue(),
						ccyCode : me.getDefaultCcyCombo().getValue(),
						accDescription : me.getAccDescField().getValue(),
						branchCode : me.getDefaultBranchTypeCombo().getValue()
					});
		
		Ext.Ajax.request({
					url : 'cpon/counterPartyMst/updateCFAccount.json?id='+ encodeURIComponent(parentkey),
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getEditCounterPartyAccPopup().close();
						var errorMessage = '';
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage + error.errorMessage +"<br/>";
								        });
								}
							}
							if(!Ext.isEmpty(errorMessage))
					        {
					        	Ext.MessageBox.show({
									title : "Error",
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
						}
						if(!Ext.isEmpty(grid)){
						grid.refreshData();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

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
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 70,
			locked : true,
			items : [
			 		{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					},
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit')
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
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					},
					{
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}
					]
		};
		return objActionCol;
	},
	enableDisableGroupActions : function() {
		var me = this;
		var grid = me.getGrid();
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			enableActionEnabled = false;
			disableActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.activeFlag == "N") {
							enableActionEnabled = true;
						} else if (item.data.activeFlag == "Y") { 
							if(recordRequestStatus!=1)
								disableActionEnabled = true;
							else if(!Ext.isEmpty(item.data.accountNmbr) && (item.data.accountNmbr=="WASH") && recordRequestStatus==1)
								disableActionEnabled = true;
						}
					});
		}

		var enableBtn = me.getEnableBtn();
		var disableBtn = me.getDisableBtn();

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
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName : btn.itemId;
		var strUrl = Ext.String.format('cpon/counterPartyAccMst/{0}',	strAction);
			this.preHandleGroupActions(strUrl, '',record);
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
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										parentkey = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage + error.errorMessage +"<br/>";
									        });
									}
								}
								if(!Ext.isEmpty(errorMessage))
						        {
						        	Ext.MessageBox.show({
										title : "Error",
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        }
							}
							me.enableDisableGroupActions();
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
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
  if (colId === 'col_activeFlag') {
   if (!Ext.isEmpty(record.get('activeFlag')) && record.get('activeFlag') == 'Y')  {
    strRetValue = getLabel('active','Active');
   }
   else
    strRetValue = getLabel('inactive','Inactive');
  }
  else
   strRetValue = value;

  return strRetValue;
	},

	getCounterPartyGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"accountName" : 150,
			"accountNmbr" : 150,
			"bankDesc" : 150,
			"branchDesc" : 150,
			"accountTypeDesc" : 150,
			"requestStateDesc" : 150
		};

		arrColsPref = [
				{
					"colId" : "accountName",
					"colDesc" : "Account Name"
				},
				{
					"colId" : "accountNmbr",
					"colDesc" : "Account"
				},
				{
					"colId" : "bankDesc",
					"colDesc" : "Bank"
				},
				{
					"colId" : "branchDesc",
					"colDesc" : "Branch"
				},
				{
					"colId" : "activeFlag",
					"colDesc" : "Status"
				}];

		storeModel = {
			fields : ['accountName','accountNmbr','accountType','accountSubType','bankDesc','accountTypeDesc','branchDesc','accDescription','bankCode','bankDesc','ccyCode','branchCode','branchDesc','entityAccountDesc','activeFlag',
					'identifier','history','__metadata','requestStateDesc'],
			proxyUrl : 'cpon/counterPartyAccMst.json',
			rootNode : 'd.details',
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
		//var searchValue = me.getSearchTextInput().value;
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
	handleSCMProductEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addScmProductMaster.form';
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
							var accountName = '';
							var bankName = '';
							var branchName = '';
							
							var accNameComboRef=me.getAccountNameCombo();
							if (!Ext.isEmpty(accNameComboRef) && !Ext.isEmpty(accNameComboRef.getValue())) {
								accountName = accNameComboRef.getValue();
							} else {
								accountName = getLabel('none', 'None');
							}
							
							var bankComboRef=me.getBankCombo();
							if (!Ext.isEmpty(bankComboRef) && !Ext.isEmpty(bankComboRef.getValue())) {
								bankName = bankComboRef.getValue();
							} else {
								bankName = getLabel('none', 'None');
							}
							
							var branchComboRef=me.getBranchCombo();
							if (!Ext.isEmpty(branchComboRef) && !Ext.isEmpty(branchComboRef.getValue())) {
								branchName = branchComboRef.getValue();
							} else {
								branchName = getLabel('none', 'None');
							}
							
							tip.update(getLabel('accountName','Account Name')
									+ ' : '
									+ accountName
									+ '<br/>'
									+ getLabel('bank','Bank'),
									+ ' : '
									+ bankName
									+ '<br/>'
									+ getLabel('branch','Branch')
									+ ' : '
									+ branchName);
							
						}
					}
				});
	}

});