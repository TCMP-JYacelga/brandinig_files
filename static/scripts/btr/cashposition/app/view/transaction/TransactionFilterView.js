
Ext.define('GCP.view.transaction.TransactionFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'transactionFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout:'vbox',	
	initComponent : function() {
		var me = this;
		var clientStore = me.getClientStore()
		me.items = [{
				    xtype : 'container',
				    itemId : 'filterParentContainer',
					layout : 'hbox',
					flex : 1,
					items : [{
								xtype : 'container',
								itemId : 'savedFiltersContainer',
								layout : 'vbox',
								flex : 1,
								padding : '0 30 0 0', //Top Right Bottom Left
								items : [{
										xtype : 'label',
										itemId : 'savedFiltersLabel',
										text : getLabel('savedfilter', 'Saved Filters')
									 }, {
										xtype : 'combo',
										valueField : 'filterName',
										displayField : 'filterName',
										queryMode : 'local',
										editable : false,
										width : 220,
										padding : '-4 0 0 0', //Top Right Bottom Left
										triggerAction : 'all',
										itemId : 'savedFiltersCombo',
										mode : 'local',
										emptyText : getLabel('selectfilter','Select Filter'),
										store : me.savedFilterStore(),
										listeners:{
											'select':function(combo,record){
												me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
												}
										}
									}]
								},{
								xtype : 'container',
								itemId : 'savedTypeCodeContainer',
								layout : 'vbox',
								flex : 1,
									items : [{
												xtype : 'label',
												itemId : 'savedTypeCodeLabel',
												text : getLabel('savedaccountSet', 'Account'),
												padding : '-4 30 0 0' //Top Right Bottom Left
											}, {
												xtype : 'combo',
												valueField : 'accountId',
												displayField : 'accountNoName',
												queryMode : 'local',
												editable : false,
												itemId:'transactionAccount',
												triggerAction : 'all',
												padding : '-4 30 0 0', //Top Right Bottom Left
												mode : 'local',
												width : 220,
												emptyText : getLabel('all', 'All'),
												store : me.accountFilterStore()
											}]	
							},{
								xtype : 'container',
								itemId : 'saveTransactionContainer',
								layout : 'vbox',
								flex : 1,
								items : [{
											xtype : 'label',
											itemId : 'savedFiltersLabel',
											text : getLabel('transactionCat', 'Transaction Category'),
											padding : '-4 30 0 0' //Top Right Bottom Left
										}, {
											xtype : 'combo',
											valueField : 'CATEGORY_ID',
											displayField : 'CATEGORY_NAME',
											queryMode : 'local',
											width : 220,
											editable : false,
											triggerAction : 'all',
											padding : '-4 30 0 0', //Top Right Bottom Left
											itemId:'transactionCategory',
											mode : 'local',
										    emptyText : getLabel('all', 'All'),
											store : me.catFilterStore()
										}]
							}]
			}];
		this.callParent(arguments);
	},
accountFilterStore:function(){
	var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['accountId','accountNoName'],
					proxy : {
						type : 'ajax',
						 url : 'services/cashpositionsummary/cashPositionAccount?$screenType=details',
						reader : {
							type : 'json',
							root : 'd.btruseraccount'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.insert(0, {
				                    accountId: 'ALL',
				                    accountNoName: 'All'
				                });
							
						}
					}
				})
   return myStore;
},
catFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['CATEGORY_ID','CATEGORY_NAME'],
					proxy : {
						type : 'ajax',
						url : 'services/cashpositionsummary/cashPositionCategory',
						reader : {
							type : 'json',
							root : 'd.catList'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.insert(0, {
				                    CATEGORY_ID: 'ALL',
				                    CATEGORY_NAME: 'All'
				                });
							
						}
					}
				})
		return myStore;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/cashpositiontxn.json',
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
	},
getClientStore : function() {
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
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
														DESCR : getLabel('allCompanies', 'All Companies')
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
	}
});