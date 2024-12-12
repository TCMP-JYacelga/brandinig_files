Ext.define('GCP.view.UserCategoryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userCategoryFilterView',
	requires : ['Ext.container.Container','Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		var storeLength = 0;
		rolesSummaryView = this;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
				});
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						noCache: false,
						url : 'services/categoryStatusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
				
		var corporationStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});		
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				if (corporationStore) {
					corporationStore.removeAll();
					var count = data.length;
					if (count > 1) {
						corporationStore.add({
									'CODE' : '',
									'DESCR' : 'All Companies'
								});
					}
					for (var index = 0; index < count; index++) {
						var record = {
							'CODE' : data[index].CODE,
							'DESCR' : data[index].DESCR
						}
						corporationStore.add(record);
					}
				}
			},
			failure : function() {
			}
		});	
		if( corporationStore && corporationStore.data && corporationStore.data.items )
		{
			storeLength = corporationStore.data.items.length;
		}
			this.items = [
			/*{
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
			},*/{
				xtype:'container',
				flex:1,
				width : '33.3%',
				layout:'vbox',
				hidden: isClientUser() ? true : false,
				itemId:"filterClientAutoCmplterCnt",
				items : [{
							xtype : 'label',
							text : getLabel('company', 'Company Name')
							//margin : '0 0 0 6'
						},{
						xtype : 'AutoCompleter',
						//padding:'0 0 0 6',
						padding : '-4 30 0 0',
						width : 240,
						cfgTplCls : 'xn-autocompleter-t7',
						fieldCls : 'xn-form-text xn-suggestion-box',
						itemId : 'clientAutoCompleter',
						name : 'clientAutoCompleter',
						emptyText : getLabel('searchByKeyword', 'Enter Keyword or %'),
						cfgUrl : 'services/userseek/adminRolesCorporation.json',
						cfgRecordCount : -1,
						cfgStoreFields : ['CODE','DESCR','SELLER_CODE'],
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						cfgKeyNode : 'CODE',
						cfgQueryParamName : '$autofilter',
						enableQueryParam:false,
						listeners : {
							'select' : function(combo, record) {
								strClientId = combo.getValue();
								strClientDesc = combo.getRawValue();
								strSellerId = record[0].data.SELLER_CODE;
								rolesSummaryView.fireEvent('handleClientChange', strClientId,
										strClientDesc, strSellerId);
							},
							'change' : function(combo, newValue, oldValue, eOpts) {
								strClientId1 = combo.getValue();
								strClientDesc1 = combo.getRawValue();
								//strSellerId1 = record[0].data.SELLER_CODE;
								if (Ext.isEmpty(newValue)) {
									rolesSummaryView.fireEvent('handleClientChange', '', '', '');
								}
							},
							'render' : function(combo) {
								combo.store.loadRawData({
											"d" : {
												"preferences" : [{
															"CODE" : strClientId,
															"DESCR" : strClientDesc
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
			},{
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				width : '33.3%',
				//hidden : (entity_type == '1'),
				 hidden :  true,//as per current requirement for client user Copany filter is not required.
				 //isClientUser() && storeLength > 2 ? false : true,
				items : [{
							xtype : 'label',
							text : getLabel('company', 'Company Name'),
							margin : '0 0 0 0'
						}, {
							xtype : 'combo',
							displayField : 'DESCR',
							valueField : 'CODE',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : 240,
							padding : '-4 30 0 0',
							itemId : 'clientCombo',
							mode : 'local',
							emptyText : getLabel('searchByKeyword', 'Enter Keyword or %'),
							store : corporationStore,
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleClientChange", combo
													.getValue(), combo
													.getRawValue(),
											sessionSellerCode);
								}
							}
						}]
			},
			{
			xtype : 'container',
			flex : 1,
			layout : 'hbox',
			items : [{
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				items : [{
							xtype : 'label',
							text : getLabel("role", "Role")
						}, {
							xtype : 'AutoCompleter',
							padding : '-4 30 0 0',
							width : 240,
							labelSeparator : '',
							cfgTplCls : 'xn-autocompleter-t7',
							fieldCls : 'xn-form-text  xn-suggestion-box',
							name : 'categoryCode',
							itemId : 'userNameFilter',
							matchFieldWidth : true,
							enableQueryParam : false,
							cfgUrl : 'services/userCategory/filter/catNamesList.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userNamesList',
							cfgKeyNode : 'name',
							cfgRootNode : 'filterList',
							cfgDataNode1 : 'value',
							cfgProxyMethodType : 'POST',
							emptyText : getLabel('searchByKeyword',
									'Enter Keyword or %'),
							cfgExtraParams : [{
										key : '$filterseller',
										value : sessionSellerCode
									}]
						}]
			}, {
				xtype : 'container',
				// flex : 0.8,
				layout : 'vbox',
				items : [{
							xtype : 'label',
							text : getLabel("description", "Description")
						}, {
							xtype : 'AutoCompleter',
							padding : '-4 30 0 0',
							width : 240,
							labelSeparator : '',
							cfgTplCls : 'xn-autocompleter-t7',
							fieldCls : 'xn-form-text  xn-suggestion-box',
							name : 'categoryDesc',
							itemId : 'userDescriptionFilter',
							cfgUrl : 'services/userCategory/filter/catDescList.json',
							cfgQueryParamName : 'qfilter',
							enableQueryParam : false,
							cfgRecordCount : -1,
							cfgSeekId : 'userDescriptionList',
							cfgKeyNode : 'name',
							cfgRootNode : 'filterList',
							cfgDataNode1 : 'name',
							cfgProxyMethodType : 'POST',
							emptyText : getLabel('searchByKeyword',
									'Enter Keyword or %'),
							cfgExtraParams : [{
										key : '$filterseller',
										value : sessionSellerCode
									}]
						}]
			}, {
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
									valueField : 'name',
									displayField : 'value',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : 240,
									padding : '-4 0 0 0',
									itemId : 'userCategoryStatusFilter',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
										}
									}
								})]
			}]
		}];
		this.callParent(arguments);
	},
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'ALL',
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
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['name','value'],
						data : arrStatusFilterLst,
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
});