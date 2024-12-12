Ext.define('GCP.view.AccountConfigurationFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountConfigurationFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var accountURL = null;
		var accountNickName = null;
		var corporationStore = Ext.create('Ext.data.Store', {
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
					if(corporationStore) {
						corporationStore.removeAll();
						var count = data.length;
						if(count > 1) {
							corporationStore.add({
								'CODE' : 'all',
								'DESCR' : getLabel('allCompanies', 'All Companies')
							});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							corporationStore.add(record);
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		
		if (entityType == '0')
		{
			accountURL = 'services/clientAccConfigseek/accNoList.json';
			accountNickName = 'services/clientAccConfigseek/accNickNameList.json';
		}
		else
		{
			accountURL = 'services/clientAccConfigseek/clientAccNoList.json';
			accountNickName = 'services/clientAccConfigseek/clientAccNickNameList.json';
		}		
		
		me.items = [{
			xtype : 'container',
			itemId : 'clientSlectorContainer',
			layout : 'vbox',
			hidden : (isClientUser() && corporationStore.getCount() <= 1) ? true : false,
			width : screen.width > 1024 ? '25%' : '40%',
			padding : '0 30 0 0',
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
				width : 250,
				padding : '-4 0 0 0',
				itemId : 'clientCombo',
				emptyText : getLabel('selectCompany', 'Select Company'),
				store : corporationStore,
				listeners : {
					select : function(combo, record, eOpts) {
						changeClientAndRefreshGrid(combo.getValue(), combo.getDisplayValue());
					},
					boxready : function(combo, width, height, eOpts) {
						combo.setValue(getLabel('allCompanies', 'All Companies'));
					}
				}
			}, {
				xtype : 'AutoCompleter',
				width : 250,
				matchFieldWidth : true,
				hidden : isClientUser(),
				itemId : 'clientComboAuto',
				cfgUrl : "services/userseek/userclients.json",
				padding : '-4 0 0 0',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'userclients',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText : getLabel('searchByCompany', 'Search By Company'),
				enableQueryParam : false,
				cfgProxyMethodType : 'POST',
				listeners : {
					select : function(combo, record) {
						selectedFilterClient = combo.getValue();
						selectedFilterClientDesc = combo.getDisplayValue();
						$(document).trigger("handleClientChangeInQuickFilter", false);
					},
					change : function(combo, record) {
						if (Ext.isEmpty(combo.getValue())) {
							selectedFilterClient = "";
							selectedFilterClientDesc = "";
							$(document).trigger("handleClientChangeInQuickFilter", false);
						}
					}
				}
			}]
		}, 
		{
			xtype : 'panel',
			layout : 'hbox',
			width : '100%',
			cls : 'ux_largepadding',
			items : [{
				xtype : 'container',
				itemId : 'accNameContainer',
				layout : 'vbox',
				padding : '0 30 0 0',
				items : [{
					xtype : 'label',
					text : getLabel('accountNickNm', 'Account Nick Name')
				}, {
					xtype : 'AutoCompleter',
					name : 'accNickName',
					itemId : 'accNickNmFltId',
					cfgUrl : accountNickName,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'name',
					width : 250,
					padding : '-4 0 0 0',
					matchFieldWidth : true,
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgSeekId : entityType == 0 ? 'accNickNameList' : 'clientAccNickNameList',
					cfgRootNode : entityType == 0 ? 'd.filter' : 'd.filter',
					cfgDataNode1 : 'name',
					cfgProxyMethodType : 'POST'
				}]			
			},{
					xtype : 'container',
					itemId : 'accNmbrContainer',
					layout : 'vbox',
					padding : '0 30 0 0',
					items : [{
						xtype : 'label',
						text : getLabel('accountNmbr', 'Account')
					}, {
						xtype : 'AutoCompleter',
						name : 'accNmbr',
						itemId : 'accNmbrFltId',
						cfgUrl : accountURL,
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						cfgSeekId : entityType == 0 ? 'accNoList' : 'clientAccNoList',
						cfgKeyNode : 'name',
						width : 390,
						padding : '-4 0 0 0',
						matchFieldWidth : true,
						emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
						cfgRootNode : entityType == 0 ? 'd.filter' : 'd.filter',
						cfgDataNode1 : 'name',
						cfgProxyMethodType : 'POST'
					}]
				}]	
		}];
		this.callParent(arguments);
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {
					//if(client.CODE === prefClientCode)	
					//	prefClientDesc = client.DESCR;
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	}
});