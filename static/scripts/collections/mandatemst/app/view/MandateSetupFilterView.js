Ext.define('GCP.view.MandateSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'mandateSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_extralargemargin-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;
				pmtSummaryView = this;
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
										}
									});
						});
				me.on('afterrender', function(panel) {
							var clientBtn = me.down('button[itemId="clientBtn"]');
							if (clientBtn) clientBtn.setText(strClientDescription);
							// Set Default Text When Page Loads
							clientBtn.setText(getLabel('allCompanies', 'All companies'));	
						});				
				
				var mandateTextfield = {
						xtype : 'container',
						columnWidth : 0.25,
						items : [{
							xtype : 'label',
							text : getLabel('mandateName', 'Mandate Name'),
							padding : '1 0 0 10',
							cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
						}, {
							xtype : 'AutoCompleter',
							padding : '1 0 0 10',
							cls : 'ux_normalmargin-top ux_largepadding-left',
							fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
							width : 200,
							name : 'mandateName',
							itemId : 'mandateNameFltId',
							cfgUrl : 'services/mandateseek/{0}.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'mandateNameSeek',
							cfgRootNode : 'filterList',
							cfgDataNode1 : 'name',
							cfgProxyMethodType : 'POST'
						}]
					};				
				
				filterContainerArr.push(mandateTextfield);

				this.items = [{
							xtype : 'container',
							width : '100%',
							layout : 'column',
							padding:'10 10 10 0',
							cls : 'ux_border-top',
							items : filterContainerArr
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
					if(strClientId === client.CODE)
						strClientDescription = client.DESCR;
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
			padding : '0 0 0 5',
			hidden : !isClientUser(),
			layout : {
				type : 'hbox'
			},
			items : [ {
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
			padding : '0 0 0 5',
			hidden : isClientUser(),
			layout : {
				type : 'hbox'
			},
			items : [ {
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
		}]		
});