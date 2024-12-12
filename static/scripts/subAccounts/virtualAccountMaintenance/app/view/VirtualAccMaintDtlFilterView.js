Ext.define('GCP.view.VirtualAccMaintDtlFilterView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.AutoCompleter' ],
	xtype : 'virtualAccMaintenanceDtlFilterView',
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		me.items = [ {
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [ {

				xtype : 'container',
				itemId : 'payerCodeContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [ {
					xtype : 'label',
					text : getLabel('partyCode', 'Party Code')
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					name : 'payerCodeAuto',
					itemId : 'payerCodeAuto',
					cfgUrl : 'services/userseek/partyCodeFilterSeek.json?$filtercode1=' + $('#clientId').val(),
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'partyCodeFilterSeek',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					emptyText : getLabel('searchByPartyCode', 'Search By Party Code'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [{
						key : '$filtercode1',
						value : dtlClientId
							},
					{
						key : '$filtercode2',
						value : dtlClientCreditAccountNo
					},
					{
						key : '$filtercode3',
						value :dtlssuanceNumber
					}]		

				} ]
			}, {

				xtype : 'container',
				itemId : 'virtualAccountNoContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [ {
					xtype : 'label',
					text : getLabel('virtualAccNo', 'Virtual Account Number')
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					name : 'virtualAccountAuto',
					itemId : 'virtualAccountAuto',
					cfgUrl : 'services/userseek/virtualAccountsDetail.json',
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'virtualAccountsDetail',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					emptyText : getLabel('virtualAccountSearch', 'Search By Virtual Account Number'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [ {
						key : '$filtercode1',
						value : dtlClientId
					}, {
						key : '$filtercode2',
						value : dtlClientCreditAccountNo
					}, {
						key : '$filtercode3',
						value : dtlssuanceNumber
					} ]

				} ]
			}, {
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

			} ]
		} ];

		this.callParent(arguments);
	},
	getStatusStore : function() {
		var objBillerStatusStore = null;
		if (!Ext.isEmpty(arrDtlStatus)) {
			objBillerStatusStore = Ext.create('Ext.data.Store', {
				fields : [ 'code', 'desc' ],
				data : arrDtlStatus,
				autoLoad : true,
				listeners : {
					load : function() {
					}
				}
			});
			objBillerStatusStore.load();
		}
		return objBillerStatusStore;
	},
	getBillerStore : function() {
		var accountData = null;
		Ext.Ajax.request({
			url : "services/userseek/billerList.json?$filtercode1=" + strClient,
			async : false,
			method : 'GET',
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.preferences;
						objBillerStore = Ext.create('Ext.data.Store', {
							fields : [ 'SYS_BENE_CODE', 'SYS_BENE_DESC' ],
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
						objBillerStore.load();
					}
				}
			},
			failure : function(response) {
			}
		});
		return objBillerStore;
	},

	getAccountStore : function() {
		var accountData = null;
		Ext.Ajax.request({
			url : "services/userseek/acctList.json?$filtercode1=" + strClient,
			async : false,
			method : 'GET',
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.preferences;
						objAcctStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'CODE' ],
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
						objAcctStore.load();
					}
				}
			},
			failure : function(response) {
			}
		});
		return objAcctStore;
	}
});
