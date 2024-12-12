Ext.define('CPON.controller.FscServiceScmProductController', {
	extend : 'Ext.app.Controller',
	views : ['CPON.view.ScmProductView', 'CPON.view.ScmProductActionBarView','CPON.view.AttachSCMProductPopup','CPON.view.EditAccount'],
	refs : [{
				ref : 'clientAccountDtlView',
				selector : 'scmProductView panel[itemId="clientAccountDtlView"]'
			},{
				ref : 'grid',
				selector : 'scmProductView smartgrid'
			}, {
				ref : 'discardBtn',
				selector : 'scmProductView toolbar[itemId="scmPrdActionBar"] button[itemId="btnDiscard"]'
			}, {
				ref : 'enableBtn',
				selector : 'scmProductView toolbar[itemId="scmPrdActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'scmProductView toolbar[itemId="scmPrdActionBar"] button[itemId="btnDisable"]'
			},
			{
				ref : 'createNewRuleBtn',
				selector : 'scmProductView panel[itemId="clientAccountDtlView"] button[itemId="btnAccountGrid"]'
			},
			{
				ref : 'attachPackagePopup',
				selector : 'attachPackagePopup'	
			},
			{
				ref : 'createNewToolBar',
				selector : 'scmProductView toolbar[itemId="btnCreateNewToolBar"]'
			},
			{
				ref : 'actionBarContainer',
				selector : 'scmProductView container[itemId="actionBarContainer"]'
			},
			{
				ref : 'searchTextInput',
				selector : 'scmProductView textfield[itemId="searchTextField"]'
			},
			{
				ref : 'matchCriteria',
				selector : 'scmProductView radiogroup[itemId="matchCriteria"]'
			},
			{	
				ref : 'editAccountPopup',
				selector : 'editAccountPopup'
			},
			{	
				ref : 'scmProductTextField',
				selector : 'editAccountPopup panel textfield[itemId="scmProduct"]'
			},
			{
				ref : 'saveAccountBtn',
				selector : 'editAccountPopup button[itemId="saveButton"]'
			}],
	config : {},
	init : function() {
		var me = this;
		me.control({
			'scmProductView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
					me.handleCreateNewRuleLabel();
					
					if(viewmode === 'VIEW'){
						me.getCreateNewToolBar().hide();		
						me.getActionBarContainer().hide();
					}
				}
			},
			'scmProductView smartgrid' : {
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
			'scmProductView toolbar[itemId=scmPrdActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			
			'scmProductView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnAccountGrid"]' : {
				click : function() {
					me.showAddSCMProduct();
				}
			},
			
			'attachPackagePopup button[itemId="btnSubmitPackage"]' : {
				submitProducts : function(records, selectedArray) {
					me.submitProducts(records, selectedArray);
				}
			},
			
			'scmProductView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'scmProductView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'editAccountPopup button[itemId="saveButton"]' : {
				click : function(){
					if(viewmode != "VIEW")
						me.updateAccounts();
				}
			}
			
		});
	},
	
	updateAccounts : function(){
		var me = this;
		var accountsPopup = me.getEditAccountPopup();
		var accountsArray = accountsPopup.query('combo');
		var arrayJson = new Array();
		var productCode = me.getScmProductTextField().getName();
		for(var i=0; i<accountsArray.length ; i++){
			arrayJson.push({
				accountName : accountsArray[i].getName(),
				accountNmbr : accountsArray[i].getValue(),
				scmProductCode : productCode
			});	
		}
		var jsonData = {
			userMessage : arrayJson,
			identifier : parentkey	
		}
		Ext.Ajax.request({
					url : 'cpon/clientServiceSetup/updateFSCAccounts.json',
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						var errorMessage = '';
						if (response.responseText != '[]') {
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
						accountsPopup.close();
						var payGrid = me.getGrid();
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
	
	showAddSCMProduct : function() {
	selectedArray = new Array();
		attachProduct = Ext.create('CPON.view.AttachSCMProductPopup', {
					itemId : 'attachPkgPopup'
				});
		(attachProduct).show();
	},
	
	submitProducts : function(records, selectedArray) {
		var me = this;
		var arrayJson = new Array();
		var validFlag = false;
		var grid = me.getAttachPackagePopup().down('grid');
		for (var index = 0; index < selectedArray.length; index++) {
			var userMessage = {	parentkey : parentkey,
								defaultPaymentPackage :  selectedArray[index].data.defaultPaymentPackage,
								defaultClientLimitCode : selectedArray[index].data.defaultClientLimitCode,
								financingServicesFlag : selectedArray[index].data.financingServices
							}
			if (Ext.isEmpty(userMessage.financingServicesFlag) || userMessage.financingServicesFlag == "N")
			{
				if(userMessage.defaultPaymentPackage)
				validFlag = true;
			else{	
				validFlag = false;
				break;
				}
			}
			else
			{
				if(userMessage.defaultPaymentPackage && userMessage.defaultClientLimitCode )
				validFlag = true;
			else{	
				validFlag = false;
				break;
			}
			
			}
			userMessage = JSON.stringify(userMessage);					
			arrayJson.push({
						serialNo : grid.getStore().indexOf(selectedArray[index])+1,
						identifier : selectedArray[index].data.identifier,
						userMessage : userMessage
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});							
		if(validFlag){
		Ext.Ajax.request({
					url : 'cpon/clientServiceSetup/addSCMProduct.json',
					method : 'POST',
					async : false,
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						var errorMessage = '';
						if (response.responseText != '[]') {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								var data = Ext.decode(response.responseText);
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
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
						me.getAttachPackagePopup().close();
						var payGrid = me.getGrid();
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
		}
		else{
			Ext.Msg.alert("Error","Selected records must have all values filled or select at least one record");
		}		

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
						if(disableDiscardActionFlag == 'true')
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
		var strUrl = Ext.String.format('cpon/fscScmProduct/{0}',
				strAction);
			this.preHandleGroupActions(strUrl, '',record);
	},	
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
		if('MODIFIEDVIEW' === viewmode)
		strUrl = strUrl+'&$select=' + "OLD";
		grid.loadGridData(strUrl, me.enableEntryButtons, null,
								false);
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
		if(brandingPkgType === 'N'){
		var objWidthMap = {
			"productDescription" : 130,
			"vendorDealerFlag" : 130,
			"financeProfileDesc" : 100,
			//"overDueProfileDesc" : 100,
			"packageDesc" : 130,
			"accountsFlag" : 80,
			"activeFlag" : 80
			
		};

		var arrColsPref = [{
					"colId" : "productDescription",
					"colDesc" : getLabel("fscScmProduct","SCF Package")
				}, {
					"colId" : "vendorDealerFlag",
					"colDesc" : getLabel("fscVenDel","Vendor/Dealer")
				},{
					"colId" : "financeProfileDesc",
					"colDesc" : getLabel("fscFinPrf","Finance Profile")
				}/*,{
					"colId" : "overDueProfileDesc",
					"colDesc" : "Overdue Profile"
				}*/,{
					"colId" : "packageDesc",
					"colDesc" : getLabel("fscPayMethod","Payment Method")
				},{
					"colId" : "accountsFlag",
					"colDesc" : getLabel("fscAccounts","Accounts")
				},{
					"colId" : "activeFlag",
					"colDesc" : getLabel("status","Status")
				}];
		}
		else if(brandingPkgType === 'Y'){
			var objWidthMap = {
					"productDescription" : 130,
					"vendorDealerFlag" : 130,
					"financeProfileDesc" : 100,
					//"overDueProfileDesc" : 100,
					"packageDesc" : 100,
				//	"accountsFlag" : 80,
					"activeFlag" : 80
					
				};

				var arrColsPref = [{
							"colId" : "productDescription",
							"colDesc" : getLabel("fscScmProduct","SCF Package")
						}, {
							"colId" : "vendorDealerFlag",
							"colDesc" : getLabel("fscVenDel","Vendor/Dealer")
						},{
							"colId" : "financeProfileDesc",
							"colDesc" : getLabel("fscFinPrf","Finance Profile")
						},/*{
							"colId" : "overDueProfileDesc",
							"colDesc" : "Overdue Profile"
						},*/{
							"colId" : "packageDesc",
							"colDesc" : getLabel("fscPayPkg","Payment Package Profile")
						}//,
						//{
					//		"colId" : "accountsFlag",
					//		"colDesc" : "Accounts"
					//	}
		,{
							"colId" : "activeFlag",
							"colDesc" :  getLabel("status","Status")
						}];
		}

		var storeModel = {
			fields : ['productCode', 'productDescription','vendorDealerFlag', 'productWorkflow','financeProfileDesc','overDueProfileDesc','packageDesc','accountsFlag',
					'activeFlag','__metadata','requestStateDesc','identifier','updated'],
			proxyUrl : 'cpon/clientServiceSetup/fscScmProductList.json',
			rootNode : 'd.accounts',
			totalRowsNode : 'd.__count'
		};
		
		arrCols = me.getColumns(arrColsPref, objWidthMap);
		var pgSize = null;
		pgSize = 5;
		accountGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 5,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			}

		});
		
		accountGrid.on('cellclick', function(view, td, cellIndex, record,
			tr, rowIndex, e, eOpts) {	
				if (td.className.match('x-grid-cell-col_accountsFlag ')) {
					var productName = record.get('productDescription');
					var productCode = record.get('productCode');
					var accountDetailsPopup = Ext.create(
							'CPON.view.EditAccount', {
								itemId : 'packProductPopup',
								productName : productName,
								productCode : productCode		
							});
				if(viewmode === 'VIEW'){
					var accountsCombos = accountDetailsPopup.query('combo');
					for(var i=0; i<accountsCombos.length ; i++){
						accountsCombos[i].setDisabled(true);
					}
					me.getSaveAccountBtn().setText(getLabel('close','Close'));
				}
				console.log(viewmode);
				if(viewmode === "MODIFIEDVIEW")
					var accountUrl =  'cpon/clientServiceSetup/cfAccountsList.json?$select='+'OLD';
				else
					var accountUrl =  'cpon/clientServiceSetup/cfAccountsList.json?$select='+'NEW';
				Ext.Ajax.request({
						url : accountUrl,
						method : 'POST',
						async : true,
						params: {
							'productCode': productCode,
							'id' : parentkey			
						},
						success : function(response) {
							var accountsCombos = me.getEditAccountPopup().query('combo');
							var accountInfo = Ext.decode(response.responseText);
							var preshipLoanAccFlag=accountInfo.preshipLoanAccFlag;
							var interestDebitAccFlag=accountInfo.interestDebitAccFlag;
							var invCollAccFlag=accountInfo.invCollAccFlag;
							var loanDisbAccFlag=accountInfo.loanDisbAccFlag;
							var invCollSuspAccFlag=accountInfo.invCollSuspAccFlag;
							var postshipLoanAccFlag=accountInfo.postshipLoanAccFlag;
							var actionFlag=accountInfo.updatedValues;
							var isLoanDisbAccAvailabe=accountInfo.isLoanDisbAccAvailabe;
					    	var isPreshipLoanAccAvailabe=accountInfo.isPreshipLoanAccAvailabe;
					    	var isInterestDebitAccAvailabe=accountInfo.isInterestDebitAccAvailabe;
					    	var isPostShipAccAvailabe=accountInfo.isPostShipAccAvailabe;
					    	var isServiceTaxAccAvailabe=accountInfo.isServiceTaxAccAvailabe;
					    	var isInvoiceCollAccAvailabe=accountInfo.isInvoiceCollAccAvailabe;
					    	var isInvoiceCollSuspAccAvailabe=accountInfo.isInvoiceCollSuspAccAvailabe;
					    	var isChargeAccAvailabe=accountInfo.isChargeAccAvailabe;
					    	var isEduCessAccAvailable=accountInfo.isEduCessAccAvailable;
							
							accountInfo = accountInfo.d;							
							 for(var i=0; i<accountInfo.length ; i++){
								for(var j=0; j<accountsCombos.length ; j++){
								if(accountInfo[i].accountName === accountsCombos[j].name){
										console.log(accountInfo[i]);
										accountsCombos[j].setValue(accountInfo[i].accountNmbr);
									}
								}
							}
							 for(var j=0; j<accountsCombos.length ; j++){
									if(!Ext.isEmpty(isLoanDisbAccAvailabe) && accountsCombos[j].name==="CL_LOAN_DISB"){
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isPreshipLoanAccAvailabe) &&accountsCombos[j].name==="CL_PRE_LOAN") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isInvoiceCollSuspAccAvailabe) &&accountsCombos[j].name==="CL_INV_COSUS") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isInterestDebitAccAvailabe) &&accountsCombos[j].name==="CL_INT_DEBIT") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isPostShipAccAvailabe) &&accountsCombos[j].name==="CL_POS_LOAN") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isServiceTaxAccAvailabe) &&accountsCombos[j].name==="CL_CF_STAX") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isInvoiceCollAccAvailabe) &&accountsCombos[j].name==="CL_INV_COLL") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isChargeAccAvailabe) &&accountsCombos[j].name==="CL_COMM") {
										accountsCombos[j].hidden=true;
									}else if(!Ext.isEmpty(isEduCessAccAvailable) &&accountsCombos[j].name==="CL_CF_EDUCESS") {
										accountsCombos[j].hidden=true;
									}
								
							 }
							 
						   if(viewmode === "MODIFIEDVIEW"){
								for (var key in actionFlag) {
										for(var j=0; j<accountsCombos.length ; j++){
											  if( actionFlag[key]==1 &&accountsCombos[j].name==key){
					
												 accountsCombos[j].getEl().down('input').addCls('newFieldValue');
											  }
											  if(actionFlag[key]==2 &&accountsCombos[j].name==key){
													
													 accountsCombos[j].getEl().down('input').addCls('modifiedFieldValue');
													 }
											 if(actionFlag[key]==3 &&accountsCombos[j].name==key){
													  
													  accountsCombos[j].getEl().down('input').addCls('deletedFieldValue');
													 }
											 }
  
							}
						   
						  }
						   accountDetailsPopup.show();
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
		});	

		var clntAccountDtlView = me.getClientAccountDtlView();
		clntAccountDtlView.add(accountGrid);
		clntAccountDtlView.doLayout();
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";'activeFlag';
		if (colId === 'col_activeFlag'){
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
		}else if (colId === 'col_accountsFlag'){
			if (!record.get('isEmpty')) {
			if (value != null && value > 0)
				strRetValue = '<span class="underlined"></span>'
						+ '<span class="smallpadding_lr text_skyblue cursor_pointer">'
						+ getLabel('edit', 'Edit') + '</span>';
			else
				strRetValue = '<span class="underlined"></span>'
						+ '<span class="smallpadding_lr text_skyblue cursor_pointer">'
						+ getLabel('edit', 'Edit') + '</span>';
				}
		}		
		else
		{
			strRetValue = value;
		}
		if(record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
			strRetValue='<span class="newFieldValue">'+strRetValue+'</span>';
		else if(record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
			strRetValue='<span class="modifiedFieldValue">'+strRetValue+'</span>';
		else if(record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
			strRetValue='<span class="deletedFieldValue">'+strRetValue+'</span>';
		
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		if ((viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")) {
			var objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				align : 'right',
				locked : true,
				items : [ {
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record')
							
						}]				
			};
			return objActionCol;
		}
		else {
			var objActionCol = {
				colType : 'actioncontent',
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
        }
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
							var errorMessage = '';
							if (response.responseText != '[]') {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									var data = Ext.decode(response.responseText);
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										parentkey = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
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
			me.submitForm('viewClientFSCPackageProductLinkage.form', record, rowIndex);
		} else if (actionName === 'btnEdit'){
			me.submitForm('editClientFSCPackageProductLinkage.form', record, rowIndex);
		}
	},
	
	 isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
	    	if('VIEW' === viewmode || 'MODIFIEDVIEW' === viewmode){
	    		if(itmId=="btnEdit")
	    		return false;
	    	}
	    	return true;
	 },
	 
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
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
				parentkey))
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'MASTERMODE', mastermode));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	
	showHistory : function(isClient,clientName,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
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