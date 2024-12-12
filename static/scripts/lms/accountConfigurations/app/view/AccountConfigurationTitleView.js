Ext.define('GCP.view.AccountConfigurationTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	//baseCls : 'page-heading-bottom-border',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('accountConfiguration', 'Account Configuration'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}/*, {
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					height : 14,
					margin : '2 0 0 0'
				}*/, {
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 10 0 0',
					glyph : 'xf1c1@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu  ux_font-size14 ux_export-btn',
					border : 0,
					text : getLabel('report', 'Report')
				},/* {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					padding : '0 3 0 0'
				},{
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf',
					flex : 0,
					padding : '20 16 0 0'
				}*/, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					glyph : 'xf019@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu  ux_font-size14 ux_export-btn',
					menu : Ext.create('Ext.menu.Menu', {

					})
				}

		];
		this.callParent(arguments);
	}

});