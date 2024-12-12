Ext.define('GCP.view.VirtualAccMaintFilterView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	xtype : 'virtualAccMaintenanceFilterView',
	layout : 'vbox',
	initComponent : function() {
		var me = this;

		var clientStore = Ext.create('Ext.data.Store', {
			fields : [ 'CODE', 'DESCR' ]
		});
		Ext.Ajax.request({
			url : 'services/userseek/userclientsVA.json',
			method : 'GET',
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
							'DESCR' : 'All Companies'
						});
					}
					for (var index = 0; index < count; index++) {
						var record = {
							'CODE' : data[index].CODE,
							'DESCR' : data[index].DESCR
						};
						clientStore.add(record);
					}
					clientCount = count;
				}
			},
			failure : function() {
			}
		});
		me.items = [ {
			xtype : 'container',
			layout : 'vbox',
			// If count is one
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,
			// or admin then
			// hide
			width : '25%',
			padding : '0 30 0 0',
			items : [ {
				xtype : 'label',
				itemId : 'lblcompanyname',
				text : getLabel('lblcompanyname', 'Company Name')
			}, {
				xtype : 'combo',
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				editable : false,
				triggerAction : 'all',
				width : '100%',
				padding : '-4 0 0 0',
				itemId : 'clientCombo',
				mode : 'local',
				emptyText : getLabel('allCompaniess', 'All Companies'),
				store : clientStore
			} ]
		}, {
			xtype : 'container',
			layout : 'vbox',
			// If not admin then hide
			hidden : (isClientUser()) ? true : false,
			width : '25%',
			padding : '0 30 0 0',
			items : [ {
				xtype : 'label',
				itemId : 'lblcompanyname',
				text : getLabel('lblcompanyname', 'Company Name')
			}, {
				xtype : 'AutoCompleter',
				width : '100%',
				matchFieldWidth : true,
				name : 'clientCombo',
				itemId : 'clientAuto',
				cfgUrl : 'services/userseek/userclientsVA.json',
				padding : '-4 0 0 0',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'userclientsVA',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
				enableQueryParam : false,
				cfgProxyMethodType : 'POST'
			} ]

		}, {
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [
				 {
						xtype : 'container',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [ {
							xtype : 'label',
							itemId : 'lblVACategory',
							text : getLabel('lblVACategory', 'Virtual Account Category')
						}, {
							xtype : 'combo',
							displayField : 'DESCR',
							valueField : 'CODE',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							padding : '-4 0 0 0',
							itemId : 'vaCategoryAuto',
							mode : 'local',
							emptyText : getLabel('', 'Select Virtual Account Category'),
							store : me.getVACategoryStore()

						} ]

			},{				
				xtype : 'container',
				layout : 'vbox',
				width : '36%',
				padding : '0 30 0 0',
				items : [ {
					xtype : 'label',
					itemId : 'lblClientAccountNo',
					text : getLabel('lblClientAccountNo', 'Client Credit A/c number')
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					name : 'clientAccountCombo',
					itemId : 'clientAccountAuto',
					cfgUrl : 'services/userseek/clientCreditAccNo.json',
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'clientCreditAccNo',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					emptyText : getLabel('searchByClientAccount', 'Enter Keyword or %'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				} ]

			},{
				xtype : 'container',
				layout : 'vbox',
				width : '36%',
				padding : '0 30 0 0',
				items : [ {
					xtype : 'label',
					itemId : 'lblVirtualAccountNo',
					text : getLabel('lblVirtualAccountNo', 'Virtual Account Number')
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					name : 'virtualAccountNoCombo',
					itemId : 'virtualAccountNoAuto',
					cfgUrl : 'services/userseek/virtualAccountNo.json',
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'virtualAccountNo',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					emptyText : getLabel('searchByVirtualAccountNo', 'Enter Keyword or %'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				} ]

			} ]
		}, {
			xtype : 'container',
			itemId : 'parentContainer1',
			width : '100%',
			layout : 'hbox',
			items : [ 
				{
					xtype : 'container',
					layout : 'vbox',
					width : '25%',
					items : [ {
						xtype : 'label',
						text : getLabel('status', 'Status')
					}, Ext.create('Ext.ux.gcp.CheckCombo', {
						valueField : 'code',
						displayField : 'desc',
						editable : false,
						addAllSelector : true,
						emptyText : 'All',
						multiSelect : true,
						width : '100%',
						padding : '-4 30 0 0',
						itemId : 'statusCombo',
						isQuickStatusFieldChange : false,
						store : me.getStatusStore(),
						listeners : {
							'focus' : function() {
							}
						}
					}) ]

				},{
					xtype : 'container',
					layout : 'vbox',
					width : '36%',
					padding : '0 30 0 0',
					items : [ {
						xtype : 'label',
						itemId : 'lblIssuanceNoFrom',
						text : getLabel('lblIssuanceNoFrom', 'Issuance Number From')
					}, {
						xtype : 'AutoCompleter',
						width : '100%',
						matchFieldWidth : true,
						name : 'issuanceNoFromCombo',
						itemId : 'issuanceNoFromAuto',
						cfgUrl : 'services/userseek/issuanceNoFrom.json',
						padding : '-4 0 0 0',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'issuanceNoFrom',
						cfgKeyNode : 'CODE',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						emptyText : getLabel('searchByIssuanceNoFrom', 'Enter Keyword or %'),
						enableQueryParam : false,
						cfgProxyMethodType : 'POST'
					} ]

			   },{
					xtype : 'container',
					layout : 'vbox',
					width : '36%',
					padding : '0 30 0 0',
					items : [ {
						xtype : 'label',
						itemId : 'lblIssuanceNoTo',
						text : getLabel('lblIssuanceNoTo', 'Issuance Number To')
					}, {
						xtype : 'AutoCompleter',
						width : '100%',
						matchFieldWidth : true,
						name : 'issuanceNoToCombo',
						itemId : 'issuanceNoToAuto',
						cfgUrl : 'services/userseek/issuanceNoTo.json',
						padding : '-4 0 0 0',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'issuanceNoTo',
						cfgKeyNode : 'CODE',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						emptyText : getLabel('searchByIssuanceNoTo', 'Enter Keyword or %'),
						enableQueryParam : false,
						cfgProxyMethodType : 'POST'
					} ]

			} ]
		} ];

		this.callParent(arguments);
	},
	getStatusStore : function() {
		var objVAStatusStore = null;
		if (!Ext.isEmpty(arrStatus)) {
			objVAStatusStore = Ext.create('Ext.data.Store', {
				fields : [ 'code', 'desc' ],
				data : arrStatus,
				autoLoad : true,
				listeners : {
					load : function() {
					}
				}
			});
			objVAStatusStore.load();
		}
		return objVAStatusStore;
	},
	getVACategoryStore : function() {

		var objVACategoryStore = null;
		var accountData = null;
		Ext.Ajax.request({
			url : "services/userseek/vaCategory.json?$filtercode1=" + strClient,
			async : false,
			method : 'GET',
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.preferences;
						objVACategoryStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'DESCR' ],
							data : accountData,
							reader : {
								type : 'json',
								root : 'd.preferences'
							},
							autoLoad : true,
							listeners : {
								load : function() {
								}
							}
						});
						objVACategoryStore.load();
					}
				}
			},
			failure : function(response) {
			}
		});
		return objVACategoryStore;
	}
});
