Ext.define('GCP.view.CustomReportCenterChooseView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterChooseView',
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
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "POST",
								async : false,
								success : function(response) {
									if (response && response.responseText)
									{
										me.populateClientMenu(Ext
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
						clientBtn.setText(strClientDesc);
				});
		
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

		this.items = [{
			xtype : 'panel',
			layout : 'vbox',
			width : '100%',
			margin : '4 0 4 0',
			componentCls : 'gradiant_back roundify ui-corner-all',
			items : [{
						xtype : 'toolbar',
						itemId : 'newCustomReportTitle',
						layout : 'hbox',
						width : '100%',
						padding : '0 0 5 0',
						items : [{
									xtype : 'label',
									text : 'New Report',
									cls : 'font_bold ux_font-size16',
									padding : '0 0 0 5'

								},'->',clientSellerContainer
								]
					}
					]
		},
		{
			xtype : 'panel',
			width : '100%',
			layout : 'column',
			
			itemId : 'selectReportLabelPanel',
			items : [{
				xtype : 'container',
				cls : 'ux_hide-image',
				minHeight : 20,
				columnWidth : 0.42,
				itemId : 'selectReportPanelContainer',
				layout : {
					type : 'hbox',
					pack : 'end'
				},
				items : [{
					xtype : 'label',
					text : getLabel('selectReport',
							'Select Report(Select One)'),
					itemId : 'reportSelectLabel',
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
							text : 'Guide',
							cls : 'xn-account-filter-btnmenu ux_hide-image',
							width : 140,
							textAlign : 'right'
						}]
			}]
		},

		{
			xtype : 'panel',
			itemId : 'reportMethodPanel',
			layout : 'hbox',
			padding : '0 0 0 2',
			width : '100%',
			items : [{
						xtype : 'panel',
						itemId : 'reportModuleListPanel',
						cls : 'panel-seperator',
						width : '22%',
						layout : 'vbox',
						items : [{}]
					}, {
						xtype : 'panel',
						width : '78%',
						itemId : 'reportsSelectionPanel',
						overflowY : 'auto',
						items : [{
									xtype : 'panel',
									padding : '5 0 0 0',
									width: '100%',
									itemId : 'reportsListPanel',
									items : [{}]
								}, {
									xtype : 'label',
									itemId : 'noDataErrorLabel',
									text : getLabel('emptyDataMsg',
											'No Data Found'),
									flex : 1,
									cls : 'ux_font-size14-normal',
									padding : '10 0 0 0',
									hidden : true
								}]
					}]
		}];
		this.callParent(arguments);
	},


	populateClientMenu : function(data) {
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
