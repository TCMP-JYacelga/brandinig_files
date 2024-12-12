Ext.define('GCP.view.SecurityProfileFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'securityProfileFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		securitySummaryView = this;
		var receiverPartyNameSeek = null;
		var receiverAccountSeekUrl = null;
		var filterContainerArr = new Array();
		/* me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "GET",
								async : false,
								success : function(response) {
									if (response && response.responseText)
										me.populateClientMenu(Ext
												.decode(response.responseText));
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				}); */
		/* me.on('afterrender', function(panel) {
					var clientBtn = me.down('combo[itemId="clientBtn"]');
					// Set Default Text When Page Loads
					clientBtn.setRawValue(getLabel('allCompanies',
							'All companies'));
				}); */
		var securityProfileNamesList = null;
		var securityProfileNamesSeekId = null;
		
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
								'DESCR' : 'All Companies'
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
		
		
		if (userType == '0') {
			securityProfileNamesSeekId = 'adminOnBehalfSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/adminOnBehalfSecurityProfileNamesList.json';
		} else {
			securityProfileNamesSeekId = 'clientSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/clientSecurityProfileNamesList.json';
		}
		
		me.items = [{
			xtype : 'container',
			itemId : 'clientSlectorContainer',
			layout : 'vbox',
			hidden : (isClientUser() && corporationStore.getCount() <= 1) ? true : false,
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
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				store : corporationStore,
				listeners : {
					select : function(combo, record, eOpts) {
						changeClientAndRefreshGrid(combo.getValue(), combo.getDisplayValue());
					},
					boxready : function(combo, width, height, eOpts) {
						combo.setValue("All Companies");
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
				emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
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
		}, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
					xtype : 'container',
					//flex : 1,
					layout : 'vbox',
					padding: '0 30 0 0',
					items : [{
								xtype : 'label',
								text : getLabel('securityProfile', 'Security Profile')
							}, {
								xtype : 'AutoCompleter',
								name : 'profileName',
								width : 250,
								itemId : 'profileNameFltId',
								enableQueryParam:false,
								matchFieldWidth: true,
								padding : '-4 0 0 0',
								cfgUrl : securityProfileNamesList,
								cfgQueryParamName : 'qfilter',
								cfgRecordCount : -1,
								cfgSeekId : securityProfileNamesSeekId,
								emptyText: getLabel('autoCompleterEmptyText','Enter Keyword or %'),
								cfgKeyNode : 'name',
								cfgRootNode : 'filterList',
								cfgDataNode1 : 'name',
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
											itemId : 'securityStatusFilter',
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
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = [];
		var clientBtn = me.down('combo[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
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
											btn.CODE, btn.btnDesc, '');
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		} else {
			clientBtn.getStore().loadData(clientMenu);
		}

	}
});