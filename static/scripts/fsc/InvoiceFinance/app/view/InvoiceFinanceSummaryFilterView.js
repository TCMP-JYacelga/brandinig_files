Ext.define("GCP.view.InvoiceFinanceSummaryFilterView",{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'pOSummaryFilterView',
	layout:'vbox',
	initComponent : function() {
		var me=this, strUrl='';
		
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							if (count > 1) {
								clientStore.add({
											'CODE' : 'all',
											'DESCR' : 'All Companies'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
				
		me.items = [{
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
			xtype : 'container',
			layout : 'vbox',
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'sellerOrBuyerr',
						text : getLabel('sellerOrBuyerr', 'View as')
					}, {
						xtype : 'combo',
						displayField : 'desc',
						valueField : 'code',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'sellerOrBuyerrCombo',
						mode : 'local',
						emptyText : getLabel('sellerOrBuyerrCombo', 'Select Buyer / Seller'),
						store : me.getSellerBuyerStore(),
						listeners : {
							'select' : function(combo, record) {
								changeBuyerOrSellerAndRefreshGrid(combo.getValue(), combo.getRawValue());
								var objJson = {"loggedInAs" : combo.getValue(), "client" : selectedFilterClient, "clientDesc" :selectedFilterClientDesc};
								var strUrl = 'services/userpreferences/invoiceFinanceCenter/screenFilters.json';
										Ext.Ajax.request({
											url : Ext.String.format(strUrl),
											method : 'POST',
											jsonData : objJson,
											async : false,
											success : function(response) {
												//me.updateSavedFilterComboInQuickFilter();
												//me.resetAllFields();
											},
											failure : function() {
												// console.log("Error Occured - Addition
												// Failed");

											}

										});
							},
							boxready : function(combo, width, height, eOpts) {
								if(selectedFilterLoggerDesc === "BUYER")
									combo.setValue(combo.getStore().getAt(1));
								else
									combo.setValue(combo.getStore().getAt(0));
								
							}
						}
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
						xtype : 'combo',
						displayField : 'DESCR',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'clientCombo',
						mode : 'local',
						emptyText : getLabel('selectCompany', 'Select Company Name'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
								/*var objJson = {"loggedInAs" : selectedFilterLoggerDesc, "client" : combo.getValue(),  "clientDesc" :combo.getRawValue()};
									var strUrl = 'services/userpreferences/invoiceFinanceCenter/screenFilters.json';
										Ext.Ajax.request({
											url : Ext.String.format(strUrl),
											method : 'POST',
											jsonData : objJson,
											async : false,
											success : function(response) {
												//me.updateSavedFilterComboInQuickFilter();
												//me.resetAllFields();
											},
											failure : function() {
												// console.log("Error Occured - Addition
												// Failed");

											}

										});	*/
								}
						}
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
			width : '25%',
			padding : '0 25 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
							xtype : 'AutoCompleter',
							width : '100%',
							matchFieldWidth : true,
							name : 'clientCombo',
							itemId : 'clientAuto',
							cfgUrl : "services/userseek/userclients.json",
							padding : '-4 0 0 0',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userclients',
							cfgKeyNode : 'CODE',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
							enableQueryParam:false,
							cfgProxyMethodType : 'POST',
							listeners : {
								'select' : function(combo, record) {
									selectedFilterClientDesc = combo.getRawValue();
									selectedFilterClient = combo.getValue();
									selectedClientDesc = combo.getRawValue();
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
											
									var objJson = {"loggedInAs" : selectedFilterLoggerDesc, "client" : combo.getValue(), "clientDesc" :combo.getRawValue()};
									var strUrl = 'services/userpreferences/invoiceFinanceCenter/screenFilters.json';
										Ext.Ajax.request({
											url : Ext.String.format(strUrl),
											method : 'POST',
											jsonData : objJson,
											async : false,
											success : function(response) {
												//me.updateSavedFilterComboInQuickFilter();
												//me.resetAllFields();
											},
											failure : function() {
												// console.log("Error Occured - Addition
												// Failed");

											}

										});		
								
									},
								'change' : function(combo, record) {
									if(Ext.isEmpty(combo.getValue())){
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									selectedClientDesc = "";
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
									}
								}
							}
						}]
		},{
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'entryDateContainer',
				layout : 'vbox',
				width : '50%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'entryDatePanel',
					height : 23,
					flex : 1,
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'entryDateLabel',
								text : getLabel('reference', 'Loan Reference') 
							}]
				}, {
					xtype : 'container',
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
							xtype : 'AutoCompleter',
							width : '100%',
							matchFieldWidth : true,
							name : 'poFinRefCombo',
							itemId : 'poFinRefAuto',
							cfgUrl : me.getInvoiceFinanceRefURL(),
							padding : '-4 0 0 0',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userclients',
							cfgKeyNode : 'CODE',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
							enableQueryParam:false,
							cfgProxyMethodType : 'POST',
							listeners : {}
						}]
				}]
			}]
		}
			]}, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'clientContainer',
				layout : 'vbox',
				hidden : true,
				items : [{
							xtype : 'label',
							text : getLabel("batchColumnClient", "Client"),
							flex : 1,
							margin : '0 0 0 0'
						}, {
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '93%',
							itemId : 'quickFilterClientCombo',
							mode : 'local',
							padding : '0 0 0 0',
							emptyText : getLabel('selectclient',
									'Select Client'),
							store : me.getClientStore(),
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent(
											"handleClientChangeInQuickFilter",
											combo);
								}
							}
						}]
			}]
		}];
		this.callParent(arguments);	
	},
	getStatusStore : function(){
		var objPOStatusStore = null;
		if (!Ext.isEmpty(arrPOStatus)) {
			objPOStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrPOStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPOStatusStore.load();
		}
		return objPOStatusStore;
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+ strSeller,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	getSellerBuyerStore : function(){
		var objPOSellerBuyerStore = null;
		if (!Ext.isEmpty(arrSellerBuyer)) {
			objPOSellerBuyerStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrSellerBuyer,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPOSellerBuyerStore.load();
		}
		return objPOSellerBuyerStore;
	},
	
	getInvoiceFinanceRefURL : function(){
		var strUrl = 'services/userseek/' +(selectedFilterLoggerDesc == 'SELLER' ? 'invoiceFinanceReferenceSellerMode' : 'invoiceFinanceReferenceBuyerMode');
		
		return strUrl;
	}
});