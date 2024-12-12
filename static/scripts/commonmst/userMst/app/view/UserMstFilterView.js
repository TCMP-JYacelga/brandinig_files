Ext.define('GCP.view.UserMstFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userMstFilterView',
	requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	handleRefresh : true,
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;		
		userSummaryView = this;
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/customerUserCorpSeek.json',
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
				});
		me.on('afterrender', function(panel) {
					var clientBtn = me.down('button[itemId="clientBtn"]');
					if (clientBtn) clientBtn.setText(sessionCorporationDesc);
					// Set Default Text When Page Loads
					clientBtn.setText(getLabel('allCompanies', 'All companies'));	
				});	
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
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
		this.items = [{
			xtype : 'container',
			itemId : 'userNameFilterBar',
			width : '100%',
			layout : 'column',
			items : [{
				xtype : 'container',
				columnWidth : 0.25,
				padding : '10px',
				items : [{
					xtype : 'label',
					text : getLabel('userName', 'User Name'),
					cls : 'ux_font-size14  ux_normalpadding-bottom'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'userDescription',
					itemId : 'userNameFltId',
					cfgUrl : 'services/userMstSeek/userNamesList.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userNamesList',
					cfgKeyNode : 'value',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'value',
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [{
								key : '$filterseller',
								value : sessionSellerCode
							}]
				}]
			}, {
				xtype : 'container',
				columnWidth : 0.25,
				padding : '10px',
				items : [{
					xtype : 'label',
					text : getLabel('category', 'Role'),
					cls : 'ux_normalpadding-bottom ux_font-size14 ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left ux_largemargin-left',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'userCategory',
					itemId : 'userCategoryFltId',
					cfgUrl : 'services/userMstSeek/userCategoryList.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userCategoryList',
					cfgKeyNode : 'name',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'name',
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [{
								key : '$filterseller',
								value : sessionSellerCode
							}]
				}]
			}, {
				xtype : 'container',
				columnWidth : 0.25,
				padding : '10px',
				items : [{
					xtype : 'label',
					text : getLabel('status', 'Status'),
					cls : 'ux_normalpadding-bottom ux_font-size14 ux_largepadding-left'
				}, {
					xtype : 'combo',
					cls : 'ux_normalmargin-top ux_largepadding-left ux_largemargin-left',
					displayField : 'value',
					width : 200,
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'requestState',
					itemId : 'userMstStatusFltId',
					valueField : 'name',
					name : 'requestState',
					editable : false,
					value : 'All',
					store : objStore
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
		padding : '0 175 0 35',
		hidden : !isClientUser(),
		layout : {
			type : 'hbox'
		},
		items : [{
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
		padding : '0 175 0 35',
		hidden : isClientUser(),
		layout : {
			type : 'hbox'
		},
		items : [{
			xtype : 'AutoCompleter',
			margin : '0 0 0 5',
			fieldCls : 'xn-form-text w12 xn-suggestion-box',
			itemId : 'clientAutoCompleter',
			name : 'clientAutoCompleter',
			cfgUrl : 'services/userseek/adminUserCorpSeek.json',
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
					userSummaryView.fireEvent('handleClientChange', strClientId,
							strClientDesc, strSellerId);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					if (Ext.isEmpty(newValue)) {
						userSummaryView.fireEvent('handleClientChange', '',
							'', '');
					}
				},
				'render' : function(combo) {
					combo.store.loadRawData({
								"d" : {
									"preferences" : [{
												"CODE" : sessionCorporation,
												"DESCR" : sessionCorporationDesc
											}]
								}
							});
					combo.listConfig.width = 200;
					combo.suspendEvents();
					combo.setValue(sessionCorporation);
					combo.resumeEvents();
				}
			}
		}]
	}]
});