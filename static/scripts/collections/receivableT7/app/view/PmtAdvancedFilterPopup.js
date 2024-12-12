Ext.define('GCP.view.PmtAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'pmtAdvancedFilterPopup',
	requires : ['GCP.view.PmtCreateNewAdvFilter',
			'GCP.view.PmtSummaryAdvFilterGridView',
			'GCP.view.PmtTxnCreateNewAdvFilter'],
	width : 750,
	minHeight : 450,
	tapPanelWidth:720,
	tapPanelHeight : 450,
	autoHeight:true,
	parent : null,
	modal : true,
	closeAction : 'hide',
	layout : 'hbox',
	cls:'ui-window-titlebarT7',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;
		this.title = getLabel('btnAdvancedFilter', 'Advanced Filter');
		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
			cls:'t7-tab',
			width : this.tapPanelWidth,
			minHeight : this.tapPanelHeight,			
			height : 'auto',
			itemId : 'advancedFilterTab',
			tabBar : {
				items : [{
							xtype : 'tbfill'
						}, {
							xtype : 'container',
							itemId : 'clientContainer',
							layout : {
								type : 'hbox',
								pack : 'end'
							},
							items : [{
								xtype : 'AutoCompleter',
								padding : '0 10 0 0',
								fieldCls : 'xn-suggestion-box',
								fieldLabel : getLabel("sellerAutoCompleter",
										"FI"),
								labelPad : 2,
								labelWidth : 20,
								labelSeparator : '',
								hidden: isClientUser(),
								itemId : 'sellerAutoCompleter',
								name : 'sellerAutoCompleter',
								cfgUrl : 'services/userseek/sellerSeek.json',
								cfgRecordCount : -1,
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgKeyNode : 'CODE',
								value : strSeller,
								listeners : {
									'select' : function(combo, record) {
										strSeller = combo.getValue();
										me.fireEvent('sellerComboSelect',
												combo, record);
									}
								}
							}, {
								xtype : 'textfield',
								fieldLabel : getLabel("batchColumnClient",
										"Client"),
								labelPad : 2,
								labelWidth : 50,
								labelSeparator : '',
								itemId : 'Client',
								fieldCls : 'ux_no-border-right',
								width : 165,
								height : 23,
								name : 'Client',
								value : getLabel('all', 'All')
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'clientBtn',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								glyph:'xf0d7@fontawesome',
								padding : '6 0 0 0',
								menuAlign : 'tr-br',
								clientCodesData:'',								
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'clientMenu',
											width : 220,
											maxHeight : 200,
											items : []
										}),
								handler : function(btn, event) {
									btn.menu.show();
								}
							}]
						}]
			},
			items : [{
						title : getLabel('filters', 'Filters'),
						itemId : 'FilterSetTab',
						items : [{
									xtype : 'pmtSummaryAdvFilterGridView',
									callerParent : me.parent
								}]
					}, {
						title : getLabel('createNewFilter', 'Create New Filter'),
						itemId : 'filterDetailsTab',
						processFromDate : me.processFromDate,
						processToDate : me.processToDate,
						items : [me.filterPanel]
					}]
		});

		me.items = [Advancedfiltertab];
		me.on('resize', function() {
					me.doLayout();
					Advancedfiltertab.doLayout();
				});
		me.callParent(arguments);
	}
});