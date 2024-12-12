Ext.define('GCP.view.ClientSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter','Ext.ux.gcp.CheckCombo'],
	layout : {
		type : 'vbox'
	},
	width: '100%',
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		clientSetupSummaryView=this;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
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
									'DESCR' : getLabel('allCompanies', 'All companies')
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
		var mandatePartyNameSeek = null;
		var payerNameSeekUrl = null;
		var payerAcctSeekUrl = null;
		var filterContainerArr = new Array();
	
		if (userType == 0) {
			mandatePartyNameSeek = 'services/drawerseek/adminPayerCodeSeekList.json';
		}
		else{
			mandatePartyNameSeek = 'services/drawerseek/clientPayerCodeSeekList.json';
		}
		if (userType == 0) {
			payerNameSeekUrl = 'services/drawerseek/adminPayerNameSeekPayerMstList.json';
		}
		else{
			payerNameSeekUrl = 'services/drawerseek/clientPayerNameSeekPayerMstList.json';
		}
		if (userType == 0) {
			payerAcctSeekUrl = 'services/drawerseek/adminPayerAcctSeekList.json';
		}
		else{
			payerAcctSeekUrl = 'services/drawerseek/clientPayerAcctSeekList.json';
		}
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});

		this.items = [{
				xtype : 'container',
			    layout : 'vbox',
			    padding : '0 30 0 0',
			    width:'27%',
			    hidden : ((clientStore.getCount() < 2) || !isClientUser())
					? true
					: false,
				itemId : 'filterClientMenuContainer',
				items : [{
							xtype : 'label',
							text : getLabel('lblcompany', 'Company Name')
						},{
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							itemId:'clientCombo',
							triggerAction : 'all',
							triggerBaseCls : 'xn-form-trigger',
							width:'100%',
						    padding : '-4 0 0 0',
						    emptyText : getLabel('selectCompany', 'Select Company'),
							store : clientStore,
							listeners:{
							'select':function(combo,record){
								var code=combo.getValue();
								me.fireEvent("handleClientChange",code,combo.getRawValue(),'');
							},
							boxready : function(combo, width, height, eOpts) {
//								combo.setValue(combo.getStore().getAt(0));
							}
						}
					}]
			    }, {
				xtype : 'container',
			    layout : 'vbox',
			    padding : '0 30 0 0',
			     width:'27%',
			    hidden : (isClientUser()) ? true : false,
				itemId : 'filterClientAutoCmplterCnt',
				items : [{
							xtype : 'label',
							text : getLabel('lblcompany', 'Company Name')
						},{
				xtype : 'AutoCompleter',
				width:'100%',
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
			},  {
			xtype : 'container',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				width : '27%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text : getLabel('payerCode', 'Payer Code'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'payerCode',
					itemId : 'payerCodeFltId',
					cfgUrl : mandatePartyNameSeek,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					width : '100%',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					padding : '-4 0 0 0',
					cfgSeekId : 'payerCodesList',
					cfgKeyNode : 'name',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				}]
			}, {
				xtype : 'container',
				width :'27%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text : getLabel('payerName', 'Payer Name'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'payerName',
					itemId : 'payerNameFltId',
					cfgUrl : payerNameSeekUrl,
					width : '100%',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					padding : '-4 0 0 0',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'payerNameList',
					cfgKeyNode : 'name',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				}]
			}, {
				xtype : 'container',
				width :'27%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text : getLabel('payerAcctNumber', 'Payer Account'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'payerAcct',
					itemId : 'payerAcctFltId',
					cfgUrl : payerAcctSeekUrl,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					width : '100%',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					padding : '-4 0 0 0',
					cfgSeekId : 'payerAcctList',
					cfgKeyNode : 'name',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				}]
			}]
		}]
		this.callParent(arguments);
	},
	getStatusStore : function() {
		var objStatusStore = null;
		if (!Ext.isEmpty(drawerStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'desc'],
						data : drawerStatus,
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