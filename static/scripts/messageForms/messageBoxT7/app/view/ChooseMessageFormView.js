Ext.define('GCP.view.ChooseMessageFormView', {
	extend : 'Ext.panel.Panel',
	xtype : 'chooseMessageFormView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	cls : 'xn-panel ux_background-color-white',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var clientSellerContainer = null;
		var clientDropDownStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR','SELLER_CODE'],
					proxy : {
						type : 'ajax',
						url : 'services/userseek/userclients.json',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					},
					autoLoad : true
				});

		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "POST",
								async : false,
								success : function(response) {
									if (response && response.responseText && entity_type == 1)
									{
										me.populateCurrencyMenu(Ext
												.decode(response.responseText));
									}
								},
								failure : function(response) {
								}
							});
				});
		me.on('afterrender', function(panel) {
					var clientBtn = me.down('button[itemId="clientBtn"]');
					if (clientBtn)
						clientBtn.setText(clientDesc);
				});
		
		var clientDropDown = Ext.create('Ext.form.field.ComboBox', {
					itemId : 'clientCombo',
					//itemId : 'clientDesc',
					width : 165,
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					displayField : 'DESCR',
					valueField : 'CODE',
					emptyText : getLabel("Select Client", "Select Client"),
					store : clientDropDownStore,
					value : sessionClientCode,
					listeners : {
						'select' : function(combo, record) {
							sessionClientCode = combo.getValue();							
							combo.fireEvent('populateMessageGroups', combo, record);
						}
					}
				});
		clientDropDown.store.on('load', function(store, records) {
					if (Ext.isEmpty(sessionClientCode)) {
						var objFirstRecord = records[0].data;
						sessionClientCode = objFirstRecord.CODE;
						clientDropDown.setValue(objFirstRecord.CODE);
						
					}
				});
		if (entity_type == 0) {
			clientSellerContainer = Ext.create('Ext.container.Container', {
						xtype : 'container',
						itemId : 'clientSeller',
						layout : 'hbox',
						docked : 'right',
						items : [{
									xtype : 'AutoCompleter',
									hidden : true,
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									itemId : 'sellerCode',
									//hidden : false,
									name : 'sellerCode',
									cfgUrl : 'services/userseek/sellerSeek.json',
									cfgRecordCount : -1,
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									//cfgDataNode2 : 'CODE',
									cfgQueryParamName : '$autofilter',
									cfgKeyNode : 'CODE',
									queryDelay : 1700,
									matchFieldWidth : true,
									listeners : {
										'select' : function(combo, record) {
											$('#selectedSeller').val(combo.getValue());
										}
									}

								}, 
								{
									xtype : 'AutoCompleter',
									margin : '0 0 0 10',
									fieldCls : 'xn-form-text w12 xn-suggestion-box',
									itemId : 'clientDesc',
									hidden : false,
									//matchFieldWidth : true,
									name : 'clientDesc',
									cfgUrl : 'services/userseek/userclients.json',
									cfgRecordCount : -1,
									cfgRootNode : 'd.preferences',
									cfgQueryParamName : '$autofilter',
									cfgDataNode1 : 'DESCR',
									// cfgDataNode2 : 'DESCR',
									cfgKeyNode : 'CODE',
									value : clientDesc,
									listeners : {
										'select' : function(combo, record) {
										var seller = record[0].raw.SELLER_CODE;
										 $('#selectedClient').val(combo.getValue());
										 combo.fireEvent("populateMessageGroups",combo,seller);
										},
										'render' : function(combo) {
											combo.listConfig.width = 200;
										}
									}
								}]
					});
		} else if (entity_type == 1) {
			clientSellerContainer = Ext.create('Ext.container.Container', {
						xtype : 'container',
						layout : 'hbox',
						itemId:'clientMenuContainer',
						width:'900',
						padding : '0 0 5 0',
						hidden : (!Ext.isEmpty(client_count) && (client_count === '1'))
									? true
									: false,
						items : [{
							xtype : 'label',
							html : '<img id="imgFilterInfo" class="icon-company"/>'
						}, {
							xtype : 'button',
							border : 0,
							itemId : 'clientBtn',
							text : getLabel('allCompanies', 'All Companies'),
							cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
							menu : Ext.create('Ext.menu.Menu', {
										maxHeight : 180,
										width : 50,
										cls : 'ext-dropdown-menu xn-menu-noicon',
										itemId : 'clientMenu',
										items : []
									})
						}]
					});
		}

		this.items = [{
			xtype : 'panel',
			layout : 'vbox',
			width : '100%',
			margin : '4 0 4 0',
			componentCls : 'gradiant_back roundify ui-corner-all',
			items : [{
						xtype : 'toolbar',
						itemId : 'newPaymentTitle',
						layout : 'hbox',
						width : '100%',
						padding : '0 0 5 0',
						items : [{
									xtype : 'label',
									text : getLabel('newMsg','New Message'),
									cls : 'font_bold ux_font-size16',
									padding : '0 0 0 5'

								},'->',clientSellerContainer
								]
					},
					{
						xtype : 'toolbar',
						width : '100%',
						layout : 'hbox',						
						cls : 'ux_toolbar ', 
						padding : '0 5 0 0',
						minHeight: 35,
						itemId : 'newMessageOptions',
						items : [{
							xtype : 'panel',
							itemId : 'messageOptionPanel',
							layout : 'hbox',
							width : 900,
							padding : '0 0 0 5',
							items : [{
								xtype : 'label',
								text : getLabel('newMsgForm','Create a New Message by selecting a Message Form (Select One)' ),
								cls : 'frmLabel ux_font-size14-normal'
							}

							]
						}]
						}
					]
		},
		{
			xtype : 'panel',
			width : '100%',
			layout : 'column',
			
			itemId : 'selectMessageLabelPanel',
			items : [{
				xtype : 'container',
				cls : 'ux_hide-image',
				minHeight : 20,
				columnWidth : 0.42,
				itemId : 'selectMessageFormPanelContainer',
				layout : {
					type : 'hbox',
					pack : 'end'
				},
				items : [{
					xtype : 'label',
					text : getLabel('selectMessageForm',
							'Select  Message Form (Select One)'),
					itemId : 'messageSelectLabel',
					cls : 'ux_font-size14-normal'
				}]
			}, {
				xtype : 'container',
				margin : '0 30 0 0',
				minHeight : 20,
				columnWidth : 0.40,
				layout : {
					type : 'hbox',
					pack : 'end'
				},
				items : [{
							xtype : 'button',
							itemId : 'btnSavePreferences',
							icon : 'static/images/icons/information.png',
							text : getLabel('msgFormGuide','MessageForm Guide'),
							cls : 'xn-account-filter-btnmenu ux_hide-image',
							width : 140,
							textAlign : 'right'
						}]
			}]
		},

		{
			xtype : 'panel',
			itemId : 'messageFormMethodPanel',
			layout : 'hbox',
			padding : '0 0 0 2',
			width : '100%',
			items : [{
						xtype : 'panel',
						itemId : 'messageFormGroupListPanel',
						cls : 'panel-seperator',
						width : '22%',
						layout : 'vbox',
						items : [{}]
					}, {
						xtype : 'panel',
						width : '78%',
						itemId : 'messageFormSelectionPanel',
						overflowY : 'auto',
						items : [{
									xtype : 'panel',
									padding : '5 0 0 0',
									width: '100%',
									itemId : 'messageFormListPanel',
									items : [{}]
								}, {
									xtype : 'label',
									itemId : 'noDataErrorLabel',
									text : getLabel('emptyDataMsg',
											'No Message Form created for the selected Form Group'),
									flex : 1,
									cls : 'ux_font-size14-normal',
									padding : '10 0 0 0',
									hidden : true
								}]
					}]
		}];
		this.callParent(arguments);
	},


	populateCurrencyMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var clientMenuContainer = me
				.down('container[itemId="clientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		Ext.each(clientArray, function(client) {
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								itemId : client.CODE,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.clientDesc = btn.btnDesc;
									$('#selectedClientDesc').val(me.clientDesc);
									$('#selectedClient').val(me.clientCode);
									me.fireEvent('clientMenuSelect', btn.code);

								}
							});

				});

		if (null != clientArray && clientArray.length <= 1) {
			clientMenuContainer.hide();
		}

	}
});
