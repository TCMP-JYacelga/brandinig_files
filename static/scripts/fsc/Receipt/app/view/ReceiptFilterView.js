Ext.define("GCP.view.ReceiptFilterView", {
	extend:'Ext.panel.Panel',
	xtype : 'receiptFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter','Ext.ux.gcp.CheckCombo'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var strUrl = null;
		var companyStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		if(isClientUser()) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : 'POST',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if(companyStore) {
						companyStore.removeAll();
						var count = data.length;
						if (count > 1) {
							companyStore.add({
										'CODE' : 'ALL',
										'DESCR' : getLabel('allCompanies','All Companies')
									});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							companyStore.add(record);
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		me.items = [{
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
			xtype : 'container',
			layout : 'vbox',
			width:'24%',
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
						matchFieldWidth : true,
						store : me.getSellerBuyerStore(),
						listeners : {
							'select' : function(combo, record) {
								changeBuyerOrSellerAndRefreshGrid(combo.getValue(), combo.getRawValue());
								var objJson = {"loggedInAs" : combo.getValue(), "client" : selectedFilterClient, "clientDesc" :selectedFilterClientDesc};
								var strUrl = 'services/userpreferences/reconReceipt/screenFilters.json';
										Ext.Ajax.request({
											url : Ext.String.format(strUrl),
											method : 'POST',
											jsonData : objJson,
											async : false,
											success : function(response) {

											},
											failure : function() {

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
			itemId : 'companySlectorContainer',
			layout : 'vbox',
			hidden : (isClientUser() && companyStore.getCount() <= 1) ? true : false,
			width : '24.5%',
			padding : '0 30 0 5',
			items : [{
				xtype : 'label',
				text : getLabel('lblcompany', 'Company Name')
			}, {
				xtype : 'combo',
				hidden : !isClientUser(),
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				editable : false,
				width : '100%',
				padding : '-4 0 0 0',
				itemId : 'clientCombo',
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				matchFieldWidth : true,
				store : companyStore,
				listeners : {
					select : function(combo, record, eOpts) {
						
						selectedFilterClientDesc = combo.getRawValue();
						selectedFilterClient = combo.getValue();
						selectedClientDesc = combo.getRawValue();
						$('#msClient').val(selectedFilterClient);
						changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
						var objJson = {"loggedInAs" : selectedFilterLoggerDesc, "client" : combo.getValue(),  "clientDesc" :combo.getRawValue()};
							var strUrl = 'services/userpreferences/reconReceipt/screenFilters.json';
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
					}
				}
			}, {
				xtype : 'AutoCompleter',
				width : '100%',
				matchFieldWidth : true,
				hidden : isClientUser(),
				itemId : 'clientComboAuto',
				cfgUrl : "services/userseek/userclients.json",
				padding : '-4 0 0 0',
				cfgRecordCount : -1,
				cfgSeekId : 'userclients',
				cfgQueryParamName : '$autofilter',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
				enableQueryParam : false,
				cfgProxyMethodType : 'POST',
					listeners : {
						'select' : function(combo, record) {
							selectedFilterClientDesc = combo.getRawValue();
							selectedFilterClient = combo.getValue();
							selectedClientDesc = combo.getRawValue();
							$(document).trigger("handleClientChangeInQuickFilter",
									false);
									
							var objJson = {"loggedInAs" : selectedFilterLoggerDesc, "client" : combo.getValue(), "clientDesc" :combo.getRawValue()};
							var strUrl = 'services/userpreferences/reconReceipt/screenFilters.json';
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
						},
						'keyup' : function(combo, e, eOpts){
							me.isCompanySelected = false;
						},
						'blur' : function(combo, The, eOpts ){
							if(me.isCompanySelected == false  
									&& !Ext.isEmpty(combo.getRawValue()) ){
										selectedFilterClient = combo.getValue();
										selectedFilterClientDesc = combo.getRawValue();
										$(document).trigger("handleClientChangeInQuickFilter",
											false);
										me.isCompanySelected = true;
							}
						}
					}
			}]
		}]}, {
			xtype : 'container',
			//itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			padding : '0 30 0 0',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'label',
					text :getLabel('invRefNo', 'Receipt Number')	
					},
					{
						xtype : 'textfield',
						hideTrigger : true,
						labelAlign : 'top',
						labelSeparator : '',
						width  : '100%',
						padding : '-4 0 0 0',
						itemId : 'receiptNumber',
						fieldCls : 'xn-form-text',
						maxLength : 40,
						enforceMaxLength : true,
						maskRe : /[A-Za-z0-9 .]/
				}]
			},{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel',
							text : getLabel('savedFilters', 'Saved Filters')
						}, {
							xtype : 'combo',
							valueField : 'filterName',
							displayField : 'filterName',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							padding : '-4 30 0 0',
							itemId : 'savedFiltersCombo',
							mode : 'local',
							emptyText : getLabel('selectfilter','Select Filter'),
							matchFieldWidth : true,
							store : me.savedFilterStore(),
							listeners : {
								'select' : function(combo, record) {
									this.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
													.getRawValue());
									}

							}
						}]
			},{
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				items : [{
					xtype : 'label',
					text :getLabel('status', 'Liquidation Status')	
					},
					Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : "100%",
									padding : '-4 30 0 0',
									itemId : 'statusFilter',
									isQuickStatusFieldChange : false,
									matchFieldWidth : true,
									store : me.getStatusStore()
									
								})]
			}]
		}]
		this.callParent(arguments);
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrLiquidationStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrLiquidationStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
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
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : Ext.String.format('services/userfilterslist/ReceiptAdvFilter{0}.json', selectedFilterLoggerDesc),
						reader : {
							type : 'json',
							root : 'd.filters'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.each(function(record) {
										record.set('filterName', record.raw);
									});
						}
					}
				})
		return myStore;
	}
});