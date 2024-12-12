Ext.define('CPON.controller.FSCFeatureAccMstController', {
	extend : 'Ext.app.Controller',
	views : ['CPON.view.FSCFeatureAccMstView', 'CPON.view.FSCFeatureAccMstFilterView','CPON.view.FSCFeatureAccMstGridView','CPON.view.EditScmAccountPopup'
	        ],
	refs : [{
				ref : 'fscFeatureAccMstView',
				selector : 'fscFeatureAccMstView'
			}, {
				ref : 'createNewToolBar',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'fscFeatureAccMstView fscFeatureAccMstFilterView panel[itemId="specificFilter"]'
			},{
				ref : 'fscFeatureAccMstGridView',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView'
			}, {
				ref : 'clientAccountDtlView',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView panel[itemId="clientAccountDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView panel[itemId="clientAccountDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'fscFeatureAccGrid',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'fscFeatureAccMstGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'fscFeatureAccMstGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'fscFeatureAccMstGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'fscFeatureAccMstView fscFeatureAccMstFilterView combobox[itemId="sellerFltId"]'
			},{
				ref : 'groupActionBar',
				selector : 'fscFeatureAccMstView fscFeatureAccMstGridView scmProductActionBarView'
			},{
				ref : 'clientListLink',
				selector : 'fscFeatureAccMstView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},{
				ref : 'editScmAccountPopup',
				selector : 'editScmAccountPopup'
			},{
				ref : 'defaultAccountTypeCombo',
				selector : 'editScmAccountPopup combo[itemId="defaultAccountTypeCombo"]'
			},{
				ref : 'accNmbrField',
				selector : 'editScmAccountPopup textfield[itemId="accNmbrField"]'
			},{
				ref : 'defaultCcyCombo',
				selector : 'editScmAccountPopup combo[itemId="defaultCcyCombo"]'
			},{
				ref : 'accDescField',
				selector : 'editScmAccountPopup textfield[itemId="accDescField"]'
			},{
				ref : 'defaultBranchTypeCombo',
				selector : 'editScmAccountPopup combo[itemId="defaultBranchTypeCombo"]'
			},{
				ref : 'enableBtn',
				selector : 'fscFeatureAccMstGridView toolbar[itemId="accountActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'fscFeatureAccMstGridView toolbar[itemId="accountActionBar"] button[itemId="btnDisable"]'
			},
			{
				ref : 'currencyCombo',
				selector : 'fscFeatureAccMstView fscFeatureAccMstFilterView combo[itemId="currencyCombo"]'
			},
			{
				ref : 'groupActionContainer',
				selector : 'fscFeatureAccMstGridView container[itemId="groupActionContainer"]'
			}
			],
			
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
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
			'fscFeatureAccMstView fscFeatureAccMstGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateSCMProduct"]' : {
				click : function() {
					me.handleSCMProductEntryAction(true);
				}
			},
			'fscFeatureAccMstView fscFeatureAccMstFilterView' : {
				render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'fscFeatureAccMstView fscFeatureAccMstFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'fscFeatureAccMstView fscFeatureAccMstGridView panel[itemId="clientAccountDtlView"]' : {
				render : function() {
					//me.handleGridHeader();
					
				}
			},
			'fscFeatureAccMstView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.handleSpecificFilter();
					//me.handleGridHeader();
				}
			},

			'fscFeatureAccMstGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.handleGroupActionBarLoading();
				}
			},
			'fscFeatureAccMstGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'fscFeatureAccMstGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'fscFeatureAccMstGridView smartgrid' : {
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
			'fscFeatureAccMstGridView toolbar[itemId=accountActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'editScmAccountPopup button[itemId="btnSubmitScmAccount"]' : {
				submitUpdateScmAccount : function(identifier) {
					me.submitUpdateScmAccount(identifier);
				}
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
	handleSpecificFilter : function() {
		var me = this;
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['value'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/scmProductMasterSeek/sellerList.json',
						reader : {
							type : 'json',
							root : 'filterList'
						}								
					}
				});
		
		var scmProductField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 5',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'scmProductDescription',
					itemId : 'scmProduct',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'scmproductseek',
				    cfgRootNode : 'd.filter',
				    cfgDataNode1 : 'name',
				    cfgKeyNode : 'name'
				});
		
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
									xtype : 'label',
									text : getLabel('seller',
											'Seller'),
									cls : 'f13 ux_font-size14',
									padding : '4 0 0 6'
								},{
									xtype : 'combo',
									padding : '1 5 1 5',
									width : 155,
									displayField : 'value',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerId',
									itemId : 'sellerFltId',
									valueField : 'value',
									name : 'sellerCombo',
									editable : false,
									value : strSellerId,
									store : objStore
								}]
					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.5,
						items : [{
									xtype : 'label',
									text : getLabel('scmProduct', 'SCF Package'),
									cls : 'f13 ux_font-size14',
									padding : '4 0 0 6'
								}, scmProductField]
						});
						filterPanel.columnWidth = 0.45;
		
		
		
	},
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							text : getLabel('createSCMProduct', 'Create New SCF Package'),
							cls : 'cursor_pointer',
							parent : this,
							padding : '4 0 2 0',
							itemId : 'btnCreateSCMProduct'
						}
		);
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl= strUrl + '&id='+encodeURIComponent(parentkey);
		grid.loadGridData(strUrl,me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		fscAccountGridLoaded=true;
		enableDisableGridButtons(false);
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
		var scmProduct = null, ccy = null, jsonArray = [];
		var sellerVal = null;
		
		var approvalWorkflowFilterView = me.getSpecificFilterPanel();
		var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
				&& "ALL" != sellerFltId.getValue()) {
			sellerVal = sellerFltId.getValue();
		}
		
		var scmProductRef=approvalWorkflowFilterView.down('AutoCompleter[itemId=scmProduct]');
		if(!Ext.isEmpty(scmProductRef)){
			if (!Ext.isEmpty(scmProductRef.getValue())){
			scmProduct = scmProductRef.getValue();
			}
		}
		
		var currencyComboRef=me.getCurrencyCombo();
		if(!Ext.isEmpty(currencyComboRef)){
		if (!Ext.isEmpty(currencyComboRef.getValue())){
			ccy = currencyComboRef.getValue();
		}
		}
		
		if (!Ext.isEmpty(sellerVal)) {
			jsonArray.push({
						paramName : sellerFltId.filterParamName,
						paramValue1 : sellerVal.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
					
		
		if (!Ext.isEmpty(scmProduct)){
			jsonArray.push({
						paramName : 'productDescription',
						paramValue1 : scmProduct,
						operatorValue : 'lk',
						dataType : 'S'
					});
		}
		
		if (!Ext.isEmpty(ccy)){
			if(ccy!=="All"){
		jsonArray.push({
					paramName : 'ccy',
					paramValue1 : ccy,
					operatorValue : 'eq',
					dataType : 'S'
				});
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
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,store.sorters);
			strUrl= strUrl + '&id='+encodeURIComponent(parentkey);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	handleSmartGridConfig : function() {
		var me = this;
		var fscFeatureAccGridRef = me.getFscFeatureAccGrid();
		var objConfigMap = me.getScmProductGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(fscFeatureAccGridRef))
			fscFeatureAccGridRef.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		if(docmode==="VIEW")
		var checkBoxColFlag=false;
		else
		var checkBoxColFlag=true;
		pgSize = 10;
		fscFeatureAccGridRef = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : checkBoxColFlag,
					padding : '0 10 10 10',
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

		var clntSetupDtlView = me.getClientAccountDtlView();
		clntSetupDtlView.add(fscFeatureAccGridRef);
		clntSetupDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'enable' || actionName === 'disable'|| actionName === 'discard')
			me.handleGroupActions(btn, record);
		 if (actionName === 'btnView') {
			 me.showEditScmAccountPopup('VIEW',rowIndex);
		 } else if (actionName === 'btnEdit') {
		 	me.showEditScmAccountPopup('EDIT',rowIndex);
		 }
    },
	
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
    	if(itmId=="btnEdit" && 'VIEW' === docmode){
    		return false; 
    	}
    	   	
    	return true;
    },
	
	showEditScmAccountPopup : function(docmode,rowIndex) {
		var me = this;
		var grid = me.getFscFeatureAccGrid();
		var id = null;
		
		 if('EDIT'===docmode)
			{
			var record = grid.getStore().getAt(rowIndex);
			id = record.data.identifier;
			editScmAccountPopup = Ext.create('CPON.view.EditScmAccountPopup', {
				itemId : 'editScmAccountPopup',mode : docmode, identifier : id,accName: record.data.accName, scmProduct : record.data.productDescription
			});
				
				 this.getDefaultAccountTypeCombo().setValue(record.data.accType);
  // this.getDefaultAccountTypeCombo().setDisabled(true);
   this.getAccNmbrField().setValue(record.data.acctNmbr);
  //  this.getAccNmbrField().setDisabled(true);
    this.getDefaultCcyCombo().setValue(record.data.ccyCode);
   //this.getDefaultCcyCombo().setDisabled(true);
    this.getAccDescField().setValue(record.data.accDescription);
    //this.getAccDescField().setDisabled(true);
    this.getDefaultBranchTypeCombo().setValue(record.data.branchCode);
    //this.getDefaultBranchTypeCombo().setDisabled(true);
			}
		else if('VIEW'===docmode)
		{
			var record = grid.getStore().getAt(rowIndex);
			id = record.data.identifier;
			editScmAccountPopup = Ext.create('CPON.view.EditScmAccountPopup', {
				itemId : 'editScmAccountPopup',mode : docmode, identifier : id,accName: record.data.accName, scmProduct : record.data.productDescription
			});
			
			 this.getDefaultAccountTypeCombo().setValue(record.data.accType);
   this.getDefaultAccountTypeCombo().setDisabled(true);
   this.getAccNmbrField().setValue(record.data.acctNmbr);
   this.getAccNmbrField().setDisabled(true);
   this.getDefaultCcyCombo().setValue(record.data.ccyCode);
   this.getDefaultCcyCombo().setDisabled(true);
   this.getAccDescField().setValue(record.data.accDescription);
   this.getAccDescField().setDisabled(true);
   this.getDefaultBranchTypeCombo().setValue(record.data.branchCode);
   this.getDefaultBranchTypeCombo().setDisabled(true);
		}
		
		(editScmAccountPopup).show();
	},
	
	submitUpdateScmAccount : function(identifier) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getFscFeatureAccGrid();
			
		arrayJson.push({
						serialNo : 0,
						identifier : identifier,
						userMessage : null,
						accType : this.getDefaultAccountTypeCombo().getValue(),
						acctNmbr: this.getAccNmbrField().getValue(),
						ccyCode : this.getDefaultCcyCombo().getValue(),
						accDescription : this.getAccDescField().getValue(),
						branchCode : this.getDefaultBranchTypeCombo().getValue()
					});
		
		Ext.Ajax.request({
					url : 'cpon/scmAccountMst/updateScmAccount.json?id='+ encodeURIComponent(parentkey),
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						var errorMessage = '';
						if (response.responseText!='[]') {
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
									title : getLabel("instrumentErrorPopUpTitle","Error"),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
						}
						me.getEditScmAccountPopup().close();
						var payGrid = me.getFscFeatureAccGrid();
						payGrid.refreshData();
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
		var strUrl = Ext.String.format('cpon/scmAccountMst/{0}',	strAction);
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
							if (response.responseText!='[]') {
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
										title : getLabel("instrumentErrorPopUpTitle","Error"),
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

	getScmProductGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"productCode" : 150,
			"accName" : 150,
			"acctNmbr" : 150,
			"ccyCode" : 80,
			"requestStateDesc" : 150
		};

		arrColsPref = [{
					"colId" : "productDescription",
					"colDesc" : getLabel('scmProduct','SCF Package')
				},
				{
					"colId" : "accName",
					"colDesc" : getLabel('lblAcctName','Account Name')
				},
				{
					"colId" : "acctNmbr",
					"colDesc" : getLabel('accountNumber','Account Number')
				},
				{
					"colId" : "ccyCode",
					"colDesc" : getLabel('ccy','CCY')
				},{
					"colId" : "activeFlag",
					"colDesc" : getLabel('status','Status')
				}];

		storeModel = {
			fields : ['accName','productCode','productDescription','acctNmbr','accDescription','ccyCode','bankCode','branchCode','accType',	 'activeFlag',
					'identifier','history','__metadata','requestStateDesc'],
			proxyUrl : 'cpon/scmAccountMst.json',
			rootNode : 'd.accounts',
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
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
						var sellerCode = '';
						var scmProduct = '';
						var currency = '';
						var approvalWorkflowFilterView = me.getSpecificFilterPanel();
						var sellerFltId = approvalWorkflowFilterView.down('combobox[itemId=sellerFltId]');
						if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())
								&& "ALL" != sellerFltId.getValue()) {
							sellerCode = sellerFltId.getValue();
						}else {
							sellerCode = getLabel('none', 'None');
							}
						
						var scmProductRef=approvalWorkflowFilterView.down('AutoCompleter[itemId=scmProduct]');
						if(!Ext.isEmpty(scmProductRef)){
							if (!Ext.isEmpty(scmProductRef.getValue())){
							scmProduct = scmProductRef.getValue();
							}
							else {
								scmProduct = getLabel('none', 'None');
							}
						}
						
						var currencyComboRef=me.getCurrencyCombo();
						if(!Ext.isEmpty(currencyComboRef)){
						if (!Ext.isEmpty(currencyComboRef.getValue())){
							currency = currencyComboRef.getValue();
						}else {
								currency = getLabel('none', 'None');
							}
						}
										
									tip.update(getLabel("seller","Seller")
									+ ' : '
									+ sellerCode
									+ '<br/>'
									+ getLabel("scmProduct","Scm Product")
									+ ' : '
									+ scmProduct + 
									'<br/>'
									+ getLabel('currency', 'Currency') +
									' : '
									+ currency);
							
						}
					}
				});
	}

});