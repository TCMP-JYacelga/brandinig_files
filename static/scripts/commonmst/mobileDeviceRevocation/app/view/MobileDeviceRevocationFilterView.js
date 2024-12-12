Ext.define("GCP.view.MobileDeviceRevocationFilterView", {
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'mobileDeviceRevocationFilterView',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		var strUrl = null;
		var companyStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		if(isClientUser()) {
			Ext.Ajax.request({
				url : 'services/userseek/mobileUserClientSeek.json',
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if(companyStore) {
						companyStore.removeAll();
						var count = data.length;
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
			/*width : '25%',*/
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel('lblcompany', 'Company')
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
				width : 250,
				matchFieldWidth : true,
				hidden : isClientUser(),
				itemId : 'clientComboAuto',
				cfgUrl : "services/userseek/mobileUserClientSeek.json",
				padding : '-4 0 0 0',
				cfgRecordCount : -1,
				cfgSeekId : 'userclients',
				cfgQueryParamName : '$autofilter',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText : getLabel('searchByCompany', 'Search By Company'),
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
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'companySlectorContainer',
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text : getLabel('userName', 'User Name')	
				}, {
					xtype : 'AutoCompleter',
					name : 'userNameAutocompleter',
					itemId : 'userNameAutocompleter',
					cfgUrl : 'services/userseek/mobileRevokeUserSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'DESCR',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
					emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			},
			{
				xtype : 'container',
				itemId : 'filterParentContainer',
				width : '100%',
				layout : 'vbox',
				items : [{
					xtype : 'container',
					itemId : 'deviceSelectorContainer',
					layout : 'vbox',
					items : [{
						xtype : 'label',
						text : getLabel('mobileDeviceName', 'Mobile Device Name')	
					}]
				}, {
					xtype : 'AutoCompleter',
					name : 'deviceNameAutocompleter',
					itemId : 'deviceNameAutocompleter',
					cfgUrl : 'services/userseek/mobileRevokeDeviceSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'CODE',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
					emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			}]
		}]
		this.callParent(arguments);
	}
});