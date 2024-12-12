var pmntMethodLbl;
var selectedCompanies = new Array();
var attachLbl;
Ext.define('CPON.controller.ClientPayAccountServiceController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['CPON.view.ViewCompanyIDTabGrid',
			'CPON.view.CompanyIDPopup',
			'CPON.view.PayCompanyIDPopup',
			'CPON.view.PkgAssignmentPopupView'],
					refs : [
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
								ref : 'clientCompanyAssignmentView',
								selector : 'clientCompanyAssignmentView'
							},
							{
								ref : 'companyGridRef',
								selector : 'payCompanyIdPopup clientCompanyAssignmentView grid[itemId="companygridItemId"]'
							},
							{
								ref : 'tabPanelSaveBtn',
								selector : 'payCompanyIdPopup button[itemId="savebtn"]'
							},
							{
								ref : 'tabPanelSubmitBtn',
								selector : 'payCompanyIdPopup button[itemId="submitbtn"]'
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
								ref : 'pkgAssignmentPopupView',
								selector : 'pkgAssignmentPopupView'
							},
							{
								ref : 'payCompanyIdPopup',
								selector : 'payCompanyIdPopup'
							}
							
                        ],
	config : {
		selectedGrid : 'package',
		prdCountClicked : '',
		parentRecordKey : ''
	},
	init : function() {
		var me = this;
		
		CPON.getApplication().on({
    });
		me.control({
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
						me.getCompanyIdTabPanel().remove(me.getCompanyIdTabPanel().items.getAt(2));
						me.getTabPanelSaveBtn().hide(true);
						me.getTabPanelSubmitBtn().hide(true);
						/*TODO - Need to remove class used to shift button*/
						me.getTabPanelCloseBtn().addCls('company-id-xbtn-left-view');
						me.getTabPanelCloseBtn().addCls('ft-button-primary-paddingBsmall');
						//me.getCompanyIdButton().hide();				
					}
					if(viewmode === 'EDIT' && me.getCompanyIdTabPanel().activeTab.title==getLabel('viewcompanyid','View Company ID')){
					me.getTabPanelCloseBtn().addCls('company-id-xbtn-left-view');
					me.getTabPanelCloseBtn().addCls('ft-button-primary-paddingBsmall');
					}
				},
				handleSaveCompanyID:function(btn,e,opts){
					me.handleSaveCompanyID(btn, e, opts);
				},
				assignCompany:function(btn,e,opts)
				{
					me.assignCompany(selectedCompanies);
				}
				
			}, 
			'companyIdPopup tabpanel[itemId="vcompanyIDTabPanel"]' : {
				tabchange : function(tabPanel, newCard, oldCard, eOpts){
					me.handleTabChange(tabPanel, newCard, oldCard, eOpts);
				}
			},
			'viewCompanyIDTabGrid' : {
				deleteCompanyId : me.deleteCompanyId
			},
			'pkgAssignmentPopupView button[itemId="btnSubmitPackage"]' : {
				assignPackages : function(records,deselected,id, strModuleCode) {
					me.assignPackages(records,deselected,id,strModuleCode);
				}
			}
		});
	},
	handleSaveCompanyID: function(btn, e, eOpts){
		var me = this;
		var id = me.getCompIdTextField().getValue();
		var name = me.getCompNameTextField().getValue();
		
		me.getCompIdTextField().setValue(null);
		me.getCompNameTextField().setValue(null);
		if(id && name){
			var records =  {
								companyId : id,
								companyName : name,
								accountId : $("#accountId").val(),
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
							
							me.getCompanyIdTabPanel().setActiveTab(1);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
							
							
					        $('#chkAllCompanySelectedFlag').attr("onclick","toggleCheckUncheck(this,'allCompanySelectedFlag');");
					        
							
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
			}else if(btn.getText().indexOf('Update') > -1)
			{
				Ext.Ajax.request({
						url: 'cpon/clientPayment/updateClientCompany',
						method: 'POST',
						
						jsonData: jsonData,
						success: function(response) {
							me.getCompanyIdTabPanel().setActiveTab(1);
							var grid = me.getCompanyIdTabPanel().down('viewCompanyIDTabGrid');
							grid.getStore().reload();
							
							
					        $('#chkAllCompanySelectedFlag').attr("onclick","toggleCheckUncheck(this,'allCompanySelectedFlag');");
					        
							
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
		me.getCompNameTextField().setReadOnly(false);
		me.getCompIdTextField().setReadOnly(false);
		if(newCard.itemId === 'gridTab'){
			me.getTabPanelSaveBtn().hide(true);
			me.getTabPanelSaveBtn().setText('Save');
			me.getTabPanelSubmitBtn().hide(true);
		}
		else if(newCard.itemId === 'assigntab')
		{
			var grid = me.getCompanyGridRef();
			me.getTabPanelSaveBtn().hide(true);
			me.getTabPanelSaveBtn().setText('Save');
			me.getTabPanelSubmitBtn().show(true);
			grid.refreshData();
		}
		else{
			me.getTabPanelSaveBtn().show(true);
			me.getTabPanelSubmitBtn().hide(true);
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
	assignCompany : function(records) {
		var me = this;
		var arrayJson = new Array();
		var grid = me.getCompanyGridRef();

		for ( var index = 0; index < records.length; index++) {
			arrayJson.push({
				serialNo : grid.getStore().indexOf(records[index]) + 1,
				identifier : detailkey,
				userMessage : getStringWithSpecialChars(records[index].data.companyId)
			});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
				return valA.serialNo - valB.serialNo
			});
		if (records.length == 0) {
			arrayJson.push({
				serialNo : 1,
				identifier : detailkey,
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
					console.log('Error Log :'+errorMessage);
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
				me.getPayCompanyIdPopup().close();
				selectedCompanies = [];
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
	deleteCompanyId : function(grid, rowIndex) {
		var record = grid.getStore().getAt(rowIndex);
		var records =  {
			recordKeyNo : record.data.recordKeyNo
		};				
		var jsonData = { 
			identifier : parentkey,
			userMessage : records	
		}; 
		Ext.Ajax.request({
			url: 'cpon/clientPayment/deleteClientCompany',
			method: 'POST',			
			jsonData: jsonData,
			success: function() {
				var store = grid.getStore();
				store.remove(record);
			},
			failure: function() {
			}
		});
	},
	assignPackages : function(records,deSelected,id,strModuleCode) {
		var me = this;
		var arrayJson = new Array();
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo :1,
						identifier : detailkey,
						userMessage : records[index].data.packageId
					});
		}
		for (var index = 0; index < deSelected.length; index++) {
			arrayJson.push({
						serialNo :0,
						identifier : detailkey,
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
				identifier : detailkey,
				userMessage : null
			});
		}
		var strAccUrl = null;
		if(strModuleCode=='02')
		{
			strAccUrl = 'cpon/clientPayment/addAccPackageLinkage';	
		}
		if(strModuleCode=='05')
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

	}
});