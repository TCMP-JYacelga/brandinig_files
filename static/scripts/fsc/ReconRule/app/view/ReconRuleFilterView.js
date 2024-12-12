Ext.define("GCP.view.ReconRuleFilterView", {
	extend:'Ext.panel.Panel',
	xtype : 'reconRuleFilterView',
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
										'DESCR' : 'All Companies'
									});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							companyStore.add(record);
						}
						if(count) {
							selectedFilterClient = companyStore.getAt(0).data.CODE;
							selectedFilterClientDesc = companyStore.getAt(0).data.DESCR;
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		me.items = [{
			xtype : 'container',
			itemId : 'companySlectorContainer',
			layout : 'vbox',
			hidden : (isClientUser() && companyStore.getCount() <= 1) ? true : false,
			width : '25%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel('lbl.reconciliation.companyname', 'Company Name')
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
				store : companyStore,
				listeners : {
					select : function(combo, record, eOpts) {
						changeClientAndRefreshGrid(combo.getValue(), combo.getDisplayValue());
					},
					boxready : function(combo) {
						var value = combo.getStore().getAt(0);
						combo.setValue(value);
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
				cfgProxyMethodType : 'POST'
				/*listeners : {
					select : function(combo, record) {
						selectedFilterClient = combo.getValue();
						selectedFilterClientDesc = combo.getDisplayValue();
						$(document).trigger("handleClientChangeInQuickFilter", false);
					}
				}*/
			}]
		},
		{
			xtype : 'container',
			width : '100%',
			layout : 'hbox',
			items : [
			{
				xtype : 'container',
				layout : 'vbox',
				padding : '0 30 0 0',
				items : [
				 {
					xtype : 'label',
					text : getLabel('scmProduct', 'SCF Package')	
				}, {
					xtype : 'AutoCompleter',
					width : 240,
					matchFieldWidth : true,
					name : 'productCombo',
					itemId : 'productComboAuto',
					cfgUrl : "services/userseek/reconRulesProductseek.json",
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'reconRulesProductseek',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %%'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text :getLabel('status', 'Status')	
				}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : 240,
									padding : '-4 0 0 0',
									itemId : 'statusFilter',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
										}
									}
								})]
			}
			
			]
		}/*,
		{
			xtype : 'container',
			width : '100%',
			layout : 'hbox',
			items : [
			{
				xtype : 'container',
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text :getLabel('status', 'Status')	
				}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : 240,
									padding : '-4 0 0 0',
									itemId : 'statusFilter',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
										}
									}
								})]
			}]
		}*/
		]
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
});