Ext.define('GCP.controller.ClientPayServiceController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ClientPayServiceView', 'GCP.view.AttachPackagePopup',
			'GCP.view.AccAssignmentPopupView',
			'GCP.view.PkgAssignmentPopupView',
			'GCP.view.AttachRulePriorityPopup',
			'GCP.view.EditPaymentProductPopup',
			'GCP.view.CompanyIDPopup',
			'GCP.view.PayCompanyIDPopup'],
					refs : [
							{
								ref : 'actionBar',
								selector : 'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="actionBarContainer"] toolbar[itemId="gridActionBar"]'
							},
							{
								ref : 'gridHeader',
								selector : 'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"]'
							},
							{
								ref : 'payServiceDtlView',
								selector : 'clientPayServiceView panel[itemId="payServiceDtlView"]'
							},
							{
								ref : 'createNewToolBar',
								selector : 'clientPayServiceView toolbar[itemId="btnCreateNewToolBar"]'
							},
							{
								ref : 'paymentGrid',
								selector : 'clientPayServiceView grid[itemId="gridViewMstId"]'
							},
							{
								ref : 'attachPackagePopup',
								selector : 'attachPackagePopup'
							},
							{
								ref : 'attachRulePriorityPopup',
								selector : 'attachRulePriorityPopup'
							},
							{
								ref : 'accAssignmentPopupView',
								selector : 'accAssignmentPopupView'
							},
							{
								ref : 'pkgAssignmentPopupView',
								selector : 'pkgAssignmentPopupView'
							},
							{
								ref : 'discardBtn',
								selector : 'clientPayServiceView toolbar[itemId="gridActionBar"] button[itemId="btnDiscard"]'
							},
							{
								ref : 'enableBtn',
								selector : 'clientPayServiceView toolbar[itemId="gridActionBar"] button[itemId="btnEnable"]'
							},
							{
								ref : 'disableBtn',
								selector : 'clientPayServiceView toolbar[itemId="gridActionBar"] button[itemId="btnDisable"]'
							},
							{
								ref : 'searchTextInput',
								selector : 'clientPayServiceView textfield[itemId="searchTextField"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'clientPayServiceView radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'companyIDGrid',
								selector : 'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"] panel[itemId="companyIDTabGrid"] smartgrid'
							},
							{
								ref : 'saveCompanyIDBtn',
								selector : 'companyIdPopup button[itemId="savebtn"]'
							},
							{
								ref : 'addCompanyIDTabPanel',
								selector : 'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"]'
							},
							{
								ref : 'companyIDTextField',
								selector : 'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"] createCompanyIDTab textfield[itemId="companyIdField"]'
							},
							{
								ref : 'companyNameTextField',
								selector : 'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"] createCompanyIDTab textfield[itemId="companyNameField"]'
							},
							{
								ref : 'defAccpountCombo',
								selector : 'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"] createCompanyIDTab combo[itemId="defaultAccountCombo"]'
							},
							{
								ref : 'ProductCombo',
								selector : 'attachRulePriorityPopup combo[itemId="defaultProductCombo"]'
							},
							{
								ref : 'ruleField',
								selector : 'attachRulePriorityPopup combo[itemId="defaultRuleCombo"]'
							},
							{
								ref : 'priorityField',
								selector : 'attachRulePriorityPopup textfield[itemId="txtPriority"]'
							},
							{
								ref : 'arrangementField',
								selector : 'attachRulePriorityPopup combo[itemId="defaultArrangementCombo"]'
							},
							{
								ref : 'clientCompanyAssignmentView',
								selector : 'clientCompanyAssignmentView'
							},
							{
								ref : 'assignCompanyIDBtn',
								selector : 'clientCompanyAssignmentView button[itemId="savebtn"]'
							},
							{
								ref : 'tabPanelSaveBtn',
								selector : 'payCompanyIdPopup button[itemId="savebtn"]'
							},
							{
								ref : 'tabPanelCloseBtn',
								selector : 'payCompanyIdPopup button[itemId="closebtn"]'
							},
							{
								ref : 'compIdTextField',
								selector : 'payCompanyIdPopup createCompanyIDTab textfield[itemId="companyIdField"]'
							},
							{
								ref : 'compNameTextField',
								selector : 'payCompanyIdPopup createCompanyIDTab textfield[itemId="companyNameField"]'
							},
							{
								ref : 'defAccCombo',
								selector : 'payCompanyIdPopup createCompanyIDTab combobox[itemId="defaultAccountCombo"]'
							},
							{
								ref : 'companyIdTabPanel',
								selector : 'payCompanyIdPopup tabpanel[itemId="companyIDTabPanel"]'
							},
							{
								ref : 'createCompanyIdTab',
								selector : 'payCompanyIdPopup tabpanel[itemId="companyIDTabPanel"] createCompanyIDTab'
							},
							{
								ref : 'companyIdButton',
								selector : 'payCompanyIdPopup tabpanel[itemId="companyIDTabPanel"] button[itemId="addFieldBtn"]'
							},
							{
								ref : 'editPaymentProductPopup',
								selector : 'editPaymentProductPopup'
							},
							{	
								ref: 'editCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="defPackage"]'
							},
							{
                                ref: 'btnAttachPackage',
                                selector :'clientPayServiceView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnAttachPackage"]'
                        }],
	config : {
		selectedGrid : 'package',
		prdCountClicked : '',
		parentRecordKey : ''
	},
	init : function() {
		var me = this;
		GCP.getApplication().on({
            checkClicked : function(enableDisableFlag) {
            	me.enableDisableAttachPkgBtn(enableDisableFlag);
            }
    });
		me.control({
			'clientPayServiceView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'clientPayServiceView panel[itemId="payServiceDtlView"]' : {
				render : function() {
					me.handleGridHeader();
					me.handleActionBar();
				}
			},
			'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"] button[itemId="btnProductGrid"]' : {
				click : function() {
					me.selectedGrid = 'product'
					me.handleGridHeader();
					me.handleActionBar();
					me.handleSmartGridConfig();
				}
			},
			'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"] button[itemId="btnAccountGrid"]' : {
				click : function() {
					me.selectedGrid = 'account'
					me.handleGridHeader();
					me.handleActionBar();
					me.handleSmartGridConfig();
				}
			},
			'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"] button[itemId="btnPrioritiesGrid"]' : {
				click : function() {
					me.selectedGrid = 'priority'
					me.handleGridHeader();
					me.handleActionBar();
					me.handleSmartGridConfig();
				}
			},
			'clientPayServiceView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnAttachPackage"]' : {
				click : function() {
					me.showAttachPackagePopup();
				}
			},
			'clientPayServiceView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnAddRule"]' : {
				click : function() {
					me.showAttachPriorityPopup('ADD',0);
				}
			},
			'clientPayServiceView smartgrid' : {
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
			'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"] button[itemId="btnPackageGrid"]' : {
				click : function() {
					me.selectedGrid = 'package'
					me.handleGridHeader();
					me.handleActionBar();
					me.handleSmartGridConfig();
				}
			},
			'attachPackagePopup button[itemId="btnSubmitPackage"]' : {
				submitPackages : function(records) {
					me.submitPackages(records);
				}
			},
			'attachRulePriorityPopup button[itemId="btnSubmitRulePriority"]' : {
				submitRulePriorities : function(identifier) {
					me.submitRulePriorities(identifier);
				}
			},
			'clientPayServiceView toolbar[itemId=gridActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'accAssignmentPopupView button[itemId="btnSubmitPackage"]' : {
				assignAccounts : function(records,id) {
					me.assignAccounts(records,id);
				}
			},
			'pkgAssignmentPopupView button[itemId="btnSubmitPackage"]' : {
				assignPackages : function(records,id) {
					me.assignPackages(records,id);
				}
			},
			'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"] button[itemId="addFieldBtn"]' : {
				click : me.handleAddFieldBtn
			},
			'payCompanyIdPopup tabpanel[itemId="companyIDTabPanel"]' : {
				tabchange :function(tabPanel, newCard, oldCard, eOpts){
					me.handleCompanyTabChange(tabPanel, newCard, oldCard, eOpts);
				}
			}, 
			'payCompanyIdPopup button[itemId="savebtn"]':{
				click: me.handleSaveCompanyID
			},
			'payCompanyIdPopup' : {
				render: function(){
					if(viewmode === 'VIEW'){
						me.getCompanyIdTabPanel().items.getAt(1).setDisabled(true);
						me.getTabPanelSaveBtn().hide();
						me.getCompanyIdButton().hide();				
					}
				}
			}, 
			'companyIdPopup button[itemId="savebtn"]' : {
				assignCompany : function(records,id) {
//					if(this.getSaveCompanyIDBtn().getText() === "Submit"){
//						me.assignCompany(records,id);
//					}else
						if(this.getSaveCompanyIDBtn().getText() === "Add"){
						me.handleSaveCompanyIDBtn();
					}
				}
			},
			'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"]' : {
				tabchange : function(tabPanel, newCard, oldCard, eOpts){
					me.handleTabChange(tabPanel, newCard, oldCard, eOpts);
				}
			},
			'clientCompanyAssignmentView button[itemId="savebtn"]' : {
				assignCompany : function(records,id) {
						me.assignCompany(records,id);
					
				}
			},
			'editPaymentProductPopup button[itemId="editProductSaveBtn"]' : {
				saveEditProduct : function(productCode){
					var me = this;
				    var record = me.getEditCombo().getValue();
					
						if (record) {
							var jsonData = {
								identifier : productCode,
								userMessage : record
							};
							Ext.Ajax.request({
								url : 'cpon/clientServiceSetup/updateProduct',
								method : 'POST',
								params : {id : parentkey},
								jsonData : jsonData,
								success : function() {
									me.getEditPaymentProductPopup().close();
									var payGrid = me.getPaymentGrid();
									payGrid.refreshData();
								},
								failure : function() {
									Ext.Msg.alert('Error',
											'Error while fetching data.');
								}
							});
						}
				}
			}

		});
	},
	
	handleSaveCompanyID: function(btn, e, eOpts ){
		var me = this;
		var id = me.getCompIdTextField().getValue();
		var name = me.getCompNameTextField().getValue();
		var accountId = me.getDefAccCombo().getValue();
		if(accountId && me.getDefAccCombo().valueModels[0]){
			var accountNmbr = me.getDefAccCombo().valueModels[0].data.acctNmbr;
			var currency = me.getDefAccCombo().valueModels[0].data.ccyCode;
			var bankCode = me.getDefAccCombo().valueModels[0].data.bankCode;
		}
		me.getCompIdTextField().setValue(null);
		me.getCompNameTextField().setValue(null);
		me.getDefAccCombo().setValue(null);
		if(id && name){
			var records =  {
								companyId : id,
								companyName : name,
								accountNmbr : accountNmbr,
								accountId : accountId,
								currencyCode : currency,
								bankCode : bankCode
							};				
			var jsonData = { identifier : parentkey,
							 userMessage : records	
							};
							
			if(btn.getText()==='Save'){				
				Ext.Ajax.request({
						url: 'cpon/clientPayment/addClientCompany',
						method: 'POST',
						
						jsonData: jsonData,
						success: function() {
							me.getCompanyIdTabPanel().setActiveTab(0);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
						},
						failure: function() {
						}
					});	
			}else
			{
				Ext.Ajax.request({
						url: 'cpon/clientPayment/updateClientCompany',
						method: 'POST',
						
						jsonData: jsonData,
						success: function() {
							me.getCompanyIdTabPanel().setActiveTab(0);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
						},
						failure: function() {
						}
					});	
			}
					
		}else
		{
			Ext.Msg.alert('Error','Account ID and Company Name can not be Empty.');
		}
	},
	handleCompanyTabChange: function(tabPanel, newCard, oldCard, eOpts){
		var me = this;
		me.getCompIdTextField().setValue(null);
		me.getCompNameTextField().setValue(null);
		me.getDefAccCombo().setValue(null);
		me.getDefAccCombo().setReadOnly(false);
		me.getCompNameTextField().setReadOnly(false);
		me.getCompIdTextField().setReadOnly(false);
		if(newCard.itemId === 'gridTab'){
			me.getTabPanelSaveBtn().setDisabled(true);
			me.getTabPanelSaveBtn().setText('Save');		
		}else{
			me.getTabPanelSaveBtn().setDisabled(false);
		}
	},
	handleTabChange : function(tabPanel, newCard, oldCard, eOpts){
		if(newCard.itemId === "firsttab"){
			this.getSaveCompanyIDBtn().setText("Submit");
		}else if(newCard.itemId === "secondtab"){
			this.getSaveCompanyIDBtn().setText("Add");
		}
	},
	handleAddFieldBtn : function(){
		this.getAddCompanyIDTabPanel().setActiveTab(1);
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		var strUrl;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		if (me.selectedGrid == 'package')
			strUrl = Ext.String.format('cpon/clientPackage/{0}.srvc?',
				strAction);
		else if (me.selectedGrid == 'product')
			strUrl = Ext.String.format('cpon/clientProduct/{0}',
				strAction);
		else if (me.selectedGrid == 'priority')
			strUrl = Ext.String.format('cpon/clientRulepriority/{0}',
				strAction);
		this.preHandleGroupActions(strUrl, '',record);
		
	},
	
	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getPaymentGrid();
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
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
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
	
	enableValidActionsForGrid : function() {
		var me = this;
		var grid = me.getPaymentGrid();
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

	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(gridHeaderPanel)) {
			gridHeaderPanel.removeAll();
		}
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}
		if ('package' == me.selectedGrid ) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : getLabel('packages', 'Packages'),
						cls : 'font_bold',
						padding : '5 0 0 5'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('products', 'Products') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnProductGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('productpriorities',
										'Product Priorities') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPrioritiesGrid'
					});
					if(brandingPkgType === 'N'){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePoniter ux_font-size14-normal">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}
			if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
			createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('attachpackage', 'Attach Package'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAttachPackage',
						disabled : true
					}, '-', {
						xtype : 'button',
						border : 0,
						text : getLabel('addproduct', 'Add Product'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddProduct',
						handler : function(){
							me.addProduct();
						}
					});}
		} else if ('product' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : getLabel('products', 'Products'),
						cls : 'font_bold',
						padding : '5 0 0 5'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('packages', 'Packages') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('productpriorities',
										'Product Priorities') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPrioritiesGrid'
					});
					
					if(brandingPkgType === 'N'){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePoniter ux_font-size14-normal">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}
			if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
			createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('addproduct', 'Add Product'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddProduct',
						handler : function(){
							me.addProduct();
						}
					});}
		}else if ('account' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('products', 'Products') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnProductGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('packages', 'Packages') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('productpriorities',
										'Product Priorities') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPrioritiesGrid'
					});
						if(brandingPkgType === 'N'){
							gridHeaderPanel.insert(0,{
							xtype : 'label',
							text : getLabel('accounts', 'Accounts'),
							cls : 'font_bold',
							padding : '5 0 0 5'
						});
						gridHeaderPanel.insert(1,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
					}
		} else if ('priority' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : getLabel('productpriorities',
								'Product Priorities'),
						cls : 'font_bold',
						padding : '5 0 0 5'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('products', 'Products') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnProductGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('packages', 'Packages') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					});
					if(brandingPkgType === 'N'){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePoniter ux_font-size14-normal">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}
			if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
			createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('attchNewRulePriority',
								'Attach new Rule Priority'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddRule'
					});}
		}
	},
	handleActionBar : function(){
		var me = this;
		var actionBar = me.getActionBar();
		actionBar.hide();
		if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
		actionBar.show();
		if ('package' == me.selectedGrid) {
			actionBar.show();
			actionBar.getComponent('btnEnable').show();
			actionBar.getComponent('btnDisable').show(true);
			actionBar.getComponent('btnDiscard').show(true);
		}
		else if ('product' == me.selectedGrid) {
			actionBar.show();
			actionBar.getComponent('btnDiscard').hide();
			actionBar.getComponent('btnEnable').show(true);
			actionBar.getComponent('btnDisable').show(true);
		}	
		else if ('account' == me.selectedGrid) {
			actionBar.hide();
		}
		else if ('priority' == me.selectedGrid){
			actionBar.show();
			actionBar.getComponent('btnEnable').show(true);
			actionBar.getComponent('btnDisable').show(true);
			actionBar.getComponent('btnDiscard').show(true);
		}}

	},
	handleSmartGridConfig : function() {
		var me = this;
		var payGrid = me.getPaymentGrid();
		var objConfigMap = me.getGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(payGrid))
			payGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);

		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 5;
		payServiceGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			// hideRowNumbererColumn : true,
			padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 5,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			isRowIconVisible : me.isRowIconVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
					}	
				// isRowIconVisible : me.isRowIconVisible
				/*
				 * 
				 * 
				 * handleRowIconClick : function(tableView, rowIndex,
				 * columnIndex, btn, event, record) {
				 * me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
				 * event, record); },
				 * 
				 * handleRowMoreMenuItemClick : function(menu, event) { var
				 * dataParams = menu.ownerCt.dataParams;
				 * me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
				 * dataParams.columnIndex, this, event, dataParams.record); }
				 */
			});
			
		payServiceGrid.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {	
					if (td.className.match('x-grid-cell-col_productCount')) {
						me.prdCountClicked = record.get('packageId');
						var packProductDetails = Ext.create(
								'GCP.view.DetailsPopup', {
									itemId : 'packProductPopup',
									title : getLabel('productName',
											'Product Name'),
									//height : 300,
									columnName : getLabel('productName',
										'Product Name'),
									width : 400,
									seekUrl : 'cpon/cponParameterisedDataList/productList',
									filterVal : me.prdCountClicked,
									layout : {
										type : 'vbox',
										align : 'stretch'
									}
								});
						packProductDetails.show();
					} else if (td.className.match('x-grid-cell-col_accountCount')) {
							if (me.selectedGrid == 'package')
							{
							me.prdCountClicked = record.get('packageId');
							var accDetails = null; 
							var accDetails = Ext.create(
									'GCP.view.AccAssignmentPopupView', {
										itemId : 'accAssignmentPopup',
										packageId : me.prdCountClicked,
										id : record.get('identifier')
									});
						accDetails.show();
						}
						else if (me.selectedGrid == 'product')
						{
						me.prdCountClicked = record.get('packageId');
							var prodProductDetails = Ext.create(
								'GCP.view.AccountDetailsPopup', {
									itemId : 'prodProductPopup',
									title : getLabel('accountName',	'Account Name'),
									columnName : getLabel('accountNumber', 'Account'),
									columnName2 : getLabel('accountName', 'Account Name'),
									width : 400,
									seekUrl : 'cpon/cponParameterisedDataList/prdAccountList',
									filterVal : me.prdCountClicked,
									layout : {	
										type : 'vbox',
										align : 'stretch'
									}
								});
						prodProductDetails.show();
						}
						else if (me.selectedGrid == 'priority')
						{
						me.prdCountClicked = record.get('productCode');
							var prioProductDetails = Ext.create(
								'GCP.view.DetailsPopup', {
									itemId : 'prioProductPopup',
									title : getLabel('accountName',
											'Account Name'),
									columnName : getLabel('accountName',
											'Account Name'),
									//height : 300,
									width : 400,
									seekUrl : 'cpon/cponParameterisedDataList/prdPriorityList',
									filterVal : me.prdCountClicked,
									layout : {
										type : 'vbox',
										align : 'stretch'
									}
								});
						prioProductDetails.show();
						}
					} else if (td.className
							.match('x-grid-cell-col_packageCount')) {
						me.prdCountClicked = record.get('accountId');
						var pkgDetails = null;
						var pkgDetails = Ext.create(
								'GCP.view.PkgAssignmentPopupView', {
									itemId : 'pkgAssignmentPopup',
									packageId : me.prdCountClicked,
									id : record.get('identifier')
								});
						pkgDetails.show();
					}else if (td.className.match('x-grid-cell-col_pkgCount') && me.selectedGrid == 'product') {
						me.prdCountClicked = record.get('productCode');
						var packCountDetails = Ext.create('GCP.view.DetailsPopup', {
									itemId : 'prodPackagePopup',
									title : getLabel('packageName','Package Name'),
									//height : 300,
									columnName : getLabel('packageName','Package Name'),
									width : 410,
									seekUrl : 'cpon/cponParameterisedDataList/updateProductList',
									filterVal : me.prdCountClicked,
									layout : {
										type : 'vbox',
										align : 'stretch'
									}
								});
						packCountDetails.show();
					} else if(td.className.match('x-grid-cell-col_companyId') && "ACH" == record.get('productCatType')){
						me.prdCountClicked = record.get('packageId');
						var companyIdPopup = Ext.create('GCP.view.ClientCompanyAssignmentView',{
												packageId : me.prdCountClicked, 
												id : record.get('identifier')
											});
						companyIdPopup.show();
					}
				});

		var payDtlView = me.getPayServiceDtlView();
		payDtlView.add(payServiceGrid);
		payDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (me.selectedGrid==='product' && actionName === 'btnView') {
			me.submitForm('viewClientPaymentPackageProductLinkage.form', record, rowIndex);
		}
		else if (me.selectedGrid==='product' && actionName === 'btnEdit') {
			//me.submitForm('editClientPaymentPackageProductLinkage.form', record, rowIndex);
			var paymentProduct = null;
			var paymentProduct = Ext.create('GCP.view.EditPaymentProductPopup',{productCode:record.data.productCode,defaultPkg:record.data.useSingleName});
			paymentProduct.show();
		}
		else if(me.selectedGrid==='package' && actionName === 'btnView'){
			me.submitForm('viewClientPaymentPackageLinkage.form', record, rowIndex);
		}
		else if(me.selectedGrid==='package' && actionName === 'btnEdit'){
			me.submitForm('editClientPaymentPackageLinkage.form', record, rowIndex);
		}
		else if(me.selectedGrid==='priority' && actionName === 'btnEdit'){
			me.showAttachPriorityPopup('EDIT',rowIndex);
		}
		else if(me.selectedGrid==='priority' && actionName === 'btnView'){
			me.showAttachPriorityPopup('VIEW',rowIndex);
		}
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
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	
	addProduct : function() {
		saveClientPaymentFeatureProfile('saveAndAddProduct.form');
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

				arrMenuItems[a].setVisible(true);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var me = this;
		
		
		if (record.get('pkgCount') != null && itmId === 'btnEdit') {
			if (record.get('pkgCount') > 1)
				return  true;
			else
				return  false;
		}
		else return true;
		
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

					createActionColumn : function() {
						var me = this;
						if ((viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")) {
							var objActionCol = {
								colType : 'action',
								colId : 'action',
								width : 80,
								align : 'right',
								locked : true,
								items : [
										{
											itemId : 'btnView',
											itemCls : 'grid-row-action-icon icon-view',
											toolTip : getLabel('viewToolTip',
													'View Record')
										} ]
								};
							return objActionCol;
						} else {
							var objActionCol = {
								colType : 'action',
								colId : 'action',
								width : 80,
								align : 'right',
								locked : true,
								items : [
										{
											itemId : 'btnEdit',
											itemCls : 'grid-row-action-icon icon-edit',
											toolTip : getLabel('editToolTip',
													'Edit')
										},
										{
											itemId : 'btnView',
											itemCls : 'grid-row-action-icon icon-view',
											toolTip : getLabel('viewToolTip',
													'View Record')
										} ]
							
							};
							return objActionCol;
						}
					},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		// arrCols.push(me.createGroupActionColumn());
		if(me.selectedGrid != 'account')
		{
			arrCols.push(me.createActionColumn())
		}
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
					if (cfgCol.colType === "accCount")
						cfgCol.align = 'center';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
			if(me.selectedGrid === 'product'){
				cfgCol.fnColumnRenderer = me.myColumnRenderer;
			}
			else			
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	
	myColumnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {	
		var strRetValue = "";
		if (colId === 'col_productCount') {
			strRetValue = '<span class="underlined">' + value + '</span>';
		} else if (colId === 'col_accountCount') {
				if (value != null && value > 0)
					strRetValue = '<span class="underlined">' + value + '</span>';
				else
					strRetValue = '<span class="underlined">0</span>';
		} else if (colId === 'col_pkgCount') {
			var link;
			//if (value != null && value > 0)
				strRetValue = '<span class="underlined">' + value + '</span>';
						/*+ '<span class="smallpadding_lr text_skyblue">..'
						+ getLabel('edit', 'Edit') + '</span>';
			else
				strRetValue = '<span class="underlined">0</span>'
						+ '<span class="smallpadding_lr red">..'
						+ getLabel('select', 'Select') + '</span>';*/
		} else if (colId === 'col_activeFlag') 
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
		}else {
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_productCount') {
			strRetValue = '<span class="underlined">' + value + '</span>';
		} else if (colId === 'col_accountCount' || colId === 'col_packageCount') {
				if (value != null && value > 0)
					strRetValue = '<span class="underlined">' + value + '</span>'
							+ '<span class="smallpadding_lr text_skyblue">..'
							+ getLabel('edit', 'Edit') + '</span>';
				else
					strRetValue = '<span class="underlined">0</span>'
							+ '<span class="smallpadding_lr red">..'
							+ getLabel('select', 'Select') + '</span>';
			
			
		}  else if (colId === 'col_activeFlag') 
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
		else if (colId === 'col_companyId') 
		{
			if (!record.get('isEmpty') && !Ext.isEmpty(record.get('productCatType')) && "ACH" == record.get('productCatType'))
			{
					if (value != null && value > 0)
						strRetValue = '<span class="underlined">' + value + '</span>'
								+ '<span class="smallpadding_lr text_skyblue">..'
								+ getLabel('edit', 'Edit') + '</span>';
					else
						strRetValue = '<span class="underlined">0</span>'
								+ '<span class="smallpadding_lr red">..'
								+ getLabel('select', 'Select') + '</span>';
			}
		}
			else {
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
	getGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		switch (me.selectedGrid) {
			case 'package' :
				if(brandingPkgType === 'N'){
					objWidthMap = {
					"packageName" : 120,
					"productCatType" : 120,
					"productCount" : 100,
					"accountCount" : 100,
					"companyId" : 130,
					"reportProfileId" : 120,
					"alertProfileId" : 120,
					"activeFlag" : 100
				};

				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : "Package Name"
						}, {
							"colId" : "productCatType",
							"colDesc" : "Type"
						}, {
							"colId" : "productCount",
							"colDesc" : "Products",
							"colType" : "number"
						}, {
							"colId" : "accountCount",
							"colDesc" : "Accounts",
							"colType" : "number"
						}, {
							"colId" : "companyId",
							"colDesc" : "Company ID",
							"colType" : "number"
						}, {
							"colId" : "reportProfileId",
							"colDesc" : "Reports"
						}, {
							"colId" : "alertProfileId",
							"colDesc" : "Alerts"
						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];}
				else if(brandingPkgType === 'Y'){
					objWidthMap = {
					"packageName" : 120,
					"productCatType" : 100,
					"productCount" : 100,
					"reportProfileId" : 120,
					"alertProfileId" : 120,
					"activeFlag" : 100
				};

				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : "Package Name"
						}, {
							"colId" : "productCatType",
							"colDesc" : "Type"
						}, {
							"colId" : "productCount",
							"colDesc" : "Products",
							"colType" : "number"
						},{
							"colId" : "reportProfileId",
							"colDesc" : "Reports"
						}, {
							"colId" : "alertProfileId",
							"colDesc" : "Alerts"
						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];}		
				storeModel = {
					fields : ['packageName', 'productCatType', 'productCount',
							'accountCount', 'reportProfileId', 'packageId',
							'alertProfileId', 'activeFlag', 'identifier',
							'history','companyId','parentRecordKey','recordKeyNo'],
					proxyUrl : 'cpon/clientServiceSetup/paymentList.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;

			case 'product' :
			if(brandingPkgType === 'N'){
				objWidthMap = {
					"productName" : 120,
					"useSingleName" : 120,
					"packageType" : 100,
					"pkgCount" : 100,
					"accountCount" : 100,
					"activeFlag" : 120
				};

				arrColsPref = [{
							"colId" : "productName",
							"colDesc" : "Product Name"
						}, {
							"colId" : "packageType",
							"colDesc" : "Type"
						},{
							"colId" : "pkgCount",
							"colDesc" : "Package Count",
							"colType" : "number"
						}, {
							"colId" : "useSingleName",
							"colDesc" : "Default Package"
						}, {
							"colId" : "accountCount",
							"colDesc" : "Accounts",
							"colType" : "number"
						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];
				}
				else if(brandingPkgType === 'Y'){
				objWidthMap = {
					"productName" : 120,
					"useSingleName" : 120,
					"packageType" : 100,
					"reportProfileId" : 120,
					"alertProfileId" : 120,
					"activeFlag" : 100
				};

				arrColsPref = [{
							"colId" : "productName",
							"colDesc" : "Product Name"
						}, {
							"colId" : "packageType",
							"colDesc" : "Type"
						}, {
							"colId" : "useSingleName",
							"colDesc" : "Default Package"
						}, {
							"colId" : "reportProfileId",
							"colDesc" : "Reports"
						}, {
							"colId" : "alertProfileId",
							"colDesc" : "Alerts"
						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];
				}
				storeModel = {
					fields : ['useSingleName', 'packageType', 'productName','pkgCount',
							'accountCount', 'reportProfileId','productCode',
							'alertProfileId', 'activeFlag', 'identifier','packageId',
							'parentRecordKey','history'],
					proxyUrl : 'cpon/clientServiceSetup/productList.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;

			case 'account' :
				objWidthMap = {
					"acctName" : 250,
					"packageCount" : 100,
					"activeFlag" : 100
				};

				arrColsPref = [{
							"colId" : "acctName",
							"colDesc" : "Account Name"
						}, {
							"colId" : "packageCount",
							"colDesc" : "Packages",
							"colType" : "number"

						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];

				storeModel = {
					fields : ['acctName', 'packageCount', 'activeFlag','accountId',
							'identifier'],
					proxyUrl : 'cpon/clientServiceSetup/payAccountList.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;
			
			case 'priority' :
				objWidthMap = {
					"order" : 120,
					"productCode" : 100,
					"arrangementCode" : 100,
					"ruleDesc" : 120,
					"rulePriority" : 120,
					"reportProfileId" : 120,
					"activeFlag" : 100
				};

				arrColsPref = [ {
							"colId" : "productCode",
							"colDesc" : "Product"
						}, {
							"colId" : "arrangementCode",
							"colDesc" : "Arrangement"
						}, {
							"colId" : "ruleDesc",
							"colDesc" : "Rule"
						}, {
							"colId" : "rulePriority",
							"colDesc" : "Rule Priority"
						}, {
							"colId" : "activeFlag",
							"colDesc" : "Status"
						}];

				storeModel = {
					fields : ['ruleDesc','productCode','arrangementCode', 
					          'activeFlag','rulePriority','identifier','reportProfileId',
							'alertProfileId', 'history'],
					proxyUrl : 'cpon/clientServiceSetup/productPriorityList.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;	
				
			default :

		}
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null);
	},
	showAttachPackagePopup : function() {
		attachPkgPopup = Ext.create('GCP.view.AttachPackagePopup', {
					itemId : 'attachPkgPopup'
				});
		(attachPkgPopup).show();
	},
	showAttachPriorityPopup : function(docmode,rowIndex) {
		var me = this;
		var grid = me.getPaymentGrid();
		var id = null;
		
		if('ADD'===docmode){
			attachrulePriorityPopup = Ext.create('GCP.view.AttachRulePriorityPopup', {
				itemId : 'attachrulePriorityPopup',mode : docmode
			});
		Ext.Ajax.request({
			
					url : 'cpon/clientPayment/productPriorityValue.json',
					method : 'POST',
					params:{id:encodeURIComponent(parentkey)},
					// jsonData : Ext.encode(arrayJson),
					success : function(response) {
					var data = Ext.decode(response.responseText);
					me.getPriorityField().setValue(data.d.count+1);	
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
		else if('EDIT'===docmode)
			{
			var record = grid.getStore().getAt(rowIndex);
			id = record.data.identifier;
			attachrulePriorityPopup = Ext.create('GCP.view.AttachRulePriorityPopup', {
				itemId : 'attachrulePriorityPopup',mode : docmode, identifier : id,productValue: record.data.productCode, ruleValue : record.data.ruleCode
			});
				
				this.getProductCombo().setValue(record.data.productCode);
				this.getRuleField().setValue(record.data.ruleDesc);
				this.getArrangementField().setValue(record.data.arrangementCode);
				this.getPriorityField().setValue(record.data.rulePriority);
			}
		else if('VIEW'===docmode)
		{
			attachrulePriorityPopup = Ext.create('GCP.view.AttachRulePriorityPopup', {
				itemId : 'attachrulePriorityPopup',mode : docmode
			});
			var record = grid.getStore().getAt(rowIndex);
			this.getProductCombo().setValue(record.data.productCode);
			this.getProductCombo().setDisabled(true);
			this.getRuleField().setValue(record.data.ruleDesc);
			this.getRuleField().setDisabled(true);
			this.getArrangementField().setValue(record.data.arrangementCode);
			this.getPriorityField().setValue(record.data.rulePriority);
		}
		
		(attachrulePriorityPopup).show();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	submitPackages : function(records) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index]) + 1,
						identifier : records[index].data.identifier,
						userMessage : parentkey
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});

		Ext.Ajax.request({
					url : 'cpon/clientPayment/addPackage',
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
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
						me.getAttachPackagePopup().close();
						var payGrid = me.getPaymentGrid();
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
	submitRulePriorities : function(identifier) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
			
		arrayJson.push({
						serialNo : 0,
						identifier : identifier,
						userMessage : null,
						productCode : this.getProductCombo().getValue(),
						ruleCode : this.getRuleField().getValue(),
						arrangementCode : this.getArrangementField().getValue(),
						priority : this.getPriorityField().getValue()
					});
		
		Ext.Ajax.request({
					url : 'cpon/clientPayment/addRulePriority?id='+ encodeURIComponent(parentkey),
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getAttachRulePriorityPopup().close();
						var payGrid = me.getPaymentGrid();
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
	handleCopuByClientLoadGrid : function(grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(me.prdCountClicked)) {
			strUrl = strUrl + '&qfilter=' + me.prdCountClicked;
		}
		grid.loadGridData(strUrl, null);
	},
	assignAccounts : function(records,id) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
		for (var index = 0; index < records.length; index++) {
		arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index]) + 1,
						identifier : id,
						userMessage : records[index].data.accountId
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});
		if (records.length == 0) {
			arrayJson.push({
				serialNo : 1,
				identifier : id,
				userMessage : null
			});
		}			

		Ext.Ajax.request({
					url : 'cpon/clientPayment/addPkgAccountLinkage',
					method : 'POST',
					params : {'id': parentkey},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getAccAssignmentPopupView().close();
						var payGrid = me.getPaymentGrid();
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
	assignPackages : function(records,id) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index]) + 1,
						identifier : id,
						userMessage : records[index].data.packageId
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});			
		if (records.length == 0) {
			arrayJson.push({
				serialNo : 1,
				identifier : id,
				userMessage : null
			});
		}
		Ext.Ajax.request({
					url : 'cpon/clientPayment/addAccPackageLinkage',
					method : 'POST',
					params : {'id': parentkey},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getPkgAssignmentPopupView().close();
						var payGrid = me.getPaymentGrid();
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
					assignCompany : function(records, packageId) {
						var me = this;
						var arrayJson = new Array();
						var grid = me.getPaymentGrid();
						for ( var index = 0; index < records.length; index++) {
							arrayJson.push({
								serialNo : grid.getStore().indexOf(
										records[index]) + 1,
								identifier : packageId,
								userMessage : records[index].data.companyId
							});
						}
						if (arrayJson)
							arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
						if (records.length == 0) {
							arrayJson.push({
								serialNo : 1,
								identifier : packageId,
								userMessage : null
							});
						}
						Ext.Ajax.request({
							url : 'cpon/clientPayment/assignCompanyId?id='
									+ encodeURIComponent(parentkey),
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(response) {
								me.getClientCompanyAssignmentView().close();
								var payGrid = me.getPaymentGrid();
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
	handleSaveCompanyIDBtn : function() { 
		var me=this;
		this.getCompanyIDTextField();
		this.getCompanyNameTextField();
		this.getDefAccpountCombo();
		{
		var id = this.getCompanyIDTextField().value;
		var name = this.getCompanyNameTextField().value;
		var accountId = this.getDefAccpountCombo().value;
		var accountNmbr = this.getDefAccpountCombo().rawValue;
		if(accountId){
			var currency = this.getDefAccpountCombo().valueModels[0].data.ccyCode;
			var bankCode = this.getDefAccpountCombo().valueModels[0].data.bankCode;
		}
		if(id && name){
				var records =  {
									companyId : id,
									companyName : name,
									accountNmbr : accountNmbr,
									accountId : accountId,
									currencyCode : currency,
									bankCode : bankCode
								};				
				var jsonData = { identifier : parentkey,
								 userMessage : records	
								}; 
				if(me.getSaveCompanyIDBtn().getText()==='Add'){				
					Ext.Ajax.request({
							url: 'cpon/clientPayment/addClientCompany',
							method: 'POST',
							
							jsonData: jsonData,
							success: function() {
								me.getAddCompanyIDTabPanel().setActiveTab(0);
								var grid = me.getAddCompanyIDTabPanel().down('companyIDTabGrid');
								var companyGrid = me.getCompanyIDGrid();
								companyGrid.refreshData()
							},
							failure: function() {
							}
						});	
				}else
				{
					Ext.Ajax.request({
							url: 'cpon/clientPayment/updateClientCompany',
							method: 'POST',
							
							jsonData: jsonData,
							success: function() {
								me.getAddCompanyIDTabPanel().setActiveTab(0);
								var grid = me.getAddCompanyIDTabPanel().down('companyIDTabGrid');
								
							},
							failure: function() {
							}
						});	
				}
						
				}else
				{
					Ext.Msg.alert('Error','Account ID and Company Name can not be Empty.');
				}		
		}
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

		var grid = me.getPaymentGrid();
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
	enableDisableAttachPkgBtn:function(enableDisableFlag){
        var me=this;
        var btnAttachPackageRef=me.getBtnAttachPackage();
        if(!Ext.isEmpty(btnAttachPackageRef))
        {
        	btnAttachPackageRef.setDisabled(enableDisableFlag);
        }
    }
});