Ext.define('GCP.view.SecurityProfileFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'securityProfileFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom ux_extralargemargin-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		securitySummaryView = this;
		var receiverPartyNameSeek = null;
		var receiverAccountSeekUrl = null;
		var filterContainerArr = new Array();
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "POST",
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
				});
		me.on('afterrender', function(panel) {
					var clientBtn = me.down('button[itemId="clientBtn"]');
					// Set Default Text When Page Loads
					clientBtn.setText(getLabel('allCompanies', 'All companies'));	
				});
		var securityProfileNamesList = null;
		var securityProfileNamesSeekId = null;
		if (userType == '0') {
			securityProfileNamesSeekId = 'adminSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/adminSecurityProfileNamesList.json';
		} else {
			securityProfileNamesSeekId = 'clientSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/clientSecurityProfileNamesList.json';
		}

		var secPrfNameContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.50,
			items : [{
				xtype : 'label',
				text : getLabel('securityProfile', 'Security Profile'),
				cls : 'ux_font-size14  ux_normalpadding-bottom '
			}, {
				xtype : 'AutoCompleter',
				cls : 'ux_normalmargin-top ',
				fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
				name : 'profileName',
				itemId : 'profileNameFltId',
				cfgUrl : securityProfileNamesList,
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : securityProfileNamesSeekId,
				cfgKeyNode : 'name',
				cfgRootNode : 'filterList',
				cfgDataNode1 : 'name',
				cfgProxyMethodType : 'POST'
			}]
		});

		var searchBtnConatiner = Ext.create('Ext.container.Container', {
					xtype : 'container',
					columnWidth : 0.25,
					padding : '20 0 0 0',
					items : [{
								xtype : 'button',
								itemId : 'btnFilter',
								cls : 'xn-btn ux-button-s',
								text : 'Search'
							}]
				});
		filterContainerArr.push(secPrfNameContainer);
		filterContainerArr.push(searchBtnConatiner);

		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr,
					cls : 'ux_border-top ux_largepadding'
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
								btn.btnDesc, '');
					}
				});

		Ext.each(clientArray, function(client) {
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc, '');
								}
							});
				});		
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	tools : [{
		xtype : 'container',
		itemId : 'filterClientMenuContainer',
		cls : 'paymentqueuespacer',
		padding : '0 0 0 18',
		hidden : !isClientUser(),
		layout : {
			type : 'hbox'
		},
		items : [{
			xtype : 'label',
			cls: 'ux_normalpadding-top',
			html : '<img id="imgFilterInfo" class="icon-company"/>'
		}, {
			xtype : 'button',
			border : 0,
			itemId : 'clientBtn',
			text : getLabel('allCompanies', 'All Companies'),
			cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
			menuAlign : 'b',
			menu : {
				xtype : 'menu',
				maxHeight : 180,
				width : 50,
				cls : 'ext-dropdown-menu xn-menu-noicon',
				itemId : 'clientMenu',
				items : []
			}
		}]
	}, {
		xtype : 'container',
		itemId : 'filterClientAutoCmplterCnt',
		cls : 'paymentqueuespacer',
		padding : '0 0 0 18',
		hidden : isClientUser(),
		layout : {
			type : 'hbox'
		},
		items : [{
			xtype : 'label',
			cls: 'ux_normalpadding-top',
			html : '<img id="imgFilterInfo" class="icon-company"/>'
		}, {
			xtype : 'AutoCompleter',
			margin : '0 0 0 5',
			fieldCls : 'xn-form-text w12 xn-suggestion-box',
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
					strClientDesc = combo.getRawValue();
					strSellerId = record[0].data.SELLER_CODE;
					securitySummaryView.fireEvent('handleClientChange', strClientId,
							strClientDesc, strSellerId);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					if (Ext.isEmpty(newValue)) {
						securitySummaryView.fireEvent('handleClientChange', null,
							'', '');
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
	}]
});