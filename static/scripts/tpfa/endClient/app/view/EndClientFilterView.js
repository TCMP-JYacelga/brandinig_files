Ext.define("GCPA.view.EndClientFilterView", {
	extend:'Ext.panel.Panel',
	xtype : 'endClientFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter','Ext.ux.gcp.CheckCombo'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var strUrl = null;
	
		me.items = [{
			xtype : 'container',
			//itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				//itemId : 'companySlectorContainer',
				hidden : isClientUser(),
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text : getLabel('Agent', 'Agent')	
				}, {
					xtype : 'AutoCompleter',
					name : 'agentAutocompleter',
					itemId : 'agentAutocompleter',
					cfgUrl : 'services/userseek/agentCodeSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'CODE',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
					emptyText : 'Search By ' + getLabel('Agent', 'Agent'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DISPLAYFIELD',
					cfgProxyMethodType : 'POST'
				}]
			}]
			},
			{
			xtype : 'container',
			//itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			flex : 1,
			items : [{
			
				xtype : 'container',
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text : getLabel('endClient', 'End Client')
				}, {
					xtype : 'AutoCompleter',
					name : 'endClientAutocompleter',
					itemId : 'endClientAutocompleter',
					cfgUrl : 'services/userseek/endClientSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'DESCR',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
	        emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			},
			{
				xtype : 'container',
				layout : 'vbox',
				items : [
				 {
					xtype : 'label',
					text : getLabel('subActNo', 'Sub-Account Number')
				}, {
					xtype : 'AutoCompleter',
					name : 'actNumAutocompleter',
					itemId : 'actNumAutocompleter',
					cfgUrl : 'services/userseek/subActSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'CODE',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
					emptyText :  getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			},
			{
				xtype : 'container',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text :getLabel('status', 'Status')	
					},
					Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : 250,
									padding : '-4 30 0 0',
									itemId : 'statusFilter',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
										}
									}
								})]
				}]
		}
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