Ext.define('GCP.view.ClientSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'vbox'
	},
	width: '100%',
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		var orderingPartyNameSeekURL = null;
		var oderingPartyIDSeekURL = null;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		
		
		
		var clientStore=Ext.create('Ext.data.Store', {
							fields : ['CODE','DESCR']
						});
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			method : 'POST',
			async : false,
			success: function(response){								
				if(response && clientStore){
					clientStore.removeAll(true,true);
					var responseData = Ext.decode(response.responseText),
						data = responseData.d.preferences,
						count = data.length;
					
					if(count > 1){
						clientStore.add({
							'CODE' : 'all',
							'DESCR' : getLabel('allCompanies',
							'All Companies')
						});
						
						for(var i=0;i<count;i++){
							var obj = {
								'DESCR': data[i].DESCR,
								'CODE' : data[i].CODE
							};
							clientStore.add(obj);
						}
					}
					
				}
			},
			failure : function(){}
		});
		
		var corp_cond = clientStore.getCount() > 1,
			client_cont = isClientUser();
		
	/* me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "GET",
								async : false,
								success : function(response) {
									if (response && response.responseText){
										me.addDataToClientCombo(Ext.decode(response.responseText));
									}
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
			me.on('afterrender', function(panel) {
					var clientCombo = me.down('combo[itemId="clientCombo"]');
					// Set Default Text When Page Loads
					clientCombo.setRawValue(getLabel('allCompanies', 'All companies'));	
				}); */
		

	
		if (userType == 0) {
			orderingPartyNameSeekURL = 'services/orderPartySeek/adminOrderPartyNamesList.json';
		}
		else{
			orderingPartyNameSeekURL = 'services/orderPartySeek/clientOrderPartyNamesList.json';
		}
		if (userType == 0) {
			oderingPartyIDSeekURL = 'services/orderPartySeek/adminOrderCodeList.json';
		}
		else{
			oderingPartyIDSeekURL = 'services/orderPartySeek/clientOrderCodeList.json';
		}
		this.items = [/* {
				xtype : 'container',
				flex : 0.8,
				layout : 'vbox',
				hidden : entityType == 0 ? true : false,
				itemId : 'filterClientMenuContainer',
				items : [{
							xtype : 'label',
							text : getLabel("Client", "Client"),
							margin : '0 0 0 6'
						},{
							xtype : 'combo',
							padding:'0 0 0 6',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							itemId:'clientCombo',
							triggerAction : 'all',
							triggerBaseCls : 'xn-form-trigger',
							editable : false,
							store : clientStore,
							listeners:{
							'select':function(combo,record){
								var code=combo.getValue();
								me.clientCode=code;
								me.fireEvent("handleClientChange",code,combo.getRawValue(),'');
							}
						}
						}]
			    },*//*{
				xtype:'container',
				flex:0.8,
				layout:'vbox',
				hidden :  entityType == 1 ? true : false,
				itemId : 'filterClientAutoCmplterCnt',
				items : [{
							xtype : 'label',
							text : getLabel("Client", "Client"),
							margin : '0 0 0 6'
						},{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodeId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
				listeners : {
					'select' : function(combo, record) {
						strClientId = combo.getValue();
						strClientDescr = combo.getRawValue();
						strSellerId = record[0].data.SELLER_CODE;
						pmtSummaryView.fireEvent('handleClientChange', strClientId,
								strClientDescr, strSellerId);
					},
					'change' : function(combo, newValue, oldValue, eOpts) {
						if (Ext.isEmpty(newValue)) {
							pmtSummaryView.fireEvent('handleClientChange', null,
								'', '');
						}
					},
					'render' : function(combo) {
						combo.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strClientId,
													"DESCR" : strClientDescr
												}]
									}
								});
						combo.listConfig.width = 200;
						combo.suspendEvents();
						combo.setValue(strClientId);
						combo.resumeEvents();
					}
				}
		    }]
			} ,*/
				              {
				            	  xtype: 'container',
				            	  layout: 'vbox',
				            	  //width: '25%',
				            	  //width: corp_cond ? '25%' : '0',
				            	  padding: '0 30 0 0',
				            	  hidden: ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
				            	  items:[
			            	         {
			            	        	 xtype: 'label',
			            	        	 text : getLabel('lblcompany', 'Company Name')
			            	         },{
			            	        	 xtype : 'combo',			            	        	 
			     						 displayField : 'DESCR',
			     						 valueField : 'CODE',
			     						 queryMode : 'local',
			     						 editable : false,
			     						 triggerAction : 'all',
			     						 //width : '100%',
			     						 width: 280,
			     						 padding : '-4 0 0 0',
			     						 itemId : 'clientCombo',
			     						 mode : 'local',
			     						 emptyText : getLabel('selectCompany', 'Select Company Name'),
			     						 store : clientStore,
			     						 listeners : {
			     						 	'select' : function(combo, record) {
			     						 		selectedFilterClientDesc = combo.getRawValue();
		            	        				selectedFilterClient = combo.getValue();
			     						 		$(document).trigger("handleClientChangeInQuickFilter", false);
			     							}
									
			     						 }
			            	         }
		            	          ]
				              },
				              {
				            	  xtype: 'container',
				            	  layout: 'vbox',
				            	  //width: '25%',
				            	  //width: corp_cond ? '25%' : '0',
		            			  padding: '0 30 0 0',
				            	  hidden: (isClientUser()) ? true : false,// If not admin then hide
				            	  items:[
			            	         {
			            	        	 xtype: 'label',
			            	        	 text : getLabel('lblcompany', 'Company Name')
			            	         },{
			            	        		xtype : 'AutoCompleter',
			            	        		width : 280,
			            	        		matchFieldWidth : true,
			            	        		name : 'clientCombo',			            	        		
			            	        		itemId : 'clientComboAuto',
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
			            	        				$(document).trigger("handleClientChangeInQuickFilter",false);
			            	        			},
												'change' : function(combo, record) {
													if (Ext.isEmpty(combo.getValue())) {
														selectedFilterClientDesc = "";
														selectedFilterClient = "";
														$(document).trigger(
																"handleClientChangeInQuickFilter",
																false);
													}
												}
			            	        		}
			            	        	}
		            	          ]
				            },
	            	        {
							xtype : 'container',
							itemId : 'filterParentContainer',
							width : '100%',
							layout : 'hbox',
							items : [{
												  xtype: 'container',
												  //flex : 0.32,
												  //width: corp_cond ? '25%' : '32%',
												  padding: '0 30 0 0',
												  layout : 'vbox',	            	        	  
												  items:[
													 {
														 xtype: 'label',
														 text: getLabel('orderPartyName', 'Ordering Party Name'),
														 //padding: '0 30 0 0',
														 cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
													 },{
														xtype : 'AutoCompleter',
														fieldCls : 'xn-form-text xn-suggestion-box w10_3',
														flex:1,
														width: 280,
														matchFieldWidth : true,
														name : 'orderPartyName',
														itemId : 'orderPartyNameFltId',
														cfgUrl : orderingPartyNameSeekURL,
														cfgQueryParamName : 'qfilter',
														cfgRecordCount : -1,
														padding : '-4 0 0 0',
														cfgSeekId : 'orderPartyNamesList',
														cfgKeyNode : 'name',
														cfgRootNode : 'filterList',
														cfgDataNode1 : 'name',
														emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
														enableQueryParam:false,
														cfgProxyMethodType : 'POST'
													 }
												  ]
											  },{
													xtype : 'container',
													//flex : 0.8,
													//width: corp_cond ? '50%' : '80%',
													padding: '0 30 0 0',
													layout : 'vbox',
													items : [
														 {
															xtype : 'label',
															text : getLabel('orderPartyId', 'Ordering Party ID'),
															cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
														 }, {
															xtype : 'AutoCompleter',
															flex:1,
															fieldCls : 'xn-form-text xn-suggestion-box w10_3',
															width: 280,
															matchFieldWidth : true,
															name : 'orderCode',
															itemId : 'orderPartyCodeFltId',
															cfgUrl : oderingPartyIDSeekURL,
															cfgQueryParamName : 'qfilter',
															cfgRecordCount : -1,
															padding : '-4 0 0 0',
															cfgSeekId : 'orderCodeList',
															cfgKeyNode : 'name',
															cfgRootNode : 'filterList',
															cfgDataNode1 : 'name',
															emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
															enableQueryParam:false,
															cfgProxyMethodType : 'POST'
														}
									  /*,
									  {xtype : 'container',
								flex : 0.32,
								layout : 'vbox',
							 items : [{
										xtype : 'label',
										text : getLabel('orderPartyName', 'Ordering Party Name'),
										//padding: '0 30 0 0',
										cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
									}, {
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text xn-suggestion-box w10_3',
										flex:1,
										width: 280,
										matchFieldWidth : true,
										name : 'orderPartyName',
										itemId : 'orderPartyNameFltId',
										cfgUrl : orderingPartyNameSeekURL,
										cfgQueryParamName : 'qfilter',
										cfgRecordCount : -1,
										padding : '-4 0 0 0',
										cfgSeekId : 'orderPartyNamesList',
										cfgKeyNode : 'name',
										cfgRootNode : 'filterList',
										cfgDataNode1 : 'name',
										emptyText:getLabel('SearchOPName','Search by Ordering Party Name'),
										enableQueryParam:false,
										cfgProxyMethodType : 'POST'
									}]
								},  {
								xtype : 'container',
								flex : 0.8,
								layout : 'vbox',
								items : [{
										xtype : 'label',
										text : getLabel('orderPartyId', 'Ordering Party ID'),
										cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
									}, {
										xtype : 'AutoCompleter',
										flex:1,
										fieldCls : 'xn-form-text xn-suggestion-box w10_3',
										width: 250,
										matchFieldWidth : true,
										name : 'orderCode',
										itemId : 'orderPartyCodeFltId',
										cfgUrl : oderingPartyIDSeekURL,
										cfgQueryParamName : 'qfilter',
										cfgRecordCount : -1,
										padding : '-4 0 0 0',
										cfgSeekId : 'orderCodeList',
										cfgKeyNode : 'name',
										cfgRootNode : 'filterList',
										cfgDataNode1 : 'name',
										emptyText:getLabel('SearchOPCode','Search by Ordering Party Id'),
										enableQueryParam:false,
										cfgProxyMethodType : 'POST'
									}*/]
									},
									{
										xtype : 'container',
										itemId : 'statusContainer',
										layout : 'vbox',
										flex : 1,
										// width : '25%',
										// padding : '5 0 0 0',
										items : [{
													xtype : 'label',
													text : getLabel('status', 'Status')
												}, Ext.create('Ext.ux.gcp.CheckCombo', {
															valueField : 'code',
															displayField : 'desc',
															editable : false,
															addAllSelector : true,
															emptyText : 'All',
															multiSelect : true,
															width : 240,
															padding : '-4 0 0 0',
															itemId : 'orderingStatusFilter',
															isQuickStatusFieldChange : false,
															store : me.getStatusStore(),
															listeners : {
																'focus' : function() {
																}
															}
														})]
									}]
							}]
		
		this.callParent(arguments);

		/*var sellerCombo = me.down('combobox[itemId=sellerFltId]');
		var clientAutoCompleter = clientNameContainer
				.down('AutoCompleter[itemId=orderPartyClientCodesFltId]');
		clientAutoCompleter.cfgExtraParams = [{
					key : 'sellerId',
					value : sellerCombo.getValue()
				}];*/

	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	}
	/*
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all',
					handler : function(btn, opts) {
						clientCombobox.setText(btn.text);
						me.clientCode = btn.CODE;
					}
				});

		Ext.each(clientArray, function(client) {
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.CODE;
									me.fireEvent('handleClientChange',
											btn.CODE, btn.DESCR, '');
								}
							});
				});		
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}else{
			clientCombobox.getStore().loadData(clientMenu);
		}
	}
	
	*/
});