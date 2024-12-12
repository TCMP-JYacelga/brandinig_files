var pmntMethodLbl;
var attachLbl;
Ext.define('CPON.controller.ClientPayServiceController', {
	extend : 'Ext.app.Controller',
	requires : ['CPON.view.PayFeaturePopup'],
	views : ['CPON.view.ClientPayServiceView', 'CPON.view.AttachPackagePopup',
			'CPON.view.AccAssignmentPopupView',
			'CPON.view.PkgAssignmentPopupView',
			'CPON.view.ViewCompanyIDTabGrid',
			'CPON.view.AttachRulePriorityPopup',
			'CPON.view.EditPaymentProductPopup',
			'CPON.view.CompanyIDPopup',
			'CPON.view.PayCompanyIDPopup','CPON.view.PayFeaturePopup','CPON.view.EditCollectionPkgPopup'],
					refs : [
							{
								ref : 'actionBarContainer',
								selector : 'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="actionBarContainer"]'
							},
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
								ref : 'editCollectionPkgPopup',
								selector : 'editCollectionPkgPopup'
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
								ref : 'CollPkgNameCombo',
								selector : 'editCollectionPkgPopup textfield[itemId="txtCollMethodNm"]'
							},
							{
								ref : 'DefaultEnrichmentCombo',
								selector : 'editCollectionPkgPopup combo[itemId="defaultEnrichmentCombo"]'
							},
							{
								ref : 'collPkgAssignAcc',
								selector : 'editCollectionPkgPopup checkboxfield[itemId="assignAccFlag"]'
							},						
							{
								ref : 'collUseForValue',
								selector : 'editCollectionPkgPopup label[itemId="lblUseForValue"]'
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
								ref: 'cutOffCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="defCutOff"]'
							},							
							{	
								ref: 'arrangmentCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="arrangmentCombo"]'
							},
							{	
								ref: 'riskManagerCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="riskManagerCombo"]'
							},
							{	
								ref: 'identifier',
								selector : 'editPaymentProductPopup  combobox[itemId="identifier"]'
							},
							{
								ref : 'currency',
								selector : 'editPaymentProductPopup label[itemId="currency"]'
							},
							{
								ref : 'CollPayWokflowCombo',
								selector : 'editCollectionPkgPopup combo[itemId="defaultProductCombo"]'
							},
							{	
								ref: 'creditLineCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="collPrdCreditLine"]'
							},
							{	
								ref: 'pdcLineCombo',
								selector : 'editPaymentProductPopup  combobox[itemId="collPrdPdcLine"]'
							},
							 {
                                ref: 'transferReceipt',
                                selector :'editPaymentProductPopup  checkboxfield[itemId="transferReceipt"]'
                        },
							{
                                ref: 'btnAttachPackage',
                                selector :'clientPayServiceView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnAttachPackage"]'
                        },
                        {
                                ref: 'pmtPkgCheckboxGroup',
                                selector :'payFeaturePopup[itemId="payFeaturePopup"] checkboxgroup[itemId="paymentPackages"]'
                        },
                        {
                                ref: 'pmtWorkFlowDefCheckboxGroup',
                                selector :'payFeaturePopup[itemId="payFeaturePopup"] checkboxgroup[itemId="paymentWorkflowDefinition"]'
                        },
						{
							ref : 'tabPrioritiesGrid',
							selector : 'clientPayServiceView panel[itemId="payServiceDtlView"] container[itemId="gridHeader"] button[itemId="btnPrioritiesGrid"]'
						},
                        {
                                ref: 'templateApprovarOptionschkBoxContainer',
                                selector :'payFeaturePopup[itemId="payFeaturePopup"] container[itemId="templateApprovarOptions_chkBox"]'
						},
						{
                            ref: 'useFor',
                            selector :'editCollectionPkgPopup label[itemId="lblUseFor"]'
						}
                        ],
	config : {
		selectedGrid : 'package',
		prdCountClicked : '',
		parentRecordKey : ''
	},
	init : function() {
		var me = this;
		        $(document).on('handleViewChanges',function() {
					                me.refreshGrid();
									        });
		CPON.getApplication().on({
            checkClicked : function(enableDisableFlag) 
            {
            	me.enableDisableAttachPkgBtn(enableDisableFlag);
            },
            templateToggleDependantChkBox:function(checkbox,value) 
            {
            	me.templateToggleDependantChkBox(checkbox,value);
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
			'attachRulePriorityPopup' : {
				show : function(me){
					var combo = this.getArrangementField();
					combo.getStore().on('load',function(){
						if(me.arrangementValue !== ''){
							combo.setValue(me.arrangementValue);
							me.arrangementValue = '';
							if(me.docMode === 'VIEW'){
								combo.disable();
								me.docMode = '';
							}
						}
					});
				}
			},
			'clientPayServiceView toolbar[itemId=gridActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'accAssignmentPopupView button[itemId="btnSubmitPackage"]' : {
				assignAccounts : function(records,id,remRecords) {
					me.assignAccounts(records,id,remRecords);
				}
			},
			'pkgAssignmentPopupView button[itemId="btnSubmitPackage"]' : {
				assignPackages : function(records,deselected,id) {
					me.assignPackages(records,deselected,id);
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
			'payCompanyIdPopup' : {
				render: function(){
					if(viewmode === 'VIEW'){
						me.getCompanyIdTabPanel().items.getAt(1).setDisabled(true);
						me.getTabPanelSaveBtn().hide(true);
						/*TODO - Need to remove class used to shift button*/
						me.getTabPanelCloseBtn().addCls('company-id-xbtn-left-view');
						me.getTabPanelCloseBtn().addCls('ft-button-primary-paddingBsmall');
						me.getCompanyIdButton().hide();				
					}
					if(viewmode === 'EDIT'){
					me.getTabPanelCloseBtn().addCls('company-id-xbtn-left-view');
					me.getTabPanelCloseBtn().addCls('ft-button-primary-paddingBsmall');
					}
				},
				handleSaveCompanyID:function(btn,e,opts){
					me.handleSaveCompanyID(btn, e, opts);
				}
				
			}, 
			'companyIdPopup button[itemId="savebtn"]' : {
				assignCompany : function(records,id) {
//					if(this.getSaveCompanyIDBtn().getText() === "Submit"){
//						me.assignCompany(records,id);
//					}else
						if(this.getSaveCompanyIDBtn().getText() === "Add"){
						//me.handleSaveCompanyIDBtn();
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
				saveEditProduct : function(productCode, initialProductCode,strPackageId) {
					var me = this;
					var record = me.getEditCombo().getValue();
					var identifier = me.getIdentifier().getValue();
					if (srvcCode === '02') {
							identifier =strPackageId;
					}
					var cutOffProfile = '', arrangmentValue, riskManagerValue;
					if (me.getCutOffCombo() != null)
						cutOffProfile = me.getCutOffCombo().getValue();
					var strtransferReceipt = '';
					var strCrLine = null;
					var strPdcLine = null;

					if ('05' == srvcCode) {
						if (me.getArrangmentCombo())
							arrangmentValue = me.getArrangmentCombo()
									.getValue();
						if (me.getRiskManagerCombo())
							riskManagerValue = me.getRiskManagerCombo()
									.getValue();
						if(me.getPdcLineCombo())			
							strPdcLine = me.getPdcLineCombo().getValue();
						var popup = me.getEditPaymentProductPopup();
						if (popup.getMode() == 'view') {
							popup.close();
							return;
						}
						if (arrangmentValue.toLowerCase() != 'clear+0'
								&& riskManagerValue == '') {
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : 'Please Select Risk Manager Action',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							return;
						}
						cutOffProfile = me.getCutOffCombo().getValue();
						var strCrLine = me.getCreditLineCombo().getValue();
						if (me.getPdcLineCombo())
							strPdcLine = me.getPdcLineCombo().getValue();
						if (me.getTransferReceipt()
								&& true == me.getTransferReceipt().getValue()) {
							strtransferReceipt = 'Y';
						} else {
							strtransferReceipt = 'N';
						}
					}
					var strUpdateCollProdUrl = null;
					if('02' == srvcCode)
					{
						strUpdateCollProdUrl = 'cpon/clientServiceSetup/updateProduct';
					}
					if('05' == srvcCode)
					{
						strUpdateCollProdUrl = 'cpon/clientServiceSetup/updateCollProduct';
					}
					// if (record) {
					var jsonData = {
						identifier : productCode,
						initialIdentifier : initialProductCode,
						userMessage : identifier,
						defaultRecPackage : record,
						riskManagerAction : riskManagerValue,
						creditLine : lineCodeVar===''?strCrLine:lineCodeVar,
						creditLineCode : lineCodeVar===''?strCrLine:lineCodeVar,
						pdcLine : strPdcLine,
						cufOffProfile : cutOffProfile,
						transferReceipt : strtransferReceipt,
						arrangment : arrangmentValue
					};
					Ext.Ajax.request({
						url : strUpdateCollProdUrl,
						method : 'POST',
						params : {
							id : parentkey
						},
						jsonData : jsonData,
						success : function(response) {
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data)) {
									if (!Ext.isEmpty(data.parentIdentifier)) {
										parentkey = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
									}
									if (!Ext.isEmpty(data.listActionResult)) {
										Ext
												.each(
														data.listActionResult[0].errors,
														function(error, index) {
															errorMessage = errorMessage
																	+ error.code
																	+ ' : '
																	+ error.errorMessage
																	+ "<br/>";
														});
									}
								}
								if ('' != errorMessage && null != errorMessage) {
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
							me.getEditPaymentProductPopup().close();
							var payGrid = me.getPaymentGrid();
							payGrid.refreshData();
						},
						failure : function() {
							Ext.Msg
									.alert('Error',
											'Error while fetching data.');
						}
					});
					// }
				}
			},
			'payFeaturePopup[itemId="payFeaturePopup"]':{
				pmtPkgCheckBoxClicked:function(checkbox,value) {
					/*if(!Ext.isEmpty(checkbox.featureId) && checkbox.featureId=="EDITEXITING"){
					if(value){
							this.enableDisableDependantChkboxes(value);
					}else{
						this.enableDisableDependantChkboxes(value);
					}
				}*/
			}	
			},
			'payFeaturePopup[itemId="payFeaturePopup"]':
			{
				templateToggleDependantChkBox:function(checkbox,value) 
				{
					var clickedChkBoxid = checkbox.featureId;
					
					var templateApprovarOptchkBoxContRef =  me.getTemplateApprovarOptionschkBoxContainer();
					
					if( !Ext.isEmpty( templateApprovarOptchkBoxContRef ) )
					{
						var groupItems = templateApprovarOptchkBoxContRef.items;

						for(var index = 0 ; index < groupItems.length ; index++)
						{
							var currentChkBox = groupItems.items[index];

							if((clickedChkBoxid == 'REP' && currentChkBox.featureId == "AREP")
								|| (clickedChkBoxid == 'SREP' && currentChkBox.featureId == "ASREP")
								|| (clickedChkBoxid == 'NREP' && currentChkBox.featureId == "ANREP"))
								{
									currentChkBox.setValue(false);
									if(value)
										currentChkBox.setDisabled(false);
									else
										currentChkBox.setDisabled(true);
								}
						}
					}
				}	
			},
			'editCollectionPkgPopup button[itemId="saveCollPkg"]' : {
				updateCollectionPkg : function(identifier) {
					me.updateCollectionPkg(identifier);
				}
			},
			'viewCompanyIDTabGrid' : {
				deleteCompanyId : me.deleteCompanyId
			}
		});
	},
	enableDisableDependantChkboxes:function(value){
		var me=this;
		var pmtPkgCheckboxGroupRef=me.getPmtPkgCheckboxGroup();
		var pmtWorkFlowDefCheckboxGroupRef=me.getPmtWorkFlowDefCheckboxGroup();
		
		if(!Ext.isEmpty(pmtPkgCheckboxGroupRef)){
			var groupItems=pmtPkgCheckboxGroupRef.items;
			for(var index=0;index<groupItems.length;index++){
				var currentChkBox=groupItems.items[index];
			/*	if(currentChkBox.featureId=="CLONEPACKAGE"){
					currentChkBox.setValue(false);
					
					if(value)
					currentChkBox.setDisabled(false);
					else
					currentChkBox.setDisabled(true);
				}*/
			}
		}
		
		if(!Ext.isEmpty(pmtWorkFlowDefCheckboxGroupRef)){
			var groupItems=pmtWorkFlowDefCheckboxGroupRef.items;
			for(var index=0;index<groupItems.length;index++){
				var currentChkBox=groupItems.items[index];
				/*if(currentChkBox.featureId=="EDITSTNDWORKFLOW" || currentChkBox.featureId=="NEWWORKFLOWDEF"){
					currentChkBox.setValue(false);
					
					if(value)
					currentChkBox.setDisabled(false);
					else
					currentChkBox.setDisabled(true);
				}*/
			}
		}
	},
	handleSaveCompanyID: function(btn, e, eOpts){
		var me = this;
		var id = me.getCompIdTextField().getValue();
		var name = me.getCompNameTextField().getValue();
		if(btn.getText().indexOf('Update') > -1) {
			if(!me.getDefAccCombo().valueModels[0]) {
				var store = me.getDefAccCombo().getStore();
				var defVal = me.getDefAccCombo().getValue();
				for(var i=0; i<store.data.items.length; i++)
				{
					if(defVal == store.data.items[i].data.acctNmbr)
						me.getDefAccCombo().setValue(store.data.items[i].data.accountId);
				}	
			}
		}
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
								bankCode : bankCode,
								recordKeyNo : me.getCompanyIdTabPanel().recordKey
							};				

			var jsonData = { identifier : parentkey,
							 userMessage : records	
							};
					
			if(btn.getText().indexOf('Save') > -1){			
				Ext.Ajax.request({
						url: 'cpon/clientPayment/addClientCompany',
						method: 'POST',
						
						jsonData: jsonData,
						success: function(response) {
							
							me.getCompanyIdTabPanel().setActiveTab(0);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
							
							var errorMessage = '';
							if(response.responseText != '[]')
							{
								var jsonData = Ext.decode(response.responseText);
								Ext.each(jsonData[0].errors, function(error, index) {
									errorMessage = errorMessage + error.errorMessage +"<br/>";
								});
								if('' != errorMessage && null != errorMessage) {
									Ext.MessageBox.show({
					           			title:'Error',
					           			msg: errorMessage,
					           			buttons : Ext.MessageBox.OK,
					           			cls : 'ux_popup'
				     				 });
								}
								//Ext.Msg.alert("Error",errorMessage);
							}
						},
						failure: function() {
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
			}else if(btn.getText().indexOf('Update') > -1)
			{
				Ext.Ajax.request({
						url: 'cpon/clientPayment/updateClientCompany',
						method: 'POST',
						
						jsonData: jsonData,
						success: function(response) {
							me.getCompanyIdTabPanel().setActiveTab(0);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
							
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
						},
						failure: function() {
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
					
		}else
		{
			//Ext.Msg.alert('Error','Account ID and Company Name can not be Empty.');
			Ext.MessageBox.show({
	           			title:'Error',
	           			msg: getLabel('companyIdAndCompanyName',
						'Company ID and Company Name can not be Empty.'),
	           			buttons : Ext.MessageBox.OK,
	           			cls : 'ux_popup'
     				 });
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
			me.getTabPanelSaveBtn().hide(true);
			me.getTabPanelSaveBtn().setText('Save');		
		}else{
			me.getTabPanelSaveBtn().show(true);
		}
		if(viewmode == 'EDIT'){
			if(me.getCompanyIdTabPanel().activeTab.title==getLabel('viewcompanyid','View Company ID')){
			me.getTabPanelCloseBtn().addCls('company-id-xbtn-left-view');
			me.getTabPanelCloseBtn().addCls('ft-button-primary-paddingBsmall');
			}
			else{
			me.getTabPanelCloseBtn().removeCls('company-id-xbtn-left-view');
			me.getTabPanelCloseBtn().removeCls('ft-button-primary-paddingBsmall');
			}
		}
	},
	handleTabChange : function(tabPanel, newCard, oldCard, eOpts){
		if(newCard.itemId === "firsttab"){
			this.getSaveCompanyIDBtn().setText(getLabel('submit','Submit'));
		}else if(newCard.itemId === "secondtab"){
			this.getSaveCompanyIDBtn().setText(getLabel('add','Add'));
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
		{
			if(srvcCode=='02')
			{
				strUrl = Ext.String.format('cpon/clientPackage/{0}.srvc?',
						strAction);
			}
			if(srvcCode=='05')
			{
				strUrl = Ext.String.format('cpon/clientCollection/{0}.srvc?',
						strAction);
			}
		}
		else if (me.selectedGrid == 'product')
		{
			if(srvcCode=='02')
			{
				strUrl = Ext.String.format('cpon/clientPayProduct/{0}.srvc?',
						strAction);
			}
			if(srvcCode=='05')
			{
				strUrl = Ext.String.format('cpon/clientProduct/{0}.srvc?',
						strAction);
			}
			//strUrl = Ext.String.format('cpon/clientProduct/{0}',
			//	strAction);
		}
		else if (me.selectedGrid == 'priority')
		{
			if(srvcCode=='02')
			{
				strUrl = Ext.String.format('cpon/clientRulepriority/{0}.srvc?',
					strAction);
			}
			if(srvcCode=='05')
			{
				strUrl = Ext.String.format('cpon/clientCollRulePriority/{0}.srvc?',
					strAction);
			}
		}
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
	
	enableValidActionsForGrid : function() {
		var me = this;
		var grid = me.getPaymentGrid();
		var discardActionEnabled = false;
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		var enableActiondisable = false;
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;
			enableActionEnabled = false;
			disableActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.activeFlag == "N") {
							if(srvcCode == '02' && !Ext.isEmpty(item.data.productCode))
							{
								if(isSameDayAchAllowed == 'true')
								{
									enableActionEnabled = true;
								}
								else 
								{									
									if(Ext.isEmpty(item.data.sameDayACHProd) 
											|| (!Ext.isEmpty(item.data.sameDayACHProd) && item.data.sameDayACHProd == 'N'))
										enableActionEnabled = true;
									else
										enableActionEnabled = false;
								}
							}
							else
								{
									if((null != document.getElementById("chkImg_"+item.data.productCatType)) && (document.getElementById("chkImg_"+item.data.productCatType).src.indexOf("icon_checked.gif")) == -1) 
									{
										enableActiondisable =true;
									}
									else
								enableActionEnabled = true;
								}
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

		if(enableActiondisable && disableActionEnabled )
		{
			enableBtn.setDisabled(!blnEnabled);
			disableBtn.setDisabled(!blnEnabled);
		}
		else if(enableActiondisable && enableActionEnabled )
		{
			enableBtn.setDisabled(!blnEnabled);
			disableBtn.setDisabled(!blnEnabled);
		} 
		else if(enableActiondisable && !disableActionEnabled && !enableActionEnabled)
		{
			disableBtn.setDisabled(!blnEnabled);
			enableBtn.setDisabled(!blnEnabled);
		}
		else if (!disableActionEnabled && !enableActionEnabled) {
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
		if(srvcCode == '05')
			tabProductPriorities = false;
		if('02' == srvcCode)
		 pmntMethodLbl = getLabel('packages', 'Payment Packages');
		if('05' == srvcCode)
		pmntMethodLbl = getLabel('collectionMethods', 'Collection Methods');
		if ('package' == me.selectedGrid ) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : pmntMethodLbl,
						cls : 'font_bold ux_font-size14',
						padding : '5 4 0 0'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePointer" id="product">'
								+ getLabel('products', 'Products') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnProductGrid'
					});
					if('02' == srvcCode){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePointer" id="prodPriority">'
								+ getLabel('productpriorities',
										'Product Priorities') + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPrioritiesGrid'
						});
					}
					/*	if(brandingPkgType === 'N' && '02' == srvcCode){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePointer">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}*/
					me.getModifiedModules(btnViewOld);
					if(tabProductPriorities)
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						objProductPriorities.enable();
					}
					else
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						if(objProductPriorities)
							objProductPriorities.disable();
					}
			if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
				if('02' == srvcCode)
				attachLbl = getLabel('attachpackage',
								'Attach Payment Package');							
				if('05' == srvcCode)
				attachLbl = getLabel('attachCollectionMethod',
								'Attach Collection Method');
								
				if (!Ext.isEmpty(selectedCategories)) {
					createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : attachLbl,
						cls : 'cursor_pointer ux_button-padding ux_button-background-color',
						glyph : 'xf055@fontawesome',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAttachPackage'
					}/*, '-', {
						xtype : 'button',
						border : 0,
						text : getLabel('addproduct',
								'Add Product'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddProduct',
						handler : function() {
							me.addProduct();
						}
					}*/);
				} else {
					createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : attachLbl,
						cls : 'cursor_pointer ux_button-padding ux_button-background-color',
						glyph : 'xf055@fontawesome',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAttachPackage',
						disabled : true
					}/*, '-', {
						xtype : 'button',
						border : 0,
						text : getLabel('addproduct',
								'Add Product'),
						cls : 'cursor_pointer',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddProduct',
						handler : function() {
							me.addProduct();
						}
					}*/);
				}
			}
		} else if ('product' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : getLabel('products', 'Products'),
						cls : 'font_bold  ux_font-size14',
						padding : '5 4 0 0'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePointer" id="payPkg">'
								+ pmntMethodLbl + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					});
					if(brandingPkgType === 'N' && '02' == srvcCode){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePointer" id="prodPriority">'
									+ getLabel('productpriorities',
											'Product Priorities') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnPrioritiesGrid'
						});
					}
						/*if(brandingPkgType === 'N' && '02' == srvcCode){
						gridHeaderPanel.insert(5,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(6,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePointer">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}*/
					me.getModifiedModules(btnViewOld);
					if(tabProductPriorities)
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						if(objProductPriorities)
							objProductPriorities.enable();
					}
					else
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						if(objProductPriorities)
							objProductPriorities.disable();
					}
			/*if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
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
					});}*/
		}else if ('account' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePointer" id="product">'
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
						text : '<span class="button_underline thePointer" id="payPkg">'
								+ pmntMethodLbl + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					});
					if(srvcCode === '02'){
							gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePointer" id="prodPriority">'
									+ getLabel('productpriorities',
											'Product Priorities') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnPrioritiesGrid'
						});
						gridHeaderPanel.insert(1,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
					}
					/*if(brandingPkgType === 'N'){
							gridHeaderPanel.insert(0,{
							xtype : 'label',
							text : getLabel('accounts', 'Accounts'),
							cls : 'font_bold  ux_font-size14',
							padding : '5 4 0 0'
						});
						gridHeaderPanel.insert(1,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
					}*/
					me.getModifiedModules(btnViewOld);
					if(tabProductPriorities)
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						objProductPriorities.enable();
					}
					else
					{
						var objProductPriorities = me.getTabPrioritiesGrid();
						if(objProductPriorities)
							objProductPriorities.disable();
					}
		} else if ('priority' == me.selectedGrid) {
			gridHeaderPanel.add({
						xtype : 'label',
						text : getLabel('productpriorities',
								'Product Priorities'),
						cls : 'font_bold  ux_font-size14',
						padding : '5 4 0 0'
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						padding : '5 3 0 3'
					}, {
						xtype : 'button',
						border : 0,
						text : '<span class="button_underline thePointer" id="product">'
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
						text : '<span class="button_underline thePointer" id="payPkg">'
								+ pmntMethodLbl + '</span>',
						cls : 'xn-account-filter-btnmenu',
						margin : '5 0 0 0',
						itemId : 'btnPackageGrid'
					});
					me.getModifiedModules(btnViewOld);
					/*if(brandingPkgType === 'N' && '02' == srvcCode){
						gridHeaderPanel.insert(3,{
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18,
							padding : '5 3 0 3'
						});
						gridHeaderPanel.insert(4,{
							xtype : 'button',
							border : 0,
							text : '<span class="button_underline thePointer">'
									+ getLabel('accounts', 'Accounts') + '</span>',
							cls : 'xn-account-filter-btnmenu',
							margin : '5 0 0 0',
							itemId : 'btnAccountGrid'
						});
					}*/
			if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
			createNewPanel.add({
						xtype : 'button',
						border : 0,
						text : getLabel('attchNewRulePriority',
								'Attach new Rule Priority'),
						cls : 'cursor_pointer ux_button-padding ux_button-background-color',
						glyph : 'xf055@fontawesome',
						padding : '4 0 2 0',
						parent : this,
						itemId : 'btnAddRule'
					});}
		}
	},
	handleActionBar : function(){
		var me = this;
		var actionBar = me.getActionBar();
		var actionBarContainer = me.getActionBarContainer();
		actionBar.hide();
		if(!(viewmode === "VIEW" || viewmode === "MODIFIEDVIEW")){
		actionBar.show();
		if ('package' == me.selectedGrid) {
			actionBar.show();
			actionBarContainer.show();
			actionBar.getComponent('btnEnable').show();
			actionBar.getComponent('btnDisable').show(true);
			actionBar.getComponent('btnDiscard').show(true);
		}
		else if ('product' == me.selectedGrid) {
			actionBar.show();
			//actionBar.hide();
			//actionBarContainer.hide();
			actionBar.getComponent('btnDiscard').hide();
			//actionBar.getComponent('btnEnable').hide();
			//actionBar.getComponent('btnDisable').hide();
		}	
		else if ('account' == me.selectedGrid) {
			//actionBarContainer.hide();
			actionBar.hide();
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
	/*getCheckBoxColumn : function() {
		var me = this;
		if (me.selectedGrid == 'product' || me.selectedGrid == 'account') {
			return false;
		}
		return true;
	},*/
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 5;
		payServiceGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			//showCheckBoxColumn : me.getCheckBoxColumn(),
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,
			showEmptyRow : false,
			// hideRowNumbererColumn : true,
			headerDockedItems : null,
			multiSort : false,
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
						var strPopupPrdLstUrl = null;
						var productPopupLabel=getLabel('productName','Product Name');
						if('02' == srvcCode)
						{
							strPopupPrdLstUrl = 'cpon/clientServiceSetup/packageProductList';
							productPopupLabel = 'Assign Product';
								var packProductDetails = Ext.create(
										'CPON.view.DetailsAssignedPopup', {
											//itemId : 'packProductPopup',
											packageName : record.data.packageName,
											title : productPopupLabel,
											//height : 300,
											columnName : getLabel('productName',
												'Product Name'),
												columnName2 : 'Assign',
											//width : 400,
											seekUrl : strPopupPrdLstUrl,
											filterVal : me.prdCountClicked,
											filterVal2 : record.get('activeFlag')
										});
							packProductDetails.show();
						}
						if('05' == srvcCode)
						{
							strPopupPrdLstUrl = 'cpon/cponParameterisedDataList/collProductList';
							productPopupLabel=getLabel('productName'+srvcCode,'Receivables Product Name');
							var packProductDetails = Ext.create(
									'CPON.view.DetailsPopup', {
										itemId : 'packProductPopup',
										packageName : record.data.packageName,
										title : productPopupLabel,
										//height : 300,
										columnName : getLabel('productName',
											'Product Name'),
											columnName2 : getLabel('ccyCode',
											'Currency'),
										//width : 400,
										seekUrl : strPopupPrdLstUrl,
										filterVal : me.prdCountClicked
									});
							packProductDetails.show();
						}						
					
					} else if (td.className.match('x-grid-cell-col_accountCount')) {
							if (me.selectedGrid == 'package')
							{
								if(viewmode != 'VIEW'  && viewmode != "MODIFIEDVIEW" )
								{
									//if (!Ext.isEmpty(record.get('allowAllPayAcct')) && "N" == record.get('allowAllPayAcct'))
									{
											me.prdCountClicked = record.get('packageId');
											var accDetails = null; 
											var accDetails = Ext.create(
													'CPON.view.AccAssignmentPopupView', {
														itemId : 'accAssignmentPopup',
														packageId : me.prdCountClicked,
														id : record.get('identifier')
													});
										accDetails.show();
									}
								}
								else
								{

									me.prdCountClicked = record.get('packageId');
									var accDetails = null; 
									var accDetails = Ext.create(
											'CPON.view.AccAssignmentPopupView', {
												itemId : 'accAssignmentPopup',
												packageId : me.prdCountClicked,
												id : record.get('identifier')
											});
								accDetails.show();
								}
						}
						else if (me.selectedGrid == 'product')
						{
							var collPrdAccUrl = null;
							if('02' == srvcCode)
							{
								collPrdAccUrl = 'cpon/cponParameterisedDataList/prdAccountList';
							}
							if('05' == srvcCode)
							{
								collPrdAccUrl = 'cpon/cponParameterisedDataList/collPrdAccountList';
							}
						me.prdCountClicked = record.get('packageId');
							var prodProductDetails = Ext.create(
								'CPON.view.AccountDetailsPopup', {
									itemId : 'prodProductPopup',
									title : getLabel('accountName',	'Account Name'),
									columnName : getLabel('accountNumber', 'Account'),
									columnName2 : getLabel('accountName', 'Account Name'),
									width : 400,
									seekUrl : collPrdAccUrl,
									filterVal : me.prdCountClicked,
									layout : {	
										type : 'vbox',
										align : 'stretch'
									},
									listeners : {
										'resize' : function(){
											this.center();
										}
									}
								});
						prodProductDetails.show();
						}
						else if (me.selectedGrid == 'priority')
						{
						me.prdCountClicked = record.get('productCode');
							var prioProductDetails = Ext.create(
								'CPON.view.DetailsPopup', {
									itemId : 'prioProductPopup',
									title : getLabel('accountName',
											'Account Name'),
									columnName : getLabel('accountName',
											'Account Name'),
									seekUrl : 'cpon/cponParameterisedDataList/prdPriorityList',
									filterVal : me.prdCountClicked
								});
						prioProductDetails.show();
						}
					} else if (td.className
							.match('x-grid-cell-col_packageCount')) {
						me.prdCountClicked = record.get('accountId');
						var popupTitleLbl ;
						if('02' == srvcCode)
						{
							popupTitleLbl = getLabel('packageName','Package Name');
						}
						if('05' == srvcCode)
						{
							popupTitleLbl = getLabel('collectionMethodName','Receivables Method Name');
						}
						
						var pkgDetails = null;
						var pkgDetails = Ext.create(
								'CPON.view.PkgAssignmentPopupView', {
									itemId : 'pkgAssignmentPopup',
									title : popupTitleLbl,
									packageId : me.prdCountClicked,
									id : record.get('identifier')
								});
						pkgDetails.show();
						deselectedArray = new Array();
					}else if (td.className.match('x-grid-cell-col_pkgCount') && me.selectedGrid == 'product') {
						me.prdCountClicked = record.get('productCode');
						
						var popupTitleLbl ;
						var strUpdatePrdUrl = null;
						if('02' == srvcCode)
						{
							popupTitleLbl = getLabel('packageName','Package Name');
							strUpdatePrdUrl = 'cpon/clientServiceSetup/productPackageList';

							var packCountDetails = Ext.create('CPON.view.DetailsProductPopup', {
										itemId : 'prodPackagePopup',
										title : popupTitleLbl,
										width : 450,
										//height : 300,
										columnName : popupTitleLbl,
										seekUrl : strUpdatePrdUrl,
										filterVal : me.prdCountClicked
									});
							packCountDetails.show(); 
						}
						if('05' == srvcCode)
						{
							popupTitleLbl = getLabel('collectionMethodName','Receivables Method Name');
							strUpdatePrdUrl = 'cpon/cponParameterisedDataList/updateCollProductList';

							var packCountDetails = Ext.create('CPON.view.DetailsPopup', {
										itemId : 'prodPackagePopup',
										title : popupTitleLbl,
										width : 450,
										//height : 300,
										columnName : popupTitleLbl,
										seekUrl : strUpdatePrdUrl,
										filterVal : me.prdCountClicked
									});
							packCountDetails.show(); 
						}
						
					} else if(td.className.match('x-grid-cell-col_companyId') && ("ACH" == record.get('productCatType') || "MIXED" == record.get('productCatType') || 
							(!Ext.isEmpty(record.get('customLayoutId')) && ("ACHIATLAYOUT" == record.get('customLayoutId') || "ACHLAYOUT" == record.get('customLayoutId'))))){
						me.prdCountClicked = record.get('packageId');
						var companyIdPopup = Ext.create('CPON.view.ClientCompanyAssignmentView',{
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
		var strUrl = '';
		if (me.selectedGrid==='product' && actionName === 'btnView') {
			if(srvcCode === '02') {
				strUrl = 'clientPaymentPackageProductLinkageView.form';
				me.submitForm(strUrl, record, rowIndex);
			} else {
				strUrl = 'clientCollectionPackageProductLinkageView.form';
				me.submitForm(strUrl, record, rowIndex);
			}
		}
		else if (me.selectedGrid==='product' && actionName === 'btnEdit') 
		{
			if(srvcCode === '02') {
				strUrl = 'clientPaymentPackageProductLinkageEdit.form';
				me.submitForm(strUrl, record, rowIndex);
			} else {
				strUrl = 'clientCollectionPackageProductLinkageEntry.form';
				me.submitForm(strUrl, record, rowIndex);
			}
		}
		else if(me.selectedGrid==='package' && actionName === 'btnView'){
			if(srvcCode=='02')
			{			
				me.submitForm('viewClientPaymentPackageLinkage.form', record, rowIndex);
			}
			if(srvcCode=='05')
			{			
				me.showEditCollectionPkgPopup('VIEW',rowIndex);
			}
		}
		else if(me.selectedGrid==='package' && actionName === 'btnEdit'){
			if(srvcCode=='02')
			{			
				me.editSubmitForm('editClientPaymentPackageLinkage.form', record, rowIndex);
			}
			if(srvcCode=='05')
			{
				me.showEditCollectionPkgPopup('EDIT',rowIndex);
			}
		}
		else if(me.selectedGrid==='priority' && actionName === 'btnEdit'){
			me.showAttachPriorityPopup('EDIT',rowIndex);
		}
		else if(me.selectedGrid==='priority' && actionName === 'btnView'){
			me.showAttachPriorityPopup('VIEW',rowIndex);
		}
	},
	
	editSubmitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var detailViewState = record.data.identifier;
		var updateFlag =  record.raw.updated;
		var updateIndex = rowIndex;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'updatedFlag', updateFlag));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'detailViewState',
				detailViewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				parentkey));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'moduleCode', srvcCode));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
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
					'moduleCode', srvcCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'MODE', document.getElementById('MODE').value));		
		form.appendChild(me.createFormField('INPUT','HIDDEN','productCode',record.get('productCode')));
		form.appendChild(me.createFormField('INPUT','HIDDEN','ccy',record.get('ccyCode')));
		form.appendChild(me.createFormField('INPUT','HIDDEN','adminFeatureProfileId',adminFeatureProfileId));
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
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition)
	{
		var me = this;
		var blnFlag = true;
		if (record.get('pkgCount') != null && itmId === 'btnEdit')
		{
				blnFlag = true;
		}
		if(itmId === 'btnEdit' && record.data.activeFlag == 'N')
			{
				blnFlag = false;
			}
		return blnFlag;
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
						} else {
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
				cfgCol.sortable = objCol.sort;
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
			strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
		} else if (colId === 'col_accountCount') {
				if (value != null && value > 0)
					strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
				else
					strRetValue = '<span class="underlined cursor_pointer">0</span>';
		} else if (colId === 'col_pkgCount') {
			var link;
			if('05'==srvcCode || '02'==srvcCode)
			{						
				if (value != null && value > 0)
				{
					strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
							+ '<span class="smallpadding_lr text_skyblue">..'
							+ getLabel('edit', 'Edit') + '</span>';
				}
				else
				{	
					strRetValue = '<span class="underlined">0</span>'
							+ '<span class="smallpadding_lr red">..'
							+ getLabel('select', 'Select') + '</span>';
				}
			}			
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
		
		if(record.raw.changeState === 3 && btnViewOld)
			strRetValue='<span class="newFieldGridValue">'+strRetValue+'</span>';
		else if(record.raw.changeState === 1 && btnViewOld)
			strRetValue='<span class="modifiedFieldValue">'+strRetValue+'</span>';
		else if(record.raw.changeState === 2 && btnViewOld)
			strRetValue='<span class="deletedFieldValue">'+strRetValue+'</span>';

		return strRetValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_productCount') {
			strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
		} else if (colId === 'col_accountCount' || colId === 'col_packageCount') {
			if(viewmode != 'VIEW'  && viewmode != "MODIFIEDVIEW" ){
			
				
				if (value != null && value > 0)
				{
					strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
					if (Ext.isEmpty(record.get('allowAllPayAcct')) || (!Ext.isEmpty(record.get('allowAllPayAcct')) && "N" == record.get('allowAllPayAcct'))) {
						strRetValue = strRetValue +  '<span class="smallpadding_lr text_skyblue cursor_pointer">..'
							+ getLabel('edit', 'Edit') + '</span>'; 						
					} else {
						strRetValue = strRetValue +  '<span class="smallpadding_lr cursor_pointer">..ALL</span>';
					}
				}
				else
				{
					if (!Ext.isEmpty(record.get('allowAllPayAcct')) && "N" == record.get('allowAllPayAcct'))
					{
						strRetValue = '<span class="underlined cursor_pointer">0</span>'
							+ '<span class="smallpadding_lr red cursor_pointer">..'
							+ getLabel('select', 'Select') + '</span>';
					}
					else if (!Ext.isEmpty(record.get('allowAllPayAcct')) && "Y" == record.get('allowAllPayAcct'))
					{
						strRetValue = '<span class="underlined cursor_pointer">0</span>'
							+ '<span>..'
							+ getLabel('select', 'Select') + '</span>';
					}
					else
					{
						strRetValue = '<span class="underlined cursor_pointer">0</span>'
							+ '<span class="smallpadding_lr red cursor_pointer">..'
							+ getLabel('select', 'Select') + '</span>';
					}
					
				}
			}
			else
			{
			if (value != null && value > 0)
				strRetValue = '<span class="underlined cursor_pointer">' + value + '</span>';
			else
				strRetValue = '<span class="underlined cursor_pointer">0</span>';
			strRetValue=strRetValue+ '<span class="smallpadding_lr text_skyblue cursor_pointer">..'
			+ getLabel('view', 'View') + '</span>';
			}
			
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
			if (!record.get('isEmpty') && !Ext.isEmpty(record.get('productCatType')) && ("ACH" == record.get('productCatType') || "MIXED" == record.get('productCatType') 
					|| (!Ext.isEmpty(record.get('customLayoutId')) && ("ACHIATLAYOUT" == record.get('customLayoutId') || "ACHLAYOUT" == record.get('customLayoutId')))))
			{
				if(viewmode != 'VIEW'  && viewmode != "MODIFIEDVIEW" ){
					if (value != null && value > 0)
						strRetValue = '<span class="underlined">' + value + '</span>'
								+ '<span class="smallpadding_lr text_skyblue cursor_pointer">..'
								+ getLabel('edit', 'Edit') + '</span>';
					else
						strRetValue = '<span class="underlined cursor_pointer">0</span>'
								+ '<span class="smallpadding_lr red cursor_pointer">..'
								+ getLabel('select', 'Select') + '</span>';
				}
				else
					{
					if (value != null && value > 0)
						strRetValue = '<span class="underlined">' + value + '</span>';
					else
						strRetValue = '<span class="underlined">0</span>';
					strRetValue= strRetValue + '<span class="smallpadding_lr text_skyblue cursor_pointer">..'
					+ getLabel('view', 'View') + '</span>';
					}
			}
		}
		else if(colId === 'col_useForDataEntry'){
			strRetValue = "Y" == record.get('useForDataEntry') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForTemplate'){
			strRetValue = "Y" == record.get('useForTemplate') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForSI'){
			strRetValue = "Y" == record.get('useForSI') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else if(colId === 'col_useForImport'){
			strRetValue = "Y" == record.get('useForImport') ? getLabel('yes', 'Yes') : getLabel('no', 'No');
		}
		else {
			strRetValue = value;
		}
		
		if(record.raw.changeState === 3 && btnViewOld)
			strRetValue='<span class="newFieldGridValue">'+strRetValue+'</span>';
		else if(record.raw.changeState === 1 && btnViewOld)
			strRetValue='<span class="modifiedFieldValue">'+strRetValue+'</span>';
		else if(record.raw.changeState === 2 && btnViewOld)
			strRetValue='<span class="deletedFieldValue">'+strRetValue+'</span>';

		return strRetValue;
	},
	getGridConfiguration : function() {
		var me = this;
				
				var strGridUrl = null;
				var strProductUrl = null; 
				var strAccountUrl = null;
				var strPrdPriorityLstUrl = null;
				if(srvcCode=='02')
				{
					strGridUrl = 'cpon/clientServiceSetup/paymentList.json';	
					strProductUrl = 'cpon/clientServiceSetup/productList.json';
					strAccountUrl = 'cpon/clientServiceSetup/payAccountList.json';
					strPrdPriorityLstUrl = 'cpon/clientServiceSetup/productPriorityList.json';
				}
				if(srvcCode=='05')
				{
					strGridUrl = 'cpon/clientServiceSetup/collectionList.json';
					strProductUrl = 'cpon/clientServiceSetup/collProductList.json';
					strAccountUrl = 'cpon/clientServiceSetup/collAccountList.json';
					strPrdPriorityLstUrl = 'cpon/clientServiceSetup/collProductPriorityList.json';
				}		

		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		var colhdr ;
		switch (me.selectedGrid) {
			case 'package' :
				if(brandingPkgType === 'N'){
					objWidthMap = {
					"packageName" : 180,
					"productCategoryDesc" : 190,
					//"productCategoryDesc" : 120,
					"productCount" : 100,
					//"accountCount" : 80,
					//"companyId" : 70,
					"useForDataEntry" : 100,
					"useForTemplate" : 100,
					"useForSI" : 150,
					"useForImport" : 90,
					"activeFlag" : 80
				};
				if('02' == srvcCode)
				colhdr = getLabel("paymentPkgName","Payment Package Name");
				if('05' == srvcCode)
				colhdr = getLabel("collectionMethodName","Receivables Method Name");
				if('02' == srvcCode){
						arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : colhdr,
							"sort" :true
						}, {
							"colId" : "productCategoryDesc",
							"colDesc" : getLabel("paymentType","Type"),
							"sort" :true
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "useForDataEntry",
							"colDesc" : getLabel("userForPayment","Use for Payment"),
							"sort" :false
						},  {
							"colId" : "useForTemplate",
							"colDesc" : getLabel("useForTemplate","Use for Template"),
							"sort" :false
						},  {
							"colId" : "useForImport",
							"colDesc" : getLabel("useForImport","Use for Import"),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];
					
				}
				if('05' == srvcCode)
				{				
						arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : colhdr,
							"sort" :true
						}, {
							"colId" : "productCategoryDesc",
							"colDesc" : getLabel("rcvType", "Type"),
							"sort" :true
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number",
							"sort" :false
						}/*, {
							"colId" : "accountCount",
							"colDesc" : getLabel("paymentaccounts","Accounts"),
							"colType" : "number",
							"sort" :false
						}*/, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];	
				}
					}
				else if(brandingPkgType === 'Y'){
					objWidthMap = {
					"packageName" : 180,
					"productCategoryDesc" : 190,
					"productCount" : 100,
					"useForDataEntry" : 100,
					"useForTemplate" : 100,
					"useForSI" : 150,
					"useForImport" : 90,
					"activeFlag" : 100
				};
				if('02' === srvcCode){
					colhdr = getLabel("paymentPkgName","Payment Package Name");
					arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : colhdr,
							"sort" :true
						}, {
							"colId" : "productCategoryDesc",
							"colDesc" : getLabel("paymentType","Type"),
							"sort" :true
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number",
							"sort" :false
						},  {
							"colId" : "useForDataEntry",
							"colDesc" : getLabel("useForPayment","Use for Payment"),
							"sort" :false
						},  {
							"colId" : "useForTemplate",
							"colDesc" : getLabel("useForTemplate","Use for Template"),
							"sort" :false
						},   {
							"colId" : "useForSI",
							"colDesc" : getLabel("useForSI","Use for Recurring Payment"),
							"sort" :false
						},  {
							"colId" : "useForImport",
							"colDesc" : getLabel("useForImport","Use for Import"),
							"sort" :false
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];
				}
				if('05' === srvcCode){
					colhdr = getLabel("collectionMethodName","Receivables Method Name");
					arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : colhdr,
							"sort" :true
						}, {
							"colId" : "productCategoryDesc",
							"colDesc" : getLabel("rcvType", "Type"),
							"sort" :true
						}, {
							"colId" : "productCount",
							"colDesc" : getLabel("paymentproducts","Products"),
							"colType" : "number",
							"sort" :false
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];}
				}
				storeModel = {
					fields : ['packageName', 'productCatType','productCategoryDesc', 'productCount','workflowProfileId','allowAllPayAcct',
							'accountCount', /*'reportProfileId',*/ 'packageId','crossCurrencyFlag',
							/*'alertProfileId',*/ 'activeFlag', 'identifier',
							'history','companyId','parentRecordKey','recordKeyNo','allowAllPayAcct','customLayoutId',
							'useForDataEntry', 'useForImport', 'useForTemplate', 'useForSI','enrichmentProfileId','mandateVerificaton','payerMandatory','registeredPayerOnly','pdc','pdcDiscounting'],
					proxyUrl : strGridUrl,
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;

			case 'product' :
			if(brandingPkgType === 'N'){
				
				var colhdrCnt =getLabel("payMethodCnt","Payment Package Count");
				var colhdrDeflt= getLabel("defMethodCnt","Default Payment Package");
				var colhdrType;
				var colhdrId;
				if('02' == srvcCode)
				{
					objWidthMap = {
							"productName" : 120,
							"ccyCode" : 120,
							"useSingleName" : 180,
							"productCategoryDesc" : 180,
							"pkgCount" : 160,
							"accountCount" : 100,
							"defaultRecPackage" : 160,
							"activeFlag" : 120,
							"packageName" : 160
						};
					
					colhdrCnt = getLabel("payMethodCnt","Payment Package Count");
					colhdrDeflt= getLabel("defMethodCnt","Default Payment Package");
					colhdrType = getLabel("paymentType","Type");
					colhdrId = "productCategoryDesc";
				}
				if('05' == srvcCode)
				{
					objWidthMap = {
							"productName" : 120,
							"ccyCode" : 120,
							"useSingleName" : 180,
							"productCatType" : 180,
							"pkgCount" : 160,
							"accountCount" : 100,
							"defaultRecPackage" : 160,
							"activeFlag" : 120
						};
					colhdrCnt = getLabel("collMethodCnt","Receivables Method Count");
					colhdrDeflt= getLabel("defCollMethodCnt","Default Receivables Method");
					colhdrType = getLabel("rcvType","Type");
					colhdrId = "productCatType"; 
				}
				
				arrColsPref = [{
							"colId" : "productName",
							"colDesc" : getLabel("productName","Product Name"),
							"sort" :true
						},{
							"colId" : "ccyCode",
							"colDesc" : getLabel("CCyCode","Currency"),
							"sort" :true
						}, {
							"colId" : colhdrId,
							"colDesc" : colhdrType,
							"sort" :true
						},{
							"colId" : "pkgCount",
							"colDesc" : colhdrCnt,
							"colType" : "number",
							"sort" :false
						},
						/*{
							"colId" : "useSingleName",
							"colDesc" : colhdrDeflt,
							"sort" :true
						},*/
						{
							"colId" : "packageName",
							"colDesc" : colhdrDeflt,
							"sort" :true
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];
				}
				else if(brandingPkgType === 'Y'){
				
				var colhdrCnt =getLabel("payMethodCnt","Payment Package Count");
				var colhdrDeflt= getLabel("defMethodCnt","Default Payment Package");
				var colhdrType;
				var colhdrId;
				if('02' == srvcCode)
				{
					objWidthMap = {
							"productName" : 120,
							"useSingleName" : 180,
							"productCategoryDesc" : 180,
							//"reportProfileId" : 120,
							//"alertProfileId" : 120,
							"activeFlag" : 100
						};
					colhdrCnt = getLabel("payMethodCnt","Payment Package Count");
					colhdrDeflt= getLabel("defMethodCnt","Default Payment Package");
					colhdrType = getLabel("paymentType","Type");
					colhdrId = "productCategoryDesc";
				}
				if('05' == srvcCode)
				{
					objWidthMap = {
							"productName" : 120,
							"useSingleName" : 180,
							"productCatType" : 180,
							//"reportProfileId" : 120,
							//"alertProfileId" : 120,
							"activeFlag" : 100
						};
					colhdrCnt = getLabel("collMethodCnt","Receivables Method Count");
					colhdrDeflt= getLabel("defCollMethodCnt","Default Receivables Method");
					colhdrType = getLabel("rcvType","Type");
					colhdrId = "productCatType"; 
				}
				arrColsPref = [{
							"colId" : "productName",
							"colDesc" : getLabel("productName","Product Name"),
							"sort" :true
						},{
							"colId" : "ccyCode",
							"colDesc" : getLabel("CCyCode","Currency"),
							"sort" :true
						}, {
							"colId" : colhdrId,
							"colDesc" : colhdrType,
							"sort" :true
						}, {
							"colId" : "packageName",
							"colDesc" : colhdrDeflt,
							"sort" :true
						}/*, {
							"colId" : "reportProfileId",
							"colDesc" : "Reports"
						}, {
							"colId" : "alertProfileId",
							"colDesc" : "Alerts"
						}*/, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];
				}
				if('02' == srvcCode)
				{
					storeModel = {
							fields : ['useSingleName', 'packageType', 'productName','pkgCount','creditLine','pdcDiscountLine',
									'accountCount', /*'reportProfileId',*/'productCode','productCategoryDesc',
									/*'alertProfileId',*/ 'activeFlag', 'identifier','packageId',
									'parentRecordKey','history', 'transferReceipt', 'cutoffProfileId','sameDayACHProd','packageName','ccyCode' ],
							proxyUrl : strProductUrl,
							rootNode : 'd.accounts',
							totalRowsNode : 'd.__count'
						};
				}
				if('05' == srvcCode)
				{
					storeModel = {
							fields : ['useSingleName', 'packageType', 'productName','pkgCount','creditLine','pdcDiscountLine',
									'accountCount', /*'reportProfileId',*/'productCode','productCatType',
									/*'alertProfileId',*/ 'activeFlag', 'identifier','packageId','ccyCode','packageName',
									'parentRecordKey','history', 'transferReceipt', 'cutoffProfileId' ],
							proxyUrl : strProductUrl,
							rootNode : 'd.accounts',
							totalRowsNode : 'd.__count'
						};
				}
				break;

			/*case 'account' :
				objWidthMap = {
					"acctName" : 250,
					"accountId" : 250,
					"ccyCode" : 100,
					"packageCount" : 150,
					"activeFlag" : 100
				};

				arrColsPref = [{
							"colId" : "acctName",
							"colDesc" : getLabel('accountName',	'Account Name'),
							"sort" :true
						}, {
							"colId" : "acctNmbr",
							"colDesc" : getLabel('accountNumber', 'Account'),
							"sort" :true
						}, {
							"colId" : "packageCount",
							"colDesc" : pmntMethodLbl,
							"colType" : "number",
							"sort" :true

						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];

				storeModel = {
					fields : ['acctName', 'packageCount', 'activeFlag','acctNmbr','ccyCode','accountId',
							'identifier'],
					proxyUrl : strAccountUrl,
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
				};
				break;*/
			
			case 'priority' :
				objWidthMap = {
					"order" : 120,
					"productName" : 100,
					"arrangementCode" : 100,
					"ruleDesc" : 120,
					"rulePriority" : 120,
					"reportProfileId" : 120,
					"activeFlag" : 100
				};

				arrColsPref = [ {
							"colId" : "productName",
							"colDesc" : getLabel("productName","Product Name"),
							"sort" :true
						},{
							"colId" : "arrangementCode",
							"colDesc" : getLabel("arrangement","Arrangement"),
							"sort" :true
						}, {
							"colId" : "ruleDesc",
							"colDesc" : getLabel("rule","Rule"),
							"sort" :true
						}, {
							"colId" : "rulePriority",
							"colDesc" : getLabel("rulePriority","Rule Priority"),
								"sort" :true
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("lblgridStatus","Status"),
							"sort" :false
						}];

				storeModel = {
					fields : ['ruleDesc','productName','productCode','arrangementCode', 
					          'activeFlag','rulePriority','identifier','reportProfileId',
							'alertProfileId', 'history','arrangementProfileId','ruleCode'],
					proxyUrl : strPrdPriorityLstUrl,
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
		
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW") {
			grid.getSelectionModel().setLocked(true);
		}
		grid.loadGridData(strUrl,me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		clientGridLoaded=true;
		enableDisableGridButtons(false);
	},
	showAttachPackagePopup : function() {
		attachPkgPopup = Ext.create('CPON.view.AttachPackagePopup', {
					itemId : 'attachPkgPopup'
				});
		(attachPkgPopup).show();
	},
	showEditCollectionPkgPopup : function(docmode,rowIndex) {
		var me = this;
		var grid = me.getPaymentGrid();
		var popupDiffmap = null;
		var id = null;
		if('ADD'===docmode){
			attachrulePriorityPopup = Ext.create('CPON.view.EditCollectionPkgPopup', {
				itemId : 'editCollectionPkgPopup',mode : docmode
		});
		}
		else if('EDIT'===docmode)
		{
			var record = grid.getStore().getAt(rowIndex);
			var packageid=record.data.packageId;
			Ext.Ajax.request({
				url : 'cpon/clientServiceSetup/getPdc.json',
				method : 'POST',
				async : false,
				params : {
					'packageid' : packageid
				},
				success : function(response) {
					var data = response.responseText;
					productPdcFlag = data.split('|')[0];
					productPdcDiscountFlag = data.split('|')[1];
				},
				failure : function(response) {
					// console.log("Ajax Get data Call Failed");
				}

			});
			id = record.data.identifier;
			attachrulePriorityPopup = Ext.create('CPON.view.EditCollectionPkgPopup', {
				itemId : 'editCollectionPkgPopup',mode : docmode, identifier : id,productValue: record.data.productCode, ruleValue : record.data.ruleCode
			});		
			this.getCollPkgNameCombo().setValue(record.data.packageName);
			this.getCollPayWokflowCombo().setValue(record.data.workflowProfileId);
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0  || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 )
				{
				this.getUseFor().setVisible(false);
				}
			else
				{
				this.getUseFor().setVisible(true);
				}
			/*if(record.data.productCatType.toLowerCase().indexOf('preliq') == -1) {
				this.getCollPayWokflowCombo().setDisabled(true);
			}*/
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 ) {
				this.getCollPayWokflowCombo().setVisible(false);
			}
			else
				this.getCollPayWokflowCombo().setVisible(true);
			
			this.getDefaultEnrichmentCombo().setValue(record.data.enrichmentProfileId);
			this.getCollUseForValue().setText(record.data.productCatType);
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0  || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 )
			{
				this.getCollUseForValue().setVisible(false);
			}
			else
			{
				this.getCollUseForValue().setVisible(true);
			}
			this.getDefaultEnrichmentCombo().setVisible(false);
			var mandate = Ext.getCmp('mandateVerification');
			if(mandate) {
				mandate.value = true ? record.data.mandateVerificaton == 'Y' : false;
				mandate.checked = mandate.value;
				mandate.setValue(mandate.value);
				if(record.data.productCatType.toLowerCase().indexOf('debit') == -1) {
					mandate.setDisabled(true);
					mandate.setVisible(false);
				}else if(record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') != -1 ){
					mandate.setDisabled(true);
				}
			}
			var payerMandatory = Ext.getCmp('payerMandatory');
			if(payerMandatory) {
				payerMandatory.value = true ? record.data.payerMandatory == 'Y' : false;
				payerMandatory.setValue(payerMandatory.value);
				payerMandatory.checked = payerMandatory.value;
				
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 ) {
					payerMandatory.setVisible(false);
				}
				else
				{
					payerMandatory.setVisible(true);
				}
				if(record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') == 0 || record.data.productCatType.toLowerCase().indexOf('directdebit') == 0 ) {
					payerMandatory.setDisabled(true);
				}
				else
				{
					payerMandatory.setDisabled(false);
				}
			}
			var registeredPayerOnly = Ext.getCmp('registeredPayerOnly');
			if(registeredPayerOnly) {
				registeredPayerOnly.value = true ? record.data.registeredPayerOnly == 'Y' : false;
				registeredPayerOnly.setValue(registeredPayerOnly.value);
				registeredPayerOnly.checked = registeredPayerOnly.value;
				if(record.data.productCatType.toLowerCase().indexOf('checks') == -1) {
					registeredPayerOnly.setDisabled(true);
				} else
					registeredPayerOnly.setDisabled(false);
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0) {
					registeredPayerOnly.setVisible(false);
				}
			}
			var pdc = Ext.getCmp('pdc');
			if(pdc) {
				pdc.value = true ? record.data.pdc == 'Y' : false;
				pdc.setValue(pdc.value);
				pdc.checked = pdc.value;
				if(record.data.productCatType.toLowerCase().indexOf('checks') != -1 && selectedEntryFeatures.indexOf('FCOL-000001') != -1) {
					pdc.setDisabled(false);
				} else {
					pdc.setDisabled(true);
				}
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 || record.data.productCatType.toLowerCase().indexOf('directdebit') == 0 || record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') == 0) {
					pdc.setVisible(false);
				}
				if(productPdcFlag == "Y")
				{
				pdc.setDisabled(false);
				}
			else
				pdc.setDisabled(true);
			}
			var pdcDiscounting = Ext.getCmp('pdcDiscounting');
			if(pdcDiscounting) {
				pdcDiscounting.value = true ? record.data.pdcDiscounting == 'Y' : false;
				pdcDiscounting.setValue(pdcDiscounting.value);
				pdcDiscounting.checked = pdcDiscounting.value;
				if(record.data.productCatType.toLowerCase().indexOf('checks') != -1 && selectedEntryFeatures.indexOf('FCOL-000001') != -1) {
					pdcDiscounting.setDisabled(false);
				} else {
					pdcDiscounting.setDisabled(true);
				}
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 || record.data.productCatType.toLowerCase().indexOf('directdebit') == 0 || record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') == 0) {
					pdcDiscounting.setVisible(false);
				}
				if(pdc) {
					pdc.value = true ? record.data.pdc == 'Y' : false;
					if(pdc.value== true && productPdcDiscountFlag == "Y")
					{
						pdcDiscounting.setDisabled(false);
					}
				else
					pdcDiscounting.setDisabled(true);
				}
			}
			/*if(record.data.allowAllPayAcct=='Y')
			{
				this.getCollPkgAssignAcc().setValue(true);
			}
			else
			{
				this.getCollPkgAssignAcc().setValue(false);
			}*/
		}
		else if('VIEW'===docmode)
		{
			attachrulePriorityPopup = Ext.create('CPON.view.EditCollectionPkgPopup', {
				itemId : 'editCollectionPkgPopup',mode : docmode
			});
			var record = grid.getStore().getAt(rowIndex);
			this.getCollPkgNameCombo().setValue(record.data.packageName);
			this.getCollPkgNameCombo().setReadOnly(true);
			this.getCollPayWokflowCombo().setValue(record.data.workflowProfileId);			
			this.getCollPayWokflowCombo().setDisabled(true);
			this.getDefaultEnrichmentCombo().setValue(record.data.enrichmentProfileId);			
			this.getDefaultEnrichmentCombo().setDisabled(true);
			this.getDefaultEnrichmentCombo().setVisible(false);
			this.getCollUseForValue().setText(record.data.productCatType);
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0  || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 )
			{
			  this.getCollUseForValue().setVisible(false);
			}
			else
			{
			  this.getCollUseForValue().setVisible(true);
			}
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 )
			{
			this.getUseFor().setVisible(false);
			}
		else
			{
			this.getUseFor().setVisible(true);
			}
			if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 ) {
				this.getCollPayWokflowCombo().setVisible(false);
			}
			else
				this.getCollPayWokflowCombo().setVisible(true);
			var mandate = Ext.getCmp('mandateVerification');
			if(mandate) {
				mandate.value = true ? record.data.mandateVerificaton == 'Y' : false;
				mandate.checked = mandate.value;
				mandate.setValue(mandate.value);
				mandate.setDisabled(true);
				if(record.data.productCatType.toLowerCase().indexOf('debit') == -1) {
					mandate.setVisible(false);
				}
				else
					mandate.setVisible(true);
			}
			var payerMandatory = Ext.getCmp('payerMandatory');
			if(payerMandatory) {
				payerMandatory.value = true ? record.data.payerMandatory == 'Y' : false;
				payerMandatory.setValue(payerMandatory.value);
				payerMandatory.checked = payerMandatory.value;
				payerMandatory.setDisabled(true);
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0) {
					payerMandatory.setVisible(false);
				}
				else
				{
					payerMandatory.setVisible(true);
				}
			}
			var registeredPayerOnly = Ext.getCmp('registeredPayerOnly');
			if(registeredPayerOnly) {
				registeredPayerOnly.value = true ? record.data.registeredPayerOnly == 'Y' : false;
				registeredPayerOnly.setValue(registeredPayerOnly.value);
				registeredPayerOnly.checked = registeredPayerOnly.value;
				registeredPayerOnly.setDisabled(true);
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0) {
					registeredPayerOnly.setVisible(false);
				}
				else
					registeredPayerOnly.setVisible(true);
			}
			var pdc = Ext.getCmp('pdc');
			if(pdc) {
				pdc.value = true ? record.data.pdc == 'Y' : false;
				pdc.setValue(pdc.value);
				pdc.checked = pdc.value;
				pdc.setDisabled(true);
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 || record.data.productCatType.toLowerCase().indexOf('directdebit') == 0 || record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') == 0 ) {
					pdc.setVisible(false);
				}
				else
					pdc.setVisible(true);
			}
			var pdcDiscounting = Ext.getCmp('pdcDiscounting');
			if(pdcDiscounting) {
				pdcDiscounting.value = true ? record.data.pdcDiscounting == 'Y' : false;
				pdcDiscounting.setValue(pdcDiscounting.value);
				pdcDiscounting.checked = pdcDiscounting.value;
				pdcDiscounting.setDisabled(true);
				if(record.data.productCatType.toLowerCase().indexOf('preliq') == 0 || record.data.productCatType.toLowerCase().indexOf('cashcoll') == 0 || record.data.productCatType.toLowerCase().indexOf('directdebit') == 0 || record.data.productCatType.toLowerCase().indexOf('sepadirectdebit') == 0) {
					pdcDiscounting.setVisible(false);
				}
				else
					pdcDiscounting.setVisible(true);
			}
			/*if(record.data.allowAllPayAcct=='Y')
			{
				this.getCollPkgAssignAcc().setValue(true);
			}
			else
			{
				this.getCollPkgAssignAcc().setValue(false);
			}		*/
			if(btnViewOld)
			{
				Ext.Ajax.request({
					url : 'cpon/clientServiceSetup/collectionDiffInList.json?id='+ encodeURIComponent(parentkey)+'&$filter=record_key_no eq '+"'"
					+record.data.recordKeyNo+"'",
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						popupDiffmap = data;
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
			}
		}
		(attachrulePriorityPopup).show();		
		if(btnViewOld && !Ext.isEmpty(popupDiffmap) && !Ext.isEmpty(popupDiffmap.stdoldNewValueList))
		{
			if (!Ext.isEmpty(popupDiffmap.stdoldNewValueList.newList)) {
				if(popupDiffmap.stdoldNewValueList.newList.payerMandatory == "Y")
					$('#colPayerMandatory').addClass("newFieldGridValue");
				if(popupDiffmap.stdoldNewValueList.newList.pdcDiscounting == "Y")
					$('#colPdcDiscounting').addClass("newFieldGridValue");
				if(popupDiffmap.stdoldNewValueList.newList.pdc == "Y")
					$('#colpdc').addClass("newFieldGridValue");
				if(popupDiffmap.stdoldNewValueList.newList.registeredPayerOnly == "Y")
					$('#colRegisteredPayerOnly').addClass("newFieldGridValue");
			}
			if (!Ext.isEmpty(popupDiffmap.stdoldNewValueList.deletedList)) {
				if(popupDiffmap.stdoldNewValueList.deletedList.payerMandatory == "Y")
					$('#colPayerMandatory').addClass("deletedFieldValue");
				if(popupDiffmap.stdoldNewValueList.deletedList.pdcDiscounting == "Y")
					$('#colPdcDiscounting').addClass("deletedFieldValue");
				if(popupDiffmap.stdoldNewValueList.deletedList.pdc == "Y")
					$('#colpdc').addClass("deletedFieldValue");
				if(popupDiffmap.stdoldNewValueList.deletedList.registeredPayerOnly == "Y")
					$('#colRegisteredPayerOnly').addClass("deletedFieldValue");
			}
			if (!Ext.isEmpty(popupDiffmap.stdoldNewValueList.oldValuesList)) {
				if(record.data.workflowProfileId != popupDiffmap.stdoldNewValueList.oldValuesList.workflowProfileId){
					var fieldVal = getDescriptionForCode('workflowProfileId', popupDiffmap.stdoldNewValueList.oldValuesList.workflowProfileId);
					$('#defaultProductCombo').append(getElementDiv('workflowProfileId', fieldVal, 'modifiedFieldValue'));
				}
			}				
		}
	},
	showAttachPriorityPopup : function(docmode,rowIndex) {
		var me = this;
		var grid = me.getPaymentGrid();
		var id = null;
		var strProdPriorityUrl = null;
		if('02' == srvcCode)
		{
			strProdPriorityUrl = 'cpon/clientPayment/productPriorityValue.json';
		}
		if('05' == srvcCode)
		{
			strProdPriorityUrl = 'cpon/clientCollection/productPriorityValue.json';
		}
		
		if('ADD'===docmode){
			attachrulePriorityPopup = Ext.create('CPON.view.AttachRulePriorityPopup', {
				itemId : 'attachrulePriorityPopup',mode : docmode
			});
		Ext.Ajax.request({
			
					url : strProdPriorityUrl,
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
		attachrulePriorityPopup = Ext.create('CPON.view.AttachRulePriorityPopup', {
			itemId : 'attachrulePriorityPopup',mode : docmode, identifier : id,productValue: record.data.productCode, ruleValue : record.data.ruleCode
		});
			
			this.getProductCombo().setValue(record.data.productCode);
			this.getRuleField().setValue(record.data.ruleCode);
			var popUp = CPON.getApplication().controllers.items[0].getAttachRulePriorityPopup();
			popUp.ruleValue =  record.data.ruleCode;
			popUp.productValue = record.data.productCode;
			popUp.arrangementValue = record.data.arrangementProfileId;
			this.getProductCombo().fireEvent('select',this.getProductCombo());
			this.getArrangementField().setValue(record.data.arrangementProfileId);
			this.getPriorityField().setValue(record.data.rulePriority);
		}
		else if('VIEW'===docmode)
		{
			attachrulePriorityPopup = Ext.create('CPON.view.AttachRulePriorityPopup', {
				itemId : 'attachrulePriorityPopup',mode : docmode
			});
			var record = grid.getStore().getAt(rowIndex);
			this.getProductCombo().setValue(record.data.productCode);
			this.getProductCombo().setDisabled(true);
			this.getRuleField().setValue(record.data.ruleDesc);
			this.getRuleField().setDisabled(true);
			var popUp = CPON.getApplication().controllers.items[0].getAttachRulePriorityPopup();
			popUp.ruleValue =  record.data.ruleDesc;
			popUp.productValue = record.data.productCode;
			//popUp.oldRuleValue =  record.data.ruleDesc;
			//popUp.oldProductValue = record.data.productCode;
			
			popUp.docMode = 'VIEW';
			popUp.title = getLabel('viewRulePriority','View Rule');
			popUp.arrangementValue = record.data.arrangementProfileId;
			this.getProductCombo().fireEvent('select',this.getProductCombo());
			this.getArrangementField().setValue(record.data.arrangementProfileId);
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
        $.blockUI();
		var me = this;
		var strAddUrl = null;
		me.getAttachPackagePopup().close();
		if(srvcCode=='02')
		{
			strAddUrl = 'cpon/clientPayment/addPackage';
		}
		if(srvcCode=='05')
		{
			strAddUrl= 'cpon/clientCollection/addPackage';
		}		
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
					url : strAddUrl,
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
                        $.unblockUI();
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
						var payGrid = me.getPaymentGrid();
						payGrid.refreshData();
						
						payGrid.getStore().on('load', function() {
						var items= payGrid.getStore().data.items;
						for(i=0;i<items.length;i++)
						{
						var ccyFlag = items[i].data["crossCurrencyFlag"];
						if(ccyFlag =='Y')
						{
						$('#chkImg_MLTC').attr('src', 'static/images/icons/icon_checked_grey.gif');
						$('#chkService_MLTC').attr('disabled', 'disabled');
						$('#chkService_MLTC').removeAttr('onclick');	
						break;
						}						
						}})
						
					},
					failure : function() {
                        $.unblockUI();
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
		var strAddProdPriorityRuleUrl = null;
		if('02' == srvcCode)
		{
			strAddProdPriorityRuleUrl = 'cpon/clientPayment/addRulePriority';
		}
		if('05' == srvcCode)
		{
			strAddProdPriorityRuleUrl = 'cpon/clientCollection/addRulePriority';
		}
		var arrangement = this.getArrangementField().getValue();
		var arrangementCode;
		Ext.each(this.getArrangementField().getStore().data.items, function(item){
			if (item.data.profileId === arrangement) {
				arrangementCode = item.data.value;
			}
		});
		arrayJson.push({
						serialNo : 0,
						identifier : identifier,
						userMessage : null,
						productCode : this.getProductCombo().getValue(),
						ruleCode : this.getRuleField().getValue(),
						arrangementCode : arrangementCode,
						arrangementProfileId : arrangement,
						priority : this.getPriorityField().getValue()
					});
		
		Ext.Ajax.request({
					url : strAddProdPriorityRuleUrl,
					method : 'POST',
					params:{id:encodeURIComponent(parentkey)},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getAttachRulePriorityPopup().close();
						var payGrid = me.getPaymentGrid();
						payGrid.refreshData();
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
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	updateCollectionPkg : function(identifier) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
		var strAllAccAssignFlag = 'N';
		/*if(true==this.getCollPkgAssignAcc().getValue())
		{
			strAllAccAssignFlag = 'Y';
		}
		else
		{
			strAllAccAssignFlag = 'N';
		}*/
		var mandate = Ext.getCmp('mandateVerification'),mandateValue = null;
		if(mandate)
			mandateValue = mandate.value  == true ? 'Y' : 'N';
		var payerMandatory = Ext.getCmp('payerMandatory'),payerMandatoryValue = null;
		if(payerMandatory)
			payerMandatoryValue = payerMandatory.value == true ? 'Y' : 'N';
		var registeredPayerOnly = Ext.getCmp('registeredPayerOnly'),registeredPayerOnlyValue = null;
		if(registeredPayerOnly)
			registeredPayerOnlyValue = registeredPayerOnly.value == true ? 'Y' : 'N';
		var pdc = Ext.getCmp('pdc'),pdcValue = null;
		if(pdc)
			pdcValue = pdc.value == true ? 'Y' : 'N';
		var pdcDiscounting = Ext.getCmp('pdcDiscounting'),pdcDiscountingValue = null;
		if(pdcDiscounting)
			pdcDiscountingValue = pdcDiscounting.value == true ? 'Y' : 'N';
		arrayJson.push({
						serialNo : 0,
						identifier : identifier,
						packageName : this.getCollPkgNameCombo().getValue(),
						workflowProfileId : this.getCollPayWokflowCombo().getValue(),
						enrichmentProfileId :this.getDefaultEnrichmentCombo().getValue(), 
						allowAllPayAcct : strAllAccAssignFlag,
						productCatType : this.getCollUseForValue().text,
						mandateVerificationFlag : mandateValue,
						payerMandatoryFlag : payerMandatoryValue,
						registeredPayerOnlyFlag : registeredPayerOnlyValue,
						pdcFlag : pdcValue,
						pdcDiscountFlag : pdcDiscountingValue
					});
		
		Ext.Ajax.request({
					url : 'cpon/clientCollection/updateCollectionPkg?id='+ encodeURIComponent(parentkey),
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getEditCollectionPkgPopup().close();
						var payGrid = me.getPaymentGrid();
						payGrid.refreshData();
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
	assignAccounts : function(records,id,removeRecords) {
		var me = this;
		var strAssignAccUrl = null;
		if(srvcCode=='02')
		{
			strAssignAccUrl = 'cpon/clientPayment/addPkgAccountLinkage';
		}
		if(srvcCode=='05')
		{
			strAssignAccUrl = 'cpon/clientCollection/addCollPkgAccountLinkage';
		}		
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
					url : strAssignAccUrl,
					method : 'POST',
					params : {'id': parentkey,'removeRecords':removeRecords},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getAccAssignmentPopupView().close();
						var payGrid = me.getPaymentGrid();
						//payGrid.refreshData();
						//payGrid.loadGridData();
						/* FTUSCASH-2459 */
						var oldPageNum = payGrid.store.currentPage;
						var current = payGrid.store.currentPage;;
						payGrid.store.currentPage = current;
						payGrid.fireEvent('pagechange', payGrid, current, oldPageNum);
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
	assignPackages : function(records,deSelected,id) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getPaymentGrid();
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo :1,
						identifier : id,
						userMessage : records[index].data.packageId
					});
		}
		for (var index = 0; index < deSelected.length; index++) {
			arrayJson.push({
						serialNo :0,
						identifier : id,
						userMessage : deSelected[index].data.packageId
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
		var strAccUrl = null;
		if(srvcCode=='02')
		{
			strAccUrl = 'cpon/clientPayment/addAccPackageLinkage';	
		}
		if(srvcCode=='05')
		{
			strAccUrl = 'cpon/clientCollection/addAccPackageLinkage';
		}		
		Ext.Ajax.request({
					url : strAccUrl,
					method : 'POST',
					params : {'id': parentkey},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.getPkgAssignmentPopupView().close();
						var payGrid = me.getPaymentGrid();
						payGrid.refreshData();
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
								me.getClientCompanyAssignmentView().close();
								var payGrid = me.getPaymentGrid();
								//payGrid.loadGridData();
								/* FTUSCASH-2459 */
								var oldPageNum = payGrid.store.currentPage;
								var current = payGrid.store.currentPage;;
								payGrid.store.currentPage = current;
								payGrid.fireEvent('pagechange', payGrid, current, oldPageNum);
								/* END FTUSCASH-2459 */
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
	/*handleSaveCompanyIDBtn : function() { 
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
					//Ext.Msg.alert('Error','Account ID and Company Name can not be Empty.');
						Ext.MessageBox.show({
	           			title:'Error',
	           			msg: 'Account ID and Company Name can not be Empty.',
	           			buttons : Ext.MessageBox.OK,
	           			cls : 'ux_popup'
     				 });
				}		
		}
	},*/
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
    },
	deleteCompanyId : function(grid, rowIndex) {
		var record = grid.getStore().getAt(rowIndex);
		var records =  {
			recordKeyNo : record.data.recordKeyNo,
			companyId : record.data.companyId
		};				
		var jsonData = { 
			identifier : parentkey,
			userMessage : records	
		}; 
		Ext.Ajax.request({
			url: 'cpon/clientPayment/deleteClientCompany',
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
					if('' != errorMessage && null != errorMessage) {
						Ext.MessageBox.show({
		           			title:'Error',
		           			msg: errorMessage,
		           			buttons : Ext.MessageBox.OK,
		           			icon : Ext.MessageBox.ERROR,
		           			cls : 'ux_popup'
	     				 });
					}
					//Ext.Msg.alert("Error",errorMessage);
				}
				else
				{
					var store = grid.getStore();
					store.remove(record);					
				}	
			},
			failure: function() {
			}
		});
	},
	    refreshGrid: function()
		{
			        var me = this;
					var paymentsGrid = me.getPaymentGrid();
					me.handleGridHeader();
				    paymentsGrid.refreshData();
		},
		getModifiedModules:function(oldNew)
		{
			if(oldNew)
					{

						if(PAYPRODMODIFIED == "true")
						$('#product').addClass("modifiedFieldValue");
						if(PAYPRIOMODIFIED == "true")
						$('#prodPriority').addClass("modifiedFieldValue");
						if(PAYPKGMODIFIED == "true")
					    $('#payPkg').addClass("modifiedFieldValue");
					}
		}
});