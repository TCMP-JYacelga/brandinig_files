Ext.define('GCP.view.PositivePayFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayFilterView',	
	width : '100%',
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'container',
			itemId : 'clientContainer',
			layout : 'vbox',
			width : '35%',
			hidden : client_count > 1 ? false : true , 
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						text : getLabel("company", "Company Name"),
						flex : 1
						
					}, {
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						width : '70%',
						editable : false,
						triggerAction : 'all',
						itemId : 'quickFilterClientCombo',
						mode : 'local',
						padding : '-4 0 0 0',
						emptyText : getLabel('selectcompany', 'Select Company'),
						store : me.getClientStore(),
						 listeners : {
							 	'select' : function(combo, record) {
										selectedFilterClientDesc = combo.getRawValue();
										selectedFilterClient = combo.getValue();
										$(document).trigger("handleClientChangeInQuickFilter", false);
									},
									boxready : function(combo, width, height, eOpts) {
										if (Ext.isEmpty(combo.getValue())) {										
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								 }
					}]
		}, 
		{
		
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [ {
						xtype : 'container',
						itemId : 'savedFiltersContainer',
						layout : 'vbox',
						width : '30%',
						items : [{
									xtype : 'label',
									itemId : 'savedFiltersLabel',
									text : getLabel('savedFilter','Saved Filters')
								}, {
									xtype : 'combo',
									valueField : 'filterName',
									displayField : 'filterName',
									queryMode : 'local',
									editable : false,
									width : '75%',
									padding : '-4 0 0 0',
									triggerAction : 'all',
									itemId : 'savedFiltersCombo',
									mode : 'local',
									emptyText : getLabel('selectfilter', 'Select Filter'),
									store : me.savedFilterStore(),
									listeners : {
										'select' : function(combo, record) {
											me.fireEvent("handleSavedFilterItemClick",
													combo.getValue(), combo.getRawValue());
										}
									}
								}]
					},
					{
						xtype : 'container',
						itemId : 'accountContainer',
						layout : 'vbox',
						width : '30%',
						items : [{
									xtype : 'label',
									itemId : 'accountFiltersLabel',
									text : getLabel('accounts', 'Accounts')
								},Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'filterCode',
									displayField : 'filterValue',
									//queryMode : 'local',						
									editable : false,
									addAllSelector : true,
									multiSelect : true,
									width : '75%',
									padding : '-4 0 0 0',
									triggerAction : 'all',
									itemId : 'quickFilterAccountCombo',
									//mode : 'local',
									emptyText : 'All',
								//	isQuickAccountFieldChange : false,
									store : me.getAccountStore(),
									listeners : {
										'blur' : function(combo, record) {
											me.fireEvent("handleAccountChangeInQuickFilter",
													combo);
										}
									}
								})]
			}]
		}];
		this.callParent(arguments);
	},
	getClientStore : function() {
		var clientData = null;
		var objClientStore = null;
		var strUrl;
		if(entityType == '1')
			strUrl = 'services/userseek/posPayExcClient.json';
		else
			strUrl = 'services/userseek/userclients.json';
			
		Ext.Ajax.request({
			url : strUrl,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE', 'DESCR'],
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
														DESCR : getLabel(
																'allCompanies',
																'All companies')
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
	getAccountStore : function() {	
		var accountData = null;
		var objAccountStore = null;
		var strUrl,objParam={};
		/*if(isGranularPermissionFlag === 'Y')
		strUrl = 'services/userseek/accountCustomerSeekGranular.json';			
		else
			strUrl = 'services/userseek/accountCustomerSeek.json';*/
		strUrl = 'services/positivePayDecAccountList.json?';
		//strUrl = 'posititivePayAccountList.srvc';
		objParam[csrfTokenName]=csrfTokenValue
		Ext.Ajax.request({
			url : strUrl,
			async : false,
			type : "POST",
			params:objParam,
			success : function(responseData) {
				if (!Ext.isEmpty(responseData.responseText)) {
					var data =  Ext.decode(responseData.responseText);
					if (data) {
						accountData = data.d;						
						objAccountStore = Ext.create('Ext.data.Store', {
									fields : ['filterCode', 'filterValue','additionalValue1'],
									data : accountData,
									autoLoad : true
								});
						objAccountStore.load();
					}
				}
			},
			failure : function(responseData) {
				// console.log('Error Occured');
			}
		});
		return objAccountStore;
	},
	savedFilterStore : function() {	
		var strUrl = 'services/userfilterslist/positivepayFilter.json';		
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : strUrl,
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