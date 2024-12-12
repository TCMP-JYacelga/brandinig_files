Ext.define('GCP.view.CounterPartyTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'counterPartyTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	padding : '0 0 12 0',
	cls : 'ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('counterpartyServiceSetup','Counterparty Service Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 15
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					cls : 'ux_hide-image',
					height : 14,
					margin : '2 2 0 0'
				}, /*{
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 0 0 2',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					width: 80,
					border : 0,
					text : getLabel('report', 'Report')
				}*/,   {
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf ux_hide-image',
					flex : 0					
				}  /*{
					xtype : 'button',
					border : 0,
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					margin : '0 0 0 0',
					width: 75,
					text : getLabel('export', 'Export'),
					menu : Ext.create('Ext.menu.Menu',{

					})
				}*/

		];
		this.callParent(arguments);
	}

});