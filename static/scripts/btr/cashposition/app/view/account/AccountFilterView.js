/**
 * @class GCP.view.activity.AccountActivityFilterView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.account.AccountFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountFilterView',
	layout:'vbox',	
	initComponent : function() {
		var me = this;
		var clientStore = me.getClientStore();
		var accStore = me.accountFilterStore();
		var txnStore = me.catFilterStore();
		me.items = [{
				  	xtype : 'container',
					layout : 'hbox',
					flex : 1,
					items : [{
								xtype : 'container',
								itemId : 'savedTypeCodeContainer',
								layout : 'vbox',
								flex : 1,
								items : [{
											xtype : 'label',
											itemId : 'savedTypeCodeLabel',
											text : getLabel('savedaccountSet', 'Account'),
											padding : '0 0 0 0'
										},Ext.create('Ext.ux.gcp.CheckCombo', {
											valueField : 'accountId',
											displayField : 'accountNoName',
											editable : false,
											addAllSelector : true,
											triggerAction : 'all',
											multiSelect : true,
											itemId : 'ActAccountCombo',
											mode : 'local',
											filterParamName : 'accountId',
											isAccAccountFieldChange : false,
											width : 280,
											emptyText : getLabel('all', 'All'),
											store : accStore
										})]
						},{
								xtype : 'container',
								itemId : 'savedFiltersContainer',
								layout : 'vbox',
								flex : 1,
								items : [{
											xtype : 'label',
											itemId : 'savedFiltersLabel',
											text :  getLabel('transactionCat', 'Transaction Category'),
											padding : '0 0 0 230' //Top Right Bottom Left
										},Ext.create('Ext.ux.gcp.CheckCombo', {
											valueField : 'CATEGORY_ID',
											displayField : 'CATEGORY_NAME',
											editable : false,
											addAllSelector : true,
											multiSelect : true,
											itemId : 'ActTransactionCombo',
											triggerAction : 'all',
											mode : 'local',
											width:280,
											filterParamName : 'categoryId',
											isAccTxnCategoryFieldChange : false,
											padding : '0 0 0 230',
											emptyText : getLabel('all', 'All'),
											store : txnStore
										})]
						}]
			}]
		this.callParent(arguments);	
	},

accountFilterStore : function() {	
	var me = this;
	var accFilterDataStore = null;
	var accFilterData = null;

	Ext.Ajax.request({
		url : 'services/cashpositionsummary/cashPositionAccount?$screenType=account',
		method : 'GET',
		async : false,
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
			accFilterData = responseData.d.btruseraccount;
		},
		failure : function() {
			
		}
	});
	if (!Ext.isEmpty(accFilterData)) {
		accFilterDataStore = Ext.create('Ext.data.Store', {
			fields : ['accountId','accountNoName'],
			data : accFilterData,
			autoLoad : true,
			listeners : {
				load : function() {
				}
			}
		});
		accFilterDataStore.load();
	}
	return accFilterDataStore;
},
	
catFilterStore : function() {	
		var me = this;
		var catFilterDataStore = null;
		var catFilterData = null;
	
		Ext.Ajax.request({
			url : 'services/cashpositionsummary/cashPositionCategory',
			method : 'GET',
			async : false,
			success : function(response) {
				catFilterData = response;
			},
			failure : function() {
				
			}
		});
		if (!Ext.isEmpty(catFilterData)) {
			catFilterDataStore = Ext.create('Ext.data.Store', {
				fields : ['CATEGORY_ID','CATEGORY_NAME'],
				data : catFilterData,
				autoLoad : true,
				listeners : {
					load : function() {
					}
				}
			});
			catFilterDataStore.load();
		}
		return catFilterDataStore;
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