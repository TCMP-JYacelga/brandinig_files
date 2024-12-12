Ext.define('GCP.view.summary.CashPositionSummaryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'cashPositionSummaryFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout:'vbox',
	clientStore : null,
	initComponent : function() {
		var me = this;
		var clientStore = me.getClientStore();
		me.items = [{
					xtype : 'container',
					layout : 'hbox',
					flex : 1,
					items : [{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('account','Account'),
									flex : 1,
									padding : '0 0 0 0'
								}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'accountId',
									displayField : 'accountNoName',
									editable : false,
									addAllSelector : true,
									multiSelect : true,
									itemId : 'viewAccountCombo',
									mode : 'local',
									filterParamName : 'accountId',
									isQuickAccountFieldChange : false,
									width : 280,
									emptyText : getLabel('all', 'All'),
									store : me.accountFilterStore()

								})]
					},{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('txncategory','Transaction category'),
									flex : 1,
									padding : '0 0 0 230'
								}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'CATEGORY_ID',
									displayField : 'CATEGORY_NAME',
									editable : false,
									addAllSelector : true,
									multiSelect : true,
									itemId : 'viewcategoryCombo',
									mode : 'local',
									width:280,
									filterParamName : 'categoryId',
									isQuickTxnCategoryFieldChange : false,
									padding : '0 0 0 230',
									emptyText : getLabel('all', 'All'),
									store :me.catFilterStore()

								})]
						}]
				}];
		this.callParent(arguments);
	},

accountFilterStore:function(){
	var myStore = null;
	var accountData=null;
	Ext.Ajax.request({
		url : 'services/cashpositionsummary/cashPositionAccount?$screenType=summary',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData= data.d.btruseraccount;
						myStore= Ext.create('Ext.data.Store', {
							fields : ['accountId','accountNoName'],
							data : accountData,
							reader : {
							type : 'json',
							root : 'd.btruseraccount'
							},
							autoLoad : true,
							listeners : {
								load : function() {
									/*this.insert(0, {
									CODE : 'all',
									DESCR : getLabel('all', 'All')
								});*/
										}
									}
						});
						filterAccountDataCount=data.d.btruseraccount.length;
						myStore.load();
					}
			}
		},
			failure : function(response) {
				// console.log('Error Occured');
			}
	
	})
	 return myStore;
},
catFilterStore : function() {
	var me = this;
	var txnCatData=null;
	var myStore=null;
	Ext.Ajax.request({
		url : 'services/cashpositionsummary/cashPositionCategory',
		async : false,
		method : "GET",
		success : function(response) {
			if (!Ext.isEmpty(response.responseText)) {
				var data = me.getJsonObj(Ext.decode(response.responseText));
				if (data) {
					txnCatData= data;
					myStore= Ext.create('Ext.data.Store', {
						fields : ['CATEGORY_ID','CATEGORY_NAME'],
						data : txnCatData,
						reader : {
							type : 'json',
							root : 'd.catList'
						},
						autoLoad : true,
						listeners : {
							load : function() {
											
							}
						}
					});
					filterTxnCategoryCount=data.length;
					myStore.load();
				}
			}
		},
		failure : function(response) {
				// console.log('Error Occured');
			}
	});
	return myStore;
},
getJsonObj : function(jsonObject) {
	var jsonObj ='';
	if(jsonObject  instanceof Object ==false)
		jsonObj =JSON.parse(jsonObject);
	if(jsonObject  instanceof Array)
		jsonObj =jsonObject;
	for (var i = 0; i < jsonObj.length; i++) {
		jsonObj[i].CATEGORY_NAME =  getLabel(jsonObj[i].CATEGORY_ID,jsonObj[i].CATEGORY_NAME);
	}
	if(jsonObject  instanceof Object ==false)
		jsonObj = JSON.stringify(jsonObj)
	return jsonObj;
},
	getClientStore:function(){
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