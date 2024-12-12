Ext.define('GCP.view.ClientSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		clientSetupSummaryView=this;
		var userClient = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (userClient) {
							userClient.removeAll();
							var count = data.length;
							if (count > 1) {
								userClient.add({
											'CODE' : 'all',
											'DESCR' : getLabel('allCompanies','All Companies')
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								userClient.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
						});
		var receiverPartyNameSeek = null;
		var receiverAccountSeekUrl = null;
		var filterContainerArr = new Array();
		/*me.on('afterrender', function(panel) {
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
				});*/
		if (userType == 0) {
			receiverPartyNameSeek = 'services/receiverPartySeek/adminReceiverNamesList.json';
		}
		else{
			receiverPartyNameSeek = 'services/receiverPartySeek/clientReceiverNamesList.json';
		}
		if (userType == 0) {
			receiverAccountSeekUrl = 'services/receiverPartySeek/adminAccountNoList.json';
		}
		else{
			receiverAccountSeekUrl = 'services/receiverPartySeek/clientAccountNoList.json';
		}
		this.items = [/*{
				xtype : 'container',
				flex : 0.8,
				layout : 'vbox',
				hidden : !isClientUser(),
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
			    },*//* {
				xtype:'container',
				flex:0.8,
				layout:'vbox',
				hidden:isClientUser(),
				itemId : 'filterClientAutoCmplterCnt',
				items : [{
							xtype : 'label',
							text : getLabel("Client", "Client"),
							margin : '0 0 0 6'
						},{
				xtype : 'AutoCompleter',
			    padding:'0 0 0 6',
				width:200,
			    cfgTplCls : 'xn-autocompleter-t7',
				fieldCls : 'xn-form-text xn-suggestion-box',
				itemId : 'clientAutoCompleter',
				name : 'clientAutoCompleter',
				cfgUrl : 'services/userseek/userclients.json',
				cfgRecordCount : -1,
				cfgStoreFields : ['CODE','DESCR','SELLER_CODE'],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgQueryParamName : '$autofilter',
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
													"DESCR" : strClientDescription
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
			} */
				 
						{
							xtype : 'container',
							layout : 'vbox',
							hidden : ((userClient.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
							width : '40%',
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
										width : 230,
										padding : '-4 0 0 0',
										itemId : 'clientCombo',
										mode : 'local',
										emptyText : getLabel('selectCompany',
												'Select Company Name'),
										store : userClient,
										listeners : {
											'select' : function(combo, record) {
												// $(document).trigger("handleClientChangeInQuickFilter",
												// false);
												var val = combo.getValue(), descr = combo
														.getDisplayValue();
												if (val && descr) {
													changeClientAndRefreshGrid(val, descr);
												}
											}/*,
											boxready : function(combo, width, height, eOpts) {
												combo.setValue(combo.getStore().getAt(0));
											}*/
										}
									}]
						}, {
							xtype : 'container',
							layout : 'vbox',
							hidden : (isClientUser()) ? true : false,// If not admin then hide
							width : '40%',
							padding : '0 30 0 0',
							items : [{
										xtype : 'label',
										itemId : 'savedFiltersLabel',
										text : getLabel('lblcompany', 'Company Name')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
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
										cfgDataNode1 : 'DESCRIPTION',
										cfgDataNode2 : 'DESCR',
										emptyText : getLabel('autoCompleterEmptyText',
												'Enter Keyword or %'),
										enableQueryParam : false,
										cfgProxyMethodType : 'POST',
										listeners : {
											'select' : function(combo, record) {
												$("[name=clientCombo]").first().val(record[0].data.DESCR);
												selectedFilterClientDesc = record[0].data.CODE;
												selectedFilterClient = record[0].data.CODE;
												$(document).trigger(
														"handleClientChangeInQuickFilter",
														false);
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
									}]
						},
						{
						xtype : 'container',
						itemId : 'filterParentContainer',
						width : '100%',
						layout : 'hbox',
						items : [{
									xtype : 'container',
									layout : 'vbox',
									padding: '0 30 0 0',
									items : [{
										xtype : 'label',
										text : getLabel('receiverCode', 'Receiver Code')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
										matchFieldWidth : true,
										name : 'receiverName',
										itemId : 'receiverNameFltId',
										cfgUrl : receiverPartyNameSeek,
										padding : '-4 0 0 0',
										cfgQueryParamName : 'qfilter',
										cfgRecordCount : -1,
										cfgSeekId : 'receiverNamesList',
										cfgKeyNode : 'name',
										cfgRootNode : 'filterList',
										cfgDataNode1 : 'name',
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										enableQueryParam:false,
										/*listeners : {
												'select' : function(combo,record) {
														window.location.reload();
													}	
												},*/
										cfgProxyMethodType : 'POST'
									}]
								}, {
									xtype : 'container',
									layout : 'vbox',
									padding: '0 30 0 0',
									items : [{
										xtype : 'label',
										text : getLabel('accountNo', 'Account')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
										name : 'accountNo',
										matchFieldWidth : true,
										itemId : 'accountNoFltId',
										padding : '-4 0 0 0',
										cfgUrl : receiverAccountSeekUrl,
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										cfgQueryParamName : 'qfilter',
										cfgRecordCount : -1,
										cfgSeekId : 'accountNoList',
										cfgKeyNode : 'name',
										cfgRootNode : 'filterList',
										cfgDataNode1 : 'value',
										enableQueryParam:false,
										cfgProxyMethodType : 'POST'
									}]
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
														itemId : 'receiverStatusFilter',
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
	/*addDataToClientCombo:function(data){
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
	}*/
});